"use client";

import { useEffect, useState } from "react";

/**
 * 경량 로딩 인디케이터.
 * - 200ms 이내에 렌더링이 완료되면 아예 표시하지 않아 깜빡임을 방지한다.
 * - 200ms 이후에도 로딩 중이면 상단 프로그레스 바만 표시한다.
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
        <div className="fixed top-0 left-0 right-0 z-[9999] h-1 bg-gray-100 overflow-hidden">
            <div className="h-full bg-primary animate-[progress_1s_ease-in-out_infinite]" />
            <style jsx>{`
                @keyframes progress {
                    0% { width: 0%; margin-left: 0%; }
                    50% { width: 60%; margin-left: 20%; }
                    100% { width: 0%; margin-left: 100%; }
                }
            `}</style>
        </div>
    );
}
