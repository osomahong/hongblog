import { db } from "@/lib/db";
import { posts, postsToTags, tags } from "@/lib/schema";
import { eq, desc, and, inArray } from "drizzle-orm";
import type { CreatePostInput, UpdatePostInput } from "./schema";

export const postService = {
    /**
     * 모든 게시글 조회
     */
    async getAll(options: { includeDrafts?: boolean } = {}) {
        const { includeDrafts = false } = options;

        const result = await db.query.posts.findMany({
            where: includeDrafts ? undefined : eq(posts.isPublished, true),
            orderBy: [desc(posts.createdAt)],
            with: {
                postsToTags: {
                    with: {
                        tag: true,
                    },
                },
                series: true,
            },
        });

        return result.map((post) => ({
            ...post,
            tags: post.postsToTags.map((pt) => pt.tag.name),
            seriesInfo: post.series
                ? {
                    id: post.series.id,
                    slug: post.series.slug,
                    title: post.series.title,
                }
                : null,
        }));
    },

    /**
     * Slug로 게시글 조회
     */
    async getBySlug(slug: string) {
        const result = await db.query.posts.findFirst({
            where: eq(posts.slug, slug),
            with: {
                postsToTags: {
                    with: {
                        tag: true,
                    },
                },
                series: true,
            },
        });

        if (!result) return null;

        return {
            ...result,
            tags: result.postsToTags.map((pt) => pt.tag.name),
            seriesInfo: result.series
                ? {
                    id: result.series.id,
                    slug: result.series.slug,
                    title: result.series.title,
                }
                : null,
        };
    },

    /**
     * ID로 게시글 조회
     */
    async getById(id: number) {
        const result = await db.query.posts.findFirst({
            where: eq(posts.id, id),
            with: {
                postsToTags: {
                    with: {
                        tag: true,
                    },
                },
                series: true,
            },
        });

        if (!result) return null;

        return {
            ...result,
            tags: result.postsToTags.map((pt) => pt.tag.name),
            seriesInfo: result.series
                ? {
                    id: result.series.id,
                    slug: result.series.slug,
                    title: result.series.title,
                }
                : null,
        };
    },

    /**
     * 게시글 생성
     */
    async create(data: CreatePostInput) {
        const { tags: tagNames, ...postData } = data;

        // 트랜잭션 처리
        return await db.transaction(async (tx) => {
            // 게시글 생성
            const [newPost] = await tx.insert(posts).values(postData).returning();

            // 태그 처리
            if (tagNames && tagNames.length > 0) {
                for (const name of tagNames) {
                    // 태그 upsert
                    let tagId: number;
                    const existing = await tx.query.tags.findFirst({
                        where: eq(tags.name, name),
                    });

                    if (existing) {
                        tagId = existing.id;
                    } else {
                        const [created] = await tx.insert(tags).values({ name }).returning();
                        tagId = created.id;
                    }

                    // 관계 생성
                    await tx.insert(postsToTags).values({
                        postId: newPost.id,
                        tagId,
                    });
                }
            }

            return newPost;
        });
    },

    /**
     * 게시글 수정
     */
    async update(data: UpdatePostInput) {
        const { id, tags: tagNames, ...updateData } = data;

        return await db.transaction(async (tx) => {
            // 게시글 업데이트
            const [updated] = await tx
                .update(posts)
                .set({
                    ...updateData,
                    updatedAt: new Date(),
                })
                .where(eq(posts.id, id))
                .returning();

            if (!updated) {
                throw new Error("Post not found");
            }

            // 태그 업데이트 (제공된 경우에만)
            if (tagNames !== undefined) {
                // 기존 태그 관계 삭제
                await tx.delete(postsToTags).where(eq(postsToTags.postId, id));

                // 새 태그 관계 생성
                if (tagNames.length > 0) {
                    for (const name of tagNames) {
                        let tagId: number;
                        const existing = await tx.query.tags.findFirst({
                            where: eq(tags.name, name),
                        });

                        if (existing) {
                            tagId = existing.id;
                        } else {
                            const [created] = await tx.insert(tags).values({ name }).returning();
                            tagId = created.id;
                        }

                        await tx.insert(postsToTags).values({
                            postId: id,
                            tagId,
                        });
                    }
                }
            }

            return updated;
        });
    },

    /**
     * 게시글 삭제
     */
    async delete(id: number) {
        await db.delete(posts).where(eq(posts.id, id));
        return { success: true };
    },

    /**
     * 게시글 발행 상태 토글
     */
    async togglePublished(id: number) {
        const post = await db.query.posts.findFirst({
            where: eq(posts.id, id),
        });

        if (!post) {
            throw new Error("Post not found");
        }

        const [updated] = await db
            .update(posts)
            .set({
                isPublished: !post.isPublished,
                updatedAt: new Date(),
            })
            .where(eq(posts.id, id))
            .returning();

        return updated;
    },
};
