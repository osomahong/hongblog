/**
 * 판정 엔진: 선택 → 결과를 계산하는 순수 함수.
 * 판정에 난수 없음 (교육 게임에서 "맞게 했는데 운으로 망함"은 학습을 부정한다).
 *
 * Q = base(직접 6 / AI 3) + 요구요소 일치 카드당 +3 + 검증 +1 (+가명화 +2)
 * Q >= 9 우수 / 6~8 통과 / <6 반려
 *
 * 학습 곡선: 빈 프롬프트(3) 반려 → 카드 1장 일치(6) 통과 → 2장 일치(9) 우수.
 * 직접 처리(6)는 항상 통과 고정: 안전하지만 우수가 없고 비싸다.
 */

import type {
  ChoiceOption,
  ChoiceTask,
  Dialogue,
  StandardTask,
} from "./scenarios/schema";
import type { ResolvedOutcome, TaskSelection, TierId } from "./types";

export const Q_BASE_DIRECT = 6;
export const Q_BASE_DELEGATE = 3;
export const Q_MATCH_BONUS = 3;
export const Q_VERIFY_BONUS = 1;
export const Q_ANON_BONUS = 2;
export const Q_EXCELLENT = 9;
export const Q_PASS = 6;

const TRUST_BY_TIER: Record<"excellent" | "pass" | "rework", number> = {
  excellent: 8,
  pass: 4,
  rework: -6,
};

const KPI_BY_TIER: Record<"excellent" | "pass" | "rework", number> = {
  excellent: 3,
  pass: 2,
  rework: 0,
};

export interface ResolveContext {
  /** 반려 후 재작업 제출인가 (시간 -1 할인, 보상 축소) */
  isRework: boolean;
  /** 3일 연속 야근 디버프 (직접 처리 에너지 +1) */
  burnout: boolean;
}

function tierFromQ(q: number): "excellent" | "pass" | "rework" {
  if (q >= Q_EXCELLENT) return "excellent";
  if (q >= Q_PASS) return "pass";
  return "rework";
}

function matchCount(task: StandardTask, selection: TaskSelection): number {
  const required = new Set<string>(task.requiredElements);
  const unique = new Set(selection.cards);
  let count = 0;
  unique.forEach((card) => {
    if (required.has(card)) count += 1;
  });
  return count;
}

/** UI 미리보기/제출 양쪽에서 쓰는 품질 점수 */
export function computeQ(task: StandardTask, selection: TaskSelection): number {
  if (selection.method === "direct") return Q_BASE_DIRECT;
  let q = Q_BASE_DELEGATE + matchCount(task, selection) * Q_MATCH_BONUS;
  if (selection.method === "delegate_anon") q += Q_ANON_BONUS;
  if (selection.verify) q += Q_VERIFY_BONUS;
  return q;
}

/** 선택의 시간/에너지 비용 (UI 사전 표시 + 엔진 검증 공용) */
export function computeCost(
  task: StandardTask,
  selection: TaskSelection,
  ctx: ResolveContext,
): { time: number; energy: number } {
  if (selection.method === "direct") {
    const time = ctx.isRework
      ? Math.max(1, task.directCost.time - 1)
      : task.directCost.time;
    return { time, energy: task.directCost.energy + (ctx.burnout ? 1 : 0) };
  }
  // 잡무를 AI에 위임하면 결국 직접 마무리가 필요해 손해
  if (task.tags.includes("trivial")) {
    return { time: 2, energy: 2 };
  }
  const verifyExtra = selection.verify ? 1 : 0;
  return { time: 1 + verifyExtra, energy: 1 + verifyExtra };
}

function scaledTrust(base: number, weight: number): number {
  return Math.round(base * weight);
}

function buildOutcome(
  task: StandardTask,
  partial: Pick<
    ResolvedOutcome,
    "tier" | "q" | "timeCost" | "energyCost" | "trustDelta" | "kpiDelta"
  > &
    Partial<ResolvedOutcome>,
  dialogue: Dialogue[],
): ResolvedOutcome {
  return {
    taskId: task.id,
    verified: false,
    bombArmed: false,
    bombDefused: false,
    securityIncident: false,
    setFlags: [],
    prepDelta: 0,
    lesson: task.lesson,
    dialogue,
    ...partial,
  };
}

function prepDeltaFor(task: StandardTask, tier: TierId): number {
  if (!task.carryToBoss) return 0;
  if (tier === "excellent") return task.carryToBoss * 2;
  if (tier === "pass") return task.carryToBoss;
  return 0;
}

/**
 * 표준 업무 판정. 함정 태그 분기:
 * - confidential + AI 위임(가명화 아님) → 보안 사고: 신뢰 대폭 하락 + 직접 마무리 비용 추가
 * - trivial + AI 위임 → 통과 상한 + 시간 손해
 * - hallucination + 미검증 통과 → 지연 폭탄 장전 (표면상 정상)
 */
