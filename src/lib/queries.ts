import { db } from "./db";
import { posts, faqs, tags, postsToTags, faqsToTags, contentDailyStats, series, Post, Faq, ContentType, Category, Tag, Series } from "./schema";
import { eq, inArray, desc, sql, and, gte, asc } from "drizzle-orm";

// 타입 정의
export type PostWithTags = Omit<Post, "highlights"> & {
  highlights: string[] | null;
  tags: string[];
  seriesInfo?: {
    id: number;
    slug: string;
    title: string;
  } | null;
};

export type FaqWithTags = Faq & {
  tags: string[];
};

export type SeriesWithPosts = Series & {
  posts: PostWithTags[];
  postCount: number;
};

type PostWithRelations = Post & {
  postsToTags: { tag: Tag }[];
  series?: Series | null;
};

type FaqWithRelations = Faq & {
  faqsToTags: { tag: Tag }[];
};

// Posts 쿼리
export async function getAllPosts(): Promise<PostWithTags[]> {
  const result = (await db.query.posts.findMany({
    orderBy: [desc(posts.createdAt)],
    with: {
      postsToTags: {
        with: {
          tag: true,
        },
      },
      series: true,
    },
  })) as PostWithRelations[];

  return result.map((post) => ({
    ...post,
    highlights: post.highlights as string[] | null,
    tags: post.postsToTags.map((pt) => pt.tag.name),
    seriesInfo: post.series ? { id: post.series.id, slug: post.series.slug, title: post.series.title } : null,
  }));
}

// 배포된 Posts만 조회 (프론트엔드용)
export async function getPublishedPosts(): Promise<PostWithTags[]> {
  const result = (await db.query.posts.findMany({
    where: eq(posts.isPublished, true),
    orderBy: [desc(posts.createdAt)],
    with: {
      postsToTags: {
        with: {
          tag: true,
        },
      },
      series: true,
    },
  })) as PostWithRelations[];

  return result.map((post) => ({
    ...post,
    highlights: post.highlights as string[] | null,
    tags: post.postsToTags.map((pt) => pt.tag.name),
    seriesInfo: post.series ? { id: post.series.id, slug: post.series.slug, title: post.series.title } : null,
  }));
}

export async function getPostBySlug(slug: string): Promise<PostWithTags | null> {
  const result = (await db.query.posts.findFirst({
    where: eq(posts.slug, slug),
    with: {
      postsToTags: {
        with: {
          tag: true,
        },
      },
      series: true,
    },
  })) as PostWithRelations | undefined;

  if (!result) return null;

  return {
    ...result,
    highlights: result.highlights as string[] | null,
    tags: result.postsToTags.map((pt) => pt.tag.name),
    seriesInfo: result.series ? { id: result.series.id, slug: result.series.slug, title: result.series.title } : null,
  };
}

// FAQs 쿼리
export async function getAllFaqs(): Promise<FaqWithTags[]> {
  const result = (await db.query.faqs.findMany({
    orderBy: [desc(faqs.createdAt)],
    with: {
      faqsToTags: {
        with: {
          tag: true,
        },
      },
    },
  })) as FaqWithRelations[];

  return result.map((faq) => ({
    ...faq,
    tags: faq.faqsToTags.map((ft) => ft.tag.name),
  }));
}

// 배포된 FAQs만 조회 (프론트엔드용)
export async function getPublishedFaqs(): Promise<FaqWithTags[]> {
  const result = (await db.query.faqs.findMany({
    where: eq(faqs.isPublished, true),
    orderBy: [desc(faqs.createdAt)],
    with: {
      faqsToTags: {
        with: {
          tag: true,
        },
      },
    },
  })) as FaqWithRelations[];

  return result.map((faq) => ({
    ...faq,
    tags: faq.faqsToTags.map((ft) => ft.tag.name),
  }));
}

export async function getFaqBySlug(slug: string): Promise<FaqWithTags | null> {
  const result = (await db.query.faqs.findFirst({
    where: eq(faqs.slug, slug),
    with: {
      faqsToTags: {
        with: {
          tag: true,
        },
      },
    },
  })) as FaqWithRelations | undefined;

  if (!result) return null;

  return {
    ...result,
    tags: result.faqsToTags.map((ft) => ft.tag.name),
  };
}


