/**
 * 교육용 가상 계정 "준준상점"의 보고 ID별 사용자 수.
 *
 * 같은 기간 같은 데이터인데 보고 ID를 무엇으로 두느냐에 따라 사용자 수가 달라진다.
 * 기기 기반은 브라우저마다 다른 사람으로 세기 때문에 가장 크고,
 * 사용자 ID를 섞으면 로그인한 사람의 여러 기기가 한 사람으로 합쳐져 줄어든다.
 *
 * 숫자가 줄었다고 방문이 줄어든 것이 아니라 같은 사람을 겹쳐 세지 않게 된 것이다.
 */

import type { ChoiceOption } from "../../app/Ga4ChoiceAdmin";

export const ACCOUNT_NAME = "준준상점";
export const PROPERTY_NAME = "준준상점 - GA4";
export const SEARCH_HINT = '"보고 ID"을(를) 검색해 보세요';

export const DEVICE_ONLY = "device";
export const OBSERVED = "observed";
export const BLENDED = "blended";

export const CHOICES: ChoiceOption[] = [
  {
    key: BLENDED,
    title: "사용자 ID와 기기 혼합",
    desc: "로그인한 사람은 사용자 ID로, 아닌 사람은 구글 신호 데이터와 기기로 잇습니다. 기기를 넘나드는 사용자를 가장 잘 묶습니다.",
    summary: "9,180명",
  },
  {
    key: OBSERVED,
    title: "관찰된 데이터",
    desc: "사용자 ID와 구글 신호 데이터까지 쓰되 모델링한 데이터는 쓰지 않습니다.",
    summary: "10,240명",
  },
  {
    key: DEVICE_ONLY,
    title: "기기 기반",
    desc: "브라우저에 심은 표시만 씁니다. 같은 사람이 휴대전화와 컴퓨터로 들어오면 두 사람으로 셉니다.",
    summary: "12,480명",
  },
];

/** 시작 상태. 기기 기반으로 두면 사용자 수가 가장 크게 나온다 */
export const START_CHOICE = DEVICE_ONLY;

/** 이 편에서 바꿔 보는 방식 */
export const TARGET_CHOICE = BLENDED;

export function summaryOf(key: string): string {
  return CHOICES.find((c) => c.key === key)?.summary ?? "";
}
