import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Database, TrendingUp, Flame, HelpCircle, Tag, FolderOpen, Zap, Hash } from "lucide-react";
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
  getPopularFaqs,
  getAllTags,
  TrendingItem,
} from "@/lib/queries";

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

const categoryColors = {
  AI_TECH: "bg-ai text-black",
  DATA: "bg-data text-white",
  MARKETING: "bg-marketing text-white",
};

export default async function HomePage() {
  const [posts, trending, categoryStats, popularFaqs, allTags] = await Promise.all([
    getPublishedPosts(),
    getTrendingMixed(7, 4),
    getCategoryStats(),
    getPopularFaqs(30, 5),
    getAllTags(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
      {/* Hero Section */}
      {/* Hero Section */}
      <section className="mb-6 sm:mb-12">
        <NeoTiltCard className="bg-gradient-to-br from-red-600 to-orange-600 border-4 border-black p-4 sm:p-8 md:p-12 sm:-rotate-1 halftone-corner speed-lines relative overflow-hidden text-left" intensity={20} shadowIntensity={10}>
          <div className="flex items-center justify-between">
            <div className="relative z-10 flex-1">
              <h1 className="text-2xl sm:text-4xl md:text-6xl font-black uppercase text-white tracking-tighter mb-2 sm:mb-4 comic-emphasis leading-tight">
                Insights
              </h1>
              <p className="text-sm sm:text-lg md:text-xl text-white/90 max-w-xl leading-relaxed">
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
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="bg-orange-500 border-3 sm:border-4 border-black p-1.5 sm:p-2 -rotate-3 punk-burst">
              <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-2xl font-black uppercase tracking-tight comic-emphasis">Trending Now</h2>
              <span className="text-[10px] sm:text-xs text-muted-foreground font-mono">최근 7일 인기 콘텐츠</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {trending.map((item, index) => {
              const Icon = categoryIcons[item.category as keyof typeof categoryIcons];
              const rotations = ["", "sm:rotate-1", "", "sm:rotate-0.5"];

              if (item._type === "post") {
                return (
                  <Link key={`post-${item.id}`} href={`/insights/${item.slug}`}>
                    <NeoTiltCard className="h-full bg-white p-3 sm:p-4 halftone-corner" intensity={10}>
                      <div className="flex items-center gap-2 mb-2 sm:mb-3 relative z-10">
                        <div className={`${categoryColors[item.category as keyof typeof categoryColors]} px-2 py-0.5 sm:py-1 border-2 border-black text-[10px] sm:text-xs font-bold uppercase flex items-center gap-1`}>
                          <Icon className="w-3 h-3" />
                          {categoryLabels[item.category as keyof typeof categoryLabels]}
                        </div>
                      </div>
                      <h3 className="font-black text-sm sm:text-lg leading-snug line-clamp-2 mb-1.5 sm:mb-2 relative z-10">
                        {item.title}
                      </h3>
                      <p className="text-[11px] sm:text-xs text-muted-foreground line-clamp-2 relative z-10 leading-relaxed">
                        {item.excerpt}
                      </p>
                    </NeoTiltCard>
                  </Link>
                );
              } else {
                return (
                  <Link key={`faq-${item.id}`} href={`/faq/${item.slug}`}>
                    <NeoTiltCard className="h-full bg-accent p-3 sm:p-4 halftone-corner" intensity={10}>
                      <div className="flex items-center gap-2 mb-2 sm:mb-3 relative z-10">
                        <div className="bg-black text-white px-2 py-0.5 sm:py-1 border-2 border-black text-[10px] sm:text-xs font-bold uppercase flex items-center gap-1">
                          <HelpCircle className="w-3 h-3" />
                          FAQ
                        </div>
                      </div>
                      <h3 className="font-black text-sm sm:text-lg leading-snug line-clamp-2 mb-1.5 sm:mb-2 relative z-10">
                        Q: {item.question}
                      </h3>
                      <p className="text-[11px] sm:text-xs text-muted-foreground line-clamp-2 relative z-10 leading-relaxed">
                        {item.answer.substring(0, 80)}...
                      </p>
                    </NeoTiltCard>
                  </Link>
                );
              }
            })}
          </div>
        </section>
      )}

      {/* Browse by Category */}
      <section className="mb-6 sm:mb-12">
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div className="bg-black border-3 sm:border-4 border-black p-1.5 sm:p-2 rotate-3">
            <FolderOpen className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <h2 className="text-lg sm:text-2xl font-black uppercase comic-emphasis">Browse by Category</h2>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          {categoryStats.map((stat) => {
            const Icon = categoryIcons[stat.category];
            const bgColor = categoryColors[stat.category];
            return (
              <Link key={stat.category} href={`/category/${stat.category.toLowerCase()}`}>
                <NeoTiltCard className={`${bgColor} border-3 sm:border-4 border-black p-2.5 sm:p-6 hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all`} intensity={15}>
                  <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-3 mb-1.5 sm:mb-3">
                    <Icon className="w-5 h-5 sm:w-8 sm:h-8" />
                    <span className="text-[10px] sm:text-xl font-black uppercase text-center sm:text-left">
                      {categoryLabels[stat.category]}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-0.5 sm:gap-4 text-[9px] sm:text-sm font-mono text-center sm:text-left">
                    <span>{stat.postCount} posts</span>
                    <span>{stat.faqCount} faqs</span>
                  </div>
                </NeoTiltCard>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Latest Insights */}
      <section className="mb-6 sm:mb-12">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="bg-primary border-3 sm:border-4 border-black p-1.5 sm:p-2 -rotate-2">
              <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h2 className="text-lg sm:text-2xl font-black uppercase comic-emphasis">Latest Insights</h2>
          </div>
          <span className="text-[10px] sm:text-sm text-muted-foreground">{posts.length}개의 글</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {posts.slice(0, 6).map((post, index) => {
            const Icon = categoryIcons[post.category as keyof typeof categoryIcons];
            return (
              <Link key={post.id} href={`/insights/${post.slug}`}>
                <NeoTiltCard className="h-full">
                  <NeoCardHeader>
                    <div className="flex items-center justify-between gap-2 mb-2 sm:mb-3 flex-wrap">
                      <NeoBadge
                        variant={
                          post.category === "AI_TECH"
                            ? "ai"
                            : post.category === "DATA"
                              ? "data"
                              : "marketing"
                        }
                      >
                        <span className="flex items-center gap-1">
                          <Icon className="w-3 h-3" />
                          {categoryLabels[post.category as keyof typeof categoryLabels]}
                        </span>
                      </NeoBadge>
                      {post.highlights && (post.highlights as string[]).length > 0 && (
                        <div className="flex gap-1 flex-wrap">
                          {(post.highlights as string[]).slice(0, 1).map((highlight, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] sm:text-xs font-mono font-bold bg-black text-white px-1.5 sm:px-2 py-0.5 sm:py-1"
                            >
                              {highlight}
                            </span>
                          ))}
                        </div>
                      )}
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
                        <NeoTagBadge key={tag} tag={tag} clickable={false} className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5" />
                      ))}
                    </div>
                  </NeoCardContent>
                  <NeoCardFooter className="flex items-center justify-between">
                    <span className="text-[10px] sm:text-xs font-mono text-muted-foreground">
                      {post.createdAt.toLocaleDateString("ko-KR")}
                    </span>
                    <span className="flex items-center gap-1 text-xs sm:text-sm font-bold uppercase">
                      Read <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                    </span>
                  </NeoCardFooter>
                </NeoTiltCard>
              </Link>
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

      {/* Popular FAQs */}
      {popularFaqs.length > 0 && (
        <section className="mb-6 sm:mb-12">
          <div className="bg-accent border-3 sm:border-4 border-black neo-shadow p-4 sm:p-6 sm:rotate-0.5 halftone-bg">
            <div className="flex items-center justify-between mb-3 sm:mb-4 relative z-10">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="bg-black border-3 sm:border-4 border-black p-1.5 sm:p-2 rotate-2">
                  <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h2 className="text-lg sm:text-2xl font-black uppercase comic-emphasis">Popular FAQs</h2>
              </div>
              <Link href="/faq">
                <NeoButton variant="secondary" size="sm" className="text-[10px] sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5">
                  전체 보기 <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-0.5 sm:ml-1" />
                </NeoButton>
              </Link>
            </div>
            <ul className="space-y-2 sm:space-y-3 relative z-10">
              {popularFaqs.map((faq) => (
                <li key={faq.id}>
                  <Link
                    href={`/faq/${faq.slug}`}
                    className="block p-2.5 sm:p-4 bg-white border-2 border-black hover:translate-x-1 hover:translate-y-1 hover:shadow-none neo-shadow-sm transition-all speech-bubble"
                  >
                    <div className="flex items-start gap-2 sm:gap-3">
                      <span className="text-primary font-black text-base sm:text-lg">Q</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-xs sm:text-base leading-snug">{faq.question}</p>
                        <div className="flex gap-1 sm:gap-1.5 mt-1.5 sm:mt-2 flex-wrap">
                          {faq.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="text-[10px] sm:text-xs text-muted-foreground">#{tag}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Explore Tags */}
      {allTags.length > 0 && (
        <section className="mb-6 sm:mb-12">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="bg-accent border-3 sm:border-4 border-black p-1.5 sm:p-2 -rotate-3">
              <Hash className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
            </div>
            <h2 className="text-lg sm:text-2xl font-black uppercase comic-emphasis">Explore Tags</h2>
          </div>
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
          <NeoTiltCard className="bg-gradient-to-br from-neutral-900 to-black text-white border-3 sm:border-4 border-black p-4 sm:p-8 sm:rotate-0.5 hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all group" intensity={15}>
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
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-accent group-hover:translate-x-2 transition-transform flex-shrink-0" />
            </div>
          </NeoTiltCard>
        </Link>
      </section>
    </div>
  );
}
