/**
 * 교육용 가상 계정 "준준상점"의 관리 이벤트 화면 데이터.
 *
 * 이벤트 이름과 개수는 초급 8번 이벤트 보고서와 같은 값이다. 같은 계정을 관리 화면에서
 * 다시 보는 셈이라 두 편을 이어 보는 학습자가 같은 표를 알아본다.
 *
 * 함정은 둘이다.
 * 하나는 page_view다. 모든 방문에 붙는 이벤트라 주요 이벤트로 표시하면 전환율이
 * 100퍼센트에 가까워져 숫자가 뜻을 잃는다.
 * 다른 하나는 방금 만든 맞춤 이벤트다. 만든 시점부터 쌓이므로 기존 이벤트 표에
 * 바로 나타나지 않는다.
 */

import type { AdminEventRow, PickOption } from "../../app/Ga4EventsAdmin";

export const ACCOUNT_NAME = "준준상점";
export const PROPERTY_NAME = "준준상점 - GA4";
export const SEARCH_HINT = '"이벤트"을(를) 검색해 보세요';

export const EVENT_ROWS: AdminEventRow[] = [
  { name: "user_engagement", count: 31048, countDelta: "+6.2%", users: 8760, usersDelta: "+5.1%" },
  // 모든 방문에 붙는다. 주요 이벤트로 표시하면 안 되는 이벤트
  { name: "page_view", count: 29070, countDelta: "+11.2%", users: 9840, usersDelta: "+8.6%" },
  { name: "session_start", count: 25260, countDelta: "+9.4%", users: 9700, usersDelta: "+8.4%" },
  { name: "scroll", count: 6180, countDelta: "+4.8%", users: 3120, usersDelta: "+3.9%" },
  { name: "first_visit", count: 3510, countDelta: "+9.8%", users: 3510, usersDelta: "+9.8%" },
  { name: "add_to_cart", count: 1486, countDelta: "+2.4%", users: 700, usersDelta: "+1.8%" },
  { name: "view_item", count: 892, countDelta: "-3.1%", users: 620, usersDelta: "-2.6%" },
  // 사업 성과에 가장 가까운 이벤트. 다섯 번째 스텝의 정답
  { name: "purchase", count: 214, countDelta: "+5.6%", users: 205, usersDelta: "+5.1%" },
  { name: "form_submit", count: 168, countDelta: "+12.4%", users: 161, usersDelta: "+11.7%" },
];

/** 이벤트 만들기에서 고를 수 있는 맞춤 이벤트 이름 */
export const NAME_OPTIONS: PickOption[] = [
  { key: "contact_submit", label: "contact_submit" },
  { key: "newsletter_submit", label: "newsletter_submit" },
  { key: "review_submit", label: "review_submit" },
];

/** 일치 조건의 값. 이미 들어오고 있는 이벤트 가운데 고른다 */
export const VALUE_OPTIONS: PickOption[] = [
  { key: "form_submit", label: "form_submit" },
  { key: "page_view", label: "page_view" },
  { key: "add_to_cart", label: "add_to_cart" },
];

/* ===================== 정답 ===================== */

/** 만들 맞춤 이벤트 이름 */
export const TARGET_NAME = "contact_submit";

/** 일치 조건으로 걸 이벤트 */
export const TARGET_VALUE = "form_submit";

/** 주요 이벤트로 표시할 이벤트 */
export const KEY_EVENT_TARGET = "purchase";

/** 주요 이벤트로 표시하면 안 되는 이벤트 */
export const WRONG_KEY_EVENT = "page_view";

/** 안내문에 쓰는 값. 화면에 찍히는 값에서 그대로 가져온다 */
const find = (name: string): AdminEventRow => EVENT_ROWS.find((r) => r.name === name)!;
const comma = (v: number): string => v.toLocaleString("ko-KR");

export const FACTS = {
  pageViewCount: comma(find("page_view").count),
  pageViewUsers: comma(find("page_view").users),
  purchaseCount: comma(find("purchase").count),
  purchaseUsers: comma(find("purchase").users),
  formSubmitCount: comma(find("form_submit").count),
  sessionCount: comma(find("session_start").count),
  /** 세션 대비 구매 비율. 주요 이벤트를 잘 고르면 나오는 값 */
  purchaseRate: `${((find("purchase").count / find("session_start").count) * 100).toFixed(2)}%`,
  /** page_view를 주요 이벤트로 표시했을 때의 비율 */
  pageViewRate: `${Math.min(100, (find("page_view").count / find("session_start").count) * 100).toFixed(0)}%`,
};
