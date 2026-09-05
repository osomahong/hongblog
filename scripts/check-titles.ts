/**
 * 제목 정합성 검사 (prebuild에서 실행, HARD가 있으면 빌드 중단)
 *
 * 화면 H1(title/term), 검색 결과 제목(metaTitle), 공유 카드 제목(ogTitle)이 서로
 * 다른 개체를 가리키거나 렌더 단계에서 깨지는 경우를 frontmatter 단계에서 잡는다.
 *
 *   npm run check:titles                 # 전체
 *   npm run check:titles -- --warn       # SOFT 항목까지 출력
 *
 * HARD
 *   - metaTitle/ogTitle에 사이트명 포함 (루트 템플릿이 "| 준이아빠블로그"를 붙이므로 두 번 붙음)
 *   - 제목 필드의 앞뒤 공백, 파이프(|), em dash, 가운뎃점
 *   - H1과 metaTitle 사이에 2글자 이상 겹치는 토큰이 하나도 없음 (다른 개체를 가리킴)
 *   - 반말 의문형, -는가 종결, 마침표로 끝나는 제목
 *   - metaTitle 표시 폭 45 초과, H1 폭 55 초과 (한글 1, 라틴 0.5로 환산)
 * SOFT (--warn)
 *   - metaTitle 폭 36 초과, H1 폭 45 초과
 *   - H1과 metaTitle의 첫 어절이 다름 (검색 결과에서 클릭한 제목과 착지 제목이 같은 말로 시작해야 함)
 *   - ogTitle이 metaTitle 또는 H1의 축약판 (유사도 0.6 이상). 공유용 문장이 아니면 지운다
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const SITE_NAME = "준이아빠블로그";
const CONTENT_DIRS = ["insights", "classes", "courses"] as const;
/**
 * 길이는 글자 수가 아니라 표시 폭으로 잰다. 검색 결과 제목은 픽셀 폭(약 600px)에서 잘리고,
 * 한글 한 글자는 라틴 문자 두 개 폭이다. 한글과 한자를 1, 그 밖(라틴, 숫자, 공백, 기호)을 0.5로
 * 세어 한글 글자 수에 해당하는 값으로 환산한다. 순한글 30자 안팎이 검색 결과에 온전히 보이는 폭이다.
 */
const LIMITS = { metaHard: 45, metaSoft: 36, h1Hard: 55, h1Soft: 45, ogNear: 0.6 } as const;

