import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { getClassBySlugWithMeta as getClassBySlug, getPublishedCourseBySlug as getCourseBySlug, getNextPrevClass, getRelatedClassesByTags, getRelatedPostsForClass, getPublishedCourses, getClassesBySlugs } from "@/lib/content";
import { NeoButton, NeoCard, NeoCardHeader, NeoCardTitle, NeoCardContent } from "@/components/neo";
import { NeoBadge } from "@/components/neo";
import { NeoTagBadge } from "@/components/neo";
import { ViewTracker } from "@/components/ViewTracker";
import { isAiPracticeTopic } from "@/lib/aipractice-topic";
import { ClassProgressMarker } from "@/components/ClassProgressMarker";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { absoluteUrl } from "@/lib/utils";
import { SITE_URL } from "@/lib/constants";
import { classHref } from "@/lib/links";
import { ContentFocusLayout } from "@/components/ContentFocusLayout";
import { AuthorCard } from "@/components/AuthorCard";
import { RelatedLink } from "@/components/RelatedLink";
import { ContentQuiz } from "@/components/ContentQuiz";
import { CourseCurriculumPanel } from "@/components/CourseCurriculumPanel";
import { ContentUpdateNotice } from "@/components/ContentUpdateNotice";
import { ShareBar } from "@/components/ShareBar";
import { extractFaqPairs } from "@/lib/extract-faq";
import { AdSenseSlot } from "@/components/ads/AdSenseSlot";
import { AD_SLOTS } from "@/lib/ads";
import { splitMarkdownAtNthH2 } from "@/lib/markdown-split";

export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams() {
    const courses = await getPublishedCourses();
    return courses.flatMap((course) =>
        course.classes.map((cls) => ({
            courseSlug: course.slug,
            classSlug: cls.slug,
        }))
    );
}

type Props = {
    params: Promise<{ courseSlug: string; classSlug: string }>;
};

const difficultyLabels = {
    BEGINNER: "초급",
    INTERMEDIATE: "중급",
    ADVANCED: "고급",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { courseSlug, classSlug } = await params;
    const classData = await getClassBySlug(classSlug);

    if (!classData) {
        return { title: "Class Not Found" };
    }

    const effectiveTitle = classData.metaTitle || classData.term;
    const effectiveDescription = classData.metaDescription || classData.definition;
    const ogImage = classData.ogImage ? absoluteUrl(classData.ogImage) : undefined;

    return {
        title: effectiveTitle,
        description: effectiveDescription,
        keywords: classData.tags,
        alternates: {
            canonical: `${SITE_URL}/class/${courseSlug}/${classSlug}`
        },
        openGraph: {
            title: effectiveTitle,
            description: effectiveDescription,
            type: "article",
            url: absoluteUrl(`/class/${courseSlug}/${classSlug}`),
            publishedTime: (classData.publishedAt ?? classData.createdAt).toISOString(),
            modifiedTime: classData.updatedAt.toISOString(),
            authors: ["준이아빠"],
            tags: classData.tags,
            images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : undefined,
        },
        twitter: {
            card: "summary_large_image",
            title: effectiveTitle,
            description: effectiveDescription,
            images: ogImage ? [ogImage] : undefined,
        },
    };
}

