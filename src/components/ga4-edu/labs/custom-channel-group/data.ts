/**
 * 교육용 가상 계정 "준준상점"의 맞춤 채널 그룹 규칙.
 *
 * 이 편의 함정은 규칙 순서다. 채널 그룹은 위에서부터 차례로 맞춰 보고 먼저 걸리는 규칙이
 * 이긴다. 지금은 "네이버 전체"가 "네이버 브랜드"보다 위에 있어서, 브랜드 검색으로 들어온
 * 방문까지 전부 네이버 전체로 묶인다.
 *
 * 브랜드 규칙을 한 칸 위로 올리면 조건이 좁은 쪽이 먼저 걸려 둘이 제대로 나뉜다.
 */

import type { RuleRow } from "../../app/Ga4RuleAdmin";

export const ACCOUNT_NAME = "준준상점";
export const PROPERTY_NAME = "준준상점 - GA4";
export const SEARCH_HINT = '"채널 그룹"을(를) 검색해 보세요';

export const BRAND_RULE = "네이버 브랜드";
export const ALL_RULE = "네이버 전체";
export const OTHER_RULE = "제휴 링크";

export const RULE_COLUMNS = ["조건", "지난 28일 세션"];

interface RuleSpec {
  name: string;
  condition: string;
  /** 순서가 제대로일 때의 세션수 */
  correct: number;
  /** 순서가 어긋났을 때의 세션수. 넓은 규칙이 다 가져간다 */
  wrong: number;
}

const SPECS: Record<string, RuleSpec> = {
  [ALL_RULE]: {
    name: ALL_RULE,
    condition: "소스가 naver를 포함",
    correct: 3180,
    wrong: 4820,
  },
  [BRAND_RULE]: {
    name: BRAND_RULE,
    condition: "소스가 naver이고 캠페인이 brand를 포함",
    correct: 1640,
    wrong: 0,
  },
  [OTHER_RULE]: {
    name: OTHER_RULE,
    condition: "매체가 affiliate",
    correct: 860,
    wrong: 860,
  },
};

/** 시작 순서. 넓은 규칙이 위에 있어 브랜드가 가려진다 */
export const INITIAL_ORDER = [ALL_RULE, BRAND_RULE, OTHER_RULE];

/** 브랜드가 위로 올라온 순서인지 */
export function isFixed(order: string[]): boolean {
  return order.indexOf(BRAND_RULE) < order.indexOf(ALL_RULE);
}

export function buildRows(order: string[]): RuleRow[] {
  const fixed = isFixed(order);
  return order.map((name) => {
    const spec = SPECS[name];
    const sessions = fixed ? spec.correct : spec.wrong;
    return {
      name,
      cells: [spec.condition, `${sessions.toLocaleString("ko-KR")}회`],
    };
  });
}

/** 순서를 고쳤을 때 브랜드 규칙이 가져가는 세션수 */
export const BRAND_SESSIONS = SPECS[BRAND_RULE].correct;

/** 순서가 어긋났을 때 넓은 규칙이 안고 있던 세션수 */
export const ALL_SESSIONS_WRONG = SPECS[ALL_RULE].wrong;
