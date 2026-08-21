/**
 * GA4 Edu 접근 판정.
 *
 * 구독 여부의 원본은 Neon의 newsletter_subscribers 한 곳이다. 스티비에서 해지가 일어나면
 * 웹훅이 이 표의 status를 바꾸고, 실습을 열 때마다 이 함수가 그 값을 다시 읽는다.
 * 그래서 해지한 사람은 쿠키가 남아 있어도 다음 요청부터 막힌다.
 */

import { neon } from "@neondatabase/serverless";

export type AccessState =
  /** 구독 확인까지 끝난 사람. 실습이 열린다 */
  | "subscribed"
  /** 신청은 했지만 확인 메일을 아직 누르지 않은 사람 */
  | "pending"
  /** 구독을 해지한 사람 */
  | "unsubscribed"
  /** 명단에 없는 주소 */
  | "none"
  /** 데이터베이스를 읽지 못한 상태. 접근은 막되 안내 문구를 달리한다 */
  | "error";

export interface AccessResult {
  state: AccessState;
  email: string;
}

/** 실습을 열어 줄 상태인지 */
export function isAllowed(state: AccessState): boolean {
  return state === "subscribed";
}

/**
 * 이메일 하나의 구독 상태를 Neon에서 읽는다.
 * 목 모드(NEWSLETTER_MOCK=1)에서는 데이터베이스를 건드리지 않고 항상 열어 준다.
 */
export async function lookupAccess(email: string): Promise<AccessResult> {
  if (process.env.NEWSLETTER_MOCK === "1") {
    return { state: "subscribed", email };
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("ga4-edu/access: DATABASE_URL 누락");
    return { state: "error", email };
  }

  try {
    const sql = neon(databaseUrl);
    const rows = (await sql`
      SELECT status FROM newsletter_subscribers WHERE email = ${email} LIMIT 1
    `) as { status: string }[];

    if (rows.length === 0) return { state: "none", email };

    const status = rows[0].status;
    if (status === "subscribed") return { state: "subscribed", email };
    if (status === "pending") return { state: "pending", email };
    return { state: "unsubscribed", email };
  } catch (error) {
    console.error("ga4-edu/access: Neon 조회 실패", error);
    return { state: "error", email };
  }
}

/** 상태별 안내 문구. 화면과 API가 같은 문장을 쓴다 */
export const ACCESS_MESSAGE: Record<AccessState, string> = {
  subscribed: "실습을 열었습니다.",
  pending:
    "구독 신청은 접수됐습니다. 메일함에서 확인 버튼을 누르면 실습이 열립니다.",
  unsubscribed:
    "구독이 해지된 주소입니다. 다시 구독하면 실습이 열립니다.",
  none: "구독자 명단에 없는 주소입니다. 무료로 구독하면 실습이 열립니다.",
  error: "일시적인 오류입니다. 잠시 후 다시 시도해 주세요.",
};
