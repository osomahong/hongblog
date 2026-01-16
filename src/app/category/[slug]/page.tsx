import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Sparkles, Database, TrendingUp, HelpCircle } from "lucide-react";
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
import { db } from "@/lib/db";
import { posts, faqs } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";
import type { Category, Tag } from "@/lib/schema";

const categoryMap: Record<string, Category> = {
  ai_tech: "AI_TECH",
  data: "DATA",
  marketing: "MARKETING",
};

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

const categoryDescriptions: Record<string, string> = {
  AI_TECH: "인공지능과 기술 트렌드에 대한 인사이트",
  DATA: "데이터 분석과 활용에 대한 전문 지식",
  MARKETING: "디지털 마케팅 전략과 실행 노하우",
  맛집: "맛집 리뷰와 음식 경험",
  강의: "교육과 학습 경험",
  문화생활: "문화 활동과 예술 체험",
  여행: "여행 경험과 추천",
  일상: "일상의 소소한 이야기",
};

type Props = {
  params: Promise<{ slug: string }>;
};

type PostWithRelations = {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  category: string;
  highlights: unknown;
  thumbnailUrl: string | null;
  isPublished: boolean;
  createdAt: Date;
  postsToTags: { tag: Tag }[];
};

type FaqWithRelations = {
  id: number;
  slug: string;
  question: string;
  answer: string;
  category: string;
  isPublished: boolean;
  createdAt: Date;
  faqsToTags: { tag: Tag }[];
};

async function getPostsByCategory(category: Category) {
  const result = (await db.query.posts.findMany({
    where: eq(posts.category, category),
    orderBy: [desc(posts.createdAt)],
    with: {
      postsToTags: {
        with: { tag: true },
      },
    },
  })) as PostWithRelations[];

  return result
    .filter((post) => post.isPublished)
    .map((post) => ({
      ...post,
      highlights: post.highlights as string[] | null,
      tags: post.postsToTags.map((pt) => pt.tag.name),
    }));
}

async function getFaqsByCategory(category: Category) {
  const result = (await db.query.faqs.findMany({
    where: eq(faqs.category, category),
    orderBy: [desc(faqs.createdAt)],
    with: {
      faqsToTags: {
        with: { tag: true },
      },
    },
  })) as FaqWithRelations[];

  return result
    .filter((faq) => faq.isPublished)
    .map((faq) => ({
      ...faq,
      tags: faq.faqsToTags.map((ft) => ft.tag.name),
    }));
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = categoryMap[slug.toLowerCase()];

  if (!category) {
    notFound();
  }

  const [categoryPosts, categoryFaqs] = await Promise.all([
    getPostsByCategory(category),
    getFaqsByCategory(category),
  ]);

  const Icon = categoryIcons[category];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
      {/* Back Button */}
      <Link href="/" className="inline-flex items-center gap-2 mb-6">
        <NeoButton variant="outline" size="sm">
          <ArrowLeft className="w-4 h-4 mr-1" /> 홈으로
        </NeoButton>
      </Link>

      {/* Category Header */}
      <section className="mb-8 sm:mb-12">
        <NeoTiltCard
          className={`${category === "AI_TECH"
            ? "bg-gradient-to-br from-red-600 to-orange-600"
            : category === "DATA"
              ? "bg-gradient-to-br from-blue-600 to-indigo-700"
              : "bg-gradient-to-br from-amber-400 to-yellow-500"
            } ${category === "MARKETING" ? "text-black" : "text-white"} border-4 border-black p-5 sm:p-8 -rotate-1 halftone-corner speed-lines text-left`}
          intensity={20}
          shadowIntensity={10}
        >
          <div className="flex items-center gap-3 mb-2 relative z-10">
            <Icon className="w-8 h-8 sm:w-10 sm:h-10" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter comic-emphasis">
              {categoryLabels[category]}
            </h1>
          </div>
          <p className="text-base sm:text-lg opacity-90 relative z-10">
            {categoryDescriptions[category]}
          </p>
          <div className="flex gap-4 mt-4 text-sm font-mono relative z-10">
            <span>{categoryPosts.length} posts</span>
            <span>{categoryFaqs.length} faqs</span>
          </div>
        </NeoTiltCard>
      </section>

      {/* Posts Section */}
      {categoryPosts.length > 0 && (
        <section className="mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-black uppercase mb-4 sm:mb-6 comic-emphasis">
            Insights ({categoryPosts.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {categoryPosts.map((post, index) => (
              <Link key={post.id} href={`/insights/${post.slug}`}>
                <NeoTiltCard className="h-full">
                  <NeoCardHeader>
                    <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
                      <NeoBadge variant={category === "AI_TECH" ? "primary" : category === "DATA" ? "default" : "accent"}>
                        <span className="flex items-center gap-1">
                          <Icon className="w-3 h-3" />
                          {categoryLabels[category]}
                        </span>
                      </NeoBadge>
                    </div>
                    <NeoCardTitle className="text-xl sm:text-2xl">
                      {post.title}
                    </NeoCardTitle>
                    <NeoCardDescription className="text-sm sm:text-base">
                      {post.excerpt}
                    </NeoCardDescription>
                  </NeoCardHeader>
                  <NeoCardContent>
                    <div className="flex flex-wrap gap-1.5">
                      {post.tags.slice(0, 3).map((tag) => (
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
            ))}
          </div>
        </section>
      )}

      {/* FAQs Section */}
      {categoryFaqs.length > 0 && (
        <section>
          <h2 className="text-xl sm:text-2xl font-black uppercase mb-4 sm:mb-6 flex items-center gap-2">
            <HelpCircle className="w-6 h-6" />
            <span className="comic-emphasis">FAQs ({categoryFaqs.length})</span>
          </h2>
          <div className="space-y-3">
            {categoryFaqs.map((faq) => (
              <Link
                key={faq.id}
                href={`/faq/${faq.slug}`}
              >
                <NeoTiltCard className="p-4 bg-white hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                  <div className="flex items-start gap-3">
                    <span className="text-primary font-black text-xl">Q</span>
                    <div className="flex-1">
                      <p className="font-bold text-base sm:text-lg">{faq.question}</p>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{faq.answer}</p>
                      <div className="flex gap-1.5 mt-2 flex-wrap">
                        {faq.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="text-xs text-muted-foreground">#{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </NeoTiltCard>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {categoryPosts.length === 0 && categoryFaqs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">이 카테고리에 아직 콘텐츠가 없습니다.</p>
        </div>
      )}
    </div>
  );
}
