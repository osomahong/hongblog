/**
 * 교육용 가상 계정 "준준상점"의 잠재고객 목록.
 *
 * 이 편의 함정은 사용자 수 열이다. 어제 만든 장바구니 이탈 잠재고객이 0명으로 남아 있는데,
 * 조건이 잘못된 것이 아니라 잠재고객이 만든 시점부터 사람을 모으기 때문이다.
 *
 * 만들어 둔 지 오래된 잠재고객은 수천 명이 쌓여 있어서, 같은 화면에서 그 차이가 드러난다.
 */

import type { RuleRow } from "../../app/Ga4RuleAdmin";

export const ACCOUNT_NAME = "준준상점";
export const PROPERTY_NAME = "준준상점 - GA4";
export const SEARCH_HINT = '"잠재고객"을(를) 검색해 보세요';

export const NEW_AUDIENCE = "장바구니 이탈 30일";
export const OLD_AUDIENCE = "구매자 90일";

export const EXPORT_LINKED = "구글 애즈로 내보내는 중";
export const EXPORT_NONE = "내보내지 않음";

export const EXPORT_OPTIONS = [EXPORT_LINKED, EXPORT_NONE];

export const AUDIENCE_COLUMNS = ["조건", "기간", "사용자", "내보내기"];

export function buildRows(exported: boolean): RuleRow[] {
  return [
    {
      name: NEW_AUDIENCE,
      cells: [
        "장바구니 추가 있고 구매 없음",
        "30일",
        "0명",
        exported ? EXPORT_LINKED : EXPORT_NONE,
      ],
      state: exported ? EXPORT_LINKED : EXPORT_NONE,
    },
    {
      name: OLD_AUDIENCE,
      cells: ["구매 1회 이상", "90일", "4,820명", EXPORT_LINKED],
      state: EXPORT_LINKED,
    },
    {
      name: "첫 방문 7일",
      cells: ["첫 세션", "7일", "12,480명", EXPORT_NONE],
      state: EXPORT_NONE,
    },
  ];
}
