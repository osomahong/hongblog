"use client";

/**
 * 미션 2: JSON-LD 구조화 데이터를 목업 사이트에 반영한다.
 * 반영해도 사람의 눈에는 화면이 그대로이고, AI의 눈 탭을 열어야 변화가 보인다.
 * 왼쪽은 모바일 목업 사이트(반영 전후 전환), 오른쪽은 설명란이다.
 */

import { useState } from "react";
import { Check } from "lucide-react";
import { EXTRACT_AFTER_V3, EXTRACT_BEFORE_V3, M2 } from "./lab-data";
import { MockSiteViewer } from "../geo-basics/MockSiteViewer";
import { NoteCard } from "../geo-basics/NoteCard";
import { BTN_PRIMARY } from "../lab/ui";

type Stage = "select" | "applied" | "done";

const CHIP_BASE =
  "inline-flex items-center gap-2 px-4 py-2 rounded-full border text-[13px] font-medium transition-colors";

export function MissionSchema({ onComplete }: { onComplete: () => void }) {
  const [stage, setStage] = useState<Stage>("select");
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const applied = stage !== "select";
  const allSelected = M2.chips.every((c) => selected[c.id]);

  const toggleChip = (id: string) => {
    if (applied) return;
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <MockSiteViewer
      key={applied ? "after" : "before"}
      src={applied ? M2.afterSrc : M2.beforeSrc}
      fakeUrl="momofarm.example/peach"
      extraction={applied ? EXTRACT_AFTER_V3 : EXTRACT_BEFORE_V3}
      onAiViewOpened={applied ? () => setStage("done") : undefined}
      aiTabCue={applied}
    >
      <NoteCard text={M2.introNote} />

      {/* 구조화 데이터 항목 선택 패널 */}
      <div className="ap-card ap-card-accent p-5">
        <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-[var(--ap-muted)] mb-3">
          사이트에 반영할 구조화 데이터
        </p>
        <div className="space-y-2.5 mb-4" role="group" aria-label="구조화 데이터 항목 선택">
          {M2.chips.map((chip) => {
            const on = Boolean(selected[chip.id]);
            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => toggleChip(chip.id)}
                aria-pressed={on}
                disabled={applied}
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
            onClick={() => setStage("applied")}
            disabled={!allSelected || applied}
            className={BTN_PRIMARY}
          >
            {applied ? "사이트에 반영됨" : "사이트에 반영하기"}
          </button>
        </div>
      </div>

      {applied && stage === "applied" && <NoteCard text={M2.appliedNote} />}

      {stage === "done" && (
        <NoteCard text={M2.doneNote} actionLabel="미션 2 완료, 다음으로" onAction={onComplete} />
      )}
    </MockSiteViewer>
  );
}
