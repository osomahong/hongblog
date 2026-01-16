"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Lock,
  Plus,
  List,
  Eye,
  Trash2,
  Edit,
  Save,
  TrendingUp,
  Sparkles,
  Database,
  MapPin,
  Calendar,
  Star,
  ArrowLeft,
  ImageIcon,
  Check,
  Search,
  ChevronDown,
  ChevronUp,
  BookText,
} from "lucide-react";
import MarkdownEditor from "@/components/MarkdownEditor";
import SeoEditor, { SeoData } from "@/components/SeoEditor";
import Link from "next/link";

// TODO: Migrate to NextAuth session-based authentication (same as /hong)
// For now, using environment variable instead of hardcoded password
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_LIFE_ADMIN_PASSWORD || "";

type LifeLog = {
  id: number;
  slug: string;
  title: string;
  content: string;
  category: string;
  thumbnailUrl: string | null;
  location: string | null;
  visitedAt: string | null;
  rating: number | null;
  isPublished: boolean;
  createdAt: string;
  // SEO fields
  metaTitle: string | null;
  metaDescription: string | null;
  ogImage: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  canonicalUrl: string | null;
  noIndex: boolean;
};

const categoryConfig = {
  MARKETING: { icon: TrendingUp, label: "마케팅", color: "bg-orange-500" },
  AI_TECH: { icon: Sparkles, label: "AI & Tech", color: "bg-purple-500" },
  DATA: { icon: Database, label: "데이터", color: "bg-blue-500" },
  맛집: { icon: TrendingUp, label: "맛집", color: "bg-red-500" },
  강의: { icon: Sparkles, label: "강의", color: "bg-green-500" },
  문화생활: { icon: Database, label: "문화생활", color: "bg-pink-500" },
  여행: { icon: TrendingUp, label: "여행", color: "bg-teal-500" },
  일상: { icon: BookText, label: "일상", color: "bg-gray-500" },
};

