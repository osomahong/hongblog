"use client";

/**
 * 타이틀: 새 게임 시작. 저장이 있으면 이어하기 노출.
 */

import type { ChapterSpec } from "@/lib/game/scenarios/schema";

interface TitleScreenProps {
  chapter: ChapterSpec;
  hasSave: boolean;
  onNewGame: () => void;
  onContinue: () => void;
}

export function TitleScreen({
  chapter,
  hasSave,
  onNewGame,
  onContinue,
}: TitleScreenProps) {
  return (
    <div className="flex flex-col items-center gap-6 py-10 text-center">
      <div className="border-3 border-black bg-white p-6 neo-shadow-lg sm:rotate-1">
        <p className="text-xs font-bold tracking-widest text-gray-500">
          직장인 AI 적응기
        </p>
        <h1 className="mt-2 text-3xl font-black leading-tight sm:text-4xl">
          {chapter.title}
        </h1>
        <p className="mt-2 border-t-2 border-dashed border-gray-300 pt-2 text-sm font-bold text-gray-700">
          {chapter.subtitle}
        </p>
      </div>

      <div className="w-full max-w-sm border-3 border-black bg-white p-4 text-left text-sm leading-relaxed neo-shadow">
        <p className="font-bold">월요일부터 금요일 보고까지, 한 주 생존.</p>
        <ul className="mt-2 list-inside list-disc text-gray-700">
          <li>쏟아지는 업무를 시간과 에너지 안에서 처리</li>
          <li>직접 할까, AI에 맡길까. 매 선택이 결과를 바꾼다</li>
          <li>반려, 야근, 보안 사고, 게임오버가 실제로 있다</li>
        </ul>
        <p className="mt-2 text-xs text-gray-500">플레이 15~25분 · 진행은 이 브라우저에 저장</p>
      </div>

      <div className="flex w-full max-w-sm flex-col gap-3">
        {hasSave && (
          <button
            type="button"
            onClick={onContinue}
            className="w-full border-3 border-black bg-accent px-4 py-3 text-base font-black neo-shadow neo-hover"
          >
            이어서 출근하기
          </button>
        )}
        <button
          type="button"
          onClick={onNewGame}
          className="w-full border-3 border-black bg-primary px-4 py-3 text-base font-black text-white neo-shadow neo-hover"
        >
          {hasSave ? "처음부터 다시" : "출근하기"}
        </button>
      </div>
    </div>
  );
}
