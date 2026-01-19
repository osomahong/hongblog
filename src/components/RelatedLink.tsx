"use client";

import Link from "next/link";
import { ComponentProps } from "react";
import { sendGAEvent } from "@/lib/gtm";

type RelatedType = "faqs" | "insights" | "classes" | "logs";

interface RelatedLinkProps extends ComponentProps<typeof Link> {
    relatedType: RelatedType;
    contentId: string;
    contentName: string;
}

export function RelatedLink({
    relatedType,
    contentId,
    contentName,
    children,
    onClick,
    ...props
}: RelatedLinkProps) {
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        // 1. dataLayer 이벤트 전송
        sendGAEvent(`related_${relatedType}`, {
            content_id: contentId,
            content_name: contentName,
        });

        // 2. 원래 onClick 핸들러 실행 (있을 경우)
        if (onClick) {
            onClick(e);
        }
    };

    return (
        <Link {...props} onClick={handleClick}>
            {children}
        </Link>
    );
}
