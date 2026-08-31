/**
 * 교육용 가상 계정 "준준상점"의 보고서 개요 데이터.
 *
 * 함정을 둘 넣었다.
 * 하나는 기간을 네 배로 늘렸을 때다. 세션수와 조회수와 이벤트 수는 3.58배로 함께 늘지만
 * 사용자는 1.92배만 는다. 중복을 뺀 값이라 기간이 길어져도 그만큼 늘지 않기 때문이다.
 * 다른 하나는 이벤트 표다. 위쪽 세 줄이 모두 GA4가 자동으로 보내는 신호라, 이벤트 수가
 * 많다고 방문자가 그만큼 무엇을 한 것이 아니다.
 *
 * 조회수 29,070과 세션수 25,260은 초급 2번과 3번의 총계와 같은 값으로 맞췄다.
 */

import type { DateRangeKey } from "../../app/types";
import type { SummaryCard, MiniRow } from "../../app/Ga4Overview";

export const ACCOUNT_NAME = "준준상점";
export const PROPERTY_NAME = "준준상점 - GA4";
export const SEARCH_HINT = '"보고서 개요"을(를) 검색해 보세요';

/* ===================== 요약 카드 ===================== */

interface CardFacts {
  key: string;
  label: string;
  /** 기간별 값 */
  values: Record<DateRangeKey, number>;
  delta: string;
}

const CARDS: CardFacts[] = [
  // 중복을 뺀 값이라 기간을 네 배로 늘려도 두 배 남짓만 는다. 이 편의 정답
  { key: "users", label: "사용자", values: { "7d": 5120, "28d": 9840, "90d": 18240 }, delta: "+6.2%" },
  { key: "sessions", label: "세션수", values: { "7d": 7060, "28d": 25260, "90d": 81120 }, delta: "+9.4%" },
  { key: "views", label: "조회수", values: { "7d": 8120, "28d": 29070, "90d": 93500 }, delta: "+11.2%" },
  { key: "events", label: "이벤트 수", values: { "7d": 27280, "28d": 97660, "90d": 313700 }, delta: "+7.4%" },
  { key: "keyEvents", label: "주요 이벤트", values: { "7d": 250, "28d": 894, "90d": 2870 }, delta: "+2.1%" },
];

const comma = (v: number) => v.toLocaleString("ko-KR");

export function buildCards(range: DateRangeKey): SummaryCard[] {
  return CARDS.map((c) => ({
    key: c.key,
    label: c.label,
    value: comma(c.values[range]),
    delta: c.delta,
  }));
}

/** 7일 대비 몇 배로 늘었는지. 본문에서 쓰는 숫자와 화면 값을 맞추는 데 쓴다 */
export function growthFrom7d(key: string, range: DateRangeKey): number {
  const card = CARDS.find((c) => c.key === key);
  if (!card) return 1;
  return card.values[range] / card.values["7d"];
}

/* ===================== 이벤트 표 ===================== */

interface EventFacts {
  name: string;
  /** 지난 28일 이벤트 수 */
  count: number;
  /** GA4가 자동으로 보내는 신호인지 */
  automatic: boolean;
}

/**
 * 이벤트 수를 모두 더하면 97,660으로 이벤트 수 카드와 맞는다.
 * 위 세 줄이 자동 신호라, 사람이 한 행동은 아래쪽에 있다.
 */
const EVENTS: EventFacts[] = [
  { name: "user_engagement", count: 31048, automatic: true },
  { name: "page_view", count: 29070, automatic: true },
  { name: "session_start", count: 25260, automatic: true },
  { name: "scroll", count: 6180, automatic: true },
  { name: "first_visit", count: 3510, automatic: true },
  { name: "add_to_cart", count: 1486, automatic: false },
  { name: "view_item", count: 892, automatic: false },
  { name: "purchase", count: 214, automatic: false },
];

/** 기간이 짧아지면 이벤트도 그만큼 줄어든 것처럼 보이게 하는 배율 */
const EVENT_SCALE: Record<DateRangeKey, number> = {
  "7d": 27280 / 97660,
  "28d": 1,
  "90d": 313700 / 97660,
};

export function buildEventRows(range: DateRangeKey): MiniRow[] {
  const scale = EVENT_SCALE[range];
  return EVENTS.map((e) => ({ name: e.name, value: comma(Math.round(e.count * scale)) }));
}

const CHANNELS: { name: string; sessions: Record<DateRangeKey, number> }[] = [
  { name: "Organic Search", sessions: { "7d": 3104, "28d": 11940, "90d": 38200 } },
  { name: "Direct", sessions: { "7d": 1529, "28d": 5880, "90d": 18900 } },
  { name: "Paid Search", sessions: { "7d": 1459, "28d": 5610, "90d": 17960 } },
  { name: "Referral", sessions: { "7d": 531, "28d": 2043, "90d": 6540 } },
  { name: "Organic Social", sessions: { "7d": 437, "28d": 1684, "90d": 5390 } },
];

export function buildChannelRows(range: DateRangeKey): MiniRow[] {
  return CHANNELS.map((c) => ({ name: c.name, value: comma(c.sessions[range]) }));
}

/* ===================== 정답 ===================== */

/** 기간을 늘려도 그만큼 늘지 않는 값 */
export const SLOW_CARD = "users";

/** 세션수와 같은 값이 찍히는 이벤트 */
export const SESSION_EVENT = "session_start";

/** 조회수와 같은 값이 찍히는 이벤트 */
export const VIEW_EVENT = "page_view";

/** 방문자가 직접 한 행동을 나타내는 이벤트 가운데 가장 많은 것 */
export const REAL_ACTION_EVENT = "add_to_cart";
