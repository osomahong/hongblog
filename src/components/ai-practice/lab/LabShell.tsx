"use client";

/**
 * AIPBL 공용 오케스트레이터.
 * 히어로와 같은 다크 테마 윈도우 프레임 안에서, 상단 가로 스테퍼로 진행 상태를 보여 주고
 * 아래 전폭 수행 영역에서 과제 확인 → 미션 → 점검 → 정리 단계를 진행한다.
 * 각 AIPBL은 이 셸에 대본 데이터(lab-data.ts)와 미션 컴포넌트만 주입한다.
 */

import { Fragment, useEffect, useState, type ComponentType } from "react";
import { CheckCircle2 } from "lucide-react";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { sendGAEvent } from "@/lib/gtm";
import { BriefPhase, type LabResume } from "./BriefPhase";
import { QuizPhase, type QuizQuestion } from "./QuizPhase";
import { WrapPhase, type WrapContent } from "./WrapPhase";
import { readAipblProgress, saveAipblProgress, type LabProgress } from "./progress";

/** GA 이벤트 공통 매개변수 (GTM: GA4 - Event - AI실습 관련) */
export interface LabEventParams {
  content_id: string;
  content_name: string;
}

export interface LabMissionMeta {
  title: string;
  goal: string;
}

export interface LabMission {
  meta: LabMissionMeta;
  /** GA 매개변수 mission_name으로 전송되는 영문 식별자. 예: "role" */
  name: string;
  Component: ComponentType<{ onComplete: () => void }>;
}

export interface LabBrief {
  intro: string;
  goal: string;
  footer: string;
}

interface LabShellProps {
  /** 윈도우 타이틀 바 문구. 예: "AIPBL 01 : 프롬프트 기초" */
  windowTitle: string;
  eventParams: LabEventParams;
  brief: LabBrief;
  missions: LabMission[];
  quiz: QuizQuestion[];
  wrap: WrapContent;
  /** 정리 단계 헤더 설명 오버라이드. 기본값은 "오늘 익힌 세 기술을 ..." */
  wrapDesc?: string;
  /** 점검 단계 헤더 제목 오버라이드. 기본값은 "점검: 프롬프트 고르기" */
  quizTitle?: string;
  /** 점검 단계 헤더 설명 오버라이드. 기본값은 "두 프롬프트 중 더 나은 쪽을 ..." */
  quizDesc?: string;
}

type Phase = "brief" | "mission" | "quiz" | "wrap";

const PHASE_STEPS: { key: Phase; label: string }[] = [
  { key: "brief", label: "과제 확인" },
  { key: "mission", label: "수행" },
  { key: "quiz", label: "점검" },
  { key: "wrap", label: "정리" },
];

const PHASE_ORDER: Phase[] = ["brief", "mission", "quiz", "wrap"];

function phaseDesc(
  phase: Phase,
  missions: LabMission[],
  missionIndex: number,
  wrapDesc?: string,
  quizDesc?: string
): string {
  if (phase === "brief") {
    return "이번 AIPBL에서 만들 결과물과 진행 순서를 확인하고, 미션 1 시작 버튼을 누릅니다.";
  }
  if (phase === "mission") {
    return missions[missionIndex].meta.goal;
  }
  if (phase === "quiz") {
    return (
      quizDesc ?? "두 프롬프트 중 더 나은 쪽을 고릅니다. 모두 3문항이고, 고르면 해설이 바로 표시됩니다."
    );
  }
  return (
    wrapDesc ??
    "오늘 익힌 세 기술을 템플릿 한 장으로 정리합니다. 복사해서 실제 AI에게 붙여 넣으면 실습이 완성됩니다."
  );
}

