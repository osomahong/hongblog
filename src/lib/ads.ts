export const ADSENSE_CLIENT = "ca-pub-7390905088794850";

/**
 * 애드센스 광고 단위 슬롯 ID.
 * 애드센스 대시보드에서 광고 단위 생성 후 발급되는 ID를 채운다.
 * 빈 문자열이면 해당 지면은 렌더링되지 않는다 (레이아웃 영향 없음).
 */
export const AD_SLOTS = {
  /** 퀴즈 결과 하단 디스플레이 광고 */
  quizResult: "",
  /** 본문 중간(두 번째 H2 앞) 인아티클 광고 */
  inArticle: "",
  /** 추천 콘텐츠 카드 영역 인피드 광고 */
  inFeed: "",
} as const;

/** 인피드 광고 단위 생성 시 함께 발급되는 레이아웃 키 */
export const AD_INFEED_LAYOUT_KEY = "";

export function isAdEnabled(slot: string): boolean {
  return slot.length > 0;
}
