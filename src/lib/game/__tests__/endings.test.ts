import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { evaluateEnding } from "../endings";
import type { Resources } from "../types";
import { TEST_CHAPTER } from "./fixtures";

const res = (trust: number, kpi: number): Resources => ({
  time: 0,
  energy: 5,
  trust,
  kpi,
});

describe("evaluateEnding", () => {
  it("신뢰·KPI 모두 충족하면 최상 엔딩", () => {
    assert.equal(evaluateEnding(TEST_CHAPTER, res(80, 12)).id, "ending-a");
  });

  it("KPI 미달이면 다음 순위로 내려간다", () => {
    assert.equal(evaluateEnding(TEST_CHAPTER, res(80, 5)).id, "ending-b");
  });

  it("신뢰 미달이면 catch-all", () => {
    assert.equal(evaluateEnding(TEST_CHAPTER, res(30, 50)).id, "ending-c");
  });

  it("경계값: minTrust는 이상(>=) 판정", () => {
    assert.equal(evaluateEnding(TEST_CHAPTER, res(75, 10)).id, "ending-a");
    assert.equal(evaluateEnding(TEST_CHAPTER, res(74, 10)).id, "ending-b");
  });
});
