/**
 * 교육용 가상 계정 "준준상점"의 구매 유입경로 데이터.
 *
 * 이 편의 함정은 열린 유입경로를 켰을 때 답이 바뀌는지 여부다.
 * 닫힌 유입경로에서 가장 많이 빠지는 구간은 상품 조회에서 장바구니 추가로 넘어가는 자리이고,
 * 열린 유입경로로 바꿔도 그 자리는 그대로다. 대신 각 단계의 사람 수가 늘어난다.
 * 앞 단계를 거치지 않고 그 단계부터 시작한 사람까지 세기 때문이다.
 *
 * 상품 조회의 열린 값이 특히 많이 늘어나는 이유는 검색이나 광고로 상품 페이지에 바로
 * 들어온 사람이 그만큼 많다는 뜻이다. 단계 정의를 바꾸지 않아도 이 차이가 드러난다.
 */

import type { FunnelStage } from "../../app/Ga4Funnel";

export const ACCOUNT_NAME = "준준상점";
export const PROPERTY_NAME = "준준상점 - GA4";
export const SEARCH_HINT = '"유입경로"을(를) 검색해 보세요';
export const EXPLORATION_NAME = "구매 유입경로";
export const DATE_LABEL = "7월 17일~2026년 8월 13일";

/** 유입경로에 놓을 수 있는 단계 전부. 배열 순서가 곧 단계 순서다 */
export const ALL_STAGES: FunnelStage[] = [
  { name: "세션 시작", event: "session_start", closed: 12480, open: 12480 },
  { name: "상품 조회", event: "view_item", closed: 7240, open: 9860 },
  { name: "장바구니 추가", event: "add_to_cart", closed: 2860, open: 3420 },
  { name: "결제 시작", event: "begin_checkout", closed: 1190, open: 1340 },
  { name: "구매", event: "purchase", closed: 940, open: 1020 },
];

/** 학습자가 들어왔을 때 이미 놓여 있는 단계. 결제 시작이 빠져 있다 */
export const INITIAL_STAGES = ["세션 시작", "상품 조회", "장바구니 추가", "구매"];

/** 편집 패널에서 추가할 단계 */
export const STAGE_TO_ADD = "결제 시작";

/** 단계를 추가한 뒤의 순서. 배열 순서대로 그린다 */
export const FULL_STAGES = ALL_STAGES.map((s) => s.name);

/** 편집 패널의 후보 목록. 이미 놓인 단계는 빼고 보여 준다 */
export function candidatesFor(placed: string[]): string[] {
  return FULL_STAGES.filter((name) => !placed.includes(name));
}

/**
 * 다음 단계로 넘어가지 않은 비율이 가장 큰 단계.
 * 닫힌 유입경로에서 상품 조회 7,240명 가운데 2,860명만 장바구니로 넘어가 60.5%가 빠진다.
 */
export const BIGGEST_DROP_STAGE = "상품 조회";

/** 오답 자리. 결제 시작은 21.0%만 빠져 실제로는 가장 잘 넘어가는 구간이다 */
export const DECOY_STAGE = "결제 시작";
