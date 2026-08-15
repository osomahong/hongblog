"use client";

/**
 * 초급 6번: 보고서에 보조 측정기준 추가하고 필터 걸기.
 *
 * 측정기준 하나를 더 붙이면 줄이 조합만큼 늘어나고 순위가 뒤집힌다.
 * 늘어난 줄을 필터로 다시 좁혀, 쪼개기와 좁히기를 한 흐름에서 익히게 한다.
 */

import { useEffect, useState } from "react";
import { Ga4Shell } from "../../app/Ga4Shell";
import { Ga4ReportTable } from "../../app/Ga4ReportTable";
import { Ga4FilterEditor } from "../../app/Ga4FilterEditor";
import { RingProvider, Ga4Guide } from "../../app/tour";
import { Ga4Insights } from "../../app/Ga4Insights";
import { INITIAL_STATE, type Ga4State, type TourStep, type DateRangeKey } from "../../app/types";
import { useStepEngine } from "../../lab/useStepEngine";
import {
  ACCOUNT_NAME,
  PROPERTY_NAME,
  SEARCH_HINT,
  DEVICE_DIMENSION,
  MOBILE,
  DIMENSION_OPTIONS,
  SECONDARY_OPTIONS,
  FILTER_DIMENSIONS,
  FILTER_VALUES,
  secondaryLabelOf,
  filterLabelOf,
  buildColumns,
  buildRows,
  rowKey,
  SECOND_COMBO_CHANNEL,
  MOBILE_LOWEST_CHANNEL,
} from "./data";

const LAB_ID = "secondary-dimension-and-filter";
const LAB_TITLE = "보고서에 보조 측정기준 추가하고 필터 걸기";

const START_STATE: Ga4State = {
  ...INITIAL_STATE,
  report: "traffic-acquisition",
  dateRange: "28d",
  dimension: "sessionDefaultChannelGroup",
  sortKey: "sessions",
  secondaryDimension: null,
  secondaryMenuOpen: false,
  filterOpen: false,
  filterDimension: null,
  filterValue: null,
  filterApplied: false,
  filterList: null,
};

const hasDevice = (s: Ga4State) => s.secondaryDimension === DEVICE_DIMENSION;

/* ===================== 스텝 ===================== */

const STEPS: TourStep<Ga4State>[] = [
  {
    id: "open_secondary",
    instruction: "표 왼쪽 위 세션 기본 채널 그룹 옆에 있는 더하기를 누릅니다.",
    ring: "secondary-plus",
    isDone: (s) => s.secondaryMenuOpen === true,
  },
  {
    id: "pick_device",
    instruction: "펼쳐진 목록에서 기기 카테고리를 고릅니다.",
    // 목록을 닫아 버린 학습자에게는 다시 더하기를 가리킨다
    ring: (s) => (s.secondaryMenuOpen ? `secondary:${DEVICE_DIMENSION}` : "secondary-plus"),
    isDone: (s) => hasDevice(s) && s.secondaryMenuOpen === false,
  },
  {
    id: "pick_second_combo",
    instruction: "줄이 다섯 개에서 열다섯 개로 늘었습니다. 세션수가 두 번째로 많은 줄을 골라 봅니다.",
    ring: null,
    reset: { selectedRow: null },
    isDone: (s) => s.selectedRow === rowKey(SECOND_COMBO_CHANNEL, MOBILE),
    isMiss: (s) => s.selectedRow !== null && s.selectedRow !== rowKey(SECOND_COMBO_CHANNEL, MOBILE),
    missText: "맨 윗줄 바로 아래 줄입니다. 채널만 볼 때 2위였던 채널이 아닙니다.",
  },
  {
    id: "open_filter",
    instruction: "줄이 많아 읽기 어렵습니다. 표 위쪽 필터 추가를 눌러 조건을 만듭니다.",
    ring: "filter-add",
    reset: { selectedRow: null },
    isDone: (s) => s.filterOpen === true,
  },
  {
    id: "apply_filter",
    instruction: "측정기준은 기기 카테고리, 값은 mobile을 고른 다음 적용까지 마칩니다.",
    ring: (s) => {
      if (s.filterDimension !== DEVICE_DIMENSION) {
        return s.filterList === "dimension" ? `flt-dim:${DEVICE_DIMENSION}` : "filter-dimension";
      }
      if (s.filterValue !== MOBILE) {
        return s.filterList === "value" ? `flt-val:${MOBILE}` : "filter-value";
      }
      return "filter-apply";
    },
    isDone: (s) => s.filterApplied === true && s.filterOpen === false,
  },
  {
    id: "pick_mobile_lowest",
    instruction: "모바일만 남은 표에서 세션수가 가장 적은 채널을 골라 봅니다.",
    ring: null,
    reset: { selectedRow: null },
    isDone: (s) => s.selectedRow === rowKey(MOBILE_LOWEST_CHANNEL, MOBILE),
    isMiss: (s) => s.selectedRow !== null && s.selectedRow !== rowKey(MOBILE_LOWEST_CHANNEL, MOBILE),
    missText: "전체로 볼 때 꼴찌였던 채널이 지금도 꼴찌는 아닙니다. 맨 아랫줄을 다시 확인합니다.",
  },
];

