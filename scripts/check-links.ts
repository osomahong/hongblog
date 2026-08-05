/**
 * 내부 링크 무결성 검사.
 *
 * 두 층위를 검사한다.
 *   1) 콘텐츠 소스: MD 본문의 마크다운 링크, frontmatter의 relatedTerms
 *   2) 빌드 산출물: .next/server/app 아래 생성된 HTML의 모든 내부 href
 *
 * Run: npx tsx scripts/check-links.ts          (소스만 검사, 빌드 불필요)
 *      npx tsx scripts/check-links.ts --html   (빌드 산출물까지 검사, npm run build 선행 필요)
 *
 * 잘못된 링크가 하나라도 있으면 exit code 1로 종료한다.
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const ROOT = process.cwd();
const CLASSES_DIR = path.join(ROOT, "content/classes");
const INSIGHTS_DIR = path.join(ROOT, "content/insights");
const COURSES_DIR = path.join(ROOT, "content/courses");

interface Problem {
    source: string;
    href: string;
    reason: string;
}

function readAll(dir: string): { file: string; data: Record<string, unknown>; content: string }[] {
    if (!fs.existsSync(dir)) return [];
    return fs
        .readdirSync(dir)
        .filter((f) => f.endsWith(".md"))
        .map((f) => {
            const raw = fs.readFileSync(path.join(dir, f), "utf-8");
            const { data, content } = matter(raw);
            return { file: f, data: data as Record<string, unknown>, content };
        });
}

const classes = readAll(CLASSES_DIR);
const insights = readAll(INSIGHTS_DIR);
const courses = readAll(COURSES_DIR);

/** 실제로 존재하는 라우트 집합 */
const validRoutes = new Set<string>([
    "/",
    "/insights",
    "/class",
    "/tags",
    "/about",
    "/rss.xml",
    "/sitemap.xml",
    "/robots.txt",
    "/llms.txt",
    "/ai-practice",
]);

// AI-Practice 하위 페이지는 앱 디렉터리에서 파생시킨다 (새 AIPBL이 생겨도 자동 반영)
const AI_PRACTICE_DIR = path.join(ROOT, "src/app/ai-practice");
if (fs.existsSync(AI_PRACTICE_DIR)) {
    for (const entry of fs.readdirSync(AI_PRACTICE_DIR, { withFileTypes: true })) {
        if (entry.isDirectory() && fs.existsSync(path.join(AI_PRACTICE_DIR, entry.name, "page.tsx"))) {
            validRoutes.add(`/ai-practice/${entry.name}`);
        }
    }
}

const classBySlug = new Map<string, { courseSlug: string }>();
for (const c of classes) {
    const slug = String(c.data.slug ?? c.file.replace(/\.md$/, ""));
    const courseSlug = String(c.data.courseSlug ?? "");
    classBySlug.set(slug, { courseSlug });
    if (courseSlug) validRoutes.add(`/class/${courseSlug}/${slug}`);
}
for (const c of courses) validRoutes.add(`/class/${String(c.data.slug ?? c.file.replace(/\.md$/, ""))}`);
for (const i of insights) validRoutes.add(`/insights/${String(i.data.slug ?? i.file.replace(/\.md$/, ""))}`);

const tagSet = new Set<string>();
for (const item of [...classes, ...insights]) {
    for (const tag of (item.data.tags as string[] | undefined) ?? []) tagSet.add(tag);
}
for (const tag of tagSet) validRoutes.add(`/tags/${encodeURIComponent(tag)}`);

const problems: Problem[] = [];

/** 내부 링크인지 판단하고, 검사 대상 경로로 정규화한다. */
function normalize(href: string): string | null {
    if (!href.startsWith("/")) return null; // 외부 링크, 앵커, mailto 등은 대상 아님
    const withoutHash = href.split("#")[0].split("?")[0];
    if (withoutHash === "") return null;
    if (/\.(png|jpg|jpeg|webp|svg|ico|txt|xml|json|pdf|gif|avif)$/i.test(withoutHash)) return null;
    if (withoutHash.startsWith("/_next/") || withoutHash.startsWith("/images/") || withoutHash.startsWith("/og/")) return null;
    return withoutHash.length > 1 ? withoutHash.replace(/\/$/, "") : withoutHash;
}

function checkHref(source: string, rawHref: string) {
    const href = normalize(rawHref);
    if (href === null) return;

    if (href.includes("//")) {
        problems.push({ source, href: rawHref, reason: "빈 경로 조각 (코스 슬러그 누락 추정)" });
        return;
    }
    if (validRoutes.has(href)) return;

    // 태그는 인코딩 형태가 다양하므로 디코딩해서 한 번 더 확인
    if (href.startsWith("/tags/")) {
        const decoded = `/tags/${decodeURIComponent(href.slice("/tags/".length))}`;
        if (tagSet.has(decodeURIComponent(href.slice("/tags/".length))) || validRoutes.has(decoded)) return;
        problems.push({ source, href: rawHref, reason: "존재하지 않는 태그" });
        return;
    }

    // 클래스 경로면 원인을 구체적으로 알려준다
    const m = href.match(/^\/class\/([^/]+)\/([^/]+)$/);
    if (m) {
        const [, courseSlug, classSlug] = m;
        const cls = classBySlug.get(classSlug);
        if (!cls) {
            problems.push({ source, href: rawHref, reason: "존재하지 않는 클래스 슬러그" });
        } else if (cls.courseSlug !== courseSlug) {
            problems.push({
                source,
                href: rawHref,
                reason: `코스 불일치 (실제 코스: ${cls.courseSlug})`,
            });
        } else {
            problems.push({ source, href: rawHref, reason: "라우트 미생성" });
        }
        return;
    }

    problems.push({ source, href: rawHref, reason: "존재하지 않는 경로" });
}

