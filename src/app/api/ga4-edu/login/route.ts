import { NextResponse } from "next/server";
import {
  EMAIL_RE,
  GA4_EDU_COOKIE,
  SESSION_MAX_AGE_SEC,
  createSessionToken,
  normalizeEmail,
} from "@/lib/ga4-edu/session";
import { ACCESS_MESSAGE, isAllowed, lookupAccess } from "@/lib/ga4-edu/access";

/**
 * GA4 Edu 실습 열기.
 *
 * 뉴스레터 구독 이메일을 받아 Neon 원장과 대조하고, 구독자면 30일짜리 세션 쿠키를 심는다.
 * 비밀번호를 두지 않는 이유는 잠긴 것이 유료 자산이 아니라 구독자 전용 학습 화면이기 때문이다.
 * 대신 실습을 열 때마다 구독 상태를 다시 확인해, 해지한 사람은 바로 막힌다.
 *
 * 메일 확인 단계를 한 번 더 두려면 이 자리에서 newsletter_tokens에 일회용 토큰을 넣고
 * 확인 링크를 보내면 된다. 세션 발급 부분은 그대로 쓸 수 있다.
 */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "요청 형식이 잘못됐습니다." }, { status: 400 });
  }

  const email = normalizeEmail(body.email);
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json(
      { ok: false, state: "invalid", message: "이메일 주소를 확인해 주세요." },
      { status: 400 }
    );
  }

  const { state } = await lookupAccess(email);

  if (!isAllowed(state)) {
    return NextResponse.json(
      { ok: false, state, message: ACCESS_MESSAGE[state] },
      { status: state === "error" ? 500 : 403 }
    );
  }

  let token: string;
  try {
    token = await createSessionToken(email);
  } catch (error) {
    console.error("ga4-edu/login: 세션 발급 실패", error);
    return NextResponse.json(
      { ok: false, state: "error", message: ACCESS_MESSAGE.error },
      { status: 500 }
    );
  }

  const response = NextResponse.json({
    ok: true,
    state,
    email,
    message: ACCESS_MESSAGE.subscribed,
  });
  response.cookies.set(GA4_EDU_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SEC,
  });
  return response;
}
