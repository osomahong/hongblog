"use client";

/** 미션 2: 자기 점검 요청을 붙이기 전과 후의 결과를 같은 채팅에서 비교한다. */

import { useState } from "react";
import { M2 } from "./lab-data";
import { ChatWindow, type ChatMsg } from "../lab/SimChat";
import { Composer } from "../lab/ui";

type Stage = "idle" | "streaming1" | "afterWeak" | "checkReady" | "streaming2" | "done";

const INTRO_NOTE: ChatMsg = {
  id: "n0",
  role: "note",
  text: "이번에는 필수 항목까지 정해서 요청합니다. 먼저 점검 요청 없이 전송해 보세요.",
};

export function MissionSelfCheck({ onComplete }: { onComplete: () => void }) {
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
      { id: "u1", role: "user", text: M2.baseQuestion },
      { id: "a1", role: "ai", blocks: M2.weakAnswer },
    ]);
    setStage("streaming1");
  };

  const sendWithCheck = () => {
    setMessages((prev) => [
      ...prev,
      { id: "u2", role: "user", text: `${M2.baseQuestion}\n\n${M2.selfCheckBlock}` },
      { id: "a2", role: "ai", blocks: M2.strongAnswer },
    ]);
    setStage("streaming2");
  };

  const handleAiDone = () => {
    if (stage === "streaming1") {
      pushNote({
        id: "n1",
        role: "note",
        text: M2.afterWeakNote,
        actionLabel: "자기 점검 요청 추가하기",
        actionId: "add-check",
      });
      setStage("afterWeak");
    } else if (stage === "streaming2") {
      pushNote({
        id: "n3",
        role: "note",
        text: M2.comparison,
        actionLabel: "미션 2 완료, 다음으로",
        actionId: "complete",
      });
      setStage("done");
    }
  };

  const handleAction = (id: string) => {
    if (id === "add-check") {
      pushNote({ id: "n2", role: "note", text: M2.checkReadyNote });
      setStage("checkReady");
    }
    if (id === "complete") {
      onComplete();
    }
  };

  const withCheck = stage === "checkReady" || stage === "streaming2" || stage === "done";

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
          withCheck
            ? [
                { text: M2.baseQuestion, label: "기존 요청 (그대로)" },
                { text: M2.selfCheckBlock, highlight: true, label: "자기 점검 요청" },
              ]
            : [{ text: M2.baseQuestion }]
        }
        onSend={stage === "idle" ? sendBare : sendWithCheck}
        disabled={stage !== "idle" && stage !== "checkReady"}
      />
    </div>
  );
}
