"use server";

import { checkAuth } from "@/lib/auth";
import { revalidateFaqPaths } from "@/lib/revalidate";
import { insertFaqSchema, updateFaqSchema, type CreateFaqInput, type UpdateFaqInput } from "./schema";
import { faqService } from "./service";

/**
 * FAQ 생성 Server Action
 */
export async function createFaqAction(input: CreateFaqInput) {
    try {
        await checkAuth();

        const validation = insertFaqSchema.safeParse(input);
        if (!validation.success) {
            return {
                success: false,
                error: validation.error.flatten().fieldErrors,
            };
        }

        const faq = await faqService.create(validation.data);
        await revalidateFaqPaths(faq.slug, faq.category);

        return { success: true };
    } catch (error) {
        console.error("Create FAQ error [Server Action]:", {
            error,
            input,
            message: error instanceof Error ? error.message : "Unknown error",
            stack: error instanceof Error ? error.stack : undefined
        });
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to create FAQ",
        };
    }
}

/**
 * FAQ 수정 Server Action
 */
export async function updateFaqAction(input: UpdateFaqInput) {
    try {
        await checkAuth();

        const validation = updateFaqSchema.safeParse(input);
        if (!validation.success) {
            return {
                success: false,
                error: validation.error.flatten().fieldErrors,
            };
        }

        const faq = await faqService.update(validation.data);
        await revalidateFaqPaths(faq.slug, faq.category);

        return { success: true };
    } catch (error) {
        console.error("Update FAQ error [Server Action]:", {
            error,
            input,
            message: error instanceof Error ? error.message : "Unknown error",
            stack: error instanceof Error ? error.stack : undefined
        });
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to update FAQ",
        };
    }
}

/**
 * FAQ 삭제 Server Action
 */
export async function deleteFaqAction(id: number) {
    try {
        await checkAuth();

        await faqService.delete(id);
        await revalidateFaqPaths();

        return { success: true };
    } catch (error) {
        console.error("Delete FAQ error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to delete FAQ",
        };
    }
}

/**
 * FAQ 발행 상태 토글 Server Action
 */
export async function toggleFaqPublishedAction(id: number) {
    try {
        await checkAuth();

        const faq = await faqService.togglePublished(id);
        await revalidateFaqPaths(faq?.slug, faq?.category);

        return { success: true };
    } catch (error) {
        console.error("Toggle FAQ published error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to toggle FAQ",
        };
    }
}

/**
 * FAQ 목록 조회 Server Action
 */
export async function getFaqsAction(options?: { includeDrafts?: boolean }) {
    try {
        await checkAuth();
        const faqs = await faqService.getAll(options);
        return { success: true, data: faqs };
    } catch (error) {
        console.error("Get FAQs error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to get FAQs",
        };
    }
}
