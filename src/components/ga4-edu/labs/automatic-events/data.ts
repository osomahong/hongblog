/**
 * 교육용 가상 계정 "준준상점"의 이벤트 보고서 데이터.
 *
 * 이벤트 표를 위에서부터 읽으면 안 된다는 것이 이 편의 목표다. 위쪽 다섯 줄은
 * GA4가 스스로 보내거나 향상된 측정이 자동으로 보내는 이벤트다. 우리가 심어야만
 * 생기는 이벤트는 그 아래에 있다.
 *
 * 이벤트 이름과 이벤트 수는 초급 4번 보고서 개요의 이벤트 표와 같은 값이다.
 * 합계 97,660도 그 편의 이벤트 수 카드와 맞춘다. 여기에 총 사용자 열을 더해,
 * 같은 이벤트라도 몇 사람이 얼마나 되풀이했는지를 나눠 읽게 한다.
 */

import type { DateRangeKey } from "../../app/types";
import type { MetricColumn, TableRow, DimensionOption } from "../../app/Ga4ReportTable";

export const ACCOUNT_NAME = "준준상점";
export const PROPERTY_NAME = "준준상점 - GA4";
export const SEARCH_HINT = '"이벤트"을(를) 검색해 보세요';

export const DIMENSION_OPTIONS: DimensionOption[] = [{ key: "eventName", label: "이벤트 이름" }];

/**
 * 이벤트가 어디에서 오는지.
 * auto      GA4를 붙이기만 하면 들어온다. 끌 수 없다
 * enhanced  데이터 스트림의 향상된 측정이 보낸다. 항목별로 끌 수 있다
 * ours      우리가 코드나 태그로 심어야만 생긴다
 */
export type EventOrigin = "auto" | "enhanced" | "ours";

interface EventFacts {
  name: string;
  origin: EventOrigin;
  events: number;
  users: number;
}

const EVENTS: EventFacts[] = [
  { name: "user_engagement", origin: "auto", events: 31048, users: 8760 },
  { name: "page_view", origin: "enhanced", events: 29070, users: 9840 },
  { name: "session_start", origin: "auto", events: 25260, users: 9700 },
  { name: "scroll", origin: "enhanced", events: 6180, users: 3120 },
  // 이벤트 수와 총 사용자가 같은 유일한 줄. 사람마다 딱 한 번만 일어나기 때문이다
  { name: "first_visit", origin: "auto", events: 3510, users: 3510 },
  // 우리가 심은 이벤트 가운데 이벤트 수가 가장 많다
  { name: "add_to_cart", origin: "ours", events: 1486, users: 700 },
  { name: "view_item", origin: "ours", events: 892, users: 620 },
  // 우리가 심은 이벤트 가운데 사용자당 이벤트 수가 가장 낮다
  { name: "purchase", origin: "ours", events: 214, users: 205 },
];

/** 중복을 뺀 전체 사용자. 이벤트별 총 사용자를 더한 값과 다르다 */
const TOTAL_USERS = 9840;

/** 기간이 짧아지면 값도 그만큼 줄어든 것처럼 보이게 하는 배율 */
const RANGE_SCALE: Record<DateRangeKey, number> = {
  "7d": 27280 / 97660,
  "28d": 1,
  "90d": 313700 / 97660,
};

const dec = (v: number): string => v.toFixed(2);

export const METRIC_COLUMNS: MetricColumn[] = [
  { key: "events", label: "이벤트 수", share: true },
  { key: "users", label: "총 사용자" },
  { key: "eventsPerUser", label: "사용자당 이벤트 수", format: dec, totalNote: "평균과 동일" },
];

export function buildColumns(range: DateRangeKey): MetricColumn[] {
  const scale = RANGE_SCALE[range];
  const events = EVENTS.reduce((s, e) => s + e.events, 0);
  return METRIC_COLUMNS.map((col) => {
    if (col.key === "users") {
      return { ...col, total: Math.round(TOTAL_USERS * scale), totalNote: "중복을 뺀 값" };
    }
    if (col.key === "eventsPerUser") return { ...col, total: events / TOTAL_USERS };
    return col;
  });
}

export function buildRows(range: DateRangeKey, sortKey: string): TableRow[] {
  const scale = RANGE_SCALE[range];
  const rows: TableRow[] = EVENTS.map((e) => ({
    name: e.name,
    values: {
      events: Math.round(e.events * scale),
      users: Math.round(e.users * scale),
      eventsPerUser: e.events / e.users,
    },
  }));
  return [...rows].sort((a, b) => b.values[sortKey] - a.values[sortKey]);
}

/* ===================== 정답 ===================== */

/** 이벤트 수가 가장 많은 이벤트 */
export const TOP_EVENT = "user_engagement";

/** 이벤트 수와 총 사용자가 같은 이벤트 */
export const ONCE_PER_USER_EVENT = "first_visit";

/** 우리가 심어야만 생기는 이벤트 가운데 이벤트 수가 가장 많은 것 */
export const OUR_TOP_EVENT = "add_to_cart";

/** 우리가 심은 이벤트 가운데 사용자당 이벤트 수가 가장 낮은 것 */
export const OUR_ONCE_EVENT = "purchase";

/** 안내문에 쓰는 값. 화면에 찍히는 값과 같은 자리에서 만든다 */
const find = (name: string): EventFacts => EVENTS.find((e) => e.name === name)!;
const perUser = (name: string): string => {
  const e = find(name);
  return (e.events / e.users).toFixed(2);
};
const users = (name: string): string => find(name).users.toLocaleString("ko-KR");

export const FACTS = {
  autoTopFive: EVENTS.slice(0, 5).filter((e) => e.origin !== "ours").length,
  cartUsers: users("add_to_cart"),
  cartPerUser: perUser("add_to_cart"),
  purchaseUsers: users("purchase"),
  purchasePerUser: perUser("purchase"),
  firstVisitEvents: find("first_visit").events.toLocaleString("ko-KR"),
  totalEvents: EVENTS.reduce((s, e) => s + e.events, 0).toLocaleString("ko-KR"),
};
