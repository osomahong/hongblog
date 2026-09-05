/**
 * 기술적 SEO 검수: 빌드 산출물 HTML을 전수 분석한다.
 *
 * Run: npm run build && npx tsx scripts/seo-audit.ts
 *
 * 검사 항목: title/description 존재와 길이, 중복, canonical 정합성, noindex,
 * h1 개수, 이미지 alt, 구조화 데이터, 사이트맵 정합성, 고아 페이지, 얇은 콘텐츠,
 * 제목 정합성(og:title, twitter:title, H1, JSON-LD headline이 title과 같은 대상을 가리키는지)
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const APP_DIR = path.join(ROOT, ".next/server/app");
const SITE_URL = "https://www.digitalmarketer.co.kr";

interface PageInfo {
    route: string;
    file: string;
    title: string | null;
    description: string | null;
    canonical: string | null;
    robots: string | null;
    h1Count: number;
    wordCount: number;
    jsonLdTypes: string[];
    imagesWithoutAlt: number;
    internalLinks: string[];
    ogImage: string | null;
    ogTitle: string | null;
    twitterTitle: string | null;
    h1Text: string | null;
    headline: string | null;
}

function decodeEntities(s: string): string {
    return s
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#x27;|&#39;/g, "'")
        .replace(/&nbsp;/g, " ");
}

function collectHtml(dir: string): string[] {
    const out: string[] = [];
    const walk = (d: string) => {
        for (const e of fs.readdirSync(d, { withFileTypes: true })) {
            const full = path.join(d, e.name);
            if (e.isDirectory()) walk(full);
            else if (e.name.endsWith(".html")) out.push(full);
        }
    };
    walk(dir);
    return out;
}

function routeOf(file: string): string {
    const rel = path.relative(APP_DIR, file).replace(/\.html$/, "");
    return rel === "index" ? "/" : `/${rel}`;
}

function analyze(file: string): PageInfo {
    const html = fs.readFileSync(file, "utf-8");
    const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? null;
    const description =
        html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? null;
    const canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1] ?? null;
    const robots = html.match(/<meta name="robots" content="([^"]*)"/)?.[1] ?? null;
    const ogImage = html.match(/<meta property="og:image" content="([^"]*)"/)?.[1] ?? null;

    const h1Count = (html.match(/<h1[\s>]/g) ?? []).length;
    const ogTitle = html.match(/<meta property="og:title" content="([^"]*)"/)?.[1] ?? null;
    const twitterTitle = html.match(/<meta name="twitter:title" content="([^"]*)"/)?.[1] ?? null;
    const h1Raw = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? null;
    // Article/LearningResource의 headline. 목록 페이지의 ItemList 안 headline은 첫 항목이라 비교하지 않는다
    const headline = html.match(/"headline":"((?:[^"\\]|\\.)*)"/)?.[1] ?? null;

    // 본문 텍스트 추정: script/style 제거 후 태그 제거
    const text = html
        .replace(/<script[\s\S]*?<\/script>/g, " ")
        .replace(/<style[\s\S]*?<\/style>/g, " ")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ");
    const wordCount = decodeEntities(text).trim().split(" ").filter(Boolean).length;

    const jsonLdTypes: string[] = [];
    for (const m of html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
        for (const t of m[1].matchAll(/"@type":"([^"]+)"/g)) jsonLdTypes.push(t[1]);
    }

    let imagesWithoutAlt = 0;
    for (const m of html.matchAll(/<img\b[^>]*>/g)) {
        if (!/\balt="/.test(m[0])) imagesWithoutAlt++;
    }

    const internalLinks: string[] = [];
    for (const m of html.matchAll(/href="(\/[^"#?]*)"/g)) {
        internalLinks.push(m[1].replace(/\/$/, "") || "/");
    }

    return {
        route: routeOf(file),
        file: path.relative(ROOT, file),
        title: title ? decodeEntities(title) : null,
        description: description ? decodeEntities(description) : null,
        canonical,
        robots,
        h1Count,
        wordCount,
        jsonLdTypes: [...new Set(jsonLdTypes)],
        imagesWithoutAlt,
        internalLinks,
        ogImage,
        ogTitle: ogTitle ? decodeEntities(ogTitle) : null,
        twitterTitle: twitterTitle ? decodeEntities(twitterTitle) : null,
        h1Text: h1Raw ? decodeEntities(h1Raw.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim() : null,
        headline: headline ? decodeEntities(headline.replace(/\\"/g, '"')) : null,
    };
}

if (!fs.existsSync(APP_DIR)) {
    console.error("빌드 산출물이 없습니다. npm run build 후 실행하세요.");
    process.exit(1);
}

// Next.js 내부 페이지(_not-found, _global-error)는 검수 대상이 아니다
const INTERNAL_ROUTES = new Set(["/_not-found", "/_global-error"]);
const pages = collectHtml(APP_DIR)
    .map(analyze)
    .filter((p) => !p.route.includes("[") && !INTERNAL_ROUTES.has(p.route));

interface Issue {
    severity: "높음" | "중간" | "낮음";
    category: string;
    route: string;
    detail: string;
}
const issues: Issue[] = [];
const add = (severity: Issue["severity"], category: string, route: string, detail: string) =>
    issues.push({ severity, category, route, detail });

// 1) 메타 태그
for (const p of pages) {
    if (!p.title) add("높음", "title 누락", p.route, "");
    else {
        // 검색 결과는 픽셀 폭에서 잘리므로 한글 1, 라틴 0.5로 환산한 표시 폭으로 잰다 (check-titles.ts와 같은 기준)
        const len = [...p.title].reduce((w, ch) => w + (/[\p{Script=Hangul}\p{Script=Han}]/u.test(ch) ? 1 : 0.5), 0);
        if (len > 55) add("낮음", "title 과다 길이 (표시 폭 55 초과)", p.route, `폭 ${len}: ${p.title.slice(0, 70)}`);
        if (len < 15) add("중간", "title 과소 길이", p.route, `${len}자: ${p.title}`);
    }
    if (!p.description) add("높음", "description 누락", p.route, "");
    else {
        const len = p.description.length;
        if (len > 160) add("낮음", "description 과다 길이", p.route, `${len}자`);
        if (len < 50) add("중간", "description 과소 길이", p.route, `${len}자: ${p.description}`);
    }
    if (!p.canonical) add("중간", "canonical 누락", p.route, "");
    else {
        const expected = `${SITE_URL}${p.route === "/" ? "/" : p.route}`;
        const normalized = p.canonical.replace(/\/$/, "") || SITE_URL;
        const expectedNorm = expected.replace(/\/$/, "") || SITE_URL;
        if (decodeURIComponent(normalized) !== decodeURIComponent(expectedNorm)) {
            add("중간", "canonical 불일치", p.route, `선언: ${p.canonical}`);
        }
    }
    if (p.robots && /noindex/i.test(p.robots)) add("낮음", "noindex (의도 확인 필요)", p.route, p.robots);
    if (p.h1Count === 0) add("중간", "h1 없음", p.route, "");
    if (p.h1Count > 1) add("낮음", "h1 복수", p.route, `${p.h1Count}개`);
    if (p.imagesWithoutAlt > 0) add("낮음", "alt 없는 이미지", p.route, `${p.imagesWithoutAlt}개`);
    if (!p.ogImage) add("낮음", "og:image 누락", p.route, "");
}

// 2) 중복 title / description
const byTitle = new Map<string, string[]>();
const byDesc = new Map<string, string[]>();
for (const p of pages) {
    if (p.title) byTitle.set(p.title, [...(byTitle.get(p.title) ?? []), p.route]);
    if (p.description) byDesc.set(p.description, [...(byDesc.get(p.description) ?? []), p.route]);
}
for (const [title, routes] of byTitle) {
    if (routes.length > 1) add("중간", "title 중복", routes.join(", "), title.slice(0, 60));
}
for (const [desc, routes] of byDesc) {
    if (routes.length > 1) add("중간", "description 중복", routes.join(", "), desc.slice(0, 60));
}

// 3) 얇은 콘텐츠
for (const p of pages) {
    if (p.wordCount < 300 && !["/", "/tags"].includes(p.route)) {
        add("중간", "얇은 콘텐츠", p.route, `약 ${p.wordCount}단어`);
    }
}

// 4) 구조화 데이터
for (const p of pages) {
    if (p.jsonLdTypes.length === 0) add("낮음", "구조화 데이터 없음", p.route, "");
}

// 5) 고아 페이지 (다른 페이지에서 링크되지 않는 페이지)
const linkedTo = new Set<string>();
for (const p of pages) {
    for (const l of p.internalLinks) {
        if (l !== p.route) linkedTo.add(decodeURIComponent(l));
    }
}
for (const p of pages) {
    if (p.route === "/") continue;
    if (!linkedTo.has(decodeURIComponent(p.route))) {
        add("높음", "고아 페이지 (내부 링크 없음)", p.route, "");
    }
}

// 7) 제목 정합성: 검색 결과(title), 공유 카드(og/twitter), 화면(H1), 구조화 데이터(headline)가 같은 대상을 가리키는지
const SITE_NAME = "준이아빠블로그";
const titleCore = (t: string) =>
    t.replace(/\s*\|\s*준이아빠블로그\s*$/, "").replace(/^(Class|GA4 Edu|AI-Practice|Tags)\s*\|\s*/, "").trim();
