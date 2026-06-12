import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { gameReducer, initialState } from "../engine";
import type { GameAction, GameState, TaskSelection } from "../types";
import { TEST_CHAPTER } from "./fixtures";

function run(state: GameState, ...actions: GameAction[]): GameState {
  return actions.reduce(
    (current, action) => gameReducer(current, action, TEST_CHAPTER),
    state,
  );
}

const direct: TaskSelection = { method: "direct", cards: [], verify: false };

function freshDay1(): GameState {
  // title → intro → day_start → task_select
  const start = initialState(TEST_CHAPTER, 1);
  return run(start, { type: "ADVANCE" }, { type: "ADVANCE" });
}

describe("게임 시작과 하루 개시", () => {
  it("NEW_GAME → intro → day_start → task_select", () => {
    const state = initialState(TEST_CHAPTER, 1);
    assert.equal(state.phase.kind, "intro");
    const day = run(state, { type: "ADVANCE" });
    assert.equal(day.phase.kind, "day_start");
    assert.equal(day.day, 1);
    assert.equal(day.resources.time, 6);
    assert.ok(day.checkpoint, "아침 체크포인트가 저장된다");
    const select = run(day, { type: "ADVANCE" });
    assert.equal(select.phase.kind, "task_select");
  });
});

describe("업무 처리와 코칭", () => {
  it("직접 처리 → 결과 → 코칭(개념 해금) → 업무 선택", () => {
    let state = freshDay1();
    state = run(
      state,
      { type: "SELECT_TASK", taskId: "t-basic" },
      { type: "RESOLVE_TASK", taskId: "t-basic", selection: direct },
    );
    assert.equal(state.phase.kind, "task_result");
    assert.equal(state.resources.time, 3);
    assert.equal(state.resources.trust, 54);

    state = run(state, { type: "ADVANCE" });
    assert.equal(state.phase.kind, "coaching");
    assert.ok(state.unlockedConcepts.includes("role"));

    state = run(state, { type: "ADVANCE" });
    assert.equal(state.phase.kind, "task_select");
  });

  it("시간이 모자라면 처리 자체가 거부된다", () => {
    let state = freshDay1();
    // t-hallu 직접 4블록 → 잔여 2블록
    state = run(
      state,
      { type: "SELECT_TASK", taskId: "t-hallu" },
      { type: "RESOLVE_TASK", taskId: "t-hallu", selection: direct },
      { type: "ADVANCE" }, // result
      { type: "ADVANCE" }, // coaching c-role
    );
    assert.equal(state.resources.time, 2);
    const before = run(state, { type: "SELECT_TASK", taskId: "t-basic" });
    const after = run(before, {
      type: "RESOLVE_TASK",
      taskId: "t-basic",
      selection: direct, // 3블록 필요 > 2블록
    });
    assert.equal(after, before, "불가능한 액션은 상태를 바꾸지 않는다");
  });

  it("미해금 카드/검증은 거부된다", () => {
    const state = run(freshDay1(), { type: "SELECT_TASK", taskId: "t-basic" });
    const withCards = run(state, {
      type: "RESOLVE_TASK",
      taskId: "t-basic",
      selection: { method: "delegate", cards: ["role"], verify: false },
    });
    assert.equal(withCards, state);
    const withVerify = run(state, {
      type: "RESOLVE_TASK",
      taskId: "t-basic",
      selection: { method: "delegate", cards: [], verify: true },
    });
    assert.equal(withVerify, state);
  });
});

describe("휴식", () => {
  it("점심은 1블록으로 에너지 +3, 하루 1회", () => {
    let state = freshDay1();
    state = run(
      state,
      { type: "SELECT_TASK", taskId: "t-basic" },
      { type: "RESOLVE_TASK", taskId: "t-basic", selection: direct },
      { type: "ADVANCE" },
      { type: "ADVANCE" },
    );
    const energy = state.resources.energy;
    state = run(state, { type: "REST", rest: "lunch" });
    assert.equal(state.resources.energy, Math.min(10, energy + 3));
    assert.equal(state.resources.time, 2);
    const again = run(state, { type: "REST", rest: "lunch" });
    assert.equal(again, state);
  });
});

