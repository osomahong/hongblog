/**
 * GEO/SEO/AEO 전수 점수 측정
 *
 *   npx tsx scripts/geo-seo-score.ts                 # 요약 리포트
 *   npx tsx scripts/geo-seo-score.ts --csv out.csv   # 전 편 점수 CSV
 *   npx tsx scripts/geo-seo-score.ts --rule R-GEO-01 # 특정 규칙 위반 목록 전체
 *   npx tsx scripts/geo-seo-score.ts --slug what-is-kpi
 *   npx tsx scripts/geo-seo-score.ts --worst 30      # 하위 N편
 *
 * 규칙 원본은 .claude/skills/inspect-content/references/{seo,aeo,geo}-rules.md 다.
 * 이 스크립트는 그 가운데 결정론으로 판정 가능한 층만 실행한다. 의미 판정 항목
 * (R-AEO-01 본문 대응, R-GEO-04 경험 서술 진위 등)은 패턴 판정까지만 하고
 * 점수를 낮추는 방향으로만 쓴다.
 *
 * 원본 명세에서 의도적으로 다르게 잡은 기준 (저장소의 기존 검사와 충돌하므로):
 *  - R-SEO-01: 글자 수가 아니라 표시 폭으로 잰다. check-titles.ts와 같은 환산
 *    (한글/한자 1, 그 밖 0.5). 그쪽 SOFT 상한이 36이므로 36을 만점 상한으로 쓴다.
 *  - R-SEO-06: ogTitle은 요구하지 않는다. check-titles.ts가 metaTitle의 축약판
 *    ogTitle을 SOFT로 지적하므로, 공유용 문장이 따로 없으면 없는 편이 맞다.
 *    ogDescription만 본다.
 *  - R-AEO-02/03: classes 면제를 풀었다. 클래스도 FAQPage를 발행하므로
 *    (src/app/class/[courseSlug]/[classSlug]/page.tsx) 면제하면 실제 구멍이 가려진다.
 *  - 타입별로 적용되지 않는 규칙은 N/A로 빼고, 적용 가중치 합으로 나눠 100점 환산한다.
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { extractFaqPairs } from "../src/lib/extract-faq";
import { CANONICAL_TAGS_FLAT } from "../src/lib/constants";

type ContentType = "insights" | "classes" | "courses";
type Verdict = "PASS" | "PARTIAL" | "FAIL" | "N/A";

interface RuleResult {
  id: string;
  area: "SEO" | "AEO" | "GEO";
  weight: number;
  verdict: Verdict;
  detail: string;
}

interface Scored {
  type: ContentType;
  slug: string;
  file: string;
  title: string;
  rules: RuleResult[];
  seo: number;
  aeo: number;
  geo: number;
  total: number;
  grade: string;
}

const ROOT = process.cwd();
const SELF_HOST = "digitalmarketer.co.kr";

const displayWidth = (s: string) =>
  [...s.trim()].reduce(
    (w, ch) =>
      w +
      (/[\p{Script=Hangul}\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/u.test(ch) ? 1 : 0.5),
    0,
  );

/** 마크다운 장식과 코드 블록을 걷어낸 본문. 패턴 카운트는 이 위에서 한다 */
function plain(body: string): string {
  return body
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/^\s*>\s?/gm, "");
}

