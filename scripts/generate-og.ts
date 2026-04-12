/**
 * og:image 썸네일 생성 CLI
 *
 * Usage:
 *   npx tsx scripts/generate-og.ts --slug <slug>                  # 단일 (insights에서 검색)
 *   npx tsx scripts/generate-og.ts --slug <slug> --type class     # 타입 지정
 *   npx tsx scripts/generate-og.ts --batch --type post            # ogImage 없는 항목 일괄
 *   npx tsx scripts/generate-og.ts --all                          # 모든 타입, ogImage 없는 항목
 *   npx tsx scripts/generate-og.ts --default                      # 비콘텐츠 페이지용 og-default.png
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { buildSvg, buildDefaultSvg } from "./lib/og-template.js";
import { renderPng } from "./lib/og-render.js";

type ContentType = "post" | "class" | "course";
type Category = "MARKETING" | "AI_TECH" | "DATA";

const CONTENT_DIRS: Record<ContentType, string> = {
  post: path.join(process.cwd(), "content/insights"),
  class: path.join(process.cwd(), "content/classes"),
  course: path.join(process.cwd(), "content/courses"),
};

const OUTPUT_DIR = path.join(process.cwd(), "public/og");

interface ContentMeta {
  slug: string;
  title: string;
  category: Category;
  tags: string[];
  ogImage?: string;
  filePath: string;
}

function readContentMeta(filePath: string): ContentMeta | null {
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data } = matter(raw);

  const title = data.title || data.term;
  if (!title || !data.category) return null;

  return {
    slug: data.slug || path.basename(filePath, ".md"),
    title,
    category: data.category as Category,
    tags: Array.isArray(data.tags) ? data.tags : [],
    ogImage: data.ogImage,
    filePath,
  };
}

function findContent(slug: string, type?: ContentType): ContentMeta | null {
  const types: ContentType[] = type ? [type] : ["post", "class"];

  for (const t of types) {
    const dir = CONTENT_DIRS[t];
    if (!fs.existsSync(dir)) continue;

    const filePath = path.join(dir, `${slug}.md`);
    if (fs.existsSync(filePath)) {
      return readContentMeta(filePath);
    }
  }
  return null;
}

function listContentMissing(type: ContentType): ContentMeta[] {
  const dir = CONTENT_DIRS[type];
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => readContentMeta(path.join(dir, f)))
    .filter((m): m is ContentMeta => m !== null && !m.ogImage);
}

function listContentAll(type: ContentType): ContentMeta[] {
  const dir = CONTENT_DIRS[type];
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => readContentMeta(path.join(dir, f)))
    .filter((m): m is ContentMeta => m !== null);
}

function updateFrontmatter(filePath: string, ogImagePath: string): void {
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  data.ogImage = ogImagePath;
  fs.writeFileSync(filePath, matter.stringify(content, data));
}

function generateOne(meta: ContentMeta): string {
  const svg = buildSvg({ title: meta.title, category: meta.category, tags: meta.tags });
  const png = renderPng(svg);

  const outputPath = path.join(OUTPUT_DIR, `${meta.slug}.png`);
  fs.writeFileSync(outputPath, png);

  const ogPath = `/og/${meta.slug}.png`;
  updateFrontmatter(meta.filePath, ogPath);

  return ogPath;
}

// --- CLI ---
function generateDefault(): void {
  const svg = buildDefaultSvg();
  const png = renderPng(svg);
  const outputPath = path.join(process.cwd(), "public/og-default.png");
  fs.writeFileSync(outputPath, png);
  console.log(`Generated: og-default.png (비콘텐츠 페이지용)`);
}

function parseArgs(): {
  slug?: string;
  type?: ContentType;
  batch: boolean;
  all: boolean;
  svgOnly: boolean;
  isDefault: boolean;
  force: boolean;
} {
  const args = process.argv.slice(2);
  let slug: string | undefined;
  let type: ContentType | undefined;
  let batch = false;
  let all = false;
  let svgOnly = false;
  let isDefault = false;
  let force = false;

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "--slug":
        slug = args[++i];
        break;
      case "--type":
        type = args[++i] as ContentType;
        break;
      case "--batch":
        batch = true;
        break;
      case "--all":
        all = true;
        break;
      case "--svg-only":
        svgOnly = true;
        break;
      case "--default":
        isDefault = true;
        break;
      case "--force":
        force = true;
        break;
    }
  }

  return { slug, type, batch, all, svgOnly, isDefault, force };
}

function main(): void {
  const { slug, type, batch, all, svgOnly, isDefault, force } = parseArgs();

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // --default: 비콘텐츠 페이지용 og-default.png
  if (isDefault) {
    generateDefault();
    return;
  }

  // --svg-only: SVG 파일로 저장 (디버그용)
  if (svgOnly && slug) {
    const meta = findContent(slug, type);
    if (!meta) {
      console.error(`Content not found: ${slug}`);
      process.exit(1);
    }
    const svg = buildSvg({ title: meta.title, category: meta.category, tags: meta.tags });
    const svgPath = path.join(OUTPUT_DIR, `${meta.slug}.svg`);
    fs.writeFileSync(svgPath, svg);
    console.log(`SVG saved: ${svgPath}`);
    return;
  }

  // 단일 생성
  if (slug) {
    const meta = findContent(slug, type);
    if (!meta) {
      console.error(`Content not found: ${slug}`);
      process.exit(1);
    }
    const ogPath = generateOne(meta);
    console.log(`Generated: ${meta.slug} → ${ogPath}`);
    return;
  }

  // 배치 생성
  if (batch || all) {
    const types: ContentType[] = all ? ["post", "class", "course"] : type ? [type] : [];
    if (types.length === 0) {
      console.error("--batch requires --type or use --all");
      process.exit(1);
    }

    let count = 0;
    for (const t of types) {
      const items = force ? listContentAll(t) : listContentMissing(t);
      for (const item of items) {
        const ogPath = generateOne(item);
        console.log(`Generated: ${item.slug} → ${ogPath}`);
        count++;
      }
    }
    console.log(`\nTotal: ${count} thumbnails generated`);
    return;
  }

  console.error(
    "Usage:\n" +
      "  npx tsx scripts/generate-og.ts --slug <slug>\n" +
      "  npx tsx scripts/generate-og.ts --batch --type post\n" +
      "  npx tsx scripts/generate-og.ts --all\n" +
      "  npx tsx scripts/generate-og.ts --all --force   # 기존 ogImage 무시, 전체 재생성",
  );
  process.exit(1);
}

main();
