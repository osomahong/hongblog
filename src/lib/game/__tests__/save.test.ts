import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { initialState } from "../engine";
import { normalizeSave } from "../save";
import { TEST_CHAPTER } from "./fixtures";

describe("normalizeSave", () => {
  it("정상 상태는 JSON 왕복 후에도 복원된다", () => {
    const state = initialState(TEST_CHAPTER, 42);
    const roundTripped = JSON.parse(JSON.stringify(state));
    const restored = normalizeSave(roundTripped);
    assert.ok(restored);
    // JSON 직렬화는 undefined 키를 떨어뜨리므로 왕복본끼리 비교
    assert.deepEqual(restored, roundTripped);
    assert.equal(restored.seed, state.seed);
    assert.equal(restored.resources.trust, state.resources.trust);
  });

  it("null/문자열/빈 객체는 거부한다", () => {
    assert.equal(normalizeSave(null), null);
    assert.equal(normalizeSave("corrupt"), null);
    assert.equal(normalizeSave({}), null);
  });

  it("버전 불일치는 거부한다 (마이그레이션 대신 새 게임)", () => {
    const state = initialState(TEST_CHAPTER, 1);
    const tampered = { ...JSON.parse(JSON.stringify(state)), version: 2 };
    assert.equal(normalizeSave(tampered), null);
  });

  it("자원 필드가 깨지면 거부한다", () => {
    const state = initialState(TEST_CHAPTER, 1);
    const tampered = JSON.parse(JSON.stringify(state));
    tampered.resources.trust = "max";
    assert.equal(normalizeSave(tampered), null);
  });
});
