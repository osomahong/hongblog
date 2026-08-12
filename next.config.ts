import type { NextConfig } from "next";

// public/ 아래 이미지의 Next.js 기본 헤더는 `max-age=0, must-revalidate`라
// 방문자가 페이지를 옮길 때마다 같은 파일을 다시 요청한다. 그만큼 Edge Requests와
// Fast Origin Transfer, Observability 이벤트가 함께 늘어난다.
// 이미지는 슬러그 단위로 고정돼 있고 교체할 때 파일명을 바꾸므로 30일 캐시로 둔다.
// immutable은 쓰지 않는다. 같은 경로로 파일을 갈아끼웠을 때 방문자 브라우저가
// 1년 동안 옛 이미지를 붙들고 있는 사고를 막기 위해서다.
const ASSET_CACHE_HEADERS = [
  {
    key: "Cache-Control",
    value: "public, max-age=2592000, stale-while-revalidate=86400",
  },
];

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Legacy redirects는 src/middleware.ts에서 통합 처리 (리디렉트 hop 수 최소화)
  async headers() {
    return [
      // 인사이트, 클래스 본문 이미지
      { source: "/images/:path*", headers: ASSET_CACHE_HEADERS },
      // og:image 썸네일
      { source: "/og/:path*", headers: ASSET_CACHE_HEADERS },
      // 코스 추천 배너 (메인 히어로 슬라이드, 코스 캐러셀 카드)
      { source: "/banners/:path*", headers: ASSET_CACHE_HEADERS },
      // AI-Practice 실습용 목업 자산 (HTML, 이미지)
      { source: "/ai-practice/mock/:path*", headers: ASSET_CACHE_HEADERS },
      // 루트에 놓인 고정 이미지
      { source: "/profile-illustration.png", headers: ASSET_CACHE_HEADERS },
      { source: "/icon-512.png", headers: ASSET_CACHE_HEADERS },
      { source: "/og-default.png", headers: ASSET_CACHE_HEADERS },
    ];
  },
};

export default nextConfig;
