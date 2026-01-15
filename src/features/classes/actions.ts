"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import {
    insertClassSchema,
    updateClassSchema,
    insertCourseSchema,
    updateCourseSchema,
    type CreateClassInput,
    type UpdateClassInput,
    type CreateCourseInput,
    type UpdateCourseInput,
} from "./schema";
import { classService, courseService } from "./service";

const ALLOWED_EMAIL = process.env.ALLOWED_GOOGLE_ID;

async function checkAuth() {
    const session = await getServerSession();
    if (!session || session.user?.email !== ALLOWED_EMAIL) {
        throw new Error("Unauthorized");
    }
}

// ========== CLASS ACTIONS ==========

export async function createClassAction(input: CreateClassInput) {
    try {
        await checkAuth();

        const validation = insertClassSchema.safeParse(input);
        if (!validation.success) {
            return {
                success: false,
                error: validation.error.flatten().fieldErrors,
            };
        }

        await classService.create(validation.data);

        revalidatePath("/class");
        revalidatePath("/hong");

        return { success: true };
    } catch (error) {
        console.error("Create class error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to create class",
        };
    }
}

export async function updateClassAction(input: UpdateClassInput) {
    try {
        await checkAuth();

        const validation = updateClassSchema.safeParse(input);
        if (!validation.success) {
            return {
                success: false,
                error: validation.error.flatten().fieldErrors,
            };
        }

        await classService.update(validation.data);

        revalidatePath("/class");
        revalidatePath("/hong");

        return { success: true };
    } catch (error) {
        console.error("Update class error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to update class",
        };
    }
}

export async function deleteClassAction(id: number) {
    try {
        await checkAuth();

        await classService.delete(id);

        revalidatePath("/class");
        revalidatePath("/hong");

        return { success: true };
    } catch (error) {
        console.error("Delete class error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to delete class",
        };
    }
}

export async function toggleClassPublishedAction(id: number) {
    try {
        await checkAuth();

        await classService.togglePublished(id);

        revalidatePath("/class");
        revalidatePath("/hong");

        return { success: true };
    } catch (error) {
        console.error("Toggle class published error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to toggle class",
        };
    }
}

export async function getClassesAction(options?: { includeDrafts?: boolean; courseId?: number }) {
    try {
        await checkAuth();
        const classes = await classService.getAll(options);
        return { success: true, data: classes };
    } catch (error) {
        console.error("Get classes error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to get classes",
        };
    }
}

// ========== COURSE ACTIONS ==========

export async function createCourseAction(input: CreateCourseInput) {
    try {
        await checkAuth();

        const validation = insertCourseSchema.safeParse(input);
        if (!validation.success) {
            return {
                success: false,
                error: validation.error.flatten().fieldErrors,
            };
        }

        await courseService.create(validation.data);

        revalidatePath("/class");
        revalidatePath("/hong");

        return { success: true };
    } catch (error) {
        console.error("Create course error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to create course",
        };
    }
}

export async function updateCourseAction(input: UpdateCourseInput) {
    try {
        await checkAuth();

        const validation = updateCourseSchema.safeParse(input);
        if (!validation.success) {
            return {
                success: false,
                error: validation.error.flatten().fieldErrors,
            };
        }

        await courseService.update(validation.data);

        revalidatePath("/class");
        revalidatePath("/hong");

        return { success: true };
    } catch (error) {
        console.error("Update course error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to update course",
        };
    }
}

export async function deleteCourseAction(id: number) {
    try {
        await checkAuth();

        await courseService.delete(id);

        revalidatePath("/class");
        revalidatePath("/hong");

        return { success: true };
    } catch (error) {
        console.error("Delete course error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to delete course",
        };
    }
}

export async function toggleCoursePublishedAction(id: number) {
    try {
        await checkAuth();

        await courseService.togglePublished(id);

        revalidatePath("/class");
        revalidatePath("/hong");

        return { success: true };
    } catch (error) {
        console.error("Toggle course published error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to toggle course",
        };
    }
}

export async function getCoursesAction(options?: { includeDrafts?: boolean }) {
    try {
        await checkAuth();
        const courses = await courseService.getAll(options);
        return { success: true, data: courses };
    } catch (error) {
        console.error("Get courses error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to get courses",
        };
    }
}
