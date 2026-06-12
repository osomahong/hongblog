"use client";

/**
 * 판정 결과: 등급 도장 + 피드백 대사 + 자원 변화 + 학습 포인트.
 * 검증으로 환각을 잡았다면 여기서 빨간 하이라이트로 공개한다.
 */

import type { ChapterSpec, TaskCard } from "@/lib/game/scenarios/schema";
import {
  DEADLINE_FAIL_TRUST,
  SECURITY_TRUST_HIT,
  type ResolvedOutcome,
} from "@/lib/game/types";
import { cn } from "@/lib/utils";

import { DialogueBox } from "../hud/DialogueBox";
import { TIER_META } from "../tiers";

interface ResultScreenProps {
  chapter: ChapterSpec;
  task: TaskCard | undefined;
  outcome: ResolvedOutcome;
  onDone: () => void;
}

function Delta({ label, value }: { label: string; value: number }) {
  if (value === 0) return null;
  return (
    <span
      className={cn(
        "border-2 border-black px-1.5 py-0.5 text-[11px] font-black",
        value > 0 ? "bg-accent" : "bg-primary text-white",
      )}
    >
      {label} {value > 0 ? `+${value}` : value}
    </span>
  );
}

export function ResultScreen({ task, outcome, onDone }: ResultScreenProps) {
  const tier = TIER_META[outcome.tier];
  const verifiedCatch =
    outcome.verified &&
    task?.kind === "standard" &&
    task.hallucinationDetail &&
    outcome.bombDefused;

  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "animate-[stampIn_0.35s_ease-out] border-3 border-black px-3 py-1.5 text-lg font-black neo-shadow",
            tier.badgeClass,
          )}
        >
          {tier.label}
        </span>
        <span className="text-sm font-bold text-gray-700">{task?.title}</span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <Delta
          label="신뢰"
          value={
            outcome.trustDelta +
            (outcome.securityIncident ? SECURITY_TRUST_HIT : 0) +
            (outcome.tier === "fail" ? DEADLINE_FAIL_TRUST : 0)
          }
        />
        <Delta label="KPI" value={outcome.kpiDelta} />
        <Delta label="시간" value={-outcome.timeCost} />
        <Delta label="에너지" value={-outcome.energyCost} />
      </div>

      {verifiedCatch && (
        <div className="border-3 border-primary bg-white p-3">
          <p className="text-xs font-black text-primary">검증에서 잡아냈다</p>
          <p className="mt-1 text-sm leading-relaxed text-gray-800">
            {task.kind === "standard" && task.hallucinationDetail}
          </p>
          <p className="mt-1.5 text-xs text-gray-500">
            틀린 수치를 빼고 확인된 자료만 남겨 제출했다.
          </p>
        </div>
      )}

      <DialogueBox lines={outcome.dialogue} onDone={onDone} />

      {outcome.lesson && (
        <p className="border-l-4 border-black bg-white px-3 py-2 text-xs leading-relaxed text-gray-700">
          {outcome.lesson}
        </p>
      )}
    </div>
  );
}
