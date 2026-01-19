"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Image as ImageIcon,
  Link2,
  Eye,
  EyeOff,
  Sparkles,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { NeoCard, NeoCardHeader, NeoCardTitle, NeoCardContent } from "@/components/neo";
import { NeoButton } from "@/components/neo";
import { NeoInput } from "@/components/neo";

export interface SeoData {
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
  ogTitle: string;
  ogDescription: string;
  canonicalUrl: string;
  noIndex: boolean;
}

interface SeoCheck {
  id: string;
  label: string;
  passed: boolean;
  message: string;
  importance: "high" | "medium" | "low";
}

interface SeoAnalysisResult {
  score: number;
  checks: SeoCheck[];
  suggestions: string[];
}

interface SeoEditorProps {
  title: string;
  content: string;
  initialData?: Partial<SeoData>;
  onChange: (data: SeoData) => void;
  urlPath?: string; // 커스텀 URL 경로 (예: /class/course-slug/class-slug)
}

export function SeoEditor({ title, content, initialData, onChange, urlPath = "/insights/your-slug" }: SeoEditorProps) {
  const [seoData, setSeoData] = useState<SeoData>({
    metaTitle: initialData?.metaTitle || "",
    metaDescription: initialData?.metaDescription || "",
    ogImage: initialData?.ogImage || "",
    ogTitle: initialData?.ogTitle || "",
    ogDescription: initialData?.ogDescription || "",
    canonicalUrl: initialData?.canonicalUrl || "",
    noIndex: initialData?.noIndex || false,
  });

  const [analysis, setAnalysis] = useState<SeoAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const updateSeoData = useCallback((updates: Partial<SeoData>) => {
    setSeoData(prev => ({ ...prev, ...updates }));
  }, []);

  // seoData 변경 시 부모에게 알림
  useEffect(() => {
    onChange(seoData);
  }, [seoData, onChange]);

  // 로컬 SEO 분석
  const analyzeLocally = useCallback(async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch("/api/hong/seo/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          metaTitle: seoData.metaTitle,
          metaDescription: seoData.metaDescription,
          content,
          ogImage: seoData.ogImage,
        }),
      });
      const result = await response.json();
      setAnalysis(result);
    } catch (error) {
      console.error("SEO analysis failed:", error);
    }
    setIsAnalyzing(false);
  }, [title, content, seoData]);

  // AI 메타 설명 생성
  const generateMetaDesc = async () => {
    setIsGeneratingDesc(true);
    setErrorMessage(null);

    if (!title || !content) {
      setErrorMessage('제목과 본문을 모두 입력해주세요.');
      setIsGeneratingDesc(false);
      return;
    }

    try {
      const response = await fetch("/api/hong/seo/generate-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'AI 생성 실패');
      }

      const result = await response.json();
      if (result.description) {
        updateSeoData({ metaDescription: result.description });
      }
    } catch (error) {
      console.error("Meta description generation failed:", error);
      setErrorMessage(error instanceof Error ? error.message : 'AI 생성 중 오류가 발생했습니다.');
    }
    setIsGeneratingDesc(false);
  };

  // AI SEO 제안 생성
  const generateSuggestions = async () => {
    setIsGeneratingSuggestions(true);
    try {
      const response = await fetch("/api/hong/seo/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
        }),
      });
      const result = await response.json();
      if (result.suggestions) {
        setAiSuggestions(result.suggestions);
      }
    } catch (error) {
      console.error("SEO suggestions generation failed:", error);
    }
    setIsGeneratingSuggestions(false);
  };

  // 컨텐츠 변경 시 자동 분석
  useEffect(() => {
    const timer = setTimeout(() => {
      if (title && content) {
        analyzeLocally();
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [title, content, seoData.metaTitle, seoData.metaDescription, seoData.ogImage, analyzeLocally]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-100";
    if (score >= 50) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getImportanceIcon = (importance: string, passed: boolean) => {
    if (passed) return <CheckCircle2 className="w-4 h-4 text-green-600" />;
    if (importance === "high") return <XCircle className="w-4 h-4 text-red-600" />;
    return <AlertCircle className="w-4 h-4 text-yellow-600" />;
  };

  return (
    <NeoCard className="p-4 sm:p-6">
      <NeoCardHeader>
        <NeoCardTitle className="flex items-center gap-2 text-lg">
          <Search className="w-5 h-5" />
          SEO 설정
        </NeoCardTitle>
      </NeoCardHeader>
      <NeoCardContent className="space-y-6">
        {/* SEO 점수 */}
        {analysis && (
          <div className="flex items-center gap-4 p-4 border-4 border-black neo-shadow-sm bg-white">
            <div className={`text-3xl font-black px-4 py-2 border-2 border-black ${getScoreColor(analysis.score)}`}>
              {analysis.score}
            </div>
            <div className="flex-1">
              <div className="font-bold">SEO 점수</div>
              <div className="text-sm text-muted-foreground">
                {analysis.score >= 80 ? "훌륭합니다!" : analysis.score >= 50 ? "개선이 필요합니다" : "SEO 최적화가 필요합니다"}
              </div>
            </div>
            <NeoButton
              variant="outline"
              size="sm"
              onClick={analyzeLocally}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : "다시 분석"}
            </NeoButton>
          </div>
        )}

        {/* Meta Title */}
        <div>
          <label className="block text-sm font-bold uppercase mb-2">
            Meta Title
            <span className="ml-2 text-xs font-normal text-muted-foreground">
              ({seoData.metaTitle.length || title.length}/60자)
            </span>
          </label>
          <NeoInput
            type="text"
            placeholder={title || "검색 결과에 표시될 제목"}
            value={seoData.metaTitle}
            onChange={(e) => updateSeoData({ metaTitle: e.target.value })}
          />
          <p className="text-xs text-muted-foreground mt-1">
            비워두면 글 제목이 사용됩니다. 30-60자 권장.
          </p>
        </div>

        {/* Meta Description */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-bold uppercase">
              Meta Description
              <span className="ml-2 text-xs font-normal text-muted-foreground">
                ({seoData.metaDescription.length}/160자)
              </span>
            </label>
            <NeoButton
              variant="accent"
              size="sm"
              onClick={generateMetaDesc}
              disabled={isGeneratingDesc || !content || !title}
            >
              {isGeneratingDesc ? (
                <Loader2 className="w-3 h-3 animate-spin mr-1" />
              ) : (
                <Sparkles className="w-3 h-3 mr-1" />
              )}
              AI 생성
            </NeoButton>
          </div>
          <textarea
            className="w-full px-4 py-3 bg-white border-4 border-black neo-shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary min-h-[80px] resize-y text-sm"
            placeholder="검색 결과에 표시될 설명 (120-160자 권장)"
            value={seoData.metaDescription}
            onChange={(e) => updateSeoData({ metaDescription: e.target.value })}
          />
          {errorMessage && (
            <p className="text-xs text-red-600 mt-2 font-bold">
              ⚠️ {errorMessage}
            </p>
          )}
          {!title && (
            <p className="text-xs text-orange-600 mt-1">
              💡 제목을 먼저 입력하면 AI 생성을 사용할 수 있습니다.
            </p>
          )}
        </div>

        {/* OG Image */}
        <div>
          <label className="block text-sm font-bold uppercase mb-2">
            <ImageIcon className="w-4 h-4 inline mr-1" />
            OG 이미지
          </label>
          {(() => {
            // Extract images from markdown content
            const imageRegex = /!\[.*?\]\((.*?)\)/g;
            const matches = [...content.matchAll(imageRegex)];
            const contentImages = matches.map(match => match[1]).filter(Boolean);

            if (contentImages.length > 0) {
              return (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-2">
                    {contentImages.map((imgUrl, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => updateSeoData({ ogImage: imgUrl })}
                        className={`relative border-4 p-1 hover:border-primary transition-colors ${seoData.ogImage === imgUrl ? "border-primary bg-primary/10" : "border-black"
                          }`}
                      >
                        <img
                          src={imgUrl}
                          alt={`이미지 ${idx + 1}`}
                          className="w-full h-24 object-cover"
                          onError={(e) => (e.currentTarget.style.display = 'none')}
                        />
                        {seoData.ogImage === imgUrl && (
                          <div className="absolute top-1 right-1 bg-primary text-white rounded-full p-1">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    글 내 이미지 중 선택하거나 직접 URL 입력
                  </p>
                </>
              );
            }
            return (
              <p className="text-xs text-muted-foreground py-2 bg-gray-50 px-3 border-2 border-dashed border-gray-300">
                글에 이미지를 추가하면 여기서 선택할 수 있습니다
              </p>
            );
          })()}
          <NeoInput
            type="url"
            placeholder="또는 직접 입력: https://example.com/image.jpg"
            value={seoData.ogImage}
            onChange={(e) => updateSeoData({ ogImage: e.target.value })}
            className="mt-2"
          />
          <p className="text-xs text-muted-foreground mt-1">
            소셜 미디어 공유 시 표시될 이미지 (1200x630px 권장)
          </p>
          {seoData.ogImage && (
            <div className="mt-2 border-2 border-black p-2">
              <img
                src={seoData.ogImage}
                alt="OG Preview"
                className="max-h-32 object-cover"
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
            </div>
          )}
        </div>

        {/* SERP Preview */}
        <div>
          <button
            type="button"
            className="flex items-center gap-2 text-sm font-bold uppercase mb-2 hover:text-primary"
            onClick={() => setShowPreview(!showPreview)}
          >
            <Eye className="w-4 h-4" />
            검색 결과 미리보기
            {showPreview ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {showPreview && (
            <div className="p-4 bg-white border-2 border-gray-200 rounded">
              <div className="text-blue-600 text-lg hover:underline cursor-pointer truncate">
                {seoData.metaTitle || title || "페이지 제목"}
              </div>
              <div className="text-green-700 text-sm truncate">
                {process.env.NEXT_PUBLIC_BASE_URL || 'https://www.digitalmarketer.co.kr'}{urlPath}
              </div>
              <div className="text-gray-600 text-sm mt-1 line-clamp-2">
                {seoData.metaDescription || "메타 설명이 여기에 표시됩니다. 120-160자로 작성하면 검색 결과에서 잘리지 않습니다."}
              </div>
            </div>
          )}
        </div>

        {/* Advanced Options */}
        <div>
          <button
            type="button"
            className="flex items-center gap-2 text-sm font-bold uppercase mb-2 hover:text-primary"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            고급 설정
            {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {showAdvanced && (
            <div className="space-y-4 p-4 bg-gray-50 border-2 border-black">
              {/* OG Title */}
              <div>
                <label className="block text-sm font-bold mb-1">OG Title (소셜용 제목)</label>
                <NeoInput
                  type="text"
                  placeholder="소셜 미디어용 별도 제목"
                  value={seoData.ogTitle}
                  onChange={(e) => updateSeoData({ ogTitle: e.target.value })}
                />
              </div>

              {/* OG Description */}
              <div>
                <label className="block text-sm font-bold mb-1">OG Description (소셜용 설명)</label>
                <NeoInput
                  type="text"
                  placeholder="소셜 미디어용 별도 설명"
                  value={seoData.ogDescription}
                  onChange={(e) => updateSeoData({ ogDescription: e.target.value })}
                />
              </div>

              {/* Canonical URL */}
              <div>
                <label className="block text-sm font-bold mb-1">
                  <Link2 className="w-4 h-4 inline mr-1" />
                  Canonical URL
                </label>
                <NeoInput
                  type="url"
                  placeholder="https://example.com/original-post"
                  value={seoData.canonicalUrl}
                  onChange={(e) => updateSeoData({ canonicalUrl: e.target.value })}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  중복 콘텐츠가 있는 경우 원본 URL을 지정
                </p>
              </div>

              {/* noIndex */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="noIndex"
                  checked={seoData.noIndex}
                  onChange={(e) => updateSeoData({ noIndex: e.target.checked })}
                  className="w-5 h-5 border-2 border-black"
                />
                <label htmlFor="noIndex" className="text-sm font-bold flex items-center gap-2">
                  <EyeOff className="w-4 h-4" />
                  검색 엔진에서 숨기기 (noindex)
                </label>
              </div>
            </div>
          )}
        </div>

        {/* SEO Checks */}
        {analysis && analysis.checks.length > 0 && (
          <div>
            <h4 className="text-sm font-bold uppercase mb-2">SEO 체크리스트</h4>
            <div className="space-y-2">
              {analysis.checks.map((check) => (
                <div
                  key={check.id}
                  className={`flex items-start gap-2 p-2 text-sm ${check.passed ? "bg-green-50" : check.importance === "high" ? "bg-red-50" : "bg-yellow-50"
                    } border-l-4 ${check.passed ? "border-green-500" : check.importance === "high" ? "border-red-500" : "border-yellow-500"
                    }`}
                >
                  {getImportanceIcon(check.importance, check.passed)}
                  <div>
                    <span className="font-medium">{check.label}</span>
                    <p className="text-xs text-muted-foreground">{check.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Suggestions */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-bold uppercase">AI SEO 제안</h4>
            <NeoButton
              variant="accent"
              size="sm"
              onClick={generateSuggestions}
              disabled={isGeneratingSuggestions || !content}
            >
              {isGeneratingSuggestions ? (
                <Loader2 className="w-3 h-3 animate-spin mr-1" />
              ) : (
                <Sparkles className="w-3 h-3 mr-1" />
              )}
              AI 제안 받기
            </NeoButton>
          </div>
          {aiSuggestions.length > 0 && (
            <div className="bg-accent border-2 border-black p-3 space-y-2">
              {aiSuggestions.map((suggestion, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm">
                  <span className="font-bold">{idx + 1}.</span>
                  <span>{suggestion}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </NeoCardContent>
    </NeoCard>
  );
}

export default SeoEditor;