// 태그 기반 연관 콘텐츠 쿼리
export async function getRelatedFaqsByTags(tagNames: string[], excludeId?: number, limit = 3): Promise<FaqWithTags[]> {
  const tagRecords = await db.query.tags.findMany({
    where: inArray(tags.name, tagNames),
  });
  const tagIds = tagRecords.map((t: Tag) => t.id);

  if (tagIds.length === 0) return [];

  const faqTagRecords = await db
    .select({ faqId: faqsToTags.faqId, tagId: faqsToTags.tagId })
    .from(faqsToTags)
    .where(inArray(faqsToTags.tagId, tagIds));

  const faqScores = new Map<number, number>();
  for (const record of faqTagRecords) {
    if (excludeId && record.faqId === excludeId) continue;
    faqScores.set(record.faqId, (faqScores.get(record.faqId) || 0) + 1);
  }

  const sortedFaqIds = [...faqScores.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([id]) => id);

  if (sortedFaqIds.length === 0) return [];

  const result = (await db.query.faqs.findMany({
    where: inArray(faqs.id, sortedFaqIds),
    with: {
      faqsToTags: {
        with: {
          tag: true,
        },
      },
    },
  })) as FaqWithRelations[];

  return sortedFaqIds
    .map((id) => result.find((f) => f.id === id))
    .filter((faq): faq is FaqWithRelations => faq !== undefined)
    .map((faq) => ({
      ...faq,
      tags: faq.faqsToTags.map((ft) => ft.tag.name),
    }));
}

export async function getRelatedPostsByTags(tagNames: string[], excludeId?: number, limit = 2): Promise<PostWithTags[]> {
  const tagRecords = await db.query.tags.findMany({
    where: inArray(tags.name, tagNames),
  });
  const tagIds = tagRecords.map((t: Tag) => t.id);

  if (tagIds.length === 0) return [];

  const postTagRecords = await db
    .select({ postId: postsToTags.postId, tagId: postsToTags.tagId })
    .from(postsToTags)
    .where(inArray(postsToTags.tagId, tagIds));

  const postScores = new Map<number, number>();
  for (const record of postTagRecords) {
    if (excludeId && record.postId === excludeId) continue;
    postScores.set(record.postId, (postScores.get(record.postId) || 0) + 1);
  }

  const sortedPostIds = [...postScores.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([id]) => id);

  if (sortedPostIds.length === 0) return [];

  const result = (await db.query.posts.findMany({
    where: inArray(posts.id, sortedPostIds),
    with: {
      postsToTags: {
        with: {
          tag: true,
        },
      },
    },
  })) as PostWithRelations[];

  return sortedPostIds
    .map((id) => result.find((p) => p.id === id))
    .filter((post): post is PostWithRelations => post !== undefined)
    .map((post) => ({
      ...post,
      highlights: post.highlights as string[] | null,
      tags: post.postsToTags.map((pt) => pt.tag.name),
    }));
}


// ============================================
// 조회수 관련 쿼리
// ============================================

// 조회수 기록 (UPSERT)
export async function recordView(contentType: ContentType, contentId: number): Promise<void> {
  const today = new Date().toISOString().split("T")[0];
  
  await db
    .insert(contentDailyStats)
    .values({
      contentType,
      contentId,
      date: today,
      viewCount: 1,
    })
    .onConflictDoUpdate({
      target: [contentDailyStats.contentType, contentDailyStats.contentId, contentDailyStats.date],
      set: {
        viewCount: sql`${contentDailyStats.viewCount} + 1`,
      },
    });
}

