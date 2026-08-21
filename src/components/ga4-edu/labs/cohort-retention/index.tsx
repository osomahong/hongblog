"use client";

/**
 * 중급 9번: 접속 기준 리텐션 확인하기.
 *
 * 일별로 열리는 코호트 표를 주별로 바꿔 흐름을 보고, 잔존율이 가장 크게 떨어지는 구간을 확인한다.
 * 마지막에 연속 계산을 켜서 같은 코호트의 숫자가 낮아지는 것을 확인한다.
 *
 * 표준과 연속은 세는 방법이 다를 뿐 어느 쪽이 옳은 것은 아니다. 무엇을 묻는지에 따라 고른다.
 */

import { useEffect, useState } from "react";
import { Ga4ExploreShell, Ga4ExploreHome } from "../../app/Ga4ExploreShell";
import { Ga4Cohort, type CohortGranularity } from "../../app/Ga4Cohort";
import { RingProvider, Ga4Guide } from "../../app/tour";
import type { TourStep } from "../../app/types";
import { useStepEngine } from "../../lab/useStepEngine";
import {
  ACCOUNT_NAME,
  PROPERTY_NAME,
  SEARCH_HINT,
  EXPLORATION_NAME,
  DATE_LABEL,
  COLUMN_LABELS,
  rowsFor,
  BIGGEST_DROP_COLUMN,
  WEAK_COHORT,
} from "./data";

const LAB_ID = "cohort-retention";
const LAB_TITLE = "접속 기준 리텐션 확인하기";

interface CohortState {
  screen: "home" | "cohort";
  granularity: CohortGranularity;
  rolling: boolean;
  listOpen: boolean;
  selectedColumn: number | null;
}

/** 코호트는 일별로 열리는 것이 기본이라 그 상태에서 시작한다 */
const START_STATE: CohortState = {
  screen: "home",
  granularity: "daily",
  rolling: false,
  listOpen: false,
  selectedColumn: null,
};

/* ===================== 스텝 ===================== */

const STEPS: TourStep<CohortState>[] = [
  {
    id: "open_cohort",
    instruction: "탐색 분석 화면에서 빨간 상자가 그려진 동질 집단 탐색 분석을 누릅니다.",
    ring: "template:cohort",
    isDone: (s) => s.screen === "cohort",
  },
  {
    id: "pick_weekly",
    instruction:
      "일별로 열려 있어 흐름이 잘 보이지 않습니다. 동질 집단 세부기준을 주별로 바꿉니다.",
    ring: "cohort:granularity",
    isDone: (s) => s.granularity === "weekly" && s.listOpen === false,
  },
  {
    id: "find_drop",
    instruction: "잔존율이 가장 크게 떨어지는 열의 머리글을 누릅니다.",
    ring: null,
    isDone: (s) => s.selectedColumn === BIGGEST_DROP_COLUMN,
    isMiss: (s) => s.selectedColumn !== null && s.selectedColumn !== BIGGEST_DROP_COLUMN,
    missText:
      "2주차 이후로는 떨어지는 폭이 완만합니다. 100%에서 한 번에 크게 내려앉는 열을 찾아보세요.",
    reset: { selectedColumn: null },
  },
  {
    id: "toggle_rolling",
    instruction:
      "탭 설정의 연속 계산을 사용 설정하고, 같은 코호트의 숫자가 어떻게 달라지는지 봅니다.",
    ring: "cohort:calculation",
    isDone: (s) => s.rolling === true,
  },
];

const DONE_TEXT = `연속 계산은 앞 기간까지 빠짐없이 온 사람만 세기 때문에 표준보다 낮게 나옵니다. 표를 세로로도 읽어 보세요. 연속 계산을 끄고 보면 ${WEAK_COHORT} 코호트만 1주차가 13.2%로 다른 주보다 낮은데, 그 주에 무엇이 달랐는지 찾는 것이 다음 일입니다.`;

export default function CohortRetentionLab() {
  const [pinned, setPinned] = useState(false);
  const { state, stepIndex, miss, done, step, ring, apply, restart } =
    useStepEngine<CohortState>({
      labId: LAB_ID,
      labTitle: LAB_TITLE,
      initialState: START_STATE,
      steps: STEPS,
    });

  useEffect(() => {
    if (!pinned) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [pinned]);

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
              onOpenTemplate={(id) => apply({ screen: id === "cohort" ? "cohort" : "home" })}
            />
          ) : (
            <Ga4Cohort
              name={EXPLORATION_NAME}
              dateLabel={DATE_LABEL}
              granularity={state.granularity}
              calculation={state.rolling ? "rolling" : "standard"}
              listOpen={state.listOpen}
              rows={rowsFor(state.granularity, state.rolling)}
              columnLabels={COLUMN_LABELS[state.granularity]}
              selectedColumn={state.selectedColumn}
              onToggleList={() => apply({ listOpen: !state.listOpen })}
              onPickGranularity={(value) =>
                apply({ granularity: value, listOpen: false, selectedColumn: null })
              }
              onToggleCalculation={() => apply({ rolling: !state.rolling })}
              onSelectColumn={(index) => apply({ selectedColumn: index })}
              markColumn={done ? BIGGEST_DROP_COLUMN : null}
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
