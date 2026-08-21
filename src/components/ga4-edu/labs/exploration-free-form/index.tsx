"use client";

/**
 * 중급 1번: 자유 형식 보고서 만들고 행과 열 배치하기.
 *
 * 학습자는 빈 자유 형식에서 시작해 측정기준을 행과 열로, 측정항목을 값으로 옮긴다.
 * 네 번째 스텝에서 전체 참여율이 가장 낮은 페이지를 고르게 하고, 열을 더한 뒤 같은 표를
 * 다시 읽게 해서 답이 바뀌는 것을 직접 보게 한다.
 */

import { useEffect, useState } from "react";
import { Ga4ExploreShell, Ga4ExploreHome } from "../../app/Ga4ExploreShell";
import { Ga4FreeForm, type SlotName } from "../../app/Ga4FreeForm";
import { Ga4PivotTable } from "../../app/Ga4PivotTable";
import { RingProvider, Ga4Guide } from "../../app/tour";
import {
  INITIAL_EXPLORE_STATE,
  type Ga4ExploreState,
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
  DIMENSIONS,
  METRICS,
  PAGE_DIMENSION,
  DEVICE_DIMENSION,
  dimensionLabel,
  buildMetrics,
  keysFor,
  cellValues,
  totalValues,
  LOWEST_OVERALL_PAGE,
  WIDEST_DEVICE_GAP_PAGE,
} from "./data";

const LAB_ID = "exploration-free-form";
const LAB_TITLE = "자유 형식 보고서 만들고 행과 열 배치하기";

/* ===================== 스텝 ===================== */

const STEPS: TourStep<Ga4ExploreState>[] = [
  {
    id: "open_free_form",
    instruction: "탐색 분석 화면에서 빨간 상자가 그려진 자유 형식을 누릅니다.",
    ring: "template:free-form",
    isDone: (s) => s.screen === "free-form",
  },
  {
    id: "drop_row",
    instruction: "왼쪽 측정기준의 랜딩 페이지를 끌어다 탭 설정의 행 칸에 놓습니다.",
    // 아직 끌어다 들지 않았으면 변수를, 끌어다 든 뒤에는 놓을 칸을 가리킨다
    ring: (s) => (s.held?.key === PAGE_DIMENSION ? "slot:rows" : `var:${PAGE_DIMENSION}`),
    isDone: (s) => s.rows[0] === PAGE_DIMENSION,
  },
  {
    id: "drop_metric",
    instruction: "측정항목의 참여율을 끌어다 탭 설정의 값 칸에 더합니다.",
    ring: (s) => (s.held?.key === "engagementRate" ? "slot:values" : "var:engagementRate"),
    isDone: (s) => s.values.includes("engagementRate"),
  },
  {
    id: "pick_lowest_overall",
    instruction: "표에서 참여율이 가장 낮은 랜딩 페이지를 찾아 그 줄을 눌러 봅니다.",
    ring: null,
    reset: { selectedRow: null },
    isDone: (s) => s.selectedRow === LOWEST_OVERALL_PAGE,
    isMiss: (s) => s.selectedRow !== null && s.selectedRow !== LOWEST_OVERALL_PAGE,
    missText: "세션수가 아니라 참여율 칸의 값을 확인합니다. 그 칸에서 가장 작은 값이 있는 줄입니다.",
  },
  {
    id: "drop_column",
    instruction:
      "이번에는 기기별로 나눠 봅니다. 측정기준의 기기 카테고리를 끌어다 열 칸에 놓습니다.",
    ring: (s) => (s.held?.key === DEVICE_DIMENSION ? "slot:columns" : `var:${DEVICE_DIMENSION}`),
    reset: { selectedRow: null },
    isDone: (s) => s.columns[0] === DEVICE_DIMENSION,
  },
  {
    id: "pick_device_gap",
    instruction: "desktop과 mobile의 참여율 차이가 가장 큰 랜딩 페이지를 골라 봅니다.",
    ring: null,
    reset: { selectedRow: null },
    isDone: (s) => s.selectedRow === WIDEST_DEVICE_GAP_PAGE,
    isMiss: (s) => s.selectedRow !== null && s.selectedRow !== WIDEST_DEVICE_GAP_PAGE,
    missText:
      "전체 참여율이 가장 낮은 줄이 답은 아닙니다. desktop 참여율에서 mobile 참여율을 빼 보고 그 차이가 가장 큰 줄을 찾습니다.",
  },
];

