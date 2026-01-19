"use client";

import { Loader2, Sparkles, Database, TrendingUp } from "lucide-react";

const messages = [
    "데이터 인사이트 수집 중...",
    "지식 베이스 연결 중...",
    "마케팅 퍼널 최적화 중...",
    "AI 엔진 가동 중...",
    "데이터 실마리 찾는 중...",
];

export function LoadingUI() {
    // 랜덤 메시지 선택 (서버 사이드에서는 항상 첫 번째 메시지)
    const message = typeof window === 'undefined' ? messages[0] : messages[Math.floor(Math.random() * messages.length)];

    return (
        <div className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center p-4">
            <div className="relative max-w-sm w-full">
                {/* Decorative elements */}
                <div className="absolute -top-12 -left-12 w-20 h-20 bg-rose-400 border-4 border-black -rotate-12 neo-shadow-sm hidden sm:block" />
                <div className="absolute -bottom-8 -right-8 w-16 h-16 bg-blue-400 border-4 border-black rotate-6 neo-shadow-sm hidden sm:block" />

                {/* Main Loading Box */}
                <div className="bg-white border-8 border-black p-8 sm:p-10 relative z-10 w-full neo-shadow halftone-bg text-center">
                    <div className="flex justify-center mb-8">
                        <div className="relative">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 border-8 border-black border-t-rose-500 rounded-full animate-spin" />
                            <Sparkles className="absolute -top-2 -right-2 w-6 h-6 sm:w-8 sm:h-8 text-yellow-500 animate-pulse" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter text-black italic">
                            LOADING
                        </h2>
                        <div className="bg-black text-white px-4 py-2 font-mono text-sm sm:text-base inline-block w-full border-2 border-black shadow-[4px_4px_0px_0px_rgba(255,50,50,1)]">
                            {message}
                        </div>

                        <div className="flex justify-center gap-4 mt-8 opacity-60">
                            <Database className="w-6 h-6 animate-bounce [animation-delay:-0.3s]" />
                            <TrendingUp className="w-6 h-6 animate-bounce [animation-delay:-0.15s]" />
                            <Sparkles className="w-6 h-6 animate-bounce" />
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-8 w-full h-8 bg-gray-100 border-4 border-black relative overflow-hidden neo-shadow-sm">
                    <div className="absolute inset-y-0 left-0 bg-yellow-400 w-full animate-[loading_2s_infinite_ease-in-out]" />
                </div>
            </div>

            <p className="mt-8 font-mono text-[10px] sm:text-xs text-black/50 uppercase tracking-widest animate-pulse">
                준이아빠의 지식 아카이브에 연결하고 있습니다
            </p>

            <style jsx>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0); }
          100% { transform: translateX(100%); }
        }
      `}</style>
        </div>
    );
}
