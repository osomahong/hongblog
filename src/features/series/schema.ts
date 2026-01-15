import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { series } from "@/lib/schema";
import { z } from "zod";

// Series 스키마 생성
export const insertSeriesSchema = createInsertSchema(series, {
    title: (schema) => schema.min(1, "제목을 입력해주세요."),
    slug: (schema) =>
        schema
            .min(1, "슬러그는 필수입니다.")
            .regex(/^[a-z0-9-]+$/, "영문 소문자, 숫자, 하이픈만 가능합니다."),
    description: z.string().optional().nullable(),
    thumbnailUrl: z.string().url().optional().or(z.literal("")).nullable(),
    isPublished: z.boolean().default(false),
    metaTitle: z.string().max(70).optional().nullable(),
    metaDescription: z.string().max(170).optional().nullable(),
});

export const selectSeriesSchema = createSelectSchema(series);

export const updateSeriesSchema = insertSeriesSchema.partial().extend({
    id: z.number(),
});

// Type exports
export type CreateSeriesInput = z.infer<typeof insertSeriesSchema>;
export type UpdateSeriesInput = z.infer<typeof updateSeriesSchema>;
export type SeriesOutput = z.infer<typeof selectSeriesSchema>;
