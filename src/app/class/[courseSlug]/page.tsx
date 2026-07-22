import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen } from "lucide-react";
import { getPublishedCourseBySlug as getCourseBySlug, getPublishedCourses } from "@/lib/content";
import { NeoButton } from "@/components/neo";
import { CourseClassList } from "@/components/CourseClassList";
import { SITE_URL } from "@/lib/constants";
import { absoluteUrl } from "@/lib/utils";

const educationalLevelMap: Record<string, string> = {
    BEGINNER: "Beginner",
    INTERMEDIATE: "Intermediate",
    ADVANCED: "Advanced",
};

export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams() {
    const courses = await getPublishedCourses();
    return courses.map((course) => ({ courseSlug: course.slug }));
}

type Props = {
    params: Promise<{ courseSlug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { courseSlug } = await params;
    const course = await getCourseBySlug(courseSlug);

    if (!course) {
        return {
            title: "Course Not Found",
        };
    }

    const effectiveTitle = course.metaTitle || course.title;
    const effectiveDescription = course.metaDescription || course.description || undefined;
    const courseUrl = absoluteUrl(`/class/${courseSlug}`);
    const ogImage = absoluteUrl(`/og/${courseSlug}.png`);

    return {
        title: effectiveTitle,
        description: effectiveDescription,
        alternates: {
            canonical: `${SITE_URL}/class/${courseSlug}`,
        },
        openGraph: {
            title: effectiveTitle,
            description: effectiveDescription,
            type: "website",
            url: courseUrl,
            images: [{ url: ogImage, width: 1200, height: 630 }],
        },
        twitter: {
            card: "summary_large_image",
            title: effectiveTitle,
            description: effectiveDescription,
            images: [ogImage],
        },
    };
}

export default async function CourseDetailPage({ params }: Props) {
    const { courseSlug } = await params;
    const course = await getCourseBySlug(courseSlug);

    if (!course) {
        notFound();
    }

    // Schema.org JSON-LD
    const courseUrl = absoluteUrl(`/class/${courseSlug}`);
    const courseImage = absoluteUrl(`/og/${courseSlug}.png`);
    const educationalLevel = course.difficulty ? educationalLevelMap[course.difficulty] : undefined;
    const datePublished = course.createdAt instanceof Date
        ? course.createdAt.toISOString()
        : new Date(course.createdAt).toISOString();

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Course",
        "@id": courseUrl,
        url: courseUrl,
        name: course.title,
        description: course.description,
        image: courseImage,
        inLanguage: "ko",
        ...(educationalLevel ? { educationalLevel } : {}),
        ...(course.classes.length > 0
            ? {
                  teaches: course.classes.map((cls) => cls.term),
                  numberOfCredits: course.classCount,
                  syllabusSections: course.classes.map((cls, idx) => ({
                      "@type": "Syllabus",
                      name: cls.term,
                      description: cls.definition || undefined,
                      position: idx + 1,
                      url: absoluteUrl(`/class/${courseSlug}/${cls.slug}`),
                  })),
              }
            : { numberOfCredits: course.classCount }),
        audience: {
            "@type": "EducationalAudience",
            educationalRole: "lifelong learner",
        },
        datePublished,
        dateCreated: datePublished,
        provider: {
            "@type": "Person",
            name: "준이아빠",
            url: absoluteUrl("/about"),
        },
        publisher: {
            "@type": "Organization",
            name: "준이아빠블로그",
            url: SITE_URL,
            logo: {
                "@type": "ImageObject",
                url: absoluteUrl("/favicon.ico"),
            },
        },
        hasCourseInstance: {
            "@type": "CourseInstance",
            courseMode: "online",
            courseWorkload: "PT1H",
            inLanguage: "ko",
        },
    };

    // 코스 내 클래스 목록을 ItemList로 추가 발행 (검색 결과 풍부도 향상)
    const itemListLd = course.classes.length > 0 ? {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: `${course.title} 커리큘럼`,
        itemListOrder: "https://schema.org/ItemListOrderAscending",
        numberOfItems: course.classes.length,
        itemListElement: course.classes.map((cls, idx) => ({
            "@type": "ListItem",
            position: idx + 1,
            url: absoluteUrl(`/class/${courseSlug}/${cls.slug}`),
            name: cls.term,
        })),
    } : null;

    const breadcrumbLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
            { "@type": "ListItem", position: 2, name: "Class", item: absoluteUrl("/class") },
            { "@type": "ListItem", position: 3, name: course.title, item: absoluteUrl(`/class/${courseSlug}`) },
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
            />
            {itemListLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }}
                />
            )}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
            {/* Back Button */}
            <Link href="/class" className="inline-block mb-4 sm:mb-6">
                <NeoButton variant="outline" size="sm">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    강의 목록
                </NeoButton>
            </Link>

            {/* Course Header */}
            <div className="mb-6 sm:mb-10">
                <h1 className="text-3xl sm:text-5xl font-black tracking-tighter mb-3 sm:mb-4 flex items-center gap-3">
                    <BookOpen className="w-8 h-8 sm:w-12 sm:h-12" />
                    {course.title}
                </h1>
                {course.description && (
                    <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                        {course.description}
                    </p>
                )}
                <div className="mt-4 flex items-center gap-3 text-sm text-muted-foreground">
                    <span>{course.classCount}개 개념</span>
                    {course.totalReadingTime > 0 && (
                        <span>총 학습 약 {course.totalReadingTime}분</span>
                    )}
                </div>
            </div>

            {/* Classes List (학습 진도 표시 포함) */}
            <CourseClassList courseSlug={courseSlug} classes={course.classes} />

            {course.classes.length === 0 && (
                <div className="text-center py-12">
                    <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">아직 추가된 개념이 없습니다.</p>
                </div>
            )}
        </div>
        </>
    );
}
