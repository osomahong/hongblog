import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { lifeLogs } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";

// GET: 모든 lifeLogs 조회
export async function GET() {
  try {
    const result = await db.query.lifeLogs.findMany({
      orderBy: [desc(lifeLogs.visitedAt), desc(lifeLogs.createdAt)],
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to fetch lifeLogs:", error);
    return NextResponse.json({ error: "Failed to fetch lifeLogs" }, { status: 500 });
  }
}

// POST: 새 lifeLog 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      title, slug, content, category, thumbnailUrl, location, visitedAt, rating, isPublished,
      // SEO fields
      metaTitle, metaDescription, ogImage, ogTitle, ogDescription, canonicalUrl, noIndex
    } = body;

    if (!title || !slug || !content || !category) {
      return NextResponse.json({ error: "필수 필드가 누락되었습니다." }, { status: 400 });
    }

    const existing = await db.query.lifeLogs.findFirst({
      where: eq(lifeLogs.slug, slug),
    });

    if (existing) {
      return NextResponse.json({ error: "이미 존재하는 슬러그입니다." }, { status: 400 });
    }

    const [newLifeLog] = await db
      .insert(lifeLogs)
      .values({
        title,
        slug,
        content,
        category,
        thumbnailUrl: thumbnailUrl || null,
        location: location || null,
        visitedAt: visitedAt || null,
        rating: rating || null,
        isPublished: isPublished ?? false,
        // SEO fields
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        ogImage: ogImage || null,
        ogTitle: ogTitle || null,
        ogDescription: ogDescription || null,
        canonicalUrl: canonicalUrl || null,
        noIndex: noIndex || false,
      })
      .returning();

    return NextResponse.json({ success: true, lifeLog: newLifeLog });
  } catch (error) {
    console.error("Failed to create lifeLog:", error);
    return NextResponse.json({ error: "저장 실패" }, { status: 500 });
  }
}

// PUT: lifeLog 수정
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      id, title, slug, content, category, thumbnailUrl, location, visitedAt, rating, isPublished,
      // SEO fields
      metaTitle, metaDescription, ogImage, ogTitle, ogDescription, canonicalUrl, noIndex
    } = body;

    if (!id || !title || !slug || !content || !category) {
      return NextResponse.json({ error: "필수 필드가 누락되었습니다." }, { status: 400 });
    }

    const existing = await db.query.lifeLogs.findFirst({
      where: eq(lifeLogs.slug, slug),
    });

    if (existing && existing.id !== id) {
      return NextResponse.json({ error: "이미 존재하는 슬러그입니다." }, { status: 400 });
    }

    const [updatedLifeLog] = await db
      .update(lifeLogs)
      .set({
        title,
        slug,
        content,
        category,
        thumbnailUrl: thumbnailUrl || null,
        location: location || null,
        visitedAt: visitedAt || null,
        rating: rating || null,
        isPublished: isPublished ?? false,
        // SEO fields
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        ogImage: ogImage || null,
        ogTitle: ogTitle || null,
        ogDescription: ogDescription || null,
        canonicalUrl: canonicalUrl || null,
        noIndex: noIndex ?? false,
        updatedAt: new Date(),
      })
      .where(eq(lifeLogs.id, id))
      .returning();

    return NextResponse.json({ success: true, lifeLog: updatedLifeLog });
  } catch (error) {
    console.error("Failed to update lifeLog:", error);
    return NextResponse.json({ error: "수정 실패" }, { status: 500 });
  }
}

// DELETE: lifeLog 삭제
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID가 필요합니다." }, { status: 400 });
    }

    await db.delete(lifeLogs).where(eq(lifeLogs.id, parseInt(id, 10)));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete lifeLog:", error);
    return NextResponse.json({ error: "삭제 실패" }, { status: 500 });
  }
}
