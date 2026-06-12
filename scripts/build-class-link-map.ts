/**
 * Class 사전(class-link-map) 자동 생성 CLI
 *
 * Usage:
 *   npx tsx scripts/build-class-link-map.ts
 *
 * 출력: scripts/data/class-link-map.json
 *
 * 흐름:
 *   1) content/classes/*.md 모두 읽어 frontmatter 추출
 *   2) term + aliases에서 searchTerms 자동 도출
 *   3) slug 패턴으로 linkPriority 자동 추정 (사람이 사후 보정)
 *   4) JSON 출력
 *
 * 사람이 후처리할 항목:
 *   - linkPriority 미세 조정
 *   - searchTerms 모호어 제거 / 변형 추가
 *   - enabled = false 로 매칭 제외 클래스 지정
 *   - 최상위 denyList 보강
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CLASSES_DIR = path.join(process.cwd(), "content/classes");
const OUTPUT_PATH = path.join(process.cwd(), "scripts/data/class-link-map.json");

type Category = "MARKETING" | "AI_TECH" | "DATA" | "CLAUDE_EDUCATION";
type LinkPriority = 1 | 2 | 3;

interface ClassFrontmatter {
  slug: string;
  term: string;
  courseSlug: string;
  category: Category;
  aliases?: string[];
}

interface ClassLinkEntry {
  slug: string;
  courseSlug: string;
  url: string;
  category: Category;
  term: string;
  aliases: string[];
  searchTerms: string[];
  linkPriority: LinkPriority;
  enabled: boolean;
}

interface ClassLinkMap {
  generatedAt: string;
  totalClasses: number;
  denyList: string[];
  classes: ClassLinkEntry[];
}

const LEARNING_VERB_SUFFIXES = [
  "이해하기",
  "비교하기",
  "활용하기",
  "알아보기",
  "시작하기",
  "다루기",
  "쓰는 법",
  "써보기",
  "정리하기",
  "살펴보기",
];

const DEFAULT_DENY_LIST = [
  "AI",
  "API",
  "AI 도구",
  "기술",
  "도구",
  "Code",
  "Claude API",
  "claude.ai",
  "claude.ai/code",
  "Anthropic CLI",
  "보조 에이전트",
  "자동 실행 규칙",
  "코딩 에이전트",
  "CLI 코딩 에이전트",
  "디자인 에이전트",
  "초보자를 위한 Anthropic",
  "입문자를 위한 Claude",
  "초보자를 위한",
  "입문자를 위한",
  "앤트로픽 AI 어시스턴트",
  "Claude 만든 회사",
];

function readClassFrontmatters(): ClassFrontmatter[] {
  return fs
    .readdirSync(CLASSES_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((filename) => {
      const raw = fs.readFileSync(path.join(CLASSES_DIR, filename), "utf-8");
      const { data } = matter(raw);
      return {
        slug: data.slug as string,
        term: data.term as string,
        courseSlug: data.courseSlug as string,
        category: data.category as Category,
        aliases: data.aliases as string[] | undefined,
      };
    });
}

function stripLearningVerbs(term: string): string {
  let core = term;
  for (const verb of LEARNING_VERB_SUFFIXES) {
    core = core.replace(new RegExp(`\\s*${verb}\\s*$`), "");
  }
  return core.trim();
}

function extractParens(text: string): string[] {
  const matches = text.match(/\(([^)]+)\)/g) ?? [];
  return matches
    .map((m) => m.slice(1, -1))
    .flatMap((content) => content.split(/[·,，、/]/))
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

function extractEnglishTerms(text: string): string[] {
  const matches = text.match(/[A-Z][a-zA-Z0-9]+(?:[ \-][A-Z][a-zA-Z0-9]+)*/g) ?? [];
  return matches.map((m) => m.trim()).filter((m) => m.length >= 3);
}

function buildSearchTerms(term: string, aliases: string[]): string[] {
  const set = new Set<string>();

  for (const a of aliases) {
    if (a.trim().length > 0) set.add(a.trim());
  }

  const core = stripLearningVerbs(term);
  const mainPart = core.replace(/\s*\([^)]*\)\s*/g, " ").replace(/\s+/g, " ").trim();
  if (mainPart.length > 0) set.add(mainPart);

  for (const p of extractParens(core)) set.add(p);
  for (const eng of extractEnglishTerms(term)) set.add(eng);

  return Array.from(set).sort((a, b) => b.length - a.length);
}

function inferLinkPriority(slug: string, _category: Category): LinkPriority {
  if (slug.startsWith("what-is-") || slug.startsWith("what-are-")) return 1;
  if (slug.includes("installation") || slug.includes("setup") || slug.includes("install")) return 3;
  return 2;
}

function buildEntry(fm: ClassFrontmatter): ClassLinkEntry {
  const aliases = fm.aliases ?? [];
  return {
    slug: fm.slug,
    courseSlug: fm.courseSlug,
    url: `/class/${fm.courseSlug}/${fm.slug}`,
    category: fm.category,
    term: fm.term,
    aliases,
    searchTerms: buildSearchTerms(fm.term, aliases),
    linkPriority: inferLinkPriority(fm.slug, fm.category),
    enabled: true,
  };
}

function main(): void {
  const frontmatters = readClassFrontmatters();
  const entries = frontmatters
    .map(buildEntry)
    .sort((a, b) => {
      if (a.linkPriority !== b.linkPriority) return a.linkPriority - b.linkPriority;
      if (a.courseSlug !== b.courseSlug) return a.courseSlug.localeCompare(b.courseSlug);
      return a.slug.localeCompare(b.slug);
    });

  const map: ClassLinkMap = {
    generatedAt: new Date().toISOString(),
    totalClasses: entries.length,
    denyList: DEFAULT_DENY_LIST,
    classes: entries,
  };

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(map, null, 2) + "\n", "utf-8");

  console.log(`✓ Generated ${OUTPUT_PATH}`);
  console.log(`  Total classes: ${entries.length}`);
  const byPriority = entries.reduce<Record<LinkPriority, number>>(
    (acc, e) => {
      acc[e.linkPriority] = (acc[e.linkPriority] ?? 0) + 1;
      return acc;
    },
    { 1: 0, 2: 0, 3: 0 },
  );
  console.log(`  Priority 1 (high): ${byPriority[1]}`);
  console.log(`  Priority 2 (mid):  ${byPriority[2]}`);
  console.log(`  Priority 3 (low):  ${byPriority[3]}`);
}

main();
