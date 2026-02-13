export const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://www.digitalmarketer.co.kr";

export const POST_CATEGORIES = ["MARKETING", "AI_TECH", "DATA"] as const;
export const LOG_CATEGORIES = ["맛집", "강의", "문화생활", "여행", "일상"] as const;

// 정규 태그 목록 (카테고리별)
export const CANONICAL_TAGS = {
  // 마케팅 지표
  metrics: ["CPC", "CPM", "CTR", "CVR", "CPA", "CAC", "LTV", "ROAS", "ROI"],
  // 마케팅 전략/개념
  strategy: ["퍼널", "어트리뷰션", "전환", "리타게팅", "퍼포먼스마케팅", "SEO"],
  // 분석/도구
  tools: ["GA4", "GTM", "BigQuery"],
  // 웹 기술
  webTech: ["HTML", "CSS", "JavaScript", "React", "DOM", "API"],
  // AI/자동화
  ai: ["AI", "자동화", "노코드", "바이브코딩"],
  // 광고 플랫폼
  adPlatform: ["Meta 광고", "Google 광고"],
  // 데이터
  data: ["데이터 분석", "데이터 추적"],
  // 일반
  general: ["마케팅 실무", "광고"],
} as const;

// 유효성 검사용 플랫 배열
export const CANONICAL_TAGS_FLAT = Object.values(CANONICAL_TAGS).flat() as readonly string[];

// 타입 추출
export type CanonicalTag = (typeof CANONICAL_TAGS_FLAT)[number];