export default async function ClassDetailPage({ params }: Props) {
    const { courseSlug, classSlug } = await params;
    const classData = await getClassBySlug(classSlug);

    if (!classData) {
        notFound();
    }

    // Course 정보 가져오기
    const course = classData.courseInfo ? await getCourseBySlug(courseSlug) : null;

    // 본문 중간 광고 삽입 위치: 두 번째 H2 직전 (H2가 2개 미만이면 미삽입)
    const [classContentBeforeAd, classContentAfterAd] = splitMarkdownAtNthH2(classData.content, 2);

    // 이전/다음 Class 네비게이션
    const navigation = await getNextPrevClass(classSlug);

    // 연관 Class 추천: frontmatter relatedTerms 큐레이션 우선, 부족하면 태그 기반으로 보충
    const curatedClasses = classData.relatedTerms
        ? getClassesBySlugs(classData.relatedTerms).filter((c) => c.slug !== classSlug)
        : [];
    const tagBasedClasses = getRelatedClassesByTags(classData.tags, classData.id, 4).filter(
        (c) => c.slug !== classSlug && !curatedClasses.some((cc) => cc.slug === c.slug)
    );
    const relatedClasses = [...curatedClasses, ...tagBasedClasses].slice(0, 4);

    // 연관 Insights 추천 (교차 추천)
    const relatedPosts = await getRelatedPostsForClass(classData.tags, classData.category, 6);


    // Schema.org JSON-LD
    const articleImage = classData.ogImage ? absoluteUrl(classData.ogImage) : absoluteUrl("/og-default.png");
    const classUrl = absoluteUrl(`/class/${courseSlug}/${classSlug}`);

    // 공유 카드(제목/설명/이미지)는 og 메타와 같은 값을 쓴다.
    const sharePayload = {
        title: classData.metaTitle || classData.term,
        description: classData.metaDescription || classData.definition,
        image: articleImage,
        path: `/class/${courseSlug}/${classSlug}`,
    };

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        // 검색 결과 제목(metaTitle)과 구조화 데이터 headline을 일치시킨다 (삼중 정렬)
        headline: classData.metaTitle || classData.term,
        description: classData.definition,
        image: articleImage,
        inLanguage: "ko",
        datePublished: (classData.publishedAt ?? classData.createdAt).toISOString(),
        dateModified: classData.updatedAt.toISOString(),
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
                url: absoluteUrl("/favicon.ico"),
            },
        },
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": classUrl,
        },
        ...(course
            ? {
                  isPartOf: {
                      "@type": "Course",
                      name: course.title,
                      url: absoluteUrl(`/class/${courseSlug}`),
                  },
              }
            : {}),
        keywords: classData.tags.join(", "),
    };

    const faqPairs = extractFaqPairs(classData.content);
    const faqLd = faqPairs.length >= 2
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
                name: "Class",
                item: absoluteUrl("/class"),
            },
            ...(course ? [{
                "@type": "ListItem",
                position: 3,
                name: course.title,
                item: absoluteUrl(`/class/${courseSlug}`),
            }] : []),
            {
                "@type": "ListItem",
                position: course ? 4 : 3,
                name: classData.term,
                item: absoluteUrl(`/class/${courseSlug}/${classSlug}`),
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
            {faqLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
                />
            )}

            <div className="py-4 sm:py-12">
                <ViewTracker
                    contentType="class"
                    contentId={classData.id}
                    contentTitle={classData.term}
                    contentSlug={classSlug}
                />
                <ClassProgressMarker slug={classSlug} />

                {/* Breadcrumb & Back Button */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-4 sm:mb-6 flex items-center gap-2 text-xs sm:text-sm text-muted-foreground flex-wrap">
                        <Link href="/class" className="hover:text-foreground transition-colors">
                            Class
                        </Link>
                        {course && (
                            <>
                                <span>/</span>
                                <Link href={`/class/${courseSlug}`} className="hover:text-foreground transition-colors">
                                    {course.title}
                                </Link>
                            </>
                        )}
                        <span>/</span>
                        <span className="text-foreground font-medium">{classData.term}</span>
                    </div>

                    <Link href={course ? `/class/${courseSlug}` : "/class"} className="inline-block mb-4 sm:mb-6">
                        <NeoButton variant="outline" size="sm">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            {course ? "강의로 돌아가기" : "목록으로"}
                        </NeoButton>
                    </Link>
                </div>

                <ContentFocusLayout
                    contentTitle={classData.term}
                    focusSidebar={
                        course && course.classes.length > 0 ? (
                            <div className="space-y-4 sm:space-y-6">
                                <CourseCurriculumPanel
                                    courseSlug={courseSlug}
                                    courseTitle={course.title}
                                    classes={course.classes}
                                    currentSlug={classSlug}
                                />
                                <AuthorCard />
                                <ShareBar
                                    payload={sharePayload}
                                    contentType="class"
                                    contentId={classSlug}
                                    variant="panel"
                                    className="hidden lg:block"
                                />
                            </div>
                        ) : undefined
                    }
                    sidebar={
                        <div className="lg:sticky lg:top-24 space-y-4 sm:space-y-6 lg:space-y-4 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
                            {/* Course Info */}
                            {course && (
                                <NeoCard className="p-4 sm:p-6">
                                    <NeoCardHeader>
                                        <NeoCardTitle className="text-sm sm:text-base">강의 정보</NeoCardTitle>
                                    </NeoCardHeader>
                                    <NeoCardContent>
                                        <Link href={`/class/${courseSlug}`} className="block group">
                                            <h3 className="font-bold text-sm sm:text-base mb-2 group-hover:text-primary transition-colors">
                                                {course.title}
                                            </h3>
                                            <p className="text-xs sm:text-sm text-muted-foreground">
                                                {course.classCount}개 개념
                                            </p>
                                        </Link>
                                    </NeoCardContent>
                                </NeoCard>
                            )}

                            {/* Course Progress */}
                            <NeoCard className="p-4 sm:p-6 bg-accent">
                                <NeoCardHeader>
                                    <NeoCardTitle className="text-sm sm:text-base">학습 진행</NeoCardTitle>
                                </NeoCardHeader>
                                <NeoCardContent>
                                    <div className="text-center">
                                        <div className="text-3xl sm:text-4xl font-black text-primary mb-2">
                                            {navigation.currentIndex} / {navigation.totalCount}
                                        </div>
                                        <div className="w-full bg-white border-2 border-black h-3 sm:h-4 mt-3">
                                            <div
                                                className="bg-primary h-full transition-all"
                                                style={{ width: `${(navigation.currentIndex / navigation.totalCount) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                </NeoCardContent>
                            </NeoCard>

                            {/* Author Card */}
                            <AuthorCard />

                            {/* PC 전용 공유 패널. 모바일은 글 상단 compact 바를 그대로 쓴다. */}
                            <ShareBar
                                payload={sharePayload}
                                contentType="class"
                                contentId={classSlug}
                                variant="panel"
                                className="hidden lg:block"
                            />
                        </div>
                    }
                >
                    <article>
                        {/* Header */}
                        <header className="mb-6 sm:mb-8">
                            <div className="flex items-center gap-2 mb-3 sm:mb-4 flex-wrap">
                                {classData.difficulty && (
                                    <NeoBadge variant="outline" className="bg-white">
                                        {difficultyLabels[classData.difficulty as keyof typeof difficultyLabels]}
                                    </NeoBadge>
                                )}
                            </div>

                            <h1 className="text-3xl sm:text-5xl font-black tracking-tighter mb-3 sm:mb-4 comic-emphasis leading-tight">
                                {classData.term}
                            </h1>

                            <p className="text-base sm:text-xl text-muted-foreground leading-relaxed border-l-4 border-primary pl-4 sm:pl-6 py-2">
                                {classData.definition}
                            </p>

                            {/* Aliases */}
                            {classData.aliases && classData.aliases.length > 0 && (
                                <div className="mt-4 flex items-center gap-2 flex-wrap">
                                    <span className="text-sm font-bold">동의어:</span>
                                    {classData.aliases.map((alias, idx) => (
                                        <span key={idx} className="text-sm px-2 py-1 bg-accent border-2 border-black">
                                            {alias}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <div className="flex items-center gap-2 mt-4 flex-wrap">
                                {classData.tags.map((tag) => (
                                    <NeoTagBadge key={tag} tag={tag} className="text-xs px-2 py-1" />
                                ))}
                            </div>
                        </header>

                        {/* 모바일 전용. PC에서는 사이드바 하단 패널로 옮겨진다. */}
                        <ShareBar
                            payload={sharePayload}
                            contentType="class"
                            contentId={classSlug}
                            variant="compact"
                            className="mb-4 sm:mb-6 lg:hidden"
                        />

                        {/* Content */}
                        <NeoCard className="prose prose-sm sm:prose-lg max-w-none sm:p-8 mb-6 sm:mb-8">
                            <NeoCardContent>
                                {classData.updateNotice && (
                                    <ContentUpdateNotice notice={classData.updateNotice} />
                                )}
                                <MarkdownRenderer content={classContentBeforeAd} />
                                {classContentAfterAd && (
                                    <>
                                        <AdSenseSlot
                                            slot={AD_SLOTS.inArticle}
                                            format="fluid"
                                            layout="in-article"
                                            className="my-6 not-prose"
                                        />
                                        <MarkdownRenderer content={classContentAfterAd} />
                                    </>
                                )}
                            </NeoCardContent>
                        </NeoCard>

                        <ShareBar
                            payload={sharePayload}
                            contentType="class"
                            contentId={classSlug}
                            variant="full"
                            className="mb-6 sm:mb-8"
                        />

                        {classData.quiz && classData.quiz.length > 0 && (
                            <div className="mb-6 sm:mb-8">
                                <ContentQuiz
                                    quiz={classData.quiz}
                                    contentType="class"
                                    contentSlug={classSlug}
                                    contentName={classData.term}
                                    practiceBanner={isAiPracticeTopic(classData.category, classData.tags)}
                                />
                            </div>
                        )}

                        {/* Navigation (Prev/Next) */}
                        {(navigation.prev || navigation.next) && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
                                {navigation.prev ? (
                                    <RelatedLink
                                        href={`/class/${navigation.prev.courseInfo?.slug ?? courseSlug}/${navigation.prev.slug}`}
                                        relatedType="classes"
                                        contentId={navigation.prev.slug}
                                        contentName={navigation.prev.term}
                                    >
                                        <NeoCard className="h-full hover:translate-x-0.5 hover:translate-y-0.5 transition-transform">
                                            <NeoCardHeader>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                                                    <ChevronLeft className="w-4 h-4" />
                                                    <span>이전 개념</span>
                                                </div>
                                                <NeoCardTitle className="text-base sm:text-lg">
                                                    {navigation.prev.term}
                                                </NeoCardTitle>
                                            </NeoCardHeader>
                                        </NeoCard>
                                    </RelatedLink>
                                ) : (
                                    <div />
                                )}
                                {navigation.next && (
                                    <RelatedLink
                                        href={`/class/${navigation.next.courseInfo?.slug ?? courseSlug}/${navigation.next.slug}`}
                                        relatedType="classes"
                                        contentId={navigation.next.slug}
                                        contentName={navigation.next.term}
                                    >
                                        <NeoCard className="h-full hover:translate-x-0.5 hover:translate-y-0.5 transition-transform">
                                            <NeoCardHeader>
                                                <div className="flex items-center justify-end gap-2 text-sm text-muted-foreground mb-1">
                                                    <span>다음 개념</span>
                                                    <ChevronRight className="w-4 h-4" />
                                                </div>
                                                <NeoCardTitle className="text-base sm:text-lg text-right">
                                                    {navigation.next.term}
                                                </NeoCardTitle>
                                            </NeoCardHeader>
                                        </NeoCard>
                                    </RelatedLink>
                                )}
                            </div>
                        )}

                        {/* Related Classes */}
                        {relatedClasses.length > 0 && (
                            <NeoCard className="bg-accent halftone-bg p-4 sm:p-6 mb-6 sm:mb-8">
                                <NeoCardHeader>
                                    <NeoCardTitle className="flex items-center gap-2">
                                        <BookOpen className="w-5 h-5" />
                                        이어서 배우면 좋은 개념
                                    </NeoCardTitle>
                                </NeoCardHeader>
                                <NeoCardContent>
                                    <div className="grid gap-3">
                                        {relatedClasses.filter((related) => classHref(related)).map((related) => (
                                            <RelatedLink
                                                key={related.id}
                                                href={classHref(related)!}
                                                relatedType="classes"
                                                contentId={related.slug}
                                                contentName={related.term}
                                                className="block p-3 sm:p-4 bg-white border-2 border-black hover:translate-x-1 hover:translate-y-1 hover:shadow-none neo-shadow-sm transition-all"
                                            >
                                                <h3 className="font-bold text-sm sm:text-base mb-1">{related.term}</h3>
                                                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                                                    {related.definition}
                                                </p>
                                            </RelatedLink>
                                        ))}
                                    </div>
                                </NeoCardContent>
                            </NeoCard>
                        )}

                        {/* Related Insights. 카드 대신 줄로 쌓아 같은 높이에 두 배를 노출한다 */}
                        {relatedPosts.length > 0 && (
                            <NeoCard className="bg-white bg-stripes neo-border-thick p-4 sm:p-6 mb-6 sm:mb-8">
                                <NeoCardHeader>
                                    <NeoCardTitle className="flex items-center gap-2">
                                        <Sparkles className="w-5 h-5" />
                                        관련 인사이트
                                    </NeoCardTitle>
                                </NeoCardHeader>
                                <NeoCardContent>
                                    <ul className="divide-y divide-gray-200">
                                        {relatedPosts.map((post) => (
                                            <li key={post.id}>
                                                <RelatedLink
                                                    href={`/insights/${post.slug}`}
                                                    relatedType="insights"
                                                    contentId={post.slug}
                                                    contentName={post.title}
                                                    className="block py-2.5 group"
                                                >
                                                    <span className="block font-bold text-sm sm:text-base leading-snug line-clamp-2 group-hover:text-[#FF0033] transition-colors">
                                                        {post.title}
                                                    </span>
                                                    {post.excerpt && (
                                                        <span className="block text-xs sm:text-sm text-muted-foreground line-clamp-1 mt-0.5">
                                                            {post.excerpt}
                                                        </span>
                                                    )}
                                                </RelatedLink>
                                            </li>
                                        ))}
                                    </ul>
                                </NeoCardContent>
                            </NeoCard>
                        )}

                    </article>
                </ContentFocusLayout>
            </div>
        </>
    );
}
