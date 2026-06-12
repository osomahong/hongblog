"use client";

/**
 * 게임 클라이언트 루트: useReducer 상태 머신 + 화면 라우팅 + 저장/계측.
 * reducer는 순수하게 유지하고, 저장과 GA 이벤트는 phase 전이를 감지하는
 * effect에서 처리한다. 초기 렌더는 항상 타이틀이라 hydration 충돌이 없다.
 */

import { useEffect, useReducer, useRef, useState } from "react";

import {
  gameReducer,
  getActiveTasks,
  getDaySpec,
  getTaskById,
  initialState,
  isBossDay,
} from "@/lib/game/engine";
import { clearSave, loadSave, persistSave } from "@/lib/game/save";
import { getDefaultChapter } from "@/lib/game/scenarios";
import type { GameAction, GameState } from "@/lib/game/types";
import { sendGAEvent } from "@/lib/gtm";

import { ConceptNote } from "./hud/ConceptNote";
import { ResourceBar } from "./hud/ResourceBar";
import { BossFeedbackScreen, BossResultScreen, BossRoundScreen } from "./screens/BossScreens";
import { DayEndScreen } from "./screens/DayEndScreen";
import { DialogueScreen } from "./screens/DialogueScreen";
import { EndingScreen } from "./screens/EndingScreen";
import { GameOverScreen } from "./screens/GameOverScreen";
import { OvertimeScreen } from "./screens/OvertimeScreen";
import { ResultScreen } from "./screens/ResultScreen";
import { TaskScreen } from "./screens/TaskScreen";
import { TaskSelectScreen } from "./screens/TaskSelectScreen";
import { TitleScreen } from "./screens/TitleScreen";
import type { ClassLinkMap } from "./speakers";

const chapter = getDefaultChapter();

const HUD_PHASES = new Set([
  "task_select",
  "task",
  "task_result",
  "coaching",
  "overtime_choice",
  "boss_intro",
  "boss_round",
  "boss_feedback",
]);

function titleState(): GameState {
  return { ...initialState(chapter, 0), phase: { kind: "title" } };
}

/** 화면 로컬 상태 리셋과 전이 이벤트 중복 방지용 식별자 */
function phaseKey(state: GameState): string {
  const phase = state.phase;
  switch (phase.kind) {
    case "task":
    case "task_result":
      return `${phase.kind}:${state.day}:${phase.taskId}:${state.tasks[phase.taskId]?.attempts ?? 0}`;
    case "coaching":
      return `coaching:${phase.eventId}`;
    case "boss_round":
    case "boss_feedback":
      return `${phase.kind}:${phase.round}`;
    case "day_start":
    case "task_select":
    case "day_end":
      return `${phase.kind}:${state.day}`;
    default:
      return phase.kind;
  }
}

