"use client";

/**
 * 초급 5번: 랜딩 페이지 보고서에서 유입 후 첫 화면 확인하기.
 *
 * 전체 표만 보면 광고 도착 화면의 문제가 보이지 않는다.
 * 비교를 걸어 Paid Search만 떼어 놓으면 같은 페이지가 전혀 다르게 읽힌다.
 */

import { useEffect, useState } from "react";
import { Ga4Shell, Ga4OtherReport, reportTitleOf } from "../../app/Ga4Shell";
import { Ga4ReportTable } from "../../app/Ga4ReportTable";
import { Ga4ComparisonPanel } from "../../app/Ga4ComparisonPanel";
import { RingProvider, Ga4Guide } from "../../app/tour";
import { Ga4Insights } from "../../app/Ga4Insights";
import { INITIAL_STATE, type Ga4State, type TourStep, type DateRangeKey } from "../../app/types";
import { useStepEngine } from "../../lab/useStepEngine";
import {
  ACCOUNT_NAME,
  PROPERTY_NAME,
  SEARCH_HINT,
  PAID_SEARCH,
  DIMENSION_OPTIONS,
  COMPARISON_DIMENSIONS,
  COMPARISON_VALUES,
  buildColumns,
  buildRows,
  rowKey,
  PAID_TOP_PAGE,
  PAID_BEST_PAGE,
} from "./data";

const LAB_ID = "landing-page-report";
const LAB_TITLE = "랜딩 페이지 보고서에서 유입 후 첫 화면 확인하기";
const CHANNEL_DIMENSION = "sessionDefaultChannelGroup";

const START_STATE: Ga4State = {
  ...INITIAL_STATE,
  dateRange: "28d",
  dimension: "landingPage",
  sortKey: "sessions",
  comparisonOpen: false,
  comparisonDimension: null,
  comparisonValue: null,
  comparisonApplied: false,
  comparisonList: null,
};

/* ===================== 스텝 ===================== */

const STEPS: TourStep<Ga4State>[] = [
  {
    id: "open_report",
    instruction: "왼쪽 메뉴에서 빨간 상자가 그려진 방문 페이지를 누릅니다.",
    ring: "report:landing-page",
    isDone: (s) => s.report === "landing-page",
  },
  {
    id: "open_comparison",
    instruction: "채널별로 나눠 봅니다. 표 위쪽 비교 추가를 누릅니다.",
    ring: "comparison-add",
    isDone: (s) => s.comparisonOpen === true,
  },
  {
    id: "pick_dimension",
    instruction: "측정기준에서 세션 기본 채널 그룹을 고릅니다.",
    // 목록을 닫아 버린 학습자에게는 다시 측정기준 칸을 가리킨다
    ring: (s) =>
      s.comparisonList === "dimension" ? `cmp-dim:${CHANNEL_DIMENSION}` : "cmp-dimension",
    isDone: (s) => s.comparisonDimension === CHANNEL_DIMENSION,
  },
  {
    id: "pick_value_apply",
    instruction: "값에서 Paid Search를 고른 다음 적용까지 마칩니다.",
    ring: (s) =>
      s.comparisonValue !== PAID_SEARCH
        ? s.comparisonList === "value"
          ? `cmp-val:${PAID_SEARCH}`
          : "cmp-value"
        : "cmp-apply",
    isDone: (s) => s.comparisonApplied === true && s.comparisonOpen === false,
  },
  {
    id: "pick_paid_top",
    instruction: "표가 두 벌로 나뉘었습니다. Paid Search 줄 가운데 세션수가 가장 많은 도착 화면을 골라 봅니다.",
    ring: null,
    reset: { selectedRow: null },
    isDone: (s) => s.selectedRow === rowKey(PAID_SEARCH, PAID_TOP_PAGE),
    isMiss: (s) => s.selectedRow !== null && s.selectedRow !== rowKey(PAID_SEARCH, PAID_TOP_PAGE),
    missText:
      "왼쪽 비교 칸이 Paid Search라고 적힌 줄만 놓고 비교합니다. 모든 사용자 줄에는 광고 밖에서 온 세션이 섞여 있습니다.",
  },
  {
    id: "pick_paid_best",
    instruction:
      "같은 Paid Search 줄 가운데, 세션수는 훨씬 적은데 주요 이벤트는 더 많은 도착 화면을 골라 봅니다.",
    ring: null,
    reset: { selectedRow: null },
    isDone: (s) => s.selectedRow === rowKey(PAID_SEARCH, PAID_BEST_PAGE),
    isMiss: (s) => s.selectedRow !== null && s.selectedRow !== rowKey(PAID_SEARCH, PAID_BEST_PAGE),
    missText:
      "세션수가 아니라 주요 이벤트 칸을 확인합니다. Paid Search 줄에서 주요 이벤트가 가장 많은 도착 화면입니다.",
  },
];

