import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Utensils,
  GraduationCap,
  Palette,
  Plane,
  Coffee,
  MapPin,
  Calendar,
  Star,
  ArrowLeft
} from "lucide-react";
import { db } from "@/lib/db";
import { lifeLogs, LifeLogCategory } from "@/lib/schema";
import { eq } from "drizzle-orm";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { ViewTracker } from "@/components/ViewTracker";

const categoryConfig: Record<LifeLogCategory, { icon: typeof Utensils; label: string; color: string }> = {
  FOOD: { icon: Utensils, label: "맛집", color: "bg-orange-500" },
  LECTURE: { icon: GraduationCap, label: "강의", color: "bg-blue-500" },
  CULTURE: { icon: Palette, label: "문화생활", color: "bg-purple-500" },
  TRAVEL: { icon: Plane, label: "여행", color: "bg-green-500" },
  DAILY: { icon: Coffee, label: "일상", color: "bg-gray-500" },
};

async function getLifeLog(slug: string) {
  return db.query.lifeLogs.findFirst({
    where: eq(lifeLogs.slug, slug),
  });
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const log = await getLifeLog(slug);

  if (!log) {
    return { title: "Not Found" };
  }

  const defaultDescription = log.content.replace(/[#*`]/g, "").slice(0, 160);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://redline-matrix.com";

  return {
    title: log.metaTitle || `${log.title} | Life Log`,
    description: log.metaDescription || defaultDescription,
    openGraph: {
      title: log.ogTitle || log.metaTitle || log.title,
      description: log.ogDescription || log.metaDescription || defaultDescription,
      images: log.ogImage ? [{ url: log.ogImage }] : log.thumbnailUrl ? [{ url: log.thumbnailUrl }] : [],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: log.ogTitle || log.metaTitle || log.title,
      description: log.ogDescription || log.metaDescription || defaultDescription,
      images: log.ogImage ? [log.ogImage] : log.thumbnailUrl ? [log.thumbnailUrl] : [],
    },
    alternates: {
      canonical: log.canonicalUrl || `https://www.digitalmarketer.co.kr/about/life/${slug}`
    },
    robots: log.noIndex ? { index: false, follow: false } : { index: true, follow: true },
  };
}

export default async function LifeLogDetailPage({ params }: Props) {
  const { slug } = await params;
  const log = await getLifeLog(slug);

  if (!log || !log.isPublished) {
    notFound();
  }

  const config = categoryConfig[log.category as LifeLogCategory];
  const Icon = config?.icon || Coffee;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
      <ViewTracker
        contentType="life"
        contentId={log.id}
        contentTitle={log.title}
        contentSlug={slug}
      />
      {/* Back Link */}
      <Link
        href="/about/life"
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary mb-6 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Life Log 목록으로
      </Link>

      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-sm font-bold text-white border-2 border-black ${config?.color || "bg-gray-500"}`}>
            <Icon className="w-4 h-4" />
            {config?.label || log.category}
          </span>
          {log.visitedAt && (
            <span className="inline-flex items-center gap-1.5 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              {new Date(log.visitedAt).toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric"
              })}
            </span>
          )}
          {log.location && (
            <span className="inline-flex items-center gap-1.5 text-sm text-gray-500">
              <MapPin className="w-4 h-4" />
              {log.location}
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-4xl font-black mb-4">{log.title}</h1>

        {log.rating && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-gray-600">평점:</span>
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${i < log.rating! ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                />
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Thumbnail */}
      {log.thumbnailUrl && (
        <div className="mb-8 border-4 border-black neo-shadow overflow-hidden">
          <img
            src={log.thumbnailUrl}
            alt={log.title}
            className="w-full h-auto"
          />
        </div>
      )}

      {/* Content */}
      <article className="bg-white border-4 border-black neo-shadow p-6 sm:p-8">
        <MarkdownRenderer content={log.content} />
      </article>

      {/* Footer */}
      <footer className="mt-8 pt-6 border-t-2 border-gray-200">
        <p className="text-sm text-gray-500">
          작성일: {new Date(log.createdAt).toLocaleDateString("ko-KR")}
          {log.updatedAt !== log.createdAt && (
            <> · 수정일: {new Date(log.updatedAt).toLocaleDateString("ko-KR")}</>
          )}
        </p>
      </footer>
    </div>
  );
}
