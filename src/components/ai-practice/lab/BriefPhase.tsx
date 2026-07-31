"use client";

/** Phase 1: 과제 확인. 결과물과 진행 순서를 안내한다. 다크 프레임 안의 화면으로, 모든 AIPBL이 공용으로 쓴다. */

import { ArrowRight, History } from "lucide-react";
import { BTN_GHOST, BTN_PRIMARY } from "./ui";
import type { LabBrief, LabMissionMeta } from "./LabShell";
import type { LabProgress } from "./progress";

/** 저장된 진행 상태에서 이어서 시작할 위치 */
export interface LabResume {
  label: string;
  phase: "mission" | "quiz";
  missionIndex: number;
}

interface BriefPhaseProps {
  brief: LabBrief;
  missions: LabMissionMeta[];
  onStart: () => void;
  resume?: LabResume | null;
  onResume?: () => void;
  /** localStorage에 저장된 지난 진행 기록. 완료 기록이 있으면 트로피와 퀴즈 최고 점수를 보여 준다 */
  record?: LabProgress | null;
}

export function BriefPhase({
  brief,
  missions,
  onStart,
  resume,
  onResume,
  record,
}: BriefPhaseProps) {
  const completed = Boolean(record?.completedAt);
  return (
    <div className="space-y-6">
      <p className="text-sm sm:text-base leading-relaxed text-gray-200 max-w-3xl">{brief.intro}</p>

      <div className="ap-goal flex items-center gap-4 p-4 sm:p-5">
        <img
          src="/images/ai-practice/icons/goal-trophy.png"
          alt=""
          aria-hidden
          className="ap-goal-icon"
        />
        <div className="relative">
          <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#ffe08a] mb-1">
            최종 결과물
          </p>
          <p className="text-sm sm:text-base font-semibold text-white">{brief.goal}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {missions.map((m, i) => (
          <div key={m.title} className="ap-card ap-card-accent p-5">
            <span className="ap-step-index mb-3">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="font-semibold text-sm mb-1.5 text-white">
              {m.title.replace(/^미션 \d+: /, "")}
            </h3>
            <p className="text-[13px] leading-relaxed text-[var(--ap-muted)]">{m.goal}</p>
          </div>
        ))}
      </div>

      <p className="text-sm leading-relaxed text-[var(--ap-muted)] max-w-3xl">{brief.footer}</p>

      {completed && (
        <div className="ap-card ap-card-accent ap-fade-up flex items-center gap-4 p-5">
          <img
            src="/images/ai-practice/icons/goal-trophy.png"
            alt=""
            aria-hidden
            className="ap-icon-3d w-12 h-12"
          />
          <div>
            <p className="text-sm font-semibold text-white mb-0.5">완료한 AIPBL입니다</p>
            <p className="text-[13px] leading-relaxed text-[var(--ap-muted)]">
              {record?.quizScore !== undefined && record?.quizTotal
                ? `점검 퀴즈 최고 기록: ${record.quizTotal}문항 중 ${record.quizScore}문항 정답. 다시 실습하면 최고 기록에 도전할 수 있습니다.`
                : "다시 실습해도 완료 기록은 유지됩니다."}
            </p>
          </div>
        </div>
      )}

      {resume && (
        <div className="ap-card ap-card-accent ap-fade-up flex flex-wrap items-center justify-between gap-4 p-5">
          <p className="flex items-center gap-2.5 text-sm text-gray-200">
            <History className="w-4 h-4 text-[#7dd3fc] flex-shrink-0" strokeWidth={1.8} />
            지난번에 진행하던 기록이 있습니다. 이어서 하거나 처음부터 다시 시작할 수 있습니다.
          </p>
          <button type="button" onClick={onResume} className={BTN_GHOST}>
            {resume.label} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="flex justify-end">
        <button type="button" onClick={onStart} className={BTN_PRIMARY}>
          {resume ? "처음부터 시작하기" : completed ? "다시 실습하기" : "미션 1 시작하기"}{" "}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
