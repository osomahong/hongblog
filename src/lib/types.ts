/**
 * 발행 후 사실이 달라져 본문을 고쳤을 때 글 상단에 남기는 변경 기록.
 * 개발 노트의 Notice처럼 무엇이 추가되고 삭제됐는지만 담백하게 적는다.
 */
export interface UpdateNotice {
  /** 표기용 시점. "2026-07" 형식 */
  date: string;
  /** 변경 항목. 한 줄에 하나씩 */
  items: string[];
}

export interface Quiz {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export type InsightContentType = "concept" | "guide" | "comparison" | "news" | "case";
export type InsightJourneyStage = "beginner" | "practical" | "advanced";

export interface Insight {
  slug: string;
  title: string;
  excerpt: string;
  category: "MARKETING" | "AI_TECH" | "DATA";
  tags: string[];
  publishedAt: string;
  /** 실질적 내용 수정일. 없으면 publishedAt을 쓴다. */
  updatedAt?: string;
  highlights?: string[];
  quiz?: Quiz[];
  seriesSlug?: string;
  seriesOrder?: number;
  /** 추천과 주제 허브에 사용하는 편집 메타데이터. canonical tag와 역할을 분리한다. */
  topicCluster?: string;
  contentType?: InsightContentType;
  journeyStage?: InsightJourneyStage;
  nextSlugs?: string[];
  relatedSlugs?: string[];
  thumbnailUrl?: string;
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  content: string;
  readingTime: number;
}

export interface ClassItem {
  slug: string;
  term: string;
  definition: string;
  category: "MARKETING" | "AI_TECH" | "CLAUDE_EDUCATION";
  tags: string[];
  publishedAt: string;
  /** 실질적 내용 수정일. 없으면 publishedAt을 쓴다. */
  updatedAt?: string;
  courseSlug: string;
  orderInCourse: number;
  aliases?: string[];
  relatedTerms?: string[];
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  updateNotice?: UpdateNotice;
  quiz?: Quiz[];
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  content: string;
  readingTime: number;
}

export interface Course {
  slug: string;
  title: string;
  category: "MARKETING" | "AI_TECH" | "CLAUDE_EDUCATION";
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  publishedAt: string;
  metaTitle?: string;
  metaDescription?: string;
  description: string;
  classCount?: number;
}

export type ContentItem = Insight | ClassItem;

// ============================================
// 원본 queries.ts 호환 타입
// ============================================

export interface PostWithTags {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  readingTime: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
  thumbnailUrl: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  ogImage: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  highlights: unknown;
  quiz: Quiz[] | null;
  seriesId: number | null;
  seriesOrder: number | null;
  seriesInfo: { id: number; slug: string; title: string } | null;
  topicCluster: string | null;
  contentType: InsightContentType | null;
  journeyStage: InsightJourneyStage | null;
  nextSlugs: string[];
  relatedSlugs: string[];
}

export interface TrendingItem {
  _type: "post";
  id: number;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
}

export interface CourseWithClasses {
  id: number;
  slug: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  createdAt: Date;
  classCount: number;
  metaTitle: string | null;
  metaDescription: string | null;
  totalReadingTime: number;
  classes: { id: number; slug: string; term: string; definition: string; readingTime: number }[];
}

export interface ClassWithMeta {
  id: number;
  slug: string;
  term: string;
  definition: string;
  content: string;
  category: string;
  tags: string[];
  difficulty: string;
  aliases: string[] | null;
  relatedTerms: string[] | null;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
  ogImage: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  quiz: Quiz[] | null;
  updateNotice: UpdateNotice | null;
  courseInfo: { id: number; slug: string } | null;
}

export interface CategoryStat {
  category: string;
  postCount: number;
  faqCount: number;
}

export interface NextPrevResult {
  prev: { id: number; slug: string; term: string; courseInfo: { id: number; slug: string } | null } | null;
  next: { id: number; slug: string; term: string; courseInfo: { id: number; slug: string } | null } | null;
  currentIndex: number;
  totalCount: number;
}


export interface TagWithId {
  id: number;
  name: string;
  count: number;
}

export interface ContentByTagResult {
  posts: PostWithTags[];
  faqs: never[];
  classes: ClassWithMeta[];
}
