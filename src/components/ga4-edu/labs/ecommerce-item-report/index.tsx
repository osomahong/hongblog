"use client";

/**
 * 심화 10번: 이커머스 항목 보고서에서 상품 성과 나누기.
 *
 * 자유 형식에 항목 이름을 놓고 조회, 장바구니, 구매를 나란히 본다. 조회수 순위와 구매 순위가
 * 어긋나는 상품을 찾고, 카테고리로 묶으면 그 차이가 평균에 섞이는 것까지 확인한다.
 *
 * 항목 범위 측정항목은 세션 단위가 아니라 상품 단위로 센다는 점이 이 편의 바탕이다.
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
  ITEM_DIMENSION,
  CATEGORY_DIMENSION,
  dimensionLabel,
  buildMetrics,
  keysFor,
  cellValues,
  totalValues,
  WEAK_ITEM,
  DECOY_ITEM,
  BEST_ITEM,
} from "./data";

const LAB_ID = "ecommerce-item-report";
const LAB_TITLE = "이커머스 항목 보고서에서 상품 성과 나누기";

/** 조회와 구매가 값에 놓인 상태로 시작한다 */
const START_STATE: Ga4ExploreState = {
  ...INITIAL_EXPLORE_STATE,
  values: ["itemsViewed", "itemsPurchased"],
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
    id: "drop_item",
    instruction: "왼쪽 측정기준의 항목 이름을 집어 탭 설정의 행 칸에 놓습니다.",
    ring: (s) => (s.held?.key === ITEM_DIMENSION ? "slot:rows" : `var:${ITEM_DIMENSION}`),
    isDone: (s) => s.rows[0] === ITEM_DIMENSION,
  },
  {
    id: "drop_cart_rate",
    instruction:
      "조회와 구매만으로는 어디서 막히는지 모릅니다. 조회 대비 장바구니 추가 비율을 값 칸에 놓습니다.",
    ring: (s) => (s.held?.key === "cartToViewRate" ? "slot:values" : "var:cartToViewRate"),
    isDone: (s) => s.values.includes("cartToViewRate"),
  },
  {
    id: "find_weak",
    instruction:
      "조회는 많은데 장바구니로 가는 비율이 가장 낮은 상품 줄을 누릅니다.",
    ring: null,
    isDone: (s) => s.selectedRow === WEAK_ITEM,
    isMiss: (s) => s.selectedRow !== null && s.selectedRow !== WEAK_ITEM,
    missText: `${DECOY_ITEM}은 조회수가 가장 많지만 장바구니 비율은 14.73%로 나쁘지 않습니다. 마지막 열이 가장 낮은 줄을 찾아보세요.`,
    reset: { selectedRow: null },
  },
  {
    id: "swap_category",
    instruction:
      "행을 항목 카테고리로 바꿔, 상품별 차이가 묶었을 때 어떻게 보이는지 확인합니다.",
    ring: (s) =>
      s.rows.length === 0
        ? s.held?.key === CATEGORY_DIMENSION
          ? "slot:rows"
          : `var:${CATEGORY_DIMENSION}`
        : "slot:rows",
    isDone: (s) => s.rows[0] === CATEGORY_DIMENSION,
    reset: { selectedRow: null },
  },
];

const DONE_TEXT = `${WEAK_ITEM}은 조회 5,240회에 장바구니 320회로 6.11%에 그칩니다. 조회가 더 적은 ${BEST_ITEM}이 구매 412건으로 가장 많은 것과 견주면, 조회수만 보고 노출을 늘릴 자리가 아니라는 것이 드러납니다. 카테고리로 묶으면 신발 한 줄에 이 상품 하나만 들어가 문제가 그대로 드러나지만, 의류처럼 상품이 여럿인 카테고리에서는 잘 팔리는 상품이 평균을 끌어올려 가려집니다.`;

export default function EcommerceItemReportLab() {
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
                cell={(row) => cellValues(rowDimension ?? ITEM_DIMENSION, row)}
                total={() => totalValues(rowDimension ?? ITEM_DIMENSION)}
                selectedRow={state.selectedRow}
                onSelectRow={(row) => apply({ selectedRow: row })}
                markRow={
                  stepIndex === 3 && rowDimension === ITEM_DIMENSION ? WEAK_ITEM : null
                }
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
