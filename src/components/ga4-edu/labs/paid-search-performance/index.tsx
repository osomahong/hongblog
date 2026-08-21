"use client";

/**
 * 중급 5번: 검색광고 데이터 성과 분석하기.
 *
 * 자유 형식에 세션 소스/매체를 놓고 세션 주요 이벤트 비율을 더해, 세션수 순위와 전환율 순위가
 * 어긋나는 것을 직접 보게 한다. 그다음 행을 캠페인으로 바꿔 유료 검색 안에서도 캠페인마다
 * 성과가 크게 갈린다는 것을 확인한다.
 *
 * 소스 하나로 묶어 보면 잘하는 캠페인과 못하는 캠페인이 평균에 섞여 보이지 않는다는 것이 이 편의 핵심이다.
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
  SOURCE_DIMENSION,
  CAMPAIGN_DIMENSION,
  dimensionLabel,
  buildMetrics,
  keysFor,
  cellValues,
  totalValues,
  BEST_RATE_SOURCE,
  DECOY_SOURCE,
  WORST_CAMPAIGN,
  DECOY_CAMPAIGN,
} from "./data";

const LAB_ID = "paid-search-performance";
const LAB_TITLE = "검색광고 데이터 성과 분석하기";

/** 세션수와 주요 이벤트는 이미 값에 놓인 상태로 시작한다 */
const START_STATE: Ga4ExploreState = {
  ...INITIAL_EXPLORE_STATE,
  values: ["sessions", "keyEvents"],
};

/* ===================== 스텝 ===================== */

const STEPS: TourStep<Ga4ExploreState>[] = [
  {
    id: "open_free_form",
    instruction: "탐색 분석 화면에서 빨간 상자가 그려진 자유 형식을 누릅니다.",
    ring: "template:free-form",
    isDone: (s) => s.screen === "free-form",
  },
  {
    id: "drop_source",
    instruction: "왼쪽 측정기준의 세션 소스/매체를 끌어다 탭 설정의 행 칸에 놓습니다.",
    ring: (s) => (s.held?.key === SOURCE_DIMENSION ? "slot:rows" : `var:${SOURCE_DIMENSION}`),
    isDone: (s) => s.rows[0] === SOURCE_DIMENSION,
  },
  {
    id: "drop_rate",
    instruction:
      "세션수와 주요 이벤트만으로는 비교가 어렵습니다. 측정항목의 세션 주요 이벤트 비율을 값 칸에 놓습니다.",
    ring: (s) => (s.held?.key === "keyEventRate" ? "slot:values" : "var:keyEventRate"),
    isDone: (s) => s.values.includes("keyEventRate"),
  },
  {
    id: "pick_best_source",
    instruction: "세션 주요 이벤트 비율이 가장 높은 소스/매체 줄을 누릅니다.",
    ring: null,
    isDone: (s) => s.selectedRow === BEST_RATE_SOURCE,
    isMiss: (s) => s.selectedRow !== null && s.selectedRow !== BEST_RATE_SOURCE,
    missText: `${DECOY_SOURCE}은 세션수가 가장 많지만 세션 주요 이벤트 비율은 3.71%입니다. 마지막 열이 가장 높은 줄을 찾아보세요.`,
    reset: { selectedRow: null },
  },
  {
    id: "swap_row",
    instruction:
      "행의 세션 소스/매체를 빼고 세션 캠페인을 놓아, 같은 유입을 캠페인 단위로 나눠 봅니다.",
    ring: (s) =>
      s.rows.length === 0
        ? s.held?.key === CAMPAIGN_DIMENSION
          ? "slot:rows"
          : `var:${CAMPAIGN_DIMENSION}`
        : "slot:rows",
    isDone: (s) => s.rows[0] === CAMPAIGN_DIMENSION,
    reset: { selectedRow: null },
  },
  {
    id: "pick_worst_campaign",
    instruction:
      "캠페인 이름이 붙은 줄 가운데 세션은 많은데 세션 주요 이벤트 비율이 가장 낮은 캠페인을 누릅니다.",
    ring: null,
    isDone: (s) => s.selectedRow === WORST_CAMPAIGN,
    isMiss: (s) => s.selectedRow !== null && s.selectedRow !== WORST_CAMPAIGN,
    missText: `${DECOY_CAMPAIGN}은 전환율이 낮지만 세션이 640으로 적습니다. 세션수와 마지막 열을 함께 보세요.`,
    reset: { selectedRow: null },
  },
];

const DONE_TEXT =
  "신규 키워드 테스트는 세션 1,640회를 쓰고 주요 이벤트 18건을 만들어 1.10%에 그칩니다. 같은 유료 검색인 8월 기획전 브랜드가 15.00%인 것과 비교하면, 소스 하나로 묶어 볼 때 이 차이가 평균에 섞여 보이지 않습니다.";

export default function PaidSearchPerformanceLab() {
  const [pinned, setPinned] = useState(false);
  const { state, stepIndex, miss, done, step, ring, apply, restart } =
    useStepEngine<Ga4ExploreState>({
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

  /** 끌어다 든 변수를 그 칸에 놓는다. 행은 하나만 두고, 값은 뒤에 이어 붙인다 */
  const dropTo = (slot: SlotName) => {
    const held = state.held;
    if (!held) return;
    if (slot === "values") {
      if (held.kind !== "metric") return;
      if (state.values.includes(held.key)) {
        apply({ held: null });
        return;
      }
      apply({ values: [...state.values, held.key], held: null });
      return;
    }
    if (held.kind !== "dimension") return;
    apply({ [slot]: [held.key], held: null } as Partial<Ga4ExploreState>);
  };

  const removeFrom = (slot: SlotName, key: string) => {
    if (slot === "values") {
      apply({ values: state.values.filter((v) => v !== key) });
      return;
    }
    apply({ [slot]: [] } as Partial<Ga4ExploreState>);
  };

  const rowDimension = state.rows[0] ?? null;
  const markRow = done
    ? WORST_CAMPAIGN
    : stepIndex === 4 && rowDimension === SOURCE_DIMENSION
      ? BEST_RATE_SOURCE
      : null;

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
                columnLabel={null}
                columnKeys={[]}
                metrics={buildMetrics(state.values)}
                cell={(row) => cellValues(rowDimension ?? SOURCE_DIMENSION, row)}
                total={() => totalValues(rowDimension ?? SOURCE_DIMENSION)}
                selectedRow={state.selectedRow}
                onSelectRow={(row) => apply({ selectedRow: row })}
                markRow={markRow}
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
