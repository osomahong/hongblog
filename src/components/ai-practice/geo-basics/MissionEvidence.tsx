"use client";

/**
 * 미션 3: 근거 문장 3개를 선택해 목업 사이트에 반영하고,
 * 미션 1과 같은 질문을 다시 던져 모모팜이 답변에 인용되는 것을 확인한다.
 * 왼쪽은 모바일 목업 사이트(반영 전후 전환), 오른쪽은 설명란이다.
 */

import { useState } from "react";
import { Check } from "lucide-react";
import { EXTRACT_AFTER, EXTRACT_BEFORE, M3 } from "./lab-data";
import { MockSiteViewer } from "./MockSiteViewer";
import { NoteCard } from "./NoteCard";
import { ChatWindow, type ChatMsg } from "../lab/SimChat";
import { BTN_PRIMARY, Composer } from "../lab/ui";

type Stage = "select" | "applied" | "streaming" | "done";

const CHIP_BASE =
  "inline-flex items-center gap-2 px-4 py-2 rounded-full border text-[13px] font-medium transition-colors";

export function MissionEvidence({ onComplete }: { onComplete: () => void }) {
  const [stage, setStage] = useState<Stage>("select");
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [messages, setMessages] = useState<ChatMsg[]>([]);

  const applied = stage !== "select";
  const allSelected = M3.chips.every((c) => selected[c.id]);

  const toggleChip = (id: string) => {
    if (applied) return;
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const applyToSite = () => {
    setStage("applied");
  };

  const sendQuestion = () => {
    setMessages([
      { id: "u1", role: "user", text: M3.question },
      { id: "a1", role: "ai", blocks: M3.answerWithUs },
    ]);
    setStage("streaming");
  };

  const handleAiDone = () => {
    if (stage !== "streaming") return;
    setMessages((prev) => [
      ...prev,
      {
        id: "n1",
        role: "note",
        text: M3.doneNote,
        actionLabel: "미션 3 완료, 점검으로",
        actionId: "complete",
      },
    ]);
    setStage("done");
  };

  const handleAction = (id: string) => {
    if (id === "complete") onComplete();
  };

  return (
    <MockSiteViewer
      key={applied ? "after" : "before"}
      src={applied ? M3.afterSrc : M3.beforeSrc}
      fakeUrl="momofarm.example/peach"
      extraction={applied ? EXTRACT_AFTER : EXTRACT_BEFORE}
    >
      <NoteCard text={M3.introNote} />

      {/* 근거 문장 선택 패널 */}
      <div className="ap-card ap-card-accent p-5">
        <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-[var(--ap-muted)] mb-3">
          사이트에 추가할 근거 문장
        </p>
        <div className="space-y-2.5 mb-4" role="group" aria-label="근거 문장 선택">
          {M3.chips.map((chip) => {
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
                  <span className="block text-[12px] text-[var(--ap-muted)] mt-0.5">
                    {chip.sentence}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={applyToSite}
            disabled={!allSelected || applied}
            className={BTN_PRIMARY}
          >
            {applied ? "사이트에 반영됨" : "사이트에 반영하기"}
          </button>
        </div>
      </div>

      {applied && stage === "applied" && <NoteCard text={M3.appliedNote} />}

      {/* 반영 후: 같은 질문 다시 던지기 */}
      {applied && (
        <>
          {messages.length > 0 && (
            <ChatWindow
              messages={messages}
              subtitle="GEO 기초 실습"
              onAiDone={handleAiDone}
              onAction={handleAction}
            />
          )}
          <Composer
            segments={[{ text: M3.question, highlight: stage === "applied", label: "같은 질문 다시" }]}
            onSend={sendQuestion}
            disabled={stage !== "applied"}
          />
        </>
      )}
    </MockSiteViewer>
  );
}
