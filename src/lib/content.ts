import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import type {
  Insight, ClassItem, Course,
  PostWithTags, TrendingItem, CourseWithClasses, ClassWithMeta,
  CategoryStat, NextPrevResult, TagWithId, ContentByTagResult,
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

// raw text 영역(카드 description, excerpt 등)에서 마크다운 기호를 제거한다.
// 본문 자체(content)는 그대로 두고, 별도로 노출되는 짧은 미리보기 문자열에만 사용.
function stripMarkdown(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, "") // 코드 블록 제거
    .replace(/<a [^>]*>[\s\S]*?<\/a>/g, "") // inline anchor 태그 제거
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1") // 이미지
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // 링크
    .replace(/`([^`\n]+)`/g, "$1") // 인라인 코드
    .replace(/\*\*\*([^*\n]+)\*\*\*/g, "$1") // bold+italic
    .replace(/\*\*([^*\n]+)\*\*/g, "$1") // bold
    .replace(/__([^_\n]+)__/g, "$1") // bold (underscore)
    .replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, "$1") // italic
    .replace(/(?<!_)_([^_\n]+)_(?!_)/g, "$1") // italic (underscore)
    .replace(/^#{1,6}\s+/gm, "") // 헤딩 prefix
    .replace(/^>\s*/gm, "") // blockquote
    .replace(/^[\s]*[-*+]\s+/gm, "") // 리스트 마커
    .replace(/^[\s]*\d+\.\s+/gm, "") // 번호 리스트
    .replace(/^---+\s*$/gm, "") // 수평선
    .replace(/\n{3,}/g, "\n\n") // 빈 줄 압축
    .trim();
}

function toInsight(data: Record<string, unknown>, content: string): Insight {
  return {
    slug: data.slug as string,
    title: data.title as string,
    excerpt: stripMarkdown((data.excerpt as string) || ""),
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
    definition: stripMarkdown((data.definition as string) || ""),
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
    createdAt: date,
    updatedAt: date,
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
    createdAt: new Date(course.publishedAt),
    classCount: classes.length,
    metaTitle: course.metaTitle || null,
    metaDescription: course.metaDescription || null,
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

export function getRelatedClassesByTags(tags: string[], excludeId: number, limit: number): ClassWithMeta[] {
  const all = getClasses();
  return all
    .filter((cls, i) => i + 1 !== excludeId && cls.tags.some((t) => tags.includes(t)))
    .slice(0, limit)
    .map((cls, i) => classToMeta(cls, i + 1));
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

    const cls = classes.find(
      (c) => !usedHrefs.has(`/class/${c.courseInfo?.slug ?? ""}/${c.slug}`),
    );
    if (cls) {
      const href = `/class/${cls.courseInfo?.slug ?? ""}/${cls.slug}`;
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
