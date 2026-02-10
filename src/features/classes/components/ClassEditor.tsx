"use client";

import { useState, useEffect, useCallback } from "react";
import { Save, Search } from "lucide-react";
import MarkdownEditor from "@/components/MarkdownEditor";
import SeoEditor, { SeoData } from "@/components/SeoEditor";

type CourseInfo = {
  id: number;
  slug: string;
  title: string;
};

type ClassItem = {
  id?: number;
  slug?: string;
  term: string;
  definition: string;
  content: string;
  category: string;
  courseId: number | null;
  orderInCourse: number | null;
  difficulty: string | null;
  tags: string[];
  isPublished: boolean;
  metaTitle?: string | null;
  metaDescription?: string | null;
  ogImage?: string | null;
  ogTitle?: string | null;
  ogDescription?: string | null;
  canonicalUrl?: string | null;
  noIndex?: boolean;
};

interface ClassEditorProps {
  editingClass?: ClassItem | null;
  onSaved: () => void;
}

export function ClassEditor({ editingClass, onSaved }: ClassEditorProps) {
  const [classTerm, setClassTerm] = useState("");
  const [classSlug, setClassSlug] = useState("");
  const [classDefinition, setClassDefinition] = useState("");
  const [classContent, setClassContent] = useState("");
  const [classCategory, setClassCategory] = useState<"MARKETING" | "AI_TECH" | "DATA">("AI_TECH");
  const [classCourseId, setClassCourseId] = useState<number | null>(null);
  const [classOrderInCourse, setClassOrderInCourse] = useState<number | null>(null);
  const [classDifficulty, setClassDifficulty] = useState<"BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "">("BEGINNER");
  const [classTagsInput, setClassTagsInput] = useState("");
  const [classIsPublished, setClassIsPublished] = useState(true);
  const [classSeoData, setClassSeoData] = useState<SeoData>({
    metaTitle: "", metaDescription: "", ogImage: "", ogTitle: "", ogDescription: "", canonicalUrl: "", noIndex: false,
  });
  const [showClassSeoEditor, setShowClassSeoEditor] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [courses, setCourses] = useState<CourseInfo[]>([]);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = useCallback(async () => {
    try {
      const res = await fetch("/api/hong/courses?includeUnpublished=true");
      if (res.ok) {
        const data = await res.json();
        setCourses(data);
      }
    } catch {
      console.error("Failed to load courses");
    }
  }, []);

  useEffect(() => {
    if (editingClass) {
      setClassTerm(editingClass.term);
      setClassSlug(editingClass.slug || "");
      setClassDefinition(editingClass.definition);
      setClassContent(editingClass.content);
      setClassCategory(editingClass.category as any);
      setClassCourseId(editingClass.courseId);
      setClassOrderInCourse(editingClass.orderInCourse || null);
      setClassDifficulty((editingClass.difficulty as any) || "BEGINNER");
      setClassTagsInput(editingClass.tags?.join(", ") || "");
      setClassIsPublished(editingClass.isPublished);
      setClassSeoData({
        metaTitle: editingClass.metaTitle || "",
        metaDescription: editingClass.metaDescription || "",
        ogImage: editingClass.ogImage || "",
        ogTitle: editingClass.ogTitle || "",
        ogDescription: editingClass.ogDescription || "",
        canonicalUrl: editingClass.canonicalUrl || "",
        noIndex: editingClass.noIndex || false,
      });
    }
  }, [editingClass]);

  const handleSave = async () => {
    if (!classTerm || !classSlug || !classDefinition || !classContent) {
      alert("필수 항목을 모두 입력해주세요.");
      return;
    }
    setIsLoading(true);
    const classData = {
      id: editingClass?.id,
      slug: classSlug,
      term: classTerm,
      definition: classDefinition,
      content: classContent,
      category: classCategory,
      courseId: classCourseId,
      orderInCourse: classOrderInCourse,
      difficulty: classDifficulty || null,
      tagNames: classTagsInput ? classTagsInput.split(",").map((t) => t.trim()).filter(Boolean) : [],
      isPublished: classIsPublished,
      metaTitle: classSeoData.metaTitle || null,
      metaDescription: classSeoData.metaDescription || null,
      ogImage: classSeoData.ogImage || null,
      ogTitle: classSeoData.ogTitle || null,
      ogDescription: classSeoData.ogDescription || null,
      canonicalUrl: classSeoData.canonicalUrl || null,
      noIndex: classSeoData.noIndex || false,
    };
    try {
      const res = await fetch("/api/hong/classes", {
        method: editingClass?.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(classData),
      });
      if (res.ok) {
        alert(editingClass?.id ? "수정되었습니다!" : "생성되었습니다!");
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
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold uppercase mb-1">용어 (Term) *</label>
          <input
            type="text"
            value={classTerm}
            onChange={(e) => setClassTerm(e.target.value)}
            className="w-full px-4 py-2 border-4 border-black focus:outline-none"
            placeholder="HTML"
          />
        </div>
        <div>
          <label className="block text-sm font-bold uppercase mb-1">슬러그 (Slug) *</label>
          <input
            type="text"
            value={classSlug}
            onChange={(e) => setClassSlug(e.target.value)}
            className="w-full px-4 py-2 border-4 border-black focus:outline-none"
            placeholder="html"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold uppercase mb-1">정의 (Definition) *</label>
        <textarea
          value={classDefinition}
          onChange={(e) => setClassDefinition(e.target.value)}
          className="w-full px-4 py-2 border-4 border-black focus:outline-none min-h-[80px]"
          placeholder="간단한 정의 (1-2문장)"
        />
      </div>

      <div>
        <label className="block text-sm font-bold uppercase mb-2">내용 (Markdown) *</label>
        <MarkdownEditor
          value={classContent}
          onChange={setClassContent}
          placeholder="# 제목&#10;&#10;상세 내용을 마크다운으로 작성하세요..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-bold uppercase mb-1">카테고리 *</label>
          <select
            value={classCategory}
            onChange={(e) => setClassCategory(e.target.value as any)}
            className="w-full px-4 py-2 border-4 border-black focus:outline-none bg-white"
          >
            <option value="MARKETING">마케팅</option>
            <option value="AI_TECH">AI & Tech</option>
            <option value="DATA">데이터</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold uppercase mb-1">Course</label>
          <select
            value={classCourseId || ""}
            onChange={(e) => setClassCourseId(e.target.value ? parseInt(e.target.value) : null)}
            className="w-full px-4 py-2 border-4 border-black focus:outline-none bg-white"
          >
            <option value="">없음</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title} (ID: {c.id})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold uppercase mb-1">난이도</label>
          <select
            value={classDifficulty}
            onChange={(e) => setClassDifficulty(e.target.value as any)}
            className="w-full px-4 py-2 border-4 border-black focus:outline-none bg-white"
          >
            <option value="BEGINNER">초급</option>
            <option value="INTERMEDIATE">중급</option>
            <option value="ADVANCED">고급</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold uppercase mb-1">Course 내 순서</label>
          <input
            type="number"
            value={classOrderInCourse || ""}
            onChange={(e) => setClassOrderInCourse(e.target.value ? parseInt(e.target.value) : null)}
            className="w-full px-4 py-2 border-4 border-black focus:outline-none"
            placeholder="1"
          />
        </div>
        <div>
          <label className="block text-sm font-bold uppercase mb-1">태그 (쉼표 구분)</label>
          <input
            type="text"
            value={classTagsInput}
            onChange={(e) => setClassTagsInput(e.target.value)}
            className="w-full px-4 py-2 border-4 border-black focus:outline-none"
            placeholder="HTML, 웹개발"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="classPublished"
          checked={classIsPublished}
          onChange={(e) => setClassIsPublished(e.target.checked)}
          className="w-5 h-5 border-2 border-black"
        />
        <label htmlFor="classPublished" className="font-bold cursor-pointer">공개 배포</label>
      </div>

      {/* SEO Settings */}
      <div className="border-t-4 border-black pt-4">
        <button
          type="button"
          onClick={() => setShowClassSeoEditor(!showClassSeoEditor)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-100 border-4 border-black font-bold uppercase text-sm hover:bg-blue-200"
        >
          <Search className="w-4 h-4" />
          {showClassSeoEditor ? "SEO 설정 접기" : "SEO 설정 열기"}
        </button>
      </div>

      {showClassSeoEditor && (
        <SeoEditor
          title={classTerm}
          content={classContent}
          initialData={{
            ...classSeoData,
            metaTitle: classSeoData.metaTitle || (
              classCourseId
                ? `${classTerm} | ${courses.find((c) => c.id === classCourseId)?.title || "강의"}`
                : classTerm
            ),
          }}
          onChange={setClassSeoData}
          urlPath={
            classCourseId && courses.find((c) => c.id === classCourseId)
              ? `/class/${courses.find((c) => c.id === classCourseId)?.slug}/${classSlug || "your-slug"}`
              : `/class/-/${classSlug || "your-slug"}`
          }
        />
      )}

      <button
        onClick={handleSave}
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-3 font-bold uppercase hover:bg-blue-700 disabled:bg-gray-400 flex items-center justify-center gap-2"
      >
        <Save className="w-5 h-5" />
        {isLoading ? "저장 중..." : editingClass?.id ? "수정 저장" : "Class 생성"}
      </button>
    </div>
  );
}
