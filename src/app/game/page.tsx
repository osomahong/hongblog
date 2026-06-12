import type { Metadata } from "next";

import { GameRoot } from "@/components/game/GameRoot";
import type { ClassLinkMap } from "@/components/game/speakers";
import { SITE_URL } from "@/lib/constants";
import { getClassBySlug, getCourseBySlug } from "@/lib/content";
import { collectClassSlugs, getDefaultChapter } from "@/lib/game/scenarios";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "AI 오피스 서바이벌 | 게임으로 배우는 AI 활용",
  description:
    "직장인 AI 적응기를 다룬 턴제 업무 시뮬레이션 게임. 쏟아지는 업무를 시간과 에너지 안에서 처리하며 프롬프트 작성, 환각 검증, 민감정보 주의 같은 AI 활용 기본기를 플레이로 익힙니다.",
  alternates: { canonical: `${SITE_URL}/game` },
  openGraph: {
    title: "AI 오피스 서바이벌 | 준이아빠블로그",
    description:
      "월요일부터 금요일 보고까지 한 주 생존. 선택과 실패로 배우는 AI 활용 시뮬레이션 게임.",
  },
};

/** 게임이 참조하는 클래스/코스의 제목·경로 맵을 빌드 타임에 생성 */
function buildLinkMap(): ClassLinkMap {
  const chapter = getDefaultChapter();
  const map: ClassLinkMap = {};
  collectClassSlugs(chapter).forEach((slug) => {
    const classItem = getClassBySlug(slug);
    if (classItem) {
      map[slug] = {
        title: classItem.term,
        href: `/class/${classItem.courseSlug}/${classItem.slug}`,
      };
      return;
    }
    const course = getCourseBySlug(slug);
    if (course) {
      map[slug] = { title: course.title, href: `/class/${course.slug}` };
    }
  });
  return map;
}

export default function GamePage() {
  const links = buildLinkMap();
  return (
    <main className="min-h-screen">
      <GameRoot links={links} />
    </main>
  );
}
