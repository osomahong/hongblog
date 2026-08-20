import { ArrowRight, Route } from "lucide-react";
import { RelatedLink } from "@/components/RelatedLink";
import type { PostWithTags } from "@/lib/types";

interface NextContentCardProps {
  post: PostWithTags;
  reason: string;
}

/** 한 글만 강조해 보여주는 편집형 다음 단계. 추천 목록과 역할을 분리한다. */
export function NextContentCard({ post, reason }: NextContentCardProps) {
  return (
    <section className="mt-6 sm:mt-8" aria-labelledby="next-content-title">
      <div className="flex items-center gap-2 mb-3">
        <Route className="w-5 h-5 text-[#FF0033]" />
        <h2 id="next-content-title" className="font-black text-lg sm:text-xl">
          다음 단계
        </h2>
      </div>
      <RelatedLink
        href={`/insights/${post.slug}`}
        relatedType="insights"
        contentId={post.slug}
        contentName={post.title}
        className="group flex items-center justify-between gap-4 bg-[#FFF7D6] border-2 border-black neo-shadow-sm p-4 sm:p-5 hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
      >
        <div className="min-w-0">
          <p className="text-[11px] sm:text-xs font-bold text-[#FF0033] mb-1">{reason}</p>
          <h3 className="font-black text-base sm:text-lg leading-snug mb-1">{post.title}</h3>
          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
        </div>
        <span className="shrink-0 inline-flex items-center justify-center w-10 h-10 bg-black text-white border-2 border-black group-hover:bg-[#FF0033] transition-colors">
          <ArrowRight className="w-5 h-5" aria-hidden="true" />
          <span className="sr-only">다음 글 읽기</span>
        </span>
      </RelatedLink>
    </section>
  );
}
