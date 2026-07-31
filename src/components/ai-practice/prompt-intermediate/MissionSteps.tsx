"use client";

/**
 * 미션 2: 한 번에 다 맡긴 요청과 단계를 나눈 요청을 같은 채팅에서 비교한다.
 * 1단계(아이디어 3개) 결과를 보고 아이디어 하나를 골라 2단계(실행 계획 표)를 요청한다.
 */

import { useState } from "react";
import { M2, type IdeaOption } from "./lab-data";
import { ChatWindow, type Block, type ChatMsg } from "../lab/SimChat";
import { Composer } from "../lab/ui";

type Stage =
  | "idle"
  | "streaming1"
  | "afterWeak"
  | "step1Ready"
  | "streaming2"
  | "pickIdea"
  | "streaming3"
  | "done";

const INTRO_NOTE: ChatMsg = {
  id: "n0",
  role: "note",
  text: "먼저 평소처럼, 필요한 것을 전부 한 번에 요청해 보세요.",
};

export function MissionSteps({ onComplete }: { onComplete: () => void }) {
  const [stage, setStage] = useState<Stage>("idle");
  const [messages, setMessages] = useState<ChatMsg[]>([INTRO_NOTE]);
  const [ideaId, setIdeaId] = useState<string | null>(null);

  const idea: IdeaOption | undefined = M2.ideas.find((i) => i.id === ideaId);

  const pushNote = (note: ChatMsg) => {
    setMessages((prev) => [
      ...prev.map((m) => (m.role === "note" ? { ...m, actionUsed: true } : m)),
      note,
    ]);
  };

  const sendBare = () => {
    setMessages((prev) => [
      ...prev,
      { id: "u1", role: "user", text: M2.bareQuestion },
      { id: "a1", role: "ai", blocks: M2.weakAnswer },
    ]);
    setStage("streaming1");
  };

  const sendStep1 = () => {
    setMessages((prev) => [
      ...prev,
      { id: "u2", role: "user", text: M2.step1Prompt },
      { id: "a2", role: "ai", blocks: M2.step1Answer },
    ]);
    setStage("streaming2");
  };

  const sendStep2 = () => {
    if (!idea) return;
    const blocks: Block[] = [
      { type: "p", text: M2.step2Intro(idea.name) },
      { type: "table", headers: ["항목", "내용"], rows: idea.rows },
    ];
    setMessages((prev) => [
      ...prev,
      { id: "u3", role: "user", text: M2.step2Prompt(idea.name) },
      { id: "a3", role: "ai", blocks },
    ]);
    setStage("streaming3");
  };

  const handleAiDone = () => {
    if (stage === "streaming1") {
      pushNote({
        id: "n1",
        role: "note",
        text: M2.afterWeakNote,
        actionLabel: "단계로 나눠 요청하기",
        actionId: "split-steps",
      });
      setStage("afterWeak");
    } else if (stage === "streaming2") {
      pushNote({ id: "n3", role: "note", text: M2.pickIdeaNote });
      setStage("pickIdea");
    } else if (stage === "streaming3") {
      pushNote({
        id: "n4",
        role: "note",
        text: M2.doneNote,
        actionLabel: "미션 2 완료, 다음으로",
        actionId: "complete",
      });
      setStage("done");
    }
  };

  const handleAction = (id: string) => {
    if (id === "split-steps") {
      pushNote({ id: "n2", role: "note", text: M2.step1ReadyNote });
      setStage("step1Ready");
    }
    if (id === "complete") {
      onComplete();
    }
  };

  const segments = (() => {
    if (stage === "idle" || stage === "streaming1" || stage === "afterWeak") {
      return [{ text: M2.bareQuestion }];
    }
    if (stage === "step1Ready" || stage === "streaming2") {
      return [{ text: M2.step1Prompt, highlight: true, label: "1단계 요청" }];
    }
    if (!idea) {
      return [{ text: M2.step2Placeholder }];
    }
    return [{ text: M2.step2Prompt(idea.name), highlight: true, label: "2단계 요청" }];
  })();

  const canSend =
    stage === "idle" || stage === "step1Ready" || (stage === "pickIdea" && ideaId !== null);

  const onSend = () => {
    if (stage === "idle") sendBare();
    else if (stage === "step1Ready") sendStep1();
    else if (stage === "pickIdea") sendStep2();
  };

  const showChips = stage === "pickIdea" || stage === "streaming3" || stage === "done";

  return (
    <div className="space-y-4">
      <ChatWindow
        messages={messages}
        subtitle="프롬프트 중급 실습"
        onAiDone={handleAiDone}
        onAction={handleAction}
      />
      <Composer
        segments={segments}
        onSend={onSend}
        disabled={!canSend}
        optionsRole="radiogroup"
        optionsLabel="이벤트 아이디어 선택"
      >
        {showChips &&
          M2.ideas.map((option) => {
            const on = option.id === ideaId;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => stage === "pickIdea" && setIdeaId(option.id)}
                role="radio"
                aria-checked={on}
                aria-disabled={stage !== "pickIdea"}
                className={`ap-chip ${on ? "ap-chip-on" : ""}`}
              >
                {option.label}
              </button>
            );
          })}
      </Composer>
    </div>
  );
}
