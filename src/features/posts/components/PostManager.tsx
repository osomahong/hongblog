"use client";

import { useState, useEffect, useTransition } from "react";
import { FileText, Eye, Edit, Trash2, Linkedin, Loader2, Lock, BarChart3 } from "lucide-react";
import {
    getPostsAction,
    deletePostAction,
    togglePostPublishedAction,
} from "../actions";

type Post = {
    id: number;
    slug: string;
    title: string;
    excerpt: string | null;
    content: string;
    category: string;
    thumbnailUrl: string | null;
    tags: string[];
    isPublished: boolean;
    seriesId: number | null;
    seriesOrder: number | null;
    linkedinPostedAt: string | null;
    createdAt: string;
    seriesInfo: {
        id: number;
        slug: string;
        title: string;
    } | null;
};

type ViewStats = {
    post: Record<number, number>;
    faq: Record<number, number>;
};

interface PostManagerProps {
    viewStats: ViewStats;
    onEdit?: (post: Post) => void;
    onLinkedInSummary?: (post: Post) => void;
    isGeneratingLinkedinSummary?: number | null;
}

export function PostManager({
    viewStats,
    onEdit,
    onLinkedInSummary,
    isGeneratingLinkedinSummary,
}: PostManagerProps) {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isPending, startTransition] = useTransition();
    const [searchQuery, setSearchQuery] = useState("");

    // 포스트 목록 로드
    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = async () => {
        setIsLoading(true);
        startTransition(async () => {
            const result = await getPostsAction({ includeDrafts: true });
            if (result.success && result.data) {
                setPosts(result.data as any);
            }
            setIsLoading(false);
        });
    };

    // 발행 상태 토글
    const handleTogglePublished = async (post: Post) => {
        startTransition(async () => {
            const result = await togglePostPublishedAction(post.id);
            if (result.success) {
                await loadPosts();
            } else {
                alert(`토글 실패: ${result.error}`);
            }
        });
    };

    // 삭제
    const handleDelete = async (id: number) => {
        if (!confirm("정말 삭제하시겠습니까?")) return;

        startTransition(async () => {
            const result = await deletePostAction(id);
            if (result.success) {
                await loadPosts();
            } else {
                alert(`삭제 실패: ${result.error}`);
            }
        });
    };

    // LinkedIn 게시 상태 토글
    const handleToggleLinkedinStatus = async (post: Post) => {
        const newValue = post.linkedinPostedAt ? null : new Date().toISOString();
        try {
            const res = await fetch("/api/hong/linkedin-status", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contentType: "post",
                    contentId: post.id,
                    linkedinPostedAt: newValue,
                }),
            });
            if (res.ok) {
                await loadPosts();
            } else {
                alert("LinkedIn 상태 업데이트 실패");
            }
        } catch {
            alert("LinkedIn 상태 업데이트 중 오류 발생");
        }
    };

    // 검색 필터링
    const filteredPosts = posts.filter((post) =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const categoryIcon = (category: string) => {
        const icons: Record<string, any> = {
            AI_TECH: "🤖",
            DATA: "📊",
            MARKETING: "📈",
        };
        return icons[category] || "📄";
    };

    return (
        <div className="bg-white border-4 border-black p-6" style={{ boxShadow: "8px 8px 0 black" }}>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-black uppercase flex items-center gap-2">
                    <FileText className="w-5 h-5" /> Posts ({posts.length})
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
            ) : filteredPosts.length === 0 ? (
                <p className="text-gray-500 py-8 text-center">
                    {searchQuery ? "검색 결과가 없습니다." : "등록된 게시글이 없습니다."}
                </p>
            ) : (
                <div className="space-y-3">
                    {filteredPosts.map((post) => (
                        <div key={post.id} className="border-2 border-black p-4 hover:bg-gray-50">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                                        <span className="text-2xl">{categoryIcon(post.category)}</span>
                                        <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-0.5">
                                            {post.category}
                                        </span>
                                        {post.seriesInfo && (
                                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5">
                                                📚 {post.seriesInfo.title}
                                            </span>
                                        )}
                                        <button
                                            onClick={() => handleTogglePublished(post)}
                                            disabled={isPending}
                                            className="flex items-center gap-2 text-xs font-bold"
                                            title={post.isPublished ? "클릭하여 비공개로 전환" : "클릭하여 공개 배포"}
                                        >
                                            <div
                                                className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${post.isPublished ? "bg-green-500" : "bg-gray-300"
                                                    }`}
                                            >
                                                <div
                                                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 flex items-center justify-center ${post.isPublished ? "translate-x-6" : "translate-x-0.5"
                                                        }`}
                                                >
                                                    {post.isPublished ? (
                                                        <Eye className="w-3 h-3 text-green-600" />
                                                    ) : (
                                                        <Lock className="w-3 h-3 text-gray-400" />
                                                    )}
                                                </div>
                                            </div>
                                            <span className={post.isPublished ? "text-green-700" : "text-gray-500"}>
                                                {post.isPublished ? "공개" : "비공개"}
                                            </span>
                                        </button>
                                        <button
                                            onClick={() => handleToggleLinkedinStatus(post)}
                                            className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 border rounded-sm transition-colors ${
                                                post.linkedinPostedAt
                                                    ? "bg-blue-50 text-[#0A66C2] border-[#0A66C2] hover:bg-blue-100"
                                                    : "bg-gray-50 text-gray-400 border-gray-300 hover:bg-gray-100"
                                            }`}
                                            title={post.linkedinPostedAt ? "클릭하여 게시 상태 해제" : "클릭하여 게시됨으로 표시"}
                                        >
                                            <Linkedin className="w-3 h-3" />
                                            {post.linkedinPostedAt
                                                ? `업로드 완료(${new Date(post.linkedinPostedAt).toLocaleDateString("ko-KR", { month: "numeric", day: "numeric" })})`
                                                : "미게시"}
                                        </button>
                                    </div>
                                    <h3 className="font-bold text-lg mb-2">{post.title}</h3>
                                    {post.excerpt && <p className="text-gray-600 text-sm line-clamp-2 mb-2">{post.excerpt}</p>}
                                    {post.tags && post.tags.length > 0 && (
                                        <div className="flex gap-1 flex-wrap mb-2">
                                            {post.tags.map((tag) => (
                                                <span key={tag} className="text-xs bg-gray-100 px-2 py-0.5">
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    <p className="text-xs text-gray-400">
                                        {new Date(post.createdAt).toLocaleDateString("ko-KR")}
                                        {viewStats.post[post.id] !== undefined && (
                                            <span className="ml-2 inline-flex items-center gap-1 text-blue-600">
                                                <BarChart3 className="w-3 h-3" />
                                                {viewStats.post[post.id].toLocaleString()}회
                                            </span>
                                        )}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    {onLinkedInSummary && (
                                        <button
                                            onClick={() => onLinkedInSummary(post)}
                                            disabled={isGeneratingLinkedinSummary === post.id}
                                            className="p-2 border-2 border-black hover:bg-blue-50 disabled:opacity-50"
                                            title="링크드인 요약 생성"
                                        >
                                            {isGeneratingLinkedinSummary === post.id ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Linkedin className="w-4 h-4 text-[#0A66C2]" />
                                            )}
                                        </button>
                                    )}
                                    <a
                                        href={`/insights/${post.slug}`}
                                        target="_blank"
                                        className="p-2 border-2 border-black hover:bg-gray-100"
                                        title="보기"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </a>
                                    {onEdit && (
                                        <button
                                            onClick={() => onEdit(post)}
                                            className="p-2 border-2 border-black hover:bg-blue-100"
                                            title="수정"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(post.id)}
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
