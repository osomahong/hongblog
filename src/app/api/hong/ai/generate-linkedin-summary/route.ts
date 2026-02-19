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

        // UTM 파라미터 추가
        let utmUrl = url;
        if (url) {
            const sep = url.includes("?") ? "&" : "?";
            const campaign = encodeURIComponent(title || "post");
            utmUrl = `${url}${sep}utm_source=linkedin&utm_medium=social&utm_campaign=${campaign}`;
        }

        let summary = await generateLinkedInSummary({ title, content, url: utmUrl });

        if (!summary) {
            return NextResponse.json(
                { error: "요약 생성에 실패했습니다." },
                { status: 500 }
            );
        }

        // 최종 안전망: AI가 플레이스홀더를 남긴 경우 실제 URL로 치환
        if (utmUrl) {
            summary = summary.replace(/\{link\}|\{url\}|\{URL\}|\[링크\]|\[link\]|\[URL\]|\(link\)|\(url\)/gi, utmUrl);
            if (!summary.includes(utmUrl)) {
                summary = summary.trimEnd() + "\n" + utmUrl;
            }
        }

        return NextResponse.json({ summary });
    } catch (error) {
        console.error("LinkedIn summary generation failed:", error);
        return NextResponse.json({ error: "생성 실패" }, { status: 500 });
    }
}
