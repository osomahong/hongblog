/**
 * 교육용 가상 계정 "준준상점"의 채널과 기기 데이터.
 *
 * 함정은 순위가 뒤집히는 구간이다. 채널만 보면 Direct가 2위, Paid Search가 3위인데
 * 기기를 붙여 쪼개면 Paid Search가 모바일에 몰려 있어 조합 2위로 올라온다.
 * 아래쪽도 뒤집힌다. 전체로는 Organic Social이 꼴찌지만 모바일만 남기면 Referral이 꼴찌다.
 * 채널마다 모바일 비중이 다르기 때문이다.
 *
 * 채널별 세션수는 초급 1번 트래픽 획득과 같은 값으로 맞췄다. 총계는 27,157이다.
 */

import type { MetricColumn, TableRow, DimensionOption } from "../../app/Ga4ReportTable";
import type { FilterChoice } from "../../app/Ga4FilterEditor";

export const ACCOUNT_NAME = "준준상점";
export const PROPERTY_NAME = "준준상점 - GA4";
export const SEARCH_HINT = '"트래픽 획득"을(를) 검색해 보세요';

export const DEVICE_DIMENSION = "deviceCategory";
export const MOBILE = "mobile";

export const DIMENSION_OPTIONS: DimensionOption[] = [
  { key: "sessionDefaultChannelGroup", label: "세션 기본 채널 그룹" },
  { key: "sessionSource", label: "세션 소스" },
  { key: "sessionMedium", label: "세션 매체" },
];

/** 측정기준 이름 옆 더하기로 붙일 수 있는 항목 */
export const SECONDARY_OPTIONS: DimensionOption[] = [
  { key: DEVICE_DIMENSION, label: "기기 카테고리" },
  { key: "country", label: "국가" },
  { key: "landingPage", label: "방문 페이지" },
];

export const FILTER_DIMENSIONS: FilterChoice[] = [
  { key: DEVICE_DIMENSION, label: "기기 카테고리" },
  { key: "sessionDefaultChannelGroup", label: "세션 기본 채널 그룹" },
  { key: "country", label: "국가" },
];

export const FILTER_VALUES: Record<string, string[]> = {
  [DEVICE_DIMENSION]: ["desktop", MOBILE, "tablet"],
  sessionDefaultChannelGroup: ["Organic Search", "Direct", "Paid Search", "Referral", "Organic Social"],
  country: ["대한민국", "미국", "일본"],
};

export function secondaryLabelOf(key: string | null): string | null {
  return SECONDARY_OPTIONS.find((o) => o.key === key)?.label ?? null;
}

export function filterLabelOf(dimension: string | null, value: string | null): string | null {
  if (!dimension || !value) return null;
  const label = FILTER_DIMENSIONS.find((d) => d.key === dimension)?.label ?? dimension;
  return `${label}: ${value}`;
}

/* ===================== 데모 데이터 ===================== */

const DEVICES = ["desktop", MOBILE, "tablet"] as const;

interface ChannelFacts {
  name: string;
  /** 기기별 세션수. 더하면 그 채널의 전체 세션수가 된다 */
  sessions: Record<string, number>;
  /** 기기별 주요 이벤트 */
  keyEvents: Record<string, number>;
  /** 기기별 참여율 */
  engagementRate: Record<string, number>;
}

const CHANNELS: ChannelFacts[] = [
  {
    name: "Organic Search",
    sessions: { desktop: 4300, mobile: 7164, tablet: 476 },
    keyEvents: { desktop: 31, mobile: 42, tablet: 4 },
    engagementRate: { desktop: 0.6704, mobile: 0.5928, tablet: 0.6134 },
  },
  {
    name: "Direct",
    sessions: { desktop: 2116, mobile: 3528, tablet: 236 },
    keyEvents: { desktop: 14, mobile: 18, tablet: 2 },
    engagementRate: { desktop: 0.5812, mobile: 0.5216, tablet: 0.5424 },
  },
  // 광고가 모바일에 몰려 있어 기기를 붙이면 조합 2위로 올라온다
  {
    name: "Paid Search",
    sessions: { desktop: 954, mobile: 4488, tablet: 168 },
    keyEvents: { desktop: 12, mobile: 26, tablet: 1 },
    engagementRate: { desktop: 0.4102, mobile: 0.2618, tablet: 0.3512 },
  },
  // 모바일 비중이 가장 낮아 모바일만 남기면 꼴찌가 된다
  {
    name: "Referral",
    sessions: { desktop: 858, mobile: 1143, tablet: 42 },
    keyEvents: { desktop: 9, mobile: 7, tablet: 1 },
    engagementRate: { desktop: 0.7218, mobile: 0.6612, tablet: 0.6904 },
  },
  {
    name: "Organic Social",
    sessions: { desktop: 118, mobile: 1532, tablet: 34 },
    keyEvents: { desktop: 2, mobile: 6, tablet: 0 },
    engagementRate: { desktop: 0.3106, mobile: 0.2384, tablet: 0.2712 },
  },
];

