import { pgTable, serial, text, varchar, timestamp, boolean, jsonb, primaryKey, date, integer, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Content Type Enum
export const contentTypeEnum = ["post", "faq", "lifelog"] as const;
export type ContentType = (typeof contentTypeEnum)[number];

// LifeLog Category Enum
export const lifeLogCategoryEnum = ["FOOD", "LECTURE", "CULTURE", "TRAVEL", "DAILY"] as const;
export type LifeLogCategory = (typeof lifeLogCategoryEnum)[number];

// Enums
export const categoryEnum = ["MARKETING", "AI_TECH", "DATA"] as const;
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
}));

export const postsToTagsRelations = relations(postsToTags, ({ one }) => ({
  post: one(posts, { fields: [postsToTags.postId], references: [posts.id] }),
  tag: one(tags, { fields: [postsToTags.tagId], references: [tags.id] }),
}));

export const faqsToTagsRelations = relations(faqsToTags, ({ one }) => ({
  faq: one(faqs, { fields: [faqsToTags.faqId], references: [faqs.id] }),
  tag: one(tags, { fields: [faqsToTags.tagId], references: [tags.id] }),
}));

// LifeLogs Table (개인 일상 콘텐츠)
export const lifeLogs = pgTable("life_logs", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  category: varchar("category", { length: 50 }).$type<LifeLogCategory>().notNull(),
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
