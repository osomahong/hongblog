"use client";

/**
 * 중급 7번: 세그먼트 만들어 특정 사용자만 비교하기.
 *
 * 조건은 그대로 두고 범위만 바꿔 세그먼트를 둘 만든다. 모바일 세션 세그먼트와
 * 모바일 사용자 세그먼트를 한 표에 나란히 놓으면 세션수가 다르게 나온다.
 *
 * 사용자 범위는 조건을 한 번이라도 만족한 사람의 모든 세션을 끌고 오기 때문인데,
 * 이 차이를 모르면 같은 조건인데 숫자가 왜 다른지 설명하지 못한다.
 */

import { useEffect, useState } from "react";
import { Ga4ExploreShell, Ga4ExploreHome } from "../../app/Ga4ExploreShell";
import { Ga4FreeForm, type SlotName } from "../../app/Ga4FreeForm";
import { Ga4PivotTable } from "../../app/Ga4PivotTable";
import { Ga4SegmentBuilder, type SegmentScope } from "../../app/Ga4SegmentBuilder";
import { RingProvider, Ga4Guide } from "../../app/tour";
import {
  INITIAL_SEGMENT_STATE,
  type Ga4SegmentState,
  type HeldVariable,
  type TourStep,
} from "../../app/types";
import { useStepEngine } from "../../lab/useStepEngine";
import {
  ACCOUNT_NAME,
  PROPERTY_NAME,
  SEARCH_HINT,
  EXPLORATION_NAME,
  DATE_LABEL,
  CONDITION_LABEL,
  SEGMENT_NAME,
  nameOf,
  buildMetrics,
  cellValues,
  totalValues,
  rowsFor,
  WIDER_SEGMENT,
  NARROWER_SEGMENT,
  SESSION_GAP,
} from "./data";

const LAB_ID = "segment-basics";
const LAB_TITLE = "세그먼트 만들어 특정 사용자만 비교하기";

/** 자유 형식이 이미 열려 있고 세션수와 총 사용자가 값에 놓인 상태로 시작한다 */
const START_STATE: Ga4SegmentState = {
  ...INITIAL_SEGMENT_STATE,
  screen: "free-form",
  values: ["sessions", "totalUsers"],
};

/* ===================== 스텝 ===================== */

const STEPS: TourStep<Ga4SegmentState>[] = [
  {
    id: "open_builder",
    instruction: "왼쪽 변수 패널의 세그먼트 옆 더하기를 눌러 만들기 화면을 엽니다.",
    ring: "segment-add",
    isDone: (s) => s.builderOpen === true,
  },
  {
    id: "pick_session_scope",
    instruction: "범위 가운데 세션 세그먼트를 고르고 만들기를 누릅니다.",
    ring: (s) => (s.builderScope === "session" ? "segment-create" : "segment-scope:session"),
    isDone: (s) => s.segments.includes(SEGMENT_NAME.session) && s.builderOpen === false,
  },
  {
    id: "open_builder_again",
    instruction: "같은 조건으로 범위만 다른 세그먼트를 하나 더 만듭니다. 더하기를 다시 누릅니다.",
    ring: "segment-add",
    isDone: (s) => s.builderOpen === true,
  },
  {
    id: "pick_user_scope",
    instruction: "이번에는 사용자 세그먼트를 고르고 만들기를 누릅니다.",
    ring: (s) => (s.builderScope === "user" ? "segment-create" : "segment-scope:user"),
    isDone: (s) => s.segments.includes(SEGMENT_NAME.user) && s.builderOpen === false,
  },
  {
    id: "compare",
    instruction:
      "조건은 둘 다 같은데 세션수가 다릅니다. 세션수가 더 많이 남은 세그먼트 줄을 누릅니다.",
    ring: null,
    isDone: (s) => s.selectedRow === WIDER_SEGMENT,
    isMiss: (s) => s.selectedRow !== null && s.selectedRow !== WIDER_SEGMENT,
    missText: `${NARROWER_SEGMENT}은 조건을 만족한 세션만 남겨 더 적습니다. 세션수가 큰 줄을 다시 보세요.`,
    reset: { selectedRow: null },
  },
];

const DONE_TEXT = `조건이 같아도 사용자 범위는 세션수가 ${SESSION_GAP.toLocaleString("ko-KR")}회 더 많습니다. 모바일을 한 번이라도 쓴 사람의 데스크톱 세션까지 함께 남기기 때문입니다. 총 사용자는 5,920명으로 두 세그먼트가 같습니다.`;

export default function SegmentBasicsLab() {
  const [pinned, setPinned] = useState(false);
  const { state, stepIndex, miss, done, step, ring, apply, restart } =
    useStepEngine<Ga4SegmentState>({
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

  const hold = (held: HeldVariable | null) => apply({ held });
  const dropTo = (_slot: SlotName) => apply({ held: null });
  const removeFrom = (_slot: SlotName, _key: string) => apply({ held: null });

  /** 만들기를 누르면 고른 범위의 세그먼트를 목록에 올리고 패널을 닫는다 */
  function createSegment() {
    if (!state.builderScope) return;
    const name = nameOf(state.builderScope);
    if (state.segments.includes(name)) {
      apply({ builderOpen: false, builderScope: null });
      return;
    }
    apply({
      segments: [...state.segments, name],
      builderOpen: false,
      builderScope: null,
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
              onOpenTemplate={() => apply({ screen: "free-form" })}
            />
          ) : (
            <Ga4FreeForm
              name={EXPLORATION_NAME}
              dateLabel={DATE_LABEL}
              dimensions={[]}
              metrics={[
                { key: "sessions", label: "세션수" },
                { key: "totalUsers", label: "총 사용자" },
              ]}
              state={state}
              onHold={hold}
              onDropTo={dropTo}
              onRemove={removeFrom}
              segments={state.segments}
              onAddSegment={() => apply({ builderOpen: true, builderScope: null })}
            >
              <Ga4PivotTable
                rowLabel="세그먼트"
                rowKeys={rowsFor(state.segments)}
                columnLabel={null}
                columnKeys={[]}
                metrics={buildMetrics(state.values)}
                cell={(row) => cellValues(row)}
                total={() => totalValues()}
                selectedRow={state.selectedRow}
                onSelectRow={(row) => apply({ selectedRow: row })}
                markRow={done ? WIDER_SEGMENT : null}
              />
            </Ga4FreeForm>
          )}

          {state.builderOpen && (
            <Ga4SegmentBuilder
              scope={state.builderScope}
              conditionLabel={CONDITION_LABEL}
              made={state.segments}
              nameOf={nameOf}
              onPickScope={(scope: SegmentScope) => apply({ builderScope: scope })}
              onCreate={createSegment}
              onClose={() => apply({ builderOpen: false, builderScope: null })}
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
