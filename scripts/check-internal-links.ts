/**
 * 죽은 내부 링크 검출 (read-only)
 *
 * Usage:
 *   npx tsx scripts/check-internal-links.ts
 *
 * 본문에서 /class/{course}/{slug}, /insights/{slug} URL을 모두 추출하여
 * 실제 콘텐츠 슬러그 집합과 비교. 차집합이 0이어야 통과.
 *
 * Exit code: 죽은 링크가 있으면 1, 없으면 0.
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";

const ROOT = process.cwd();
const INSIGHTS_DIR = path.join(ROOT, "content/insights");
const CLASSES_DIR = path.join(ROOT, "content/classes");

interface DeadLink {
  filePath: string;
  url: string;
  reason: string;
}

function listMd(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith(".md")).map((f) => path.join(dir, f));
}

function loadSlugSets(): {
  insightSlugs: Set<string>;
  classSlugByCourse: Map<string, Set<string>>;
} {
  const insightSlugs = new Set<string>();
  for (const fp of listMd(INSIGHTS_DIR)) {
    const slug = path.basename(fp, ".md");
    insightSlugs.add(slug);
  }

  const classSlugByCourse = new Map<string, Set<string>>();
  for (const fp of listMd(CLASSES_DIR)) {
    const raw = fs.readFileSync(fp, "utf-8");
    const { data } = matter(raw);
    const slug = (data.slug as string) ?? path.basename(fp, ".md");
    const courseSlug = data.courseSlug as string | undefined;
    if (!courseSlug) continue;
    const set = classSlugByCourse.get(courseSlug) ?? new Set<string>();
    set.add(slug);
    classSlugByCourse.set(courseSlug, set);
  }

  return { insightSlugs, classSlugByCourse };
}

function extractInternalLinks(content: string): string[] {
  const re = /\]\(([^)]+)\)/g;
  const result: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(content)) !== null) {
    const url = m[1].trim();
    if (url.startsWith("/insights/") || url.startsWith("/class/")) {
      result.push(url.split("#")[0].split("?")[0]);
    }
  }
  return result;
}

function checkUrl(
  url: string,
  insightSlugs: Set<string>,
  classSlugByCourse: Map<string, Set<string>>,
): string | null {
  if (url.startsWith("/insights/")) {
    const slug = url.replace(/^\/insights\//, "").replace(/\/$/, "");
    if (slug.length === 0) return "empty insight slug";
    if (!insightSlugs.has(slug)) return `unknown insight slug: ${slug}`;
    return null;
  }
  if (url.startsWith("/class/")) {
    const parts = url.replace(/^\/class\//, "").replace(/\/$/, "").split("/");
    if (parts.length !== 2) return `expected /class/{course}/{slug}, got: ${url}`;
    const [course, slug] = parts;
    const set = classSlugByCourse.get(course);
    if (!set) return `unknown course: ${course}`;
    if (!set.has(slug)) return `unknown class slug: ${course}/${slug}`;
    return null;
  }
  return null;
}

function main(): void {
  const { insightSlugs, classSlugByCourse } = loadSlugSets();
  const dead: DeadLink[] = [];
  let totalLinks = 0;

  const allFiles = [...listMd(INSIGHTS_DIR), ...listMd(CLASSES_DIR)];
  for (const fp of allFiles) {
    const raw = fs.readFileSync(fp, "utf-8");
    const { content } = matter(raw);
    const urls = extractInternalLinks(content);
    totalLinks += urls.length;
    for (const url of urls) {
      const reason = checkUrl(url, insightSlugs, classSlugByCourse);
      if (reason) {
        dead.push({ filePath: path.relative(ROOT, fp), url, reason });
      }
    }
  }

  console.log(`Internal link check`);
  console.log(`  Files scanned: ${allFiles.length}`);
  console.log(`  Internal links: ${totalLinks}`);
  console.log(`  Dead links: ${dead.length}`);

  if (dead.length > 0) {
    console.log("");
    for (const d of dead) {
      console.log(`  ✗ ${d.filePath}  →  ${d.url}  (${d.reason})`);
    }
    process.exit(1);
  } else {
    console.log("  ✓ All internal links resolve.");
  }
}

main();
