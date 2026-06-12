/**
 * 챕터 1 통합 검증: 데이터 무결성 + 자동 플레이어로 전 루트 도달 가능성 증명.
 * - 최적 플레이 → 엔딩 A
 * - 검증 없는 좋은 플레이 → 폭탄 발각 후에도 보스 통과, 엔딩 B
 * - 최악 플레이 → 게임오버
 * - 연계 클래스 slug가 실제 콘텐츠로 존재
 */

import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";

import { gameReducer, getActiveTasks, getTaskById, initialState, isBossDay } from "../engine";
import { computeQ } from "../resolve";
import { CHAPTER1 } from "../scenarios/chapter1";
import type {
  ChapterSpec,
  PromptElement,
  StandardTask,
} from "../scenarios/schema";
import { validateChapter } from "../scenarios/validate";
import type { GameAction, GameState, TaskSelection } from "../types";

type Policy = (state: GameState, chapter: ChapterSpec) => GameAction;

function autoPlay(chapter: ChapterSpec, seed: number, policy: Policy): GameState {
  let state = initialState(chapter, seed);
  for (let step = 0; step < 1000; step += 1) {
    const kind = state.phase.kind;
    if (kind === "ending" || kind === "game_over") return state;
    const action = policy(state, chapter);
    const next = gameReducer(state, action, chapter);
    if (next === state) {
      throw new Error(`정책이 ${kind}에서 막힘: ${action.type}`);
    }
    state = next;
  }
  throw new Error("1000스텝 초과: 게임이 끝나지 않음");
}

function matchedCards(task: StandardTask, state: GameState): PromptElement[] {
  return task.requiredElements.filter((card) =>
    state.unlockedConcepts.includes(card),
  );
}

/** 최적 플레이: 함정을 읽고, 카드를 모아 위임하고, 수치는 검증한다 */
function bestMoveFor(
  task: StandardTask,
  state: GameState,
  useVerify: boolean,
): TaskSelection | null {
  const rt = state.tasks[task.id];
  const isRework = rt?.status === "rework";
  const directTime = isRework
    ? Math.max(1, task.directCost.time - 1)
    : task.directCost.time;

  if (task.tags.includes("trivial")) {
    return state.resources.time >= directTime
      ? { method: "direct", cards: [], verify: false }
      : null;
  }
  if (task.tags.includes("confidential")) {
    if (state.unlockedConcepts.includes("privacy")) {
      return state.resources.time >= 1
        ? { method: "delegate_anon", cards: matchedCards(task, state).slice(0, 3), verify: false }
        : null;
    }
    return state.resources.time >= directTime
      ? { method: "direct", cards: [], verify: false }
      : null;
  }

  const cards = matchedCards(task, state).slice(0, 3);
  const wantVerify =
    useVerify &&
    task.tags.includes("hallucination") &&
    state.unlockedConcepts.includes("verify");
  const selection: TaskSelection = { method: "delegate", cards, verify: wantVerify };
  const delegateTime = 1 + (wantVerify ? 1 : 0);

  if (computeQ(task, selection) >= 6 && state.resources.time >= delegateTime) {
    return selection;
  }
  if (state.resources.time >= directTime) {
    return { method: "direct", cards: [], verify: false };
  }
  return null;
}

function makeGoodPolicy(useVerify: boolean): Policy {
  return (state, chapter) => {
    switch (state.phase.kind) {
      case "overtime_choice":
        return { type: "OVERTIME_DECIDE", accept: true };
      case "boss_round": {
        if (state.phase.bombed) return { type: "ADVANCE" };
        const round = chapter.boss.rounds[state.phase.round];
        const available = round.options
          .filter(
            (o) =>
              (!o.requiresFlag || state.flags[o.requiresFlag]) &&
              (!o.requiresConcept ||
                state.unlockedConcepts.includes(o.requiresConcept)),
          )
          .sort((a, b) => b.score - a.score);
        return { type: "BOSS_ANSWER", optionId: available[0].id };
      }
      case "task": {
        const task = getTaskById(chapter, state, state.phase.taskId);
        if (!task) return { type: "CANCEL_TASK" };
        if (task.kind === "choice") {
          const options = task.options
            .filter(
              (o) =>
                !o.requiresConcept ||
                state.unlockedConcepts.includes(o.requiresConcept),
            )
            .filter((o) => o.cost.time <= state.resources.time)
            .sort((a, b) => (b.prepDelta ?? 0) - (a.prepDelta ?? 0));
          return { type: "CHOOSE_OPTION", taskId: task.id, optionId: options[0].id };
        }
        const move = bestMoveFor(task, state, useVerify);
        if (!move) return { type: "CANCEL_TASK" };
        return { type: "RESOLVE_TASK", taskId: task.id, selection: move };
      }
      case "task_select": {
        const open = getActiveTasks(chapter, state).filter((t) => {
          const rt = state.tasks[t.id];
          return rt && (rt.status === "open" || rt.status === "rework");
        });
        // 요구 카드를 전부 모은 업무 우선 (개념 해금 순서를 따라가는 자연 전략)
        const ranked = open
          .map((task) => {
            if (task.kind === "choice") {
              const doable = task.options.some(
                (o) =>
                  (!o.requiresConcept ||
                    state.unlockedConcepts.includes(o.requiresConcept)) &&
                  o.cost.time <= state.resources.time,
              );
              return doable ? { task, full: true } : null;
            }
            const move = bestMoveFor(task, state, useVerify);
            if (!move) return null;
            const full =
              matchedCards(task, state).length >= task.requiredElements.length;
            // 검증 미해금 상태의 환각 업무는 뒤로 미룬다
            const deferHallu =
              useVerify &&
              task.tags.includes("hallucination") &&
              !state.unlockedConcepts.includes("verify");
            return deferHallu && open.length > 1 ? null : { task, full };
          })
          .filter((entry) => entry !== null)
          .sort((a, b) => Number(b.full) - Number(a.full));
        if (ranked.length > 0) {
          return { type: "SELECT_TASK", taskId: ranked[0].task.id };
        }
        if (isBossDay(chapter, state.day)) return { type: "START_BOSS" };
        return { type: "REQUEST_DAY_END" };
      }
      default:
        return { type: "ADVANCE" };
    }
  };
}

