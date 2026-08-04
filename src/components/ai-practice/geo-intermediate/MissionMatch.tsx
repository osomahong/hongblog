"use client";

/**
 * 미션 2: 질문 조건에 근거 매칭하기.
 * 질문 3개를 차례로 보여 주고, 각 질문의 답변에 인용될 근거를 고르게 한다.
 * 고르면 정답 표시와 해설이 나오고, 마지막 라운드에서 미션이 끝난다.
 */

import { useState } from "react";
import { ArrowRight, CheckCircle2, XCircle } from "lucide-react";
import { M2_NOTES, M2_ROUNDS } from "./lab-data";
import { NoteCard } from "../geo-basics/NoteCard";
import { BTN_PRIMARY_SM } from "../lab/ui";

export function MissionMatch({ onComplete }: { onComplete: () => void }) {
  const [round, setRound] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);

  const current = M2_ROUNDS[round];
  const lastRound = round === M2_ROUNDS.length - 1;

  const pick = (id: string) => {
    if (picked) return;
    setPicked(id);
  };

  const next = () => {
    if (lastRound) {
      setFinished(true);
      return;
    }
    setRound((r) => r + 1);
    setPicked(null);
  };

  return (
    <div className="space-y-4 max-w-3xl">
      <NoteCard text={M2_NOTES.intro} />

      <div className="ap-card ap-card-accent p-6">
        <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-[var(--ap-muted)] mb-3">
          질문 {round + 1} / {M2_ROUNDS.length}
        </p>
        <p className="text-base font-semibold text-white mb-5">“{current.question}”</p>

        <div className="space-y-2.5" role="radiogroup" aria-label="인용될 근거 선택">
          {current.options.map((opt) => {
            const isPicked = picked === opt.id;
            const revealed = picked !== null;
            const showCorrect = revealed && opt.correct;
            const showWrong = revealed && isPicked && !opt.correct;
            return (
              <button
                key={opt.id}
                type="button"
                role="radio"
                aria-checked={isPicked}
                onClick={() => pick(opt.id)}
                disabled={revealed}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-[12px] border text-left text-sm transition-colors ${
                  showCorrect
                    ? "border-[#7dd3fc]/70 bg-[#7dd3fc]/10 text-white"
                    : showWrong
                      ? "border-[#ff8fa3]/60 bg-[#ff8fa3]/10 text-gray-300"
                      : "border-white/15 text-gray-300 hover:border-white/40"
                } disabled:pointer-events-none`}
              >
                {showCorrect ? (
                  <CheckCircle2 className="w-4.5 h-4.5 text-[#7dd3fc] flex-shrink-0" strokeWidth={1.8} />
                ) : showWrong ? (
                  <XCircle className="w-4.5 h-4.5 text-[#ff8fa3] flex-shrink-0" strokeWidth={1.8} />
                ) : (
                  <span className="w-4 h-4 rounded-full border border-white/30 flex-shrink-0" aria-hidden />
                )}
                {opt.label}
              </button>
            );
          })}
        </div>

        {picked && !finished && (
          <div className="mt-5 ap-fade-up">
            <p className="text-[13px] leading-relaxed text-gray-300 whitespace-pre-line mb-4">
              {current.explain}
            </p>
            <button type="button" onClick={next} className={BTN_PRIMARY_SM}>
              {lastRound ? "매칭 정리 보기" : "다음 질문"} <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {finished && (
        <NoteCard text={M2_NOTES.done} actionLabel="미션 2 완료, 다음으로" onAction={onComplete} />
      )}
    </div>
  );
}
