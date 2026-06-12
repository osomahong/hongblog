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
