"use client";

import { useState, useEffect, useTransition } from "react";
import { BookOpen, Eye, Edit, Trash2, Linkedin, Loader2, Lock } from "lucide-react";
import {
    getCoursesAction,
    deleteCourseAction,
    toggleCoursePublishedAction,
} from "../actions";

type Course = {
    id: number;
    slug: string;
    title: string;
    description: string | null;
    category: string;
    difficulty: string | null;
    isPublished: boolean;
    linkedinPostedAt: string | null;
    createdAt: string;
    classCount?: number;
};

interface CourseManagerProps {
    onEdit?: (course: Course) => void;
    onLinkedInSummary?: (course: Course) => void;
    isGeneratingLinkedinSummary?: number | null;
}

export function CourseManager({
    onEdit,
    onLinkedInSummary,
    isGeneratingLinkedinSummary,
}: CourseManagerProps) {
    const [courses, setCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isPending, startTransition] = useTransition();
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        loadCourses();
    }, []);

    const loadCourses = async () => {
        setIsLoading(true);
        startTransition(async () => {
            const result = await getCoursesAction({ includeDrafts: true });
            if (result.success && result.data) {
                setCourses(result.data as any);
            }
            setIsLoading(false);
        });
    };

    const handleTogglePublished = async (course: Course) => {
        startTransition(async () => {
            const result = await toggleCoursePublishedAction(course.id);
            if (result.success) {
                await loadCourses();
            } else {
                alert(`토글 실패: ${result.error}`);
            }
        });
    };

    const handleDelete = async (id: number) => {
        if (!confirm("정말 삭제하시겠습니까?")) return;

        startTransition(async () => {
            const result = await deleteCourseAction(id);
            if (result.success) {
                await loadCourses();
            } else {
                alert(`삭제 실패: ${result.error}`);
            }
        });
    };

    const handleToggleLinkedinStatus = async (course: Course) => {
        const newValue = course.linkedinPostedAt ? null : new Date().toISOString();
        try {
            const res = await fetch("/api/hong/linkedin-status", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contentType: "course",
                    contentId: course.id,
                    linkedinPostedAt: newValue,
                }),
            });
            if (res.ok) {
                await loadCourses();
            } else {
                alert("LinkedIn 상태 업데이트 실패");
            }
        } catch {
            alert("LinkedIn 상태 업데이트 중 오류 발생");
        }
    };

    const filteredCourses = courses.filter(
        (course) =>
            course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (course.description && course.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="bg-white border-4 border-black p-6" style={{ boxShadow: "8px 8px 0 black" }}>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-black uppercase flex items-center gap-2">
                    <BookOpen className="w-5 h-5" /> Courses ({courses.length})
                </h2>
                <input
                    type="text"
                    placeholder="검색..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="px-4 py-2 border-4 border-black focus:outline-none"
                />
            </div>

            {isLoading ? (
                <p className="text-gray-500 py-8 text-center">로딩 중...</p>
            ) : filteredCourses.length === 0 ? (
                <p className="text-gray-500 py-8 text-center">
                    {searchQuery ? "검색 결과가 없습니다." : "등록된 Course가 없습니다."}
                </p>
            ) : (
                <div className="space-y-3">
                    {filteredCourses.map((course) => (
                        <div key={course.id} className="border-2 border-black p-4 flex items-center justify-between hover:bg-gray-50">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-bold text-lg">{course.title}</h3>
                                    <button
                                        onClick={() => handleTogglePublished(course)}
                                        disabled={isPending}
                                        className="flex items-center gap-2 text-xs font-bold"
                                        title={course.isPublished ? "클릭하여 비공개로 전환" : "클릭하여 공개 배포"}
                                    >
                                        <div className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${course.isPublished ? "bg-green-500" : "bg-gray-300"}`}>
                                            <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 flex items-center justify-center ${course.isPublished ? "translate-x-6" : "translate-x-0.5"}`}>
                                                {course.isPublished ? (
                                                    <Eye className="w-3 h-3 text-green-600" />
                                                ) : (
                                                    <Lock className="w-3 h-3 text-gray-400" />
                                                )}
                                            </div>
                                        </div>
                                        <span className={course.isPublished ? "text-green-700" : "text-gray-500"}>
                                            {course.isPublished ? "공개" : "비공개"}
                                        </span>
                                    </button>
                                    <button
                                        onClick={() => handleToggleLinkedinStatus(course)}
                                        className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 border rounded-sm transition-colors ${
                                            course.linkedinPostedAt
                                                ? "bg-blue-50 text-[#0A66C2] border-[#0A66C2] hover:bg-blue-100"
                                                : "bg-gray-50 text-gray-400 border-gray-300 hover:bg-gray-100"
                                        }`}
                                        title={course.linkedinPostedAt ? "클릭하여 게시 상태 해제" : "클릭하여 게시됨으로 표시"}
                                    >
                                        <Linkedin className="w-3 h-3" />
                                        {course.linkedinPostedAt
                                            ? `업로드 완료(${new Date(course.linkedinPostedAt).toLocaleDateString("ko-KR", { month: "numeric", day: "numeric" })})`
                                            : "미게시"}
                                    </button>
                                </div>
                                <p className="text-sm text-gray-600">{course.description || "설명 없음"}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                    /class/{course.slug} · ID: {course.id} · {course.category}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                {onLinkedInSummary && (
                                    <button
                                        onClick={() => onLinkedInSummary(course)}
                                        disabled={isGeneratingLinkedinSummary === course.id}
                                        className="p-2 border-2 border-black hover:bg-blue-50 disabled:opacity-50"
                                        title="LinkedIn 요약 생성"
                                    >
                                        {isGeneratingLinkedinSummary === course.id ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Linkedin className="w-4 h-4 text-[#0A66C2]" />
                                        )}
                                    </button>
                                )}
                                <a href={`/class/${course.slug}`} target="_blank" className="p-2 border-2 border-black hover:bg-gray-100" title="보기">
                                    <Eye className="w-4 h-4" />
                                </a>
                                {onEdit && (
                                    <button
                                        onClick={() => onEdit(course)}
                                        className="p-2 border-2 border-black hover:bg-blue-100"
                                        title="수정"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDelete(course.id)}
                                    disabled={isPending}
                                    className="p-2 border-2 border-black hover:bg-red-100 disabled:opacity-50"
                                    title="삭제"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