describe("야근과 마감", () => {
  it("시간 소진 + 필수 미완 → 야근 선택 → 수락 시 +2블록", () => {
    let state = freshDay1();
    // 시간 6을 필수 아닌 일에 소모: hallu 직접(4) + triv 직접(1) + choice(1)
    state = run(
      state,
      { type: "SELECT_TASK", taskId: "t-hallu" },
      { type: "RESOLVE_TASK", taskId: "t-hallu", selection: direct },
      { type: "ADVANCE" },
      { type: "ADVANCE" }, // coaching c-role
      { type: "REST", rest: "coffee" }, // 에너지 보충 (야근 대비)
      { type: "SELECT_TASK", taskId: "t-triv" },
      { type: "RESOLVE_TASK", taskId: "t-triv", selection: direct },
      { type: "ADVANCE" },
      { type: "ADVANCE" }, // coaching c-context
      { type: "SELECT_TASK", taskId: "t-choice" },
      { type: "CHOOSE_OPTION", taskId: "t-choice", optionId: "opt-flatter" },
      { type: "ADVANCE" },
    );
    // 시간 0, 필수 t-basic 미완 → 야근 선택지
    assert.equal(state.phase.kind, "overtime_choice");
    const energy = state.resources.energy;

    state = run(state, { type: "OVERTIME_DECIDE", accept: true });
    assert.equal(state.phase.kind, "task_select");
    assert.equal(state.resources.time, 2);
    assert.equal(state.resources.energy, energy - 4);

    // 해금된 카드로 AI 위임 → 통과
    state = run(
      state,
      { type: "SELECT_TASK", taskId: "t-basic" },
      {
        type: "RESOLVE_TASK",
        taskId: "t-basic",
        selection: { method: "delegate", cards: ["role", "context"], verify: false },
      },
      { type: "ADVANCE" },
      { type: "REQUEST_DAY_END" },
    );
    assert.equal(state.phase.kind, "day_end");
    if (state.phase.kind === "day_end") {
      assert.equal(state.phase.summary.overtime, true);
      assert.equal(state.phase.summary.forced, false);
      assert.equal(state.phase.summary.energyRestored, 3);
    }
  });

  it("야근 거절 시 필수 업무는 마감 실패 + 신뢰 페널티", () => {
    let state = freshDay1();
    state = run(
      state,
      { type: "SELECT_TASK", taskId: "t-hallu" },
      { type: "RESOLVE_TASK", taskId: "t-hallu", selection: direct },
      { type: "ADVANCE" },
      { type: "ADVANCE" },
      { type: "SELECT_TASK", taskId: "t-triv" },
      { type: "RESOLVE_TASK", taskId: "t-triv", selection: direct },
      { type: "ADVANCE" },
      { type: "ADVANCE" },
      { type: "SELECT_TASK", taskId: "t-choice" },
      { type: "CHOOSE_OPTION", taskId: "t-choice", optionId: "opt-flatter" },
      { type: "ADVANCE" },
    );
    const trustBefore = state.resources.trust;
    state = run(state, { type: "OVERTIME_DECIDE", accept: false });
    assert.equal(state.phase.kind, "day_end");
    assert.equal(state.resources.trust, trustBefore - 12 + 0);
    assert.equal(state.tasks["t-basic"].status, "failed");
  });
});

describe("하루 정산", () => {
  it("반려 → 재작업 통과 → 미습득 개념은 정산에서 회고로 지급 (진행 보장)", () => {
    let state = freshDay1();
    state = run(
      state,
      { type: "SELECT_TASK", taskId: "t-basic" },
      { type: "RESOLVE_TASK", taskId: "t-basic", selection: direct },
      { type: "ADVANCE" },
      { type: "ADVANCE" }, // coaching c-role
      // 빈 프롬프트는 Q=3 → 반려
      { type: "SELECT_TASK", taskId: "t-hallu" },
      {
        type: "RESOLVE_TASK",
        taskId: "t-hallu",
        selection: { method: "delegate", cards: [], verify: false },
      },
      { type: "ADVANCE" },
      { type: "ADVANCE" }, // coaching c-context
    );
    assert.equal(state.tasks["t-hallu"].status, "rework");

    // 재작업: 카드 2장으로 통과
    state = run(
      state,
      { type: "SELECT_TASK", taskId: "t-hallu" },
      {
        type: "RESOLVE_TASK",
        taskId: "t-hallu",
        selection: { method: "delegate", cards: ["role", "context"], verify: false },
      },
      { type: "ADVANCE" },
      { type: "REQUEST_DAY_END" },
    );
    assert.equal(state.phase.kind, "day_end");
    assert.equal(state.tasks["t-hallu"].status, "done");
    assert.ok(state.unlockedConcepts.includes("verify"));
    assert.ok(state.unlockedConcepts.includes("privacy"));
  });

  it("정산 후 다음 날이 시작된다", () => {
    let state = freshDay1();
    state = run(
      state,
      { type: "SELECT_TASK", taskId: "t-basic" },
      { type: "RESOLVE_TASK", taskId: "t-basic", selection: direct },
      { type: "ADVANCE" },
      { type: "ADVANCE" }, // c-role
      { type: "SELECT_TASK", taskId: "t-triv" },
      { type: "RESOLVE_TASK", taskId: "t-triv", selection: direct },
      { type: "ADVANCE" },
      { type: "ADVANCE" }, // c-context
      { type: "SELECT_TASK", taskId: "t-hallu" },
      {
        type: "RESOLVE_TASK",
        taskId: "t-hallu",
        selection: { method: "delegate", cards: ["role", "context"], verify: false },
      },
      { type: "ADVANCE" },
      { type: "REQUEST_DAY_END" },
      { type: "ADVANCE" },
    );
    assert.equal(state.phase.kind, "day_start");
    assert.equal(state.day, 2);
    assert.equal(state.resources.time, 4);
  });
});

