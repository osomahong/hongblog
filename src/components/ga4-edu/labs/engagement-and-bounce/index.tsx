"use client";

/**
 * 초급 3번: 참여율과 이탈률을 같이 읽기.
 *
 * 참여율이 가장 낮은 줄을 먼저 고르게 한 뒤, 맞춤설정으로 이탈률 열을 직접 붙이고
 * 그 순서로 다시 정렬한다. 이탈률 1위가 그대로 고쳐야 할 곳은 아니라는 것을
 * 학습자가 표에서 스스로 확인하게 만든다.
 */

import { useEffect, useState } from "react";
import { Ga4Shell, Ga4OtherReport, reportTitleOf } from "../../app/Ga4Shell";
import { Ga4ReportTable } from "../../app/Ga4ReportTable";
import { Ga4CustomizePanel } from "../../app/Ga4CustomizePanel";
import { RingProvider, Ga4Guide } from "../../app/tour";
import { Ga4Insights } from "../../app/Ga4Insights";
import { INITIAL_STATE, type Ga4State, type TourStep, type DateRangeKey } from "../../app/types";
import { useStepEngine } from "../../lab/useStepEngine";
import {
  ACCOUNT_NAME,
  PROPERTY_NAME,
  SEARCH_HINT,
  DIMENSION_OPTIONS,
  buildColumns,
  buildRows,
  metricChoices,
  availableMetrics,
  LOWEST_ENGAGEMENT_PAGE,
  WORTH_FIXING_PAGE,
} from "./data";

const LAB_ID = "engagement-rate-and-bounce";
const LAB_TITLE = "참여율과 이탈률을 같이 읽기";

/** 이 편은 기간을 건드리지 않는다. 콘텐츠 점검의 기본값인 28일로 열어 둔다 */
const START_STATE: Ga4State = {
  ...INITIAL_STATE,
  dateRange: "28d",
  dimension: "landingPage",
  sortKey: "sessions",
  customizeOpen: false,
  addedMetrics: [],
};

const hasBounce = (s: Ga4State) => (s.addedMetrics ?? []).includes("bounceRate");

/* ===================== 스텝 ===================== */

const STEPS: TourStep<Ga4State>[] = [
  {
    id: "open_report",
    instruction: "왼쪽 메뉴에서 빨간 상자가 그려진 방문 페이지를 누릅니다.",
    ring: "report:landing-page",
    isDone: (s) => s.report === "landing-page",
  },
  {
    id: "pick_lowest_engagement",
    instruction: "표에서 참여율이 가장 낮은 방문 페이지를 찾아 그 줄을 눌러 봅니다.",
    ring: null,
    reset: { selectedRow: null },
    isDone: (s) => s.selectedRow === LOWEST_ENGAGEMENT_PAGE,
    isMiss: (s) => s.selectedRow !== null && s.selectedRow !== LOWEST_ENGAGEMENT_PAGE,
    missText: "세션수가 아니라 참여율 칸의 값을 확인합니다. 그 칸에서 가장 작은 값이 있는 줄입니다.",
  },
  {
    id: "open_customize",
    instruction: "이탈률 열을 붙여 봅니다. 오른쪽 위 연필 모양을 누릅니다.",
    ring: "customize-btn",
    reset: { selectedRow: null },
    isDone: (s) => s.customizeOpen === true,
  },
  {
    id: "add_bounce_rate",
    instruction: "측정항목 추가에서 이탈률을 고른 다음 적용까지 마칩니다.",
    // 아직 고르지 않았으면 추가 단추를, 고른 뒤에는 적용 단추를 가리킨다
    ring: (s) =>
      !hasBounce(s)
        ? s.openMenu === "dimension"
          ? "metric-option:bounceRate"
          : "metric-add"
        : "customize-apply",
    isDone: (s) => hasBounce(s) && s.customizeOpen === false,
  },
  {
    id: "sort_bounce_rate",
    instruction: "표 오른쪽 끝에 붙은 이탈률이라는 글자를 눌러 그 순서로 다시 놓습니다.",
    ring: "metric:bounceRate",
    reset: { selectedRow: null },
    isDone: (s) => s.sortKey === "bounceRate",
  },
  {
    id: "pick_worth_fixing",
    instruction: "이탈률이 높은 줄 가운데 실제로 고쳐야 할 방문 페이지를 골라 봅니다.",
    ring: null,
    reset: { selectedRow: null },
    isDone: (s) => s.selectedRow === WORTH_FIXING_PAGE,
    isMiss: (s) => s.selectedRow !== null && s.selectedRow !== WORTH_FIXING_PAGE,
    missText:
      "맨 윗줄은 배송 상태만 확인하고 나가는 화면이라 이탈률이 높은 것이 정상입니다. 여러 화면을 둘러봐야 하는 페이지 가운데 이탈률이 높은 줄을 찾습니다.",
  },
];

const DONE_TEXT =
  "여름 기획전은 이탈률 58.20%로 두 번째입니다. 맨 위 주문 조회는 73.58%로 더 높지만 배송 상태만 확인하고 나가는 화면이라 이 숫자가 정상입니다. 반대로 기획전은 상품을 여러 개 둘러보라고 만든 화면인데 절반 넘게 첫 화면에서 나갑니다. 세션도 5,930회로 두 번째로 많아, 참여율을 60%까지만 올려도 참여 세션이 1,080회쯤 늘어납니다. 이탈률은 숫자만 보지 않고 그 화면이 무엇을 하라고 만든 화면인지와 함께 읽습니다.";

/* ===================== 화면 ===================== */

export default function EngagementAndBounceLab() {
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

  const added = state.addedMetrics ?? [];
  const columns = buildColumns(added);
  const rows = buildRows(state.dateRange, state.sortKey, added);

  /* 맞춤설정 패널은 적용을 눌러야 표에 반영된다. 고르는 동안에는 목록만 바뀐다 */
  const panel = state.customizeOpen ? (
    <Ga4CustomizePanel
      metrics={metricChoices(added)}
      available={availableMetrics(added)}
      addMenuOpen={state.openMenu === "dimension"}
      onToggleAddMenu={() =>
        apply({ openMenu: state.openMenu === "dimension" ? null : "dimension" })
      }
      onAddMetric={(key) => apply({ addedMetrics: [...added, key], openMenu: null })}
      onRemoveMetric={(key) => apply({ addedMetrics: added.filter((k) => k !== key) })}
      onApply={() => apply({ customizeOpen: false, openMenu: null })}
      onClose={() => apply({ customizeOpen: false, openMenu: null })}
    />
  ) : null;

  return (
    <RingProvider value={ring}>
      <div
        className={`ga4-stage${pinned ? " ga4-stage-pinned" : ""}${
          state.customizeOpen ? " ga4-stage-panel" : ""
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
          onOpenCustomize={() => apply({ customizeOpen: true })}
          customizePanel={panel}
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
              onSelectRow={(name) => apply({ selectedRow: name })}
              markRow={done ? WORTH_FIXING_PAGE : null}
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
    { label: "지난 28일 참여 세션", value: "12,900", delta: "+4.8%" },
    { label: "지난 28일 참여율", value: "51.07%", delta: "-2.3%" },
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
