/**
 * JSON 리더 모듈 - src/data/generated/ 디렉토리에서 정적 JSON 데이터를 읽어옵니다.
 * queries.ts와 동일한 함수 시그니처를 가집니다.
 */
import fs from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "src/data/generated");

function dateReviver(_key: string, value: unknown): unknown {
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
    return new Date(value);
  }
  return value;
}

async function readJson<T>(filePath: string): Promise<T> {
  const fullPath = path.join(DATA_DIR, filePath);
  const content = await fs.readFile(fullPath, "utf-8");
  return JSON.parse(content, dateReviver) as T;
}

// Posts
export async function getPublishedPosts() {
  return readJson<any[]>("posts/_index.json");
}

export async function getPostBySlug(slug: string) {
  return readJson<any>(`posts/${slug}.json`).catch(() => null);
}

// FAQs
export async function getPublishedFaqs() {
  return readJson<any[]>("faqs/_index.json");
}

export async function getFaqBySlug(slug: string) {
  return readJson<any>(`faqs/${slug}.json`).catch(() => null);
}

// Courses
export async function getPublishedCourses() {
  return readJson<any[]>("courses/_index.json");
}

export async function getCourseBySlug(slug: string) {
  return readJson<any>(`courses/${slug}.json`).catch(() => null);
}

// Classes
export async function getPublishedClasses() {
  // Not stored as _index, read from courses
  const courses = await getPublishedCourses();
  return courses.flatMap((c: any) => c.classes || []);
}

export async function getClassBySlug(slug: string) {
  return readJson<any>(`classes/${slug}.json`).catch(() => null);
}

// Series
export async function getPublishedSeries() {
  return readJson<any[]>("series/_index.json");
}

export async function getSeriesBySlug(slug: string) {
  return readJson<any>(`series/${slug}.json`).catch(() => null);
}

// Logs
export async function getPublishedLogs() {
  return readJson<any[]>("logs/_index.json");
}

export async function getPublishedLifeLogsPersonal() {
  return readJson<any[]>("logs/personal.json");
}

export async function getLogBySlug(slug: string) {
  return readJson<any>(`logs/${slug}.json`).catch(() => null);
}

// Tags
export async function getAllTags() {
  return readJson<any[]>("tags/_index.json");
}

export async function getContentByTag(tagName: string) {
  return readJson<any>(`tags/${tagName}.json`).catch(() => null);
}

// Categories
export async function getCategoryStats() {
  return readJson<any[]>("categories/stats.json");
}

// Trending (these read JSON snapshots - caller decides if they want fresh DB data instead)
export async function getTrendingMixed(_days?: number, _limit?: number) {
  return readJson<any[]>("trending/mixed.json");
}

export async function getPopularFaqs(_days?: number, _limit?: number) {
  return readJson<any[]>("trending/popular-faqs.json");
}

// Related content from detail JSON files
export async function getRelatedFaqsForPost(slug: string) {
  const data = await readJson<any>(`posts/${slug}.json`).catch(() => null);
  return data?.relatedFaqs || [];
}

export async function getRelatedClassesForPostBySlug(slug: string) {
  const data = await readJson<any>(`posts/${slug}.json`).catch(() => null);
  return data?.relatedClasses || [];
}

export async function getSeriesNavigationForPost(slug: string) {
  const data = await readJson<any>(`posts/${slug}.json`).catch(() => null);
  return data?.seriesNav || null;
}
