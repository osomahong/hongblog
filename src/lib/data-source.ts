/**
 * 데이터 소스 라우터 - 공개 페이지용 re-export 모듈
 * JSON 읽기 실패 시 DB fallback (안전장치)
 *
 * 모든 함수의 반환 타입은 queries.ts (DB) 기준으로 명시.
 */
import * as jsonData from "./data";
import * as dbQueries from "./queries";

// Re-export types from queries
export type { PostWithTags, FaqWithTags, SeriesWithPosts, CourseWithClasses, TrendingItem } from "./queries";

// --- Posts ---
export async function getPublishedPosts(): ReturnType<typeof dbQueries.getPublishedPosts> {
  try { return await jsonData.getPublishedPosts() as Awaited<ReturnType<typeof dbQueries.getPublishedPosts>>; }
  catch { return dbQueries.getPublishedPosts(); }
}

export async function getPostBySlug(slug: string): ReturnType<typeof dbQueries.getPostBySlug> {
  try { return await jsonData.getPostBySlug(slug) as Awaited<ReturnType<typeof dbQueries.getPostBySlug>>; }
  catch { return dbQueries.getPostBySlug(slug); }
}

// --- FAQs ---
export async function getPublishedFaqs(): ReturnType<typeof dbQueries.getPublishedFaqs> {
  try { return await jsonData.getPublishedFaqs() as Awaited<ReturnType<typeof dbQueries.getPublishedFaqs>>; }
  catch { return dbQueries.getPublishedFaqs(); }
}

export async function getFaqBySlug(slug: string): ReturnType<typeof dbQueries.getFaqBySlug> {
  try { return await jsonData.getFaqBySlug(slug) as Awaited<ReturnType<typeof dbQueries.getFaqBySlug>>; }
  catch { return dbQueries.getFaqBySlug(slug); }
}

// --- Courses ---
export async function getPublishedCourses(): ReturnType<typeof dbQueries.getPublishedCourses> {
  try { return await jsonData.getPublishedCourses() as Awaited<ReturnType<typeof dbQueries.getPublishedCourses>>; }
  catch { return dbQueries.getPublishedCourses(); }
}

export async function getCourseBySlug(slug: string): ReturnType<typeof dbQueries.getCourseBySlug> {
  try { return await jsonData.getCourseBySlug(slug) as Awaited<ReturnType<typeof dbQueries.getCourseBySlug>>; }
  catch { return dbQueries.getCourseBySlug(slug); }
}

// --- Classes ---
export async function getPublishedClasses(): ReturnType<typeof dbQueries.getPublishedClasses> {
  try { return await jsonData.getPublishedClasses() as Awaited<ReturnType<typeof dbQueries.getPublishedClasses>>; }
  catch { return dbQueries.getPublishedClasses(); }
}

export async function getClassBySlug(slug: string): ReturnType<typeof dbQueries.getClassBySlug> {
  try { return await jsonData.getClassBySlug(slug) as Awaited<ReturnType<typeof dbQueries.getClassBySlug>>; }
  catch { return dbQueries.getClassBySlug(slug); }
}

// --- Series ---
export async function getPublishedSeries(): ReturnType<typeof dbQueries.getPublishedSeries> {
  try { return await jsonData.getPublishedSeries() as Awaited<ReturnType<typeof dbQueries.getPublishedSeries>>; }
  catch { return dbQueries.getPublishedSeries(); }
}

export async function getSeriesBySlug(slug: string): ReturnType<typeof dbQueries.getSeriesBySlug> {
  try { return await jsonData.getSeriesBySlug(slug) as Awaited<ReturnType<typeof dbQueries.getSeriesBySlug>>; }
  catch { return dbQueries.getSeriesBySlug(slug); }
}

// --- Logs ---
export async function getPublishedLogs(): ReturnType<typeof dbQueries.getPublishedLogs> {
  try { return await jsonData.getPublishedLogs() as Awaited<ReturnType<typeof dbQueries.getPublishedLogs>>; }
  catch { return dbQueries.getPublishedLogs(); }
}

export async function getPublishedLifeLogsPersonal(): ReturnType<typeof dbQueries.getPublishedLifeLogsPersonal> {
  try { return await jsonData.getPublishedLifeLogsPersonal() as Awaited<ReturnType<typeof dbQueries.getPublishedLifeLogsPersonal>>; }
  catch { return dbQueries.getPublishedLifeLogsPersonal(); }
}

export async function getLogBySlug(
  slug: string,
  options?: { includeUnpublished?: boolean },
): ReturnType<typeof dbQueries.getLogBySlug> {
  try {
    if (options?.includeUnpublished) {
      return dbQueries.getLogBySlug(slug, options);
    }
    return await jsonData.getLogBySlug(slug) as Awaited<ReturnType<typeof dbQueries.getLogBySlug>>;
  }
  catch { return dbQueries.getLogBySlug(slug, options); }
}

// --- Tags ---
export async function getAllTags(): ReturnType<typeof dbQueries.getAllTags> {
  try { return await jsonData.getAllTags() as Awaited<ReturnType<typeof dbQueries.getAllTags>>; }
  catch { return dbQueries.getAllTags(); }
}

export async function getContentByTag(tagName: string): ReturnType<typeof dbQueries.getContentByTag> {
  try { return await jsonData.getContentByTag(tagName) as Awaited<ReturnType<typeof dbQueries.getContentByTag>>; }
  catch { return dbQueries.getContentByTag(tagName); }
}

// --- Categories ---
export async function getCategoryStats(): ReturnType<typeof dbQueries.getCategoryStats> {
  try { return await jsonData.getCategoryStats() as Awaited<ReturnType<typeof dbQueries.getCategoryStats>>; }
  catch { return dbQueries.getCategoryStats(); }
}

// These always use DB for real-time data
export { getTrendingMixed, getPopularFaqs } from "./queries";

// Related content - these use DB directly since they need complex joins
export {
  getRelatedFaqsWithPopularity,
  getRelatedPostsWithPopularity,
  getRelatedClassesForPost,
  getRelatedClassesByTags,
  getRelatedPostsForClass,
  getSeriesNavigation,
  getNextPrevClass,
  getRelatedLogsWithPopularity,
  getPublishedPostsByCategory,
  getPublishedFaqsByCategory,
  getViewCount,
  recordView,
} from "./queries";
