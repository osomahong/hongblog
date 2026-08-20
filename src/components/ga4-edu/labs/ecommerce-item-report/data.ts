/**
 * 교육용 가상 계정 "준준상점"의 상품별 이커머스 데이터.
 *
 * 이 편의 함정은 조회수 순위와 구매 순위가 어긋난다는 것이다.
 * 샌들은 조회가 5,240회로 세 번째인데 구매는 68건에 그쳐 구매 전환이 1.30%다.
 * 장바구니까지 가는 비율도 6.11%로 낮아, 상품 상세에서 막히고 있다는 신호가 된다.
 *
 * 반대로 린넨 셔츠는 조회가 더 적은데도 구매가 412건으로 가장 많다.
 * 조회수만 보고 노출을 늘리면 잘 팔리는 상품이 아니라 잘 보이는 상품에 예산이 간다.
 */

import type { VariableItem } from "../../app/Ga4FreeForm";
import type { PivotMetric, PivotValues } from "../../app/Ga4PivotTable";

export const ACCOUNT_NAME = "준준상점";
export const PROPERTY_NAME = "준준상점 - GA4";
export const SEARCH_HINT = '"항목 보고서"을(를) 검색해 보세요';
export const EXPLORATION_NAME = "상품별 구매 흐름";
export const DATE_LABEL = "7월 17일~2026년 8월 13일";

export const ITEM_DIMENSION = "itemName";
export const CATEGORY_DIMENSION = "itemCategory";

export const DIMENSIONS: VariableItem[] = [
  { key: ITEM_DIMENSION, label: "항목 이름" },
  { key: CATEGORY_DIMENSION, label: "항목 카테고리" },
];

export const METRICS: VariableItem[] = [
  { key: "itemsViewed", label: "조회된 항목" },
  { key: "itemsAddedToCart", label: "장바구니에 추가된 항목" },
  { key: "itemsPurchased", label: "구매한 항목" },
  { key: "cartToViewRate", label: "조회 대비 장바구니 추가 비율" },
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
  itemsViewed: { key: "itemsViewed", label: "조회된 항목", format: comma },
  itemsAddedToCart: { key: "itemsAddedToCart", label: "장바구니에 추가된 항목", format: comma },
  itemsPurchased: { key: "itemsPurchased", label: "구매한 항목", format: comma },
  cartToViewRate: {
    key: "cartToViewRate",
    label: "조회 대비 장바구니 추가 비율",
    format: pct,
  },
};

export function buildMetrics(keys: string[]): PivotMetric[] {
  return keys.map((k) => METRIC_SPEC[k]).filter(Boolean);
}

interface Raw {
  viewed: number;
  addedToCart: number;
  purchased: number;
}

/** 상품별 값. 조회수가 많은 순서로 둔다 */
const BY_ITEM: Record<string, Raw> = {
  "여름 원피스": { viewed: 8420, addedToCart: 1240, purchased: 386 },
  "린넨 셔츠": { viewed: 6180, addedToCart: 980, purchased: 412 },
  "가죽 샌들": { viewed: 5240, addedToCart: 320, purchased: 68 },
  "밀짚 모자": { viewed: 3180, addedToCart: 640, purchased: 298 },
  "라탄 비치백": { viewed: 2140, addedToCart: 380, purchased: 176 },
};

/** 카테고리로 묶으면 상품별 차이가 평균에 섞여 보이지 않는다 */
const BY_CATEGORY: Record<string, Raw> = {
  "의류": { viewed: 14600, addedToCart: 2220, purchased: 798 },
  "신발": { viewed: 5240, addedToCart: 320, purchased: 68 },
  "액세서리": { viewed: 5320, addedToCart: 1020, purchased: 474 },
};

const TABLE: Record<string, Record<string, Raw>> = {
  [ITEM_DIMENSION]: BY_ITEM,
  [CATEGORY_DIMENSION]: BY_CATEGORY,
};

function toValues(raw: Raw): PivotValues {
  return {
    itemsViewed: raw.viewed,
    itemsAddedToCart: raw.addedToCart,
    itemsPurchased: raw.purchased,
    cartToViewRate: raw.viewed === 0 ? 0 : (raw.addedToCart / raw.viewed) * 100,
  };
}

export function keysFor(dimension: string): string[] {
  return Object.keys(TABLE[dimension] ?? {});
}

export function cellValues(dimension: string, row: string): PivotValues {
  const raw = TABLE[dimension]?.[row];
  return raw
    ? toValues(raw)
    : { itemsViewed: 0, itemsAddedToCart: 0, itemsPurchased: 0, cartToViewRate: 0 };
}

export function totalValues(dimension: string): PivotValues {
  const rows = Object.values(TABLE[dimension] ?? {});
  const viewed = rows.reduce((sum, r) => sum + r.viewed, 0);
  const addedToCart = rows.reduce((sum, r) => sum + r.addedToCart, 0);
  const purchased = rows.reduce((sum, r) => sum + r.purchased, 0);
  return toValues({ viewed, addedToCart, purchased });
}

/** 조회는 많은데 장바구니로 가는 비율이 가장 낮은 상품 */
export const WEAK_ITEM = "가죽 샌들";

/** 오답 자리. 조회수 1위라 눈에 먼저 들어온다 */
export const DECOY_ITEM = "여름 원피스";

/** 조회는 적지만 구매가 가장 많은 상품 */
export const BEST_ITEM = "린넨 셔츠";
