import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { lifeLogs } from "@/lib/schema";
import { z } from "zod";

// Log 스키마 생성
export const insertLogSchema = createInsertSchema(lifeLogs, {
    title: (schema) => schema.min(1, "제목을 입력해주세요."),
    slug: (schema) =>
        schema
            .min(1, "슬러그는 필수입니다.")
            .regex(/^[a-z0-9-]+$/, "영문 소문자, 숫자, 하이픈만 가능합니다."),
    content: (schema) => schema.min(10, "내용은 최소 10자 이상이어야 합니다."),
    category: z.enum(["MARKETING", "AI_TECH", "DATA", "맛집", "강의", "문화생활", "여행", "일상"]),
    thumbnailUrl: z.string().url().optional().or(z.literal("")).nullable(),
    location: z.string().optional().nullable(),
    visitedAt: z.string().optional().nullable(),
    rating: z.number().min(1).max(5).optional().nullable(),
    isPublished: z.boolean().default(false),
    // SEO fields
    metaTitle: z.string().max(70).optional().nullable(),
    metaDescription: z.string().max(170).optional().nullable(),
    ogImage: z.string().url().optional().or(z.literal("")).nullable(),
    ogTitle: z.string().max(100).optional().nullable(),
    ogDescription: z.string().max(200).optional().nullable(),
    canonicalUrl: z.string().url().optional().or(z.literal("")).nullable(),
    noIndex: z.boolean().default(false),
}).extend({
    // 태그는 별도 테이블이므로 입력받을 때 배열로 처리
    tags: z.array(z.string()).optional(),
});

export const selectLogSchema = createSelectSchema(lifeLogs);

export const updateLogSchema = insertLogSchema.partial().extend({
    id: z.number(),
});

// Type exports
export type CreateLogInput = z.infer<typeof insertLogSchema>;
export type UpdateLogInput = z.infer<typeof updateLogSchema>;
export type LogOutput = z.infer<typeof selectLogSchema>;