export default function LifeLogAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [view, setView] = useState<"list" | "editor">("list");
  const [lifeLogs, setLifeLogs] = useState<LifeLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingLog, setEditingLog] = useState<LifeLog | null>(null);

  // Editor state
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<keyof typeof categoryConfig>("MARKETING");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [location, setLocation] = useState("");
  const [visitedAt, setVisitedAt] = useState("");
  const [rating, setRating] = useState<number>(0);

  // SEO state
  const [seoData, setSeoData] = useState<SeoData>({
    metaTitle: "",
    metaDescription: "",
    ogImage: "",
    ogTitle: "",
    ogDescription: "",
    canonicalUrl: "",
    noIndex: false,
  });
  const [showSeoEditor, setShowSeoEditor] = useState(false);

  const loadLifeLogs = useCallback(async () => {
    try {
      const res = await fetch("/api/hong/lifelogs");
      if (res.ok) {
        const data = await res.json();
        setLifeLogs(data);
      }
    } catch {
      console.error("Failed to load lifeLogs");
    }
  }, []);

  useEffect(() => {
    const auth = sessionStorage.getItem("hong_auth");
    if (auth === "true") {
      setIsAuthenticated(true);
      loadLifeLogs();
    }
  }, [loadLifeLogs]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem("hong_auth", "true");
      setError("");
      loadLifeLogs();
    } else {
      setError("비밀번호가 틀렸습니다.");
    }
  };

  const resetEditor = () => {
    setEditingLog(null);
    setTitle("");
    setSlug("");
    setContent("");
    setCategory("MARKETING");
    setThumbnailUrl("");
    setLocation("");
    setVisitedAt("");
    setRating(0);
    setSeoData({
      metaTitle: "",
      metaDescription: "",
      ogImage: "",
      ogTitle: "",
      ogDescription: "",
      canonicalUrl: "",
      noIndex: false,
    });
    setShowSeoEditor(false);
  };

  const handleSave = async () => {
    if (!title || !slug || !content) {
      alert("제목, 슬러그, 내용을 모두 입력해주세요.");
      return;
    }
    setIsLoading(true);
    const data = {
      id: editingLog?.id,
      title,
      slug,
      content,
      category,
      thumbnailUrl: thumbnailUrl || null,
      location: location || null,
      visitedAt: visitedAt || null,
      rating: rating || null,
      isPublished: editingLog?.isPublished ?? true,
      // SEO fields
      metaTitle: seoData.metaTitle || null,
      metaDescription: seoData.metaDescription || null,
      ogImage: seoData.ogImage || null,
      ogTitle: seoData.ogTitle || null,
      ogDescription: seoData.ogDescription || null,
      canonicalUrl: seoData.canonicalUrl || null,
      noIndex: seoData.noIndex,
    };
    try {
      const res = await fetch("/api/hong/lifelogs", {
        method: editingLog ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        alert(editingLog ? "수정되었습니다!" : "저장되었습니다!");
        resetEditor();
        setView("list");
        loadLifeLogs();
      } else {
        const result = await res.json();
        alert(result.error || "저장 실패");
      }
    } catch {
      alert("저장 중 오류 발생");
    }
    setIsLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      const res = await fetch(`/api/hong/lifelogs?id=${id}`, { method: "DELETE" });
      if (res.ok) loadLifeLogs();
      else alert("삭제 실패");
    } catch {
      alert("삭제 실패");
    }
  };

  const handleEdit = (log: LifeLog) => {
    setEditingLog(log);
    setTitle(log.title);
    setSlug(log.slug);
    setContent(log.content);
    setCategory(log.category as keyof typeof categoryConfig);
    setThumbnailUrl(log.thumbnailUrl || "");
    setLocation(log.location || "");
    setVisitedAt(log.visitedAt || "");
    setRating(log.rating || 0);
    setSeoData({
      metaTitle: log.metaTitle || "",
      metaDescription: log.metaDescription || "",
      ogImage: log.ogImage || "",
      ogTitle: log.ogTitle || "",
      ogDescription: log.ogDescription || "",
      canonicalUrl: log.canonicalUrl || "",
      noIndex: log.noIndex || false,
    });
    setShowSeoEditor(false);
    setView("editor");
  };

  const togglePublished = async (log: LifeLog) => {
    const action = log.isPublished ? "비공개로 전환" : "공개 배포";
    if (!confirm(`${action}하시겠습니까?`)) return;

    try {
      const res = await fetch("/api/hong/lifelogs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...log, isPublished: !log.isPublished }),
      });
      if (res.ok) {
        loadLifeLogs();
        alert(`${action} 완료!`);
      }
    } catch {
      alert("상태 변경 실패");
    }
  };

  const generateSlug = () => {
    const generated = title
      .toLowerCase()
      .replace(/[^a-z0-9가-힣\s-]/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 100);
    setSlug(generated || `life-${Date.now()}`);
  };

  // 본문에서 이미지 URL 추출
  const contentImages =
    (content.match(/!\[.*?\]\((.*?)\)/g)?.map((m) => m.match(/\((.*?)\)/)?.[1]).filter(Boolean) as string[]) || [];

  const handleThumbnailSelect = (url: string) => {
    const newUrl = thumbnailUrl === url ? "" : url;
    setThumbnailUrl(newUrl);
    setSeoData((prev) => ({ ...prev, ogImage: newUrl }));
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white border-4 border-black p-8 w-full max-w-md" style={{ boxShadow: "8px 8px 0 black" }}>
          <div className="flex items-center gap-3 mb-6">
            <Lock className="w-8 h-8" />
            <h1 className="text-2xl font-black uppercase">Life Log Admin</h1>
          </div>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호 입력"
              className="w-full px-4 py-3 border-4 border-black mb-4 focus:outline-none"
              autoFocus
            />
            {error && <p className="text-red-600 font-bold mb-4">{error}</p>}
            <button
              type="submit"
              className="w-full bg-black text-white py-3 font-bold uppercase hover:bg-gray-800 transition"
            >
              입장하기
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-black text-white p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Link href="/hong" className="text-gray-400 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-black uppercase flex items-center gap-2">
              <BookText className="w-6 h-6" />
              Life Log CMS
            </h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                resetEditor();
                setView("list");
              }}
              className={`px-4 py-2 font-bold uppercase text-sm flex items-center gap-1 ${view === "list" ? "bg-white text-black" : "bg-gray-700"}`}
            >
              <List className="w-4 h-4" /> 목록
            </button>
            <button
              onClick={() => {
                resetEditor();
                setView("editor");
              }}
              className={`px-4 py-2 font-bold uppercase text-sm flex items-center gap-1 ${view === "editor" ? "bg-white text-black" : "bg-gray-700"}`}
            >
              <Plus className="w-4 h-4" /> 새 글
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* List View */}
        {view === "list" && (
          <div className="bg-white border-4 border-black p-6" style={{ boxShadow: "8px 8px 0 black" }}>
            <h2 className="text-xl font-black uppercase mb-4 flex items-center gap-2">
              <List className="w-5 h-5" /> Life Logs ({lifeLogs.length})
            </h2>
            {lifeLogs.length === 0 ? (
              <p className="text-gray-500 py-8 text-center">작성된 글이 없습니다.</p>
            ) : (
              <div className="space-y-3">
                {lifeLogs.map((log) => {
                  const config = categoryConfig[log.category as keyof typeof categoryConfig];
                  const Icon = config?.icon || BookText;
                  return (
                    <div
                      key={log.id}
                      className="border-2 border-black p-4 flex items-center justify-between hover:bg-gray-50"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-bold text-white border border-black ${config?.color}`}
                          >
                            <Icon className="w-3 h-3" />
                            {config?.label}
                          </span>
                          <button onClick={() => togglePublished(log)} className="flex items-center gap-2 text-xs font-bold">
                            <div
                              className={`relative w-12 h-6 rounded-full transition-colors ${log.isPublished ? "bg-green-500" : "bg-gray-300"}`}
                            >
                              <div
                                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform flex items-center justify-center ${log.isPublished ? "translate-x-6" : "translate-x-0.5"}`}
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
                        <h3 className="font-bold text-lg">{log.title}</h3>
                        <p className="text-sm text-gray-500 flex items-center gap-3">
                          {log.visitedAt && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(log.visitedAt).toLocaleDateString("ko-KR")}
                            </span>
                          )}
                          {log.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {log.location}
                            </span>
                          )}
                          {log.rating && (
                            <span className="flex items-center gap-0.5">
                              {[...Array(log.rating)].map((_, i) => (
                                <Star key={i} className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                              ))}
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <a
                          href={`/about/life/${log.slug}`}
                          target="_blank"
                          className="p-2 border-2 border-black hover:bg-gray-100"
                          title="보기"
                        >
                          <Eye className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => handleEdit(log)}
                          className="p-2 border-2 border-black hover:bg-blue-100"
                          title="수정"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(log.id)}
                          className="p-2 border-2 border-black hover:bg-red-100"
                          title="삭제"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Editor View */}
        {view === "editor" && (
          <div className="space-y-6">
            <div className="bg-white border-4 border-black p-6" style={{ boxShadow: "8px 8px 0 black" }}>
              <h2 className="text-xl font-black uppercase mb-4">
                {editingLog ? `글 수정 (ID: ${editingLog.id})` : "새 글 작성"}
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold uppercase mb-1">제목 *</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-2 border-4 border-black focus:outline-none"
                      placeholder="글 제목"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold uppercase mb-1">카테고리 *</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as keyof typeof categoryConfig)}
                      className="w-full px-4 py-2 border-4 border-black focus:outline-none bg-white"
                    >
                      {Object.entries(categoryConfig).map(([key, config]) => (
                        <option key={key} value={key}>
                          {config.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold uppercase mb-1">슬러그 (URL) *</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      className="flex-1 px-4 py-2 border-4 border-black focus:outline-none"
                      placeholder="url-slug"
                    />
                    <button
                      onClick={generateSlug}
                      className="px-4 py-2 bg-gray-200 border-4 border-black font-bold text-sm hover:bg-gray-300"
                    >
                      자동생성
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">URL: /about/life/{slug || "..."}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-bold uppercase mb-1">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      장소
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-4 py-2 border-4 border-black focus:outline-none"
                      placeholder="예: 서울 강남구"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold uppercase mb-1">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      방문일
                    </label>
                    <input
                      type="date"
                      value={visitedAt}
                      onChange={(e) => setVisitedAt(e.target.value)}
                      className="w-full px-4 py-2 border-4 border-black focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold uppercase mb-1">
                      <Star className="w-4 h-4 inline mr-1" />
                      평점
                    </label>
                    <div className="flex items-center gap-1 py-2">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setRating(rating === n ? 0 : n)}
                          className="p-1"
                        >
                          <Star className={`w-6 h-6 ${n <= rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 썸네일 이미지 선택 */}
                <div>
                  <label className="block text-sm font-bold uppercase mb-1">
                    <ImageIcon className="w-4 h-4 inline mr-1" />
                    썸네일 이미지 선택
                  </label>
                  {contentImages.length > 0 ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 p-3 border-4 border-black bg-gray-50">
                      {contentImages.map((url, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleThumbnailSelect(url)}
                          className={`relative aspect-square border-4 overflow-hidden transition-all ${thumbnailUrl === url
                            ? "border-blue-600 ring-2 ring-blue-300"
                            : "border-gray-300 hover:border-black"
                            }`}
                        >
                          <img src={url} alt={`이미지 ${idx + 1}`} className="w-full h-full object-cover" />
                          {thumbnailUrl === url && (
                            <div className="absolute inset-0 bg-blue-600/30 flex items-center justify-center">
                              <Check className="w-6 h-6 text-white drop-shadow-lg" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 border-4 border-dashed border-gray-300 bg-gray-50 text-center text-gray-500 text-sm">
                      본문에 이미지를 추가하면 여기서 썸네일로 선택할 수 있습니다.
                    </div>
                  )}
                  {thumbnailUrl && (
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-xs text-gray-500">선택됨:</span>
                      <img src={thumbnailUrl} alt="썸네일" className="h-12 object-contain border-2 border-black" />
                      <button
                        type="button"
                        onClick={() => {
                          setThumbnailUrl("");
                          setSeoData((prev) => ({ ...prev, ogImage: "" }));
                        }}
                        className="text-xs text-red-600 hover:underline"
                      >
                        해제
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold uppercase mb-1">내용 * (Markdown)</label>
                  <MarkdownEditor value={content} onChange={setContent} />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="flex-1 bg-black text-white py-3 font-bold uppercase hover:bg-gray-800 transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Save className="w-5 h-5" />
                    {isLoading ? "저장 중..." : editingLog ? "수정하기" : "저장하기"}
                  </button>
                  <button
                    onClick={() => {
                      resetEditor();
                      setView("list");
                    }}
                    className="px-6 py-3 border-4 border-black font-bold uppercase hover:bg-gray-100"
                  >
                    취소
                  </button>
                </div>
              </div>
            </div>

            {/* SEO Editor Toggle */}
            <div className="bg-white border-4 border-black" style={{ boxShadow: "8px 8px 0 black" }}>
              <button
                type="button"
                onClick={() => setShowSeoEditor(!showSeoEditor)}
                className="w-full p-4 flex items-center justify-between font-bold uppercase hover:bg-gray-50"
              >
                <span className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  SEO 설정
                </span>
                {showSeoEditor ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
              {showSeoEditor && (
                <div className="border-t-4 border-black">
                  <SeoEditor title={title} content={content} initialData={seoData} onChange={setSeoData} />
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
