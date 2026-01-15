"use client";

import Link from "next/link";
import { trackMainSectionClick, trackCategoryClick } from "@/lib/gtm";

type Props = {
    href: string;
    children: React.ReactNode;
    className?: string;
    section: 'trending' | 'category' | 'latest_insights' | 'popular_faqs' | 'tags' | 'about_author';
    contentType: 'post' | 'faq' | 'category' | 'tag' | 'about';
    contentTitle: string;
    contentSlug?: string;
    position?: number;
};

/**
 * 메인 페이지 섹션 클릭 이벤트를 추적하는 Link wrapper
 */
export function TrackedLink({
    href,
    children,
    className,
    section,
    contentType,
    contentTitle,
    contentSlug,
    position,
}: Props) {
    const handleClick = () => {
        trackMainSectionClick({
            section,
            contentType,
            contentTitle,
            contentSlug,
            position,
        });
    };

    return (
        <Link href={href} className={className} onClick={handleClick}>
            {children}
        </Link>
    );
}

type CategoryLinkProps = {
    href: string;
    children: React.ReactNode;
    className?: string;
    categoryName: 'AI_TECH' | 'DATA' | 'MARKETING';
};

/**
 * 카테고리 클릭 이벤트를 추적하는 Link wrapper
 */
export function TrackedCategoryLink({
    href,
    children,
    className,
    categoryName,
}: CategoryLinkProps) {
    const handleClick = () => {
        trackCategoryClick({
            categoryName,
            sourcePage: 'home',
            sourceLocation: 'category_card',
        });
    };

    return (
        <Link href={href} className={className} onClick={handleClick}>
            {children}
        </Link>
    );
}
