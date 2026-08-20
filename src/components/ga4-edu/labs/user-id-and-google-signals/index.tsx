"use client";

/**
 * 심화 7번: 사용자 ID와 구글 신호 데이터로 기기 넘나드는 사용자 잇기.
 *
 * 보고 ID를 기기 기반에서 혼합으로 바꾸면 사용자 수가 12,480명에서 9,180명으로 줄어든다.
 * 방문이 줄어든 것이 아니라 같은 사람을 겹쳐 세지 않게 된 것이라는 점이 이 편의 핵심이다.
 */

import { useEffect, useState } from "react";
import { Ga4AdminShell, Ga4OtherAdmin, adminTitleOf } from "../../app/Ga4AdminShell";
import { Ga4ChoiceAdmin } from "../../app/Ga4ChoiceAdmin";
import { RingProvider, Ga4Guide } from "../../app/tour";
import { INITIAL_STATE, type Ga4State, type TourStep } from "../../app/types";
import { useStepEngine } from "../../lab/useStepEngine";
import {
  ACCOUNT_NAME,
  PROPERTY_NAME,
  SEARCH_HINT,
  CHOICES,
  START_CHOICE,
  TARGET_CHOICE,
  DEVICE_ONLY,
  summaryOf,
} from "./data";

const LAB_ID = "user-id-and-google-signals";
const LAB_TITLE = "사용자 ID와 구글 신호 데이터로 기기 넘나드는 사용자 잇기";

/** 고른 보고 ID를 createName 자리에 담아 쓴다 */
const START_STATE: Ga4State = {
  ...INITIAL_STATE,
  adminPage: "property-settings",
  createName: START_CHOICE,
};

const pickedOf = (s: Ga4State) => s.createName ?? START_CHOICE;

/* ===================== 스텝 ===================== */

const STEPS: TourStep[] = [
  {
    id: "open_identity",
    instruction: "왼쪽 관리 메뉴의 속성 묶음에서 보고 ID를 누릅니다.",
    ring: "admin:reporting-identity",
    isDone: (s) => s.adminPage === "reporting-identity",
  },
  {
    id: "pick_blended",
    instruction:
      "지금은 기기 기반이라 같은 사람이 기기마다 따로 잡힙니다. 사용자 ID와 기기 혼합을 고릅니다.",
    ring: `choice:${TARGET_CHOICE}`,
    isDone: (s) => pickedOf(s) === TARGET_CHOICE,
  },
];

const DONE_TEXT = `사용자 수가 ${summaryOf(DEVICE_ONLY)}에서 ${summaryOf(TARGET_CHOICE)}으로 줄었습니다. 방문이 줄어든 것이 아니라 휴대전화와 컴퓨터로 들어온 같은 사람을 겹쳐 세지 않게 된 것입니다. 보고 ID는 데이터를 바꾸지 않고 세는 방법만 바꾸므로, 언제든 되돌려도 그동안의 데이터는 그대로 있습니다.`;

export default function UserIdAndGoogleSignalsLab() {
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
          onOpenPage={(id) => apply({ adminPage: id })}
        >
          {page === "reporting-identity" ? (
            <Ga4ChoiceAdmin
              title="보고 ID"
              description="같은 사람을 어떻게 알아볼지 정합니다. 데이터를 바꾸지 않고 세는 방법만 바뀝니다."
              options={CHOICES}
              picked={pickedOf(state)}
              onPick={(key) => apply({ createName: key })}
              summaryLabel="이 방식으로 본 지난 28일 총 사용자"
            />
          ) : (
            <Ga4OtherAdmin label={adminTitleOf(page)} backTo="보고 ID" />
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
