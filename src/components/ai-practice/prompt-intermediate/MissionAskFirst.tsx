"use client";

/** 미션 3: AI가 먼저 질문하게 만들고, 질문에 답한 뒤 조건에 맞는 답변을 받는다. */

import { useState } from "react";
import { M3 } from "./lab-data";
import { ChatWindow, type ChatMsg } from "../lab/SimChat";
import { Composer } from "../lab/ui";

type Stage = "idle" | "streaming1" | "answersReady" | "streaming2" | "done";

const INTRO_NOTE: ChatMsg = {
  id: "n0",
  role: "note",
  text: "이번에는 바로 답을 요구하지 않고, AI에게 먼저 질문해 달라고 요청해 보세요.\n아래 프롬프트를 그대로 전송합니다.",
};

export function MissionAskFirst({ onComplete }: { onComplete: () => void }) {
  const [stage, setStage] = useState<Stage>("idle");
  const [messages, setMessages] = useState<ChatMsg[]>([INTRO_NOTE]);

  const pushNote = (note: ChatMsg) => {
    setMessages((prev) => [
      ...prev.map((m) => (m.role === "note" ? { ...m, actionUsed: true } : m)),
      note,
    ]);
  };

  const sendAsk = () => {
    setMessages((prev) => [
      ...prev,
      { id: "u1", role: "user", text: M3.askPrompt },
      { id: "a1", role: "ai", blocks: M3.questionsAnswer },
    ]);
    setStage("streaming1");
  };

  const sendAnswers = () => {
    setMessages((prev) => [
      ...prev,
      { id: "u2", role: "user", text: M3.answersText },
      { id: "a2", role: "ai", blocks: M3.finalAnswer },
    ]);
    setStage("streaming2");
  };

  const handleAiDone = () => {
    if (stage === "streaming1") {
      pushNote({ id: "n1", role: "note", text: M3.afterQuestionsNote });
      setStage("answersReady");
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

  const answering = stage === "answersReady" || stage === "streaming2" || stage === "done";

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
          answering
            ? [{ text: M3.answersText, highlight: true, label: "질문에 대한 답" }]
            : [{ text: M3.askPrompt }]
        }
        onSend={stage === "idle" ? sendAsk : sendAnswers}
        disabled={stage !== "idle" && stage !== "answersReady"}
      />
    </div>
  );
}
