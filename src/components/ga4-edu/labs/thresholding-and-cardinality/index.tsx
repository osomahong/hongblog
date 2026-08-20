"use client";

/**
 * 심화 3번: 데이터 기준 적용과 카디널리티 흔적 찾기.
 *
 * 페이지 경로로 열린 표에서는 아무 일도 없지만, 측정기준을 회원 번호로 바꾸면
 * (other) 한 줄이 표의 절반 넘게 차지한다. 기간을 좁히면 그 몫이 확 줄어든다.
 *
 * 데이터가 사라진 것이 아니라 표가 값을 묶는 방식이 달라진 것이라는 점이 이 편의 핵심이다.
 */

import { useEffect, useState } from "react";
import { Ga4Shell, Ga4OtherReport, reportTitleOf } from "../../app/Ga4Shell";
import { Ga4ReportTable } from "../../app/Ga4ReportTable";
import { RingProvider, Ga4Guide } from "../../app/tour";
import { INITIAL_STATE, type Ga4State, type TourStep, type DateRangeKey } from "../../app/types";
import { useStepEngine } from "../../lab/useStepEngine";
import {
  ACCOUNT_NAME,
  PROPERTY_NAME,
  SEARCH_HINT,
  DIMENSION_OPTIONS,
  PAGE_DIMENSION,
  MEMBER_DIMENSION,
  OTHER_ROW,
  DECOY_ROW,
  buildColumns,
  buildRows,
  otherShare,
} from "./data";

const LAB_ID = "thresholding-and-cardinality";
const LAB_TITLE = "데이터 기준 적용과 카디널리티 흔적 찾기";

/** 페이지 및 화면 보고서를 지난 90일로 열어 둔 상태에서 시작한다 */
const START_STATE: Ga4State = {
  ...INITIAL_STATE,
  report: "page-and-screen",
  dateRange: "90d",
  dimension: PAGE_DIMENSION,
  sortKey: "views",
};

/* ===================== 스텝 ===================== */

const STEPS: TourStep[] = [
  {
    id: "switch_member",
    instruction:
      "표 왼쪽 위 측정기준을 눌러 회원 번호로 바꿉니다. 맞춤 측정기준으로 등록해 둔 값입니다.",
    ring: (s) => (s.openMenu === "dimension" ? `dimension:${MEMBER_DIMENSION}` : "dimension-chip"),
    isDone: (s) => s.dimension === MEMBER_DIMENSION && s.openMenu === null,
  },
  {
    id: "pick_other",
    instruction: "표에서 개별 회원이 아니라 나머지를 한 줄로 묶은 줄을 누릅니다.",
    ring: null,
    isDone: (s) => s.selectedRow === OTHER_ROW,
    isMiss: (s) => s.selectedRow !== null && s.selectedRow !== OTHER_ROW,
    missText: `${DECOY_ROW}은 회원 한 명의 줄입니다. 이름이 (other)인 줄을 찾아보세요.`,
    reset: { selectedRow: null },
  },
  {
    id: "narrow_range",
    instruction:
      "기간을 지난 7일로 좁혀, 같은 측정기준에서 (other)의 몫이 어떻게 달라지는지 봅니다.",
    ring: (s) => (s.openMenu === "date" ? "date-7d" : "date-chip"),
    isDone: (s) => s.dateRange === "7d" && s.openMenu === null,
  },
  {
    id: "back_to_page",
    instruction:
      "측정기준을 페이지 경로 및 화면 클래스로 되돌려, 값의 종류가 적은 축에서는 (other)가 없다는 것을 확인합니다.",
    ring: (s) => (s.openMenu === "dimension" ? `dimension:${PAGE_DIMENSION}` : "dimension-chip"),
    isDone: (s) => s.dimension === PAGE_DIMENSION && s.openMenu === null,
    reset: { selectedRow: null },
  },
];

const DONE_TEXT = `회원 번호로 보면 지난 90일에서는 (other)가 전체 조회수의 ${otherShare("90d").toFixed(0)}%였는데, 지난 7일에서는 그 줄이 아예 없습니다. 데이터가 사라진 것이 아니라 그 기간에 나타난 값의 종류가 한도를 넘지 않아 표가 묶을 일이 없었을 뿐입니다.`;

export default function ThresholdingAndCardinalityLab() {
  const [pinned, setPinned] = useState(false);
  const { state, stepIndex, miss, done, step, ring, apply, restart } = useStepEngine<Ga4State>({
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

  const columns = buildColumns(state.dimension, state.dateRange);
  const rows = buildRows(state.dimension, state.dateRange);

  return (
    <RingProvider value={ring}>
      <div className={`ga4-stage${pinned ? " ga4-stage-pinned" : ""}`}>
        <Ga4Shell
          account={ACCOUNT_NAME}
          property={PROPERTY_NAME}
          searchHint={SEARCH_HINT}
          state={state}
          pinned={pinned}
          onTogglePin={() => setPinned((v) => !v)}
          reportTitle={reportTitleOf(state.report)}
          onOpenReport={(id) => apply({ report: id, openMenu: null })}
          onToggleMenu={(menu) => apply({ openMenu: menu })}
          onPickDate={(key: DateRangeKey) => apply({ dateRange: key, openMenu: null })}
        >
          {state.report === "page-and-screen" ? (
            <Ga4ReportTable
              dimension={state.dimension}
              dimensionOptions={DIMENSION_OPTIONS}
              dimensionMenuOpen={state.openMenu === "dimension"}
              onToggleDimensionMenu={() =>
                apply({ openMenu: state.openMenu === "dimension" ? null : "dimension" })
              }
              onPickDimension={(key) => apply({ dimension: key, openMenu: null, selectedRow: null })}
              columns={columns}
              rows={rows}
              sortKey={state.sortKey}
              onSort={(key) => apply({ sortKey: key, openMenu: null })}
              selectedRow={state.selectedRow}
              onSelectRow={(name) => apply({ selectedRow: name })}
              markRow={stepIndex >= 2 && state.dimension === MEMBER_DIMENSION ? OTHER_ROW : null}
            />
          ) : (
            <Ga4OtherReport label={reportTitleOf(state.report)} />
          )}
        </Ga4Shell>

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
