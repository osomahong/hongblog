/**
 * 교육용 가상 계정 "준준상점"의 접속 기준 리텐션 데이터.
 *
 * 이 편에서 보게 하려는 것은 두 가지다.
 * 하나는 잔존율이 0주차에서 1주차로 넘어갈 때 가장 크게 떨어진다는 것이고,
 * 다른 하나는 7월 28일 코호트만 1주차가 13.2%로 다른 주보다 눈에 띄게 낮다는 것이다.
 *
 * 연속 계산을 사용 설정하면 숫자가 낮아진다. 표준은 그 기간에 한 번이라도 왔으면 세지만,
 * 연속은 앞 기간까지 빠짐없이 온 사람만 세기 때문이다.
 */

import type { CohortRow, CohortGranularity } from "../../app/Ga4Cohort";

export const ACCOUNT_NAME = "준준상점";
export const PROPERTY_NAME = "준준상점 - GA4";
export const SEARCH_HINT = '"동질 집단"을(를) 검색해 보세요';
export const EXPLORATION_NAME = "접속 기준 리텐션";
export const DATE_LABEL = "6월 16일~2026년 8월 13일";

export const COLUMN_LABELS: Record<CohortGranularity, string[]> = {
  daily: ["0일차", "1일차", "2일차", "3일차", "4일차"],
  weekly: ["0주차", "1주차", "2주차", "3주차", "4주차"],
  monthly: ["0개월차", "1개월차", "2개월차"],
};

/** 표준 계산. 그 기간에 한 번이라도 다시 온 사람을 센다 */
const STANDARD: Record<CohortGranularity, CohortRow[]> = {
  daily: [
    { label: "8월 13일", values: [412, 96, 62, 44, 34] },
    { label: "8월 12일", values: [438, 104, 68, 48, 36] },
    { label: "8월 11일", values: [396, 88, 56, 40, 30] },
    { label: "8월 10일", values: [368, 82, 54, 38, 28] },
    { label: "8월 9일", values: [352, 76, 48, 34, 26] },
  ],
  weekly: [
    { label: "8월 11일~8월 17일", values: [2140, 412, 268, 196, 152] },
    { label: "8월 4일~8월 10일", values: [1980, 386, 244, 178, 138] },
    { label: "7월 28일~8월 3일", values: [2260, 298, 186, 138, 108] },
    { label: "7월 21일~7월 27일", values: [2040, 402, 256, 188, 146] },
    { label: "7월 14일~7월 20일", values: [1860, 372, 238, 174, 136] },
  ],
  monthly: [
    { label: "2026년 8월", values: [6820, 1240, 742] },
    { label: "2026년 7월", values: [7180, 1286, 768] },
    { label: "2026년 6월", values: [6440, 1172, 704] },
  ],
};

/**
 * 연속 계산. 앞 기간까지 빠짐없이 온 사람만 세므로 표준보다 작다.
 * 0주차는 코호트 크기라 두 방식이 같다.
 */
const ROLLING: Record<CohortGranularity, CohortRow[]> = {
  daily: STANDARD.daily.map((r) => ({
    label: r.label,
    values: r.values.map((v, i) => (i === 0 ? v : Math.round(v * (0.62 - i * 0.06)))),
  })),
  weekly: STANDARD.weekly.map((r) => ({
    label: r.label,
    values: r.values.map((v, i) => (i === 0 ? v : Math.round(v * (0.64 - i * 0.07)))),
  })),
  monthly: STANDARD.monthly.map((r) => ({
    label: r.label,
    values: r.values.map((v, i) => (i === 0 ? v : Math.round(v * (0.66 - i * 0.08)))),
  })),
};

export function rowsFor(granularity: CohortGranularity, rolling: boolean): CohortRow[] {
  return (rolling ? ROLLING : STANDARD)[granularity];
}

/** 잔존율이 가장 크게 떨어지는 열. 0주차에서 1주차로 넘어가는 구간이다 */
export const BIGGEST_DROP_COLUMN = 1;

/** 유독 낮은 코호트. 본문에서 쓰는 값과 같아야 한다 */
export const WEAK_COHORT = "7월 28일~8월 3일";
