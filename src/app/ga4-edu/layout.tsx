import type { ReactNode } from "react";
import type { Metadata } from "next";
import { SECTION_LABELS, SITE_NAME } from "@/lib/constants";
import "./ga4-edu.css";

// `GA4 Edu | (페이지 제목) | 준이아빠블로그` 형태로 맞춘다.
// 섹션 layout의 template은 루트 template을 덮어쓰므로 브랜드를 여기에 직접 넣는다.
export const metadata: Metadata = {
  title: {
    default: `${SECTION_LABELS.ga4Edu} | GA4 실습 튜토리얼 | ${SITE_NAME}`,
    template: `${SECTION_LABELS.ga4Edu} | %s | ${SITE_NAME}`,
  },
};

export default function Ga4EduLayout({ children }: { children: ReactNode }) {
  return <div className="ga4-root">{children}</div>;
}
