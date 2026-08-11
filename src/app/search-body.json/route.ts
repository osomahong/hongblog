import { buildSearchBodyIndex } from "@/lib/search-index";

/**
 * 2차 검색 인덱스(소제목 + 본문 앞부분). 1차보다 5배 무거워 별도 파일로 둔다.
 * 클라이언트는 1차로 먼저 결과를 그린 뒤 이 파일이 도착하면 다시 매긴다.
 */
export const dynamic = "force-static";

export function GET(): Response {
  return new Response(JSON.stringify(buildSearchBodyIndex()), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}
