"use client";

import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import MarkdownEditor from "@/components/MarkdownEditor";

type Faq = {
  id?: number;
  slug?: string;
  question: string;
  answer: string;
  category: string;
  isPublished?: boolean;
  tags: string[];
  recommendedYear?: string | null;
  recommendedPositions?: string[] | null;
  difficulty?: string | null;
  referenceUrl?: string | null;
  referenceTitle?: string | null;
  techStack?: string[] | null;
};

interface FaqEditorProps {
  editingFaq?: Faq | null;
  onSaved: () => void;
}

export function FaqEditor({ editingFaq, onSaved }: FaqEditorProps) {
  const [faqQuestion, setFaqQuestion] = useState("");
  const [faqAnswer, setFaqAnswer] = useState("");
  const [faqCategory, setFaqCategory] = useState<"MARKETING" | "AI_TECH" | "DATA">("MARKETING");
  const [faqTagsInput, setFaqTagsInput] = useState("");
  const [recommendedPositionsInput, setRecommendedPositionsInput] = useState("");
  const [techStackInput, setTechStackInput] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [recommendedYear, setRecommendedYear] = useState("");
  const [referenceUrl, setReferenceUrl] = useState("");
  const [referenceTitle, setReferenceTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (editingFaq) {
      setFaqQuestion(editingFaq.question);
      setFaqAnswer(editingFaq.answer);
      setFaqCategory(editingFaq.category as any);
      setFaqTagsInput(editingFaq.tags?.join(", ") || "");
      setRecommendedPositionsInput((editingFaq as any).recommendedPositions?.join(", ") || "");
      setTechStackInput((editingFaq as any).techStack?.join(", ") || "");
      setDifficulty(editingFaq.difficulty || "");
      setRecommendedYear(editingFaq.recommendedYear || "");
      setReferenceUrl(editingFaq.referenceUrl || "");
      setReferenceTitle(editingFaq.referenceTitle || "");
    }
  }, [editingFaq]);

  const handleSave = async () => {
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
      recommendedYear: recommendedYear || null,
      recommendedPositions: recommendedPositionsInput ? recommendedPositionsInput.split(",").map((t) => t.trim()).filter(Boolean) : [],
      difficulty: difficulty || null,
      referenceUrl: referenceUrl || null,
      referenceTitle: referenceTitle || null,
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
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
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
              value={recommendedYear}
              onChange={(e) => setRecommendedYear(e.target.value)}
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
            value={referenceUrl}
            onChange={(e) => setReferenceUrl(e.target.value)}
            placeholder="https://example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-bold uppercase mb-1">참조 링크 제목 (선택)</label>
          <input
            type="text"
            className="w-full px-4 py-2 border-4 border-black focus:outline-none"
            value={referenceTitle}
            onChange={(e) => setReferenceTitle(e.target.value)}
            placeholder="링크 제목 입력 (미입력 시 URL 표시)"
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
          onClick={handleSave}
          disabled={isLoading}
          className="w-full bg-green-600 text-white py-3 font-bold uppercase hover:bg-green-700 disabled:bg-gray-400 flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" />
          {isLoading ? "저장 중..." : editingFaq ? "수정 저장" : "DB에 저장"}
        </button>
      </div>
    </div>
  );
}
