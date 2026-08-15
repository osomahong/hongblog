"use client";

/**
 * 초급 8번: 이벤트 보고서에서 자동 수집 이벤트 확인하기.
 *
 * 상위 다섯 줄이 전부 GA4가 알아서 보내는 이벤트라는 것을 표에서 직접 확인하게 하고,
 * 우리가 심은 이벤트만 골라 읽는 순서를 익히게 한다.
 * 마지막에는 사용자당 이벤트 수로 정렬해, 이벤트 수가 많은 것과 한 사람이 되풀이하는 것이
 * 서로 다른 이야기라는 것을 보게 만든다.
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
  TOP_EVENT,
  ONCE_PER_USER_EVENT,
  OUR_TOP_EVENT,
  OUR_ONCE_EVENT,
} from "./data";

const LAB_ID = "automatic-events";
const LAB_TITLE = "이벤트 보고서에서 자동 수집 이벤트 확인하기";

/** 이 편은 기간을 건드리지 않는다. 이벤트 점검의 기본값인 28일로 열어 둔다 */
const START_STATE: Ga4State = {
  ...INITIAL_STATE,
  dateRange: "28d",
  dimension: "eventName",
  sortKey: "events",
};

/* ===================== 스텝 ===================== */

const STEPS: TourStep<Ga4State>[] = [
  {
    id: "open_report",
    instruction: "왼쪽 메뉴에서 빨간 상자가 그려진 이벤트를 누릅니다.",
    ring: "report:events",
    isDone: (s) => s.report === "events",
  },
  {
    id: "pick_top_event",
    instruction: "표에서 이벤트 수가 가장 많은 이벤트를 찾아 그 줄을 눌러 봅니다.",
    ring: null,
    reset: { selectedRow: null },
    isDone: (s) => s.selectedRow === TOP_EVENT,
    isMiss: (s) => s.selectedRow !== null && s.selectedRow !== TOP_EVENT,
    missText: "지금 표는 이벤트 수가 많은 순서로 놓여 있습니다. 맨 윗줄을 누릅니다.",
  },
  {
    id: "pick_once_per_user",
    instruction: "이벤트 수 칸과 총 사용자 칸에 같은 값이 찍힌 이벤트를 골라 봅니다.",
    ring: null,
    reset: { selectedRow: null },
    isDone: (s) => s.selectedRow === ONCE_PER_USER_EVENT,
    isMiss: (s) => s.selectedRow !== null && s.selectedRow !== ONCE_PER_USER_EVENT,
    missText: "두 칸에 똑같은 값이 찍힌 줄은 하나뿐입니다. 숫자를 나란히 견주며 내려갑니다.",
  },
  {
    id: "pick_our_top",
    instruction:
      "우리가 심지 않으면 생기지 않는 이벤트 가운데 이벤트 수가 가장 많은 것을 골라 봅니다.",
    ring: null,
    reset: { selectedRow: null },
    isDone: (s) => s.selectedRow === OUR_TOP_EVENT,
    isMiss: (s) => s.selectedRow !== null && s.selectedRow !== OUR_TOP_EVENT,
    missText:
      "scroll과 click은 향상된 측정을 켜 두면 코드를 넣지 않아도 들어옵니다. 그 둘을 빼고 다시 고릅니다.",
  },
  {
    id: "sort_per_user",
    instruction: "표 오른쪽 끝 사용자당 이벤트 수라는 글자를 눌러 그 순서로 다시 놓습니다.",
    ring: "metric:eventsPerUser",
    reset: { selectedRow: null },
    isDone: (s) => s.sortKey === "eventsPerUser",
  },
  {
    id: "pick_our_once",
    instruction: "우리가 심은 이벤트 가운데 한 사람이 가장 적게 일으킨 것을 골라 봅니다.",
    ring: null,
    reset: { selectedRow: null },
    isDone: (s) => s.selectedRow === OUR_ONCE_EVENT,
    isMiss: (s) => s.selectedRow !== null && s.selectedRow !== OUR_ONCE_EVENT,
    missText:
      "우리가 심은 이벤트는 add_to_cart, view_item, purchase 셋입니다. 그 셋만 놓고 다시 고릅니다.",
  },
];

const DONE_TEXT = `purchase는 사용자당 ${FACTS.purchasePerUser}회입니다. 산 사람 ${FACTS.purchaseUsers}명이 거의 한 번씩만 샀다는 뜻이라, 다시 사러 오는 사람이 드뭅니다. 앞 단계인 add_to_cart는 ${FACTS.cartUsers}명이 사용자당 ${FACTS.cartPerUser}회 담았습니다. 담은 사람과 산 사람 사이가 크게 벌어져 있어 장바구니 화면부터 확인합니다. 이벤트 표의 위쪽 다섯 줄은 우리가 심은 것이 아닙니다. GA4를 붙이기만 하면 들어오거나 향상된 측정이 보내는 이벤트입니다. 그래서 이벤트 표는 위에서부터 읽지 않고, 우리가 심은 이름부터 찾아 내려갑니다.`;

/* ===================== 화면 ===================== */

export default function AutomaticEventsLab() {
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
          {state.report === "events" ? (
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
              markRow={done ? OUR_ONCE_EVENT : null}
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
    { label: "지난 28일 이벤트 수", value: "97,660", delta: "+7.4%" },
    { label: "지난 28일 주요 이벤트", value: "894", delta: "+2.1%" },
    { label: "지난 28일 첫 방문", value: "3,510", delta: "+9.8%" },
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
