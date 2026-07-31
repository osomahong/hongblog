"use client";

/**
 * Phase 3: 점검. 두 프롬프트 중 더 나은 쪽을 고르는 퀴즈. 모든 AIPBL이 공용으로 쓴다.
 * 해설 영역과 다음 버튼을 항상 렌더링해서, 선택 전후로 화면 높이가 흔들리지 않는다.
 */

import { useRef, useState } from "react";
import { ArrowRight, CheckCircle2, XCircle } from "lucide-react";
import { sendGAEvent } from "@/lib/gtm";
import { BTN_PRIMARY } from "./ui";
import type { LabEventParams } from "./LabShell";

export interface QuizQuestion {
  question: string;
  options: [string, string];
  correct: 0 | 1;
  explain: string;
}

interface QuizPhaseProps {
  quiz: QuizQuestion[];
  eventParams: LabEventParams;
  onComplete: (score: number) => void;
}

export function QuizPhase({ quiz, eventParams, onComplete }: QuizPhaseProps) {
  const [qi, setQi] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  // 리렌더 전의 연속 탭이 문항을 건너뛰거나 완료를 두 번 알리지 않게 막는다
  const advancingRef = useRef(false);

  const q = quiz[qi];
  const isLast = qi === quiz.length - 1;
  const revealed = picked !== null;

  const pick = (i: number) => {
    if (revealed) return;
    advancingRef.current = false;
    setPicked(i);
    if (i === q.correct) setScore((s) => s + 1);
    sendGAEvent("quiz_answer", {
      content_type: "ai_practice",
      ...eventParams,
      position: qi,
      selected_option: i,
      is_correct: i === q.correct,
    });
  };

  const next = () => {
    if (!revealed || advancingRef.current) return;
    advancingRef.current = true;
    if (isLast) {
      onComplete(score);
      return;
    }
    setQi((n) => n + 1);
    setPicked(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-white">
          문항 {qi + 1} / {quiz.length}
        </p>
        <p className="text-xs text-[var(--ap-muted)]">더 나은 프롬프트를 골라 주세요</p>
      </div>

      <div className="ap-card ap-card-accent p-6 sm:p-8">
        <p className="text-sm sm:text-base leading-relaxed text-gray-100 mb-6">{q.question}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {q.options.map((option, i) => {
            const chosen = picked === i;
            const isCorrect = i === q.correct;
            const border = !revealed
              ? "border-white/10 bg-white/[0.03] hover:border-[#a78bfa]"
              : isCorrect
                ? "ap-quiz-correct"
                : chosen
                  ? "border-[rgba(255,0,51,0.6)] bg-[rgba(255,0,51,0.08)]"
                  : "border-white/10 bg-white/[0.03] opacity-50";
            return (
              <button
                key={option}
                type="button"
                onClick={() => pick(i)}
                disabled={revealed}
                className={`text-left rounded-[14px] border p-4 transition-colors ${border}`}
              >
                <span className="block text-[10px] font-semibold tracking-[0.18em] uppercase text-[var(--ap-muted)] mb-2">
                  프롬프트 {i === 0 ? "A" : "B"}
                </span>
                <span className="block font-mono text-[13px] leading-relaxed break-keep text-gray-200">
                  {option}
                </span>
                <span className="mt-3 flex h-5 items-center">
                  {revealed && isCorrect && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#8b5cf6]" strokeWidth={1.8} />
                      <span className="ap-gradient-text">더 나은 프롬프트</span>
                    </span>
                  )}
                  {revealed && chosen && !isCorrect && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#ff6b81]">
                      <XCircle className="w-3.5 h-3.5" strokeWidth={1.8} /> 아쉬운 선택
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>

        {/* 해설: 상시 렌더링으로 높이 고정 */}
        <div className="mt-6 min-h-[84px] ap-bubble-note px-4 py-3.5">
          <div className="flex items-start gap-2.5">
            <img
              src="/images/ai-practice/icons/bulb-note.png"
              alt=""
              aria-hidden
              className="ap-icon-3d ap-note-icon"
            />
            <p
              className={`text-[13px] leading-relaxed whitespace-pre-line ${revealed ? "text-gray-300" : "text-[var(--ap-muted)]"}`}
            >
              {revealed ? q.explain : "선택하면 이 자리에 해설이 표시됩니다."}
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button type="button" onClick={next} disabled={!revealed} className={BTN_PRIMARY}>
          {isLast ? "점검 완료, 정리로" : "다음 문항"} <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
