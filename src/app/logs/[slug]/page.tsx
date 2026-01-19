import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Sparkles, Database, TrendingUp, HelpCircle, FileText } from "lucide-react";
import { NeoCard, NeoCardHeader, NeoCardTitle, NeoCardContent } from "@/components/neo";
import { NeoBadge } from "@/components/neo";
import { NeoButton } from "@/components/neo";
import { NeoTagBadge } from "@/components/neo";
import { absoluteUrl } from "@/lib/utils";
import { getLogBySlug, getRelatedFaqsWithPopularity, getRelatedPostsWithPopularity } from "@/lib/queries";
import { ViewTracker } from "@/components/ViewTracker";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { AuthorCard } from "@/components/AuthorCard";
import { ContentFocusLayout } from "@/components/ContentFocusLayout";
import { RelatedLink } from "@/components/RelatedLink";

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
    const log = await getLogBySlug(slug);

    if (!log) {
        return { title: "Not Found" };
    }

    const effectiveTitle = log.metaTitle || log.title;
    const effectiveDescription = log.metaDescription || `${log.title} - 컨설팅 로그`;
    const effectiveOgTitle = log.ogTitle || effectiveTitle;
    const effectiveOgDescription = log.ogDescription || effectiveDescription;

    return {
        title: effectiveTitle,
        description: effectiveDescription,
        robots: log.noIndex ? { index: false, follow: false } : undefined,
        alternates: {
            canonical: log.canonicalUrl || `https://www.digitalmarketer.co.kr/logs/${slug}`
        },
        openGraph: {
            title: effectiveOgTitle,
            description: effectiveOgDescription,
            type: "article",
            url: absoluteUrl(`/logs/${slug}`),
            images: log.ogImage ? [{ url: log.ogImage, width: 1200, height: 630 }] : undefined,
        },
        twitter: {
            card: "summary_large_image",
            title: effectiveOgTitle,
            description: effectiveOgDescription,
            images: log.ogImage ? [log.ogImage] : undefined,
        },
    };
}

