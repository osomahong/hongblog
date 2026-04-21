import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
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
import { NeoButton } from "@/components/neo";
import { NeoTagBadge } from "@/components/neo";
import { NeoTiltCard } from "@/components/neo";
import {
  getPublishedPosts,
  getTrendingMixed,
  getCategoryStats,
  getAllTagsWithId,
} from "@/lib/content";
import type { TrendingItem } from "@/lib/types";
import { TrackedLink } from "@/components/TrackedLink";

const categoryIcons: Record<string, any> = {
  AI_TECH: Sparkles,
  DATA: Database,
  MARKETING: TrendingUp,
  맛집: TrendingUp,
  강의: Sparkles,
  문화생활: Database,
  여행: TrendingUp,
  일상: Database,
};

const categoryLabels: Record<string, string> = {
  AI_TECH: "AI & Tech",
  DATA: "Data",
  MARKETING: "Marketing",
  맛집: "맛집",
  강의: "강의",
  문화생활: "문화생활",
  여행: "여행",
  일상: "일상",
};

const categoryColors: Record<string, string> = {
  AI_TECH: "bg-ai sm:bg-ai text-black",
  DATA: "bg-data sm:bg-data text-white",
  MARKETING: "bg-marketing sm:bg-marketing text-white",
  맛집: "bg-orange-500 sm:bg-orange-500 text-white",
  강의: "bg-black sm:bg-black text-white",
  문화생활: "bg-purple-500 sm:bg-purple-500 text-white",
  여행: "bg-green-500 sm:bg-green-500 text-white",
  일상: "bg-gray-500 sm:bg-gray-500 text-white",
};

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: { canonical: SITE_URL },
};

