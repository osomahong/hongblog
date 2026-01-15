import { getPublishedPosts } from "@/lib/queries";

export const revalidate = 3600; // 1시간 캐시

export async function GET() {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://hong.blog";
    const posts = await getPublishedPosts();

    const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>Hong Blog Insights</title>
    <link>${baseUrl}</link>
    <description>디지털 마케팅, AI, 데이터 분석 전문가의 인사이트</description>
    <language>ko-KR</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${posts
            .map((post) => {
                return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${baseUrl}/insights/${post.slug}</link>
      <guid>${baseUrl}/insights/${post.slug}</guid>
      <pubDate>${new Date(post.createdAt).toUTCString()}</pubDate>
      <description><![CDATA[${post.excerpt || ""}]]></description>
      ${post.category ? `<category>${post.category}</category>` : ""}
    </item>`;
            })
            .join("")}
  </channel>
</rss>`;

    return new Response(xml, {
        headers: {
            "Content-Type": "text/xml",
            "Cache-Control": "s-maxage=3600, stale-while-revalidate",
        },
    });
}