// 최근 N일 기준 Trending 콘텐츠 조회
export async function getTrendingContent(days = 7, limit = 10): Promise<{ contentType: ContentType; contentId: number; totalViews: number }[]> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  const startDateStr = startDate.toISOString().split("T")[0];

  const result = await db
    .select({
      contentType: contentDailyStats.contentType,
      contentId: contentDailyStats.contentId,
      totalViews: sql<number>`SUM(${contentDailyStats.viewCount})`.as("total_views"),
    })
    .from(contentDailyStats)
    .where(gte(contentDailyStats.date, startDateStr))
    .groupBy(contentDailyStats.contentType, contentDailyStats.contentId)
    .orderBy(sql`total_views DESC`)
    .limit(limit);

  return result.map((r) => ({
    contentType: r.contentType as ContentType,
    contentId: r.contentId,
    totalViews: Number(r.totalViews),
  }));
}

// 특정 콘텐츠의 최근 N일 조회수 합계
export async function getViewCount(contentType: ContentType, contentId: number, days = 30): Promise<number> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  const startDateStr = startDate.toISOString().split("T")[0];

  const result = await db
    .select({
      totalViews: sql<number>`COALESCE(SUM(${contentDailyStats.viewCount}), 0)`.as("total_views"),
    })
    .from(contentDailyStats)
    .where(
      and(
        eq(contentDailyStats.contentType, contentType),
        eq(contentDailyStats.contentId, contentId),
        gte(contentDailyStats.date, startDateStr)
      )
    );

  return Number(result[0]?.totalViews ?? 0);
}


// 카테고리별 인기 Posts (조회수 기반)
export async function getPopularPostsByCategory(category: Category, days = 30, limit = 5): Promise<PostWithTags[]> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  const startDateStr = startDate.toISOString().split("T")[0];

  const viewStats = await db
    .select({
      contentId: contentDailyStats.contentId,
      totalViews: sql<number>`SUM(${contentDailyStats.viewCount})`.as("total_views"),
    })
    .from(contentDailyStats)
    .where(
      and(
        eq(contentDailyStats.contentType, "post"),
        gte(contentDailyStats.date, startDateStr)
      )
    )
    .groupBy(contentDailyStats.contentId);

  const viewMap = new Map(viewStats.map((v) => [v.contentId, Number(v.totalViews)]));

  const result = (await db.query.posts.findMany({
    where: eq(posts.category, category),
    with: {
      postsToTags: {
        with: {
          tag: true,
        },
      },
    },
  })) as PostWithRelations[];

  type PostWithViewCount = PostWithTags & { _viewCount: number };
  const postsWithViews: PostWithViewCount[] = result.map((post) => ({
    ...post,
    highlights: post.highlights as string[] | null,
    tags: post.postsToTags.map((pt) => pt.tag.name),
    _viewCount: viewMap.get(post.id) ?? 0,
  }));

  return postsWithViews
    .sort((a, b) => b._viewCount - a._viewCount)
    .slice(0, limit)
    .map(({ _viewCount, ...post }) => post);
}

// 카테고리별 인기 FAQs (조회수 기반)
export async function getPopularFaqsByCategory(category: Category, days = 30, limit = 5): Promise<FaqWithTags[]> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  const startDateStr = startDate.toISOString().split("T")[0];

  const viewStats = await db
    .select({
      contentId: contentDailyStats.contentId,
      totalViews: sql<number>`SUM(${contentDailyStats.viewCount})`.as("total_views"),
    })
    .from(contentDailyStats)
    .where(
      and(
        eq(contentDailyStats.contentType, "faq"),
        gte(contentDailyStats.date, startDateStr)
      )
    )
    .groupBy(contentDailyStats.contentId);

  const viewMap = new Map(viewStats.map((v) => [v.contentId, Number(v.totalViews)]));

  const result = (await db.query.faqs.findMany({
    where: eq(faqs.category, category),
    with: {
      faqsToTags: {
        with: {
          tag: true,
        },
      },
    },
  })) as FaqWithRelations[];

  type FaqWithViewCount = FaqWithTags & { _viewCount: number };
  const faqsWithViews: FaqWithViewCount[] = result.map((faq) => ({
    ...faq,
    tags: faq.faqsToTags.map((ft) => ft.tag.name),
    _viewCount: viewMap.get(faq.id) ?? 0,
  }));

  return faqsWithViews
    .sort((a, b) => b._viewCount - a._viewCount)
    .slice(0, limit)
    .map(({ _viewCount, ...faq }) => faq);
}


