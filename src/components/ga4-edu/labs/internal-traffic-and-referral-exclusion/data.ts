/**
 * 교육용 가상 계정 "준준상점"의 데이터 필터 목록.
 *
 * 이 편의 함정은 상태 열이다. 내부 트래픽 필터는 만들어 두었지만 테스트로 남아 있어서
 * 실제로는 아무것도 빠지지 않는다. 만든 것으로 끝났다고 생각하기 쉽다.
 *
 * 사용으로 바꾸면 그때부터 해당 트래픽이 아예 들어오지 않는다. 되돌려도 그 기간에
 * 빠진 데이터는 복구되지 않아서, 조건이 맞는지 테스트 상태에서 먼저 확인해야 한다.
 */

import type { RuleRow } from "../../app/Ga4RuleAdmin";

export const ACCOUNT_NAME = "준준상점";
export const PROPERTY_NAME = "준준상점 - GA4";
export const SEARCH_HINT = '"데이터 필터"을(를) 검색해 보세요';

export const STATE_TEST = "테스트";
export const STATE_ACTIVE = "사용";
export const STATE_INACTIVE = "비활성";

export const STATE_OPTIONS = [STATE_TEST, STATE_ACTIVE, STATE_INACTIVE];

/** 이 편에서 상태를 바꿀 필터 */
export const TARGET_FILTER = "사무실 내부 트래픽 제외";

/** 오답 후보. 이미 사용 상태라 건드릴 필요가 없다 */
export const DECOY_FILTER = "개발자 트래픽 제외";

export const FILTER_COLUMNS = ["필터 유형", "필터 작업", "상태"];

export function buildRows(activeName: string | null): RuleRow[] {
  return [
    {
      name: TARGET_FILTER,
      cells: ["내부 트래픽", "제외", activeName === TARGET_FILTER ? STATE_ACTIVE : STATE_TEST],
      state: activeName === TARGET_FILTER ? STATE_ACTIVE : STATE_TEST,
    },
    {
      name: DECOY_FILTER,
      cells: ["개발자 트래픽", "제외", STATE_ACTIVE],
      state: STATE_ACTIVE,
    },
  ];
}
