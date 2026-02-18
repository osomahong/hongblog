import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { postToLinkedIn } from "@/lib/linkedin";

export async function POST(request: NextRequest) {
  const session = await getServerSession();
  const allowedEmail = process.env.ALLOWED_GOOGLE_ID;

  if (!session || session.user?.email !== allowedEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { text } = await request.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "텍스트가 필요합니다." },
        { status: 400 },
      );
    }

    if (text.length > 3000) {
      return NextResponse.json(
        { error: "3,000자를 초과했습니다." },
        { status: 400 },
      );
    }

    const result = await postToLinkedIn(text);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 502 },
      );
    }

    return NextResponse.json({
      success: true,
      postUrn: result.postUrn,
    });
  } catch (error) {
    console.error("LinkedIn post API error:", error);
    return NextResponse.json(
      { error: "게시 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
