/**
 * 교육용 가상 계정 "준준상점"의 유지 보고서 데이터.
 *
 * 함정은 기간이다. 지난 28일로 보면 재사용자가 주요 이벤트의 대부분을 만들지만,
 * 지난 7일로 좁히면 신규가 앞선다. 재방문은 시간이 지나야 잡히기 때문이다.
 * 같은 사이트인데 기간만 바꿔도 누가 성과를 만드는지가 뒤바뀌는 것을 보게 만든다.
 *
 * 곁들인 함정이 하나 더 있다. 유형이 붙지 않은 (not set) 줄이다.
 * 첫 방문 기록이 남지 않은 세션이 여기로 빠진다.
 *
 * 28일 세션 합계 27,157은 초급 1번, 7번의 값과 같게 맞췄다.
 */

import type { DateRangeKey } from "../../app/types";
import type { MetricColumn, TableRow, DimensionOption } from "../../app/Ga4ReportTable";

export const ACCOUNT_NAME = "준준상점";
export const PROPERTY_NAME = "준준상점 - GA4";
export const SEARCH_HINT = '"유지"을(를) 검색해 보세요';

export const DIMENSION_OPTIONS: DimensionOption[] = [
  { key: "newVsReturning", label: "신규/재사용자" },
];

interface TypeFacts {
  name: string;
  /** 기간별 세션수 */
  sessions: Record<DateRangeKey, number>;
  /** 기간별 주요 이벤트 */
  keyEvents: Record<DateRangeKey, number>;
  engagementRate: Record<DateRangeKey, number>;
}

const TYPES: TypeFacts[] = [
  {
    name: "new",
    sessions: { "7d": 4980, "28d": 15240, "90d": 42600 },
    // 7일로 좁히면 이쪽이 앞선다. 마지막 스텝의 정답
    keyEvents: { "7d": 128, "28d": 218, "90d": 690 },
    engagementRate: { "7d": 0.4180, "28d": 0.4310, "90d": 0.4260 },
  },
  {
    name: "returning",
    // 28일로 보면 세션은 신규의 절반인데 주요 이벤트는 세 배가 넘는다
    sessions: { "7d": 1180, "28d": 8110, "90d": 31480 },
    keyEvents: { "7d": 96, "28d": 640, "90d": 2090 },
    engagementRate: { "7d": 0.7010, "28d": 0.7240, "90d": 0.7380 },
  },
  {
    // 첫 방문 기록이 남지 않아 유형이 붙지 않은 세션
    name: "(not set)",
    sessions: { "7d": 900, "28d": 3807, "90d": 7040 },
    keyEvents: { "7d": 26, "28d": 36, "90d": 90 },
    engagementRate: { "7d": 0.3760, "28d": 0.3890, "90d": 0.3820 },
  },
];

const pct = (v: number): string => `${(v * 100).toFixed(2)}%`;

export const METRIC_COLUMNS: MetricColumn[] = [
  { key: "sessions", label: "세션수", share: true },
  { key: "engagementRate", label: "참여율", format: pct, totalNote: "평균과 동일" },
  { key: "keyEvents", label: "주요 이벤트", share: true },
];

export function buildColumns(range: DateRangeKey): MetricColumn[] {
  const sessions = TYPES.reduce((s, t) => s + t.sessions[range], 0);
  const engaged = TYPES.reduce((s, t) => s + t.sessions[range] * t.engagementRate[range], 0);
  return METRIC_COLUMNS.map((col) =>
    col.key === "engagementRate" ? { ...col, total: engaged / sessions } : col
  );
}

export function buildRows(range: DateRangeKey, sortKey: string): TableRow[] {
  const rows: TableRow[] = TYPES.map((t) => ({
    name: t.name,
    values: {
      sessions: t.sessions[range],
      engagementRate: t.engagementRate[range],
      keyEvents: t.keyEvents[range],
    },
  }));
  return [...rows].sort((a, b) => b.values[sortKey] - a.values[sortKey]);
}

/* ===================== 정답 ===================== */

/** 세션수가 가장 많은 유형 */
export const TOP_SESSION_TYPE = "new";

/** 유형이 붙지 않은 줄 */
export const NOT_SET_TYPE = "(not set)";

/** 지난 28일에서 주요 이벤트가 가장 많은 유형 */
export const TOP_KEY_EVENT_TYPE = "returning";

/** 지난 7일로 좁혔을 때 주요 이벤트가 가장 많은 유형 */
export const SHORT_RANGE_TOP_TYPE = "new";

/** 안내문에 쓰는 값. 화면에 찍히는 값에서 그대로 가져온다 */
const find = (name: string): TypeFacts => TYPES.find((t) => t.name === name)!;
const comma = (v: number): string => v.toLocaleString("ko-KR");
const shareOf = (name: string, range: DateRangeKey): string => {
  const total = TYPES.reduce((s, t) => s + t.keyEvents[range], 0);
  return `${((find(name).keyEvents[range] / total) * 100).toFixed(0)}%`;
};

export const FACTS = {
  returningSessions28: comma(find("returning").sessions["28d"]),
  newSessions28: comma(find("new").sessions["28d"]),
  returningKey28: comma(find("returning").keyEvents["28d"]),
  newKey28: comma(find("new").keyEvents["28d"]),
  returningShare28: shareOf("returning", "28d"),
  newKey7: comma(find("new").keyEvents["7d"]),
  returningKey7: comma(find("returning").keyEvents["7d"]),
  notSetSessions28: comma(find("(not set)").sessions["28d"]),
  notSetShare28: `${((find("(not set)").sessions["28d"] / TYPES.reduce((s, t) => s + t.sessions["28d"], 0)) * 100).toFixed(1)}%`,
};
