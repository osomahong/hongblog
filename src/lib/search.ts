/**
 * 사이트 내 검색의 공용 타입과 점수 계산.
 *
 * 서버(인덱스 생성)와 클라이언트(질의 처리)가 함께 쓰므로 fs에 의존하지 않는다.
 *
 * 매칭은 형태소 분석 없이 부분 문자열로만 한다. 한국어는 조사가 붙어 어절이
 * 늘어나기 때문에 공백 토큰 일치나 fuzzy 매칭은 "GA4를"에서 "GA4"를 놓친다.
 * 문서 수가 200건 안쪽이라 부분 문자열 전수 검사로도 체감 지연이 없다.
 */

export type SearchDocType = "insight" | "class" | "course" | "page";

/** 1차 인덱스 항목. 제목, 설명, 태그까지만 담아 가볍게 유지한다. */
export interface SearchDoc {
  href: string;
  type: SearchDocType;
  title: string;
  description: string;
  tags: string[];
  category: string;
  /** YYYY-MM-DD. 동점 처리와 결과 표시에 쓴다. */
  date: string;
}

/** 2차 인덱스 항목. 1차보다 5배 무거워 나중에 따로 받는다. href로 1차와 잇는다. */
export interface SearchBodyDoc {
  href: string;
  /** 문서의 모든 소제목을 이어 붙인 문자열 */
  headings: string;
  /** 마크다운을 걷어낸 본문 앞부분 */
  body: string;
}

export interface SearchHit {
  doc: SearchDoc;
  score: number;
  /** 결과 목록에 보여줄 미리보기. 본문에서 맞은 경우 그 주변을 잘라 온다. */
  snippet: string;
  /** 본문(소제목 포함)에서 맞았는지. 목록에서 "본문 일치" 표시에 쓴다. */
  matchedInBody: boolean;
}

/**
 * 필드별 가중치. 제목 > 태그 > 설명 > 소제목 > 본문 순으로 둔다.
 * 본문 점수를 낮게 두는 이유는 본문이 길어서 우연히 걸리는 빈도가 높기 때문이다.
 */
const WEIGHT = {
  titleExact: 120,
  titlePrefix: 70,
  title: 45,
  tagExact: 34,
  tag: 16,
  description: 14,
  headings: 8,
  body: 4,
} as const;

/** 타입별 가중치. 같은 점수면 인사이트를 먼저 보여준다. */
const TYPE_BONUS: Record<SearchDocType, number> = {
  insight: 6,
  class: 4,
  course: 2,
  page: 0,
};

const SNIPPET_RADIUS = 60;
const MAX_TERMS = 8;

/**
 * 비교용 정규화. 한글은 NFC로 모아야 자모가 분리된 입력(macOS 복사 등)과
 * 파일에 저장된 문자열이 같은 값이 된다.
 */
export function normalize(text: string): string {
  return text.normalize("NFC").toLowerCase().replace(/\s+/g, " ").trim();
}

/** 질의를 공백 기준 검색어로 나눈다. 빈 질의면 빈 배열을 준다. */
export function parseTerms(query: string): string[] {
  const normalized = normalize(query);
  if (!normalized) return [];
  return Array.from(new Set(normalized.split(" ").filter(Boolean))).slice(0, MAX_TERMS);
}

interface ScoredField {
  score: number;
  matchedInBody: boolean;
}

/** 검색어 하나가 문서에서 얻는 점수. 어디에도 없으면 0을 준다. */
function scoreTerm(
  term: string,
  fields: { title: string; description: string; tags: string[]; headings: string; body: string },
): ScoredField {
  let score = 0;
  let matchedInBody = false;

  if (fields.title === term) {
    score += WEIGHT.titleExact;
  } else if (fields.title.startsWith(term)) {
    score += WEIGHT.titlePrefix;
  } else if (fields.title.includes(term)) {
    score += WEIGHT.title;
  }

  for (const tag of fields.tags) {
    if (tag === term) score += WEIGHT.tagExact;
    else if (tag.includes(term)) score += WEIGHT.tag;
  }

  if (fields.description.includes(term)) score += WEIGHT.description;

  if (fields.headings.includes(term)) {
    score += WEIGHT.headings;
    matchedInBody = true;
  }
  if (fields.body.includes(term)) {
    score += WEIGHT.body;
    matchedInBody = true;
  }

  return { score, matchedInBody };
}

/** 문서 하나를 미리 정규화해 둔 형태. 질의마다 다시 normalize하지 않으려고 캐시한다. */
export interface PreparedDoc {
  doc: SearchDoc;
  title: string;
  description: string;
  tags: string[];
  headings: string;
  body: string;
  /** 스니펫을 원문 그대로 잘라 내기 위한 원본 본문 */
  rawBody: string;
}

