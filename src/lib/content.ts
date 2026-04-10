import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import type {
  Insight, ClassItem, Course,
  PostWithTags, TrendingItem, CourseWithClasses, ClassWithMeta,
  CategoryStat, NextPrevResult, SeriesNavResult, TagWithId, ContentByTagResult,
} from "./types";

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

function readMdFiles<T>(dir: string, transform: (data: Record<string, unknown>, content: string) => T): T[] {
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

function readMdFile<T>(dir: string, slug: string, transform: (data: Record<string, unknown>, content: string) => T): T | null {
  const filePath = path.join(dir, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return transform(data, content);
}

// ============================================
// 변환 함수
// ============================================

function toInsight(data: Record<string, unknown>, content: string): Insight {
  return {
    slug: data.slug as string,
    title: data.title as string,
    excerpt: (data.excerpt as string) || "",
    category: data.category as Insight["category"],
    tags: (data.tags as string[]) || [],
    publishedAt: (data.publishedAt as string) || "2025-01-01T00:00:00.000Z",
    highlights: data.highlights as string[] | undefined,
    quiz: data.quiz as Insight["quiz"],
    seriesSlug: data.seriesSlug as string | undefined,
    seriesOrder: data.seriesOrder as number | undefined,
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
    definition: (data.definition as string) || "",
    category: data.category as ClassItem["category"],
    tags: (data.tags as string[]) || [],
    publishedAt: (data.publishedAt as string) || "2025-01-01T00:00:00.000Z",
    courseSlug: data.courseSlug as string,
    orderInCourse: (data.orderInCourse as number) || 0,
    aliases: data.aliases as string[] | undefined,
    relatedTerms: data.relatedTerms as string[] | undefined,
    difficulty: (data.difficulty as ClassItem["difficulty"]) || "BEGINNER",
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
    description: content,
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
  return {
    posts: insights.map(insightToPost),
    faqs: [],
    classes: [],
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
    createdAt: date,
    updatedAt: date,
    publishedAt: date,
    thumbnailUrl: insight.thumbnailUrl || null,
    metaTitle: insight.metaTitle || null,
    metaDescription: insight.metaDescription || null,
    ogImage: insight.ogImage || null,
    ogTitle: insight.ogTitle || null,
    ogDescription: insight.ogDescription || null,
    canonicalUrl: null,
    noIndex: null,
    highlights: insight.highlights || null,
    quiz: insight.quiz || null,
    seriesId: insight.seriesSlug ? 1 : null,
    seriesOrder: insight.seriesOrder || null,
    seriesInfo: insight.seriesSlug
      ? { id: 1, slug: insight.seriesSlug, title: insight.seriesSlug }
      : null,
  };
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
    updatedAt: date,
    publishedAt: date,
    ogImage: cls.ogImage || null,
    metaTitle: cls.metaTitle || null,
    metaDescription: cls.metaDescription || null,
    canonicalUrl: null,
    noIndex: null,
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
      thumbnailUrl: null,
      createdAt: new Date(course.publishedAt),
      classCount: classes.length,
      ogImage: null,
      metaTitle: course.metaTitle || null,
      metaDescription: course.metaDescription || null,
      canonicalUrl: null,
      classes: classes.map((cls, i) => ({
        id: i + 1,
        slug: cls.slug,
        term: cls.term,
        definition: cls.definition,
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
    thumbnailUrl: null,
    createdAt: new Date(course.publishedAt),
    classCount: classes.length,
    ogImage: null,
    metaTitle: course.metaTitle || null,
    metaDescription: course.metaDescription || null,
    canonicalUrl: null,
    classes: classes.map((cls, i) => ({
      id: i + 1,
      slug: cls.slug,
      term: cls.term,
      definition: cls.definition,
    })),
  };
}

export function getClassBySlugWithMeta(slug: string): ClassWithMeta | null {
  const cls = getClassBySlug(slug);
  if (!cls) return null;
  return classToMeta(cls, 1);
}

export function getTrendingMixed(_days: number, limit: number): TrendingItem[] {
  return getInsights()
    .slice(0, limit)
    .map((i, idx) => ({
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

export function getPopularFaqs(..._args: unknown[]): { id: number; slug: string; question: string; tags: string[] }[] {
  return [];
}

export function getRelatedFaqsWithPopularity(..._args: unknown[]): { id: number; slug: string; question: string }[] {
  return [];
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

export function getRelatedClassesByTags(tags: string[], excludeId: number, limit: number): ClassWithMeta[] {
  const all = getClasses();
  return all
    .filter((cls, i) => i + 1 !== excludeId && cls.tags.some((t) => tags.includes(t)))
    .slice(0, limit)
    .map((cls, i) => classToMeta(cls, i + 1));
}

export function getSeriesNavigation(seriesId: number, currentId: number): SeriesNavResult | null {
  const posts = getPublishedPosts().filter((p) => p.seriesId === seriesId);
  if (posts.length === 0) return null;
  posts.sort((a, b) => (a.seriesOrder ?? 0) - (b.seriesOrder ?? 0));
  const idx = posts.findIndex((p) => p.id === currentId);
  if (idx === -1) return null;
  return {
    prev: idx > 0 ? { id: posts[idx - 1].id, slug: posts[idx - 1].slug, title: posts[idx - 1].title } : null,
    next: idx < posts.length - 1 ? { id: posts[idx + 1].id, slug: posts[idx + 1].slug, title: posts[idx + 1].title } : null,
    currentIndex: idx,
    totalCount: posts.length,
  };
}

export function getNextPrevClass(classId: number): NextPrevResult {
  const all = getClasses();
  const cls = all.find((_, i) => i + 1 === classId);
  if (!cls) return { prev: null, next: null, currentIndex: 0, totalCount: 0 };

  const siblings = getClassesByCourse(cls.courseSlug);
  const idx = siblings.findIndex((s) => s.slug === cls.slug);

  function toNav(c: ClassItem, i: number) {
    return { id: i + 1, slug: c.slug, term: c.term, courseInfo: c.courseSlug ? { id: 1, slug: c.courseSlug } : null };
  }

  return {
    prev: idx > 0 ? toNav(siblings[idx - 1], idx - 1) : null,
    next: idx < siblings.length - 1 ? toNav(siblings[idx + 1], idx + 1) : null,
    currentIndex: idx,
    totalCount: siblings.length,
  };
}

export function getPublishedLogs(): never[] {
  return [];
}

export function getAllTagsWithId(): TagWithId[] {
  return getAllTags().map(({ name }, i) => ({ id: i + 1, name }));
}