/** 표/리스트/헤딩을 뺀 산문 문단만 */
function proseParagraphs(body: string): string[] {
  return plain(body)
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(
      (p) =>
        p.length > 0 &&
        !/^#{1,6}\s/.test(p) &&
        !/^\|/.test(p) &&
        !/^[-*+]\s/.test(p) &&
        !/^\d+\.\s/.test(p) &&
        !/^!\[/.test(p),
    );
}

/** 연속 라인 블록 단위로 표와 리스트 개수를 센다 */
function blockCounts(body: string) {
  const lines = plain(body).split("\n");
  let tables = 0;
  let lists = 0;
  type Kind = "table" | "bullet" | "number" | null;
  let run: Kind = null;
  let runLen = 0;
  const close = () => {
    if (run === "table" && runLen >= 3) tables++;
    if ((run === "bullet" || run === "number") && runLen >= 3) lists++;
    run = null;
    runLen = 0;
  };
  for (const raw of lines) {
    const line = raw.trim();
    const kind: Kind = /^\|/.test(line)
      ? "table"
      : /^[-*+]\s/.test(line)
        ? "bullet"
        : /^\d+\.\s/.test(line)
          ? "number"
          : null;
    if (kind && kind === run) runLen++;
    else {
      close();
      if (kind) {
        run = kind;
        runLen = 1;
      }
    }
  }
  close();
  return { tables, lists };
}

const DEFINITION_RE = /(?:란|이란|은|는)\s[^\n.]{2,60}?(?:입니다|을 말합니다|를 말합니다|이다|뜻합니다)/;

function headings(body: string): { level: number; text: string }[] {
  return [...body.matchAll(/^(#{2,3})\s+(.+?)\s*$/gm)].map((m) => ({
    level: m[1].length,
    text: m[2].trim().replace(/^[\p{Extended_Pictographic}☀-➿️]+\s*/u, ""),
  }));
}

// ─────────────────────────────────────────────────────────────── SEO

function scoreSeo(type: ContentType, fm: Record<string, unknown>, body: string): RuleResult[] {
  const out: RuleResult[] = [];
  const push = (id: string, weight: number, verdict: Verdict, detail: string) =>
    out.push({ id, area: "SEO", weight, verdict, detail });

  // R-SEO-01 metaTitle 표시 폭
  const metaTitle = typeof fm.metaTitle === "string" ? fm.metaTitle : "";
  if (!metaTitle) push("R-SEO-01", 15, "FAIL", "metaTitle 없음");
  else {
    const w = displayWidth(metaTitle);
    if (w >= 18 && w <= 36) push("R-SEO-01", 15, "PASS", `폭 ${w}`);
    else if ((w > 36 && w <= 45) || (w >= 14 && w < 18)) push("R-SEO-01", 15, "PARTIAL", `폭 ${w}`);
    else push("R-SEO-01", 15, "FAIL", `폭 ${w}`);
  }

  // R-SEO-02 metaDescription 길이
  const metaDesc = typeof fm.metaDescription === "string" ? fm.metaDescription.trim() : "";
  if (!metaDesc) push("R-SEO-02", 15, "FAIL", "metaDescription 없음");
  else {
    const n = metaDesc.length;
    if (n >= 120 && n <= 160) push("R-SEO-02", 15, "PASS", `${n}자`);
    else if ((n >= 100 && n < 120) || (n > 160 && n <= 180)) push("R-SEO-02", 15, "PARTIAL", `${n}자`);
    else push("R-SEO-02", 15, "FAIL", `${n}자`);
  }

  // R-SEO-03 본문 길이
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  if (type === "courses") push("R-SEO-03", 10, "N/A", "코스는 목차 페이지");
  else {
    const pass = type === "insights" ? 300 : 150;
    const partial = type === "insights" ? 200 : 100;
    if (words >= pass) push("R-SEO-03", 10, "PASS", `${words}단어`);
    else if (words >= partial) push("R-SEO-03", 10, "PARTIAL", `${words}단어`);
    else push("R-SEO-03", 10, "FAIL", `${words}단어`);
  }

  // R-SEO-04 H2 구조
  const h2 = [...body.matchAll(/^##\s+/gm)].length;
  if (type !== "insights") push("R-SEO-04", 5, "N/A", "정의형/목차형");
  else if (h2 >= 3) push("R-SEO-04", 5, "PASS", `H2 ${h2}개`);
  else if (h2 === 2) push("R-SEO-04", 5, "PARTIAL", `H2 ${h2}개`);
  else push("R-SEO-04", 5, "FAIL", `H2 ${h2}개`);

  // R-SEO-05 ogImage
  const ogImage = typeof fm.ogImage === "string" ? fm.ogImage : "";
  if (/^(https?:\/\/|\/)/.test(ogImage)) push("R-SEO-05", 10, "PASS", ogImage);
  else push("R-SEO-05", 10, "FAIL", "ogImage 없음");

  // R-SEO-06 ogDescription (ogTitle은 요구하지 않음, 파일 머리 주석 참조)
  const ogDesc = typeof fm.ogDescription === "string" ? fm.ogDescription.trim() : "";
  if (type !== "insights") push("R-SEO-06", 5, "N/A", "클래스/코스는 필드 없음");
  else if (!ogDesc) push("R-SEO-06", 5, "FAIL", "ogDescription 없음");
  else if (ogDesc.length >= 50 && ogDesc.length <= 120) push("R-SEO-06", 5, "PASS", `${ogDesc.length}자`);
  else push("R-SEO-06", 5, "PARTIAL", `${ogDesc.length}자`);

  // R-SEO-07 태그 규격
  const tags = Array.isArray(fm.tags) ? (fm.tags as string[]) : [];
  if (type === "courses") push("R-SEO-07", 10, "N/A", "코스는 태그 없음");
  else {
    const bad = tags.filter((t) => !CANONICAL_TAGS_FLAT.includes(t));
    if (tags.length >= 3 && tags.length <= 5 && bad.length === 0) push("R-SEO-07", 10, "PASS", `${tags.length}개`);
    else if (bad.length <= 1 && tags.length >= 2 && tags.length <= 6)
      push("R-SEO-07", 10, "PARTIAL", `${tags.length}개${bad.length ? ` 비표준 ${bad.join(",")}` : ""}`);
    else push("R-SEO-07", 10, "FAIL", `${tags.length}개${bad.length ? ` 비표준 ${bad.join(",")}` : ""}`);
  }

  // R-SEO-08 첫 100단어 안 핵심어
  const slug = String(fm.slug ?? "");
  const title = String(fm.title ?? fm.term ?? "");
  const head = body.trim().split(/\s+/).slice(0, 100).join(" ");
  const keywords = [
    ...new Set([
      ...title.replace(/[^\p{L}\p{N}\s]/gu, " ").split(/\s+/),
      ...slug.split("-"),
    ]),
  ].filter((k) => k.length >= 2 && !/^(what|is|the|and|for|guide|vs)$/i.test(k));
  const hit = keywords.filter((k) => head.toLowerCase().includes(k.toLowerCase()));
  if (hit.length >= 2) push("R-SEO-08", 10, "PASS", `${hit.length}개`);
  else if (hit.length === 1) push("R-SEO-08", 10, "PARTIAL", `${hit[0]}`);
  else push("R-SEO-08", 10, "FAIL", "핵심어 0개");

  return out;
}

// ─────────────────────────────────────────────────────────────── AEO

function scoreAeo(type: ContentType, fm: Record<string, unknown>, body: string): RuleResult[] {
  const out: RuleResult[] = [];
  const push = (id: string, weight: number, verdict: Verdict, detail: string) =>
    out.push({ id, area: "AEO", weight, verdict, detail });
  const hs = headings(body);
  const paras = proseParagraphs(body);

  // R-AEO-01 직접 답변
  if (type === "courses") push("R-AEO-01", 20, "N/A", "코스");
  else {
    const first = paras[0] ?? "";
    const lengthOk = first.length >= 50 && first.length <= 400;
    const defOk = DEFINITION_RE.test(paras.slice(0, 4).join("\n"));
    if (lengthOk && defOk) push("R-AEO-01", 20, "PASS", `첫 문단 ${first.length}자, 정의문 있음`);
    else if (lengthOk || defOk)
      push("R-AEO-01", 20, "PARTIAL", lengthOk ? `첫 문단 ${first.length}자, 정의문 없음` : `첫 문단 ${first.length}자`);
    else push("R-AEO-01", 20, "FAIL", `첫 문단 ${first.length}자, 정의문 없음`);
  }

  // R-AEO-02 FAQ 스키마 적합성 (실제 발행 로직과 같은 추출기를 쓴다)
  if (type === "courses") push("R-AEO-02", 15, "N/A", "코스");
  else {
    const pairs = extractFaqPairs(body);
    if (pairs.length >= 2) push("R-AEO-02", 15, "PASS", `${pairs.length}쌍`);
    else if (pairs.length === 1) push("R-AEO-02", 15, "PARTIAL", "1쌍");
    else push("R-AEO-02", 15, "FAIL", "0쌍");
  }

  // R-AEO-03 질문형 헤딩 비율
  if (type === "courses") push("R-AEO-03", 15, "N/A", "코스");
  else {
    const q = hs.filter((h) => /[?？]$/.test(h.text) || /(란|은 무엇|는 무엇|어떻게|왜 |언제|어디서|얼마)/.test(h.text));
    const ratio = hs.length ? q.length / hs.length : 0;
    const pct = `${q.length}/${hs.length}`;
    if (ratio >= 0.3) push("R-AEO-03", 15, "PASS", pct);
    else if (ratio >= 0.15) push("R-AEO-03", 15, "PARTIAL", pct);
    else push("R-AEO-03", 15, "FAIL", pct);
  }

  // R-AEO-04 피처드 스니펫 포맷
  const { tables, lists } = blockCounts(body);
  const hasDef = DEFINITION_RE.test(plain(body));
  const formats = (tables > 0 ? 1 : 0) + (lists > 0 ? 1 : 0) + (hasDef ? 1 : 0);
  if (formats >= 2) push("R-AEO-04", 15, "PASS", `표 ${tables} 리스트 ${lists}`);
  else if (formats === 1) push("R-AEO-04", 15, "PARTIAL", `표 ${tables} 리스트 ${lists}`);
  else push("R-AEO-04", 15, "FAIL", "표/리스트/정의문 없음");

  // R-AEO-05 핵심 요약
  // summary3는 화면에서 잠겨도 HTML에는 항상 들어간다(src/lib/summary-gate.ts). 답변 엔진 기준으로는
  // 본문 요약 헤딩과 같은 값이므로 둘 중 하나만 있어도 만점으로 본다.
  const s3 = Array.isArray(fm.summary3) ? (fm.summary3 as string[]) : [];
  const hasSummaryHeading = /^##\s+.*(요약|정리|핵심|TL;DR)/m.test(body);
  if (s3.length === 3 || hasSummaryHeading)
    push("R-AEO-05", 10, "PASS", s3.length === 3 ? "summary3" : "본문 요약");
  else if (s3.length > 0) push("R-AEO-05", 10, "PARTIAL", `summary3 ${s3.length}줄`);
  else push("R-AEO-05", 10, "FAIL", "요약 없음");

  // R-AEO-06 음성 검색 친화
  const voice = [
    ...plain(body).matchAll(
      /(어떻게|왜|언제|얼마나|무엇|어떤|어디)[^\n?]{1,40}(까요|나요|는가요|은가요|인가요|죠)\s*[?？]/g,
    ),
  ].length;
  if (voice >= 2) push("R-AEO-06", 10, "PASS", `${voice}개`);
  else if (voice === 1) push("R-AEO-06", 10, "PARTIAL", "1개");
  else push("R-AEO-06", 10, "FAIL", "0개");

  // R-AEO-07 엔티티 명확성
  const text = plain(body);
  // 일반에 굳어진 약어는 정의를 요구하지 않는다. 본문에서 세 번 이상 쓰인 약어만 핵심 엔티티로 본다.
  const COMMON_ACRONYMS = new Set([
    "AI", "API", "URL", "HTML", "CSS", "SQL", "JSON", "CSV", "PDF", "PNG", "JPG", "GIF", "PPT", "PPTX",
    "PC", "CPU", "GPU", "RAM", "USB", "OS", "IT", "ID", "IP", "HTTP", "HTTPS", "SNS", "TV", "DM", "QR",
    "AND", "OR", "NOT", "UI", "UX", "B2B", "B2C", "VIP", "FAQ", "CEO", "CTO", "GB", "MB", "KB",
    "GPT", "LLM", "CLI", "IDE", "SDK", "MIT", "EU", "FTC", "EC", "PR", "TDD", "ORM", "SEO",
  ]);
  const acronymCounts = new Map<string, number>();
  for (const m of text.matchAll(/(?<![A-Za-z0-9])[A-Z][A-Z0-9]{1,6}(?![A-Za-z0-9])/g)) {
    acronymCounts.set(m[0], (acronymCounts.get(m[0]) ?? 0) + 1);
  }
  const acronyms = [...acronymCounts]
    .filter(([a, n]) => n >= 3 && !COMMON_ACRONYMS.has(a) && /^[A-Z]{2,6}\d?$/.test(a) && !/^[0-9A-F]{6}$/.test(a))
    .map(([a]) => a);
  if (acronyms.length === 0) push("R-AEO-07", 15, "N/A", "약어 없음");
  else {
    // 이 블로그는 용어를 클래스 페이지 링크로 정의한다. 본문에서 해당 약어에 내부 링크가
    // 걸려 있으면 괄호 풀이나 정의문과 같은 값으로 센다.
    const linkedTerms = new Set(
      [...body.matchAll(/\[([^\]]+)\]\(\/(?:class|insights|ga4-edu)\/[^)]+\)/g)].map((m) => m[1]),
    );
    const aliasText = [
      String(fm.term ?? ""),
      ...(Array.isArray(fm.aliases) ? (fm.aliases as string[]) : []),
    ].join(" ");
    const defined = acronyms.filter((a) => {
      if ([...linkedTerms].some((t) => t.includes(a))) return true;
      if (aliasText.includes(a)) return true;
      const at = text.indexOf(a);
      const window = text.slice(Math.max(0, at - 20), at + 120);
      return new RegExp(`${a}\\s*\\(|\\(\\s*${a}`).test(window) || DEFINITION_RE.test(window.slice(window.indexOf(a)));
    });
    if (defined.length >= 2) push("R-AEO-07", 15, "PASS", `${defined.length}/${acronyms.length}`);
    else if (defined.length === 1) push("R-AEO-07", 15, "PARTIAL", `1/${acronyms.length}`);
    else push("R-AEO-07", 15, "FAIL", `0/${acronyms.length}: ${acronyms.slice(0, 4).join(",")}`);
  }

  return out;
}

// ─────────────────────────────────────────────────────────────── GEO

function scoreGeo(type: ContentType, fm: Record<string, unknown>, body: string): RuleResult[] {
  const out: RuleResult[] = [];
  const push = (id: string, weight: number, verdict: Verdict, detail: string) =>
    out.push({ id, area: "GEO", weight, verdict, detail });
  const text = plain(body);

  // R-GEO-01 출처 인용
  const externalLinks = [...body.matchAll(/\[[^\]]+\]\((https?:\/\/[^)]+)\)/g)]
    .map((m) => m[1])
    .filter((u) => !u.includes(SELF_HOST));
  const orgs = [
    ...text.matchAll(
      /(구글|Google|Meta|OpenAI|Anthropic|네이버|카카오|맥킨지|가트너|Gartner|Statista|Princeton|Nielsen|국립국어원|통계청|과학기술정보통신부|한국인터넷진흥원)/g,
    ),
  ].length;
  const reports = [...text.matchAll(/(에 따르면|가 발표|이 발표|공식 문서|도움말 문서|백서|연구|조사 결과|보고서)/g)].length;
  const cite = externalLinks.length + (orgs > 0 ? 1 : 0) + (reports > 0 ? 1 : 0);
  if (cite >= 2) push("R-GEO-01", 20, "PASS", `외부링크 ${externalLinks.length} 기관 ${orgs} 근거표현 ${reports}`);
  else if (cite === 1) push("R-GEO-01", 20, "PARTIAL", `외부링크 ${externalLinks.length} 기관 ${orgs} 근거표현 ${reports}`);
  else push("R-GEO-01", 20, "FAIL", "출처 신호 0");

  // R-GEO-02 통계 밀도
  const stats = [...text.matchAll(/\d[\d,.]*\s*(%|퍼센트|배|원|만원|억|달러|명|건|개|회|분|초|일|개월|년|점|위)/g)].filter(
    (m) => {
      const before = text.slice(Math.max(0, m.index! - 3), m.index!);
      return !/^\n\s*$/.test(before);
    },
  ).length;
  if (stats >= 3) push("R-GEO-02", 15, "PASS", `${stats}개`);
  else if (stats >= 1) push("R-GEO-02", 15, "PARTIAL", `${stats}개`);
  else push("R-GEO-02", 15, "FAIL", "0개");

  // R-GEO-03 구조화 데이터
  const { tables, lists } = blockCounts(body);
  if ((tables >= 1 && lists >= 2) || tables >= 2) push("R-GEO-03", 15, "PASS", `표 ${tables} 리스트 ${lists}`);
  else if (tables + lists >= 1) push("R-GEO-03", 15, "PARTIAL", `표 ${tables} 리스트 ${lists}`);
  else push("R-GEO-03", 15, "FAIL", "표/리스트 없음");

  // R-GEO-04 전문가 신호 (패턴 판정까지만)
  const expert = [
    ...text.matchAll(/(실무에서|직접 |운영해|담당하며|프로젝트에서|해 보니|해보니|재 보면|측정해 보면|현장에서|경험상|실측)/g),
  ].length;
  if (expert >= 2) push("R-GEO-04", 10, "PASS", `${expert}회`);
  else if (expert === 1) push("R-GEO-04", 10, "PARTIAL", "1회");
  else push("R-GEO-04", 10, "FAIL", "0회");

  // R-GEO-05 콘텐츠 신선도
  const year = new Date().getFullYear();
  const years = [...text.matchAll(new RegExp(`${year}|${year - 1}`, "g"))].length;
  const markers = [...text.matchAll(/(최근|올해|지난달|이번 주|\d+월 기준|기준 시점|업데이트|현재 기준)/g)].length;
  const updated = typeof fm.updatedAt === "string" ? 1 : 0;
  const fresh = (years > 0 ? 1 : 0) + (markers > 0 ? 1 : 0) + updated;
  if (fresh >= 2) push("R-GEO-05", 10, "PASS", `연도 ${years} 마커 ${markers} updatedAt ${updated}`);
  else if (fresh === 1) push("R-GEO-05", 10, "PARTIAL", `연도 ${years} 마커 ${markers} updatedAt ${updated}`);
  else push("R-GEO-05", 10, "FAIL", "시점 정보 없음");

  // R-GEO-06 주제 권위
  const internal = [...body.matchAll(/\[[^\]]+\]\(\/(insights|class|course|tags|ga4-edu|cases)\/[^)]+\)/g)].length;
  const inSeries = typeof fm.seriesSlug === "string" || typeof fm.courseSlug === "string";
  if (internal >= 2 || (inSeries && internal >= 1)) push("R-GEO-06", 15, "PASS", `내부링크 ${internal}`);
  else if (internal === 1 || inSeries) push("R-GEO-06", 15, "PARTIAL", `내부링크 ${internal}`);
  else push("R-GEO-06", 15, "FAIL", "내부링크 0");

  // R-GEO-07 인용 가능성
  const sentences = proseParagraphs(body)
    .join("\n")
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
  const quotable = sentences.filter((s) => {
    const n = s.replace(/\s/g, "").length;
    return n >= 40 && n <= 80 && !/^(이것|그것|이는|그래서|그러나|이런|그런|여기|거기)/.test(s);
  }).length;
  if (quotable >= 3) push("R-GEO-07", 15, "PASS", `${quotable}문장`);
  else if (quotable >= 1) push("R-GEO-07", 15, "PARTIAL", `${quotable}문장`);
  else push("R-GEO-07", 15, "FAIL", "0문장");

  return out;
}

