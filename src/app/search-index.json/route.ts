import { buildSearchIndex } from "@/lib/search-index";

/**
 * 1차 검색 인덱스. 빌드 시 정적 파일로 떨어지므로 서버 함수 호출이 붙지 않는다.
 * rss.xml과 같은 방식이라 콘텐츠를 추가해도 배포만 하면 인덱스가 따라 갱신된다.
 */
export const dynamic = "force-static";

export function GET(): Response {
  return new Response(JSON.stringify(buildSearchIndex()), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      // 배포마다 내용이 바뀌므로 immutable은 쓰지 않는다.
      // 하루 캐시 + 재검증으로 두면 같은 방문자가 검색을 여러 번 열어도 한 번만 받는다.
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}
