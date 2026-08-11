"use client";

import Link from "next/link";
import { CATEGORY_LABELS } from "@/lib/constants";
import { highlight, type SearchDocType, type SearchHit } from "@/lib/search";
import { cn } from "@/lib/utils";

const TYPE_LABELS: Record<SearchDocType, string> = {
  insight: "인사이트",
  class: "클래스",
  course: "코스",
  page: "페이지",
};

const TYPE_STYLES: Record<SearchDocType, string> = {
  insight: "bg-[#FF0033] text-white",
  class: "bg-[#FFD700] text-black",
  course: "bg-black text-white",
  page: "bg-gray-200 text-black",
};

interface HighlightedProps {
  text: string;
  terms: string[];
}

/** 검색어와 겹치는 구간에 노란 배경을 입힌다. */
function Highlighted({ text, terms }: HighlightedProps) {
  return (
    <>
      {highlight(text, terms).map((segment, index) =>
        segment.hit ? (
          <mark key={index} className="bg-[#FFD700] text-black px-0.5">
            {segment.text}
          </mark>
        ) : (
          <span key={index}>{segment.text}</span>
        )
      )}
    </>
  );
}

interface SearchResultListProps {
  hits: SearchHit[];
  terms: string[];
  /** compact은 내비 오버레이용, full은 /search 결과 페이지용 */
  variant?: "compact" | "full";
  /** 키보드로 선택 중인 항목 인덱스. 오버레이에서만 쓴다. */
  activeIndex?: number;
  onNavigate?: (hit: SearchHit) => void;
}

export function SearchResultList({
  hits,
  terms,
  variant = "full",
  activeIndex = -1,
  onNavigate,
}: SearchResultListProps) {
  const isCompact = variant === "compact";

  return (
    <ul className={cn(isCompact ? "divide-y-2 divide-black" : "space-y-3 sm:space-y-4")}>
      {hits.map((hit, index) => (
        <li key={hit.doc.href} data-search-result={index}>
          <Link
            href={hit.doc.href}
            onClick={() => onNavigate?.(hit)}
            className={cn(
              "block transition-colors",
              isCompact
                ? cn("px-3 sm:px-4 py-3 hover:bg-[#FFF7CC]", index === activeIndex && "bg-[#FFF7CC]")
                : "bg-white border-4 border-black neo-shadow p-4 sm:p-5 hover:bg-[#FFF7CC] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]"
            )}
          >
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <span
                className={cn(
                  "text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 border-2 border-black",
                  TYPE_STYLES[hit.doc.type]
                )}
              >
                {TYPE_LABELS[hit.doc.type]}
              </span>
              {CATEGORY_LABELS[hit.doc.category] && (
                <span className="text-[11px] font-bold text-gray-600">
                  {CATEGORY_LABELS[hit.doc.category]}
                </span>
              )}
              {hit.matchedInBody && (
                <span className="text-[10px] font-bold text-gray-500 border border-gray-300 px-1 py-0.5">
                  본문 일치
                </span>
              )}
              {!isCompact && hit.doc.date !== "2025-01-01" && (
                <span className="text-[11px] font-mono text-gray-500 ml-auto">{hit.doc.date}</span>
              )}
            </div>

            <p
              className={cn(
                "font-black leading-snug text-black",
                isCompact ? "text-sm" : "text-base sm:text-xl"
              )}
            >
              <Highlighted text={hit.doc.title} terms={terms} />
            </p>

            <p
              className={cn(
                "text-gray-600 mt-1 leading-relaxed",
                isCompact ? "text-xs line-clamp-2" : "text-xs sm:text-sm line-clamp-3"
              )}
            >
              <Highlighted text={hit.snippet} terms={terms} />
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
