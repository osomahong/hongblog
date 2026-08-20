/**
 * 교육용 가상 계정 "준준상점"의 세그먼트 중복 데이터.
 *
 * 세 세그먼트는 모바일 사용자, 구매자, 신규 사용자다.
 * 이 편에서 드러나는 것은 신규이면서 구매한 사람이 560명뿐이라는 사실이다.
 * 구매자 1,240명 가운데 680명은 재방문자라, 신규 유입을 늘리는 것보다
 * 이미 온 사람을 다시 데려오는 쪽이 구매로 이어지고 있다는 신호가 된다.
 */

import type { OverlapArea } from "../../app/Ga4Overlap";

export const ACCOUNT_NAME = "준준상점";
export const PROPERTY_NAME = "준준상점 - GA4";
export const SEARCH_HINT = '"세그먼트 중복분석"을(를) 검색해 보세요';
export const EXPLORATION_NAME = "세그먼트 겹침 확인";
export const DATE_LABEL = "7월 17일~2026년 8월 13일";

export const MOBILE = "모바일 사용자";
export const BUYER = "구매자";
export const NEW_USER = "신규 사용자";

export const SEGMENTS: [string, string, string] = [MOBILE, BUYER, NEW_USER];
export const TOTALS: [number, number, number] = [5920, 1240, 4960];

/** 조합별 사용자 수. 각 세그먼트의 합이 위 TOTALS와 맞아야 한다 */
export const AREAS: OverlapArea[] = [
  { label: `${MOBILE}만`, users: 3200 },
  { label: `${NEW_USER}만`, users: 2600 },
  { label: `${MOBILE} + ${NEW_USER}`, users: 1800 },
  { label: `${MOBILE} + ${BUYER}`, users: 480 },
  { label: `${MOBILE} + ${BUYER} + ${NEW_USER}`, users: 440 },
  { label: `${BUYER}만`, users: 200 },
  { label: `${BUYER} + ${NEW_USER}`, users: 120 },
];

/** 신규이면서 구매한 사람. 겹침이 가장 얇은 자리다 */
export const NEW_BUYER_LABEL = `${BUYER} + ${NEW_USER}`;

/** 오답 자리. 겹침이 가장 두꺼워 눈에 먼저 들어온다 */
export const DECOY_LABEL = `${MOBILE} + ${NEW_USER}`;

/** 신규이면서 구매한 사람 수. 두 조합을 더한 값이다 */
export const NEW_BUYERS = 120 + 440;

/** 구매자 가운데 신규가 아닌 사람 */
export const RETURNING_BUYERS = 1240 - NEW_BUYERS;
