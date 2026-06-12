import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { ChapterSpec } from "../scenarios/schema";
import { validateChapter } from "../scenarios/validate";
import { T_BASIC, TEST_CHAPTER } from "./fixtures";

describe("validateChapter", () => {
  it("테스트 챕터는 무결하다", () => {
    assert.deepEqual(validateChapter(TEST_CHAPTER), []);
  });

  it("업무 id 중복을 잡는다", () => {
    const broken: ChapterSpec = {
      ...TEST_CHAPTER,
      days: TEST_CHAPTER.days.map((day, index) =>
        index === 0 ? { ...day, tasks: [...day.tasks, T_BASIC] } : day,
      ),
    };
    assert.ok(validateChapter(broken).some((e) => e.includes("중복")));
  });

  it("환각 태그에 필수 필드 누락을 잡는다", () => {
    const broken: ChapterSpec = {
      ...TEST_CHAPTER,
      days: TEST_CHAPTER.days.map((day, index) =>
        index === 0
          ? {
              ...day,
              tasks: day.tasks.map((task) =>
                task.id === "t-hallu" && task.kind === "standard"
                  ? { ...task, aiPreview: { clean: "x" }, hallucinationDetail: undefined }
                  : task,
              ),
            }
          : day,
      ),
    };
    const errors = validateChapter(broken);
    assert.ok(errors.some((e) => e.includes("hallucinated")));
    assert.ok(errors.some((e) => e.includes("hallucinationDetail")));
  });

  it("존재하지 않는 보스 폭탄 참조를 잡는다", () => {
    const broken: ChapterSpec = {
      ...TEST_CHAPTER,
      boss: {
        ...TEST_CHAPTER.boss,
        rounds: TEST_CHAPTER.boss.rounds.map((round) =>
          round.bombTaskId ? { ...round, bombTaskId: "t-ghost" } : round,
        ),
      },
    };
    assert.ok(validateChapter(broken).some((e) => e.includes("t-ghost")));
  });

  it("마지막 엔딩이 조건부면 잡는다", () => {
    const broken: ChapterSpec = {
      ...TEST_CHAPTER,
      endings: TEST_CHAPTER.endings.map((ending, index, all) =>
        index === all.length - 1 ? { ...ending, minTrust: 10 } : ending,
      ),
    };
    assert.ok(validateChapter(broken).some((e) => e.includes("catch-all")));
  });
});
