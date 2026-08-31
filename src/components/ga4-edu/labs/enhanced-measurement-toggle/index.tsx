"use client";

/**
 * 중급 8번: 데이터 스트림 향상된 측정에서 개별 이벤트 해제하기.
 *
 * 학습자는 스크롤 측정을 직접 끄고, 스트림 상세의 수집 목록에서 그 줄이 중단됨으로 바뀌는 것을
 * 본다. 그다음 토글을 올려 되돌린다.
 *
 * 되돌려도 해제해 둔 기간은 채워지지 않는다는 것이 이 편의 핵심이라, 마지막 안내에서 그 점을 확인한다.
 */

import { useEffect, useState } from "react";
import { Ga4AdminShell, Ga4OtherAdmin, adminTitleOf } from "../../app/Ga4AdminShell";
import { Ga4StreamAdmin } from "../../app/Ga4StreamAdmin";
import { RingProvider, Ga4Guide } from "../../app/tour";
import { INITIAL_STATE, type Ga4State, type TourStep } from "../../app/types";
import { useStepEngine } from "../../lab/useStepEngine";
import {
  ACCOUNT_NAME,
  PROPERTY_NAME,
  SEARCH_HINT,
  STREAM_NAME,
  STREAM_URL,
  MEASUREMENT_ID,
  MEASURED_EVENTS,
  TARGET_EVENT,
  TARGET_LABEL,
  TARGET_COUNT,
} from "./data";

const LAB_ID = "enhanced-measurement-toggle";
const LAB_TITLE = "데이터 스트림 향상된 측정에서 개별 이벤트 해제하기";

/** 관리의 속성 설정에서 시작한다 */
const START_STATE: Ga4State = {
  ...INITIAL_STATE,
  adminPage: "property-settings",
  streamDetailOpen: false,
  streamSettingsOpen: false,
  disabledEvents: [],
};

const isOff = (s: Ga4State) => (s.disabledEvents ?? []).includes(TARGET_EVENT);

/* ===================== 스텝 ===================== */

const STEPS: TourStep[] = [
  {
    id: "open_streams",
    instruction: "왼쪽 관리 메뉴의 속성 묶음에서 데이터 스트림을 누릅니다.",
    ring: "admin:data-streams",
    isDone: (s) => s.adminPage === "data-streams",
  },
  {
    id: "open_stream",
    instruction: "목록에 있는 웹 스트림을 눌러 세부정보를 엽니다.",
    ring: "stream:web",
    isDone: (s) => s.streamDetailOpen === true,
  },
  {
    id: "open_settings",
    instruction: "향상된 측정 카드 오른쪽 톱니를 눌러 설정을 엽니다.",
    ring: "stream:settings",
    isDone: (s) => s.streamSettingsOpen === true,
  },
  {
    id: "turn_off",
    instruction: `${TARGET_LABEL} 항목의 토글을 내려 측정을 해제합니다.`,
    ring: `stream:toggle:${TARGET_EVENT}`,
    isDone: isOff,
  },
  {
    id: "see_result",
    instruction:
      "설정을 닫고 수집 목록을 봅니다. 해제한 줄이 중단됨으로 바뀌어 있습니다.",
    ring: "stream:close",
    isDone: (s) => s.streamSettingsOpen === false && isOff(s),
  },
  {
    id: "turn_on",
    instruction:
      "실습이므로 되돌립니다. 설정을 다시 열어 같은 토글을 올려 수집을 되돌립니다.",
    ring: (s) => (s.streamSettingsOpen ? `stream:toggle:${TARGET_EVENT}` : "stream:settings"),
    isDone: (s) => !isOff(s) && s.streamSettingsOpen === true,
  },
];

const DONE_TEXT = `되돌렸지만 해제해 둔 동안의 데이터는 채워지지 않습니다. ${TARGET_LABEL}은 지난 28일에 ${TARGET_COUNT.toLocaleString("ko-KR")}회 들어오던 이벤트라, 하루만 꺼 두어도 그만큼이 비어 그 기간의 참여율 비교가 어긋납니다.`;

export default function EnhancedMeasurementToggleLab() {
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

  /** 토글 하나를 뒤집는다. 끈 목록에 넣거나 뺀다 */
  function toggleEvent(event: string) {
    const current = state.disabledEvents ?? [];
    apply({
      disabledEvents: current.includes(event)
        ? current.filter((e) => e !== event)
        : [...current, event],
    });
  }

  return (
    <RingProvider value={ring}>
      <div className={`ga4-stage${pinned ? " ga4-stage-pinned" : ""}`}>
        <Ga4AdminShell
          account={ACCOUNT_NAME}
          property={PROPERTY_NAME}
          searchHint={SEARCH_HINT}
          page={state.adminPage ?? "property-settings"}
          pinned={pinned}
          onTogglePin={() => setPinned((v) => !v)}
          onOpenPage={(id) => apply({ adminPage: id })}
        >
          {state.adminPage === "data-streams" ? (
            <Ga4StreamAdmin
              streamName={STREAM_NAME}
              streamUrl={STREAM_URL}
              measurementId={MEASUREMENT_ID}
              events={MEASURED_EVENTS}
              detailOpen={state.streamDetailOpen ?? false}
              settingsOpen={state.streamSettingsOpen ?? false}
              disabled={state.disabledEvents ?? []}
              onOpenDetail={() => apply({ streamDetailOpen: true })}
              onOpenSettings={() => apply({ streamSettingsOpen: true })}
              onCloseSettings={() => apply({ streamSettingsOpen: false })}
              onToggleEvent={toggleEvent}
            />
          ) : (
            <Ga4OtherAdmin label={adminTitleOf(state.adminPage ?? "")} backTo="데이터 스트림" />
          )}
        </Ga4AdminShell>

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
