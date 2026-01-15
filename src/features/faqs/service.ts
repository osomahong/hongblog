import { db } from "@/lib/db";
import { faqs, faqsToTags, tags } from "@/lib/schema";
import { eq, desc, and } from "drizzle-orm";
import type { CreateFaqInput, UpdateFaqInput } from "./schema";

export const faqService = {
    /**
     * 모든 FAQ 조회
     */
    async getAll(options: { includeDrafts?: boolean } = {}) {
        const { includeDrafts = false } = options;

        const result = await db.query.faqs.findMany({
            where: includeDrafts ? undefined : eq(faqs.isPublished, true),
            orderBy: [desc(faqs.createdAt)],
            with: {
                faqsToTags: {
                    with: {
                        tag: true,
                    },
                },
            },
        });

        return result.map((faq) => ({
            ...faq,
            tags: faq.faqsToTags.map((ft) => ft.tag.name),
        }));
    },

    /**
     * Slug로 FAQ 조회
     */
    async getBySlug(slug: string) {
        const result = await db.query.faqs.findFirst({
            where: eq(faqs.slug, slug),
            with: {
                faqsToTags: {
                    with: {
                        tag: true,
                    },
                },
            },
        });

        if (!result) return null;

        return {
            ...result,
            tags: result.faqsToTags.map((ft) => ft.tag.name),
        };
    },

    /**
     * ID로 FAQ 조회
     */
    async getById(id: number) {
        const result = await db.query.faqs.findFirst({
            where: eq(faqs.id, id),
            with: {
                faqsToTags: {
                    with: {
                        tag: true,
                    },
                },
            },
        });

        if (!result) return null;

        return {
            ...result,
            tags: result.faqsToTags.map((ft) => ft.tag.name),
        };
    },

    /**
     * FAQ 생성
     */
    async create(data: CreateFaqInput) {
        const { tags: tagNames, ...faqData } = data;

        // 트랜잭션 처리
        return await db.transaction(async (tx) => {
            // FAQ 생성
            const [newFaq] = await tx.insert(faqs).values(faqData).returning();

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
                    await tx.insert(faqsToTags).values({
                        faqId: newFaq.id,
                        tagId,
                    });
                }
            }

            return newFaq;
        });
    },

    /**
     * FAQ 수정
     */
    async update(data: UpdateFaqInput) {
        const { id, tags: tagNames, ...updateData } = data;

        return await db.transaction(async (tx) => {
            // FAQ 업데이트
            const [updated] = await tx
                .update(faqs)
                .set({
                    ...updateData,
                    updatedAt: new Date(),
                })
                .where(eq(faqs.id, id))
                .returning();

            if (!updated) {
                throw new Error("FAQ not found");
            }

            // 태그 업데이트 (제공된 경우에만)
            if (tagNames !== undefined) {
                // 기존 태그 관계 삭제
                await tx.delete(faqsToTags).where(eq(faqsToTags.faqId, id));

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

                        await tx.insert(faqsToTags).values({
                            faqId: id,
                            tagId,
                        });
                    }
                }
            }

            return updated;
        });
    },

    /**
     * FAQ 삭제
     */
    async delete(id: number) {
        await db.delete(faqs).where(eq(faqs.id, id));
        return { success: true };
    },

    /**
     * FAQ 발행 상태 토글
     */
    async togglePublished(id: number) {
        const faq = await db.query.faqs.findFirst({
            where: eq(faqs.id, id),
        });

        if (!faq) {
            throw new Error("FAQ not found");
        }

        const [updated] = await db
            .update(faqs)
            .set({
                isPublished: !faq.isPublished,
                updatedAt: new Date(),
            })
            .where(eq(faqs.id, id))
            .returning();

        return updated;
    },
};