// 연관 FAQs (태그 매칭 + 조회수 가중치 복합 점수)
export async function getRelatedFaqsWithPopularity(
  tagNames: string[],
  category: Category,
  excludeId?: number,
  limit = 3,
  days = 7
): Promise<FaqWithTags[]> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  const startDateStr = startDate.toISOString().split("T")[0];

  const tagRecords = await db.query.tags.findMany({
    where: inArray(tags.name, tagNames),
  });
  const tagIds = tagRecords.map((t: Tag) => t.id);

  const viewStats = await db
    .select({
      contentId: contentDailyStats.contentId,
      totalViews: sql<number>`SUM(${contentDailyStats.viewCount})`.as("total_views"),
    })
    .from(contentDailyStats)
    .where(
      and(
        eq(contentDailyStats.contentType, "faq"),
        gte(contentDailyStats.date, startDateStr)
      )
    )
    .groupBy(contentDailyStats.contentId);

  const viewMap = new Map(viewStats.map((v) => [v.contentId, Number(v.totalViews)]));

  const faqTagRecords = tagIds.length > 0
    ? await db
        .select({ faqId: faqsToTags.faqId, tagId: faqsToTags.tagId })
        .from(faqsToTags)
        .where(inArray(faqsToTags.tagId, tagIds))
    : [];

  const tagScoreMap = new Map<number, number>();
  for (const record of faqTagRecords) {
    if (excludeId && record.faqId === excludeId) continue;
    tagScoreMap.set(record.faqId, (tagScoreMap.get(record.faqId) || 0) + 1);
  }

  const allFaqs = (await db.query.faqs.findMany({
    with: {
      faqsToTags: {
        with: {
          tag: true,
        },
      },
    },
  })) as FaqWithRelations[];

  type FaqWithScore = FaqWithTags & { _score: number };
  const scoredFaqs: FaqWithScore[] = allFaqs
    .filter((faq) => faq.id !== excludeId)
    .map((faq) => {
      const tagScore = (tagScoreMap.get(faq.id) || 0) * 2;
      const categoryScore = faq.category === category ? 1 : 0;
      const viewScore = (viewMap.get(faq.id) || 0) * 0.1;
      const totalScore = tagScore + categoryScore + viewScore;

      return {
        ...faq,
        tags: faq.faqsToTags.map((ft) => ft.tag.name),
        _score: totalScore,
      };
    })
    .filter((faq) => faq._score > 0)
    .sort((a, b) => b._score - a._score)
    .slice(0, limit);

  return scoredFaqs.map(({ _score, ...faq }) => faq);
}

// 연관 Posts (태그 매칭 + 조회수 가중치 복합 점수)
export async function getRelatedPostsWithPopularity(
  tagNames: string[],
  category: Category,
  excludeId?: number,
  limit = 2,
  days = 7
): Promise<PostWithTags[]> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  const startDateStr = startDate.toISOString().split("T")[0];

  const tagRecords = await db.query.tags.findMany({
    where: inArray(tags.name, tagNames),
  });
  const tagIds = tagRecords.map((t: Tag) => t.id);

  const viewStats = await db
    .select({
      contentId: contentDailyStats.contentId,
      totalViews: sql<number>`SUM(${contentDailyStats.viewCount})`.as("total_views"),
    })
    .from(contentDailyStats)
    .where(
      and(
        eq(contentDailyStats.contentType, "post"),
        gte(contentDailyStats.date, startDateStr)
      )
    )
    .groupBy(contentDailyStats.contentId);

  const viewMap = new Map(viewStats.map((v) => [v.contentId, Number(v.totalViews)]));

  const postTagRecords = tagIds.length > 0
    ? await db
        .select({ postId: postsToTags.postId, tagId: postsToTags.tagId })
        .from(postsToTags)
        .where(inArray(postsToTags.tagId, tagIds))
    : [];

  const tagScoreMap = new Map<number, number>();
  for (const record of postTagRecords) {
    if (excludeId && record.postId === excludeId) continue;
    tagScoreMap.set(record.postId, (tagScoreMap.get(record.postId) || 0) + 1);
  }

  const allPosts = (await db.query.posts.findMany({
    with: {
      postsToTags: {
        with: {
          tag: true,
        },
      },
    },
  })) as PostWithRelations[];

  type PostWithScore = PostWithTags & { _score: number };
  const scoredPosts: PostWithScore[] = allPosts
    .filter((post) => post.id !== excludeId)
    .map((post) => {
      const tagScore = (tagScoreMap.get(post.id) || 0) * 2;
      const categoryScore = post.category === category ? 1 : 0;
      const viewScore = (viewMap.get(post.id) || 0) * 0.1;
      const totalScore = tagScore + categoryScore + viewScore;

      return {
        ...post,
        highlights: post.highlights as string[] | null,
        tags: post.postsToTags.map((pt) => pt.tag.name),
        _score: totalScore,
      };
    })
    .filter((post) => post._score > 0)
    .sort((a, b) => b._score - a._score)
    .slice(0, limit);

  return scoredPosts.map(({ _score, ...post }) => post);
}


