"use client";

/**
 * 구독 게이트.
 * 공개 2편을 뺀 나머지 튜토리얼의 실습 시작 자리에 놓인다.
 * 지금은 스티비 구독 화면으로 보내기만 하고, 구독자 확인 절차는 2단계에서 붙인다.
 */

import { Mail, ArrowRight, Lock } from "lucide-react";
import { NEWSLETTER_URL } from "@/lib/constants";
import { sendGAEvent } from "@/lib/gtm";

interface SubscribeGateProps {
  /** 잠긴 튜토리얼 슬러그. 어느 편에서 게이트를 만났는지 남긴다 */
  slug: string;
  title: string;
  /** 이 편에서 배우는 것. 무엇이 잠겨 있는지 알려 준다 */
  teaches: string[];
}

export function SubscribeGate({ slug, title, teaches }: SubscribeGateProps) {
  return (
    <div className="ga4-gate">
      <span className="ga4-gate-icon" aria-hidden>
        <Lock className="w-5 h-5" strokeWidth={1.8} />
      </span>

      <h2 className="ga4-gate-title">이 실습은 뉴스레터 구독자에게 열립니다</h2>
      <p className="ga4-gate-desc">
        {title} 실습은 디지털마케터 뉴스레터를 구독하면 바로 볼 수 있습니다. 구독은 무료이고,
        GA4와 SEO 실무 내용을 월 1회에서 2회 보내 드립니다. 구독 없이 볼 수 있는 튜토리얼도 두 편
        있으니, 먼저 해 보고 구독을 결정해도 됩니다.
      </p>

      {teaches.length > 0 && (
        <ul className="ga4-gate-list">
          {teaches.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      )}

      <a
        href={NEWSLETTER_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => sendGAEvent("ga4edu_subscribe_click", { content_id: slug })}
        className="ga4-btn-primary"
      >
        <Mail className="w-4 h-4" strokeWidth={2} /> 무료로 구독하고 실습 열기
        <ArrowRight className="w-4 h-4" strokeWidth={2} />
      </a>

      <p className="ga4-gate-foot">
        구독 없이 볼 수 있는 튜토리얼은 아래 이어서 볼 튜토리얼에 있습니다.
      </p>
    </div>
  );
}
