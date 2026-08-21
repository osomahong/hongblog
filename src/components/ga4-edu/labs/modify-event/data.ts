/**
 * 교육용 가상 계정 "준준상점"의 이벤트 목록.
 *
 * 이 편의 상황은 이렇다. 앱 팀과 웹 팀이 같은 구매 행동에 다른 이름을 붙여 보내고 있어서
 * purchase와 purchase_complete가 목록에 따로 잡혀 있다. 표준 이름은 purchase 쪽이라,
 * 이벤트 수정으로 purchase_complete를 purchase로 바꿔 한 줄로 모은다.
 *
 * 수정을 저장하면 앞으로 들어오는 것만 바뀐다. 이미 쌓인 purchase_complete는 그대로 남으므로
 * 목록에서 줄이 바로 사라지지는 않고 수집만 멈춘다.
 */

import type { AdminEventRow } from "../../app/Ga4EventsAdmin";

export const ACCOUNT_NAME = "준준상점";
export const PROPERTY_NAME = "준준상점 - GA4";
export const SEARCH_HINT = '"이벤트"을(를) 검색해 보세요';

/** 수정 규칙 이름. GA4는 규칙마다 이름을 붙이게 한다 */
export const RULE_NAME = "purchase_complete 이름 통일";

/** 고쳐야 할 이름 */
export const WRONG_EVENT = "purchase_complete";

/** 표준 이름 */
export const TARGET_EVENT = "purchase";

/** 조건 목록. 목록에 있는 이벤트 이름 가운데 고른다 */
export const MATCH_OPTIONS = [
  "purchase_complete",
  "add_to_cart",
  "begin_checkout",
  "view_item",
];

/** 바꿀 이름 목록 */
export const VALUE_OPTIONS = ["purchase", "checkout", "order_done"];

/** 오답 후보. 이미 표준 이름을 쓰고 있어 고칠 필요가 없다 */
export const DECOY_EVENT = "add_to_cart";

export const EVENT_ROWS: AdminEventRow[] = [
  { name: "page_view", count: 128640, countDelta: "+6.2%", users: 8640, usersDelta: "+4.8%" },
  { name: "session_start", count: 42180, countDelta: "+5.1%", users: 8640, usersDelta: "+4.8%" },
  { name: "view_item", count: 18420, countDelta: "+8.4%", users: 5240, usersDelta: "+7.2%" },
  { name: "add_to_cart", count: 6240, countDelta: "+3.6%", users: 2860, usersDelta: "+2.9%" },
  { name: "begin_checkout", count: 2480, countDelta: "+1.8%", users: 1190, usersDelta: "+1.2%" },
  { name: TARGET_EVENT, count: 1640, countDelta: "+2.4%", users: 780, usersDelta: "+2.1%" },
  { name: WRONG_EVENT, count: 620, countDelta: "+1.1%", users: 296, usersDelta: "+0.9%" },
];
