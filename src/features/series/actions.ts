"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { insertSeriesSchema, updateSeriesSchema, type CreateSeriesInput, type UpdateSeriesInput } from "./schema";
import { seriesService } from "./service";

const ALLOWED_EMAIL = process.env.ALLOWED_GOOGLE_ID;

async function checkAuth() {
    const session = await getServerSession();
    if (!session || session.user?.email !== ALLOWED_EMAIL) {
        throw new Error("Unauthorized");
    }
}

export async function createSeriesAction(input: CreateSeriesInput) {
    try {
        await checkAuth();

        const validation = insertSeriesSchema.safeParse(input);
        if (!validation.success) {
            return {
                success: false,
                error: validation.error.flatten().fieldErrors,
            };
        }

        await seriesService.create(validation.data);

        revalidatePath("/series");
        revalidatePath("/hong");
        revalidatePath("/");

        return { success: true };
    } catch (error) {
        console.error("Create series error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to create series",
        };
    }
}

export async function updateSeriesAction(input: UpdateSeriesInput) {
    try {
        await checkAuth();

        const validation = updateSeriesSchema.safeParse(input);
        if (!validation.success) {
            return {
                success: false,
                error: validation.error.flatten().fieldErrors,
            };
        }

        await seriesService.update(validation.data);

        revalidatePath("/series");
        revalidatePath("/hong");
        revalidatePath("/");

        return { success: true };
    } catch (error) {
        console.error("Update series error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to update series",
        };
    }
}

export async function deleteSeriesAction(id: number) {
    try {
        await checkAuth();

        await seriesService.delete(id);

        revalidatePath("/series");
        revalidatePath("/hong");
        revalidatePath("/");

        return { success: true };
    } catch (error) {
        console.error("Delete series error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to delete series",
        };
    }
}

export async function toggleSeriesPublishedAction(id: number) {
    try {
        await checkAuth();

        await seriesService.togglePublished(id);

        revalidatePath("/series");
        revalidatePath("/hong");
        revalidatePath("/");

        return { success: true };
    } catch (error) {
        console.error("Toggle series published error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to toggle series",
        };
    }
}

export async function getSeriesAction(options?: { includeDrafts?: boolean }) {
    try {
        await checkAuth();
        const seriesList = await seriesService.getAll(options);
        return { success: true, data: seriesList };
    } catch (error) {
        console.error("Get series error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to get series",
        };
    }
}
