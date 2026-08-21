"use client";

/**
 * 심화 2번: 내부 트래픽과 원치 않는 추천 제외하기.
 *
 * 필터를 만드는 것까지는 대부분 하지만, 상태를 테스트로 둔 채 잊는 일이 흔하다.
 * 이 편은 그 상태를 직접 사용으로 바꿔 보게 하고, 그 순간부터 되돌릴 수 없는 범위가
 * 생긴다는 것을 마무리에서 짚는다.
 */

import { useEffect, useState } from "react";
import { Ga4AdminShell, Ga4OtherAdmin, adminTitleOf } from "../../app/Ga4AdminShell";
import { Ga4RuleAdmin } from "../../app/Ga4RuleAdmin";
import { RingProvider, Ga4Guide } from "../../app/tour";
import { INITIAL_STATE, type Ga4State, type TourStep } from "../../app/types";
import { useStepEngine } from "../../lab/useStepEngine";
import {
  ACCOUNT_NAME,
  PROPERTY_NAME,
  SEARCH_HINT,
  STATE_ACTIVE,
  STATE_OPTIONS,
  TARGET_FILTER,
  DECOY_FILTER,
  FILTER_COLUMNS,
  buildRows,
} from "./data";

const LAB_ID = "internal-traffic-and-referral-exclusion";
const LAB_TITLE = "내부 트래픽과 원치 않는 추천 제외하기";

/** 관리의 속성 설정에서 시작한다 */
const START_STATE: Ga4State = {
  ...INITIAL_STATE,
  adminPage: "property-settings",
  dimMenuFor: null,
  customEvents: [],
};

/** 사용으로 바꾼 필터 이름을 customEvents 필드에 담아 쓴다 */
const activated = (s: Ga4State) => (s.customEvents ?? [])[0] ?? null;

/* ===================== 스텝 ===================== */

const STEPS: TourStep[] = [
  {
    id: "open_filters",
    instruction: "왼쪽 관리 메뉴의 속성 묶음에서 데이터 필터를 누릅니다.",
    ring: "admin:data-filters",
    isDone: (s) => s.adminPage === "data-filters",
  },
  {
    id: "open_menu",
    instruction: `${TARGET_FILTER} 줄의 오른쪽 더보기를 눌러 상태 목록을 엽니다. 지금 이 필터는 테스트라 아무것도 빠지지 않고 있습니다.`,
    ring: `rule:menu:${TARGET_FILTER}`,
    isDone: (s) => s.dimMenuFor === TARGET_FILTER,
  },
  {
    id: "activate",
    instruction: "상태를 사용으로 바꿔 필터를 실제로 켭니다.",
    ring: `rule:state:${STATE_ACTIVE}`,
    isDone: (s) => activated(s) === TARGET_FILTER,
  },
];

const DONE_TEXT = `이제부터 사무실에서 들어오는 방문은 아예 수집되지 않습니다. 테스트 상태였던 동안에는 데이터가 그대로 들어왔고 보고서에서 걸러 볼 수만 있었는데, 사용으로 바꾼 뒤로는 데이터 자체가 남지 않습니다. 나중에 필터를 꺼도 그 기간의 방문은 복구되지 않습니다. ${DECOY_FILTER}는 처음부터 사용 상태라 건드릴 필요가 없었습니다.`;

export default function InternalTrafficLab() {
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

  const page = state.adminPage ?? "property-settings";

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
          onOpenPage={(id) => apply({ adminPage: id, dimMenuFor: null })}
        >
          {page === "data-filters" ? (
            <Ga4RuleAdmin
              title="데이터 필터"
              description="들어오는 데이터에서 특정 트래픽을 빼거나 남깁니다. 사용으로 바꾸면 그때부터 적용됩니다."
              createLabel="필터 만들기"
              columns={FILTER_COLUMNS}
              rows={buildRows(activated(state))}
              onOpenCreate={() => undefined}
              stateOptions={STATE_OPTIONS}
              menuFor={state.dimMenuFor ?? null}
              onToggleMenu={(name) =>
                apply({ dimMenuFor: state.dimMenuFor === name ? null : name })
              }
              onPickState={(name, next) => {
                if (name !== TARGET_FILTER) {
                  apply({ dimMenuFor: null });
                  return;
                }
                apply({
                  customEvents: next === STATE_ACTIVE ? [TARGET_FILTER] : [],
                  dimMenuFor: null,
                });
              }}
              markRow={done ? TARGET_FILTER : null}
            />
          ) : (
            <Ga4OtherAdmin label={adminTitleOf(page)} backTo="데이터 필터" />
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
