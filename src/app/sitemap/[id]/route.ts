import { getInsights, getClasses, getCourses, getAllTagsWithId, getContentByTag } from "@/lib/content";
import { SITE_URL, MIN_TAG_ITEMS_FOR_INDEX } from "@/lib/constants";

export const dynamic = "force-static";

export function generateStaticParams() {
  return [{ id: "0.xml" }, { id: "1.xml" }];
}

interface SitemapEntry {
  url: string;
  lastModified?: string;
  changefreq?: "daily" | "weekly" | "monthly";
  priority?: number;
}

function toXml(entries: SitemapEntry[]): string {
  const urls = entries
    .map((entry) => {
      const lastmod = entry.lastModified
        ? `\n    <lastmod>${entry.lastModified}</lastmod>`
        : "";
      const changefreq = entry.changefreq
        ? `\n    <changefreq>${entry.changefreq}</changefreq>`
        : "";
      const priority = entry.priority != null
        ? `\n    <priority>${entry.priority.toFixed(1)}</priority>`
        : "";
      return `  <url>\n    <loc>${entry.url}</loc>${lastmod}${changefreq}${priority}\n  </url>`;
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
    { url: `${SITE_URL}/insights`, lastModified: validDate(insights[0]?.updatedAt ?? insights[0]?.publishedAt), changefreq: "daily", priority: 0.9 },
    ...insights.map((i) => ({
      url: `${SITE_URL}/insights/${i.slug}`,
      lastModified: validDate(i.updatedAt ?? i.publishedAt),
      changefreq: "weekly" as const,
      priority: 0.8,
    })),
  ];
}

function buildClassSitemap(): SitemapEntry[] {
  const courses = getCourses();
  const classes = getClasses();
  // 색인 대상 태그만 사이트맵에 넣는다 (noindex URL은 제출하지 않는다)
  const tags = getAllTagsWithId().filter((t) => {
    const { posts, classes } = getContentByTag(t.name);
    return posts.length + classes.length >= MIN_TAG_ITEMS_FOR_INDEX;
  });
  return [
    { url: SITE_URL, changefreq: "daily", priority: 1.0 },
    { url: `${SITE_URL}/class`, changefreq: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/about`, changefreq: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/tags`, changefreq: "weekly", priority: 0.7 },
    // AI-Practice: AIPBL 실습 (레거시 [slug] 트랙은 noindex라 제외)
    { url: `${SITE_URL}/ai-practice`, changefreq: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/ai-practice/prompt-basics`, changefreq: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/ai-practice/prompt-intermediate`, changefreq: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/ai-practice/prompt-advanced`, changefreq: "monthly", priority: 0.8 },
    ...courses.map((c) => ({
      url: `${SITE_URL}/class/${c.slug}`,
      lastModified: validDate(c.publishedAt),
      changefreq: "weekly" as const,
      priority: 0.8,
    })),
    ...classes.map((cls) => ({
      url: `${SITE_URL}/class/${cls.courseSlug}/${cls.slug}`,
      lastModified: validDate(cls.updatedAt ?? cls.publishedAt),
      changefreq: "weekly" as const,
      priority: 0.7,
    })),
    ...tags.map((t) => ({
      url: `${SITE_URL}/tags/${encodeURIComponent(t.name)}`,
      changefreq: "weekly" as const,
      priority: 0.5,
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
