import { getInsights } from "@/lib/content";
import { SITE_URL } from "@/lib/constants";

export const dynamic = "force-static";

const FEED_TITLE = "준이아빠블로그 | AI-Enhanced Tech Wiki";
const FEED_DESCRIPTION =
  "디지털 마케팅, AI, 데이터 분석 전문가의 인사이트를 담는 지식 아카이브";
const MAX_ITEMS = 30;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toRfc822(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return new Date().toUTCString();
  }
  return date.toUTCString();
}

function sanitizeCdata(value: string): string {
  return value.replace(/]]>/g, "]]]]><![CDATA[>");
}

export async function GET() {
  const insights = getInsights().slice(0, MAX_ITEMS);
  const lastBuildDate = insights[0]?.publishedAt
    ? toRfc822(insights[0].publishedAt)
    : new Date().toUTCString();

  const items = insights
    .map((insight) => {
      const url = `${SITE_URL}/insights/${insight.slug}`;
      return `    <item>
      <title>${escapeXml(insight.title)}</title>
      <link>${url}</link>
      <description><![CDATA[${sanitizeCdata(insight.excerpt)}]]></description>
      <pubDate>${toRfc822(insight.publishedAt)}</pubDate>
      <guid isPermaLink="true">${url}</guid>
      <category>${escapeXml(insight.category)}</category>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(FEED_TITLE)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(FEED_DESCRIPTION)}</description>
    <language>ko</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
