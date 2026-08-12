import { Suspense } from "react";
import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";
import { SearchPageClient } from "./SearchPageClient";
import { getCourseLinks } from "@/lib/promotions";

export const dynamic = "force-static";

const PAGE_TITLE = "검색";
const PAGE_DESCRIPTION =
  "준이아빠블로그의 인사이트, 클래스, 코스를 제목과 설명, 본문에서 한 번에 찾는 사이트 내 검색 페이지입니다.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  // 검색 결과 페이지는 질의마다 URL이 갈라져 얇은 중복 페이지가 무한히 생긴다.
  // 색인에서 빼되 follow는 남겨 결과에서 이어지는 내부 링크는 그대로 흐르게 한다.
  robots: { index: false, follow: true },
  alternates: { canonical: `${SITE_URL}/search` },
};

export default function SearchPage() {
  // 결과가 없을 때 되돌아가지 않고 코스로 이어 가게 한다
  const courses = getCourseLinks();

  return (
    <Suspense
      fallback={
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
          <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tighter">
            <span className="text-[#FF0033]">Search</span>
          </h1>
        </div>
      }
    >
      <SearchPageClient courses={courses} />
    </Suspense>
  );
}
