"use client";

import { Mail, ArrowRight } from "lucide-react";
import { sendGAEvent } from "@/lib/gtm";
import { cn } from "@/lib/utils";
import { NEWSLETTER_URL } from "@/lib/constants";

type NewsletterLocation = "post_bottom" | "home" | "footer";

interface NewsletterCtaProps {
  location: Exclude<NewsletterLocation, "footer">;
  className?: string;
}

const trackClick = (location: NewsletterLocation) => {
  sendGAEvent("click_newsletter", { location });
};

/** 글 하단, 홈에 쓰는 카드형 뉴스레터 CTA. 홈 About Author CTA와 같은 급의 시각 블록. */
export function NewsletterCta({ location, className }: NewsletterCtaProps) {
  return (
    <section className={className}>
      <a
        href={NEWSLETTER_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackClick(location)}
        className="block group"
      >
        <div className="bg-accent neo-border-thick neo-shadow-lg p-4 sm:p-8 hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
          <div className="flex items-center gap-3 sm:gap-6">
            <div className="bg-black p-2 sm:p-3 border-2 border-black -rotate-3 group-hover:rotate-0 transition-transform flex-shrink-0">
              <Mail className="w-6 h-6 sm:w-8 sm:h-8 text-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm sm:text-xl font-black uppercase mb-1 sm:mb-2">
                디지털마케터 뉴스레터
              </h3>
              <p className="text-xs sm:text-base text-black/70 leading-relaxed">
                GA4, SEO, AI 마케팅 실무 인사이트를 월 1~2회 이메일로 보내드립니다.
              </p>
            </div>
            <span className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white text-sm font-black uppercase tracking-wide border-2 border-black flex-shrink-0 group-hover:bg-[#FF0033] transition-colors">
              무료 구독하기
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
            <ArrowRight className="sm:hidden w-5 h-5 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </a>
    </section>
  );
}

interface NewsletterFooterButtonProps {
  apTheme: boolean;
}

/** 푸터 About 열에 쓰는 버튼형 CTA. 카카오톡 문의 버튼과 같은 구조를 따른다. */
export function NewsletterFooterButton({ apTheme }: NewsletterFooterButtonProps) {
  return (
    <a
      href={NEWSLETTER_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackClick("footer")}
      className={cn(
        "mt-2 inline-flex items-center gap-2 px-4 py-2 bg-accent text-black text-xs font-black transition-all sm:self-start",
        apTheme
          ? "rounded-[10px] border border-[rgba(255,215,0,0.5)] hover:shadow-[0_0_18px_rgba(255,215,0,0.35)]"
          : "border-2 border-white hover:bg-[#FFE44D] neo-shadow-sm"
      )}
    >
      <Mail className="w-4 h-4" />
      뉴스레터 구독하기
    </a>
  );
}
