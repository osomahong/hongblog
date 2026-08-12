"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";
import { sendGAEvent } from "@/lib/gtm";
import type { CourseLink } from "@/lib/promotions";

interface CourseSuggestListProps {
  courses: CourseLink[];
  /** GA4 location 값. 검색 빈 결과와 404를 구분한다 */
  location: "search_empty" | "not_found";
  title?: string;
}

/**
 * 갈 곳이 막힌 화면에 두는 코스 목록.
 * 검색 결과가 없거나 주소가 틀렸을 때 뒤로 가기 대신 코스로 이어 준다.
 */
export function CourseSuggestList({ courses, location, title = "이런 코스는 어떠세요" }: CourseSuggestListProps) {
  if (courses.length === 0) return null;

  return (
    <section className="mt-6 sm:mt-8">
      <h2 className="flex items-center gap-2 text-sm sm:text-base font-black uppercase tracking-tight border-b-4 border-black pb-2 mb-3">
        <BookOpen className="w-4 h-4" />
        {title}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
        {courses.map((course, index) => (
          <Link
            key={course.slug}
            href={course.href}
            onClick={() =>
              sendGAEvent("click_course_suggest", {
                content_id: course.slug,
                content_name: course.title,
                location,
                position: index + 1,
              })
            }
            className="flex items-baseline justify-between gap-3 p-3 bg-white border-2 border-black neo-shadow-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
          >
            <span className="text-sm font-bold leading-snug">{course.title}</span>
            <span className="font-mono text-[11px] text-muted-foreground flex-shrink-0">
              {course.classCount}개 개념
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
