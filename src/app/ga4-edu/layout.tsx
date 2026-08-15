import type { ReactNode } from "react";
import type { Metadata } from "next";
import { SECTION_BRANDS } from "@/lib/constants";
import "./ga4-edu.css";

// 이 섹션 아래 title 접미사를 루트의 "준이아빠블로그"에서 섹션 브랜드로 바꾼다.
// og:site_name과 JSON-LD publisher는 루트 값(SITE_NAME)을 그대로 상속한다.
export const metadata: Metadata = {
  title: {
    default: `GA4 실습 튜토리얼 | ${SECTION_BRANDS.ga4Edu}`,
    template: `%s | ${SECTION_BRANDS.ga4Edu}`,
  },
};

export default function Ga4EduLayout({ children }: { children: ReactNode }) {
  return <div className="ga4-root">{children}</div>;
}