// 1) 콘텐츠 소스 검사
for (const [dirName, items] of [["classes", classes], ["insights", insights], ["courses", courses]] as const) {
    for (const item of items) {
        const source = `content/${dirName}/${item.file}`;

        // 코드 블록과 pre 블록 안의 href는 교육용 예시라 실제 링크가 아니다
        const body = item.content
            .replace(/```[\s\S]*?```/g, "")
            .replace(/<pre[\s\S]*?<\/pre>/g, "")
            .replace(/`[^`\n]*`/g, "");

        for (const match of body.matchAll(/\[[^\]]*\]\(([^)\s]+)/g)) {
            checkHref(source, match[1]);
        }
        for (const match of body.matchAll(/href="([^"]+)"/g)) {
            checkHref(source, match[1]);
        }

        for (const term of (item.data.relatedTerms as string[] | undefined) ?? []) {
            if (!classBySlug.get(term)) {
                problems.push({ source, href: `relatedTerms: ${term}`, reason: "존재하지 않는 클래스 슬러그" });
            }
        }

        const courseSlug = item.data.courseSlug as string | undefined;
        if (dirName === "classes") {
            if (!courseSlug) {
                problems.push({ source, href: "(frontmatter)", reason: "courseSlug 누락" });
            } else if (!courses.some((c) => String(c.data.slug ?? c.file.replace(/\.md$/, "")) === courseSlug)) {
                problems.push({ source, href: `courseSlug: ${courseSlug}`, reason: "존재하지 않는 코스" });
            }
        }
    }
}

// 2) 생성된 클래스-코스 매핑이 최신인지 검사 (미들웨어 301 리디렉트의 근거 데이터)
const MAP_FILE = path.join(ROOT, "src/lib/generated/class-course-map.ts");
if (fs.existsSync(MAP_FILE)) {
    const mapSource = fs.readFileSync(MAP_FILE, "utf-8");
    const mapped = new Map<string, string>();
    for (const m of mapSource.matchAll(/^\s*"([^"]+)":\s*"([^"]+)",$/gm)) {
        mapped.set(m[1], m[2]);
    }
    for (const [slug, info] of classBySlug) {
        if (!info.courseSlug) continue;
        if (mapped.get(slug) !== info.courseSlug) {
            problems.push({
                source: "src/lib/generated/class-course-map.ts",
                href: slug,
                reason: "매핑이 콘텐츠와 불일치 (npx tsx scripts/generate-class-map.ts 실행 필요)",
            });
        }
    }
    for (const slug of mapped.keys()) {
        if (!classBySlug.has(slug)) {
            problems.push({
                source: "src/lib/generated/class-course-map.ts",
                href: slug,
                reason: "삭제된 클래스가 매핑에 남아 있음",
            });
        }
    }
} else {
    problems.push({
        source: "src/lib/generated/class-course-map.ts",
        href: "(파일 없음)",
        reason: "npx tsx scripts/generate-class-map.ts 실행 필요",
    });
}

// 3) 빌드 산출물 검사 (옵션)
if (process.argv.includes("--html")) {
    const APP_DIR = path.join(ROOT, ".next/server/app");
    if (!fs.existsSync(APP_DIR)) {
        console.error("빌드 산출물이 없습니다. npm run build 후 다시 실행하세요.");
        process.exit(1);
    }
    const htmlFiles: string[] = [];
    const walk = (dir: string) => {
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
            const full = path.join(dir, entry.name);
            if (entry.isDirectory()) walk(full);
            else if (entry.name.endsWith(".html")) htmlFiles.push(full);
        }
    };
    walk(APP_DIR);

    for (const file of htmlFiles) {
        const html = fs.readFileSync(file, "utf-8");
        const source = path.relative(ROOT, file);
        for (const match of html.matchAll(/href="([^"]+)"/g)) {
            checkHref(source, match[1]);
        }
    }
    console.log(`빌드 HTML ${htmlFiles.length}개 검사 완료`);
}

console.log(`유효 라우트 ${validRoutes.size}개 기준으로 검사했습니다.`);

if (problems.length === 0) {
    console.log("깨진 내부 링크가 없습니다.");
    process.exit(0);
}

console.error(`\n깨진 내부 링크 ${problems.length}건:\n`);
const byReason = new Map<string, Problem[]>();
for (const p of problems) {
    const list = byReason.get(p.reason) ?? [];
    list.push(p);
    byReason.set(p.reason, list);
}
for (const [reason, list] of byReason) {
    console.error(`[${reason}] ${list.length}건`);
    for (const p of list.slice(0, 30)) {
        console.error(`  ${p.source}  ->  ${p.href}`);
    }
    if (list.length > 30) console.error(`  ... 외 ${list.length - 30}건`);
    console.error("");
}
process.exit(1);