const displayWidth = (s: string) =>
  [...s.trim()].reduce((w, ch) => w + (/[\p{Script=Hangul}\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/u.test(ch) ? 1 : 0.5), 0);

type Level = "HARD" | "SOFT";
type Finding = { level: Level; file: string; rule: string; detail: string };

const args = new Set(process.argv.slice(2));
const showWarn = args.has("--warn");

const tokens = (s: string) =>
  new Set(s.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ").split(/\s+/).filter((t) => t.length >= 2));

const overlap = (a: string, b: string) => {
  const A = tokens(a);
  const B = tokens(b);
  return [...A].filter((t) => B.has(t)).length;
};

const bigrams = (s: string) => {
  const n = s.replace(/\s+/g, "");
  const out = new Map<string, number>();
  for (let i = 0; i < n.length - 1; i++) {
    const g = n.slice(i, i + 2);
    out.set(g, (out.get(g) ?? 0) + 1);
  }
  return out;
};

/** 글자 2-gram Dice 유사도 (0~1). 한국어 제목끼리 비교할 때 토큰보다 안정적이다 */
const dice = (a: string, b: string) => {
  const A = bigrams(a);
  const B = bigrams(b);
  let inter = 0;
  let sa = 0;
  let sb = 0;
  for (const [g, c] of A) {
    sa += c;
    if (B.has(g)) inter += Math.min(c, B.get(g)!);
  }
  for (const c of B.values()) sb += c;
  return sa + sb ? (2 * inter) / (sa + sb) : 1;
};

/** 콜론, 쉼표, 여는 괄호 앞까지의 첫 어절. "클로드 코드(Claude Code) 설치" → "클로드" */
const firstWord = (s: string) => s.toLowerCase().replace(/[(:,].*$/, "").trim().split(/\s+/)[0] ?? "";

const BAD_ENDINGS = [
  { re: /(?:까|나|가|냐)\?\s*$/, label: "반말 의문형 종결" },
  { re: /(?:는가|은가|던가|인가)\??\s*$/, label: "-는가 종결" },
  { re: /\.\s*$/, label: "마침표로 끝남" },
];

function checkField(file: string, key: string, value: string, out: Finding[]) {
  if (value !== value.trim()) out.push({ level: "HARD", file, rule: `${key} 앞뒤 공백`, detail: JSON.stringify(value) });
  if (value.includes("|")) out.push({ level: "HARD", file, rule: `${key}에 파이프(|)`, detail: value });
  if (/[—–·]/.test(value)) out.push({ level: "HARD", file, rule: `${key}에 금지 기호(em dash, 가운뎃점)`, detail: value });
  if (key !== "title" && key !== "term" && value.includes(SITE_NAME)) {
    out.push({ level: "HARD", file, rule: `${key}에 사이트명 포함 (템플릿이 붙임)`, detail: value });
  }
  for (const { re, label } of BAD_ENDINGS) {
    if (re.test(value)) out.push({ level: "HARD", file, rule: `${key} ${label}`, detail: value });
  }
}

function checkFile(dir: string, file: string): Finding[] {
  const out: Finding[] = [];
  const raw = fs.readFileSync(file, "utf8");
  const { data } = matter(raw);
  const rel = path.relative(process.cwd(), file);

  const h1Key = dir === "classes" ? "term" : "title";
  const h1 = typeof data[h1Key] === "string" ? (data[h1Key] as string) : "";
  const meta = typeof data.metaTitle === "string" ? (data.metaTitle as string) : undefined;
  const og = typeof data.ogTitle === "string" ? (data.ogTitle as string) : undefined;

  if (!h1) {
    out.push({ level: "HARD", file: rel, rule: `${h1Key} 누락`, detail: "" });
    return out;
  }

  checkField(rel, h1Key, h1, out);
  if (meta !== undefined) checkField(rel, "metaTitle", meta, out);
  if (og !== undefined) checkField(rel, "ogTitle", og, out);

  const h1Len = displayWidth(h1);
  if (h1Len > LIMITS.h1Hard) out.push({ level: "HARD", file: rel, rule: `${h1Key} 폭 ${LIMITS.h1Hard} 초과`, detail: `폭 ${h1Len}: ${h1}` });
  else if (h1Len > LIMITS.h1Soft) out.push({ level: "SOFT", file: rel, rule: `${h1Key} 폭 ${LIMITS.h1Soft} 초과`, detail: `폭 ${h1Len}: ${h1}` });

  if (meta !== undefined) {
    const metaLen = displayWidth(meta);
    if (metaLen > LIMITS.metaHard) out.push({ level: "HARD", file: rel, rule: `metaTitle 폭 ${LIMITS.metaHard} 초과 (검색 결과에서 잘림)`, detail: `폭 ${metaLen}: ${meta}` });
    else if (metaLen > LIMITS.metaSoft) out.push({ level: "SOFT", file: rel, rule: `metaTitle 폭 ${LIMITS.metaSoft} 초과`, detail: `폭 ${metaLen}: ${meta}` });

    if (meta.trim() !== h1.trim() && overlap(h1, meta) === 0) {
      out.push({ level: "HARD", file: rel, rule: "H1과 metaTitle이 다른 개체를 가리킴 (겹치는 토큰 없음)", detail: `H1=${h1} / meta=${meta}` });
    } else if (firstWord(h1) !== firstWord(meta)) {
      // 검색 결과에서 클릭한 제목과 착지 H1이 같은 낱말로 시작해야 같은 글로 읽힌다
      out.push({ level: "SOFT", file: rel, rule: "H1과 metaTitle의 첫 어절이 다름 (같은 개체를 같은 표기, 같은 순서로)", detail: `H1=${h1} / meta=${meta}` });
    }
  }

  if (og !== undefined) {
    const base = meta ?? h1;
    if (og.trim() === base.trim() || og.trim() === h1.trim()) {
      out.push({ level: "SOFT", file: rel, rule: "ogTitle이 metaTitle 또는 H1과 같음 (줄을 지우면 됨)", detail: og });
    } else if (dice(og, base) >= LIMITS.ogNear || dice(og, h1) >= LIMITS.ogNear) {
      out.push({ level: "SOFT", file: rel, rule: "ogTitle이 축약판 (공유용 문장이 아니면 지움)", detail: og });
    }
  }

  return out;
}

function main() {
  const root = path.join(process.cwd(), "content");
  const findings: Finding[] = [];
  let count = 0;

  for (const dir of CONTENT_DIRS) {
    const abs = path.join(root, dir);
    if (!fs.existsSync(abs)) continue;
    for (const f of fs.readdirSync(abs).filter((n) => n.endsWith(".md"))) {
      count += 1;
      findings.push(...checkFile(dir, path.join(abs, f)));
    }
  }

  const hard = findings.filter((f) => f.level === "HARD");
  const soft = findings.filter((f) => f.level === "SOFT");

  for (const f of hard) console.log(`[HARD] ${f.file}\n  ${f.rule}\n  ${f.detail}`);
  if (showWarn) for (const f of soft) console.log(`[SOFT] ${f.file}\n  ${f.rule}\n  ${f.detail}`);

  console.log(`\n제목 검사: ${count}편, HARD ${hard.length}건, SOFT ${soft.length}건${showWarn ? "" : " (SOFT는 --warn으로 출력)"}`);
  if (hard.length > 0) process.exit(1);
}

main();