export function LabShell({
  windowTitle,
  eventParams,
  brief,
  missions,
  quiz,
  wrap,
  wrapDesc,
  quizTitle,
  quizDesc,
}: LabShellProps) {
  const [phase, setPhase] = useState<Phase>("brief");
  const [missionIndex, setMissionIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [runId, setRunId] = useState(0);
  const [resume, setResume] = useState<LabResume | null>(null);
  const [record, setRecord] = useState<LabProgress | null>(null);

  const labId = eventParams.content_id;
  const phaseIndex = PHASE_ORDER.indexOf(phase);

  // 마운트 후 저장된 진행 상태를 읽어, 중간 이탈자에게 이어서 하기를 제안한다.
  // hydration이 끝난 다음 틱에서 상태를 갱신해 서버 렌더 결과와의 불일치를 피한다.
  useEffect(() => {
    const t = setTimeout(() => {
      const saved = readAipblProgress()[labId];
      if (!saved) return;
      setRecord(saved);
      if (saved.phase === "mission" && saved.missionIndex > 0) {
        setResume({
          label: `미션 ${saved.missionIndex + 1}부터 이어서 하기`,
          phase: "mission",
          missionIndex: saved.missionIndex,
        });
      } else if (saved.phase === "quiz") {
        setResume({ label: "점검 퀴즈부터 이어서 하기", phase: "quiz", missionIndex: 0 });
      }
    }, 0);
    return () => clearTimeout(t);
  }, [labId]);

  const startLab = () => {
    sendGAEvent("aipbl_start", { ...eventParams });
    saveAipblProgress(labId, { phase: "mission", missionIndex: 0 });
    setResume(null);
    setPhase("mission");
  };

  const resumeLab = () => {
    if (!resume) return;
    sendGAEvent("aipbl_start", { ...eventParams, resume_from: resume.phase });
    setMissionIndex(resume.missionIndex);
    setPhase(resume.phase);
    setResume(null);
  };

  const nextMission = () => {
    sendGAEvent("aipbl_mission_complete", {
      ...eventParams,
      position: missionIndex + 1,
      mission_name: missions[missionIndex].name,
    });
    if (missionIndex < missions.length - 1) {
      saveAipblProgress(labId, { phase: "mission", missionIndex: missionIndex + 1 });
      setMissionIndex((i) => i + 1);
    } else {
      saveAipblProgress(labId, { phase: "quiz", missionIndex: 0 });
      setPhase("quiz");
    }
  };

  const completeQuiz = (score: number) => {
    sendGAEvent("aipbl_complete", { ...eventParams, quiz_score: score });
    saveAipblProgress(labId, {
      phase: "wrap",
      missionIndex: 0,
      completedAt: Date.now(),
      quizScore: score,
      quizTotal: quiz.length,
    });
    setRecord(readAipblProgress()[labId] ?? null);
    setQuizScore(score);
    setPhase("wrap");
  };

  const restart = () => {
    sendGAEvent("aipbl_restart", { ...eventParams });
    saveAipblProgress(labId, { phase: "brief", missionIndex: 0 });
    setResume(null);
    setPhase("brief");
    setMissionIndex(0);
    setQuizScore(0);
    setRunId((n) => n + 1);
  };

  const headerTitle =
    phase === "brief"
      ? "과제 확인"
      : phase === "mission"
        ? missions[missionIndex].meta.title
        : phase === "quiz"
          ? (quizTitle ?? "점검: 프롬프트 고르기")
          : "정리";

  const Mission = missions[missionIndex].Component;

  return (
    <SpotlightCard className="ap-hero" spotlightColor="rgba(125, 211, 252, 0.14)" radius={700}>
      <div className="ap-hero-grid" aria-hidden />
      <div className="relative">
        {/* 윈도우 타이틀 바 */}
        <div className="flex items-center gap-2 px-6 sm:px-10 py-4 border-b border-white/10">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" aria-hidden />
          <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" aria-hidden />
          <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" aria-hidden />
          <span className="ml-3 text-xs font-semibold text-white">{windowTitle}</span>
        </div>

        {/* 상단 가로 스테퍼 */}
        <div className="flex items-center gap-3 sm:gap-4 px-6 sm:px-10 py-5 border-b border-white/10">
          {PHASE_STEPS.map((step, i) => {
            const done = i < phaseIndex;
            const current = i === phaseIndex;
            return (
              <Fragment key={step.key}>
                {i > 0 && <span className="flex-1 h-px bg-white/12" aria-hidden />}
                <span
                  className={`inline-flex items-center gap-2 text-[13px] font-medium whitespace-nowrap ${
                    current ? "text-white font-semibold" : done ? "text-gray-300" : "text-[var(--ap-muted)]"
                  }`}
                >
                  {done ? (
                    <CheckCircle2 className="w-4 h-4 text-[#7dd3fc]" strokeWidth={1.6} />
                  ) : current ? (
                    <span
                      className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-[#7dd3fc] via-[#a78bfa] to-[#ff5c7d]"
                      aria-hidden
                    />
                  ) : (
                    <span
                      className="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[9px]"
                      aria-hidden
                    >
                      {i + 1}
                    </span>
                  )}
                  {step.label}
                  {step.key === "mission" && current && (
                    <span className="text-[11px] font-mono text-[var(--ap-muted)]">
                      미션 {missionIndex + 1}/{missions.length}
                    </span>
                  )}
                </span>
              </Fragment>
            );
          })}
        </div>

        {/* 수행 영역 (전폭) */}
        <section key={runId} className="p-6 sm:p-10">
          <header className="mb-6 pb-5 border-b border-white/10">
            <h2 className="text-lg sm:text-2xl font-semibold tracking-tight text-white mb-1.5">
              {headerTitle}
            </h2>
            <p className="text-sm text-[var(--ap-muted)] leading-relaxed">
              {phaseDesc(phase, missions, missionIndex, wrapDesc, quizDesc)}
            </p>
          </header>

          {phase === "brief" && (
            <BriefPhase
              brief={brief}
              missions={missions.map((m) => m.meta)}
              onStart={startLab}
              resume={resume}
              onResume={resumeLab}
              record={record}
            />
          )}
          {phase === "mission" && <Mission key={missionIndex} onComplete={nextMission} />}
          {phase === "quiz" && (
            <QuizPhase quiz={quiz} eventParams={eventParams} onComplete={completeQuiz} />
          )}
          {phase === "wrap" && (
            <WrapPhase
              content={wrap}
              score={quizScore}
              total={quiz.length}
              bestScore={record?.quizScore}
              eventParams={eventParams}
              onRestart={restart}
            />
          )}
        </section>
      </div>
    </SpotlightCard>
  );
}
