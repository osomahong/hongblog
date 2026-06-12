"use client";

/**
 * 업무 선택 허브: 오늘의 업무 카드, 휴식, 퇴근/보고 진입.
 * 함정 단서는 카드 본문에만 있다. 위임 판단 개념을 배우면 적합도 힌트가 열린다.
 */

import type { ChapterSpec, TaskCard } from "@/lib/game/scenarios/schema";
import type { GameState } from "@/lib/game/types";
import { cn } from "@/lib/utils";

import { SPEAKERS } from "../speakers";
import { TIER_META } from "../tiers";

interface TaskSelectScreenProps {
  chapter: ChapterSpec;
  state: GameState;
  tasks: TaskCard[];
  isBossDay: boolean;
  onSelect: (taskId: string) => void;
  onRest: (rest: "lunch" | "coffee") => void;
  onDayEnd: () => void;
}

function delegationHint(task: TaskCard): { label: string; className: string } {
  if (task.kind === "choice") {
    return { label: "직접 판단", className: "bg-white" };
  }
  if (task.tags.includes("trivial")) {
    return { label: "직접이 빠름", className: "bg-white" };
  }
  if (task.tags.includes("confidential")) {
    return { label: "취급 주의", className: "bg-primary text-white" };
  }
  return { label: "위임 적합", className: "bg-accent" };
}

export function TaskSelectScreen({
  chapter,
  state,
  tasks,
  isBossDay,
  onSelect,
  onRest,
  onDayEnd,
}: TaskSelectScreenProps) {
  const hintUnlocked = state.unlockedConcepts.includes("delegation");
  const open = tasks.filter((t) => {
    const rt = state.tasks[t.id];
    return rt && (rt.status === "open" || rt.status === "rework");
  });
  const closed = tasks.filter((t) => !open.includes(t));
  const requiredLeft = open.filter((t) => t.required).length;

  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black">오늘의 업무</h2>
        <span className="text-xs font-bold text-gray-600">
          마감 필수 {requiredLeft}건 남음
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {open.map((task) => {
          const rt = state.tasks[task.id];
          const isRework = rt?.status === "rework";
          const directTime =
            task.kind === "standard"
              ? Math.max(1, task.directCost.time - (isRework ? 1 : 0))
              : null;
          const hint = delegationHint(task);
          return (
            <button
              key={task.id}
              type="button"
              onClick={() => onSelect(task.id)}
              className="border-3 border-black bg-white p-3 text-left neo-shadow neo-hover"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-black sm:text-base">{task.title}</span>
                {task.required && (
                  <span className="border-2 border-black bg-black px-1.5 py-0.5 text-[10px] font-bold text-white">
                    오늘 마감
                  </span>
                )}
                {isRework && (
                  <span className="border-2 border-black bg-primary px-1.5 py-0.5 text-[10px] font-bold text-white">
                    재작업
                  </span>
                )}
                {hintUnlocked && (
                  <span
                    className={cn(
                      "ml-auto border-2 border-black px-1.5 py-0.5 text-[10px] font-bold",
                      hint.className,
                    )}
                  >
                    {hint.label}
                  </span>
                )}
              </div>
              <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-gray-600 sm:text-sm">
                {SPEAKERS[task.from].name}: {task.brief}
              </p>
              {directTime !== null && (
                <p className="mt-1.5 text-[11px] font-bold text-gray-500">
                  직접 처리 시 {directTime}블록
                </p>
              )}
            </button>
          );
        })}
        {open.length === 0 && (
          <p className="border-3 border-dashed border-gray-400 bg-white/50 p-4 text-center text-sm text-gray-500">
            남은 업무가 없다.
          </p>
        )}
      </div>

      {closed.length > 0 && (
        <div className="flex flex-col gap-1.5">
          {closed.map((task) => {
            const rt = state.tasks[task.id];
            const tier = rt?.resultTier ? TIER_META[rt.resultTier] : null;
            return (
              <div
                key={task.id}
                className="flex items-center justify-between border-2 border-gray-300 bg-white/60 px-3 py-1.5 text-xs text-gray-500"
              >
                <span className="line-through">{task.title}</span>
                {tier && (
                  <span
                    className={cn(
                      "border-2 border-black px-1.5 py-0.5 font-bold",
                      tier.badgeClass,
                    )}
                  >
                    {tier.label}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-2 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onRest("coffee")}
          disabled={state.dayRt.coffeeUsed}
          className="border-3 border-black bg-white px-3 py-2 text-xs font-bold neo-shadow neo-hover disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
        >
          커피 한 잔 (에너지 +2)
        </button>
        <button
          type="button"
          onClick={() => onRest("lunch")}
          disabled={state.dayRt.lunchUsed || state.resources.time < 1}
          className="border-3 border-black bg-white px-3 py-2 text-xs font-bold neo-shadow neo-hover disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
        >
          점심 휴식 (1블록, 에너지 +3)
        </button>
        <button
          type="button"
          onClick={onDayEnd}
          className={cn(
            "ml-auto border-3 border-black px-4 py-2 text-xs font-black neo-shadow neo-hover",
            isBossDay ? "bg-primary text-white" : "bg-black text-white",
          )}
        >
          {isBossDay ? "14:00 보고 들어가기" : "퇴근하기"}
        </button>
      </div>
    </div>
  );
}
