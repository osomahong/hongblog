"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CheckCircle2, BookOpen } from "lucide-react";
import { readClassProgress, CLASS_PROGRESS_EVENT } from "@/components/ClassProgressMarker";
import { sendGAEvent } from "@/lib/gtm";

interface CurriculumItem {
    id: number;
    slug: string;
    term: string;
}

interface CourseCurriculumPanelProps {
    courseSlug: string;
    courseTitle: string;
    classes: CurriculumItem[];
    currentSlug: string;
}

/**
 * 코스 전체 커리큘럼을 현재 위치와 학습 완료 표시와 함께 보여준다.
 * 포커스 모드 진입은 집중해서 읽겠다는 신호이므로, 그 자리에 목차를 놓아
 * 다음에 볼 개념이 바로 눈에 들어오게 한다.
 */
export function CourseCurriculumPanel({
    courseSlug,
    courseTitle,
    classes,
    currentSlug,
}: CourseCurriculumPanelProps) {
    const [visited, setVisited] = useState<Record<string, number>>({});

    useEffect(() => {
        const sync = () => setVisited(readClassProgress());
        sync();
        window.addEventListener(CLASS_PROGRESS_EVENT, sync);
        return () => window.removeEventListener(CLASS_PROGRESS_EVENT, sync);
    }, []);

    const currentIndex = classes.findIndex((cls) => cls.slug === currentSlug);
    const nextSlug = currentIndex >= 0 ? classes[currentIndex + 1]?.slug : undefined;
    const doneCount = classes.filter((cls) => visited[cls.slug]).length;

    const handleClick = (target: CurriculumItem, position: number) => {
        sendGAEvent("click_curriculum", {
            course_slug: courseSlug,
            content_id: target.slug,
            content_name: target.term,
            position,
        });
    };

    return (
        <div className="border-4 border-black bg-white neo-shadow p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-1">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="font-black text-sm sm:text-base tracking-tight">커리큘럼</span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                {courseTitle} ({doneCount} / {classes.length} 학습)
            </p>

            <ol className="space-y-1.5">
                {classes.map((cls, idx) => {
                    const isCurrent = cls.slug === currentSlug;
                    const isDone = Boolean(visited[cls.slug]) && !isCurrent;
                    const isNext = cls.slug === nextSlug;

                    const rowBase =
                        "flex items-start gap-2.5 px-2.5 py-2 border-2 text-xs sm:text-sm leading-snug";

                    if (isCurrent) {
                        return (
                            <li key={cls.id}>
                                <div className={`${rowBase} border-black bg-accent font-bold`}>
                                    <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center border-2 border-black bg-white font-mono text-[10px]">
                                        {idx + 1}
                                    </span>
                                    <span className="flex-1">{cls.term}</span>
                                    <span className="flex-shrink-0 text-[10px] font-mono text-[#FF0033]">
                                        지금
                                    </span>
                                </div>
                            </li>
                        );
                    }

                    return (
                        <li key={cls.id}>
                            <Link
                                href={`/class/${courseSlug}/${cls.slug}`}
                                onClick={() => handleClick(cls, idx + 1)}
                                className={`${rowBase} ${
                                    isNext
                                        ? "border-[#FF0033] bg-white hover:bg-accent"
                                        : "border-gray-200 bg-white hover:border-black hover:bg-accent"
                                } transition-colors`}
                            >
                                <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                                    {isDone ? (
                                        <CheckCircle2 className="w-4 h-4 text-[#FF0033]" />
                                    ) : (
                                        <span className="w-5 h-5 flex items-center justify-center border-2 border-gray-300 font-mono text-[10px] text-gray-500">
                                            {idx + 1}
                                        </span>
                                    )}
                                </span>
                                <span className={`flex-1 ${isDone ? "text-muted-foreground" : ""}`}>
                                    {cls.term}
                                </span>
                                {isNext && (
                                    <span className="flex-shrink-0 text-[10px] font-mono font-bold text-[#FF0033]">
                                        다음
                                    </span>
                                )}
                            </Link>
                        </li>
                    );
                })}
            </ol>
        </div>
    );
}
