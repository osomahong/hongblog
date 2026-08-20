import { NextResponse } from "next/server";
import { GA4_EDU_COOKIE } from "@/lib/ga4-edu/session";

/** 세션 쿠키를 지운다. 구독은 그대로 두고 이 브라우저에서만 나간다 */
export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(GA4_EDU_COOKIE, "", { path: "/", maxAge: 0 });
  return response;
}
