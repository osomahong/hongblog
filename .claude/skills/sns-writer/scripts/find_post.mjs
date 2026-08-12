#!/usr/bin/env node
/**
 * 블로그 콘텐츠 검색기. 사용자가 "OO글"처럼 부분 제목으로 부를 때 후보를 찾는다.
 * insight, class, course 세 종류를 모두 검색한다.
 *
 * 사용법:
 *   node find_post.mjs "젠스파크"        # 키워드로 검색 (제목, slug, 발췌 대상)
 *   node find_post.mjs --latest [n]      # 최근 발행 n건 (기본 5)
 *   node find_post.mjs --pending [n]     # SNS 카피를 아직 안 만든 최근 콘텐츠 n건 (기본 5)
 *   node find_post.mjs --slug <slug>     # slug로 정확히 하나, 본문까지 출력
 *
 * class는 제목이 term, 설명이 definition 필드에 들어 있어 그대로 매핑한다.
 * course는 자체 slug가 courseSlug이며 URL은 /class/{slug}로 만든다.
 * 출력은 JSON. 여러 건이 나오면 사용자에게 어느 글인지 되묻는다.
 * 프로젝트 루트에서 실행해야 gray-matter를 찾는다.
 */
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "../../../..");
const SITE = "https://www.digitalmarketer.co.kr";
const LOG_PATH = join(dirname(fileURLToPath(import.meta.url)), "../data/sns-log.json");
const DIRS = ["content/insights", "content/classes", "content/courses"];

// class는 courseSlug가 필요해 URL을 조립한다. course는 slug 자체가 코스 경로다.
function buildUrl(type, data) {
  if (type === "insight" && data.slug) return `${SITE}/insights/${data.slug}`;
  if (type === "class" && data.slug && data.courseSlug)
    return `${SITE}/class/${data.courseSlug}/${data.slug}`;
  if (type === "course" && data.slug) return `${SITE}/class/${data.slug}`;
  return "";
}

function typeOf(dir) {
  if (dir.includes("insights")) return "insight";
  if (dir.includes("classes")) return "class";
  return "course";
}

function loadAll() {
  const posts = [];
  for (const dir of DIRS) {
    let files;
    try {
      files = readdirSync(join(ROOT, dir)).filter((f) => f.endsWith(".md"));
    } catch {
      continue;
    }
    for (const f of files) {
      const { data, content } = matter(readFileSync(join(ROOT, dir, f), "utf8"));
      const type = typeOf(dir);
      // 타입마다 제목과 발췌가 담긴 필드가 다르다.
      const title = data.title || data.term || "";
      const excerpt = data.excerpt || data.definition || data.metaDescription || "";
      posts.push({
        slug: data.slug || f.replace(/\.md$/, ""),
        title,
        excerpt,
        category: data.category || "",
        tags: data.tags || [],
        highlights: data.highlights || [],
        courseSlug: data.courseSlug || (type === "course" ? data.slug : ""),
        publishedAt: data.publishedAt ? new Date(data.publishedAt).toISOString() : "",
        type,
        url: buildUrl(type, data),
        path: `${dir}/${f}`,
        body: content,
      });
    }
  }
  return posts.sort((a, b) => (b.publishedAt || "").localeCompare(a.publishedAt || ""));
}

// 이미 SNS 카피를 만든 slug 집합. 로그가 없으면 빈 집합.
function loggedSlugs() {
  if (!existsSync(LOG_PATH)) return new Set();
  try {
    const log = JSON.parse(readFileSync(LOG_PATH, "utf8"));
    return new Set(Object.keys(log.entries || {}));
  } catch {
    return new Set();
  }
}

const args = process.argv.slice(2);
const posts = loadAll();
const brief = ({ body, ...rest }) => rest;

if (args[0] === "--latest") {
  console.log(JSON.stringify(posts.slice(0, Number(args[1]) || 5).map(brief), null, 2));
} else if (args[0] === "--pending") {
  const done = loggedSlugs();
  const pending = posts.filter((p) => !done.has(p.slug));
  console.log(JSON.stringify(pending.slice(0, Number(args[1]) || 5).map(brief), null, 2));
} else if (args[0] === "--slug") {
  const hit = posts.find((p) => p.slug === args[1]);
  if (!hit) {
    console.log(JSON.stringify({ error: `slug 없음: ${args[1]}` }));
    process.exit(1);
  }
  console.log(JSON.stringify(hit, null, 2));
} else if (args[0]) {
  const norm = (s) => String(s).toLowerCase().replace(/\s+/g, "");
  const q = norm(args.join(" "));
  const hits = posts.filter(
    (p) => norm(p.title).includes(q) || norm(p.slug).includes(q) || norm(p.excerpt).includes(q),
  );
  console.log(JSON.stringify(hits.slice(0, 8).map(brief), null, 2));
} else {
  console.log("사용법: find_post.mjs <키워드> | --latest [n] | --pending [n] | --slug <slug>");
  process.exit(1);
}
