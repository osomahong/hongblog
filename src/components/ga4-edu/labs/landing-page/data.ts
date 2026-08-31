/**
 * 교육용 가상 계정 "준준상점"의 방문 페이지 데이터. 채널 비교를 걸고 읽는 편에 쓴다.
 *
 * 함정은 광고 도착 화면이다. 전체로 보면 /event/summer가 세션 2위에 주요 이벤트 96회로
 * 나쁘지 않아 보인다. 그런데 Paid Search만 떼어 보면 세션 3,180회에 주요 이벤트가 11회뿐이다.
 * 같은 채널에서 /product/detail/1042는 세션이 640회로 다섯 배 적은데 주요 이벤트는 68회다.
 * 전체 표만 보면 이 차이가 드러나지 않는다.
 *
 * Paid Search 세션 합계 5,610은 초급 1번 트래픽 획득의 값과 같게 맞췄다.
 */

import type { DateRangeKey } from "../../app/types";
import type { MetricColumn, TableRow, DimensionOption } from "../../app/Ga4ReportTable";
import type { ComparisonChoice } from "../../app/Ga4ComparisonPanel";

export const ACCOUNT_NAME = "준준상점";
export const PROPERTY_NAME = "준준상점 - GA4";
export const SEARCH_HINT = '"방문 페이지"을(를) 검색해 보세요';

export const ALL_USERS = "모든 사용자";
export const PAID_SEARCH = "Paid Search";

export const DIMENSION_OPTIONS: DimensionOption[] = [
  { key: "landingPage", label: "방문 페이지" },
  { key: "landingPageQuery", label: "방문 페이지 + 쿼리 문자열" },
];

/** 비교 만들기에서 고를 수 있는 측정기준 */
export const COMPARISON_DIMENSIONS: ComparisonChoice[] = [
  { key: "sessionDefaultChannelGroup", label: "세션 기본 채널 그룹" },
  { key: "deviceCategory", label: "기기 카테고리" },
  { key: "country", label: "국가" },
];

export const COMPARISON_VALUES: Record<string, string[]> = {
  sessionDefaultChannelGroup: [
    "Organic Search",
    "Direct",
    PAID_SEARCH,
    "Referral",
    "Organic Social",
  ],
  deviceCategory: ["desktop", "mobile", "tablet"],
  country: ["대한민국", "미국", "일본"],
};

/* ===================== 데모 데이터 ===================== */

interface PageFacts {
  name: string;
  /** 모든 사용자 기준 */
  sessions: number;
  keyEvents: number;
  avgEngagementSec: number;
  /** Paid Search로 들어온 세션만 */
  paidSessions: number;
  paidKeyEvents: number;
  paidAvgEngagementSec: number;
}

const PAGES: PageFacts[] = [
  { name: "/", sessions: 8420, keyEvents: 42, avgEngagementSec: 68, paidSessions: 620, paidKeyEvents: 2, paidAvgEngagementSec: 41 },
  // 광고가 가장 많이 보내는 도착 화면인데 주요 이벤트가 거의 없다. 다섯 번째 스텝의 정답
  { name: "/event/summer", sessions: 5930, keyEvents: 96, avgEngagementSec: 44, paidSessions: 3180, paidKeyEvents: 11, paidAvgEngagementSec: 22 },
  { name: "/product/list", sessions: 4010, keyEvents: 68, avgEngagementSec: 51, paidSessions: 980, paidKeyEvents: 14, paidAvgEngagementSec: 47 },
  { name: "/order/track", sessions: 3180, keyEvents: 8, avgEngagementSec: 94, paidSessions: 60, paidKeyEvents: 0, paidAvgEngagementSec: 88 },
  // 광고로 들어온 세션은 적지만 주요 이벤트가 가장 많다. 마지막 스텝의 정답
  { name: "/product/detail/1042", sessions: 2180, keyEvents: 154, avgEngagementSec: 112, paidSessions: 640, paidKeyEvents: 68, paidAvgEngagementSec: 126 },
  { name: "/guide/size", sessions: 1540, keyEvents: 37, avgEngagementSec: 126, paidSessions: 130, paidKeyEvents: 4, paidAvgEngagementSec: 118 },
];

/* ===================== 표 ===================== */

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

const dec = (v: number): string => v.toFixed(3);

export const METRIC_COLUMNS: MetricColumn[] = [
  { key: "sessions", label: "세션수", share: true },
  { key: "keyEvents", label: "주요 이벤트", share: true },
  { key: "keyEventsPerSession", label: "세션당 주요 이벤트", format: dec, totalNote: "평균과 동일" },
  { key: "avgEngagementSec", label: "세션당 평균 참여 시간", format: duration, totalNote: "평균과 동일" },
];

/**
 * 합계 줄에 찍는 값.
 * 비교를 걸어도 합계는 모든 사용자 기준을 그대로 둔다. 실제 GA4 화면과 같다.
 * 그래서 세션수와 주요 이벤트도 여기서 정해 준다. 줄을 그냥 더하면 두 벌이 겹쳐 두 배가 된다.
 */
function totalsFor(range: DateRangeKey): Record<string, number> {
  const scale = RANGE_SCALE[range];
  const sessions = PAGES.reduce((s, p) => s + p.sessions, 0);
  const keyEvents = PAGES.reduce((s, p) => s + p.keyEvents, 0);
  return {
    sessions: Math.round(sessions * scale),
    keyEvents: Math.round(keyEvents * scale),
    keyEventsPerSession: keyEvents / sessions,
    avgEngagementSec: PAGES.reduce((s, p) => s + p.avgEngagementSec * p.sessions, 0) / sessions,
  };
}

export function buildColumns(range: DateRangeKey): MetricColumn[] {
  const totals = totalsFor(range);
  return METRIC_COLUMNS.map((col) =>
    totals[col.key] !== undefined ? { ...col, total: totals[col.key] } : col
  );
}

/** 고른 줄을 가리키는 식별자. 비교가 걸리면 같은 이름이 두 줄이 되므로 앞에 비교 이름을 붙인다 */
export function rowKey(comparison: string, name: string): string {
  return `${comparison}|${name}`;
}

export function buildRows(range: DateRangeKey, sortKey: string, applied: boolean): TableRow[] {
  const scale = RANGE_SCALE[range];

  const make = (comparison: string, p: PageFacts): TableRow => {
    const paid = comparison === PAID_SEARCH;
    const sessions = paid ? p.paidSessions : p.sessions;
    const keyEvents = paid ? p.paidKeyEvents : p.keyEvents;
    return {
      name: p.name,
      key: rowKey(comparison, p.name),
      comparison,
      values: {
        sessions: Math.round(sessions * scale),
        keyEvents: Math.round(keyEvents * scale),
        keyEventsPerSession: sessions === 0 ? 0 : keyEvents / sessions,
        avgEngagementSec: paid ? p.paidAvgEngagementSec : p.avgEngagementSec,
      },
    };
  };

  const rows = applied
    ? [...PAGES.map((p) => make(ALL_USERS, p)), ...PAGES.map((p) => make(PAID_SEARCH, p))]
    : PAGES.map((p) => make(ALL_USERS, p));

  return [...rows].sort((a, b) => b.values[sortKey] - a.values[sortKey]);
}

/* ===================== 정답 ===================== */

/** Paid Search 세션이 가장 많은 도착 화면 */
export const PAID_TOP_PAGE = "/event/summer";

/** Paid Search 세션은 적지만 주요 이벤트가 가장 많은 도착 화면 */
export const PAID_BEST_PAGE = "/product/detail/1042";
