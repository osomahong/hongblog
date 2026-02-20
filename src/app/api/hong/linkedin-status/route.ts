import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { db } from "@/lib/db";
import { posts, courses } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function PATCH(request: NextRequest) {
  const session = await getServerSession();
  const allowedEmail = process.env.ALLOWED_GOOGLE_ID;

  if (!session || session.user?.email !== allowedEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { contentType, contentId, linkedinPostedAt } = body;

    if (!contentType || !contentId) {
      return NextResponse.json({ error: "contentType과 contentId가 필요합니다." }, { status: 400 });
    }

    if (contentType !== "post" && contentType !== "course") {
      return NextResponse.json({ error: "contentType은 post 또는 course만 가능합니다." }, { status: 400 });
    }

    const table = contentType === "post" ? posts : courses;
    const value = linkedinPostedAt ? new Date(linkedinPostedAt) : null;

    await db
      .update(table)
      .set({ linkedinPostedAt: value })
      .where(eq(table.id, contentId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to update linkedin status:", error);
    return NextResponse.json({ error: "LinkedIn 상태 업데이트 실패" }, { status: 500 });
  }
}
