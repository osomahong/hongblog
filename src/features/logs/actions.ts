"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { insertLogSchema, updateLogSchema, type CreateLogInput, type UpdateLogInput } from "./schema";
import { logService } from "./service";

const ALLOWED_EMAIL = process.env.ALLOWED_GOOGLE_ID;

async function checkAuth() {
    const session = await getServerSession();
    if (!session || session.user?.email !== ALLOWED_EMAIL) {
        throw new Error("Unauthorized");
    }
}

/**
 * 로그 생성 Server Action
 */
export async function createLogAction(input: CreateLogInput) {
    try {
        await checkAuth();

        const validation = insertLogSchema.safeParse(input);
        if (!validation.success) {
            return {
                success: false,
                error: validation.error.flatten().fieldErrors,
            };
        }

        await logService.create(validation.data);

        revalidatePath("/logs");
        revalidatePath("/hong");
        revalidatePath("/");

        return { success: true };
    } catch (error) {
        console.error("Create log error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to create log",
        };
    }
}

/**
 * 로그 수정 Server Action
 */
export async function updateLogAction(input: UpdateLogInput) {
    try {
        await checkAuth();

        const validation = updateLogSchema.safeParse(input);
        if (!validation.success) {
            return {
                success: false,
                error: validation.error.flatten().fieldErrors,
            };
        }

        await logService.update(validation.data);

        revalidatePath("/logs");
        revalidatePath("/hong");
        revalidatePath("/");

        return { success: true };
    } catch (error) {
        console.error("Update log error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to update log",
        };
    }
}

/**
 * 로그 삭제 Server Action
 */
export async function deleteLogAction(id: number) {
    try {
        await checkAuth();

        await logService.delete(id);

        revalidatePath("/logs");
        revalidatePath("/hong");
        revalidatePath("/");

        return { success: true };
    } catch (error) {
        console.error("Delete log error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to delete log",
        };
    }
}

/**
 * 로그 발행 상태 토글 Server Action
 */
export async function toggleLogPublishedAction(id: number) {
    try {
        await checkAuth();

        await logService.togglePublished(id);

        revalidatePath("/logs");
        revalidatePath("/hong");
        revalidatePath("/");

        return { success: true };
    } catch (error) {
        console.error("Toggle log published error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to toggle log",
        };
    }
}

/**
 * 로그 목록 조회 Server Action
 */
export async function getLogsAction(options?: { includeDrafts?: boolean }) {
    try {
        await checkAuth();
        const logs = await logService.getAll(options);
        return { success: true, data: logs };
    } catch (error) {
        console.error("Get logs error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to get logs",
        };
    }
}