/* ===================== 표 ===================== */

const pct = (v: number): string => `${(v * 100).toFixed(2)}%`;

export const METRIC_COLUMNS: MetricColumn[] = [
  { key: "sessions", label: "세션수", share: true },
  { key: "engagementRate", label: "참여율", format: pct, totalNote: "평균과 동일" },
  { key: "keyEvents", label: "주요 이벤트", share: true },
];

interface Cell {
  sessions: number;
  keyEvents: number;
  engaged: number;
}

/** 지금 조건에 맞는 칸만 모은다. 필터는 조건에 맞지 않는 칸을 아예 버린다 */
function cells(filterDevice: string | null): { channel: string; device: string; cell: Cell }[] {
  const out: { channel: string; device: string; cell: Cell }[] = [];
  for (const c of CHANNELS) {
    for (const d of DEVICES) {
      if (filterDevice && d !== filterDevice) continue;
      const sessions = c.sessions[d];
      out.push({
        channel: c.name,
        device: d,
        cell: {
          sessions,
          keyEvents: c.keyEvents[d],
          engaged: Math.round(sessions * c.engagementRate[d]),
        },
      });
    }
  }
  return out;
}

function fold(list: Cell[]): Cell {
  return {
    sessions: list.reduce((s, c) => s + c.sessions, 0),
    keyEvents: list.reduce((s, c) => s + c.keyEvents, 0),
    engaged: list.reduce((s, c) => s + c.engaged, 0),
  };
}

/** 고른 줄을 가리키는 식별자. 보조 측정기준을 붙이면 같은 채널이 여러 줄이 된다 */
export function rowKey(channel: string, device: string | null): string {
  return device ? `${channel}|${device}` : channel;
}

export function buildColumns(filterDevice: string | null): MetricColumn[] {
  const all = fold(cells(filterDevice).map((x) => x.cell));
  const totals: Record<string, number> = {
    sessions: all.sessions,
    keyEvents: all.keyEvents,
    engagementRate: all.sessions === 0 ? 0 : all.engaged / all.sessions,
  };
  return METRIC_COLUMNS.map((col) => ({ ...col, total: totals[col.key] }));
}

export function buildRows(
  sortKey: string,
  secondary: string | null,
  filterDevice: string | null
): TableRow[] {
  const list = cells(filterDevice);

  const toRow = (name: string, device: string | null, cell: Cell): TableRow => ({
    name,
    key: rowKey(name, device),
    secondary: device ?? undefined,
    values: {
      sessions: cell.sessions,
      keyEvents: cell.keyEvents,
      engagementRate: cell.sessions === 0 ? 0 : cell.engaged / cell.sessions,
    },
  });

  // 보조 측정기준을 붙이면 채널과 기기 조합마다 한 줄이 된다
  const rows = secondary
    ? list.map((x) => toRow(x.channel, x.device, x.cell))
    : CHANNELS.map((c) =>
        toRow(
          c.name,
          null,
          fold(list.filter((x) => x.channel === c.name).map((x) => x.cell))
        )
      ).filter((r) => r.values.sessions > 0);

  return [...rows].sort((a, b) => b.values[sortKey] - a.values[sortKey]);
}

/* ===================== 정답 ===================== */

/** 기기를 붙였을 때 세션이 두 번째로 많은 조합. 채널만 보면 3위였다 */
export const SECOND_COMBO_CHANNEL = "Paid Search";

/** 모바일만 남겼을 때 세션이 가장 적은 채널. 전체로는 꼴찌가 아니었다 */
export const MOBILE_LOWEST_CHANNEL = "Referral";
