"use client";

import Link from "next/link";
import { sendGAEvent } from "@/lib/gtm";
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
            onClick={() => sendGAEvent(eventName, { content_title: contentTitle, content_id: contentId })}
        >
            {children}
        </Link>
    );
}
