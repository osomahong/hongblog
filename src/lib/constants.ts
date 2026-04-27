export const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://www.digitalmarketer.co.kr";

export const GTM_ID = "GTM-5H3Z6ZLZ";

export const POST_CATEGORIES = ["MARKETING", "AI_TECH", "DATA"] as const;
export const CLASS_CATEGORIES = ["MARKETING", "AI_TECH", "CLAUDE_EDUCATION"] as const;

export type PostCategory = (typeof POST_CATEGORIES)[number];
export type ClassCategory = (typeof CLASS_CATEGORIES)[number];

export const CATEGORY_LABELS: Record<string, string> = {
  MARKETING: "마케팅",
  AI_TECH: "AI·테크",
  DATA: "데이터",
  CLAUDE_EDUCATION: "클로드 교육",
};

export const DIFFICULTY_LABELS: Record<string, string> = {
  BEGINNER: "입문",
  INTERMEDIATE: "중급",
  ADVANCED: "고급",
};

// 정규 태그 목록 (카테고리별)
export const CANONICAL_TAGS = {
  metrics: ["CPC", "CPM", "CTR", "CVR", "CPA", "CAC", "LTV", "ROAS", "ROI"],
  strategy: ["퍼널", "어트리뷰션", "전환", "리타게팅", "퍼포먼스마케팅", "SEO"],
  tools: ["GA4", "GTM", "BigQuery"],
  webTech: ["HTML", "CSS", "JavaScript", "React", "DOM", "API"],
  ai: ["AI", "자동화", "노코드", "바이브코딩"],
  adPlatform: ["Meta 광고", "Google 광고"],
  data: ["데이터 분석", "데이터 추적"],
  general: ["마케팅 실무", "광고"],
} as const;

export const CANONICAL_TAGS_FLAT = Object.values(CANONICAL_TAGS).flat() as readonly string[];
export type CanonicalTag = (typeof CANONICAL_TAGS_FLAT)[number];
