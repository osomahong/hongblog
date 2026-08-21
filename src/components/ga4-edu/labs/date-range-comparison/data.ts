/**
 * 교육용 가상 계정 "준준상점"의 기간 비교 데이터.
 *
 * 이번 기간 값은 초급 1번 트래픽 획득과 같게 맞췄다. 두 편을 이어서 보는 학습자가
 * 같은 계정을 보고 있다고 느끼게 하기 위해서다.
 *
 * 함정은 두 겹이다. 첫째로 합계는 2.2%만 줄어 큰 변화가 없어 보이는데 안에서는
 * 유료 검색이 34.2% 빠졌다. 둘째로 비교 대상을 이전 연도로 바꾸면 판단이 뒤집히는
 * 채널이 나온다. 추천은 이전 기간보다 11.6% 줄었지만 작년 같은 기간보다는 48.0% 많다.
 */

import type { MetricColumn, TableRow, DimensionOption } from "../../app/Ga4ReportTable";
import type { Series } from "../../app/Ga4Charts";
import {
  COMPARE_BASE_LABEL,
  COMPARE_BASE_SUB,
  DATE_RANGE_SUB,
  type CompareBase,
  type DateRangeKey,
} from "../../app/types";

export const ACCOUNT_NAME = "준준상점";
export const PROPERTY_NAME = "준준상점 - GA4";
export const SEARCH_HINT = '"트래픽 획득"을(를) 검색해 보세요';

export const DIMENSION_OPTIONS: DimensionOption[] = [
  { key: "sessionDefaultChannelGroup", label: "세션 기본 채널 그룹" },
  { key: "sessionSource", label: "세션 소스" },
  { key: "sessionMedium", label: "세션 매체" },
];

/** 한 기간에서 한 채널이 남긴 값 */
interface Window {
  sessions: number;
  engagementRate: number;
  keyEvents: number;
}

interface ChannelFacts {
  name: string;
  current: Window;
  previous: Window;
  yearAgo: Window;
}

const CHANNELS: ChannelFacts[] = [
  {
    name: "Organic Search",
    current: { sessions: 11940, engagementRate: 0.6201, keyEvents: 296 },
    previous: { sessions: 10240, engagementRate: 0.6044, keyEvents: 248 },
    yearAgo: { sessions: 9120, engagementRate: 0.582, keyEvents: 214 },
  },
  {
    name: "Direct",
    current: { sessions: 5880, engagementRate: 0.5449, keyEvents: 131 },
    previous: { sessions: 5510, engagementRate: 0.5512, keyEvents: 122 },
    yearAgo: { sessions: 4970, engagementRate: 0.538, keyEvents: 108 },
  },
  // 이전 기간 대비 34.2% 빠진 채널. 네 번째 스텝의 정답이다.
  // 이전 연도와 비교해도 19.2% 줄어, 두 기준이 같은 방향을 가리킨다.
  {
    name: "Paid Search",
    current: { sessions: 5610, engagementRate: 0.2881, keyEvents: 54 },
    previous: { sessions: 8520, engagementRate: 0.3462, keyEvents: 118 },
    yearAgo: { sessions: 6940, engagementRate: 0.331, keyEvents: 91 },
  },
  // 이전 기간보다는 11.6% 줄었는데 이전 연도보다는 48.0% 많다.
  // 두 기준이 반대를 가리키는 유일한 채널이라 마지막 스텝의 정답이다.
  {
    name: "Referral",
    current: { sessions: 2043, engagementRate: 0.6843, keyEvents: 88 },
    previous: { sessions: 2310, engagementRate: 0.6719, keyEvents: 96 },
    yearAgo: { sessions: 1380, engagementRate: 0.664, keyEvents: 52 },
  },
  {
    name: "Organic Social",
    current: { sessions: 1684, engagementRate: 0.2447, keyEvents: 17 },
    previous: { sessions: 1180, engagementRate: 0.261, keyEvents: 12 },
    yearAgo: { sessions: 2460, engagementRate: 0.297, keyEvents: 28 },
  },
];

