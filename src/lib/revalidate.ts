"use server";

import { revalidatePath } from "next/cache";

export async function revalidateInsightPaths(slug?: string, category?: string, seriesSlug?: string) {
    revalidatePath("/insights");
    revalidatePath("/");
    revalidatePath("/tags");
    revalidatePath("/feed.xml");
    revalidatePath("/sitemap.xml");
    if (slug) revalidatePath(`/insights/${slug}`);
    if (category) revalidatePath(`/category/${category.toLowerCase()}`);
    if (seriesSlug) revalidatePath(`/series/${seriesSlug}`);
}

export async function revalidateFaqPaths(slug?: string, category?: string) {
    revalidatePath("/faq");
    revalidatePath("/");
    revalidatePath("/tags");
    if (slug) revalidatePath(`/faq/${slug}`);
    if (category) revalidatePath(`/category/${category.toLowerCase()}`);
}

export async function revalidateClassPaths(classSlug?: string, courseSlug?: string) {
    revalidatePath("/class");
    revalidatePath("/");
    if (courseSlug) {
        revalidatePath(`/class/${courseSlug}`);
        if (classSlug) revalidatePath(`/class/${courseSlug}/${classSlug}`);
    }
}

export async function revalidateCoursePaths(courseSlug?: string) {
    revalidatePath("/class");
    revalidatePath("/");
    if (courseSlug) revalidatePath(`/class/${courseSlug}`);
}

export async function revalidateLogPaths(slug?: string) {
    revalidatePath("/logs");
    revalidatePath("/");
    revalidatePath("/about/life");
    if (slug) {
        revalidatePath(`/logs/${slug}`);
        revalidatePath(`/about/life/${slug}`);
    }
}

export async function revalidateSeriesPaths(slug?: string) {
    revalidatePath("/series");
    revalidatePath("/");
    if (slug) revalidatePath(`/series/${slug}`);
}
