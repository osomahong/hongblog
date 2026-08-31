import { absoluteUrl } from "@/lib/utils";

// 사이트 전체가 공유하는 저자 엔티티.
// 모든 글(Article)의 author가 이 @id를 참조해야 254편의 글이
// "홍승협"이라는 하나의 인물 그래프로 합산된다 (AEO, GEO 신호).
// 상세 프로필은 /about의 Person JSON-LD가 같은 @id로 정의한다.
export const AUTHOR_PERSON_LD = {
  "@type": "Person",
  "@id": absoluteUrl("/about#person"),
  name: "홍승협",
  alternateName: "준이아빠",
  url: absoluteUrl("/about"),
} as const;
