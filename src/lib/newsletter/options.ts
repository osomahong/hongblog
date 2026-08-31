// 뉴스레터 가입 폼의 선택지 정의.
// 폼(클라이언트)과 /api/newsletter/subscribe(서버)가 같은 목록을 참조한다.
// 허용값 계약: docs/newsletter/stibee-field-contract.md

export interface SelectOption {
  value: string;
  label: string;
}

/** "기타"를 고르면 폼이 직접 입력란을 연다. 저장값은 `etc:입력값` 형태다. */
export const ETC_VALUE = "etc";

export const INDUSTRY_OPTIONS: SelectOption[] = [
  { value: "ecommerce", label: "이커머스" },
  { value: "agency", label: "대행사, 컨설팅" },
  { value: "saas-it", label: "IT, SaaS" },
  { value: "contents-media", label: "콘텐츠, 미디어" },
  { value: "education", label: "교육" },
  { value: "finance", label: "금융" },
  { value: "manufacturing", label: "제조, 유통" },
  { value: "public", label: "공공, 비영리" },
  { value: ETC_VALUE, label: "기타 (직접 입력)" },
];

export const JOB_ROLE_OPTIONS: SelectOption[] = [
  { value: "marketing", label: "마케팅" },
  { value: "data", label: "데이터 분석" },
  { value: "planning", label: "기획, PM" },
  { value: "dev", label: "개발" },
  { value: "design", label: "디자인" },
  { value: "sales", label: "영업, CS" },
  { value: "founder", label: "대표, 프리랜서" },
  { value: ETC_VALUE, label: "기타 (직접 입력)" },
];

export const YEARS_OPTIONS: SelectOption[] = [
  { value: "y0-2", label: "2년 이하" },
  { value: "y3-5", label: "3~5년" },
  { value: "y6-9", label: "6~9년" },
  { value: "y10", label: "10년 이상" },
  { value: "none", label: "해당 없음" },
];

/** 가입 폼에 보여주고 Neon에 기록하는 동의 문구의 버전. 문구를 바꾸면 버전을 올린다. */
export const CONSENT_VERSION = "2026-08-17.v1";

export const CONSENT_TEXT =
  "준이아빠블로그 뉴스레터(광고성 정보 포함)를 이메일로 받는 데 동의합니다.";

/** CTA 위치 값. GA4 location, 스티비 signup_source에 같은 체계를 쓴다. */
export const SIGNUP_SOURCES = [
  "nav",
  "nav_mobile",
  "home",
  "post_bottom",
  "footer",
  "ga4_edu",
  "summary_gate",
] as const;

export type SignupSource = (typeof SIGNUP_SOURCES)[number];

/** 기타 직접 입력의 최대 길이. 넘으면 서버가 잘라 저장한다. */
export const ETC_MAX_LENGTH = 40;
