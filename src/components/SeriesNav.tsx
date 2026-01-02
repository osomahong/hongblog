"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, List } from "lucide-react";

type SeriesNavProps = {
  seriesInfo: {
    id: number;
    slug: string;
    title: string;
  };
  navigation: {
    prev: { slug: string; title: string } | null;
    next: { slug: string; title: string } | null;
    currentIndex: number;
    totalCount: number;
  };
};

export function SeriesNav({ seriesInfo, navigation }: SeriesNavProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="relative">
      {/* 기본 컴팩트 바 */}
      <div className="flex items-center bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-black">
        <div className="flex items-center gap-2 sm:gap-3 px-3 py-2 sm:px-4 sm:py-2.5 min-w-0">
          <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 flex-shrink-0" />
          <Link
            href={`/series/${seriesInfo.slug}`}
            className="font-bold text-xs sm:text-sm hover:underline truncate max-w-[100px] sm:max-w-[180px]"
          >
            {seriesInfo.title}
          </Link>
          <span className="text-xs font-mono bg-white px-1.5 py-0.5 border border-black flex-shrink-0">
            {navigation.currentIndex}/{navigation.totalCount}
          </span>
        </div>

        <div className="flex items-center gap-1 sm:gap-1.5 border-l border-black/20 px-2 sm:px-3">
          {/* 이전/다음 버튼 */}
          {navigation.prev ? (
            <Link href={`/insights/${navigation.prev.slug}`}>
              <button className="p-1.5 hover:bg-purple-200 border border-black" title={navigation.prev.title}>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </Link>
          ) : (
            <button className="p-1.5 opacity-30 border border-gray-300" disabled>
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
          {navigation.next ? (
            <Link href={`/insights/${navigation.next.slug}`}>
              <button className="p-1.5 hover:bg-purple-200 border border-black" title={navigation.next.title}>
                <ChevronRight className="w-4 h-4" />
              </button>
            </Link>
          ) : (
            <button className="p-1.5 opacity-30 border border-gray-300" disabled>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          {/* 확장 토글 버튼 */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 hover:bg-purple-200 border border-black ml-0.5"
            aria-label={isExpanded ? "접기" : "더보기"}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 확장 영역 (오버레이) */}
      {isExpanded && (
        <>
          {/* 배경 클릭 시 닫기 */}
          <div className="fixed inset-0 z-40" onClick={() => setIsExpanded(false)} />

          <div className="absolute right-0 top-full mt-1 w-[320px] sm:w-[400px] bg-white border-2 border-black shadow-lg z-50">
            <div className="px-4 py-3 space-y-3">
              {/* 시리즈 설명 */}
              <p className="text-xs sm:text-sm text-muted-foreground">
                📚 연재 콘텐츠를 순서대로 읽어보세요. 이전/다음 버튼으로 시리즈 내 글을 탐색할 수 있습니다.
              </p>

              {/* 이전/다음 글 정보 */}
              <div className="grid grid-cols-2 gap-2">
                {navigation.prev ? (
                  <Link
                    href={`/insights/${navigation.prev.slug}`}
                    className="flex items-center gap-2 p-2 border-2 border-black hover:bg-purple-50 transition-colors"
                    onClick={() => setIsExpanded(false)}
                  >
                    <ChevronLeft className="w-4 h-4 flex-shrink-0 text-purple-600" />
                    <div className="min-w-0">
                      <div className="text-[10px] text-muted-foreground uppercase">이전</div>
                      <div className="text-xs font-medium truncate">{navigation.prev.title}</div>
                    </div>
                  </Link>
                ) : (
                  <div className="flex items-center gap-2 p-2 border-2 border-dashed border-gray-300 opacity-50">
                    <ChevronLeft className="w-4 h-4 flex-shrink-0" />
                    <div className="text-xs text-muted-foreground">첫 번째 글</div>
                  </div>
                )}

                {navigation.next ? (
                  <Link
                    href={`/insights/${navigation.next.slug}`}
                    className="flex items-center gap-2 p-2 border-2 border-black hover:bg-purple-50 transition-colors"
                    onClick={() => setIsExpanded(false)}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] text-muted-foreground uppercase text-right">다음</div>
                      <div className="text-xs font-medium truncate text-right">{navigation.next.title}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 flex-shrink-0 text-purple-600" />
                  </Link>
                ) : (
                  <div className="flex items-center gap-2 p-2 border-2 border-dashed border-gray-300 opacity-50 justify-end">
                    <div className="text-xs text-muted-foreground">마지막 글</div>
                    <ChevronRight className="w-4 h-4 flex-shrink-0" />
                  </div>
                )}
              </div>

              {/* 전체 목차 링크 */}
              <Link
                href={`/series/${seriesInfo.slug}`}
                className="flex items-center justify-center gap-2 p-2 bg-purple-100 border-2 border-black hover:bg-purple-200 transition-colors text-xs sm:text-sm font-bold"
                onClick={() => setIsExpanded(false)}
              >
                <List className="w-4 h-4" />
                전체 목차 보기
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
