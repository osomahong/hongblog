export const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://www.digitalmarketer.co.kr";

export const GTM_ID = "GTM-5H3Z6ZLZ";

// 스티비 뉴스레터 구독 페이지 (무료 플랜: API 미지원이라 외부 페이지로 연결)
export const NEWSLETTER_URL = "https://digitalmarketer.stibee.com/";

export const KAKAO_INQUIRY_URL = "https://open.kakao.com/o/pvUCYfci";

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

/**
 * 태그 페이지를 색인 대상으로 삼는 최소 콘텐츠 수.
 * 항목이 2개 이하인 태그 페이지는 내용이 얇고, 90일 실측에서 노출 344회에 클릭 0회였다.
 * 색인에서 빼되 follow는 유지해 내부 링크 가치는 그대로 흐르게 한다.
 */
export const MIN_TAG_ITEMS_FOR_INDEX = 3;
