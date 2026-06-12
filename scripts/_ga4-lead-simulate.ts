/**
 * Lead Scoring Simulation: 2026-05-09 single day, GA4 Data API
 * Run: npx tsx --env-file=.env.local scripts/_ga4-lead-simulate.ts
 * NOT committed (underscore prefix). Read-only API call.
 */
import crypto from "node:crypto";

const KEY_B64 = process.env.GA4_SERVICE_ACCOUNT_KEY!;
const PROPERTY_ID = process.env.GA4_PROPERTY_ID!;
if (!KEY_B64 || !PROPERTY_ID) {
  throw new Error("GA4_SERVICE_ACCOUNT_KEY / GA4_PROPERTY_ID missing");
}
const KEY = JSON.parse(Buffer.from(KEY_B64, "base64").toString("utf-8"));

const TARGET_DATE = "2026-05-09";

const WEIGHTS: Record<string, number> = {
  view_insights: 1,
  view_class: 1,
  view_about: 5,
  click_expand: 2,
  click_compress: 0,
  click_expand_btn: 0,
  tracked_link_click: 4,
  quiz_answer: 1,
  quiz_retry: 0,
  related_insights: 2,
  related_classes: 2,
  related_faqs: 2,
  related_logs: 2,
  click_nav: 0,
  click_footer: 0,
  view_focus_layout: 0,
  view_tag: 0,
};

const TARGET_EVENTS = Object.keys(WEIGHTS).filter((k) => WEIGHTS[k] > 0);

function b64url(input: string | Buffer): string {
  return Buffer.from(input).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
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
  const json = (await res.json()) as { access_token?: string; error?: string; error_description?: string };
  if (!json.access_token) throw new Error(`Token error: ${JSON.stringify(json)}`);
  return json.access_token;
}

interface ReportRow {
  dimensionValues: { value: string }[];
  metricValues: { value: string }[];
}
interface ReportResponse {
  rows?: ReportRow[];
  error?: { message?: string; status?: string };
}

