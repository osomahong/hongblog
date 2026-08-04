"use client";

/** 미션 1: 인용되고 싶은 질문을 AI에게 던져서, 현재 답변에 모모팜이 없는 것을 확인한다. */

import { useState } from "react";
import { M1 } from "./lab-data";
import { ChatWindow, type ChatMsg } from "../lab/SimChat";
import { Composer } from "../lab/ui";

type Stage = "idle" | "streaming" | "done";

const INTRO_NOTE: ChatMsg = {
  id: "n0",
  role: "note",
  text: M1.introNote,
};

export function MissionAsk({ onComplete }: { onComplete: () => void }) {
  const [stage, setStage] = useState<Stage>("idle");
  const [messages, setMessages] = useState<ChatMsg[]>([INTRO_NOTE]);

  const sendQuestion = () => {
    setMessages((prev) => [
      ...prev,
      { id: "u1", role: "user", text: M1.question },
      { id: "a1", role: "ai", blocks: M1.answerWithoutUs },
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
        text: M1.afterNote,
        actionLabel: "미션 1 완료, 다음으로",
        actionId: "complete",
      },
    ]);
    setStage("done");
  };

  const handleAction = (id: string) => {
    if (id === "complete") onComplete();
  };

  return (
    <div className="space-y-4">
      <ChatWindow
        messages={messages}
        subtitle="GEO 기초 실습"
        onAiDone={handleAiDone}
        onAction={handleAction}
      />
      <Composer
        segments={[{ text: M1.question }]}
        onSend={sendQuestion}
        disabled={stage !== "idle"}
      />
    </div>
  );
}
