"use client";

import { useState } from "react";
import { Sparkles, Loader2, Tag, FileText } from "lucide-react";
import { NeoCard, NeoCardHeader, NeoCardTitle, NeoCardContent } from "@/components/neo";
import { NeoButton } from "@/components/neo";
import { NeoInput } from "@/components/neo";
import { NeoBadge } from "@/components/neo";
import { generateTagsAction } from "./actions";

export default function AdminPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [generatedTags, setGeneratedTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateTags = async () => {
    setIsLoading(true);
    setError(null);
    setGeneratedTags([]);

    const result = await generateTagsAction(content);

    if (result.success && result.tags) {
      setGeneratedTags(result.tags);
    } else {
      setError(result.error || "알 수 없는 오류가 발생했습니다.");
    }

    setIsLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
      {/* Header */}
      <section className="mb-6 sm:mb-8">
        <div className="bg-black border-4 border-black neo-shadow-lg p-4 sm:p-6 -rotate-1">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase text-white tracking-tighter flex items-center gap-2 sm:gap-3">
            <FileText className="w-6 h-6 sm:w-8 sm:h-8" />
            Admin - Post Editor
          </h1>
          <p className="text-sm sm:text-base text-white/80 mt-2">
            AI 기반 태그 자동 생성 기능을 테스트해보세요
          </p>
        </div>
      </section>

      {/* Editor Form */}
      <NeoCard className="mb-4 sm:mb-6 p-4 sm:p-6">
        <NeoCardHeader>
          <NeoCardTitle className="text-lg sm:text-2xl">새 글 작성</NeoCardTitle>
        </NeoCardHeader>
        <NeoCardContent className="space-y-4 sm:space-y-6">
          {/* Title */}
          <div>
            <label className="block text-xs sm:text-sm font-bold uppercase mb-2">
              제목
            </label>
            <NeoInput
              type="text"
              placeholder="글 제목을 입력하세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-sm sm:text-base py-2.5 sm:py-3"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-xs sm:text-sm font-bold uppercase mb-2">
              본문 내용
            </label>
            <textarea
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border-4 border-black neo-shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary transition-shadow min-h-[200px] sm:min-h-[300px] resize-y text-sm sm:text-base"
              placeholder="글 내용을 입력하세요. AI가 내용을 분석하여 관련 태그를 추천합니다."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {content.length}자 입력됨 (최소 50자 필요)
            </p>
          </div>

          {/* Generate Tags Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <NeoButton
              variant="accent"
              onClick={handleGenerateTags}
              disabled={isLoading || content.length < 50}
              className="w-full sm:w-auto text-sm sm:text-base"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  분석 중...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI 태그 자동 생성
                </>
              )}
            </NeoButton>
            <span className="text-xs sm:text-sm text-muted-foreground">
              Google Gemini 1.5 Flash 사용
            </span>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border-4 border-red-500 p-3 sm:p-4 text-red-700 font-bold text-sm sm:text-base">
              {error}
            </div>
          )}

          {/* Generated Tags */}
          {generatedTags.length > 0 && (
            <div className="bg-accent border-4 border-black p-3 sm:p-4 neo-shadow">
              <h3 className="font-bold uppercase flex items-center gap-2 mb-2 sm:mb-3 text-sm sm:text-base">
                <Tag className="w-4 h-4" />
                AI 추천 태그
              </h3>
              <div className="flex flex-wrap gap-2">
                {generatedTags.map((tag, index) => (
                  <NeoBadge key={index} variant="default">
                    #{tag}
                  </NeoBadge>
                ))}
              </div>
            </div>
          )}
        </NeoCardContent>
      </NeoCard>

      {/* Info Card */}
      <NeoCard className="bg-gray-100 rotate-1 p-4 sm:p-6">
        <NeoCardContent>
          <h3 className="font-bold mb-2 text-sm sm:text-base">💡 사용 방법</h3>
          <ul className="text-xs sm:text-sm text-muted-foreground space-y-1">
            <li>1. 글 제목과 본문을 입력합니다.</li>
            <li>2. &quot;AI 태그 자동 생성&quot; 버튼을 클릭합니다.</li>
            <li>3. AI가 본문을 분석하여 관련 태그 3개를 추천합니다.</li>
            <li>4. 추천된 태그를 검토하고 필요시 수정합니다.</li>
          </ul>
          <p className="text-xs text-muted-foreground mt-3 sm:mt-4 border-t pt-3 sm:pt-4">
            ⚠️ 이 기능을 사용하려면 .env.local에 GOOGLE_AI_API_KEY가 설정되어 있어야 합니다.
          </p>
        </NeoCardContent>
      </NeoCard>
    </div>
  );
}
