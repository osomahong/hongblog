"use client";

/** 미션 1: 제약 조건을 걸기 전과 후의 결과를 같은 채팅에서 비교한다. */

import { useState } from "react";
import { M1 } from "./lab-data";
import { ChatWindow, type ChatMsg } from "../lab/SimChat";
import { Composer } from "../lab/ui";

type Stage = "idle" | "streaming1" | "afterWeak" | "constraintsReady" | "streaming2" | "done";

const INTRO_NOTE: ChatMsg = {
  id: "n0",
  role: "note",
  text: "먼저 아무 기준 없이, 평소 묻던 방식 그대로 전송해 보세요.",
};

export function MissionConstraints({ onComplete }: { onComplete: () => void }) {
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

  const sendWithConstraints = () => {
    setMessages((prev) => [
      ...prev,
      { id: "u2", role: "user", text: `${M1.bareQuestion}\n\n${M1.constraintsBlock}` },
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
        actionLabel: "제약 조건 추가하기",
        actionId: "add-constraints",
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
    if (id === "add-constraints") {
      pushNote({ id: "n2", role: "note", text: M1.constraintsReadyNote });
      setStage("constraintsReady");
    }
    if (id === "complete") {
      onComplete();
    }
  };

  const withConstraints = stage === "constraintsReady" || stage === "streaming2" || stage === "done";

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
          withConstraints
            ? [
                { text: M1.bareQuestion, label: "기존 요청 (그대로)" },
                { text: M1.constraintsBlock, highlight: true, label: "제약 조건" },
              ]
            : [{ text: M1.bareQuestion }]
        }
        onSend={stage === "idle" ? sendBare : sendWithConstraints}
        disabled={stage !== "idle" && stage !== "constraintsReady"}
      />
    </div>
  );
}
