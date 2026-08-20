"use client";

/**
 * 중급 10번: 경로 탐색으로 다음 화면 흐름 따라가기.
 *
 * 시작점의 노드를 눌러 다음 열을 펼치고, 그 안에서 사람이 가장 많이 간 화면을 짚는다.
 * 마지막에는 두 열의 합을 견줘 나간 사람이 그려지지 않는다는 것을 확인한다.
 *
 * 경로 탐색은 간 사람만 그린다. 나간 사람은 노드가 없어서 합을 빼야 드러난다.
 */

import { useEffect, useState } from "react";
import { Ga4ExploreShell, Ga4ExploreHome } from "../../app/Ga4ExploreShell";
import { Ga4Path, type PathColumn } from "../../app/Ga4Path";
import { RingProvider, Ga4Guide } from "../../app/tour";
import type { TourStep } from "../../app/types";
import { useStepEngine } from "../../lab/useStepEngine";
import {
  ACCOUNT_NAME,
  PROPERTY_NAME,
  SEARCH_HINT,
  EXPLORATION_NAME,
  DATE_LABEL,
  NODE_LABEL,
  START_COLUMN,
  nextColumnFor,
  TOP_START,
  TOP_NEXT,
  HOME_USERS,
  HOME_EXIT,
} from "./data";

const LAB_ID = "path-exploration";
const LAB_TITLE = "경로 탐색으로 다음 화면 흐름 따라가기";

interface PathState {
  screen: "home" | "path";
  /** 펼쳐 둔 시작 노드 이름. null이면 시작점 열만 있다 */
  expanded: string | null;
  /** 학습자가 고른 노드 */
  selected: string | null;
}

const START_STATE: PathState = { screen: "home", expanded: null, selected: null };

/* ===================== 스텝 ===================== */

const STEPS: TourStep<PathState>[] = [
  {
    id: "open_path",
    instruction: "탐색 분석 화면에서 빨간 상자가 그려진 경로 탐색 분석을 누릅니다.",
    ring: "template:path",
    isDone: (s) => s.screen === "path",
  },
  {
    id: "expand_home",
    instruction: `시작점에서 사람이 가장 많은 ${TOP_START} 노드를 눌러 다음 단계를 펼칩니다.`,
    ring: `path:${TOP_START}`,
    isDone: (s) => s.expanded === TOP_START,
  },
  {
    id: "pick_next",
    instruction: "펼쳐진 다음 단계에서 사람이 가장 많이 간 화면을 누릅니다.",
    ring: null,
    isDone: (s) => s.selected === TOP_NEXT,
    isMiss: (s) =>
      s.selected !== null && s.selected !== TOP_NEXT && s.selected !== TOP_START,
    missText: "막대가 가장 긴 줄을 다시 보세요. 오른쪽 숫자가 사용자 수입니다.",
    reset: { selected: null },
  },
];

const DONE_TEXT = `${TOP_START}에서 시작한 ${HOME_USERS.toLocaleString("ko-KR")}명 가운데 다음 화면으로 간 사람은 ${(HOME_USERS - HOME_EXIT).toLocaleString("ko-KR")}명입니다. 나머지 ${HOME_EXIT.toLocaleString("ko-KR")}명은 첫 화면에서 나갔는데, 경로 탐색은 간 사람만 그리므로 이 수는 노드로 보이지 않습니다. 두 열의 합을 빼야 드러납니다.`;

export default function PathExplorationLab() {
  const [pinned, setPinned] = useState(false);
  const { state, stepIndex, miss, done, step, ring, apply, restart } =
    useStepEngine<PathState>({
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

  const columns: PathColumn[] = [START_COLUMN];
  if (state.expanded) {
    const next = nextColumnFor(state.expanded);
    if (next) columns.push(next);
  }

  /** 시작점 열을 누르면 펼치고, 다음 열을 누르면 고른 것으로 본다 */
  function selectNode(column: number, node: string) {
    if (column === 0) {
      apply({ expanded: node, selected: node });
      return;
    }
    apply({ selected: node });
  }

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
          {state.screen === "home" ? (
            <Ga4ExploreHome
              propertyName={ACCOUNT_NAME}
              onOpenTemplate={(id) => apply({ screen: id === "path" ? "path" : "home" })}
            />
          ) : (
            <Ga4Path
              name={EXPLORATION_NAME}
              dateLabel={DATE_LABEL}
              nodeLabel={NODE_LABEL}
              columns={columns}
              selected={state.selected}
              onSelectNode={selectNode}
              markNode={done ? TOP_NEXT : null}
            />
          )}
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
