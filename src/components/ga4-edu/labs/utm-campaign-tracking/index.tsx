"use client";

/**
 * 중급 6번: UTM 규칙 정하고 캠페인 성과 나눠 보기.
 *
 * 트래픽 획득 보고서의 측정기준을 바꿔 가며 표기 흔들림이 만드는 문제를 직접 보게 한다.
 * 캠페인 축에서는 여름 기획전 하나가 네 줄로 나뉘어 있고, 소스 매체 축에서는 매체 값이
 * 표준값이 아니라서 채널 분류에서 빠진 유입이 하나 있다.
 *
 * UTM은 붙이는 것보다 같은 표기로 붙이는 것이 어렵다는 게 이 편의 핵심이다.
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
  CHANNEL_DIMENSION,
  SOURCE_DIMENSION,
  CAMPAIGN_DIMENSION,
  buildColumns,
  buildRows,
  SPLIT_CAMPAIGN,
  DECOY_CAMPAIGN,
  NONSTANDARD_SOURCE,
  DECOY_SOURCE,
  SUMMER_TOTAL,
} from "./data";

const LAB_ID = "utm-campaign-tracking";
const LAB_TITLE = "UTM 규칙 정하고 캠페인 성과 나눠 보기";

/** 트래픽 획득 보고서를 채널 그룹 축으로 연 상태에서 시작한다 */
const START_STATE: Ga4State = {
  ...INITIAL_STATE,
  dateRange: "28d",
  dimension: CHANNEL_DIMENSION,
};

/* ===================== 스텝 ===================== */

const STEPS: TourStep[] = [
  {
    id: "open_report",
    instruction: "왼쪽 메뉴에서 빨간 상자가 그려진 트래픽 획득을 누릅니다.",
    ring: "report:traffic-acquisition",
    isDone: (s) => s.report === "traffic-acquisition",
  },
  {
    id: "pick_campaign",
    instruction:
      "표 왼쪽 위 측정기준 이름을 눌러 목록을 열고 세션 캠페인을 고릅니다.",
    ring: (s) => (s.openMenu === "dimension" ? `dimension:${CAMPAIGN_DIMENSION}` : "dimension-chip"),
    isDone: (s) => s.dimension === CAMPAIGN_DIMENSION && s.openMenu === null,
  },
  {
    id: "find_split",
    instruction:
      "목록에 여름 기획전이 여러 줄로 나뉘어 있습니다. summer_sale과 같은 캠페인인데 표기만 다른 줄을 누릅니다.",
    ring: null,
    isDone: (s) => s.selectedRow === SPLIT_CAMPAIGN,
    isMiss: (s) => s.selectedRow !== null && s.selectedRow !== SPLIT_CAMPAIGN,
    missText: `${DECOY_CAMPAIGN}은 이름부터 다른 별개 캠페인입니다. 대문자만 다른 줄을 찾아보세요.`,
    reset: { selectedRow: null },
  },
  {
    id: "pick_source",
    instruction:
      "이번에는 측정기준을 세션 소스/매체로 바꿔, 매체 값이 어떻게 적혀 있는지 봅니다.",
    ring: (s) => (s.openMenu === "dimension" ? `dimension:${SOURCE_DIMENSION}` : "dimension-chip"),
    isDone: (s) => s.dimension === SOURCE_DIMENSION && s.openMenu === null,
    reset: { selectedRow: null },
  },
  {
    id: "find_nonstandard",
    instruction:
      "매체 자리에 GA4가 아는 표준값 대신 다른 말이 적힌 줄이 하나 있습니다. 그 줄을 누릅니다.",
    ring: null,
    isDone: (s) => s.selectedRow === NONSTANDARD_SOURCE,
    isMiss: (s) => s.selectedRow !== null && s.selectedRow !== NONSTANDARD_SOURCE,
    missText: `${DECOY_SOURCE}는 매체 자리에 표준값 cpc를 제대로 쓴 줄입니다. 매체가 한글로 적힌 줄을 찾아보세요.`,
    reset: { selectedRow: null },
  },
  {
    id: "back_to_channel",
    instruction:
      "측정기준을 세션 기본 채널 그룹으로 되돌려, 그 유입이 어느 채널로 묶였는지 확인합니다.",
    ring: (s) => (s.openMenu === "dimension" ? `dimension:${CHANNEL_DIMENSION}` : "dimension-chip"),
    isDone: (s) => s.dimension === CHANNEL_DIMENSION && s.openMenu === null,
    reset: { selectedRow: null },
  },
];

const DONE_TEXT = `여름 기획전은 네 표기를 더하면 ${SUMMER_TOTAL.toLocaleString("ko-KR")}회로 가장 큰 캠페인인데, 표에서는 3,240회짜리 한 줄로만 보였습니다. 매체를 한글로 적은 네이버 유입은 Unassigned 1,640회로 남아 유료 검색에 들어가지 못했습니다.`;

export default function UtmCampaignTrackingLab() {
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

  const columns = buildColumns(state.dimension);
  const rows = buildRows(state.dimension, state.sortKey);

  /** 마지막에 채널 축으로 돌아오면 Unassigned 줄에 표시를 남긴다 */
  const markRow = done ? "Unassigned" : null;

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
              markRow={markRow}
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
