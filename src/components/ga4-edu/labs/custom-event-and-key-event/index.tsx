"use client";

/**
 * 중급 2번: 맞춤 이벤트 만들고 주요 이벤트로 표시하기.
 *
 * 이 편은 보고서가 아니라 관리 화면을 다룬다. 코드를 고치지 않고 기존 이벤트에 조건을 걸어
 * 새 이벤트를 만들고, 그 다음 어떤 이벤트를 주요 이벤트로 표시할지 고르게 한다.
 * 시작할 때 page_view가 이미 주요 이벤트로 켜져 있고, 마지막 스텝에서 학습자가 그것을 찾아
 * 끈다. 전환율이 판단 근거를 잃는 지점을 스스로 짚게 만드는 장치다.
 */

import { useEffect, useState } from "react";
import { Ga4AdminShell, Ga4OtherAdmin, adminTitleOf } from "../../app/Ga4AdminShell";
import { Ga4EventsAdmin, Ga4KeyEventsAdmin, Ga4CreateEventPanel } from "../../app/Ga4EventsAdmin";
import { RingProvider, Ga4Guide } from "../../app/tour";
import { INITIAL_STATE, type Ga4State, type TourStep } from "../../app/types";
import { useStepEngine } from "../../lab/useStepEngine";
import {
  ACCOUNT_NAME,
  PROPERTY_NAME,
  SEARCH_HINT,
  EVENT_ROWS,
  NAME_OPTIONS,
  VALUE_OPTIONS,
  FACTS,
  TARGET_NAME,
  TARGET_VALUE,
  KEY_EVENT_TARGET,
  WRONG_KEY_EVENT,
} from "./data";

const LAB_ID = "custom-event-and-key-event";
const LAB_TITLE = "맞춤 이벤트 만들고 주요 이벤트로 표시하기";

/**
 * 관리 화면의 속성 설정에서 시작한다.
 * page_view는 앞서 누군가 켜 둔 것으로 두고, 마지막 스텝에서 학습자가 끈다.
 */
const START_STATE: Ga4State = {
  ...INITIAL_STATE,
  dateRange: "28d",
  adminPage: "property-settings",
  createOpen: false,
  createName: null,
  createValue: null,
  createList: null,
  customEvents: [],
  keyEvents: [WRONG_KEY_EVENT],
  keyEventsTouched: [WRONG_KEY_EVENT],
};

const made = (s: Ga4State) => (s.customEvents ?? []).includes(TARGET_NAME);
const marked = (s: Ga4State, name: string) => (s.keyEvents ?? []).includes(name);

/* ===================== 스텝 ===================== */

const STEPS: TourStep<Ga4State>[] = [
  {
    id: "open_events",
    instruction: "왼쪽 관리 메뉴의 속성 묶음에서 이벤트를 누릅니다.",
    ring: "admin:events",
    isDone: (s) => s.adminPage === "events",
  },
  {
    id: "open_create",
    instruction: "오른쪽 위 이벤트 만들기를 누릅니다.",
    ring: "create-event",
    isDone: (s) => s.createOpen === true,
  },
  {
    id: "create_custom",
    instruction:
      "이름은 contact_submit, 일치 조건 값은 form_submit으로 고른 다음 만들기까지 마칩니다.",
    // 아직 고르지 않은 입력 칸을 차례로 가리킨다
    ring: (s) => {
      if (s.createName !== TARGET_NAME) {
        return s.createList === "name" ? `cname:${TARGET_NAME}` : "create-name";
      }
      if (s.createValue !== TARGET_VALUE) {
        return s.createList === "value" ? `cval:${TARGET_VALUE}` : "create-value";
      }
      return "create-save";
    },
    isDone: (s) => made(s) && s.createOpen === false,
  },
  {
    id: "mark_key_event",
    instruction:
      "기존 이벤트 표에서 사업 성과에 가장 가까운 이벤트를 찾아 주요 이벤트로 표시합니다.",
    ring: null,
    isDone: (s) => marked(s, KEY_EVENT_TARGET),
    isMiss: (s) =>
      (s.keyEvents ?? []).some((k) => k !== WRONG_KEY_EVENT && k !== KEY_EVENT_TARGET),
    missText:
      "장바구니에 담는 것과 실제로 사는 것은 다릅니다. 돈이 오간 순간에 붙는 이벤트를 찾습니다.",
  },
  {
    id: "open_key_events",
    instruction: "왼쪽 메뉴에서 주요 이벤트를 눌러 지금 표시된 목록을 확인합니다.",
    ring: "admin:key-events",
    isDone: (s) => s.adminPage === "key-events",
  },
  {
    id: "unmark_wrong",
    instruction:
      "목록에 앞서 누군가 켜 둔 이벤트가 하나 섞여 있습니다. 전환율을 판단에 쓸 수 없게 만드는 그 이벤트를 찾아 표시를 풉니다.",
    ring: null,
    isDone: (s) => !marked(s, WRONG_KEY_EVENT) && marked(s, KEY_EVENT_TARGET),
    isMiss: (s) => !marked(s, KEY_EVENT_TARGET),
    missText:
      "purchase는 그대로 두어야 합니다. 거의 모든 방문에 붙어서 전환율이 100퍼센트에 가까워지는 쪽을 끕니다.",
  },
];

