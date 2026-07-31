"use client";

/** 미션 1: 역할 부여 전후의 답변을 같은 채팅에서 비교한다. 안내와 진행은 모두 채팅 안에서 이루어진다. */

import { useState } from "react";
import { M1 } from "./lab-data";
import { ChatWindow, type ChatMsg } from "../lab/SimChat";
import { Composer } from "../lab/ui";

type Stage = "idle" | "streaming1" | "afterWeak" | "roleReady" | "streaming2" | "done";

const INTRO_NOTE: ChatMsg = {
  id: "n0",
  role: "note",
  text: "먼저 역할 없이, 평소 묻던 방식 그대로 아래 프롬프트를 전송해 보세요.",
};

export function MissionRole({ onComplete }: { onComplete: () => void }) {
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

  const sendWithRole = () => {
    setMessages((prev) => [
      ...prev,
      { id: "u2", role: "user", text: `${M1.roleBlock}\n\n${M1.bareQuestion}` },
      { id: "a2", role: "ai", blocks: M1.strongAnswer },
    ]);
    setStage("streaming2");
  };

  const handleAiDone = () => {
    if (stage === "streaming1") {
      pushNote({
        id: "n1",
        role: "note",
        text: "어디서 본 듯한 방법이 나열됐지만, 무엇부터 해야 할지는 알 수 없습니다. 질문에 답변의 기준이 없었기 때문입니다.\n같은 질문 앞에 역할 한 줄을 붙여 보겠습니다.",
        actionLabel: "역할 블록 추가하기",
        actionId: "add-role",
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
    if (id === "add-role") {
      pushNote({
        id: "n2",
        role: "note",
        text: "아래 입력창을 보세요. 방금 보낸 질문은 그대로 있고, 그 앞에 노란 상자로 표시된 역할 한 줄이 새로 추가됐습니다.\n이 상태로 다시 전송해 보세요.",
      });
      setStage("roleReady");
    }
    if (id === "complete") {
      onComplete();
    }
  };

  const withRole = stage === "roleReady" || stage === "streaming2" || stage === "done";

  return (
    <div className="space-y-4">
      <ChatWindow
        messages={messages}
        subtitle="프롬프트 기초 실습"
        onAiDone={handleAiDone}
        onAction={handleAction}
      />
      <Composer
        segments={
          withRole
            ? [
                { text: M1.roleBlock, highlight: true, label: "역할" },
                { text: M1.bareQuestion, label: "기존 질문 (그대로)" },
              ]
            : [{ text: M1.bareQuestion }]
        }
        onSend={stage === "idle" ? sendBare : sendWithRole}
        disabled={stage !== "idle" && stage !== "roleReady"}
      />
    </div>
  );
}
