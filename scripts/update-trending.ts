/**
 * GA4 최근 7일 인사이트 조회수 기준 인기 슬러그를 scripts/data/trending.json에 저장한다.
 * 홈의 TRENDING NOW 섹션이 이 파일을 읽는다 (src/lib/content.ts의 getTrendingMixed).
 *
 * Run: npx tsx --env-file=.env.local scripts/update-trending.ts
 * 갱신 후 trending.json을 커밋해야 사이트에 반영된다.
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const KEY_B64 = process.env.GA4_SERVICE_ACCOUNT_KEY;
const PROPERTY_ID = process.env.GA4_PROPERTY_ID;
if (!KEY_B64 || !PROPERTY_ID) {
  throw new Error("GA4_SERVICE_ACCOUNT_KEY / GA4_PROPERTY_ID missing (.env.local)");
}
const KEY = JSON.parse(Buffer.from(KEY_B64, "base64").toString("utf-8"));

const DAYS = 7;
const MAX_SLUGS = 8;
const OUT_PATH = path.join(process.cwd(), "scripts/data/trending.json");

function b64url(input: string | Buffer): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

async function getAccessToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = b64url(
    JSON.stringify({
      iss: KEY.client_email,
      scope: "https://www.googleapis.com/auth/analytics.readonly",
      aud: "https://oauth2.googleapis.com/token",
      exp: now + 3600,
      iat: now,
    }),
  );
  const signed = `${header}.${payload}`;
  const sig = crypto.createSign("RSA-SHA256");
  sig.update(signed);
  const signature = b64url(sig.sign(KEY.private_key));
  const jwt = `${signed}.${signature}`;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });
  const json = (await res.json()) as { access_token?: string };
  if (!json.access_token) throw new Error(`Token error: ${JSON.stringify(json)}`);
  return json.access_token;
}

interface Ga4Row {
  dimensionValues: { value: string }[];
  metricValues: { value: string }[];
}

async function main() {
  const token = await getAccessToken();
  const res = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${PROPERTY_ID}:runReport`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        dateRanges: [{ startDate: `${DAYS}daysAgo`, endDate: "today" }],
        dimensions: [{ name: "pagePath" }],
        metrics: [{ name: "screenPageViews" }],
        dimensionFilter: {
          filter: {
            fieldName: "pagePath",
            stringFilter: { matchType: "BEGINS_WITH", value: "/insights/" },
          },
        },
        orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
        limit: 50,
      }),
    },
  );
  const json = (await res.json()) as { rows?: Ga4Row[]; error?: unknown };
  if (!json.rows) {
    throw new Error(`GA4 응답에 rows가 없습니다: ${JSON.stringify(json).slice(0, 300)}`);
  }

  const seen = new Set<string>();
  const slugs: string[] = [];
  for (const row of json.rows) {
    const rawPath = row.dimensionValues[0]?.value ?? "";
    const slug = rawPath.replace(/^\/insights\//, "").split(/[/?#]/)[0].trim();
    if (!slug || seen.has(slug)) continue;
    seen.add(slug);
    slugs.push(slug);
    if (slugs.length >= MAX_SLUGS) break;
  }

  const out = {
    generatedAt: new Date().toISOString(),
    days: DAYS,
    slugs,
  };
  fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 2) + "\n");
  console.log(`trending.json 갱신 완료 (${slugs.length}개):`);
  slugs.forEach((s, i) => console.log(`  ${i + 1}. ${s}`));
}

main();
