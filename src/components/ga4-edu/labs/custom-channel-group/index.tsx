"use client";

/**
 * 심화 4번: 채널 그룹 직접 만들어 유입 분류 바꾸기.
 *
 * 규칙을 만드는 것보다 순서를 정하는 것이 어렵다는 것을 보여 준다. 넓은 규칙이 위에 있으면
 * 좁은 규칙은 아무것도 가져가지 못한 채 0으로 남는다.
 *
 * 학습자가 브랜드 규칙을 한 칸 위로 올리면 세션수가 나뉘는 것을 그 자리에서 본다.
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
  BRAND_RULE,
  ALL_RULE,
  RULE_COLUMNS,
  INITIAL_ORDER,
  buildRows,
  isFixed,
  BRAND_SESSIONS,
  ALL_SESSIONS_WRONG,
} from "./data";

const LAB_ID = "custom-channel-group";
const LAB_TITLE = "채널 그룹 직접 만들어 유입 분류 바꾸기";

/** 규칙 순서를 customEvents 자리에 담아 쓴다 */
const START_STATE: Ga4State = {
  ...INITIAL_STATE,
  adminPage: "property-settings",
  customEvents: INITIAL_ORDER,
};

const orderOf = (s: Ga4State) => s.customEvents ?? INITIAL_ORDER;

/* ===================== 스텝 ===================== */

const STEPS: TourStep[] = [
  {
    id: "open_groups",
    instruction: "왼쪽 관리 메뉴의 속성 묶음에서 채널 그룹을 누릅니다.",
    ring: "admin:channel-groups",
    isDone: (s) => s.adminPage === "channel-groups",
  },
  {
    id: "move_up",
    instruction: `${BRAND_RULE} 규칙이 ${ALL_RULE}보다 아래에 놓여 세션이 0회입니다. 오른쪽 화살표로 한 칸 위로 올립니다.`,
    ring: `rule:up:${BRAND_RULE}`,
    isDone: (s) => isFixed(orderOf(s)),
  },
];

const DONE_TEXT = `순서를 바꾸자 ${BRAND_RULE}가 ${BRAND_SESSIONS.toLocaleString("ko-KR")}회를 가져갑니다. 앞서 ${ALL_RULE}가 안고 있던 ${ALL_SESSIONS_WRONG.toLocaleString("ko-KR")}회 안에 브랜드 검색이 섞여 있었던 것입니다. 채널 그룹은 위에서부터 맞춰 보고 먼저 걸리는 규칙이 이기므로, 조건이 좁은 규칙을 위에 둡니다.`;

export default function CustomChannelGroupLab() {
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

  /** 규칙을 한 칸 위로 올린다 */
  function moveUp(name: string) {
    const order = [...orderOf(state)];
    const i = order.indexOf(name);
    if (i <= 0) return;
    [order[i - 1], order[i]] = [order[i], order[i - 1]];
    apply({ customEvents: order });
  }

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
          onOpenPage={(id) => apply({ adminPage: id })}
        >
          {page === "channel-groups" ? (
            <Ga4RuleAdmin
              title="맞춤 채널 그룹: 네이버 세분화"
              description="위에서부터 차례로 맞춰 보고 먼저 걸리는 규칙이 이깁니다. 기본 채널 그룹은 고칠 수 없어 새로 만들었습니다."
              createLabel="채널 그룹 만들기"
              columns={RULE_COLUMNS}
              rows={buildRows(orderOf(state))}
              onOpenCreate={() => undefined}
              onMoveUp={moveUp}
              markRow={done ? BRAND_RULE : null}
            />
          ) : (
            <Ga4OtherAdmin label={adminTitleOf(page)} backTo="채널 그룹" />
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
