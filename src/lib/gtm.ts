/**
 * Google Tag Manager dataLayer 이벤트 헬퍼 함수
 */

export { }; // Make this a module

// dataLayer 타입 확장
declare global {
    interface Window {
        dataLayer: Record<string, unknown>[];
    }
}

/**
 * GTM dataLayer에 이벤트를 전송합니다.
 * GTM 스니펫(afterInteractive)보다 먼저 실행돼도 유실되지 않도록 큐를 직접 초기화한다.
 * 먼저 쌓인 이벤트는 gtm.js 로드 시점에 순서대로 처리된다.
 */
export const sendGAEvent = (eventName: string, params?: Record<string, unknown>) => {
    if (typeof window === 'undefined') return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
        event: eventName,
        ...params,
    });
};

// Note: 커스텀 dataLayer 트래킹이 다시 활성화되었습니다 (2026-01-19)
