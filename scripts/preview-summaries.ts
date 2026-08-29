/**
 * 3줄 요약 미리보기.
 *
 * 자동 추출이 어떤 문장을 고르는지 확인해 frontmatter `summary3`로 손볼 글을 찾는 용도다.
 *
 *   npx tsx scripts/preview-summaries.ts                    # 인사이트 전체
 *   npx tsx scripts/preview-summaries.ts --type class       # 클래스 전체
 *   npx tsx scripts/preview-summaries.ts --slug what-is-mcp # 슬러그 하나
 *   npx tsx scripts/preview-summaries.ts --short            # 세 줄을 못 채운 글만
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { buildCourseSummary3, buildSummary3, SUMMARY_LINE_COUNT } from "../src/lib/summary";
import { getClassesByCourse } from "../src/lib/content";

const DIRS: Record<string, string> = {
  insight: path.join(process.cwd(), "content", "insights"),
  class: path.join(process.cwd(), "content", "classes"),
  course: path.join(process.cwd(), "content", "courses"),
};

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

const type = arg("type") ?? "insight";
const slug = arg("slug");
const onlyShort = process.argv.includes("--short");

const dir = DIRS[type];
if (!dir) {
  console.error(`알 수 없는 타입: ${type}. insight, class, course 중 하나를 쓴다.`);
  process.exit(1);
}

const files = fs
  .readdirSync(dir)
  .filter((f) => f.endsWith(".md"))
  .filter((f) => !slug || f === `${slug}.md`);

let shortCount = 0;

for (const file of files) {
  const { data, content } = matter(fs.readFileSync(path.join(dir, file), "utf-8"));
  const lead = (data.excerpt as string) || (data.definition as string) || "";
  const lines =
    type === "course"
      ? buildCourseSummary3({
          description: content,
          metaDescription: data.metaDescription as string | undefined,
          classTerms: getClassesByCourse(data.slug as string).map((c) => c.term),
          manual: data.summary3,
        })
      : buildSummary3({ lead, content, manual: data.summary3 });

  if (lines.length < SUMMARY_LINE_COUNT) shortCount += 1;
  if (onlyShort && lines.length >= SUMMARY_LINE_COUNT) continue;

  const manual = Array.isArray(data.summary3) ? " [수동]" : "";
  console.log(`\n## ${file.replace(/\.md$/, "")}${manual}`);
  lines.forEach((line, i) => console.log(`  ${i + 1}. ${line}`));
}

console.log(`\n총 ${files.length}편, 세 줄을 못 채운 글 ${shortCount}편`);
