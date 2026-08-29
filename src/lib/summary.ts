/**
 * 콘텐츠 3줄 요약.
 *
 * frontmatter에 `summary3`가 있으면 그대로 쓰고, 없으면 도입 문장과 본문 소제목 구간에서
 * 대표 문장을 뽑아 세 줄을 만든다. 157편의 인사이트와 97편의 클래스처럼 이미 배포된 글에도
 * 파일을 고치지 않고 요약이 붙도록 자동 추출을 기본값으로 둔다.
 */

import { normalizeInline, splitSentences, stripMarkdown } from "./markdown-text";

/** 요약 한 줄로 채택할 문장의 길이 범위. 너무 짧으면 정보가 없고, 너무 길면 요약이 아니다. */
const MIN_LEN = 18;
const PREFERRED_MAX_LEN = 160;
const HARD_MAX_LEN = 220;

/** 같은 문장인지 판정할 때 비교하는 앞부분 길이 */
const DEDUPE_PREFIX = 14;

export const SUMMARY_LINE_COUNT = 3;

/** 코드 블록과 표를 걷어낸 본문. 요약 후보 문장은 산문에서만 뽑는다. */
function proseOnly(content: string): string {
  return content
    .replace(/```[\s\S]*?```/g, "")
    .replace(/^\s*\|.*\|\s*$/gm, "")
    .replace(/<style[\s\S]*?<\/style>/g, "")
    .replace(/<script[\s\S]*?<\/script>/g, "");
}

