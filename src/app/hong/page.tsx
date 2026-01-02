"use client";

import { useState, useEffect, useCallback } from "react";
import { Lock, FileText, Plus, List, Eye, Trash2, Edit, Save, Sparkles, Database, TrendingUp, HelpCircle, Search, Wand2, Loader2, ImageIcon, Check, BarChart3, BookOpen } from "lucide-react";
import MarkdownEditor from "@/components/MarkdownEditor";
import SeoEditor, { SeoData } from "@/components/SeoEditor";

const ADMIN_PASSWORD = "dhthak123!@#";

type Post = {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  category: string;
  highlights: string[] | null;
  thumbnailUrl: string | null;
  tags: string[];
  isPublished: boolean;
  seriesId: number | null;
  seriesOrder: number | null;
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

type Faq = {
  id: number;
  slug: string;
  question: string;
  answer: string;
  category: string;
  isPublished: boolean;
  tags: string[];
  createdAt: string;
};

type Series = {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  isPublished: boolean;
  postCount: number;
  posts: { id: number; title: string; slug: string; seriesOrder: number | null }[];
  createdAt: string;
};

const categoryIcons = {
  AI_TECH: Sparkles,
  DATA: Database,
  MARKETING: TrendingUp,
};

export default function HongAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"posts" | "faqs" | "series">("posts");
  const [view, setView] = useState<"list" | "editor">("list");
  const [posts, setPosts] = useState<Post[]>([]);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [seriesList, setSeriesList] = useState<Series[]>([]);
  const [viewStats, setViewStats] = useState<{ post: Record<number, number>; faq: Record<number, number> }>({ post: {}, faq: {} });
  const [isLoading, setIsLoading] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [editingFaq, setEditingFaq] = useState<Partial<Faq & { tags: string[]; recommendedYear: string; recommendedPositions: string[]; difficulty: string; referenceUrl: string; referenceTitle: string; techStack: string[] }> | null>(null);
  const [editingSeries, setEditingSeries] = useState<Series | null>(null);

  // Post Editor state
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<"MARKETING" | "AI_TECH" | "DATA">("MARKETING");
  const [highlights, setHighlights] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [selectedSeriesId, setSelectedSeriesId] = useState<number | null>(null);
  const [seriesOrder, setSeriesOrder] = useState<number | null>(null);
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
  const [isGeneratingMetadata, setIsGeneratingMetadata] = useState(false);

  // FAQ Editor state
  const [faqQuestion, setFaqQuestion] = useState("");
  const [faqAnswer, setFaqAnswer] = useState("");
  const [faqCategory, setFaqCategory] = useState<"MARKETING" | "AI_TECH" | "DATA">("MARKETING");
  const [faqTagsInput, setFaqTagsInput] = useState("");
  const [recommendedPositionsInput, setRecommendedPositionsInput] = useState("");
  const [techStackInput, setTechStackInput] = useState("");

  // Series Editor state
  const [seriesTitle, setSeriesTitle] = useState("");
  const [seriesSlug, setSeriesSlug] = useState("");
  const [seriesDescription, setSeriesDescription] = useState("");
  const [seriesThumbnailUrl, setSeriesThumbnailUrl] = useState("");
  const [isUploadingSeriesThumbnail, setIsUploadingSeriesThumbnail] = useState(false);

  const loadPosts = useCallback(async () => {
    try {
      const res = await fetch("/api/hong/posts");
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch {
      console.error("Failed to load posts");
    }
  }, []);

  const loadFaqs = useCallback(async () => {
    try {
      const res = await fetch("/api/hong/faqs");
      if (res.ok) {
        const data = await res.json();
        setFaqs(data);
      }
    } catch {
      console.error("Failed to load faqs");
    }
  }, []);

  const loadStats = useCallback(async () => {
    try {
      const res = await fetch("/api/hong/stats?days=30");
      if (res.ok) {
        const data = await res.json();
        setViewStats(data);
      }
    } catch {
      console.error("Failed to load stats");
    }
  }, []);

  const loadSeries = useCallback(async () => {
    try {
      const res = await fetch("/api/hong/series");
      if (res.ok) {
        const data = await res.json();
        setSeriesList(data);
      }
    } catch {
      console.error("Failed to load series");
    }
  }, []);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    await Promise.all([loadPosts(), loadFaqs(), loadStats(), loadSeries()]);
    setIsLoading(false);
  }, [loadPosts, loadFaqs, loadStats, loadSeries]);

  useEffect(() => {
    const auth = sessionStorage.getItem("hong_auth");
    if (auth === "true") {
      setIsAuthenticated(true);
      loadData();
    }
  }, [loadData]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem("hong_auth", "true");
      setError("");
      loadData();
    } else {
      setError("비밀번호가 틀렸습니다.");
    }
  };

  const resetPostEditor = () => {
    setEditingPost(null);
    setTitle("");
    setSlug("");
    setExcerpt("");
    setContent("");
    setCategory("MARKETING");
    setHighlights("");
    setTagsInput("");
    setThumbnailUrl("");
    setSelectedSeriesId(null);
    setSeriesOrder(null);
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
    setIsGeneratingMetadata(false);
  };

  const resetFaqEditor = () => {
    setEditingFaq(null);
    setFaqQuestion("");
    setFaqAnswer("");
    setFaqCategory("MARKETING");
    setFaqTagsInput("");
    setRecommendedPositionsInput("");
    setTechStackInput("");
  };

  const resetSeriesEditor = () => {
    setEditingSeries(null);
    setSeriesTitle("");
    setSeriesSlug("");
    setSeriesDescription("");
    setSeriesThumbnailUrl("");
  };

  // Post CRUD
  const handleSavePost = async () => {
    if (!title || !slug || !content) {
      alert("제목, 슬러그, 내용을 모두 입력해주세요.");
      return;
    }
    setIsLoading(true);
    const postData = {
      id: editingPost?.id,
      title,
      slug,
      excerpt: excerpt || null,
      content,
      category,
      highlights: highlights ? highlights.split(",").map((h) => h.trim()).filter(Boolean) : null,
      thumbnailUrl: thumbnailUrl || null,
      tags: tagsInput ? tagsInput.split(",").map((t) => t.trim()).filter(Boolean) : [],
      seriesId: selectedSeriesId,
      seriesOrder: seriesOrder,
      // SEO fields
      metaTitle: seoData.metaTitle || null,
      metaDescription: seoData.metaDescription || null,
      ogImage: seoData.ogImage || null,
      ogTitle: seoData.ogTitle || null,
      ogDescription: seoData.ogDescription || null,
      canonicalUrl: seoData.canonicalUrl || null,
      noIndex: seoData.noIndex,
      isPublished: editingPost?.isPublished ?? true,
    };
    try {
      const res = await fetch("/api/hong/posts", {
        method: editingPost ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });
      if (res.ok) {
        alert(editingPost ? "수정되었습니다!" : "저장되었습니다!");
        resetPostEditor();
        setView("list");
        loadPosts();
      } else {
        const data = await res.json();
        alert(data.error || "저장 실패");
      }
    } catch {
      alert("저장 중 오류 발생");
    }
    setIsLoading(false);
  };

  const handleDeletePost = async (id: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      const res = await fetch(`/api/hong/posts?id=${id}`, { method: "DELETE" });
      if (res.ok) loadPosts();
      else alert("삭제 실패");
    } catch {
      alert("삭제 실패");
    }
  };

  const handleEditPost = (post: Post) => {
    setEditingPost(post);
    setTitle(post.title);
    setSlug(post.slug);
    setExcerpt(post.excerpt || "");
    setContent(post.content);
    setCategory(post.category as "MARKETING" | "AI_TECH" | "DATA");
    setHighlights(post.highlights?.join(", ") || "");
    setTagsInput(post.tags?.join(", ") || "");
    setThumbnailUrl(post.thumbnailUrl || "");
    setSelectedSeriesId(post.seriesId);
    setSeriesOrder(post.seriesOrder);
    setSeoData({
      metaTitle: post.metaTitle || "",
      metaDescription: post.metaDescription || "",
      ogImage: post.ogImage || "",
      ogTitle: post.ogTitle || "",
      ogDescription: post.ogDescription || "",
      canonicalUrl: post.canonicalUrl || "",
      noIndex: post.noIndex || false,
    });
    setShowSeoEditor(false);
    setView("editor");
  };

  const generateSlug = () => {
    const generated = title
      .toLowerCase()
      .replace(/[^a-z0-9가-힣\s-]/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 100);
    setSlug(generated || `post-${Date.now()}`);
  };

  // AI 메타데이터 자동 생성
  const handleGenerateMetadata = async () => {
    if (content.length < 100) {
      alert("본문을 최소 100자 이상 입력해주세요.");
      return;
    }
    setIsGeneratingMetadata(true);
    try {
      const res = await fetch("/api/hong/ai/generate-metadata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (res.ok) {
        const data = await res.json();
        setTitle(data.title);
        setSlug(data.slug);
        setExcerpt(data.excerpt);
        setCategory(data.category);
        setHighlights(data.highlights?.join(", ") || "");
        setTagsInput(data.tags?.join(", ") || "");
        alert("메타데이터가 생성되었습니다! 필요시 수정해주세요.");
      } else {
        const data = await res.json();
        alert(data.error || "생성 실패");
      }
    } catch {
      alert("메타데이터 생성 중 오류 발생");
    }
    setIsGeneratingMetadata(false);
  };

  // FAQ CRUD
  const handleSaveFaq = async () => {
    if (!faqQuestion || !faqAnswer) {
      alert("질문과 답변을 모두 입력해주세요.");
      return;
    }
    setIsLoading(true);
    const faqData = {
      id: editingFaq?.id,
      question: faqQuestion,
      answer: faqAnswer,
      category: faqCategory,
      tags: faqTagsInput ? faqTagsInput.split(",").map((t) => t.trim()).filter(Boolean) : [],
      recommendedYear: editingFaq?.recommendedYear || null,
      recommendedPositions: recommendedPositionsInput ? recommendedPositionsInput.split(",").map((t) => t.trim()).filter(Boolean) : [],
      difficulty: editingFaq?.difficulty || null,
      referenceUrl: editingFaq?.referenceUrl || null,
      referenceTitle: editingFaq?.referenceTitle || null,
      techStack: techStackInput ? techStackInput.split(",").map((t) => t.trim()).filter(Boolean) : [],
      isPublished: editingFaq?.isPublished ?? true,
    };
    try {
      const res = await fetch("/api/hong/faqs", {
        method: editingFaq ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(faqData),
      });
      if (res.ok) {
        alert(editingFaq ? "수정되었습니다!" : "저장되었습니다!");
        resetFaqEditor();
        setView("list");
        loadFaqs();
      } else {
        const data = await res.json();
        alert(data.error || "저장 실패");
      }
    } catch {
      alert("저장 중 오류 발생");
    }
    setIsLoading(false);
  };

  const handleDeleteFaq = async (id: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      const res = await fetch(`/api/hong/faqs?id=${id}`, { method: "DELETE" });
      if (res.ok) loadFaqs();
      else alert("삭제 실패");
    } catch {
      alert("삭제 실패");
    }
  };

  const handleEditFaq = (faq: Faq) => {
    setEditingFaq(faq);
    setFaqQuestion(faq.question);
    setFaqAnswer(faq.answer);
    setFaqCategory(faq.category as "MARKETING" | "AI_TECH" | "DATA");
    setFaqTagsInput(faq.tags?.join(", ") || "");
    setRecommendedPositionsInput((faq as any).recommendedPositions?.join(", ") || "");
    setTechStackInput((faq as any).techStack?.join(", ") || "");
    setView("editor");
  };

  const togglePostPublished = async (post: Post) => {
    const action = post.isPublished ? "비공개로 전환" : "공개 배포";
    const message = post.isPublished
      ? `"${post.title}" 글을 비공개로 전환하시겠습니까?\n\n비공개 전환 시 사이트에서 더 이상 보이지 않습니다.`
      : `"${post.title}" 글을 공개 배포하시겠습니까?\n\n배포 시 사이트에 즉시 노출됩니다.`;

    if (!confirm(message)) return;

    try {
      const res = await fetch("/api/hong/posts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...post, isPublished: !post.isPublished }),
      });
      if (res.ok) {
        loadPosts();
        alert(`${action} 완료!`);
      }
    } catch {
      alert("배포 상태 변경 실패");
    }
  };

  const toggleFaqPublished = async (faq: Faq) => {
    const action = faq.isPublished ? "비공개로 전환" : "공개 배포";
    const message = faq.isPublished
      ? `이 FAQ를 비공개로 전환하시겠습니까?\n\n비공개 전환 시 사이트에서 더 이상 보이지 않습니다.`
      : `이 FAQ를 공개 배포하시겠습니까?\n\n배포 시 사이트에 즉시 노출됩니다.`;

    if (!confirm(message)) return;

    try {
      const res = await fetch("/api/hong/faqs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...faq, isPublished: !faq.isPublished }),
      });
      if (res.ok) {
        loadFaqs();
        alert(`${action} 완료!`);
      }
    } catch {
      alert("배포 상태 변경 실패");
    }
  };

  // Series CRUD
  const handleSaveSeries = async () => {
    if (!seriesTitle || !seriesSlug) {
      alert("제목과 슬러그를 입력해주세요.");
      return;
    }
    setIsLoading(true);
    const seriesData = {
      id: editingSeries?.id,
      title: seriesTitle,
      slug: seriesSlug,
      description: seriesDescription || null,
      thumbnailUrl: seriesThumbnailUrl || null,
      isPublished: editingSeries?.isPublished ?? true,
    };
    try {
      const res = await fetch("/api/hong/series", {
        method: editingSeries ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(seriesData),
      });
      if (res.ok) {
        alert(editingSeries ? "수정되었습니다!" : "저장되었습니다!");
        resetSeriesEditor();
        setView("list");
        loadSeries();
      } else {
        const data = await res.json();
        alert(data.error || "저장 실패");
      }
    } catch {
      alert("저장 중 오류 발생");
    }
    setIsLoading(false);
  };

  const handleDeleteSeries = async (id: number) => {
    if (!confirm("정말 삭제하시겠습니까?\n\n시리즈에 포함된 글들은 삭제되지 않고 시리즈 연결만 해제됩니다.")) return;
    try {
      const res = await fetch(`/api/hong/series?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        loadSeries();
        loadPosts();
      } else alert("삭제 실패");
    } catch {
      alert("삭제 실패");
    }
  };

  const handleEditSeries = (s: Series) => {
    setEditingSeries(s);
    setSeriesTitle(s.title);
    setSeriesSlug(s.slug);
    setSeriesDescription(s.description || "");
    setSeriesThumbnailUrl(s.thumbnailUrl || "");
    setView("editor");
  };

  const generateSeriesSlug = () => {
    const generated = seriesTitle
      .toLowerCase()
      .replace(/[^a-z0-9가-힣\s-]/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 100);
    setSeriesSlug(generated || `series-${Date.now()}`);
  };

  const handleSeriesThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingSeriesThumbnail(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        setSeriesThumbnailUrl(data.url);
      } else {
        const data = await res.json();
        alert(data.error || "업로드 실패");
      }
    } catch {
      alert("업로드 중 오류 발생");
    }
    setIsUploadingSeriesThumbnail(false);
  };

  const toggleSeriesPublished = async (s: Series) => {
    const action = s.isPublished ? "비공개로 전환" : "공개 배포";
    const message = s.isPublished
      ? `"${s.title}" 시리즈를 비공개로 전환하시겠습니까?`
      : `"${s.title}" 시리즈를 공개 배포하시겠습니까?`;

    if (!confirm(message)) return;

    try {
      const res = await fetch("/api/hong/series", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...s, isPublished: !s.isPublished }),
      });
      if (res.ok) {
        loadSeries();
        alert(`${action} 완료!`);
      }
    } catch {
      alert("배포 상태 변경 실패");
    }
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white border-4 border-black p-8 w-full max-w-md" style={{ boxShadow: "8px 8px 0 black" }}>
          <div className="flex items-center gap-3 mb-6">
            <Lock className="w-8 h-8" />
            <h1 className="text-2xl font-black uppercase">Admin Access</h1>
          </div>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호 입력"
              className="w-full px-4 py-3 border-4 border-black mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            {error && <p className="text-red-600 font-bold mb-4">{error}</p>}
            <button type="submit" className="w-full bg-black text-white py-3 font-bold uppercase hover:bg-gray-800 transition">
              입장하기
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Main Admin Panel
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-black text-white p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <h1 className="text-xl font-black uppercase flex items-center gap-2">
            <FileText className="w-6 h-6" />
            Hong CMS
          </h1>
          <div className="flex gap-2 flex-wrap">
            {/* Tab 전환 */}
            <button
              onClick={() => { setActiveTab("posts"); resetPostEditor(); setView("list"); }}
              className={`px-4 py-2 font-bold uppercase text-sm flex items-center gap-1 ${activeTab === "posts" ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"}`}
            >
              <FileText className="w-4 h-4" /> Posts
            </button>
            <button
              onClick={() => { setActiveTab("faqs"); resetFaqEditor(); setView("list"); }}
              className={`px-4 py-2 font-bold uppercase text-sm flex items-center gap-1 ${activeTab === "faqs" ? "bg-green-600" : "bg-gray-700 hover:bg-gray-600"}`}
            >
              <HelpCircle className="w-4 h-4" /> FAQs
            </button>
            <button
              onClick={() => { setActiveTab("series"); resetSeriesEditor(); setView("list"); }}
              className={`px-4 py-2 font-bold uppercase text-sm flex items-center gap-1 ${activeTab === "series" ? "bg-purple-600" : "bg-gray-700 hover:bg-gray-600"}`}
            >
              <BookOpen className="w-4 h-4" /> Series
            </button>
            <a
              href="/hong/life"
              className="px-4 py-2 font-bold uppercase text-sm flex items-center gap-1 bg-orange-600 hover:bg-orange-500"
            >
              ☕ Life Log
            </a>
            <div className="w-px bg-gray-600 mx-2" />
            <button
              onClick={() => { activeTab === "posts" ? resetPostEditor() : activeTab === "faqs" ? resetFaqEditor() : resetSeriesEditor(); setView("list"); }}
              className={`px-4 py-2 font-bold uppercase text-sm flex items-center gap-1 ${view === "list" ? "bg-white text-black" : "bg-gray-700"}`}
            >
              <List className="w-4 h-4" /> 목록
            </button>
            <button
              onClick={() => { activeTab === "posts" ? resetPostEditor() : activeTab === "faqs" ? resetFaqEditor() : resetSeriesEditor(); setView("editor"); }}
              className={`px-4 py-2 font-bold uppercase text-sm flex items-center gap-1 ${view === "editor" ? "bg-white text-black" : "bg-gray-700"}`}
            >
              <Plus className="w-4 h-4" /> 새 글
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 sm:p-6">

        {/* Posts Tab */}
        {activeTab === "posts" && (
          <>
            {/* Post List View */}
            {view === "list" && (
              <div className="bg-white border-4 border-black p-6" style={{ boxShadow: "8px 8px 0 black" }}>
                <h2 className="text-xl font-black uppercase mb-4 flex items-center gap-2">
                  <List className="w-5 h-5" /> Posts ({posts.length})
                </h2>
                {isLoading ? (
                  <p className="text-gray-500 py-8 text-center">로딩 중...</p>
                ) : posts.length === 0 ? (
                  <p className="text-gray-500 py-8 text-center">작성된 글이 없습니다.</p>
                ) : (
                  <div className="space-y-3">
                    {posts.map((post) => {
                      const Icon = categoryIcons[post.category as keyof typeof categoryIcons] || FileText;
                      return (
                        <div key={post.id} className="border-2 border-black p-4 flex items-center justify-between hover:bg-gray-50">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <Icon className="w-4 h-4" />
                              <span className="text-xs font-bold uppercase bg-gray-200 px-2 py-0.5">{post.category}</span>
                              <button
                                onClick={() => togglePostPublished(post)}
                                className="flex items-center gap-2 text-xs font-bold"
                                title={post.isPublished ? "클릭하여 비공개로 전환" : "클릭하여 공개 배포"}
                              >
                                <div className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${post.isPublished ? "bg-green-500" : "bg-gray-300"
                                  }`}>
                                  <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 flex items-center justify-center ${post.isPublished ? "translate-x-6" : "translate-x-0.5"
                                    }`}>
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
                            </div>
                            <h3 className="font-bold text-lg">{post.title}</h3>
                            <p className="text-sm text-gray-500">
                              /insights/{post.slug} · {new Date(post.createdAt).toLocaleDateString("ko-KR")}
                              {viewStats.post[post.id] !== undefined && (
                                <span className="ml-2 inline-flex items-center gap-1 text-blue-600">
                                  <BarChart3 className="w-3 h-3" />
                                  {viewStats.post[post.id].toLocaleString()}회
                                </span>
                              )}
                            </p>
                            {post.tags && post.tags.length > 0 && (
                              <div className="flex gap-1 mt-1 flex-wrap">
                                {post.tags.map((tag) => (
                                  <span key={tag} className="text-xs text-gray-400">#{tag}</span>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <a href={`/insights/${post.slug}`} target="_blank" className="p-2 border-2 border-black hover:bg-gray-100" title="보기">
                              <Eye className="w-4 h-4" />
                            </a>
                            <button onClick={() => handleEditPost(post)} className="p-2 border-2 border-black hover:bg-blue-100" title="수정">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDeletePost(post.id)} className="p-2 border-2 border-black hover:bg-red-100" title="삭제">
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

            {/* Post Editor View */}
            {view === "editor" && (
              <div className="bg-white border-4 border-black p-6" style={{ boxShadow: "8px 8px 0 black" }}>
                <h2 className="text-xl font-black uppercase mb-4">
                  {editingPost ? `글 수정 (ID: ${editingPost.id})` : "새 글 작성"}
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
                        onChange={(e) => setCategory(e.target.value as "MARKETING" | "AI_TECH" | "DATA")}
                        className="w-full px-4 py-2 border-4 border-black focus:outline-none bg-white"
                      >
                        <option value="MARKETING">MARKETING</option>
                        <option value="AI_TECH">AI_TECH</option>
                        <option value="DATA">DATA</option>
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
                      <button onClick={generateSlug} className="px-4 py-2 bg-gray-200 border-4 border-black font-bold text-sm hover:bg-gray-300">
                        자동생성
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">URL: /insights/{slug || "..."}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-bold uppercase mb-1">요약 (Excerpt)</label>
                    <textarea
                      value={excerpt}
                      onChange={(e) => setExcerpt(e.target.value)}
                      className="w-full px-4 py-2 border-4 border-black focus:outline-none min-h-[80px]"
                      placeholder="글 요약 (목록에 표시됨)"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold uppercase mb-1">하이라이트 (쉼표 구분)</label>
                      <input
                        type="text"
                        value={highlights}
                        onChange={(e) => setHighlights(e.target.value)}
                        className="w-full px-4 py-2 border-4 border-black focus:outline-none"
                        placeholder="예: 신규, 인기, 추천"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold uppercase mb-1">태그 (쉼표 구분)</label>
                      <input
                        type="text"
                        value={tagsInput}
                        onChange={(e) => setTagsInput(e.target.value)}
                        className="w-full px-4 py-2 border-4 border-black focus:outline-none"
                        placeholder="예: AI, 마케팅, 데이터분석"
                      />
                    </div>
                  </div>

                  {/* 시리즈 선택 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold uppercase mb-1">
                        <BookOpen className="w-4 h-4 inline mr-1" />
                        시리즈 (선택)
                      </label>
                      <select
                        value={selectedSeriesId || ""}
                        onChange={(e) => setSelectedSeriesId(e.target.value ? parseInt(e.target.value) : null)}
                        className="w-full px-4 py-2 border-4 border-black focus:outline-none bg-white"
                      >
                        <option value="">시리즈 없음</option>
                        {seriesList.map((s) => (
                          <option key={s.id} value={s.id}>{s.title} ({s.postCount}편)</option>
                        ))}
                      </select>
                    </div>
                    {selectedSeriesId && (
                      <div>
                        <label className="block text-sm font-bold uppercase mb-1">시리즈 내 순서</label>
                        <input
                          type="number"
                          value={seriesOrder ?? ""}
                          onChange={(e) => setSeriesOrder(e.target.value ? parseInt(e.target.value) : null)}
                          className="w-full px-4 py-2 border-4 border-black focus:outline-none"
                          placeholder="예: 1, 2, 3..."
                          min={1}
                        />
                        <p className="text-xs text-gray-500 mt-1">숫자가 작을수록 앞에 표시됩니다.</p>
                      </div>
                    )}
                  </div>

                  {/* 썸네일 이미지 선택 */}
                  <div>
                    <label className="block text-sm font-bold uppercase mb-1">
                      <ImageIcon className="w-4 h-4 inline mr-1" />
                      썸네일 이미지 선택
                    </label>
                    {(() => {
                      const contentImages = content.match(/!\[.*?\]\((.*?)\)/g)?.map(m => m.match(/\((.*?)\)/)?.[1]).filter(Boolean) as string[] || [];
                      const handleThumbnailSelect = (url: string) => {
                        const newUrl = thumbnailUrl === url ? "" : url;
                        setThumbnailUrl(newUrl);
                        setSeoData(prev => ({ ...prev, ogImage: newUrl }));
                      };
                      return contentImages.length > 0 ? (
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
                      );
                    })()}
                    {thumbnailUrl && (
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-xs text-gray-500">선택됨:</span>
                        <img src={thumbnailUrl} alt="썸네일" className="h-12 object-contain border-2 border-black" />
                        <button type="button" onClick={() => { setThumbnailUrl(""); setSeoData(prev => ({ ...prev, ogImage: "" })); }} className="text-xs text-red-600 hover:underline">해제</button>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-bold uppercase mb-1">내용 (Markdown) * - Ctrl+B: 굵게, Ctrl+I: 기울임, Ctrl+K: 링크</label>
                    <MarkdownEditor
                      value={content}
                      onChange={setContent}
                      placeholder="## 제목&#10;&#10;본문 내용을 마크다운으로 작성하세요..."
                    />
                  </div>

                  {/* AI 메타데이터 자동 생성 */}
                  <div className="bg-gradient-to-r from-purple-100 to-blue-100 border-4 border-black p-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <h3 className="font-bold flex items-center gap-2">
                          <Wand2 className="w-5 h-5 text-purple-600" />
                          AI 메타데이터 자동 생성
                        </h3>
                        <p className="text-xs text-gray-600 mt-1">
                          본문 내용을 분석하여 제목, 슬러그, 요약, 카테고리, 하이라이트, 태그를 자동 생성합니다.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleGenerateMetadata}
                        disabled={isGeneratingMetadata || content.length < 100}
                        className="px-4 py-2 bg-purple-600 text-white border-4 border-black font-bold uppercase text-sm hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
                      >
                        {isGeneratingMetadata ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            생성 중...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4" />
                            AI 생성
                          </>
                        )}
                      </button>
                    </div>
                    {content.length < 100 && (
                      <p className="text-xs text-orange-600 mt-2">
                        ⚠️ 본문을 최소 100자 이상 입력해야 AI 생성이 가능합니다. (현재: {content.length}자)
                      </p>
                    )}
                  </div>

                  {/* SEO Editor Toggle */}
                  <div className="border-t-4 border-black pt-4">
                    <button
                      type="button"
                      onClick={() => setShowSeoEditor(!showSeoEditor)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-100 border-4 border-black font-bold uppercase text-sm hover:bg-blue-200"
                    >
                      <Search className="w-4 h-4" />
                      {showSeoEditor ? "SEO 설정 접기" : "SEO 설정 열기"}
                    </button>
                  </div>

                  {/* SEO Editor */}
                  {showSeoEditor && (
                    <SeoEditor
                      title={title}
                      content={content}
                      initialData={seoData}
                      onChange={setSeoData}
                    />
                  )}

                  <button
                    onClick={handleSavePost}
                    disabled={isLoading}
                    className="w-full bg-black text-white py-3 font-bold uppercase hover:bg-gray-800 disabled:bg-gray-400 flex items-center justify-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    {isLoading ? "저장 중..." : editingPost ? "수정 저장" : "DB에 저장"}
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* FAQs Tab */}
        {activeTab === "faqs" && (
          <>
            {/* FAQ List View */}
            {view === "list" && (
              <div className="bg-white border-4 border-black p-6" style={{ boxShadow: "8px 8px 0 black" }}>
                <h2 className="text-xl font-black uppercase mb-4 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5" /> Knowledge Log / FAQs ({faqs.length})
                </h2>
                {isLoading ? (
                  <p className="text-gray-500 py-8 text-center">로딩 중...</p>
                ) : faqs.length === 0 ? (
                  <p className="text-gray-500 py-8 text-center">등록된 FAQ가 없습니다.</p>
                ) : (
                  <div className="space-y-3">
                    {faqs.map((faq) => {
                      const Icon = categoryIcons[faq.category as keyof typeof categoryIcons] || HelpCircle;
                      return (
                        <div key={faq.id} className="border-2 border-black p-4 hover:bg-gray-50">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <Icon className="w-4 h-4" />
                                <span className="text-xs font-bold uppercase bg-gray-200 px-2 py-0.5">{faq.category}</span>
                                <button
                                  onClick={() => toggleFaqPublished(faq)}
                                  className="flex items-center gap-2 text-xs font-bold"
                                  title={faq.isPublished ? "클릭하여 비공개로 전환" : "클릭하여 공개 배포"}
                                >
                                  <div className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${faq.isPublished ? "bg-green-500" : "bg-gray-300"
                                    }`}>
                                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 flex items-center justify-center ${faq.isPublished ? "translate-x-6" : "translate-x-0.5"
                                      }`}>
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
                              <h3 className="font-bold text-lg mb-2">Q: {faq.question}</h3>
                              <p className="text-gray-600 text-sm line-clamp-2">A: {faq.answer}</p>
                              {faq.tags && faq.tags.length > 0 && (
                                <div className="flex gap-1 mt-2 flex-wrap">
                                  {faq.tags.map((tag) => (
                                    <span key={tag} className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5">#{tag}</span>
                                  ))}
                                </div>
                              )}
                              <p className="text-xs text-gray-400 mt-2">
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
                              <button onClick={() => handleEditFaq(faq)} className="p-2 border-2 border-black hover:bg-blue-100" title="수정">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleDeleteFaq(faq.id)} className="p-2 border-2 border-black hover:bg-red-100" title="삭제">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* FAQ Editor View */}
            {view === "editor" && (
              <div className="bg-white border-4 border-black p-6" style={{ boxShadow: "8px 8px 0 black" }}>
                <h2 className="text-xl font-black uppercase mb-4">
                  {editingFaq ? `FAQ 수정 (ID: ${editingFaq.id})` : "새 FAQ 작성"}
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold uppercase mb-1">카테고리 *</label>
                    <select
                      value={faqCategory}
                      onChange={(e) => setFaqCategory(e.target.value as "MARKETING" | "AI_TECH" | "DATA")}
                      className="w-full px-4 py-2 border-4 border-black focus:outline-none bg-white"
                    >
                      <option value="MARKETING">MARKETING</option>
                      <option value="AI_TECH">AI_TECH</option>
                      <option value="DATA">DATA</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold uppercase mb-1">질문 (Question) *</label>
                    <textarea
                      value={faqQuestion}
                      onChange={(e) => setFaqQuestion(e.target.value)}
                      className="w-full px-4 py-2 border-4 border-black focus:outline-none min-h-[100px]"
                      placeholder="자주 묻는 질문을 입력하세요..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold uppercase mb-1">답변 (Answer) * - Markdown 지원</label>
                    <MarkdownEditor
                      value={faqAnswer}
                      onChange={setFaqAnswer}
                      placeholder="답변을 마크다운으로 작성하세요..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold uppercase mb-1">난이도</label>
                      <select
                        className="w-full px-4 py-2 border-4 border-black focus:outline-none bg-white"
                        value={editingFaq?.difficulty || ""}
                        onChange={(e) => setEditingFaq((prev) => ({ ...prev, difficulty: e.target.value } as any))}
                      >
                        <option value="">선택하세요</option>
                        <option value="EASY">쉬움 (Easy)</option>
                        <option value="MEDIUM">보통 (Medium)</option>
                        <option value="HARD">어려움 (Hard)</option>
                        <option value="DOCS">공식문서 참고</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold uppercase mb-1">추천 연차</label>
                      <select
                        className="w-full px-4 py-2 border-4 border-black focus:outline-none bg-white"
                        value={editingFaq?.recommendedYear || ""}
                        onChange={(e) => setEditingFaq((prev) => ({ ...prev, recommendedYear: e.target.value } as any))}
                      >
                        <option value="">선택하세요</option>
                        <option value="JUNIOR">주니어 (1~3년차)</option>
                        <option value="MID">미들 (4~7년차)</option>
                        <option value="SENIOR">시니어 (8년차+)</option>
                        <option value="ALL">전체 연차</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold uppercase mb-1">참조 링크</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border-4 border-black focus:outline-none"
                      value={editingFaq?.referenceUrl || ""}
                      onChange={(e) => setEditingFaq((prev) => ({ ...prev, referenceUrl: e.target.value } as any))}
                      placeholder="https://example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold uppercase mb-1">참조 링크 제목 (선택)</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border-4 border-black focus:outline-none"
                      value={editingFaq?.referenceTitle || ""}
                      onChange={(e) => setEditingFaq((prev) => ({ ...prev, referenceTitle: e.target.value } as any))}
                      placeholder="링크 제목 입력 (미입력 시 URL 표시)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold uppercase mb-1">참조 링크</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border-4 border-black focus:outline-none"
                      value={editingFaq?.referenceUrl || ""}
                      onChange={(e) => setEditingFaq((prev) => ({ ...prev, referenceUrl: e.target.value } as any))}
                      placeholder="https://example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold uppercase mb-1">추천 포지션 (쉼표로 구분)</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border-4 border-black focus:outline-none"
                      value={recommendedPositionsInput}
                      onChange={(e) => setRecommendedPositionsInput(e.target.value)}
                      placeholder="예: 마케터, PM, 데이터 분석가"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold uppercase mb-1">기술 스택 (쉼표로 구분)</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border-4 border-black focus:outline-none"
                      value={techStackInput}
                      onChange={(e) => setTechStackInput(e.target.value)}
                      placeholder="예: Next.js, React, Tailwind"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold uppercase mb-1">태그 (쉼표 구분) - 양방향 추천 시스템 연동</label>
                    <input
                      type="text"
                      value={faqTagsInput}
                      onChange={(e) => setFaqTagsInput(e.target.value)}
                      className="w-full px-4 py-2 border-4 border-black focus:outline-none"
                      placeholder="예: AI, 마케팅, 데이터분석"
                    />
                    <p className="text-xs text-gray-500 mt-1">태그를 통해 관련 Post와 FAQ가 자동으로 연결됩니다.</p>
                  </div>

                  <button
                    onClick={handleSaveFaq}
                    disabled={isLoading}
                    className="w-full bg-green-600 text-white py-3 font-bold uppercase hover:bg-green-700 disabled:bg-gray-400 flex items-center justify-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    {isLoading ? "저장 중..." : editingFaq ? "수정 저장" : "DB에 저장"}
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Series Tab */}
        {activeTab === "series" && (
          <>
            {/* Series List View */}
            {view === "list" && (
              <div className="bg-white border-4 border-black p-6" style={{ boxShadow: "8px 8px 0 black" }}>
                <h2 className="text-xl font-black uppercase mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" /> Series ({seriesList.length})
                </h2>
                {isLoading ? (
                  <p className="text-gray-500 py-8 text-center">로딩 중...</p>
                ) : seriesList.length === 0 ? (
                  <p className="text-gray-500 py-8 text-center">등록된 시리즈가 없습니다.</p>
                ) : (
                  <div className="space-y-3">
                    {seriesList.map((s) => (
                      <div key={s.id} className="border-2 border-black p-4 hover:bg-gray-50">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <BookOpen className="w-4 h-4 text-purple-600" />
                              <span className="text-xs font-bold bg-purple-100 text-purple-700 px-2 py-0.5">{s.postCount}편</span>
                              <button
                                onClick={() => toggleSeriesPublished(s)}
                                className="flex items-center gap-2 text-xs font-bold"
                                title={s.isPublished ? "클릭하여 비공개로 전환" : "클릭하여 공개 배포"}
                              >
                                <div className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${s.isPublished ? "bg-green-500" : "bg-gray-300"
                                  }`}>
                                  <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 flex items-center justify-center ${s.isPublished ? "translate-x-6" : "translate-x-0.5"
                                    }`}>
                                    {s.isPublished ? (
                                      <Eye className="w-3 h-3 text-green-600" />
                                    ) : (
                                      <Lock className="w-3 h-3 text-gray-400" />
                                    )}
                                  </div>
                                </div>
                                <span className={s.isPublished ? "text-green-700" : "text-gray-500"}>
                                  {s.isPublished ? "공개" : "비공개"}
                                </span>
                              </button>
                            </div>
                            <h3 className="font-bold text-lg mb-1">{s.title}</h3>
                            <p className="text-sm text-gray-500 mb-2">/series/{s.slug}</p>
                            {s.description && (
                              <p className="text-sm text-gray-600 line-clamp-2 mb-2">{s.description}</p>
                            )}
                            {s.posts.length > 0 && (
                              <div className="text-xs text-gray-400 space-y-0.5">
                                {s.posts.slice(0, 3).map((post, idx) => (
                                  <div key={post.id}>{idx + 1}. {post.title}</div>
                                ))}
                                {s.posts.length > 3 && <div>+{s.posts.length - 3}개 더...</div>}
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <a href={`/series/${s.slug}`} target="_blank" className="p-2 border-2 border-black hover:bg-gray-100" title="보기">
                              <Eye className="w-4 h-4" />
                            </a>
                            <button onClick={() => handleEditSeries(s)} className="p-2 border-2 border-black hover:bg-blue-100" title="수정">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDeleteSeries(s.id)} className="p-2 border-2 border-black hover:bg-red-100" title="삭제">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Series Editor View */}
            {view === "editor" && (
              <div className="bg-white border-4 border-black p-6" style={{ boxShadow: "8px 8px 0 black" }}>
                <h2 className="text-xl font-black uppercase mb-4">
                  {editingSeries ? `시리즈 수정 (ID: ${editingSeries.id})` : "새 시리즈 만들기"}
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold uppercase mb-1">시리즈 제목 *</label>
                    <input
                      type="text"
                      value={seriesTitle}
                      onChange={(e) => setSeriesTitle(e.target.value)}
                      className="w-full px-4 py-2 border-4 border-black focus:outline-none"
                      placeholder="예: Next.js 완전 정복"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold uppercase mb-1">슬러그 (URL) *</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={seriesSlug}
                        onChange={(e) => setSeriesSlug(e.target.value)}
                        className="flex-1 px-4 py-2 border-4 border-black focus:outline-none"
                        placeholder="nextjs-complete-guide"
                      />
                      <button onClick={generateSeriesSlug} className="px-4 py-2 bg-gray-200 border-4 border-black font-bold text-sm hover:bg-gray-300">
                        자동생성
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">URL: /series/{seriesSlug || "..."}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-bold uppercase mb-1">설명</label>
                    <textarea
                      value={seriesDescription}
                      onChange={(e) => setSeriesDescription(e.target.value)}
                      className="w-full px-4 py-2 border-4 border-black focus:outline-none min-h-[100px]"
                      placeholder="시리즈에 대한 설명을 입력하세요..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold uppercase mb-1">
                      <ImageIcon className="w-4 h-4 inline mr-1" />
                      썸네일 이미지
                    </label>
                    <div className="flex items-center gap-3">
                      <label className="px-4 py-2 bg-purple-100 border-4 border-black font-bold text-sm hover:bg-purple-200 cursor-pointer flex items-center gap-2">
                        {isUploadingSeriesThumbnail ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            업로드 중...
                          </>
                        ) : (
                          <>
                            <ImageIcon className="w-4 h-4" />
                            이미지 선택
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleSeriesThumbnailUpload}
                          className="hidden"
                          disabled={isUploadingSeriesThumbnail}
                        />
                      </label>
                      {seriesThumbnailUrl && (
                        <button
                          type="button"
                          onClick={() => setSeriesThumbnailUrl("")}
                          className="text-xs text-red-600 hover:underline"
                        >
                          삭제
                        </button>
                      )}
                    </div>
                    {seriesThumbnailUrl && (
                      <div className="mt-3">
                        <img src={seriesThumbnailUrl} alt="썸네일 미리보기" className="h-32 object-contain border-4 border-black" />
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleSaveSeries}
                    disabled={isLoading}
                    className="w-full bg-purple-600 text-white py-3 font-bold uppercase hover:bg-purple-700 disabled:bg-gray-400 flex items-center justify-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    {isLoading ? "저장 중..." : editingSeries ? "수정 저장" : "시리즈 생성"}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
