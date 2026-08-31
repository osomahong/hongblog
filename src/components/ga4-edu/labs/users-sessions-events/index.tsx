"use client";

/**
 * 초급 4번: 사용자, 세션, 이벤트 수를 구분해서 읽기.
 *
 * 기간을 네 배로 늘려 보고 어느 값이 그만큼 늘지 않는지 찾게 한다.
 * 뒤에서는 이벤트 표에서 세션수와 조회수에 해당하는 이벤트를 확인하게 하고,
 * 마지막에 위쪽 세 줄이 모두 자동 신호라는 것을 스스로 확인하게 만든다.
 */

import { useEffect, useState } from "react";
import { Ga4Shell, Ga4OtherReport, reportTitleOf } from "../../app/Ga4Shell";
import { Ga4Overview } from "../../app/Ga4Overview";
import { RingProvider, Ga4Guide } from "../../app/tour";
import { INITIAL_STATE, type Ga4State, type TourStep, type DateRangeKey } from "../../app/types";
import { useStepEngine } from "../../lab/useStepEngine";
import {
  ACCOUNT_NAME,
  PROPERTY_NAME,
  SEARCH_HINT,
  buildCards,
  buildEventRows,
  buildChannelRows,
  SLOW_CARD,
  SESSION_EVENT,
  VIEW_EVENT,
  REAL_ACTION_EVENT,
} from "./data";

const LAB_ID = "users-sessions-events";
const LAB_TITLE = "사용자, 세션, 이벤트 수를 구분해서 읽기";

/** 보고서 개요에서 바로 시작한다. 기간은 지난 7일로 열어 두고 첫 스텝에서 늘린다 */
const START_STATE: Ga4State = {
  ...INITIAL_STATE,
  report: "reports-overview",
  dateRange: "7d",
};

/* ===================== 스텝 ===================== */

const STEPS: TourStep<Ga4State>[] = [
  {
    id: "open_date_menu",
    instruction: "지금 기간이 지난 7일로 잡혀 있습니다. 오른쪽 위 지난 7일이라고 적힌 곳을 눌러 목록을 폅니다.",
    ring: "date-chip",
    isDone: (s) => s.openMenu === "date",
  },
  {
    id: "pick_28d",
    instruction: "펼쳐진 목록에서 지난 28일을 고릅니다.",
    // 목록을 닫아 버린 학습자에게는 다시 기간 글자를 가리킨다
    ring: (s) => (s.openMenu === "date" ? "date-28d" : "date-chip"),
    isDone: (s) => s.dateRange === "28d" && s.openMenu === null,
  },
  {
    id: "pick_slow_card",
    instruction: "기간을 네 배로 늘렸습니다. 값이 네 배 가까이 늘지 않은 카드를 골라 봅니다.",
    ring: null,
    reset: { selectedRow: null },
    isDone: (s) => s.selectedRow === SLOW_CARD,
    isMiss: (s) => s.selectedRow !== null && s.selectedRow !== SLOW_CARD,
    missText:
      "세션수와 조회수와 이벤트 수는 모두 세 배 반 넘게 늘었습니다. 두 배 남짓만 늘어난 카드가 하나 있습니다.",
  },
  {
    id: "pick_session_event",
    instruction: "아래 이벤트 표에서 세션수 카드와 같은 값이 찍힌 이벤트를 골라 봅니다.",
    ring: null,
    reset: { selectedRow: null },
    isDone: (s) => s.selectedRow === SESSION_EVENT,
    isMiss: (s) => s.selectedRow !== null && s.selectedRow !== SESSION_EVENT,
    missText: "세션수 카드는 25,260입니다. 이벤트 표에서 같은 숫자가 적힌 줄을 찾습니다.",
  },
  {
    id: "pick_view_event",
    instruction: "이번에는 조회수 카드와 같은 값이 찍힌 이벤트를 골라 봅니다.",
    ring: null,
    reset: { selectedRow: null },
    isDone: (s) => s.selectedRow === VIEW_EVENT,
    isMiss: (s) => s.selectedRow !== null && s.selectedRow !== VIEW_EVENT,
    missText: "조회수 카드는 29,070입니다. 이벤트 표에서 같은 숫자가 적힌 줄을 찾습니다.",
  },
  {
    id: "pick_real_action",
    instruction: "이벤트 표에서 방문자가 직접 눌러서 일어난 행동을 골라 봅니다.",
    ring: null,
    reset: { selectedRow: null },
    isDone: (s) => s.selectedRow === REAL_ACTION_EVENT,
    isMiss: (s) => s.selectedRow !== null && s.selectedRow !== REAL_ACTION_EVENT,
    missText:
      "위쪽 다섯 줄은 GA4가 스스로 보내는 신호라 방문자가 누른 것이 아닙니다. 그 아래에서 가장 많이 일어난 행동을 찾습니다.",
  },
];

const DONE_TEXT =
  "add_to_cart는 1,486회로 이벤트 표에서 여섯 번째입니다. 위 다섯 줄은 GA4가 스스로 보내는 신호라 방문자가 누른 것이 아닙니다. user_engagement는 화면에 머물렀다는 표시이고, page_view는 화면이 열렸다는 표시이며, session_start는 방문이 시작됐다는 표시입니다. 이벤트 수가 97,660회라고 해서 방문자가 그만큼 무엇을 한 것이 아닙니다. 그래서 이벤트 표는 위에서부터 읽지 않고, 우리가 심어 둔 이벤트만 골라 봅니다.";

/* ===================== 화면 ===================== */

export default function UsersSessionsEventsLab() {
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
          {state.report === "reports-overview" ? (
          <Ga4Overview
            cards={buildCards(state.dateRange)}
            eventRows={buildEventRows(state.dateRange)}
            channelRows={buildChannelRows(state.dateRange)}
            selected={state.selectedRow}
            onSelect={(key) => apply({ selectedRow: key })}
            markKey={done ? REAL_ACTION_EVENT : null}
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
