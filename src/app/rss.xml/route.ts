import { getInsights } from "@/lib/content";
import { SITE_URL } from "@/lib/constants";
import { renderMarkdownToHtml } from "@/lib/markdown";

export const dynamic = "force-static";

const FEED_TITLE = "준이아빠블로그 | AI-Enhanced Tech Wiki";
const FEED_DESCRIPTION =
  "디지털 마케팅, AI, 데이터 분석 전문가의 인사이트를 담는 지식 아카이브";
const FEED_AUTHOR = "준이아빠";
const FEED_COPYRIGHT = `© ${new Date().getFullYear()} 준이아빠블로그`;
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

  const itemXml = await Promise.all(
    insights.map(async (insight) => {
      const url = `${SITE_URL}/insights/${insight.slug}`;
      const html = await renderMarkdownToHtml(insight.content);
      return `    <item>
      <title>${escapeXml(insight.title)}</title>
      <link>${url}</link>
      <description><![CDATA[${sanitizeCdata(insight.excerpt)}]]></description>
      <content:encoded><![CDATA[${sanitizeCdata(html)}]]></content:encoded>
      <dc:creator><![CDATA[${FEED_AUTHOR}]]></dc:creator>
      <pubDate>${toRfc822(insight.publishedAt)}</pubDate>
      <guid isPermaLink="true">${url}</guid>
      <category>${escapeXml(insight.category)}</category>
    </item>`;
    })
  );
  const items = itemXml.join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escapeXml(FEED_TITLE)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(FEED_DESCRIPTION)}</description>
    <language>ko</language>
    <copyright>${escapeXml(FEED_COPYRIGHT)}</copyright>
    <ttl>60</ttl>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${SITE_URL}/icon-512.png</url>
      <title>${escapeXml(FEED_TITLE)}</title>
      <link>${SITE_URL}</link>
    </image>
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
