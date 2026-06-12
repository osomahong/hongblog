import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  computeCost,
  computeQ,
  previewFor,
  resolveChoiceOption,
  resolveStandardTask,
} from "../resolve";
import type { TaskSelection } from "../types";
import { T_BASIC, T_CHOICE, T_CONF, T_HALLU, T_TRIV } from "./fixtures";

const CTX = { isRework: false, burnout: false };

const sel = (partial?: Partial<TaskSelection>): TaskSelection => ({
  method: "delegate",
  cards: [],
  verify: false,
  ...partial,
});

describe("computeQ", () => {
  it("직접 처리는 항상 6 (통과 고정)", () => {
    assert.equal(computeQ(T_BASIC, sel({ method: "direct" })), 6);
  });

  it("빈 프롬프트 위임은 3 (반려)", () => {
    assert.equal(computeQ(T_BASIC, sel()), 3);
  });

  it("요구 요소 일치 카드당 +3, 불일치는 +0", () => {
    assert.equal(computeQ(T_BASIC, sel({ cards: ["role"] })), 6);
    assert.equal(computeQ(T_BASIC, sel({ cards: ["role", "context"] })), 9);
    // example은 T_BASIC 요구 요소가 아님
    assert.equal(
      computeQ(T_BASIC, sel({ cards: ["role", "context", "example"] })),
      9,
    );
  });

  it("카드 1장 일치 + 검증 = 7 (통과 품질 보강)", () => {
    assert.equal(computeQ(T_BASIC, sel({ cards: ["role"], verify: true })), 7);
  });
});

describe("resolveStandardTask: 판정 등급", () => {
  it("카드 1장 일치 = 통과, 신뢰 +4 / KPI +2", () => {
    const outcome = resolveStandardTask(T_BASIC, sel({ cards: ["role"] }), CTX);
    assert.equal(outcome.tier, "pass");
    assert.equal(outcome.trustDelta, 4);
    assert.equal(outcome.kpiDelta, 2);
    assert.equal(outcome.timeCost, 1);
  });

  it("요구 요소 전부 일치 = 우수, 신뢰 +8 / KPI +3", () => {
    const outcome = resolveStandardTask(
      T_BASIC,
      sel({ cards: ["role", "context"] }),
      CTX,
    );
    assert.equal(outcome.tier, "excellent");
    assert.equal(outcome.trustDelta, 8);
    assert.equal(outcome.kpiDelta, 3);
  });

  it("Q<6 반려, 신뢰 -6, 재작업 기회", () => {
    const outcome = resolveStandardTask(T_BASIC, sel(), CTX);
    assert.equal(outcome.tier, "rework");
    assert.equal(outcome.trustDelta, -6);
  });

  it("재작업 직접 처리는 시간 -1 할인", () => {
    const outcome = resolveStandardTask(T_BASIC, sel({ method: "direct" }), {
      ...CTX,
      isRework: true,
    });
    assert.equal(outcome.timeCost, 2); // 원래 3
    assert.equal(outcome.trustDelta, 2); // 재작업 후 통과는 +2
    assert.equal(outcome.kpiDelta, 1);
  });

  it("재작업에서 또 반려면 마감 실패(fail)", () => {
    const outcome = resolveStandardTask(T_BASIC, sel(), {
      ...CTX,
      isRework: true,
    });
    assert.equal(outcome.tier, "fail");
  });
});

describe("resolveStandardTask: 함정 태그", () => {
  it("환각 + 미검증 통과 = 폭탄 장전 (표면상 정상)", () => {
    const outcome = resolveStandardTask(
      T_HALLU,
      sel({ cards: ["role", "context"] }),
      CTX,
    );
    assert.equal(outcome.tier, "excellent"); // Q = 3 + 3 + 3 = 9, 표면상 완벽
    assert.equal(outcome.bombArmed, true);
  });

  it("환각 + 검증 = 폭탄 해제 + 플래그", () => {
    const outcome = resolveStandardTask(
      T_HALLU,
      sel({ cards: ["role", "context"], verify: true }),
      CTX,
    );
    assert.equal(outcome.bombDefused, true);
    assert.deepEqual(outcome.setFlags, ["verified:t-hallu"]);
  });

  it("환각 + 직접 처리 = 폭탄 없음", () => {
    const outcome = resolveStandardTask(T_HALLU, sel({ method: "direct" }), CTX);
    assert.equal(outcome.bombArmed, false);
  });

  it("기밀 + AI 위임 = 보안 사고 + 직접 마무리 비용", () => {
    const outcome = resolveStandardTask(T_CONF, sel({ cards: ["context"] }), CTX);
    assert.equal(outcome.tier, "incident");
    assert.equal(outcome.securityIncident, true);
    assert.equal(outcome.timeCost, 1 + T_CONF.directCost.time);
  });

  it("기밀 + 가명화 위임 = 안전, 보너스로 우수 가능", () => {
    const outcome = resolveStandardTask(
      T_CONF,
      sel({ method: "delegate_anon", cards: ["context"] }),
      CTX,
    );
    assert.equal(outcome.securityIncident, false);
    // 3 + 3(일치) + 2(가명화) = 8 통과
    assert.equal(outcome.tier, "pass");
  });

  it("잡무 + AI 위임 = 시간 손해 + 통과 상한 + 절반 신뢰", () => {
    const cost = computeCost(T_TRIV, sel(), CTX);
    assert.equal(cost.time, 2); // 직접이면 1
    const outcome = resolveStandardTask(T_TRIV, sel(), CTX);
    assert.equal(outcome.trustDelta, 2); // pass +4 × 0.5
  });
});

describe("resolveStandardTask: 환각 폭탄 경계", () => {
  it("반려된 제출은 폭탄 미장전", () => {
    const outcome = resolveStandardTask(T_HALLU, sel(), CTX); // Q=3 반려
    assert.equal(outcome.tier, "rework");
    assert.equal(outcome.bombArmed, false);
  });
});

describe("resolveChoiceOption", () => {
  it("선택지 tier/비용/준비도/플래그를 그대로 반영", () => {
    const option = T_CHOICE.options[0];
    const outcome = resolveChoiceOption(T_CHOICE, option);
    assert.equal(outcome.tier, "excellent");
    assert.equal(outcome.prepDelta, 2);
    assert.deepEqual(outcome.setFlags, ["draft-reviewed"]);
  });
});

describe("previewFor: 환각의 UI 재현", () => {
  it("미검증이면 그럴듯한(틀린) 결과가 보인다", () => {
    const preview = previewFor(T_HALLU, sel({ cards: ["role"] }));
    assert.equal(preview.text, "그럴듯한 시장 수치");
    assert.equal(preview.issue, undefined);
  });

  it("검증하면 문제가 드러난다", () => {
    const preview = previewFor(T_HALLU, sel({ cards: ["role"], verify: true }));
    assert.equal(preview.text, "검증된 시장 수치");
    assert.ok(preview.issue);
  });
});
