"use client";

import { useState, useEffect } from "react";
import { Save } from "lucide-react";

type Course = {
  id?: number;
  slug?: string;
  title: string;
  description: string | null;
  category: string;
  difficulty: string | null;
  isPublished: boolean;
};

interface CourseEditorProps {
  editingCourse?: Course | null;
  onSaved: () => void;
}

export function CourseEditor({ editingCourse, onSaved }: CourseEditorProps) {
  const [courseTitle, setCourseTitle] = useState("");
  const [courseSlug, setCourseSlug] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [courseCategory, setCourseCategory] = useState<"MARKETING" | "AI_TECH" | "DATA">("AI_TECH");
  const [courseDifficulty, setCourseDifficulty] = useState<"BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "">("BEGINNER");
  const [courseIsPublished, setCourseIsPublished] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (editingCourse) {
      setCourseTitle(editingCourse.title);
      setCourseSlug(editingCourse.slug || "");
      setCourseDescription(editingCourse.description || "");
      setCourseCategory(editingCourse.category as any);
      setCourseDifficulty((editingCourse.difficulty as any) || "BEGINNER");
      setCourseIsPublished(editingCourse.isPublished);
    }
  }, [editingCourse]);

  const handleSave = async () => {
    if (!courseTitle || !courseSlug) {
      alert("제목과 슬러그를 입력해주세요.");
      return;
    }
    setIsLoading(true);
    const courseData = {
      id: editingCourse?.id,
      title: courseTitle,
      slug: courseSlug,
      description: courseDescription || null,
      category: courseCategory,
      difficulty: courseDifficulty || null,
      isPublished: courseIsPublished,
    };
    try {
      const res = await fetch("/api/hong/courses", {
        method: editingCourse?.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(courseData),
      });
      if (res.ok) {
        const { revalidateCoursePaths } = await import("@/lib/revalidate");
        await revalidateCoursePaths(courseSlug);
        alert(editingCourse?.id ? "수정되었습니다!" : "생성되었습니다!");
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
          <label className="block text-sm font-bold uppercase mb-1">제목 (Title) *</label>
          <input
            type="text"
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
            className="w-full px-4 py-2 border-4 border-black focus:outline-none"
            placeholder="HTML 기초"
          />
        </div>
        <div>
          <label className="block text-sm font-bold uppercase mb-1">슬러그 (Slug) *</label>
          <input
            type="text"
            value={courseSlug}
            onChange={(e) => setCourseSlug(e.target.value)}
            className="w-full px-4 py-2 border-4 border-black focus:outline-none"
            placeholder="html-basics"
          />
          <p className="text-xs text-gray-500 mt-1">URL: /class/{courseSlug || "..."}</p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold uppercase mb-1">설명 (Description)</label>
        <textarea
          value={courseDescription}
          onChange={(e) => setCourseDescription(e.target.value)}
          className="w-full px-4 py-2 border-4 border-black focus:outline-none min-h-[100px]"
          placeholder="강의 설명"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold uppercase mb-1">카테고리 *</label>
          <select
            value={courseCategory}
            onChange={(e) => setCourseCategory(e.target.value as any)}
            className="w-full px-4 py-2 border-4 border-black focus:outline-none bg-white"
          >
            <option value="MARKETING">마케팅</option>
            <option value="AI_TECH">AI & Tech</option>
            <option value="DATA">데이터</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold uppercase mb-1">난이도</label>
          <select
            value={courseDifficulty}
            onChange={(e) => setCourseDifficulty(e.target.value as any)}
            className="w-full px-4 py-2 border-4 border-black focus:outline-none bg-white"
          >
            <option value="BEGINNER">초급</option>
            <option value="INTERMEDIATE">중급</option>
            <option value="ADVANCED">고급</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="coursePublished"
          checked={courseIsPublished}
          onChange={(e) => setCourseIsPublished(e.target.checked)}
          className="w-5 h-5 border-2 border-black"
        />
        <label htmlFor="coursePublished" className="font-bold cursor-pointer">공개 배포</label>
      </div>

      <button
        onClick={handleSave}
        disabled={isLoading}
        className="w-full bg-green-600 text-white py-3 font-bold uppercase hover:bg-green-700 disabled:bg-gray-400 flex items-center justify-center gap-2"
      >
        <Save className="w-5 h-5" />
        {isLoading ? "저장 중..." : editingCourse?.id ? "수정 저장" : "Course 생성"}
      </button>
    </div>
  );
}
