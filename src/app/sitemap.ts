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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL;

  // 1. 고정 페이지
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/insights`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/class`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/series`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/logs`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tags`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
  ];

  // 2. DB 쿼리 병렬 실행
  const [posts, faqs, courses, classes, seriesList, logs] = await Promise.all([
    getPublishedPosts(),
    getPublishedFaqs(),
    getPublishedCourses(),
    getPublishedClasses(),
    getPublishedSeries(),
    getPublishedLogs(),
  ]);

  // 3. 블로그 포스트 (Insights)
  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/insights/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // 4. FAQ
  const faqRoutes: MetadataRoute.Sitemap = faqs.map((faq) => ({
    url: `${baseUrl}/faq/${faq.slug}`,
    lastModified: faq.updatedAt,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  // 5. Courses (강의 목록)
  const courseRoutes: MetadataRoute.Sitemap = courses.map((course) => ({
    url: `${baseUrl}/class/${course.slug}`,
    lastModified: course.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // 6. Classes (개별 수업) - courseInfo가 있는 경우만 포함
  const classRoutes: MetadataRoute.Sitemap = classes
    .filter((cls) => cls.courseInfo?.slug)
    .map((cls) => ({
      url: `${baseUrl}/class/${cls.courseInfo!.slug}/${cls.slug}`,
      lastModified: cls.updatedAt,
      changeFrequency: "weekly",
      priority: 0.7,
    }));

  // 7. Series
  const seriesRoutes: MetadataRoute.Sitemap = seriesList.map((s) => ({
    url: `${baseUrl}/series/${s.slug}`,
    lastModified: s.updatedAt,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  // 8. Logs
  const logRoutes: MetadataRoute.Sitemap = logs.map((log) => ({
    url: `${baseUrl}/logs/${log.slug}`,
    lastModified: log.updatedAt,
    changeFrequency: "monthly",
    priority: 0.4,
  }));

  return [
    ...staticRoutes,
    ...postRoutes,
    ...faqRoutes,
    ...courseRoutes,
    ...classRoutes,
    ...seriesRoutes,
    ...logRoutes,
  ];
}
