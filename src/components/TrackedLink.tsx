"use client";

import Link from "next/link";
import { sendGAEvent } from "@/lib/gtm";
import { hologramElement } from "@/lib/canvas-fx";
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
    return (
        <Link
            href={href}
            className={className}
            onClick={() => sendGAEvent(eventName, { content_name: contentTitle, content_id: contentId })}
            // HTML in Canvas 지원 브라우저에서만 홀로그램 스캔이 지나간다 (카드 크기에서만 발동)
            onMouseEnter={(e) => void hologramElement(e.currentTarget)}
        >
            {children}
        </Link>
    );
}