export function prepareDocs(docs: SearchDoc[], bodies: SearchBodyDoc[] = []): PreparedDoc[] {
  const bodyByHref = new Map(bodies.map((b) => [b.href, b]));

  return docs.map((doc) => {
    const body = bodyByHref.get(doc.href);
    return {
      doc,
      title: normalize(doc.title),
      description: normalize(doc.description),
      tags: doc.tags.map(normalize),
      headings: normalize(body?.headings ?? ""),
      body: normalize(body?.body ?? ""),
      rawBody: body?.body ?? "",
    };
  });
}

/**
 * 본문에서 검색어 주변을 잘라 미리보기를 만든다.
 * 설명에 이미 검색어가 있으면 설명을 그대로 쓰고, 본문에서만 맞았을 때만 잘라 온다.
 */
function buildSnippet(prepared: PreparedDoc, terms: string[]): string {
  const { doc, description, rawBody, body } = prepared;

  if (terms.some((term) => description.includes(term))) return doc.description;
  if (!rawBody) return doc.description;

  const hitIndex = terms
    .map((term) => body.indexOf(term))
    .filter((i) => i >= 0)
    .sort((a, b) => a - b)[0];

  if (hitIndex === undefined) return doc.description;

  const start = Math.max(0, hitIndex - SNIPPET_RADIUS);
  const end = Math.min(rawBody.length, hitIndex + SNIPPET_RADIUS * 2);
  const slice = rawBody.slice(start, end).trim();

  return `${start > 0 ? "…" : ""}${slice}${end < rawBody.length ? "…" : ""}`;
}

export interface SearchOptions {
  /** 결과 개수 상한. 오버레이는 짧게, 결과 페이지는 넉넉하게 쓴다. */
  limit?: number;
  /** 이 타입만 남긴다. 비우면 전체. */
  types?: readonly SearchDocType[];
}

/**
 * 모든 검색어가 어딘가에서 맞은 문서만 남긴다(AND).
 * 하나라도 안 맞으면 제외해야 검색어를 더할수록 결과가 좁혀진다.
 */
export function search(
  prepared: PreparedDoc[],
  query: string,
  options: SearchOptions = {},
): SearchHit[] {
  const terms = parseTerms(query);
  if (terms.length === 0) return [];

  const { limit = 30, types } = options;
  const hits: SearchHit[] = [];

  for (const item of prepared) {
    if (types && types.length > 0 && !types.includes(item.doc.type)) continue;

    let total = 0;
    let matchedInBody = false;
    let allMatched = true;

    for (const term of terms) {
      const result = scoreTerm(term, item);
      if (result.score === 0) {
        allMatched = false;
        break;
      }
      total += result.score;
      matchedInBody = matchedInBody || result.matchedInBody;
    }

    if (!allMatched) continue;

    hits.push({
      doc: item.doc,
      score: total + TYPE_BONUS[item.doc.type],
      snippet: buildSnippet(item, terms),
      matchedInBody,
    });
  }

  return hits
    .sort((a, b) => b.score - a.score || b.doc.date.localeCompare(a.doc.date))
    .slice(0, limit);
}

export interface HighlightSegment {
  text: string;
  hit: boolean;
}

/**
 * 검색어와 겹치는 구간을 표시용으로 쪼갠다.
 * 겹치는 검색어가 여러 개일 수 있어 구간을 먼저 합친 뒤 자른다.
 */
export function highlight(text: string, terms: string[]): HighlightSegment[] {
  if (!text || terms.length === 0) return [{ text, hit: false }];

  const haystack = text.normalize("NFC").toLowerCase();
  const ranges: [number, number][] = [];

  for (const term of terms) {
    let from = 0;
    for (;;) {
      const index = haystack.indexOf(term, from);
      if (index < 0) break;
      ranges.push([index, index + term.length]);
      from = index + term.length;
    }
  }

  if (ranges.length === 0) return [{ text, hit: false }];

  ranges.sort((a, b) => a[0] - b[0]);
  const merged: [number, number][] = [];
  for (const range of ranges) {
    const last = merged[merged.length - 1];
    if (last && range[0] <= last[1]) last[1] = Math.max(last[1], range[1]);
    else merged.push([...range]);
  }

  const segments: HighlightSegment[] = [];
  let cursor = 0;
  for (const [start, end] of merged) {
    if (start > cursor) segments.push({ text: text.slice(cursor, start), hit: false });
    segments.push({ text: text.slice(start, end), hit: true });
    cursor = end;
  }
  if (cursor < text.length) segments.push({ text: text.slice(cursor), hit: false });

  return segments;
}
