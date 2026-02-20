import { SITE_URL } from "@/lib/constants";

export const dynamic = "force-dynamic";

/**
 * 사이트맵 인덱스 — /sitemap.xml
 * 주제별로 분리된 개별 사이트맵을 참조합니다.
 */
export async function GET() {
  const sitemaps = [
    { loc: `${SITE_URL}/sitemap/0.xml`, label: "Insights" },
    { loc: `${SITE_URL}/sitemap/1.xml`, label: "Class" },
    { loc: `${SITE_URL}/sitemap/2.xml`, label: "General" },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.map((s) => `  <!-- ${s.label} -->
  <sitemap>
    <loc>${s.loc}</loc>
  </sitemap>`).join("\n")}
</sitemapindex>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
