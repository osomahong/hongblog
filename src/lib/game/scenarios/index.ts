/**
 * 챕터 레지스트리. 챕터 추가 = import 1줄 + 항목 1줄.
 */

import { CHAPTER1 } from "./chapter1";
import type { ChapterSpec } from "./schema";

const CHAPTERS: readonly ChapterSpec[] = [CHAPTER1];

export function getChapter(id: string): ChapterSpec | undefined {
  return CHAPTERS.find((chapter) => chapter.id === id);
}

export function getDefaultChapter(): ChapterSpec {
  return CHAPTERS[0];
}

export function listChapters(): readonly ChapterSpec[] {
  return CHAPTERS;
}

/** 챕터가 참조하는 모든 클래스/코스 slug (서버에서 링크 맵 생성용) */
export function collectClassSlugs(chapter: ChapterSpec): string[] {
  const slugs = new Set<string>();
  chapter.concepts.forEach((concept) => slugs.add(concept.classSlug));
  chapter.days.forEach((day) =>
    day.insightSlugs.forEach((slug) => slugs.add(slug)),
  );
  Object.values(chapter.gameOverTexts).forEach((text) => {
    if (text.classSlug) slugs.add(text.classSlug);
  });
  return [...slugs];
}
