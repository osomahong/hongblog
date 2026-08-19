"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import { NeoBadge } from "@/components/neo";
import { sendGAEvent } from "@/lib/gtm";
import { hologramElement } from "@/lib/canvas-fx";
import type { CourseCard } from "@/lib/promotions";

interface CourseCarouselProps {
  courses: CourseCard[];
}

/**
 * 메인 코스 캐러셀.
 * 코스 전체를 가로 한 줄에 편다. 카드 링크는 전부 DOM에 남기고 넘기기만 스크롤로 처리한다.
 */
export function CourseCarousel({ courses }: CourseCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  if (courses.length === 0) return null;

  const scrollByPage = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;

    track.scrollBy({ left: direction * track.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <section className="mb-6 sm:mb-12">
      <div className="flex items-center gap-3 mb-4 sm:mb-6 border-b-4 border-black pb-2">
        <h2 className="text-lg sm:text-2xl font-black uppercase tracking-tight flex items-center gap-3">
          <span className="w-4 h-4 bg-black inline-block" />
          Class
        </h2>
        <Link
          href="/class"
          className="text-[10px] sm:text-xs font-mono text-muted-foreground hover:text-[#FF0033] transition-colors"
          onClick={() => sendGAEvent("click_main_course", { content_id: "all", content_name: "코스 전체 보기", position: 0 })}
        >
          전체 {courses.length}개 코스
        </Link>

        <div className="ml-auto hidden sm:flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollByPage(-1)}
            aria-label="이전 코스"
            className="p-1.5 bg-white border-2 border-black hover:bg-black hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollByPage(1)}
            aria-label="다음 코스"
            className="p-1.5 bg-white border-2 border-black hover:bg-black hover:text-white transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        className="flex items-stretch gap-3 sm:gap-4 overflow-x-auto snap-x pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {courses.map((course, index) => (
          <Link
            key={course.slug}
            href={course.href}
            // HTML in Canvas 지원 브라우저에서만 홀로그램 스캔이 지나간다.
            // 미지원이면 hologramElement가 아무 일도 하지 않는다.
            onMouseEnter={(e) => void hologramElement(e.currentTarget)}
            onClick={() =>
              sendGAEvent("click_main_course", {
                content_id: course.slug,
                content_name: course.title,
                position: index + 1,
              })
            }
            className="flex flex-col w-[240px] sm:w-[calc((100%-3rem)/4)] flex-shrink-0 snap-start bg-white border-2 border-black neo-shadow-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
          >
            <img
              src={course.image}
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
              className="w-full aspect-[1200/630] object-cover border-b-2 border-black"
            />
            <div className="flex flex-col gap-1.5 p-3 flex-1">
              <NeoBadge variant={course.badge} className="self-start text-[10px] px-2 py-0.5">
                {course.label}
              </NeoBadge>
              <span className="font-bold text-[15px] sm:text-base leading-snug line-clamp-2">
                {course.title}
              </span>
              <span className="mt-auto pt-1 flex items-center gap-1 text-[11px] font-mono text-muted-foreground">
                <BookOpen className="w-3 h-3" />
                {course.classCount}개 개념
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
