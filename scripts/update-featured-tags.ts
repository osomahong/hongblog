/**
 * GA4 최근 30일 태그 상세 페이지(/tags/[slug]) 조회수 기준 인기 태그를
 * scripts/data/featured-tags.json에 저장한다.
 * /tags 허브 페이지의 "인기 태그로 보는 콘텐츠" 섹션이 이 파일을 읽는다
 * (src/lib/content.ts의 getFeaturedTagPreviews).
 *
 * Run: npx tsx --env-file=.env.local scripts/update-featured-tags.ts
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

const DAYS = 30;
const MAX_TAGS = 8;
const OUT_PATH = path.join(process.cwd(), "scripts/data/featured-tags.json");

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
            stringFilter: { matchType: "BEGINS_WITH", value: "/tags/" },
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
  const tags: string[] = [];
  for (const row of json.rows) {
    const rawPath = row.dimensionValues[0]?.value ?? "";
    // pagePath는 "/tags/{태그명}" (GA4가 URL 인코딩을 자동 디코딩해 반환)
    const tag = decodeURIComponent(rawPath.replace(/^\/tags\//, "").split(/[/?#]/)[0]).trim();
    if (!tag || tag === "tags" || seen.has(tag)) continue;
    seen.add(tag);
    tags.push(tag);
    if (tags.length >= MAX_TAGS) break;
  }

  const out = {
    generatedAt: new Date().toISOString(),
    days: DAYS,
    tags,
  };
  fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 2) + "\n");
  console.log(`featured-tags.json 갱신 완료 (${tags.length}개):`);
  tags.forEach((t, i) => console.log(`  ${i + 1}. ${t}`));
}

main();
