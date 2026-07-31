"use client";

/** 미션 3: AI에게 프롬프트 템플릿을 설계시키고, 스스로 검토해 보완하게 한다. */

import { useState } from "react";
import { M3 } from "./lab-data";
import { ChatWindow, type ChatMsg } from "../lab/SimChat";
import { Composer } from "../lab/ui";

type Stage = "idle" | "streaming1" | "improveReady" | "streaming2" | "done";

const INTRO_NOTE: ChatMsg = {
  id: "n0",
  role: "note",
  text: "마지막 미션입니다. 이번에는 결과물이 아니라 프롬프트 자체를 설계해 달라고 요청해 보세요.\n아래 프롬프트를 그대로 전송합니다.",
};

export function MissionMetaPrompt({ onComplete }: { onComplete: () => void }) {
  const [stage, setStage] = useState<Stage>("idle");
  const [messages, setMessages] = useState<ChatMsg[]>([INTRO_NOTE]);

  const pushNote = (note: ChatMsg) => {
    setMessages((prev) => [
      ...prev.map((m) => (m.role === "note" ? { ...m, actionUsed: true } : m)),
      note,
    ]);
  };

  const sendDesign = () => {
    setMessages((prev) => [
      ...prev,
      { id: "u1", role: "user", text: M3.metaPrompt },
      { id: "a1", role: "ai", blocks: M3.designAnswer },
    ]);
    setStage("streaming1");
  };

  const sendImprove = () => {
    setMessages((prev) => [
      ...prev,
      { id: "u2", role: "user", text: M3.improvePrompt },
      { id: "a2", role: "ai", blocks: M3.improvedAnswer },
    ]);
    setStage("streaming2");
  };

  const handleAiDone = () => {
    if (stage === "streaming1") {
      pushNote({ id: "n1", role: "note", text: M3.afterDesignNote });
      setStage("improveReady");
    } else if (stage === "streaming2") {
      pushNote({
        id: "n2",
        role: "note",
        text: M3.doneNote,
        actionLabel: "미션 3 완료, 점검으로",
        actionId: "complete",
      });
      setStage("done");
    }
  };

  const handleAction = (id: string) => {
    if (id === "complete") onComplete();
  };

  const improving = stage === "improveReady" || stage === "streaming2" || stage === "done";

  return (
    <div className="space-y-4">
      <ChatWindow
        messages={messages}
        subtitle="프롬프트 심화 실습"
        onAiDone={handleAiDone}
        onAction={handleAction}
      />
      <Composer
        segments={
          improving
            ? [{ text: M3.improvePrompt, highlight: true, label: "검토 요청" }]
            : [{ text: M3.metaPrompt }]
        }
        onSend={stage === "idle" ? sendDesign : sendImprove}
        disabled={stage !== "idle" && stage !== "improveReady"}
      />
    </div>
  );
}
