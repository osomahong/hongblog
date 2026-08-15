/**
 * 교육용 가상 계정 "준준상점"의 방문 페이지 참여 데이터.
 *
 * 함정은 주문 조회다. 이탈률 73.58%로 여섯 줄 가운데 가장 높지만, 배송 상태만 확인하고
 * 나가는 화면이라 이 숫자가 정상이다. 실제로 고쳐야 하는 줄은 이탈률 2위인 여름 기획전이다.
 * 상품을 둘러보라고 만든 화면인데 절반 넘게 첫 화면에서 나가고, 세션도 5,930으로 많다.
 *
 * 이탈률은 참여율에서 그때그때 빼서 만든다. 두 값을 따로 적어 두면 합이 100에서 어긋난다.
 */

import type { DateRangeKey } from "../../app/types";
import type { MetricColumn, TableRow, DimensionOption } from "../../app/Ga4ReportTable";
import type { MetricChoice } from "../../app/Ga4CustomizePanel";

export const ACCOUNT_NAME = "준준상점";
export const PROPERTY_NAME = "준준상점 - GA4";
export const SEARCH_HINT = '"방문 페이지"을(를) 검색해 보세요';

export const DIMENSION_OPTIONS: DimensionOption[] = [
  { key: "landingPage", label: "방문 페이지" },
  { key: "landingPageQuery", label: "방문 페이지 + 쿼리 문자열" },
  { key: "sessionDefaultChannelGroup", label: "세션 기본 채널 그룹" },
];

/* ===================== 데모 데이터 ===================== */

interface PageFacts {
  name: string;
  sessions: number;
  engagedSessions: number;
  /** 세션당 평균 참여 시간 (초) */
  avgEngagementSec: number;
  eventsPerSession: number;
  keyEvents: number;
}

const PAGES: PageFacts[] = [
  { name: "/", sessions: 8420, engagedSessions: 5161, avgEngagementSec: 68, eventsPerSession: 5.2, keyEvents: 42 },
  // 상품을 둘러보라고 만든 화면인데 절반 넘게 첫 화면에서 나간다. 이 편의 정답
  { name: "/event/summer", sessions: 5930, engagedSessions: 2479, avgEngagementSec: 44, eventsPerSession: 4.1, keyEvents: 96 },
  { name: "/product/list", sessions: 4010, engagedSessions: 1789, avgEngagementSec: 51, eventsPerSession: 4.8, keyEvents: 68 },
  // 이탈률이 가장 높지만 배송 상태만 확인하고 나가는 화면이라 정상이다. 함정
  { name: "/order/track", sessions: 3180, engagedSessions: 840, avgEngagementSec: 94, eventsPerSession: 2.6, keyEvents: 8 },
  { name: "/product/detail/1042", sessions: 2180, engagedSessions: 1581, avgEngagementSec: 112, eventsPerSession: 6.4, keyEvents: 154 },
  { name: "/guide/size", sessions: 1540, engagedSessions: 1050, avgEngagementSec: 126, eventsPerSession: 5.9, keyEvents: 37 },
];

/* ===================== 측정항목 ===================== */

/** 기간이 짧아지면 세션도 그만큼 줄어든 것처럼 보이게 하는 배율 */
const RANGE_SCALE: Record<DateRangeKey, number> = {
  "7d": 0.26,
  "28d": 1,
  "90d": 3.15,
};

const duration = (sec: number): string => {
  const m = Math.floor(sec / 60);
  const s = Math.round(sec % 60);
  return `${m}분 ${String(s).padStart(2, "0")}초`;
};

const pct = (v: number): string => `${(v * 100).toFixed(2)}%`;
const dec = (v: number): string => v.toFixed(2);

