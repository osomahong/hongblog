import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { db } from "@/lib/db";
import { series, posts, Series } from "@/lib/schema";
import { eq, desc, asc } from "drizzle-orm";

type SeriesWithPosts = Series & {
  posts: { id: number; title: string; slug: string; seriesOrder: number | null }[];
};

// GET: 모든 시리즈 조회
export async function GET() {
  const session = await getServerSession();
  const allowedEmail = process.env.ALLOWED_GOOGLE_ID;

  if (!session || session.user?.email !== allowedEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await db.query.series.findMany({
      orderBy: [desc(series.createdAt)],
      with: {
        posts: {
          orderBy: [asc(posts.seriesOrder), asc(posts.createdAt)],
          columns: {
            id: true,
            title: true,
            slug: true,
            seriesOrder: true,
          },
        },
      },
    }) as SeriesWithPosts[];

    const seriesWithCount = result.map((s) => ({
      ...s,
      postCount: s.posts.length,
    }));

    return NextResponse.json(seriesWithCount);
  } catch (error) {
    console.error("Failed to fetch series:", error);
    return NextResponse.json({ error: "Failed to fetch series" }, { status: 500 });
  }
}

// POST: 새 시리즈 생성
export async function POST(request: NextRequest) {
  const session = await getServerSession();
  const allowedEmail = process.env.ALLOWED_GOOGLE_ID;

  if (!session || session.user?.email !== allowedEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, slug, description, thumbnailUrl, isPublished, metaTitle, metaDescription } = body;

    if (!title || !slug) {
      return NextResponse.json({ error: "제목과 슬러그는 필수입니다." }, { status: 400 });
    }

    const existing = await db.query.series.findFirst({
      where: eq(series.slug, slug),
    });

    if (existing) {
      return NextResponse.json({ error: "이미 존재하는 슬러그입니다." }, { status: 400 });
    }

    const [newSeries] = await db
      .insert(series)
      .values({
        title,
        slug,
        description: description || null,
        thumbnailUrl: thumbnailUrl || null,
        isPublished: isPublished ?? true,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
      })
      .returning();

    return NextResponse.json({ success: true, series: newSeries });
  } catch (error) {
    console.error("Failed to create series:", error);
    return NextResponse.json({ error: "저장 실패" }, { status: 500 });
  }
}

// PUT: 시리즈 수정
export async function PUT(request: NextRequest) {
  const session = await getServerSession();
  const allowedEmail = process.env.ALLOWED_GOOGLE_ID;

  if (!session || session.user?.email !== allowedEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, title, slug, description, thumbnailUrl, isPublished, metaTitle, metaDescription } = body;

    if (!id || !title || !slug) {
      return NextResponse.json({ error: "필수 필드가 누락되었습니다." }, { status: 400 });
    }

    const existing = await db.query.series.findFirst({
      where: eq(series.slug, slug),
    });

    if (existing && existing.id !== id) {
      return NextResponse.json({ error: "이미 존재하는 슬러그입니다." }, { status: 400 });
    }

    const [updatedSeries] = await db
      .update(series)
      .set({
        title,
        slug,
        description: description || null,
        thumbnailUrl: thumbnailUrl || null,
        isPublished: isPublished ?? false,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        updatedAt: new Date(),
      })
      .where(eq(series.id, id))
      .returning();

    return NextResponse.json({ success: true, series: updatedSeries });
  } catch (error) {
    console.error("Failed to update series:", error);
    return NextResponse.json({ error: "수정 실패" }, { status: 500 });
  }
}

// DELETE: 시리즈 삭제
export async function DELETE(request: NextRequest) {
  const session = await getServerSession();
  const allowedEmail = process.env.ALLOWED_GOOGLE_ID;

  if (!session || session.user?.email !== allowedEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID가 필요합니다." }, { status: 400 });
    }

    const seriesId = parseInt(id, 10);

    // 시리즈에 속한 글들의 seriesId를 null로 설정
    await db.update(posts).set({ seriesId: null, seriesOrder: null }).where(eq(posts.seriesId, seriesId));

    // 시리즈 삭제
    await db.delete(series).where(eq(series.id, seriesId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete series:", error);
    return NextResponse.json({ error: "삭제 실패" }, { status: 500 });
  }
}
