import fs from "fs";
import path from "path";
import { getPublishedCourses } from "@/lib/content";

/**
 * 배너 파일을 같은 경로로 갈아끼워도 방문자 브라우저가 옛 이미지를 붙들고 있지 않게 하는
 * 버전 값이다. `/banners/*`에 30일 캐시가 걸려 있어서 파일만 바꾸면 반영되지 않는다.
 * 배너를 다시 만들 때마다 이 숫자를 올린다.
 */
const BANNER_VERSION = "4";

const bannerUrl = (kind: "hero" | "card" | "page", slug: string) =>
  `/banners/${kind}/${slug}.webp?v=${BANNER_VERSION}`;

export type PromotionBadge = "marketing" | "ai" | "data" | "claude";

/** 메인 히어로 슬라이드 한 장에 필요한 값 */
export interface PromotionSlot {
  /** 슬라이드 식별자. GA4 content_id로 그대로 쓴다 */
  id: string;
  href: string;
  /** 배지에 들어가는 짧은 분류 이름 */
  label: string;
  /**
   * 배너에서 가장 크게 읽히는 문구. 배워야 하는 이유를 담는다.
   * 줄바꿈 지점이 읽는 맛을 좌우하므로 `\n`으로 직접 끊는다. 화면에서는
   * `whitespace-pre-line`이 이 줄바꿈을 그대로 살린다.
   */
  headline: string;
  /** 코스 이름. 헤드라인 아래 작은 글씨로 둔다 */
  title: string;
  /** 무엇이 중요한지 설명하는 두 줄. headline과 같이 `\n`으로 직접 끊는다 */
  description: string;
  classCount: number;
  /**
   * 슬라이드 배경색. 배너 이미지의 왼쪽 빈 구역에서 뽑은 값이다.
   * 텍스트 칸과 이미지 칸이 맞닿는 자리에 색 경계가 보이지 않게 한다.
   */
  bgColor: string;
  /** 1024px 이상, 텍스트와 이미지를 좌우로 나눌 때 쓰는 가로형 배너 */
  heroImage: string;
  /** 1024px 미만, 이미지를 텍스트 위에 쌓을 때 쓰는 카드형 배너 */
  cardImage: string;
  badge: PromotionBadge;
}

/** 메인 코스 캐러셀 카드 한 장에 필요한 값 */
export interface CourseCard {
  slug: string;
  href: string;
  title: string;
  label: string;
  classCount: number;
  image: string;
  badge: PromotionBadge;
}

const BADGE_BY_CATEGORY: Record<string, PromotionBadge> = {
  MARKETING: "marketing",
  AI_TECH: "ai",
  DATA: "data",
  CLAUDE_EDUCATION: "claude",
};

const LABEL_BY_CATEGORY: Record<string, string> = {
  MARKETING: "Marketing",
  AI_TECH: "AI & Tech",
  DATA: "Data",
  CLAUDE_EDUCATION: "Claude 교육",
};

/**
 * 히어로 슬라이드에 올릴 코스와 문구.
 * 코스 본문에서 뽑은 설명은 한 문단이라 배너에 길다. 배너용 문구를 따로 둔다.
 * 헤드라인은 배워야 하는 이유, 설명은 무엇이 중요한지를 담는다.
 * 순서가 곧 노출 순서다.
 *
 * 마지막 줄의 서술어는 슬라이드마다 다르게 쓴다. 다섯 장이 연달아 넘어가는 자리라
 * 같은 말끝이 반복되면 한 장만 읽고 넘기게 된다.
 *
 * 헤드라인은 "어떤 상황이라면" + "무엇을 하세요" 두 줄로 끊는다. 읽는 사람이 자기
 * 이야기로 알아보게 상황 쪽에 대상을 넣는다. "검색에 안 나온다면"이 아니라
 * "내 글이 안 보인다면"이다.
 *
 * 줄 길이 상한이 곧 글자 크기 상한이다. 헤드라인은 두 줄, 한 줄 10자를 넘기지 않는다.
 * 짧게 끊을수록 글자를 키울 수 있다. 설명은 두 줄, 한 줄 22자다. 상한을 넘기면 좁은
 * 화면에서 의도하지 않은 자리에 줄이 하나 더 생긴다.
 */
const HERO_COPY: {
  slug: string;
  headline: string;
  title: string;
  description: string;
  /** scripts로 배너를 만들 때 이미지에서 뽑은 배경색 */
  bgColor: string;
}[] = [
  {
    slug: "claude-fundamentals",
    bgColor: "#f5f5f2",
    headline: "Claude 아직 어렵다면\n쉽게 배워보세요",
    title: "Claude 기초 교육",
    description:
      "환각과 아부를 알아채는 법부터\n검증하며 쓰는 순서까지 익힙니다.",
  },
  {
    slug: "claude-code-for-everyone",
    bgColor: "#f8f6f2",
    headline: "반복 업무 지친다면\n코딩 없이 맡겨보세요",
    title: "비개발자를 위한 Claude Code",
    description:
      "설치와 권한 설정에서 대부분 막힙니다.\n터미널을 처음 열어도 따라올 수 있습니다.",
  },
  {
    slug: "seo-fundamentals",
    bgColor: "#f4f1eb",
    headline: "내 글 검색이 안 되면\n원인부터 찾아보세요",
    title: "비개발자를 위한 검색엔진 최적화(SEO) 기초",
    description:
      "색인, 구조, 콘텐츠 가운데 어디서 막혔는지\n개발자 도움 없이 찾는 순서를 다룹니다.",
  },
  {
    slug: "digital-marketing-terms",
    bgColor: "#f4f0ea",
    headline: "광고 지표 헷갈리면\n용어부터 익혀보세요",
    title: "디지털 마케팅 핵심 용어",
    description:
      "CPC가 낮은데 매출이 늘지 않는 이유를\n정의와 계산식으로 묶어 풀었습니다.",
  },
  {
    slug: "vibe-coding-basics",
    bgColor: "#f7f5f2",
    headline: "바이브코딩 어렵다면\n기초부터 배워보세요",
    title: "바이브코딩 기초지식",
    description:
      "AI가 만든 코드를 고치려면\n터미널, Git, 환경 변수, 배포를 알아야 합니다.",
  },
];

