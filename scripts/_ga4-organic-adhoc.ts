/**
 * One-off ad-hoc analysis: organic search 유입을 /insights vs /class 비교
 * Run: npx tsx --env-file=.env.local scripts/_ga4-organic-adhoc.ts
 * NOT committed. Delete after use.
 */
import crypto from "node:crypto";

const KEY_B64 = process.env.GA4_SERVICE_ACCOUNT_KEY!;
const PROPERTY_ID = process.env.GA4_PROPERTY_ID!;
if (!KEY_B64 || !PROPERTY_ID) {
  throw new Error("GA4_SERVICE_ACCOUNT_KEY / GA4_PROPERTY_ID missing");
}
const KEY = JSON.parse(Buffer.from(KEY_B64, "base64").toString("utf-8"));

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

async function runReport(token: string, body: unknown) {
  const res = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${PROPERTY_ID}:runReport`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );
  const json = await res.json();
  return json;
}

function fmt(rows: any) {
  if (!rows?.rows) return "(no rows)";
  return rows.rows
    .map(
      (r: any) =>
        r.dimensionValues.map((d: any) => d.value).join(" | ") +
        "  ::  " +
        r.metricValues.map((m: any) => m.value).join(" | "),
    )
    .join("\n");
}

(async () => {
  const token = await getAccessToken();

  // Q1: 28일 organic search 채널 — 경로 prefix 별
  // pagePath, sessionDefaultChannelGroup
  for (const range of [
    { label: "28일", start: "28daysAgo", end: "today" },
    { label: "7일", start: "7daysAgo", end: "today" },
  ]) {
    console.log(`\n========== ${range.label} | Organic Search 채널 — 경로별 합계 ==========`);
    const r = await runReport(token, {
      dateRanges: [{ startDate: range.start, endDate: range.end }],
      dimensions: [{ name: "pagePathPlusQueryString" }],
      metrics: [
        { name: "sessions" },
        { name: "totalUsers" },
        { name: "engagementRate" },
        { name: "averageSessionDuration" },
      ],
      dimensionFilter: {
        filter: {
          fieldName: "sessionDefaultChannelGroup",
          stringFilter: { value: "Organic Search" },
        },
      },
      limit: 500,
    });
    if (r.error) {
      console.log("ERROR:", JSON.stringify(r.error, null, 2));
      continue;
    }
    // Aggregate by prefix
    type Bucket = { sessions: number; users: number; engageSum: number; durSum: number; rowCount: number };
    const buckets: Record<string, Bucket> = {};
    for (const row of r.rows ?? []) {
      const path = row.dimensionValues[0].value as string;
      let bucket: string;
      if (path.startsWith("/insights/")) bucket = "/insights/[slug]";
      else if (path === "/insights") bucket = "/insights (목록)";
      else if (path.match(/^\/class\/[^\/]+\/[^\/]+/)) bucket = "/class/[course]/[slug]";
      else if (path.match(/^\/class\/[^\/]+/)) bucket = "/class/[course]";
      else if (path === "/class") bucket = "/class (목록)";
      else if (path === "/") bucket = "/ (홈)";
      else if (path.startsWith("/tags")) bucket = "/tags";
      else if (path.startsWith("/about")) bucket = "/about";
      else bucket = "기타";
      if (!buckets[bucket])
        buckets[bucket] = { sessions: 0, users: 0, engageSum: 0, durSum: 0, rowCount: 0 };
      const b = buckets[bucket];
      b.sessions += Number(row.metricValues[0].value);
      b.users += Number(row.metricValues[1].value);
      b.engageSum += Number(row.metricValues[2].value);
      b.durSum += Number(row.metricValues[3].value);
      b.rowCount += 1;
    }
    const total = Object.values(buckets).reduce((a, b) => a + b.sessions, 0);
    const sorted = Object.entries(buckets).sort((a, b) => b[1].sessions - a[1].sessions);
    console.log("경로 prefix         |  세션 비중  |  유저 비중  |  평균참여율  |  평균체류(s)  |  페이지 종류 수");
    for (const [name, b] of sorted) {
      const totalUsers = Object.values(buckets).reduce((s, x) => s + x.users, 0);
      console.log(
        `${name.padEnd(28)}|  ${((b.sessions / total) * 100).toFixed(1).padStart(5)}%  |  ${((b.users / Math.max(totalUsers, 1)) * 100).toFixed(1).padStart(5)}%  |  ${(b.engageSum / Math.max(b.rowCount, 1)).toFixed(3).padStart(6)}  |  ${(b.durSum / Math.max(b.rowCount, 1)).toFixed(0).padStart(5)}  |  ${b.rowCount}`,
      );
    }
  }

  // Q2: 28일 organic search 상위 랜딩 페이지 30개
  console.log(`\n========== 28일 | Organic Search 상위 랜딩 페이지 30개 (세션 점유율) ==========`);
  const q2 = await runReport(token, {
    dateRanges: [{ startDate: "28daysAgo", endDate: "today" }],
    dimensions: [{ name: "landingPagePlusQueryString" }],
    metrics: [{ name: "sessions" }, { name: "engagementRate" }],
    dimensionFilter: {
      filter: {
        fieldName: "sessionDefaultChannelGroup",
        stringFilter: { value: "Organic Search" },
      },
    },
    orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
    limit: 30,
  });
  if (q2.error) console.log("ERROR:", JSON.stringify(q2.error, null, 2));
  else {
    const total = (q2.rows ?? []).reduce((s: number, r: any) => s + Number(r.metricValues[0].value), 0);
    let classCount = 0;
    let insightsCount = 0;
    (q2.rows ?? []).forEach((r: any, i: number) => {
      const path = r.dimensionValues[0].value;
      const pct = ((Number(r.metricValues[0].value) / Math.max(total, 1)) * 100).toFixed(1);
      const eng = Number(r.metricValues[1].value).toFixed(3);
      const tag = path.startsWith("/insights/") ? " [INS]" : path.startsWith("/class/") ? " [CLS]" : "";
      if (path.startsWith("/insights/")) insightsCount++;
      if (path.startsWith("/class/")) classCount++;
      console.log(`${String(i + 1).padStart(2)}.  ${pct.padStart(5)}%  eng=${eng}  ${path}${tag}`);
    });
    console.log(`\n  → 30위 안 Insight 글: ${insightsCount}개  /  Class 글: ${classCount}개`);
  }

  // Q3: GSC query 차원 가능한지 시도 (organicGoogleSearchClicks 메트릭 + landingPage)
  console.log(`\n========== 28일 | GSC 검색어 (있으면) — landingPage·query 별 ==========`);
  const q3 = await runReport(token, {
    dateRanges: [{ startDate: "28daysAgo", endDate: "today" }],
    dimensions: [{ name: "landingPage" }, { name: "googleSearchConsoleQuery" } as any],
    metrics: [
      { name: "organicGoogleSearchClicks" },
      { name: "organicGoogleSearchImpressions" },
      { name: "organicGoogleSearchClickThroughRate" },
      { name: "organicGoogleSearchAveragePosition" },
    ],
    orderBys: [{ metric: { metricName: "organicGoogleSearchImpressions" }, desc: true }],
    limit: 30,
  });
  if (q3.error) {
    console.log("GSC 차원 사용 불가 (또는 미연동):", q3.error?.message ?? JSON.stringify(q3.error));
  } else {
    console.log("페이지 | 검색어 | 클릭 | 노출 | CTR | 평균순위");
    (q3.rows ?? []).forEach((r: any, i: number) => {
      const dims = r.dimensionValues.map((d: any) => d.value);
      const mets = r.metricValues.map((m: any) => m.value);
      console.log(
        `${String(i + 1).padStart(2)}.  ${dims[0].slice(0, 50).padEnd(50)} | ${dims[1].slice(0, 30).padEnd(30)} | ${mets[0].padStart(4)} | ${mets[1].padStart(6)} | ${(Number(mets[2]) * 100).toFixed(2)}% | ${Number(mets[3]).toFixed(1)}`,
      );
    });
  }

  // Q4: Class 코스별 organic 분포
  console.log(`\n========== 28일 | Class 코스별 organic search 분포 ==========`);
  const q4 = await runReport(token, {
    dateRanges: [{ startDate: "28daysAgo", endDate: "today" }],
    dimensions: [{ name: "pagePathPlusQueryString" }],
    metrics: [{ name: "sessions" }],
    dimensionFilter: {
      andGroup: {
        expressions: [
          {
            filter: {
              fieldName: "sessionDefaultChannelGroup",
              stringFilter: { value: "Organic Search" },
            },
          },
          {
            filter: {
              fieldName: "pagePathPlusQueryString",
              stringFilter: { matchType: "BEGINS_WITH", value: "/class" },
            },
          },
        ],
      },
    },
    limit: 200,
  });
  if (q4.error) console.log("ERROR:", JSON.stringify(q4.error, null, 2));
  else {
    const total = (q4.rows ?? []).reduce((s: number, r: any) => s + Number(r.metricValues[0].value), 0);
    const courseAgg: Record<string, number> = {};
    let listCount = 0;
    (q4.rows ?? []).forEach((r: any) => {
      const path = r.dimensionValues[0].value as string;
      const sess = Number(r.metricValues[0].value);
      if (path === "/class") listCount += sess;
      else {
        const m = path.match(/^\/class\/([^\/]+)/);
        if (m) {
          const course = m[1];
          courseAgg[course] = (courseAgg[course] ?? 0) + sess;
        }
      }
    });
    console.log(`/class 목록 페이지 비중: ${total > 0 ? ((listCount / total) * 100).toFixed(1) : 0}%`);
    Object.entries(courseAgg)
      .sort((a, b) => b[1] - a[1])
      .forEach(([course, sess]) => {
        const pct = total > 0 ? ((sess / total) * 100).toFixed(1) : "0";
        console.log(`  ${course.padEnd(30)} | ${pct}%`);
      });
  }
})();
