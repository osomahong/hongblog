"use client";

import { useState, useEffect } from "react";
import { Save, Sparkles, Wand2, Loader2, ImageIcon, Check, Search, BookOpen } from "lucide-react";
import MarkdownEditor from "@/components/MarkdownEditor";
import SeoEditor, { SeoData } from "@/components/SeoEditor";

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
  createdAt: string;
  metaTitle: string | null;
  metaDescription: string | null;
  ogImage: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  canonicalUrl: string | null;
  noIndex: boolean;
};

type SeriesItem = {
  id: number;
  slug: string;
  title: string;
  postCount: number;
};

interface PostEditorProps {
  editingPost?: Post | null;
  seriesList: SeriesItem[];
  onSaved: () => void;
}

export function PostEditor({ editingPost, seriesList, onSaved }: PostEditorProps) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<"MARKETING" | "AI_TECH" | "DATA">("MARKETING");
  const [tagsInput, setTagsInput] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [selectedSeriesId, setSelectedSeriesId] = useState<number | null>(null);
  const [seriesOrder, setSeriesOrder] = useState<number | null>(null);
  const [seoData, setSeoData] = useState<SeoData>({
    metaTitle: "", metaDescription: "", ogImage: "", ogTitle: "", ogDescription: "", canonicalUrl: "", noIndex: false,
  });
  const [showSeoEditor, setShowSeoEditor] = useState(false);
  const [isGeneratingMetadata, setIsGeneratingMetadata] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (editingPost) {
      setTitle(editingPost.title);
      setSlug(editingPost.slug);
      setExcerpt(editingPost.excerpt || "");
      setContent(editingPost.content);
      setCategory(editingPost.category as any);
      setTagsInput(editingPost.tags?.join(", ") || "");
      setThumbnailUrl(editingPost.thumbnailUrl || "");
      setSelectedSeriesId(editingPost.seriesId);
      setSeriesOrder(editingPost.seriesOrder);
      setSeoData({
        metaTitle: editingPost.metaTitle || "",
        metaDescription: editingPost.metaDescription || "",
        ogImage: editingPost.ogImage || "",
        ogTitle: editingPost.ogTitle || "",
        ogDescription: editingPost.ogDescription || "",
        canonicalUrl: editingPost.canonicalUrl || "",
        noIndex: editingPost.noIndex || false,
      });
      setShowSeoEditor(false);
    }
  }, [editingPost]);

  const generateSlug = () => {
    const generated = title
      .toLowerCase()
      .replace(/[^a-z0-9가-힣\s-]/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 100);
    setSlug(generated || `post-${Date.now()}`);
  };

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

  const handleSave = async () => {
    if (!title || !slug || !content) {
      alert("제목, 슬러그, 내용을 모두 입력해주세요.");
      return;
    }
    setIsLoading(true);
    const postData = {
      id: editingPost?.id,
      title, slug,
      excerpt: excerpt || null,
      content, category,
      thumbnailUrl: thumbnailUrl || null,
      tags: tagsInput ? tagsInput.split(",").map((t) => t.trim()).filter(Boolean) : [],
      seriesId: selectedSeriesId,
      seriesOrder: seriesOrder,
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
        const { revalidateInsightPaths } = await import("@/lib/revalidate");
        await revalidateInsightPaths(slug, category);
        alert(editingPost ? "수정되었습니다!" : "저장되었습니다!");
        onSaved();
      } else {
        const data = await res.json();
        alert(data.error || "저장 실패");
      }
    } catch {
      alert("저장 중 오류 발생");
    }
    setIsLoading(false);
  };

  return (
    <div className="bg-white border-4 border-black p-6" style={{ boxShadow: "8px 8px 0 black" }}>
      <h2 className="text-xl font-black uppercase mb-4">
        {editingPost ? `글 수정 (ID: ${editingPost.id})` : "새 글 작성"}
      </h2>
      <div className="space-y-4">
        {/* COPY the EXACT JSX from lines 1007-1241 of page.tsx but replace handlers/state with local ones */}
        {/* The JSX is identical - all the form fields, AI metadata, SEO editor, save button */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold uppercase mb-1">제목 *</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2 border-4 border-black focus:outline-none" placeholder="글 제목" />
          </div>
          <div>
            <label className="block text-sm font-bold uppercase mb-1">카테고리 *</label>
            <select value={category} onChange={(e) => setCategory(e.target.value as any)} className="w-full px-4 py-2 border-4 border-black focus:outline-none bg-white">
              <option value="MARKETING">MARKETING</option>
              <option value="AI_TECH">AI_TECH</option>
              <option value="DATA">DATA</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold uppercase mb-1">슬러그 (URL) *</label>
          <div className="flex gap-2">
            <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} className="flex-1 px-4 py-2 border-4 border-black focus:outline-none" placeholder="url-slug" />
            <button onClick={generateSlug} className="px-4 py-2 bg-gray-200 border-4 border-black font-bold text-sm hover:bg-gray-300">자동생성</button>
          </div>
          <p className="text-xs text-gray-500 mt-1">URL: /insights/{slug || "..."}</p>
        </div>

        <div>
          <label className="block text-sm font-bold uppercase mb-1">요약 (Excerpt)</label>
          <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} className="w-full px-4 py-2 border-4 border-black focus:outline-none min-h-[80px]" placeholder="글 요약 (목록에 표시됨)" />
        </div>

        <div>
          <label className="block text-sm font-bold uppercase mb-1">태그 (쉼표 구분)</label>
          <input type="text" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} className="w-full px-4 py-2 border-4 border-black focus:outline-none" placeholder="예: AI, 마케팅, 데이터분석" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold uppercase mb-1">
              <BookOpen className="w-4 h-4 inline mr-1" />
              시리즈 (선택)
            </label>
            <select value={selectedSeriesId || ""} onChange={(e) => setSelectedSeriesId(e.target.value ? parseInt(e.target.value) : null)} className="w-full px-4 py-2 border-4 border-black focus:outline-none bg-white">
              <option value="">시리즈 없음</option>
              {seriesList.map((s) => (
                <option key={s.id} value={s.id}>{s.title} ({s.postCount}편)</option>
              ))}
            </select>
          </div>
          {selectedSeriesId && (
            <div>
              <label className="block text-sm font-bold uppercase mb-1">시리즈 내 순서</label>
              <input type="number" value={seriesOrder ?? ""} onChange={(e) => setSeriesOrder(e.target.value ? parseInt(e.target.value) : null)} className="w-full px-4 py-2 border-4 border-black focus:outline-none" placeholder="예: 1, 2, 3..." min={1} />
              <p className="text-xs text-gray-500 mt-1">숫자가 작을수록 앞에 표시됩니다.</p>
            </div>
          )}
        </div>

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
                  <button key={idx} type="button" onClick={() => handleThumbnailSelect(url)} className={`relative aspect-square border-4 overflow-hidden transition-all ${thumbnailUrl === url ? "border-blue-600 ring-2 ring-blue-300" : "border-gray-300 hover:border-black"}`}>
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
          <MarkdownEditor value={content} onChange={setContent} placeholder="## 제목&#10;&#10;본문 내용을 마크다운으로 작성하세요..." />
        </div>

        <div className="bg-gradient-to-r from-purple-100 to-blue-100 border-4 border-black p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-purple-600" />
                AI 메타데이터 자동 생성
              </h3>
              <p className="text-xs text-gray-600 mt-1">본문 내용을 분석하여 제목, 슬러그, 요약, 카테고리, 태그를 자동 생성합니다.</p>
            </div>
            <button type="button" onClick={handleGenerateMetadata} disabled={isGeneratingMetadata || content.length < 100} className="px-4 py-2 bg-purple-600 text-white border-4 border-black font-bold uppercase text-sm hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap">
              {isGeneratingMetadata ? (<><Loader2 className="w-4 h-4 animate-spin" />생성 중...</>) : (<><Sparkles className="w-4 h-4" />AI 생성</>)}
            </button>
          </div>
          {content.length < 100 && (
            <p className="text-xs text-orange-600 mt-2">⚠️ 본문을 최소 100자 이상 입력해야 AI 생성이 가능합니다. (현재: {content.length}자)</p>
          )}
        </div>

        <div className="border-t-4 border-black pt-4">
          <button type="button" onClick={() => setShowSeoEditor(!showSeoEditor)} className="flex items-center gap-2 px-4 py-2 bg-blue-100 border-4 border-black font-bold uppercase text-sm hover:bg-blue-200">
            <Search className="w-4 h-4" />
            {showSeoEditor ? "SEO 설정 접기" : "SEO 설정 열기"}
          </button>
        </div>

        {showSeoEditor && (
          <SeoEditor title={title} content={content} initialData={seoData} onChange={setSeoData} />
        )}

        <button onClick={handleSave} disabled={isLoading} className="w-full bg-black text-white py-3 font-bold uppercase hover:bg-gray-800 disabled:bg-gray-400 flex items-center justify-center gap-2">
          <Save className="w-5 h-5" />
          {isLoading ? "저장 중..." : editingPost ? "수정 저장" : "DB에 저장"}
        </button>
      </div>
    </div>
  );
}
