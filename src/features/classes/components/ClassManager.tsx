"use client";

import { useState, useEffect, useTransition } from "react";
import { GraduationCap, Eye, Edit, Trash2, Lock } from "lucide-react";
import {
    getClassesAction,
    deleteClassAction,
    toggleClassPublishedAction,
} from "../actions";

type ClassItem = {
    id: number;
    slug: string;
    term: string;
    definition: string;
    content: string;
    category: string;
    courseId: number | null;
    orderInCourse: number | null;
    difficulty: string | null;
    tags: string[];
    isPublished: boolean;
    createdAt: string;
    courseInfo?: {
        id: number;
        slug: string;
        title: string;
    } | null;
    partInfo?: {
        partNumber: number;
    } | null;
    metaTitle?: string | null;
    metaDescription?: string | null;
    ogImage?: string | null;
    ogTitle?: string | null;
    ogDescription?: string | null;
    canonicalUrl?: string | null;
    noIndex?: boolean;
};

interface ClassManagerProps {
    onEdit?: (cls: ClassItem) => void;
}

export function ClassManager({ onEdit }: ClassManagerProps) {
    const [classes, setClasses] = useState<ClassItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isPending, startTransition] = useTransition();
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        loadClasses();
    }, []);

    const loadClasses = async () => {
        setIsLoading(true);
        startTransition(async () => {
            const result = await getClassesAction({ includeDrafts: true });
            if (result.success && result.data) {
                setClasses(result.data as any);
            }
            setIsLoading(false);
        });
    };

    const handleTogglePublished = async (cls: ClassItem) => {
        startTransition(async () => {
            const result = await toggleClassPublishedAction(cls.id);
            if (result.success) {
                await loadClasses();
            } else {
                alert(`토글 실패: ${result.error}`);
            }
        });
    };

    const handleDelete = async (id: number) => {
        if (!confirm("정말 삭제하시겠습니까?")) return;

        startTransition(async () => {
            const result = await deleteClassAction(id);
            if (result.success) {
                await loadClasses();
            } else {
                alert(`삭제 실패: ${result.error}`);
            }
        });
    };

    const filteredClasses = classes.filter(
        (cls) =>
            cls.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
            cls.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
            cls.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="bg-white border-4 border-black p-6" style={{ boxShadow: "8px 8px 0 black" }}>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-black uppercase flex items-center gap-2">
                    <GraduationCap className="w-5 h-5" /> Classes ({classes.length})
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
            ) : filteredClasses.length === 0 ? (
                <p className="text-gray-500 py-8 text-center">
                    {searchQuery ? "검색 결과가 없습니다." : "등록된 Class가 없습니다."}
                </p>
            ) : (
                <div className="space-y-3">
                    {filteredClasses.map((cls) => (
                        <div key={cls.id} className="border-2 border-black p-4 flex items-center justify-between hover:bg-gray-50">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                    <h3 className="font-bold text-lg">{cls.term}</h3>
                                    <button
                                        onClick={() => handleTogglePublished(cls)}
                                        disabled={isPending}
                                        className="flex items-center gap-2 text-xs font-bold"
                                        title={cls.isPublished ? "클릭하여 비공개로 전환" : "클릭하여 공개 배포"}
                                    >
                                        <div className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${cls.isPublished ? "bg-green-500" : "bg-gray-300"}`}>
                                            <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 flex items-center justify-center ${cls.isPublished ? "translate-x-6" : "translate-x-0.5"}`}>
                                                {cls.isPublished ? (
                                                    <Eye className="w-3 h-3 text-green-600" />
                                                ) : (
                                                    <Lock className="w-3 h-3 text-gray-400" />
                                                )}
                                            </div>
                                        </div>
                                        <span className={cls.isPublished ? "text-green-700" : "text-gray-500"}>
                                            {cls.isPublished ? "공개" : "비공개"}
                                        </span>
                                    </button>
                                    {cls.tags && cls.tags.length > 0 && (
                                        cls.tags.slice(0, 3).map((tag: string) => (
                                            <span key={tag} className="text-xs text-gray-400">#{tag}</span>
                                        ))
                                    )}
                                </div>
                                <p className="text-sm text-gray-600 mb-1">{cls.definition}</p>
                                <p className="text-xs text-gray-500">
                                    {cls.courseInfo ? `/class/${cls.courseInfo.slug}/${cls.slug}` : `/class/-/${cls.slug}`} · ID: {cls.id}
                                    {cls.courseInfo && ` · Course: ${cls.courseInfo.title}`}
                                    {cls.partInfo && ` · Part ${cls.partInfo.partNumber}`}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                {cls.courseInfo && (
                                    <a href={`/class/${cls.courseInfo.slug}/${cls.slug}`} target="_blank" className="p-2 border-2 border-black hover:bg-gray-100" title="보기">
                                        <Eye className="w-4 h-4" />
                                    </a>
                                )}
                                {onEdit && (
                                    <button
                                        onClick={() => onEdit(cls)}
                                        className="p-2 border-2 border-black hover:bg-blue-100"
                                        title="수정"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDelete(cls.id)}
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
