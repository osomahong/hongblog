import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Sparkles, Database, TrendingUp, BookOpen, Flame } from "lucide-react";
import { NeoTiltCard, NeoBadge } from "@/components/neo";
import { getAllTagsWithId as getAllTags, getFeaturedTags, getFeaturedTagPreviews } from "@/lib/content";
import { SITE_URL } from "@/lib/constants";
import { ListViewTracker } from "@/components/ListViewTracker";

export const dynamic = "force-static";

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

export function generateMetadata(): Metadata {
  const allTags = getAllTags();
  const totalContent = allTags.reduce((sum, t) => sum + t.count, 0);
  const title = `태그 ${allTags.length}개로 탐색하는 콘텐츠 모음`;
  const description = `${allTags.length}개 태그로 인사이트와 클래스 ${totalContent}건을 탐색하세요. AI, 마케팅, 데이터 분석 주제를 태그별로 모아 봅니다.`;

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/tags` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/tags`,
      type: "website",
      images: [{ url: `${SITE_URL}/og-default.png`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE_URL}/og-default.png`],
    },
  };
}

export default function TagsPage() {
  const allTags = getAllTags();
  const featuredTags = getFeaturedTags(8);
  const featured = getFeaturedTagPreviews(8);

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "태그 목록",
    url: `${SITE_URL}/tags`,
    numberOfItems: allTags.length,
    itemListElement: allTags.map((tag, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `#${tag.name}`,
      url: `${SITE_URL}/tags/${encodeURIComponent(tag.name)}`,
    })),
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }}
      />
      <ListViewTracker eventName="view_tags_list" />

      {/* Hero Section */}
      <section className="mb-8 sm:mb-12">
        <NeoTiltCard
          className="bg-white neo-border-thick neo-shadow-lg p-5 sm:p-8 md:p-12 relative overflow-hidden text-left"
          intensity={20}
          shadowIntensity={10}
        >
          <div className="absolute top-0 right-0 w-24 sm:w-32 h-full bg-black hidden sm:block" style={{ clipPath: "polygon(20% 0, 100% 0, 100% 100%, 0% 100%)", zIndex: 0 }} />
          <div className="relative z-10">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-black uppercase text-black tracking-tighter mb-2 sm:mb-4">
              <span className="text-[#FF0033]">Tags</span>
            </h1>
            <p className="text-sm sm:text-base text-[#222] font-medium max-w-lg border-l-4 border-[#FF0033] pl-4">
              태그 {allTags.length}개로 콘텐츠를 탐색하세요
            </p>
          </div>
        </NeoTiltCard>
      </section>

      {/* Featured tags curation: GA4 조회수 기반 추천 태그 */}
      {featuredTags.length > 0 && (
        <section className="mb-6 sm:mb-8">
          <h2 className="text-sm sm:text-base font-black uppercase mb-3 flex items-center gap-2">
            <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF0033]" />
            <span className="comic-emphasis">추천 태그</span>
            <span className="text-[10px] sm:text-xs text-muted-foreground font-mono font-normal normal-case tracking-normal">
              최근 30일 조회수 기준
            </span>
          </h2>
          <div className="flex flex-wrap gap-2">
            {featuredTags.map((tag) => (
              <Link
                key={tag.id}
                href={`/tags/${encodeURIComponent(tag.name)}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-bold uppercase border-2 border-black bg-[#FFD700] text-black neo-shadow-sm hover:-translate-y-1 hover:shadow-[4px_4px_0_0_#000] active:translate-y-[2px] active:shadow-none transition-all"
              >
                #{tag.name}
                <span className="text-[10px] font-mono opacity-70">{tag.count}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Tag Cloud */}
      <section className="mb-8 sm:mb-10">
        <h2 className="text-sm sm:text-base font-black uppercase mb-3 text-muted-foreground">
          전체 태그
        </h2>
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <Link
              key={tag.id}
              href={`/tags/${encodeURIComponent(tag.name)}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-bold uppercase border-2 border-black bg-white text-black neo-shadow-sm hover:bg-[#FF0033] hover:text-white hover:-translate-y-1 hover:shadow-[4px_4px_0_0_#000] active:translate-y-[2px] active:shadow-none transition-all"
            >
              #{tag.name}
              <span className="text-[10px] font-mono opacity-60">{tag.count}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured previews per top tag */}
      {featured.length > 0 && (
        <section>
          <h2 className="text-lg sm:text-xl font-black uppercase mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" /> <span className="comic-emphasis">인기 태그로 보는 콘텐츠</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featured.map((item, index) => {
              const Icon = categoryIcons[item.category as keyof typeof categoryIcons];
              return (
                <Link key={item.tag.id} href={item.href}>
                  <NeoTiltCard
                    className={`h-full ${index % 2 === 0 ? "-rotate-0.5" : "rotate-0.5"}`}
                  >
                    <div className="p-4 sm:p-5 flex flex-col h-full">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <NeoBadge
                          variant={
                            item.category === "AI_TECH"
                              ? "primary"
                              : item.category === "DATA"
                                ? "default"
                                : "accent"
                          }
                        >
                          <span className="flex items-center gap-1">
                            {item.contentType === "class" ? (
                              <BookOpen className="w-3 h-3" />
                            ) : Icon ? (
                              <Icon className="w-3 h-3" />
                            ) : null}
                            {categoryLabels[item.category as keyof typeof categoryLabels]}
                          </span>
                        </NeoBadge>
                        <span className="text-[10px] font-mono text-muted-foreground">
                          #{item.tag.name}
                        </span>
                      </div>
                      <h3 className="font-black text-sm sm:text-base leading-snug line-clamp-2 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mb-3">
                        {item.excerpt}
                      </p>
                      <span className="mt-auto flex items-center gap-1 text-xs font-bold uppercase">
                        Read <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </NeoTiltCard>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
