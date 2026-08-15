"use client";

/**
 * 초급 7번: 기간 선택과 이전 기간 비교 적용하기.
 *
 * 앞부분에서 기간을 28일로 맞추고 이전 기간 비교를 건다. 합계는 거의 그대로인데
 * 안에서 크게 빠진 채널을 찾게 한 다음, 비교 대상을 이전 연도로 바꿔 같은 표를 다시 읽게 한다.
 * 두 기준이 서로 다른 답을 내는 채널을 학습자가 스스로 찾아내는 것이 이 편의 목표다.
 */

import { useEffect, useState } from "react";
import { Ga4Shell, Ga4OtherReport, reportTitleOf } from "../../app/Ga4Shell";
import { Ga4DatePanel } from "../../app/Ga4DatePanel";
import { Ga4ReportTable } from "../../app/Ga4ReportTable";
import { Ga4LineCard, Ga4BarCard } from "../../app/Ga4Charts";
import { RingProvider, Ga4Guide } from "../../app/tour";
import { Ga4Insights } from "../../app/Ga4Insights";
import {
  INITIAL_STATE,
  type CompareBase,
  type Ga4State,
  type TourStep,
  type DateRangeKey,
} from "../../app/types";
import { useStepEngine } from "../../lab/useStepEngine";
import {
  ACCOUNT_NAME,
  PROPERTY_NAME,
  SEARCH_HINT,
  DIMENSION_OPTIONS,
  CHANNEL_COUNT,
  FACTS,
  buildColumns,
  buildRows,
  buildSeries,
  buildBarItems,
  buildXLabels,
  channelOf,
  rowKey,
  BIGGEST_DROP_CHANNEL,
  FLIPPED_CHANNEL,
} from "./data";

const LAB_ID = "date-range-comparison";
const LAB_TITLE = "기간 선택과 이전 기간 비교 적용하기";

/** 기간이 지난 7일로 잡힌 트래픽 획득 보고서에서 시작한다 */
const START_STATE: Ga4State = {
  ...INITIAL_STATE,
  report: "traffic-acquisition",
  dateRange: "7d",
  sortKey: "sessions",
  datePanelOpen: false,
  draftRange: "7d",
  draftCompare: false,
  draftBase: "previous",
  baseListOpen: false,
  appliedBase: null,
};

/** 선택기가 닫혀 있으면 먼저 기간 표시를 가리킨다 */
const openFirst = (s: Ga4State, next: string): string =>
  s.datePanelOpen ? next : "date-chip";

/* ===================== 스텝 ===================== */

const STEPS: TourStep<Ga4State>[] = [
  {
    id: "open_date_panel",
    instruction: "오른쪽 위 지난 7일이라고 적힌 자리를 눌러 기간 선택기를 폅니다.",
    ring: "date-chip",
    isDone: (s) => s.datePanelOpen === true,
  },
  {
    id: "apply_28d",
    instruction: "지난 28일을 고른 다음 적용까지 마칩니다.",
    ring: (s) => openFirst(s, s.draftRange === "28d" ? "date-apply" : "date-opt:28d"),
    isDone: (s) => s.dateRange === "28d" && s.datePanelOpen === false,
  },
  {
    id: "apply_previous",
    instruction: "선택기를 다시 열고 비교를 켠 다음 적용합니다. 비교 대상은 이전 기간 그대로 둡니다.",
    ring: (s) => openFirst(s, s.draftCompare ? "date-apply" : "date-compare"),
    isDone: (s) => s.appliedBase === "previous" && s.datePanelOpen === false,
  },
  {
    id: "pick_biggest_drop",
    instruction: `합계는 이전 기간보다 ${FACTS.totalPrevious}만 줄었습니다. 그 안에서 세션이 가장 크게 줄어든 채널을 골라 봅니다.`,
    ring: null,
    reset: { selectedRow: null },
    isDone: (s) => channelOf(s.selectedRow) === BIGGEST_DROP_CHANNEL,
    isMiss: (s) => s.selectedRow !== null && channelOf(s.selectedRow) !== BIGGEST_DROP_CHANNEL,
    missText: "줄어든 채널은 두 곳뿐입니다. % 변화 줄에서 마이너스가 가장 큰 채널을 찾습니다.",
  },
  {
    id: "switch_year",
    instruction: "선택기를 다시 열고 비교 대상을 이전 연도로 바꾼 다음 적용합니다.",
    ring: (s) =>
      openFirst(
        s,
        s.draftBase === "yearAgo"
          ? "date-apply"
          : s.baseListOpen
            ? "date-base:yearAgo"
            : "date-base"
      ),
    reset: { selectedRow: null },
    isDone: (s) => s.appliedBase === "yearAgo" && s.datePanelOpen === false,
  },
  {
    id: "pick_flipped",
    instruction: "이전 기간보다는 줄었는데 이전 연도보다는 늘어난 채널을 골라 봅니다.",
    ring: null,
    reset: { selectedRow: null },
    isDone: (s) => channelOf(s.selectedRow) === FLIPPED_CHANNEL,
    isMiss: (s) => s.selectedRow !== null && channelOf(s.selectedRow) !== FLIPPED_CHANNEL,
    missText:
      "지금 표는 이전 연도와 견준 값입니다. 조금 전 이전 기간 비교에서 마이너스였던 채널 두 곳 가운데, 지금 플러스로 바뀐 채널을 찾습니다.",
  },
];

