"use client";

/**
 * 게임오버: 사인(死因)과 직결된 학습 링크 + 그날 아침 재시작.
 * 배운 개념은 유지된다. 실패가 곧 학습이 되는 장치.
 */

import type { ChapterSpec, GameOverCause } from "@/lib/game/scenarios/schema";

import { DialogueBox } from "../hud/DialogueBox";
import type { ClassLinkMap } from "../speakers";

interface GameOverScreenProps {
  chapter: ChapterSpec;
  cause: GameOverCause;
  day: number;
  links: ClassLinkMap;
  onRetry: () => void;
  onTitle: () => void;
}

export function GameOverScreen({
  chapter,
  cause,
  day,
  links,
  onRetry,
  onTitle,
}: GameOverScreenProps) {
  const text = chapter.gameOverTexts[cause];
  const link = text.classSlug ? links[text.classSlug] : undefined;

  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="animate-[stampIn_0.4s_ease-out] border-3 border-black bg-black p-4 text-center text-white neo-shadow-lg">
        <p className="text-xs font-bold tracking-widest text-gray-400">GAME OVER</p>
        <h2 className="mt-1 text-xl font-black">{text.title}</h2>
      </div>

      <DialogueBox lines={text.dialogue} onDone={() => undefined} doneLabel="..." revealAll />

      {link && (
        <a
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="border-3 border-black bg-white p-3 text-center text-sm font-bold neo-shadow neo-hover"
        >
          왜 이렇게 됐을까: {link.title} ↗
        </a>
      )}

      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={onRetry}
          className="border-3 border-black bg-primary px-4 py-3 text-sm font-black text-white neo-shadow neo-hover"
        >
          Day {day} 아침으로 돌아간다 (배운 개념은 유지)
        </button>
        <button
          type="button"
          onClick={onTitle}
          className="border-3 border-black bg-white px-4 py-3 text-sm font-bold neo-shadow neo-hover"
        >
          타이틀로
        </button>
      </div>
    </div>
  );
}