// ============================================
// 태그 관련 쿼리
// ============================================

// 모든 태그 조회
export async function getAllTags(): Promise<Tag[]> {
  return db.query.tags.findMany({
    orderBy: [asc(tags.name)],
  });
}

// 특정 태그로 콘텐츠 조회
export async function getContentByTag(tagName: string): Promise<{
  posts: PostWithTags[];
  faqs: FaqWithTags[];
}> {
  const tagRecord = await db.query.tags.findFirst({
    where: eq(tags.name, tagName),
  });

  if (!tagRecord) {
    return { posts: [], faqs: [] };
  }

  // 해당 태그를 가진 Posts 조회
  const postTagRecords = await db
    .select({ postId: postsToTags.postId })
    .from(postsToTags)
    .where(eq(postsToTags.tagId, tagRecord.id));

  const postIds = postTagRecords.map((r) => r.postId);

  let postsResult: PostWithTags[] = [];
  if (postIds.length > 0) {
    const postsData = (await db.query.posts.findMany({
      where: inArray(posts.id, postIds),
      orderBy: [desc(posts.createdAt)],
      with: {
        postsToTags: {
          with: {
            tag: true,
          },
        },
      },
    })) as PostWithRelations[];

    postsResult = postsData.map((post) => ({
      ...post,
      highlights: post.highlights as string[] | null,
      tags: post.postsToTags.map((pt) => pt.tag.name),
    }));
  }

  // 해당 태그를 가진 FAQs 조회
  const faqTagRecords = await db
    .select({ faqId: faqsToTags.faqId })
    .from(faqsToTags)
    .where(eq(faqsToTags.tagId, tagRecord.id));

  const faqIds = faqTagRecords.map((r) => r.faqId);

  let faqsResult: FaqWithTags[] = [];
  if (faqIds.length > 0) {
    const faqsData = (await db.query.faqs.findMany({
      where: inArray(faqs.id, faqIds),
      orderBy: [desc(faqs.createdAt)],
      with: {
        faqsToTags: {
          with: {
            tag: true,
          },
        },
      },
    })) as FaqWithRelations[];

    faqsResult = faqsData.map((faq) => ({
      ...faq,
      tags: faq.faqsToTags.map((ft) => ft.tag.name),
    }));
  }

  return { posts: postsResult, faqs: faqsResult };
}


// ============================================
// 메인 페이지용 쿼리
// ============================================

// 카테고리별 콘텐츠 수 집계
export async function getCategoryStats(): Promise<{ category: Category; postCount: number; faqCount: number }[]> {
  const postStats = await db
    .select({
      category: posts.category,
      count: sql<number>`COUNT(*)`.as("count"),
    })
    .from(posts)
    .where(eq(posts.isPublished, true))
    .groupBy(posts.category);

  const faqStats = await db
    .select({
      category: faqs.category,
      count: sql<number>`COUNT(*)`.as("count"),
    })
    .from(faqs)
    .where(eq(faqs.isPublished, true))
    .groupBy(faqs.category);

  const categories: Category[] = ["MARKETING", "AI_TECH", "DATA"];
  
  return categories.map((cat) => ({
    category: cat,
    postCount: Number(postStats.find((p) => p.category === cat)?.count ?? 0),
    faqCount: Number(faqStats.find((f) => f.category === cat)?.count ?? 0),
  }));
}

