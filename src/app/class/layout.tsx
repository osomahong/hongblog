import type { ReactNode } from "react";
import type { Metadata } from "next";
import { SECTION_BRANDS } from "@/lib/constants";

// 이 섹션 아래 title 접미사를 루트의 "준이아빠블로그"에서 섹션 브랜드로 바꾼다.
// og:site_name과 JSON-LD publisher는 루트 값(SITE_NAME)을 그대로 상속한다.
export const metadata: Metadata = {
  title: {
    default: `AI마케팅 개념학습 | ${SECTION_BRANDS.class}`,
    template: `%s | ${SECTION_BRANDS.class}`,
  },
};

// 마크업을 감싸지 않는 통과 레이아웃이다. title template만 걸기 위해 둔다.
export default function ClassLayout({ children }: { children: ReactNode }) {
  return children;
}
