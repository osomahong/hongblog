import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Sparkles, Database, TrendingUp, HelpCircle, BookOpen } from "lucide-react";
import { NeoCard, NeoCardHeader, NeoCardTitle, NeoCardContent } from "@/components/neo";
import { NeoBadge } from "@/components/neo";
import { NeoButton } from "@/components/neo";
import { NeoTagBadge } from "@/components/neo";
import { absoluteUrl } from "@/lib/utils";
import { getPostBySlug, getRelatedFaqsWithPopularity, getSeriesNavigation, getRelatedClassesForPost } from "@/lib/queries";
import { ViewTracker } from "@/components/ViewTracker";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { AuthorCard } from "@/components/AuthorCard";
import { SeriesNav } from "@/components/SeriesNav";
import { ContentFocusLayout } from "@/components/ContentFocusLayout";
import { trackBackButtonClick, trackRelatedContentClick } from "@/lib/gtm";

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
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: "Not Found" };
  }

  const effectiveTitle = post.metaTitle || post.title;
  const effectiveDescription = post.metaDescription || post.excerpt || "";
  const effectiveOgTitle = post.ogTitle || effectiveTitle;
  const effectiveOgDescription = post.ogDescription || effectiveDescription;

  return {
    title: effectiveTitle,
    description: effectiveDescription,
    robots: post.noIndex ? { index: false, follow: false } : undefined,
    alternates: post.canonicalUrl ? { canonical: post.canonicalUrl } : undefined,
    openGraph: {
      title: effectiveOgTitle,
      description: effectiveOgDescription,
      type: "article",
      url: absoluteUrl(`/insights/${slug}`),
      images: post.ogImage ? [{ url: post.ogImage, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: effectiveOgTitle,
      description: effectiveOgDescription,
      images: post.ogImage ? [post.ogImage] : undefined,
    },
  };
}

export default async function InsightDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedFaqs = await getRelatedFaqsWithPopularity(post.tags, post.category, post.id);
  const Icon = categoryIcons[post.category as keyof typeof categoryIcons];

  // 연관 Class 추천 (교차 추천)
  const relatedClasses = await getRelatedClassesForPost(post.tags, post.category, 3);

  // 시리즈 네비게이션 정보 가져오기
  const seriesNav = post.seriesId ? await getSeriesNavigation(post.seriesId, post.id) : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.ogImage || post.thumbnailUrl,
    datePublished: post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: {
      "@type": "Person",
      name: "준이아빠",
      url: absoluteUrl("/about"),
    },
    publisher: {
      "@type": "Organization",
      name: "준이아빠블로그",
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/favicon.ico"), // Replace with a real logo if available
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl(`/insights/${slug}`),
    },
    keywords: post.tags.join(", "),
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
        name: "Insights",
        item: absoluteUrl("/insights"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: absoluteUrl(`/insights/${slug}`),
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
      <div className="py-4 sm:py-12">
        <ViewTracker
          contentType="post"
          contentId={post.id}
          contentTitle={post.title}
          contentSlug={slug}
          category={post.category}
          tags={post.tags}
        />

        {/* 상단 네비게이션 바 */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 group"
              onClick={() => trackBackButtonClick({
                sourcePage: 'post',
                sourceContentId: post.id,
                destination: '/'
              })}
            >
              <NeoButton variant="outline" size="sm" className="text-[10px] sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5">
                <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-0.5 sm:mr-1" /> Back
              </NeoButton>
            </Link>

            {/* 시리즈 네비게이션 */}
            {post.seriesInfo && seriesNav && (
              <SeriesNav
                seriesInfo={post.seriesInfo}
                navigation={seriesNav}
                currentPostId={post.id}
                currentPostTitle={post.title}
              />
            )}
          </div>
        </div>

        <ContentFocusLayout
          sidebar={
            <div className="lg:sticky lg:top-24 space-y-3 sm:space-y-6">
              {/* Related FAQs */}
              <NeoCard className="bg-accent p-3 sm:p-6 halftone-bg">
                <NeoCardHeader>
                  <NeoCardTitle className="flex items-center gap-1.5 sm:gap-2 text-sm sm:text-lg relative z-10">
                    <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="comic-emphasis">Related FAQs</span>
                  </NeoCardTitle>
                </NeoCardHeader>
                <NeoCardContent className="relative z-10">
                  {relatedFaqs.length > 0 ? (
                    <ul className="space-y-2 sm:space-y-3">
                      {relatedFaqs.map((faq, index) => (
                        <li key={faq.id}>
                          <Link
                            href={`/faq/${faq.slug}`}
                            className="block p-2 sm:p-3 bg-white border-2 border-black hover:translate-x-1 hover:translate-y-1 hover:shadow-none neo-shadow-sm transition-all"
                            onClick={() => trackRelatedContentClick({
                              sourceType: 'post',
                              sourceId: post.id,
                              sourceTitle: post.title,
                              relatedType: 'faq',
                              relatedSection: 'related_faqs',
                              relatedTitle: faq.question,
                              relatedSlug: faq.slug,
                              position: index + 1
                            })}
                          >
                            <span className="text-[11px] sm:text-sm font-medium leading-snug block">{faq.question}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs sm:text-sm text-muted-foreground">연관된 FAQ가 없습니다.</p>
                  )}
                </NeoCardContent>
              </NeoCard>

              {/* Related Classes */}
              {relatedClasses.length > 0 && (
                <NeoCard className="bg-blue-50 p-3 sm:p-6 halftone-bg">
                  <NeoCardHeader>
                    <NeoCardTitle className="flex items-center gap-1.5 sm:gap-2 text-sm sm:text-lg relative z-10">
                      <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="comic-emphasis">관련 개념</span>
                    </NeoCardTitle>
                  </NeoCardHeader>
                  <NeoCardContent className="relative z-10">
                    <ul className="space-y-2 sm:space-y-3">
                      {relatedClasses.map((cls, index) => (
                        <li key={cls.id}>
                          <Link
                            href={`/class/${cls.courseInfo?.slug || ""}/${cls.slug}`}
                            className="block p-2 sm:p-3 bg-white border-2 border-black hover:translate-x-1 hover:translate-y-1 hover:shadow-none neo-shadow-sm transition-all"
                            onClick={() => trackRelatedContentClick({
                              sourceType: 'post',
                              sourceId: post.id,
                              sourceTitle: post.title,
                              relatedType: 'class',
                              relatedSection: 'related_classes',
                              relatedTitle: cls.term,
                              relatedSlug: cls.slug,
                              position: index + 1
                            })}
                          >
                            <span className="text-[11px] sm:text-sm font-bold leading-snug block">{cls.term}</span>
                            <p className="text-[10px] sm:text-xs text-muted-foreground line-clamp-1 mt-0.5">{cls.definition}</p>
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
          }
        >
          <article>
            <header className="mb-4 sm:mb-8">
              <div className="flex items-center gap-1.5 sm:gap-3 mb-2 sm:mb-4 flex-wrap">
                <NeoBadge variant={post.category === "AI_TECH" ? "ai" : post.category === "DATA" ? "data" : "marketing"} className="text-[10px] sm:text-xs px-2 sm:px-3 py-0.5 sm:py-1">
                  <span className="flex items-center gap-1">
                    <Icon className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    {categoryLabels[post.category as keyof typeof categoryLabels]}
                  </span>
                </NeoBadge>
                {post.highlights && (post.highlights as string[]).length > 0 && (
                  <div className="flex gap-1 flex-wrap">
                    {(post.highlights as string[]).map((highlight, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] sm:text-xs font-mono font-bold bg-accent text-black px-1.5 sm:px-2 py-0.5 sm:py-1 border-2 border-black"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <h1 className="text-xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter mb-2 sm:mb-4 comic-emphasis leading-tight">
                {post.title}
              </h1>
              <p className="text-sm sm:text-lg text-muted-foreground leading-relaxed">{post.excerpt}</p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t-2 border-black">
                <span className="text-[10px] sm:text-sm font-mono">
                  {post.createdAt.toLocaleDateString("ko-KR")}
                </span>
                <div className="flex gap-1 sm:gap-1.5 flex-wrap">
                  {post.tags.map((tag) => (
                    <NeoTagBadge
                      key={tag}
                      tag={tag}
                      className="text-[10px] sm:text-xs px-1.5 sm:px-3 py-0.5 sm:py-1"
                      sourcePage="post"
                      sourceLocation="content_footer"
                      sourceContentId={post.id}
                      sourceContentTitle={post.title}
                    />
                  ))}
                </div>
              </div>
            </header>

            <NeoCard className="prose prose-sm sm:prose-lg max-w-none p-3 sm:p-6">
              <NeoCardContent>
                <MarkdownRenderer content={post.content} />
              </NeoCardContent>
            </NeoCard>
          </article>
        </ContentFocusLayout>
      </div>
    </>
  );
}
