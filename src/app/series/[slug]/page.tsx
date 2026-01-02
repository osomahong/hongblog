import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle, Circle, Sparkles, Database, TrendingUp } from "lucide-react";
import { NeoCard, NeoCardHeader, NeoCardTitle, NeoCardDescription, NeoCardContent } from "@/components/neo";
import { NeoBadge } from "@/components/neo";
import { NeoButton } from "@/components/neo";
import { NeoTagBadge } from "@/components/neo";
import { absoluteUrl } from "@/lib/utils";
import { getSeriesBySlug } from "@/lib/queries";

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
      <header className="mb-8 sm:mb-12">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 border-4 border-black neo-shadow-lg p-5 sm:p-8 -rotate-1">
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
        </div>
      </header>

      {/* Posts List */}
      <section>
        <h2 className="text-xl sm:text-2xl font-black uppercase mb-4 sm:mb-6 flex items-center gap-2">
          <span className="bg-black text-white px-3 py-1">목차</span>
        </h2>
        
        <div className="space-y-4">
          {seriesData.posts.map((post, index) => {
            const Icon = categoryIcons[post.category as keyof typeof categoryIcons] || Sparkles;
            return (
              <Link key={post.id} href={`/insights/${post.slug}`}>
                <NeoCard hover className="flex items-start gap-4 p-4 sm:p-6">
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-black text-white flex items-center justify-center font-black text-lg sm:text-xl border-2 border-black">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <NeoBadge variant={post.category === "AI_TECH" ? "primary" : "default"}>
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
                    <h3 className="text-lg sm:text-xl font-bold mb-1 line-clamp-1">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
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
                  <ArrowRight className="w-5 h-5 flex-shrink-0 text-muted-foreground" />
                </NeoCard>
              </Link>
            );
          })}
        </div>

        {seriesData.posts.length === 0 && (
          <div className="text-center py-12 border-4 border-dashed border-gray-300">
            <p className="text-muted-foreground">이 시리즈에 아직 글이 없습니다.</p>
          </div>
        )}
      </section>
    </div>
  );
}