const DONE_TEXT = `Referral은 이전 기간보다 ${FACTS.referralPrevious} 줄었는데 작년 같은 기간과 견주면 ${FACTS.referralYearAgo} 늘었습니다. 두 기준이 서로 다른 답을 냅니다. 바로 앞 28일이 유난히 좋았을 뿐, 작년부터 보면 늘고 있는 채널입니다. Paid Search는 이전 기간보다 ${FACTS.paidPrevious}, 작년보다 ${FACTS.paidYearAgo} 줄어 두 기준이 같은 방향을 가리킵니다. 이쪽은 광고 자체가 줄었다고 읽습니다. 그래서 기간 비교는 하나만 걸고 끝내지 않고 두 기준을 번갈아 봅니다.`;

/* ===================== 화면 ===================== */

export default function DateRangeComparisonLab() {
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

  const base = state.appliedBase ?? null;
  const columns = buildColumns(state.dateRange, base);
  const rows = buildRows(state.dateRange, state.sortKey, base);

  /** 선택기를 열 때는 표에 반영된 값으로 초안을 되돌린다. 실제 GA4와 같다 */
  const openPanel = () =>
    apply({
      datePanelOpen: true,
      draftRange: state.dateRange,
      draftCompare: base !== null,
      draftBase: base ?? "previous",
      baseListOpen: false,
    });

  const closePanel = () => apply({ datePanelOpen: false, baseListOpen: false });

  const datePanel = (
    <Ga4DatePanel
      range={state.dateRange}
      base={base}
      open={state.datePanelOpen === true}
      draftRange={state.draftRange ?? state.dateRange}
      draftCompare={state.draftCompare === true}
      draftBase={state.draftBase ?? "previous"}
      baseListOpen={state.baseListOpen === true}
      onToggle={() => (state.datePanelOpen ? closePanel() : openPanel())}
      onPickRange={(key: DateRangeKey) => apply({ draftRange: key })}
      onToggleCompare={() => apply({ draftCompare: !state.draftCompare, baseListOpen: false })}
      onToggleBaseList={() => apply({ baseListOpen: !state.baseListOpen })}
      onPickBase={(next: CompareBase) => apply({ draftBase: next, baseListOpen: false })}
      onApply={() =>
        apply({
          dateRange: state.draftRange ?? state.dateRange,
          appliedBase: state.draftCompare ? (state.draftBase ?? "previous") : null,
          datePanelOpen: false,
          baseListOpen: false,
          selectedRow: null,
        })
      }
      onCancel={closePanel}
    />
  );

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
          onOpenReport={(id) => apply({ report: id, openMenu: null, datePanelOpen: false })}
          onToggleMenu={(menu) => apply({ openMenu: menu })}
          onPickDate={(key: DateRangeKey) => apply({ dateRange: key, openMenu: null })}
          datePanel={datePanel}
        >
          {state.report === "traffic-acquisition" ? (
            <>
              <div className="ga4-chartrow">
                <Ga4LineCard
                  title="시간 경과에 따른 세션수"
                  series={buildSeries(state.dateRange, base)}
                  xLabels={buildXLabels(state.dateRange)}
                />
                <Ga4BarCard
                  title="세션 기본 채널 그룹별 세션수"
                  items={buildBarItems(state.dateRange)}
                />
              </div>

              <Ga4ReportTable
                dimension={state.dimension}
                dimensionOptions={DIMENSION_OPTIONS}
                dimensionMenuOpen={state.openMenu === "dimension"}
                onToggleDimensionMenu={() =>
                  apply({ openMenu: state.openMenu === "dimension" ? null : "dimension" })
                }
                onPickDimension={(key) => apply({ dimension: key, openMenu: null })}
                columns={columns}
                rows={rows}
                sortKey={state.sortKey}
                onSort={(key) => apply({ sortKey: key, openMenu: null })}
                selectedRow={state.selectedRow}
                onSelectRow={(key) => apply({ selectedRow: key })}
                showComparison={base !== null}
                comparisonLabel=""
                rowCount={CHANNEL_COUNT}
                markRow={done ? rowKey(FLIPPED_CHANNEL, "change") : null}
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

/** 다른 보고서로 옮겼을 때 보여 줄 화면 */
function ReportsOverview() {
  const cards = [
    { label: "지난 28일 사용자", value: "9,840", delta: "+8.6%" },
    { label: "지난 28일 세션", value: "27,157", delta: "-2.2%" },
    { label: "지난 28일 참여율", value: "51.07%", delta: "+1.4%" },
    { label: "지난 28일 주요 이벤트", value: "586", delta: "-1.7%" },
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
