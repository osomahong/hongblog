/**
 * 교육용 가상 계정 "준준상점"의 트래픽 획득 데이터.
 *
 * 유료 검색을 세션 3위이면서 참여율은 꼴찌로 두어, 세션만 보고 판단하면 놓치는 채널이
 * 생기게 짰다. 학습자가 표에서 그 어긋남을 스스로 찾아내는 것이 이 튜토리얼의 목표다.
 *
 * 시계열은 서버 렌더와 어긋나지 않도록 난수 없이 결정론적으로 만든다.
 */

import type { DateRangeKey } from "../../app/types";
import type { MetricColumn, TableRow, DimensionOption } from "../../app/Ga4ReportTable";
import type { Series } from "../../app/Ga4Charts";

export const ACCOUNT_NAME = "준준상점";
export const PROPERTY_NAME = "준준상점 - GA4";
export const SEARCH_HINT = '"트래픽 획득"을(를) 검색해 보세요';

/** 채널마다 파랑의 밝기 단계를 준다. GA4는 강조색으로 파랑만 쓴다 */
export const CHANNEL_SHADE: Record<string, number> = {
  "Organic Search": 0,
  Direct: 1,
  "Paid Search": 2,
  Referral: 3,
  "Organic Social": 4,
};

interface ChannelFacts {
  name: string;
  sessions: number;
  engagedSessions: number;
  /** 세션당 평균 참여 시간 (초) */
  avgEngagementSec: number;
  engagedSessionsPerUser: number;
  eventsPerSession: number;
  engagementRate: number;
  events: number;
  keyEvents: number;
}

const CHANNELS: ChannelFacts[] = [
  {
    name: "Organic Search",
    sessions: 11940,
    engagedSessions: 7404,
    avgEngagementSec: 74,
    engagedSessionsPerUser: 0.83,
    eventsPerSession: 6.4,
    engagementRate: 0.6201,
    events: 76416,
    keyEvents: 296,
  },
  {
    name: "Direct",
    sessions: 5880,
    engagedSessions: 3204,
    avgEngagementSec: 61,
    engagedSessionsPerUser: 0.66,
    eventsPerSession: 5.2,
    engagementRate: 0.5449,
    events: 30576,
    keyEvents: 131,
  },
  {
    name: "Paid Search",
    sessions: 5610,
    engagedSessions: 1616,
    avgEngagementSec: 23,
    engagedSessionsPerUser: 0.36,
    eventsPerSession: 3.3,
    engagementRate: 0.2881,
    events: 18513,
    keyEvents: 54,
  },
  {
    name: "Referral",
    sessions: 2043,
    engagedSessions: 1398,
    avgEngagementSec: 88,
    engagedSessionsPerUser: 0.94,
    eventsPerSession: 7.3,
    engagementRate: 0.6843,
    events: 14914,
    keyEvents: 88,
  },
  // 참여율은 다섯 채널 가운데 가장 낮지만 세션이 적어 전체에 미치는 영향은 작다.
  // 참여율만 보고 고르면 이 채널을 짚게 되는 함정이다.
  {
    name: "Organic Social",
    sessions: 1684,
    engagedSessions: 412,
    avgEngagementSec: 27,
    engagedSessionsPerUser: 0.31,
    eventsPerSession: 3.6,
    engagementRate: 0.2447,
    events: 6062,
    keyEvents: 17,
  },
];

/** 기간이 짧아지면 세션도 그만큼 줄어든 것처럼 보이게 하는 배율 */
const RANGE_SCALE: Record<DateRangeKey, number> = {
  "7d": 0.26,
  "28d": 1,
  "90d": 3.15,
};

export const RANGE_DAYS: Record<DateRangeKey, number> = {
  "7d": 7,
  "28d": 28,
  "90d": 90,
};

const duration = (sec: number): string => {
  const m = Math.floor(sec / 60);
  const s = Math.round(sec % 60);
  return `${m}분 ${String(s).padStart(2, "0")}초`;
};

const pct = (v: number): string => `${(v * 100).toFixed(2)}%`;
const dec = (v: number): string => v.toFixed(2);

export const DIMENSION_OPTIONS: DimensionOption[] = [
  { key: "sessionDefaultChannelGroup", label: "세션 기본 채널 그룹" },
  { key: "sessionSource", label: "세션 소스" },
  { key: "sessionMedium", label: "세션 매체" },
  { key: "sessionCampaign", label: "세션 캠페인" },
];

