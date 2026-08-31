/**
 * GA4 실시간 대시보드가 주고받는 데이터 모양.
 * 서버(조회)와 클라이언트(렌더) 양쪽에서 쓰므로 서비스 계정 코드와 분리해 둔다.
 */

/** GA4 실시간 보고서가 다루는 시간 창 (분) */
export const REALTIME_WINDOW_MINUTES = 30;

/** 카드 표의 한 줄 */
export interface DimensionRow {
  label: string;
  value: number;
}

/** 카드 하나 분량의 조회 결과 */
export interface RealtimeCard {
  rows: DimensionRow[];
  /** GA4가 돌려준 전체 행 수. 카드 하단 "N개 중 1~M번째" 표기에 쓴다 */
  totalRows: number;
  /** 표시된 행들의 합. 카드의 비율(%) 계산 기준 */
  total: number;
  /** 1위 항목의 분당 추이. 30칸이고 마지막 칸이 방금 1분 */
  topSparkline: number[];
}

export interface RealtimeSnapshot {
  /** 응답을 만든 시각 (ISO) */
  fetchedAt: string;
  /** 지난 30분 활성 사용자 (비중복) */
  activeUsers: number;
  /** 분당 활성 사용자. 마지막 칸이 방금 1분 */
  perMinute: number[];
  devices: RealtimeCard;
  countries: RealtimeCard;
  audiences: RealtimeCard;
  pages: RealtimeCard;
  events: RealtimeCard;
  keyEvents: RealtimeCard;
}

export type RealtimeApiResponse =
  | { ok: true; data: RealtimeSnapshot }
  | { ok: false; error: string };
