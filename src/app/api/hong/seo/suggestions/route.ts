import { NextRequest, NextResponse } from "next/server";
import { generateSeoSuggestions } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content } = body;

    if (!title || !content) {
      return NextResponse.json({ error: "제목과 본문이 필요합니다." }, { status: 400 });
    }

    const suggestions = await generateSeoSuggestions({
      title,
      content,
    });

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error("SEO suggestions generation failed:", error);
    return NextResponse.json({ error: "생성 실패" }, { status: 500 });
  }
}