export const METRIC_COLUMNS: MetricColumn[] = [
  { key: "sessions", label: "세션수", share: true },
  { key: "engagedSessions", label: "참여 세션수", share: true },
  { key: "avgEngagementSec", label: "세션당 평균 참여 시간", format: duration, totalNote: "평균과 동일" },
  { key: "engagedSessionsPerUser", label: "사용자당 참여 세션수", format: dec, totalNote: "평균과 동일" },
  { key: "eventsPerSession", label: "세션당 이벤트 수", format: dec, totalNote: "평균과 동일" },
  { key: "engagementRate", label: "참여율", format: pct, totalNote: "평균과 동일" },
  { key: "events", label: "이벤트 수", share: true },
  { key: "keyEvents", label: "주요 이벤트", share: true },
];

/** 총계 행에서 단순 합계가 뜻이 없는 열은 가중 평균으로 따로 계산한다 */
function weightedTotals(scale: number): Partial<Record<string, number>> {
  const sessions = CHANNELS.reduce((s, c) => s + c.sessions, 0) * scale;
  const engaged = CHANNELS.reduce((s, c) => s + c.engagedSessions, 0) * scale;
  const events = CHANNELS.reduce((s, c) => s + c.events, 0) * scale;
  const timeWeighted =
    CHANNELS.reduce((s, c) => s + c.avgEngagementSec * c.sessions, 0) /
    CHANNELS.reduce((s, c) => s + c.sessions, 0);
  return {
    engagementRate: engaged / sessions,
    avgEngagementSec: timeWeighted,
    eventsPerSession: events / sessions,
    engagedSessionsPerUser: 0.71,
  };
}

export function buildColumns(range: DateRangeKey): MetricColumn[] {
  const scale = RANGE_SCALE[range];
  const totals = weightedTotals(scale);
  return METRIC_COLUMNS.map((col) =>
    totals[col.key] !== undefined ? { ...col, total: totals[col.key] } : col
  );
}

export function buildRows(range: DateRangeKey, sortKey: string): TableRow[] {
  const scale = RANGE_SCALE[range];
  const rows: TableRow[] = CHANNELS.map((c) => ({
    name: c.name,
    values: {
      sessions: Math.round(c.sessions * scale),
      engagedSessions: Math.round(c.engagedSessions * scale),
      avgEngagementSec: c.avgEngagementSec,
      engagedSessionsPerUser: c.engagedSessionsPerUser,
      eventsPerSession: c.eventsPerSession,
      engagementRate: c.engagementRate,
      events: Math.round(c.events * scale),
      keyEvents: Math.round(c.keyEvents * scale),
    },
  }));
  return [...rows].sort((a, b) => b.values[sortKey] - a.values[sortKey]);
}

/**
 * 채널별 시계열. 요일 주기와 채널마다 다른 위상을 섞어 만든 결정론적 값이다.
 * 유료 검색은 기간 중반에 광고를 늘린 것처럼 뒤로 갈수록 올라간다.
 */
export function buildSeries(range: DateRangeKey): Series[] {
  const days = RANGE_DAYS[range];
  const scale = RANGE_SCALE[range] / RANGE_DAYS[range];
  return CHANNELS.map((c, ci) => ({
    name: c.name,
    shade: CHANNEL_SHADE[c.name],
    points: Array.from({ length: days }, (_, d) => {
      const weekly = 1 + 0.18 * Math.sin((d / 7) * Math.PI * 2 + ci);
      const drift = c.name === "Paid Search" ? 0.6 + (d / days) * 0.9 : 1;
      return Math.round(c.sessions * scale * weekly * drift);
    }),
  }));
}

export function buildBarItems(range: DateRangeKey) {
  const scale = RANGE_SCALE[range];
  return [...CHANNELS]
    .sort((a, b) => b.sessions - a.sessions)
    .map((c) => ({
      name: c.name,
      value: Math.round(c.sessions * scale),
    }));
}

/** x축에 찍는 날짜 라벨. 실제 날짜가 아니라 기간 안 상대 위치를 보여 준다 */
export function buildXLabels(range: DateRangeKey): string[] {
  const days = RANGE_DAYS[range];
  return [`${days}일 전`, `${Math.round(days / 2)}일 전`, "어제"];
}

/** 세션이 가장 많은 채널 */
export const TOP_SESSION_CHANNEL = "Organic Search";
/** 세션이 많으면서 참여율이 가장 낮은 채널. 이 튜토리얼의 정답 */
export const WEAKEST_PAID_CHANNEL = "Paid Search";