/** 기간이 짧아지면 세션도 그만큼 줄어든 것처럼 보이게 하는 배율 */
const RANGE_SCALE: Record<DateRangeKey, number> = {
  "7d": 0.26,
  "28d": 1,
  "90d": 3.15,
};

const RANGE_DAYS: Record<DateRangeKey, number> = { "7d": 7, "28d": 28, "90d": 90 };

const comma = (v: number): string => v.toLocaleString("ko-KR");
const pct = (v: number): string => `${(v * 100).toFixed(2)}%`;

/** % 변화 줄에 쓰는 표기. 늘었으면 앞에 더하기를 붙인다 */
export const changeFormat = (v: number): string =>
  `${v > 0 ? "+" : ""}${(v * 100).toFixed(1)}%`;

export const METRIC_COLUMNS: MetricColumn[] = [
  { key: "sessions", label: "세션수" },
  { key: "engagementRate", label: "참여율", format: pct },
  { key: "keyEvents", label: "주요 이벤트" },
];

const windowOf = (c: ChannelFacts, base: CompareBase): Window =>
  base === "previous" ? c.previous : c.yearAgo;

const change = (now: number, before: number): number => (before === 0 ? 0 : (now - before) / before);

/* ===================== 합계 ===================== */

function sumOf(pick: (c: ChannelFacts) => Window, scale: number) {
  const sessions = CHANNELS.reduce((s, c) => s + pick(c).sessions, 0);
  const engaged = CHANNELS.reduce((s, c) => s + pick(c).sessions * pick(c).engagementRate, 0);
  const keyEvents = CHANNELS.reduce((s, c) => s + pick(c).keyEvents, 0);
  return {
    sessions: Math.round(sessions * scale),
    engagementRate: engaged / sessions,
    keyEvents: Math.round(keyEvents * scale),
    rawSessions: sessions,
    rawKeyEvents: keyEvents,
  };
}

/**
 * 합계 줄. 비교를 걸면 GA4는 합계 아래에도 변화율을 적는다.
 * 학습자가 합계만 보고 넘어가지 않도록 이 값을 화면에 남긴다.
 */
export function buildColumns(range: DateRangeKey, base: CompareBase | null): MetricColumn[] {
  const scale = RANGE_SCALE[range];
  const now = sumOf((c) => c.current, scale);
  if (!base) {
    return METRIC_COLUMNS.map((col) => ({
      ...col,
      total: now[col.key as "sessions" | "engagementRate" | "keyEvents"],
      totalNote: col.key === "engagementRate" ? "평균과 동일" : "총계 대비 100%",
    }));
  }

  const before = sumOf((c) => windowOf(c, base), scale);
  const note = (key: string): string => {
    if (key === "sessions") return `${COMPARE_BASE_LABEL[base]} 대비 ${changeFormat(change(now.rawSessions, before.rawSessions))}`;
    if (key === "keyEvents") return `${COMPARE_BASE_LABEL[base]} 대비 ${changeFormat(change(now.rawKeyEvents, before.rawKeyEvents))}`;
    return `${COMPARE_BASE_LABEL[base]} 대비 ${changeFormat(change(now.engagementRate, before.engagementRate))}`;
  };

  return METRIC_COLUMNS.map((col) => ({
    ...col,
    total: now[col.key as "sessions" | "engagementRate" | "keyEvents"],
    totalNote: note(col.key),
  }));
}

/* ===================== 표 ===================== */

/**
 * 고른 줄을 가리키는 식별자.
 * 비교를 걸면 채널 하나가 세 줄로 나뉘므로 어느 줄을 눌러도 같은 채널로 읽는다.
 */
export function rowKey(channel: string, part: string): string {
  return `${channel}|${part}`;
}

export function channelOf(key: string | null): string | null {
  return key ? key.split("|")[0] : null;
}

