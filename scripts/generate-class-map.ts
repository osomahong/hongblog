/**
 * 클래스 슬러그 → 코스 슬러그 매핑 생성.
 *
 * 미들웨어(edge)는 파일시스템을 읽을 수 없으므로, 잘못된 코스 경로로 들어온 요청을
 * 정규 경로로 301 리디렉트하려면 정적 매핑이 필요하다.
 *
 * Run: npx tsx scripts/generate-class-map.ts   (prebuild에서 자동 실행)
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const ROOT = process.cwd();
const CLASSES_DIR = path.join(ROOT, "content/classes");
const OUT_FILE = path.join(ROOT, "src/lib/generated/class-course-map.ts");

const entries = fs
    .readdirSync(CLASSES_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
        const raw = fs.readFileSync(path.join(CLASSES_DIR, f), "utf-8");
        const { data } = matter(raw);
        const slug = String(data.slug ?? f.replace(/\.md$/, ""));
        const courseSlug = String(data.courseSlug ?? "");
        return { slug, courseSlug };
    })
    .filter((e) => e.courseSlug)
    .sort((a, b) => a.slug.localeCompare(b.slug));

const body = entries.map((e) => `  "${e.slug}": "${e.courseSlug}",`).join("\n");

const output = `// 이 파일은 scripts/generate-class-map.ts가 생성합니다. 직접 수정하지 마세요.
// content/classes/*.md의 slug와 courseSlug에서 생성됩니다.

export const CLASS_COURSE_MAP: Record<string, string> = {
${body}
};
`;

fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });

const previous = fs.existsSync(OUT_FILE) ? fs.readFileSync(OUT_FILE, "utf-8") : "";
if (previous === output) {
    console.log(`class-course-map 변경 없음 (${entries.length}개)`);
} else {
    fs.writeFileSync(OUT_FILE, output);
    console.log(`class-course-map 생성 완료 (${entries.length}개) -> ${path.relative(ROOT, OUT_FILE)}`);
}
