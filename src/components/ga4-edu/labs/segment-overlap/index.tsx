"use client";

/**
 * 심화 9번: 세그먼트 중복분석으로 겹치는 사용자 찾기.
 *
 * 세그먼트를 하나씩 보면 알 수 없는 것이 겹침이다. 구매자가 1,240명이고 신규 사용자가
 * 4,960명이라는 사실만으로는 신규가 얼마나 사는지 알 수 없다.
 *
 * 학습자는 표에서 신규이면서 구매한 조합을 찾아 그 수가 생각보다 적다는 것을 확인한다.
 */

import { useEffect, useState } from "react";
import { Ga4ExploreShell } from "../../app/Ga4ExploreShell";
import { Ga4Overlap } from "../../app/Ga4Overlap";
import { RingProvider, Ga4Guide } from "../../app/tour";
import type { TourStep } from "../../app/types";
import { useStepEngine } from "../../lab/useStepEngine";
import {
  ACCOUNT_NAME,
  PROPERTY_NAME,
  SEARCH_HINT,
  EXPLORATION_NAME,
  DATE_LABEL,
  SEGMENTS,
  TOTALS,
  AREAS,
  NEW_BUYER_LABEL,
  DECOY_LABEL,
  NEW_BUYERS,
  RETURNING_BUYERS,
} from "./data";

const LAB_ID = "segment-overlap";
const LAB_TITLE = "세그먼트 중복분석으로 겹치는 사용자 찾기";

interface OverlapState {
  selected: string | null;
}

const START_STATE: OverlapState = { selected: null };

/* ===================== 스텝 ===================== */

const STEPS: TourStep<OverlapState>[] = [
  {
    id: "find_new_buyer",
    instruction:
      "표에서 신규 사용자이면서 구매까지 한 사람의 조합을 누릅니다. 모바일은 빼고 두 세그먼트만 겹친 줄입니다.",
    ring: null,
    isDone: (s) => s.selected === NEW_BUYER_LABEL,
    isMiss: (s) => s.selected !== null && s.selected !== NEW_BUYER_LABEL,
    missText: `${DECOY_LABEL}은 구매가 빠진 조합입니다. 구매자와 신규 사용자만 겹친 줄을 찾아보세요.`,
    reset: { selected: null },
  },
];

const DONE_TEXT = `신규이면서 구매한 사람은 이 줄 120명에 모바일까지 겹친 440명을 더해 ${NEW_BUYERS.toLocaleString("ko-KR")}명입니다. 구매자 1,240명 가운데 나머지 ${RETURNING_BUYERS.toLocaleString("ko-KR")}명은 전에 왔던 사람입니다. 신규 유입을 늘리는 것보다 이미 온 사람이 다시 오게 만드는 쪽이 구매로 이어지고 있다는 뜻입니다.`;

export default function SegmentOverlapLab() {
  const [pinned, setPinned] = useState(false);
  const { state, stepIndex, miss, done, step, ring, apply, restart } =
    useStepEngine<OverlapState>({
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
        <Ga4ExploreShell
          account={ACCOUNT_NAME}
          property={PROPERTY_NAME}
          searchHint={SEARCH_HINT}
          pinned={pinned}
          onTogglePin={() => setPinned((v) => !v)}
        >
          <Ga4Overlap
            name={EXPLORATION_NAME}
            dateLabel={DATE_LABEL}
            segments={SEGMENTS}
            totals={TOTALS}
            areas={AREAS}
            selected={state.selected}
            onSelect={(label) => apply({ selected: label })}
            markArea={done ? NEW_BUYER_LABEL : null}
          />
        </Ga4ExploreShell>

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
