import { getInsights, getClasses, getCourses } from "@/lib/content";
import { SITE_URL } from "@/lib/constants";

export const dynamic = "force-static";

export function generateStaticParams() {
  return [{ id: "0.xml" }, { id: "1.xml" }];
}

interface SitemapEntry {
  url: string;
  lastModified?: string;
}

function toXml(entries: SitemapEntry[]): string {
  const urls = entries
    .map((entry) => {
      const lastmod = entry.lastModified
        ? `\n    <lastmod>${entry.lastModified}</lastmod>`
        : "";
      return `  <url>\n    <loc>${entry.url}</loc>${lastmod}\n  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

function validDate(dateStr: string | undefined): string | undefined {
  if (!dateStr || dateStr.startsWith("2025-01-01T00:00")) return undefined;
  return dateStr;
}

function buildInsightsSitemap(): SitemapEntry[] {
  const insights = getInsights();
  return [
    { url: `${SITE_URL}/insights`, lastModified: validDate(insights[0]?.publishedAt) },
    ...insights.map((i) => ({
      url: `${SITE_URL}/insights/${i.slug}`,
      lastModified: validDate(i.publishedAt),
    })),
  ];
}

function buildClassSitemap(): SitemapEntry[] {
  const courses = getCourses();
  const classes = getClasses();
  return [
    { url: `${SITE_URL}/class` },
    { url: `${SITE_URL}/about` },
    { url: `${SITE_URL}/tags` },
    { url: SITE_URL },
    ...courses.map((c) => ({
      url: `${SITE_URL}/class/${c.slug}`,
      lastModified: validDate(c.publishedAt),
    })),
    ...classes.map((cls) => ({
      url: `${SITE_URL}/class/${cls.courseSlug}/${cls.slug}`,
      lastModified: validDate(cls.publishedAt),
    })),
  ];
}

const builders: Record<number, () => SitemapEntry[]> = {
  0: buildInsightsSitemap,
  1: buildClassSitemap,
};

export async function GET(
  _request: Request,
  props: { params: Promise<{ id: string }> },
) {
  const { id } = await props.params;
  const numericId = Number(id.replace(".xml", ""));
  const builder = builders[numericId];

  if (!builder) {
    return new Response("Not Found", { status: 404 });
  }

  const entries = builder();
  const xml = toXml(entries);

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
