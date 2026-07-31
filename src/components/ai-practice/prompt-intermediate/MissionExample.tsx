"use client";

/** 미션 1: 형용사 설명과 예시 제시의 답변을 같은 채팅에서 비교한다. */

import { useState } from "react";
import { M1 } from "./lab-data";
import { ChatWindow, type ChatMsg } from "../lab/SimChat";
import { Composer } from "../lab/ui";

type Stage = "idle" | "streaming1" | "afterWeak" | "exampleReady" | "streaming2" | "done";

const INTRO_NOTE: ChatMsg = {
  id: "n0",
  role: "note",
  text: "먼저 예시 없이, 원하는 톤을 형용사로만 설명해서 전송해 보세요.",
};

export function MissionExample({ onComplete }: { onComplete: () => void }) {
  const [stage, setStage] = useState<Stage>("idle");
  const [messages, setMessages] = useState<ChatMsg[]>([INTRO_NOTE]);

  const pushNote = (note: ChatMsg) => {
    setMessages((prev) => [
      ...prev.map((m) => (m.role === "note" ? { ...m, actionUsed: true } : m)),
      note,
    ]);
  };

  const sendBare = () => {
    setMessages((prev) => [
      ...prev,
      { id: "u1", role: "user", text: M1.bareQuestion },
      { id: "a1", role: "ai", blocks: M1.weakAnswer },
    ]);
    setStage("streaming1");
  };

  const sendWithExample = () => {
    setMessages((prev) => [
      ...prev,
      { id: "u2", role: "user", text: `${M1.bareQuestion}\n\n${M1.exampleBlock}` },
      { id: "a2", role: "ai", blocks: M1.strongAnswer },
    ]);
    setStage("streaming2");
  };

  const handleAiDone = () => {
    if (stage === "streaming1") {
      pushNote({
        id: "n1",
        role: "note",
        text: M1.afterWeakNote,
        actionLabel: "예시 블록 추가하기",
        actionId: "add-example",
      });
      setStage("afterWeak");
    } else if (stage === "streaming2") {
      pushNote({
        id: "n3",
        role: "note",
        text: M1.comparison,
        actionLabel: "미션 1 완료, 다음으로",
        actionId: "complete",
      });
      setStage("done");
    }
  };

  const handleAction = (id: string) => {
    if (id === "add-example") {
      pushNote({ id: "n2", role: "note", text: M1.exampleReadyNote });
      setStage("exampleReady");
    }
    if (id === "complete") {
      onComplete();
    }
  };

  const withExample = stage === "exampleReady" || stage === "streaming2" || stage === "done";

  return (
    <div className="space-y-4">
      <ChatWindow
        messages={messages}
        subtitle="프롬프트 중급 실습"
        onAiDone={handleAiDone}
        onAction={handleAction}
      />
      <Composer
        segments={
          withExample
            ? [
                { text: M1.bareQuestion, label: "기존 요청 (그대로)" },
                { text: M1.exampleBlock, highlight: true, label: "예시" },
              ]
            : [{ text: M1.bareQuestion }]
        }
        onSend={stage === "idle" ? sendBare : sendWithExample}
        disabled={stage !== "idle" && stage !== "exampleReady"}
      />
    </div>
  );
}
