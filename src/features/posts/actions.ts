"use server";

import { checkAuth } from "@/lib/auth";
import { revalidateInsightPaths } from "@/lib/revalidate";
import { insertPostSchema, updatePostSchema, type CreatePostInput, type UpdatePostInput } from "./schema";
import { postService } from "./service";

/**
 * 게시글 생성 Server Action
 */
export async function createPostAction(input: CreatePostInput) {
    try {
        await checkAuth();

        const validation = insertPostSchema.safeParse(input);
        if (!validation.success) {
            return {
                success: false,
                error: validation.error.flatten().fieldErrors,
            };
        }

        const post = await postService.create(validation.data);
        await revalidateInsightPaths(post.slug, post.category);

        return { success: true };
    } catch (error) {
        console.error("Create post error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to create post",
        };
    }
}

/**
 * 게시글 수정 Server Action
 */
export async function updatePostAction(input: UpdatePostInput) {
    try {
        await checkAuth();

        const validation = updatePostSchema.safeParse(input);
        if (!validation.success) {
            return {
                success: false,
                error: validation.error.flatten().fieldErrors,
            };
        }

        const post = await postService.update(validation.data);
        await revalidateInsightPaths(post.slug, post.category);

        return { success: true };
    } catch (error) {
        console.error("Update post error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to update post",
        };
    }
}

/**
 * 게시글 삭제 Server Action
 */
export async function deletePostAction(id: number) {
    try {
        await checkAuth();

        await postService.delete(id);
        await revalidateInsightPaths();

        return { success: true };
    } catch (error) {
        console.error("Delete post error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to delete post",
        };
    }
}

/**
 * 게시글 발행 상태 토글 Server Action
 */
export async function togglePostPublishedAction(id: number) {
    try {
        await checkAuth();

        const post = await postService.togglePublished(id);
        await revalidateInsightPaths(post?.slug, post?.category);

        return { success: true };
    } catch (error) {
        console.error("Toggle post published error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to toggle post",
        };
    }
}

/**
 * 게시글 목록 조회 Server Action
 */
export async function getPostsAction(options?: { includeDrafts?: boolean }) {
    try {
        await checkAuth();
        const posts = await postService.getAll(options);
        return { success: true, data: posts };
    } catch (error) {
        console.error("Get posts error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to get posts",
        };
    }
}