async function runReport(token: string, body: unknown): Promise<ReportResponse> {
  const res = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${PROPERTY_ID}:runReport`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );
  return (await res.json()) as ReportResponse;
}

function pad(s: string, n: number): string {
  if (s.length >= n) return s.slice(0, n);
  return s + " ".repeat(n - s.length);
}
function rpad(s: string, n: number): string {
  return pad(s, n);
}
function lpad(s: string, n: number): string {
  if (s.length >= n) return s.slice(0, n);
  return " ".repeat(n - s.length) + s;
}

(async () => {
  const token = await getAccessToken();

  // ============================================================
  // Q1: 일별 트래픽 개요 (페이지뷰·세션·총 사용자·평균 활동체류)
  // ============================================================
  console.log(`\n========== ${TARGET_DATE} | 일별 트래픽 개요 ==========`);
  const overview = await runReport(token, {
    dateRanges: [{ startDate: TARGET_DATE, endDate: TARGET_DATE }],
    metrics: [
      { name: "screenPageViews" },
      { name: "sessions" },
      { name: "totalUsers" },
      { name: "userEngagementDuration" },
      { name: "engagementRate" },
    ],
  });
  if (overview.error) {
    console.log("ERROR:", JSON.stringify(overview.error, null, 2));
    return;
  }
  if (!overview.rows || overview.rows.length === 0) {
    console.log("(데이터 없음 — 5/9 지표가 아직 수집되지 않았거나 0)");
  } else {
    const m = overview.rows[0].metricValues;
    const pageViews = Number(m[0].value);
    const sessions = Number(m[1].value);
    const users = Number(m[2].value);
    const totalEngageSec = Number(m[3].value);
    const engageRate = Number(m[4].value);
    console.log(`  페이지뷰      : ${pageViews}`);
    console.log(`  세션          : ${sessions}`);
    console.log(`  총 사용자     : ${users}`);
    console.log(`  활동체류 합계 : ${totalEngageSec.toFixed(0)}초`);
    console.log(`  사용자당 평균 : ${users > 0 ? (totalEngageSec / users).toFixed(1) : "-"}초`);
    console.log(`  참여율        : ${(engageRate * 100).toFixed(1)}%`);
  }

  // ============================================================
  // Q2: eventName × pagePath 매트릭스
  // ============================================================
  console.log(`\n========== ${TARGET_DATE} | 이벤트 × 페이지 매트릭스 (가중치 적용 점수 포함) ==========`);
  const eventsRes = await runReport(token, {
    dateRanges: [{ startDate: TARGET_DATE, endDate: TARGET_DATE }],
    dimensions: [{ name: "eventName" }, { name: "pagePath" }],
    metrics: [
      { name: "eventCount" },
      { name: "totalUsers" },
      { name: "userEngagementDuration" },
    ],
    dimensionFilter: {
      filter: {
        fieldName: "eventName",
        inListFilter: { values: TARGET_EVENTS },
      },
    },
    orderBys: [{ metric: { metricName: "eventCount" }, desc: true }],
    limit: 250,
  });
  if (eventsRes.error) {
    console.log("ERROR:", JSON.stringify(eventsRes.error, null, 2));
    return;
  }

  const rows = eventsRes.rows ?? [];
  if (rows.length === 0) {
    console.log("(이벤트 행 없음 — 5/9에 해당 이벤트가 발사되지 않음)");
  } else {
    console.log(
      `${rpad("eventName", 22)} | ${rpad("pagePath", 60)} | ${lpad("count", 6)} | ${lpad("users", 6)} | ${lpad("engSec", 8)} | ${lpad("score", 6)}`,
    );
    console.log("-".repeat(120));
    for (const r of rows) {
      const eventName = r.dimensionValues[0].value;
      const pagePath = r.dimensionValues[1].value;
      const count = Number(r.metricValues[0].value);
      const users = Number(r.metricValues[1].value);
      const engSec = Number(r.metricValues[2].value);
      const w = WEIGHTS[eventName] ?? 0;
      const score = count * w;
      console.log(
        `${rpad(eventName, 22)} | ${rpad(pagePath, 60)} | ${lpad(String(count), 6)} | ${lpad(String(users), 6)} | ${lpad(engSec.toFixed(0), 8)} | ${lpad(String(score), 6)}`,
      );
    }
  }

  // ============================================================
  // Q3: 페이지별 합산 점수 (eventName 기여 분해 포함)
  // ============================================================
  console.log(`\n========== ${TARGET_DATE} | 페이지별 가중 합산 (Top 20) ==========`);
  type PageAgg = {
    score: number;
    contribs: Map<string, { count: number; subScore: number }>;
    avgEngageSec: number;
    sumEngageSec: number;
    sumUsers: number;
  };
  const byPage = new Map<string, PageAgg>();
  for (const r of rows) {
    const eventName = r.dimensionValues[0].value;
    const pagePath = r.dimensionValues[1].value;
    const count = Number(r.metricValues[0].value);
    const users = Number(r.metricValues[1].value);
    const engSec = Number(r.metricValues[2].value);
    const w = WEIGHTS[eventName] ?? 0;
    const sub = count * w;

    let agg = byPage.get(pagePath);
    if (!agg) {
      agg = { score: 0, contribs: new Map(), avgEngageSec: 0, sumEngageSec: 0, sumUsers: 0 };
      byPage.set(pagePath, agg);
    }
    agg.score += sub;
    const c = agg.contribs.get(eventName) ?? { count: 0, subScore: 0 };
    c.count += count;
    c.subScore += sub;
    agg.contribs.set(eventName, c);
    // engagement는 view_insights/view_class 행에서만 누적 (대표값)
    if (eventName === "view_insights" || eventName === "view_class" || eventName === "view_about") {
      agg.sumEngageSec += engSec;
      agg.sumUsers += users;
    }
  }
  const sortedPages = [...byPage.entries()].sort((a, b) => b[1].score - a[1].score).slice(0, 20);
  console.log(
    `${rpad("page", 60)} | ${lpad("score", 6)} | ${lpad("avgEng", 7)} | 기여 분해`,
  );
  console.log("-".repeat(150));
  for (const [page, agg] of sortedPages) {
    const avg = agg.sumUsers > 0 ? (agg.sumEngageSec / agg.sumUsers).toFixed(0) : "-";
    const breakdown = [...agg.contribs.entries()]
      .filter(([, v]) => v.subScore > 0)
      .sort((a, b) => b[1].subScore - a[1].subScore)
      .map(([k, v]) => `${k}=${v.count}*${WEIGHTS[k]}=${v.subScore}`)
      .join(" + ");
    console.log(
      `${rpad(page, 60)} | ${lpad(String(agg.score), 6)} | ${lpad(avg + "s", 7)} | ${breakdown}`,
    );
  }

  // ============================================================
  // Q4: 30초·1분 도달 추정 (자동 측정 userEngagementDuration 기반 근사)
  // ============================================================
  console.log(`\n========== ${TARGET_DATE} | 30초·1분 도달 추정 (자동 measurement 근사) ==========`);
  console.log("(주: 정확한 30s/60s 도달 카운트는 EngagementTracker 도입 후 측정 가능)");
  console.log(
    `${rpad("page", 60)} | ${lpad("users", 6)} | ${lpad("avgSec", 7)} | est_30s_reach | est_60s_reach`,
  );
  for (const [page, agg] of sortedPages) {
    if (agg.sumUsers === 0) continue;
    const avg = agg.sumEngageSec / agg.sumUsers;
    let est30 = "0";
    let est60 = "0";
    if (avg >= 60) {
      est30 = `~${Math.round(agg.sumUsers * 0.7)}`;
      est60 = `~${Math.round(agg.sumUsers * 0.5)}`;
    } else if (avg >= 30) {
      est30 = `~${Math.round(agg.sumUsers * 0.5)}`;
      est60 = `~${Math.round(agg.sumUsers * 0.15)}`;
    } else if (avg >= 10) {
      est30 = `~${Math.round(agg.sumUsers * 0.2)}`;
    }
    console.log(
      `${rpad(page, 60)} | ${lpad(String(agg.sumUsers), 6)} | ${lpad(avg.toFixed(0) + "s", 7)} | ${lpad(est30, 13)} | ${lpad(est60, 13)}`,
    );
  }

  // ============================================================
  // Q4b: 페이지별 정확한 평균 활동체류 (user_engagement 이벤트 기반)
  //      view_* 이벤트 행에는 userEngagementDuration이 0으로 잡혀
  //      페이지 차원만 단독으로 받아야 정확한 값이 나온다.
  // ============================================================
  console.log(`\n========== ${TARGET_DATE} | 페이지별 정확한 활동체류 (Top 20) ==========`);
  const engRes = await runReport(token, {
    dateRanges: [{ startDate: TARGET_DATE, endDate: TARGET_DATE }],
    dimensions: [{ name: "pagePath" }],
    metrics: [
      { name: "totalUsers" },
      { name: "userEngagementDuration" },
      { name: "engagementRate" },
      { name: "screenPageViews" },
    ],
    dimensionFilter: {
      orGroup: {
        expressions: [
          { filter: { fieldName: "pagePath", stringFilter: { matchType: "BEGINS_WITH", value: "/insights/" } } },
          { filter: { fieldName: "pagePath", stringFilter: { matchType: "BEGINS_WITH", value: "/class/" } } },
          { filter: { fieldName: "pagePath", stringFilter: { matchType: "EXACT", value: "/about" } } },
        ],
      },
    },
    orderBys: [{ metric: { metricName: "userEngagementDuration" }, desc: true }],
    limit: 30,
  });
  if (!engRes.error && engRes.rows) {
    console.log(
      `${rpad("page", 60)} | ${lpad("users", 6)} | ${lpad("pv", 4)} | ${lpad("avgEng", 7)} | ${lpad("eng%", 5)} | est_30s | est_60s`,
    );
    console.log("-".repeat(140));
    for (const r of engRes.rows) {
      const page = r.dimensionValues[0].value;
      const users = Number(r.metricValues[0].value);
      const totalEng = Number(r.metricValues[1].value);
      const engRate = Number(r.metricValues[2].value);
      const pv = Number(r.metricValues[3].value);
      const avg = users > 0 ? totalEng / users : 0;
      let est30 = "0";
      let est60 = "0";
      if (avg >= 60) {
        est30 = `~${Math.round(users * 0.7)}`;
        est60 = `~${Math.round(users * 0.5)}`;
      } else if (avg >= 30) {
        est30 = `~${Math.round(users * 0.5)}`;
        est60 = `~${Math.round(users * 0.15)}`;
      } else if (avg >= 10) {
        est30 = `~${Math.round(users * 0.2)}`;
      }
      console.log(
        `${rpad(page, 60)} | ${lpad(String(users), 6)} | ${lpad(String(pv), 4)} | ${lpad(avg.toFixed(0) + "s", 7)} | ${lpad((engRate * 100).toFixed(0) + "%", 5)} | ${lpad(est30, 7)} | ${lpad(est60, 7)}`,
      );
    }
  }

  // ============================================================
  // Q5: 이벤트 종류별 총량 (sanity check)
  // ============================================================
  console.log(`\n========== ${TARGET_DATE} | 이벤트별 총 발생 수 ==========`);
  const byEvent = new Map<string, number>();
  for (const r of rows) {
    const eventName = r.dimensionValues[0].value;
    const count = Number(r.metricValues[0].value);
    byEvent.set(eventName, (byEvent.get(eventName) ?? 0) + count);
  }
  for (const [k, v] of [...byEvent.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${rpad(k, 22)} : ${lpad(String(v), 5)}  (가중치 ${WEIGHTS[k] ?? 0})`);
  }
})();
