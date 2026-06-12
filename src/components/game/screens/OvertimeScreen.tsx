"use client";

/**
 * 18시: 야근 선택. 오늘은 해결되지만 내일이 망가지는 트레이드오프.
 */

import type { ChapterSpec, TaskCard } from "@/lib/game/scenarios/schema";
import { OVERTIME_BLOCKS, OVERTIME_ENERGY_COST } from "@/lib/game/types";

interface OvertimeScreenProps {
  pendingTasks: TaskCard[];
  consecutiveOvertime: number;
  onDecide: (accept: boolean) => void;
}

export function OvertimeScreen({
  pendingTasks,
  consecutiveOvertime,
  onDecide,
}: OvertimeScreenProps) {
  return (
    <div className="flex flex-col gap-4 py-4">
      <h2 className="border-3 border-black bg-black px-3 py-2 text-base font-black text-white neo-shadow-sm">
        18:00, 아직 끝나지 않았다
      </h2>
      <div className="border-3 border-black bg-white p-3">
        <p className="text-sm font-bold">오늘 마감인데 남은 일</p>
        <ul className="mt-2 flex flex-col gap-1">
          {pendingTasks.map((task) => (
            <li key={task.id} className="text-sm text-gray-700">
              · {task.title}
            </li>
          ))}
        </ul>
      </div>
      {consecutiveOvertime >= 2 && (
        <p className="text-center text-xs font-bold text-primary">
          이번 주 야근이 벌써 {consecutiveOvertime}일째. 한 번 더 하면 몸이 버티지 못할 것 같다.
        </p>
      )}
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={() => onDecide(true)}
          className="border-3 border-black bg-primary px-4 py-3 text-sm font-black text-white neo-shadow neo-hover"
        >
          야근한다 (+{OVERTIME_BLOCKS}블록, 에너지 -{OVERTIME_ENERGY_COST})
        </button>
        <button
          type="button"
          onClick={() => onDecide(false)}
          className="border-3 border-black bg-white px-4 py-3 text-sm font-bold neo-shadow neo-hover"
        >
          퇴근한다 (남은 마감 업무는 실패 처리)
        </button>
      </div>
    </div>
  );
}
