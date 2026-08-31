"use client";

/**
 * 심화 1번: 기여 분석 모델 바꿔 채널 평가 비교하기.
 *
 * 같은 전환을 두 모델로 나눠 보면 채널마다 평가가 달라진다. 마지막 클릭으로 바꾸면
 * 유료 검색이 오르고 소셜이 절반 아래로 떨어지는데, 총 전환 수는 그대로다.
 *
 * 몫이 옮겨 다닐 뿐이라는 것을 표에서 직접 보게 하는 것이 이 편의 목적이다.
 */

import { useEffect, useState } from "react";
import { Ga4Attribution } from "../../app/Ga4Attribution";
import { RingProvider, Ga4Guide } from "../../app/tour";
import type { TourStep } from "../../app/types";
import { useStepEngine } from "../../lab/useStepEngine";
import {
  ACCOUNT_NAME,
  PROPERTY_NAME,
  SEARCH_HINT,
  BASE_MODEL,
  LAST_CLICK,
  COMPARE_OPTIONS,
  rowsFor,
  BIGGEST_DROP,
  DECOY_CHANNEL,
  TOTAL_CONVERSIONS,
} from "./data";

const LAB_ID = "attribution-model-comparison";
const LAB_TITLE = "기여 분석 모델 바꿔 채널 평가 비교하기";

interface AttrState {
  /** 고른 비교 모델. null이면 아직 고르기 전이다 */
  compare: string | null;
  listOpen: boolean;
  selected: string | null;
}

const START_STATE: AttrState = { compare: null, listOpen: false, selected: null };

/* ===================== 스텝 ===================== */

const STEPS: TourStep<AttrState>[] = [
  {
    id: "pick_model",
    instruction: "비교 모델 목록을 열고 마지막 클릭을 고릅니다.",
    ring: "attribution:model",
    isDone: (s) => s.compare === LAST_CLICK && s.listOpen === false,
  },
  {
    id: "find_drop",
    instruction: "모델을 바꾸자 평가가 크게 떨어진 채널이 있습니다. 변화율이 가장 낮은 줄을 누릅니다.",
    ring: null,
    isDone: (s) => s.selected === BIGGEST_DROP,
    isMiss: (s) => s.selected !== null && s.selected !== BIGGEST_DROP,
    missText: `${DECOY_CHANNEL}는 오히려 평가가 오른 채널입니다. 변화율이 마이너스로 가장 큰 줄을 찾아보세요.`,
    reset: { selected: null },
  },
];

const DONE_TEXT = `총 전환은 ${TOTAL_CONVERSIONS.toLocaleString("ko-KR")}건으로 두 모델이 같습니다. 채널 사이에서 몫만 옮겨 다닌 것입니다. 소셜이 마지막 클릭에서 절반 아래로 떨어지는 것은 성과가 없어서가 아니라 여정의 앞쪽에 서 있기 때문입니다. 비교 모델을 첫 번째 클릭으로 바꿔 보면 같은 채널이 반대로 오릅니다.`;

export default function AttributionModelComparisonLab() {
  const [pinned, setPinned] = useState(false);
  const { state, stepIndex, miss, done, step, ring, apply, restart } = useStepEngine<AttrState>({
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

  return (
    <RingProvider value={ring}>
      <div className={`ga4-stage${pinned ? " ga4-stage-pinned" : ""}`}>
        <Ga4Attribution
          account={ACCOUNT_NAME}
          property={PROPERTY_NAME}
          searchHint={SEARCH_HINT}
          pinned={pinned}
          onTogglePin={() => setPinned((v) => !v)}
          baseLabel={BASE_MODEL}
          compareLabel={state.compare ?? LAST_CLICK}
          compareOptions={COMPARE_OPTIONS}
          listOpen={state.listOpen}
          onToggleList={() => apply({ listOpen: !state.listOpen })}
          onPickCompare={(label) => apply({ compare: label, listOpen: false, selected: null })}
          rows={rowsFor(state.compare ?? LAST_CLICK)}
          compared={state.compare !== null}
          selectedRow={state.selected}
          onSelectRow={(channel) => apply({ selected: channel })}
          markRow={done ? BIGGEST_DROP : null}
        />

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
