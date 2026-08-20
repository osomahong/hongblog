"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ComponentProps } from "react";
import { sendGAEvent } from "@/lib/gtm";
import { dissolvePageAndNavigate } from "@/lib/canvas-fx";

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
    const router = useRouter();

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

        // 3. HTML in Canvas 지원 브라우저에서는 화면 전체가 픽셀로 흩어진 뒤
        //    이동한다. 미지원이면 즉시 이동과 같다. 새 탭 열기(수정키)는 그대로 둔다.
        if (
            typeof props.href === "string" &&
            !e.defaultPrevented &&
            !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey &&
            e.button === 0
        ) {
            const href = props.href;
            e.preventDefault();
            void dissolvePageAndNavigate(() => router.push(href));
        }
    };

    return (
        <Link {...props} onClick={handleClick}>
            {children}
        </Link>
    );
}
