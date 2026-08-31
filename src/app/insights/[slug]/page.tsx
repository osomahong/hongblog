import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock3, Flame, Sparkles, Database, TrendingUp } from "lucide-react";
import { NeoCard, NeoCardContent } from "@/components/neo";
import { NeoBadge } from "@/components/neo";
import { NeoButton } from "@/components/neo";
import { NeoTagBadge } from "@/components/neo";
import { absoluteUrl } from "@/lib/utils";
import { AUTHOR_PERSON_LD } from "@/lib/structured-data";
import { classHref } from "@/lib/links";
import { SITE_URL } from "@/lib/constants";
import { getInsightSummary3, getPostBySlug, getRelatedClassesForPost, getPublishedPosts, getTrendingInsightSlugs } from "@/lib/content";
import { getCourseLinks } from "@/lib/promotions";
import { SidebarContentList } from "@/components/SidebarContentList";
import { extractFaqPairs } from "@/lib/extract-faq";
import { ViewTracker } from "@/components/ViewTracker";
import { isAiPracticeTopic } from "@/lib/aipractice-topic";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { ContentHeroImage } from "@/components/ContentHeroImage";
import { AuthorCard } from "@/components/AuthorCard";
import { ContentFocusLayout } from "@/components/ContentFocusLayout";
import { ContentQuiz } from "@/components/ContentQuiz";
import { RelatedPosts } from "@/components/RelatedPosts";
import { NextContentCard } from "@/components/NextContentCard";
import { ContentFeedback } from "@/components/ContentFeedback";
import { ContentSummary } from "@/components/ContentSummary";
import { ShareBar } from "@/components/ShareBar";
import { NewsletterCta } from "@/components/NewsletterCta";
import { AdSenseSlot } from "@/components/ads/AdSenseSlot";
import { AD_SLOTS } from "@/lib/ads";
import { getNextPost, getRelatedPosts } from "@/lib/related-posts";
import { splitMarkdownAtNthH2 } from "@/lib/markdown-split";
import { SUMMARY_PAYWALL_PART } from "@/lib/summary-gate";

