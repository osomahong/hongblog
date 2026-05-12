import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/_next/static/media/"],
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
    sitemap: [`${SITE_URL}/sitemap/0.xml`, `${SITE_URL}/sitemap/1.xml`],
  };
}
