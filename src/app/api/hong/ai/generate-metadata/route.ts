import { NextRequest, NextResponse } from "next/server";
import { generateContentMetadata } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content } = body;

    if (!content || content.length < 100) {
      return NextResponse.json(
        { error: "본문이 너무 짧습니다. 최소 100자 이상 입력하세요." },
        { status: 400 }
      );
    }

    const metadata = await generateContentMetadata(content);

    if (!metadata) {
      return NextResponse.json(
        { error: "메타데이터 생성에 실패했습니다. 다시 시도해주세요." },
        { status: 500 }
      );
    }

    return NextResponse.json(metadata);
  } catch (error) {
    console.error("Metadata generation failed:", error);
    return NextResponse.json({ error: "생성 실패" }, { status: 500 });
  }
}
