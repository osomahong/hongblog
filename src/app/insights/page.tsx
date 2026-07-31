import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Sparkles, Database, TrendingUp } from "lucide-react";
import { SITE_URL } from "@/lib/constants";
import {
  NeoCard,
  NeoCardHeader,
  NeoCardTitle,
  NeoCardDescription,
  NeoCardContent,
  NeoCardFooter,
} from "@/components/neo";
import { NeoBadge } from "@/components/neo";
import { NeoTagBadge } from "@/components/neo";
import { getPublishedPosts } from "@/lib/content";
import { NeoTiltCard } from "@/components/neo";

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

import { ListViewTracker } from "@/components/ListViewTracker";

export const dynamic = "force-static";

const PAGE_TITLE = "Insights";
const PAGE_DESCRIPTION =
  "AI 코딩 도구 사용법부터 GA4 분석, 광고 운영까지 실무에서 검증한 인사이트 글 모음입니다. 클로드 코드, Codex, 바이브코딩, 데이터 마케팅 주제를 다룹니다.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/insights` },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    type: "website",
    url: `${SITE_URL}/insights`,
    images: [{ url: `${SITE_URL}/og-default.png`, width: 1200, height: 630 }],
  },
};

export default async function InsightsPage() {
  const posts = await getPublishedPosts();

  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE_URL}/insights`,
    url: `${SITE_URL}/insights`,
    name: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    inLanguage: "ko",
    isPartOf: { "@type": "WebSite", name: "준이아빠블로그", url: SITE_URL },
  };

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "전체 인사이트 글",
    numberOfItems: posts.length,
    itemListOrder: "https://schema.org/ItemListOrderDescending",
    itemListElement: posts.slice(0, 30).map((post, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      url: `${SITE_URL}/insights/${post.slug}`,
      name: post.title,
    })),
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Insights", item: `${SITE_URL}/insights` },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <ListViewTracker eventName="view_insights_list" />
      {/* Hero Section */}
      <section className="mb-6 sm:mb-12">
        <NeoTiltCard className="bg-white neo-border-thick neo-shadow-lg p-4 sm:p-8 md:p-12 relative overflow-hidden text-left" intensity={20} shadowIntensity={10}>
          <div className="absolute top-0 right-0 w-24 sm:w-32 h-full bg-[#FF0033] hidden sm:block" style={{ clipPath: "polygon(20% 0, 100% 0, 100% 100%, 0% 100%)", zIndex: 0 }} />
          <div className="relative z-10">
            <h1 className="text-2xl sm:text-4xl md:text-6xl font-black uppercase text-black tracking-tighter mb-2 sm:mb-4 leading-tight">
              <span className="text-[#FF0033]">Insights</span>
            </h1>
            <p className="inline-block bg-black text-white font-bold px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm uppercase tracking-widest border-2 border-black transform -skew-x-6 mb-4">
              {posts.length}개의 글
            </p>
            <p className="text-sm sm:text-base text-[#222] font-medium max-w-lg border-l-4 border-[#FF0033] pl-4">
              디지털 마케팅, AI, 데이터 분석 전문가의 인사이트를 담는 지식 아카이브
            </p>
          </div>
        </NeoTiltCard>
      </section>

      {/* Results Count */}
      <div className="mb-3 sm:mb-6">
        <span className="font-mono text-xs sm:text-sm text-muted-foreground">
          {posts.length}개의 글
        </span>
      </div>

      {/* Posts Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
        {posts.map((post, index) => {
          const Icon = categoryIcons[post.category as keyof typeof categoryIcons];
          return (
            <Link key={post.id} href={`/insights/${post.slug}`}>
              <NeoTiltCard className={`h-full ${index % 3 === 0 ? 'tape-top mt-4' : index % 3 === 1 ? 'zigzag-bottom sm:mb-4' : ''}`}>
                <NeoCardHeader>
                  <div className="flex items-center justify-between gap-2 mb-2 sm:mb-3 flex-wrap relative z-10">
                    <NeoBadge
                      variant={
                        post.category === "AI_TECH"
                          ? "ai"
                          : post.category === "DATA"
                            ? "data"
                            : "marketing"
                      }
                      className="transform -rotate-1 hover:rotate-0 transition-transform"
                    >
                      <span className="flex items-center gap-1">
                        <Icon className="w-3 h-3" />
                        {categoryLabels[post.category as keyof typeof categoryLabels]}
                      </span>
                    </NeoBadge>
                  </div>
                  <NeoCardTitle className="text-base sm:text-2xl leading-snug">
                    {post.title}
                  </NeoCardTitle>
                  <NeoCardDescription className="text-xs sm:text-base line-clamp-2">
                    {post.excerpt}
                  </NeoCardDescription>
                </NeoCardHeader>
                <NeoCardContent>
                  <div className="flex flex-wrap gap-1">
                    {post.tags.slice(0, 3).map((tag) => (
                      <NeoTagBadge key={tag} tag={tag} clickable={false} className="text-[10px] sm:text-[10px] px-1.5 sm:px-2 py-0.5" />
                    ))}
                  </div>
                </NeoCardContent>
                <NeoCardFooter className="flex items-center justify-between">
                  <span className="text-xs sm:text-xs font-mono text-muted-foreground">
                    {post.createdAt.toLocaleDateString("ko-KR")}
                  </span>
                  <span className="flex items-center gap-1 text-xs sm:text-sm font-bold uppercase text-[#FF0033]">
                    Read <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                  </span>
                </NeoCardFooter>
              </NeoTiltCard>
            </Link>
          );
        })}
      </section>

      {posts.length === 0 && (
        <div className="text-center py-8 sm:py-12">
          <p className="text-sm sm:text-base text-muted-foreground">아직 작성된 글이 없습니다.</p>
        </div>
      )}
    </div>
  );
}