// ─────────────────────────────────────────────────────────────── 집계

function areaScore(rules: RuleResult[], area: RuleResult["area"]): number {
  const applicable = rules.filter((r) => r.area === area && r.verdict !== "N/A");
  const max = applicable.reduce((n, r) => n + r.weight, 0);
  if (max === 0) return 100;
  const got = applicable.reduce((n, r) => n + (r.verdict === "PASS" ? r.weight : r.verdict === "PARTIAL" ? r.weight / 2 : 0), 0);
  return Math.round((got / max) * 1000) / 10;
}

function gradeOf(total: number) {
  return total >= 80 ? "A" : total >= 60 ? "B" : total >= 40 ? "C" : "D";
}

function scoreFile(type: ContentType, file: string): Scored {
  const raw = fs.readFileSync(file, "utf-8");
  const { data, content } = matter(raw);
  const fm = data as Record<string, unknown>;
  const rules = [...scoreSeo(type, fm, content), ...scoreAeo(type, fm, content), ...scoreGeo(type, fm, content)];
  const seo = areaScore(rules, "SEO");
  const aeo = areaScore(rules, "AEO");
  const geo = areaScore(rules, "GEO");
  const total = Math.round((seo * 0.35 + aeo * 0.3 + geo * 0.35) * 10) / 10;
  return {
    type,
    slug: String(fm.slug ?? path.basename(file, ".md")),
    file: path.relative(ROOT, file),
    title: String(fm.metaTitle ?? fm.title ?? fm.term ?? ""),
    rules,
    seo,
    aeo,
    geo,
    total,
    grade: gradeOf(total),
  };
}

