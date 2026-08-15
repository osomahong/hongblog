/**
 * 교육용 가상 계정 "준준상점"의 랜딩 페이지와 기기 교차 데이터.
 *
 * 함정을 하나 넣어 두었다. 전체 참여율만 보면 /product/list가 가장 낮지만, 기기로 나눠 보면
 * 세 기기가 고르게 낮아서 기기 문제가 아니다. 반대로 /event/summer는 전체로는 두 번째로
 * 낮은데 데스크톱 71.22%와 모바일 33.41%로 크게 벌어진다. 행만 보면 이 차이가 드러나지 않는다.
 *
 * 측정기준이 둘뿐이라 학습자가 행과 열을 바꿔 놓아도 표가 맞게 그려진다.
 * 참여 세션수는 세션수와 참여율에서 그때그때 계산한다. 값을 따로 적어 두면 어긋난다.
 */

import type { VariableItem } from "../../app/Ga4FreeForm";
import type { PivotMetric, PivotValues } from "../../app/Ga4PivotTable";

export const ACCOUNT_NAME = "준준상점";
export const PROPERTY_NAME = "준준상점 - GA4";
export const SEARCH_HINT = '"웹 개요"을(를) 검색해 보세요';
export const EXPLORATION_NAME = "랜딩 페이지 기기별 참여";
export const DATE_LABEL = "7월 17일~2026년 8월 13일";

export const PAGE_DIMENSION = "landingPage";
export const DEVICE_DIMENSION = "deviceCategory";

/* ===================== 변수 ===================== */

export const DIMENSIONS: VariableItem[] = [
  { key: PAGE_DIMENSION, label: "랜딩 페이지" },
  { key: DEVICE_DIMENSION, label: "기기 카테고리" },
];

export const METRICS: VariableItem[] = [
  { key: "sessions", label: "세션수" },
  { key: "engagementRate", label: "참여율" },
  { key: "engagedSessions", label: "참여 세션수" },
];

const DIMENSION_LABEL: Record<string, string> = Object.fromEntries(
  DIMENSIONS.map((d) => [d.key, d.label])
);

export function dimensionLabel(key: string): string {
  return DIMENSION_LABEL[key] ?? key;
}

const pct = (v: number) => `${v.toFixed(2)}%`;
const comma = (v: number) => v.toLocaleString("ko-KR");

const METRIC_SPEC: Record<string, PivotMetric> = {
  sessions: { key: "sessions", label: "세션수", format: comma },
  engagementRate: { key: "engagementRate", label: "참여율", format: pct },
  engagedSessions: { key: "engagedSessions", label: "참여 세션수", format: comma },
};

export function buildMetrics(keys: string[]): PivotMetric[] {
  return keys.map((k) => METRIC_SPEC[k]).filter(Boolean);
}

/* ===================== 데모 데이터 ===================== */

const DEVICE_KEYS = ["desktop", "mobile", "tablet"];

const PAGE_KEYS = [
  "/",
  "/event/summer",
  "/product/list",
  "/product/detail/bestseller",
  "/guide/size",
];

interface Measured {
  sessions: number;
  /** 참여율 (퍼센트) */
  rate: number;
}

const MATRIX: Record<string, Record<string, Measured>> = {
  "/": {
    desktop: { sessions: 3120, rate: 64.2 },
    mobile: { sessions: 7480, rate: 60.1 },
    tablet: { sessions: 410, rate: 62.5 },
  },
  // 데스크톱과 모바일이 37.8퍼센트포인트 벌어진다. 이 편의 정답
  "/event/summer": {
    desktop: { sessions: 1640, rate: 71.2 },
    mobile: { sessions: 5930, rate: 33.4 },
    tablet: { sessions: 280, rate: 64.8 },
  },
  // 전체 참여율은 가장 낮지만 세 기기가 고르게 낮다. 기기 문제로 오해하게 만드는 함정
  "/product/list": {
    desktop: { sessions: 1180, rate: 35.8 },
    mobile: { sessions: 2640, rate: 33.2 },
    tablet: { sessions: 190, rate: 34.6 },
  },
  "/product/detail/bestseller": {
    desktop: { sessions: 860, rate: 60.4 },
    mobile: { sessions: 2210, rate: 57.2 },
    tablet: { sessions: 140, rate: 59.1 },
  },
  "/guide/size": {
    desktop: { sessions: 520, rate: 46.2 },
    mobile: { sessions: 1180, rate: 47.5 },
    tablet: { sessions: 90, rate: 49.3 },
  },
};

/** 참여 세션수는 반올림한 정수로 두고, 참여율은 그 정수에서 되돌려 계산한다 */
function measured(page: string, device: string): PivotValues {
  const m = MATRIX[page][device];
  const engaged = Math.round((m.sessions * m.rate) / 100);
  return {
    sessions: m.sessions,
    engagedSessions: engaged,
    engagementRate: (engaged / m.sessions) * 100,
  };
}

function fold(parts: PivotValues[]): PivotValues {
  const sessions = parts.reduce((sum, p) => sum + p.sessions, 0);
  const engaged = parts.reduce((sum, p) => sum + p.engagedSessions, 0);
  return {
    sessions,
    engagedSessions: engaged,
    engagementRate: sessions === 0 ? 0 : (engaged / sessions) * 100,
  };
}

const ALL_CELLS = PAGE_KEYS.flatMap((p) => DEVICE_KEYS.map((d) => measured(p, d)));

/** 측정기준 하나를 놓았을 때 그 축에 늘어서는 값. 세션수가 많은 순서다 */
export function keysFor(dimension: string): string[] {
  const keys = dimension === DEVICE_DIMENSION ? [...DEVICE_KEYS] : [...PAGE_KEYS];
  return keys.sort((a, b) => axisTotal(dimension, b).sessions - axisTotal(dimension, a).sessions);
}

/** 한 축의 값 하나에 해당하는 전체 합계 */
function axisTotal(dimension: string, key: string): PivotValues {
  return dimension === DEVICE_DIMENSION
    ? fold(PAGE_KEYS.map((p) => measured(p, key)))
    : fold(DEVICE_KEYS.map((d) => measured(key, d)));
}

/**
 * 표 한 칸의 값.
 * rowDimension이 랜딩 페이지면 colKey는 기기이고, 기기 카테고리면 colKey는 랜딩 페이지다.
 * colKey가 null이면 그 줄의 총계다.
 */
export function cellValues(
  rowDimension: string,
  rowKey: string,
  colKey: string | null
): PivotValues {
  if (rowDimension === DEVICE_DIMENSION) {
    return colKey ? measured(colKey, rowKey) : axisTotal(DEVICE_DIMENSION, rowKey);
  }
  return colKey ? measured(rowKey, colKey) : axisTotal(PAGE_DIMENSION, rowKey);
}

/** 맨 아래 총계 줄. colKey가 null이면 표 전체 총계다 */
export function totalValues(rowDimension: string, colKey: string | null): PivotValues {
  if (!colKey) return fold(ALL_CELLS);
  return rowDimension === DEVICE_DIMENSION
    ? axisTotal(PAGE_DIMENSION, colKey)
    : axisTotal(DEVICE_DIMENSION, colKey);
}

/* ===================== 정답 ===================== */

/** 전체 참여율이 가장 낮은 페이지. 네 번째 스텝의 정답이자 마지막 스텝의 오답 */
export const LOWEST_OVERALL_PAGE = "/product/list";

/** 기기에 따라 참여율이 가장 크게 벌어지는 페이지. 마지막 스텝의 정답 */
export const WIDEST_DEVICE_GAP_PAGE = "/event/summer";
