"use client";

import { useState, useEffect, useTransition } from "react";
import { BookText, Eye, Edit, Trash2, Lock, BarChart3 } from "lucide-react";
import {
    getLogsAction,
    deleteLogAction,
    toggleLogPublishedAction,
} from "../actions";

type Log = {
    id: number;
    slug: string;
    title: string;
    content: string;
    category: string;
    location: string | null;
    visitedAt: string | null;
    rating: number | null;
    thumbnailUrl: string | null;
    tags: string[];
    isPublished: boolean;
    createdAt: string;
};

type ViewStats = {
    log: Record<number, number>;
};

interface LogManagerProps {
    viewStats: ViewStats;
    onEdit?: (log: Log) => void;
}

export function LogManager({
    viewStats,
    onEdit,
}: LogManagerProps) {
    const [logs, setLogs] = useState<Log[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isPending, startTransition] = useTransition();
    const [searchQuery, setSearchQuery] = useState("");

    // 로그 목록 로드
    useEffect(() => {
        loadLogs();
    }, []);

    const loadLogs = async () => {
        setIsLoading(true);
        startTransition(async () => {
            const result = await getLogsAction({ includeDrafts: true });
            if (result.success && result.data) {
                setLogs(result.data as any);
            }
            setIsLoading(false);
        });
    };

    // 발행 상태 토글
    const handleTogglePublished = async (log: Log) => {
        startTransition(async () => {
            const result = await toggleLogPublishedAction(log.id);
            if (result.success) {
                await loadLogs();
            } else {
                alert(`토글 실패: ${result.error}`);
            }
        });
    };

    // 삭제
    const handleDelete = async (id: number) => {
        if (!confirm("정말 삭제하시겠습니까?")) return;

        startTransition(async () => {
            const result = await deleteLogAction(id);
            if (result.success) {
                await loadLogs();
            } else {
                alert(`삭제 실패: ${result.error}`);
            }
        });
    };

    // 검색 필터링
    const filteredLogs = logs.filter((log) =>
        log.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const categoryIcon = (category: string) => {
        const icons: Record<string, any> = {
            AI_TECH: "🤖",
            DATA: "📊",
            MARKETING: "📈",
            맛집: "🍽️",
            강의: "📚",
            문화생활: "🎭",
            여행: "✈️",
            일상: "📔",
        };
        return icons[category] || "📓";
    };

    return (
        <div className="bg-white border-4 border-black p-6" style={{ boxShadow: "8px 8px 0 black" }}>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-black uppercase flex items-center gap-2">
                    <BookText className="w-5 h-5" /> Logs ({logs.length})
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
            ) : filteredLogs.length === 0 ? (
                <p className="text-gray-500 py-8 text-center">
                    {searchQuery ? "검색 결과가 없습니다." : "등록된 로그가 없습니다."}
                </p>
            ) : (
                <div className="space-y-3">
                    {filteredLogs.map((log) => (
                        <div key={log.id} className="border-2 border-black p-4 hover:bg-gray-50">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                                        <span className="text-2xl">{categoryIcon(log.category)}</span>
                                        <span className="text-xs font-bold bg-purple-100 text-purple-700 px-2 py-0.5">
                                            {log.category}
                                        </span>
                                        {log.location && (
                                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5">
                                                📍 {log.location}
                                            </span>
                                        )}
                                        <button
                                            onClick={() => handleTogglePublished(log)}
                                            disabled={isPending}
                                            className="flex items-center gap-2 text-xs font-bold"
                                            title={log.isPublished ? "클릭하여 비공개로 전환" : "클릭하여 공개 배포"}
                                        >
                                            <div
                                                className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${log.isPublished ? "bg-green-500" : "bg-gray-300"
                                                    }`}
                                            >
                                                <div
                                                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 flex items-center justify-center ${log.isPublished ? "translate-x-6" : "translate-x-0.5"
                                                        }`}
                                                >
                                                    {log.isPublished ? (
                                                        <Eye className="w-3 h-3 text-green-600" />
                                                    ) : (
                                                        <Lock className="w-3 h-3 text-gray-400" />
                                                    )}
                                                </div>
                                            </div>
                                            <span className={log.isPublished ? "text-green-700" : "text-gray-500"}>
                                                {log.isPublished ? "공개" : "비공개"}
                                            </span>
                                        </button>
                                    </div>
                                    <h3 className="font-bold text-lg mb-2">{log.title}</h3>
                                    {log.tags && log.tags.length > 0 && (
                                        <div className="flex gap-1 flex-wrap mb-2">
                                            {log.tags.map((tag) => (
                                                <span key={tag} className="text-xs bg-gray-100 px-2 py-0.5">
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    <p className="text-xs text-gray-400">
                                        {log.visitedAt
                                            ? new Date(log.visitedAt).toLocaleDateString("ko-KR")
                                            : new Date(log.createdAt).toLocaleDateString("ko-KR")}
                                        {viewStats.log && viewStats.log[log.id] !== undefined && (
                                            <span className="ml-2 inline-flex items-center gap-1 text-blue-600">
                                                <BarChart3 className="w-3 h-3" />
                                                {viewStats.log[log.id].toLocaleString()}회
                                            </span>
                                        )}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <a
                                        href={`/logs/${log.slug}`}
                                        target="_blank"
                                        className="p-2 border-2 border-black hover:bg-gray-100"
                                        title="보기"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </a>
                                    {onEdit && (
                                        <button
                                            onClick={() => onEdit(log)}
                                            className="p-2 border-2 border-black hover:bg-blue-100"
                                            title="수정"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(log.id)}
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
