import { Metadata } from "next";
import { getPublishedCourses } from "@/lib/data-source";
import ClassPageClient from "./ClassPageClient";
import { ListViewTracker } from "@/components/ListViewTracker";
import { SITE_URL } from "@/lib/constants";

export const revalidate = 3600;

export const metadata: Metadata = {
    title: "Class | 강의 & 개념 학습",
    description: "체계적으로 정리된 개념 강의로 기초부터 고급까지 학습하세요. 바이브코딩, 디지털 마케팅, 웹 기술의 핵심 개념을 쉽게 이해할 수 있습니다.",
    alternates: {
        canonical: `${SITE_URL}/class`,
    },
    openGraph: {
        title: "Class | 강의 & 개념 학습",
        description: "체계적으로 정리된 개념 강의로 기초부터 고급까지 학습하세요.",
        type: "website",
    },
};

export default async function ClassPage() {
    const courses = await getPublishedCourses();

    return (
        <>
            <ListViewTracker eventName="view_class_list" />
            <ClassPageClient courses={courses} />
        </>
    );
}
