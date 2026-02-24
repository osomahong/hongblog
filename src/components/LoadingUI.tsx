"use client";

import { useEffect, useState } from "react";

/**
 * 경량 로딩 인디케이터 — "Identity Card" 방식.
 * - 200ms 이내에 렌더링이 완료되면 아예 표시하지 않아 깜빡임을 방지한다.
 * - 200ms 이후에도 로딩 중이면 불투명 배경 + 브랜드 카드를 표시한다.
 * - Next.js App Router의 Suspense 경계가 해제되면 즉시 언마운트된다.
 */
export function LoadingUI() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setVisible(true), 200);
        return () => clearTimeout(timer);
    }, []);

    if (!visible) return null;

    return (
        <>
            {/* 상단 프로그레스 바 */}
            <div className="fixed top-0 left-0 right-0 z-[9999] h-1 bg-gray-100 overflow-hidden">
                <div
                    className="h-full w-full bg-primary"
                    style={{ animation: "progress-bar 1s ease-in-out infinite" }}
                />
            </div>

            {/* 불투명 배경 + 중앙 브랜드 카드 */}
            <div className="fixed inset-0 z-[9998] bg-[#F3F3F3] flex items-center justify-center">
                <div
                    className="bg-white border-4 border-black neo-shadow p-8 flex flex-col items-center gap-4"
                    style={{ animation: "loading-fade-in 0.3s ease-out" }}
                >
                    {/* 프로필 일러스트 */}
                    <div className="w-12 h-12 rounded-full border-2 border-black overflow-hidden neo-shadow-sm">
                        <img
                            src="/profile-illustration.png"
                            alt="Logo"
                            className="w-full h-full object-cover object-top scale-125"
                        />
                    </div>

                    {/* 블로그 이름 */}
                    <span className="text-xl font-black tracking-tighter">
                        준이아빠<span className="text-primary">블로그</span>
                    </span>

                    {/* 바운싱 도트 */}
                    <div className="flex gap-2">
                        {[0, 1, 2].map((i) => (
                            <div
                                key={i}
                                className="w-2.5 h-2.5 border-2 border-black bg-primary"
                                style={{
                                    animation: "loading-bounce 0.6s ease-in-out infinite",
                                    animationDelay: `${i * 0.15}s`,
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
