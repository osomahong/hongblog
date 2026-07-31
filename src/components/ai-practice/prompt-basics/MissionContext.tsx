"use client";

/** 미션 2: 조건 칩을 골라 프롬프트에 맥락을 붙이고, 답변이 좁혀지는 것을 확인한다. */

import { useState } from "react";
import { M2 } from "./lab-data";
import { ChatWindow, type Block, type ChatMsg } from "../lab/SimChat";
import { Composer } from "../lab/ui";

type Stage = "compose" | "streaming" | "answered";

const INTRO_NOTE: ChatMsg = {
  id: "n0",
  role: "note",
  text: "아래에서 조건 칩을 골라 프롬프트에 붙인 뒤 전송해 보세요. 조건이 많을수록 답변이 내 상황으로 좁혀집니다.",
};

export function MissionContext({ onComplete }: { onComplete: () => void }) {
  const [stage, setStage] = useState<Stage>("compose");
  const [selected, setSelected] = useState<string[]>([]);
  const [messages, setMessages] = useState<ChatMsg[]>([INTRO_NOTE]);
  const [sendCount, setSendCount] = useState(0);
  const [lastCount, setLastCount] = useState(0);

  const pushNote = (note: ChatMsg) => {
    setMessages((prev) => [
      ...prev.map((m) => (m.role === "note" ? { ...m, actionUsed: true } : m)),
      note,
    ]);
  };

  const toggleChip = (id: string) => {
    if (stage === "streaming") return;
    setSelected((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
  };

  const send = () => {
    const chips = M2.chips.filter((c) => selected.includes(c.id));
    const userText = [M2.basePrompt, ...chips.map((c) => c.promptLine)].join("\n");
    const blocks: Block[] = [
      { type: "p", text: M2.intro },
      ...chips.map((c): Block => ({ type: "p", text: c.answer })),
      { type: "p", text: chips.length === M2.chips.length ? M2.closingFull : M2.closingPartial },
    ];
    const n = sendCount + 1;
    setMessages((prev) => [
      ...prev,
      { id: `u${n}`, role: "user", text: userText },
      { id: `a${n}`, role: "ai", blocks },
    ]);
    setSendCount(n);
    setLastCount(chips.length);
    setStage("streaming");
  };

  const handleAiDone = () => {
    if (stage !== "streaming") return;
    const all = lastCount === M2.chips.length;
    pushNote({
      id: `note${sendCount}`,
      role: "note",
      text: all ? M2.doneNote : M2.retryNote,
      actionLabel: "미션 2 완료, 다음으로",
      actionId: "complete",
    });
    setStage("answered");
  };

  const handleAction = (id: string) => {
    if (id === "complete") onComplete();
  };

  return (
    <div className="space-y-4">
      <ChatWindow
        messages={messages}
        subtitle="프롬프트 기초 실습"
        onAiDone={handleAiDone}
        onAction={handleAction}
      />
      <Composer
        segments={[
          { text: M2.basePrompt, label: "기존 프롬프트 (그대로)" },
          ...M2.chips
            .filter((c) => selected.includes(c.id))
            .map((c) => ({ text: c.promptLine, highlight: true, label: "맥락 조건" })),
        ]}
        onSend={send}
        disabled={stage === "streaming" || selected.length === 0}
        optionsRole="group"
        optionsLabel="맥락 조건 선택"
      >
        {M2.chips.map((chip) => {
          const on = selected.includes(chip.id);
          return (
            <button
              key={chip.id}
              type="button"
              onClick={() => toggleChip(chip.id)}
              aria-pressed={on}
              aria-disabled={stage === "streaming"}
              className={`ap-chip ${on ? "ap-chip-on" : ""}`}
            >
              {chip.label}
            </button>
          );
        })}
      </Composer>
    </div>
  );
}
