"use client";

import { useState } from "react";
import { Mail, ArrowRight } from "lucide-react";
import { sendGAEvent } from "@/lib/gtm";
import { cn } from "@/lib/utils";
import { NewsletterModal } from "@/components/NewsletterModal";
import type { SignupSource } from "@/lib/newsletter/options";

type NewsletterLocation = Extract<SignupSource, "post_bottom" | "home" | "footer">;

interface NewsletterCtaProps {
  location: Exclude<NewsletterLocation, "footer">;
  className?: string;
}

const trackClick = (location: NewsletterLocation) => {
  sendGAEvent("click_newsletter", { location });
};

/** 글 하단, 홈에 쓰는 카드형 뉴스레터 CTA. 누르면 가입 팝업이 열린다. */
export function NewsletterCta({ location, className }: NewsletterCtaProps) {
  const [open, setOpen] = useState(false);

  return (
    <section className={className}>
      <button
        type="button"
        onClick={() => {
          trackClick(location);
          setOpen(true);
        }}
        className="block w-full text-left group"
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
                AI가 바꾸는 일과 도구, 측정 실무 인사이트를 매주 이메일로 보내드립니다.
              </p>
            </div>
            <span className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white text-sm font-black uppercase tracking-wide border-2 border-black flex-shrink-0 group-hover:bg-[#FF0033] transition-colors">
              무료 구독하기
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
            <ArrowRight className="sm:hidden w-5 h-5 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </button>
      <NewsletterModal open={open} onClose={() => setOpen(false)} signupSource={location} />
    </section>
  );
}

interface NewsletterFooterButtonProps {
  apTheme: boolean;
}

/** 푸터 About 열에 쓰는 버튼형 CTA. 카카오톡 문의 버튼과 같은 구조를 따른다. */
export function NewsletterFooterButton({ apTheme }: NewsletterFooterButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          trackClick("footer");
          setOpen(true);
        }}
        className={cn(
          "mt-2 inline-flex items-center gap-2 px-4 py-2 bg-accent text-black text-xs font-black transition-all sm:self-start",
          apTheme
            ? "rounded-[10px] border border-[rgba(255,215,0,0.5)] hover:shadow-[0_0_18px_rgba(255,215,0,0.35)]"
            : "border-2 border-white hover:bg-[#FFE44D] neo-shadow-sm"
        )}
      >
        <Mail className="w-4 h-4" />
        뉴스레터 구독하기
      </button>
      <NewsletterModal open={open} onClose={() => setOpen(false)} signupSource="footer" />
    </>
  );
}
