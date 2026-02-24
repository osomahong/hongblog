"use client";

import { useEffect, useState } from "react";

/**
 * 경량 로딩 인디케이터.
 * - 200ms 이내에 렌더링이 완료되면 아예 표시하지 않아 깜빡임을 방지한다.
 * - 200ms 이후에도 로딩 중이면 상단 프로그레스 바 + 중앙 애니메이션을 표시한다.
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

            {/* 중앙 로딩 애니메이션 */}
            <div className="fixed inset-0 z-[9998] flex items-center justify-center pointer-events-none">
                <div
                    className="flex flex-col items-center gap-5"
                    style={{ animation: "loading-fade-in 0.3s ease-out" }}
                >
                    {/* 바운싱 도트 */}
                    <div className="flex gap-2">
                        {[0, 1, 2].map((i) => (
                            <div
                                key={i}
                                className="w-3.5 h-3.5 border-2 border-black bg-primary"
                                style={{
                                    animation: "loading-bounce 0.6s ease-in-out infinite",
                                    animationDelay: `${i * 0.15}s`,
                                }}
                            />
                        ))}
                    </div>
                    <span className="text-sm font-bold text-muted-foreground tracking-wide">
                        LOADING
                    </span>
                </div>
            </div>
        </>
    );
}
