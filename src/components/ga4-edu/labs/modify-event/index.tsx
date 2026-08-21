"use client";

/**
 * 심화 6번: 이벤트 수정으로 기존 이벤트 이름과 매개변수 바꾸기.
 *
 * 같은 행동에 이름이 둘로 갈라져 들어오는 상황에서 이벤트 수정으로 한쪽을 표준 이름으로 바꾼다.
 * 저장한 뒤에도 목록에서 줄이 바로 사라지지 않는다는 점을 마무리에서 확인한다.
 *
 * 수정은 앞으로 들어오는 데이터에만 적용되고, 이미 쌓인 이름은 그대로 남기 때문이다.
 */

import { useEffect, useState } from "react";
import { Ga4AdminShell, Ga4OtherAdmin, adminTitleOf } from "../../app/Ga4AdminShell";
import { Ga4EventsAdmin } from "../../app/Ga4EventsAdmin";
import { Ga4ModifyEventPanel } from "../../app/Ga4ModifyEventPanel";
import { RingProvider, Ga4Guide } from "../../app/tour";
import { INITIAL_STATE, type Ga4State, type TourStep } from "../../app/types";
import { useStepEngine } from "../../lab/useStepEngine";
import {
  ACCOUNT_NAME,
  PROPERTY_NAME,
  SEARCH_HINT,
  RULE_NAME,
  WRONG_EVENT,
  TARGET_EVENT,
  DECOY_EVENT,
  MATCH_OPTIONS,
  VALUE_OPTIONS,
  EVENT_ROWS,
} from "./data";

const LAB_ID = "modify-event";
const LAB_TITLE = "이벤트 수정으로 기존 이벤트 이름과 매개변수 바꾸기";

/** 관리의 속성 설정에서 시작한다 */
const START_STATE: Ga4State = {
  ...INITIAL_STATE,
  adminPage: "property-settings",
  createOpen: false,
  createName: null,
  createValue: null,
  createList: null,
  customEvents: [],
  keyEvents: [],
};

const saved = (s: Ga4State) => (s.customEvents ?? []).includes(RULE_NAME);

/* ===================== 스텝 ===================== */

const STEPS: TourStep[] = [
  {
    id: "open_events",
    instruction: "왼쪽 관리 메뉴의 속성 묶음에서 이벤트를 누릅니다.",
    ring: "admin:events",
    isDone: (s) => s.adminPage === "events",
  },
  {
    id: "open_modify",
    instruction:
      "목록에 purchase와 purchase_complete가 따로 잡혀 있습니다. 오른쪽 위 이벤트 수정을 누릅니다.",
    ring: "modify-event",
    isDone: (s) => s.createOpen === true,
  },
  {
    id: "pick_match",
    instruction: `일치 조건에서 수정할 이름을 고릅니다. 표준 이름이 아닌 쪽이 ${WRONG_EVENT}입니다.`,
    ring: "modify:match",
    isDone: (s) => s.createName === WRONG_EVENT,
    isMiss: (s) => s.createName !== null && s.createName !== WRONG_EVENT,
    missText: `${DECOY_EVENT}는 이미 표준 이름이라 수정할 필요가 없습니다. 구매를 가리키는 다른 이름을 찾아보세요.`,
    reset: { createName: null },
  },
  {
    id: "pick_value",
    instruction: `매개변수 수정에서 바꿀 이름으로 ${TARGET_EVENT}를 고릅니다.`,
    ring: "modify:value",
    isDone: (s) => s.createValue === TARGET_EVENT,
  },
  {
    id: "save_rule",
    instruction: "만들기를 눌러 수정 규칙을 저장합니다.",
    ring: "modify:save",
    isDone: (s) => saved(s) && s.createOpen === false,
  },
];

const DONE_TEXT = `규칙을 저장했지만 목록에서 ${WRONG_EVENT} 줄은 바로 사라지지 않습니다. 이미 쌓인 620회는 그 이름으로 남아 있고, 앞으로 들어오는 것만 ${TARGET_EVENT}로 바뀝니다. 며칠 지나 새 데이터만 있는 기간으로 보면 한 줄로 모입니다.`;

export default function ModifyEventLab() {
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

  /** 만들기를 누르면 규칙 이름을 목록에 올리고 패널을 닫는다 */
  function saveRule() {
    if (!state.createName || !state.createValue) return;
    apply({
      customEvents: [...(state.customEvents ?? []), RULE_NAME],
      createOpen: false,
      createList: null,
    });
  }

  const page = state.adminPage ?? "property-settings";
  const panel =
    state.createOpen && page === "events" ? (
      <Ga4ModifyEventPanel
        ruleName={RULE_NAME}
        matchValue={state.createName ?? null}
        newValue={state.createValue ?? null}
        openList={
          state.createList === "name" ? "match" : state.createList === "value" ? "value" : null
        }
        matchOptions={MATCH_OPTIONS}
        valueOptions={VALUE_OPTIONS}
        onToggleList={(list) =>
          apply({
            createList:
              list === "match"
                ? state.createList === "name"
                  ? null
                  : "name"
                : state.createList === "value"
                  ? null
                  : "value",
          })
        }
        onPickMatch={(value) => apply({ createName: value, createList: null })}
        onPickValue={(value) => apply({ createValue: value, createList: null })}
        onSave={saveRule}
        onClose={() => apply({ createOpen: false, createList: null })}
      />
    ) : undefined;

  return (
    <RingProvider value={ring}>
      <div className={`ga4-stage${pinned ? " ga4-stage-pinned" : ""}`}>
        <Ga4AdminShell
          account={ACCOUNT_NAME}
          property={PROPERTY_NAME}
          searchHint={SEARCH_HINT}
          page={page}
          pinned={pinned}
          onTogglePin={() => setPinned((v) => !v)}
          onOpenPage={(id) => apply({ adminPage: id, createOpen: false, createList: null })}
          panel={panel}
        >
          {page === "events" ? (
            <Ga4EventsAdmin
              rows={EVENT_ROWS}
              keyEvents={state.keyEvents ?? []}
              onToggleKeyEvent={(name) => {
                const current = state.keyEvents ?? [];
                apply({
                  keyEvents: current.includes(name)
                    ? current.filter((k) => k !== name)
                    : [...current, name],
                });
              }}
              onOpenCreate={() => apply({ createOpen: true, createList: null })}
              onOpenModify={() => apply({ createOpen: true, createList: null })}
              customEvents={[]}
            />
          ) : (
            <Ga4OtherAdmin label={adminTitleOf(page)} backTo="이벤트" />
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
