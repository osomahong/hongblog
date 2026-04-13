import { NextRequest, NextResponse } from "next/server";

// Jekyll 시절 URL → 현재 URL 매핑
const LEGACY_REDIRECTS: Record<string, string> = {
  "/what-is-click-through-attribution": "/insights/what-is-click-through-attribution",
  "/conversion-and-conversion-campaign": "/insights/conversion-and-conversion-campaign",
};

// SSG 리팩토링으로 삭제된 라우트 → 301 리디렉트
const REMOVED_ROUTE_REDIRECTS: [RegExp, string][] = [
  [/^\/faq(\/.*)?$/, "/insights"],
  [/^\/series(\/.*)?$/, "/insights"],
  [/^\/category(\/.*)?$/, "/insights"],
  [/^\/logs(\/.*)?$/, "/"],
  [/^\/about\/life(\/.*)?$/, "/about"],
  [/^\/about\/portfolio$/, "/about"],
  [/^\/search$/, "/"],
  [/^\/vibecoding-1$/, "/insights/vibe-coding-vs-ai-agent-difference"],
  [/^\/tags\/index\.html$/, "/tags"],
  [/^\/([\$%].*)$/, "/"],
];

export function middleware(request: NextRequest) {
  const { hostname, pathname, search } = request.nextUrl;
  const isNonWww = hostname === "digitalmarketer.co.kr";

  // non-www 요청이면서 legacy redirect도 해당되면, 한 번에 최종 목적지로 308
  if (isNonWww) {
    const legacyDest = LEGACY_REDIRECTS[pathname];
    const finalPath = legacyDest || pathname;
    const url = new URL(`https://www.digitalmarketer.co.kr${finalPath}${search}`);
    return NextResponse.redirect(url, 308);
  }

  // www 요청에서 legacy redirect 처리
  const legacyDest = LEGACY_REDIRECTS[pathname];
  if (legacyDest) {
    const url = new URL(`https://www.digitalmarketer.co.kr${legacyDest}${search}`);
    return NextResponse.redirect(url, 308);
  }

  // 삭제된 라우트 301 리디렉트
  for (const [pattern, dest] of REMOVED_ROUTE_REDIRECTS) {
    if (pattern.test(pathname)) {
      const url = new URL(`https://www.digitalmarketer.co.kr${dest}`);
      return NextResponse.redirect(url, 301);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // 정적 파일, _next, api 제외
    "/((?!_next/static|_next/image|favicon.ico|api/).*)",
  ],
};
