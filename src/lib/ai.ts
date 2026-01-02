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
- 클릭을 유도하는 매력적인 문구
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
  category: "MARKETING" | "AI_TECH" | "DATA";
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
  "category": "MARKETING 또는 AI_TECH 또는 DATA 중 하나",
  "highlights": ["핵심포인트1", "핵심포인트2"] (2-3개, 짧은 키워드),
  "tags": ["태그1", "태그2", "태그3"] (3-5개, SEO 키워드)
}

카테고리 선택 기준:
- MARKETING: 마케팅, 광고, 브랜딩, 고객, 캠페인, 전환율 관련
- AI_TECH: AI, 머신러닝, 기술, 개발, 자동화, 챗봇 관련
- DATA: 데이터 분석, 통계, 지표, 대시보드, 인사이트 관련`;

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
    const validCategories = ["MARKETING", "AI_TECH", "DATA"];
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
