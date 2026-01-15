import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { seoDocuments } from "@/lib/schema";
import { eq } from "drizzle-orm";

// llms.txt 파일 제공 API (public endpoint)
export async function GET() {
    try {
        // DB에서 llms.txt 가져오기
        const document = await db.query.seoDocuments.findFirst({
            where: eq(seoDocuments.documentType, "llms.txt"),
        });

        if (!document) {
            // 기본 템플릿 반환
            const fallbackContent = `# Marketing IT & AI Technology Authority

> The definitive practical guide for marketing technology and AI-driven strategies.

## About This Site

This site provides authoritative content on Generative Engine Optimization (GEO), AI/LLM marketing implementation, and MarTech solutions.

**Note:** Content is being generated. Please check back soon for comprehensive resources.

---

For more information, visit our homepage.`;

            return new NextResponse(fallbackContent, {
                status: 200,
                headers: {
                    "Content-Type": "text/plain; charset=utf-8",
                    "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
                },
            });
        }

        // DB에서 가져온 콘텐츠 반환
        return new NextResponse(document.content, {
            status: 200,
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
                "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
                "Last-Modified": document.updatedAt.toUTCString(),
            },
        });
    } catch (error) {
        console.error("Failed to serve llms.txt:", error);

        const errorContent = `# Error Loading Content

An error occurred while loading the llms.txt file. Please try again later.`;

        return new NextResponse(errorContent, {
            status: 500,
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
            },
        });
    }
}
