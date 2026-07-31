"use client";

/**
 * AdSense 스크립트 조건부 로더.
 * AI-Practice(다크 테마 실습 영역)에서는 자동 광고가 푸터 아래에 광고 컨테이너를
 * 삽입해 빈 여백처럼 보이는 문제가 있어, 해당 경로에서는 스크립트를 로드하지 않는다.
 */

import Script from "next/script";
import { usePathname } from "next/navigation";

const ADSENSE_SRC =
  "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7390905088794850";

export function AdSenseLoader() {
  const pathname = usePathname();
  if (pathname?.startsWith("/ai-practice")) return null;

  return (
    <Script
      id="adsense-loader"
      src={ADSENSE_SRC}
      strategy="afterInteractive"
      crossOrigin="anonymous"
    />
  );
}