const DONE_TEXT = `page_view는 ${FACTS.pageViewCount}회로 세션 ${FACTS.sessionCount}회를 웃돕니다. 주요 이벤트로 표시하면 전환율이 ${FACTS.pageViewRate}에 붙어 버려 무엇을 고쳐도 숫자가 움직이지 않습니다. purchase는 ${FACTS.purchaseCount}회라 세션 대비 ${FACTS.purchaseRate}입니다. 이 값이라야 화면을 고쳤을 때 오르내리는 것이 보입니다. 방금 만든 contact_submit은 아직 표에 없습니다. 맞춤 이벤트는 만든 시점부터 쌓이고 지난 데이터에는 붙지 않기 때문입니다. 주요 이벤트 표시도 같아서, 켠 날 이전 기간은 전환으로 세지 않습니다.`;

/* ===================== 화면 ===================== */

export default function CustomEventAndKeyEventLab() {
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

  const page = state.adminPage ?? "";
  const custom = state.customEvents ?? [];
  const keyEvents = state.keyEvents ?? [];
  const touched = state.keyEventsTouched ?? [];

  const panel = (
    <Ga4CreateEventPanel
      open={state.createOpen === true}
      name={state.createName ?? null}
      value={state.createValue ?? null}
      openList={state.createList ?? null}
      nameOptions={NAME_OPTIONS}
      valueOptions={VALUE_OPTIONS}
      onToggleList={(list) => apply({ createList: list })}
      onPickName={(key) => apply({ createName: key, createList: null })}
      onPickValue={(key) => apply({ createValue: key, createList: null })}
      onCreate={() =>
        apply({
          customEvents: state.createName ? [...custom, state.createName] : custom,
          createOpen: false,
          createList: null,
        })
      }
      onClose={() => apply({ createOpen: false, createList: null })}
    />
  );

  /**
   * 스위치는 켜고 끄기가 모두 되어야 한다. 잘못 켠 것을 학습자가 되돌릴 수 있다.
   * 끈 줄이 주요 이벤트 목록에서 곧바로 사라지면 되돌릴 길이 없어지므로,
   * 한 번이라도 켰던 이름은 따로 기억해 그 화면에 남긴다.
   */
  const toggleKeyEvent = (name: string) =>
    apply({
      keyEvents: keyEvents.includes(name)
        ? keyEvents.filter((k) => k !== name)
        : [...keyEvents, name],
      keyEventsTouched: touched.includes(name) ? touched : [...touched, name],
    });

  return (
    <RingProvider value={ring}>
      <div
        className={`ga4-stage${pinned ? " ga4-stage-pinned" : ""}${
          state.createOpen ? " ga4-stage-panel" : ""
        }`}
      >
        <Ga4AdminShell
          account={ACCOUNT_NAME}
          property={PROPERTY_NAME}
          searchHint={SEARCH_HINT}
          pinned={pinned}
          onTogglePin={() => setPinned((v) => !v)}
          page={page}
          onOpenPage={(id) => apply({ adminPage: id, createOpen: false, createList: null })}
          panel={panel}
        >
          {page === "events" ? (
            <Ga4EventsAdmin
              rows={EVENT_ROWS}
              keyEvents={keyEvents}
              onToggleKeyEvent={toggleKeyEvent}
              onOpenCreate={() => apply({ createOpen: true })}
              customEvents={custom}
            />
          ) : page === "key-events" ? (
            <Ga4KeyEventsAdmin
              rows={EVENT_ROWS}
              keyEvents={keyEvents}
              visible={touched}
              onToggleKeyEvent={toggleKeyEvent}
            />
          ) : (
            <Ga4OtherAdmin label={adminTitleOf(page)} />
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
