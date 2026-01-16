import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { classes, classesToTags, tags } from "@/lib/schema";
import { eq, inArray } from "drizzle-orm";

// GET: 모든 Classes 조회
export async function GET(request: NextRequest) {
    const session = await getServerSession();
    const allowedEmail = process.env.ALLOWED_GOOGLE_ID;

    if (!session || session.user?.email !== allowedEmail) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const searchParams = request.nextUrl.searchParams;
        const includeUnpublished = searchParams.get("includeUnpublished") === "true";
        const courseId = searchParams.get("courseId");

        let query = db.query.classes.findMany({
            with: {
                classesToTags: {
                    with: {
                        tag: true,
                    },
                },
                course: true,
            },
        });

        // Note: Drizzle query builder doesn't support dynamic where clauses easily
        // For now, fetch all and filter in memory
        let result = await query;

        if (!includeUnpublished) {
            result = result.filter((c: any) => c.isPublished);
        }
        if (courseId) {
            result = result.filter((c: any) => c.courseId === parseInt(courseId));
        }

        // Transform to include tags array
        const transformed = result.map((cls: any) => ({
            ...cls,
            tags: cls.classesToTags.map((ct: any) => ct.tag.name),
        }));

        return NextResponse.json(transformed);
    } catch (error) {
        console.error("Error fetching classes:", error);
        return NextResponse.json(
            { error: "Failed to fetch classes" },
            { status: 500 }
        );
    }
}

// POST: 새 Class 생성
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
            courseId,
            orderInCourse,
            term,
            definition,
            content,
            category,
            aliases,
            relatedTerms,
            difficulty,
            isPublished = true,
            metaTitle,
            metaDescription,
            ogImage,
            ogTitle,
            ogDescription,
            canonicalUrl,
            noIndex = false,
            tagNames = [],
        } = body;

        // Validate required fields
        if (!slug || !term || !definition || !content || !category) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Create class
        const [cls] = await db
            .insert(classes)
            .values({
                slug,
                courseId: courseId || null,
                orderInCourse: orderInCourse || null,
                term,
                definition,
                content,
                category,
                aliases,
                relatedTerms,
                difficulty,
                isPublished,
                metaTitle,
                metaDescription,
                ogImage,
                ogTitle,
                ogDescription,
                canonicalUrl,
                noIndex,
            })
            .returning();

        // Handle tags
        if (tagNames && tagNames.length > 0) {
            const tagRecords = await Promise.all(
                tagNames.map(async (tagName: string) => {
                    const [tag] = await db
                        .insert(tags)
                        .values({ name: tagName })
                        .onConflictDoUpdate({
                            target: tags.name,
                            set: { name: tagName },
                        })
                        .returning();
                    return tag;
                })
            );

            await db.insert(classesToTags).values(
                tagRecords.map((tag) => ({
                    classId: cls.id,
                    tagId: tag.id,
                }))
            );
        }

        // Invalidate cache for class pages
        const course = courseId ? await db.query.courses.findFirst({ where: eq(require("@/lib/schema").courses.id, courseId) }) : null;
        if (course) {
            revalidatePath(`/class/${course.slug}`);
            revalidatePath(`/class/${course.slug}/${cls.slug}`);
        }
        revalidatePath('/class');
        revalidatePath('/');

        return NextResponse.json(cls, { status: 201 });
    } catch (error: any) {
        console.error("Error creating class:", error);

        if (error.code === "23505") {
            return NextResponse.json(
                { error: "Class with this slug already exists" },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { error: "Failed to create class" },
            { status: 500 }
        );
    }
}

// PUT: Class 수정
export async function PUT(request: NextRequest) {
    const session = await getServerSession();
    const allowedEmail = process.env.ALLOWED_GOOGLE_ID;

    if (!session || session.user?.email !== allowedEmail) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { id, tagNames, ...updateData } = body;

        if (!id) {
            return NextResponse.json(
                { error: "Missing class ID" },
                { status: 400 }
            );
        }

        const [updated] = await db
            .update(classes)
            .set({
                ...updateData,
                updatedAt: new Date(),
            })
            .where(eq(classes.id, id))
            .returning();

        if (!updated) {
            return NextResponse.json(
                { error: "Class not found" },
                { status: 404 }
            );
        }

        // Update tags if provided
        if (tagNames !== undefined) {
            // Remove existing tags
            await db.delete(classesToTags).where(eq(classesToTags.classId, id));

            // Add new tags
            if (tagNames.length > 0) {
                const tagRecords = await Promise.all(
                    tagNames.map(async (tagName: string) => {
                        const [tag] = await db
                            .insert(tags)
                            .values({ name: tagName })
                            .onConflictDoUpdate({
                                target: tags.name,
                                set: { name: tagName },
                            })
                            .returning();
                        return tag;
                    })
                );

                await db.insert(classesToTags).values(
                    tagRecords.map((tag) => ({
                        classId: id,
                        tagId: tag.id,
                    }))
                );
            }
        }

        // Invalidate cache for class pages
        const course = updated.courseId ? await db.query.courses.findFirst({ where: eq(require("@/lib/schema").courses.id, updated.courseId) }) : null;
        if (course) {
            revalidatePath(`/class/${course.slug}`);
            revalidatePath(`/class/${course.slug}/${updated.slug}`);
        }
        revalidatePath('/class');
        revalidatePath('/');

        return NextResponse.json(updated);
    } catch (error) {
        console.error("Error updating class:", error);
        return NextResponse.json(
            { error: "Failed to update class" },
            { status: 500 }
        );
    }
}

// DELETE: Class 삭제
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
                { error: "Missing class ID" },
                { status: 400 }
            );
        }

        await db.delete(classes).where(eq(classes.id, parseInt(id)));

        // Invalidate cache
        revalidatePath('/class');
        revalidatePath('/');

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting class:", error);
        return NextResponse.json(
            { error: "Failed to delete class" },
            { status: 500 }
        );
    }
}