const args = process.argv.slice(2);
const optionOf = (name: string) => {
  const i = args.indexOf(name);
  return i < 0 ? null : args[i + 1];
};

const all: Scored[] = [];
for (const type of ["insights", "classes", "courses"] as ContentType[]) {
  const dir = path.join(ROOT, "content", type);
  if (!fs.existsSync(dir)) continue;
  for (const name of fs.readdirSync(dir).filter((f) => f.endsWith(".md")).sort()) {
    all.push(scoreFile(type, path.join(dir, name)));
  }
}

const slugFilter = optionOf("--slug");
const ruleFilter = optionOf("--rule");
const csvPath = optionOf("--csv");
const worstN = Number(optionOf("--worst") ?? 25);

if (csvPath) {
  const ruleIds = all[0].rules.map((r) => r.id);
  const header = ["type", "slug", "total", "grade", "seo", "aeo", "geo", ...ruleIds].join(",");
  const rows = all.map((s) =>
    [s.type, s.slug, s.total, s.grade, s.seo, s.aeo, s.geo, ...ruleIds.map((id) => s.rules.find((r) => r.id === id)?.verdict ?? "")].join(","),
  );
  fs.writeFileSync(csvPath, [header, ...rows].join("\n") + "\n");
  console.log(`CSV 저장: ${csvPath} (${all.length}편)`);
}

