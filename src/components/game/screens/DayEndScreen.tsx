"use client";

/**
 * 하루 정산: 결과 요약, 회고 개념 카드, 오늘의 인사이트(블로그 링크), 폭탄 암시.
 */

import type { ChapterSpec } from "@/lib/game/scenarios/schema";
import type { DaySummary } from "@/lib/game/types";
import { cn } from "@/lib/utils";

import { ConceptCard } from "../ConceptCard";
import type { ClassLinkMap } from "../speakers";
import { TIER_META } from "../tiers";

interface DayEndScreenProps {
  chapter: ChapterSpec;
  summary: DaySummary;
  links: ClassLinkMap;
  onDone: () => void;
}

export function DayEndScreen({ chapter, summary, links, onDone }: DayEndScreenProps) {
  const fallbackDefs = chapter.concepts.filter((c) =>
    summary.fallbackConcepts.includes(c.id),
  );

  return (
    <div className="flex flex-col gap-4 py-4">
      <h2 className="border-3 border-black bg-black px-3 py-2 text-base font-black text-white neo-shadow-sm">
        Day {summary.day} 정산
        {summary.forced
          ? " · 탈진 퇴근"
          : summary.overtime
            ? " · 야근 퇴근"
            : " · 정시 퇴근"}
      </h2>

      <div className="border-3 border-black bg-white p-3">
        <ul className="flex flex-col gap-1.5">
          {summary.results.map((result, index) => {
            const tier = TIER_META[result.tier];
            return (
              <li key={index} className="flex items-center justify-between gap-2 text-sm">
                <span className="truncate">{result.title}</span>
                <span
                  className={cn(
                    "shrink-0 border-2 border-black px-1.5 py-0.5 text-[11px] font-bold",
                    tier.badgeClass,
                  )}
                >
                  {tier.label}
                </span>
              </li>
            );
          })}
          {summary.failedTaskIds.length > 0 && (
            <li className="mt-1 border-t-2 border-dashed border-gray-300 pt-2 text-xs font-bold text-primary">
              마감 실패 {summary.failedTaskIds.length}건. 팀장: &quot;이거 오늘까지였는데요.&quot;
            </li>
          )}
        </ul>
        <div className="mt-3 flex flex-wrap gap-1.5 border-t-2 border-dashed border-gray-300 pt-2 text-[11px] font-black">
          <span className={cn("border-2 border-black px-1.5 py-0.5", summary.trustDelta >= 0 ? "bg-accent" : "bg-primary text-white")}>
            신뢰 {summary.trustDelta >= 0 ? `+${summary.trustDelta}` : summary.trustDelta}
          </span>
          <span className="border-2 border-black bg-white px-1.5 py-0.5">
            KPI +{summary.kpiDelta}
          </span>
          <span className="border-2 border-black bg-white px-1.5 py-0.5">
            에너지 +{summary.energyRestored}
          </span>
        </div>
      </div>

      {summary.bombHint && (
        <p className="text-center text-xs italic text-gray-500">
          오늘 낸 자료, 숫자가 너무 깔끔했나. 뭔가 찜찜하다.
        </p>
      )}

      {fallbackDefs.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-xs font-black text-gray-600">퇴근길 회고: 오늘 배웠어야 했던 것</p>
          {fallbackDefs.map((concept) => (
            <ConceptCard key={concept.id} concept={concept} links={links} fresh />
          ))}
        </div>
      )}

      {summary.insightSlugs.length > 0 && (
        <div className="border-3 border-black bg-white p-3">
          <p className="text-xs font-black text-gray-600">오늘의 인사이트</p>
          <ul className="mt-1.5 flex flex-col gap-1">
            {summary.insightSlugs.map((slug) => {
              const link = links[slug];
              if (!link) return null;
              return (
                <li key={slug}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-bold text-primary underline underline-offset-2"
                  >
                    {link.title} ↗
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <button
        type="button"
        onClick={onDone}
        className="border-3 border-black bg-primary px-4 py-3 text-sm font-black text-white neo-shadow neo-hover"
      >
        다음 날로
      </button>
    </div>
  );
}
