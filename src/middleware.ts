import { NextRequest, NextResponse } from "next/server";
import { CLASS_COURSE_MAP } from "@/lib/generated/class-course-map";

// Jekyll 시절 URL → 현재 URL 매핑
const LEGACY_REDIRECTS: Record<string, string> = {
  "/what-is-click-through-attribution": "/insights/what-is-click-through-attribution",
  "/conversion-and-conversion-campaign": "/insights/conversion-and-conversion-campaign",
};

// Jekyll 시절 /tags?tag=X 쿼리스트링 → 정규 태그 경로 매핑
// 매핑되지 않은 값은 /tags 로 308 (중복 콘텐츠 색인 거부 해결)
const LEGACY_TAG_QUERY_MAP: Record<string, string> = {
  "메타 어트리뷰션": "/tags/%EC%96%B4%ED%8A%B8%EB%A6%AC%EB%B7%B0%EC%85%98",
  "메타어트리뷰션": "/tags/%EC%96%B4%ED%8A%B8%EB%A6%AC%EB%B7%B0%EC%85%98",
  "투자수익률": "/tags/ROI",
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
  const { hostname, pathname, search, searchParams } = request.nextUrl;
  const isNonWww = hostname === "digitalmarketer.co.kr";

  // /tags?tag=X (Jekyll 시절) → 정규 태그 경로 308
  // GSC "크롤링됨 - 현재 색인이 생성되지 않음" 해결용 (중복 콘텐츠 처리)
  if (pathname === "/tags" && searchParams.has("tag")) {
    const tagValue = (searchParams.get("tag") ?? "").trim();
    const mappedPath = LEGACY_TAG_QUERY_MAP[tagValue];
    const dest = mappedPath ?? "/tags";
    return NextResponse.redirect(
      new URL(`https://www.digitalmarketer.co.kr${dest}`),
      308,
    );
  }

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

  // 클래스 슬러그는 맞지만 코스 조각이 틀린 경로 → 정규 경로로 301
  // 과거 내부 링크 버그로 /class/{다른코스}/{클래스} 형태가 노출된 적이 있어,
  // 이미 수집된 URL과 외부 공유 링크가 404로 끝나지 않게 한다.
  const classPathMatch = pathname.match(/^\/class\/([^/]+)\/([^/]+)\/?$/);
  if (classPathMatch) {
    const [, courseSlug, classSlug] = classPathMatch;
    const canonicalCourse = CLASS_COURSE_MAP[classSlug];
    if (canonicalCourse && canonicalCourse !== courseSlug) {
      const url = new URL(
        `https://www.digitalmarketer.co.kr/class/${canonicalCourse}/${classSlug}`,
      );
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
