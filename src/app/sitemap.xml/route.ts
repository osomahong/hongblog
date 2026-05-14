import { SITE_URL } from "@/lib/constants";

export const dynamic = "force-static";

const SUB_SITEMAPS = [
  `${SITE_URL}/sitemap/0.xml`,
  `${SITE_URL}/sitemap/1.xml`,
];

function buildSitemapIndex(): string {
  const items = SUB_SITEMAPS.map(
    (loc) => `  <sitemap>\n    <loc>${loc}</loc>\n  </sitemap>`,
  ).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items}
</sitemapindex>`;
}

export async function GET() {
  return new Response(buildSitemapIndex(), {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
