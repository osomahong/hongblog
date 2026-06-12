"use client";

/**
 * 개념 카드: 습득 연출(코칭/정산)과 AI 노트 양쪽에서 쓴다.
 * "더 알아보기"는 새 탭으로, 게임 진행을 끊지 않는다.
 */

import type { ConceptDef } from "@/lib/game/scenarios/schema";
import { cn } from "@/lib/utils";

import type { ClassLinkMap } from "./speakers";

interface ConceptCardProps {
  concept: ConceptDef;
  links: ClassLinkMap;
  /** 습득 직후 강조 연출 */
  fresh?: boolean;
}

export function ConceptCard({ concept, links, fresh = false }: ConceptCardProps) {
  const link = links[concept.classSlug];
  return (
    <div
      className={cn(
        "border-3 border-black bg-white p-3",
        fresh && "neo-shadow animate-[stampIn_0.35s_ease-out]",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="bg-accent border-2 border-black px-2 py-0.5 text-xs font-black">
          {fresh ? "개념 습득" : "AI 노트"}
        </span>
        {link && (
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-primary underline underline-offset-2"
          >
            더 알아보기 ↗
          </a>
        )}
      </div>
      <h3 className="mt-2 text-base font-black">{concept.title}</h3>
      <p className="mt-1 text-sm leading-relaxed text-gray-700">{concept.summary}</p>
      <p className="mt-2 border-t-2 border-dashed border-gray-300 pt-2 text-xs font-bold text-gray-600">
        해금: {concept.effectLabel}
      </p>
    </div>
  );
}
