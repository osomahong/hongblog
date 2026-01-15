import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen, CheckCircle2 } from "lucide-react";
import { getCourseBySlug } from "@/lib/queries";
import { NeoButton, NeoCard, NeoCardHeader, NeoCardTitle, NeoCardContent } from "@/components/neo";

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

    return {
        title: course.metaTitle || course.title,
        description: course.metaDescription || course.description || undefined,
        openGraph: {
            title: course.metaTitle || course.title,
            description: course.metaDescription || course.description || undefined,
            images: course.ogImage ? [course.ogImage] : undefined,
        },
    };
}

export default async function CourseDetailPage({ params }: Props) {
    const { courseSlug } = await params;
    const course = await getCourseBySlug(courseSlug);

    if (!course) {
        notFound();
    }

    return (
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
                {course.thumbnailUrl && (
                    <div className="mb-4 sm:mb-6">
                        <img
                            src={course.thumbnailUrl}
                            alt={course.title}
                            className="w-full h-48 sm:h-64 object-cover border-4 border-black neo-shadow"
                        />
                    </div>
                )}
                <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter mb-3 sm:mb-4 flex items-center gap-3">
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
                </div>
            </div>

            {/* Classes List */}
            <div className="space-y-2 sm:space-y-3">
                {course.classes.map((cls, clsIndex) => (
                    <Link
                        key={cls.id}
                        href={`/class/${courseSlug}/${cls.slug}`}
                        className="group block"
                    >
                        <div className="flex items-center gap-3 p-3 sm:p-4 border-4 border-black bg-white hover:bg-accent transition-colors">
                            <span className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full border-3 border-black flex items-center justify-center font-bold text-sm sm:text-base">
                                {clsIndex + 1}
                            </span>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-base sm:text-lg group-hover:text-primary transition-colors">
                                    {cls.term}
                                </h3>
                                {cls.definition && (
                                    <p className="text-sm sm:text-base text-muted-foreground line-clamp-2 mt-1">
                                        {cls.definition}
                                    </p>
                                )}
                            </div>
                            <span className="text-lg sm:text-xl font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                →
                            </span>
                        </div>
                    </Link>
                ))}
            </div>

            {course.classes.length === 0 && (
                <div className="text-center py-12">
                    <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">아직 추가된 개념이 없습니다.</p>
                </div>
            )}
        </div>
    );
}
