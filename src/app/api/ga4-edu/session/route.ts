import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { GA4_EDU_COOKIE, readSessionToken } from "@/lib/ga4-edu/session";
import { ACCESS_MESSAGE, isAllowed, lookupAccess } from "@/lib/ga4-edu/access";

/**
 * 현재 세션 확인.
 *
 * 실습 화면이 뜨기 전에 한 번 부른다. 쿠키의 서명만 보지 않고 Neon의 구독 상태까지 다시 읽는
 * 이유는 구독 해지를 즉시 반영하기 위해서다. 해지한 사람의 쿠키는 서명이 멀쩡해도 여기서 막히고,
 * 응답과 함께 쿠키도 지운다.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  const store = await cookies();
  const email = await readSessionToken(store.get(GA4_EDU_COOKIE)?.value);

  if (!email) {
    return NextResponse.json({ ok: false, state: "anonymous" });
  }

  const { state } = await lookupAccess(email);

  if (!isAllowed(state)) {
    const response = NextResponse.json({
      ok: false,
      state,
      email,
      message: ACCESS_MESSAGE[state],
    });
    // 구독이 끊긴 세션은 들고 있을 이유가 없다. 조회 실패일 때는 남겨 둔다.
    if (state !== "error") {
      response.cookies.set(GA4_EDU_COOKIE, "", { path: "/", maxAge: 0 });
    }
    return response;
  }

  return NextResponse.json({ ok: true, state, email });
}
