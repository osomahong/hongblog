import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);
export const aiModel = genAI.getGenerativeModel({
  model: process.env.AI_MODEL_NAME || "gemini-1.5-flash",
});

export async function generateTagsFromContent(content: string): Promise<string[]> {
  const prompt = `Analyze the following tech blog content and extract 3 key SEO tags.
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
  "tags": ["태그1", "태그2", "태그3"] (3-5개, SEO 키워드)
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
  const prompt = `You are creating a LinkedIn post where the author is sharing their own blog article with their professional network. Write from the first-person perspective, focusing on the personal context and motivation behind writing the article, without introducing yourself by name or title.

CRITICAL: Vary your structural approach for each post to avoid formulaic patterns. Choose ONE of the following narrative structures that best fits the content:

STRUCTURE OPTIONS (select the most natural fit):
- Problem-Journey: Start with a specific problem you faced → How you approached it → What you discovered
- Insight-First: Lead with a surprising finding or realization → What led you there → Implications
- Question-Driven: Open with a question you were wrestling with → Your exploration process → Answers you found
- Contrast: Compare before/after, expectation vs reality, or common approach vs what you learned
- Anecdote-Led: Begin with a concrete moment or scenario from your work → Lessons extracted → Broader applications
- Curiosity-Hook: Start with something that puzzled or intrigued you → Investigation → Insights

REQUIREMENTS:

1. FORMAT: Adapt structure based on chosen narrative approach—not every post needs identical bullet point patterns. Vary between:
   - Bullet points for multi-faceted insights
   - Short paragraphs for narrative flow
   - Mixed format when it serves the content
   - Different levels of detail based on content complexity

2. OPENING - PERSONAL CONTEXT: 
   - Match your opening style to the chosen narrative structure
   - Share genuine, specific experiences (e.g., "데이터 분석 업무를 진행하면서 겪었던 데이터 유실 문제...")
   - Vary your entry point: sometimes dive straight into the problem, other times build context first
   - Make each opening feel fresh and organic to the specific content

3. CONTENT APPROACH:
   - Write in first-person throughout
   - Deeply personalize with concrete experiences
   - Vary content density: some posts can be concise, others more exploratory
   - Adjust tone slightly based on content—technical topics can be more analytical, process topics more reflective
   - Don't force every post into the same number of points or sections
   - Let the content's natural structure guide the format

4. VALUE COMMUNICATION:
   - Integrate value naturally within your narrative rather than always stating it explicitly
   - Sometimes show value through your story, other times state it directly
   - Vary between tactical ("이렇게 해결했습니다") and strategic ("이런 관점으로 접근했습니다") framing

5. TONE: Conversational yet professional—but allow natural variation:
   - Some posts can be more enthusiastic when the discovery was exciting
   - Others more measured when discussing systematic approaches
   - Match emotional tone to content authenticity

6. LANGUAGE REQUIREMENTS:
   - Use English for technical terms, industry jargon, and specialized terminology
   - Write all other content in Korean
   - Ensure natural flow between English terms and Korean text

7. CLOSING: Vary your closing approach while maintaining service-orientation:
   - Sometimes: Direct helpful wish (e.g., "...분들께 도움이 되시길 바랍니다")
   - Sometimes: Invitation for perspective sharing (e.g., "비슷한 고민을 하시는 분들의 경험도 궁금합니다")
   - Sometimes: Simple context (e.g., "관련 내용을 정리해봤습니다")
   - Always include the article link naturally after the closing

8. TEXT FORMAT - CRITICAL: Output as PLAIN TEXT ONLY with NO formatting syntax whatsoever:
   - NO asterisks, NO markdown (absolutely no **, __, ##, ###, -, *, or any other symbols for formatting)
   - Use only: simple line breaks, plain dashes for bullet points when needed (using regular dash -), and plain text
   - Do NOT use phrases like "문제 정의:" in bold or any header-style formatting
   - Write everything as plain, unformatted text that can be directly copied into LinkedIn

9. ANTI-TEMPLATE RULES:
   - Never use the same opening phrase structure twice in a row
   - Avoid predictable patterns like always having 3 bullet points or always opening with "이번 글에서는..."
   - Let content dictate length—some posts can be brief, others substantive
   - Don't force symmetry or polish that makes the post feel manufactured

SOURCE MATERIAL:
Title: ${data.title}
Content (first 2000 characters): ${data.content.substring(0, 2000)}
Article URL: ${data.url}

OUTPUT FORMAT:
Provide only the final LinkedIn post text—no quotation marks, no explanations, no meta-commentary, no formatting symbols. The output must be pure plain text, immediately copy-paste ready for LinkedIn publishing. Make it feel human-written and naturally variable, not template-generated.`;
  try {
    const result = await aiModel.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error("AI LinkedIn summary generation failed:", error);
    return "요약 생성 중에 오류가 발생했습니다.";
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

  const prompt = `You are creating a LinkedIn post where the author is sharing their own structured "Course" or "Knowledge Guide" with their professional network. This course consists of multiple interconnected concepts (classes). Write from the first-person perspective, focusing on the motivation for organizing this specific curriculum.

CRITICAL: Vary your structural approach for each post to avoid formulaic patterns. Choose ONE of the following narrative structures that best fits the content:

STRUCTURE OPTIONS (select the most natural fit):
- Curriculum-Design: Why I chose to organize these specific topics in this order → The logic of the learning path
- Skill-Stack: The collection of skills/concepts needed to master a domain → How these topics build that foundation
- Knowledge-Map: Navigating a complex field through clear definitions → How this guide serves as a compass
- Educational-Gap: What most resources miss about these topics → How this course addresses those gaps
- Personal-Mastery: How organizing these concepts helped my own understanding → Why I'm sharing it now

REQUIREMENTS:

1. FORMAT: Adapt structure based on chosen narrative approach. Use:
   - Bullet points to highlight key chapters or concepts covered
   - Short paragraphs for narrative flow between topics
   - Clear distinction between the overall course theme and the specific topics included

2. OPENING - PERSONAL CONTEXT: 
   - Share why you decided to create this guide (e.g., "마케팅 데이터를 다루다 보면 용어 정의부터 헷갈리는 경우가 많습니다...")
   - Vary your entry point: sometimes start with the frustration of disorganized information, other times with the beauty of a structured system

3. CONTENT APPROACH:
   - Write in first-person throughout
   - Mention the overall title of the course and summarize the breadth of topics included
   - Briefly touch upon 2-3 key concepts from the provided classes to show depth
   - Make the post feel like an invitation to a learning journey

4. VALUE COMMUNICATION:
   - Show how this structured knowledge saves time or improves efficiency
   - Position the course as a foundational resource for professionals in the field

5. TONE: Professional, authoritative, yet encouraging and accessible.

6. LANGUAGE REQUIREMENTS:
   - Use English for technical terms, industrial jargon, and specialized terminology
   - Write all other content in Korean

7. CLOSING: Invite engagement or provide the starting point:
   - "이 커리큘럼이 도움이 되기를 바랍니다"
   - "어떤 주제가 가장 흥미로우신가요?"
   - Include the course link naturally after the closing

8. TEXT FORMAT - CRITICAL: Output as PLAIN TEXT ONLY with NO formatting syntax (no **, no markdown).
   - Use only simple line breaks and regular dashes for bullet points.

9. ANTI-TEMPLATE RULES:
   - Avoid "이번 코스에서는..." as a standard opening.
   - Don't simply list all classes; pick the most representative ones for the narrative.

SOURCE MATERIAL:
Course Title: ${data.courseTitle}
Course Description: ${data.courseDescription}
Included Topics (Classes):
${classesContext}
Course URL: ${data.url}

OUTPUT FORMAT:
Provide only the final LinkedIn post text—no meta-commentary. Pure plain text, copy-paste ready.`;

  try {
    const result = await aiModel.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error("AI Course LinkedIn summary generation failed:", error);
    return "요약 생성 중에 오류가 발생했습니다.";
  }
}
