import { NextRequest, NextResponse } from "next/server";
import { generateMetaDescription } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content } = body;

    if (!title || !content) {
      return NextResponse.json({ error: "제목과 본문이 필요합니다." }, { status: 400 });
    }

    const description = await generateMetaDescription({
      title,
      content,
    });

    return NextResponse.json({ description });
  } catch (error) {
    console.error("Meta description generation failed:", error);
    return NextResponse.json({ error: "생성 실패" }, { status: 500 });
  }
}
