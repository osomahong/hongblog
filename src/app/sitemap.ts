import { MetadataRoute } from "next";
import {
  getPublishedPosts,
  getPublishedFaqs,
  getPublishedCourses,
  getPublishedClasses,
  getPublishedSeries,
  getPublishedLogs,
} from "@/lib/queries";
import { SITE_URL } from "@/lib/constants";

export const dynamic = "force-dynamic";

/**
 * 주제별 사이트맵 인덱스 구조
 * /sitemap.xml        → 사이트맵 인덱스 (자동 생성)
 * /sitemap/0.xml      → Insights (블로그 포스트)
 * /sitemap/1.xml      → Class (강의 + 개별 수업)
 * /sitemap/2.xml      → General (홈, FAQ, Series, Logs, About, Tags)
 */
export async function generateSitemaps() {
  return [{ id: 0 }, { id: 1 }, { id: 2 }];
}

function latestDate(dates: (Date | null | undefined)[]): Date {
  const valid = dates.filter((d): d is Date => d instanceof Date);
  if (valid.length === 0) return new Date("2026-01-01");
  return new Date(Math.max(...valid.map((d) => d.getTime())));
}

export default async function sitemap({
  id,
}: {
  id: number;
}): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL;

  const sitemapId = Number(id);

  // sitemap/0.xml — Insights (블로그 포스트)
  if (sitemapId === 0) {
    const posts = await getPublishedPosts();
    return [
      {
        url: `${baseUrl}/insights`,
        lastModified: latestDate(posts.map((p) => p.updatedAt)),
      },
      ...posts.map((post) => ({
        url: `${baseUrl}/insights/${post.slug}`,
        lastModified: post.updatedAt,
      })),
    ];
  }

  // sitemap/1.xml — Class (강의 + 개별 수업)
  if (sitemapId === 1) {
    const [courses, classes] = await Promise.all([
      getPublishedCourses(),
      getPublishedClasses(),
    ]);
    return [
      {
        url: `${baseUrl}/class`,
        lastModified: latestDate([
          ...courses.map((c) => c.updatedAt),
          ...classes.map((c) => c.updatedAt),
        ]),
      },
      ...courses.map((course) => ({
        url: `${baseUrl}/class/${course.slug}`,
        lastModified: course.updatedAt,
      })),
      ...classes
        .filter((cls) => cls.courseInfo?.slug)
        .map((cls) => ({
          url: `${baseUrl}/class/${cls.courseInfo!.slug}/${cls.slug}`,
          lastModified: cls.updatedAt,
        })),
    ];
  }

  // sitemap/2.xml — General (홈, FAQ, Series, Logs, About, Tags)
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
    { url: baseUrl, lastModified: siteLatest },
    {
      url: `${baseUrl}/faq`,
      lastModified: latestDate(faqs.map((f) => f.updatedAt)),
    },
    {
      url: `${baseUrl}/series`,
      lastModified: latestDate(seriesList.map((s) => s.updatedAt)),
    },
    { url: `${baseUrl}/about` },
    {
      url: `${baseUrl}/logs`,
      lastModified: latestDate(logs.map((l) => l.updatedAt)),
    },
    {
      url: `${baseUrl}/tags`,
      lastModified: siteLatest,
    },
    ...faqs.map((faq) => ({
      url: `${baseUrl}/faq/${faq.slug}`,
      lastModified: faq.updatedAt,
    })),
    ...seriesList.map((s) => ({
      url: `${baseUrl}/series/${s.slug}`,
      lastModified: s.updatedAt,
    })),
    ...logs.map((log) => ({
      url: `${baseUrl}/logs/${log.slug}`,
      lastModified: log.updatedAt,
    })),
  ];
}