export function buildRows(
  range: DateRangeKey,
  sortKey: string,
  base: CompareBase | null
): TableRow[] {
  const scale = RANGE_SCALE[range];
  const sorted = [...CHANNELS].sort((a, b) => {
    const key = sortKey as "sessions" | "engagementRate" | "keyEvents";
    return b.current[key] - a.current[key];
  });

  const valuesOf = (w: Window) => ({
    sessions: Math.round(w.sessions * scale),
    engagementRate: w.engagementRate,
    keyEvents: Math.round(w.keyEvents * scale),
  });

  if (!base) {
    return sorted.map((c) => ({
      name: c.name,
      key: rowKey(c.name, "current"),
      values: valuesOf(c.current),
    }));
  }

  return sorted.flatMap((c, i) => {
    const before = windowOf(c, base);
    return [
      {
        name: c.name,
        key: rowKey(c.name, "current"),
        comparison: DATE_RANGE_SUB[range],
        index: i + 1,
        values: valuesOf(c.current),
      },
      {
        name: c.name,
        key: rowKey(c.name, "before"),
        comparison: COMPARE_BASE_SUB[base][range],
        index: null,
        values: valuesOf(before),
      },
      {
        name: c.name,
        key: rowKey(c.name, "change"),
        comparison: "% 변화",
        index: null,
        groupEnd: true,
        valueFormat: changeFormat,
        values: {
          sessions: change(c.current.sessions, before.sessions),
          engagementRate: change(c.current.engagementRate, before.engagementRate),
          keyEvents: change(c.current.keyEvents, before.keyEvents),
        },
      },
    ];
  });
}

/* ===================== 차트 ===================== */

/**
 * 전체 세션의 하루치 흐름. 비교를 걸면 비교 기간을 점선으로 겹쳐 그린다.
 * 난수를 쓰지 않고 요일 주기로만 만들어 서버 렌더와 어긋나지 않게 한다.
 */
export function buildSeries(range: DateRangeKey, base: CompareBase | null): Series[] {
  const days = RANGE_DAYS[range];
  const scale = RANGE_SCALE[range] / days;

  const line = (pick: (c: ChannelFacts) => Window, phase: number): number[] => {
    const total = CHANNELS.reduce((s, c) => s + pick(c).sessions, 0);
    return Array.from({ length: days }, (_, d) => {
      const weekly = 1 + 0.16 * Math.sin((d / 7) * Math.PI * 2 + phase);
      return Math.round(total * scale * weekly);
    });
  };

  const current: Series = { name: DATE_RANGE_SUB[range], shade: 0, points: line((c) => c.current, 0) };
  if (!base) return [current];

  return [
    current,
    {
      name: COMPARE_BASE_SUB[base][range],
      shade: 3,
      dashed: true,
      points: line((c) => windowOf(c, base), 1.1),
    },
  ];
}

export function buildBarItems(range: DateRangeKey) {
  const scale = RANGE_SCALE[range];
  return [...CHANNELS]
    .sort((a, b) => b.current.sessions - a.current.sessions)
    .map((c) => ({ name: c.name, value: Math.round(c.current.sessions * scale) }));
}

export function buildXLabels(range: DateRangeKey): string[] {
  const days = RANGE_DAYS[range];
  return [`${days}일 전`, `${Math.round(days / 2)}일 전`, "어제"];
}

/* ===================== 정답 ===================== */

/** 이전 기간 대비 세션이 가장 크게 줄어든 채널 */
export const BIGGEST_DROP_CHANNEL = "Paid Search";

/** 이전 기간보다는 줄었는데 이전 연도보다는 늘어난 채널 */
export const FLIPPED_CHANNEL = "Referral";

/** 표에 실제로 찍히는 줄 수. 아래쪽 쪽 이동은 측정기준 값의 개수를 센다 */
export const CHANNEL_COUNT = CHANNELS.length;

/** 안내문에 쓰는 폭. 늘었는지 줄었는지는 문장에서 밝히므로 부호를 뗀다 */
const width = (v: number): string => `${(Math.abs(v) * 100).toFixed(1)}%`;

/** 안내문에 쓰는 값. 화면에 찍히는 값과 같은 계산으로 만든다 */
export const FACTS = {
  totalPrevious: width(
    change(sumOf((c) => c.current, 1).rawSessions, sumOf((c) => c.previous, 1).rawSessions)
  ),
  paidPrevious: width(change(5610, 8520)),
  paidYearAgo: width(change(5610, 6940)),
  referralPrevious: width(change(2043, 2310)),
  referralYearAgo: width(change(2043, 1380)),
};

export { comma };
