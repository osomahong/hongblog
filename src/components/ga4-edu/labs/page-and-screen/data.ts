/**
 * 교육용 가상 계정 "준준상점"의 페이지 및 화면 데이터.
 *
 * 함정을 둘 넣었다.
 * 하나는 상품 상세다. 경로로 보면 세 주소로 나뉘어 각각 3,260과 2,940과 2,610이라 1위가
 * 홈처럼 보이지만, 제목으로 묶으면 8,810이 되어 홈 8,420을 넘는다.
 * 다른 하나는 쿠폰함이다. 사용자당 조회수가 3.86으로 가장 높지만 조회수가 340뿐이라
 * 그 숫자로 무엇을 판단하기 어렵다.
 *
 * 같은 조회를 다르게 묶은 것이라 두 측정기준의 조회수 총계는 29,070으로 같다.
 * 활성 사용자만 중복을 뺀 값이라 묶는 기준에 따라 달라진다.
 */

import type { DateRangeKey } from "../../app/types";
import type { MetricColumn, TableRow, DimensionOption } from "../../app/Ga4ReportTable";
import type { Series } from "../../app/Ga4Charts";

export const ACCOUNT_NAME = "준준상점";
export const PROPERTY_NAME = "준준상점 - GA4";
export const SEARCH_HINT = '"페이지 및 화면"을(를) 검색해 보세요';

export const PATH_DIMENSION = "pagePath";
export const TITLE_DIMENSION = "pageTitle";

export const DIMENSION_OPTIONS: DimensionOption[] = [
  { key: PATH_DIMENSION, label: "페이지 경로 및 화면 클래스" },
  { key: TITLE_DIMENSION, label: "페이지 제목 및 화면 클래스" },
  { key: "pathAndQuery", label: "페이지 경로 + 쿼리 문자열 및 화면 클래스" },
  { key: "contentGroup", label: "콘텐츠 그룹" },
];

/* ===================== 데모 데이터 ===================== */

interface PageFacts {
  /** 표에 찍히는 이름 */
  name: string;
  views: number;
  activeUsers: number;
  /** 평균 참여 시간 (초) */
  avgEngagementSec: number;
  events: number;
  keyEvents: number;
}

/** 경로로 묶었을 때. 상품 상세가 세 주소로 나뉘어 있다 */
const BY_PATH: PageFacts[] = [
  { name: "/", views: 8420, activeUsers: 5240, avgEngagementSec: 24, events: 23576, keyEvents: 42 },
  { name: "/product/list", views: 4180, activeUsers: 2910, avgEngagementSec: 41, events: 14212, keyEvents: 68 },
  { name: "/product/detail/1042", views: 3260, activeUsers: 2180, avgEngagementSec: 72, events: 12388, keyEvents: 154 },
  { name: "/product/detail/2087", views: 2940, activeUsers: 1960, avgEngagementSec: 68, events: 11172, keyEvents: 131 },
  { name: "/product/detail/3155", views: 2610, activeUsers: 1740, avgEngagementSec: 75, events: 9918, keyEvents: 142 },
  { name: "/event/summer", views: 2480, activeUsers: 1820, avgEngagementSec: 52, events: 8184, keyEvents: 96 },
  { name: "/order/track", views: 1980, activeUsers: 620, avgEngagementSec: 94, events: 5148, keyEvents: 8 },
  { name: "/guide/size", views: 1540, activeUsers: 980, avgEngagementSec: 126, events: 6314, keyEvents: 37 },
  { name: "/cart", views: 1320, activeUsers: 840, avgEngagementSec: 48, events: 5940, keyEvents: 212 },
  { name: "/mypage/coupon", views: 340, activeUsers: 88, avgEngagementSec: 112, events: 816, keyEvents: 4 },
];

/**
 * 제목으로 묶었을 때. 상품 상세 세 주소가 한 줄로 합쳐진다.
 * 활성 사용자는 중복을 뺀 값이라 세 줄을 더한 5,880이 아니라 4,720이다.
 */
const BY_TITLE: PageFacts[] = [
  // 평균 참여 시간은 세 주소를 조회수로 가중 평균한 값이다. 총계가 어긋나지 않게 한다
  { name: "상품 상세", views: 8810, activeUsers: 4720, avgEngagementSec: 71.55, events: 33478, keyEvents: 427 },
  { name: "준준상점 홈", views: 8420, activeUsers: 5240, avgEngagementSec: 24, events: 23576, keyEvents: 42 },
  { name: "전체 상품", views: 4180, activeUsers: 2910, avgEngagementSec: 41, events: 14212, keyEvents: 68 },
  { name: "여름 기획전", views: 2480, activeUsers: 1820, avgEngagementSec: 52, events: 8184, keyEvents: 96 },
  { name: "주문 조회", views: 1980, activeUsers: 620, avgEngagementSec: 94, events: 5148, keyEvents: 8 },
  { name: "사이즈 안내", views: 1540, activeUsers: 980, avgEngagementSec: 126, events: 6314, keyEvents: 37 },
  { name: "장바구니", views: 1320, activeUsers: 840, avgEngagementSec: 48, events: 5940, keyEvents: 212 },
  { name: "쿠폰함", views: 340, activeUsers: 88, avgEngagementSec: 112, events: 816, keyEvents: 4 },
];