/**
 * 히어로 슬라이드 목록.
 * 배너 이미지가 준비된 코스만 노출한다. 코스 파일이 사라지면 그 슬라이드는 빠진다.
 */
export function getHeroSlots(): PromotionSlot[] {
  const courses = getPublishedCourses();

  return HERO_COPY.flatMap((copy) => {
    const course = courses.find((item) => item.slug === copy.slug);
    if (!course) return [];

    return [
      {
        id: copy.slug,
        href: `/class/${copy.slug}`,
        label: LABEL_BY_CATEGORY[course.category] ?? course.category,
        headline: copy.headline,
        title: copy.title,
        description: copy.description,
        classCount: course.classCount,
        bgColor: copy.bgColor,
        heroImage: bannerUrl("hero", copy.slug),
        cardImage: bannerUrl("card", copy.slug),
        badge: BADGE_BY_CATEGORY[course.category] ?? "marketing",
      },
    ];
  });
}

/** 내비게이션, 푸터, 검색 빈 결과처럼 그림 없이 이름만 늘어놓는 자리에 쓰는 코스 목록 */
export interface CourseLink {
  slug: string;
  href: string;
  title: string;
  classCount: number;
}

export function getCourseLinks(): CourseLink[] {
  return getPublishedCourses().map((course) => ({
    slug: course.slug,
    href: `/class/${course.slug}`,
    title: course.title,
    classCount: course.classCount,
  }));
}

/** 코스 캐러셀에 올릴 전체 코스 카드 */
export function getCourseCards(): CourseCard[] {
  return getPublishedCourses().map((course) => ({
    slug: course.slug,
    href: `/class/${course.slug}`,
    title: course.title,
    label: LABEL_BY_CATEGORY[course.category] ?? course.category,
    classCount: course.classCount,
    image: bannerUrl("card", course.slug),
    badge: BADGE_BY_CATEGORY[course.category] ?? "marketing",
  }));
}

/**
 * 코스 상세 페이지 배너 위에 얹는 한 줄 소개.
 * 코스 본문 첫 문장은 길고 URL이 들어가기도 해서 배너 왼쪽 빈 구역에 담기지 않는다.
 * 배너용 문구를 따로 둔다. 두 줄, 한 줄 9자를 넘기지 않는다. 배너 왼쪽 글자 자리가
 * 266px이고 픽셀 서체가 한 글자에 28px을 쓴다.
 */
const COURSE_BANNER_INTRO: Record<string, string> = {
  "claude-fundamentals": "AI 답변을 믿기 전\n확인하는 법",
  "claude-code-for-everyone": "코딩 없이 업무를\n자동화하는 법",
  "claude-in-practice": "Claude를 매일 쓰는\n도구로 만들기",
  "seo-fundamentals": "검색에 안 나오는\n원인을 찾는 순서",
  "digital-marketing-terms": "광고 지표를 정의와\n계산식으로 정리",
  "vibe-coding-basics": "AI에게 맡기기 전\n채워야 할 기초",
  "app-marketing-basics": "설치부터 결제까지\n앱 사용자 여정",
  "digital-basic": "웹이 어떻게 도는지\n비개발자 눈높이로",
};

export function getCourseBannerIntro(slug: string): string | null {
  return COURSE_BANNER_INTRO[slug] ?? null;
}

/**
 * 코스 상세 페이지 상단에 쓰는 배너.
 * 메인에서 누른 배너와 같은 그림을 그 페이지에서도 보여 주려는 것이다.
 * hero는 메인 캐러셀의 좁은 칸에 맞춰 1.17:1로 잘라 둔 것이고 card는 위아래를 잘라낸
 * 크롭본이라, 둘 다 가로 배너로 쓰기에 맞지 않는다. 코스 페이지는 원본을 16:9 한 비율로
 * 통일한 page 변형을 쓴다. 왼쪽 36%가 비어 있어 그 자리에 한 줄 소개를 얹을 수 있다.
 * 배너 파일이 없는 코스는 null을 돌려주고 호출부에서 영역을 그리지 않는다.
 */
export function getCourseBannerImage(slug: string): string | null {
  const file = path.join(process.cwd(), "public", "banners", "page", `${slug}.webp`);
  if (!fs.existsSync(file)) return null;
  return bannerUrl("page", slug);
}