export default async function HomePage() {
  const posts = getPublishedPosts();
  const trending = getTrendingMixed(7, 4);
  const categoryStats = getCategoryStats();
  const allTags = getAllTagsWithId();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 relative">
      {/* Background Graphic Decorations — Homepage Only */}
      <div className="bg-graphic-1 hidden sm:block" />
      <div className="bg-graphic-2 hidden sm:block" />

      {/* Hero Section — White Edition */}
      <section className="mb-6 sm:mb-12 animate-stamp">
        <NeoTiltCard className="bg-white neo-border-thick neo-shadow-lg p-4 sm:p-8 md:p-12 relative overflow-hidden text-left" intensity={20} shadowIntensity={10}>
          {/* 우측 빨간 사선 장식 */}
          <div className="absolute top-0 right-0 w-24 sm:w-32 h-full bg-[#FF0033] hidden sm:block" style={{ clipPath: "polygon(20% 0, 100% 0, 100% 100%, 0% 100%)", zIndex: 0 }} />

          <div className="flex items-center justify-between relative z-10">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-4xl md:text-6xl font-black uppercase text-black tracking-tighter mb-2 sm:mb-4 leading-tight">
                준이아빠 <span className="text-[113%] text-[#FF0033] align-baseline">Insights</span>
              </h1>
              <p className="inline-block bg-black text-white font-bold px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm uppercase tracking-widest border-2 border-black transform -skew-x-6 mb-4 sm:mb-6">
                AI-Enhanced Tech Wiki
              </p>
              <p className="text-sm sm:text-base md:text-lg text-[#222] font-medium max-w-lg border-l-4 border-[#FF0033] pl-4 leading-relaxed">
                디지털 마케팅, AI, 데이터 분석 전문가의 인사이트를 담는 지식 아카이브
              </p>
            </div>
            {/* Profile Illustration */}
            <div className="hidden md:block relative z-10 flex-shrink-0">
              <div className="relative w-28 h-28 lg:w-36 lg:h-36 xl:w-40 xl:h-40 bg-white rounded-full border-4 border-black overflow-hidden neo-shadow">
                <Image
                  src="/profile-illustration.png"
                  alt="Author Profile"
                  fill
                  className="object-cover object-top scale-125"
                  priority
                />
              </div>
            </div>
          </div>
        </NeoTiltCard>
      </section>

      {/* Trending Section */}
      {trending.length > 0 && (
        <section className="mb-6 sm:mb-12">
          <h2 className="text-lg sm:text-2xl font-black uppercase tracking-tight mb-4 sm:mb-6 border-b-4 border-black pb-2 flex items-center gap-3">
            <span className="w-4 h-4 bg-[#FF0033] inline-block" />
            Trending Now
            <span className="text-[10px] sm:text-xs text-muted-foreground font-mono font-normal normal-case tracking-normal ml-auto">최근 7일 인기</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 sm:gap-4 divide-y divide-gray-200 sm:divide-y-0">
            {trending.map((item, index) => {
              const Icon = categoryIcons[item.category as keyof typeof categoryIcons] || Sparkles;
              const rotations = ["", "sm:rotate-1", "", "sm:rotate-0.5"];

              return (
                  <TrackedLink
                    key={`post-${item.id}`}
                    href={`/insights/${item.slug}`}
                    eventName="click_main_trendingnow"
                    contentTitle={item.title}
                    contentId={item.id}
                  >
                    <NeoTiltCard className="h-full bg-white p-3 sm:p-4 halftone-corner" intensity={10}>
                      <div className="flex items-center gap-2 mb-2 sm:mb-3 relative z-10">
                        <div className={`${categoryColors[item.category as keyof typeof categoryColors] || "bg-gray-500 text-white"} px-2 py-0.5 sm:py-1 border-2 border-black text-[10px] sm:text-xs font-bold uppercase flex items-center gap-1`}>
                          <Icon className="w-3 h-3" />
                          {categoryLabels[item.category as keyof typeof categoryLabels] || item.category}
                        </div>
                      </div>
                      <h3 className="font-black text-base sm:text-lg leading-snug line-clamp-2 mb-1.5 sm:mb-2 relative z-10">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-xs text-muted-foreground line-clamp-2 relative z-10 leading-relaxed">
                        {item.excerpt || ""}
                      </p>
                    </NeoTiltCard>
                  </TrackedLink>
                );
            })}
          </div>
        </section>
      )}

      {/* Browse by Category */}
      {categoryStats.length > 0 && categoryStats.some(stat => stat.postCount > 0) && (
        <section className="mb-6 sm:mb-12">
          <h2 className="text-lg sm:text-2xl font-black uppercase tracking-tight mb-4 sm:mb-6 border-b-4 border-black pb-2 flex items-center gap-3">
            <span className="w-4 h-4 bg-black inline-block transform rotate-45" />
            Browse by Category
          </h2>
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            {categoryStats.map((stat) => {
              const Icon = categoryIcons[stat.category];
              const bgColor = categoryColors[stat.category];
              return (
                <TrackedLink
                  key={stat.category}
                  href="/insights"
                  eventName="click_main_browsebycategory"
                  contentTitle={`카테고리 - ${categoryLabels[stat.category]}`}
                  contentId={stat.category}
                >
                  <NeoTiltCard className={`${bgColor} border-3 sm:border-4 border-black p-2.5 sm:p-6 hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all`} intensity={15}>
                    <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-3 mb-1.5 sm:mb-3">
                      <Icon className="w-5 h-5 sm:w-8 sm:h-8" />
                      <span className="text-xs sm:text-xl font-black uppercase text-center sm:text-left">
                        {categoryLabels[stat.category]}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-0.5 sm:gap-4 text-[10px] sm:text-sm font-mono text-center sm:text-left">
                      <span>{stat.postCount} posts</span>
                    </div>
                  </NeoTiltCard>
                </TrackedLink>
              );
            })}
          </div>
        </section>
      )}

      {/* Latest Insights */}
      {posts.length > 0 && (
        <section className="mb-6 sm:mb-12">
          <h2 className="text-lg sm:text-2xl font-black uppercase tracking-tight mb-4 sm:mb-6 border-b-4 border-black pb-2 flex items-center gap-3">
            <span className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-[#FF0033] border-b-[8px] border-b-transparent inline-block" />
            Latest Insights
            <span className="text-xs sm:text-sm text-muted-foreground font-normal normal-case tracking-normal ml-auto">{posts.length}개의 글</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 sm:gap-6 divide-y divide-gray-200 sm:divide-y-0">
            {posts.slice(0, 6).map((post, index) => {
              const Icon = categoryIcons[post.category as keyof typeof categoryIcons] || Sparkles;
              return (
                <TrackedLink
                  key={post.id}
                  href={`/insights/${post.slug}`}
                  eventName="click_main_latestinsights"
                  contentTitle={post.title}
                  contentId={post.id}
                >
                  <NeoTiltCard className={`h-full ${index === 0 ? 'tape-top mt-4' : index % 3 === 2 ? 'zigzag-bottom mb-4' : ''}`}>
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
                          className="transform -rotate-2 hover:rotate-0 transition-transform"
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
                        {post.createdAt ? new Date(post.createdAt).toLocaleDateString("ko-KR") : ""}
                      </span>
                      <span className="flex items-center gap-1 text-xs sm:text-sm font-bold uppercase text-[#FF0033]">
                        Read <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                      </span>
                    </NeoCardFooter>
                  </NeoTiltCard>
                </TrackedLink>
              );
            })}
          </div>
          {posts.length > 6 && (
            <div className="mt-4 sm:mt-6 text-center">
              <Link href="/insights">
                <NeoButton variant="outline" size="lg" className="text-sm sm:text-base">
                  모든 글 보기 ({posts.length}개) <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
                </NeoButton>
              </Link>
            </div>
          )}
        </section>
      )}
      {/* Logs/FAQ sections removed — content types no longer exist */}

      {/* Explore Tags */}
      {allTags.length > 0 && (
        <section className="mb-6 sm:mb-12">
          <h2 className="text-lg sm:text-2xl font-black uppercase tracking-tight mb-3 sm:mb-4 border-b-4 border-black pb-2 flex items-center gap-3">
            <span className="w-4 h-4 bg-[#FF0033] inline-block" />
            Explore Tags
          </h2>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {allTags.map((tag) => (
              <NeoTagBadge key={tag.id} tag={tag.name} className="text-[10px] sm:text-xs hover:scale-105 transition-transform" />
            ))}
          </div>
        </section>
      )}

      {/* About Author CTA */}
      <section>
        <Link href="/about">
          <NeoTiltCard className="bg-black text-white neo-border-thick p-4 sm:p-8 sm:rotate-0.5 neo-shadow-lg hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all group halftone-corner" intensity={15}>
            <div className="flex items-center gap-3 sm:gap-6">
              <div className="bg-primary p-2 sm:p-3 border-2 border-white -rotate-3 group-hover:rotate-0 transition-transform flex-shrink-0">
                <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm sm:text-xl font-black uppercase mb-1 sm:mb-2">About the Author</h3>
                <p className="text-xs sm:text-base text-gray-300 leading-relaxed">
                  마케팅을 데이터로 설명하는 사람. 복잡한 상황을 이해 가능한 형태로 정리합니다.
                </p>
              </div>
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-[#FF0033] group-hover:translate-x-2 transition-transform flex-shrink-0" />
            </div>
          </NeoTiltCard>
        </Link>
      </section>
    </div>
  );
}