/** 어느 측정기준을 골라도 같은 조회를 다르게 묶은 것이라 총계는 함께 움직인다 */
const TOTAL_ACTIVE_USERS = 9840;

function factsFor(dimension: string): PageFacts[] {
  return dimension === TITLE_DIMENSION ? BY_TITLE : BY_PATH;
}

/* ===================== 표 ===================== */

/** 기간이 짧아지면 조회수도 그만큼 줄어든 것처럼 보이게 하는 배율 */
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

const dec = (v: number): string => v.toFixed(2);

export const METRIC_COLUMNS: MetricColumn[] = [
  { key: "views", label: "조회수", share: true },
  { key: "activeUsers", label: "활성 사용자", share: true },
  { key: "viewsPerUser", label: "사용자당 조회수", format: dec, totalNote: "평균과 동일" },
  { key: "avgEngagementSec", label: "평균 참여 시간", format: duration, totalNote: "평균과 동일" },
  { key: "events", label: "이벤트 수", share: true },
  { key: "keyEvents", label: "주요 이벤트", share: true },
];

/** 총계 행에서 단순 합계가 뜻이 없는 열은 따로 계산한다 */
function totalsFor(dimension: string, scale: number): Record<string, number> {
  const facts = factsFor(dimension);
  const views = facts.reduce((s, p) => s + p.views, 0);
  const timeWeighted = facts.reduce((s, p) => s + p.avgEngagementSec * p.views, 0) / views;
  return {
    activeUsers: Math.round(TOTAL_ACTIVE_USERS * scale),
    viewsPerUser: views / TOTAL_ACTIVE_USERS,
    avgEngagementSec: timeWeighted,
  };
}

export function buildColumns(dimension: string, range: DateRangeKey): MetricColumn[] {
  const totals = totalsFor(dimension, RANGE_SCALE[range]);
  return METRIC_COLUMNS.map((col) =>
    totals[col.key] !== undefined ? { ...col, total: totals[col.key] } : col
  );
}

export function buildRows(dimension: string, range: DateRangeKey, sortKey: string): TableRow[] {
  const scale = RANGE_SCALE[range];
  const rows: TableRow[] = factsFor(dimension).map((p) => ({
    name: p.name,
    values: {
      views: Math.round(p.views * scale),
      activeUsers: Math.round(p.activeUsers * scale),
      viewsPerUser: p.views / p.activeUsers,
      avgEngagementSec: p.avgEngagementSec,
      events: Math.round(p.events * scale),
      keyEvents: Math.round(p.keyEvents * scale),
    },
  }));
  return [...rows].sort((a, b) => b.values[sortKey] - a.values[sortKey]);
}

/* ===================== 차트 ===================== */

/** 조회수가 많은 다섯 줄만 꺾은선으로 그린다. GA4도 상위 다섯 개까지만 그린다 */
export function buildSeries(dimension: string, range: DateRangeKey): Series[] {
  const days = range === "7d" ? 7 : range === "28d" ? 28 : 90;
  const scale = RANGE_SCALE[range];
  return factsFor(dimension)
    .slice(0, 5)
    .map((p, shade) => {
      const daily = (p.views * scale) / days;
      return {
        name: p.name,
        shade,
        // 요일 주기와 줄마다 다른 위상을 섞어 만든 결정론적 값이다
        points: Array.from({ length: days }, (_, i) => {
          const weekly = Math.sin((i / 7) * Math.PI * 2 + shade * 0.9) * 0.22;
          const drift = ((i / Math.max(days - 1, 1)) - 0.5) * 0.12 * (shade % 2 === 0 ? 1 : -1);
          return Math.round(daily * (1 + weekly + drift));
        }),
      };
    });
}

export function buildBarItems(dimension: string, range: DateRangeKey) {
  const scale = RANGE_SCALE[range];
  return factsFor(dimension)
    .slice(0, 5)
    .map((p, shade) => ({ name: p.name, value: Math.round(p.views * scale), shade }));
}

export function buildXLabels(range: DateRangeKey): string[] {
  const days = range === "7d" ? 7 : range === "28d" ? 28 : 90;
  return [`${days}일 전`, `${Math.round(days / 2)}일 전`, "어제"];
}

/* ===================== 정답 ===================== */

/** 경로로 볼 때 조회수 1위. 제목으로 묶으면 1위가 아니게 된다 */
export const TOP_PATH = "/";

/** 제목으로 묶었을 때 조회수 1위 */
export const TOP_TITLE = "상품 상세";

/** 조회수 1,000을 넘으면서 사용자당 조회수가 가장 높은 줄 */
export const REPEAT_TITLE = "주문 조회";

/** 사용자당 조회수는 가장 높지만 조회수가 적어 판단 근거가 되지 못하는 줄 */
export const THIN_TITLE = "쿠폰함";
