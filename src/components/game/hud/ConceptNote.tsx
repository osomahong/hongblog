"use client";

/**
 * AI 노트: 습득한 개념을 언제든 다시 보는 인게임 사전.
 * 열람에 자원 비용이 없다 (학습 행위에 벌점 없음).
 */

import { useState } from "react";

import type { ChapterSpec, ConceptId } from "@/lib/game/scenarios/schema";

import { ConceptCard } from "../ConceptCard";
import type { ClassLinkMap } from "../speakers";

interface ConceptNoteProps {
  chapter: ChapterSpec;
  unlocked: ConceptId[];
  links: ClassLinkMap;
}

export function ConceptNote({ chapter, unlocked, links }: ConceptNoteProps) {
  const [open, setOpen] = useState(false);
  const concepts = chapter.concepts.filter((c) => unlocked.includes(c.id));

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-30 border-3 border-black bg-accent px-3 py-2 text-xs font-black neo-shadow neo-hover"
        aria-haspopup="dialog"
      >
        AI 노트 ({concepts.length}/{chapter.concepts.length})
      </button>
      {open && (
        <div
          className="fixed inset-0 z-40 flex items-end justify-center bg-black/50 sm:items-center"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="AI 노트"
        >
          <div
            className="max-h-[80vh] w-full max-w-lg overflow-y-auto border-3 border-black bg-[#F3F3F3] p-4 sm:neo-shadow-lg"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-black">AI 노트</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="border-2 border-black bg-white px-2 py-1 text-xs font-bold neo-hover"
              >
                닫기 ✕
              </button>
            </div>
            {concepts.length === 0 ? (
              <p className="py-8 text-center text-sm text-gray-500">
                아직 배운 개념이 없다. 일을 하다 보면 쌓인다.
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {concepts.map((concept) => (
                  <ConceptCard key={concept.id} concept={concept} links={links} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
