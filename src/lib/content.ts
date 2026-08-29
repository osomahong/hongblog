import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import type {
  Insight, ClassItem, Course,
  PostWithTags, TrendingItem, CourseWithClasses, ClassWithMeta,
  CategoryStat, NextPrevResult, TagWithId, ContentByTagResult,
} from "./types";
import { classHref } from "./links";
import { stripMarkdown } from "./markdown-text";
import { buildCourseSummary3, buildSummary3 } from "./summary";

// ============================================
// 경로 상수
// ============================================

const CONTENT_DIR = path.join(process.cwd(), "content");
const INSIGHTS_DIR = path.join(CONTENT_DIR, "insights");
const CLASSES_DIR = path.join(CONTENT_DIR, "classes");
const COURSES_DIR = path.join(CONTENT_DIR, "courses");

// ============================================
// 범용 파일 읽기
// ============================================

// 빌드 중에는 content/*.md가 바뀌지 않는데도 페이지마다 디렉터리 전체를 다시 읽고
// gray-matter와 reading-time을 다시 돌리고 있었다. getCourses()처럼 코스마다
// getClassesByCourse()를 부르는 자리에서는 같은 파싱이 코스 수만큼 겹친다.
// 정적 페이지가 290개까지 늘면서 Vercel 빌드 워커가 페이지당 60초 제한에 걸려
// 배포가 간헐적으로 실패했다. 파싱 결과를 워커 프로세스 안에 한 번만 만들어 둔다.
// dev에서는 md를 고치면 바로 보여야 하므로 캐시를 쓰지 않는다.
const USE_CONTENT_CACHE = process.env.NODE_ENV === "production";

const dirCache = new Map<string, unknown[]>();
const fileCache = new Map<string, unknown>();

function parseMdFiles<T>(dir: string, transform: (data: Record<string, unknown>, content: string) => T): T[] {
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((filename) => {
      const raw = fs.readFileSync(path.join(dir, filename), "utf-8");
      const { data, content } = matter(raw);
      return transform(data, content);
    });
}

// 호출부가 결과를 그대로 sort하므로 캐시 원본이 아니라 복사본을 돌려준다.
function readMdFiles<T>(dir: string, transform: (data: Record<string, unknown>, content: string) => T): T[] {
  if (!USE_CONTENT_CACHE) return parseMdFiles(dir, transform);

  const hit = dirCache.get(dir);
  if (hit) return hit.slice() as T[];

  const parsed = parseMdFiles(dir, transform);
  dirCache.set(dir, parsed);
  return parsed.slice();
}

