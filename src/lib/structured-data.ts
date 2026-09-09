import { absoluteUrl } from "@/lib/utils";

// 홈, 소개, 글, 과정에서 동일 작성자를 참조하는 공개 인물 정보.
export const AUTHOR_PERSON_LD = {
  "@type": "Person",
  "@id": absoluteUrl("/about#person"),
  name: "홍승협",
  alternateName: "준이아빠",
  url: absoluteUrl("/about"),
} as const;

export const AUTHOR_LABEL = `${AUTHOR_PERSON_LD.name}(${AUTHOR_PERSON_LD.alternateName})`;
