"use client";

/**
 * 초급 9번: 신규 사용자와 재사용자 구분해서 보기.
 *
 * 지난 28일 표에서 재사용자가 주요 이벤트의 대부분을 만든다는 것을 먼저 확인시킨 뒤,
 * 기간을 지난 7일로 좁혀 같은 표를 다시 읽게 한다. 1위가 신규로 바뀐다.
 * 재방문은 시간이 지나야 잡힌다는 것을 학습자가 표에서 직접 보게 만든다.
 */

import { useEffect, useState } from "react";
import { Ga4Shell, Ga4OtherReport, reportTitleOf } from "../../app/Ga4Shell";
import { Ga4ReportTable } from "../../app/Ga4ReportTable";
import { RingProvider, Ga4Guide } from "../../app/tour";
import { Ga4Insights } from "../../app/Ga4Insights";
import { INITIAL_STATE, type Ga4State, type TourStep, type DateRangeKey } from "../../app/types";
import { useStepEngine } from "../../lab/useStepEngine";
import {
  ACCOUNT_NAME,
  PROPERTY_NAME,
  SEARCH_HINT,
  DIMENSION_OPTIONS,
  FACTS,
  buildColumns,
  buildRows,
  TOP_SESSION_TYPE,
  NOT_SET_TYPE,
  TOP_KEY_EVENT_TYPE,
  SHORT_RANGE_TOP_TYPE,
} from "./data";

const LAB_ID = "new-vs-returning";
const LAB_TITLE = "신규 사용자와 재사용자 구분해서 보기";

/** 유지 보고서를 지난 28일로 열어 둔다 */
const START_STATE: Ga4State = {
  ...INITIAL_STATE,
  dateRange: "28d",
  dimension: "newVsReturning",
  sortKey: "sessions",
};

/* ===================== 스텝 ===================== */

const STEPS: TourStep<Ga4State>[] = [
  {
    id: "open_report",
    instruction: "왼쪽 메뉴에서 빨간 상자가 그려진 유지를 누릅니다.",
    ring: "report:retention",
    isDone: (s) => s.report === "retention",
  },
  {
    id: "pick_top_session",
    instruction: "표에서 세션수가 가장 많은 유형을 찾아 그 줄을 눌러 봅니다.",
    ring: null,
    reset: { selectedRow: null },
    isDone: (s) => s.selectedRow === TOP_SESSION_TYPE,
    isMiss: (s) => s.selectedRow !== null && s.selectedRow !== TOP_SESSION_TYPE,
    missText: "지금 표는 세션수가 많은 순서로 놓여 있습니다. 맨 윗줄을 누릅니다.",
  },
  {
    id: "pick_not_set",
    instruction: "신규도 재사용자도 아닌 줄이 하나 있습니다. 그 줄을 골라 봅니다.",
    ring: null,
    reset: { selectedRow: null },
    isDone: (s) => s.selectedRow === NOT_SET_TYPE,
    isMiss: (s) => s.selectedRow !== null && s.selectedRow !== NOT_SET_TYPE,
    missText: "new와 returning 말고 이름 자리에 값이 붙지 않은 줄이 있습니다.",
  },
  {
    id: "sort_key_events",
    instruction: "표 오른쪽 끝 주요 이벤트라는 글자를 눌러 그 순서로 다시 놓습니다.",
    ring: "metric:keyEvents",
    reset: { selectedRow: null },
    isDone: (s) => s.sortKey === "keyEvents",
  },
  {
    id: "pick_key_event_top",
    instruction: "세션수는 적은데 주요 이벤트는 가장 많은 유형을 골라 봅니다.",
    ring: null,
    reset: { selectedRow: null },
    isDone: (s) => s.selectedRow === TOP_KEY_EVENT_TYPE,
    isMiss: (s) => s.selectedRow !== null && s.selectedRow !== TOP_KEY_EVENT_TYPE,
    missText: "세션수 순서와 주요 이벤트 순서가 서로 어긋납니다. 지금은 주요 이벤트 칸을 봅니다.",
  },
  {
    id: "narrow_to_7d",
    instruction:
      "기간을 지난 7일로 좁힌 다음, 그 표에서 주요 이벤트가 가장 많은 유형을 골라 봅니다.",
    // 기간을 아직 바꾸지 않았으면 기간 표시를, 목록이 열려 있으면 지난 7일을 가리킨다
    ring: (s) => {
      if (s.dateRange !== "7d") return s.openMenu === "date" ? "date-7d" : "date-chip";
      return null;
    },
    reset: { selectedRow: null },
    isDone: (s) => s.dateRange === "7d" && s.selectedRow === SHORT_RANGE_TOP_TYPE,
    isMiss: (s) =>
      s.dateRange === "7d" && s.selectedRow !== null && s.selectedRow !== SHORT_RANGE_TOP_TYPE,
    missText: "기간을 좁히자 순서가 바뀌었습니다. 28일 표에서 1위였던 줄이 지금도 1위는 아닙니다.",
  },
];

const DONE_TEXT = `지난 28일로 보면 재사용자가 세션 ${FACTS.returningSessions28}회로 신규 ${FACTS.newSessions28}회의 절반 남짓인데, 주요 이벤트는 ${FACTS.returningKey28}회로 전체의 ${FACTS.returningShare28}를 만듭니다. 그런데 지난 7일로 좁히면 신규 ${FACTS.newKey7}회가 재사용자 ${FACTS.returningKey7}회를 앞섭니다. 재방문은 시간이 지나야 잡히기 때문입니다. 오늘 들어온 신규는 다음 주에야 재사용자로 셉니다. 그래서 재사용자의 몫을 볼 때는 기간을 짧게 두지 않습니다.`;

/* ===================== 화면 ===================== */

export default function NewVsReturningLab() {
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

  const columns = buildColumns(state.dateRange);
  const rows = buildRows(state.dateRange, state.sortKey);

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
          {state.report === "retention" ? (
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
              onSelectRow={(name) => apply({ selectedRow: name })}
              markRow={done ? SHORT_RANGE_TOP_TYPE : null}
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
    { label: "지난 28일 사용자", value: "9,840", delta: "+8.6%" },
    { label: "지난 28일 신규 사용자", value: "6,310", delta: "+11.4%" },
    { label: "지난 28일 재사용자", value: "3,530", delta: "+3.2%" },
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
