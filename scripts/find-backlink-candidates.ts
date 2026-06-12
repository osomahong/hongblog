/**
 * Backlink candidate finder (read-only)
 *
 * Usage:
 *   npx tsx scripts/find-backlink-candidates.ts --target-slug what-is-claude
 *   npx tsx scripts/find-backlink-candidates.ts --target-course claude-fundamentals
 *   npx tsx scripts/find-backlink-candidates.ts --all --min-priority 1
 *   npx tsx scripts/find-backlink-candidates.ts --target-slug what-is-claude --type insight
 *   npx tsx scripts/find-backlink-candidates.ts --all --output /tmp/candidates.md
 *
 * 출력: stdout 또는 --output 지정 파일에 markdown 리포트.
 *
 * 매칭 규칙:
 *   - 코드 블록(```), 헤더(#), 인용(>), 표(|) 라인 제외
 *   - 한 라인에서 가장 긴 검색어 우선 (예: "Claude Code" > "Claude")
 *   - 영문 검색어는 단어 경계 체크 (앞뒤가 영숫자면 스킵)
 *   - 한 파일 안에서 도착 URL별 첫 등장만 표시
 *   - 이미 [...](url) 안에 있는 매칭은 alreadyLinked 표시
 *   - denyList에 있는 검색어는 제외
 */

import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const MAP_PATH = path.join(ROOT, "scripts/data/class-link-map.json");
const INSIGHTS_DIR = path.join(ROOT, "content/insights");
const CLASSES_DIR = path.join(ROOT, "content/classes");

type Category = "MARKETING" | "AI_TECH" | "DATA" | "CLAUDE_EDUCATION";
type LinkPriority = 1 | 2 | 3;
type FileType = "insight" | "class";

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

interface CliArgs {
  targetSlug: string | null;
  targetSlugs: string[] | null;
  targetCourse: string | null;
  all: boolean;
  type: FileType | "both";
  minPriority: LinkPriority;
  output: string | null;
  byFile: boolean;
}

interface Match {
  filePath: string;
  fileSlug: string;
  fileType: FileType;
  lineNumber: number;
  lineText: string;
  matchedTerm: string;
  alreadyLinked: boolean;
}

function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = {
    targetSlug: null,
    targetSlugs: null,
    targetCourse: null,
    all: false,
    type: "both",
    minPriority: 2,
    output: null,
    byFile: false,
  };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--target-slug") args.targetSlug = argv[++i];
    else if (a === "--target-slugs") args.targetSlugs = argv[++i].split(",").map((s) => s.trim()).filter(Boolean);
    else if (a === "--target-course") args.targetCourse = argv[++i];
    else if (a === "--all") args.all = true;
    else if (a === "--by-file") args.byFile = true;
    else if (a === "--type") {
      const t = argv[++i];
      if (t === "insight" || t === "class" || t === "both") args.type = t;
    } else if (a === "--min-priority") {
      const p = parseInt(argv[++i], 10);
      if (p === 1 || p === 2 || p === 3) args.minPriority = p;
    } else if (a === "--output") args.output = argv[++i];
  }
  return args;
}

function loadMap(): ClassLinkMap {
  const raw = fs.readFileSync(MAP_PATH, "utf-8");
  return JSON.parse(raw) as ClassLinkMap;
}

function readContentWithLineOffset(filePath: string): { content: string; offset: number } {
  const raw = fs.readFileSync(filePath, "utf-8");
  if (!raw.startsWith("---")) return { content: raw, offset: 0 };
  const lines = raw.split("\n");
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === "---") {
      return { content: lines.slice(i + 1).join("\n"), offset: i + 1 };
    }
  }
  return { content: raw, offset: 0 };
}

