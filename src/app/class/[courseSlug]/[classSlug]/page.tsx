import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen, ChevronLeft, ChevronRight, Sparkles, HelpCircle } from "lucide-react";
import { getClassBySlug, getCourseBySlug, getNextPrevClass, getRelatedClassesByTags, getRelatedPostsForClass, getRelatedFaqsWithPopularity } from "@/lib/queries";
import { NeoButton, NeoCard, NeoCardHeader, NeoCardTitle, NeoCardContent } from "@/components/neo";
import { NeoBadge } from "@/components/neo";
import { NeoTagBadge } from "@/components/neo";
import { ViewTracker } from "@/components/ViewTracker";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { absoluteUrl } from "@/lib/utils";
import { ContentFocusLayout } from "@/components/ContentFocusLayout";
import { AuthorCard } from "@/components/AuthorCard";
import { trackBackButtonClick, trackRelatedContentClick } from "@/lib/gtm";

type Props = {
    params: Promise<{ courseSlug: string; classSlug: string }>;
};

const difficultyLabels = {
    BEGINNER: "초급",
    INTERMEDIATE: "중급",
    ADVANCED: "고급",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { classSlug } = await params;
    const classData = await getClassBySlug(classSlug);

    if (!classData) {
        return { title: "Class Not Found" };
    }

    const effectiveTitle = classData.metaTitle || classData.term;
    const effectiveDescription = classData.metaDescription || classData.definition;

    return {
        title: effectiveTitle,
        description: effectiveDescription,
        robots: classData.noIndex ? { index: false, follow: false } : undefined,
        alternates: classData.canonicalUrl ? { canonical: classData.canonicalUrl } : undefined,
        openGraph: {
            title: effectiveTitle,
            description: effectiveDescription,
            type: "article",
            images: classData.ogImage ? [{ url: classData.ogImage, width: 1200, height: 630 }] : undefined,
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

    // 이전/다음 Class 네비게이션
    const navigation = await getNextPrevClass(classData.id);

    // 연관 Class 추천
    const relatedClasses = await getRelatedClassesByTags(classData.tags, classData.id, 3);

    // 연관 Insights 추천 (교차 추천)
    const relatedPosts = await getRelatedPostsForClass(classData.tags, classData.category, 3);

    // 연관 FAQ 추천
    const relatedFaqs = await getRelatedFaqsWithPopularity(classData.tags, classData.category, undefined, 3);

    // Schema.org JSON-LD
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: classData.term,
        description: classData.definition,
        image: classData.ogImage,
        datePublished: classData.createdAt.toISOString(),
        dateModified: classData.updatedAt.toISOString(),
        author: {
            "@type": "Person",
            name: "준이아빠",
            url: absoluteUrl("/about"),
        },
        keywords: classData.tags.join(", "),
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

            <div className="py-4 sm:py-12">
                <ViewTracker
                    contentType="class"
                    contentId={classData.id}
                    contentTitle={classData.term}
                    contentSlug={classSlug}
                    category={classData.category}
                    tags={classData.tags}
                />

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
                    sidebar={
                        <div className="lg:sticky lg:top-24 space-y-4 sm:space-y-6">
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

                            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter mb-3 sm:mb-4 comic-emphasis leading-tight">
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

                        {/* Content */}
                        <NeoCard className="prose prose-sm sm:prose-lg max-w-none p-4 sm:p-8 mb-6 sm:mb-8">
                            <NeoCardContent>
                                <MarkdownRenderer content={classData.content} />
                            </NeoCardContent>
                        </NeoCard>

                        {/* Navigation (Prev/Next) */}
                        {(navigation.prev || navigation.next) && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
                                {navigation.prev ? (
                                    <Link href={`/class/${courseSlug}/${navigation.prev.slug}`}>
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
                                    </Link>
                                ) : (
                                    <div />
                                )}
                                {navigation.next && (
                                    <Link href={`/class/${courseSlug}/${navigation.next.slug}`}>
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
                                    </Link>
                                )}
                            </div>
                        )}

                        {/* Related Classes */}
                        {relatedClasses.length > 0 && (
                            <NeoCard className="bg-accent halftone-bg p-4 sm:p-6 mb-6 sm:mb-8">
                                <NeoCardHeader>
                                    <NeoCardTitle className="flex items-center gap-2">
                                        <BookOpen className="w-5 h-5" />
                                        연관 개념
                                    </NeoCardTitle>
                                </NeoCardHeader>
                                <NeoCardContent>
                                    <div className="grid gap-3">
                                        {relatedClasses.map((related) => (
                                            <Link
                                                key={related.id}
                                                href={`/class/${related.courseInfo?.slug || courseSlug}/${related.slug}`}
                                                className="block p-3 sm:p-4 bg-white border-2 border-black hover:translate-x-1 hover:translate-y-1 hover:shadow-none neo-shadow-sm transition-all"
                                            >
                                                <h3 className="font-bold text-sm sm:text-base mb-1">{related.term}</h3>
                                                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                                                    {related.definition}
                                                </p>
                                            </Link>
                                        ))}
                                    </div>
                                </NeoCardContent>
                            </NeoCard>
                        )}

                        {/* Related Insights */}
                        {relatedPosts.length > 0 && (
                            <NeoCard className="bg-blue-50 halftone-bg p-4 sm:p-6 mb-6 sm:mb-8">
                                <NeoCardHeader>
                                    <NeoCardTitle className="flex items-center gap-2">
                                        <Sparkles className="w-5 h-5" />
                                        관련 인사이트
                                    </NeoCardTitle>
                                </NeoCardHeader>
                                <NeoCardContent>
                                    <div className="grid gap-3">
                                        {relatedPosts.map((post) => (
                                            <Link
                                                key={post.id}
                                                href={`/insights/${post.slug}`}
                                                className="block p-3 sm:p-4 bg-white border-2 border-black hover:translate-x-1 hover:translate-y-1 hover:shadow-none neo-shadow-sm transition-all"
                                            >
                                                <h3 className="font-bold text-sm sm:text-base mb-1">{post.title}</h3>
                                                {post.excerpt && (
                                                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                                                        {post.excerpt}
                                                    </p>
                                                )}
                                            </Link>
                                        ))}
                                    </div>
                                </NeoCardContent>
                            </NeoCard>
                        )}

                        {/* Related FAQs */}
                        {relatedFaqs.length > 0 && (
                            <NeoCard className="bg-green-50 halftone-bg p-4 sm:p-6">
                                <NeoCardHeader>
                                    <NeoCardTitle className="flex items-center gap-2">
                                        <HelpCircle className="w-5 h-5" />
                                        관련 FAQ
                                    </NeoCardTitle>
                                </NeoCardHeader>
                                <NeoCardContent>
                                    <div className="grid gap-3">
                                        {relatedFaqs.map((faq) => (
                                            <Link
                                                key={faq.id}
                                                href={`/faq/${faq.slug}`}
                                                className="block p-3 sm:p-4 bg-white border-2 border-black hover:translate-x-1 hover:translate-y-1 hover:shadow-none neo-shadow-sm transition-all"
                                            >
                                                <h3 className="font-bold text-sm sm:text-base">{faq.question}</h3>
                                            </Link>
                                        ))}
                                    </div>
                                </NeoCardContent>
                            </NeoCard>
                        )}
                    </article>
                </ContentFocusLayout>
            </div>
        </>
    );
}
