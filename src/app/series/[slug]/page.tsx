import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle, Circle, Sparkles, Database, TrendingUp } from "lucide-react";
import { NeoCard, NeoCardHeader, NeoCardTitle, NeoCardDescription, NeoCardContent, NeoAccordion } from "@/components/neo";
import { NeoBadge } from "@/components/neo";
import { NeoButton } from "@/components/neo";
import { NeoTagBadge } from "@/components/neo";
import { absoluteUrl } from "@/lib/utils";
import { getSeriesBySlug } from "@/lib/queries";
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

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const seriesData = await getSeriesBySlug(slug);

  if (!seriesData) {
    return { title: "Not Found" };
  }

  const effectiveTitle = seriesData.metaTitle || `${seriesData.title} 시리즈`;
  const effectiveDescription = seriesData.metaDescription || seriesData.description || "";

  return {
    title: effectiveTitle,
    description: effectiveDescription,
    openGraph: {
      title: effectiveTitle,
      description: effectiveDescription,
      type: "website",
      url: absoluteUrl(`/series/${slug}`),
      images: seriesData.thumbnailUrl ? [{ url: seriesData.thumbnailUrl, width: 1200, height: 630 }] : undefined,
    },
  };
}

export default async function SeriesDetailPage({ params }: Props) {
  const { slug } = await params;
  const seriesData = await getSeriesBySlug(slug);

  if (!seriesData) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
      <Link href="/series" className="inline-flex items-center gap-2 mb-6 sm:mb-8 group">
        <NeoButton variant="outline" size="sm" className="text-xs sm:text-sm">
          <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1" /> 시리즈 목록
        </NeoButton>
      </Link>

      {/* Series Header */}
      {/* Series Header */}
      <header className="mb-8 sm:mb-12">
        <NeoTiltCard className="bg-gradient-to-br from-violet-600 to-indigo-700 border-4 border-black p-5 sm:p-8 -rotate-1 text-left" intensity={20} shadowIntensity={10}>
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-6 h-6 text-white" />
            <NeoBadge variant="accent">
              {seriesData.postCount}편 시리즈
            </NeoBadge>
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black uppercase text-white tracking-tighter mb-3 comic-emphasis">
            {seriesData.title}
          </h1>
          {seriesData.description && (
            <p className="text-base sm:text-lg text-white/90 max-w-3xl">
              {seriesData.description}
            </p>
          )}
        </NeoTiltCard>
      </header>

      {/* Posts List */}
      <section>
        <h2 className="text-xl sm:text-2xl font-black uppercase mb-4 sm:mb-6 flex items-center gap-2">
          <span className="bg-black text-white px-3 py-1">목차</span>
        </h2>

        <NeoAccordion title="전체 목록" defaultOpen={true}>
          <div className="space-y-2">
            {seriesData.posts.map((post, index) => {
              const Icon = categoryIcons[post.category as keyof typeof categoryIcons] || Sparkles;
              return (
                <Link key={post.id} href={`/insights/${post.slug}`}>
                  <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 border-2 border-black bg-white hover:bg-accent transition-colors group">
                    {/* Number */}
                    <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-black text-white flex items-center justify-center font-black text-sm sm:text-lg">
                      {index + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <NeoBadge variant={post.category === "AI_TECH" ? "ai" : post.category === "DATA" ? "data" : "marketing"}>
                          <span className="flex items-center gap-1">
                            <Icon className="w-3 h-3" />
                            {categoryLabels[post.category as keyof typeof categoryLabels]}
                          </span>
                        </NeoBadge>
                        {post.highlights && (post.highlights as string[]).length > 0 && (
                          <span className="text-xs font-mono font-bold bg-accent text-black px-2 py-0.5 border border-black">
                            {(post.highlights as string[])[0]}
                          </span>
                        )}
                      </div>
                      <h3 className="text-base sm:text-lg font-bold mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mb-2">
                          {post.excerpt}
                        </p>
                      )}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono text-muted-foreground">
                          {post.createdAt.toLocaleDateString("ko-KR")}
                        </span>
                        {post.tags.slice(0, 3).map((tag) => (
                          <NeoTagBadge key={tag} tag={tag} clickable={false} className="text-[10px] px-2 py-0.5" />
                        ))}
                      </div>
                    </div>

                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </Link>
              );
            })}
          </div>
        </NeoAccordion>

        {seriesData.posts.length === 0 && (
          <div className="text-center py-12 border-4 border-dashed border-gray-300">
            <p className="text-muted-foreground">이 시리즈에 아직 글이 없습니다.</p>
          </div>
        )}
      </section>
    </div>
  );
}
