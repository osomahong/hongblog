/**
 * GSC Search Analytics 주간/월간 점검 리포트
 * Run: npx tsx --env-file=.env.local scripts/gsc-report.ts
 * 필요 권한: GA4_SERVICE_ACCOUNT_KEY 서비스 계정이 Search Console 속성에 '전체' 사용자로 추가되어 있어야 함
 */
import crypto from "node:crypto";

const KEY_B64 = process.env.GA4_SERVICE_ACCOUNT_KEY!;
const KEY = JSON.parse(Buffer.from(KEY_B64, "base64").toString("utf-8"));
const SITE = "sc-domain:digitalmarketer.co.kr";
const API = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE)}/searchAnalytics/query`;

function b64url(input: string | Buffer): string {
  return Buffer.from(input).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

async function getAccessToken(scope: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = b64url(
    JSON.stringify({ iss: KEY.client_email, scope, aud: "https://oauth2.googleapis.com/token", exp: now + 3600, iat: now }),
  );
  const signed = `${header}.${payload}`;
  const sig = crypto.createSign("RSA-SHA256");
  sig.update(signed);
  const signature = b64url(sig.sign(KEY.private_key));
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: `${signed}.${signature}` }),
  });
  const json = (await res.json()) as { access_token?: string };
  if (!json.access_token) throw new Error(`Token error: ${JSON.stringify(json)}`);
  return json.access_token;
}

type Row = { keys: string[]; clicks: number; impressions: number; ctr: number; position: number };

async function query(token: string, body: Record<string, unknown>): Promise<Row[]> {
  const res = await fetch(API, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = (await res.json()) as { rows?: Row[]; error?: unknown };
  if (json.error) throw new Error(JSON.stringify(json.error));
  return json.rows ?? [];
}

const END = new Date(Date.now() - 3 * 86400000).toISOString().slice(0, 10);
const START_90 = new Date(Date.now() - 93 * 86400000).toISOString().slice(0, 10);
const START_28 = new Date(Date.now() - 31 * 86400000).toISOString().slice(0, 10);

function pathOf(url: string): string {
  try { return new URL(url).pathname; } catch { return url; }
}

function fmt(n: number, d = 1): string { return n.toFixed(d); }

async function main() {
  const token = await getAccessToken("https://www.googleapis.com/auth/webmasters.readonly");

  // 1) 섹션별 집계 (90일): page 차원 전체 → prefix 그룹핑
  const allPages90 = await query(token, {
    startDate: START_90, endDate: END, dimensions: ["page"], rowLimit: 5000, dataState: "final",
  });
  const groups: Record<string, { clicks: number; imp: number; posW: number; pages: number }> = {};
  for (const r of allPages90) {
    const p = pathOf(r.keys[0]);
    let g = "기타";
    if (/^\/insights\/.+/.test(p)) g = "/insights/[slug]";
    else if (/^\/class\/[^/]+\/.+/.test(p)) g = "/class/[course]/[slug]";
    else if (/^\/class\/[^/]+$/.test(p)) g = "/class/[course]";
    else if (p === "/class") g = "/class";
    else if (p === "/insights") g = "/insights";
    else if (p === "/") g = "/";
    groups[g] ??= { clicks: 0, imp: 0, posW: 0, pages: 0 };
    groups[g].clicks += r.clicks;
    groups[g].imp += r.impressions;
    groups[g].posW += r.position * r.impressions;
    groups[g].pages += 1;
  }
  console.log(`\n========== 90일 (${START_90}~${END}) 섹션별 GSC 집계 ==========`);
  console.log("섹션 | 클릭 | 노출 | CTR% | 가중평균순위 | 페이지수");
  for (const [g, v] of Object.entries(groups).sort((a, b) => b[1].clicks - a[1].clicks)) {
    console.log(`${g} | ${v.clicks} | ${v.imp} | ${fmt((v.clicks / Math.max(v.imp, 1)) * 100, 2)} | ${fmt(v.posW / Math.max(v.imp, 1))} | ${v.pages}`);
  }

  // 2) class 상세 페이지별 성과 (90일)
  const classPages = allPages90
    .filter((r) => /^\/class\/[^/]+\/.+/.test(pathOf(r.keys[0])))
    .sort((a, b) => b.impressions - a.impressions);
  console.log(`\n========== 90일 Class 상세 페이지별 (노출순 전체 ${classPages.length}개) ==========`);
  console.log("경로 | 클릭 | 노출 | CTR% | 순위");
  for (const r of classPages) {
    console.log(`${pathOf(r.keys[0])} | ${r.clicks} | ${r.impressions} | ${fmt(r.ctr * 100, 2)} | ${fmt(r.position)}`);
  }

  // 3) class 쿼리×페이지 (90일): 기회 발굴
  const qp = await query(token, {
    startDate: START_90, endDate: END, dimensions: ["query", "page"], rowLimit: 5000, dataState: "final",
    dimensionFilterGroups: [{ filters: [{ dimension: "page", operator: "contains", expression: "/class/" }] }],
  });
  const qpSorted = [...qp].sort((a, b) => b.impressions - a.impressions);
  console.log(`\n========== 90일 Class 쿼리×페이지 상위 40 (노출순, 총 ${qp.length}행) ==========`);
  console.log("쿼리 | 경로 | 클릭 | 노출 | CTR% | 순위");
  for (const r of qpSorted.slice(0, 40)) {
    console.log(`${r.keys[0]} | ${pathOf(r.keys[1])} | ${r.clicks} | ${r.impressions} | ${fmt(r.ctr * 100, 2)} | ${fmt(r.position)}`);
  }

  // 4) striking distance: 순위 4~20, 노출 상위
  const striking = qp.filter((r) => r.position >= 4 && r.position <= 20).sort((a, b) => b.impressions - a.impressions);
  console.log(`\n========== 90일 Class striking distance (순위 4~20, 노출순 상위 30) ==========`);
  for (const r of striking.slice(0, 30)) {
    console.log(`${r.keys[0]} | ${pathOf(r.keys[1])} | 클릭 ${r.clicks} | 노출 ${r.impressions} | 순위 ${fmt(r.position)}`);
  }

  // 5) 인사이트 쿼리 중 class 주제와 겹치는 것 파악용: insights 상위 쿼리 30
  const qi = await query(token, {
    startDate: START_90, endDate: END, dimensions: ["query"], rowLimit: 100, dataState: "final",
    dimensionFilterGroups: [{ filters: [{ dimension: "page", operator: "contains", expression: "/insights/" }] }],
  });
  console.log(`\n========== 90일 Insights 상위 쿼리 30 (클릭순) ==========`);
  for (const r of [...qi].sort((a, b) => b.clicks - a.clicks).slice(0, 30)) {
    console.log(`${r.keys[0]} | 클릭 ${r.clicks} | 노출 ${r.impressions} | 순위 ${fmt(r.position)}`);
  }

  // 6) 28일 vs 90일 class 추세
  const class28 = await query(token, {
    startDate: START_28, endDate: END, dimensions: ["page"], rowLimit: 5000, dataState: "final",
    dimensionFilterGroups: [{ filters: [{ dimension: "page", operator: "contains", expression: "/class/" }] }],
  });
  const sum = (rows: Row[]) => rows.reduce((a, r) => ({ c: a.c + r.clicks, i: a.i + r.impressions }), { c: 0, i: 0 });
  const s28 = sum(class28);
  const s90 = sum(allPages90.filter((r) => pathOf(r.keys[0]).startsWith("/class")));
  console.log(`\n========== Class 추세 ==========`);
  console.log(`90일: 클릭 ${s90.c}, 노출 ${s90.i} (일평균 클릭 ${fmt(s90.c / 90, 2)})`);
  console.log(`28일: 클릭 ${s28.c}, 노출 ${s28.i} (일평균 클릭 ${fmt(s28.c / 28, 2)})`);
}

main().catch((e) => { console.error(e); process.exit(1); });
