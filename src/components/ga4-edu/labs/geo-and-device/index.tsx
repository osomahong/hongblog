"use client";

/**
 * 초급 10번: 지역과 기기로 사용자 나눠 보기.
 *
 * 보고서 두 개를 오가는 것이 이 편의 핵심이다. 사용자 속성에서 지역을 보고,
 * 기술로 옮겨 기기와 브라우저를 본다.
 * 마지막에는 기기로 볼 때 무난하던 모바일 참여율 안에 크게 낮은 브라우저가
 * 섞여 있다는 것을 학습자가 스스로 찾아내게 만든다.
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
  GEO_DIMENSIONS,
  TECH_DIMENSIONS,
  DEVICE_DIMENSION,
  BROWSER_DIMENSION,
  FACTS,
  buildColumns,
  buildRows,
  TOP_COUNTRY,
  NO_KEY_EVENT_COUNTRY,
  TOP_DEVICE,
  BROKEN_BROWSER,
} from "./data";

const LAB_ID = "geo-and-device";
const LAB_TITLE = "지역과 기기로 사용자 나눠 보기";

/** 사용자 속성 보고서를 국가 기준으로 열어 둔다 */
const START_STATE: Ga4State = {
  ...INITIAL_STATE,
  dateRange: "28d",
  dimension: "country",
  sortKey: "sessions",
};

/* ===================== 스텝 ===================== */

const STEPS: TourStep<Ga4State>[] = [
  {
    id: "open_demographics",
    instruction: "왼쪽 메뉴에서 빨간 상자가 그려진 사용자 속성을 누릅니다.",
    ring: "report:demographics",
    isDone: (s) => s.report === "demographics",
  },
  {
    id: "pick_top_country",
    instruction: "표에서 세션수가 가장 많은 국가를 찾아 그 줄을 눌러 봅니다.",
    ring: null,
    reset: { selectedRow: null },
    isDone: (s) => s.selectedRow === TOP_COUNTRY,
    isMiss: (s) => s.selectedRow !== null && s.selectedRow !== TOP_COUNTRY,
    missText: "지금 표는 세션수가 많은 순서로 놓여 있습니다. 맨 윗줄을 누릅니다.",
  },
  {
    id: "pick_no_key_event",
    instruction: "세션이 900회를 넘는데 주요 이벤트가 하나도 없는 국가를 골라 봅니다.",
    ring: null,
    reset: { selectedRow: null },
    isDone: (s) => s.selectedRow === NO_KEY_EVENT_COUNTRY,
    isMiss: (s) => s.selectedRow !== null && s.selectedRow !== NO_KEY_EVENT_COUNTRY,
    missText: "주요 이벤트 칸이 0인 줄은 하나뿐입니다. 세션수도 함께 확인합니다.",
  },
  {
    id: "open_tech",
    instruction: "왼쪽 메뉴에서 기술을 눌러 기기별로 나눈 표를 엽니다.",
    ring: "report:tech",
    reset: { selectedRow: null },
    isDone: (s) => s.report === "tech",
  },
  {
    id: "pick_top_device",
    instruction: "표에서 세션수가 가장 많은 기기를 골라 참여율을 확인합니다.",
    ring: null,
    reset: { selectedRow: null },
    isDone: (s) => s.selectedRow === TOP_DEVICE,
    isMiss: (s) => s.selectedRow !== null && s.selectedRow !== TOP_DEVICE,
    missText: "세 줄 가운데 세션수가 가장 큰 줄입니다.",
  },
  {
    id: "pick_broken_browser",
    instruction: `측정기준을 브라우저로 바꾼 다음, 모바일 평균 ${FACTS.mobileRate}를 크게 밑도는 브라우저를 골라 봅니다.`,
    // 측정기준을 아직 바꾸지 않았으면 이름을, 목록이 열려 있으면 브라우저를 가리킨다
    ring: (s) => {
      if (s.dimension !== BROWSER_DIMENSION) {
        return s.openMenu === "dimension" ? `dimension:${BROWSER_DIMENSION}` : "dimension-chip";
      }
      return null;
    },
    reset: { selectedRow: null },
    isDone: (s) => s.dimension === BROWSER_DIMENSION && s.selectedRow === BROKEN_BROWSER,
    isMiss: (s) =>
      s.dimension === BROWSER_DIMENSION && s.selectedRow !== null && s.selectedRow !== BROKEN_BROWSER,
    missText: `Whale은 참여율이 더 낮지만 세션이 ${FACTS.whaleSessions}회뿐이라 모바일 평균을 끌어내릴 만큼은 아닙니다. 세션이 3,000회를 넘는 줄을 봅니다.`,
  },
];

const DONE_TEXT = `Samsung Internet은 세션 ${FACTS.samsungSessions}회에 참여율 ${FACTS.samsungRate}입니다. Chrome ${FACTS.chromeRate}의 절반에 못 미치고, 주요 이벤트도 ${FACTS.samsungKeyEvents}회뿐입니다. 기기로만 볼 때는 모바일 참여율이 ${FACTS.mobileRate}라 문제가 드러나지 않았습니다. 세션 ${FACTS.mobileSessions}회 안에 잘 되는 브라우저와 그렇지 않은 브라우저가 섞여 평균이 가려 준 것입니다. 이런 값은 대개 화면이 깨졌거나 결제 창이 열리지 않는다는 신호라, 그 브라우저로 직접 들어가 확인합니다.`;

/* ===================== 화면 ===================== */

export default function GeoAndDeviceLab() {
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

  const onGeo = state.report === "demographics";
  const onTech = state.report === "tech";
  const options = onTech ? TECH_DIMENSIONS : GEO_DIMENSIONS;
  const columns = buildColumns(state.dimension);
  const rows = buildRows(state.dimension, state.sortKey);

  /** 보고서를 옮기면 그 보고서의 기본 측정기준으로 되돌린다. 실제 GA4와 같다 */
  const openReport = (id: string) => {
    const dimension = id === "tech" ? DEVICE_DIMENSION : id === "demographics" ? "country" : state.dimension;
    apply({ report: id, dimension, openMenu: null, selectedRow: null });
  };

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
          onOpenReport={openReport}
          onToggleMenu={(menu) => apply({ openMenu: menu })}
          onPickDate={(key: DateRangeKey) => apply({ dateRange: key, openMenu: null })}
        >
          {onGeo || onTech ? (
            <Ga4ReportTable
              dimension={state.dimension}
              dimensionOptions={options}
              dimensionMenuOpen={state.openMenu === "dimension"}
              onToggleDimensionMenu={() =>
                apply({ openMenu: state.openMenu === "dimension" ? null : "dimension" })
              }
              onPickDimension={(key) =>
                apply({ dimension: key, openMenu: null, selectedRow: null })
              }
              columns={columns}
              rows={rows}
              sortKey={state.sortKey}
              onSort={(key) => apply({ sortKey: key, openMenu: null })}
              selectedRow={state.selectedRow}
              onSelectRow={(name) => apply({ selectedRow: name })}
              markRow={done ? BROKEN_BROWSER : null}
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
    { label: "지난 28일 세션", value: "27,157", delta: "+9.4%" },
    { label: "지난 28일 참여율", value: "51.68%", delta: "+1.4%" },
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