/** 최악 플레이: 전부 빈 프롬프트 위임, 기밀도 위임, 야근 거절 */
const worstPolicy: Policy = (state, chapter) => {
  switch (state.phase.kind) {
    case "overtime_choice":
      return { type: "OVERTIME_DECIDE", accept: false };
    case "boss_round": {
      if (state.phase.bombed) return { type: "ADVANCE" };
      const round = chapter.boss.rounds[state.phase.round];
      const open = round.options
        .filter((o) => !o.requiresFlag && !o.requiresConcept)
        .sort((a, b) => a.score - b.score);
      return { type: "BOSS_ANSWER", optionId: open[0].id };
    }
    case "task": {
      const task = getTaskById(chapter, state, state.phase.taskId);
      if (!task) return { type: "CANCEL_TASK" };
      if (task.kind === "choice") {
        const options = task.options
          .filter((o) => !o.requiresConcept && o.cost.time <= state.resources.time)
          .sort((a, b) => (a.prepDelta ?? 0) - (b.prepDelta ?? 0));
        return { type: "CHOOSE_OPTION", taskId: task.id, optionId: options[0].id };
      }
      if (state.resources.time >= 1) {
        return {
          type: "RESOLVE_TASK",
          taskId: task.id,
          selection: { method: "delegate", cards: [], verify: false },
        };
      }
      return { type: "CANCEL_TASK" };
    }
    case "task_select": {
      const open = getActiveTasks(chapter, state).filter((t) => {
        const rt = state.tasks[t.id];
        return rt && (rt.status === "open" || rt.status === "rework");
      });
      if (open.length > 0 && state.resources.time >= 1) {
        return { type: "SELECT_TASK", taskId: open[0].id };
      }
      if (isBossDay(chapter, state.day)) return { type: "START_BOSS" };
      return { type: "REQUEST_DAY_END" };
    }
    default:
      return { type: "ADVANCE" };
  }
};

describe("챕터 1 데이터 무결성", () => {
  it("validateChapter 통과", () => {
    assert.deepEqual(validateChapter(CHAPTER1), []);
  });

  it("연계 클래스 slug가 실제 콘텐츠로 존재한다", () => {
    const slugs = new Set<string>();
    CHAPTER1.concepts.forEach((c) => slugs.add(c.classSlug));
    CHAPTER1.days.forEach((d) => d.insightSlugs.forEach((s) => slugs.add(s)));
    Object.values(CHAPTER1.gameOverTexts).forEach((t) => {
      if (t.classSlug) slugs.add(t.classSlug);
    });
    slugs.forEach((slug) => {
      const file =
        slug === "claude-fundamentals"
          ? path.join("content", "courses", `${slug}.md`)
          : path.join("content", "classes", `${slug}.md`);
      assert.ok(existsSync(file), `콘텐츠 없음: ${file}`);
    });
  });

  it("본문에 em dash가 없다", () => {
    const json = JSON.stringify(CHAPTER1);
    assert.ok(!json.includes("—"), "em dash 발견");
  });
});

describe("챕터 1 플레이스루", () => {
  it("최적 플레이는 엔딩 A(에이스)에 도달한다", () => {
    const final = autoPlay(CHAPTER1, 1, makeGoodPolicy(true));
    assert.equal(final.phase.kind, "ending");
    if (final.phase.kind === "ending") {
      assert.equal(final.phase.endingId, "ending-ace");
    }
    // 검증 플래그가 보스전 최고 선택지를 열었는지
    assert.equal(final.flags["verified:d2-market"], true);
  });

  it("검증을 모르는 좋은 플레이는 폭탄이 터지고 엔딩이 강등된다", () => {
    const final = autoPlay(CHAPTER1, 1, makeGoodPolicy(false));
    assert.equal(final.phase.kind, "ending");
    if (final.phase.kind === "ending") {
      assert.notEqual(final.phase.endingId, "ending-ace");
    }
    // 폭탄은 발각되어 해제됐다
    assert.equal(final.tasks["d2-market"]?.bombArmed, false);
  });

  it("최악 플레이는 게임오버된다", () => {
    const final = autoPlay(CHAPTER1, 1, worstPolicy);
    assert.equal(final.phase.kind, "game_over");
  });

  it("시드가 달라도 최적 플레이는 항상 완주한다 (돌발 업무 변형 안전)", () => {
    for (const seed of [2, 3, 4, 5, 6]) {
      const final = autoPlay(CHAPTER1, seed, makeGoodPolicy(true));
      assert.equal(final.phase.kind, "ending", `seed ${seed} 미완주`);
    }
  });
});
