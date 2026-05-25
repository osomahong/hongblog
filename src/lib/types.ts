export interface Quiz {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Insight {
  slug: string;
  title: string;
  excerpt: string;
  category: "MARKETING" | "AI_TECH" | "DATA";
  tags: string[];
  publishedAt: string;
  highlights?: string[];
  quiz?: Quiz[];
  seriesSlug?: string;
  seriesOrder?: number;
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
  courseSlug: string;
  orderInCourse: number;
  aliases?: string[];
  relatedTerms?: string[];
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
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
  classes: { id: number; slug: string; term: string; definition: string }[];
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
}

export interface ContentByTagResult {
  posts: PostWithTags[];
  faqs: never[];
  classes: ClassWithMeta[];
}