const DONE_TEXT =
  "/product/detail/1042는 Paid Search 세션이 640회인데 주요 이벤트가 68회입니다. 광고를 가장 많이 받은 /event/summer는 세션 3,180회에 주요 이벤트가 11회입니다. 세션당으로 보면 0.1062와 0.0035로 서른 배 차이입니다. 지금 여름 기획전으로 보내는 3,180회를 상품 상세와 같은 비율로 바꾸면 주요 이벤트가 338회쯤 됩니다. 전체 표에서는 여름 기획전의 주요 이벤트가 96회라 문제로 보이지 않았습니다. 광고 성과는 비교를 걸어 그 채널만 떼어 놓고 봐야 드러납니다.";

/* ===================== 화면 ===================== */

export default function LandingPageLab() {
  const { state, stepIndex, miss, done, step, ring, apply, restart } = useStepEngine<Ga4State>({
    labId: LAB_ID,
    labTitle: LAB_TITLE,
    initialState: START_STATE,
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

  const applied = state.comparisonApplied === true;
  const columns = buildColumns(state.dateRange);
  const rows = buildRows(state.dateRange, state.sortKey, applied);

  const panel = state.comparisonOpen ? (
    <Ga4ComparisonPanel
      dimensions={COMPARISON_DIMENSIONS}
      values={state.comparisonDimension ? (COMPARISON_VALUES[state.comparisonDimension] ?? []) : []}
      dimension={state.comparisonDimension ?? null}
      value={state.comparisonValue ?? null}
      openList={state.comparisonList ?? null}
      onToggleList={(list) => apply({ comparisonList: list })}
      onPickDimension={(key) =>
        apply({ comparisonDimension: key, comparisonValue: null, comparisonList: null })
      }
      onPickValue={(value) => apply({ comparisonValue: value, comparisonList: null })}
      onApply={() =>
        apply({ comparisonApplied: true, comparisonOpen: false, comparisonList: null })
      }
      onClose={() => apply({ comparisonOpen: false, comparisonList: null })}
    />
  ) : null;

  return (
    <RingProvider value={ring}>
      <div
        className={`ga4-stage${pinned ? " ga4-stage-pinned" : ""}${
          state.comparisonOpen ? " ga4-stage-panel" : ""
        }`}
      >
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
          onOpenComparison={() => apply({ comparisonOpen: true })}
          comparisonChip={applied ? `${PAID_SEARCH}` : null}
          comparisonPanel={panel}
        >
          {state.report === "landing-page" ? (
            <Ga4ReportTable
              dimension={state.dimension}
              dimensionOptions={DIMENSION_OPTIONS}
              dimensionMenuOpen={false}
              onToggleDimensionMenu={() => undefined}
              onPickDimension={(key) => apply({ dimension: key })}
              columns={columns}
              rows={rows}
              sortKey={state.sortKey}
              onSort={(key) => apply({ sortKey: key })}
              selectedRow={state.selectedRow}
              onSelectRow={(key) => apply({ selectedRow: key })}
              markRow={done ? rowKey(PAID_SEARCH, PAID_BEST_PAGE) : null}
              showComparison={applied}
            />
          ) : state.report === "reports-overview" ? (
            <ReportsOverview />
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

/** 시작 화면. 실제 GA4 보고서 개요처럼 요약 카드와 통계 카드를 깔아 둔다 */
function ReportsOverview() {
  const cards = [
    { label: "지난 28일 사용자", value: "19,700", delta: "+6.2%" },
    { label: "지난 28일 세션", value: "25,260", delta: "+9.4%" },
    { label: "지난 28일 주요 이벤트", value: "405", delta: "+3.6%" },
    { label: "지난 28일 광고 세션", value: "5,610", delta: "+18.4%" },
  ];
  return (
    <>
      <div className="ga4-overview">
        {cards.map((c) => (
          <div key={c.label} className="ga4-overview-card">
            <p className="ga4-overview-label">{c.label}</p>
            <p className="ga4-overview-value">{c.value}</p>
            <p
              className={`ga4-overview-delta${c.delta.startsWith("-") ? " ga4-overview-delta-down" : ""}`}
            >
              {c.delta}
            </p>
          </div>
        ))}
      </div>
      <Ga4Insights />
    </>
  );
}

