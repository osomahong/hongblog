"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { readClassProgress, CLASS_PROGRESS_EVENT } from "@/components/ClassProgressMarker";

interface CourseClassItem {
    id: number;
    slug: string;
    term: string;
    definition: string;
    readingTime: number;
}

interface CourseClassListProps {
    courseSlug: string;
    classes: CourseClassItem[];
}

/** 코스 상세의 클래스 목록. localStorage 학습 진도를 읽어 완료 표시와 진행률을 보여준다. */
export function CourseClassList({ courseSlug, classes }: CourseClassListProps) {
    const [visited, setVisited] = useState<Record<string, number>>({});

    useEffect(() => {
        const sync = () => setVisited(readClassProgress());
        sync();
        window.addEventListener(CLASS_PROGRESS_EVENT, sync);
        return () => window.removeEventListener(CLASS_PROGRESS_EVENT, sync);
    }, []);

    const doneCount = classes.filter((cls) => visited[cls.slug]).length;

    return (
        <div>
            {doneCount > 0 && (
                <div className="mb-4 p-3 sm:p-4 border-3 border-black bg-accent neo-shadow-sm">
                    <div className="flex items-center justify-between text-sm font-bold mb-2">
                        <span>학습 진행</span>
                        <span className="font-mono">{doneCount} / {classes.length}</span>
                    </div>
                    <div className="w-full bg-white border-2 border-black h-3">
                        <div
                            className="bg-primary h-full transition-all"
                            style={{ width: `${(doneCount / classes.length) * 100}%` }}
                        />
                    </div>
                </div>
            )}

            <div className="space-y-2 sm:space-y-3">
                {classes.map((cls, clsIndex) => {
                    const isDone = Boolean(visited[cls.slug]);
                    return (
                        <Link
                            key={cls.id}
                            href={`/class/${courseSlug}/${cls.slug}`}
                            className="group block"
                        >
                            <div className="flex items-center gap-3 p-3 sm:p-4 border-3 border-black bg-white hover:bg-[#FF0033] hover:text-white transition-colors neo-shadow-sm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]">
                                <span className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full border-3 border-black flex items-center justify-center font-bold text-sm sm:text-base">
                                    {isDone ? <CheckCircle2 className="w-5 h-5 text-primary group-hover:text-white" /> : clsIndex + 1}
                                </span>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-base sm:text-lg group-hover:text-primary transition-colors">
                                        {cls.term}
                                    </h3>
                                    {cls.definition && (
                                        <p className="text-sm sm:text-base text-muted-foreground line-clamp-2 mt-1">
                                            {cls.definition}
                                        </p>
                                    )}
                                </div>
                                {cls.readingTime > 0 && (
                                    <span className="flex-shrink-0 text-xs font-mono text-muted-foreground group-hover:text-white">
                                        {cls.readingTime}분
                                    </span>
                                )}
                                <span className="text-lg sm:text-xl font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                    →
                                </span>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