function parseMdFile<T>(dir: string, slug: string, transform: (data: Record<string, unknown>, content: string) => T): T | null {
  const filePath = path.join(dir, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return transform(data, content);
}

// 같은 파일이라도 변환 결과가 다르면 다른 캐시 자리에 넣는다.
// namespace를 빼먹으면 3줄 요약용 원본이 ClassItem 자리를 덮어써 렌더가 깨진다.
function readMdFile<T>(
  dir: string,
  slug: string,
  transform: (data: Record<string, unknown>, content: string) => T,
  namespace = "default"
): T | null {
  if (!USE_CONTENT_CACHE) return parseMdFile(dir, slug, transform);

  const key = `${namespace}:${dir}/${slug}`;
  if (fileCache.has(key)) return fileCache.get(key) as T | null;

  const parsed = parseMdFile(dir, slug, transform);
  fileCache.set(key, parsed);
  return parsed;
}

// ============================================
// 변환 함수
// ============================================

function toInsight(data: Record<string, unknown>, content: string): Insight {
  return {
    slug: data.slug as string,
    title: data.title as string,
    excerpt: stripMarkdown((data.excerpt as string) || ""),
    category: data.category as Insight["category"],
    tags: (data.tags as string[]) || [],
    publishedAt: (data.publishedAt as string) || "2025-01-01T00:00:00.000Z",
    updatedAt: data.updatedAt as string | undefined,
    highlights: data.highlights as string[] | undefined,
    quiz: data.quiz as Insight["quiz"],
    seriesSlug: data.seriesSlug as string | undefined,
    seriesOrder: data.seriesOrder as number | undefined,
    topicCluster: data.topicCluster as string | undefined,
    contentType: data.contentType as Insight["contentType"],
    journeyStage: data.journeyStage as Insight["journeyStage"],
    nextSlugs: (data.nextSlugs as string[]) || [],
    relatedSlugs: (data.relatedSlugs as string[]) || [],
    thumbnailUrl: data.thumbnailUrl as string | undefined,
    metaTitle: data.metaTitle as string | undefined,
    metaDescription: data.metaDescription as string | undefined,
    ogImage: data.ogImage as string | undefined,
    ogTitle: data.ogTitle as string | undefined,
    ogDescription: data.ogDescription as string | undefined,
    content,
    readingTime: Math.ceil(readingTime(content).minutes),
  };
}

function toClassItem(data: Record<string, unknown>, content: string): ClassItem {
  return {
    slug: data.slug as string,
    term: data.term as string,
    definition: stripMarkdown((data.definition as string) || ""),
    category: data.category as ClassItem["category"],
    tags: (data.tags as string[]) || [],
    publishedAt: (data.publishedAt as string) || "2025-01-01T00:00:00.000Z",
    updatedAt: data.updatedAt as string | undefined,
    courseSlug: data.courseSlug as string,
    orderInCourse: (data.orderInCourse as number) || 0,
    aliases: data.aliases as string[] | undefined,
    relatedTerms: data.relatedTerms as string[] | undefined,
    difficulty: (data.difficulty as ClassItem["difficulty"]) || "BEGINNER",
    updateNotice: data.updateNotice as ClassItem["updateNotice"],
    quiz: data.quiz as ClassItem["quiz"],
    metaTitle: data.metaTitle as string | undefined,
    metaDescription: data.metaDescription as string | undefined,
    ogImage: data.ogImage as string | undefined,
    content,
    readingTime: Math.ceil(readingTime(content).minutes),
  };
}

function toCourse(data: Record<string, unknown>, content: string): Course {
  return {
    slug: data.slug as string,
    title: data.title as string,
    category: data.category as Course["category"],
    difficulty: (data.difficulty as Course["difficulty"]) || "BEGINNER",
    publishedAt: data.publishedAt as string,
    metaTitle: data.metaTitle as string | undefined,
    metaDescription: data.metaDescription as string | undefined,
    description: stripMarkdown(content),
  };
}

// ============================================
// 공개 API — Insights
// ============================================

export function getInsights(): Insight[] {
  return readMdFiles(INSIGHTS_DIR, toInsight).sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getInsightBySlug(slug: string): Insight | null {
  return readMdFile(INSIGHTS_DIR, slug, toInsight);
}

export function getInsightsByCategory(category: Insight["category"]): Insight[] {
  return getInsights().filter((i) => i.category === category);
}

// ============================================
// 공개 API — Classes
// ============================================

export function getClasses(): ClassItem[] {
  return readMdFiles(CLASSES_DIR, toClassItem).sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getClassBySlug(slug: string): ClassItem | null {
  return readMdFile(CLASSES_DIR, slug, toClassItem);
}

export function getClassesByCourse(courseSlug: string): ClassItem[] {
  return getClasses()
    .filter((c) => c.courseSlug === courseSlug)
    .sort((a, b) => a.orderInCourse - b.orderInCourse);
}

// ============================================
// 공개 API — Courses
// ============================================

export function getCourses(): Course[] {
  const courses = readMdFiles(COURSES_DIR, toCourse).sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  return courses.map((course) => ({
    ...course,
    classCount: getClassesByCourse(course.slug).length,
  }));
}

export function getCourseBySlug(slug: string): Course | null {
  const course = readMdFile(COURSES_DIR, slug, toCourse);
  if (!course) return null;
  return {
    ...course,
    classCount: getClassesByCourse(course.slug).length,
  };
}

// ============================================
// 공개 API — Tags
// ============================================

// ============================================
// 공개 API — 3줄 요약
// ============================================

/** frontmatter와 본문을 그대로 넘겨받는 변환. 요약 생성에만 쓴다 */
function toRaw(data: Record<string, unknown>, content: string) {
  return { data, content };
}

/** 인사이트 3줄 요약. frontmatter summary3가 있으면 그 값이 우선이다 */
export function getInsightSummary3(slug: string): string[] {
  const raw = readMdFile(INSIGHTS_DIR, slug, toRaw, "raw");
  if (!raw) return [];
  return buildSummary3({
    lead: (raw.data.excerpt as string) || (raw.data.metaDescription as string) || "",
    content: raw.content,
    manual: raw.data.summary3,
  });
}

/** 클래스 3줄 요약. 정의 문장을 첫 줄 재료로 쓴다 */
export function getClassSummary3(slug: string): string[] {
  const raw = readMdFile(CLASSES_DIR, slug, toRaw, "raw");
  if (!raw) return [];
  return buildSummary3({
    lead: (raw.data.definition as string) || (raw.data.metaDescription as string) || "",
    content: raw.content,
    manual: raw.data.summary3,
  });
}

/** 코스 3줄 요약. 소개 문단이 짧아 마지막 줄은 커리큘럼에서 만든다 */
export function getCourseSummary3(slug: string): string[] {
  const raw = readMdFile(COURSES_DIR, slug, toRaw, "raw");
  if (!raw) return [];
  return buildCourseSummary3({
    description: raw.content,
    metaDescription: raw.data.metaDescription as string | undefined,
    classTerms: getClassesByCourse(slug).map((cls) => cls.term),
    manual: raw.data.summary3,
  });
}

export function getAllTags(): { name: string; count: number }[] {
  const tagMap = new Map<string, number>();

  for (const insight of getInsights()) {
    for (const tag of insight.tags) {
      tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
    }
  }

  for (const cls of getClasses()) {
    for (const tag of cls.tags) {
      tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
    }
  }

  return Array.from(tagMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export function getContentByTag(tag: string): ContentByTagResult {
  const insights = getInsights().filter((i) => i.tags.includes(tag));
  const classes = getClasses().filter((c) => c.tags.includes(tag));
  return {
    posts: insights.map(insightToPost),
    faqs: [],
    classes: classes.map((c, idx) => classToMeta(c, idx + 1)),
  };
}

// ============================================
// 원본 queries.ts 호환 함수
// ============================================

function insightToPost(insight: Insight, index?: number): PostWithTags {
  const date = new Date(insight.publishedAt);
  return {
    id: index ?? 0,
    slug: insight.slug,
    title: insight.title,
    excerpt: insight.excerpt,
    content: insight.content,
    category: insight.category,
    tags: insight.tags,
    readingTime: insight.readingTime,
    createdAt: date,
    updatedAt: insight.updatedAt ? new Date(insight.updatedAt) : date,
    publishedAt: date,
    thumbnailUrl: insight.thumbnailUrl || null,
    metaTitle: insight.metaTitle || null,
    metaDescription: insight.metaDescription || null,
    ogImage: insight.ogImage || null,
    ogTitle: insight.ogTitle || null,
    ogDescription: insight.ogDescription || null,
    highlights: insight.highlights || null,
    quiz: insight.quiz || null,
    seriesId: insight.seriesSlug ? 1 : null,
    seriesOrder: insight.seriesOrder || null,
    seriesInfo: insight.seriesSlug
      ? { id: 1, slug: insight.seriesSlug, title: insight.seriesSlug }
      : null,
    topicCluster: insight.topicCluster || null,
    contentType: insight.contentType || null,
    journeyStage: insight.journeyStage || null,
    nextSlugs: insight.nextSlugs || [],
    relatedSlugs: insight.relatedSlugs || [],
  };
}

/** 홈의 최근 7일 인기 글 데이터와 동일한 소스를 상세 페이지 배지에도 사용한다. */
export function getTrendingInsightSlugs(): Set<string> {
  try {
    const raw = fs.readFileSync(
      path.join(process.cwd(), "scripts/data/trending.json"),
      "utf-8",
    );
    const data = JSON.parse(raw) as { generatedAt?: string; slugs?: string[] };
    const generatedAt = data.generatedAt ? new Date(data.generatedAt).getTime() : Number.NaN;
    const maxAgeMs = 48 * 60 * 60 * 1000;
    if (!Number.isFinite(generatedAt) || Date.now() - generatedAt > maxAgeMs) {
      return new Set();
    }
    return new Set(data.slugs ?? []);
  } catch {
    return new Set();
  }
}

function classToMeta(cls: ClassItem, index?: number): ClassWithMeta {
  const date = new Date(cls.publishedAt);
  return {
    id: index ?? 0,
    slug: cls.slug,
    term: cls.term,
    definition: cls.definition,
    content: cls.content,
    category: cls.category,
    tags: cls.tags,
    difficulty: cls.difficulty,
    aliases: cls.aliases || null,
    relatedTerms: cls.relatedTerms || null,
    createdAt: date,
    updatedAt: cls.updatedAt ? new Date(cls.updatedAt) : date,
    publishedAt: date,
    ogImage: cls.ogImage || null,
    metaTitle: cls.metaTitle || null,
    metaDescription: cls.metaDescription || null,
    updateNotice: cls.updateNotice || null,
    quiz: cls.quiz || null,
    courseInfo: cls.courseSlug ? { id: 1, slug: cls.courseSlug } : null,
  };
}

export function getPublishedPosts(): PostWithTags[] {
  return getInsights().map((i, idx) => insightToPost(i, idx + 1));
}

export function getPostBySlug(slug: string): PostWithTags | null {
  const insight = getInsightBySlug(slug);
  if (!insight) return null;
  return insightToPost(insight, 1);
}

export function getPublishedCourses(): CourseWithClasses[] {
  return getCourses().map((course, idx) => {
    const classes = getClassesByCourse(course.slug);
    return {
      id: idx + 1,
      slug: course.slug,
      title: course.title,
      description: course.description,
      category: course.category,
      difficulty: course.difficulty,
      createdAt: new Date(course.publishedAt),
      classCount: classes.length,
      metaTitle: course.metaTitle || null,
      metaDescription: course.metaDescription || null,
      totalReadingTime: classes.reduce((sum, cls) => sum + cls.readingTime, 0),
      classes: classes.map((cls, i) => ({
        id: i + 1,
        slug: cls.slug,
        term: cls.term,
        definition: cls.definition,
        readingTime: cls.readingTime,
      })),
    };
  });
}

export function getPublishedCourseBySlug(slug: string): CourseWithClasses | null {
  const course = getCourseBySlug(slug);
  if (!course) return null;
  const classes = getClassesByCourse(slug);
  return {
    id: 1,
    slug: course.slug,
    title: course.title,
    description: course.description,
    category: course.category,
    difficulty: course.difficulty,
    createdAt: new Date(course.publishedAt),
    classCount: classes.length,
    metaTitle: course.metaTitle || null,
    metaDescription: course.metaDescription || null,
    totalReadingTime: classes.reduce((sum, cls) => sum + cls.readingTime, 0),
    classes: classes.map((cls, i) => ({
      id: i + 1,
      slug: cls.slug,
      term: cls.term,
      definition: cls.definition,
      readingTime: cls.readingTime,
    })),
  };
}

export function getClassBySlugWithMeta(slug: string): ClassWithMeta | null {
  const cls = getClassBySlug(slug);
  if (!cls) return null;
  return classToMeta(cls, 1);
}

/**
 * 홈 TRENDING NOW: GA4 최근 7일 조회수 기준 인기 인사이트.
 * scripts/update-trending.ts가 생성하는 scripts/data/trending.json을 읽고,
 * 파일이 없거나 부족하면 최신 글로 채운다.
 */
export function getTrendingMixed(_days: number, limit: number): TrendingItem[] {
  const insights = getInsights();
  const bySlug = new Map(insights.map((i) => [i.slug, i]));

  let picked: Insight[] = [];
  try {
    const raw = fs.readFileSync(
      path.join(process.cwd(), "scripts/data/trending.json"),
      "utf-8",
    );
    const data = JSON.parse(raw) as { slugs?: string[] };
    picked = (data.slugs ?? [])
      .map((slug) => bySlug.get(slug))
      .filter((i): i is Insight => Boolean(i));
  } catch {
    // trending.json이 없으면 아래에서 최신 글로 채운다
  }

  for (const i of insights) {
    if (picked.length >= limit) break;
    if (!picked.includes(i)) picked.push(i);
  }

  return picked.slice(0, limit).map((i, idx) => ({
    _type: "post" as const,
    id: idx + 1,
    slug: i.slug,
    title: i.title,
    category: i.category,
    excerpt: i.excerpt,
  }));
}

export function getCategoryStats(): CategoryStat[] {
  const insights = getInsights();
  const catMap = new Map<string, number>();
  for (const i of insights) {
    catMap.set(i.category, (catMap.get(i.category) || 0) + 1);
  }
  return Array.from(catMap.entries()).map(([category, postCount]) => ({
    category,
    postCount,
    faqCount: 0,
  }));
}


export function getRelatedClassesForPost(tags: string[], _category: string, limit: number): ClassWithMeta[] {
  const all = getClasses();
  return all
    .filter((cls) => cls.tags.some((t) => tags.includes(t)))
    .slice(0, limit)
    .map((cls, i) => classToMeta(cls, i + 1));
}

export function getRelatedPostsForClass(tags: string[], _category: string, limit: number): PostWithTags[] {
  const all = getInsights();
  return all
    .filter((i) => i.tags.some((t) => tags.includes(t)))
    .slice(0, limit)
    .map((i, idx) => insightToPost(i, idx + 1));
}

export function getClassesBySlugs(slugs: string[]): ClassWithMeta[] {
  const all = getClasses();
  return slugs
    .map((slug) => {
      const idx = all.findIndex((c) => c.slug === slug);
      return idx >= 0 ? classToMeta(all[idx], idx + 1) : null;
    })
    .filter((c): c is ClassWithMeta => c !== null);
}

export function getRelatedClassesByTags(tags: string[], excludeId: number, limit: number): ClassWithMeta[] {
  const all = getClasses();
  return all
    .filter((cls, i) => i + 1 !== excludeId && cls.tags.some((t) => tags.includes(t)))
    .slice(0, limit)
    .map((cls, i) => classToMeta(cls, i + 1));
}


/**
 * 같은 코스 안에서의 이전/다음 클래스를 구한다.
 * slug로 조회한다. 인덱스 기반으로 찾으면 호출부가 넘기는 id가 실제 정렬 순서와
 * 어긋날 때 엉뚱한 클래스의 이웃이 나오고, 그 링크가 다른 코스 경로에 붙어 404가 된다.
 */
export function getNextPrevClass(classSlug: string): NextPrevResult {
  const cls = getClassBySlug(classSlug);
  if (!cls) return { prev: null, next: null, currentIndex: 0, totalCount: 0 };

  const siblings = getClassesByCourse(cls.courseSlug);
  const idx = siblings.findIndex((s) => s.slug === cls.slug);
  if (idx < 0) return { prev: null, next: null, currentIndex: 0, totalCount: siblings.length };

  function toNav(c: ClassItem, i: number) {
    return { id: i + 1, slug: c.slug, term: c.term, courseInfo: c.courseSlug ? { id: 1, slug: c.courseSlug } : null };
  }

  return {
    prev: idx > 0 ? toNav(siblings[idx - 1], idx - 1) : null,
    next: idx < siblings.length - 1 ? toNav(siblings[idx + 1], idx + 1) : null,
    currentIndex: idx + 1,
    totalCount: siblings.length,
  };
}


export function getAllTagsWithId(): TagWithId[] {
  return getAllTags().map(({ name, count }, i) => ({ id: i + 1, name, count }));
}

export interface TagPreviewItem {
  tag: TagWithId;
  title: string;
  excerpt: string;
  href: string;
  category: string;
  contentType: "insight" | "class";
}

/**
 * /tags 허브 페이지 미리보기용 추천 태그를 뽑는다.
 * scripts/update-featured-tags.ts가 생성하는 GA4 실제 조회수 기반
 * scripts/data/featured-tags.json을 우선 순서로 쓰고, 이후 남은 태그는
 * 콘텐츠 개수 순으로 이어 붙여 후보 목록을 만든다.
 *
 * 한 글에 태그가 여러 개 붙어 있으면 같은 글이 여러 카드에 중복 노출될 수 있으므로,
 * 이미 카드로 쓰인 글(href)은 다시 쓰지 않는다. 그 태그에 아직 안 쓴 글이 없으면
 * 그 태그는 건너뛰고 다음 후보 태그로 넘어가 limit개를 채운다.
 */
function getFeaturedTagCandidates(): TagWithId[] {
  const allTags = getAllTagsWithId();
  const byName = new Map(allTags.map((t) => [t.name, t]));

  let priorityNames: string[] = [];
  try {
    const raw = fs.readFileSync(
      path.join(process.cwd(), "scripts/data/featured-tags.json"),
      "utf-8",
    );
    const data = JSON.parse(raw) as { tags?: string[] };
    priorityNames = data.tags ?? [];
  } catch {
    // featured-tags.json이 없으면 콘텐츠 개수 순 태그만 후보가 된다
  }

  const priorityTags = priorityNames
    .map((name) => byName.get(name))
    .filter((t): t is TagWithId => Boolean(t));
  const restTags = allTags.filter((t) => !priorityNames.includes(t.name));
  return [...priorityTags, ...restTags];
}

/**
 * /tags 허브의 "전체 태그" 목록 위에 배치할 추천 태그 칩 목록.
 * GA4 실제 조회수 기반 순서(getFeaturedTagCandidates)를 그대로 앞에서부터 자른다.
 */
export function getFeaturedTags(limit: number): TagWithId[] {
  return getFeaturedTagCandidates().slice(0, limit);
}

export function getFeaturedTagPreviews(limit: number): TagPreviewItem[] {
  const candidates = getFeaturedTagCandidates();
  const usedHrefs = new Set<string>();
  const result: TagPreviewItem[] = [];

  for (const tag of candidates) {
    if (result.length >= limit) break;

    const { posts, classes } = getContentByTag(tag.name);
    const post = posts.find((p) => !usedHrefs.has(`/insights/${p.slug}`));
    if (post) {
      const href = `/insights/${post.slug}`;
      usedHrefs.add(href);
      result.push({
        tag,
        title: post.title,
        excerpt: post.excerpt,
        href,
        category: post.category,
        contentType: "insight",
      });
      continue;
    }

    const cls = classes.find((c) => {
      const h = classHref(c);
      return h !== null && !usedHrefs.has(h);
    });
    const clsHref = cls ? classHref(cls) : null;
    if (cls && clsHref) {
      const href = clsHref;
      usedHrefs.add(href);
      result.push({
        tag,
        title: cls.term,
        excerpt: cls.definition,
        href,
        category: cls.category,
        contentType: "class",
      });
      continue;
    }

    // 이 태그가 가진 글이 전부 다른 카드에 이미 쓰였음 → 태그를 건너뛰고 다음 후보로
  }

  return result;
}
