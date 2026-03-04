/**
 * Vercel Deploy Hook을 통한 리빌드 트리거
 *
 * Admin API의 POST/PUT/DELETE 성공 후 호출하여
 * JSON 데이터를 최신 상태로 재생성하는 빌드를 트리거합니다.
 *
 * 환경변수: VERCEL_DEPLOY_HOOK_URL
 * Vercel Dashboard > Settings > Git > Deploy Hooks에서 생성
 */
export async function triggerRebuild(): Promise<void> {
  const hookUrl = process.env.VERCEL_DEPLOY_HOOK_URL;

  if (!hookUrl) {
    console.warn("[trigger-rebuild] VERCEL_DEPLOY_HOOK_URL not set, skipping rebuild trigger");
    return;
  }

  try {
    const res = await fetch(hookUrl, { method: "POST" });
    if (!res.ok) {
      console.error(`[trigger-rebuild] Deploy hook failed: ${res.status} ${res.statusText}`);
    }
  } catch (err) {
    // 리빌드 트리거 실패가 API 응답에 영향을 주면 안 됨
    console.error("[trigger-rebuild] Deploy hook error:", err);
  }
}
