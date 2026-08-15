"use client";

/**
 * 초급 1번: 유입 정보(마케팅 채널 전략) 분석하기.
 *
 * 학습자는 GA4와 같은 화면을 직접 조작한다. 화면에 나오는 안내는 맨 아래 띠의 목표 한 줄과
 * 다음에 누를 지점의 파란 링뿐이다. 조작이 스텝의 조건을 만족하면 저절로 다음 스텝으로 넘어간다.
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
  buildColumns,
  buildRows,
  buildSeries,
  buildBarItems,
  buildXLabels,
  TOP_SESSION_CHANNEL,
  WEAKEST_PAID_CHANNEL,
} from "./data";

const LAB_ID = "traffic-acquisition-channels";
const LAB_TITLE = "유입 정보(마케팅 채널 전략) 분석하기";

/* ===================== 스텝 ===================== */

const STEPS: TourStep[] = [
  {
    id: "open_report",
    instruction: "왼쪽 메뉴에서 빨간 상자가 그려진 트래픽 획득을 누릅니다.",
    ring: "report:traffic-acquisition",
    isDone: (s) => s.report === "traffic-acquisition",
  },
  {
    id: "open_date_menu",
    instruction: "지금 기간이 지난 7일로 잡혀 있습니다. 오른쪽 위 그 글자를 눌러 목록을 폅니다.",
    ring: "date-chip",
    isDone: (s) => s.openMenu === "date",
  },
  {
    id: "pick_28d",
    instruction: "펼쳐진 목록에서 지난 28일을 고릅니다.",
    // 메뉴를 닫아 버린 학습자에게는 다시 칩을 가리킨다
    ring: (s) => (s.openMenu === "date" ? "date-28d" : "date-chip"),
    isDone: (s) => s.dateRange === "28d" && s.openMenu === null,
  },
  {
    id: "pick_top_channel",
    instruction: "표에서 세션수가 가장 많은 채널을 찾아 그 줄을 눌러 봅니다.",
    ring: null,
    reset: { selectedRow: null },
    isDone: (s) => s.selectedRow === TOP_SESSION_CHANNEL,
    isMiss: (s) => s.selectedRow !== null && s.selectedRow !== TOP_SESSION_CHANNEL,
    missText: "지금 표는 세션수가 많은 순서로 놓여 있습니다. 맨 윗줄을 누릅니다.",
  },
  {
    id: "sort_engagement",
    instruction: "이번에는 참여율 순서로 봅니다. 표 위쪽 참여율이라는 글자를 누릅니다.",
    ring: "metric:engagementRate",
    reset: { selectedRow: null },
    isDone: (s) => s.sortKey === "engagementRate",
  },
  {
    id: "pick_weak_channel",
    instruction: "세션수 5,000을 넘는 채널 가운데 참여율이 가장 낮은 곳을 골라 봅니다.",
    ring: null,
    reset: { selectedRow: null },
    isDone: (s) => s.selectedRow === WEAKEST_PAID_CHANNEL,
    isMiss: (s) => s.selectedRow !== null && s.selectedRow !== WEAKEST_PAID_CHANNEL,
    missText: "참여율이 가장 낮은 줄이 답은 아닙니다. 세션수 5,000을 넘는 채널만 놓고 다시 고릅니다.",
  },
];

const DONE_TEXT =
  "Paid Search는 세션수가 세 번째로 많은데 참여율은 28.81%입니다. 광고비를 써서 들어온 사람 열에 일곱이 들어오자마자 나간다는 뜻입니다. Organic Social이 참여율은 더 낮지만 세션수가 1,684뿐이라 고쳐도 늘어나는 참여 세션이 적습니다. 여기부터 고칩니다.";

/* ===================== 화면 ===================== */

export default function TrafficAcquisitionLab() {
  const { state, stepIndex, miss, done, step, ring, apply, restart } = useStepEngine<Ga4State>({
    labId: LAB_ID,
    labTitle: LAB_TITLE,
    initialState: INITIAL_STATE,
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
          {state.report === "traffic-acquisition" ? (
            <>
              <div className="ga4-chartrow">
                <Ga4LineCard
                  title="시간 경과에 따른 세션 기본 채널 그룹별 세션수"
                  series={buildSeries(state.dateRange)}
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
                onSelectRow={(name) => apply({ selectedRow: name })}
                markRow={done ? WEAKEST_PAID_CHANNEL : null}
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
    { label: "지난 7일 사용자", value: "5,120", delta: "+12.4%" },
    { label: "지난 7일 세션", value: "7,415", delta: "+9.1%" },
    { label: "지난 7일 이벤트 수", value: "39,478", delta: "+6.8%" },
    { label: "지난 7일 주요 이벤트", value: "166", delta: "-3.2%" },
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
