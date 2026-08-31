/**
 * 3줄 요약(frontmatter summary3) 규칙 검사.
 *
 * 규칙 전문은 .claude/references/content/summary3-rules.md에 있다.
 * check-prose.ts와 check-literary.mjs가 잡지 못하는 요약 전용 규칙만 여기서 본다.
 *
 *   npx tsx scripts/check-summary3.ts content/insights/{slug}.md
 *   npx tsx scripts/check-summary3.ts --all
 *   npx tsx scripts/check-summary3.ts --all --type class
 *
 * summary3가 없는 글은 건너뛴다. 자동 추출이 폴백으로 동작하기 때문이다.
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";

interface Violation {
  level: "HARD" | "SOFT";
  rule: string;
  line: number;
  text: string;
  hint: string;
}

/** 요약이 아니라 글을 소개하는 문장 */
const META_NARRATION = [
  /정리했습니다[.!]?$/,
  /정리합니다[.!]?$/,
  /다뤘습니다[.!]?$/,
  /다룹니다[.!]?$/,
  /알아봅니다[.!]?$/,
  /살펴봅니다[.!]?$/,
  /소개합니다[.!]?$/,
  /담았습니다[.!]?$/,
  /설명합니다[.!]?$/,
  /정리해\s*봤습니다[.!]?$/,
];

/** 뒤에 오는 표나 목록을 가리켜 요약으로 떼면 빈 문장이 되는 형태 */
const FORWARD_REFERENCE = [
  /다음과 같습니다/,
  /아래와 같습니다/,
  /다음 표/,
  /아래 표/,
  /아래 이미지/,
  /위 화면/,
  /위 그래프/,
  /안내되어 있습니다/,
  /정리하면 다음/,
];

/** 세 줄 안에서는 풀 자리가 없어 뜻이 흐려지는 비유 표지 */
const FIGURATIVE = [
  /(?:는|은|이|가)\s*[^.]*듯[,\s]/,
  /인 셈입니다/,
  /빗대면/,
  /비유하면/,
  /에 빗대/,
];

/** 목록을 여는 머리말 */
const LIST_HEADER = /^[^.]{0,20}\s*[:：]\s*/;

const BANNED_SYMBOLS: { re: RegExp; name: string }[] = [
  { re: /—/, name: "em dash" },
  { re: /·/, name: "가운뎃점" },
];

/** 한 줄에 담긴 문장 수. 소수점과 버전 표기는 문장 끝으로 세지 않는다 */
function countSentences(line: string): number {
  const matches = line.match(/[.!?](?=\s|$)/g);
  return matches ? matches.length : 1;
}

function countCommas(line: string): number {
  // 1,250억 같은 숫자 구분자는 세지 않는다
  return (line.match(/,(?!\d)/g) || []).length;
}

function checkLines(lines: string[]): Violation[] {
  const out: Violation[] = [];
  const push = (level: Violation["level"], rule: string, i: number, text: string, hint: string) =>
    out.push({ level, rule, line: i + 1, text, hint });

  lines.forEach((raw, i) => {
    const line = raw.trim();
    if (!line) return;

    if (countSentences(line) > 1) {
      push("HARD", "한 줄은 한 문장", i, line, "앞의 짧은 선언을 뒤 문장에 녹인다");
    }
    for (const re of META_NARRATION) {
      if (re.test(line)) {
        push("HARD", "메타 서술", i, line, "글을 소개하지 말고 내용 자체를 적는다");
        break;
      }
    }
    for (const re of FORWARD_REFERENCE) {
      if (re.test(line)) {
        push("HARD", "뒤를 가리키는 문장", i, line, "가리키는 대신 그 내용을 직접 적는다");
        break;
      }
    }
    for (const re of FIGURATIVE) {
      if (re.test(line)) {
        push("HARD", "비유", i, line, "세 줄 안에는 비유를 풀 자리가 없다");
        break;
      }
    }
    if (LIST_HEADER.test(line)) {
      push("HARD", "목록 머리말", i, line, "머리말 대신 완결된 문장으로 적는다");
    }
    for (const { re, name } of BANNED_SYMBOLS) {
      if (re.test(line)) {
        push("HARD", `금지 기호 ${name}`, i, line, "쉼표나 콜론으로 바꾼다");
      }
    }
    if (countCommas(line) > 3) {
      push("HARD", "쉼표 3개 초과", i, line, "나열을 접속으로 묶는다");
    }
    if (/데스크탑/.test(line)) {
      push("HARD", "외래어 표기", i, line, "데스크탑이 아니라 데스크톱");
    }
  });

  return out;
}

function checkFile(file: string): { skipped: boolean; violations: Violation[]; count: number } {
  const { data } = matter(fs.readFileSync(file, "utf-8"));
  const raw = data.summary3;
  if (!Array.isArray(raw) || raw.length === 0) return { skipped: true, violations: [], count: 0 };

  const lines = raw.filter((v): v is string => typeof v === "string");
  const violations = checkLines(lines);

  if (lines.length !== 3) {
    violations.unshift({
      level: "HARD",
      rule: "줄 수",
      line: 0,
      text: `${lines.length}줄`,
      hint: "세 줄로 맞춘다",
    });
  }
  return { skipped: false, violations, count: lines.length };
}

const DIRS: Record<string, string> = {
  insight: path.join(process.cwd(), "content", "insights"),
  class: path.join(process.cwd(), "content", "classes"),
  course: path.join(process.cwd(), "content", "courses"),
};

function collectTargets(): string[] {
  const args = process.argv.slice(2);
  const all = args.includes("--all");
  if (!all) return args.filter((a) => a.endsWith(".md"));

  const typeIdx = args.indexOf("--type");
  const types = typeIdx >= 0 ? [args[typeIdx + 1]] : Object.keys(DIRS);
  return types.flatMap((t) => {
    const dir = DIRS[t];
    if (!dir || !fs.existsSync(dir)) return [];
    return fs
      .readdirSync(dir)
      .filter((f) => f.endsWith(".md"))
      .map((f) => path.join(dir, f));
  });
}

const targets = collectTargets();
if (targets.length === 0) {
  console.error("검사할 파일이 없습니다. 파일 경로나 --all을 지정하세요.");
  process.exit(1);
}

let hard = 0;
let soft = 0;
let checked = 0;
let skipped = 0;

for (const file of targets) {
  const { skipped: s, violations } = checkFile(file);
  if (s) {
    skipped += 1;
    continue;
  }
  checked += 1;
  if (violations.length === 0) continue;

  console.log(`\n===== ${path.relative(process.cwd(), file)} =====`);
  for (const v of violations) {
    if (v.level === "HARD") hard += 1;
    else soft += 1;
    const where = v.line > 0 ? `${v.line}번째 줄` : "전체";
    console.log(`[${v.level}] ${v.rule} (${where})`);
    console.log(`    ${v.text}`);
    console.log(`    → ${v.hint}`);
  }
}

console.log(
  `\n검사 ${checked}편, summary3 없어 건너뜀 ${skipped}편. HARD ${hard}건 / SOFT ${soft}건`
);
if (hard > 0) {
  console.log("HARD 위반이 있습니다. .claude/references/content/summary3-rules.md를 따라 고칩니다.");
  process.exit(1);
}
console.log("HARD 통과.");