const normTitle = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
const titleTokens = (s: string) =>
    new Set(s.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ").split(/\s+/).filter((t) => t.length >= 2));
const sharesToken = (a: string, b: string) => [...titleTokens(a)].some((t) => titleTokens(b).has(t));
const isContentDetail = (route: string) => /^\/insights\/[^/]+$/.test(route) || /^\/class\/[^/]+\/[^/]+$/.test(route);

for (const p of pages) {
    if (!p.title) continue;
    const core = titleCore(p.title);
    const withLabel = p.title.replace(/\s*\|\s*준이아빠블로그\s*$/, "").trim();
    if ((p.title.match(new RegExp(SITE_NAME, "g")) ?? []).length > 1) add("높음", "title에 브랜드 중복", p.route, p.title);
    // 홈은 브랜드 자체가 제목이라 og:title에 브랜드가 들어가는 것이 맞다
    if (p.route !== "/" && p.ogTitle?.includes(SITE_NAME)) add("중간", "og:title에 브랜드 포함 (og:site_name이 맡음)", p.route, p.ogTitle);
    if (p.twitterTitle && p.ogTitle && normTitle(p.twitterTitle) !== normTitle(p.ogTitle)) {
        add("중간", "twitter:title ≠ og:title", p.route, `${p.twitterTitle} / ${p.ogTitle}`);
    }
    // 허브 페이지 H1은 섹션 라벨("Class", "Tags")이라 라벨을 포함한 제목과 비교한다
    if (p.h1Text && !sharesToken(p.h1Text, withLabel)) add("중간", "H1과 title이 다른 대상 (겹치는 낱말 없음)", p.route, `H1=${p.h1Text} / title=${withLabel}`);
    if (isContentDetail(p.route)) {
        if (p.headline && normTitle(p.headline) !== normTitle(core)) add("중간", "JSON-LD headline ≠ title", p.route, `${p.headline} / ${core}`);
        // 콘텐츠 상세의 og:title은 metaTitle과 같거나(기본값) 공유용 문장(ogTitle)이다. 겹치는 낱말조차 없으면 다른 글처럼 보인다
        if (p.ogTitle && normTitle(p.ogTitle) !== normTitle(core) && !sharesToken(p.ogTitle, core)) {
            add("중간", "og:title이 title과 다른 대상", p.route, `${p.ogTitle} / ${core}`);
        }
    } else if (p.ogTitle && normTitle(p.ogTitle) !== normTitle(core)) {
        add("낮음", "og:title ≠ title (허브 페이지)", p.route, `${p.ogTitle} / ${core}`);
    }
}

// 6) 사이트맵 정합성
const sitemapFiles = ["0", "1", "2"].map((i) => path.join(APP_DIR, `sitemap/${i}.xml.body`));
const sitemapUrls: string[] = [];
for (const f of sitemapFiles) {
    if (!fs.existsSync(f)) continue;
    const xml = fs.readFileSync(f, "utf-8");
    sitemapUrls.push(...[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));
}
if (sitemapUrls.length === 0) {
    console.log("(사이트맵 본문 파일을 빌드 산출물에서 찾지 못해 라이브 검사로 대체 필요)");
} else {
    const sitemapPaths = new Set(
        sitemapUrls.map((u) => decodeURIComponent(new URL(u).pathname.replace(/\/$/, "") || "/")),
    );
    const pagePaths = new Set(pages.map((p) => decodeURIComponent(p.route)));
    for (const sp of sitemapPaths) {
        if (!pagePaths.has(sp)) add("높음", "사이트맵에 없는 페이지 등재", sp, "");
    }
    const noindexRoutes = new Set(
        pages.filter((p) => p.robots && /noindex/i.test(p.robots)).map((p) => decodeURIComponent(p.route)),
    );
    for (const pp of pagePaths) {
        // noindex 페이지는 사이트맵에 없는 것이 정상이다
        if (!sitemapPaths.has(pp) && !noindexRoutes.has(pp)) {
            add("중간", "사이트맵 미등재", pp, "");
        }
    }
}

// 출력
console.log(`분석한 페이지: ${pages.length}개\n`);
const order = { 높음: 0, 중간: 1, 낮음: 2 } as const;
issues.sort((a, b) => order[a.severity] - order[b.severity]);

const grouped = new Map<string, Issue[]>();
for (const i of issues) {
    const key = `[${i.severity}] ${i.category}`;
    grouped.set(key, [...(grouped.get(key) ?? []), i]);
}

if (issues.length === 0) {
    console.log("발견된 이슈 없음");
} else {
    for (const [key, list] of grouped) {
        console.log(`${key}: ${list.length}건`);
        for (const i of list.slice(0, 12)) {
            console.log(`   ${i.route}${i.detail ? `  ${i.detail}` : ""}`);
        }
        if (list.length > 12) console.log(`   ... 외 ${list.length - 12}건`);
        console.log("");
    }
}

console.log(`총 이슈: ${issues.length}건`);
