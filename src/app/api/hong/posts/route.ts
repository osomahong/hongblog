import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { posts, tags, postsToTags, Post, Tag } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";

type PostWithRelations = Post & {
  postsToTags: { tag: Tag }[];
};

// GET: 모든 posts 조회
export async function GET() {
  try {
    const result = await db.query.posts.findMany({
      orderBy: [desc(posts.createdAt)],
      with: {
        postsToTags: {
          with: {
            tag: true,
          },
        },
      },
    }) as PostWithRelations[];

    const postsWithTags = result.map((post: PostWithRelations) => ({
      ...post,
      tags: post.postsToTags.map((pt: { tag: Tag }) => pt.tag.name),
    }));

    return NextResponse.json(postsWithTags);
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

// POST: 새 post 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      title, slug, excerpt, content, category, highlights, thumbnailUrl, tags: tagNames,
      isPublished,
      seriesId, seriesOrder,
      // SEO fields
      metaTitle, metaDescription, ogImage, ogTitle, ogDescription, canonicalUrl, noIndex
    } = body;

    if (!title || !slug || !content || !category) {
      return NextResponse.json({ error: "필수 필드가 누락되었습니다." }, { status: 400 });
    }

    // 슬러그 중복 체크
    const existing = await db.query.posts.findFirst({
      where: eq(posts.slug, slug),
    });

    if (existing) {
      return NextResponse.json({ error: "이미 존재하는 슬러그입니다." }, { status: 400 });
    }

    // Post 생성
    const [newPost] = await db
      .insert(posts)
      .values({
        title,
        slug,
        excerpt: excerpt || null,
        content,
        category,
        highlights: highlights || null,
        thumbnailUrl: thumbnailUrl || null,
        isPublished: isPublished ?? true,
        seriesId: seriesId || null,
        seriesOrder: seriesOrder ?? null,
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

    // 태그 처리
    if (tagNames && tagNames.length > 0) {
      await processTagsForPost(newPost.id, tagNames);
    }

    return NextResponse.json({ success: true, post: newPost });
  } catch (error) {
    console.error("Failed to create post:", error);
    return NextResponse.json({ error: "저장 실패" }, { status: 500 });
  }
}


// PUT: post 수정
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      id, title, slug, excerpt, content, category, highlights, thumbnailUrl, tags: tagNames,
      isPublished,
      seriesId, seriesOrder,
      // SEO fields
      metaTitle, metaDescription, ogImage, ogTitle, ogDescription, canonicalUrl, noIndex
    } = body;

    if (!id || !title || !slug || !content || !category) {
      return NextResponse.json({ error: "필수 필드가 누락되었습니다." }, { status: 400 });
    }

    // 슬러그 중복 체크 (자기 자신 제외)
    const existing = await db.query.posts.findFirst({
      where: eq(posts.slug, slug),
    });

    if (existing && existing.id !== id) {
      return NextResponse.json({ error: "이미 존재하는 슬러그입니다." }, { status: 400 });
    }

    // Post 업데이트
    const [updatedPost] = await db
      .update(posts)
      .set({
        title,
        slug,
        excerpt: excerpt || null,
        content,
        category,
        highlights: highlights || null,
        thumbnailUrl: thumbnailUrl || null,
        isPublished: isPublished ?? false,
        seriesId: seriesId || null,
        seriesOrder: seriesOrder ?? null,
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
      .where(eq(posts.id, id))
      .returning();

    // 기존 태그 연결 삭제 후 새로 연결
    await db.delete(postsToTags).where(eq(postsToTags.postId, id));

    if (tagNames && tagNames.length > 0) {
      await processTagsForPost(id, tagNames);
    }

    return NextResponse.json({ success: true, post: updatedPost });
  } catch (error) {
    console.error("Failed to update post:", error);
    return NextResponse.json({ error: "수정 실패" }, { status: 500 });
  }
}

// DELETE: post 삭제
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID가 필요합니다." }, { status: 400 });
    }

    const postId = parseInt(id, 10);

    // 태그 연결 먼저 삭제 (cascade로 자동 삭제되지만 명시적으로)
    await db.delete(postsToTags).where(eq(postsToTags.postId, postId));

    // Post 삭제
    await db.delete(posts).where(eq(posts.id, postId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete post:", error);
    return NextResponse.json({ error: "삭제 실패" }, { status: 500 });
  }
}

// 태그 처리 헬퍼 함수
async function processTagsForPost(postId: number, tagNames: string[]) {
  for (const tagName of tagNames) {
    const trimmedName = tagName.trim();
    if (!trimmedName) continue;

    // 태그가 있으면 가져오고, 없으면 생성
    let tag = await db.query.tags.findFirst({
      where: eq(tags.name, trimmedName),
    });

    if (!tag) {
      const [newTag] = await db.insert(tags).values({ name: trimmedName }).returning();
      tag = newTag;
    }

    // post-tag 연결
    await db.insert(postsToTags).values({
      postId,
      tagId: tag.id,
    }).onConflictDoNothing();
  }
}
