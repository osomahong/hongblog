"use client";

/**
 * 미션 1: robots.txt를 점검해 AI 크롤러 차단을 확인하고, 수정 후 재점검한다.
 * 점검 요청 → 차단 리포트 → robots.txt 수정 안내 → 재점검 → 전부 허용 리포트 순서로
 * 하나의 채팅 안에서 진행한다.
 */

import { useState } from "react";
import { M1 } from "./lab-data";
import { ChatWindow, type ChatMsg } from "../lab/SimChat";
import { Composer } from "../lab/ui";

type Stage = "idle" | "streaming1" | "recheckReady" | "streaming2" | "done";

const INTRO_NOTE: ChatMsg = {
  id: "n0",
  role: "note",
  text: M1.introNote,
};

export function MissionCrawler({ onComplete }: { onComplete: () => void }) {
  const [stage, setStage] = useState<Stage>("idle");
  const [messages, setMessages] = useState<ChatMsg[]>([INTRO_NOTE]);

  const pushNote = (note: ChatMsg) => {
    setMessages((prev) => [
      ...prev.map((m) => (m.role === "note" ? { ...m, actionUsed: true } : m)),
      note,
    ]);
  };

  const sendCheck = () => {
    setMessages((prev) => [
      ...prev,
      { id: "u1", role: "user", text: M1.checkQuestion },
      { id: "a1", role: "ai", blocks: M1.blockedReport },
    ]);
    setStage("streaming1");
  };

  const sendRecheck = () => {
    setMessages((prev) => [
      ...prev,
      { id: "u2", role: "user", text: M1.recheckQuestion },
      { id: "a2", role: "ai", blocks: M1.allowedReport },
    ]);
    setStage("streaming2");
  };

  const handleAiDone = () => {
    if (stage === "streaming1") {
      pushNote({
        id: "n1",
        role: "note",
        text: M1.afterBlockedNote,
      });
      setStage("recheckReady");
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

  const recheck = stage === "recheckReady" || stage === "streaming2" || stage === "done";

  return (
    <div className="space-y-4">
      <ChatWindow
        messages={messages}
        subtitle="GEO 심화 실습"
        onAiDone={handleAiDone}
        onAction={handleAction}
      />
      <Composer
        segments={
          recheck
            ? [{ text: M1.recheckQuestion, highlight: true, label: "수정한 robots.txt로 재점검" }]
            : [{ text: M1.checkQuestion }]
        }
        onSend={stage === "idle" ? sendCheck : sendRecheck}
        disabled={stage !== "idle" && stage !== "recheckReady"}
      />
    </div>
  );
}
