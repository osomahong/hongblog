import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { classes, courses } from "@/lib/schema";
import { z } from "zod";

// Classes 스키마
export const insertClassSchema = createInsertSchema(classes, {
    slug: (schema) =>
        schema
            .min(1, "슬러그는 필수입니다.")
            .regex(/^[a-z0-9-]+$/, "영문 소문자, 숫자, 하이픈만 가능합니다."),
    term: (schema) => schema.min(1, "용어명을 입력해주세요."),
    definition: (schema) => schema.min(1, "정의를 입력해주세요."),
    content: (schema) => schema.min(10, "내용은 최소 10자 이상이어야 합니다."),
    category: z.enum(["MARKETING", "AI_TECH", "DATA"]),
    courseId: z.number().optional().nullable(),
    orderInCourse: z.number().optional().nullable(),
    aliases: z.array(z.string()).optional().nullable(),
    relatedTerms: z.array(z.string()).optional().nullable(),
    difficulty: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]).optional().nullable(),
    isPublished: z.boolean().default(true),
    // SEO fields
    metaTitle: z.string().max(70).optional().nullable(),
    metaDescription: z.string().max(170).optional().nullable(),
    ogImage: z.string().url().optional().or(z.literal("")).nullable(),
    ogTitle: z.string().max(100).optional().nullable(),
    ogDescription: z.string().max(200).optional().nullable(),
    canonicalUrl: z.string().url().optional().or(z.literal("")).nullable(),
    noIndex: z.boolean().default(false),
}).extend({
    tags: z.array(z.string()).optional(),
});

export const selectClassSchema = createSelectSchema(classes);

export const updateClassSchema = insertClassSchema.partial().extend({
    id: z.number(),
});

// Courses 스키마
export const insertCourseSchema = createInsertSchema(courses, {
    slug: (schema) =>
        schema
            .min(1, "슬러그는 필수입니다.")
            .regex(/^[a-z0-9-]+$/, "영문 소문자, 숫자, 하이픈만 가능합니다."),
    title: (schema) => schema.min(1, "제목을 입력해주세요."),
    category: z.enum(["MARKETING", "AI_TECH", "DATA"]),
    description: z.string().optional().nullable(),
    thumbnailUrl: z.string().url().optional().or(z.literal("")).nullable(),
    difficulty: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]).optional().nullable(),
    isPublished: z.boolean().default(false),
    metaTitle: z.string().max(70).optional().nullable(),
    metaDescription: z.string().max(170).optional().nullable(),
    ogImage: z.string().url().optional().or(z.literal("")).nullable(),
    canonicalUrl: z.string().url().optional().or(z.literal("")).nullable(),
    noIndex: z.boolean().default(false),
});

export const selectCourseSchema = createSelectSchema(courses);

export const updateCourseSchema = insertCourseSchema.partial().extend({
    id: z.number(),
});

// Type exports
export type CreateClassInput = z.infer<typeof insertClassSchema>;
export type UpdateClassInput = z.infer<typeof updateClassSchema>;
export type ClassOutput = z.infer<typeof selectClassSchema>;

export type CreateCourseInput = z.infer<typeof insertCourseSchema>;
export type UpdateCourseInput = z.infer<typeof updateCourseSchema>;
export type CourseOutput = z.infer<typeof selectCourseSchema>;
