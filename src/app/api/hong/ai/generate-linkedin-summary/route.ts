import { NextRequest, NextResponse } from "next/server";
import { generateLinkedInSummary } from "@/lib/ai";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { title, content, url } = body;

        if (!content || content.length < 10) {
            return NextResponse.json(
                { error: "내용이 너무 짧습니다." },
                { status: 400 }
            );
        }

        let summary = await generateLinkedInSummary({ title, content, url });

        if (!summary) {
            return NextResponse.json(
                { error: "요약 생성에 실패했습니다." },
                { status: 500 }
            );
        }

        // 최종 안전망: AI가 플레이스홀더를 남긴 경우 실제 URL로 치환
        if (url) {
            summary = summary.replace(/\{link\}|\{url\}|\{URL\}|\[링크\]|\[link\]|\[URL\]|\(link\)|\(url\)/gi, url);
            if (!summary.includes(url)) {
                summary = summary.trimEnd() + "\n" + url;
            }
        }

        return NextResponse.json({ summary });
    } catch (error) {
        console.error("LinkedIn summary generation failed:", error);
        return NextResponse.json({ error: "생성 실패" }, { status: 500 });
    }
}
