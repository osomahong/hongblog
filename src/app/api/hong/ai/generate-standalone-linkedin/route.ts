import { NextRequest, NextResponse } from "next/server";
import { generateAllStandaloneLinkedIn } from "@/lib/ai";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { topic } = body;

        if (!topic || topic.trim().length < 5) {
            return NextResponse.json(
                { error: "주제를 5자 이상 입력해주세요." },
                { status: 400 }
            );
        }

        const versions = await generateAllStandaloneLinkedIn(topic.trim());

        return NextResponse.json({ versions });
    } catch (error) {
        console.error("Standalone LinkedIn generation failed:", error);
        return NextResponse.json({ error: "생성 실패" }, { status: 500 });
    }
}
