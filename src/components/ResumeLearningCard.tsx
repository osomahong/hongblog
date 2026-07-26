"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, History } from "lucide-react";
import { readClassProgress } from "@/components/ClassProgressMarker";
import { sendGAEvent } from "@/lib/gtm";
import type { CourseWithClasses } from "@/lib/types";

interface ResumeLearningCardProps {
    courses: CourseWithClasses[];
}

interface ResumeTarget {
    courseSlug: string;
    courseTitle: string;
    classSlug: string;
    term: string;
    doneCount: number;
    totalCount: number;
    /** 코스를 모두 본 상태라 다른 코스를 권하는 경우 */
    isNewCourse: boolean;
}

/**
 * 이전 방문에서 본 클래스 기록을 읽어 이어서 볼 개념을 제안한다.
 * 기록이 없으면 아무것도 렌더하지 않으므로 첫 방문자에게는 보이지 않는다.
 */
function findResumeTarget(courses: CourseWithClasses[]): ResumeTarget | null {
    const progress = readClassProgress();
    const visitedSlugs = Object.keys(progress);
    if (visitedSlugs.length === 0) return null;

    // 가장 최근에 본 클래스를 기준점으로 삼는다.
    const lastSlug = visitedSlugs.reduce((latest, slug) =>
        (progress[slug] ?? 0) > (progress[latest] ?? 0) ? slug : latest
    );

    const lastCourse = courses.find((course) =>
        course.classes.some((cls) => cls.slug === lastSlug)
    );
    if (!lastCourse) return null;

    const doneCount = lastCourse.classes.filter((cls) => progress[cls.slug]).length;

    // 같은 코스에서 아직 보지 않은 첫 개념을 우선 제안한다.
    const nextInCourse = lastCourse.classes.find((cls) => !progress[cls.slug]);
    if (nextInCourse) {
        return {
            courseSlug: lastCourse.slug,
            courseTitle: lastCourse.title,
            classSlug: nextInCourse.slug,
            term: nextInCourse.term,
            doneCount,
            totalCount: lastCourse.classes.length,
            isNewCourse: false,
        };
    }

    // 코스를 모두 봤다면 아직 시작하지 않은 다른 코스의 첫 개념을 제안한다.
    const untouched = courses.find(
        (course) =>
            course.slug !== lastCourse.slug &&
            course.classes.length > 0 &&
            course.classes.every((cls) => !progress[cls.slug])
    );
    if (!untouched) return null;

    return {
        courseSlug: untouched.slug,
        courseTitle: untouched.title,
        classSlug: untouched.classes[0].slug,
        term: untouched.classes[0].term,
        doneCount: lastCourse.classes.length,
        totalCount: lastCourse.classes.length,
        isNewCourse: true,
    };
}

export function ResumeLearningCard({ courses }: ResumeLearningCardProps) {
    const [target, setTarget] = useState<ResumeTarget | null>(null);

    useEffect(() => {
        setTarget(findResumeTarget(courses));
    }, [courses]);

    if (!target) return null;

    const href = `/class/${target.courseSlug}/${target.classSlug}`;

    return (
        <section className="mb-6 sm:mb-10">
            <Link
                href={href}
                onClick={() =>
                    sendGAEvent("click_resume_learning", {
                        course_slug: target.courseSlug,
                        content_id: target.classSlug,
                        content_name: target.term,
                        is_new_course: target.isNewCourse,
                    })
                }
                className="block group"
            >
                <div className="p-4 sm:p-6 border-4 border-black bg-accent neo-shadow hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all">
                    <div className="flex items-center gap-2 mb-2">
                        <History className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="font-mono text-xs sm:text-sm">
                            {target.isNewCourse
                                ? `${target.courseTitle} 학습 완료`
                                : `${target.courseTitle} (${target.doneCount} / ${target.totalCount} 학습)`}
                        </span>
                    </div>

                    <p className="text-sm sm:text-base text-muted-foreground mb-1">
                        {target.isNewCourse ? "다음 강의를 시작해 보세요" : "이어서 볼 개념"}
                    </p>

                    <p className="font-black text-lg sm:text-2xl tracking-tight flex items-center gap-2 group-hover:text-[#FF0033] transition-colors">
                        {target.term}
                        <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
                    </p>

                    {!target.isNewCourse && (
                        <div className="w-full bg-white border-2 border-black h-3 mt-3">
                            <div
                                className="bg-primary h-full transition-all"
                                style={{ width: `${(target.doneCount / target.totalCount) * 100}%` }}
                            />
                        </div>
                    )}
                </div>
            </Link>
        </section>
    );
}
