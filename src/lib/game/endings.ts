/**
 * 엔딩 평가: 보스 통과 후 신뢰/KPI 기준으로 우선순위 순 첫 매치.
 * 마지막 엔딩은 조건 없는 catch-all이어야 한다 (validate.ts에서 검사).
 */

import type { ChapterSpec, EndingDef } from "./scenarios/schema";
import type { Resources } from "./types";

export function evaluateEnding(
  chapter: ChapterSpec,
  resources: Resources,
): EndingDef {
  const matched = chapter.endings.find((ending) => {
    if (ending.minTrust !== undefined && resources.trust < ending.minTrust) {
      return false;
    }
    if (ending.minKpi !== undefined && resources.kpi < ending.minKpi) {
      return false;
    }
    return true;
  });
  return matched ?? chapter.endings[chapter.endings.length - 1];
}
