"use client";

/**
 * AIPBL 트랙 스테퍼.
 * 기초, 중급, 심화 단계를 필 형태 링크로 보여 주고, localStorage의 AIPBL 진행 기록을 읽어
 * 완료한 단계에 체크 표시를 붙인다. 열린 단계는 클릭으로 바로 이동할 수 있다.
 */

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { AIPBL_PROGRESS_EVENT, readAipblProgress } from "./lab/progress";

export interface AipblTrackStep {
  /** 진행 기록 조회용 AIPBL 식별자. 예: "prompt-basics" */
  id: string;
  label: string;
  /** 열린 단계의 상세 경로. 없으면 준비 중으로 표시된다. */
  href?: string;
}

interface AipblTrackNavProps {
  label: string;
  steps: AipblTrackStep[];
  current: number;
}

const PILL_BASE =
  "inline-flex items-center gap-2 px-4 py-2 rounded-full border text-[13px] font-medium transition-colors";

export function AipblTrackNav({ label, steps, current }: AipblTrackNavProps) {
  const [completed, setCompleted] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const load = () => {
      const progress = readAipblProgress();
      setCompleted(
        Object.fromEntries(steps.map((s) => [s.id, Boolean(progress[s.id]?.completedAt)]))
      );
    };
    load();
    window.addEventListener(AIPBL_PROGRESS_EVENT, load);
    return () => window.removeEventListener(AIPBL_PROGRESS_EVENT, load);
    // steps는 페이지별 정적 배열이라 내용이 바뀌지 않는다
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mt-8 pt-6 border-t border-white/10">
      <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-[var(--ap-muted)] mb-3.5">
        {label}
      </p>
      <div className="flex flex-wrap items-center gap-y-2">
        {steps.map((step, i) => {
          const active = i === current;
          const done = completed[step.id];
          const marker = done ? (
            <CheckCircle2 className="w-4 h-4 text-[#7dd3fc] flex-shrink-0" strokeWidth={1.8} />
          ) : (
            <span
              className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                active
                  ? "bg-gradient-to-r from-[#7dd3fc] via-[#a78bfa] to-[#ff5c7d]"
                  : "border border-white/25"
              }`}
              aria-hidden
            />
          );
          return (
            <div key={step.id} className="flex items-center">
              {i > 0 && <span className="w-5 sm:w-9 h-px bg-white/15 mx-1.5" aria-hidden />}
              {active ? (
                <span
                  className={`${PILL_BASE} border-white/30 bg-white/[0.06] text-white font-semibold`}
                  aria-current="step"
                >
                  {marker}
                  {step.label}
                </span>
              ) : step.href ? (
                <Link
                  href={step.href}
                  className={`${PILL_BASE} border-white/15 text-[var(--ap-muted)] hover:border-white/45 hover:text-white`}
                >
                  {marker}
                  {step.label}
                  <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={1.8} />
                </Link>
              ) : (
                <span className={`${PILL_BASE} border-white/10 text-[var(--ap-muted)] opacity-70`}>
                  {marker}
                  {step.label}
                  <span className="text-[10px]">준비 중</span>
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
