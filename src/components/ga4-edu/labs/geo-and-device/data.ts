/**
 * 교육용 가상 계정 "준준상점"의 사용자 속성과 기술 보고서 데이터.
 *
 * 이 편은 보고서 두 개를 오가는 것이 목표다. 사용자 속성에서 지역을 보고,
 * 기술에서 기기와 브라우저를 본다.
 *
 * 함정은 평균 뒤에 가려진 조합이다. 기기로만 보면 mobile 참여율 49.20%가 무난해
 * 보이는데, 브라우저로 바꾸면 그 안에 21.40%짜리가 섞여 있다. 특정 브라우저에서
 * 화면이 깨지고 있다는 신호다.
 *
 * 28일 세션 합계 27,157은 초급 1번, 7번, 9번과 같은 값으로 맞췄다.
 */

import type { MetricColumn, TableRow, DimensionOption } from "../../app/Ga4ReportTable";

export const ACCOUNT_NAME = "준준상점";
export const PROPERTY_NAME = "준준상점 - GA4";
export const SEARCH_HINT = '"사용자 속성"을(를) 검색해 보세요';

/** 사용자 속성 보고서에서 고를 수 있는 측정기준 */
export const GEO_DIMENSIONS: DimensionOption[] = [
  { key: "country", label: "국가" },
  { key: "city", label: "도시" },
];

/** 기술 보고서에서 고를 수 있는 측정기준 */
export const TECH_DIMENSIONS: DimensionOption[] = [
  { key: "deviceCategory", label: "기기 카테고리" },
  { key: "browser", label: "브라우저" },
  { key: "os", label: "운영체제" },
];

export const DEVICE_DIMENSION = "deviceCategory";
export const BROWSER_DIMENSION = "browser";

interface RowFacts {
  name: string;
  users: number;
  sessions: number;
  engagementRate: number;
  keyEvents: number;
}

const COUNTRIES: RowFacts[] = [
  { name: "대한민국", users: 8940, sessions: 24120, engagementRate: 0.5564, keyEvents: 861 },
  { name: "미국", users: 420, sessions: 1180, engagementRate: 0.2210, keyEvents: 21 },
  // 세션은 900회를 넘는데 주요 이벤트가 하나도 없다. 세 번째 스텝의 정답
  { name: "베트남", users: 240, sessions: 980, engagementRate: 0.0840, keyEvents: 0 },
  { name: "일본", users: 150, sessions: 520, engagementRate: 0.4460, keyEvents: 8 },
  { name: "인도", users: 90, sessions: 357, engagementRate: 0.1120, keyEvents: 4 },
];

const CITIES: RowFacts[] = [
  { name: "서울", users: 5120, sessions: 14060, engagementRate: 0.5202, keyEvents: 520 },
  { name: "경기", users: 2180, sessions: 5840, engagementRate: 0.5320, keyEvents: 198 },
  { name: "부산", users: 780, sessions: 2010, engagementRate: 0.5180, keyEvents: 71 },
  { name: "(not set)", users: 860, sessions: 2210, engagementRate: 0.4870, keyEvents: 72 },
  { name: "그 밖", users: 900, sessions: 3037, engagementRate: 0.4930, keyEvents: 33 },
];

const DEVICES: RowFacts[] = [
  { name: "mobile", users: 6980, sessions: 17855, engagementRate: 0.4920, keyEvents: 512 },
  { name: "desktop", users: 2410, sessions: 8140, engagementRate: 0.5860, keyEvents: 361 },
  { name: "tablet", users: 450, sessions: 1162, engagementRate: 0.4134, keyEvents: 21 },
];

const BROWSERS: RowFacts[] = [
  { name: "Chrome", users: 4980, sessions: 14280, engagementRate: 0.5968, keyEvents: 528 },
  { name: "Safari", users: 2870, sessions: 7940, engagementRate: 0.5230, keyEvents: 289 },
  // 모바일에서 많이 쓰는 브라우저인데 참여율이 모바일 평균의 절반에 못 미친다.
  // 마지막 스텝의 정답
  { name: "Samsung Internet", users: 1140, sessions: 3110, engagementRate: 0.2140, keyEvents: 44 },
  { name: "Edge", users: 620, sessions: 1180, engagementRate: 0.5180, keyEvents: 32 },
  { name: "Whale", users: 230, sessions: 647, engagementRate: 0.1290, keyEvents: 1 },
];

