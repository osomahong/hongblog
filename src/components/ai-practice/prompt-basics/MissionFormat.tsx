"use client";

/** 미션 3: 같은 요청을 표, 체크리스트, 3줄 요약 형식으로 받아 비교한다. */

import { useState } from "react";
import { AlignLeft, Check, ListChecks, Table2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { M3 } from "./lab-data";
import { ChatWindow, type ChatMsg } from "../lab/SimChat";
import { Composer } from "../lab/ui";

type Stage = "compose" | "streaming" | "answered";

const FORMAT_ICONS: Record<string, LucideIcon> = {
  table: Table2,
  checklist: ListChecks,
  summary: AlignLeft,
};

const INTRO_NOTE: ChatMsg = {
  id: "n0",
  role: "note",
  text: "아래에서 결과물 형식을 고른 뒤 전송해 보세요. 형식을 바꿔 가며 여러 번 전송해도 됩니다.",
};

export function MissionFormat({ onComplete }: { onComplete: () => void }) {
  const [stage, setStage] = useState<Stage>("compose");
  const [formatId, setFormatId] = useState(M3.formats[0].id);
  const [messages, setMessages] = useState<ChatMsg[]>([INTRO_NOTE]);
  const [sendCount, setSendCount] = useState(0);
  const [triedFormats, setTriedFormats] = useState<string[]>([]);

  const format = M3.formats.find((f) => f.id === formatId) ?? M3.formats[0];

  const pushNote = (note: ChatMsg) => {
    setMessages((prev) => [
      ...prev.map((m) => (m.role === "note" ? { ...m, actionUsed: true } : m)),
      note,
    ]);
  };

  const send = () => {
    const n = sendCount + 1;
    setMessages((prev) => [
      ...prev,
      { id: `u${n}`, role: "user", text: `${M3.basePrompt}\n${format.promptSuffix}` },
      { id: `a${n}`, role: "ai", blocks: format.blocks },
    ]);
    setSendCount(n);
    setTriedFormats((prev) => (prev.includes(format.id) ? prev : [...prev, format.id]));
    setStage("streaming");
  };

  const handleAiDone = () => {
    if (stage !== "streaming") return;
    pushNote({
      id: `note${sendCount}`,
      role: "note",
      text: M3.doneNote,
      actionLabel: "미션 3 완료, 점검으로",
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
          { text: M3.basePrompt, label: "기존 프롬프트 (그대로)" },
          { text: format.promptSuffix, highlight: true, label: "형식 지정" },
        ]}
        onSend={send}
        disabled={stage === "streaming"}
        optionsRole="radiogroup"
        optionsLabel="결과물 형식 선택"
      >
        {M3.formats.map((f) => {
          const on = f.id === formatId;
          const Icon = FORMAT_ICONS[f.id] ?? Table2;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => stage !== "streaming" && setFormatId(f.id)}
              role="radio"
              aria-checked={on}
              aria-disabled={stage === "streaming"}
              className={`ap-chip inline-flex items-center gap-1.5 ${on ? "ap-chip-on" : ""}`}
            >
              <Icon className="w-3.5 h-3.5" strokeWidth={1.8} />
              {f.label}
              {triedFormats.includes(f.id) && <Check className="w-3 h-3" strokeWidth={2.4} />}
            </button>
          );
        })}
      </Composer>
    </div>
  );
}
