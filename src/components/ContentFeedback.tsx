"use client";

import { useEffect, useState } from "react";
import { Check, ThumbsDown, ThumbsUp } from "lucide-react";
import { sendGAEvent } from "@/lib/gtm";

interface ContentFeedbackProps {
  contentSlug: string;
  contentName: string;
}

const REASONS = [
  ["difficult", "설명이 어려워요"],
  ["needs_example", "예제가 부족해요"],
  ["needs_update", "최신 정보가 필요해요"],
  ["different_intent", "찾던 내용과 달라요"],
] as const;

type FeedbackState = "idle" | "choose_reason" | "done";

export function ContentFeedback({ contentSlug, contentName }: ContentFeedbackProps) {
  const storageKey = `content-feedback:${contentSlug}`;
  const [state, setState] = useState<FeedbackState>("idle");

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        if (window.localStorage.getItem(storageKey)) setState("done");
      } catch {
        // 저장소를 막은 브라우저에서도 피드백 버튼은 그대로 동작한다.
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, [storageKey]);

  const submit = (response: "helpful" | "needs_work", reason?: string) => {
    sendGAEvent("content_feedback", {
      content_id: contentSlug,
      content_name: contentName,
      response,
      reason: reason ?? "",
    });
    try {
      window.localStorage.setItem(storageKey, JSON.stringify({ response, reason: reason ?? "" }));
    } catch {
      // GA4 이벤트 전송은 localStorage 사용 가능 여부와 무관하게 유지한다.
    }
    setState("done");
  };

  return (
    <section
      className="mt-6 sm:mt-8 border-y-2 border-black py-4"
      aria-labelledby="content-feedback-title"
    >
      {state === "done" ? (
        <p className="flex items-center gap-2 text-sm font-bold" aria-live="polite">
          <Check className="w-4 h-4 text-green-600" />
          의견을 남겨주셔서 감사합니다.
        </p>
      ) : state === "choose_reason" ? (
        <div>
          <p id="content-feedback-title" className="text-sm font-bold mb-3">
            어떤 부분을 보완하면 좋을까요?
          </p>
          <div className="flex flex-wrap gap-2">
            {REASONS.map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => submit("needs_work", value)}
                className="px-3 py-1.5 text-xs font-bold bg-white border-2 border-black hover:bg-[#FFF7D6] transition-colors"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p id="content-feedback-title" className="text-sm font-bold">
            이 글이 도움이 되었나요?
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => submit("helpful")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-white border-2 border-black hover:bg-green-50 transition-colors"
            >
              <ThumbsUp className="w-3.5 h-3.5" /> 도움이 됐어요
            </button>
            <button
              type="button"
              onClick={() => setState("choose_reason")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-white border-2 border-black hover:bg-red-50 transition-colors"
            >
              <ThumbsDown className="w-3.5 h-3.5" /> 보완이 필요해요
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