const DONE_TEXT =
  "Referral은 전체 2,043회로 네 번째인데 모바일만 남기면 1,143회로 꼴찌가 됩니다. 반대로 전체 꼴찌였던 Organic Social은 1,532회로 한 칸 올라갑니다. 채널마다 모바일 비중이 다르기 때문입니다. Organic Social은 91%, Paid Search는 80%인데 Referral은 56%입니다. 쪼개면 순위가 위아래로 모두 뒤집힙니다. 그래서 채널 순위 하나로 판단하지 않고, 사람들이 실제로 쓰는 기기를 붙여 다시 봅니다.";

/* ===================== 화면 ===================== */

export default function SecondaryDimensionLab() {
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

  const secondary = state.secondaryDimension ?? null;
  const filterDevice =
    state.filterApplied && state.filterDimension === DEVICE_DIMENSION
      ? (state.filterValue ?? null)
      : null;
  const columns = buildColumns(filterDevice);
  const rows = buildRows(state.sortKey, secondary, filterDevice);

  const filterEditor = (
    <Ga4FilterEditor
      open={state.filterOpen === true}
      onOpen={() => apply({ filterOpen: true })}
      onClose={() => apply({ filterOpen: false, filterList: null })}
      dimensions={FILTER_DIMENSIONS}
      values={state.filterDimension ? (FILTER_VALUES[state.filterDimension] ?? []) : []}
      dimension={state.filterDimension ?? null}
      value={state.filterValue ?? null}
      openList={state.filterList ?? null}
      onToggleList={(list) => apply({ filterList: list })}
      onPickDimension={(key) =>
        apply({ filterDimension: key, filterValue: null, filterList: null })
      }
      onPickValue={(value) => apply({ filterValue: value, filterList: null })}
      onApply={() => apply({ filterApplied: true, filterOpen: false, filterList: null })}
      appliedLabel={
        state.filterApplied
          ? filterLabelOf(state.filterDimension ?? null, state.filterValue ?? null)
          : null
      }
      onRemove={() =>
        apply({ filterApplied: false, filterDimension: null, filterValue: null, selectedRow: null })
      }
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
          reportTitle="트래픽 획득: 세션 기본 채널 그룹(기본 채널 그룹)"
          onOpenReport={(id) => apply({ report: id, openMenu: null })}
          onToggleMenu={(menu) => apply({ openMenu: menu })}
          onPickDate={(key: DateRangeKey) => apply({ dateRange: key, openMenu: null })}
          filterEditor={filterEditor}
        >
          {state.report === "traffic-acquisition" ? (
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
              onSort={(key) => apply({ sortKey: key })}
              selectedRow={state.selectedRow}
              onSelectRow={(key) => apply({ selectedRow: key })}
              markRow={done ? rowKey(MOBILE_LOWEST_CHANNEL, MOBILE) : null}
              secondaryOptions={SECONDARY_OPTIONS}
              secondaryDimension={secondary}
              secondaryMenuOpen={state.secondaryMenuOpen === true}
              onToggleSecondaryMenu={() =>
                apply({ secondaryMenuOpen: !state.secondaryMenuOpen })
              }
              onPickSecondary={(key) =>
                apply({ secondaryDimension: key, secondaryMenuOpen: false, selectedRow: null })
              }
              secondaryLabel={secondaryLabelOf(secondary)}
            />
          ) : (
            <ReportsOverview />
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
  return (
    <>
      <div className="ga4-overview">
        {[
          { label: "지난 28일 사용자", value: "9,840", delta: "+6.2%" },
          { label: "지난 28일 세션", value: "27,157", delta: "+9.4%" },
          { label: "지난 28일 모바일 세션", value: "17,855", delta: "+12.6%" },
          { label: "지난 28일 주요 이벤트", value: "175", delta: "+2.1%" },
        ].map((c) => (
          <div key={c.label} className="ga4-overview-card">
            <p className="ga4-overview-label">{c.label}</p>
            <p className="ga4-overview-value">{c.value}</p>
            <p className="ga4-overview-delta">{c.delta}</p>
          </div>
        ))}
      </div>
      <Ga4Insights />
    </>
  );
}
