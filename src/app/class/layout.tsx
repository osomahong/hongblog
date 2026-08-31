import type { ReactNode } from "react";
import type { Metadata } from "next";
import { SECTION_LABELS, SITE_NAME } from "@/lib/constants";

// `Class | (페이지 제목) | 준이아빠블로그` 형태로 맞춘다.
// 섹션 layout의 template은 루트 template을 덮어쓰므로 브랜드를 여기에 직접 넣는다.
export const metadata: Metadata = {
  title: {
    default: `${SECTION_LABELS.class} | AI 마케팅 개념학습 | ${SITE_NAME}`,
    template: `${SECTION_LABELS.class} | %s | ${SITE_NAME}`,
  },
};

// 마크업을 감싸지 않는 통과 레이아웃이다. title template만 걸기 위해 둔다.
export default function ClassLayout({ children }: { children: ReactNode }) {
  return children;
}
