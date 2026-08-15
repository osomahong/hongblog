/**
 * GA4 앱 재현에 쓰는 상태와 튜토리얼 스텝 타입.
 *
 * 학습자는 GA4와 같은 화면을 직접 조작하고, 그 조작이 이 상태를 바꾼다.
 * 튜토리얼은 상태가 스텝의 조건을 만족하는 순간 다음 스텝으로 넘어간다.
 * 화면에는 목표 한 줄과 다음에 누를 지점 표시 말고 다른 안내를 두지 않는다.
 */

export type DateRangeKey = "7d" | "28d" | "90d";

export const DATE_RANGE_LABEL: Record<DateRangeKey, string> = {
  "7d": "지난 7일",
  "28d": "지난 28일",
  "90d": "지난 90일",
};

/** 기간 칩 옆에 붙는 실제 날짜 구간. GA4 화면과 같은 형태로 보여 준다 */
export const DATE_RANGE_SUB: Record<DateRangeKey, string> = {
  "7d": "8월 7일~2026년 8월 13일",
  "28d": "7월 17일~2026년 8월 13일",
  "90d": "5월 16일~2026년 8월 13일",
};

/** 기간 선택기의 비교 대상. GA4 화면의 이름을 그대로 쓴다 */
export type CompareBase = "previous" | "yearAgo";

export const COMPARE_BASE_LABEL: Record<CompareBase, string> = {
  previous: "이전 기간",
  yearAgo: "이전 연도",
};

/** 비교 대상으로 잡히는 실제 날짜 구간 */
export const COMPARE_BASE_SUB: Record<CompareBase, Record<DateRangeKey, string>> = {
  previous: {
    "7d": "7월 31일~2026년 8월 6일",
    "28d": "6월 19일~2026년 7월 16일",
    "90d": "2월 15일~2026년 5월 15일",
  },
  yearAgo: {
    "7d": "2025년 8월 7일~2025년 8월 13일",
    "28d": "2025년 7월 17일~2025년 8월 13일",
    "90d": "2025년 5월 16일~2025년 8월 13일",
  },
};

export interface Ga4State {
  /** 열려 있는 보고서 식별자 */
  report: string;
  dateRange: DateRangeKey;
  /** 표의 첫 열에 놓인 측정기준 */
  dimension: string;
  /** 정렬 기준 측정항목 */
  sortKey: string;
  sortDir: "desc" | "asc";
  /** 학습자가 고른 표의 행 */
  selectedRow: string | null;
  /** 열려 있는 드롭다운 */
  openMenu: "date" | "dimension" | null;
  /**
   * 아래 둘은 보고서 맞춤설정을 다루는 편에서만 쓴다.
   * 쓰지 않는 편의 상태를 넓히지 않으려고 선택 항목으로 둔다.
   */
  customizeOpen?: boolean;
  /** 맞춤설정에서 더한 측정항목 키. 표의 오른쪽 끝에 그 순서대로 붙는다 */
  addedMetrics?: string[];

  /** 아래 넷은 비교를 다루는 편에서만 쓴다 */
  comparisonOpen?: boolean;
  comparisonDimension?: string | null;
  comparisonValue?: string | null;
  /** 적용을 눌러 표가 두 벌로 나뉜 상태인지 */
  comparisonApplied?: boolean;
  /** 비교 만들기 패널에서 펼쳐진 목록 */
  comparisonList?: "dimension" | "value" | null;

  /** 아래 둘은 보조 측정기준을 붙이는 편에서만 쓴다 */
  secondaryDimension?: string | null;
  secondaryMenuOpen?: boolean;

  /**
   * 아래 다섯은 기간 선택기에서 기간 비교를 거는 편에서만 쓴다.
   * 선택기 안에서 고르는 중인 값은 draft로 두고, 적용을 눌러야 dateRange와 appliedBase에 옮긴다.
   */
  datePanelOpen?: boolean;
  draftRange?: DateRangeKey;
  draftCompare?: boolean;
  draftBase?: CompareBase;
  /** 비교 대상 목록이 펼쳐져 있는지 */
  baseListOpen?: boolean;
  /** 표에 반영된 비교 대상. null이면 비교를 걸지 않은 상태 */
  appliedBase?: CompareBase | null;

  /** 아래 다섯은 필터를 거는 편에서만 쓴다 */
  filterOpen?: boolean;
  filterDimension?: string | null;
  filterValue?: string | null;
  filterApplied?: boolean;
  filterList?: "dimension" | "value" | null;
}

export const INITIAL_STATE: Ga4State = {
  report: "reports-overview",
  dateRange: "7d",
  dimension: "sessionDefaultChannelGroup",
  sortKey: "sessions",
  sortDir: "desc",
  selectedRow: null,
  openMenu: null,
};

/* ===================== 탐색 화면 상태 ===================== */

/** 탐색에서 지금 열려 있는 화면. 홈은 템플릿 목록, 자유 형식은 작업 화면이다 */
export type ExploreScreen = "home" | "free-form";

/** 변수 목록에서 집어 든 항목 */
export interface HeldVariable {
  kind: "dimension" | "metric";
  key: string;
}

export interface Ga4ExploreState {
  screen: ExploreScreen;
  /** 탭 설정의 행에 놓인 측정기준 키 */
  rows: string[];
  /** 탭 설정의 열에 놓인 측정기준 키 */
  columns: string[];
  /** 탭 설정의 값에 놓인 측정항목 키 */
  values: string[];
  /**
   * 끌어다 놓는 중이거나 눌러서 집어 든 변수.
   * GA4는 끌어다 놓기로만 배치하지만, 놓을 자리를 두 번 눌러도 같은 결과가 되게 열어 둔다.
   */
  held: HeldVariable | null;
  /** 학습자가 고른 표의 행 */
  selectedRow: string | null;
}

export const INITIAL_EXPLORE_STATE: Ga4ExploreState = {
  screen: "home",
  rows: [],
  columns: [],
  values: ["sessions"],
  held: null,
  selectedRow: null,
};

/* ===================== 스텝 ===================== */

export interface TourStep<S = Ga4State> {
  /** GA 이벤트에 남는 식별자 */
  id: string;
  /** 하단 띠에 뜨는 목표 한 줄. 설명이 아니라 지시문이다 */
  instruction: string;
  /**
   * 링을 그릴 요소 이름. null이면 표시하지 않는다.
   * 드롭다운처럼 목표 지점이 상태에 따라 바뀌는 스텝은 함수로 준다.
   */
  ring: string | null | ((s: S) => string | null);
  /** 이 조건이 참이 되면 다음 스텝으로 넘어간다 */
  isDone: (s: S) => boolean;
  /** 판단 스텝에서 잘못 고른 상태. 하단 띠 문구만 잠깐 바뀐다 */
  isMiss?: (s: S) => boolean;
  /** 잘못 골랐을 때 띄우는 한 줄 */
  missText?: string;
  /** 스텝을 시작할 때 상태를 되돌릴 부분. 판단 스텝에서 선택을 비울 때 쓴다 */
  reset?: Partial<S>;
}