export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

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
    keywords: post.tags,
    alternates: {
      canonical: `${SITE_URL}/insights/${slug}`
    },
    openGraph: {
      title: effectiveOgTitle,
      description: effectiveOgDescription,
      type: "article",
      url: absoluteUrl(`/insights/${slug}`),
      publishedTime: (post.publishedAt ?? post.createdAt).toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: ["준이아빠"],
      tags: post.tags,
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

  const Icon = categoryIcons[post.category as keyof typeof categoryIcons];

  // 연관 Class 추천 (교차 추천)
  const relatedClasses = await getRelatedClassesForPost(post.tags, post.category, 5);

  // 다음 단계는 한 글만 강조하고, 일반 관련 글에서는 중복 노출하지 않는다.
  const nextPost = getNextPost(post);
  const relatedPosts = getRelatedPosts(post, 4, nextPost ? [nextPost.slug] : []);
  const readingPathPosts = [
    ...(nextPost ? [nextPost] : []),
    ...relatedPosts,
  ].slice(0, 5);
  const isTrending = getTrendingInsightSlugs().has(slug);
  const nextReason = nextPost
    ? post.nextSlugs.includes(nextPost.slug)
      ? "편집자가 고른 다음 글"
      : post.topicCluster && post.topicCluster === nextPost.topicCluster
        ? "같은 주제의 다음 단계"
        : "이어서 읽기 좋은 글"
    : "";

  const courseLinks = getCourseLinks().slice(0, 3);

  const sidebarGroups = [
    {
      title: "이 글의 학습 경로",
      items: readingPathPosts.map((item) => ({
        id: item.slug,
        href: `/insights/${item.slug}`,
        title: item.title,
        description: item.excerpt || undefined,
        contentType: "insight" as const,
      })),
      more: { href: "/insights", label: "글 전체 보기" },
    },
    {
      title: "관련 개념",
      items: relatedClasses
        .filter((cls) => classHref(cls))
        .map((cls) => ({
          id: cls.slug,
          href: classHref(cls)!,
          title: cls.term,
          description: cls.definition || undefined,
          contentType: "class" as const,
        })),
    },
    {
      title: "무료 셀프 교육으로 배워보세요",
      items: courseLinks.map((course) => ({
        id: course.slug,
        href: course.href,
        title: course.title,
        description: `${course.classCount}개 개념`,
        contentType: "course" as const,
      })),
      more: { href: "/class", label: "코스 전체 보기" },
    },
  ];

  // 대표 이미지: og:image가 로컬 경로일 때만 본문 상단에 노출한다.
  // 외부 호스트(thumbnailUrl)는 next/image 도메인 설정 대상이라 여기서는 제외한다.
  const heroImage = post.ogImage?.startsWith("/") ? post.ogImage : null;
  const summaryLines = getInsightSummary3(slug);

  // 본문 중간 광고 삽입 위치: 두 번째 H2 직전 (H2가 2개 미만이면 미삽입)
  const [contentBeforeAd, contentAfterAd] = splitMarkdownAtNthH2(post.content, 2);

  const articleImage = absoluteUrl(post.ogImage || post.thumbnailUrl || "/og-default.png");

  // 공유 카드(제목/설명/이미지)는 og 메타와 같은 값을 쓴다.
  const sharePayload = {
    title: post.ogTitle || post.metaTitle || post.title,
    description: post.ogDescription || post.metaDescription || post.excerpt || "",
    image: articleImage,
    path: `/insights/${slug}`,
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: articleImage,
    datePublished: (post.publishedAt ?? post.createdAt).toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: AUTHOR_PERSON_LD,
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
    // 본문은 누구나 읽을 수 있고, 3줄 요약 구간만 구독자에게 열린다
    isAccessibleForFree: true,
    ...(summaryLines.length > 0 ? { hasPart: SUMMARY_PAYWALL_PART } : {}),
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

  const faqPairs = extractFaqPairs(post.content);
  // FAQPage는 질문 1개도 유효한 스키마이므로 1개부터 발행한다 (클래스 쪽과 기준 통일)
  const faqLd = faqPairs.length >= 1
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqPairs.map((p) => ({
          "@type": "Question",
          name: p.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: p.answer,
          },
        })),
      }
    : null;

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
      {faqLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      )}
      <div className="py-4 sm:py-12">
        <ViewTracker
          contentType="post"
          contentId={post.id}
          contentTitle={post.title}
          contentSlug={slug}
        />

        {/* 상단 네비게이션 바 */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 group"
            >
              <NeoButton variant="outline" size="sm" className="text-[10px] sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5">
                <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-0.5 sm:mr-1" /> Back
              </NeoButton>
            </Link>

          </div>
        </div>

        <ContentFocusLayout
          contentTitle={post.title}
          sidebar={
            <div className="lg:sticky lg:top-24 space-y-3 sm:space-y-6 lg:space-y-4 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
              <SidebarContentList groups={sidebarGroups} />

              {/* PC 전용 공유 패널. 모바일은 글 상단 compact 바를 그대로 쓴다. */}
              <ShareBar
                payload={sharePayload}
                contentType="post"
                contentId={slug}
                variant="panel"
                className="hidden lg:block"
              />
            </div>
          }
        >
          <article>
            <header className="mb-4 sm:mb-8">
              <div className="flex items-center gap-1.5 sm:gap-3 mb-2 sm:mb-4 flex-wrap">
                <NeoBadge variant={post.category === "AI_TECH" ? "ai" : post.category === "DATA" ? "data" : "marketing"} className="text-[11px] sm:text-xs px-2 sm:px-3 py-0.5 sm:py-1">
                  <span className="flex items-center gap-1">
                    <Icon className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    {categoryLabels[post.category as keyof typeof categoryLabels]}
                  </span>
                </NeoBadge>
              </div>
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tighter mb-2 sm:mb-4 comic-emphasis leading-tight">
                {post.title}
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">{post.excerpt}</p>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 sm:gap-x-4 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t-2 border-black">
                <span className="shrink-0 whitespace-nowrap text-xs sm:text-sm font-mono">
                  {post.createdAt.toLocaleDateString("ko-KR")}
                </span>
                <span className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap text-xs sm:text-sm font-mono text-muted-foreground">
                  <Clock3 className="w-3.5 h-3.5" /> 약 {post.readingTime}분
                </span>
                {isTrending && (
                  <span className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap text-[11px] sm:text-xs font-bold text-[#FF0033]">
                    <Flame className="w-3.5 h-3.5" /> 최근 7일 인기 글
                  </span>
                )}
                <div className="contents">
                  {post.tags.map((tag) => (
                    <NeoTagBadge
                      key={tag}
                      tag={tag}
                      className="shrink-0 text-[11px] sm:text-xs px-1.5 sm:px-3 py-0.5 sm:py-1"
                    />
                  ))}
                </div>
              </div>
            </header>

            {/* 모바일 전용. PC에서는 사이드바 하단 패널로 옮겨진다. */}
            <ShareBar
              payload={sharePayload}
              contentType="post"
              contentId={slug}
              variant="compact"
              className="mb-4 sm:mb-6 lg:hidden"
            />

            {heroImage && (
              <ContentHeroImage src={heroImage} alt={`${post.title} 대표 이미지`} />
            )}

            <ContentSummary
              slug={slug}
              contentType="post"
              lines={summaryLines}
              className="mb-4 sm:mb-6"
            />

            <NeoCard className="prose prose-sm sm:prose-lg max-w-none">
              <NeoCardContent>
                <MarkdownRenderer content={contentBeforeAd} />
                {contentAfterAd && (
                  <>
                    <AdSenseSlot
                      slot={AD_SLOTS.inArticle}
                      format="fluid"
                      layout="in-article"
                      className="my-6 not-prose"
                    />
                    <MarkdownRenderer content={contentAfterAd} />
                  </>
                )}
              </NeoCardContent>
            </NeoCard>

            <ShareBar
              payload={sharePayload}
              contentType="post"
              contentId={slug}
              variant="full"
              className="mt-6 sm:mt-8"
            />

            {/* 사이드바에서 걷어낸 저자 정보를 글 끝에 한 줄로 남긴다 */}
            <AuthorCard compact className="block mt-6 sm:mt-8" />

            {post.quiz && post.quiz.length > 0 && (
              <ContentQuiz
                quiz={post.quiz}
                contentType="post"
                contentSlug={slug}
                contentName={post.title}
                practiceBanner={isAiPracticeTopic(post.category, post.tags)}
              />
            )}

            <ContentFeedback contentSlug={slug} contentName={post.title} />

            {nextPost && <NextContentCard post={nextPost} reason={nextReason} />}

            <RelatedPosts posts={relatedPosts} />

            <section className="mt-6 sm:mt-8" aria-label="광고">
              <p className="mb-1 text-center text-[10px] font-mono tracking-widest text-muted-foreground">
                ADVERTISEMENT
              </p>
              <AdSenseSlot
                slot={AD_SLOTS.inFeed}
                format="fluid"
                className="border-t border-gray-200 pt-2"
                minHeight={160}
              />
            </section>

            <NewsletterCta location="post_bottom" className="mt-6 sm:mt-8" />
          </article>
        </ContentFocusLayout>
      </div>
    </>
  );
}
