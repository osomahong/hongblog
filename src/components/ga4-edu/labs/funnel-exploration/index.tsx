"use client";

/**
 * 중급 4번: 유입경로 탐색으로 이탈 단계 찾기.
 *
 * 학습자는 단계가 하나 빠진 유입경로에서 시작해 결제 시작 단계를 직접 넣는다.
 * 그다음 다섯 단계 가운데 사람이 가장 많이 빠지는 구간을 고르고, 마지막에 열린 유입경로를
 * 켜서 같은 표의 숫자가 어떻게 달라지는지 본다.
 *
 * 단계를 넣기 전과 넣은 뒤의 완료율이 달라지는 것도 화면에서 그대로 드러난다.
 * 단계를 건너뛰면 그 사이에서 빠진 사람이 보이지 않는다는 것이 이 편의 핵심이다.
 */

import { useEffect, useState } from "react";
import { Ga4ExploreShell, Ga4ExploreHome } from "../../app/Ga4ExploreShell";
import { Ga4Funnel } from "../../app/Ga4Funnel";
import { RingProvider, Ga4Guide } from "../../app/tour";
import {
  INITIAL_FUNNEL_STATE,
  type Ga4FunnelState,
  type TourStep,
} from "../../app/types";
import { useStepEngine } from "../../lab/useStepEngine";
import {
  ACCOUNT_NAME,
  PROPERTY_NAME,
  SEARCH_HINT,
  EXPLORATION_NAME,
  DATE_LABEL,
  ALL_STAGES,
  INITIAL_STAGES,
  STAGE_TO_ADD,
  FULL_STAGES,
  candidatesFor,
  BIGGEST_DROP_STAGE,
  DECOY_STAGE,
} from "./data";

const LAB_ID = "funnel-exploration";
const LAB_TITLE = "유입경로 탐색으로 이탈 단계 찾기";

/** 결제 시작이 빠진 네 단계로 시작한다 */
const START_STATE: Ga4FunnelState = {
  ...INITIAL_FUNNEL_STATE,
  stages: INITIAL_STAGES,
};

/* ===================== 스텝 ===================== */

const STEPS: TourStep<Ga4FunnelState>[] = [
  {
    id: "open_funnel",
    instruction: "탐색 분석 화면에서 빨간 상자가 그려진 유입경로 탐색 분석을 누릅니다.",
    ring: "template:funnel",
    isDone: (s) => s.screen === "funnel",
  },
  {
    id: "open_editor",
    instruction:
      "지금 유입경로에는 결제 시작이 빠져 있습니다. 탭 설정의 단계 옆 연필을 눌러 수정 패널을 엽니다.",
    ring: "funnel:edit",
    isDone: (s) => s.editorOpen === true,
  },
  {
    id: "pick_stage",
    instruction: "단계 추가에서 목록을 열고 결제 시작을 고릅니다.",
    ring: "funnel:stage-list",
    isDone: (s) => s.draftStage === STAGE_TO_ADD,
  },
  {
    id: "apply_stage",
    instruction: "적용을 눌러 다섯 단계로 만듭니다.",
    ring: "funnel:apply",
    isDone: (s) => s.stages.length === FULL_STAGES.length && s.editorOpen === false,
  },
  {
    id: "find_drop",
    instruction:
      "표의 마지막 열을 보고 다음 단계로 넘어가지 않은 비율이 가장 큰 단계를 누릅니다.",
    ring: null,
    isDone: (s) => s.selectedStage === BIGGEST_DROP_STAGE,
    isMiss: (s) => s.selectedStage !== null && s.selectedStage !== BIGGEST_DROP_STAGE,
    missText: `${DECOY_STAGE}에서 구매로는 21.0%만 빠집니다. 마지막 열의 값이 가장 큰 줄을 다시 찾아보세요.`,
    reset: { selectedStage: null },
  },
  {
    id: "toggle_open_funnel",
    instruction:
      "탭 설정의 열린 유입경로 만들기를 켜고, 같은 표의 사람 수가 어떻게 달라지는지 봅니다.",
    ring: "funnel:open-toggle",
    isDone: (s) => s.openFunnel === true,
  },
];

const DONE_TEXT =
  "열린 유입경로에서는 앞 단계를 거치지 않은 사람까지 세기 때문에 상품 조회가 7,240명에서 9,860명으로 늘었습니다. 검색이나 광고로 상품 페이지에 바로 들어온 사람이 그만큼 있다는 뜻입니다.";

export default function FunnelExplorationLab() {
  const [pinned, setPinned] = useState(false);
  const { state, stepIndex, miss, done, step, ring, apply, restart } =
    useStepEngine<Ga4FunnelState>({
      labId: LAB_ID,
      labTitle: LAB_TITLE,
      initialState: START_STATE,
      steps: STEPS,
    });

  // 화면을 고정하는 동안 페이지 스크롤을 막는다
  useEffect(() => {
    if (!pinned) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [pinned]);

  /** 적용을 누르면 초안 단계를 순서에 맞는 위치에 넣고 패널을 닫는다 */
  function applyStage() {
    if (!state.draftStage) return;
    const next = FULL_STAGES.filter(
      (name) => state.stages.includes(name) || name === state.draftStage
    );
    apply({
      stages: next,
      draftStage: null,
      stageListOpen: false,
      editorOpen: false,
    });
  }

  return (
    <RingProvider value={ring}>
      <div className={`ga4-stage${pinned ? " ga4-stage-pinned" : ""}`}>
        <Ga4ExploreShell
          account={ACCOUNT_NAME}
          property={PROPERTY_NAME}
          searchHint={SEARCH_HINT}
          pinned={pinned}
          onTogglePin={() => setPinned((v) => !v)}
        >
          {state.screen === "home" ? (
            <Ga4ExploreHome
              propertyName={ACCOUNT_NAME}
              onOpenTemplate={(id) => apply({ screen: id === "funnel" ? "funnel" : "home" })}
            />
          ) : (
            <Ga4Funnel
              name={EXPLORATION_NAME}
              dateLabel={DATE_LABEL}
              allStages={ALL_STAGES}
              candidates={candidatesFor(state.stages)}
              state={state}
              onOpenEditor={() => apply({ editorOpen: true })}
              onCloseEditor={() => apply({ editorOpen: false, stageListOpen: false })}
              onToggleStageList={() => apply({ stageListOpen: !state.stageListOpen })}
              onPickDraft={(name) => apply({ draftStage: name, stageListOpen: false })}
              onApplyStage={applyStage}
              onToggleOpenFunnel={() => apply({ openFunnel: !state.openFunnel })}
              onSelectStage={(name) => apply({ selectedStage: name })}
              markStage={done ? BIGGEST_DROP_STAGE : null}
            />
          )}
        </Ga4ExploreShell>

        <Ga4Guide
          index={Math.min(stepIndex, STEPS.length - 1)}
          total={STEPS.length}
          instruction={done ? DONE_TEXT : (step?.instruction ?? "")}
          miss={miss}
          done={done}
          onRestart={restart}
        />
      </div>
    </RingProvider>
  );
}