// 전체 인기 FAQs (조회수 기반)
export async function getPopularFaqs(days = 30, limit = 5): Promise<FaqWithTags[]> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  const startDateStr = startDate.toISOString().split("T")[0];

  const viewStats = await db
    .select({
      contentId: contentDailyStats.contentId,
      totalViews: sql<number>`SUM(${contentDailyStats.viewCount})`.as("total_views"),
    })
    .from(contentDailyStats)
    .where(
      and(
        eq(contentDailyStats.contentType, "faq"),
        gte(contentDailyStats.date, startDateStr)
      )
    )
    .groupBy(contentDailyStats.contentId);

  const viewMap = new Map(viewStats.map((v) => [v.contentId, Number(v.totalViews)]));

  const result = (await db.query.faqs.findMany({
    where: eq(faqs.isPublished, true),
    with: {
      faqsToTags: {
        with: {
          tag: true,
        },
      },
    },
  })) as FaqWithRelations[];

  type FaqWithViewCount = FaqWithTags & { _viewCount: number };
  const faqsWithViews: FaqWithViewCount[] = result.map((faq) => ({
    ...faq,
    tags: faq.faqsToTags.map((ft) => ft.tag.name),
    _viewCount: viewMap.get(faq.id) ?? 0,
  }));

  return faqsWithViews
    .sort((a, b) => b._viewCount - a._viewCount)
    .slice(0, limit)
    .map(({ _viewCount, ...faq }) => faq);
}

// Trending 콘텐츠용 타입
export type TrendingPost = PostWithTags & { _type: "post"; _viewCount: number };
export type TrendingFaq = FaqWithTags & { _type: "faq"; _viewCount: number };
export type TrendingItem = TrendingPost | TrendingFaq;

// Trending 콘텐츠 (Post + FAQ 혼합, 조회수 기반)
export async function getTrendingMixed(days = 7, limit = 6): Promise<TrendingItem[]> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  const startDateStr = startDate.toISOString().split("T")[0];

  const viewStats = await db
    .select({
      contentType: contentDailyStats.contentType,
      contentId: contentDailyStats.contentId,
      totalViews: sql<number>`SUM(${contentDailyStats.viewCount})`.as("total_views"),
    })
    .from(contentDailyStats)
    .where(gte(contentDailyStats.date, startDateStr))
    .groupBy(contentDailyStats.contentType, contentDailyStats.contentId)
    .orderBy(sql`total_views DESC`)
    .limit(limit * 2); // 여유있게 가져옴

  const postIds = viewStats.filter((v) => v.contentType === "post").map((v) => v.contentId);
  const faqIds = viewStats.filter((v) => v.contentType === "faq").map((v) => v.contentId);

  const postsData = postIds.length > 0
    ? ((await db.query.posts.findMany({
        where: and(eq(posts.isPublished, true), inArray(posts.id, postIds)),
        with: { postsToTags: { with: { tag: true } } },
      })) as PostWithRelations[])
    : [];

  const faqsData = faqIds.length > 0
    ? ((await db.query.faqs.findMany({
        where: and(eq(faqs.isPublished, true), inArray(faqs.id, faqIds)),
        with: { faqsToTags: { with: { tag: true } } },
      })) as FaqWithRelations[])
    : [];

  const viewMap = new Map(viewStats.map((v) => [`${v.contentType}-${v.contentId}`, Number(v.totalViews)]));

  const mixed: TrendingItem[] = [
    ...postsData.map((post) => ({
      ...post,
      highlights: post.highlights as string[] | null,
      tags: post.postsToTags.map((pt) => pt.tag.name),
      _type: "post" as const,
      _viewCount: viewMap.get(`post-${post.id}`) ?? 0,
    })),
    ...faqsData.map((faq) => ({
      ...faq,
      tags: faq.faqsToTags.map((ft) => ft.tag.name),
      _type: "faq" as const,
      _viewCount: viewMap.get(`faq-${faq.id}`) ?? 0,
    })),
  ];

  return mixed
    .sort((a, b) => b._viewCount - a._viewCount)
    .slice(0, limit);
}


