/**
 * gameReducer: 턴제 상태 머신. React를 import하지 않는 순수 모듈.
 * UI는 액션만 dispatch하고, 모든 규칙은 여기와 resolve.ts에 있다.
 *
 * 흐름: title → intro → day_start → task_select ⇄ task → task_result
 *       → (coaching) → … → overtime_choice? → day_end → 다음 날
 *       마지막 날: task_select → START_BOSS → boss_intro → boss_round ⇄ boss_feedback
 *       → boss_result → ending | game_over
 */

import { applyResourceDelta, setFlags } from "./effects";
import { evaluateEnding } from "./endings";
import { resolveChoiceOption, resolveStandardTask } from "./resolve";
import { pickAt } from "./rng";
import type {
  ChapterSpec,
  CoachingEvent,
  DaySpec,
  StandardTask,
  TaskCard,
} from "./scenarios/schema";
import {
  BURNOUT_OVERTIME_STREAK,
  DEADLINE_FAIL_TRUST,
  OVERTIME_BLOCKS,
  OVERTIME_ENERGY_COST,
  PROMPT_SLOT_MAX,
  SECURITY_TRUST_HIT,
  type CheckpointData,
  type DaySummary,
  type GameAction,
  type GameState,
  type ResolvedOutcome,
  type TaskRuntime,
  type TaskSelection,
} from "./types";

export const BURNOUT_FLAG = "burnout";

// ---------- 조회 헬퍼 (UI 공용) ----------

export function getDaySpec(chapter: ChapterSpec, day: number): DaySpec {
  const spec = chapter.days.find((d) => d.day === day);
  if (!spec) throw new Error(`존재하지 않는 Day: ${day}`);
  return spec;
}

export function isBossDay(chapter: ChapterSpec, day: number): boolean {
  return day === chapter.days[chapter.days.length - 1].day;
}

/** 오늘 등장하는 업무 카드 (고정 + 추첨된 돌발) */
export function getActiveTasks(
  chapter: ChapterSpec,
  state: GameState,
): TaskCard[] {
  const spec = getDaySpec(chapter, state.day);
  const cards = [...spec.tasks];
  if (state.dayRt.surpriseTaskId && spec.surprisePool) {
    const surprise = spec.surprisePool.find(
      (t) => t.id === state.dayRt.surpriseTaskId,
    );
    if (surprise) cards.push(surprise);
  }
  return cards;
}

export function getTaskById(
  chapter: ChapterSpec,
  state: GameState,
  taskId: string,
): TaskCard | undefined {
  return getActiveTasks(chapter, state).find((t) => t.id === taskId);
}

function openRequiredTaskIds(chapter: ChapterSpec, state: GameState): string[] {
  return getActiveTasks(chapter, state)
    .filter((t) => {
      const rt = state.tasks[t.id];
      const unfinished = !rt || rt.status === "open" || rt.status === "rework";
      return unfinished && t.required;
    })
    .map((t) => t.id);
}

function hasOpenTasks(chapter: ChapterSpec, state: GameState): boolean {
  return getActiveTasks(chapter, state).some((t) => {
    const rt = state.tasks[t.id];
    return !rt || rt.status === "open" || rt.status === "rework";
  });
}

function dueCoaching(
  spec: DaySpec,
  state: GameState,
): CoachingEvent | undefined {
  return spec.coaching.find(
    (event) =>
      !state.dayRt.coachingDone.includes(event.id) &&
      state.dayRt.resolvedCount >= event.afterResolvedCount,
  );
}

// ---------- 상태 생성/전이 ----------

export function initialState(chapter: ChapterSpec, seed: number): GameState {
  return {
    version: 1,
    chapterId: chapter.id,
    seed,
    rngCursor: 0,
    phase: { kind: "intro" },
    day: 0,
    resources: {
      time: 0,
      energy: chapter.initial.energy,
      trust: chapter.initial.trust,
      kpi: 0,
    },
    tasks: {},
    dayRt: emptyDayRt(),
    unlockedConcepts: [],
    flags: {},
    securityIncidents: 0,
    consecutiveOvertime: 0,
    prepScore: 0,
    bossScore: 0,
    history: [],
    checkpoint: null,
  };
}

function emptyDayRt(): GameState["dayRt"] {
  return {
    resolvedCount: 0,
    overtimeUsed: false,
    lunchUsed: false,
    coffeeUsed: false,
    coachingDone: [],
    surpriseTaskId: undefined,
  };
}

function toCheckpoint(state: GameState): CheckpointData {
  const clone: Partial<GameState> = structuredClone(state);
  delete clone.checkpoint;
  return clone as CheckpointData;
}

