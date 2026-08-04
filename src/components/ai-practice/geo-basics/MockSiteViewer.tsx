"use client";

/**
 * GEO 기초 AIPBL 전용 목업 사이트 뷰어 (웹인웹).
 * 왼쪽에는 모바일 웹 형태의 목업 사이트를 폰 프레임 안 iframe으로 띄우고,
 * 오른쪽은 설명란으로 쓴다 (안내 말풍선, 선택지, 실습 채팅을 children으로 받는다).
 * [사람의 눈 / AI의 눈] 탭으로 화면과 크롤러 추출 텍스트를 같은 폰 화면 안에서 전환한다.
 */

import { useEffect, useState, type ReactNode } from "react";
import { Bot, Eye } from "lucide-react";

type ViewMode = "human" | "ai";

interface MockSiteViewerProps {
  /** iframe으로 띄울 목업 사이트 경로 */
  src: string;
  /** 주소 창에 표시할 가상 주소 */
  fakeUrl: string;
  /** AI의 눈 탭에 표시할 크롤러 추출 텍스트 */
  extraction: string[];
  /** AI의 눈 탭을 처음 열었을 때 1회 호출 (미션 진행 게이트) */
  onAiViewOpened?: () => void;
  /** AI의 눈 탭을 눌러야 진행되는 미션에서 클릭 유도 표시를 켠다 */
  aiTabCue?: boolean;
  /** 설명란 버튼 등 바깥에서 AI의 눈을 열 때 쓰는 신호. 값이 커질 때마다 연다 */
  aiViewRequest?: number;
  /** 우측 설명란 내용 */
  children: ReactNode;
}

const TAB_BASE =
  "flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-full border text-xs font-semibold transition-colors";

export function MockSiteViewer({
  src,
  fakeUrl,
  extraction,
  onAiViewOpened,
  aiTabCue = false,
  aiViewRequest = 0,
  children,
}: MockSiteViewerProps) {
  const [mode, setMode] = useState<ViewMode>("human");
  const [aiOpened, setAiOpened] = useState(false);

  const openAiView = () => {
    setMode("ai");
    if (!aiOpened) {
      setAiOpened(true);
      onAiViewOpened?.();
    }
  };

  // 설명란 버튼에서 열기를 요청하면 같은 동작을 실행한다
  useEffect(() => {
    if (aiViewRequest > 0) openAiView();
    // openAiView는 aiOpened 상태만 다루므로 신호 값 변화에만 반응하면 된다
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aiViewRequest]);

  // 아직 AI의 눈을 열지 않은 동안에만 클릭 유도를 보여 준다
  const cueOn = aiTabCue && !aiOpened;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[400px_minmax(0,1fr)] gap-6 items-start">
      {/* 좌: 모바일 목업 사이트 */}
      <div className="w-full max-w-[400px]">
        {/* 보기 모드 탭 */}
        <div className="flex gap-2 mb-3" role="tablist" aria-label="보기 모드">
          <button
            type="button"
            role="tab"
            aria-selected={mode === "human"}
            onClick={() => setMode("human")}
            className={`${TAB_BASE} ${
              mode === "human"
                ? "border-white/40 bg-white/10 text-white"
                : "border-white/12 text-[var(--ap-muted)] hover:border-white/30"
            }`}
          >
            <Eye className="w-3.5 h-3.5" strokeWidth={1.8} /> 사람의 눈
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "ai"}
            onClick={openAiView}
            className={`${TAB_BASE} ${
              mode === "ai"
                ? "border-[#7dd3fc]/60 bg-[#7dd3fc]/10 text-[#7dd3fc]"
                : cueOn
                  ? "ap-tab-cue border-[#7dd3fc] bg-[#7dd3fc]/15 text-[#7dd3fc]"
                  : "border-white/12 text-[var(--ap-muted)] hover:border-white/30"
            }`}
          >
            <Bot className="w-3.5 h-3.5" strokeWidth={1.8} /> AI의 눈으로 보기
          </button>
        </div>

        {/* 폰 프레임 */}
        <div className="rounded-[30px] border border-white/15 bg-[#101014] p-2.5 shadow-[0_18px_50px_rgba(0,0,0,0.45)]">
          {/* 주소 창 */}
          <div className="flex items-center justify-center px-4 py-2">
            <span className="px-4 py-1 rounded-full bg-white/[0.07] font-mono text-[11px] text-[var(--ap-muted)] truncate max-w-full">
              {fakeUrl}
            </span>
          </div>
          {/* 화면 (높이 고정으로 전환 시 흔들림 방지) */}
          <div className="h-[600px] rounded-[20px] overflow-hidden">
            {mode === "human" ? (
              <iframe
                src={src}
                title="모모팜 목업 사이트"
                sandbox=""
                className="w-full h-full bg-white"
              />
            ) : (
              <div className="h-full overflow-y-auto bg-[#0d0d12] p-4 font-mono text-[12px] leading-[1.9]">
                <p className="text-[11px] font-sans font-semibold tracking-[0.2em] uppercase text-[#7dd3fc] mb-3">
                  크롤러가 읽은 텍스트
                </p>
                {extraction.map((line) => (
                  <p
                    key={line}
                    className={`whitespace-pre-wrap ap-fade-up ${
                      line.trimStart().startsWith("+")
                        ? "text-[#ffe08a]"
                        : line.includes("없습니다") || line.includes("없음")
                          ? "text-[#ff8fa3]"
                          : "text-gray-300"
                    }`}
                  >
                    {line}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 우: 설명란 */}
      <div className="space-y-4 min-w-0">{children}</div>
    </div>
  );
}
