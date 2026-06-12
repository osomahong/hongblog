"use client";

/**
 * 범용 대화 화면: 인트로, 아침 브리핑, 코칭, 보스 인트로/피드백 등
 * "대사 → 계속" 패턴을 모두 처리한다.
 */

import type { ConceptDef, Dialogue } from "@/lib/game/scenarios/schema";

import { ConceptCard } from "../ConceptCard";
import { DialogueBox } from "../hud/DialogueBox";
import type { ClassLinkMap } from "../speakers";

interface DialogueScreenProps {
  heading?: string;
  lines: Dialogue[];
  onDone: () => void;
  doneLabel?: string;
  /** 대화 종료 후 개념 카드 연출 (코칭) */
  grantedConcept?: ConceptDef;
  links: ClassLinkMap;
}

export function DialogueScreen({
  heading,
  lines,
  onDone,
  doneLabel,
  grantedConcept,
  links,
}: DialogueScreenProps) {
  return (
    <div className="flex flex-col gap-4 py-4">
      {heading && (
        <h2 className="border-3 border-black bg-black px-3 py-2 text-base font-black text-white neo-shadow-sm">
          {heading}
        </h2>
      )}
      {grantedConcept && (
        <ConceptCard concept={grantedConcept} links={links} fresh />
      )}
      <DialogueBox lines={lines} onDone={onDone} doneLabel={doneLabel} />
    </div>
  );
}