describe("보스전: 폭탄 발각 루트", () => {
  function reachBossWithBomb(): GameState {
    const state = freshDay1();
    return run(
      state,
      { type: "SELECT_TASK", taskId: "t-basic" },
      { type: "RESOLVE_TASK", taskId: "t-basic", selection: direct },
      { type: "ADVANCE" },
      { type: "ADVANCE" }, // c-role
      { type: "SELECT_TASK", taskId: "t-triv" },
      { type: "RESOLVE_TASK", taskId: "t-triv", selection: direct },
      { type: "ADVANCE" },
      { type: "ADVANCE" }, // c-context
      // 환각 업무를 미검증 위임 → 폭탄 장전
      { type: "SELECT_TASK", taskId: "t-hallu" },
      {
        type: "RESOLVE_TASK",
        taskId: "t-hallu",
        selection: { method: "delegate", cards: ["role", "context"], verify: false },
      },
      { type: "ADVANCE" },
      { type: "REQUEST_DAY_END" },
      { type: "ADVANCE" }, // day 2 시작
      { type: "ADVANCE" }, // task_select
      { type: "SELECT_TASK", taskId: "t-d2" },
      { type: "RESOLVE_TASK", taskId: "t-d2", selection: direct },
      { type: "ADVANCE" },
      { type: "START_BOSS" },
    );
  }

  it("미검증 제출은 보스전에서 발각된다", () => {
    let state = reachBossWithBomb();
    assert.equal(state.phase.kind, "boss_intro");
    assert.equal(state.tasks["t-hallu"].bombArmed, true);

    state = run(state, { type: "ADVANCE" });
    assert.equal(state.phase.kind, "boss_round");

    // 검증 안 했으므로 requiresFlag 선택지는 거부
    const blocked = run(state, { type: "BOSS_ANSWER", optionId: "r1-best" });
    assert.equal(blocked, state);

    state = run(state, { type: "BOSS_ANSWER", optionId: "r1-ok" }); // +3
    assert.equal(state.phase.kind, "boss_feedback");

    const trustBefore = state.resources.trust;
    state = run(state, { type: "ADVANCE" });
    // r2는 폭탄 라운드로 교체
    assert.equal(state.phase.kind, "boss_round");
    if (state.phase.kind === "boss_round") assert.equal(state.phase.bombed, true);

    state = run(state, { type: "ADVANCE" }); // 발각: 신뢰 -15, 라운드 자동 실패
    assert.equal(state.resources.trust, trustBefore - 15);
    assert.equal(state.phase.kind, "boss_result");
    if (state.phase.kind === "boss_result") {
      // prep 1 + QA 3 = 4 < 6 → 실패
      assert.equal(state.phase.passed, false);
    }

    state = run(state, { type: "ADVANCE" });
    assert.equal(state.phase.kind, "game_over");
    if (state.phase.kind === "game_over") assert.equal(state.phase.cause, "boss");
  });

  it("게임오버 재시작은 그날 아침으로 + 개념은 유지", () => {
    let state = reachBossWithBomb();
    state = run(
      state,
      { type: "ADVANCE" },
      { type: "BOSS_ANSWER", optionId: "r1-bad" },
      { type: "ADVANCE" },
      { type: "ADVANCE" }, // 폭탄
      { type: "ADVANCE" }, // boss_result(실패) → game_over
    );
    assert.equal(state.phase.kind, "game_over");
    const concepts = [...state.unlockedConcepts];

    const restored = run(state, { type: "RESTART_CHECKPOINT" });
    assert.equal(restored.phase.kind, "day_start");
    assert.equal(restored.day, 2);
    assert.deepEqual(restored.unlockedConcepts, concepts);
    assert.ok(restored.checkpoint, "체크포인트는 유지된다");
  });
});

