import { db } from "@/lib/db";
import { series, posts } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";
import type { CreateSeriesInput, UpdateSeriesInput } from "./schema";

export const seriesService = {
    /**
     * 모든 시리즈 조회
     */
    async getAll(options: { includeDrafts?: boolean } = {}) {
        const { includeDrafts = false } = options;

        const result = await db.query.series.findMany({
            where: includeDrafts ? undefined : eq(series.isPublished, true),
            orderBy: [desc(series.createdAt)],
            with: {
                posts: {
                    orderBy: (posts, { asc }) => [asc(posts.seriesOrder)],
                },
            },
        });

        return result.map((s) => ({
            ...s,
            postCount: s.posts.length,
        }));
    },

    /**
     * Slug로 시리즈 조회
     */
    async getBySlug(slug: string) {
        const result = await db.query.series.findFirst({
            where: eq(series.slug, slug),
            with: {
                posts: {
                    orderBy: (posts, { asc }) => [asc(posts.seriesOrder)],
                },
            },
        });

        if (!result) return null;

        return {
            ...result,
            postCount: result.posts.length,
        };
    },

    /**
     * 시리즈 생성
     */
    async create(data: CreateSeriesInput) {
        const [newSeries] = await db.insert(series).values(data).returning();
        return newSeries;
    },

    /**
     * 시리즈 수정
     */
    async update(data: UpdateSeriesInput) {
        const { id, ...updateData } = data;

        const [updated] = await db
            .update(series)
            .set({
                ...updateData,
                updatedAt: new Date(),
            })
            .where(eq(series.id, id))
            .returning();

        if (!updated) {
            throw new Error("Series not found");
        }

        return updated;
    },

    /**
     * 시리즈 삭제
     */
    async delete(id: number) {
        await db.delete(series).where(eq(series.id, id));
        return { success: true };
    },

    /**
     * 시리즈 발행 상태 토글
     */
    async togglePublished(id: number) {
        const s = await db.query.series.findFirst({
            where: eq(series.id, id),
        });

        if (!s) {
            throw new Error("Series not found");
        }

        const [updated] = await db
            .update(series)
            .set({
                isPublished: !s.isPublished,
                updatedAt: new Date(),
            })
            .where(eq(series.id, id))
            .returning();

        return updated;
    },
};
