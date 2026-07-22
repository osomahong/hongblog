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
  const thumbnail = post.ogImage || `/og/${post.slug}.png`;
  return (
    <RelatedLink
      href={`/insights/${post.slug}`}
      relatedType="insights"
      contentId={post.slug}
      contentName={post.title}
      className="flex flex-col min-w-[240px] w-[240px] sm:w-auto sm:min-w-0 snap-start bg-white border-2 border-black neo-shadow-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
    >
      {/* 인피드 광고 카드(이미지 상단형)와 높이·구성을 맞추기 위한 썸네일 */}
      <img
        src={thumbnail}
        alt={`${post.title} 썸네일`}
        loading="lazy"
        decoding="async"
        className="w-full aspect-[1200/630] object-cover border-b-2 border-black"
      />
      <div className="flex flex-col gap-1.5 p-3 sm:p-4 flex-1">
        <NeoBadge
          variant={badgeVariants[post.category] ?? "marketing"}
          className="self-start text-[10px] px-2 py-0.5"
        >
          {categoryLabels[post.category] ?? post.category}
        </NeoBadge>
        <span className="font-bold text-[15px] sm:text-base leading-snug line-clamp-2">
          {post.title}
        </span>
        <p className="text-xs sm:text-[13px] text-muted-foreground line-clamp-2 leading-relaxed">
          {post.excerpt}
        </p>
        <span className="mt-auto pt-1 text-[11px] font-mono text-muted-foreground">
          {post.publishedAt?.toLocaleDateString("ko-KR")}
        </span>
      </div>
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
        className="adsense-slot flex flex-col min-w-[240px] w-[240px] sm:w-auto sm:min-w-0 snap-start bg-white border-2 border-black neo-shadow-sm p-2"
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
      {/* 행 단위로 카드 프레임 높이를 동일하게 맞춘다 (기본 stretch). 광고 미채움 시에는 CSS로 카드째 숨겨져 빈 프레임이 남지 않는다 */}
      <div className="flex items-stretch gap-3 overflow-x-auto snap-x pb-2 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:pb-0">
        {cards}
      </div>
    </section>
  );
}
