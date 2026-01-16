"use client";

import Link from "next/link";
import { GraduationCap, Sparkles, Database, TrendingUp, BookOpen, ChevronDown, ChevronUp, Square, CheckSquare } from "lucide-react";
import {
    NeoCard,
    NeoCardHeader,
    NeoCardTitle,
    NeoCardDescription,
    NeoCardContent,
    NeoCardFooter,
} from "@/components/neo";
import { NeoBadge } from "@/components/neo";
import { CourseWithClasses } from "@/lib/queries";
import { NeoTiltCard } from "@/components/neo";
import { useState, useEffect } from "react";

const categoryIcons = {
    AI_TECH: Sparkles,
    DATA: Database,
    MARKETING: TrendingUp,
};

const categoryLabels = {
    AI_TECH: "AI & Tech",
    DATA: "Data",
    MARKETING: "Marketing",
};

const difficultyLabels = {
    BEGINNER: "초급",
    INTERMEDIATE: "중급",
    ADVANCED: "고급",
};

interface ClassPageClientProps {
    courses: CourseWithClasses[];
}

export default function ClassPageClient({ courses }: ClassPageClientProps) {
    const [expandedCourseId, setExpandedCourseId] = useState<number | null>(null);
    const [checkedClasses, setCheckedClasses] = useState<Set<number>>(new Set());

    const toggleExpand = (courseId: number) => {
        setExpandedCourseId(prev => prev === courseId ? null : courseId);
    };

    const toggleCheck = (classId: number, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setCheckedClasses(prev => {
            const next = new Set(prev);
            if (next.has(classId)) {
                next.delete(classId);
            } else {
                next.add(classId);
            }
            return next;
        });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-12">
            {/* Hero Section */}
            <section className="mb-6 sm:mb-12">
                <NeoTiltCard className="bg-gradient-to-br from-purple-600 to-blue-600 border-3 sm:border-4 border-black p-4 sm:p-8 md:p-12 sm:rotate-1 halftone-corner speed-lines text-left" intensity={20} shadowIntensity={10}>
                    <h1 className="text-2xl sm:text-4xl md:text-6xl font-black uppercase text-white tracking-tighter mb-2 sm:mb-4 relative z-10 comic-emphasis leading-tight">
                        <span className="flex items-center gap-2 sm:gap-3">
                            <GraduationCap className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16" />
                            Class
                        </span>
                    </h1>
                    <p className="text-sm sm:text-lg md:text-xl text-white/90 max-w-2xl relative z-10 leading-relaxed">
                        체계적으로 정리된 개념 강의로 기초부터 고급까지 학습하세요
                    </p>
                </NeoTiltCard>
            </section>

            {/* Results Count */}
            <div className="mb-3 sm:mb-6">
                <span className="font-mono text-[10px] sm:text-sm text-muted-foreground">
                    {courses.length}개의 강의
                </span>
            </div>

            {/* Courses List - Accordion Style */}
            <section className="space-y-4 sm:space-y-6">
                {courses.map((course) => {
                    const Icon = categoryIcons[course.category as keyof typeof categoryIcons];
                    const isExpanded = expandedCourseId === course.id;

                    return (
                        <div key={course.id} className="relative">
                            <NeoCard className={`overflow-hidden border-l-4 transition-all duration-300 ${isExpanded
                                ? 'border-l-purple-600 shadow-[8px_8px_0px_0px_rgba(147,51,234,0.3)]'
                                : 'border-l-purple-600'
                                }`}>
                                {/* Course Header */}
                                <NeoCardHeader>
                                    {course.thumbnailUrl && (
                                        <div className="mb-3 sm:mb-4 -mx-4 sm:-mx-6 -mt-4 sm:-mt-6">
                                            <img
                                                src={course.thumbnailUrl}
                                                alt={course.title}
                                                className="w-full h-32 sm:h-40 object-cover border-b-2 border-black"
                                            />
                                        </div>
                                    )}
                                    <div className="flex items-center justify-between gap-2 mb-2 sm:mb-3 flex-wrap">
                                        <NeoBadge
                                            variant={
                                                course.category === "AI_TECH"
                                                    ? "ai"
                                                    : course.category === "DATA"
                                                        ? "data"
                                                        : "marketing"
                                            }
                                        >
                                            <span className="flex items-center gap-1">
                                                <Icon className="w-3 h-3" />
                                                {categoryLabels[course.category as keyof typeof categoryLabels]}
                                            </span>
                                        </NeoBadge>
                                        {course.difficulty && (
                                            <NeoBadge variant="outline" className="bg-white">
                                                {difficultyLabels[course.difficulty as keyof typeof difficultyLabels]}
                                            </NeoBadge>
                                        )}
                                    </div>
                                    <NeoCardTitle className="text-base sm:text-2xl leading-snug flex items-center gap-2">
                                        <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                                        {course.title}
                                    </NeoCardTitle>
                                    {course.description && (
                                        <NeoCardDescription className="text-xs sm:text-base">
                                            {course.description}
                                        </NeoCardDescription>
                                    )}
                                </NeoCardHeader>

                                <NeoCardContent>
                                    <div className="flex items-center gap-3 text-xs sm:text-sm text-muted-foreground mb-4">
                                        <span className="flex items-center gap-1">
                                            <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
                                            {course.classCount}개 개념
                                        </span>
                                    </div>

                                    {/* Curriculum Full - Only show when expanded */}
                                    {isExpanded && (
                                        <div className="curriculum-container transition-all duration-300 bg-purple-50 -mx-4 sm:-mx-6 px-4 sm:px-6 py-4 border-y-2 border-purple-200 animate-slideDown">
                                            <div className="flex items-center justify-between mb-3">
                                                <h4 className="text-xs sm:text-sm font-bold uppercase text-purple-700">
                                                    📚 커리큘럼
                                                </h4>
                                                <span className="text-[10px] sm:text-xs font-bold text-purple-600 animate-pulse">
                                                    ● 확장됨
                                                </span>
                                            </div>

                                            <div className="space-y-1 sm:space-y-2">
                                                {course.classes.map((cls, idx) => {
                                                    const isChecked = checkedClasses.has(cls.id);
                                                    const CheckIcon = isChecked ? CheckSquare : Square;

                                                    return (
                                                        <Link
                                                            key={cls.id}
                                                            href={`/class/${course.slug}/${cls.slug}`}
                                                            className="block"
                                                        >
                                                            <div className="flex items-center gap-2 p-2 rounded hover:bg-accent/50 transition-colors group">
                                                                <button
                                                                    onClick={(e) => toggleCheck(cls.id, e)}
                                                                    className="flex-shrink-0 text-muted-foreground hover:text-purple-600 transition-colors"
                                                                >
                                                                    <CheckIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                                                                </button>
                                                                <span className="text-[10px] sm:text-xs text-muted-foreground min-w-[1.25rem]">
                                                                    {idx + 1}.
                                                                </span>
                                                                <span className="text-xs sm:text-sm flex-1 group-hover:text-purple-600 transition-colors">
                                                                    {cls.term}
                                                                </span>
                                                            </div>
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </NeoCardContent>

                                <NeoCardFooter className="flex items-center justify-between border-t-2 border-black pt-4">
                                    <span className="text-[10px] sm:text-xs font-mono text-muted-foreground">
                                        {course.createdAt.toLocaleDateString("ko-KR")}
                                    </span>
                                    <button
                                        onClick={() => toggleExpand(course.id)}
                                        className={`
                                            flex items-center gap-2 px-4 py-2 
                                            font-black uppercase tracking-tight
                                            border-2 border-black rounded
                                            transition-all duration-200
                                            ${isExpanded
                                                ? 'bg-purple-600 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px]'
                                                : 'bg-white text-purple-600 shadow-[4px_4px_0px_0px_rgba(147,51,234,1)] hover:shadow-[2px_2px_0px_0px_rgba(147,51,234,1)] hover:translate-x-[2px] hover:translate-y-[2px]'
                                            }
                                            text-xs sm:text-sm
                                        `}
                                    >
                                        {isExpanded ? (
                                            <>
                                                <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" />
                                                접기
                                            </>
                                        ) : (
                                            <>
                                                커리큘럼 전체보기
                                                <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
                                            </>
                                        )}
                                    </button>
                                </NeoCardFooter>
                            </NeoCard>
                        </div>
                    );
                })}
            </section>

            {courses.length === 0 && (
                <div className="text-center py-8 sm:py-12">
                    <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-muted-foreground mb-3 sm:mb-4" />
                    <p className="text-sm sm:text-base text-muted-foreground">아직 등록된 강의가 없습니다.</p>
                </div>
            )}
        </div>
    );
}
