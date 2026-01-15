import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Sparkles, Database, TrendingUp, BookOpen, HelpCircle } from "lucide-react";
import { NeoCard, NeoCardHeader, NeoCardTitle, NeoCardContent } from "@/components/neo";
import { NeoBadge } from "@/components/neo";
import { NeoButton } from "@/components/neo";
import { NeoTagBadge } from "@/components/neo";
import { absoluteUrl } from "@/lib/utils";
import { getFaqBySlug, getRelatedPostsWithPopularity, getRelatedFaqsWithPopularity } from "@/lib/queries";
import { ViewTracker } from "@/components/ViewTracker";
import { AuthorCard } from "@/components/AuthorCard";

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
  const faq = await getFaqBySlug(slug);

  if (!faq) {
    return { title: "Not Found" };
  }

  const effectiveTitle = faq.metaTitle || faq.question;
  const effectiveDescription = faq.metaDescription || faq.answer.substring(0, 160);

  return {
    title: effectiveTitle,
    description: effectiveDescription,
    robots: faq.noIndex ? { index: false, follow: false } : undefined,
    alternates: faq.canonicalUrl ? { canonical: faq.canonicalUrl } : undefined,
    openGraph: {
      title: effectiveTitle,
      description: effectiveDescription,
      type: "article",
      url: absoluteUrl(`/faq/${slug}`),
      images: faq.ogImage ? [{ url: faq.ogImage, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: effectiveTitle,
      description: effectiveDescription,
      images: faq.ogImage ? [faq.ogImage] : undefined,
    },
  };
}

export default async function FaqDetailPage({ params }: Props) {
  const { slug } = await params;
  const faq = await getFaqBySlug(slug);

  if (!faq) {
    notFound();
  }

  const relatedPosts = await getRelatedPostsWithPopularity(faq.tags, faq.category, faq.id);
  const relatedFaqs = await getRelatedFaqsWithPopularity(faq.tags, faq.category, faq.id, 4);
  const Icon = categoryIcons[faq.category as keyof typeof categoryIcons];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      },
    ],
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: absoluteUrl("/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "FAQ",
        item: absoluteUrl("/faq"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: faq.question,
        item: absoluteUrl(`/faq/${slug}`),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        <ViewTracker contentType="faq" contentId={faq.id} />
        <Link href="/faq" className="inline-flex items-center gap-2 mb-6 sm:mb-8">
          <NeoButton variant="outline" size="sm" className="text-xs sm:text-sm">
            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1" /> Back to FAQ
          </NeoButton>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-2">
            <article>
              <header className="mb-6 sm:mb-8">
                <div className="flex items-center gap-2 sm:gap-3 mb-4 flex-wrap">
                  <NeoBadge variant={faq.category === "AI_TECH" ? "primary" : "default"}>
                    <span className="flex items-center gap-1">
                      <Icon className="w-3 h-3" />
                      {categoryLabels[faq.category as keyof typeof categoryLabels]}
                    </span>
                  </NeoBadge>
                  {faq.difficulty && (
                    <NeoBadge variant="outline" className="bg-white">
                      {faq.difficulty === "EASY" ? "쉬움" : faq.difficulty === "MEDIUM" ? "보통" : faq.difficulty === "HARD" ? "어려움" : "공식문서"}
                    </NeoBadge>
                  )}
                  {faq.recommendedYear && (
                    <NeoBadge variant="default" className="bg-gray-200 text-gray-700 hover:bg-gray-300">
                      {faq.recommendedYear === "JUNIOR" ? "주니어" : faq.recommendedYear === "MID" ? "미들" : faq.recommendedYear === "SENIOR" ? "시니어" : "전체"}
                    </NeoBadge>
                  )}
                </div>
              </header>

              <NeoCard className="bg-primary text-white mb-4 sm:mb-6 -rotate-1 p-4 sm:p-6">
                <NeoCardContent>
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tight">
                    Q: {faq.question}
                  </h1>
                </NeoCardContent>
              </NeoCard>

              <NeoCard className="rotate-0.5 p-4 sm:p-6">
                <NeoCardHeader>
                  <NeoCardTitle className="text-base sm:text-lg text-muted-foreground">
                    Answer
                  </NeoCardTitle>
                </NeoCardHeader>
                <NeoCardContent>
                  <div className="prose prose-sm sm:prose-lg max-w-none whitespace-pre-line text-sm sm:text-base">
                    {faq.answer}
                  </div>
                </NeoCardContent>
              </NeoCard>

              {/* Additional Metadata Section */}
              {(faq.recommendedPositions || faq.techStack || faq.referenceUrl) && (
                <div className="mt-6 mb-8 p-4 sm:p-6 border-2 border-black bg-gray-50 rounded-none">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-5 bg-black inline-block"></span>
                    상세 정보
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {faq.recommendedPositions && faq.recommendedPositions.length > 0 && (
                      <div>
                        <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">추천 포지션</p>
                        <div className="flex flex-wrap gap-2">
                          {faq.recommendedPositions.map((pos) => (
                            <span key={pos} className="px-2.5 py-1 bg-white border border-black text-sm font-medium shadow-sm">
                              {pos}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {faq.techStack && faq.techStack.length > 0 && (
                      <div>
                        <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">기술 스택</p>
                        <div className="flex flex-wrap gap-2">
                          {faq.techStack.map((tech) => (
                            <span key={tech} className="px-2.5 py-1 bg-black text-white text-sm font-medium shadow-sm">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {faq.referenceUrl && (
                      <div className="md:col-span-2">
                        <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">참조 링크</p>
                        <a
                          href={faq.referenceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline break-all flex items-center gap-1 font-medium bg-blue-50 px-3 py-2 border border-blue-200 inline-block w-full sm:w-auto"
                        >
                          <BookOpen className="w-4 h-4 inline mr-1" />
                          {faq.referenceTitle || faq.referenceUrl}
                          <span className="text-xs ml-1">↗</span>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t-4 border-black">
                <div className="flex gap-1.5 flex-wrap">
                  {faq.tags.map((tag) => (
                    <NeoTagBadge key={tag} tag={tag} />
                  ))}
                </div>
                <span className="text-xs sm:text-sm font-mono text-muted-foreground">
                  {faq.createdAt.toLocaleDateString("ko-KR")}
                </span>
              </div>
            </article>

            {relatedPosts.length > 0 && (
              <section className="mt-8 sm:mt-12">
                <div className="bg-accent border-4 border-black neo-shadow p-4 sm:p-6 -rotate-1">
                  <h2 className="text-lg sm:text-xl font-black uppercase flex items-center gap-2 mb-4 sm:mb-6">
                    <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
                    Deep Dive - Related Insights
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {relatedPosts.map((post) => {
                      const PostIcon = categoryIcons[post.category as keyof typeof categoryIcons];
                      return (
                        <Link key={post.id} href={`/insights/${post.slug}`}>
                          <div className="bg-white border-4 border-black p-3 sm:p-4 neo-shadow-sm neo-hover">
                            <div className="flex items-center gap-2 mb-2">
                              <NeoBadge variant={post.category === "AI_TECH" ? "ai" : post.category === "DATA" ? "data" : "marketing"}>
                                <PostIcon className="w-3 h-3" />
                              </NeoBadge>
                            </div>
                            <h3 className="font-bold text-base sm:text-lg mb-1">{post.title}</h3>
                            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                              {post.excerpt}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1 mt-6 lg:mt-0">
            <div className="lg:sticky lg:top-24 space-y-4 sm:space-y-6">
              {/* Related FAQs */}
              {relatedFaqs.length > 0 && (
                <NeoCard className="bg-accent p-4 sm:p-6 halftone-bg">
                  <NeoCardHeader>
                    <NeoCardTitle className="flex items-center gap-2 text-base sm:text-lg relative z-10">
                      <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="comic-emphasis">Related FAQs</span>
                    </NeoCardTitle>
                  </NeoCardHeader>
                  <NeoCardContent className="relative z-10">
                    <ul className="space-y-2 sm:space-y-3">
                      {relatedFaqs.map((relatedFaq) => (
                        <li key={relatedFaq.id}>
                          <Link
                            href={`/faq/${relatedFaq.slug}`}
                            className="block p-2.5 sm:p-3 bg-white border-2 border-black hover:translate-x-1 hover:translate-y-1 hover:shadow-none neo-shadow-sm transition-all"
                          >
                            <span className="text-xs sm:text-sm font-medium line-clamp-2">{relatedFaq.question}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </NeoCardContent>
                </NeoCard>
              )}

              {/* Author Card */}
              <AuthorCard />
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
