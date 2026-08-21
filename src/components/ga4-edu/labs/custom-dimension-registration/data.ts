/**
 * 교육용 가상 계정 "준준상점"의 맞춤 정의 화면 데이터.
 *
 * 중급 2번에서 만든 contact_submit이 이야기의 앞 장이다. 문의가 들어오는 것은 세게 됐는데,
 * 어떤 유형의 문의인지 나눠 보려면 inquiry_type 매개변수를 맞춤 측정기준으로 등록해야 한다.
 *
 * 함정은 앞서 누군가 등록해 둔 member_id다. 회원마다 값이 달라 값의 종류가 회원 수만큼
 * 늘어나고, 카디널리티 한도를 높여 다른 보고서에 (other) 줄을 만든다.
 * 학습자가 그 줄을 찾아 보관 처리하는 것이 마지막 미션이다.
 */

import type { CustomDimRow, PickOption } from "../../app/Ga4DefinitionsAdmin";

export const ACCOUNT_NAME = "준준상점";
export const PROPERTY_NAME = "준준상점 - GA4";
export const SEARCH_HINT = '"맞춤 정의"을(를) 검색해 보세요';

/** 시작할 때 이미 등록돼 있는 측정기준 */
export const INITIAL_DIMS: CustomDimRow[] = [
  {
    name: "login_status",
    scope: "이벤트",
    parameter: "login_status",
    description: "로그인 여부",
  },
  // 회원마다 값이 다르다. 카디널리티를 높이는 함정이라 마지막 미션의 정답
  {
    name: "member_id",
    scope: "이벤트",
    parameter: "member_id",
    description: "회원 번호",
  },
  {
    name: "membership_level",
    scope: "사용자",
    parameter: "membership_level",
    description: "멤버십 등급",
  },
];

/** 학습자가 등록하는 측정기준 */
export const NEW_DIM: CustomDimRow = {
  name: "inquiry_type",
  scope: "이벤트",
  parameter: "inquiry_type",
  description: "문의 유형",
};

/** 만들기 패널의 이름 후보 */
export const NAME_OPTIONS: PickOption[] = [
  { key: "inquiry_type", label: "inquiry_type" },
  { key: "form_name", label: "form_name" },
  { key: "button_label", label: "button_label" },
];

/** 만들기 패널의 매개변수 후보. 이미 들어오고 있는 매개변수만 나온다 */
export const PARAM_OPTIONS: PickOption[] = [
  { key: "inquiry_type", label: "inquiry_type" },
  { key: "item_category", label: "item_category" },
  { key: "page_location", label: "page_location" },
];

/* ===================== 정답 ===================== */

/** 등록할 측정기준 이름과 매개변수 */
export const TARGET_NAME = "inquiry_type";
export const TARGET_PARAM = "inquiry_type";

/** 보관 처리해야 할 측정기준 */
export const WRONG_DIM = "member_id";

/** 이벤트 범위 등록 한도 */
const EVENT_SCOPE_LIMIT = 50;

/** 표 위에 적는 사용량. 목록의 이벤트 범위 줄 수에 다른 화면에서 쓰는 몫을 더해 만든다 */
export function quotaOf(rows: CustomDimRow[]): string {
  const used = 10 + rows.filter((r) => r.scope === "이벤트").length;
  return `${used}/${EVENT_SCOPE_LIMIT}`;
}

/** 안내문에 쓰는 값 */
export const FACTS = {
  limit: String(EVENT_SCOPE_LIMIT),
  /** 초급 편들과 같은 지난 28일 사용자 수. member_id가 만드는 값의 규모를 설명할 때 쓴다 */
  users: "9,840",
  inquiryValues: "제품, 배송, 제휴 세 가지",
};
