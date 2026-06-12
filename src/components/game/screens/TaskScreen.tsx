"use client";

/**
 * 업무 처리 화면: 직접/AI 위임/가명화 위임 + 프롬프트 카드 조합 + 검증 결정.
 * 환각 여부는 미리보기에서 드러나지 않는다. 검증은 제출의 일부이며
 * 결과는 제출 후에만 공개된다 (공짜 정찰 방지).
 */

import { useState } from "react";

import { computeCost, previewFor } from "@/lib/game/resolve";
import type {
  ChoiceTask,
  ConceptDef,
  PromptElement,
  StandardTask,
  TaskCard,
} from "@/lib/game/scenarios/schema";
import type { GameState, TaskMethod, TaskSelection } from "@/lib/game/types";
import { PROMPT_SLOT_MAX } from "@/lib/game/types";
import { cn } from "@/lib/utils";

import { SPEAKERS } from "../speakers";

const CARD_LABELS: Record<PromptElement, string> = {
  role: "역할",
  context: "맥락",
  example: "예시",
  steps: "단계분해",
};

interface TaskScreenProps {
  task: TaskCard;
  state: GameState;
  concepts: ConceptDef[];
  onResolve: (selection: TaskSelection) => void;
  onChoose: (optionId: string) => void;
  onCancel: () => void;
}

export function TaskScreen({
  task,
  state,
  concepts,
  onResolve,
  onChoose,
  onCancel,
}: TaskScreenProps) {
  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="border-3 border-black bg-white p-4 neo-shadow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-gray-500">
            {SPEAKERS[task.from].name}
          </span>
          {task.required && (
            <span className="border-2 border-black bg-black px-1.5 py-0.5 text-[10px] font-bold text-white">
              오늘 마감
            </span>
          )}
        </div>
        <h2 className="mt-1 text-lg font-black">{task.title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-gray-800">{task.brief}</p>
      </div>

      {task.kind === "standard" ? (
        <StandardTaskPanel
          task={task}
          state={state}
          onResolve={onResolve}
          onCancel={onCancel}
        />
      ) : (
        <ChoiceTaskPanel
          task={task}
          state={state}
          concepts={concepts}
          onChoose={onChoose}
          onCancel={onCancel}
        />
      )}
    </div>
  );
}