export default async function LogDetailPage({ params }: Props) {
    const { slug } = await params;
    const log = await getLogBySlug(slug);

    if (!log) {
        notFound();
    }

    const relatedFaqs = await getRelatedFaqsWithPopularity(log.tags, log.category, undefined, 3);
    const relatedPosts = await getRelatedPostsWithPopularity(log.tags, log.category, undefined, 2);
    const Icon = categoryIcons[log.category as keyof typeof categoryIcons] || Sparkles;

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: log.title,
        description: log.metaDescription || `${log.title} - 컨설팅 로그`,
        image: log.ogImage || log.thumbnailUrl,
        datePublished: log.createdAt.toISOString(),
        dateModified: log.updatedAt.toISOString(),
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
            "@id": absoluteUrl(`/logs/${slug}`),
        },
        keywords: log.tags.join(", "),
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
                name: "Logs",
                item: absoluteUrl("/logs"),
            },
            {
                "@type": "ListItem",
                position: 3,
                name: log.title,
                item: absoluteUrl(`/logs/${slug}`),
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
                    contentType="log"
                    contentId={log.id}
                    contentTitle={log.title}
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
                    contentTitle={log.title}
                    sidebar={
                        <div className="lg:sticky lg:top-24 space-y-3 sm:space-y-6">
                            {/* Related FAQs */}
                            {relatedFaqs.length > 0 && (
                                <NeoCard className="bg-accent p-3 sm:p-6 halftone-bg">
                                    <NeoCardHeader>
                                        <NeoCardTitle className="flex items-center gap-1.5 sm:gap-2 text-sm sm:text-lg relative z-10">
                                            <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                                            <span className="comic-emphasis">Related FAQs</span>
                                        </NeoCardTitle>
                                    </NeoCardHeader>
                                    <NeoCardContent className="relative z-10">
                                        <ul className="space-y-2 sm:space-y-3">
                                            {relatedFaqs.map((faq) => (
                                                <li key={faq.id}>
                                                    <RelatedLink
                                                        href={`/faq/${faq.slug}`}
                                                        relatedType="faqs"
                                                        contentId={faq.slug}
                                                        contentName={faq.question}
                                                        className="block p-2 sm:p-3 bg-white border-2 border-black hover:translate-x-1 hover:translate-y-1 hover:shadow-none neo-shadow-sm transition-all"
                                                    >
                                                        <span className="text-[11px] sm:text-sm font-medium leading-snug block">{faq.question}</span>
                                                    </RelatedLink>
                                                </li>
                                            ))}
                                        </ul>
                                    </NeoCardContent>
                                </NeoCard>
                            )}

                            {/* Related Insights */}
                            {relatedPosts.length > 0 && (
                                <NeoCard className="bg-orange-50 p-3 sm:p-6 halftone-bg">
                                    <NeoCardHeader>
                                        <NeoCardTitle className="flex items-center gap-1.5 sm:gap-2 text-sm sm:text-lg relative z-10">
                                            <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                                            <span className="comic-emphasis">Related Insights</span>
                                        </NeoCardTitle>
                                    </NeoCardHeader>
                                    <NeoCardContent className="relative z-10">
                                        <ul className="space-y-2 sm:space-y-3">
                                            {relatedPosts.map((post) => (
                                                <li key={post.id}>
                                                    <RelatedLink
                                                        href={`/insights/${post.slug}`}
                                                        relatedType="insights"
                                                        contentId={post.slug}
                                                        contentName={post.title}
                                                        className="block p-2 sm:p-3 bg-white border-2 border-black hover:translate-x-1 hover:translate-y-1 hover:shadow-none neo-shadow-sm transition-all"
                                                    >
                                                        <span className="text-[11px] sm:text-sm font-bold leading-snug block">{post.title}</span>
                                                        <p className="text-[10px] sm:text-xs text-muted-foreground line-clamp-1 mt-0.5">{post.excerpt}</p>
                                                    </RelatedLink>
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
                                <NeoBadge variant={log.category === "AI_TECH" ? "ai" : log.category === "DATA" ? "data" : "marketing"} className="text-[10px] sm:text-xs px-2 sm:px-3 py-0.5 sm:py-1">
                                    <span className="flex items-center gap-1">
                                        {Icon && <Icon className="w-2.5 h-2.5 sm:w-3 sm:h-3" />}
                                        {categoryLabels[log.category as keyof typeof categoryLabels] || log.category}
                                    </span>
                                </NeoBadge>
                                {log.location && (
                                    <span className="text-[10px] sm:text-xs font-mono bg-black text-white px-2 py-1 border-2 border-black">
                                        📍 {log.location}
                                    </span>
                                )}
                            </div>
                            <h1 className="text-xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter mb-2 sm:mb-4 comic-emphasis leading-tight">
                                {log.title}
                            </h1>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t-2 border-black">
                                <span className="text-[10px] sm:text-sm font-mono">
                                    {log.visitedAt
                                        ? new Date(log.visitedAt).toLocaleDateString("ko-KR")
                                        : log.createdAt.toLocaleDateString("ko-KR")}
                                </span>
                                <div className="flex gap-1 sm:gap-1.5 flex-wrap">
                                    {log.tags.map((tag) => (
                                        <NeoTagBadge
                                            key={tag}
                                            tag={tag}
                                            className="text-[10px] sm:text-xs px-1.5 sm:px-3 py-0.5 sm:py-1"
                                        />
                                    ))}
                                </div>
                            </div>
                        </header>

                        <NeoCard className="prose prose-sm sm:prose-lg max-w-none p-3 sm:p-6">
                            <NeoCardContent>
                                <MarkdownRenderer content={log.content} />
                            </NeoCardContent>
                        </NeoCard>
                    </article>
                </ContentFocusLayout>
            </div>
        </>
    );
}