// ============================================
// 시리즈 관련 쿼리
// ============================================

type SeriesWithPostsRelations = Series & {
  posts: PostWithRelations[];
};

// 모든 시리즈 조회
export async function getAllSeries(): Promise<SeriesWithPosts[]> {
  const result = await db.query.series.findMany({
    orderBy: [desc(series.createdAt)],
    with: {
      posts: {
        orderBy: [asc(posts.seriesOrder), asc(posts.createdAt)],
        with: {
          postsToTags: {
            with: {
              tag: true,
            },
          },
        },
      },
    },
  }) as SeriesWithPostsRelations[];

  return result.map((s) => ({
    ...s,
    posts: s.posts.map((post) => ({
      ...post,
      highlights: post.highlights as string[] | null,
      tags: post.postsToTags.map((pt) => pt.tag.name),
    })),
    postCount: s.posts.length,
  }));
}

// 배포된 시리즈만 조회 (프론트엔드용)
export async function getPublishedSeries(): Promise<SeriesWithPosts[]> {
  const result = await db.query.series.findMany({
    where: eq(series.isPublished, true),
    orderBy: [desc(series.createdAt)],
    with: {
      posts: {
        where: eq(posts.isPublished, true),
        orderBy: [asc(posts.seriesOrder), asc(posts.createdAt)],
        with: {
          postsToTags: {
            with: {
              tag: true,
            },
          },
        },
      },
    },
  }) as SeriesWithPostsRelations[];

  return result.map((s) => ({
    ...s,
    posts: s.posts.map((post) => ({
      ...post,
      highlights: post.highlights as string[] | null,
      tags: post.postsToTags.map((pt) => pt.tag.name),
    })),
    postCount: s.posts.length,
  }));
}

// 슬러그로 시리즈 조회
export async function getSeriesBySlug(slug: string): Promise<SeriesWithPosts | null> {
  const result = await db.query.series.findFirst({
    where: eq(series.slug, slug),
    with: {
      posts: {
        where: eq(posts.isPublished, true),
        orderBy: [asc(posts.seriesOrder), asc(posts.createdAt)],
        with: {
          postsToTags: {
            with: {
              tag: true,
            },
          },
        },
      },
    },
  });

  if (!result) return null;

  return {
    ...result,
    posts: (result.posts as PostWithRelations[]).map((post) => ({
      ...post,
      highlights: post.highlights as string[] | null,
      tags: post.postsToTags.map((pt) => pt.tag.name),
    })),
    postCount: result.posts.length,
  };
}

// 시리즈 내 이전/다음 글 조회 (네비게이션용)
export async function getSeriesNavigation(seriesId: number, currentPostId: number): Promise<{
  prev: PostWithTags | null;
  next: PostWithTags | null;
  currentIndex: number;
  totalCount: number;
}> {
  const seriesPosts = (await db.query.posts.findMany({
    where: and(eq(posts.seriesId, seriesId), eq(posts.isPublished, true)),
    orderBy: [asc(posts.seriesOrder), asc(posts.createdAt)],
    with: {
      postsToTags: {
        with: {
          tag: true,
        },
      },
    },
  })) as PostWithRelations[];

  const currentIndex = seriesPosts.findIndex((p) => p.id === currentPostId);
  
  const mapPost = (post: PostWithRelations): PostWithTags => ({
    ...post,
    highlights: post.highlights as string[] | null,
    tags: post.postsToTags.map((pt) => pt.tag.name),
  });

  return {
    prev: currentIndex > 0 ? mapPost(seriesPosts[currentIndex - 1]) : null,
    next: currentIndex < seriesPosts.length - 1 ? mapPost(seriesPosts[currentIndex + 1]) : null,
    currentIndex: currentIndex + 1,
    totalCount: seriesPosts.length,
  };
}
