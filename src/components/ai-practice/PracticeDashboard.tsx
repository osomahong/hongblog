"use client";

/**
 * AI-PRACTICE 랜딩의 학습 기록 대시보드.
 * localStorage의 AIPBL 진행 기록(hongblog-aipbl-progress)을 읽어 트랙별 상태(미시작,
 * 진행 중, 완료), 점검 퀴즈 최고 점수, 전체 진행률을 보여 준다. 서버 데이터가 아니라
 * 이 브라우저에 저장된 기록만 사용한다.
 */

import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { EventLink } from "./EventLink";
import {
  AIPBL_PROGRESS_EVENT,
  readAipblProgress,
  type LabProgress,
} from "./lab/progress";

interface DashboardTrack {
  id: string;
  title: string;
  href: string;
  missionTotal: number;
}

const TRACKS: DashboardTrack[] = [
  { id: "prompt-basics", title: "프롬프트 기초", href: "/ai-practice/prompt-basics", missionTotal: 3 },
  {
    id: "prompt-intermediate",
    title: "프롬프트 중급",
    href: "/ai-practice/prompt-intermediate",
    missionTotal: 3,
  },
  {
    id: "prompt-advanced",
    title: "프롬프트 심화",
    href: "/ai-practice/prompt-advanced",
    missionTotal: 3,
  },
];

type TrackStatus = "none" | "inProgress" | "done";

function trackStatus(p?: LabProgress): TrackStatus {
  if (!p) return "none";
  if (p.completedAt) return "done";
  if (p.phase === "quiz" || (p.phase === "mission" && p.missionIndex >= 0)) return "inProgress";
  return "none";
}

function statusText(p: LabProgress | undefined, status: TrackStatus, missionTotal: number): string {
  if (status === "done") return "완료";
  if (status === "inProgress") {
    if (p?.phase === "quiz") return "점검 퀴즈 진행 중";
    return `미션 ${(p?.missionIndex ?? 0) + 1}/${missionTotal} 진행 중`;
  }
  return "아직 시작하지 않았습니다";
}

function ctaLabel(status: TrackStatus): string {
  if (status === "done") return "다시 실습하기";
  if (status === "inProgress") return "이어서 하기";
  return "시작하기";
}

export function PracticeDashboard() {
  const [progress, setProgress] = useState<Record<string, LabProgress>>({});

  useEffect(() => {
    // hydration이 끝난 다음 틱에서 읽어 서버 렌더 결과와의 불일치를 피한다
    const load = () => setProgress(readAipblProgress());
    const t = setTimeout(load, 0);
    window.addEventListener(AIPBL_PROGRESS_EVENT, load);
    return () => {
      clearTimeout(t);
      window.removeEventListener(AIPBL_PROGRESS_EVENT, load);
    };
  }, []);

  const doneCount = TRACKS.filter((track) => trackStatus(progress[track.id]) === "done").length;
  const percent = Math.round((doneCount / TRACKS.length) * 100);
  const hasAnyRecord = TRACKS.some((track) => trackStatus(progress[track.id]) !== "none");

  return (
    <section className="relative mb-16 sm:mb-20">
      <div className="ap-glow w-[460px] h-[460px] right-[-240px] top-[-60px] bg-[rgba(125,211,252,0.07)]" aria-hidden />
      <div className="relative">
        <p className="ap-label mb-3">My Records</p>
        <h2 className="text-xl sm:text-3xl font-semibold tracking-tight mb-5">내 학습 기록</h2>
        <p className="text-sm sm:text-base leading-relaxed text-[var(--ap-muted)] max-w-3xl mb-10">
          학습 기록은 이 브라우저에 저장되는 나의 AIPBL 진행 현황입니다. 완료한 실습과 점검
          퀴즈 최고 점수를 확인하고, 진행 중인 실습을 이어서 할 수 있습니다.
        </p>

        {/* 요약: 완료 개수와 진행률 바 */}
        <div className="ap-card ap-card-accent p-5 sm:p-6 mb-5">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <p className="flex items-center gap-3 text-sm font-medium text-white">
              <img
                src="/images/ai-practice/icons/goal-trophy.png"
                alt=""
                aria-hidden
                className="ap-icon-3d w-9 h-9"
              />
              프롬프트 트랙 진행률
            </p>
            <p className="text-sm font-mono text-gray-200">
              완료 {doneCount} / {TRACKS.length}
            </p>
          </div>
          <div className="h-2 rounded-full bg-white/[0.07] overflow-hidden" aria-hidden>
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#7dd3fc] via-[#a78bfa] to-[#ff5c7d] transition-[width] duration-700"
              style={{ width: `${percent}%` }}
            />
          </div>
          {!hasAnyRecord && (
            <p className="text-xs leading-relaxed text-[var(--ap-muted)] mt-3">
              아직 기록이 없습니다. 첫 AIPBL을 시작하면 진행 상황이 이 자리에 표시됩니다.
            </p>
          )}
        </div>

        {/* 트랙별 기록 카드 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          {TRACKS.map((track, i) => {
            const p = progress[track.id];
            const status = trackStatus(p);
            const done = status === "done";
            return (
              <EventLink
                key={track.id}
                href={track.href}
                eventName="click_aipractice_start"
                params={{
                  content_id: track.id,
                  content_name: track.title,
                  button_name: "dashboard",
                  position: i + 1,
                }}
                className="block"
              >
                <SpotlightCard
                  className="ap-card ap-card-accent ap-card-hover p-6 h-full"
                  spotlightColor="rgba(125, 211, 252, 0.10)"
                  radius={360}
                >
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <span className="ap-step-index">{String(i + 1).padStart(2, "0")}</span>
                    {done ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[rgba(125,211,252,0.5)] text-[11px] font-medium text-[#7dd3fc] flex-shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={1.8} /> 완료
                      </span>
                    ) : (
                      <span
                        className={`px-2.5 py-1 rounded-full border text-[11px] font-medium flex-shrink-0 ${
                          status === "inProgress"
                            ? "border-[rgba(255,215,0,0.5)] text-[#ffe08a]"
                            : "border-white/15 text-[var(--ap-muted)]"
                        }`}
                      >
                        {status === "inProgress" ? "진행 중" : "미시작"}
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-base mb-1.5">{track.title}</h3>
                  <p className="text-[13px] leading-relaxed text-[var(--ap-muted)] mb-4">
                    {statusText(p, status, track.missionTotal)}
                    {p?.quizScore !== undefined && p?.quizTotal
                      ? `, 점검 퀴즈 최고 ${p.quizScore}/${p.quizTotal}`
                      : ""}
                  </p>
                  <p className="inline-flex items-center gap-1.5 text-[13px] font-medium text-gray-200">
                    {ctaLabel(status)} <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.8} />
                  </p>
                </SpotlightCard>
              </EventLink>
            );
          })}
        </div>
      </div>
    </section>
  );
}
