import { Metadata } from "next";
import { getPublishedCourses } from "@/lib/content";
import ClassPageClient from "./ClassPageClient";
import { ListViewTracker } from "@/components/ListViewTracker";
import { SITE_URL, SITE_NAME, SECTION_LABELS } from "@/lib/constants";
import { absoluteUrl } from "@/lib/utils";

export const dynamic = "force-static";

const PAGE_TITLE = "AI 마케팅 개념학습";
// layout의 title template은 하위 세그먼트에만 적용되고 같은 세그먼트의 page는 건너뛴다.
// 그래서 섹션 루트인 이 페이지는 라벨과 브랜드를 붙인 완성형을 직접 지정한다.
const FULL_TITLE = `${SECTION_LABELS.class} | ${PAGE_TITLE} | ${SITE_NAME}`;
const PAGE_DESCRIPTION = "체계적으로 정리된 개념 강의로 기초부터 고급까지 학습하세요. 바이브코딩, 디지털 마케팅, 웹 기술, 클로드 교육의 핵심 개념을 쉽게 이해할 수 있습니다.";
const PAGE_OG_IMAGE = absoluteUrl("/og-default.png");

export const metadata: Metadata = {
    title: { absolute: FULL_TITLE },
    description: PAGE_DESCRIPTION,
    alternates: {
        canonical: `${SITE_URL}/class`,
    },
    openGraph: {
        title: FULL_TITLE,
        description: PAGE_DESCRIPTION,
        type: "website",
        url: `${SITE_URL}/class`,
        images: [{ url: PAGE_OG_IMAGE, width: 1200, height: 630 }],
    },
    twitter: {
        card: "summary_large_image",
        title: FULL_TITLE,
        description: PAGE_DESCRIPTION,
        images: [PAGE_OG_IMAGE],
    },
};

export default async function ClassPage() {
    const courses = await getPublishedCourses();

    const collectionLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "@id": `${SITE_URL}/class`,
        url: `${SITE_URL}/class`,
        name: PAGE_TITLE,
        description: PAGE_DESCRIPTION,
        inLanguage: "ko",
        isPartOf: {
            "@type": "WebSite",
            name: "준이아빠블로그",
            url: SITE_URL,
        },
    };

    const itemListLd = courses.length > 0 ? {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "전체 강의 코스",
        numberOfItems: courses.length,
        itemListOrder: "https://schema.org/ItemListOrderDescending",
        itemListElement: courses.map((course, idx) => ({
            "@type": "ListItem",
            position: idx + 1,
            item: {
                "@type": "Course",
                "@id": absoluteUrl(`/class/${course.slug}`),
                url: absoluteUrl(`/class/${course.slug}`),
                name: course.title,
                description: course.description,
                inLanguage: "ko",
                provider: {
                    "@type": "Person",
                    name: "준이아빠",
                    url: absoluteUrl("/about"),
                },
            },
        })),
    } : null;

    const breadcrumbLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
            { "@type": "ListItem", position: 2, name: "Class", item: `${SITE_URL}/class` },
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }}
            />
            {itemListLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }}
                />
            )}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
            />
            <ListViewTracker eventName="view_class_list" />
            <ClassPageClient courses={courses} />
        </>
    );
}