export function resolveStandardTask(
  task: StandardTask,
  selection: TaskSelection,
  ctx: ResolveContext,
): ResolvedOutcome {
  const weight = task.trustWeight ?? 1;
  const cost = computeCost(task, selection, ctx);

  // 보안 사고: 제출 여부와 무관하게 위임(가명화 없이)한 순간 발동
  if (task.tags.includes("confidential") && selection.method === "delegate") {
    return buildOutcome(
      task,
      {
        tier: "incident",
        q: 0,
        timeCost: 1 + task.directCost.time,
        energyCost: 1 + task.directCost.energy,
        trustDelta: 0, // 보안 페널티는 엔진에서 SECURITY_TRUST_HIT로 일괄 적용
        kpiDelta: 0,
        securityIncident: true,
      },
      task.securityText ?? [],
    );
  }

  const q = computeQ(task, selection);
  let tier: TierId = tierFromQ(q);

  // 잡무 AI 위임은 항상 "통과"로 고정: 결국 직접 마무리하게 되어
  // 실패하진 않지만 시간 손해가 패널티 (직접이 더 싸고 빠르다는 학습)
  const trivialDelegate =
    task.tags.includes("trivial") && selection.method !== "direct";
  if (trivialDelegate) tier = "pass";

  const isHallucination = task.tags.includes("hallucination");
  const delegated = selection.method !== "direct";
  const bombArmed =
    isHallucination && delegated && !selection.verify && tier !== "rework";
  const bombDefused = isHallucination && delegated && selection.verify;

  if (tier === "rework") {
    if (ctx.isRework) {
      // 재작업 기회는 1회: 또 반려면 마감 실패로 처리
      return buildOutcome(
        task,
        {
          tier: "fail",
          q,
          timeCost: cost.time,
          energyCost: cost.energy,
          trustDelta: 0, // 마감 실패 페널티는 엔진에서 일괄 적용
          kpiDelta: 0,
        },
        task.outcomeText.rework,
      );
    }
    return buildOutcome(
      task,
      {
        tier: "rework",
        q,
        timeCost: cost.time,
        energyCost: cost.energy,
        trustDelta: scaledTrust(TRUST_BY_TIER.rework, weight),
        kpiDelta: 0,
      },
      task.outcomeText.rework,
    );
  }

  const finalTier: "excellent" | "pass" = tier === "excellent" ? "excellent" : "pass";
  const trustDelta = ctx.isRework
    ? scaledTrust(2, weight) // 재작업 후 통과
    : scaledTrust(TRUST_BY_TIER[finalTier], weight);
  const kpiDelta = ctx.isRework ? 1 : KPI_BY_TIER[finalTier];

  const dialogue = trivialDelegate
    ? (task.delegatePenaltyText ?? task.outcomeText.pass)
    : task.outcomeText[finalTier];

  return buildOutcome(
    task,
    {
      tier: finalTier,
      q,
      timeCost: cost.time,
      energyCost: cost.energy,
      trustDelta,
      kpiDelta,
      verified: selection.verify,
      bombArmed,
      bombDefused,
      setFlags: bombDefused ? [`verified:${task.id}`] : [],
      prepDelta: prepDeltaFor(task, finalTier),
    },
    dialogue,
  );
}

/** 분기 선택 업무 판정 */
export function resolveChoiceOption(
  task: ChoiceTask,
  option: ChoiceOption,
): ResolvedOutcome {
  const weight = task.trustWeight ?? 1;
  const trustDelta = scaledTrust(TRUST_BY_TIER[option.tier], weight);
  return {
    taskId: task.id,
    tier: option.tier,
    q: 0,
    timeCost: option.cost.time,
    energyCost: option.cost.energy,
    trustDelta,
    kpiDelta: KPI_BY_TIER[option.tier],
    verified: false,
    bombArmed: false,
    bombDefused: false,
    securityIncident: false,
    setFlags: option.setFlags ?? [],
    prepDelta: option.prepDelta ?? 0,
    dialogue: option.reply,
    lesson: option.lesson,
  };
}

/** 제출 전 결과 미리보기: 환각은 검증해야만 정체가 드러난다 */
export function previewFor(
  task: StandardTask,
  selection: TaskSelection,
): { text: string; issue?: string } {
  if (selection.method === "direct") {
    return { text: task.aiPreview.clean };
  }
  const isHallucination = task.tags.includes("hallucination");
  if (isHallucination && !selection.verify) {
    return { text: task.aiPreview.hallucinated ?? task.aiPreview.clean };
  }
  if (isHallucination && selection.verify) {
    return { text: task.aiPreview.clean, issue: task.hallucinationDetail };
  }
  return { text: task.aiPreview.clean };
}
