/**
 * 교육용 가상 계정 "준준상점"의 세그먼트 범위별 결과.
 *
 * 이 편의 핵심은 같은 조건에 범위만 바꿨을 때 숫자가 달라지는 것이다.
 * 조건은 셋 다 "기기 카테고리가 mobile"로 같다.
 *
 * 세션 세그먼트는 모바일로 일어난 세션만 남긴다. 사용자 세그먼트는 모바일을 한 번이라도
 * 쓴 사람을 남기므로, 그 사람이 나중에 데스크톱으로 들어온 세션까지 함께 딸려 온다.
 * 그래서 사용자 세그먼트의 세션수가 세션 세그먼트보다 크다.
 */

import type { PivotMetric, PivotValues } from "../../app/Ga4PivotTable";
import type { SegmentScope } from "../../app/Ga4SegmentBuilder";

export const ACCOUNT_NAME = "준준상점";
export const PROPERTY_NAME = "준준상점 - GA4";
export const SEARCH_HINT = '"세그먼트"을(를) 검색해 보세요';
export const EXPLORATION_NAME = "모바일 사용자 비교";
export const DATE_LABEL = "7월 17일~2026년 8월 13일";

/** 세 범위가 공유하는 조건 */
export const CONDITION_LABEL = "기기 카테고리가 mobile과 정확히 일치";

export const SEGMENT_NAME: Record<SegmentScope, string> = {
  user: "모바일 사용자",
  session: "모바일 세션",
  event: "모바일 이벤트",
};

export function nameOf(scope: SegmentScope): string {
  return SEGMENT_NAME[scope];
}

const comma = (v: number) => v.toLocaleString("ko-KR");

const METRIC_SPEC: Record<string, PivotMetric> = {
  sessions: { key: "sessions", label: "세션수", format: comma },
  totalUsers: { key: "totalUsers", label: "총 사용자", format: comma },
  eventCount: { key: "eventCount", label: "이벤트 수", format: comma },
};

export function buildMetrics(keys: string[]): PivotMetric[] {
  return keys.map((k) => METRIC_SPEC[k]).filter(Boolean);
}

/**
 * 세그먼트별 값.
 * 모바일 사용자 9,180회 가운데 1,940회는 그 사람이 데스크톱으로 들어온 세션이다.
 */
const VALUES: Record<string, PivotValues> = {
  "모든 사용자": { sessions: 12480, totalUsers: 8640, eventCount: 74880 },
  "모바일 사용자": { sessions: 9180, totalUsers: 5920, eventCount: 52260 },
  "모바일 세션": { sessions: 7240, totalUsers: 5920, eventCount: 41360 },
  "모바일 이벤트": { sessions: 7240, totalUsers: 5920, eventCount: 38940 },
};

export function cellValues(row: string): PivotValues {
  return VALUES[row] ?? { sessions: 0, totalUsers: 0, eventCount: 0 };
}

export function totalValues(): PivotValues {
  return VALUES["모든 사용자"];
}

/** 표에 놓이는 줄. 모든 사용자는 GA4가 늘 함께 그려 주는 기준선이다 */
export function rowsFor(segments: string[]): string[] {
  return ["모든 사용자", ...segments];
}

/** 세션수가 더 많이 남는 쪽. 사용자 범위가 넓기 때문이다 */
export const WIDER_SEGMENT = SEGMENT_NAME.user;

/** 오답 후보. 조건은 같지만 범위가 좁아 세션수가 적다 */
export const NARROWER_SEGMENT = SEGMENT_NAME.session;

/** 두 세그먼트의 세션수 차이. 본문에서 쓰는 수치와 같아야 한다 */
export const SESSION_GAP =
  VALUES[SEGMENT_NAME.user].sessions - VALUES[SEGMENT_NAME.session].sessions;
