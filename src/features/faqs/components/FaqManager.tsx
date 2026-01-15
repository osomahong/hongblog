"use client";

import { useState, useEffect, useTransition } from "react";
import { HelpCircle, Eye, Edit, Trash2, Loader2, Lock, BarChart3 } from "lucide-react";
import {
    getFaqsAction,
    deleteFaqAction,
    toggleFaqPublishedAction,
} from "../actions";

type Faq = {
    id: number;
    slug: string;
    question: string;
    answer: string;
    category: string;
    tags: string[];
    isPublished: boolean;
    createdAt: string;
    recommendedYear?: string | null;
    recommendedPositions?: string[] | null;
    difficulty?: string | null;
};

type ViewStats = {
    post: Record<number, number>;
    faq: Record<number, number>;
};

interface FaqManagerProps {
    viewStats: ViewStats;
    onEdit?: (faq: Faq) => void;
}

export function FaqManager({ viewStats, onEdit }: FaqManagerProps) {
    const [faqs, setFaqs] = useState<Faq[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isPending, startTransition] = useTransition();
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        loadFaqs();
    }, []);

    const loadFaqs = async () => {
        setIsLoading(true);
        startTransition(async () => {
            const result = await getFaqsAction({ includeDrafts: true });
            if (result.success && result.data) {
                setFaqs(result.data as any);
            }
            setIsLoading(false);
        });
    };

    const handleTogglePublished = async (faq: Faq) => {
        startTransition(async () => {
            const result = await toggleFaqPublishedAction(faq.id);
            if (result.success) {
                await loadFaqs();
            } else {
                alert(`토글 실패: ${result.error}`);
            }
        });
    };

    const handleDelete = async (id: number) => {
        if (!confirm("정말 삭제하시겠습니까?")) return;

        startTransition(async () => {
            const result = await deleteFaqAction(id);
            if (result.success) {
                await loadFaqs();
            } else {
                alert(`삭제 실패: ${result.error}`);
            }
        });
    };

    const filteredFaqs = faqs.filter(
        (faq) =>
            faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const categoryIcon = (category: string) => {
        const icons: Record<string, any> = {
            AI_TECH: "🤖",
            DATA: "📊",
            MARKETING: "📈",
        };
        return icons[category] || "❓";
    };

    return (
        <div className="bg-white border-4 border-black p-6" style={{ boxShadow: "8px 8px 0 black" }}>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-black uppercase flex items-center gap-2">
                    <HelpCircle className="w-5 h-5" /> FAQs ({faqs.length})
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
            ) : filteredFaqs.length === 0 ? (
                <p className="text-gray-500 py-8 text-center">
                    {searchQuery ? "검색 결과가 없습니다." : "등록된 FAQ가 없습니다."}
                </p>
            ) : (
                <div className="space-y-3">
                    {filteredFaqs.map((faq) => (
                        <div key={faq.id} className="border-2 border-black p-4 hover:bg-gray-50">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                                        <span className="text-2xl">{categoryIcon(faq.category)}</span>
                                        <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-0.5">
                                            {faq.category}
                                        </span>
                                        {faq.difficulty && (
                                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5">
                                                {faq.difficulty}
                                            </span>
                                        )}
                                        <button
                                            onClick={() => handleTogglePublished(faq)}
                                            disabled={isPending}
                                            className="flex items-center gap-2 text-xs font-bold"
                                            title={faq.isPublished ? "클릭하여 비공개로 전환" : "클릭하여 공개 배포"}
                                        >
                                            <div
                                                className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${faq.isPublished ? "bg-green-500" : "bg-gray-300"
                                                    }`}
                                            >
                                                <div
                                                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 flex items-center justify-center ${faq.isPublished ? "translate-x-6" : "translate-x-0.5"
                                                        }`}
                                                >
                                                    {faq.isPublished ? (
                                                        <Eye className="w-3 h-3 text-green-600" />
                                                    ) : (
                                                        <Lock className="w-3 h-3 text-gray-400" />
                                                    )}
                                                </div>
                                            </div>
                                            <span className={faq.isPublished ? "text-green-700" : "text-gray-500"}>
                                                {faq.isPublished ? "공개" : "비공개"}
                                            </span>
                                        </button>
                                    </div>
                                    <h3 className="font-bold text-lg mb-2">{faq.question}</h3>
                                    <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                                        {faq.answer.substring(0, 150)}...
                                    </p>
                                    {faq.tags && faq.tags.length > 0 && (
                                        <div className="flex gap-1 flex-wrap mb-2">
                                            {faq.tags.map((tag) => (
                                                <span key={tag} className="text-xs bg-gray-100 px-2 py-0.5">
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    <p className="text-xs text-gray-400">
                                        {new Date(faq.createdAt).toLocaleDateString("ko-KR")}
                                        {viewStats.faq[faq.id] !== undefined && (
                                            <span className="ml-2 inline-flex items-center gap-1 text-blue-600">
                                                <BarChart3 className="w-3 h-3" />
                                                {viewStats.faq[faq.id].toLocaleString()}회
                                            </span>
                                        )}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <a
                                        href={`/faq/${faq.slug}`}
                                        target="_blank"
                                        className="p-2 border-2 border-black hover:bg-gray-100"
                                        title="보기"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </a>
                                    {onEdit && (
                                        <button
                                            onClick={() => onEdit(faq)}
                                            className="p-2 border-2 border-black hover:bg-blue-100"
                                            title="수정"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(faq.id)}
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
