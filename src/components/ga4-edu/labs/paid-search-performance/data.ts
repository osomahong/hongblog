/**
 * 교육용 가상 계정 "준준상점"의 유입 소스와 캠페인별 성과.
 *
 * 이 편의 함정은 세션수와 전환율의 순위가 어긋난다는 것이다.
 * 세션수 1위는 google / organic이지만 세션 주요 이벤트 비율이 가장 높은 곳은 google / cpc다.
 * 세션수만 보고 예산을 정하면 실제로 전환을 만드는 유입을 놓친다.
 *
 * 행을 캠페인으로 바꾸면 한 번 더 갈린다. 유료 검색 안에서도 브랜드 캠페인은 15.00%인데
 * 신규 키워드 테스트는 1.10%로, 소스 하나로 묶어 보면 이 차이가 평균에 섞여 보이지 않는다.
 */

import type { VariableItem } from "../../app/Ga4FreeForm";
import type { PivotMetric, PivotValues } from "../../app/Ga4PivotTable";

export const ACCOUNT_NAME = "준준상점";
export const PROPERTY_NAME = "준준상점 - GA4";
export const SEARCH_HINT = '"트래픽 획득"을(를) 검색해 보세요';
export const EXPLORATION_NAME = "검색광고 성과";
export const DATE_LABEL = "7월 17일~2026년 8월 13일";

export const SOURCE_DIMENSION = "sessionSourceMedium";
export const CAMPAIGN_DIMENSION = "sessionCampaign";

/* ===================== 변수 ===================== */

export const DIMENSIONS: VariableItem[] = [
  { key: SOURCE_DIMENSION, label: "세션 소스/매체" },
  { key: CAMPAIGN_DIMENSION, label: "세션 캠페인" },
];

export const METRICS: VariableItem[] = [
  { key: "sessions", label: "세션수" },
  { key: "keyEvents", label: "주요 이벤트" },
  { key: "keyEventRate", label: "세션 주요 이벤트 비율" },
];

const DIMENSION_LABEL: Record<string, string> = Object.fromEntries(
  DIMENSIONS.map((d) => [d.key, d.label])
);

export function dimensionLabel(key: string): string {
  return DIMENSION_LABEL[key] ?? key;
}

const comma = (v: number) => v.toLocaleString("ko-KR");
const pct = (v: number) => `${v.toFixed(2)}%`;

const METRIC_SPEC: Record<string, PivotMetric> = {
  sessions: { key: "sessions", label: "세션수", format: comma },
  keyEvents: { key: "keyEvents", label: "주요 이벤트", format: comma },
  keyEventRate: { key: "keyEventRate", label: "세션 주요 이벤트 비율", format: pct },
};

export function buildMetrics(keys: string[]): PivotMetric[] {
  return keys.map((k) => METRIC_SPEC[k]).filter(Boolean);
}

/* ===================== 데모 데이터 ===================== */

interface Raw {
  sessions: number;
  keyEvents: number;
}

/** 세션 소스/매체별 성과. 세션수가 많은 순서로 둔다 */
const BY_SOURCE: Record<string, Raw> = {
  "google / organic": { sessions: 8420, keyEvents: 312 },
  "google / cpc": { sessions: 5240, keyEvents: 468 },
  "(direct) / (none)": { sessions: 4960, keyEvents: 184 },
  "naver / organic": { sessions: 3180, keyEvents: 96 },
  "naver / cpc": { sessions: 2140, keyEvents: 62 },
  "instagram / social": { sessions: 1860, keyEvents: 24 },
};

/** 세션 캠페인별 성과. 유료 유입에만 캠페인 이름이 붙는다 */
const BY_CAMPAIGN: Record<string, Raw> = {
  "(not set)": { sessions: 18420, keyEvents: 616 },
  "8월_기획전_일반": { sessions: 2680, keyEvents: 148 },
  "신규_키워드_테스트": { sessions: 1640, keyEvents: 18 },
  "8월_기획전_브랜드": { sessions: 1240, keyEvents: 186 },
  "리마케팅_장바구니": { sessions: 820, keyEvents: 112 },
  "8월_디스플레이": { sessions: 640, keyEvents: 26 },
};

const TABLE: Record<string, Record<string, Raw>> = {
  [SOURCE_DIMENSION]: BY_SOURCE,
  [CAMPAIGN_DIMENSION]: BY_CAMPAIGN,
};

function toValues(raw: Raw): PivotValues {
  return {
    sessions: raw.sessions,
    keyEvents: raw.keyEvents,
    keyEventRate: raw.sessions === 0 ? 0 : (raw.keyEvents / raw.sessions) * 100,
  };
}

/** 측정기준 하나를 놓았을 때 세로줄에 나열되는 값 */
export function keysFor(dimension: string): string[] {
  return Object.keys(TABLE[dimension] ?? {});
}

export function cellValues(dimension: string, row: string): PivotValues {
  const raw = TABLE[dimension]?.[row];
  return raw ? toValues(raw) : { sessions: 0, keyEvents: 0, keyEventRate: 0 };
}

export function totalValues(dimension: string): PivotValues {
  const rows = Object.values(TABLE[dimension] ?? {});
  const sessions = rows.reduce((sum, r) => sum + r.sessions, 0);
  const keyEvents = rows.reduce((sum, r) => sum + r.keyEvents, 0);
  return {
    sessions,
    keyEvents,
    keyEventRate: sessions === 0 ? 0 : (keyEvents / sessions) * 100,
  };
}

/** 세션 주요 이벤트 비율이 가장 높은 소스/매체. 세션수로는 2위다 */
export const BEST_RATE_SOURCE = "google / cpc";

/** 세션수 1위지만 전환율은 중간인 줄. 세션수만 보면 여기를 고르게 된다 */
export const DECOY_SOURCE = "google / organic";

/** 유료 캠페인 가운데 세션은 많은데 전환이 거의 없는 캠페인 */
export const WORST_CAMPAIGN = "신규_키워드_테스트";

/** 전환율은 낮지만 세션이 적어 손실이 크지 않은 캠페인 */
export const DECOY_CAMPAIGN = "8월_디스플레이";
