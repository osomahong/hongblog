import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { drawAt, mulberry32, pickAt } from "../rng";

describe("rng", () => {
  it("같은 시드는 같은 수열을 만든다", () => {
    const a = mulberry32(42);
    const b = mulberry32(42);
    for (let i = 0; i < 10; i += 1) {
      assert.equal(a(), b());
    }
  });

  it("drawAt은 cursor 위치 값을 재현한다 (저장/복원 안전)", () => {
    const gen = mulberry32(7);
    const seq = [gen(), gen(), gen()];
    assert.equal(drawAt(7, 0), seq[0]);
    assert.equal(drawAt(7, 1), seq[1]);
    assert.equal(drawAt(7, 2), seq[2]);
  });

  it("값은 항상 [0, 1) 범위", () => {
    for (let cursor = 0; cursor < 100; cursor += 1) {
      const value = drawAt(123456, cursor);
      assert.ok(value >= 0 && value < 1);
    }
  });

  it("pickAt은 배열 범위를 벗어나지 않는다", () => {
    const items = ["a", "b", "c"];
    for (let cursor = 0; cursor < 50; cursor += 1) {
      assert.ok(items.includes(pickAt(items, 99, cursor)));
    }
  });
});
