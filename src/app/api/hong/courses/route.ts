import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { db } from "@/lib/db";
import { courses } from "@/lib/schema";
import { eq } from "drizzle-orm";

// GET: 모든 Courses 조회
export async function GET(request: NextRequest) {
    const session = await getServerSession();
    const allowedEmail = process.env.ALLOWED_GOOGLE_ID;

    if (!session || session.user?.email !== allowedEmail) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const searchParams = request.nextUrl.searchParams;
        const includeUnpublished = searchParams.get("includeUnpublished") === "true";

        let result;
        if (includeUnpublished) {
            result = await db.query.courses.findMany();
        } else {
            result = await db.query.courses.findMany({
                where: eq(courses.isPublished, true),
            });
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error("Error fetching courses:", error);
        return NextResponse.json(
            { error: "Failed to fetch courses" },
            { status: 500 }
        );
    }
}

// POST: 새 Course 생성
export async function POST(request: NextRequest) {
    const session = await getServerSession();
    const allowedEmail = process.env.ALLOWED_GOOGLE_ID;

    if (!session || session.user?.email !== allowedEmail) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const {
            slug,
            title,
            description,
            category,
            thumbnailUrl,
            difficulty,
            isPublished = false,
            metaTitle,
            metaDescription,
            ogImage,
            canonicalUrl,
            noIndex = false,
        } = body;

        // Validate required fields
        if (!slug || !title || !category) {
            return NextResponse.json(
                { error: "Missing required fields: slug, title, category" },
                { status: 400 }
            );
        }

        // Create course
        const [course] = await db
            .insert(courses)
            .values({
                slug,
                title,
                description,
                category,
                thumbnailUrl,
                difficulty,
                isPublished,
                metaTitle,
                metaDescription,
                ogImage,
                canonicalUrl,
                noIndex,
            })
            .returning();

        return NextResponse.json(course, { status: 201 });
    } catch (error: any) {
        console.error("Error creating course:", error);

        if (error.code === "23505") {
            return NextResponse.json(
                { error: "Course with this slug already exists" },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { error: "Failed to create course" },
            { status: 500 }
        );
    }
}

// PUT: Course 수정
export async function PUT(request: NextRequest) {
    const session = await getServerSession();
    const allowedEmail = process.env.ALLOWED_GOOGLE_ID;

    if (!session || session.user?.email !== allowedEmail) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { id, ...updateData } = body;

        if (!id) {
            return NextResponse.json(
                { error: "Missing course ID" },
                { status: 400 }
            );
        }

        const [updated] = await db
            .update(courses)
            .set({
                ...updateData,
                updatedAt: new Date(),
            })
            .where(eq(courses.id, id))
            .returning();

        if (!updated) {
            return NextResponse.json(
                { error: "Course not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(updated);
    } catch (error) {
        console.error("Error updating course:", error);
        return NextResponse.json(
            { error: "Failed to update course" },
            { status: 500 }
        );
    }
}

// DELETE: Course 삭제
export async function DELETE(request: NextRequest) {
    const session = await getServerSession();
    const allowedEmail = process.env.ALLOWED_GOOGLE_ID;

    if (!session || session.user?.email !== allowedEmail) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const searchParams = request.nextUrl.searchParams;
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { error: "Missing course ID" },
                { status: 400 }
            );
        }

        await db.delete(courses).where(eq(courses.id, parseInt(id)));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting course:", error);
        return NextResponse.json(
            { error: "Failed to delete course" },
            { status: 500 }
        );
    }
}
