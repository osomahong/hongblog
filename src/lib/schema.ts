import { pgTable, serial, text, varchar, timestamp, boolean, jsonb, primaryKey, date, integer, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Content Type Enum
export const contentTypeEnum = ["post", "faq", "log", "class"] as const;
export type ContentType = (typeof contentTypeEnum)[number];

// LifeLog Category Enum
export const lifeLogCategoryEnum = ["FOOD", "LECTURE", "CULTURE", "TRAVEL", "DAILY"] as const;
export type LifeLogCategory = (typeof lifeLogCategoryEnum)[number];

// Enums
export const categoryEnum = ["MARKETING", "AI_TECH", "DATA", "맛집", "강의", "문화생활", "여행", "일상"] as const;
export type Category = (typeof categoryEnum)[number];

// Series Table (시리즈 - 재생목록 형태)
export const series = pgTable("series", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  thumbnailUrl: varchar("thumbnail_url", { length: 500 }),
  isPublished: boolean("is_published").default(false).notNull(),
  // SEO Metadata
  metaTitle: varchar("meta_title", { length: 70 }),
  metaDescription: varchar("meta_description", { length: 170 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Posts Table
export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  category: varchar("category", { length: 50 }).$type<Category>().notNull(),
  highlights: jsonb("highlights").$type<string[]>(),
  thumbnailUrl: varchar("thumbnail_url", { length: 500 }),
  isPublished: boolean("is_published").default(false).notNull(),
  // SEO Metadata
  metaTitle: varchar("meta_title", { length: 70 }),
  metaDescription: varchar("meta_description", { length: 170 }),
  ogImage: varchar("og_image", { length: 500 }),
  ogTitle: varchar("og_title", { length: 100 }),
  ogDescription: varchar("og_description", { length: 200 }),
  canonicalUrl: varchar("canonical_url", { length: 500 }),
  noIndex: boolean("no_index").default(false),
  // Series 연결
  seriesId: integer("series_id").references(() => series.id, { onDelete: "set null" }),
  seriesOrder: integer("series_order"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => [
  index("idx_posts_series").on(t.seriesId, t.seriesOrder),
]);

// FAQs Table
export const faqs = pgTable("faqs", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  category: varchar("category", { length: 50 }).$type<Category>().notNull(),
  // Additional Metadata
  recommendedYear: varchar("recommended_year", { length: 50 }), // e.g., "JUNIOR", "MID"
  recommendedPositions: jsonb("recommended_positions").$type<string[]>(), // e.g., ["MARKETER", "PM"]
  difficulty: varchar("difficulty", { length: 20 }), // e.g., "EASY", "HARD"
  referenceUrl: varchar("reference_url", { length: 500 }),
  referenceTitle: varchar("reference_title", { length: 255 }), // Display title for the link
  techStack: jsonb("tech_stack").$type<string[]>(), // e.g., ["Next.js", "React"]

  isPublished: boolean("is_published").default(false).notNull(),
  // SEO Metadata
  metaTitle: varchar("meta_title", { length: 70 }),
  metaDescription: varchar("meta_description", { length: 170 }),
  ogImage: varchar("og_image", { length: 500 }),
  canonicalUrl: varchar("canonical_url", { length: 500 }),
  noIndex: boolean("no_index").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Tags Table
export const tags = pgTable("tags", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
});

// Junction Tables
export const postsToTags = pgTable(
  "posts_to_tags",
  {
    postId: serial("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    tagId: serial("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.postId, t.tagId] })]
);

export const faqsToTags = pgTable(
  "faqs_to_tags",
  {
    faqId: serial("faq_id")
      .notNull()
      .references(() => faqs.id, { onDelete: "cascade" }),
    tagId: serial("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.faqId, t.tagId] })]
);

// Relations
export const seriesRelations = relations(series, ({ many }) => ({
  posts: many(posts),
}));

export const postsRelations = relations(posts, ({ many, one }) => ({
  postsToTags: many(postsToTags),
  series: one(series, { fields: [posts.seriesId], references: [series.id] }),
}));

export const faqsRelations = relations(faqs, ({ many }) => ({
  faqsToTags: many(faqsToTags),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  postsToTags: many(postsToTags),
  faqsToTags: many(faqsToTags),
  logsToTags: many(logsToTags),
}));

export const postsToTagsRelations = relations(postsToTags, ({ one }) => ({
  post: one(posts, { fields: [postsToTags.postId], references: [posts.id] }),
  tag: one(tags, { fields: [postsToTags.tagId], references: [tags.id] }),
}));

export const faqsToTagsRelations = relations(faqsToTags, ({ one }) => ({
  faq: one(faqs, { fields: [faqsToTags.faqId], references: [faqs.id] }),
  tag: one(tags, { fields: [faqsToTags.tagId], references: [tags.id] }),
}));

// Difficulty Enum (Courses와 Classes에서 공통 사용)
export const difficultyEnum = ["BEGINNER", "INTERMEDIATE", "ADVANCED"] as const;
export type Difficulty = (typeof difficultyEnum)[number];

// Courses Table (강의 - HTML, JavaScript, GA4 등)
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 50 }).$type<Category>().notNull(),
  thumbnailUrl: varchar("thumbnail_url", { length: 500 }),
  difficulty: varchar("difficulty", { length: 20 }).$type<Difficulty>(),

  isPublished: boolean("is_published").default(false).notNull(),

  // SEO Metadata
  metaTitle: varchar("meta_title", { length: 70 }),
  metaDescription: varchar("meta_description", { length: 170 }),
  ogImage: varchar("og_image", { length: 500 }),
  canonicalUrl: varchar("canonical_url", { length: 500 }),
  noIndex: boolean("no_index").default(false),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Classes Table (개념/용어 정의)

export const classes = pgTable("classes", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),

  // 계층 구조
  courseId: integer("course_id").references(() => courses.id, { onDelete: "set null" }),
  orderInCourse: integer("order_in_course"), // Course 내 순서

  term: varchar("term", { length: 255 }).notNull(),          // 용어/개념명
  definition: text("definition").notNull(),                   // 간단한 정의 (1-2문장)
  content: text("content").notNull(),                         // 상세 설명 (마크다운)
  category: varchar("category", { length: 50 }).$type<Category>().notNull(),

  // Class 특화 메타데이터
  aliases: jsonb("aliases").$type<string[]>(),                // 동의어/별칭
  relatedTerms: jsonb("related_terms").$type<string[]>(),     // 연관 개념 slug 목록
  difficulty: varchar("difficulty", { length: 20 }).$type<Difficulty>(),

  isPublished: boolean("is_published").default(false).notNull(),

  // SEO Metadata
  metaTitle: varchar("meta_title", { length: 70 }),
  metaDescription: varchar("meta_description", { length: 170 }),
  ogImage: varchar("og_image", { length: 500 }),
  ogTitle: varchar("og_title", { length: 100 }),
  ogDescription: varchar("og_description", { length: 200 }),
  canonicalUrl: varchar("canonical_url", { length: 500 }),
  noIndex: boolean("no_index").default(false),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => [
  index("idx_classes_course").on(t.courseId, t.orderInCourse),
]);

// Classes to Tags Junction Table
export const classesToTags = pgTable(
  "classes_to_tags",
  {
    classId: serial("class_id")
      .notNull()
      .references(() => classes.id, { onDelete: "cascade" }),
    tagId: serial("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.classId, t.tagId] })]
);

// Courses Relations
export const coursesRelations = relations(courses, ({ many }) => ({
  classes: many(classes),
}));

// Classes Relations
export const classesRelations = relations(classes, ({ one, many }) => ({
  classesToTags: many(classesToTags),
  course: one(courses, { fields: [classes.courseId], references: [courses.id] }),
}));

export const classesToTagsRelations = relations(classesToTags, ({ one }) => ({
  class: one(classes, { fields: [classesToTags.classId], references: [classes.id] }),
  tag: one(tags, { fields: [classesToTags.tagId], references: [tags.id] }),
}));

// Logs to Tags Junction Table
export const logsToTags = pgTable(
  "logs_to_tags",
  {
    logId: serial("log_id")
      .notNull()
      .references(() => lifeLogs.id, { onDelete: "cascade" }),
    tagId: serial("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.logId, t.tagId] })]
);

// LifeLogs Table (개인 일상 콘텐츠)
export const lifeLogs = pgTable("life_logs", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  category: varchar("category", { length: 50 }).$type<Category>().notNull(),
  thumbnailUrl: varchar("thumbnail_url", { length: 500 }),
  location: varchar("location", { length: 255 }),
  visitedAt: date("visited_at"),
  rating: integer("rating"), // 1-5 별점
  isPublished: boolean("is_published").default(false).notNull(),
  // SEO Metadata
  metaTitle: varchar("meta_title", { length: 70 }),
  metaDescription: varchar("meta_description", { length: 170 }),
  ogImage: varchar("og_image", { length: 500 }),
  ogTitle: varchar("og_title", { length: 100 }),
  ogDescription: varchar("og_description", { length: 200 }),
  canonicalUrl: varchar("canonical_url", { length: 500 }),
  noIndex: boolean("no_index").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// LifeLogs Relations
export const lifeLogsRelations = relations(lifeLogs, ({ many }) => ({
  logsToTags: many(logsToTags),
}));

export const logsToTagsRelations = relations(logsToTags, ({ one }) => ({
  log: one(lifeLogs, { fields: [logsToTags.logId], references: [lifeLogs.id] }),
  tag: one(tags, { fields: [logsToTags.tagId], references: [tags.id] }),
}));

// Content Daily Stats Table (일별 조회수 집계)
export const contentDailyStats = pgTable(
  "content_daily_stats",
  {
    contentType: varchar("content_type", { length: 10 }).$type<ContentType>().notNull(),
    contentId: integer("content_id").notNull(),
    date: date("date").notNull(),
    viewCount: integer("view_count").default(0).notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.contentType, t.contentId, t.date] }),
    index("idx_content_daily_stats_date").on(t.date),
    index("idx_content_daily_stats_content").on(t.contentType, t.contentId),
  ]
);

// SEO Documents Table (동적 생성되는 SEO 파일 저장)
export const seoDocuments = pgTable("seo_documents", {
  id: serial("id").primaryKey(),
  documentType: varchar("document_type", { length: 50 }).notNull().unique(), // 'llms.txt', 'robots.txt', etc.
  content: text("content").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Types
export type Series = typeof series.$inferSelect;
export type NewSeries = typeof series.$inferInsert;
export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
export type Faq = typeof faqs.$inferSelect;
export type NewFaq = typeof faqs.$inferInsert;
export type Tag = typeof tags.$inferSelect;
export type ContentDailyStat = typeof contentDailyStats.$inferSelect;
export type LifeLog = typeof lifeLogs.$inferSelect;
export type NewLifeLog = typeof lifeLogs.$inferInsert;
export type Course = typeof courses.$inferSelect;
export type NewCourse = typeof courses.$inferInsert;
export type Class = typeof classes.$inferSelect;
export type NewClass = typeof classes.$inferInsert;
export type SeoDocument = typeof seoDocuments.$inferSelect;
export type NewSeoDocument = typeof seoDocuments.$inferInsert;
