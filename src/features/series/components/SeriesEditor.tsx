"use client";

import { useState, useEffect } from "react";
import { Save, ImageIcon, Loader2 } from "lucide-react";

type Series = {
  id?: number;
  slug?: string;
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  isPublished?: boolean;
};

interface SeriesEditorProps {
  editingSeries?: Series | null;
  onSaved: () => void;
}

export function SeriesEditor({ editingSeries, onSaved }: SeriesEditorProps) {
  const [seriesTitle, setSeriesTitle] = useState("");
  const [seriesSlug, setSeriesSlug] = useState("");
  const [seriesDescription, setSeriesDescription] = useState("");
  const [seriesThumbnailUrl, setSeriesThumbnailUrl] = useState("");
  const [isUploadingSeriesThumbnail, setIsUploadingSeriesThumbnail] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (editingSeries) {
      setSeriesTitle(editingSeries.title);
      setSeriesSlug(editingSeries.slug || "");
      setSeriesDescription(editingSeries.description || "");
      setSeriesThumbnailUrl(editingSeries.thumbnailUrl || "");
    }
  }, [editingSeries]);

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

  const handleSave = async () => {
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
        const { revalidateSeriesPaths } = await import("@/lib/revalidate");
        await revalidateSeriesPaths(seriesSlug);
        alert(editingSeries ? "수정되었습니다!" : "저장되었습니다!");
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
          onClick={handleSave}
          disabled={isLoading}
          className="w-full bg-purple-600 text-white py-3 font-bold uppercase hover:bg-purple-700 disabled:bg-gray-400 flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" />
          {isLoading ? "저장 중..." : editingSeries ? "수정 저장" : "시리즈 생성"}
        </button>
      </div>
    </div>
  );
}
