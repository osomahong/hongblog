"use client";

/**
 * 엔딩: 한 주의 결과와 통계, 추천 학습 경로.
 */

import type { ChapterSpec } from "@/lib/game/scenarios/schema";
import type { GameState } from "@/lib/game/types";

import { DialogueBox } from "../hud/DialogueBox";
import type { ClassLinkMap } from "../speakers";

interface EndingScreenProps {
  chapter: ChapterSpec;
  state: GameState;
  endingId: string;
  links: ClassLinkMap;
  onRestart: () => void;
}

export function EndingScreen({
  chapter,
  state,
  endingId,
  links,
  onRestart,
}: EndingScreenProps) {
  const ending =
    chapter.endings.find((e) => e.id === endingId) ??
    chapter.endings[chapter.endings.length - 1];

  const excellent = state.history.filter((r) => r.tier === "excellent").length;
  const delegated = state.history.filter((r) => r.method !== "direct" && r.method !== "choice").length;
  const verified = state.history.filter((r) => r.verified).length;
  const courseLink = links["claude-fundamentals"];

  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="animate-[stampIn_0.4s_ease-out] border-3 border-black bg-accent p-4 text-center neo-shadow-lg">
        <p className="text-xs font-bold tracking-widest">금요일 18:00</p>
        <h2 className="mt-1 text-xl font-black">{ending.title}</h2>
      </div>

      <DialogueBox lines={ending.dialogue} onDone={() => undefined} doneLabel="..." revealAll />

      <p className="border-l-4 border-black bg-white px-3 py-3 text-sm leading-relaxed text-gray-800">
        {ending.epilogue}
      </p>

      <div className="border-3 border-black bg-white p-3">
        <p className="text-xs font-black text-gray-600">이번 주 리포트</p>
        <div className="mt-2 grid grid-cols-2 gap-2 text-center sm:grid-cols-4">
          {[
            { label: "최종 신뢰", value: state.resources.trust },
            { label: "KPI", value: state.resources.kpi },
            { label: "우수 평가", value: excellent },
            { label: "AI 위임", value: delegated },
          ].map((stat) => (
            <div key={stat.label} className="border-2 border-black p-2">
              <p className="text-lg font-black tabular-nums">{stat.value}</p>
              <p className="text-[10px] font-bold text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
        <p className="mt-2 text-center text-[11px] text-gray-500">
          수치 검증 {verified}회 · 배운 개념 {state.unlockedConcepts.length}/{chapter.concepts.length}
        </p>
      </div>

      {courseLink && (
        <a
          href={courseLink.href}
          target="_blank"
          rel="noopener noreferrer"
          className="border-3 border-black bg-white p-3 text-center text-sm font-bold neo-shadow neo-hover"
        >
          이번 주에 배운 개념, 제대로 정리하기: {courseLink.title} ↗
        </a>
      )}

      <button
        type="button"
        onClick={onRestart}
        className="border-3 border-black bg-black px-4 py-3 text-sm font-black text-white neo-shadow neo-hover"
      >
        타이틀로 (다른 엔딩에 도전)
      </button>
    </div>
  );
}
