/**
 * 교육용 가상 계정 "준준상점"의 빅쿼리 내보내기 설정.
 *
 * 일일 내보내기와 스트리밍은 값이 도착하는 시점과 표 이름이 다르다.
 * 일일은 하루가 끝난 뒤 events_20260813 같은 표로 한 번에 들어오고,
 * 스트리밍은 events_intraday_20260813 표로 몇 분 안에 계속 쌓인다.
 *
 * 두 방식은 함께 쓸 수 있고, 스트리밍만 비용이 따로 붙는다.
 */

import type { ChoiceOption } from "../../app/Ga4ChoiceAdmin";

export const ACCOUNT_NAME = "준준상점";
export const PROPERTY_NAME = "준준상점 - GA4";
export const SEARCH_HINT = '"BigQuery"을(를) 검색해 보세요';

export const DAILY = "daily";
export const STREAMING = "streaming";

export const CHOICES: ChoiceOption[] = [
  {
    key: DAILY,
    title: "일일 내보내기",
    desc: "하루가 끝난 뒤 그날 데이터를 한 번에 보냅니다. 다음 날 오전에 들어오고 추가 비용이 없습니다.",
    summary: "events_20260813",
  },
  {
    key: STREAMING,
    title: "스트리밍 내보내기",
    desc: "이벤트가 들어오는 대로 몇 분 안에 보냅니다. 실시간 확인이 필요할 때 쓰고 별도 비용이 붙습니다.",
    summary: "events_intraday_20260813",
  },
];

export const START_CHOICE = DAILY;
export const TARGET_CHOICE = STREAMING;

export function tableOf(key: string): string {
  return CHOICES.find((c) => c.key === key)?.summary ?? "";
}
