"use client";

/** 미션 1: 감상형 문장과 근거 단정형 문장의 평가를 같은 채팅에서 비교한다. */

import { useState } from "react";
import { M1 } from "./lab-data";
import { ChatWindow, type ChatMsg } from "../lab/SimChat";
import { Composer } from "../lab/ui";

type Stage = "idle" | "streaming1" | "strongReady" | "streaming2" | "done";

const INTRO_NOTE: ChatMsg = {
  id: "n0",
  role: "note",
  text: M1.introNote,
};

export function MissionRefine({ onComplete }: { onComplete: () => void }) {
  const [stage, setStage] = useState<Stage>("idle");
  const [messages, setMessages] = useState<ChatMsg[]>([INTRO_NOTE]);

  const pushNote = (note: ChatMsg) => {
    setMessages((prev) => [
      ...prev.map((m) => (m.role === "note" ? { ...m, actionUsed: true } : m)),
      note,
    ]);
  };

  const sendWeak = () => {
    setMessages((prev) => [
      ...prev,
      { id: "u1", role: "user", text: `이 문장을 사이트에 쓰려고 합니다. 인용 관점에서 평가해 주세요.\n"${M1.weakSentence}"` },
      { id: "a1", role: "ai", blocks: M1.weakEval },
    ]);
    setStage("streaming1");
  };

  const sendStrong = () => {
    setMessages((prev) => [
      ...prev,
      { id: "u2", role: "user", text: `다듬었습니다. 다시 평가해 주세요.\n"${M1.strongSentence}"` },
      { id: "a2", role: "ai", blocks: M1.strongEval },
    ]);
    setStage("streaming2");
  };

  const handleAiDone = () => {
    if (stage === "streaming1") {
      pushNote({
        id: "n1",
        role: "note",
        text: M1.afterWeakNote,
      });
      setStage("strongReady");
    } else if (stage === "streaming2") {
      pushNote({
        id: "n2",
        role: "note",
        text: M1.doneNote,
        actionLabel: "미션 1 완료, 다음으로",
        actionId: "complete",
      });
      setStage("done");
    }
  };

  const handleAction = (id: string) => {
    if (id === "complete") onComplete();
  };

  const strong = stage === "strongReady" || stage === "streaming2" || stage === "done";

  return (
    <div className="space-y-4">
      <ChatWindow
        messages={messages}
        subtitle="GEO 중급 실습"
        onAiDone={handleAiDone}
        onAction={handleAction}
      />
      <Composer
        segments={
          strong
            ? [{ text: M1.strongSentence, highlight: true, label: "세 조건을 갖춘 문장" }]
            : [{ text: M1.weakSentence }]
        }
        onSend={stage === "idle" ? sendWeak : sendStrong}
        disabled={stage !== "idle" && stage !== "strongReady"}
      />
    </div>
  );
}