/** 산문 문단으로 볼 수 없는 줄 (헤딩, 목록, 표, 이미지, 수평선, HTML 블록) */
function isStructuralLine(line: string): boolean {
  const t = line.trim();
  if (!t) return true;
  return (
    /^#{1,6}\s/.test(t) ||
    /^[-*+]\s/.test(t) ||
    /^\d+\.\s/.test(t) ||
    /^\|/.test(t) ||
    /^!\[/.test(t) ||
    /^-{3,}$/.test(t) ||
    /^<\/?[a-zA-Z]/.test(t)
  );
}

/**
 * 도입 문단과 각 소제목 아래 첫 문단의 첫 문장을 순서대로 모은다.
 * 글의 흐름 순서를 유지하므로 앞뒤에서 고르게 뽑을 수 있다.
 */
function collectCandidates(content: string): string[] {
  const lines = proseOnly(content).split("\n");
  const picked: string[] = [];
  let waitingForParagraph = true; // 첫 소제목 이전 도입 문단부터 후보로 본다

  for (const line of lines) {
    if (/^#{2,3}\s/.test(line.trim())) {
      waitingForParagraph = true;
      continue;
    }
    if (!waitingForParagraph) continue;
    if (isStructuralLine(line)) continue;

    const plain = normalizeInline(stripMarkdown(line));
    const first = splitSentences(plain)[0];
    if (first) {
      picked.push(first);
      waitingForParagraph = false;
    }
  }

  return picked;
}

/**
 * 소제목 구간 대표 문장만으로 세 줄이 안 나오는 짧은 글(코스 소개 등)을 위해
 * 산문 문단의 모든 문장을 순서대로 모은다.
 */
function collectAllSentences(content: string): string[] {
  const paragraphs = proseOnly(content)
    .split("\n")
    .filter((line) => !isStructuralLine(line));

  return paragraphs.flatMap((line) => splitSentences(normalizeInline(stripMarkdown(line))));
}

function dedupeKey(sentence: string): string {
  return sentence.replace(/[\s.,!?"'()[\]{}:;]/g, "").slice(0, DEDUPE_PREFIX);
}

/** 두 글자씩 끊은 조각 집합. 문장이 얼마나 겹치는지 재는 데 쓴다 */
function shingles(sentence: string): Set<string> {
  const flat = sentence.replace(/[\s.,!?"'()[\]{}:;]/g, "");
  const set = new Set<string>();
  for (let i = 0; i + 2 <= flat.length; i += 1) set.add(flat.slice(i, i + 2));
  return set;
}

/** 겹치는 조각 비율. 1에 가까울수록 같은 문장이다 */
function overlapRatio(a: string, b: string): number {
  const sa = shingles(a);
  const sb = shingles(b);
  if (sa.size === 0 || sb.size === 0) return 0;
  let shared = 0;
  for (const piece of sa) if (sb.has(piece)) shared += 1;
  return shared / Math.min(sa.size, sb.size);
}

/** 이 비율을 넘으면 같은 말을 다시 하는 줄로 본다 */
const OVERLAP_LIMIT = 0.45;

/** 이미 고른 문장 모음. 앞머리가 같거나 내용이 크게 겹치는 문장을 다시 고르지 않게 막는다 */
class PickedLines {
  private readonly keys = new Set<string>();
  private readonly lines: string[] = [];

  has(sentence: string): boolean {
    if (this.keys.has(dedupeKey(sentence))) return true;
    return this.lines.some((line) => overlapRatio(line, sentence) >= OVERLAP_LIMIT);
  }

  add(sentence: string): void {
    this.keys.add(dedupeKey(sentence));
    this.lines.push(sentence);
  }
}

/** 길이가 지나친 문장은 쉼표 경계에서 줄이고, 그래도 길면 말줄임표로 닫는다. */
function fitLength(sentence: string): string {
  if (sentence.length <= HARD_MAX_LEN) return sentence;
  const head = sentence.slice(0, HARD_MAX_LEN);
  const comma = head.lastIndexOf(", ");
  if (comma > MIN_LEN) return `${head.slice(0, comma)}.`;
  return `${head.trim()}...`;
}

/** 온전히 끝맺은 문장인지 본다. 목록을 여는 머리말("~ 분석:")은 요약에 쓰지 않는다 */
function isCompleteSentence(sentence: string): boolean {
  if (/[:：]$/.test(sentence)) return false;
  return /(?:[.!?…]|다|요|까|죠|음|함)$/.test(sentence);
}

function isUsable(sentence: string): boolean {
  return sentence.length >= MIN_LEN && isCompleteSentence(sentence);
}

/** 글 자체를 가리키거나 뒷내용을 예고하는 문장. 요약으로 옮기면 정보가 남지 않는다 */
const META_PATTERNS = [
  /(?:살펴|알아|정리|설명|보여|다뤄|짚어)\s*(?:보겠|드리겠|하겠)/,
  /(?:앞서|지난 편|지난 글|이전 글|다음 편|다음 글)/,
  /(?:이야기를 했|다뤘습니다|정리했습니다|설명했습니다)/,
  /^(?:이|이번|여기|그것|이것)\s*(?:글|편|장|까지|부터)/,
];

/** 문장 첫머리 접속어. 앞 문장이 없으면 뜻이 끊긴다 */
const CONNECTIVE_HEAD = /^(?:그런데|그러나|하지만|그래서|따라서|반대로|이때|여기서|즉|다만|물론|또한)\b/;

/** 정의문 형태. "X는 Y입니다"처럼 개체와 뜻이 한 문장에 들어간 경우 */
const DEFINITION_SHAPE = /(?:은|는|이란|란|이라는)\s.+(?:입니다|이다|말합니다|뜻합니다|가리킵니다)\.?$/;

/** 수치가 든 문장은 요약에서 근거 역할을 한다 */
const HAS_FIGURE = /\d+\s*(?:%|퍼센트|배|개|초|분|시간|일|주|개월|년|원|달러|건|명|회|자)/;

/** 요약 한 줄로서의 값어치. 높을수록 먼저 뽑힌다 */
function scoreSentence(sentence: string): number {
  let score = 0;
  if (DEFINITION_SHAPE.test(sentence)) score += 3;
  if (HAS_FIGURE.test(sentence)) score += 2;
  if (sentence.length >= 40 && sentence.length <= 120) score += 1;
  if (sentence.length > PREFERRED_MAX_LEN) score -= 2;
  if (CONNECTIVE_HEAD.test(sentence)) score -= 3;
  if (META_PATTERNS.some((re) => re.test(sentence))) score -= 5;
  return score;
}

/**
 * 후보 문장 목록에서 서로 겹치지 않는 문장을 need개 고른다.
 * 목록을 need개 구간으로 나눠 구간마다 가장 점수가 높은 문장을 집으므로,
 * 요약이 도입부에만 몰리지 않으면서 값어치 낮은 문장을 피한다.
 */
function pickSpread(candidates: string[], taken: PickedLines, need: number): string[] {
  const pool = candidates.filter((s) => isUsable(s) && !taken.has(s));
  if (pool.length === 0 || need <= 0) return [];

  const result: string[] = [];
  for (let i = 0; i < need; i += 1) {
    const from = Math.floor((pool.length * i) / need);
    const to = i === need - 1 ? pool.length : Math.max(from + 1, Math.floor((pool.length * (i + 1)) / need));

    let best: string | null = null;
    let bestScore = -Infinity;
    // 구간 안에서 고르고, 다 걸러졌으면 구간 끝부터 목록 끝까지 넓혀 본다
    for (let j = from; j < pool.length; j += 1) {
      if (taken.has(pool[j])) continue;
      const score = scoreSentence(pool[j]) - (j >= to ? 1 : 0);
      if (score > bestScore) {
        bestScore = score;
        best = pool[j];
      }
      if (j >= to && best) break;
    }
    if (!best) continue;
    taken.add(best);
    result.push(best);
  }
  return result;
}

/** frontmatter에 손으로 적어 둔 요약을 검증한다. 문자열 배열이 아니면 버린다. */
export function normalizeManualSummary(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((v): v is string => typeof v === "string")
    .map((v) => normalizeInline(stripMarkdown(v)))
    .filter(Boolean)
    .slice(0, SUMMARY_LINE_COUNT);
}

export interface Summary3Input {
  /** 글 머리에 이미 있는 요약 성격의 문장. 인사이트는 excerpt, 클래스는 definition */
  lead?: string;
  /** 마크다운 본문 */
  content: string;
  /** frontmatter summary3 */
  manual?: unknown;
}

/**
 * 3줄 요약을 만든다. 수동 요약이 세 줄을 채우면 그대로 쓰고, 모자라면 자동 추출로 메운다.
 * 후보가 부족한 짧은 글은 세 줄보다 적게 돌려준다.
 */
export function buildSummary3({ lead, content, manual }: Summary3Input): string[] {
  const manualLines = normalizeManualSummary(manual);
  if (manualLines.length >= SUMMARY_LINE_COUNT) return manualLines;

  const taken = new PickedLines();
  const lines: string[] = [];

  for (const line of manualLines) {
    taken.add(line);
    lines.push(line);
  }

  const leadSentences = lead ? splitSentences(normalizeInline(stripMarkdown(lead))) : [];
  const bodySentences = collectCandidates(content);

  // 첫 줄은 글이 무엇인지 밝히는 정의 문장이 오도록 도입 문장을 먼저 쓴다
  if (lines.length < SUMMARY_LINE_COUNT) {
    lines.push(...pickSpread(leadSentences.slice(0, 1), taken, 1));
  }
  if (lines.length < SUMMARY_LINE_COUNT) {
    lines.push(...pickSpread(bodySentences, taken, SUMMARY_LINE_COUNT - lines.length));
  }
  // 본문 후보가 모자라면 도입 문장의 나머지로 채운다
  if (lines.length < SUMMARY_LINE_COUNT) {
    lines.push(...pickSpread(leadSentences.slice(1), taken, SUMMARY_LINE_COUNT - lines.length));
  }
  // 그래도 모자라면 본문 산문 전체에서 문장을 집는다
  if (lines.length < SUMMARY_LINE_COUNT) {
    lines.push(...pickSpread(collectAllSentences(content), taken, SUMMARY_LINE_COUNT - lines.length));
  }

  return lines.slice(0, SUMMARY_LINE_COUNT).map(fitLength);
}

/** 코스 term에 붙은 괄호 부제를 떼어 낸다. "MMP (설치 귀속 도구)" → "MMP" */
function bareTerm(term: string): string {
  return term.replace(/\s*[(（].*$/, "").trim();
}

export interface CourseSummary3Input {
  /** 코스 본문. 소개 문단이 들어 있다 */
  description: string;
  /** frontmatter metaDescription. 본문이 짧을 때 재료로 쓴다 */
  metaDescription?: string;
  /** 커리큘럼에 들어 있는 클래스 제목 */
  classTerms: string[];
  /** frontmatter summary3 */
  manual?: unknown;
}

/**
 * 코스용 3줄 요약.
 *
 * 코스 본문은 소개 문단 한두 개뿐이라 소제목 구간에서 문장을 뽑을 수 없다.
 * 그래서 소개 문장으로 앞의 두 줄을 채우고, 마지막 줄은 커리큘럼에서 만든다.
 */
export function buildCourseSummary3({
  description,
  metaDescription,
  classTerms,
  manual,
}: CourseSummary3Input): string[] {
  const manualLines = normalizeManualSummary(manual);
  if (manualLines.length >= SUMMARY_LINE_COUNT) return manualLines;

  const taken = new PickedLines();
  const lines: string[] = [];
  for (const line of manualLines) {
    taken.add(line);
    lines.push(line);
  }

  const curriculum = buildCurriculumLine(classTerms);
  const need = SUMMARY_LINE_COUNT - lines.length - (curriculum ? 1 : 0);

  const material = [
    ...collectAllSentences(description),
    ...splitSentences(normalizeInline(stripMarkdown(metaDescription ?? ""))),
  ];
  lines.push(...pickSpread(material, taken, Math.max(need, 0)));

  if (curriculum) lines.push(curriculum);

  // 소개 문장이 모자라 자리가 남으면 남은 재료로 채운다
  if (lines.length < SUMMARY_LINE_COUNT) {
    lines.push(...pickSpread(material, taken, SUMMARY_LINE_COUNT - lines.length));
  }

  return lines.slice(0, SUMMARY_LINE_COUNT).map(fitLength);
}

/** 커리큘럼 한 줄. 강 수와 앞쪽 세 강의 제목을 담는다 */
function buildCurriculumLine(classTerms: string[]): string | null {
  if (classTerms.length === 0) return null;

  const heads = classTerms.slice(0, 3).map(bareTerm).filter(Boolean);
  if (heads.length === 0) return `총 ${classTerms.length}강으로 이루어져 있습니다.`;

  // 강 제목 뒤에 조사가 붙지 않도록 "순서로 이어집니다"로 닫는다
  const listed = heads.join(", ");
  const head = classTerms.length > heads.length ? "앞부분은 " : "";
  return `총 ${classTerms.length}강이며, ${head}${listed} 순서로 이어집니다.`;
}