function stripCodeBlocks(content: string): string {
  const lines = content.split("\n");
  let inCode = false;
  return lines
    .map((line) => {
      if (/^\s*```/.test(line)) {
        inCode = !inCode;
        return "";
      }
      return inCode ? "" : line;
    })
    .join("\n");
}

function isExcludedLine(line: string): boolean {
  const trimmed = line.trim();
  if (trimmed.length === 0) return true;
  if (trimmed.startsWith("#")) return true;
  if (trimmed.startsWith(">")) return true;
  if (trimmed.startsWith("|")) return true;
  if (trimmed.startsWith("---")) return true;
  return false;
}

function isAsciiTerm(term: string): boolean {
  return /^[A-Za-z0-9 .\-_/]+$/.test(term);
}

function isWordBoundary(line: string, idx: number, term: string): boolean {
  if (!isAsciiTerm(term)) return true;
  const before = line[idx - 1];
  const after = line[idx + term.length];
  const re = /[A-Za-z0-9]/;
  if (before && re.test(before)) return false;
  if (after && re.test(after)) return false;
  return true;
}

function findLongestMatch(line: string, sortedTerms: string[]): { term: string; index: number } | null {
  for (const term of sortedTerms) {
    if (term.length === 0) continue;
    const idx = line.indexOf(term);
    if (idx < 0) continue;
    if (!isWordBoundary(line, idx, term)) continue;
    return { term, index: idx };
  }
  return null;
}

function isAlreadyLinked(line: string, matchIdx: number, matchLen: number): boolean {
  const re = /\[[^\]]*\]\([^)]*\)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line)) !== null) {
    const start = m.index;
    const end = m.index + m[0].length;
    if (matchIdx >= start && matchIdx + matchLen <= end) return true;
  }
  return false;
}

function buildGlobalTerms(
  map: ClassLinkMap,
  minPriority: LinkPriority,
): { termToClass: Map<string, ClassLinkEntry>; sortedTerms: string[] } {
  const deny = new Set(map.denyList);
  const termToClass = new Map<string, ClassLinkEntry>();

  // 매칭 풀은 항상 모든 enabled 클래스 (긴 매칭 우선 정확성을 위해)
  for (const cls of map.classes) {
    if (!cls.enabled) continue;
    for (const term of cls.searchTerms) {
      if (deny.has(term)) continue;
      if (term.length < 2) continue;
      const existing = termToClass.get(term);
      if (!existing || cls.linkPriority < existing.linkPriority) {
        termToClass.set(term, cls);
      }
    }
  }

  // 출력 시 minPriority 필터에 사용할 풀은 별도 처리
  // (sortedTerms는 매칭용 — 모든 우선순위 포함)
  const sortedTerms = Array.from(termToClass.keys()).sort((a, b) => b.length - a.length);
  return { termToClass, sortedTerms };
}

function passesOutputFilter(
  cls: ClassLinkEntry,
  args: CliArgs,
): boolean {
  if (cls.linkPriority > args.minPriority) return false;
  if (args.targetSlug && cls.slug !== args.targetSlug) return false;
  if (args.targetSlugs && !args.targetSlugs.includes(cls.slug)) return false;
  if (args.targetCourse && cls.courseSlug !== args.targetCourse) return false;
  return true;
}

function listFiles(type: "insight" | "class"): string[] {
  const dir = type === "insight" ? INSIGHTS_DIR : CLASSES_DIR;
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith(".md")).map((f) => path.join(dir, f));
}

function findCandidates(
  termToClass: Map<string, ClassLinkEntry>,
  sortedTerms: string[],
  args: CliArgs,
): Map<string, Match[]> {
  const result = new Map<string, Match[]>();
  const fileType = args.type;

  const targets: { type: FileType; files: string[] }[] = [];
  if (fileType !== "class") targets.push({ type: "insight", files: listFiles("insight") });
  if (fileType !== "insight") targets.push({ type: "class", files: listFiles("class") });

  for (const { type, files } of targets) {
    for (const filePath of files) {
      const fileSlug = path.basename(filePath, ".md");
      const { content, offset } = readContentWithLineOffset(filePath);
      const cleaned = stripCodeBlocks(content);
      const lines = cleaned.split("\n");
      const seenUrls = new Set<string>();

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (isExcludedLine(line)) continue;

        const m = findLongestMatch(line, sortedTerms);
        if (!m) continue;

        const target = termToClass.get(m.term);
        if (!target) continue;
        if (type === "class" && target.slug === fileSlug) continue;
        if (!passesOutputFilter(target, args)) continue;
        if (seenUrls.has(target.url)) continue;
        seenUrls.add(target.url);

        const alreadyLinked = isAlreadyLinked(line, m.index, m.term.length);
        const match: Match = {
          filePath,
          fileSlug,
          fileType: type,
          lineNumber: i + 1 + offset,
          lineText: line.trim(),
          matchedTerm: m.term,
          alreadyLinked,
        };

        if (!result.has(target.url)) result.set(target.url, []);
        const arr = result.get(target.url);
        if (arr) arr.push(match);
      }
    }
  }

  return result;
}

function relPath(absPath: string): string {
  return path.relative(ROOT, absPath);
}

interface FileGroupItem {
  match: Match;
  targetClass: ClassLinkEntry;
}

function renderReportByFile(
  candidates: Map<string, Match[]>,
  termToClass: Map<string, ClassLinkEntry>,
  args: CliArgs,
): string {
  const lines: string[] = [];
  lines.push(`# 백링크 후보 리포트 (파일 단위)`);
  lines.push("");
  lines.push(`- 생성: ${new Date().toISOString()}`);
  lines.push(`- 옵션: type=${args.type}, minPriority=${args.minPriority}, target=${args.targetSlug ?? args.targetCourse ?? "all"}`);
  lines.push("");

  const urlToClass = new Map<string, ClassLinkEntry>();
  for (const cls of termToClass.values()) urlToClass.set(cls.url, cls);

  // 파일 단위로 재구성
  const byFile = new Map<string, FileGroupItem[]>();
  for (const [url, matches] of candidates) {
    const cls = urlToClass.get(url);
    if (!cls) continue;
    for (const m of matches) {
      if (m.alreadyLinked) continue;
      const key = m.filePath;
      const arr = byFile.get(key) ?? [];
      arr.push({ match: m, targetClass: cls });
      byFile.set(key, arr);
    }
  }

  if (byFile.size === 0) {
    lines.push("매칭된 신규 후보가 없습니다.");
    return lines.join("\n");
  }

  const fileKeys = Array.from(byFile.keys()).sort();
  let totalCandidates = 0;
  for (const fp of fileKeys) {
    const items = byFile.get(fp);
    if (!items) continue;
    items.sort((a, b) => a.match.lineNumber - b.match.lineNumber);
    totalCandidates += items.length;

    lines.push(`## ${relPath(fp)}`);
    lines.push(`- 후보 수: ${items.length}`);
    for (const it of items) {
      const sliced = it.match.lineText.length > 120
        ? it.match.lineText.slice(0, 117) + "..."
        : it.match.lineText;
      lines.push(`- L${it.match.lineNumber} \`[${it.match.matchedTerm}]\` → ${it.targetClass.url} (p${it.targetClass.linkPriority})`);
      lines.push(`  > ${sliced}`);
    }
    lines.push("");
  }

  lines.unshift("");
  lines.unshift(`- 신규 후보 총합: **${totalCandidates}건** (${fileKeys.length}개 파일)`);

  return lines.join("\n");
}

function renderReport(
  candidates: Map<string, Match[]>,
  termToClass: Map<string, ClassLinkEntry>,
  args: CliArgs,
): string {
  const lines: string[] = [];
  lines.push(`# 백링크 후보 리포트`);
  lines.push("");
  lines.push(`- 생성: ${new Date().toISOString()}`);
  lines.push(`- 옵션: type=${args.type}, minPriority=${args.minPriority}, target=${args.targetSlug ?? args.targetCourse ?? "all"}`);
  lines.push("");

  const urlToClass = new Map<string, ClassLinkEntry>();
  for (const cls of termToClass.values()) urlToClass.set(cls.url, cls);

  const sortedUrls = Array.from(candidates.keys()).sort((a, b) => {
    const ca = urlToClass.get(a);
    const cb = urlToClass.get(b);
    if (!ca || !cb) return 0;
    if (ca.linkPriority !== cb.linkPriority) return ca.linkPriority - cb.linkPriority;
    return a.localeCompare(b);
  });

  if (sortedUrls.length === 0) {
    lines.push("매칭된 후보가 없습니다.");
    return lines.join("\n");
  }

  let totalNew = 0;
  let totalAlready = 0;

  for (const url of sortedUrls) {
    const cls = urlToClass.get(url);
    if (!cls) continue;
    const matches = candidates.get(url);
    if (!matches) continue;
    const fresh = matches.filter((m) => !m.alreadyLinked);
    const linked = matches.filter((m) => m.alreadyLinked);
    totalNew += fresh.length;
    totalAlready += linked.length;

    lines.push(`## ${cls.url}  (priority ${cls.linkPriority})`);
    lines.push(`- term: **${cls.term}**`);
    lines.push(`- searchTerms: ${cls.searchTerms.map((t) => `\`${t}\``).join(", ")}`);
    lines.push(`- 신규 후보: ${fresh.length}건 / 이미 링크됨: ${linked.length}건`);
    lines.push("");

    if (fresh.length > 0) {
      lines.push(`### 신규 후보`);
      for (const m of fresh) {
        const sliced = m.lineText.length > 140 ? m.lineText.slice(0, 137) + "..." : m.lineText;
        lines.push(`- \`${relPath(m.filePath)}:${m.lineNumber}\` [${m.matchedTerm}] — ${sliced}`);
      }
      lines.push("");
    }
    if (linked.length > 0) {
      lines.push(`### 이미 링크됨 (참고)`);
      for (const m of linked) {
        lines.push(`- \`${relPath(m.filePath)}:${m.lineNumber}\` [${m.matchedTerm}]`);
      }
      lines.push("");
    }
  }

  lines.unshift(`- 신규 후보 합계: **${totalNew}건** / 이미 링크됨: ${totalAlready}건`);
  lines.unshift(`- 도착 클래스 수: ${sortedUrls.length}`);
  lines.unshift("");
  lines.unshift(`# 백링크 후보 리포트`);

  return lines.join("\n");
}

function main(): void {
  const args = parseArgs(process.argv);
  if (!args.all && !args.targetSlug && !args.targetSlugs && !args.targetCourse) {
    console.error("Error: --target-slug | --target-slugs | --target-course | --all 중 하나는 지정해야 합니다.");
    process.exit(1);
  }

  const map = loadMap();
  const { termToClass, sortedTerms } = buildGlobalTerms(map, args.minPriority);

  if (sortedTerms.length === 0) {
    console.error("Warning: 매칭할 검색어가 없습니다. 사전 또는 옵션을 확인하세요.");
    return;
  }

  const candidates = findCandidates(termToClass, sortedTerms, args);
  const report = args.byFile
    ? renderReportByFile(candidates, termToClass, args)
    : renderReport(candidates, termToClass, args);

  if (args.output) {
    fs.writeFileSync(args.output, report + "\n", "utf-8");
    console.log(`✓ Report saved to ${args.output}`);
  } else {
    console.log(report);
  }
}

main();