function StandardTaskPanel({
  task,
  state,
  onResolve,
  onCancel,
}: {
  task: StandardTask;
  state: GameState;
  onResolve: (selection: TaskSelection) => void;
  onCancel: () => void;
}) {
  const [method, setMethod] = useState<TaskMethod>("direct");
  const [cards, setCards] = useState<PromptElement[]>([]);
  const [verify, setVerify] = useState(false);

  const rt = state.tasks[task.id];
  const ctx = {
    isRework: rt?.status === "rework",
    burnout: Boolean(state.flags.burnout),
  };
  const canVerify = state.unlockedConcepts.includes("verify");
  const canAnon =
    state.unlockedConcepts.includes("privacy") &&
    task.tags.includes("confidential");
  const unlockedCards = (
    ["role", "context", "example", "steps"] as PromptElement[]
  ).filter((card) => state.unlockedConcepts.includes(card));

  const selection: TaskSelection = {
    method,
    cards: method === "direct" ? [] : cards,
    verify: method !== "direct" && verify,
  };
  const cost = computeCost(task, selection, ctx);
  const affordable = cost.time <= state.resources.time;
  const preview =
    method === "direct"
      ? null
      : previewFor(task, { ...selection, verify: false });

  const toggleCard = (card: PromptElement) => {
    setCards((prev) =>
      prev.includes(card)
        ? prev.filter((c) => c !== card)
        : prev.length < PROMPT_SLOT_MAX
          ? [...prev, card]
          : prev,
    );
  };

  const methodButton = (
    value: TaskMethod,
    label: string,
    desc: string,
  ): React.ReactNode => (
    <button
      type="button"
      onClick={() => setMethod(value)}
      className={cn(
        "flex-1 border-3 border-black px-2 py-2 text-left neo-hover",
        method === value ? "bg-black text-white neo-shadow" : "bg-white",
      )}
      aria-pressed={method === value}
    >
      <span className="block text-sm font-black">{label}</span>
      <span
        className={cn(
          "block text-[11px]",
          method === value ? "text-gray-300" : "text-gray-500",
        )}
      >
        {desc}
      </span>
    </button>
  );

  const directCost = computeCost(task, { method: "direct", cards: [], verify: false }, ctx);

  return (
    <>
      <div className="flex flex-col gap-2 sm:flex-row">
        {methodButton(
          "direct",
          "직접 처리",
          `${directCost.time}블록 · 에너지 ${directCost.energy}`,
        )}
        {methodButton("delegate", "AI에 맡기기", "1블록 · 에너지 1")}
        {canAnon &&
          methodButton("delegate_anon", "가명화 후 맡기기", "민감정보를 치환해 위임")}
      </div>

      {method !== "direct" && (
        <div className="border-3 border-black bg-white p-3">
          <p className="text-xs font-bold text-gray-600">
            프롬프트 카드 (최대 {PROMPT_SLOT_MAX}장)
          </p>
          {unlockedCards.length === 0 ? (
            <p className="mt-2 text-xs text-gray-500">
              아직 카드가 없다. 빈 프롬프트로 맡기게 된다.
            </p>
          ) : (
            <div className="mt-2 flex flex-wrap gap-2">
              {unlockedCards.map((card) => (
                <button
                  key={card}
                  type="button"
                  onClick={() => toggleCard(card)}
                  className={cn(
                    "border-2 border-black px-3 py-1.5 text-xs font-black neo-hover",
                    cards.includes(card)
                      ? "bg-accent neo-shadow-sm"
                      : "bg-white text-gray-600",
                  )}
                  aria-pressed={cards.includes(card)}
                >
                  [{CARD_LABELS[card]}]
                </button>
              ))}
            </div>
          )}

          {preview && (
            <div className="mt-3 border-2 border-dashed border-gray-400 bg-gray-50 p-2.5">
              <p className="text-[10px] font-bold tracking-wide text-gray-500">
                AI 결과 미리보기
              </p>
              <p className="mt-1 text-xs leading-relaxed text-gray-800">
                {preview.text}
              </p>
            </div>
          )}

          {canVerify && (
            <label className="mt-3 flex cursor-pointer items-center gap-2 border-t-2 border-dashed border-gray-300 pt-3">
              <input
                type="checkbox"
                checked={verify}
                onChange={(event) => setVerify(event.target.checked)}
                className="h-4 w-4 accent-black"
              />
              <span className="text-xs font-bold">
                검증하고 제출 (+1블록, 에너지 1)
              </span>
            </label>
          )}
        </div>
      )}

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="border-3 border-black bg-white px-4 py-3 text-sm font-bold neo-shadow neo-hover"
        >
          ◂ 뒤로
        </button>
        <button
          type="button"
          onClick={() => onResolve(selection)}
          disabled={!affordable}
          className="flex-1 border-3 border-black bg-primary px-4 py-3 text-sm font-black text-white neo-shadow neo-hover disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
        >
          {affordable
            ? `제출 (${cost.time}블록 · 에너지 ${cost.energy})`
            : "시간이 부족하다"}
        </button>
      </div>
      {cost.energy >= state.resources.energy && (
        <p className="text-center text-xs font-bold text-primary">
          이 일을 하면 에너지가 바닥난다. 강제 퇴근하게 될지도.
        </p>
      )}
    </>
  );
}

function ChoiceTaskPanel({
  task,
  state,
  concepts,
  onChoose,
  onCancel,
}: {
  task: ChoiceTask;
  state: GameState;
  concepts: ConceptDef[];
  onChoose: (optionId: string) => void;
  onCancel: () => void;
}) {
  return (
    <>
      <div className="flex flex-col gap-2">
        {task.options.map((option) => {
          const locked =
            option.requiresConcept &&
            !state.unlockedConcepts.includes(option.requiresConcept);
          const conceptTitle = option.requiresConcept
            ? concepts.find((c) => c.id === option.requiresConcept)?.title
            : null;
          const affordable = option.cost.time <= state.resources.time;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onChoose(option.id)}
              disabled={Boolean(locked) || !affordable}
              className={cn(
                "border-3 border-black bg-white p-3 text-left neo-shadow neo-hover",
                "disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none",
              )}
            >
              <span className="block text-sm font-bold">
                {locked ? "🔒 " : ""}
                {option.label}
              </span>
              <span className="mt-1 block text-[11px] text-gray-500">
                {locked && conceptTitle
                  ? `[${conceptTitle}] 개념이 필요하다`
                  : (option.detail ?? "")}
                {option.cost.time > 0 &&
                  ` · ${option.cost.time}블록, 에너지 ${option.cost.energy}`}
              </span>
            </button>
          );
        })}
      </div>
      <button
        type="button"
        onClick={onCancel}
        className="self-start border-3 border-black bg-white px-4 py-3 text-sm font-bold neo-shadow neo-hover"
      >
        ◂ 뒤로
      </button>
    </>
  );
}