function startDay(state: GameState, chapter: ChapterSpec, day: number): GameState {
  const spec = getDaySpec(chapter, day);

  let rngCursor = state.rngCursor;
  let surpriseTaskId: string | undefined;
  if (spec.surprisePool && spec.surprisePool.length > 0) {
    surpriseTaskId = pickAt(spec.surprisePool, state.seed, rngCursor).id;
    rngCursor += 1;
  }

  const tasks: Record<string, TaskRuntime> = { ...state.tasks };
  const cards = [...spec.tasks];
  if (surpriseTaskId) {
    const surprise = spec.surprisePool?.find((t) => t.id === surpriseTaskId);
    if (surprise) cards.push(surprise);
  }
  cards.forEach((card) => {
    tasks[card.id] = { status: "open", attempts: 0 };
  });

  const begun: GameState = {
    ...state,
    rngCursor,
    day,
    phase: { kind: "day_start" },
    resources: { ...state.resources, time: spec.timeBudget },
    tasks,
    dayRt: { ...emptyDayRt(), surpriseTaskId },
    checkpoint: null,
  };
  // 매일 아침 = 게임오버 재시작 체크포인트
  return { ...begun, checkpoint: toCheckpoint(begun) };
}

function isSelectionValid(
  task: StandardTask,
  selection: TaskSelection,
  state: GameState,
): boolean {
  if (selection.cards.length > PROMPT_SLOT_MAX) return false;
  const cardConceptOk = selection.cards.every((card) =>
    state.unlockedConcepts.includes(card),
  );
  if (!cardConceptOk) return false;
  if (selection.verify && !state.unlockedConcepts.includes("verify")) {
    return false;
  }
  if (selection.method === "delegate_anon") {
    if (!state.unlockedConcepts.includes("privacy")) return false;
    if (!task.tags.includes("confidential")) return false;
  }
  if (selection.method === "direct" && (selection.cards.length > 0 || selection.verify)) {
    return false;
  }
  return true;
}

function applyOutcome(
  state: GameState,
  task: TaskCard,
  outcome: ResolvedOutcome,
  method: GameState["history"][number]["method"],
): GameState {
  const prev = state.tasks[task.id] ?? { status: "open" as const, attempts: 0 };
  const nextStatus =
    outcome.tier === "rework"
      ? ("rework" as const)
      : outcome.tier === "fail"
        ? ("failed" as const)
        : ("done" as const);

  const trustExtra =
    (outcome.securityIncident ? SECURITY_TRUST_HIT : 0) +
    (outcome.tier === "fail" ? DEADLINE_FAIL_TRUST : 0);

  return {
    ...state,
    phase: { kind: "task_result", taskId: task.id, outcome },
    resources: applyResourceDelta(state.resources, {
      time: -outcome.timeCost,
      energy: -outcome.energyCost,
      trust: outcome.trustDelta + trustExtra,
      kpi: outcome.kpiDelta,
    }),
    tasks: {
      ...state.tasks,
      [task.id]: {
        status: nextStatus,
        attempts: prev.attempts + 1,
        resultTier: outcome.tier,
        q: outcome.q,
        verified: outcome.verified,
        bombArmed: outcome.bombArmed,
      },
    },
    flags: setFlags(state.flags, outcome.setFlags),
    securityIncidents:
      state.securityIncidents + (outcome.securityIncident ? 1 : 0),
    prepScore: state.prepScore + outcome.prepDelta,
    dayRt: {
      ...state.dayRt,
      resolvedCount: state.dayRt.resolvedCount + 1,
    },
    history: [
      ...state.history,
      {
        day: state.day,
        taskId: task.id,
        method,
        tier: outcome.tier,
        timeCost: outcome.timeCost,
        verified: outcome.verified,
      },
    ],
  };
}

function buildDaySummary(
  state: GameState,
  chapter: ChapterSpec,
  opts: { forced: boolean; failedIds: string[] },
): DaySummary {
  const spec = getDaySpec(chapter, state.day);
  const baseline = state.checkpoint?.resources;
  const todays = state.history.filter((record) => record.day === state.day);
  const titleOf = (taskId: string): string =>
    getTaskById(chapter, state, taskId)?.title ?? taskId;

  const fallbackConcepts = spec.fallbackConcepts.filter(
    (id) => !state.unlockedConcepts.includes(id),
  );
  const bombHint = todays.some(
    (record) => state.tasks[record.taskId]?.bombArmed,
  );

  return {
    day: state.day,
    results: todays.map((record) => ({
      taskId: record.taskId,
      title: titleOf(record.taskId),
      tier: record.tier,
    })),
    failedTaskIds: opts.failedIds,
    trustDelta: baseline ? state.resources.trust - baseline.trust : 0,
    kpiDelta: baseline ? state.resources.kpi - baseline.kpi : 0,
    overtime: state.dayRt.overtimeUsed,
    forced: opts.forced,
    // 탈진 강제 퇴근도 +3 회복: 다음 날 시작 불능(죽음의 나선) 방지
    energyRestored: opts.forced || state.dayRt.overtimeUsed ? 3 : 6,
    fallbackConcepts,
    bombHint,
    insightSlugs: spec.insightSlugs,
  };
}

