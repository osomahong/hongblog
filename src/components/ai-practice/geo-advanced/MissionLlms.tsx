"use client";

/**
 * 미션 3: llms.txt 구성 요소를 골라 사이트 안내문을 완성한다.
 * 세 구성을 모두 선택하면 완성된 llms.txt 파일이 표시되고 미션이 끝난다.
 */

import { useState } from "react";
import { Check, FileText } from "lucide-react";
import { M3 } from "./lab-data";
import { NoteCard } from "../geo-basics/NoteCard";
import { BTN_PRIMARY } from "../lab/ui";

const CHIP_BASE =
  "inline-flex items-center gap-2 px-4 py-2 rounded-full border text-[13px] font-medium transition-colors";

export function MissionLlms({ onComplete }: { onComplete: () => void }) {
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [built, setBuilt] = useState(false);

  const allSelected = M3.chips.every((c) => selected[c.id]);

  const toggleChip = (id: string) => {
    if (built) return;
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-4 max-w-3xl">
      <NoteCard text={M3.introNote} />

      {/* llms.txt 구성 요소 선택 패널 */}
      <div className="ap-card ap-card-accent p-5">
        <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-[var(--ap-muted)] mb-3">
          안내문에 넣을 구성 요소
        </p>
        <div className="space-y-2.5 mb-4" role="group" aria-label="llms.txt 구성 요소 선택">
          {M3.chips.map((chip) => {
            const on = Boolean(selected[chip.id]);
            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => toggleChip(chip.id)}
                aria-pressed={on}
                disabled={built}
                className={`${CHIP_BASE} w-full justify-start text-left ${
                  on
                    ? "border-[#7dd3fc]/70 bg-[#7dd3fc]/10 text-[#7dd3fc]"
                    : "border-white/15 text-gray-300 hover:border-white/40"
                } disabled:pointer-events-none`}
              >
                <span
                  className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${
                    on ? "border-[#7dd3fc] bg-[#7dd3fc]" : "border-white/30"
                  }`}
                  aria-hidden
                >
                  {on && <Check className="w-3 h-3 text-[#17171c]" strokeWidth={3} />}
                </span>
                <span>
                  <span className="font-semibold">{chip.label}</span>
                  <span className="block text-[12px] text-[var(--ap-muted)] mt-0.5">{chip.desc}</span>
                </span>
              </button>
            );
          })}
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setBuilt(true)}
            disabled={!allSelected || built}
            className={BTN_PRIMARY}
          >
            {built ? "llms.txt 생성됨" : "llms.txt 만들기"}
          </button>
        </div>
      </div>

      {/* 완성된 llms.txt 파일 뷰 */}
      {built && (
        <>
          <div className="ap-card ap-card-accent p-5 ap-fade-up">
            <p className="flex items-center gap-2 text-[11px] font-medium tracking-[0.2em] uppercase text-[#7dd3fc] mb-3">
              <FileText className="w-3.5 h-3.5" strokeWidth={1.8} aria-hidden />
              {M3.fakeUrl}
            </p>
            <pre className="ap-prompt p-5 overflow-x-auto whitespace-pre-wrap">{M3.llmsText}</pre>
          </div>
          <NoteCard text={M3.builtNote} actionLabel="미션 3 완료, 점검으로" onAction={onComplete} />
        </>
      )}
    </div>
  );
}
