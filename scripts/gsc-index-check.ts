/**
 * GSC URL 검사와 사이트맵 상태 점검
 *
 * Run: npx tsx --env-file=.env.local scripts/gsc-index-check.ts [slug ...]
 *   slug 없이 실행하면 최근 발행한 인사이트 10편을 검사한다.
 *   slug를 주면 그 글만 검사한다. /insights/ 경로를 붙이지 않고 slug만 넘긴다.
 *
 * 예: npx tsx --env-file=.env.local scripts/gsc-index-check.ts tmux-shortcuts-guide
 *     npm run check:index -- --recent 5
 *     npm run check:index -- --sitemap
 *
 * 필요 권한: GA4_SERVICE_ACCOUNT_KEY 서비스 계정이 Search Console 속성에 추가되어 있어야 한다.
 * URL 검사 API는 하루 2,000회, 분당 600회 한도가 있다.
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const KEY_B64 = process.env.GA4_SERVICE_ACCOUNT_KEY!;
const KEY = JSON.parse(Buffer.from(KEY_B64, "base64").toString("utf-8"));
const SITE = "sc-domain:digitalmarketer.co.kr";
const ORIGIN = "https://www.digitalmarketer.co.kr";
const CONTENT_DIR = path.join(process.cwd(), "content", "insights");

function b64url(input: string | Buffer): string {
  return Buffer.from(input).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

async function getAccessToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = b64url(
    JSON.stringify({
      iss: KEY.client_email,
      scope: "https://www.googleapis.com/auth/webmasters.readonly",
      aud: "https://oauth2.googleapis.com/token",
      exp: now + 3600,
      iat: now,
    }),
  );
  const signed = `${header}.${payload}`;
  const sig = crypto.createSign("RSA-SHA256");
  sig.update(signed);
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${signed}.${b64url(sig.sign(KEY.private_key))}`,
    }),
  });
  const json = (await res.json()) as { access_token?: string };
  if (!json.access_token) throw new Error(`Token error: ${JSON.stringify(json)}`);
  return json.access_token;
}

/** 색인 상태 문자열을 한국어 판독으로 옮긴다. 모르는 값은 원문 그대로 둔다. */
function readCoverage(state: string | undefined): string {
  if (!state) return "확인 불가";
  const table: Record<string, string> = {
    "Submitted and indexed": "색인 완료",
    "Indexed, not submitted in sitemap": "색인 완료 (사이트맵 제출 없이)",
    "Crawled - currently not indexed": "크롤됨, 색인 대기",
    "Discovered - currently not indexed": "발견됨, 크롤 대기",
    "URL is unknown to Google": "크롤 전 (구글이 아직 모름)",
    "Duplicate without user-selected canonical": "중복 판정 (정규 URL 미지정)",
    "Duplicate, Google chose different canonical than user": "중복 판정 (구글이 다른 정규 URL 선택)",
    "Excluded by 'noindex' tag": "noindex 태그로 제외",
    "Blocked by robots.txt": "robots.txt로 차단",
    "Page with redirect": "리디렉션 페이지",
    "Not found (404)": "404",
    "Soft 404": "소프트 404",
  };
  return table[state] ?? state;
}

type Inspection = {
  inspectionResult?: {
    indexStatusResult?: {
      coverageState?: string;
      robotsTxtState?: string;
      indexingState?: string;
      lastCrawlTime?: string;
      googleCanonical?: string;
      userCanonical?: string;
      sitemap?: string[];
    };
  };
  error?: { message?: string };
};

async function inspect(token: string, slug: string): Promise<void> {
  const url = `${ORIGIN}/insights/${slug}`;
  const res = await fetch("https://searchconsole.googleapis.com/v1/urlInspection/index:inspect", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ inspectionUrl: url, siteUrl: SITE }),
  });
  const json = (await res.json()) as Inspection;
  if (json.error) {
    console.log(`${slug}\n  오류: ${json.error.message}`);
    return;
  }
  const r = json.inspectionResult?.indexStatusResult ?? {};
  console.log(slug);
  console.log(`  상태: ${readCoverage(r.coverageState)}`);
  console.log(`  크롤 허용: ${r.robotsTxtState ?? "?"} | 색인 허용: ${r.indexingState ?? "?"}`);
  console.log(`  마지막 크롤: ${r.lastCrawlTime ?? "없음"}`);
  if (r.googleCanonical && r.userCanonical && r.googleCanonical !== r.userCanonical) {
    console.log(`  정규 URL 불일치`);
    console.log(`    내가 지정: ${r.userCanonical}`);
    console.log(`    구글 선택: ${r.googleCanonical}`);
  }
}

/** publishedAt 기준으로 최근 글 slug를 뽑는다. */
function recentSlugs(count: number): string[] {
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".md"));
  const rows = files.map((f) => {
    const text = fs.readFileSync(path.join(CONTENT_DIR, f), "utf-8");
    const m = text.match(/^publishedAt:\s*'?"?([0-9T:.\-Z]+)'?"?/m);
    return { slug: f.replace(/\.md$/, ""), date: m ? m[1] : "" };
  });
  return rows
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, count)
    .map((r) => r.slug);
}

async function sitemapStatus(token: string): Promise<void> {
  const res = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE)}/sitemaps`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  const json = (await res.json()) as {
    sitemap?: Array<{
      path: string;
      lastSubmitted?: string;
      lastDownloaded?: string;
      warnings?: string;
      errors?: string;
      contents?: Array<{ type: string; submitted: string; indexed?: string }>;
    }>;
    error?: { message?: string };
  };
  if (json.error) {
    console.log(`사이트맵 조회 오류: ${json.error.message}`);
    return;
  }
  console.log("========== 사이트맵 ==========");
  for (const sm of json.sitemap ?? []) {
    console.log(sm.path);
    console.log(`  마지막 제출: ${sm.lastSubmitted ?? "없음"}`);
    console.log(`  마지막 다운로드: ${sm.lastDownloaded ?? "없음"}`);
    console.log(`  경고 ${sm.warnings ?? 0} / 오류 ${sm.errors ?? 0}`);
    for (const c of sm.contents ?? []) console.log(`  ${c.type}: 제출 ${c.submitted}`);
  }
  console.log("\n제출 수는 사이트맵에 적힌 URL 개수다. 실제 색인 여부는 위의 URL 검사 결과를 기준으로 본다.");
}

async function main() {
  const args = process.argv.slice(2);
  const wantSitemap = args.includes("--sitemap");
  const recentIdx = args.indexOf("--recent");
  const recentCount = recentIdx !== -1 ? Number(args[recentIdx + 1] ?? 10) : 0;
  const slugs = args.filter((a) => !a.startsWith("--") && !/^\d+$/.test(a));

  const token = await getAccessToken();

  if (wantSitemap && slugs.length === 0 && recentCount === 0) {
    await sitemapStatus(token);
    return;
  }

  const targets = slugs.length > 0 ? slugs : recentSlugs(recentCount || 10);
  console.log(`========== URL 검사 (${targets.length}편) ==========`);
  for (const slug of targets) {
    await inspect(token, slug);
  }

  if (wantSitemap) {
    console.log("");
    await sitemapStatus(token);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