/** 마감 실패 적용 + 정산 화면으로 전환 */
function endDay(
  state: GameState,
  chapter: ChapterSpec,
  opts: { forced: boolean },
): GameState {
  const failedIds = openRequiredTaskIds(chapter, state);

  const tasks = { ...state.tasks };
  failedIds.forEach((taskId) => {
    const prev = tasks[taskId] ?? { status: "open" as const, attempts: 0 };
    tasks[taskId] = { ...prev, status: "failed", resultTier: "fail" };
  });

  const failed: GameState = {
    ...state,
    tasks,
    resources: applyResourceDelta(state.resources, {
      trust: DEADLINE_FAIL_TRUST * failedIds.length,
    }),
  };

  const summary = buildDaySummary(failed, chapter, {
    forced: opts.forced,
    failedIds,
  });

  const nextOvertimeStreak = failed.dayRt.overtimeUsed
    ? failed.consecutiveOvertime + 1
    : 0;
  const flags =
    nextOvertimeStreak >= BURNOUT_OVERTIME_STREAK
      ? setFlags(failed.flags, [BURNOUT_FLAG])
      : failed.flags;

  return {
    ...failed,
    phase: { kind: "day_end", summary },
    resources: applyResourceDelta(failed.resources, {
      energy: summary.energyRestored,
    }),
    unlockedConcepts: [
      ...failed.unlockedConcepts,
      ...summary.fallbackConcepts,
    ],
    consecutiveOvertime: nextOvertimeStreak,
    flags,
  };
}

/** task_result/coaching 이후 다음 화면 라우팅 */
function continueAfterResult(state: GameState, chapter: ChapterSpec): GameState {
  if (state.resources.trust <= 0) {
    return { ...state, phase: { kind: "game_over", cause: "trust" } };
  }
  if (state.securityIncidents >= 2) {
    return { ...state, phase: { kind: "game_over", cause: "security" } };
  }
  if (state.resources.energy <= 0) {
    return endDay(state, chapter, { forced: true });
  }

  const spec = getDaySpec(chapter, state.day);
  const coaching = dueCoaching(spec, state);
  if (coaching) {
    return {
      ...state,
      phase: { kind: "coaching", eventId: coaching.id },
      dayRt: {
        ...state.dayRt,
        coachingDone: [...state.dayRt.coachingDone, coaching.id],
      },
      unlockedConcepts:
        coaching.grantConcept &&
        !state.unlockedConcepts.includes(coaching.grantConcept)
          ? [...state.unlockedConcepts, coaching.grantConcept]
          : state.unlockedConcepts,
    };
  }

  if (!hasOpenTasks(chapter, state)) {
    if (isBossDay(chapter, state.day)) {
      return { ...state, phase: { kind: "task_select" } };
    }
    return endDay(state, chapter, { forced: false });
  }

  if (state.resources.time <= 0) {
    return resolveOutOfTime(state, chapter);
  }

  return { ...state, phase: { kind: "task_select" } };
}

function resolveOutOfTime(state: GameState, chapter: ChapterSpec): GameState {
  const pendingFailIds = openRequiredTaskIds(chapter, state);
  if (pendingFailIds.length > 0 && !state.dayRt.overtimeUsed) {
    return { ...state, phase: { kind: "overtime_choice", pendingFailIds } };
  }
  return endDay(state, chapter, { forced: false });
}

// ---------- 보스전 ----------

function enterBossRound(state: GameState, chapter: ChapterSpec, round: number): GameState {
  if (round >= chapter.boss.rounds.length) {
    const totalScore = state.prepScore + state.bossScore;
    return {
      ...state,
      phase: {
        kind: "boss_result",
        passed: totalScore >= chapter.boss.passScore,
        totalScore,
      },
    };
  }
  const spec = chapter.boss.rounds[round];
  const bombed = Boolean(
    spec.bombTaskId && state.tasks[spec.bombTaskId]?.bombArmed,
  );
  return { ...state, phase: { kind: "boss_round", round, bombed } };
}