describe("보스전: 검증 루트", () => {
  it("폭탄이 없으면 정상 라운드로 진행되고 엔딩에 도달한다", () => {
    let state = freshDay1();
    // 환각 업무를 직접 조사(비싸지만 안전) → 폭탄 없음
    state = run(
      state,
      { type: "SELECT_TASK", taskId: "t-hallu" },
      { type: "RESOLVE_TASK", taskId: "t-hallu", selection: direct }, // 4블록
      { type: "ADVANCE" },
      { type: "ADVANCE" }, // c-role
      { type: "REST", rest: "coffee" },
      { type: "REQUEST_DAY_END" }, // t-basic 미완(필수) → 야근 선택
    );
    assert.equal(state.phase.kind, "overtime_choice");
    state = run(
      state,
      { type: "OVERTIME_DECIDE", accept: true }, // 시간 4, 에너지 -4
      { type: "SELECT_TASK", taskId: "t-basic" },
      { type: "RESOLVE_TASK", taskId: "t-basic", selection: direct },
      { type: "ADVANCE" },
      { type: "ADVANCE" }, // c-context
      { type: "REQUEST_DAY_END" },
      { type: "ADVANCE" }, // day 2
      { type: "ADVANCE" },
      { type: "SELECT_TASK", taskId: "t-d2" },
      { type: "RESOLVE_TASK", taskId: "t-d2", selection: direct },
      { type: "ADVANCE" },
      { type: "START_BOSS" },
      { type: "ADVANCE" },
      { type: "BOSS_ANSWER", optionId: "r1-ok" }, // +3
      { type: "ADVANCE" },
    );
    // 직접 처리라 폭탄 없음 → r2 정상 라운드
    assert.equal(state.phase.kind, "boss_round");
    if (state.phase.kind === "boss_round") assert.equal(state.phase.bombed, false);

    state = run(
      state,
      { type: "BOSS_ANSWER", optionId: "r2-ok" }, // +4
      { type: "ADVANCE" },
    );
    assert.equal(state.phase.kind, "boss_result");
    if (state.phase.kind === "boss_result") {
      assert.equal(state.phase.passed, true); // prep 1 + 7 >= 6
    }
    state = run(state, { type: "ADVANCE" });
    assert.equal(state.phase.kind, "ending");
  });
});

describe("게임오버 조건", () => {
  it("보안 사고 2회면 게임오버", () => {
    let state = freshDay1();
    state = { ...state, securityIncidents: 1 };
    state = run(
      state,
      { type: "SELECT_TASK", taskId: "t-conf" },
      {
        type: "RESOLVE_TASK",
        taskId: "t-conf",
        selection: { method: "delegate", cards: [], verify: false },
      },
    );
    assert.equal(state.securityIncidents, 2);
    state = run(state, { type: "ADVANCE" });
    assert.equal(state.phase.kind, "game_over");
    if (state.phase.kind === "game_over") {
      assert.equal(state.phase.cause, "security");
    }
  });

  it("신뢰 0 이하면 게임오버", () => {
    let state = freshDay1();
    state = {
      ...state,
      resources: { ...state.resources, trust: 20 },
    };
    state = run(
      state,
      { type: "SELECT_TASK", taskId: "t-conf" },
      {
        type: "RESOLVE_TASK",
        taskId: "t-conf",
        selection: { method: "delegate", cards: [], verify: false },
      },
      { type: "ADVANCE" },
    );
    assert.equal(state.phase.kind, "game_over");
    if (state.phase.kind === "game_over") {
      assert.equal(state.phase.cause, "trust");
    }
  });

  it("에너지 0이면 강제 퇴근 + 필수 업무 마감 실패", () => {
    let state = freshDay1();
    state = { ...state, resources: { ...state.resources, energy: 3 } };
    state = run(
      state,
      { type: "SELECT_TASK", taskId: "t-basic" },
      { type: "RESOLVE_TASK", taskId: "t-basic", selection: direct }, // 에너지 3 → 0
      { type: "ADVANCE" },
    );
    assert.equal(state.phase.kind, "day_end");
    if (state.phase.kind === "day_end") {
      assert.equal(state.phase.summary.forced, true);
      assert.equal(state.phase.summary.energyRestored, 3);
    }
    assert.equal(state.tasks["t-hallu"].status, "failed");
  });
});

describe("돌발 업무 추첨 결정론", () => {
  it("같은 시드는 같은 게임을 만든다", () => {
    const a = run(initialState(TEST_CHAPTER, 7), { type: "ADVANCE" });
    const b = run(initialState(TEST_CHAPTER, 7), { type: "ADVANCE" });
    assert.deepEqual(a, b);
  });
});
