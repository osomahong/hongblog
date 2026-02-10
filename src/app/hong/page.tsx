"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { Lock, FileText, Plus, List, Loader2, BookOpen, Bot, GraduationCap, LogOut, Linkedin, Copy, X, HelpCircle, BookText } from "lucide-react";
import { LogManager } from "@/features/logs/components/LogManager";
import { PostManager } from "@/features/posts/components/PostManager";
import { PostEditor } from "@/features/posts/components/PostEditor";
import { FaqManager } from "@/features/faqs/components/FaqManager";
import { FaqEditor } from "@/features/faqs/components/FaqEditor";
import { SeriesManager } from "@/features/series/components/SeriesManager";
import { SeriesEditor } from "@/features/series/components/SeriesEditor";
import { CourseManager } from "@/features/classes/components/CourseManager";
import { CourseEditor } from "@/features/classes/components/CourseEditor";
import { ClassManager } from "@/features/classes/components/ClassManager";
import { ClassEditor } from "@/features/classes/components/ClassEditor";

export default function HongAdminPage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<"posts" | "faqs" | "logs" | "series" | "classes">("posts");
  const [view, setView] = useState<"list" | "editor">("list");

  // Data for cross-component needs
  const [seriesList, setSeriesList] = useState<any[]>([]);
  const [viewStats, setViewStats] = useState<{ post: Record<number, number>; faq: Record<number, number> }>({ post: {}, faq: {} });

  // Editing items (passed to Editor components)
  const [editingPost, setEditingPost] = useState<any>(null);
  const [editingFaq, setEditingFaq] = useState<any>(null);
  const [editingSeries, setEditingSeries] = useState<any>(null);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [editingClass, setEditingClass] = useState<any>(null);
  const [classesEditorMode, setClassesEditorMode] = useState<"course" | "class">("course");

  // llms.txt Generation state
  const [isGeneratingLlmsTxt, setIsGeneratingLlmsTxt] = useState(false);
  const [llmsTxtLastUpdated, setLlmsTxtLastUpdated] = useState<string | null>(null);

  // LinkedIn Summary state
  const [isGeneratingLinkedinSummary, setIsGeneratingLinkedinSummary] = useState<number | null>(null);
  const [linkedinSummary, setLinkedinSummary] = useState("");
  const [isLinkedinModalOpen, setIsLinkedinModalOpen] = useState(false);
  const [activePostForLinkedin, setActivePostForLinkedin] = useState<any>(null);
  const [activeCourseForLinkedin, setActiveCourseForLinkedin] = useState<any>(null);
  const [isGeneratingCourseLinkedinSummary, setIsGeneratingCourseLinkedinSummary] = useState<number | null>(null);

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
    await Promise.all([loadStats(), loadSeries()]);
  }, [loadStats, loadSeries]);

  useEffect(() => {
    if (status === "authenticated") {
      loadData();
    }
  }, [status, loadData]);

  const handleLogin = () => { signIn("google"); };
  const handleLogout = () => { signOut(); };

  const resetEditors = () => {
    setEditingPost(null);
    setEditingFaq(null);
    setEditingSeries(null);
    setEditingCourse(null);
    setEditingClass(null);
  };

  // llms.txt 생성
  const handleGenerateLlmsTxt = async () => {
    if (!confirm("llms.txt 파일을 생성하시겠습니까?\n\n현재 배포된 콘텐츠와 조회수 통계를 기반으로 최신 콘텐츠가 반영됩니다.")) {
      return;
    }
    setIsGeneratingLlmsTxt(true);
    try {
      const res = await fetch("/api/hong/seo/generate-llmstxt", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setLlmsTxtLastUpdated(new Date().toLocaleString("ko-KR"));
        let message = `✅ llms.txt 생성 완료!\n\n`;
        if (data.diff && (data.diff.added.length > 0 || data.diff.removed.length > 0)) {
          message += `🔍 변경 사항:\n`;
          if (data.diff.added.length > 0) {
            message += `\n[추가됨 (+${data.diff.added.length})]\n`;
            data.diff.added.forEach((item: any) => { message += `+ ${item.title}\n`; });
          }
          if (data.diff.removed.length > 0) {
            message += `\n[삭제됨 (-${data.diff.removed.length})]\n`;
            data.diff.removed.forEach((item: any) => { message += `- ${item.title}\n`; });
          }
        } else {
          message += `(변경된 내용이 없습니다)\n`;
        }
        message += `\n🔗 확인: ${data.previewUrl}`;
        alert(message);
      } else {
        const data = await res.json();
        alert(`❌ 생성 실패: ${data.error || "알 수 없는 오류"}`);
      }
    } catch (error) {
      console.error("llms.txt generation error:", error);
      alert("❌ llms.txt 생성 중 오류가 발생했습니다.");
    }
    setIsGeneratingLlmsTxt(false);
  };

  // LinkedIn Summary handlers
  const handleGenerateLinkedinSummary = async (post: any) => {
    setIsGeneratingLinkedinSummary(post.id);
    setActivePostForLinkedin(post);
    try {
      const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://redline-matrix.com";
      const postUrl = `${siteUrl}/insights/${post.slug}`;
      const res = await fetch("/api/hong/ai/generate-linkedin-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: post.title, content: post.content, url: postUrl }),
      });
      if (res.ok) {
        const data = await res.json();
        setLinkedinSummary(data.summary);
        setIsLinkedinModalOpen(true);
      } else {
        const data = await res.json();
        alert(data.error || "요약 생성 실패");
      }
    } catch {
      alert("요약 생성 중 오류 발생");
    }
    setIsGeneratingLinkedinSummary(null);
  };

  const handleGenerateCourseLinkedinSummary = async (course: any) => {
    setIsGeneratingCourseLinkedinSummary(course.id);
    setActiveCourseForLinkedin(course);
    setActivePostForLinkedin(null);
    try {
      const res = await fetch("/api/hong/ai/generate-course-linkedin-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: course.id }),
      });
      if (res.ok) {
        const data = await res.json();
        setLinkedinSummary(data.summary);
        setIsLinkedinModalOpen(true);
      } else {
        const data = await res.json();
        alert(data.error || "요약 생성 실패");
      }
    } catch {
      alert("요약 생성 중 오류 발생");
    }
    setIsGeneratingCourseLinkedinSummary(null);
  };

  const handleCopyLinkedinSummary = () => {
    navigator.clipboard.writeText(linkedinSummary);
    alert("클립보드에 복사되었습니다!");
  };

  // Loading State
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-black" />
      </div>
    );
  }

  // Login Screen
  if (status !== "authenticated") {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white border-4 border-black p-8 w-full max-w-md" style={{ boxShadow: "8px 8px 0 black" }}>
          <div className="flex items-center gap-3 mb-6">
            <Lock className="w-8 h-8" />
            <h1 className="text-2xl font-black uppercase">Admin Access</h1>
          </div>
          <p className="text-gray-600 mb-6">
            이 페이지는 관리자 전용입니다. 구글 계정으로 로그인하여 계속 진행하세요.
          </p>
          <button
            onClick={handleLogin}
            className="w-full bg-black text-white py-3 font-bold uppercase hover:bg-gray-800 transition flex items-center justify-center gap-2"
          >
            <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
            구글로 로그인하기
          </button>
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
              onClick={() => { setActiveTab("posts"); resetEditors(); setView("list"); }}
              className={`px-4 py-2 font-bold uppercase text-sm flex items-center gap-1 ${activeTab === "posts" ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"}`}
            >
              <FileText className="w-4 h-4" />
              Insights
            </button>
            <button
              onClick={() => { setActiveTab("faqs"); setView("list"); }}
              className={`px-4 py-2 font-bold uppercase text-sm flex items-center gap-1 ${activeTab === "faqs" ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"}`}
            >
              <HelpCircle className="w-4 h-4" />
              FAQs
            </button>
            <button
              onClick={() => { setActiveTab("logs"); setView("list"); }}
              className={`px-4 py-2 font-bold uppercase text-sm flex items-center gap-1 ${activeTab === "logs" ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"}`}
            >
              <BookText className="w-4 h-4" />
              Logs
            </button>
            <button
              onClick={() => { setActiveTab("series"); setView("list"); }}
              className={`px-4 py-2 font-bold uppercase text-sm flex items-center gap-1 ${activeTab === "series" ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"}`}
            >
              <BookOpen className="w-4 h-4" />
              Series
            </button>
            <button
              onClick={() => { setActiveTab("classes"); setView("list"); }}
              className={`px-4 py-2 font-bold uppercase text-sm flex items-center gap-1 ${activeTab === "classes" ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"}`}
            >
              <GraduationCap className="w-4 h-4" />
              Classes
            </button>
            <a
              href="/hong/life"
              className="px-4 py-2 font-bold uppercase text-sm flex items-center gap-1 bg-orange-600 hover:bg-orange-500"
            >
              ☕ Life Log
            </a>
            <div className="w-px bg-gray-600 mx-2" />
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold">{session?.user?.name}</p>
                <p className="text-[10px] text-gray-400">{session?.user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 bg-red-600 hover:bg-red-700 text-white rounded transition"
                title="로그아웃"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
            <div className="w-px bg-gray-600 mx-2" />
            <button
              onClick={() => { resetEditors(); setView("list"); }}
              className={`px-4 py-2 font-bold uppercase text-sm flex items-center gap-1 ${view === "list" ? "bg-white text-black" : "bg-gray-700"}`}
            >
              <List className="w-4 h-4" /> 목록
            </button>
            <button
              onClick={() => { resetEditors(); setView("editor"); }}
              className={`px-4 py-2 font-bold uppercase text-sm flex items-center gap-1 ${view === "editor" ? "bg-white text-black" : "bg-gray-700"}`}
            >
              <Plus className="w-4 h-4" /> 새 글
            </button>
            <div className="w-px bg-gray-600 mx-2" />
            {/* llms.txt 생성 버튼 */}
            <button
              onClick={handleGenerateLlmsTxt}
              disabled={isGeneratingLlmsTxt}
              className="px-4 py-2 font-bold uppercase text-sm flex items-center gap-1 bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-500 disabled:cursor-not-allowed"
              title="llms.txt 파일 생성 (조회수 기반 인기 콘텐츠 반영)"
            >
              {isGeneratingLlmsTxt ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> 생성중...
                </>
              ) : (
                <>
                  <Bot className="w-4 h-4" /> llms.txt
                </>
              )}
            </button>
            {llmsTxtLastUpdated && (
              <span className="text-xs text-gray-300 self-center">
                마지막 생성: {llmsTxtLastUpdated}
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 sm:p-6">

        {/* Posts Tab */}
        {activeTab === "posts" && (
          <>
            {view === "list" && (
              <PostManager
                viewStats={viewStats}
                onEdit={(post: any) => { setEditingPost(post); setView("editor"); }}
                onLinkedInSummary={(post: any) => handleGenerateLinkedinSummary(post)}
                isGeneratingLinkedinSummary={isGeneratingLinkedinSummary}
              />
            )}
            {view === "editor" && (
              <PostEditor
                editingPost={editingPost}
                seriesList={seriesList}
                onSaved={() => { setEditingPost(null); setView("list"); }}
              />
            )}
          </>
        )}

        {/* FAQs Tab */}
        {activeTab === "faqs" && (
          <>
            {view === "list" && (
              <FaqManager
                viewStats={viewStats}
                onEdit={(faq: any) => { setEditingFaq(faq); setView("editor"); }}
              />
            )}
            {view === "editor" && (
              <FaqEditor
                editingFaq={editingFaq}
                onSaved={() => { setEditingFaq(null); setView("list"); }}
              />
            )}
          </>
        )}

        {/* Logs Tab */}
        {activeTab === "logs" && (
          <LogManager viewStats={{ log: {} }} />
        )}

        {/* Series Tab */}
        {activeTab === "series" && (
          <>
            {view === "list" && (
              <SeriesManager
                onEdit={(series: any) => { setEditingSeries(series); setView("editor"); }}
              />
            )}
            {view === "editor" && (
              <SeriesEditor
                editingSeries={editingSeries}
                onSaved={() => { setEditingSeries(null); setView("list"); loadSeries(); }}
              />
            )}
          </>
        )}

        {/* Classes Tab */}
        {activeTab === "classes" && (
          <>
            {view === "list" && (
              <div className="space-y-6">
                <CourseManager
                  onEdit={(course: any) => { setEditingCourse(course); setView("editor"); }}
                  onLinkedInSummary={(course: any) => handleGenerateCourseLinkedinSummary(course)}
                  isGeneratingLinkedinSummary={isGeneratingCourseLinkedinSummary}
                />
                <ClassManager
                  onEdit={(cls: any) => { setEditingClass(cls); setView("editor"); }}
                />
              </div>
            )}
            {view === "editor" && (
              <div className="bg-white border-4 border-black p-6" style={{ boxShadow: "8px 8px 0 black" }}>
                <h2 className="text-2xl font-black uppercase mb-6">
                  {editingCourse ? "Course 수정" : editingClass ? "Class 수정" : "새 콘텐츠 생성"}
                </h2>

                {/* 타입 선택 (새로 생성 시에만) */}
                {!editingCourse && !editingClass && (
                  <div className="mb-6 flex gap-4">
                    <button
                      onClick={() => setClassesEditorMode("course")}
                      className={`flex-1 py-3 font-bold uppercase border-4 border-black ${classesEditorMode === "course" ? "bg-green-500 text-white" : "bg-white hover:bg-gray-50"}`}
                    >
                      <BookOpen className="w-5 h-5 inline mr-2" />
                      Course 생성
                    </button>
                    <button
                      onClick={() => setClassesEditorMode("class")}
                      className={`flex-1 py-3 font-bold uppercase border-4 border-black ${classesEditorMode === "class" ? "bg-blue-500 text-white" : "bg-white hover:bg-gray-50"}`}
                    >
                      <GraduationCap className="w-5 h-5 inline mr-2" />
                      Class 생성
                    </button>
                  </div>
                )}

                {(editingCourse || (!editingClass && classesEditorMode === "course")) && (
                  <CourseEditor
                    editingCourse={editingCourse}
                    onSaved={() => { setEditingCourse(null); setView("list"); }}
                  />
                )}

                {(editingClass || (!editingCourse && classesEditorMode === "class")) && (
                  <ClassEditor
                    editingClass={editingClass}
                    onSaved={() => { setEditingClass(null); setView("list"); }}
                  />
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* LinkedIn Summary Modal */}
      {isLinkedinModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white border-4 border-black w-full max-w-2xl overflow-hidden" style={{ boxShadow: "12px 12px 0 black" }}>
            <div className="bg-black text-white p-4 flex items-center justify-between">
              <h3 className="font-black uppercase flex items-center gap-2">
                <Linkedin className="w-5 h-5" /> LinkedIn Summary
              </h3>
              <button
                onClick={() => setIsLinkedinModalOpen(false)}
                className="hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <p className="text-sm font-bold text-gray-500 mb-2 uppercase">
                  {activeCourseForLinkedin ? "Target Course:" : "Target Post:"}
                </p>
                <p className="font-bold">
                  {activeCourseForLinkedin ? activeCourseForLinkedin.title : activePostForLinkedin?.title}
                </p>
              </div>
              <div className="relative">
                <textarea
                  readOnly
                  value={linkedinSummary}
                  className="w-full h-80 p-4 border-4 border-black focus:outline-none bg-gray-50 font-sans text-sm leading-relaxed"
                />
                <button
                  onClick={handleCopyLinkedinSummary}
                  className="absolute top-4 right-4 p-2 bg-white border-2 border-black hover:bg-gray-100 shadow-[2px_2px_0_black] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
                  title="Copy to clipboard"
                >
                  <Copy className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setIsLinkedinModalOpen(false)}
                  className="px-6 py-2 border-4 border-black font-black uppercase hover:bg-gray-100"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
