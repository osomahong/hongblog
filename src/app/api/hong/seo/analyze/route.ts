import { NextRequest, NextResponse } from "next/server";
import { analyzeSeoScore } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, metaTitle, metaDescription, content, ogImage } = body;

    if (!title || !content) {
      return NextResponse.json({ error: "제목과 본문이 필요합니다." }, { status: 400 });
    }

    const result = analyzeSeoScore({
      title,
      metaTitle,
      metaDescription,
      content,
      ogImage,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("SEO analysis failed:", error);
    return NextResponse.json({ error: "분석 실패" }, { status: 500 });
  }
}
