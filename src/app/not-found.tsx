import type { Metadata } from "next";
import Link from "next/link";
import { NeoButton } from "@/components/neo";
import { getCourseLinks } from "@/lib/promotions";
import { CourseSuggestList } from "@/components/CourseSuggestList";
import { PixelAssemble } from "@/components/PixelAssemble";

export const metadata: Metadata = {
  title: "페이지를 찾을 수 없습니다",
  robots: { index: false, follow: true },
};

/**
 * 404 화면.
 * 주소가 틀렸을 때 뒤로 가기로 이탈하지 않도록 코스 목록을 함께 둔다.
 */
export default function NotFound() {
  const courses = getCourseLinks();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-20">
      <PixelAssemble>
        <p className="font-mono text-sm text-[#FF0033] font-bold mb-2">404</p>
        <h1 className="text-2xl sm:text-4xl font-black tracking-tighter leading-tight mb-3">
          찾으시는 페이지가 없습니다
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          주소가 바뀌었거나 지워진 글입니다. 아래에서 다른 글로 이어 가시면 됩니다.
        </p>
      </PixelAssemble>

      <div className="flex flex-wrap gap-2 sm:gap-3 mt-5 sm:mt-6">
        <Link href="/">
          <NeoButton variant="primary" size="sm">홈으로</NeoButton>
        </Link>
        <Link href="/insights">
          <NeoButton variant="outline" size="sm">인사이트 전체</NeoButton>
        </Link>
        <Link href="/class">
          <NeoButton variant="outline" size="sm">코스 전체</NeoButton>
        </Link>
      </div>

      <CourseSuggestList courses={courses} location="not_found" title="무료 셀프 교육으로 배워보세요" />
    </div>
  );
}
