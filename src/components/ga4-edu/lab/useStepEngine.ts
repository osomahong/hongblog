"use client";

/**
 * 튜토리얼 스텝 엔진.
 *
 * 학습자가 화면을 조작하면 GA4 상태가 바뀌고, 바뀐 상태가 지금 스텝의 완료 조건을 만족하는
 * 순간 다음 스텝으로 넘어간다. 다음 버튼이 없다.
 *
 * 상태 변경과 스텝 이동을 apply 한 곳에서 함께 처리한다. 상태를 먼저 바꾸고 useEffect에서
 * 스텝을 옮기면 렌더가 두 번 일어나고 React Compiler 규칙에도 걸린다.
 */

import { useState } from "react";
import { sendGAEvent } from "@/lib/gtm";
import { saveGa4EduProgress } from "./progress";
import type { TourStep } from "../app/types";

interface StepEngineOptions<S> {
  /** GA 이벤트와 진행 저장에 쓰는 튜토리얼 식별자 */
  labId: string;
  labTitle: string;
  initialState: S;
  steps: TourStep<S>[];
}

interface EngineUi<S> {
  state: S;
  stepIndex: number;
  /** 판단 스텝을 잘못 짚은 직후에만 채워진다 */
  miss: string | null;
}

export function useStepEngine<S extends object>({
  labId,
  labTitle,
  initialState,
  steps,
}: StepEngineOptions<S>) {
  const initialUi: EngineUi<S> = { state: initialState, stepIndex: 0, miss: null };
  const [ui, setUi] = useState<EngineUi<S>>(initialUi);

  const { state, stepIndex, miss } = ui;
  const done = stepIndex >= steps.length;
  const step = done ? null : steps[stepIndex];

  const apply = (patch: Partial<S>) => {
    const next = { ...state, ...patch };

    if (!step) {
      setUi({ ...ui, state: next });
      return;
    }

    if (step.isDone(next)) {
      const nextIndex = stepIndex + 1;
      const nextStep = steps[nextIndex];
      sendGAEvent("ga4edu_step_complete", {
        content_id: labId,
        content_name: labTitle,
        step_id: step.id,
        position: stepIndex + 1,
      });
      if (nextStep) {
        saveGa4EduProgress(labId, { phase: "mission", missionIndex: nextIndex });
      } else {
        sendGAEvent("ga4edu_complete", { content_id: labId, content_name: labTitle });
        saveGa4EduProgress(labId, {
          phase: "wrap",
          missionIndex: steps.length,
          completedAt: Date.now(),
        });
      }
      setUi({
        state: nextStep?.reset ? { ...next, ...nextStep.reset } : next,
        stepIndex: nextIndex,
        miss: null,
      });
      return;
    }

    if (step.isMiss?.(next)) {
      const picked = (next as { selectedRow?: string | null }).selectedRow;
      sendGAEvent("ga4edu_decision", {
        content_id: labId,
        content_name: labTitle,
        step_id: step.id,
        choice: picked ?? "",
        correct: false,
      });
      setUi({ ...ui, state: next, miss: step.missText ?? null });
      return;
    }

    setUi({ ...ui, state: next, miss: null });
  };

  const restart = () => {
    sendGAEvent("ga4edu_restart", { content_id: labId, content_name: labTitle });
    setUi(initialUi);
  };

  const ring = typeof step?.ring === "function" ? step.ring(state) : (step?.ring ?? null);

  return { state, stepIndex, miss, done, step, ring, apply, restart };
}
