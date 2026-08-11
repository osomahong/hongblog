/**
 * 검색 인덱스 생성. 빌드 시점에만 돈다(force-static 라우트 핸들러에서 호출).
 *
 * 인덱스를 두 벌로 나눈 이유는 용량 차이다. 실측으로 1차(제목, 설명, 태그)는
 * brotli 23KB, 본문을 통째로 넣으면 444KB가 된다. 방문자가 검색을 열자마자
 * 444KB를 받게 할 수는 없어서, 즉시 필요한 1차와 나중에 받아도 되는 2차로 쪼갠다.
 *
 * 2차도 본문 전문 대신 소제목 전량 + 본문 앞부분만 담는다. 소제목이 글 전체의
 * 주제를 덮기 때문에 전문을 넣지 않아도 검색이 닿는 범위는 크게 줄지 않는다.
 */

import { getClasses, getCourses, getInsights } from "./content";
import { classHref, courseHref, insightHref } from "./links";
import type { SearchBodyDoc, SearchDoc } from "./search";

/** 2차 인덱스에 담을 본문 길이 상한(문자). 실측 brotli 약 111KB 지점이다. */
const BODY_CHAR_LIMIT = 800;

/**
 * 마크다운과 HTML을 걷어내 검색용 평문으로 만든다.
 *
 * content.ts의 stripMarkdown과 목적이 다르다. 그쪽은 카드에 그대로 노출되는
 * 짧은 문자열을 다듬는 용도라 줄바꿈과 문장 구조를 살린다. 여기서는 부분 문자열
 * 검색만 하면 되므로 코드 블록과 HTML 목업까지 통째로 버리고 한 줄로 눌러 버린다.
 */
function toPlainText(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, " ") // 코드 블록
    .replace(/<[^>]+>/g, " ") // HTML 태그(본문 목업 포함)
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ") // 이미지
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1") // 링크는 텍스트만 남긴다
    .replace(/^[|\s:-]+$/gm, " ") // 표 구분선
    .replace(/[`*_>#|~]/g, " ") // 남은 마크다운 기호
    .replace(/\s+/g, " ")
    .trim();
}

/** 문서의 모든 소제목(h2~h4)을 이어 붙인다. */
function collectHeadings(markdown: string): string {
  const matches = markdown.match(/^#{2,4}\s+.+$/gm) ?? [];
  return matches
    .map((line) => line.replace(/^#+\s*/, "").replace(/[`*_[\]()]/g, "").trim())
    .filter(Boolean)
    .join(" · ")
    .replace(/\s+/g, " ");
}

/** ISO 문자열에서 YYYY-MM-DD만 남긴다. 인덱스 용량을 줄이려는 목적도 있다. */
function toDateOnly(iso: string): string {
  return iso.slice(0, 10);
}

/**
 * 콘텐츠가 아니지만 검색으로 찾을 수 있어야 하는 고정 페이지.
 * 사이트 검색에서 About이 안 잡히면 검색이 고장 난 것처럼 보인다.
 */
const STATIC_PAGES: SearchDoc[] = [
  {
    href: "/about",
    type: "page",
    title: "About 작성자 소개",
    description:
      "준이아빠블로그를 쓰는 사람의 이력과 강의, 컨설팅 경력을 정리한 소개 페이지입니다.",
    tags: [],
    category: "PAGE",
    date: "2025-01-01",
  },
  {
    href: "/ai-practice",
    type: "page",
    title: "AI-Practice 실습",
    description:
      "AI 도구를 직접 따라 하며 익히는 실습 페이지입니다. 마케팅 실무 과제를 단계별로 다룹니다.",
    tags: ["AI", "자동화"],
    category: "PAGE",
    date: "2025-01-01",
  },
  {
    href: "/insights",
    type: "page",
    title: "Insights 전체 글 목록",
    description: "AI, 마케팅, 데이터 분석 인사이트 글의 전체 목록입니다.",
    tags: [],
    category: "PAGE",
    date: "2025-01-01",
  },
  {
    href: "/class",
    type: "page",
    title: "Class 용어 강의 목록",
    description: "마케팅과 AI 용어를 코스 단위로 정리한 강의 목록입니다.",
    tags: [],
    category: "PAGE",
    date: "2025-01-01",
  },
  {
    href: "/tags",
    type: "page",
    title: "Tags 태그 모음",
    description: "글에 붙은 태그로 콘텐츠를 모아 보는 페이지입니다.",
    tags: [],
    category: "PAGE",
    date: "2025-01-01",
  },
];

/** 1차 인덱스. 제목, 설명, 태그까지만 담는다. */
export function buildSearchIndex(): SearchDoc[] {
  const insights: SearchDoc[] = getInsights().map((insight) => ({
    href: insightHref(insight.slug),
    type: "insight",
    title: insight.title,
    description: insight.metaDescription || insight.excerpt,
    tags: insight.tags,
    category: insight.category,
    date: toDateOnly(insight.publishedAt),
  }));

  // courseSlug가 없으면 상세 URL을 만들 수 없다. 링크 없는 결과를 내보내지 않는다.
  const classes: SearchDoc[] = getClasses().flatMap((cls) => {
    const href = classHref(cls);
    if (!href) return [];
    return [
      {
        href,
        type: "class" as const,
        title: cls.term,
        description: cls.metaDescription || cls.definition,
        // 별칭도 검색어로 잡히게 태그에 얹는다. 표시에는 쓰지 않는다.
        tags: [...cls.tags, ...(cls.aliases ?? [])],
        category: cls.category,
        date: toDateOnly(cls.publishedAt),
      },
    ];
  });

  const courses: SearchDoc[] = getCourses().map((course) => ({
    href: courseHref(course.slug),
    type: "course",
    title: course.title,
    description: course.metaDescription || course.description.slice(0, 200),
    tags: [],
    category: course.category,
    date: toDateOnly(course.publishedAt),
  }));

  return [...insights, ...classes, ...courses, ...STATIC_PAGES];
}

/** 2차 인덱스. 소제목 전량과 본문 앞부분만 담는다. */
export function buildSearchBodyIndex(): SearchBodyDoc[] {
  const insights: SearchBodyDoc[] = getInsights().map((insight) => ({
    href: insightHref(insight.slug),
    headings: collectHeadings(insight.content),
    body: toPlainText(insight.content).slice(0, BODY_CHAR_LIMIT),
  }));

  const classes: SearchBodyDoc[] = getClasses().flatMap((cls) => {
    const href = classHref(cls);
    if (!href) return [];
    return [
      {
        href,
        headings: collectHeadings(cls.content),
        body: toPlainText(cls.content).slice(0, BODY_CHAR_LIMIT),
      },
    ];
  });

  return [...insights, ...classes];
}
