"use client";

/**
 * 상단 고정 HUD: 요일, 시간 블록, 에너지, 팀장 신뢰, KPI.
 * 색만으로 구분하지 않도록 수치를 함께 표기한다.
 */

import type { Resources } from "@/lib/game/types";
import { cn } from "@/lib/utils";

interface ResourceBarProps {
  dayLabel: string;
  resources: Resources;
  /** 하루 시간 예산 (블록 칸 수 표시용) */
  timeBudget: number;
}

function Meter({
  label,
  value,
  max,
  fillClass,
}: {
  label: string;
  value: number;
  max: number;
  fillClass: string;
}) {
  const ratio = Math.max(0, Math.min(1, value / max));
  return (
    <div className="flex flex-1 flex-col gap-0.5">
      <div className="flex items-baseline justify-between">
        <span className="text-[10px] font-bold tracking-wide text-gray-600">
          {label}
        </span>
        <span className="text-[11px] font-black tabular-nums">{value}</span>
      </div>
      <div className="h-2 border-2 border-black bg-white">
        <div
          className={cn("h-full transition-all duration-500", fillClass)}
          style={{ width: `${ratio * 100}%` }}
        />
      </div>
    </div>
  );
}

export function ResourceBar({ dayLabel, resources, timeBudget }: ResourceBarProps) {
  const maxBlocks = Math.max(timeBudget, resources.time);
  return (
    <div className="sticky top-0 z-20 -mx-4 border-b-3 border-black bg-white px-4 py-2 sm:mx-0 sm:border-3 sm:neo-shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-black sm:text-sm">{dayLabel}</span>
        <div className="flex items-center gap-1" aria-label={`남은 시간 ${resources.time}블록`}>
          <span className="text-[10px] font-bold text-gray-600">시간</span>
          {Array.from({ length: maxBlocks }, (_, i) => (
            <span
              key={i}
              className={cn(
                "inline-block h-3 w-3 border-2 border-black",
                i < resources.time ? "bg-black" : "bg-white",
              )}
            />
          ))}
        </div>
      </div>
      <div className="mt-1.5 flex items-center gap-3">
        <Meter label="에너지" value={resources.energy} max={10} fillClass="bg-accent" />
        <Meter label="팀장 신뢰" value={resources.trust} max={100} fillClass="bg-primary" />
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-bold tracking-wide text-gray-600">KPI</span>
          <span className="text-sm font-black tabular-nums">{resources.kpi}</span>
        </div>
      </div>
    </div>
  );
}
