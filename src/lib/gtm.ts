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

// Note: 모든 커스텀 dataLayer 트래킹 정보 전송이 중단되었습니다.
// GTM 기본 스크립트(layout.tsx)만 유지됩니다.
