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

        const summary = await generateLinkedInSummary({ title, content, url });

        if (!summary) {
            return NextResponse.json(
                { error: "요약 생성에 실패했습니다." },
                { status: 500 }
            );
        }

        return NextResponse.json({ summary });
    } catch (error) {
        console.error("LinkedIn summary generation failed:", error);
        return NextResponse.json({ error: "생성 실패" }, { status: 500 });
    }
}
