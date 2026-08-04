"use client";

/** Phase 4: 정리. 이번 AIPBL에서 익힌 세 기술 복습과 최종 템플릿 제공. 모든 AIPBL이 공용으로 쓴다. */

import { useState } from "react";
import Link from "next/link";
import { Check, Copy, Mail, MessageCircle, RotateCcw, X } from "lucide-react";
import { KAKAO_INQUIRY_URL, NEWSLETTER_URL } from "@/lib/constants";
import { sendGAEvent } from "@/lib/gtm";
import { BTN_GHOST, Callout } from "./ui";
import type { LabEventParams } from "./LabShell";

export interface WrapContent {
  /** 완료 카드 제목. 예: "프롬프트 기초 AIPBL 완료" */
  completeTitle: string;
  /** 이번 AIPBL에서 익힌 세 기술 요약 카드 */
  elements: { name: string; desc: string }[];
  templateTitle: string;
  template: string;
  calloutTitle: string;
  calloutText: string;
  /** 빨간 기본 버튼. 다음 단계 AIPBL 또는 목록으로 이동한다. */
  primary: { href: string; label: string };
  /** 보조 고스트 링크 (선택) */
  secondary?: { href: string; label: string };
}

interface WrapPhaseProps {
  content: WrapContent;
  score: number;
  total: number;
  /** localStorage에 저장된 퀴즈 최고 점수. 이번 점수보다 높을 때만 함께 보여 준다 */
  bestScore?: number;
  eventParams: LabEventParams;
  onRestart: () => void;
}

type CopyState = "idle" | "copied" | "failed";

export function WrapPhase({
  content,
  score,
  total,
  bestScore,
  eventParams,
  onRestart,
}: WrapPhaseProps) {
  const [copyState, setCopyState] = useState<CopyState>("idle");

  const copyTemplate = async () => {
    try {
      await navigator.clipboard.writeText(content.template);
      setCopyState("copied");
      sendGAEvent("click_copy_template", { ...eventParams });
    } catch {
      // 권한 거부, 비보안 컨텍스트 등. 직접 복사를 안내한다.
      setCopyState("failed");
    }
    setTimeout(() => setCopyState("idle"), 2500);
  };

  return (
    <div className="space-y-6">
      <div className="ap-card ap-card-accent p-6 sm:p-8 text-center">
        <img
          src="/images/ai-practice/icons/goal-trophy.png"
          alt=""
          aria-hidden
          className="ap-icon-3d w-16 h-16 mx-auto mb-4"
        />
        <h3 className="text-lg sm:text-xl font-semibold mb-2 text-white">{content.completeTitle}</h3>
        <p className="text-sm text-[var(--ap-muted)]">
          점검 결과: {total}문항 중 {score}문항 정답
          {bestScore !== undefined && bestScore > score && ` (최고 기록 ${bestScore}문항)`}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {content.elements.map((el, i) => (
          <div key={el.name} className="ap-card ap-card-accent p-5">
            <span className="ap-step-index mb-3">{String(i + 1).padStart(2, "0")}</span>
            <h4 className="font-semibold text-sm mb-1.5 text-white">{el.name}</h4>
            <p className="text-[13px] leading-relaxed text-[var(--ap-muted)]">{el.desc}</p>
          </div>
        ))}
      </div>

      <div className="ap-card ap-card-accent p-6 sm:p-8">
        <div className="flex items-center justify-between gap-4 mb-4">
          <h3 className="font-semibold text-base text-white">{content.templateTitle}</h3>
          <button type="button" onClick={copyTemplate} className={BTN_GHOST}>
            {copyState === "copied" ? (
              <>
                <Check className="w-4 h-4 text-[#7dd3fc]" strokeWidth={1.8} /> 복사됨
              </>
            ) : copyState === "failed" ? (
              <>
                <X className="w-4 h-4 text-[#ff6b81]" strokeWidth={1.8} /> 직접 선택해 복사해 주세요
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" strokeWidth={1.8} /> 템플릿 복사
              </>
            )}
          </button>
        </div>
        <pre className="ap-prompt p-5 overflow-x-auto">{content.template}</pre>
      </div>

      <Callout title={content.calloutTitle}>
        <p className="whitespace-pre-line">{content.calloutText}</p>
      </Callout>

      <div className="flex flex-wrap justify-end gap-3">
        <button type="button" onClick={onRestart} className={BTN_GHOST}>
          <RotateCcw className="w-4 h-4" strokeWidth={1.8} /> 처음부터 다시 하기
        </button>
        {content.secondary && (
          <Link href={content.secondary.href} className={BTN_GHOST}>
            {content.secondary.label}
          </Link>
        )}
        <Link
          href={content.primary.href}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#ff0033] text-white text-sm font-semibold hover:bg-[#e0002d] transition-colors"
        >
          {content.primary.label}
        </Link>
        {/* 실습을 마쳐도 궁금증이 남을 수 있어, 상단 내비와 같은 뉴스레터·커뮤니티 입장을 유도한다 */}
        <a
          href={NEWSLETTER_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => sendGAEvent("click_newsletter", { location: "aipbl_wrap", ...eventParams })}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#ffd700] text-black text-sm font-semibold hover:shadow-[0_0_18px_rgba(255,215,0,0.35)] transition-all"
        >
          <Mail className="w-4 h-4 flex-shrink-0" strokeWidth={1.8} /> 뉴스레터 구독하기
        </a>
        <a
          href={KAKAO_INQUIRY_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            sendGAEvent("click_nav", { menu_name: "Community", location: "aipbl_wrap", ...eventParams })
          }
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-[rgba(255,92,125,0.5)] text-[#ff8fa3] text-sm font-semibold hover:shadow-[0_0_18px_rgba(255,92,125,0.35)] transition-all"
        >
          <MessageCircle className="w-4 h-4 flex-shrink-0" strokeWidth={1.8} /> 커뮤니티 입장하기
        </a>
      </div>
    </div>
  );
}
