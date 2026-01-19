import { Suspense } from "react";
import Link from "next/link";
import { Tag, ArrowRight, Sparkles, Database, TrendingUp, CheckCircle } from "lucide-react";
import { NeoCard, NeoCardHeader, NeoCardTitle, NeoCardContent, NeoCardFooter } from "@/components/neo";
import { NeoBadge } from "@/components/neo";
import { NeoTagBadge } from "@/components/neo";
import { getAllTags, getContentByTag } from "@/lib/queries";
import { NeoTiltCard } from "@/components/neo";
import { ViewTracker } from "@/components/ViewTracker";

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

type Props = {
  searchParams: Promise<{ tag?: string }>;
};

async function TagContent({ selectedTag }: { selectedTag?: string }) {
  const allTags = await getAllTags();
  const content = selectedTag ? await getContentByTag(selectedTag) : null;

  return (
    <>
      {/* Tag Cloud */}
      <section className="mb-6 sm:mb-8">
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <Link
              key={tag.id}
              href={`/tags?tag=${encodeURIComponent(tag.name)}`}
              className={`px-3 py-1.5 text-xs sm:text-sm font-bold uppercase border-2 border-black transition-all ${selectedTag === tag.name
                ? "bg-black text-white"
                : "bg-white text-black hover:bg-gray-100"
                }`}
            >
              #{tag.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Results */}
      {selectedTag && content && (
        <>
          <ViewTracker
            contentType="tags"
            contentTitle={`Tag: ${selectedTag}`}
            contentSlug={selectedTag}
          />
          <div className="mb-4 sm:mb-6">
            <span className="font-mono text-xs sm:text-sm text-muted-foreground">
              {content.posts.length + content.faqs.length} results for #{selectedTag}
            </span>
          </div>

          {/* Insights Section */}
          {content.posts.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg sm:text-xl font-black uppercase mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5" /> <span className="comic-emphasis">Insights</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {content.posts.map((post, index) => {
                  const Icon = categoryIcons[post.category as keyof typeof categoryIcons];
                  return (
                    <Link key={post.id} href={`/insights/${post.slug}`}>
                      <NeoTiltCard className={`h-full ${index % 2 === 0 ? "-rotate-0.5" : "rotate-0.5"}`}>
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
                                <Icon className="w-3 h-3" />
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
                              <NeoTagBadge key={tag} tag={tag} clickable={false} className="text-[10px] px-2 py-0.5" />
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

          {/* FAQ Section */}
          {content.faqs.length > 0 && (
            <section>
              <h2 className="text-lg sm:text-xl font-black uppercase mb-4 flex items-center gap-2">
                <Tag className="w-5 h-5" /> <span className="comic-emphasis">FAQ</span>
              </h2>
              <div className="space-y-3">
                {content.faqs.map((faq, index) => {
                  const Icon = categoryIcons[faq.category as keyof typeof categoryIcons];
                  return (
                    <Link key={faq.id} href={`/faq/${faq.slug}`}>
                      <NeoTiltCard
                        className={`${index % 3 === 0 ? "-rotate-0.5" : index % 3 === 1 ? "rotate-0.5" : ""} p-4 sm:p-6`}
                      >
                        <NeoCardHeader className="mb-2">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <NeoBadge
                              variant={
                                faq.category === "AI_TECH"
                                  ? "primary"
                                  : faq.category === "DATA"
                                    ? "default"
                                    : "accent"
                              }
                            >
                              <span className="flex items-center gap-1">
                                <Icon className="w-3 h-3" />
                                {categoryLabels[faq.category as keyof typeof categoryLabels]}
                              </span>
                            </NeoBadge>
                            {/* Removed invalid isVerified check */}
                          </div>
                          <NeoCardTitle className="text-lg">{faq.question}</NeoCardTitle>
                        </NeoCardHeader>
                        <NeoCardContent>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {faq.answer}
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {faq.tags.map((tag) => (
                              <NeoTagBadge key={tag} tag={tag} clickable={false} className="text-[10px] px-2 py-0.5" />
                            ))}
                          </div>
                        </NeoCardContent>
                      </NeoTiltCard>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {content.posts.length === 0 && content.faqs.length === 0 && (
            <div className="text-center py-12">
              <Tag className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg font-bold">해당 태그의 콘텐츠가 없습니다</p>
            </div>
          )}
        </>
      )}

      {!selectedTag && (
        <div className="text-center py-12">
          <Tag className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-lg font-bold">태그를 선택해주세요</p>
          <p className="text-sm text-muted-foreground">위의 태그를 클릭하면 관련 콘텐츠를 볼 수 있습니다</p>
        </div>
      )}
    </>
  );
}

import { ListViewTracker } from "@/components/ListViewTracker";

export default async function TagsPage({ searchParams }: Props) {
  const { tag } = await searchParams;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
      <ListViewTracker eventName="view_tags_list" />
      {/* Hero Section */}
      <section className="mb-8 sm:mb-12">
        <NeoTiltCard className="bg-gradient-to-br from-purple-600 to-fuchsia-700 border-4 border-black p-5 sm:p-8 md:p-12 -rotate-1 halftone-corner text-left" intensity={20} shadowIntensity={10}>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black uppercase text-white tracking-tighter mb-2 sm:mb-4 relative z-10">
            <span className="text-accent comic-emphasis">Tags</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-2xl relative z-10">
            태그별로 Insights와 FAQ를 탐색하세요
          </p>
        </NeoTiltCard>
      </section>

      <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
        <TagContent selectedTag={tag} />
      </Suspense>
    </div>
  );
}
