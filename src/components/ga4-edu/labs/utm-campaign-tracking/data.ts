/**
 * 교육용 가상 계정 "준준상점"의 캠페인 표기 흔들림 데이터.
 *
 * 이 편의 함정은 한 캠페인이 표기 차이만으로 네 줄로 나뉘어 있다는 것이다.
 * summer_sale, Summer_Sale, summer sale, SUMMER_SALE을 더하면 5,950회로 가장 큰 캠페인인데,
 * 표에서는 3,240회짜리 한 줄로만 보여 두 번째 캠페인보다 못한 것처럼 읽힌다.
 *
 * 소스 매체 쪽에도 함정을 하나 뒀다. naver / 네이버검색은 매체 값이 GA4가 아는 표준값이
 * 아니라서 기본 채널 그룹이 유료 검색으로 묶어 주지 않는다.
 */

import type { DimensionOption, MetricColumn, TableRow } from "../../app/Ga4ReportTable";

export const ACCOUNT_NAME = "준준상점";
export const PROPERTY_NAME = "준준상점 - GA4";
export const SEARCH_HINT = '"트래픽 획득"을(를) 검색해 보세요';

export const CAMPAIGN_DIMENSION = "sessionCampaign";
export const SOURCE_DIMENSION = "sessionSourceMedium";
export const CHANNEL_DIMENSION = "sessionDefaultChannelGroup";

export const DIMENSION_OPTIONS: DimensionOption[] = [
  { key: CHANNEL_DIMENSION, label: "세션 기본 채널 그룹" },
  { key: SOURCE_DIMENSION, label: "세션 소스/매체" },
  { key: CAMPAIGN_DIMENSION, label: "세션 캠페인" },
];

const comma = (v: number) => v.toLocaleString("ko-KR");
const pct = (v: number) => `${v.toFixed(2)}%`;

interface Raw {
  sessions: number;
  /** 참여율 (퍼센트) */
  rate: number;
}

/** 세션 기본 채널 그룹. 시작 화면에서 보이는 축이다 */
const BY_CHANNEL: Record<string, Raw> = {
  "Organic Search": { sessions: 11600, rate: 58.2 },
  Direct: { sessions: 4960, rate: 46.4 },
  "Paid Search": { sessions: 3240, rate: 61.8 },
  "Organic Social": { sessions: 1860, rate: 39.7 },
  Unassigned: { sessions: 1640, rate: 52.1 },
  Email: { sessions: 1120, rate: 64.3 },
};

/** 세션 소스/매체. 네이버 유료 유입의 매체 값이 표준값에서 벗어나 있다 */
const BY_SOURCE: Record<string, Raw> = {
  "google / organic": { sessions: 8420, rate: 59.1 },
  "(direct) / (none)": { sessions: 4960, rate: 46.4 },
  "google / cpc": { sessions: 3240, rate: 61.8 },
  "naver / organic": { sessions: 3180, rate: 56.0 },
  "instagram / social": { sessions: 1860, rate: 39.7 },
  "naver / 네이버검색": { sessions: 1640, rate: 52.1 },
  "stibee / email": { sessions: 1120, rate: 64.3 },
};

/** 세션 캠페인. 여름 기획전 하나가 표기 차이로 네 줄에 나뉘어 있다 */
const BY_CAMPAIGN: Record<string, Raw> = {
  "(not set)": { sessions: 18420, rate: 53.4 },
  summer_sale: { sessions: 3240, rate: 61.8 },
  Summer_Sale: { sessions: 1860, rate: 60.4 },
  newsletter_08: { sessions: 1120, rate: 64.3 },
  "summer sale": { sessions: 640, rate: 59.2 },
  SUMMER_SALE: { sessions: 210, rate: 58.8 },
};

const TABLE: Record<string, Record<string, Raw>> = {
  [CHANNEL_DIMENSION]: BY_CHANNEL,
  [SOURCE_DIMENSION]: BY_SOURCE,
  [CAMPAIGN_DIMENSION]: BY_CAMPAIGN,
};

export function buildColumns(dimension: string): MetricColumn[] {
  const rows = Object.values(TABLE[dimension] ?? {});
  const sessions = rows.reduce((sum, r) => sum + r.sessions, 0);
  const engaged = rows.reduce((sum, r) => sum + (r.sessions * r.rate) / 100, 0);
  return [
    { key: "sessions", label: "세션수", format: comma, total: sessions, share: true },
    {
      key: "engagementRate",
      label: "참여율",
      format: pct,
      total: sessions === 0 ? 0 : (engaged / sessions) * 100,
      totalNote: "평균과 동일",
    },
  ];
}

export function buildRows(dimension: string, sortKey: string): TableRow[] {
  const table = TABLE[dimension] ?? {};
  return Object.entries(table)
    .map(([name, raw]): TableRow => ({
      name,
      values: { sessions: raw.sessions, engagementRate: raw.rate },
    }))
    .sort((a, b) => b.values[sortKey] - a.values[sortKey]);
}

/** 여름 기획전의 표기 넷을 더한 값. 본문에서 쓰는 수치와 같아야 한다 */
export const SUMMER_VARIANTS = ["summer_sale", "Summer_Sale", "summer sale", "SUMMER_SALE"];
export const SUMMER_TOTAL = SUMMER_VARIANTS.reduce(
  (sum, key) => sum + BY_CAMPAIGN[key].sessions,
  0
);

/** 같은 캠페인인데 대문자 표기로 따로 잡힌 줄. 이 편의 첫 정답 */
export const SPLIT_CAMPAIGN = "Summer_Sale";

/** 표기가 다르지 않은 별개 캠페인. 오답 자리 */
export const DECOY_CAMPAIGN = "newsletter_08";

/** 매체 값이 표준값이 아니어서 채널 분류에서 빠지는 줄 */
export const NONSTANDARD_SOURCE = "naver / 네이버검색";

/** 표준 매체 값을 제대로 쓴 줄. 오답 자리 */
export const DECOY_SOURCE = "google / cpc";