/** 처음부터 표에 놓여 있는 열 */
const BASE_COLUMNS: MetricColumn[] = [
  { key: "sessions", label: "세션수", share: true },
  { key: "engagedSessions", label: "참여 세션수", share: true },
  { key: "engagementRate", label: "참여율", format: pct, totalNote: "평균과 동일" },
  { key: "avgEngagementSec", label: "세션당 평균 참여 시간", format: duration, totalNote: "평균과 동일" },
  { key: "eventsPerSession", label: "세션당 이벤트 수", format: dec, totalNote: "평균과 동일" },
  { key: "keyEvents", label: "주요 이벤트", share: true },
];

/** 맞춤설정에서 더할 수 있는 열 */
const EXTRA_COLUMNS: Record<string, MetricColumn> = {
  bounceRate: { key: "bounceRate", label: "이탈률", format: pct, totalNote: "평균과 동일" },
  newUsers: { key: "newUsers", label: "신규 사용자", share: true },
  totalUsers: { key: "totalUsers", label: "총 사용자", share: true },
};

export const ADDABLE_METRICS: MetricChoice[] = Object.values(EXTRA_COLUMNS).map((c) => ({
  key: c.key,
  label: c.label,
}));

/** 맞춤설정 패널에 늘어놓을 이름 목록 */
export function metricChoices(added: string[]): MetricChoice[] {
  return [
    ...BASE_COLUMNS.map((c) => ({ key: c.key, label: c.label })),
    ...added.map((k) => ({ key: k, label: EXTRA_COLUMNS[k]?.label ?? k })),
  ];
}

export function availableMetrics(added: string[]): MetricChoice[] {
  return ADDABLE_METRICS.filter((m) => !added.includes(m.key));
}

/** 총계 행에서 단순 합계가 뜻이 없는 열은 가중 평균으로 따로 계산한다 */
function weightedTotals(): Record<string, number> {
  const sessions = PAGES.reduce((s, p) => s + p.sessions, 0);
  const engaged = PAGES.reduce((s, p) => s + p.engagedSessions, 0);
  return {
    engagementRate: engaged / sessions,
    bounceRate: 1 - engaged / sessions,
    avgEngagementSec: PAGES.reduce((s, p) => s + p.avgEngagementSec * p.sessions, 0) / sessions,
    eventsPerSession: PAGES.reduce((s, p) => s + p.eventsPerSession * p.sessions, 0) / sessions,
  };
}

export function buildColumns(added: string[]): MetricColumn[] {
  const totals = weightedTotals();
  const cols = [...BASE_COLUMNS, ...added.map((k) => EXTRA_COLUMNS[k]).filter(Boolean)];
  return cols.map((col) => (totals[col.key] !== undefined ? { ...col, total: totals[col.key] } : col));
}

export function buildRows(range: DateRangeKey, sortKey: string, added: string[]): TableRow[] {
  const scale = RANGE_SCALE[range];
  const rows: TableRow[] = PAGES.map((p) => {
    const rate = p.engagedSessions / p.sessions;
    const values: Record<string, number> = {
      sessions: Math.round(p.sessions * scale),
      engagedSessions: Math.round(p.engagedSessions * scale),
      engagementRate: rate,
      // 이탈률은 참여율을 100에서 뺀 나머지다. 따로 적지 않고 여기서 만든다
      bounceRate: 1 - rate,
      avgEngagementSec: p.avgEngagementSec,
      eventsPerSession: p.eventsPerSession,
      keyEvents: Math.round(p.keyEvents * scale),
      newUsers: Math.round(p.sessions * 0.62 * scale),
      totalUsers: Math.round(p.sessions * 0.78 * scale),
    };
    return { name: p.name, values };
  });
  const key = added.includes(sortKey) || BASE_COLUMNS.some((c) => c.key === sortKey) ? sortKey : "sessions";
  return [...rows].sort((a, b) => b.values[key] - a.values[key]);
}

/* ===================== 정답 ===================== */

/** 참여율이 가장 낮은 줄. 두 번째 스텝의 정답이자 마지막 스텝의 오답 */
export const LOWEST_ENGAGEMENT_PAGE = "/order/track";

/** 이탈률이 높으면서 실제로 고쳐야 하는 줄. 마지막 스텝의 정답 */
export const WORTH_FIXING_PAGE = "/event/summer";