if (slugFilter) {
  const one = all.find((s) => s.slug === slugFilter);
  if (!one) {
    console.error(`slug 없음: ${slugFilter}`);
    process.exit(1);
  }
  console.log(`${one.file}\n종합 ${one.total} (${one.grade})  SEO ${one.seo}  AEO ${one.aeo}  GEO ${one.geo}\n`);
  for (const r of one.rules) console.log(`  ${r.verdict.padEnd(7)} ${r.id}  ${r.detail}`);
  process.exit(0);
}

if (ruleFilter) {
  const hits = all
    .map((s) => ({ s, r: s.rules.find((r) => r.id === ruleFilter) }))
    .filter((x) => x.r && (x.r.verdict === "FAIL" || x.r.verdict === "PARTIAL"));
  console.log(`${ruleFilter} 미달 ${hits.length}편\n`);
  for (const { s, r } of hits) console.log(`${r!.verdict.padEnd(7)} ${s.type.padEnd(8)} ${s.slug.padEnd(42)} ${r!.detail}`);
  process.exit(0);
}

// 요약 리포트
console.log(`대상 ${all.length}편 (insights ${all.filter((s) => s.type === "insights").length}, classes ${all.filter((s) => s.type === "classes").length}, courses ${all.filter((s) => s.type === "courses").length})\n`);

