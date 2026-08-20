/**
 * 교육용 가상 계정 "준준상점"의 카디널리티 데이터.
 *
 * 이 편의 함정은 (other) 행이다. 회원 번호처럼 값의 종류가 사람 수만큼 많은 측정기준을
 * 등록해 두면, 표가 값을 다 담지 못하고 나머지를 (other) 한 줄로 묶는다.
 *
 * 기간을 좁히면 그 기간에 나타난 값의 종류가 줄어 (other)도 함께 작아진다.
 * 지난 90일에서는 전체 조회수의 96%가 (other)인데, 지난 7일에서는 그 줄이 아예 사라진다.
 * 데이터가 사라진 것이 아니라 표가 묶는 방식이 달라진 것이다.
 */

import type { DimensionOption, MetricColumn, TableRow } from "../../app/Ga4ReportTable";
import type { DateRangeKey } from "../../app/types";

export const ACCOUNT_NAME = "준준상점";
export const PROPERTY_NAME = "준준상점 - GA4";
export const SEARCH_HINT = '"페이지 및 화면"을(를) 검색해 보세요';

export const PAGE_DIMENSION = "pagePath";
export const MEMBER_DIMENSION = "memberId";

export const DIMENSION_OPTIONS: DimensionOption[] = [
  { key: PAGE_DIMENSION, label: "페이지 경로 및 화면 클래스" },
  { key: MEMBER_DIMENSION, label: "회원 번호" },
];

/** 표에서 나머지를 묶어 보여 주는 줄. GA4가 붙이는 이름 그대로 쓴다 */
export const OTHER_ROW = "(other)";

const comma = (v: number) => v.toLocaleString("ko-KR");

interface Raw {
  name: string;
  views: number;
  /**
   * 활성 사용자. 회원 번호 축에서는 개별 줄이 한 사람이라 늘 1이고,
   * (other)만 묶인 회원 수만큼 커진다.
   */
  users: number;
}

/** 페이지 경로는 값의 종류가 적어 (other)가 생기지 않는다 */
const PAGE_ROWS: Record<DateRangeKey, Raw[]> = {
  "7d": [
    { name: "/", views: 8240, users: 1318 },
    { name: "/product/list", views: 5120, users: 819 },
    { name: "/product/detail", views: 3860, users: 618 },
    { name: "/event/summer", views: 2480, users: 397 },
    { name: "/cart", views: 1240, users: 198 },
  ],
  "28d": [
    { name: "/", views: 31860, users: 5098 },
    { name: "/product/list", views: 19240, users: 3078 },
    { name: "/product/detail", views: 14680, users: 2349 },
    { name: "/event/summer", views: 9420, users: 1507 },
    { name: "/cart", views: 4820, users: 771 },
  ],
  "90d": [
    { name: "/", views: 96420, users: 15427 },
    { name: "/product/list", views: 58240, users: 9318 },
    { name: "/product/detail", views: 44160, users: 7066 },
    { name: "/event/summer", views: 21860, users: 3498 },
    { name: "/cart", views: 14320, users: 2291 },
  ],
};

/**
 * 회원 번호는 사람마다 값이 달라 값의 종류가 폭발한다.
 * 기간이 길수록 나타난 값의 종류가 많아져 (other)의 몫이 커지고,
 * 지난 7일처럼 짧게 끊으면 한도를 넘지 않아 (other)가 아예 생기지 않는다.
 */
const MEMBER_ROWS: Record<DateRangeKey, Raw[]> = {
  "7d": [
    { name: "M-100482", views: 168, users: 1 },
    { name: "M-100377", views: 142, users: 1 },
    { name: "M-100915", views: 126, users: 1 },
    { name: "M-100248", views: 118, users: 1 },
    { name: "M-100633", views: 104, users: 1 },
  ],
  "28d": [
    { name: "M-100482", views: 412, users: 1 },
    { name: "M-100377", views: 386, users: 1 },
    { name: "M-100915", views: 344, users: 1 },
    { name: "M-100248", views: 298, users: 1 },
    { name: OTHER_ROW, views: 18640, users: 7829 },
  ],
  "90d": [
    { name: "M-100482", views: 946, users: 1 },
    { name: "M-100377", views: 884, users: 1 },
    { name: "M-100915", views: 812, users: 1 },
    { name: "M-100248", views: 748, users: 1 },
    { name: OTHER_ROW, views: 79820, users: 33524 },
  ],
};

const TABLE: Record<string, Record<DateRangeKey, Raw[]>> = {
  [PAGE_DIMENSION]: PAGE_ROWS,
  [MEMBER_DIMENSION]: MEMBER_ROWS,
};

export function buildColumns(dimension: string, range: DateRangeKey): MetricColumn[] {
  const rows = TABLE[dimension][range];
  const views = rows.reduce((sum, r) => sum + r.views, 0);
  const users = rows.reduce((sum, r) => sum + r.users, 0);
  return [
    { key: "views", label: "조회수", format: comma, total: views, share: true },
    { key: "users", label: "활성 사용자", format: comma, total: users },
  ];
}

export function buildRows(dimension: string, range: DateRangeKey): TableRow[] {
  return TABLE[dimension][range].map(
    (r): TableRow => ({ name: r.name, values: { views: r.views, users: r.users } })
  );
}

/** (other)가 전체에서 차지하는 비율. 본문에서 쓰는 값과 같아야 한다 */
export function otherShare(range: DateRangeKey): number {
  const rows = MEMBER_ROWS[range];
  const total = rows.reduce((sum, r) => sum + r.views, 0);
  const other = rows.find((r) => r.name === OTHER_ROW)?.views ?? 0;
  return total === 0 ? 0 : (other / total) * 100;
}

/** 오답 자리. 개별 회원 줄은 값이 작아 문제로 보이지 않는다 */
export const DECOY_ROW = "M-100482";
