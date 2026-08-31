/**
 * GA4 실시간 스냅샷 API. /ga4-edu 대시보드가 주기적으로 부른다.
 *
 * 서비스 계정 키는 이 라우트 안에서만 쓰고 응답에 담지 않는다.
 * 응답을 메모리에 짧게 캐시해, 동시 접속자가 늘어도 GA4 호출 수가 늘지 않게 한다.
 */
import { NextResponse } from "next/server";
import { fetchRealtimeSnapshot } from "@/lib/ga4-realtime";
import type { RealtimeSnapshot } from "@/lib/ga4-types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** 캐시 수명. GA4 실시간 지표 자체가 분 단위라 이보다 짧게 잡을 이유가 없다 */
const CACHE_TTL_MS = 20_000;

let cache: { snapshot: RealtimeSnapshot; expiresAt: number } | null = null;
/** 캐시가 비었을 때 동시에 들어온 요청이 GA4를 중복 호출하지 않도록 진행 중인 조회를 공유한다 */
let inFlight: Promise<RealtimeSnapshot> | null = null;

async function getSnapshot(): Promise<RealtimeSnapshot> {
  const now = Date.now();
  if (cache && cache.expiresAt > now) return cache.snapshot;
  if (inFlight) return inFlight;

  inFlight = fetchRealtimeSnapshot()
    .then((snapshot) => {
      cache = { snapshot, expiresAt: Date.now() + CACHE_TTL_MS };
      return snapshot;
    })
    .finally(() => {
      inFlight = null;
    });

  return inFlight;
}

export async function GET() {
  try {
    const snapshot = await getSnapshot();
    return NextResponse.json(
      { ok: true, data: snapshot },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "알 수 없는 오류";
    // 키나 속성 ID 같은 설정 값이 메시지에 섞이지 않게 서버 로그와 응답을 분리한다
    console.error("[ga4-realtime]", message);
    return NextResponse.json(
      { ok: false, error: "실시간 데이터를 불러오지 못했습니다" },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
}
