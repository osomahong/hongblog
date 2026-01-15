import { MetadataRoute } from "next";
import { getPublishedPosts, getPublishedFaqs } from "@/lib/queries";

export const revalidate = 3600; // 1시간마다 재검증

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://hong.blog";

  // 1. 고정 페이지
  const routes = ["", "/about", "/insights", "/faq"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  // 2. 블로그 포스트 (Insights)
  const posts = await getPublishedPosts();
  const postRoutes = posts.map((post) => ({
    url: `${baseUrl}/insights/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // 3. FAQ
  const faqs = await getPublishedFaqs();
  const faqRoutes = faqs.map((faq) => ({
    url: `${baseUrl}/faq/${faq.slug}`,
    lastModified: faq.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...routes, ...postRoutes, ...faqRoutes];
}
