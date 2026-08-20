"use client";

import Link from "next/link";
import { sendGAEvent } from "@/lib/gtm";
import { useRouter } from "next/navigation";
import { ashNavigate, hologramElement } from "@/lib/canvas-fx";
import { ReactNode } from "react";

type TrackedLinkProps = {
    href: string;
    eventName: string;
    contentTitle: string;
    contentId: string | number;
    className?: string;
    children: ReactNode;
};

export function TrackedLink({ href, eventName, contentTitle, contentId, className, children }: TrackedLinkProps) {
    const router = useRouter();
    return (
        <Link
            href={href}
            className={className}
            onClick={(e) => {
                sendGAEvent(eventName, { content_name: contentTitle, content_id: contentId });
                // 재 날림 전환. 미지원 환경에서는 즉시 이동과 같다
                ashNavigate(e, () => router.push(href));
            }}
            // HTML in Canvas 지원 브라우저에서만 홀로그램 스캔이 지나간다 (카드 크기에서만 발동)
            onMouseEnter={(e) => void hologramElement(e.currentTarget)}
        >
            {children}
        </Link>
    );
}
