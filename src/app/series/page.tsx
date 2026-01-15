import Link from "next/link";
import { ArrowRight, BookOpen, FileText } from "lucide-react";
import { NeoCard, NeoCardHeader, NeoCardTitle, NeoCardDescription, NeoCardContent, NeoCardFooter } from "@/components/neo";
import { NeoBadge } from "@/components/neo";
import { getPublishedSeries } from "@/lib/queries";
import { NeoTiltCard } from "@/components/neo";

export const metadata = {
  title: "시리즈 | Insights",
  description: "주제별로 묶인 시리즈 콘텐츠를 확인하세요.",
};

export default async function SeriesPage() {
  const seriesList = await getPublishedSeries();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
      {/* Hero Section */}
      <section className="mb-8 sm:mb-12">
        <NeoTiltCard className="bg-gradient-to-br from-violet-600 to-indigo-700 border-4 border-black p-5 sm:p-8 md:p-12 -rotate-1 halftone-corner speed-lines text-left" intensity={20} shadowIntensity={10}>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black uppercase text-white tracking-tighter mb-2 sm:mb-4 relative z-10 comic-emphasis flex items-center gap-3">
            <BookOpen className="w-8 h-8 sm:w-12 sm:h-12" />
            Series
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-2xl relative z-10">
            연관된 주제의 글들을 시리즈로 묶어 체계적으로 학습하세요
          </p>
        </NeoTiltCard>
      </section>

      {/* Results Count */}
      <div className="mb-4 sm:mb-6">
        <span className="font-mono text-xs sm:text-sm text-muted-foreground">
          {seriesList.length}개의 시리즈
        </span>
      </div>

      {/* Series Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {seriesList.map((s, index) => (
          <Link key={s.id} href={`/series/${s.slug}`}>
            <NeoTiltCard className="h-full">
              {s.thumbnailUrl && (
                <div className="aspect-video overflow-hidden border-b-4 border-black">
                  <img src={s.thumbnailUrl} alt={s.title} className="w-full h-full object-cover" />
                </div>
              )}
              <NeoCardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <NeoBadge variant="primary">
                    <span className="flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      {s.postCount}편
                    </span>
                  </NeoBadge>
                </div>
                <NeoCardTitle className="text-xl sm:text-2xl">{s.title}</NeoCardTitle>
                {s.description && (
                  <NeoCardDescription className="text-sm sm:text-base line-clamp-2">
                    {s.description}
                  </NeoCardDescription>
                )}
              </NeoCardHeader>
              <NeoCardContent>
                {s.posts.length > 0 && (
                  <div className="space-y-1">
                    {s.posts.slice(0, 3).map((post, idx) => (
                      <div key={post.id} className="text-xs text-muted-foreground truncate">
                        {idx + 1}. {post.title}
                      </div>
                    ))}
                    {s.posts.length > 3 && (
                      <div className="text-xs text-muted-foreground">
                        +{s.posts.length - 3}개 더보기
                      </div>
                    )}
                  </div>
                )}
              </NeoCardContent>
              <NeoCardFooter className="flex items-center justify-between">
                <span className="text-xs font-mono text-muted-foreground">
                  {s.createdAt.toLocaleDateString("ko-KR")}
                </span>
                <span className="flex items-center gap-1 text-sm font-bold uppercase">
                  View <ArrowRight className="w-4 h-4" />
                </span>
              </NeoCardFooter>
            </NeoTiltCard>
          </Link>
        ))}
      </section>

      {seriesList.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">아직 등록된 시리즈가 없습니다.</p>
        </div>
      )}
    </div>
  );
}
