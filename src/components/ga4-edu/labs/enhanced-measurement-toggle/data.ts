/**
 * 교육용 가상 계정 "준준상점"의 웹 스트림과 향상된 측정 항목.
 *
 * 수집량을 함께 적어 둔 이유가 있다. 스크롤은 지난 28일에 34,820회 들어왔는데,
 * 이 항목을 해제하면 그 뒤로 이 수가 0이 된다. 설정 하나가 데이터에 남기는 자국을
 * 숫자로 보게 하려고 목록에 그대로 놓았다.
 *
 * 페이지 조회는 GA4에서도 해제할 수 없어서 토글 대신 항상 수집으로 표시한다.
 */

import type { MeasuredEvent } from "../../app/Ga4StreamAdmin";

export const ACCOUNT_NAME = "준준상점";
export const PROPERTY_NAME = "준준상점 - GA4";
export const SEARCH_HINT = '"데이터 스트림"을(를) 검색해 보세요';

export const STREAM_NAME = "준준상점 웹";
export const STREAM_URL = "https://junjun.example.com";
export const MEASUREMENT_ID = "G-8QK2R7VLDM";

export const MEASURED_EVENTS: MeasuredEvent[] = [
  { label: "페이지 조회", event: "page_view", locked: true, count: 128640 },
  { label: "스크롤", event: "scroll", count: 34820 },
  { label: "이탈 클릭", event: "click", count: 6240 },
  { label: "사이트 검색", event: "view_search_results", count: 4180 },
  { label: "동영상 참여", event: "video_start", count: 1260 },
  { label: "파일 다운로드", event: "file_download", count: 840 },
  { label: "양식 상호작용", event: "form_start", count: 2960 },
];

/** 이 편에서 해제했다가 되돌리는 항목 */
export const TARGET_EVENT = "scroll";
export const TARGET_LABEL = "스크롤";

/** 해제 전 지난 28일 수집량. 본문에서 쓰는 수치와 같아야 한다 */
export const TARGET_COUNT =
  MEASURED_EVENTS.find((e) => e.event === TARGET_EVENT)?.count ?? 0;
