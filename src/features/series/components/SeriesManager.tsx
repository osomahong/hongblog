"use client";

import { useState, useEffect, useTransition } from "react";
import { BookOpen, Eye, Edit, Trash2, Lock } from "lucide-react";
import {
    getSeriesAction,
    deleteSeriesAction,
    toggleSeriesPublishedAction,
} from "../actions";

type Series = {
    id: number;
    slug: string;
    title: string;
    description: string | null;
    thumbnailUrl: string | null;
    isPublished: boolean;
    createdAt: string;
    postCount: number;
};

interface SeriesManagerProps {
    onEdit?: (series: Series) => void;
}

export function SeriesManager({ onEdit }: SeriesManagerProps) {
    const [seriesList, setSeriesList] = useState<Series[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isPending, startTransition] = useTransition();
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        loadSeries();
    }, []);

    const loadSeries = async () => {
        setIsLoading(true);
        startTransition(async () => {
            const result = await getSeriesAction({ includeDrafts: true });
            if (result.success && result.data) {
                setSeriesList(result.data as any);
            }
            setIsLoading(false);
        });
    };

    const handleTogglePublished = async (series: Series) => {
        startTransition(async () => {
            const result = await toggleSeriesPublishedAction(series.id);
            if (result.success) {
                await loadSeries();
            } else {
                alert(`토글 실패: ${result.error}`);
            }
        });
    };

    const handleDelete = async (id: number) => {
        if (!confirm("정말 삭제하시겠습니까? 연결된 포스트는 유지됩니다.")) return;

        startTransition(async () => {
            const result = await deleteSeriesAction(id);
            if (result.success) {
                await loadSeries();
            } else {
                alert(`삭제 실패: ${result.error}`);
            }
        });
    };

    const filteredSeries = seriesList.filter(
        (series) =>
            series.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (series.description && series.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="bg-white border-4 border-black p-6" style={{ boxShadow: "8px 8px 0 black" }}>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-black uppercase flex items-center gap-2">
                    <BookOpen className="w-5 h-5" /> Series ({seriesList.length})
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
            ) : filteredSeries.length === 0 ? (
                <p className="text-gray-500 py-8 text-center">
                    {searchQuery ? "검색 결과가 없습니다." : "등록된 시리즈가 없습니다."}
                </p>
            ) : (
                <div className="space-y-3">
                    {filteredSeries.map((series) => (
                        <div key={series.id} className="border-2 border-black p-4 hover:bg-gray-50">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                                        <span className="text-xs font-bold bg-purple-100 text-purple-700 px-2 py-0.5">
                                            📚 {series.postCount}개 포스트
                                        </span>
                                        <button
                                            onClick={() => handleTogglePublished(series)}
                                            disabled={isPending}
                                            className="flex items-center gap-2 text-xs font-bold"
                                            title={series.isPublished ? "클릭하여 비공개로 전환" : "클릭하여 공개 배포"}
                                        >
                                            <div
                                                className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${series.isPublished ? "bg-green-500" : "bg-gray-300"
                                                    }`}
                                            >
                                                <div
                                                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 flex items-center justify-center ${series.isPublished ? "translate-x-6" : "translate-x-0.5"
                                                        }`}
                                                >
                                                    {series.isPublished ? (
                                                        <Eye className="w-3 h-3 text-green-600" />
                                                    ) : (
                                                        <Lock className="w-3 h-3 text-gray-400" />
                                                    )}
                                                </div>
                                            </div>
                                            <span className={series.isPublished ? "text-green-700" : "text-gray-500"}>
                                                {series.isPublished ? "공개" : "비공개"}
                                            </span>
                                        </button>
                                    </div>
                                    <h3 className="font-bold text-lg mb-2">{series.title}</h3>
                                    {series.description && (
                                        <p className="text-gray-600 text-sm line-clamp-2 mb-2">{series.description}</p>
                                    )}
                                    <p className="text-xs text-gray-400">
                                        {new Date(series.createdAt).toLocaleDateString("ko-KR")}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <a
                                        href={`/series/${series.slug}`}
                                        target="_blank"
                                        className="p-2 border-2 border-black hover:bg-gray-100"
                                        title="보기"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </a>
                                    {onEdit && (
                                        <button
                                            onClick={() => onEdit(series)}
                                            className="p-2 border-2 border-black hover:bg-blue-100"
                                            title="수정"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(series.id)}
                                        disabled={isPending}
                                        className="p-2 border-2 border-black hover:bg-red-100 disabled:opacity-50"
                                        title="삭제"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
