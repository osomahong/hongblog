"use client";

/**
 * 보스전: 본부장 Q&A. 잠긴 선택지를 보여줘서
 * "검증했다면 / 배웠다면 가능했던 답"을 그 자리에서 학습시킨다.
 */

import type { ChapterSpec } from "@/lib/game/scenarios/schema";
import type { GameState } from "@/lib/game/types";
import { cn } from "@/lib/utils";

import { DialogueBox } from "../hud/DialogueBox";

interface BossRoundScreenProps {
  chapter: ChapterSpec;
  state: GameState;
  round: number;
  bombed: boolean;
  onAnswer: (optionId: string) => void;
  onAdvance: () => void;
}

export function BossRoundScreen({
  chapter,
  state,
  round,
  bombed,
  onAnswer,
  onAdvance,
}: BossRoundScreenProps) {
  const spec = chapter.boss.rounds[round];

  if (bombed) {
    return (
      <div className="flex flex-col gap-4 py-4">
        <RoundHeading round={round} total={chapter.boss.rounds.length} alert />
        <DialogueBox
          lines={spec.bombReveal ?? []}
          onDone={onAdvance}
          doneLabel="고개를 들 수 없다"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 py-4">
      <RoundHeading round={round} total={chapter.boss.rounds.length} />
      <div className="flex flex-col gap-2">
        {spec.question.map((line, index) => (
          <p
            key={index}
            className="border-3 border-black bg-primary/10 px-3 py-2 text-sm font-bold leading-relaxed"
          >
            본부장: {line.text}
          </p>
        ))}
      </div>
      <div className="flex flex-col gap-2">
        {spec.options.map((option) => {
          const flagLocked =
            option.requiresFlag && !state.flags[option.requiresFlag];
          const conceptLocked =
            option.requiresConcept &&
            !state.unlockedConcepts.includes(option.requiresConcept);
          const locked = Boolean(flagLocked || conceptLocked);
          const lockReason = flagLocked
            ? "검증을 거친 자료가 있었다면 가능했던 답"
            : conceptLocked
              ? `[${
                  chapter.concepts.find((c) => c.id === option.requiresConcept)
                    ?.title ?? "개념"
                }]을 배웠다면 가능했던 답`
              : null;
          return (
            <button
              key={option.id}
              type="button"
              disabled={locked}
              onClick={() => onAnswer(option.id)}
              className={cn(
                "border-3 border-black bg-white p-3 text-left neo-shadow neo-hover",
                "disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none",
              )}
            >
              <span className="block text-sm font-bold">
                {locked ? "🔒 " : ""}
                {option.label}
              </span>
              {lockReason && (
                <span className="mt-1 block text-[11px] text-primary">
                  {lockReason}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function RoundHeading({
  round,
  total,
  alert = false,
}: {
  round: number;
  total: number;
  alert?: boolean;
}) {
  return (
    <h2
      className={cn(
        "border-3 border-black px-3 py-2 text-base font-black neo-shadow-sm",
        alert ? "bg-primary text-white" : "bg-black text-white",
      )}
    >
      본부장 보고 · 질문 {round + 1}/{total}
    </h2>
  );
}

export function BossFeedbackScreen({
  chapter,
  round,
  optionId,
  score,
  onDone,
}: {
  chapter: ChapterSpec;
  round: number;
  optionId: string;
  score: number;
  onDone: () => void;
}) {
  const option = chapter.boss.rounds[round].options.find(
    (o) => o.id === optionId,
  );
  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "animate-[stampIn_0.35s_ease-out] border-3 border-black px-2.5 py-1 text-sm font-black neo-shadow-sm",
            score >= 4 ? "bg-accent" : score >= 2 ? "bg-white" : "bg-primary text-white",
          )}
        >
          {score >= 4 ? "설득력 있다" : score >= 2 ? "넘어갔다" : "분위기가 싸늘하다"}
        </span>
      </div>
      <DialogueBox lines={option?.reply ?? []} onDone={onDone} />
    </div>
  );
}

export function BossResultScreen({
  chapter,
  passed,
  totalScore,
  onDone,
}: {
  chapter: ChapterSpec;
  passed: boolean;
  totalScore: number;
  onDone: () => void;
}) {
  return (
    <div className="flex flex-col gap-4 py-4">
      <div
        className={cn(
          "animate-[stampIn_0.4s_ease-out] border-3 border-black p-4 text-center neo-shadow-lg",
          passed ? "bg-accent" : "bg-primary text-white",
        )}
      >
        <p className="text-xs font-bold tracking-widest">
          보고 평가 · 준비도와 답변 합산 {totalScore}점
        </p>
        <p className="mt-1 text-2xl font-black">
          {passed ? "보고 통과" : "보고 실패"}
        </p>
      </div>
      <DialogueBox
        lines={passed ? chapter.boss.passDialogue : chapter.boss.failDialogue}
        onDone={onDone}
        doneLabel={passed ? "한 주의 결과 보기" : "..."}
      />
    </div>
  );
}
