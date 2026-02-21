import { GoogleGenerativeAI } from "@google/generative-ai";
import { CANONICAL_TAGS_FLAT } from "./constants";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);
export const aiModel = genAI.getGenerativeModel({
  model: process.env.AI_MODEL_NAME || "gemini-2.5-flash-preview-05-20",
});

export async function generateTagsFromContent(content: string): Promise<string[]> {
  const prompt = `다음 블로그 콘텐츠에 가장 적합한 태그를 3-5개 선택하세요.
반드시 아래 목록에서만 선택하세요:
${CANONICAL_TAGS_FLAT.join(", ")}

Format: JSON array of strings only. No explanations.
Content: ${content.substring(0, 2000)}`;

  try {
    const result = await aiModel.generateContent(prompt);
    const response = result.response.text();
    const cleaned = response.replace(/```json\n?|\n?```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (error) {
    console.error("AI tag generation failed:", error);
    return [];
  }
}

// SEO 점수 분석 결과 타입
export interface SeoAnalysisResult {
  score: number; // 0-100
  checks: SeoCheck[];
  suggestions: string[];
}

export interface SeoCheck {
  id: string;
  label: string;
  passed: boolean;
  message: string;
  importance: "high" | "medium" | "low";
}

// SEO 점수 분석 함수 (로컬 분석)
export function analyzeSeoScore(data: {
  title: string;
  metaTitle?: string;
  metaDescription?: string;
  content: string;
  ogImage?: string;
}): SeoAnalysisResult {
  const checks: SeoCheck[] = [];
  const suggestions: string[] = [];

  const effectiveTitle = data.metaTitle || data.title;

  // 1. 제목 길이 체크 (30-60자)
  const titleLength = effectiveTitle.length;
  checks.push({
    id: "title-length",
    label: "제목 길이",
    passed: titleLength >= 30 && titleLength <= 60,
    message:
      titleLength < 30
        ? `제목이 너무 짧습니다 (${titleLength}자). 30자 이상 권장.`
        : titleLength > 60
          ? `제목이 너무 깁니다 (${titleLength}자). 60자 이하 권장.`
          : `적절한 제목 길이입니다 (${titleLength}자).`,
    importance: "high",
  });

  // 2. 메타 설명 체크 (120-160자)
  const descLength = data.metaDescription?.length || 0;
  checks.push({
    id: "meta-description",
    label: "메타 설명",
    passed: descLength >= 120 && descLength <= 160,
    message:
      descLength === 0
        ? "메타 설명이 없습니다. 120-160자로 작성하세요."
        : descLength < 120
          ? `메타 설명이 짧습니다 (${descLength}자). 120자 이상 권장.`
          : descLength > 160
            ? `메타 설명이 깁니다 (${descLength}자). 160자 이하 권장.`
            : `적절한 메타 설명 길이입니다 (${descLength}자).`,
    importance: "high",
  });

  // 3. 본문 길이 (최소 300단어)
  const wordCount = data.content.split(/\s+/).filter((w) => w.length > 0).length;
  checks.push({
    id: "content-length",
    label: "본문 길이",
    passed: wordCount >= 300,
    message:
      wordCount < 300
        ? `본문이 짧습니다 (${wordCount}단어). 300단어 이상 권장.`
        : `충분한 본문 길이입니다 (${wordCount}단어).`,
    importance: "medium",
  });

  // 4. OG 이미지 설정
  checks.push({
    id: "og-image",
    label: "OG 이미지",
    passed: !!data.ogImage,
    message: data.ogImage ? "OG 이미지가 설정되어 있습니다." : "소셜 공유용 OG 이미지를 설정하세요.",
    importance: "medium",
  });

  // 5. 헤딩 구조 체크 (H2, H3)
  const hasH2 = data.content.includes("## ") || data.content.includes("<h2");
  checks.push({
    id: "heading-structure",
    label: "헤딩 구조",
    passed: hasH2,
    message: hasH2
      ? "적절한 헤딩 구조를 사용하고 있습니다."
      : "H2, H3 등 헤딩 태그를 사용하여 구조화하세요.",
    importance: "low",
  });

  // 점수 계산
  const weights = { high: 15, medium: 10, low: 5 };
  let totalWeight = 0;
  let earnedWeight = 0;

  checks.forEach((check) => {
    const weight = weights[check.importance];
    totalWeight += weight;
    if (check.passed) earnedWeight += weight;
  });

  const score = Math.round((earnedWeight / totalWeight) * 100);

  // AI 제안 생성
  const failedHighPriority = checks.filter((c) => !c.passed && c.importance === "high");
  failedHighPriority.forEach((check) => {
    suggestions.push(check.message);
  });

  return { score, checks, suggestions };
}

// AI 기반 SEO 개선 제안 생성
export async function generateSeoSuggestions(data: { title: string; content: string }): Promise<string[]> {
  const prompt = `당신은 SEO 전문가입니다. 다음 블로그 글을 분석하고 SEO 개선을 위한 구체적인 제안 3가지를 한국어로 제공하세요.

제목: ${data.title}
본문 (처음 1000자): ${data.content.substring(0, 1000)}

JSON 배열 형식으로만 응답하세요. 예: ["제안1", "제안2", "제안3"]`;

  try {
    const result = await aiModel.generateContent(prompt);
    const response = result.response.text();
    const cleaned = response.replace(/```json\n?|\n?```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (error) {
    console.error("AI SEO suggestion failed:", error);
    return [];
  }
}

// AI 기반 메타 설명 자동 생성
export async function generateMetaDescription(data: { title: string; content: string }): Promise<string> {
  const prompt = `다음 블로그 글의 SEO 최적화된 메타 설명을 작성하세요.

요구사항:
- 120-155자 사이
- 글 내용을 압축하여 핵심키워드와 내용 중심으로 요약
- 한국어로 작성

제목: ${data.title}
본문 (처음 500자): ${data.content.substring(0, 500)}

메타 설명만 출력하세요. 따옴표나 설명 없이 텍스트만.`;

  try {
    const result = await aiModel.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error("AI meta description generation failed:", error);
    return "";
  }
}

// 콘텐츠 메타데이터 자동 생성 결과 타입
export interface ContentMetadata {
  title: string;
  slug: string;
  excerpt: string;
  category: "MARKETING" | "AI_TECH" | "DATA" | "맛집" | "강의" | "문화생활" | "여행" | "일상";
  tags: string[];
}

// AI 기반 콘텐츠 메타데이터 자동 생성
export async function generateContentMetadata(content: string): Promise<ContentMetadata | null> {
  const prompt = `당신은 테크 블로그 에디터입니다. 다음 블로그 본문을 분석하여 메타데이터를 생성하세요.

본문:
${content.substring(0, 3000)}

다음 JSON 형식으로만 응답하세요 (설명 없이):
{
  "title": "SEO 최적화된 매력적인 제목 (30-60자, 한국어)",
  "slug": "url-friendly-slug-in-english (소문자, 하이픈 사용, 50자 이내)",
  "excerpt": "글 요약 (100-150자, 한국어, 핵심 내용 포함)",
  "category": "MARKETING, AI_TECH, DATA, 맛집, 강의, 문화생활, 여행, 일상 중 하나",
  "tags": ["태그1", "태그2", "태그3"] (3-5개, 반드시 다음 목록에서만 선택: ${CANONICAL_TAGS_FLAT.join(", ")})
}

카테고리 선택 기준:
- MARKETING: 마케팅, 광고, 브랜딩, 고객, 캠페인, 전환율 관련
- AI_TECH: AI, 머신러닝, 기술, 개발, 자동화, 챗봇 관련
- DATA: 데이터 분석, 통계, 지표, 대시보드, 인사이트 관련
- 맛집: 음식, 레스토랑, 카페, 맛집 리뷰 관련
- 강의: 강의, 교육, 수업, 세미나, 워크샵 관련
- 문화생활: 영화, 전시, 공연, 문화 활동 관련
- 여행: 여행, 관광, 여행지 추천 관련
- 일상: 일상 생활, 개인 경험, 일기 형식 관련`;

  try {
    const result = await aiModel.generateContent(prompt);
    const response = result.response.text();
    const cleaned = response.replace(/```json\n?|\n?```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    // 유효성 검사
    if (!parsed.title || !parsed.slug || !parsed.category) {
      throw new Error("필수 필드 누락");
    }

    // 카테고리 유효성 검사
    const validCategories = ["MARKETING", "AI_TECH", "DATA", "맛집", "강의", "문화생활", "여행", "일상"];
    if (!validCategories.includes(parsed.category)) {
      parsed.category = "AI_TECH"; // 기본값
    }

    return {
      title: parsed.title,
      slug: parsed.slug.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-"),
      excerpt: parsed.excerpt || "",
      category: parsed.category,
      tags: Array.isArray(parsed.tags) ? parsed.tags.slice(0, 5) : [],
    };
  } catch (error) {
    console.error("AI content metadata generation failed:", error);
    return null;
  }
}

// LinkedIn 포스트 후처리: 플레이스홀더 → 실제 URL 치환 + URL 누락 시 추가
function postProcessLinkedInText(text: string, url: string): string {
  // 1. 모든 형태의 플레이스홀더를 실제 URL로 치환
  let result = text.replace(/\{link\}|\{url\}|\{URL\}|\[링크\]|\[link\]|\[URL\]|\(link\)|\(url\)/gi, url);
  // 2. 텍스트에 실제 URL이 없으면 마지막에 추가
  if (!result.includes(url)) {
    result = result.trimEnd() + "\n" + url;
  }
  return result;
}

// AI 기반 링크드인 업로드용 요약 생성
export async function generateLinkedInSummary(data: {
  title: string;
  content: string;
  url: string;
}): Promise<string> {
  const prompt = `원문을 읽고, 원문의 핵심 내용을 바탕으로 LinkedIn 포스트를 써라.
원문의 문장을 그대로 베끼지는 마라. 하지만 원문이 다루는 핵심 주장, 개념, 흐름은 반드시 반영해라.
읽는 사람이 "이 글이 어떤 내용인지" 감을 잡을 수 있어야 한다.

== 목표 ==
원문의 핵심 메시지를 동료에게 말로 전하듯 풀어써라.
포스트를 읽으면 원문이 무엇을 말하는지 맥락이 잡혀야 한다.
공감 위에서 "이걸 더 자세히 정리한 글이 있다"고 자연스럽게 연결해라.

== 제약 ==
- URL 포함 총 800~1,200자.
- 의미 단락 사이 빈 줄.
- 긴 문장은 의미 단위에서 자연스럽게 줄바꿈해라. 1문장=1줄을 강제하지 마라.
- 마크다운 금지, 이모지 금지, 순수 텍스트만.
- 기술 용어 영어, 나머지 한국어.

== 톤 ==
- 같은 일을 하는 동료와 점심 먹으며 나누는 대화.
- 상대를 가르치거나 지적하지 마라. "같이 겪은 사람"으로서 말해라.
- "~하는 순간이 있죠", "돌이켜보니 그랬더라고요" 같은 부드러운 회고.
- 경고/훈계조 금지. 발견과 공유의 톤을 써라.

== 구조 ==

[도입 — 1-2문장]
원문이 다루는 핵심 주제와 관련해 많은 사람이 한번쯤 느꼈을 순간을 부드럽게 꺼내라.
"~하는 순간이 있죠", "~라는 걸 체감할 때가 있습니다" 같은 톤.
도입만 읽어도 "이 글이 어떤 이야기인지" 짐작되어야 한다.

(빈 줄)

[이야기 전개 — 평문 5-8문장]
원문의 핵심 흐름을 따라가되, 자기 경험처럼 자연스럽게 풀어써라.
원문에서 다루는 주요 개념이나 핵심 주장을 대화체로 녹여라.
"처음엔 ~라고 생각했는데", "실제로 해보니 ~더라고요" 같은 전환.
독자가 원문의 맥락을 자연스럽게 파악하면서 고개를 끄덕이게 써라.

(빈 줄)

[인사이트 — 개조식 3-5항목]
원문에서 실제로 다루는 핵심 포인트를 "- " 접두어로 나열.
원문의 내용을 기반으로 하되, 대화체로 재구성해라.
"~는 결국 ~의 몫이더라고요", "~을 먼저 짚어봐야 합니다" 같은 관점 공유.

(빈 줄)

[마무리 — 평문 2-3문장]
이야기를 부드럽게 정리하며 블로그 글로 연결.
"이 내용을 좀 더 구체적으로 정리해봤습니다", "같은 고민을 하는 분들께 도움이 되면 좋겠습니다" 같은 겸손한 공유.
마지막에 아래 한 블록만 정확히 1회 넣어라 (중복 금지):
[${data.title}]
${data.url}

== 절대 금지 ==
- 원문과 동떨어진 일반론이나 추상적 이야기로 채우는 행위
- 원문의 문장을 그대로 복사하는 행위
- 상대를 낮추거나 지적하는 표현 ("이것도 모르면", "아직도 ~하고 있다면")
- 경고/훈계조 ("~하면 안 됩니다", "~는 위험합니다")
- {link}, [링크], (url) 같은 플레이스홀더

== 원문 (핵심 내용 파악 후 대화체로 재구성) ==
제목: ${data.title}
URL: ${data.url}
내용:
${data.content.substring(0, 3000)}

LinkedIn 포스트 텍스트만 출력. 따옴표, 부연 설명 없이 본문만.`;

  try {
    const result = await aiModel.generateContent(prompt);
    const text = result.response.text().trim();
    return postProcessLinkedInText(text, data.url);
  } catch (error) {
    console.error("AI LinkedIn summary generation failed:", error);
    return "요약 생성 중에 오류가 발생했습니다.";
  }
}

// 키워드 요약형 LinkedIn 요약 생성
export async function generateLinkedInSummaryKeyword(data: {
  title: string;
  content: string;
  url: string;
}): Promise<string> {
  const prompt = `원문의 본문을 읽고, 콘텐츠를 관통하는 핵심 키워드 3~5개를 추출해라.
그 키워드를 뼈대로 삼아 원문의 핵심 메시지를 LinkedIn 포스트로 요약해라.

== 목표 ==
원문이 실제로 다루는 핵심 내용을 키워드 중심으로 압축 전달해라.
포스트만 읽어도 원문의 골자를 파악할 수 있어야 한다.
"더 자세한 내용이 궁금하다면" 수준으로 블로그 링크를 연결해라.

== 제약 ==
- URL 포함 총 800~1,200자.
- 의미 단락 사이 빈 줄.
- 긴 문장은 의미 단위에서 자연스럽게 줄바꿈해라. 1문장=1줄을 강제하지 마라.
- 마크다운 금지, 이모지 금지, 순수 텍스트만.
- 기술 용어 영어, 나머지 한국어.

== 톤 ==
- 핵심을 간결하게 짚어주는 실용적 톤.
- "~의 핵심은 결국 ~입니다", "여기서 중요한 건 ~입니다" 같은 명확한 전달.
- 과장 없이, 원문이 실제로 말하는 내용만 다뤄라.
- 독자가 "이 글의 포인트를 빠르게 잡았다"고 느끼게 써라.

== 구조 ==

[키워드 제시 + 도입 — 2-3문장]
원문의 핵심 키워드를 자연스럽게 녹여서 "이 글이 무엇에 대한 것인지" 한눈에 보이게 시작해라.
키워드를 나열하지 말고, 문장 속에 자연스럽게 배치해라.

(빈 줄)

[핵심 요약 — 개조식 3-5항목]
각 키워드와 연결되는 원문의 핵심 포인트를 "- " 접두어로 정리해라.
원문에서 실제로 다루는 내용을 기반으로, 각 항목이 서로 다른 측면을 짚어야 한다.
"~라는 점", "~가 핵심입니다" 같은 요약 톤.

(빈 줄)

[마무리 + 링크 — 2-3문장]
키워드들을 하나로 엮는 한 줄 정리 후, 원문 링크로 연결.
"각 내용을 구체적으로 풀어둔 글입니다" 같은 자연스러운 연결.
마지막에 아래 한 블록만 정확히 1회 넣어라 (중복 금지):
[${data.title}]
${data.url}

== 절대 금지 ==
- 원문에 없는 내용을 지어내는 행위
- 키워드를 해시태그(#)로 나열하는 행위
- 상투적 마케팅 문구 ("꼭 읽어보세요", "놓치지 마세요")
- {link}, [링크], (url) 같은 플레이스홀더

== 원문 (키워드 추출 및 요약 대상) ==
제목: ${data.title}
URL: ${data.url}
내용:
${data.content.substring(0, 3000)}

LinkedIn 포스트 텍스트만 출력. 따옴표, 부연 설명 없이 본문만.`;

  try {
    const result = await aiModel.generateContent(prompt);
    const text = result.response.text().trim();
    return postProcessLinkedInText(text, data.url);
  } catch (error) {
    console.error("AI LinkedIn keyword summary generation failed:", error);
    return "요약 생성 중에 오류가 발생했습니다.";
  }
}

// 가벼운 공유형 LinkedIn 요약 생성
export async function generateLinkedInSummaryCasual(data: {
  title: string;
  content: string;
  url: string;
}): Promise<string> {
  const prompt = `원문의 "주제"만 참고해서 LinkedIn 포스트를 써라.
원문의 내용, 용어, 구조, 사례를 직접 인용하거나 요약하지 마라.
원문은 주제 파악용일 뿐이다. 포스트는 원문과 완전히 다른 글이어야 한다.

== 목표 ==
혼자 체감한 변화를 조용히 나누는 글을 써라.
"정리했다", "분석했다"가 아니라 "이런 걸 느꼈다"에서 출발해라.
읽는 사람이 "나도 그랬는데"라고 고개를 끄덕이게 만들어라.
링크는 "관심 있으면 한번 보세요" 수준으로 가볍게 붙여라.

== 제약 ==
- URL 포함 총 400~700자. 반드시 짧게.
- 의미 단락 사이 빈 줄.
- 마크다운 금지, 이모지 금지, 순수 텍스트만.
- 기술 용어 영어, 나머지 한국어.
- 개조식/불릿 포인트 절대 사용하지 마라. 평문으로만 써라.

== 톤 ==
- 혼잣말처럼 생각을 나누는 느낌. 상대를 의식하지 않는 자연스러운 독백.
- "~것 같습니다", "~더라고요", "~보여서" 같은 부드러운 회고 어미.
- "저부터도", "슬쩍", "조용히" 같은 겸손하고 절제된 표현.
- 가르치거나 설명하지 마라. 관찰을 나누는 것이다.
- 힘 빼고 써라. 담백할수록 좋다.

== 구조 ==

[체감 도입 — 1-2문장]
최근에 본인이 직접 느낀 변화를 꺼내라.
"최근 ~에서 뭔가 확 체감되는 부분이 있는데" 같은 개인적 관찰로 시작.

(빈 줄)

[생각 전개 — 3-5문장]
그 체감이 구체적으로 어떤 것인지 흘러가듯 풀어라.
한 생각이 다음 생각으로 자연스럽게 이어지게 써라.
"단순히 ~라는 느낌보다는", "~자체가 크게 줄고 있다는 생각이 들더라고요" 같은 흐름.

(빈 줄)

[가벼운 공유 + 링크 — 2-3문장]
"이 변화의 맥락을 짚어보는 자료를 찾아봤는데 흥미로웠습니다" 같은 발견 공유.
"궁금하신 분들은 한번 가볍게 확인해 보세요" 정도로 마무리.
마지막에 아래 한 블록만 정확히 1회 넣어라 (중복 금지):
[${data.title}]
${data.url}

== 절대 금지 ==
- 원문의 내용, 사례, 용어, 구조를 인용하거나 요약하는 행위
- 장황한 설명이나 인사이트 나열
- 개조식 목록 (- 항목)
- "정리했습니다", "분석해봤습니다" 같은 전문가 포지셔닝
- {link}, [링크], (url) 같은 플레이스홀더

== 원문 (주제 파악용, 직접 인용 금지) ==
제목: ${data.title}
URL: ${data.url}
내용:
${data.content.substring(0, 3000)}

LinkedIn 포스트 텍스트만 출력. 따옴표, 부연 설명 없이 본문만.`;

  try {
    const result = await aiModel.generateContent(prompt);
    const text = result.response.text().trim();
    return postProcessLinkedInText(text, data.url);
  } catch (error) {
    console.error("AI LinkedIn casual summary generation failed:", error);
    return "요약 생성 중에 오류가 발생했습니다.";
  }
}

/** LinkedIn 질문/토론형 요약 — 댓글 유도 */
export async function generateLinkedInSummaryQuestion(data: {
  title: string;
  content: string;
  url: string;
}): Promise<string> {
  const prompt = `원문을 읽고, 원문의 핵심 주제에서 사람들이 의견이 갈릴 수 있는 질문을 뽑아라.
그 질문을 중심으로 LinkedIn 포스트를 써라. 목표는 댓글과 토론을 유도하는 것이다.

== 목표 ==
원문의 핵심 주제에서 생각해볼 만한 질문을 던져라.
일방적으로 답을 제시하지 말고, 본인의 관점을 짧게 밝힌 뒤 "여러분은 어떻게 생각하시나요?"로 열어라.
읽는 사람이 자기 생각을 댓글로 남기고 싶게 만드는 것이 핵심이다.

== 제약 ==
- URL 포함 총 600~1,000자.
- 의미 단락 사이 빈 줄.
- 마크다운 금지, 이모지 금지, 순수 텍스트만.
- 기술 용어 영어, 나머지 한국어.

== 톤 ==
- 호기심을 자극하는 톤. "~일까요?", "~는 정말 그럴까요?" 같은 열린 질문.
- 본인 의견은 단정 짓지 않고 "저는 ~라고 생각하는 편입니다" 수준으로 부드럽게.
- 다른 의견도 존중하는 자세. "물론 ~라는 시각도 있고요."
- 논쟁을 붙이려는 것이 아니라, 생각할 거리를 던지는 것이다.

== 구조 ==

[질문 도입 — 1-2문장]
원문 주제와 관련된 강렬한 질문이나 의외의 관점으로 시작해라.
첫 문장만 읽어도 "어, 이거 재미있네" 하고 멈춰서 읽게 해라.
"~는 정말 효과가 있을까요?", "~를 아직도 하고 계신가요?" 같은 톤.

(빈 줄)

[맥락 제시 — 3-5문장]
질문의 배경이 되는 맥락을 원문 내용을 바탕으로 짧게 설명해라.
"최근 ~가 바뀌면서", "실제로 ~라는 데이터가 있는데" 같은 근거.
너무 길게 설명하지 말고 토론의 재료를 깔아주는 정도.

(빈 줄)

[본인 관점 — 2-3문장]
"개인적으로는 ~라고 생각합니다" 수준으로 본인 입장을 밝혀라.
단정 짓지 말고, 하나의 관점으로만 제시해라.

(빈 줄)

[토론 유도 + 링크 — 2-3문장]
"여러분은 어떻게 생각하시나요?", "현장에서는 어떤 경험을 하고 계신지 궁금합니다" 같은 열린 질문.
관련 글 링크를 자연스럽게 첨부.
마지막에 아래 한 블록만 정확히 1회 넣어라 (중복 금지):
[${data.title}]
${data.url}

== 절대 금지 ==
- 답을 단정 짓거나 한쪽 입장만 강하게 주장하는 행위
- 원문에 없는 내용으로 질문을 만드는 행위
- 상대를 비판하거나 깎아내리는 표현
- 클릭베이트성 과장 ("충격적인", "반드시 알아야 할")
- {link}, [링크], (url) 같은 플레이스홀더

== 원문 (질문 추출 대상) ==
제목: ${data.title}
URL: ${data.url}
내용:
${data.content.substring(0, 3000)}

LinkedIn 포스트 텍스트만 출력. 따옴표, 부연 설명 없이 본문만.`;

  try {
    const result = await aiModel.generateContent(prompt);
    const text = result.response.text().trim();
    return postProcessLinkedInText(text, data.url);
  } catch (error) {
    console.error("AI LinkedIn question summary generation failed:", error);
    return "요약 생성 중에 오류가 발생했습니다.";
  }
}

/** LinkedIn 실전 팁형 요약 — 저장/공유 유도 */
export async function generateLinkedInSummaryTips(data: {
  title: string;
  content: string;
  url: string;
}): Promise<string> {
  const prompt = `원문을 읽고, 독자가 바로 실무에 적용할 수 있는 실전 팁을 추출해라.
번호를 매긴 짧고 명확한 팁 리스트 형태의 LinkedIn 포스트를 써라.

== 목표 ==
원문에서 실무자가 즉시 행동으로 옮길 수 있는 포인트를 뽑아라.
"저장해뒀다가 나중에 다시 보고 싶은 글"이 되는 것이 목표다.
각 팁은 구체적이고, 모호하지 않아야 한다.

== 제약 ==
- URL 포함 총 800~1,200자.
- 의미 단락 사이 빈 줄.
- 마크다운 금지, 이모지 금지, 순수 텍스트만.
- 기술 용어 영어, 나머지 한국어.

== 톤 ==
- 실무자끼리 노하우를 공유하는 톤. 친근하지만 구체적.
- "~해보세요", "~하는 게 좋습니다" 같은 실용적 권유.
- 이론이 아니라 행동 중심. "왜"보다 "어떻게"에 집중.
- 짧고 임팩트 있게. 한 팁에 2문장을 넘기지 마라.

== 구조 ==

[도입 — 1-2문장]
원문의 주제를 언급하며 "실무에서 바로 쓸 수 있는 팁"을 정리했다고 시작해라.
"~를 운영하면서 바로 적용할 수 있는 팁을 정리해봤습니다" 같은 톤.

(빈 줄)

[팁 리스트 — 번호 매긴 5-7개 항목]
각 팁을 "1. ", "2. " 형태로 나열해라.
각 항목은 구체적인 행동 지침이어야 한다.
"~를 설정하세요", "~로 변경하세요", "~를 확인하세요" 같은 명확한 액션.
원문에서 실제로 다루는 내용을 기반으로 하되, 핵심만 압축.

(빈 줄)

[마무리 + 링크 — 2-3문장]
"각 팁의 구체적인 방법과 배경은 아래 글에서 자세히 다뤘습니다" 같은 연결.
저장이나 공유를 은근히 유도. "나중에 참고하실 분들은 저장해두시면 좋을 것 같습니다."
마지막에 아래 한 블록만 정확히 1회 넣어라 (중복 금지):
[${data.title}]
${data.url}

== 절대 금지 ==
- 추상적이거나 모호한 팁 ("좋은 전략을 세우세요", "데이터를 활용하세요")
- 원문에 없는 내용을 팁으로 만드는 행위
- 이론 설명이나 배경 지식 나열
- 각 팁이 3문장 이상 되는 것
- {link}, [링크], (url) 같은 플레이스홀더

== 원문 (팁 추출 대상) ==
제목: ${data.title}
URL: ${data.url}
내용:
${data.content.substring(0, 3000)}

LinkedIn 포스트 텍스트만 출력. 따옴표, 부연 설명 없이 본문만.`;

  try {
    const result = await aiModel.generateContent(prompt);
    const text = result.response.text().trim();
    return postProcessLinkedInText(text, data.url);
  } catch (error) {
    console.error("AI LinkedIn tips summary generation failed:", error);
    return "요약 생성 중에 오류가 발생했습니다.";
  }
}

// LinkedIn 요약 5가지 버전 병렬 생성
export type LinkedInSummaryVersions = {
  standard: string;
  keyword: string;
  casual: string;
  question: string;
  tips: string;
};

export async function generateAllLinkedInSummaries(data: {
  title: string;
  content: string;
  url: string;
}): Promise<LinkedInSummaryVersions> {
  const [standard, keyword, casual, question, tips] = await Promise.all([
    generateLinkedInSummary(data),
    generateLinkedInSummaryKeyword(data),
    generateLinkedInSummaryCasual(data),
    generateLinkedInSummaryQuestion(data),
    generateLinkedInSummaryTips(data),
  ]);
  return { standard, keyword, casual, question, tips };
}

// 코스용 키워드 요약형 LinkedIn 요약 생성
export async function generateCourseLinkedInSummaryKeyword(data: {
  courseTitle: string;
  courseDescription: string;
  classes: { term: string; definition: string }[];
  url: string;
}): Promise<string> {
  const classTerms = data.classes.map(c => c.term).join(", ");
  const prompt = `아래 코스의 핵심 키워드와 내용을 바탕으로 LinkedIn 포스트를 써라.
코스에 포함된 용어들이 곧 이 콘텐츠의 핵심 키워드다.

== 목표 ==
코스가 다루는 핵심 개념들을 키워드 중심으로 압축 전달해라.
포스트만 읽어도 이 코스가 어떤 영역의 어떤 개념들을 다루는지 파악할 수 있어야 한다.
"더 자세한 내용이 궁금하다면" 수준으로 가이드 링크를 연결해라.

== 제약 ==
- URL 포함 총 800~1,200자.
- 의미 단락 사이 빈 줄.
- 긴 문장은 의미 단위에서 자연스럽게 줄바꿈해라. 1문장=1줄을 강제하지 마라.
- 마크다운 금지, 이모지 금지, 순수 텍스트만.
- 기술 용어는 영어, 나머지는 한국어.

== 톤 ==
- 핵심을 간결하게 짚어주는 실용적 톤.
- "~의 핵심은 결국 ~입니다", "여기서 중요한 건 ~입니다" 같은 명확한 전달.
- 과장 없이, 코스가 실제로 다루는 내용만 써라.

== 구조 ==

[키워드 제시 + 도입 — 2-3문장]
코스의 핵심 키워드를 자연스럽게 녹여서 "이 가이드가 무엇에 대한 것인지" 한눈에 보이게 시작해라.

(빈 줄)

[핵심 요약 — 개조식 3-5항목]
각 키워드와 연결되는 핵심 포인트를 "- " 접두어로 정리해라.
각 항목이 서로 다른 측면을 짚어야 한다.

(빈 줄)

[마무리 + 링크 — 2-3문장]
키워드들을 하나로 엮는 한 줄 정리 후, 가이드 링크로 연결.
마지막에 아래 한 블록만 정확히 1회 넣어라 (중복 금지):
[${data.courseTitle}]
${data.url}

== 절대 금지 ==
- 코스에 없는 내용을 지어내는 행위
- 키워드를 해시태그(#)로 나열하는 행위
- 상투적 마케팅 문구 ("꼭 읽어보세요", "놓치지 마세요")
- {link}, [링크], (url) 같은 플레이스홀더

== 코스 정보 (키워드 추출 및 요약 대상) ==
코스 제목: ${data.courseTitle}
코스 설명: ${data.courseDescription}
핵심 용어: ${classTerms}
주제 수: ${data.classes.length}개
실제 URL: ${data.url}

LinkedIn 포스트 텍스트만 출력. 따옴표, 설명, 부연 없이.`;

  try {
    const result = await aiModel.generateContent(prompt);
    const text = result.response.text().trim();
    return postProcessLinkedInText(text, data.url);
  } catch (error) {
    console.error("AI Course LinkedIn keyword summary generation failed:", error);
    return "요약 생성 중에 오류가 발생했습니다.";
  }
}

// 코스용 가벼운 공유형 LinkedIn 요약 생성
export async function generateCourseLinkedInSummaryCasual(data: {
  courseTitle: string;
  courseDescription: string;
  classes: { term: string; definition: string }[];
  url: string;
}): Promise<string> {
  const prompt = `원문의 "주제"만 참고해서 LinkedIn 포스트를 써라.
원문의 내용, 용어, 구조를 직접 인용하거나 요약하지 마라.
원문은 주제 파악용일 뿐이다. 포스트는 원문과 완전히 다른 글이어야 한다.

== 목표 ==
혼자 체감한 변화를 조용히 나누는 글을 써라.
"정리했다", "분석했다"가 아니라 "이런 걸 느꼈다"에서 출발해라.
읽는 사람이 "나도 그랬는데"라고 고개를 끄덕이게 만들어라.
링크는 "관심 있으면 한번 보세요" 수준으로 가볍게 붙여라.

== 제약 ==
- URL 포함 총 400~700자. 반드시 짧게.
- 의미 단락 사이 빈 줄.
- 마크다운 금지, 이모지 금지, 순수 텍스트만.
- 기술 용어는 영어, 나머지는 한국어.
- 개조식/불릿 포인트 절대 사용하지 마라. 평문으로만 써라.

== 톤 ==
- 혼잣말처럼 생각을 나누는 느낌. 상대를 의식하지 않는 자연스러운 독백.
- "~것 같습니다", "~더라고요", "~보여서" 같은 부드러운 회고 어미.
- "저부터도", "슬쩍", "조용히" 같은 겸손하고 절제된 표현.
- 가르치거나 설명하지 마라. 관찰을 나누는 것이다.
- 힘 빼고 써라. 담백할수록 좋다.

== 구조 ==

[체감 도입 — 1-2문장]
최근에 본인이 직접 느낀 변화를 꺼내라.
"최근 ~에서 뭔가 확 체감되는 부분이 있는데" 같은 개인적 관찰로 시작.

(빈 줄)

[생각 전개 — 3-5문장]
그 체감이 구체적으로 어떤 것인지 흘러가듯 풀어라.
한 생각이 다음 생각으로 자연스럽게 이어지게 써라.

(빈 줄)

[가벼운 공유 + 링크 — 2-3문장]
"이 변화의 맥락을 짚어보는 자료를 찾아봤는데 흥미로웠습니다" 같은 발견 공유.
"궁금하신 분들은 한번 가볍게 확인해 보세요" 정도로 마무리.
마지막에 아래 한 블록만 정확히 1회 넣어라 (중복 금지):
[${data.courseTitle}]
${data.url}

== 절대 금지 ==
- 원문의 내용, 사례, 용어, 구조를 인용하거나 요약하는 행위
- 장황한 설명이나 인사이트 나열
- 개조식 목록 (- 항목)
- "정리했습니다", "분석해봤습니다" 같은 전문가 포지셔닝
- {link}, [링크], (url) 같은 플레이스홀더

== 원문 (주제 파악용, 직접 인용 금지) ==
코스 제목: ${data.courseTitle}
코스 설명: ${data.courseDescription}
주제 수: ${data.classes.length}개
실제 URL: ${data.url}

LinkedIn 포스트 텍스트만 출력. 따옴표, 설명, 부연 없이.`;

  try {
    const result = await aiModel.generateContent(prompt);
    const text = result.response.text().trim();
    return postProcessLinkedInText(text, data.url);
  } catch (error) {
    console.error("AI Course LinkedIn casual summary generation failed:", error);
    return "요약 생성 중에 오류가 발생했습니다.";
  }
}

/** 코스용 LinkedIn 질문/토론형 요약 */
export async function generateCourseLinkedInSummaryQuestion(data: {
  courseTitle: string;
  courseDescription: string;
  classes: { term: string; definition: string }[];
  url: string;
}): Promise<string> {
  const classTerms = data.classes.map(c => c.term).join(", ");
  const prompt = `아래 코스의 주제에서 사람들이 의견이 갈릴 수 있는 질문을 뽑아라.
그 질문을 중심으로 LinkedIn 포스트를 써라. 목표는 댓글과 토론을 유도하는 것이다.

== 목표 ==
코스의 핵심 주제에서 생각해볼 만한 질문을 던져라.
일방적으로 답을 제시하지 말고, 본인의 관점을 짧게 밝힌 뒤 "여러분은 어떻게 생각하시나요?"로 열어라.
읽는 사람이 자기 생각을 댓글로 남기고 싶게 만드는 것이 핵심이다.

== 제약 ==
- URL 포함 총 600~1,000자.
- 의미 단락 사이 빈 줄.
- 마크다운 금지, 이모지 금지, 순수 텍스트만.
- 기술 용어는 영어, 나머지는 한국어.

== 톤 ==
- 호기심을 자극하는 톤. "~일까요?", "~는 정말 그럴까요?" 같은 열린 질문.
- 본인 의견은 단정 짓지 않고 "저는 ~라고 생각하는 편입니다" 수준으로 부드럽게.
- 다른 의견도 존중하는 자세.

== 구조 ==

[질문 도입 — 1-2문장]
코스 주제와 관련된 강렬한 질문이나 의외의 관점으로 시작해라.

(빈 줄)

[맥락 제시 — 3-5문장]
질문의 배경이 되는 맥락을 코스 내용을 바탕으로 짧게 설명해라.

(빈 줄)

[본인 관점 — 2-3문장]
"개인적으로는 ~라고 생각합니다" 수준으로 본인 입장을 밝혀라.

(빈 줄)

[토론 유도 + 링크 — 2-3문장]
"여러분은 어떻게 생각하시나요?" 같은 열린 질문으로 마무리.
마지막에 아래 한 블록만 정확히 1회 넣어라 (중복 금지):
[${data.courseTitle}]
${data.url}

== 절대 금지 ==
- 답을 단정 짓거나 한쪽 입장만 강하게 주장하는 행위
- 코스에 없는 내용으로 질문을 만드는 행위
- 클릭베이트성 과장
- {link}, [링크], (url) 같은 플레이스홀더

== 코스 정보 (질문 추출 대상) ==
코스 제목: ${data.courseTitle}
코스 설명: ${data.courseDescription}
핵심 용어: ${classTerms}
주제 수: ${data.classes.length}개
실제 URL: ${data.url}

LinkedIn 포스트 텍스트만 출력. 따옴표, 설명, 부연 없이.`;

  try {
    const result = await aiModel.generateContent(prompt);
    const text = result.response.text().trim();
    return postProcessLinkedInText(text, data.url);
  } catch (error) {
    console.error("AI Course LinkedIn question summary generation failed:", error);
    return "요약 생성 중에 오류가 발생했습니다.";
  }
}

/** 코스용 LinkedIn 실전 팁형 요약 */
export async function generateCourseLinkedInSummaryTips(data: {
  courseTitle: string;
  courseDescription: string;
  classes: { term: string; definition: string }[];
  url: string;
}): Promise<string> {
  const classTerms = data.classes.map(c => c.term).join(", ");
  const prompt = `아래 코스의 내용을 읽고, 독자가 바로 실무에 적용할 수 있는 실전 팁을 추출해라.
번호를 매긴 짧고 명확한 팁 리스트 형태의 LinkedIn 포스트를 써라.

== 목표 ==
코스에서 다루는 개념들을 실무자가 즉시 행동으로 옮길 수 있는 팁으로 변환해라.
"저장해뒀다가 나중에 다시 보고 싶은 글"이 되는 것이 목표다.

== 제약 ==
- URL 포함 총 800~1,200자.
- 의미 단락 사이 빈 줄.
- 마크다운 금지, 이모지 금지, 순수 텍스트만.
- 기술 용어는 영어, 나머지는 한국어.

== 톤 ==
- 실무자끼리 노하우를 공유하는 톤. 친근하지만 구체적.
- "~해보세요", "~하는 게 좋습니다" 같은 실용적 권유.
- 이론이 아니라 행동 중심.

== 구조 ==

[도입 — 1-2문장]
코스의 주제를 언급하며 "실무에서 바로 쓸 수 있는 팁"을 정리했다고 시작해라.

(빈 줄)

[팁 리스트 — 번호 매긴 5-7개 항목]
각 팁을 "1. ", "2. " 형태로 나열해라.
각 항목은 구체적인 행동 지침이어야 한다. 코스에서 다루는 용어와 개념을 기반으로.

(빈 줄)

[마무리 + 링크 — 2-3문장]
"각 팁의 구체적인 방법과 배경은 아래 가이드에서 자세히 다뤘습니다" 같은 연결.
마지막에 아래 한 블록만 정확히 1회 넣어라 (중복 금지):
[${data.courseTitle}]
${data.url}

== 절대 금지 ==
- 추상적이거나 모호한 팁
- 코스에 없는 내용을 팁으로 만드는 행위
- 각 팁이 3문장 이상 되는 것
- {link}, [링크], (url) 같은 플레이스홀더

== 코스 정보 (팁 추출 대상) ==
코스 제목: ${data.courseTitle}
코스 설명: ${data.courseDescription}
핵심 용어: ${classTerms}
주제 수: ${data.classes.length}개
실제 URL: ${data.url}

LinkedIn 포스트 텍스트만 출력. 따옴표, 설명, 부연 없이.`;

  try {
    const result = await aiModel.generateContent(prompt);
    const text = result.response.text().trim();
    return postProcessLinkedInText(text, data.url);
  } catch (error) {
    console.error("AI Course LinkedIn tips summary generation failed:", error);
    return "요약 생성 중에 오류가 발생했습니다.";
  }
}

// 코스용 LinkedIn 요약 5가지 버전 병렬 생성
export async function generateAllCourseLinkedInSummaries(data: {
  courseTitle: string;
  courseDescription: string;
  classes: { term: string; definition: string }[];
  url: string;
}): Promise<LinkedInSummaryVersions> {
  const [standard, keyword, casual, question, tips] = await Promise.all([
    generateCourseLinkedInSummary(data),
    generateCourseLinkedInSummaryKeyword(data),
    generateCourseLinkedInSummaryCasual(data),
    generateCourseLinkedInSummaryQuestion(data),
    generateCourseLinkedInSummaryTips(data),
  ]);
  return { standard, keyword, casual, question, tips };
}

// ============================================
// 콘텐츠 자동 생성 함수
// ============================================

// 블로그 콘텐츠 생성 결과 타입
export interface GeneratedBlogContent {
  content: string;
  suggestedTitle: string;
}

// FAQ 콘텐츠 생성 결과 타입
export interface GeneratedFaqContent {
  question: string;
  answer: string;
  difficulty: string;
  techStack: string[];
}

// 토픽 제안 타입
export interface TopicSuggestion {
  contentType: "post" | "faq" | "class" | "lifeLog";
  title: string;
  category: string;
  tags: string[];
  rationale: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  seriesFit?: string;
}

// 블로그 콘텐츠 생성 (Posts, Classes, LifeLogs용 장문 콘텐츠)
export async function generateBlogContent(data: {
  topic: string;
  outline?: string;
  keyPoints?: string[];
  category: string;
  contentType: "post" | "class" | "lifeLog";
  styleExamples?: { title: string; contentSnippet: string }[];
}): Promise<GeneratedBlogContent | null> {
  const styleContext = data.styleExamples?.length
    ? `\n\n참고할 기존 글 스타일:\n${data.styleExamples.map((ex, i) => `--- 예시 ${i + 1}: "${ex.title}" ---\n${ex.contentSnippet}`).join("\n\n")}`
    : "";

  const outlineSection = data.outline ? `\n\n아웃라인:\n${data.outline}` : "";
  const keyPointsSection = data.keyPoints?.length
    ? `\n\n핵심 포인트:\n${data.keyPoints.map((p, i) => `${i + 1}. ${p}`).join("\n")}`
    : "";

  const contentTypeGuide: Record<string, string> = {
    post: "블로그 인사이트 글 (서론-본론-결론 구조, H2/H3 헤딩 활용, 실무 경험 기반, 1500-3000단어)",
    class: "용어 사전 글 (용어 정의 → 상세 설명 → 활용 예시 → 관련 개념 순서, 500-1500단어)",
    lifeLog: "라이프로그/일상 글 (경험 기반 서술, 개인적 관점과 평가 포함, 500-2000단어)",
  };

  const prompt = `당신은 전문 블로그 작성자입니다. 다음 주제에 대해 ${contentTypeGuide[data.contentType]} 형식의 고품질 마크다운 콘텐츠를 작성하세요.

주제: ${data.topic}
카테고리: ${data.category}
콘텐츠 유형: ${data.contentType}${outlineSection}${keyPointsSection}${styleContext}

작성 규칙:
1. 마크다운 형식으로 작성 (H2, H3 헤딩, 리스트, 코드블록 활용)
2. 기술 용어는 영어 그대로 사용 (예: API, Machine Learning, ROI)
3. 설명 문장은 한국어로 작성하되, 존댓말(~입니다/~합니다) 어투 유지
4. 실무에서 활용할 수 있는 구체적 사례와 팁 포함
5. 각 섹션은 명확한 헤딩으로 구분
6. 도입부에서 독자의 관심을 끌고, 결론에서 핵심 요약 제공

JSON 형식으로만 응답하세요:
{
  "suggestedTitle": "SEO 최적화된 매력적인 제목 (30-60자)",
  "content": "마크다운 형식의 본문 전체"
}`;

  try {
    const result = await aiModel.generateContent(prompt);
    const response = result.response.text();
    const cleaned = response.replace(/```json\n?|\n?```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    if (!parsed.content || !parsed.suggestedTitle) {
      throw new Error("필수 필드 누락");
    }

    return {
      content: parsed.content,
      suggestedTitle: parsed.suggestedTitle,
    };
  } catch (error) {
    console.error("AI blog content generation failed:", error);
    return null;
  }
}

// FAQ 콘텐츠 생성 (질문+답변 구조)
export async function generateFaqContent(data: {
  topic: string;
  category: string;
  difficulty?: string;
  styleExamples?: { question: string; answerSnippet: string }[];
}): Promise<GeneratedFaqContent | null> {
  const styleContext = data.styleExamples?.length
    ? `\n\n참고할 기존 FAQ 스타일:\n${data.styleExamples.map((ex, i) => `--- 예시 ${i + 1} ---\nQ: ${ex.question}\nA: ${ex.answerSnippet}`).join("\n\n")}`
    : "";

  const prompt = `당신은 테크/마케팅 분야 전문가입니다. 다음 주제에 대한 FAQ 콘텐츠를 작성하세요.

주제: ${data.topic}
카테고리: ${data.category}
난이도: ${data.difficulty || "자동 판별"}${styleContext}

작성 규칙:
1. 질문은 실무자가 실제로 궁금해할 법한 형태로 작성
2. 답변은 대화체 스타일 — 마크다운 헤딩(##, ###) 사용 금지
3. 답변 길이: 150-300단어 (메신저 중간 길이 응답)
4. 문단 구분은 빈 줄로만, **볼드**는 핵심 용어에만 최소 사용
5. 첫 문장에서 질문에 직접 답변
6. 기술 용어는 영어 그대로 사용
7. 존댓말(~입니다/~합니다) 어투
8. 실무 적용 가능한 구체적 예시 포함
9. 난이도 기준: BEGINNER(입문), INTERMEDIATE(실무), ADVANCED(심화)

JSON 형식으로만 응답하세요:
{
  "question": "실무자 관점의 명확한 질문",
  "answer": "마크다운 형식의 상세 답변",
  "difficulty": "BEGINNER | INTERMEDIATE | ADVANCED",
  "techStack": ["관련기술1", "관련기술2"]
}`;

  try {
    const result = await aiModel.generateContent(prompt);
    const response = result.response.text();
    const cleaned = response.replace(/```json\n?|\n?```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    if (!parsed.question || !parsed.answer) {
      throw new Error("필수 필드 누락");
    }

    return {
      question: parsed.question,
      answer: parsed.answer,
      difficulty: parsed.difficulty || "INTERMEDIATE",
      techStack: Array.isArray(parsed.techStack) ? parsed.techStack : [],
    };
  } catch (error) {
    console.error("AI FAQ content generation failed:", error);
    return null;
  }
}

// 콘텐츠 갭 분석 및 토픽 제안
export async function analyzeContentGaps(data: {
  existingPosts: { title: string; category: string; tags: string[] }[];
  existingFaqs: { question: string; category: string; tags: string[] }[];
  existingClasses: { term: string; category: string; courseTitle?: string }[];
  existingCourses: { title: string; classCount: number }[];
  allTags: { name: string; count: number }[];
  seriesInfo: { title: string; postCount: number; isComplete: boolean }[];
}): Promise<{ suggestions: TopicSuggestion[] } | null> {
  const prompt = `당신은 테크 블로그 전략 컨설턴트입니다. 다음 블로그 콘텐츠 현황을 분석하고 새로운 토픽을 제안하세요.

## 현재 콘텐츠 현황

### Posts (인사이트 글) - ${data.existingPosts.length}건
카테고리별:
${["MARKETING", "AI_TECH", "DATA"].map((cat) => `- ${cat}: ${data.existingPosts.filter((p) => p.category === cat).length}건`).join("\n")}

최근 글 제목:
${data.existingPosts.slice(0, 10).map((p) => `- [${p.category}] ${p.title}`).join("\n")}

### FAQs - ${data.existingFaqs.length}건
${data.existingFaqs.slice(0, 10).map((f) => `- [${f.category}] ${f.question}`).join("\n")}

### Classes (용어사전) - ${data.existingClasses.length}건
${data.existingClasses.slice(0, 10).map((c) => `- [${c.category}] ${c.term}${c.courseTitle ? ` (코스: ${c.courseTitle})` : ""}`).join("\n")}

### Courses - ${data.existingCourses.length}건
${data.existingCourses.map((c) => `- ${c.title} (${c.classCount}개 클래스)`).join("\n")}

### 태그 분석
사용 빈도 낮은 태그 (확장 기회): ${data.allTags.filter((t) => t.count <= 2).map((t) => t.name).slice(0, 15).join(", ")}
인기 태그: ${data.allTags.filter((t) => t.count >= 3).map((t) => `${t.name}(${t.count})`).slice(0, 10).join(", ")}

### 시리즈 현황
${data.seriesInfo.map((s) => `- ${s.title}: ${s.postCount}편 ${s.isComplete ? "(완결)" : "(진행중)"}`).join("\n")}

## 분석 요청
1. 카테고리 불균형 분석
2. 콘텐츠 갭 (다뤄지지 않은 중요 주제) 식별
3. 기존 Post에서 파생 가능한 FAQ 주제
4. 코스에 추가할 Class 주제
5. 미완성 시리즈의 다음 편 주제

우선순위 기준:
- HIGH: 카테고리 불균형 해소, 핵심 키워드 커버리지
- MEDIUM: 기존 콘텐츠 보강, 시리즈 연속성
- LOW: 니치 주제, 실험적 콘텐츠

JSON 형식으로만 응답하세요:
{
  "suggestions": [
    {
      "contentType": "post | faq | class | lifeLog",
      "title": "제안 제목",
      "category": "MARKETING | AI_TECH | DATA",
      "tags": ["태그1", "태그2"],
      "rationale": "제안 근거 (1-2문장)",
      "priority": "HIGH | MEDIUM | LOW",
      "seriesFit": "시리즈명 (해당 시 선택)"
    }
  ]
}

5-10개의 제안을 우선순위 순으로 제공하세요.`;

  try {
    const result = await aiModel.generateContent(prompt);
    const response = result.response.text();
    const cleaned = response.replace(/```json\n?|\n?```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    if (!Array.isArray(parsed.suggestions)) {
      throw new Error("suggestions 배열 누락");
    }

    return {
      suggestions: parsed.suggestions.map((s: TopicSuggestion) => ({
        contentType: s.contentType,
        title: s.title,
        category: s.category,
        tags: Array.isArray(s.tags) ? s.tags : [],
        rationale: s.rationale,
        priority: s.priority || "MEDIUM",
        seriesFit: s.seriesFit,
      })),
    };
  } catch (error) {
    console.error("AI content gap analysis failed:", error);
    return null;
  }
}

// AI 기반 코스(Course) 기반 링크드인 업로드용 요약 생성
export async function generateCourseLinkedInSummary(data: {
  courseTitle: string;
  courseDescription: string;
  classes: { term: string; definition: string }[];
  url: string;
}): Promise<string> {
  const classTerms = data.classes.map(c => c.term).join(", ");
  const prompt = `아래 코스의 핵심 내용을 바탕으로 LinkedIn 포스트를 써라.
코스의 용어와 설명을 읽고, 핵심 메시지를 동료에게 말로 전하듯 풀어써라.
읽는 사람이 "이 가이드가 어떤 내용인지" 감을 잡을 수 있어야 한다.

== 목표 ==
코스의 핵심 메시지를 동료에게 말로 전하듯 풀어써라.
포스트를 읽으면 이 가이드가 어떤 개념들을 다루는지 맥락이 잡혀야 한다.
공감 위에서 "이걸 더 자세히 정리한 가이드가 있다"고 자연스럽게 연결해라.

== 제약 ==
- URL 포함 총 800~1,200자.
- 의미 단락 사이 빈 줄.
- 긴 문장은 의미 단위에서 자연스럽게 줄바꿈해라. 1문장=1줄을 강제하지 마라.
- 마크다운 금지, 이모지 금지, 순수 텍스트만.
- 기술 용어는 영어, 나머지는 한국어.

== 톤 ==
- 같은 일을 하는 동료와 점심 먹으며 나누는 대화.
- 상대를 가르치거나 지적하지 마라. "같이 겪은 사람"으로서 말해라.
- "~하는 순간이 있죠", "돌이켜보니 그랬더라고요" 같은 부드러운 회고.
- 경고/훈계조 금지. 발견과 공유의 톤을 써라.

== 구조 ==

[도입 — 1-2문장]
코스가 다루는 핵심 주제와 관련해 많은 사람이 한번쯤 느꼈을 순간을 부드럽게 꺼내라.
도입만 읽어도 "이 가이드가 어떤 이야기인지" 짐작되어야 한다.

(빈 줄)

[이야기 전개 — 평문 5-8문장]
코스의 핵심 흐름을 따라가되, 자기 경험처럼 자연스럽게 풀어써라.
코스에서 다루는 주요 개념이나 용어를 대화체로 녹여라.
독자가 코스의 맥락을 자연스럽게 파악하면서 고개를 끄덕이게 써라.

(빈 줄)

[인사이트 — 개조식 3-5항목]
코스에서 실제로 다루는 핵심 포인트를 "- " 접두어로 나열.
코스 내용을 기반으로 하되, 대화체로 재구성해라.

(빈 줄)

[마무리 — 평문 2-3문장]
이야기를 부드럽게 정리하며 가이드로 연결.
"이 내용을 좀 더 구체적으로 정리해봤습니다" 같은 겸손한 공유.
마지막에 아래 한 블록만 정확히 1회 넣어라 (중복 금지):
[${data.courseTitle}]
${data.url}

== 절대 금지 ==
- 코스와 동떨어진 일반론이나 추상적 이야기로 채우는 행위
- 상대를 낮추거나 지적하는 표현
- 경고/훈계조 ("~하면 안 됩니다", "~는 위험합니다")
- {link}, [링크], (url) 같은 플레이스홀더

== 코스 정보 (핵심 내용 파악 후 대화체로 재구성) ==
코스 제목: ${data.courseTitle}
코스 설명: ${data.courseDescription}
핵심 용어: ${classTerms}
주제 수: ${data.classes.length}개
실제 URL: ${data.url}

LinkedIn 포스트 텍스트만 출력. 따옴표, 설명, 부연 없이.`;

  try {
    const result = await aiModel.generateContent(prompt);
    const text = result.response.text().trim();
    return postProcessLinkedInText(text, data.url);
  } catch (error) {
    console.error("AI Course LinkedIn summary generation failed:", error);
    return "요약 생성 중에 오류가 발생했습니다.";
  }
}
