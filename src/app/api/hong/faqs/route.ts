import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { db } from "@/lib/db";
import { faqs, tags, faqsToTags, Faq, Tag } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";

type FaqWithRelations = Faq & {
  faqsToTags: { tag: Tag }[];
};

// GET: 모든 faqs 조회
export async function GET() {
  const session = await getServerSession();
  const allowedEmail = process.env.ALLOWED_GOOGLE_ID;

  if (!session || session.user?.email !== allowedEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await db.query.faqs.findMany({
      orderBy: [desc(faqs.createdAt)],
      with: {
        faqsToTags: {
          with: {
            tag: true,
          },
        },
      },
    }) as FaqWithRelations[];

    const faqsWithTags = result.map((faq: FaqWithRelations) => ({
      ...faq,
      tags: faq.faqsToTags.map((ft: { tag: Tag }) => ft.tag.name),
    }));

    return NextResponse.json(faqsWithTags);
  } catch (error) {
    console.error("Failed to fetch faqs:", error);
    return NextResponse.json({ error: "Failed to fetch faqs" }, { status: 500 });
  }
}

// POST: 새 faq 생성
export async function POST(request: NextRequest) {
  const session = await getServerSession();
  const allowedEmail = process.env.ALLOWED_GOOGLE_ID;

  if (!session || session.user?.email !== allowedEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      question, answer, category, isPublished, tags: tagNames,
      // Additional Metadata
      recommendedYear, recommendedPositions, difficulty, referenceUrl, referenceTitle, techStack,
      // SEO fields
      metaTitle, metaDescription, ogImage, canonicalUrl, noIndex
    } = body;

    if (!question || !answer || !category) {
      return NextResponse.json({ error: "필수 필드가 누락되었습니다." }, { status: 400 });
    }

    // 슬러그 자동 생성
    const slug = `faq-${Date.now()}`;

    // FAQ 생성
    const [newFaq] = await db
      .insert(faqs)
      .values({
        slug,
        question,
        answer,
        category,

        // Additional Metadata
        recommendedYear: recommendedYear || null,
        recommendedPositions: recommendedPositions || null,
        difficulty: difficulty || null,
        referenceUrl: referenceUrl || null,
        referenceTitle: referenceTitle || null,
        techStack: techStack || null,

        isPublished: isPublished ?? true,
        // SEO fields
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        ogImage: ogImage || null,
        canonicalUrl: canonicalUrl || null,
        noIndex: noIndex || false,
      })
      .returning();

    // 태그 처리
    if (tagNames && tagNames.length > 0) {
      await processTagsForFaq(newFaq.id, tagNames);
    }

    return NextResponse.json({ success: true, faq: newFaq });
  } catch (error) {
    console.error("Failed to create faq:", error);
    return NextResponse.json({ error: "저장 실패" }, { status: 500 });
  }
}

// PUT: faq 수정
export async function PUT(request: NextRequest) {
  const session = await getServerSession();
  const allowedEmail = process.env.ALLOWED_GOOGLE_ID;

  if (!session || session.user?.email !== allowedEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      id, question, answer, category, isPublished, tags: tagNames,
      // Additional Metadata
      recommendedYear, recommendedPositions, difficulty, referenceUrl, referenceTitle, techStack,
      // SEO fields
      metaTitle, metaDescription, ogImage, canonicalUrl, noIndex
    } = body;

    if (!id || !question || !answer || !category) {
      return NextResponse.json({ error: "필수 필드가 누락되었습니다." }, { status: 400 });
    }

    // FAQ 업데이트
    const [updatedFaq] = await db
      .update(faqs)
      .set({
        question,
        answer,
        category,

        // Additional Metadata
        recommendedYear: recommendedYear || null,
        recommendedPositions: recommendedPositions || null,
        difficulty: difficulty || null,
        referenceUrl: referenceUrl || null,
        referenceTitle: referenceTitle || null,
        techStack: techStack || null,

        isPublished: isPublished ?? false,
        // SEO fields
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        ogImage: ogImage || null,
        canonicalUrl: canonicalUrl || null,
        noIndex: noIndex ?? false,
        updatedAt: new Date(),
      })
      .where(eq(faqs.id, id))
      .returning();

    // 기존 태그 연결 삭제 후 새로 연결
    await db.delete(faqsToTags).where(eq(faqsToTags.faqId, id));

    if (tagNames && tagNames.length > 0) {
      await processTagsForFaq(id, tagNames);
    }

    return NextResponse.json({ success: true, faq: updatedFaq });
  } catch (error) {
    console.error("Failed to update faq:", error);
    return NextResponse.json({ error: "수정 실패" }, { status: 500 });
  }
}

// DELETE: faq 삭제
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

    const faqId = parseInt(id, 10);

    await db.delete(faqsToTags).where(eq(faqsToTags.faqId, faqId));
    await db.delete(faqs).where(eq(faqs.id, faqId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete faq:", error);
    return NextResponse.json({ error: "삭제 실패" }, { status: 500 });
  }
}

// 태그 처리 헬퍼 함수
async function processTagsForFaq(faqId: number, tagNames: string[]) {
  for (const tagName of tagNames) {
    const trimmedName = tagName.trim();
    if (!trimmedName) continue;

    let tag = await db.query.tags.findFirst({
      where: eq(tags.name, trimmedName),
    });

    if (!tag) {
      const [newTag] = await db.insert(tags).values({ name: trimmedName }).returning();
      tag = newTag;
    }

    await db.insert(faqsToTags).values({
      faqId,
      tagId: tag.id,
    }).onConflictDoNothing();
  }
}
