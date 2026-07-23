import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // /_next/static/media 에는 폰트가 들어간다. 렌더링에 쓰이는 리소스를 막으면
        // 검색엔진이 실제와 다른 화면으로 페이지를 평가하므로 차단하지 않는다.
        userAgent: "*",
        allow: "/",
      },
      {
        userAgent: "Yeti",
        allow: "/",
      },
      {
        userAgent: "NaverBot",
        allow: "/",
      },
      {
        userAgent: "Googlebot",
        allow: "/",
      },
    ],
    sitemap: [
      `${SITE_URL}/sitemap.xml`,
      `${SITE_URL}/sitemap/0.xml`,
      `${SITE_URL}/sitemap/1.xml`,
    ], // /sitemap.xml은 인덱스(두 sub-sitemap을 가리킴). 봇 호환성을 위해 셋 다 명시.
  };
}
