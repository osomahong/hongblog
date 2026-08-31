/**
 * 교육용 가상 계정 "준준상점"의 경로 탐색 데이터.
 *
 * 이 편의 핵심은 경로 탐색이 다음 화면만 보여 주고 나간 사람은 그리지 않는다는 것이다.
 * 시작점 12,480명 가운데 다음 열의 합은 9,540명이라, 나머지 2,940명은 첫 화면에서 나갔다.
 * 그 수는 노드로 그려지지 않으므로 열의 합을 직접 빼서 확인해야 한다.
 *
 * 상품 목록에서 상품 상세로 넘어가는 비율이 낮은 것이 이 화면에서 드러나는 문제다.
 */

import type { PathColumn } from "../../app/Ga4Path";

export const ACCOUNT_NAME = "준준상점";
export const PROPERTY_NAME = "준준상점 - GA4";
export const SEARCH_HINT = '"경로 탐색"을(를) 검색해 보세요';
export const EXPLORATION_NAME = "첫 화면 이후 경로";
export const DATE_LABEL = "7월 17일~2026년 8월 13일";
export const NODE_LABEL = "페이지 경로 및 화면 클래스";

/** 시작점. 세션이 시작된 직후의 첫 화면이다 */
export const START_COLUMN: PathColumn = {
  label: "시작점",
  nodes: [
    { name: "/", users: 4820, expandable: true },
    { name: "/product/list", users: 3260, expandable: true },
    { name: "/event/summer", users: 2540, expandable: true },
    { name: "/guide/size", users: 1860, expandable: true },
  ],
};

/** 첫 화면별로 그다음에 간 화면 */
const NEXT: Record<string, PathColumn> = {
  "/": {
    label: "+1단계",
    parent: "/",
    nodes: [
      { name: "/product/list", users: 2180 },
      { name: "/event/summer", users: 940 },
      { name: "/product/detail", users: 620 },
      { name: "/cart", users: 180 },
    ],
  },
  "/product/list": {
    label: "+1단계",
    parent: "/product/list",
    nodes: [
      { name: "/product/detail", users: 1120 },
      { name: "/product/list", users: 860 },
      { name: "/", users: 420 },
      { name: "/cart", users: 140 },
    ],
  },
  "/event/summer": {
    label: "+1단계",
    parent: "/event/summer",
    nodes: [
      { name: "/product/detail", users: 1180 },
      { name: "/product/list", users: 640 },
      { name: "/cart", users: 260 },
    ],
  },
  "/guide/size": {
    label: "+1단계",
    parent: "/guide/size",
    nodes: [
      { name: "/product/list", users: 720 },
      { name: "/", users: 380 },
      { name: "/product/detail", users: 240 },
    ],
  },
};

export function nextColumnFor(node: string): PathColumn | null {
  return NEXT[node] ?? null;
}

/** 시작점에서 사람이 가장 많은 첫 화면 */
export const TOP_START = "/";

/** 첫 화면에서 다음으로 가장 많이 간 화면 */
export const TOP_NEXT = "/product/list";

/**
 * 시작점 합계와 다음 열 합계의 차이.
 * 첫 화면에서 아무 데도 가지 않고 나간 사람 수다.
 */
export const START_TOTAL = START_COLUMN.nodes.reduce((sum, n) => sum + n.users, 0);
export const NEXT_TOTAL_FROM_HOME = NEXT["/"].nodes.reduce((sum, n) => sum + n.users, 0);
export const HOME_USERS = START_COLUMN.nodes.find((n) => n.name === TOP_START)?.users ?? 0;
export const HOME_EXIT = HOME_USERS - NEXT_TOTAL_FROM_HOME;
