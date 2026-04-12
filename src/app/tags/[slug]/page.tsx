import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Tag, ArrowRight, Sparkles, Database, TrendingUp } from "lucide-react";
import { NeoCardHeader, NeoCardTitle, NeoCardContent, NeoCardFooter } from "@/components/neo";
import { NeoBadge } from "@/components/neo";
import { NeoTagBadge } from "@/components/neo";
import { NeoTiltCard } from "@/components/neo";
import { getAllTagsWithId, getContentByTag } from "@/lib/content";
import { ViewTracker } from "@/components/ViewTracker";
import { SITE_URL } from "@/lib/constants";

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
    slug: encodeURIComponent(tag.name),
  }));
}

export async function generateMetadata(
  { params }: { params: Promise<Params> },
): Promise<Metadata> {
  const { slug } = await params;
  const tagName = decodeURIComponent(slug);
  const title = `#${tagName} 태그 · Hongblog`;
  const description = `${tagName} 태그가 붙은 인사이트 모음`;
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
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
              <span className="text-[#FF0033]">#{tagName}</span>
            </h1>
            <p className="text-sm sm:text-base text-[#222] font-medium max-w-lg border-l-4 border-[#FF0033] pl-4">
              {tagName} 태그가 붙은 콘텐츠
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

      {content.posts.length > 0 ? (
        <section className="mb-8">
          <h2 className="text-lg sm:text-xl font-black uppercase mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5" /> <span className="comic-emphasis">Insights</span>
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
      ) : (
        <div className="text-center py-12">
          <Tag className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-lg font-bold">해당 태그의 콘텐츠가 없습니다</p>
        </div>
      )}
    </div>
  );
}
