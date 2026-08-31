"use client";

/**
 * 초급 2번: 페이지 및 화면 보고서에서 조회수 상위 콘텐츠 찾기.
 *
 * 앞부분에서 경로 기준 1위를 고르게 하고, 측정기준을 제목으로 바꾼 뒤 같은 표를 다시 읽게 한다.
 * 세 주소로 나뉘어 있던 상품 상세가 한 줄로 합쳐지면서 1위가 바뀐다.
 * 마지막에는 사용자당 조회수로 정렬해, 비율이 가장 높은 줄이 늘 답은 아니라는 것을 보게 한다.
 */

import { useEffect, useState } from "react";
import { Ga4Shell, Ga4OtherReport, reportTitleOf } from "../../app/Ga4Shell";
import { Ga4ReportTable } from "../../app/Ga4ReportTable";
import { Ga4LineCard, Ga4BarCard } from "../../app/Ga4Charts";
import { RingProvider, Ga4Guide } from "../../app/tour";
import { Ga4Insights } from "../../app/Ga4Insights";
import { INITIAL_STATE, type Ga4State, type TourStep, type DateRangeKey } from "../../app/types";
import { useStepEngine } from "../../lab/useStepEngine";
import {
  ACCOUNT_NAME,
  PROPERTY_NAME,
  SEARCH_HINT,
  DIMENSION_OPTIONS,
  PATH_DIMENSION,
  TITLE_DIMENSION,
  buildColumns,
  buildRows,
  buildSeries,
  buildBarItems,
  buildXLabels,
  TOP_PATH,
  TOP_TITLE,
  REPEAT_TITLE,
} from "./data";

const LAB_ID = "page-and-screen-report";
const LAB_TITLE = "페이지 및 화면 보고서에서 조회수 상위 콘텐츠 찾기";

/** 이 편은 기간을 변경하지 않는다. 콘텐츠 점검의 기본값인 28일로 열어 둔다 */
const START_STATE: Ga4State = {
  ...INITIAL_STATE,
  dateRange: "28d",
  dimension: PATH_DIMENSION,
  sortKey: "views",
};

/* ===================== 스텝 ===================== */

const STEPS: TourStep<Ga4State>[] = [
  {
    id: "open_report",
    instruction: "왼쪽 메뉴에서 빨간 상자가 그려진 페이지 및 화면을 누릅니다.",
    ring: "report:page-and-screen",
    isDone: (s) => s.report === "page-and-screen",
  },
  {
    id: "pick_top_path",
    instruction: "표에서 조회수가 가장 많은 페이지를 찾아 그 줄을 눌러 봅니다.",
    ring: null,
    reset: { selectedRow: null },
    isDone: (s) => s.selectedRow === TOP_PATH,
    isMiss: (s) => s.selectedRow !== null && s.selectedRow !== TOP_PATH,
    missText: "지금 표는 조회수가 많은 순서로 놓여 있습니다. 맨 윗줄을 누릅니다.",
  },
  {
    id: "open_dimension_menu",
    instruction: "표 왼쪽 위에 적힌 페이지 경로 및 화면 클래스를 눌러 목록을 폅니다.",
    ring: "dimension-chip",
    reset: { selectedRow: null },
    isDone: (s) => s.openMenu === "dimension",
  },
  {
    id: "pick_title_dimension",
    instruction: "펼쳐진 목록에서 페이지 제목 및 화면 클래스를 고릅니다.",
    // 목록을 닫아 버린 학습자에게는 다시 측정기준 이름을 가리킨다
    ring: (s) => (s.openMenu === "dimension" ? `dimension:${TITLE_DIMENSION}` : "dimension-chip"),
    isDone: (s) => s.dimension === TITLE_DIMENSION && s.openMenu === null,
  },
  {
    id: "pick_merged_top",
    instruction: "제목으로 묶인 표에서 조회수가 가장 많은 콘텐츠를 골라 봅니다.",
    ring: null,
    reset: { selectedRow: null },
    isDone: (s) => s.selectedRow === TOP_TITLE,
    isMiss: (s) => s.selectedRow !== null && s.selectedRow !== TOP_TITLE,
    missText: "조금 전 경로로 볼 때 1위였던 줄이 지금도 1위는 아닙니다. 맨 윗줄을 다시 확인합니다.",
  },
  {
    id: "pick_repeat_page",
    instruction:
      "사용자당 조회수라는 글자를 눌러 정렬한 뒤, 조회수 1,000을 넘는 줄 가운데 사용자당 조회수가 가장 높은 콘텐츠를 골라 봅니다.",
    ring: (s) => (s.sortKey === "viewsPerUser" ? null : "metric:viewsPerUser"),
    reset: { selectedRow: null },
    isDone: (s) => s.sortKey === "viewsPerUser" && s.selectedRow === REPEAT_TITLE,
    isMiss: (s) =>
      s.sortKey === "viewsPerUser" && s.selectedRow !== null && s.selectedRow !== REPEAT_TITLE,
    missText:
      "맨 윗줄은 사용자당 조회수가 가장 높지만 조회수가 340뿐입니다. 조회수 1,000을 넘는 줄만 놓고 다시 고릅니다.",
  },
];

const DONE_TEXT =
  "주문 조회는 조회수가 1,980으로 다섯 번째인데 사용자당 조회수는 3.19입니다. 한 사람이 평균 세 번 넘게 같은 화면을 다시 본다는 뜻이라, 배송 상태를 한 번에 알기 어렵다는 신호로 읽습니다. 상품 상세는 경로로 볼 때 세 주소로 나뉘어 각각 3,000회 안팎이라 1위가 홈처럼 보였지만, 제목으로 묶으면 8,810회로 홈 8,420회를 넘습니다. 무엇을 1등으로 부를지는 묶는 기준이 정합니다.";

/* ===================== 화면 ===================== */

export default function PageAndScreenLab() {
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

  const columns = buildColumns(state.dimension, state.dateRange);
  const rows = buildRows(state.dimension, state.dateRange, state.sortKey);
  const dimensionLabel =
    DIMENSION_OPTIONS.find((d) => d.key === state.dimension)?.label ?? DIMENSION_OPTIONS[0].label;
  const reportTitle =
    state.report === "page-and-screen"
      ? `페이지 및 화면: ${dimensionLabel}`
      : reportTitleOf(state.report);

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
          reportTitle={reportTitle}
          onOpenReport={(id) => apply({ report: id, openMenu: null })}
          onToggleMenu={(menu) => apply({ openMenu: menu })}
          onPickDate={(key: DateRangeKey) => apply({ dateRange: key, openMenu: null })}
        >
          {state.report === "page-and-screen" ? (
            <>
              <div className="ga4-chartrow">
                <Ga4LineCard
                  title={`시간 경과에 따른 ${dimensionLabel}별 조회수`}
                  series={buildSeries(state.dimension, state.dateRange)}
                  xLabels={buildXLabels(state.dateRange)}
                />
                <Ga4BarCard
                  title={`${dimensionLabel}별 조회수`}
                  items={buildBarItems(state.dimension, state.dateRange)}
                />
              </div>

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
                markRow={done ? REPEAT_TITLE : null}
              />
            </>
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
    { label: "지난 28일 사용자", value: "9,840", delta: "+8.6%" },
    { label: "지난 28일 조회수", value: "29,070", delta: "+11.2%" },
    { label: "지난 28일 이벤트 수", value: "97,660", delta: "+7.4%" },
    { label: "지난 28일 주요 이벤트", value: "894", delta: "+2.1%" },
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
