import { Newspaper } from "lucide-react";
import { NeoBadge } from "@/components/neo";
import { RelatedLink } from "@/components/RelatedLink";
import { AdSenseSlot } from "@/components/ads/AdSenseSlot";
import { AD_SLOTS, AD_INFEED_LAYOUT_KEY, isAdEnabled } from "@/lib/ads";
import type { PostWithTags } from "@/lib/types";

interface RelatedPostsProps {
  posts: PostWithTags[];
}

const categoryLabels: Record<string, string> = {
  AI_TECH: "AI & Tech",
  DATA: "Data",
  MARKETING: "Marketing",
};

const badgeVariants: Record<string, "ai" | "data" | "marketing"> = {
  AI_TECH: "ai",
  DATA: "data",
  MARKETING: "marketing",
};

function PostCard({ post }: { post: PostWithTags }) {
  return (
    <RelatedLink
      href={`/insights/${post.slug}`}
      relatedType="insights"
      contentId={post.slug}
      contentName={post.title}
      className="flex flex-col gap-2 min-w-[240px] w-[240px] sm:w-auto sm:min-w-0 snap-start bg-white border-2 border-black neo-shadow-sm p-4 hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
    >
      <NeoBadge
        variant={badgeVariants[post.category] ?? "marketing"}
        className="self-start text-[10px] sm:text-xs px-2 py-0.5"
      >
        {categoryLabels[post.category] ?? post.category}
      </NeoBadge>
      <span className="font-black text-sm sm:text-base leading-snug line-clamp-2">
        {post.title}
      </span>
      <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
        {post.excerpt}
      </p>
      <span className="mt-auto text-[11px] sm:text-xs font-mono text-muted-foreground">
        {post.publishedAt?.toLocaleDateString("ko-KR")}
      </span>
    </RelatedLink>
  );
}

/**
 * 본문 하단 "다음으로 읽어볼 글" 추천 카드 영역.
 * 인피드 광고 슬롯이 설정되면 두 번째 카드 자리에 광고 카드가 들어간다.
 * 관련 글이 2개 미만이면 영역 전체를 숨긴다.
 */
export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length < 2) return null;

  const showAd = isAdEnabled(AD_SLOTS.inFeed);
  const cards = posts.map((post) => (
    <PostCard key={post.slug} post={post} />
  ));

  if (showAd) {
    cards.splice(
      1,
      0,
      <div
        key="in-feed-ad"
        className="adsense-slot min-w-[240px] w-[240px] sm:w-auto sm:min-w-0 snap-start bg-white border-2 border-black neo-shadow-sm p-2"
      >
        <AdSenseSlot
          slot={AD_SLOTS.inFeed}
          format="fluid"
          layoutKey={AD_INFEED_LAYOUT_KEY}
          minHeight={160}
        />
      </div>
    );
  }

  return (
    <section className="mt-6 sm:mt-8">
      <h2 className="flex items-center gap-2 font-black text-lg sm:text-xl mb-3 sm:mb-4">
        <Newspaper className="w-5 h-5" />
        다음으로 읽어볼 글
      </h2>
      <div className="flex items-start gap-3 overflow-x-auto snap-x pb-2 sm:grid sm:grid-cols-2 sm:gap-4 sm:items-start sm:overflow-visible sm:pb-0">
        {cards}
      </div>
    </section>
  );
}
