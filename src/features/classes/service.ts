import { db } from "@/lib/db";
import { classes, courses, classesToTags, tags } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";
import type { CreateClassInput, UpdateClassInput, CreateCourseInput, UpdateCourseInput } from "./schema";

export const classService = {
    /**
     * 모든 클래스 조회
     */
    async getAll(options: { includeDrafts?: boolean; courseId?: number } = {}) {
        const { includeDrafts = false, courseId } = options;

        let result = await db.query.classes.findMany({
            orderBy: [desc(classes.createdAt)],
            with: {
                classesToTags: {
                    with: {
                        tag: true,
                    },
                },
                course: true,
            },
        });

        if (!includeDrafts) {
            result = result.filter((c) => c.isPublished);
        }

        if (courseId !== undefined) {
            result = result.filter((c) => c.courseId === courseId);
        }

        return result.map((cls) => ({
            ...cls,
            tags: cls.classesToTags.map((ct) => ct.tag.name),
            courseInfo: cls.course
                ? {
                    id: cls.course.id,
                    slug: cls.course.slug,
                    title: cls.course.title,
                }
                : null,
        }));
    },

    /**
     * 클래스 생성
     */
    async create(data: CreateClassInput) {
        const { tags: tagNames, ...classData } = data;

        return await db.transaction(async (tx) => {
            const [newClass] = await tx.insert(classes).values(classData).returning();

            if (tagNames && tagNames.length > 0) {
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

                    await tx.insert(classesToTags).values({
                        classId: newClass.id,
                        tagId,
                    });
                }
            }

            return newClass;
        });
    },

    /**
     * 클래스 수정
     */
    async update(data: UpdateClassInput) {
        const { id, tags: tagNames, ...updateData } = data;

        return await db.transaction(async (tx) => {
            const [updated] = await tx
                .update(classes)
                .set({
                    ...updateData,
                    updatedAt: new Date(),
                })
                .where(eq(classes.id, id))
                .returning();

            if (!updated) {
                throw new Error("Class not found");
            }

            if (tagNames !== undefined) {
                await tx.delete(classesToTags).where(eq(classesToTags.classId, id));

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

                        await tx.insert(classesToTags).values({
                            classId: id,
                            tagId,
                        });
                    }
                }
            }

            return updated;
        });
    },

    /**
     * 클래스 삭제
     */
    async delete(id: number) {
        await db.delete(classes).where(eq(classes.id, id));
        return { success: true };
    },

    /**
     * 클래스 발행 상태 토글
     */
    async togglePublished(id: number) {
        const cls = await db.query.classes.findFirst({
            where: eq(classes.id, id),
        });

        if (!cls) {
            throw new Error("Class not found");
        }

        const [updated] = await db
            .update(classes)
            .set({
                isPublished: !cls.isPublished,
                updatedAt: new Date(),
            })
            .where(eq(classes.id, id))
            .returning();

        return updated;
    },
};

export const courseService = {
    /**
     * 모든 코스 조회
     */
    async getAll(options: { includeDrafts?: boolean } = {}) {
        const { includeDrafts = false } = options;

        const result = await db.query.courses.findMany({
            where: includeDrafts ? undefined : eq(courses.isPublished, true),
            orderBy: [desc(courses.createdAt)],
            with: {
                classes: true,
            },
        });

        return result;
    },

    /**
     * 코스 생성
     */
    async create(data: CreateCourseInput) {
        const [newCourse] = await db.insert(courses).values(data).returning();
        return newCourse;
    },

    /**
     * 코스 수정
     */
    async update(data: UpdateCourseInput) {
        const { id, ...updateData } = data;

        const [updated] = await db
            .update(courses)
            .set({
                ...updateData,
                updatedAt: new Date(),
            })
            .where(eq(courses.id, id))
            .returning();

        if (!updated) {
            throw new Error("Course not found");
        }

        return updated;
    },

    /**
     * 코스 삭제
     */
    async delete(id: number) {
        await db.delete(courses).where(eq(courses.id, id));
        return { success: true };
    },

    /**
     * 코스 발행 상태 토글
     */
    async togglePublished(id: number) {
        const course = await db.query.courses.findFirst({
            where: eq(courses.id, id),
        });

        if (!course) {
            throw new Error("Course not found");
        }

        const [updated] = await db
            .update(courses)
            .set({
                isPublished: !course.isPublished,
                updatedAt: new Date(),
            })
            .where(eq(courses.id, id))
            .returning();

        return updated;
    },
};
