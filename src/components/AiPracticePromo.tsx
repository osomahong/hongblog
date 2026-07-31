"use client";

/**
 * AI-Practice 유도 팝업 (CRM 스타일).
 * AI 관련 인사이트, 클래스 글에서 본문 50% 스크롤 시 한 번 나타나 AI-Practice로 안내한다.
 * 노출 억제: 세션당 1회(그냥 닫기 포함), "오늘 하루 보지 않기"와 CTA 클릭은 오늘 자정까지.
 */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, X } from "lucide-react";
import { sendGAEvent } from "@/lib/gtm";

const STORAGE_KEY = "hongblog-aipractice-promo";
const SESSION_KEY = "hongblog-aipractice-promo-session";
const SCROLL_THRESHOLD = 0.5;

interface PromoState {
  /** 이 시각(오늘 자정)까지 미노출 */
  hideUntil?: number;
}

function readState(): PromoState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    return parsed as PromoState;
  } catch {
    return {};
  }
}

/** 오늘 자정까지 미노출로 저장한다 */
function hideForToday(): void {
  try {
    const midnight = new Date();
    midnight.setHours(23, 59, 59, 999);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ hideUntil: midnight.getTime() }));
  } catch {
    // localStorage를 쓸 수 없는 환경에서는 조용히 건너뛴다
  }
}

interface AiPracticePromoProps {
  /** 팝업이 노출된 글의 슬러그 (GA content_id) */
  contentId: string;
  /** 팝업이 노출된 글의 제목 (GA content_name) */
  contentName: string;
}

export function AiPracticePromo({ contentId, contentName }: AiPracticePromoProps) {
  const [visible, setVisible] = useState(false);
  const shownRef = useRef(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(SESSION_KEY)) return;
      const state = readState();
      if (state.hideUntil && Date.now() < state.hideUntil) return;
    } catch {
      return;
    }

    const onScroll = () => {
      if (shownRef.current) return;
      const doc = document.documentElement;
      const progress = (window.scrollY + window.innerHeight) / doc.scrollHeight;
      if (progress < SCROLL_THRESHOLD) return;
      shownRef.current = true;
      setVisible(true);
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        // 세션 캡을 저장하지 못해도 노출은 계속한다
      }
      sendGAEvent("view_aipractice_promo", { content_id: contentId, content_name: contentName });
      window.removeEventListener("scroll", onScroll);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [contentId, contentName]);

  // 그냥 닫기: 이 세션에서만 숨긴다 (노출 시 저장된 세션 키가 재노출을 막는다)
  const dismiss = () => {
    setVisible(false);
    sendGAEvent("close_aipractice_promo", { content_id: contentId, content_name: contentName });
  };

  // 오늘 하루 보지 않기: 자정까지 숨긴다
  const dismissToday = () => {
    setVisible(false);
    hideForToday();
    sendGAEvent("close_aipractice_promo", { content_id: contentId, content_name: contentName });
  };

  const clickCta = () => {
    hideForToday();
    sendGAEvent("click_aipractice_start", {
      content_id: "ai-practice",
      content_name: "AI-Practice",
      button_name: "content_popup",
    });
  };

  if (!visible) return null;

  return (
    <div
      // 우하단은 집중 모드 안내 말풍선과 확장 버튼이 쓰므로 좌하단에 띄운다
      className="fixed bottom-4 inset-x-4 sm:inset-x-auto sm:bottom-6 sm:left-6 sm:w-[380px] z-50 aip-promo-in"
      role="dialog"
      aria-label="AI-Practice 실습 안내"
    >
      <div className="border-4 border-black bg-white neo-shadow-lg overflow-hidden">
        {/* 썸네일: AI-Practice 히어로 */}
        <Link href="/ai-practice" onClick={clickCta} className="block border-b-4 border-black">
          <img
            src="/images/ai-practice/promo-thumb.png"
            alt="AI-PRACTICE: 실습으로 배우는 PBL 기반 AI Self Education"
            className="w-full block"
            loading="lazy"
          />
        </Link>
        <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-2">
          <p className="flex items-center gap-2 font-black text-base tracking-tight">
            <Sparkles className="w-4 h-4 text-[#FF0000] flex-shrink-0" strokeWidth={2.2} />
            AI 기초부터 무료 실습 교육
          </p>
          <button
            type="button"
            onClick={dismiss}
            aria-label="팝업 닫기"
            className="p-1 -m-1 text-gray-500 hover:text-black transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4" strokeWidth={2.4} />
          </button>
        </div>
        <p className="text-sm leading-relaxed text-gray-700 mb-4">
          AI-PRACTICE는 웹 실습 화면에서 AI 활용을 직접 연습하는 AI Self Education
          공간입니다. 프롬프트 기초부터 심화까지 열려 있고, AI 셀프 교육 콘텐츠가 계속
          추가됩니다.
        </p>
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/ai-practice"
            onClick={clickCta}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FF0000] text-white text-sm font-bold border-2 border-black neo-shadow-sm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
          >
            AI-Practice 살펴보기 <ArrowRight className="w-4 h-4" strokeWidth={2.2} />
          </Link>
          <button
            type="button"
            onClick={dismissToday}
            className="text-xs text-gray-500 hover:text-black underline underline-offset-2 transition-colors flex-shrink-0"
          >
            오늘 하루 보지 않기
          </button>
        </div>
        </div>
      </div>
    </div>
  );
}
