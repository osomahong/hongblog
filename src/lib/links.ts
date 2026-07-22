/**
 * 콘텐츠 URL 생성 헬퍼.
 *
 * 클래스 상세 경로는 /class/{courseSlug}/{classSlug} 두 조각이 모두 필요하다.
 * 호출부마다 `courseInfo?.slug ?? ""` 같은 폴백을 쓰면 코스 정보가 없을 때
 * `/class//what-is-mcp` 처럼 깨진 URL이 만들어지고, 다른 코스의 슬러그를
 * 현재 코스 경로에 붙이면 404가 된다. 링크 생성을 여기로 모아 그 여지를 없앤다.
 */

interface ClassLinkSource {
    slug: string;
    courseInfo?: { slug: string } | null;
    courseSlug?: string | null;
}

/** 클래스 상세 URL. 코스 정보가 없으면 null을 반환하므로 호출부에서 링크를 생략해야 한다. */
export function classHref(cls: ClassLinkSource): string | null {
    const courseSlug = cls.courseInfo?.slug ?? cls.courseSlug ?? null;
    if (!courseSlug || !cls.slug) return null;
    return `/class/${courseSlug}/${cls.slug}`;
}

/** 코스 상세 URL. */
export function courseHref(courseSlug: string): string {
    return `/class/${courseSlug}`;
}

/** 인사이트 상세 URL. */
export function insightHref(slug: string): string {
    return `/insights/${slug}`;
}