function applyBombReveal(state: GameState, chapter: ChapterSpec, round: number): GameState {
  const spec = chapter.boss.rounds[round];
  const bombTaskId = spec.bombTaskId;
  if (!bombTaskId) return enterBossRound(state, chapter, round + 1);

  const task = getTaskCardAnywhere(chapter, bombTaskId);
  const trustHit =
    task && task.kind === "standard" && task.bombTrustHit
      ? task.bombTrustHit
      : -15;

  const next: GameState = {
    ...state,
    resources: applyResourceDelta(state.resources, { trust: trustHit }),
    tasks: {
      ...state.tasks,
      [bombTaskId]: { ...state.tasks[bombTaskId], bombArmed: false },
    },
  };
  if (next.resources.trust <= 0) {
    return { ...next, phase: { kind: "game_over", cause: "trust" } };
  }
  return enterBossRound(next, chapter, round + 1);
}

/** 전 Day를 통틀어 카드 검색 (보스 폭탄은 과거 Day 업무) */
function getTaskCardAnywhere(
  chapter: ChapterSpec,
  taskId: string,
): TaskCard | undefined {
  for (const day of chapter.days) {
    const found =
      day.tasks.find((t) => t.id === taskId) ??
      day.surprisePool?.find((t) => t.id === taskId);
    if (found) return found;
  }
  return undefined;
}

// ---------- reducer ----------

export function gameReducer(
  state: GameState,
  action: GameAction,
  chapter: ChapterSpec,
): GameState {
  switch (action.type) {
    case "NEW_GAME":
      return initialState(chapter, action.seed);

    case "LOAD":
      return action.saved;

    case "QUIT_TO_TITLE":
      return { ...state, phase: { kind: "title" } };

    case "ADVANCE":
      return handleAdvance(state, chapter);

    case "SELECT_TASK": {
      if (state.phase.kind !== "task_select") return state;
      const task = getTaskById(chapter, state, action.taskId);
      const rt = state.tasks[action.taskId];
      const open = rt && (rt.status === "open" || rt.status === "rework");
      if (!task || !open) return state;
      return { ...state, phase: { kind: "task", taskId: action.taskId } };
    }

    case "CANCEL_TASK":
      if (state.phase.kind !== "task") return state;
      return { ...state, phase: { kind: "task_select" } };

    case "RESOLVE_TASK": {
      if (state.phase.kind !== "task" || state.phase.taskId !== action.taskId) {
        return state;
      }
      const task = getTaskById(chapter, state, action.taskId);
      if (!task || task.kind !== "standard") return state;
      if (!isSelectionValid(task, action.selection, state)) return state;

      const rt = state.tasks[task.id];
      const ctx = {
        isRework: rt?.status === "rework",
        burnout: Boolean(state.flags[BURNOUT_FLAG]),
      };
      const outcome = resolveStandardTask(task, action.selection, ctx);
      if (outcome.timeCost > state.resources.time) return state;
      return applyOutcome(state, task, outcome, action.selection.method);
    }

    case "CHOOSE_OPTION": {
      if (state.phase.kind !== "task" || state.phase.taskId !== action.taskId) {
        return state;
      }
      const task = getTaskById(chapter, state, action.taskId);
      if (!task || task.kind !== "choice") return state;
      const option = task.options.find((o) => o.id === action.optionId);
      if (!option) return state;
      if (
        option.requiresConcept &&
        !state.unlockedConcepts.includes(option.requiresConcept)
      ) {
        return state;
      }
      const outcome = resolveChoiceOption(task, option);
      if (outcome.timeCost > state.resources.time) return state;
      return applyOutcome(state, task, outcome, "choice");
    }

    case "REST": {
      if (state.phase.kind !== "task_select") return state;
      if (action.rest === "lunch") {
        if (state.dayRt.lunchUsed || state.resources.time < 1) return state;
        return {
          ...state,
          resources: applyResourceDelta(state.resources, { time: -1, energy: 3 }),
          dayRt: { ...state.dayRt, lunchUsed: true },
        };
      }
      if (state.dayRt.coffeeUsed) return state;
      return {
        ...state,
        resources: applyResourceDelta(state.resources, { energy: 2 }),
        dayRt: { ...state.dayRt, coffeeUsed: true },
      };
    }

    case "REQUEST_DAY_END": {
      if (state.phase.kind !== "task_select") return state;
      if (isBossDay(chapter, state.day)) {
        return startBoss(state, chapter);
      }
      const pendingFailIds = openRequiredTaskIds(chapter, state);
      if (pendingFailIds.length > 0 && !state.dayRt.overtimeUsed) {
        return { ...state, phase: { kind: "overtime_choice", pendingFailIds } };
      }
      return endDay(state, chapter, { forced: false });
    }

    case "OVERTIME_DECIDE": {
      if (state.phase.kind !== "overtime_choice") return state;
      if (!action.accept) {
        return endDay(state, chapter, { forced: false });
      }
      return {
        ...state,
        phase: { kind: "task_select" },
        resources: applyResourceDelta(state.resources, {
          time: OVERTIME_BLOCKS,
          energy: -OVERTIME_ENERGY_COST,
        }),
        dayRt: { ...state.dayRt, overtimeUsed: true },
      };
    }

    case "START_BOSS": {
      if (state.phase.kind !== "task_select") return state;
      if (!isBossDay(chapter, state.day)) return state;
      return startBoss(state, chapter);
    }

    case "BOSS_ANSWER": {
      if (state.phase.kind !== "boss_round" || state.phase.bombed) return state;
      const round = chapter.boss.rounds[state.phase.round];
      const option = round.options.find((o) => o.id === action.optionId);
      if (!option) return state;
      if (option.requiresFlag && !state.flags[option.requiresFlag]) return state;
      return {
        ...state,
        bossScore: state.bossScore + option.score,
        phase: {
          kind: "boss_feedback",
          round: state.phase.round,
          optionId: option.id,
          score: option.score,
        },
      };
    }

    case "RESTART_CHECKPOINT": {
      if (state.phase.kind !== "game_over" || !state.checkpoint) return state;
      const restored = structuredClone(state.checkpoint);
      // 습득 개념은 유지: 실패가 학습이 되는 핵심 장치
      const mergedConcepts = [
        ...restored.unlockedConcepts,
        ...state.unlockedConcepts.filter(
          (id) => !restored.unlockedConcepts.includes(id),
        ),
      ];
      return {
        ...restored,
        unlockedConcepts: mergedConcepts,
        checkpoint: state.checkpoint,
      };
    }

    default:
      return state;
  }
}