const OPERATING_SYSTEMS: RowFacts[] = [
  { name: "Android", users: 4520, sessions: 12400, engagementRate: 0.4660, keyEvents: 336 },
  { name: "iOS", users: 2510, sessions: 6940, engagementRate: 0.5310, keyEvents: 262 },
  { name: "Windows", users: 2180, sessions: 5820, engagementRate: 0.5940, keyEvents: 248 },
  { name: "Macintosh", users: 540, sessions: 1640, engagementRate: 0.6120, keyEvents: 45 },
  { name: "그 밖", users: 90, sessions: 357, engagementRate: 0.3100, keyEvents: 3 },
];

const SETS: Record<string, RowFacts[]> = {
  country: COUNTRIES,
  city: CITIES,
  deviceCategory: DEVICES,
  browser: BROWSERS,
  os: OPERATING_SYSTEMS,
};

const pct = (v: number): string => `${(v * 100).toFixed(2)}%`;

export const METRIC_COLUMNS: MetricColumn[] = [
  { key: "users", label: "총 사용자", share: true },
  { key: "sessions", label: "세션수", share: true },
  { key: "engagementRate", label: "참여율", format: pct, totalNote: "평균과 동일" },
  { key: "keyEvents", label: "주요 이벤트", share: true },
];

export function buildColumns(dimension: string): MetricColumn[] {
  const set = SETS[dimension] ?? COUNTRIES;
  const sessions = set.reduce((s, r) => s + r.sessions, 0);
  const engaged = set.reduce((s, r) => s + r.sessions * r.engagementRate, 0);
  // 총 사용자는 줄마다 겹칠 수 있어 더하지 않는다. 실제 GA4도 중복을 뺀 값을 쓴다
  return METRIC_COLUMNS.map((col) => {
    if (col.key === "engagementRate") return { ...col, total: engaged / sessions };
    if (col.key === "users") return { ...col, total: 9840, totalNote: "중복을 뺀 값" };
    return col;
  });
}

export function buildRows(dimension: string, sortKey: string): TableRow[] {
  const set = SETS[dimension] ?? COUNTRIES;
  const rows: TableRow[] = set.map((r) => ({
    name: r.name,
    values: {
      users: r.users,
      sessions: r.sessions,
      engagementRate: r.engagementRate,
      keyEvents: r.keyEvents,
    },
  }));
  return [...rows].sort((a, b) => b.values[sortKey] - a.values[sortKey]);
}

/* ===================== 정답 ===================== */

/** 세션수가 가장 많은 국가 */
export const TOP_COUNTRY = "대한민국";

/** 세션은 많은데 주요 이벤트가 하나도 없는 국가 */
export const NO_KEY_EVENT_COUNTRY = "베트남";

/** 세션수가 가장 많은 기기 */
export const TOP_DEVICE = "mobile";

/** 모바일 평균을 크게 밑도는 브라우저 */
export const BROKEN_BROWSER = "Samsung Internet";

/** 안내문에 쓰는 값. 화면에 찍히는 값과 같은 자리에서 만든다 */
const find = (set: RowFacts[], name: string): RowFacts => set.find((r) => r.name === name)!;
const comma = (v: number): string => v.toLocaleString("ko-KR");

export const FACTS = {
  vietnamSessions: comma(find(COUNTRIES, "베트남").sessions),
  vietnamRate: pct(find(COUNTRIES, "베트남").engagementRate),
  mobileRate: pct(find(DEVICES, "mobile").engagementRate),
  mobileSessions: comma(find(DEVICES, "mobile").sessions),
  samsungSessions: comma(find(BROWSERS, "Samsung Internet").sessions),
  samsungRate: pct(find(BROWSERS, "Samsung Internet").engagementRate),
  samsungKeyEvents: comma(find(BROWSERS, "Samsung Internet").keyEvents),
  whaleSessions: comma(find(BROWSERS, "Whale").sessions),
  whaleRate: pct(find(BROWSERS, "Whale").engagementRate),
  chromeRate: pct(find(BROWSERS, "Chrome").engagementRate),
};
