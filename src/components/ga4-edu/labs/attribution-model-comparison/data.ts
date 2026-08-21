/**
 * 교육용 가상 계정 "준준상점"의 기여 분석 모델 비교 데이터.
 *
 * 총 전환 1,240건은 어느 모델로 보든 같고 채널 사이에서 몫만 옮겨 다닌다.
 * 마지막 클릭으로 바꾸면 유료 검색이 386건에서 499건으로 오르고,
 * 소셜은 118건에서 62건으로 절반 아래로 떨어진다.
 *
 * 소셜이 마지막에 약한 것은 성과가 없어서가 아니라 여정의 앞쪽에 서 있기 때문이다.
 * 마지막 클릭만 보고 예산을 옮기면 처음 알게 해 준 채널을 지우게 된다.
 */

import type { AttributionRow } from "../../app/Ga4Attribution";

export const ACCOUNT_NAME = "준준상점";
export const PROPERTY_NAME = "준준상점 - GA4";
export const SEARCH_HINT = '"기여 분석"을(를) 검색해 보세요';

export const BASE_MODEL = "데이터 기반";
export const LAST_CLICK = "마지막 클릭";
export const FIRST_CLICK = "첫 번째 클릭";

export const COMPARE_OPTIONS = [LAST_CLICK, FIRST_CLICK];

/** 마지막 클릭으로 비교할 때의 값 */
const BY_LAST_CLICK: AttributionRow[] = [
  { channel: "Organic Search", base: 428, compare: 394 },
  { channel: "Paid Search", base: 386, compare: 499 },
  { channel: "Direct", base: 240, compare: 240 },
  { channel: "Organic Social", base: 118, compare: 62 },
  { channel: "Email", base: 68, compare: 45 },
];

/** 첫 번째 클릭으로 비교할 때의 값. 소셜과 이메일이 반대로 오른다 */
const BY_FIRST_CLICK: AttributionRow[] = [
  { channel: "Organic Search", base: 428, compare: 392 },
  { channel: "Paid Search", base: 386, compare: 318 },
  { channel: "Direct", base: 240, compare: 186 },
  { channel: "Organic Social", base: 118, compare: 232 },
  { channel: "Email", base: 68, compare: 112 },
];

export function rowsFor(model: string): AttributionRow[] {
  return model === FIRST_CLICK ? BY_FIRST_CLICK : BY_LAST_CLICK;
}

/** 마지막 클릭으로 바꿨을 때 평가가 가장 크게 떨어지는 채널 */
export const BIGGEST_DROP = "Organic Social";

/** 오답 후보. 평가가 오히려 오른다 */
export const DECOY_CHANNEL = "Paid Search";

/** 총 전환 수. 모델을 바꿔도 달라지지 않는다 */
export const TOTAL_CONVERSIONS = BY_LAST_CLICK.reduce((sum, r) => sum + r.base, 0);
