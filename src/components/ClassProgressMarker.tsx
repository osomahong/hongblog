"use client";

import { useEffect } from "react";

export const CLASS_PROGRESS_KEY = "hongblog-class-progress";
export const CLASS_PROGRESS_EVENT = "class-progress-updated";

export function readClassProgress(): Record<string, number> {
    try {
        const raw = localStorage.getItem(CLASS_PROGRESS_KEY);
        if (!raw) return {};
        const parsed: unknown = JSON.parse(raw);
        if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) return {};
        return parsed as Record<string, number>;
    } catch {
        return {};
    }
}

interface ClassProgressMarkerProps {
    slug: string;
}

/** 클래스 상세 페이지 방문을 localStorage에 기록한다 (학습 진도용). */
export function ClassProgressMarker({ slug }: ClassProgressMarkerProps) {
    useEffect(() => {
        try {
            const progress = readClassProgress();
            if (progress[slug]) return;
            localStorage.setItem(
                CLASS_PROGRESS_KEY,
                JSON.stringify({ ...progress, [slug]: Date.now() })
            );
            window.dispatchEvent(new Event(CLASS_PROGRESS_EVENT));
        } catch {
            // localStorage를 쓸 수 없는 환경(시크릿 모드 등)에서는 조용히 건너뛴다
        }
    }, [slug]);

    return null;
}