const DONE_TEXT =
  "/event/summer는 전체 참여율이 42.42%라 표에서 두 번째로 낮습니다. 기기로 나누면 desktop 71.22%, mobile 33.41%로 37.8퍼센트포인트 벌어집니다. mobile 세션이 5,930회라 mobile 참여율을 전체 mobile 평균인 47.21%까지만 올려도 참여 세션이 820회쯤 늘어납니다. 전체 참여율이 가장 낮은 /product/list를 40%로 올렸을 때 늘어나는 240회보다 세 배 넘게 큽니다.";

/* ===================== 화면 ===================== */

export default function ExplorationFreeFormLab() {
  const { state, stepIndex, miss, done, step, ring, apply, restart } =
    useStepEngine<Ga4ExploreState>({
      labId: LAB_ID,
      labTitle: LAB_TITLE,
      initialState: INITIAL_EXPLORE_STATE,
      steps: STEPS,
    });
  const [pinned, setPinned] = useState(false);

  // 화면을 고정하는 동안에는 뒤쪽 문서가 움직이지 않게 막고, Esc로 풀 수 있게 한다
  useEffect(() => {
    if (!pinned) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPinned(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [pinned]);

  const hold = (held: HeldVariable | null) => apply({ held });

  /**
   * 끌어다 든 변수를 칸에 놓는다.
   * 값 칸은 측정항목만, 행과 열은 측정기준만 받는다. 행과 열은 이 편에서 하나씩만 두어
   * 표가 학습 목표에서 멀어지지 않게 한다.
   */
  const dropTo = (slot: SlotName) => {
    const held = state.held;
    if (!held) return;
    const wants = slot === "values" ? "metric" : "dimension";
    if (held.kind !== wants) return;

    const current = state[slot];
    if (current.includes(held.key)) {
      apply({ held: null });
      return;
    }
    const next = slot === "values" ? [...current, held.key] : [held.key];
    apply(
      slot === "rows"
        ? { rows: next, held: null, selectedRow: null }
        : slot === "columns"
          ? { columns: next, held: null, selectedRow: null }
          : { values: next, held: null }
    );
  };

  const removeFrom = (slot: SlotName, key: string) => {
    const next = state[slot].filter((k) => k !== key);
    apply(
      slot === "rows"
        ? { rows: next, selectedRow: null }
        : slot === "columns"
          ? { columns: next, selectedRow: null }
          : { values: next }
    );
  };

  const rowDimension = state.rows[0] ?? null;
  const columnDimension = state.columns[0] ?? null;

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
              onOpenTemplate={(id) =>
                apply({ screen: id === "free-form" || id === "blank" ? "free-form" : "home" })
              }
            />
          ) : (
            <Ga4FreeForm
              name={EXPLORATION_NAME}
              dateLabel={DATE_LABEL}
              dimensions={DIMENSIONS}
              metrics={METRICS}
              state={state}
              onHold={hold}
              onDropTo={dropTo}
              onRemove={removeFrom}
            >
              <Ga4PivotTable
                rowLabel={rowDimension ? dimensionLabel(rowDimension) : null}
                rowKeys={rowDimension ? keysFor(rowDimension) : []}
                columnLabel={columnDimension ? dimensionLabel(columnDimension) : null}
                columnKeys={columnDimension ? keysFor(columnDimension) : []}
                metrics={buildMetrics(state.values)}
                cell={(row, col) => cellValues(rowDimension ?? PAGE_DIMENSION, row, col)}
                total={(col) => totalValues(rowDimension ?? PAGE_DIMENSION, col)}
                selectedRow={state.selectedRow}
                onSelectRow={(row) => apply({ selectedRow: row })}
                markRow={done ? WIDEST_DEVICE_GAP_PAGE : null}
              />
            </Ga4FreeForm>
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
