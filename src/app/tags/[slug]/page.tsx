import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Tag, ArrowRight, Sparkles, Database, TrendingUp, BookOpen } from "lucide-react";
import { NeoCardHeader, NeoCardTitle, NeoCardContent, NeoCardFooter, NeoCard } from "@/components/neo";
import { NeoBadge } from "@/components/neo";
import { NeoTagBadge } from "@/components/neo";
import { NeoTiltCard } from "@/components/neo";
import { getAllTagsWithId, getContentByTag } from "@/lib/content";
import { ViewTracker } from "@/components/ViewTracker";
import { SITE_URL } from "@/lib/constants";
import { classHref } from "@/lib/links";

export const dynamic = "force-static";
export const dynamicParams = false;

const categoryIcons = {
  AI_TECH: Sparkles,
  DATA: Database,
  MARKETING: TrendingUp,
};

const categoryLabels = {
  AI_TECH: "AI & Tech",
  DATA: "Data",
  MARKETING: "Marketing",
};

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return getAllTagsWithId().map((tag) => ({
    slug: tag.name,
  }));
}

export async function generateMetadata(
  { params }: { params: Promise<Params> },
): Promise<Metadata> {
  const { slug } = await params;
  const tagName = decodeURIComponent(slug);
  const { posts, classes } = getContentByTag(tagName);
  const totalCount = posts.length + classes.length;

  const title = `#${tagName} 태그 인사이트와 클래스 ${totalCount}건 모음 | 준이아빠 디지털 마케팅 블로그`;
  const description = totalCount > 0
    ? `${tagName} 태그가 붙은 인사이트 ${posts.length}건과 클래스 ${classes.length}건을 한곳에 모았습니다. 디지털 마케팅, GA4, GTM, AI 활용 관점에서 ${tagName} 주제를 입문자도 이해하기 쉽게 풀어 드립니다.`
    : `${tagName} 태그 관련 콘텐츠 모음입니다. 디지털 마케팅, AI, 데이터 분석 주제에서 ${tagName} 키워드를 다룬 글을 모았습니다.`;
  const canonical = `${SITE_URL}/tags/${encodeURIComponent(tagName)}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
    },
  };
}

export default async function TagDetailPage(
  { params }: { params: Promise<Params> },
) {
  const { slug } = await params;
  const tagName = decodeURIComponent(slug);
  const allTags = getAllTagsWithId();

  if (!allTags.some((t) => t.name === tagName)) {
    notFound();
  }

  const content = getContentByTag(tagName);
  const totalCount = content.posts.length + content.classes.length;
  const canonical = `${SITE_URL}/tags/${encodeURIComponent(tagName)}`;

  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `#${tagName} 태그 콘텐츠 모음`,
    description: `${tagName} 태그가 붙은 인사이트 ${content.posts.length}건과 클래스 ${content.classes.length}건 모음`,
    url: canonical,
    inLanguage: "ko",
    isPartOf: {
      "@type": "WebSite",
      name: "준이아빠 디지털 마케팅 블로그",
      url: SITE_URL,
    },
    hasPart: [
      ...content.posts.map((p) => ({
        "@type": "Article",
        headline: p.title,
        url: `${SITE_URL}/insights/${p.slug}`,
      })),
      ...content.classes.filter((c) => classHref(c)).map((c) => ({
        "@type": "Article",
        headline: c.term,
        url: `${SITE_URL}${classHref(c)}`,
      })),
    ],
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Tags", item: `${SITE_URL}/tags` },
      { "@type": "ListItem", position: 3, name: `#${tagName}`, item: canonical },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <ViewTracker contentType="tags" contentTitle={`Tag: ${tagName}`} contentSlug={tagName} />

      {/* Hero */}
      <section className="mb-8 sm:mb-12">
        <NeoTiltCard
          className="bg-white neo-border-thick neo-shadow-lg p-5 sm:p-8 md:p-12 relative overflow-hidden text-left"
          intensity={20}
          shadowIntensity={10}
        >
          <div className="absolute top-0 right-0 w-24 sm:w-32 h-full bg-black hidden sm:block" style={{ clipPath: "polygon(20% 0, 100% 0, 100% 100%, 0% 100%)", zIndex: 0 }} />
          <div className="relative z-10">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-black uppercase text-black tracking-tighter mb-2 sm:mb-4">
              <span className="text-[#FF0033]">#{tagName}</span> 태그 콘텐츠 {totalCount}건
            </h1>
            <p className="text-sm sm:text-base text-[#222] font-medium max-w-2xl border-l-4 border-[#FF0033] pl-4">
              {tagName} 태그가 붙은 인사이트 {content.posts.length}건과 클래스 {content.classes.length}건을 한곳에 모았습니다. 디지털 마케팅, GA4, GTM, AI 활용 관점에서 {tagName} 주제를 입문자도 이해하기 쉽게 풀어 드립니다.
            </p>
          </div>
        </NeoTiltCard>
      </section>

      {/* Tag Cloud */}
      <section className="mb-6 sm:mb-8">
        <div className="flex flex-wrap gap-2">
          <Link
            href="/tags"
            className="px-3 py-1.5 text-xs sm:text-sm font-bold uppercase border-2 border-black bg-white text-black hover:bg-gray-100 transition-all"
          >
            ← All
          </Link>
          {allTags.map((tag) => {
            const isSelected = tag.name === tagName;
            return (
              <Link
                key={tag.id}
                href={`/tags/${encodeURIComponent(tag.name)}`}
                className={`px-3 py-1.5 text-xs sm:text-sm font-bold uppercase border-2 border-black transition-all ${
                  isSelected
                    ? "bg-black text-white"
                    : "bg-white text-black hover:bg-gray-100"
                }`}
              >
                #{tag.name}
              </Link>
            );
          })}
        </div>
      </section>

      {/* Results */}
      <div className="mb-4 sm:mb-6">
        <span className="font-mono text-xs sm:text-sm text-muted-foreground">
          {content.posts.length} results for #{tagName}
        </span>
      </div>

      {content.posts.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg sm:text-xl font-black uppercase mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5" /> <span className="comic-emphasis">Insights ({content.posts.length})</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {content.posts.map((post, index) => {
              const Icon = categoryIcons[post.category as keyof typeof categoryIcons];
              return (
                <Link key={post.id} href={`/insights/${post.slug}`}>
                  <NeoTiltCard
                    className={`h-full ${index % 2 === 0 ? "-rotate-0.5" : "rotate-0.5"}`}
                  >
                    <NeoCardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        <NeoBadge
                          variant={
                            post.category === "AI_TECH"
                              ? "primary"
                              : post.category === "DATA"
                                ? "default"
                                : "accent"
                          }
                        >
                          <span className="flex items-center gap-1">
                            {Icon ? <Icon className="w-3 h-3" /> : null}
                            {categoryLabels[post.category as keyof typeof categoryLabels]}
                          </span>
                        </NeoBadge>
                      </div>
                      <NeoCardTitle className="text-lg sm:text-xl">{post.title}</NeoCardTitle>
                    </NeoCardHeader>
                    <NeoCardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {post.excerpt}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {post.tags.map((tag) => (
                          <NeoTagBadge
                            key={tag}
                            tag={tag}
                            clickable={false}
                            className="text-[10px] px-2 py-0.5"
                          />
                        ))}
                      </div>
                    </NeoCardContent>
                    <NeoCardFooter className="flex items-center justify-between">
                      <span className="text-xs font-mono text-muted-foreground">
                        {post.createdAt.toLocaleDateString("ko-KR")}
                      </span>
                      <span className="flex items-center gap-1 text-sm font-bold uppercase">
                        Read <ArrowRight className="w-4 h-4" />
                      </span>
                    </NeoCardFooter>
                  </NeoTiltCard>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {content.classes.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg sm:text-xl font-black uppercase mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5" /> <span className="comic-emphasis">Classes ({content.classes.length})</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {content.classes.filter((cls) => classHref(cls)).map((cls, index) => (
              <Link
                key={cls.id}
                href={classHref(cls)!}
              >
                <NeoTiltCard
                  className={`h-full ${index % 2 === 0 ? "rotate-0.5" : "-rotate-0.5"}`}
                >
                  <NeoCardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <NeoBadge variant="default">
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3 h-3" />
                          Class
                        </span>
                      </NeoBadge>
                    </div>
                    <NeoCardTitle className="text-lg sm:text-xl">{cls.term}</NeoCardTitle>
                  </NeoCardHeader>
                  <NeoCardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {cls.definition}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {cls.tags.map((tag) => (
                        <NeoTagBadge
                          key={tag}
                          tag={tag}
                          clickable={false}
                          className="text-[10px] px-2 py-0.5"
                        />
                      ))}
                    </div>
                  </NeoCardContent>
                  <NeoCardFooter className="flex items-center justify-between">
                    <span className="text-xs font-mono text-muted-foreground">
                      {cls.publishedAt?.toLocaleDateString("ko-KR") ?? ""}
                    </span>
                    <span className="flex items-center gap-1 text-sm font-bold uppercase">
                      Learn <ArrowRight className="w-4 h-4" />
                    </span>
                  </NeoCardFooter>
                </NeoTiltCard>
              </Link>
            ))}
          </div>
        </section>
      )}

      {totalCount === 0 && (
        <div className="text-center py-12">
          <Tag className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-lg font-bold">해당 태그의 콘텐츠가 없습니다</p>
        </div>
      )}
    </div>
  );
}
