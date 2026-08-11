import { getClasses, getCourses, getInsights } from "@/lib/content";
import { SITE_URL } from "@/lib/constants";
import { classHref, courseHref, insightHref } from "@/lib/links";

export const dynamic = "force-static";

const FEED_TITLE = "준이아빠블로그 | AI-Enhanced Tech Wiki";
const FEED_DESCRIPTION =
  "디지털 마케팅, AI, 데이터 분석 전문가의 인사이트를 담는 지식 아카이브";
const FEED_AUTHOR = "준이아빠";
const FEED_COPYRIGHT = `© ${new Date().getFullYear()} 준이아빠블로그`;
const MAX_ITEMS = 50;

/**
 * 피드에 실을 항목의 공통 형태. Insight, Class, Course는 필드 이름이 서로 달라
 * (title/term, excerpt/definition/description) 여기서 한 형태로 맞춘 뒤 정렬한다.
 *
 * 본문(content:encoded)은 싣지 않는다. 콘텐츠 MD의 이미지와 내부 링크가 모두
 * 상대 경로라 리더 안에서는 리더 도메인 기준으로 해석되어 깨지고, 전문을 넣으면
 * 피드가 수백 KB로 불어나 일부 수집기가 잘라내기 때문이다.
 */
interface FeedEntry {
  url: string;
  title: string;
  description: string;
  publishedAt: string;
  /** 주제 카테고리(MARKETING, AI_TECH 등)와 콘텐츠 타입 두 가지를 함께 싣는다. */
  categories: string[];
}

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

function collectEntries(): FeedEntry[] {
  const insights: FeedEntry[] = getInsights().map((insight) => ({
    url: `${SITE_URL}${insightHref(insight.slug)}`,
    title: insight.title,
    description: insight.excerpt,
    publishedAt: insight.publishedAt,
    categories: ["Insight", insight.category],
  }));

  // 코스 정보가 없는 클래스는 상세 URL을 만들 수 없다(classHref가 null을 반환).
  // 깨진 링크를 내보내느니 항목을 빼는 편이 낫다.
  const classes: FeedEntry[] = getClasses().flatMap((cls) => {
    const href = classHref(cls);
    if (!href) return [];
    return [
      {
        url: `${SITE_URL}${href}`,
        title: cls.term,
        description: cls.definition,
        publishedAt: cls.publishedAt,
        categories: ["Class", cls.category],
      },
    ];
  });

  const courses: FeedEntry[] = getCourses().map((course) => ({
    url: `${SITE_URL}${courseHref(course.slug)}`,
    title: course.title,
    description: course.description,
    publishedAt: course.publishedAt,
    categories: ["Course", course.category],
  }));

  return [...insights, ...classes, ...courses]
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
    .slice(0, MAX_ITEMS);
}

export async function GET() {
  const entries = collectEntries();
  // 빌드 시각을 쓴다. 최신 글의 publishedAt은 날짜만 있어 시각이 항상 00:00:00으로
  // 굳고, 같은 날 여러 번 배포해도 값이 바뀌지 않아 리더가 변경을 놓친다.
  const lastBuildDate = new Date().toUTCString();

  const items = entries
    .map((entry) => {
      const categories = entry.categories
        .map((category) => `      <category>${escapeXml(category)}</category>`)
        .join("\n");
      return `    <item>
      <title>${escapeXml(entry.title)}</title>
      <link>${entry.url}</link>
      <description><![CDATA[${sanitizeCdata(entry.description)}]]></description>
      <dc:creator><![CDATA[${FEED_AUTHOR}]]></dc:creator>
      <pubDate>${toRfc822(entry.publishedAt)}</pubDate>
      <guid isPermaLink="true">${entry.url}</guid>
${categories}
    </item>`;
    })
    .join("\n");

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
