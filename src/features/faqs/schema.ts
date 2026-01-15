import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { faqs } from "@/lib/schema";
import { z } from "zod";

// FAQ 스키마 생성
export const insertFaqSchema = createInsertSchema(faqs, {
    question: (schema) => schema.min(1, "질문을 입력해주세요."),
    slug: (schema) =>
        schema
            .min(1, "슬러그는 필수입니다.")
            .regex(/^[a-z0-9-]+$/, "영문 소문자, 숫자, 하이픈만 가능합니다."),
    answer: (schema) => schema.min(10, "답변은 최소 10자 이상이어야 합니다."),
    category: z.enum(["MARKETING", "AI_TECH", "DATA"]),
    recommendedYear: z.string().optional().nullable(),
    recommendedPositions: z.array(z.string()).optional().nullable(),
    difficulty: z.string().optional().nullable(),
    referenceUrl: z.string().url().optional().or(z.literal("")).nullable(),
    referenceTitle: z.string().optional().nullable(),
    techStack: z.array(z.string()).optional().nullable(),
    isPublished: z.boolean().default(false),
    // SEO fields
    metaTitle: z.string().max(70).optional().nullable(),
    metaDescription: z.string().max(170).optional().nullable(),
    ogImage: z.string().url().optional().or(z.literal("")).nullable(),
    canonicalUrl: z.string().url().optional().or(z.literal("")).nullable(),
    noIndex: z.boolean().default(false),
}).extend({
    // 태그는 별도 테이블이므로 입력받을 때 배열로 처리
    tags: z.array(z.string()).optional(),
});

export const selectFaqSchema = createSelectSchema(faqs);

export const updateFaqSchema = insertFaqSchema.partial().extend({
    id: z.number(),
});

// Type exports
export type CreateFaqInput = z.infer<typeof insertFaqSchema>;
export type UpdateFaqInput = z.infer<typeof updateFaqSchema>;
export type FaqOutput = z.infer<typeof selectFaqSchema>;