export function GameRoot({ links }: { links: ClassLinkMap }) {
  const [state, dispatch] = useReducer(
    (current: GameState, action: GameAction) =>
      gameReducer(current, action, chapter),
    undefined,
    titleState,
  );
  const [hasSave, setHasSave] = useState(false);
  const trackedKey = useRef<string>("title");

  useEffect(() => {
    setHasSave(loadSave() !== null);
  }, []);

  // phase 전이마다 저장 + 계측 (한 key당 1회)
  useEffect(() => {
    const key = phaseKey(state);
    if (key === trackedKey.current) return;
    trackedKey.current = key;

    const phase = state.phase;
    if (phase.kind === "title") return;

    if (phase.kind === "ending") {
      sendGAEvent("game_ending", {
        chapter_id: state.chapterId,
        ending_id: phase.endingId,
        trust: state.resources.trust,
        kpi: state.resources.kpi,
      });
      clearSave();
      setHasSave(false);
      return;
    }

    persistSave(state);
    setHasSave(true);

    if (phase.kind === "task_result") {
      sendGAEvent("game_task_resolve", {
        chapter_id: state.chapterId,
        day: state.day,
        task_id: phase.taskId,
        tier: phase.outcome.tier,
        verified: phase.outcome.verified,
      });
    } else if (phase.kind === "day_end") {
      sendGAEvent("game_day_complete", {
        chapter_id: state.chapterId,
        day: state.day,
        trust: state.resources.trust,
        kpi: state.resources.kpi,
        overtime: phase.summary.overtime,
      });
    } else if (phase.kind === "boss_intro") {
      sendGAEvent("game_boss_start", {
        chapter_id: state.chapterId,
        prep_score: state.prepScore,
      });
    } else if (phase.kind === "game_over") {
      sendGAEvent("game_over", {
        chapter_id: state.chapterId,
        cause: phase.cause,
        day: state.day,
      });
    }
  }, [state]);

  const handleNewGame = () => {
    const seed = Math.floor(Math.random() * 0x7fffffff);
    sendGAEvent("game_start", { chapter_id: chapter.id, is_resume: false });
    dispatch({ type: "NEW_GAME", seed });
  };

  const handleContinue = () => {
    const saved = loadSave();
    if (!saved || saved.chapterId !== chapter.id) {
      setHasSave(false);
      return;
    }
    sendGAEvent("game_start", { chapter_id: chapter.id, is_resume: true });
    dispatch({ type: "LOAD", saved });
  };

  const phase = state.phase;
  const daySpec = state.day >= 1 ? getDaySpec(chapter, state.day) : null;
  const showHud = daySpec && HUD_PHASES.has(phase.kind);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col px-4 pb-16">
      {showHud && daySpec && (
        <>
          <ResourceBar
            dayLabel={`Day ${state.day} · ${daySpec.title}`}
            resources={state.resources}
            timeBudget={daySpec.timeBudget}
          />
          <ConceptNote
            chapter={chapter}
            unlocked={state.unlockedConcepts}
            links={links}
          />
        </>
      )}

      <div key={phaseKey(state)}>
        {phase.kind === "title" && (
          <TitleScreen
            chapter={chapter}
            hasSave={hasSave}
            onNewGame={handleNewGame}
            onContinue={handleContinue}
          />
        )}

        {phase.kind === "intro" && (
          <DialogueScreen
            heading={`${chapter.title}: ${chapter.subtitle}`}
            lines={chapter.intro}
            onDone={() => dispatch({ type: "ADVANCE" })}
            doneLabel="월요일 출근"
            links={links}
          />
        )}

        {phase.kind === "day_start" && daySpec && (
          <DialogueScreen
            heading={`Day ${state.day} · ${daySpec.title}`}
            lines={daySpec.briefing}
            onDone={() => dispatch({ type: "ADVANCE" })}
            doneLabel="업무 시작"
            links={links}
          />
        )}

        {phase.kind === "task_select" && (
          <TaskSelectScreen
            chapter={chapter}
            state={state}
            tasks={getActiveTasks(chapter, state)}
            isBossDay={isBossDay(chapter, state.day)}
            onSelect={(taskId) => dispatch({ type: "SELECT_TASK", taskId })}
            onRest={(rest) => dispatch({ type: "REST", rest })}
            onDayEnd={() => dispatch({ type: "REQUEST_DAY_END" })}
          />
        )}

        {phase.kind === "task" && (
          <TaskScreen
            task={getTaskById(chapter, state, phase.taskId)!}
            state={state}
            concepts={chapter.concepts}
            onResolve={(selection) =>
              dispatch({ type: "RESOLVE_TASK", taskId: phase.taskId, selection })
            }
            onChoose={(optionId) =>
              dispatch({ type: "CHOOSE_OPTION", taskId: phase.taskId, optionId })
            }
            onCancel={() => dispatch({ type: "CANCEL_TASK" })}
          />
        )}

        {phase.kind === "task_result" && (
          <ResultScreen
            chapter={chapter}
            task={getTaskById(chapter, state, phase.taskId)}
            outcome={phase.outcome}
            onDone={() => dispatch({ type: "ADVANCE" })}
          />
        )}

        {phase.kind === "coaching" && daySpec && (
          <DialogueScreen
            heading="잠깐의 틈"
            lines={
              daySpec.coaching.find((event) => event.id === phase.eventId)
                ?.dialogue ?? []
            }
            grantedConcept={chapter.concepts.find(
              (concept) =>
                concept.id ===
                daySpec.coaching.find((event) => event.id === phase.eventId)
                  ?.grantConcept,
            )}
            onDone={() => dispatch({ type: "ADVANCE" })}
            doneLabel="자리로 돌아간다"
            links={links}
          />
        )}

        {phase.kind === "overtime_choice" && (
          <OvertimeScreen
            pendingTasks={phase.pendingFailIds
              .map((taskId) => getTaskById(chapter, state, taskId))
              .filter((task) => task !== undefined)}
            consecutiveOvertime={state.consecutiveOvertime}
            onDecide={(accept) => dispatch({ type: "OVERTIME_DECIDE", accept })}
          />
        )}

        {phase.kind === "day_end" && (
          <DayEndScreen
            chapter={chapter}
            summary={phase.summary}
            links={links}
            onDone={() => dispatch({ type: "ADVANCE" })}
          />
        )}

        {phase.kind === "boss_intro" && (
          <DialogueScreen
            heading="14:00 · 본부장 보고"
            lines={chapter.boss.intro}
            onDone={() => dispatch({ type: "ADVANCE" })}
            doneLabel="보고 시작"
            links={links}
          />
        )}

        {phase.kind === "boss_round" && (
          <BossRoundScreen
            chapter={chapter}
            state={state}
            round={phase.round}
            bombed={phase.bombed}
            onAnswer={(optionId) => dispatch({ type: "BOSS_ANSWER", optionId })}
            onAdvance={() => dispatch({ type: "ADVANCE" })}
          />
        )}

        {phase.kind === "boss_feedback" && (
          <BossFeedbackScreen
            chapter={chapter}
            round={phase.round}
            optionId={phase.optionId}
            score={phase.score}
            onDone={() => dispatch({ type: "ADVANCE" })}
          />
        )}

        {phase.kind === "boss_result" && (
          <BossResultScreen
            chapter={chapter}
            passed={phase.passed}
            totalScore={phase.totalScore}
            onDone={() => dispatch({ type: "ADVANCE" })}
          />
        )}

        {phase.kind === "ending" && (
          <EndingScreen
            chapter={chapter}
            state={state}
            endingId={phase.endingId}
            links={links}
            onRestart={() => dispatch({ type: "QUIT_TO_TITLE" })}
          />
        )}

        {phase.kind === "game_over" && (
          <GameOverScreen
            chapter={chapter}
            cause={phase.cause}
            day={state.day}
            links={links}
            onRetry={() => dispatch({ type: "RESTART_CHECKPOINT" })}
            onTitle={() => dispatch({ type: "QUIT_TO_TITLE" })}
          />
        )}
      </div>
    </div>
  );
}
