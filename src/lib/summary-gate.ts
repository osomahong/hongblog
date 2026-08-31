/**
 * 3줄 요약 열람 권한.
 *
 * 요약은 모든 콘텐츠 페이지의 HTML에 그대로 들어간다. 검색엔진과 답변 엔진은 언제나 읽지만,
 * 화면에서는 세션당 한 편만 열리고 그다음부터는 뉴스레터 구독자에게만 보인다.
 *
 * - 세션스토리지: 이번 방문에서 무료로 연 글의 슬러그 하나
 * - 로컬스토리지: 뉴스레터 구독 완료 표식
 *
 * 시크릿 모드처럼 스토리지를 못 쓰는 환경에서는 모두 조용히 넘어가고 잠금 상태를 유지한다.
 */

/**
 * 요약 블록에 붙이는 클래스. 구조화 데이터의 hasPart에서 이 선택자로 가려진 영역을 알린다.
 * 검색엔진에 요약이 잠긴 구간임을 밝혀 두는 용도이므로 이름을 바꾸면 JSON-LD도 함께 고친다.
 */
export const SUMMARY_GATED_CLASS = "content-summary-gated";

/** 이번 세션에서 무료로 연 글의 슬러그 */
export const SUMMARY_PEEK_KEY = "hongblog-summary-peek";

/** 뉴스레터 구독 완료 표식 */
export const NEWSLETTER_MEMBER_KEY = "hongblog-newsletter-member";

/**
 * open: 잠금 없이 보인다 (구독자이거나 이번 세션에 연 글)
 * peek: 아직 무료 열람을 쓰지 않았다
 * locked: 무료 열람을 이미 썼고 구독 표식이 없다
 */
export type SummaryAccess = "open" | "peek" | "locked";

/** 하이드레이션 전 서버와 클라이언트가 같은 화면을 그리도록 쓰는 기본값 */
export const INITIAL_ACCESS: SummaryAccess = "peek";

export function isSubscribed(): boolean {
  try {
    return window.localStorage.getItem(NEWSLETTER_MEMBER_KEY) === "1";
  } catch {
    return false;
  }
}

/** 구독 완료 직후 호출한다. 이후 모든 글의 요약이 열린다 */
export function markSubscribed(): void {
  try {
    window.localStorage.setItem(NEWSLETTER_MEMBER_KEY, "1");
  } catch {
    // 스토리지를 쓸 수 없는 환경에서는 이번 화면에서만 열린 채로 둔다
  }
}

function readPeekedSlug(): string | null {
  try {
    return window.sessionStorage.getItem(SUMMARY_PEEK_KEY);
  } catch {
    return null;
  }
}

/** 무료 열람을 이 글에 쓴다. 세션당 한 번만 기록되고 덮어쓰지 않는다 */
export function markPeeked(slug: string): void {
  try {
    if (window.sessionStorage.getItem(SUMMARY_PEEK_KEY)) return;
    window.sessionStorage.setItem(SUMMARY_PEEK_KEY, slug);
  } catch {
    // 기록하지 못하면 이번 화면에서만 열린 채로 둔다
  }
}

/** 지금 이 글의 요약을 어떤 상태로 그릴지 정한다 */
export function resolveAccess(slug: string): SummaryAccess {
  if (typeof window === "undefined") return INITIAL_ACCESS;
  if (isSubscribed()) return "open";

  const peeked = readPeekedSlug();
  if (!peeked) return "peek";
  return peeked === slug ? "open" : "locked";
}

/**
 * 요약 구간이 구독자에게만 열린다는 사실을 알리는 schema.org 조각.
 * 본문 자체는 무료이므로 Article의 isAccessibleForFree는 true로 두고 이 부분만 false로 표시한다.
 */
export const SUMMARY_PAYWALL_PART = {
  "@type": "WebPageElement",
  isAccessibleForFree: false,
  cssSelector: `.${SUMMARY_GATED_CLASS}`,
} as const;
