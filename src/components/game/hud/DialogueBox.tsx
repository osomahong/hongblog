"use client";

/**
 * 메신저식 대화 박스: 탭할 때마다 한 줄씩 공개, 끝나면 onDone.
 * 전체 화면을 탭해도 진행되도록 큰 터치 타깃을 유지한다.
 */

import { useState } from "react";

import type { Dialogue } from "@/lib/game/scenarios/schema";
import { cn } from "@/lib/utils";

import { SPEAKERS } from "../speakers";

interface DialogueBoxProps {
  lines: Dialogue[];
  onDone: () => void;
  doneLabel?: string;
  /** true면 처음부터 전부 공개 (정산 등 요약 화면) */
  revealAll?: boolean;
  /** 정적 표시용: 다 공개된 뒤 진행 버튼을 숨긴다 (엔딩/게임오버) */
  hideDoneButton?: boolean;
}

export function DialogueBox({
  lines,
  onDone,
  doneLabel = "계속",
  revealAll = false,
  hideDoneButton = false,
}: DialogueBoxProps) {
  const [count, setCount] = useState(revealAll ? lines.length : 1);
  const finished = count >= lines.length;

  const advance = () => {
    if (finished) {
      onDone();
    } else {
      setCount((c) => c + 1);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div
        className="flex min-h-[120px] cursor-pointer flex-col gap-3"
        onClick={advance}
        role="button"
        tabIndex={-1}
        aria-label="대화 진행"
      >
        {lines.slice(0, count).map((line, index) => {
          const meta = SPEAKERS[line.speaker];
          if (meta.align === "center") {
            return (
              <p
                key={index}
                className="animate-[fadeIn_0.3s_ease-out] px-2 text-center text-sm italic text-gray-500"
              >
                {line.text}
              </p>
            );
          }
          return (
            <div
              key={index}
              className={cn(
                "flex animate-[fadeIn_0.3s_ease-out] flex-col gap-1",
                meta.align === "right" ? "items-end" : "items-start",
              )}
            >
              <span className={cn("px-1 text-xs", meta.nameClass)}>
                {meta.name}
              </span>
              <div
                className={cn(
                  "max-w-[85%] border-2 px-3 py-2 text-sm leading-relaxed sm:text-base",
                  meta.bubbleClass,
                )}
              >
                {line.text}
              </div>
            </div>
          );
        })}
      </div>
      {!(finished && hideDoneButton) && (
        <button
          type="button"
          onClick={advance}
          className={cn(
            "w-full border-3 border-black px-4 py-3 text-sm font-bold tracking-wide neo-shadow neo-hover",
            finished ? "bg-primary text-white" : "bg-white text-black",
          )}
        >
          {finished ? doneLabel : "다음 ▸"}
        </button>
      )}
    </div>
  );
}