const avg = (xs: number[]) => Math.round((xs.reduce((a, b) => a + b, 0) / xs.length) * 10) / 10;
console.log("평균 점수");
for (const type of ["insights", "classes", "courses"] as ContentType[]) {
  const g = all.filter((s) => s.type === type);
  if (!g.length) continue;
  console.log(`  ${type.padEnd(9)} 종합 ${avg(g.map((s) => s.total))}  SEO ${avg(g.map((s) => s.seo))}  AEO ${avg(g.map((s) => s.aeo))}  GEO ${avg(g.map((s) => s.geo))}`);
}
console.log(`  ${"전체".padEnd(9)} 종합 ${avg(all.map((s) => s.total))}  SEO ${avg(all.map((s) => s.seo))}  AEO ${avg(all.map((s) => s.aeo))}  GEO ${avg(all.map((s) => s.geo))}\n`);

console.log("등급 분포");
for (const g of ["A", "B", "C", "D"]) {
  const n = all.filter((s) => s.grade === g).length;
  console.log(`  ${g}: ${n}편 (${Math.round((n / all.length) * 100)}%)`);
}

console.log("\n규칙별 미달 (FAIL / PARTIAL)");
const ruleIds = [...new Set(all.flatMap((s) => s.rules.map((r) => r.id)))];
const rows = ruleIds
  .map((id) => {
    const rs = all.map((s) => s.rules.find((r) => r.id === id)!).filter((r) => r.verdict !== "N/A");
    return {
      id,
      weight: rs[0]?.weight ?? 0,
      fail: rs.filter((r) => r.verdict === "FAIL").length,
      partial: rs.filter((r) => r.verdict === "PARTIAL").length,
      n: rs.length,
    };
  })
  .sort((a, b) => b.fail * b.weight - a.fail * a.weight);
for (const r of rows) {
  const lost = r.fail * r.weight + r.partial * (r.weight / 2);
  console.log(`  ${r.id}  가중치 ${String(r.weight).padStart(2)}  FAIL ${String(r.fail).padStart(3)}  PARTIAL ${String(r.partial).padStart(3)}  /${r.n}  손실가중 ${lost}`);
}

console.log(`\n하위 ${worstN}편`);
for (const s of [...all].sort((a, b) => a.total - b.total).slice(0, worstN)) {
  const fails = s.rules.filter((r) => r.verdict === "FAIL").map((r) => r.id.replace("R-", "")).join(" ");
  console.log(`  ${String(s.total).padStart(5)} ${s.grade} ${s.type.padEnd(8)} ${s.slug.padEnd(40)} ${fails}`);
}
