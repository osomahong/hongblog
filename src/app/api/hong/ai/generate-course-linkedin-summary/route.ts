import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { db } from "@/lib/db";
import { courses, classes } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { SITE_URL } from "@/lib/constants";
import { generateAllCourseLinkedInSummaries } from "@/lib/ai";

export async function POST(request: NextRequest) {
    const session = await getServerSession();
    const allowedEmail = process.env.ALLOWED_GOOGLE_ID;

    if (!session || session.user?.email !== allowedEmail) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { courseId } = body;

        if (!courseId) {
            return NextResponse.json({ error: "Course ID가 필요합니다." }, { status: 400 });
        }

        // 1. 코스 정보 조회
        const course = await db.query.courses.findFirst({
            where: eq(courses.id, courseId),
        });

        if (!course) {
            return NextResponse.json({ error: "코스를 찾을 수 없습니다." }, { status: 404 });
        }

        // 2. 해당 코스의 클래스들 조회
        const courseClasses = await db.query.classes.findMany({
            where: eq(classes.courseId, courseId),
            orderBy: (classes, { asc }) => [asc(classes.orderInCourse)],
        });

        if (courseClasses.length === 0) {
            return NextResponse.json({ error: "코스에 포함된 클래스가 없습니다." }, { status: 400 });
        }

        // 3. AI 요약 생성 (3가지 버전 병렬)
        const siteUrl = SITE_URL;
        const courseUrl = `${siteUrl}/class/${course.slug}`;
        const campaign = encodeURIComponent(course.title);
        const utmUrl = `${courseUrl}?utm_source=linkedin&utm_medium=social&utm_campaign=${campaign}`;

        const summaries = await generateAllCourseLinkedInSummaries({
            courseTitle: course.title,
            courseDescription: course.description || "",
            classes: courseClasses.map(c => ({ term: c.term, definition: c.definition })),
            url: utmUrl
        });

        return NextResponse.json({ summaries });
    } catch (error) {
        console.error("Course LinkedIn summary generation failed:", error);
        return NextResponse.json({ error: "생성 실패" }, { status: 500 });
    }
}
