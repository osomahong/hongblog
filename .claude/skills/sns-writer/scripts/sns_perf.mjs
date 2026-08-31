#!/usr/bin/env node
/**
 * SNS 게시물 성과 회수. GA4에서 utm 유입을 읽어 게시 이력에 붙인다.
 *
 * "어떤 스타일이 통했는지"를 찾으려면 게시 기록만으로는 부족하고 결과가 있어야 한다.
 * 이 스크립트가 그 결과를 가져와 data/sns-log.json 에 병합한다.
 *
 * 사용법:
 *   node sns_perf.mjs --days 30                 # 최근 30일 채널별 요약
 *   node sns_perf.mjs --days 30 --by-campaign   # 게시물(캠페인)별 성과
 *   node sns_perf.mjs --days 30 --merge         # 위 결과를 sns-log.json 에 병합
 *
 * 필요 환경변수: GA4_PROPERTY_ID, GA4_SERVICE_ACCOUNT_KEY (.env.local)
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import crypto from "node:crypto";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "../../../..");
const DATA_DIR = join(HERE, "../data");
const LOG_PATH = join(DATA_DIR, "sns-log.json");

function env(name) {
  if (process.env[name]) return process.env[name];
  for (const f of [".env.local", ".env"]) {
    try {
      const m = readFileSync(join(ROOT, f), "utf8").match(new RegExp(`^${name}\\s*=\\s*(.+)$`, "m"));
      if (m) return m[1].trim().replace(/^["']|["']$/g, "");
    } catch {
      /* 다음 후보 */
    }
  }
  console.error(`${name}가 없습니다.`);
  process.exit(2);
}

const b64 = (i) =>
  Buffer.from(i).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");

async function token() {
  const key = JSON.parse(Buffer.from(env("GA4_SERVICE_ACCOUNT_KEY"), "base64").toString("utf8"));
  const now = Math.floor(Date.now() / 1000);
  const head = b64(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const body = b64(
    JSON.stringify({
      iss: key.client_email,
      scope: "https://www.googleapis.com/auth/analytics.readonly",
      aud: "https://oauth2.googleapis.com/token",
      exp: now + 3600,
      iat: now,
    }),
  );
  const signer = crypto.createSign("RSA-SHA256");
  signer.update(`${head}.${body}`);
  const jwt = `${head}.${body}.${b64(signer.sign(key.private_key))}`;
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });
  const j = await res.json();
  if (!j.access_token) {
    console.error(`토큰 발급 실패: ${JSON.stringify(j).slice(0, 200)}`);
    process.exit(1);
  }
  return j.access_token;
}

// GA4의 sessionSource는 utm을 붙였는지, 리퍼러로 들어왔는지에 따라 이름이 다르다.
// utm이면 "linkedin", 리퍼러면 "linkedin.com" 또는 "l.threads.com"으로 잡힌다.
// 둘 다 세려고 CONTAINS로 건다.
const SOCIAL = ["threads", "linkedin", "instagram", "facebook"];

async function report(tok, days, dims) {
  const res = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${env("GA4_PROPERTY_ID")}:runReport`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${tok}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        dateRanges: [{ startDate: `${days}daysAgo`, endDate: "yesterday" }],
        dimensions: dims.map((name) => ({ name })),
        metrics: [
          { name: "sessions" },
          { name: "screenPageViewsPerSession" },
          { name: "averageSessionDuration" },
          { name: "engagementRate" },
          { name: "screenPageViews" },
        ],
        dimensionFilter: {
          orGroup: {
            expressions: [
              // utm_medium=social 로 붙인 유입
              { filter: { fieldName: "sessionMedium", stringFilter: { value: "social" } } },
              // 리퍼러로 들어온 유입 (linkedin.com, l.threads.com 등)
              ...SOCIAL.map((s) => ({
                filter: {
                  fieldName: "sessionSource",
                  stringFilter: { matchType: "CONTAINS", value: s },
                },
              })),
            ],
          },
        },
        orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
        limit: 200,
      }),
    },
  );
  const j = await res.json();
  if (j.error) {
    console.error(`GA4 오류: ${JSON.stringify(j.error).slice(0, 300)}`);
    process.exit(1);
  }
  return (j.rows || []).map((r) => ({
    keys: r.dimensionValues.map((v) => v.value),
    sessions: Number(r.metricValues[0].value),
    perSession: Number(r.metricValues[1].value),
    duration: Number(r.metricValues[2].value),
    engagement: Number(r.metricValues[3].value),
    views: Number(r.metricValues[4].value),
  }));
}

function fmt(rows, head) {
  console.log(`\n${head}`);
  console.log(
    `${"구분".padEnd(38)}${"세션".padStart(7)}${"페이지/세션".padStart(11)}${"체류".padStart(8)}${"참여율".padStart(8)}`,
  );
  for (const r of rows) {
    const k = r.keys.join(" / ");
    console.log(
      `${k.slice(0, 37).padEnd(38)}${String(r.sessions).padStart(7)}` +
        `${r.perSession.toFixed(2).padStart(11)}${(r.duration.toFixed(0) + "초").padStart(8)}` +
        `${(r.engagement * 100).toFixed(0).padStart(7)}%`,
    );
  }
  if (!rows.length)
    console.log(
      "  (유입 없음. 이 기간에 게시하지 않았거나 링크에 utm이 빠졌을 수 있다)\n" +
        "  utm이 빠지면 리퍼러로만 잡혀 캠페인 이름이 (not set)이 된다",
    );
}

const args = process.argv.slice(2);
const days = Number(args[args.indexOf("--days") + 1]) || 30;

const tok = await token();

const byChannel = await report(tok, days, ["sessionSource"]);
fmt(byChannel, `채널별 (최근 ${days}일)`);

// 벤치마크: 구글 검색은 세션당 1.09페이지다. SNS가 이보다 낮으면 소재나 랜딩이 어긋난 것이다
console.log("\n  기준선: 구글 검색 1.09페이지 / 네이버 1.41 / 링크드인 과거 5.47");

if (args.includes("--by-campaign") || args.includes("--merge")) {
  const byCampaign = await report(tok, days, ["sessionSource", "sessionCampaignName"]);
  fmt(byCampaign, `게시물별 (최근 ${days}일)`);

  if (args.includes("--merge")) {
    mkdirSync(DATA_DIR, { recursive: true });
    const log = existsSync(LOG_PATH)
      ? JSON.parse(readFileSync(LOG_PATH, "utf8"))
      : { entries: {} };
    log.performance = log.performance || {};
    for (const r of byCampaign) {
      const [source, campaign] = r.keys;
      if (!campaign || campaign === "(not set)") continue;
      const key = `${campaign}::${source}`;
      log.performance[key] = {
        slug: campaign,
        platform: source,
        sessions: r.sessions,
        pagesPerSession: Number(r.perSession.toFixed(2)),
        durationSec: Math.round(r.duration),
        engagementRate: Number((r.engagement * 100).toFixed(1)),
        views: r.views,
        windowDays: days,
      };
    }
    writeFileSync(LOG_PATH, JSON.stringify(log, null, 2));
    console.log(`\nsns-log.json 에 성과 ${Object.keys(log.performance).length}건을 병합했습니다.`);
    console.log("references/playbook.md 의 실험 기록표를 이 값으로 갱신하세요.");
  }
}
