import {
  getPublishedPosts,
  getPublishedFaqs,
  getPublishedCourses,
  getPublishedClasses,
  getPublishedSeries,
  getPublishedLogs,
} from "@/lib/data-source";
import { SITE_URL } from "@/lib/constants";

export const revalidate = 3600;

export function generateStaticParams() {
  return [{ id: "0.xml" }, { id: "1.xml" }, { id: "2.xml" }];
}

interface SitemapEntry {
  url: string;
  lastModified?: Date | null;
}

function latestDate(dates: (Date | null | undefined)[]): Date {
  const valid = dates.filter((d): d is Date => d instanceof Date);
  if (valid.length === 0) return new Date("2026-01-01");
  return new Date(Math.max(...valid.map((d) => d.getTime())));
}

function toXml(entries: SitemapEntry[]): string {
  const urls = entries
    .map((entry) => {
      const lastmod = entry.lastModified
        ? `\n    <lastmod>${entry.lastModified.toISOString()}</lastmod>`
        : "";
      return `  <url>\n    <loc>${entry.url}</loc>${lastmod}\n  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

async function buildInsightsSitemap(): Promise<SitemapEntry[]> {
  const posts = await getPublishedPosts();
  return [
    {
      url: `${SITE_URL}/insights`,
      lastModified: latestDate(posts.map((p) => p.updatedAt)),
    },
    ...posts.map((post) => ({
      url: `${SITE_URL}/insights/${post.slug}`,
      lastModified: post.updatedAt,
    })),
  ];
}

async function buildClassSitemap(): Promise<SitemapEntry[]> {
  const [courses, classes] = await Promise.all([
    getPublishedCourses(),
    getPublishedClasses(),
  ]);
  return [
    {
      url: `${SITE_URL}/class`,
      lastModified: latestDate([
        ...courses.map((c) => c.updatedAt),
        ...classes.map((c) => c.updatedAt),
      ]),
    },
    ...courses.map((course) => ({
      url: `${SITE_URL}/class/${course.slug}`,
      lastModified: course.updatedAt,
    })),
    ...classes
      .filter((cls) => cls.courseInfo?.slug)
      .map((cls) => ({
        url: `${SITE_URL}/class/${cls.courseInfo!.slug}/${cls.slug}`,
        lastModified: cls.updatedAt,
      })),
  ];
}

async function buildGeneralSitemap(): Promise<SitemapEntry[]> {
  const [faqs, seriesList, logs, posts] = await Promise.all([
    getPublishedFaqs(),
    getPublishedSeries(),
    getPublishedLogs(),
    getPublishedPosts(),
  ]);

  const siteLatest = latestDate([
    ...posts.map((p) => p.updatedAt),
    ...faqs.map((f) => f.updatedAt),
  ]);

  return [
    { url: SITE_URL, lastModified: siteLatest },
    {
      url: `${SITE_URL}/faq`,
      lastModified: latestDate(faqs.map((f) => f.updatedAt)),
    },
    {
      url: `${SITE_URL}/series`,
      lastModified: latestDate(seriesList.map((s) => s.updatedAt)),
    },
    { url: `${SITE_URL}/about` },
    {
      url: `${SITE_URL}/logs`,
      lastModified: latestDate(logs.map((l) => l.updatedAt)),
    },
    {
      url: `${SITE_URL}/tags`,
      lastModified: siteLatest,
    },
    ...faqs.map((faq) => ({
      url: `${SITE_URL}/faq/${faq.slug}`,
      lastModified: faq.updatedAt,
    })),
    ...seriesList.map((s) => ({
      url: `${SITE_URL}/series/${s.slug}`,
      lastModified: s.updatedAt,
    })),
    ...logs.map((log) => ({
      url: `${SITE_URL}/logs/${log.slug}`,
      lastModified: log.updatedAt,
    })),
  ];
}

const builders: Record<number, () => Promise<SitemapEntry[]>> = {
  0: buildInsightsSitemap,
  1: buildClassSitemap,
  2: buildGeneralSitemap,
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

  const entries = await builder();
  const xml = toXml(entries);

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
