"use client";

import { useCallback, useEffect, useState } from "react";
import { ListChecks, Lock, Sparkles } from "lucide-react";
import { NewsletterModal } from "@/components/NewsletterModal";
import { sendGAEvent } from "@/lib/gtm";
import {
  INITIAL_ACCESS,
  SUMMARY_GATED_CLASS,
  markPeeked,
  markSubscribed,
  resolveAccess,
  type SummaryAccess,
} from "@/lib/summary-gate";
import { cn } from "@/lib/utils";

/**
 * 콘텐츠 3줄 요약 블록.
 *
 * 요약 문장은 서버에서 그대로 HTML로 나가므로 검색엔진과 답변 엔진은 언제나 읽는다.
 * 화면에서는 흐림 처리와 덮개로 가리고, 세션당 한 편만 열어 준다. 두 번째 글부터는
 * 뉴스레터를 구독해야 열린다.
 */

interface ContentSummaryProps {
  /** 열람 기록을 남길 때 쓰는 콘텐츠 슬러그 */
  slug: string;
  /** 콘텐츠 종류. GA4 이벤트 구분에 쓴다 */
  contentType: "post" | "class" | "course";
  /** 요약 문장. 보통 세 줄이고, 짧은 글은 그보다 적을 수 있다 */
  lines: string[];
  className?: string;
}

export function ContentSummary({ slug, contentType, lines, className }: ContentSummaryProps) {
  const [access, setAccess] = useState<SummaryAccess>(INITIAL_ACCESS);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    setAccess(resolveAccess(slug));
  }, [slug]);

  const handlePeek = useCallback(() => {
    markPeeked(slug);
    setAccess("open");
    sendGAEvent("open_summary", { content_type: contentType, content_slug: slug });
  }, [contentType, slug]);

  const handleGateClick = useCallback(() => {
    setModalOpen(true);
    sendGAEvent("click_newsletter", { location: "summary_gate" });
  }, []);

  const handleSubscribed = useCallback(() => {
    markSubscribed();
    setAccess("open");
  }, []);

  if (lines.length === 0) return null;

  const locked = access !== "open";

  return (
    <section
      className={cn("not-prose", SUMMARY_GATED_CLASS, className)}
      aria-label="3줄 요약"
      data-summary-access={access}
    >
      <div className="bg-white neo-border-thick neo-shadow">
        <div className="flex items-center gap-2 border-b-4 border-black bg-accent px-3 py-2 sm:px-5 sm:py-2.5">
          <ListChecks className="w-4 h-4 shrink-0" />
          <h2 className="text-xs sm:text-sm font-black uppercase tracking-wide">3줄 요약</h2>
        </div>

        <div className="relative">
          {/* 잠긴 상태에서도 문장은 그대로 남는다. 화면에서만 흐리게 가린다 */}
          <ol
            className={cn(
              "space-y-2.5 px-3 py-4 sm:space-y-3 sm:px-5 sm:py-5",
              locked && "select-none blur-[6px]"
            )}
            aria-hidden={locked}
          >
            {lines.map((line, index) => (
              <li key={index} className="flex gap-2.5 sm:gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border-2 border-black bg-black text-[11px] font-black text-white sm:h-6 sm:w-6 sm:text-xs">
                  {index + 1}
                </span>
                <span className="text-sm leading-relaxed sm:text-base">{line}</span>
              </li>
            ))}
          </ol>

          {locked && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-white/75 px-4 text-center">
              {access === "peek" ? (
                <>
                  <p className="text-xs text-black/70 sm:text-sm">
                    이번 방문에서 한 편은 바로 볼 수 있습니다.
                  </p>
                  <button
                    type="button"
                    onClick={handlePeek}
                    className="inline-flex items-center gap-1.5 border-2 border-black bg-black px-4 py-2 text-xs font-black uppercase tracking-wide text-white transition-colors hover:bg-[#FF0033] sm:text-sm"
                  >
                    <Sparkles className="h-4 w-4" />
                    요약 펼치기
                  </button>
                </>
              ) : (
                <>
                  <p className="text-xs text-black/70 sm:text-sm">
                    이번 방문의 무료 열람은 이미 썼습니다.
                  </p>
                  <button
                    type="button"
                    onClick={handleGateClick}
                    className="inline-flex items-center gap-1.5 border-2 border-black bg-accent px-4 py-2 text-xs font-black uppercase tracking-wide text-black transition-colors hover:bg-black hover:text-accent sm:text-sm"
                  >
                    <Lock className="h-4 w-4" />
                    뉴스레터 구독하고 보기
                  </button>
                  <p className="text-[11px] text-black/50 sm:text-xs">
                    구독하면 모든 글의 요약이 열립니다.
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <NewsletterModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        signupSource="summary_gate"
        onSubscribed={handleSubscribed}
      />
    </section>
  );
}