function startBoss(state: GameState, chapter: ChapterSpec): GameState {
  // 미완 필수 잔무는 보고 들어가는 순간 마감 실패
  const failedIds = openRequiredTaskIds(chapter, state);
  const tasks = { ...state.tasks };
  failedIds.forEach((taskId) => {
    const prev = tasks[taskId] ?? { status: "open" as const, attempts: 0 };
    tasks[taskId] = { ...prev, status: "failed", resultTier: "fail" };
  });
  const next: GameState = {
    ...state,
    tasks,
    resources: applyResourceDelta(state.resources, {
      trust: DEADLINE_FAIL_TRUST * failedIds.length,
    }),
  };
  if (next.resources.trust <= 0) {
    return { ...next, phase: { kind: "game_over", cause: "trust" } };
  }
  return { ...next, phase: { kind: "boss_intro" } };
}

function handleAdvance(state: GameState, chapter: ChapterSpec): GameState {
  switch (state.phase.kind) {
    case "intro":
      return startDay(state, chapter, chapter.days[0].day);

    case "day_start":
      return { ...state, phase: { kind: "task_select" } };

    case "task_result":
    case "coaching":
      return continueAfterResult(state, chapter);

    case "day_end": {
      if (state.resources.trust <= 0) {
        return { ...state, phase: { kind: "game_over", cause: "trust" } };
      }
      const index = chapter.days.findIndex((d) => d.day === state.day);
      const nextDay = chapter.days[index + 1];
      if (nextDay) return startDay(state, chapter, nextDay.day);
      // 안전망: 보스 데이가 아닌데 마지막 날이면 엔딩 평가
      return {
        ...state,
        phase: { kind: "ending", endingId: evaluateEnding(chapter, state.resources).id },
      };
    }

    case "boss_intro":
      return enterBossRound(state, chapter, 0);

    case "boss_round":
      // 폭탄 발각 라운드는 ADVANCE로만 진행 (자동 실패)
      if (state.phase.bombed) {
        return applyBombReveal(state, chapter, state.phase.round);
      }
      return state;

    case "boss_feedback":
      return enterBossRound(state, chapter, state.phase.round + 1);

    case "boss_result": {
      if (state.phase.passed) {
        return {
          ...state,
          phase: {
            kind: "ending",
            endingId: evaluateEnding(chapter, state.resources).id,
          },
        };
      }
      return { ...state, phase: { kind: "game_over", cause: "boss" } };
    }

    default:
      return state;
  }
}
