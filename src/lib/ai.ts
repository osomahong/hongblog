import { GoogleGenerativeAI } from "@google/generative-ai";
import { CANONICAL_TAGS_FLAT } from "./constants";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);
export const aiModel = genAI.getGenerativeModel({
  model: process.env.AI_MODEL_NAME || "gemini-1.5-flash",
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
  highlights: string[];
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
  "highlights": ["핵심포인트1", "핵심포인트2"] (2-3개, 짧은 키워드),
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
      highlights: Array.isArray(parsed.highlights) ? parsed.highlights.slice(0, 3) : [],
      tags: Array.isArray(parsed.tags) ? parsed.tags.slice(0, 5) : [],
    };
  } catch (error) {
    console.error("AI content metadata generation failed:", error);
    return null;
  }
}

// AI 기반 링크드인 업로드용 요약 생성
export async function generateLinkedInSummary(data: {
  title: string;
  content: string;
  url: string;
}): Promise<string> {
  const prompt = `블로그 글을 홍보하는 LinkedIn 포스트를 작성해라. 1인칭 시점, 본인이 쓴 글을 공유하는 상황이다.

핵심 원칙:
- 두괄식: 첫 1-2줄에 가장 강한 메시지를 던져라. 스크롤을 멈추게 만들어야 한다.
- 간결: 전체 8-12줄 이내. 군더더기 없이 짧고 날카롭게.
- 궁금증 유발: 글의 핵심 내용을 직접 알려주지 마라. 힌트만 주고, "더 알고 싶으면 읽어봐"라는 느낌을 만들어라.
- 절대 글의 결론이나 해결책을 공개하지 마라.

구조:
1) 훅 (1-2줄): 도발적 질문, 반직관적 사실, 공감가는 문제 상황 중 하나로 시작
2) 떡밥 (2-4줄): 글에서 다루는 주제의 맥락만 살짝 제시. 구체적 답은 숨겨라.
3) CTA (1-2줄): 자연스럽게 링크로 유도. "정리해봤습니다", "공유합니다" 정도로 가볍게.
4) 링크

톤:
- 전문가다운 자신감 + 대화체. 딱딱하지 않게.
- 기술 용어는 영어, 나머지는 한국어.
- 이모지는 사용하지 마라.

금지사항:
- 마크다운 문법 (**, ##, - 등) 일절 사용 금지. 순수 텍스트만.
- "이번 글에서는...", "...에 대해 알아보겠습니다" 같은 진부한 표현 금지.
- 글의 요약, 목차, 핵심 포인트 나열 금지.

원문 정보:
제목: ${data.title}
내용 (앞부분): ${data.content.substring(0, 1500)}
URL: ${data.url}

LinkedIn 포스트 텍스트만 출력해라. 따옴표, 설명, 부연 없이.`;
  try {
    const result = await aiModel.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error("AI LinkedIn summary generation failed:", error);
    return "요약 생성 중에 오류가 발생했습니다.";
  }
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
  const classesContext = data.classes
    .map((c, i) => `${i + 1}. ${c.term}: ${c.definition}`)
    .join("\n");

  const prompt = `본인이 만든 용어/개념 가이드(Course)를 홍보하는 LinkedIn 포스트를 작성해라. 1인칭 시점.

핵심 원칙:
- 두괄식: 첫 1-2줄에 이 가이드가 왜 필요한지 강하게 던져라.
- 간결: 전체 8-12줄 이내.
- 궁금증 유발: 개별 용어의 정의를 나열하지 마라. "이런 것들을 정리했다" 정도의 힌트만 줘라.
- 절대 가이드 내용을 요약하거나 목차를 공개하지 마라.

구조:
1) 훅 (1-2줄): 이 분야에서 흔히 겪는 혼란, 오해, 또는 도발적 질문으로 시작
2) 떡밥 (2-4줄): 가이드의 존재와 맥락만 언급. 구체적 내용은 숨겨라.
3) CTA (1-2줄): 링크로 자연스럽게 유도.
4) 링크

톤:
- 전문가다운 자신감 + 대화체.
- 기술 용어는 영어, 나머지는 한국어.
- 이모지 사용 금지.

금지사항:
- 마크다운 문법 일절 금지. 순수 텍스트만.
- 용어 목록 나열 금지.
- "이번 코스에서는..." 같은 진부한 표현 금지.

원문 정보:
코스 제목: ${data.courseTitle}
코스 설명: ${data.courseDescription}
포함된 주제 (${data.classes.length}개): ${data.classes.slice(0, 5).map(c => c.term).join(", ")}${data.classes.length > 5 ? " 외" : ""}
URL: ${data.url}

LinkedIn 포스트 텍스트만 출력해라. 따옴표, 설명, 부연 없이.`;

  try {
    const result = await aiModel.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error("AI Course LinkedIn summary generation failed:", error);
    return "요약 생성 중에 오류가 발생했습니다.";
  }
}
