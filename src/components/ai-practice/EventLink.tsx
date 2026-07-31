"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { sendGAEvent } from "@/lib/gtm";

interface EventLinkProps {
    href: string;
    eventName: string;
    params: Record<string, unknown>;
    className?: string;
    children: ReactNode;
}

/** 클릭 시 지정한 이벤트와 매개변수를 dataLayer로 전송하는 링크 (AI-Practice 공용) */
export function EventLink({ href, eventName, params, className, children }: EventLinkProps) {
    return (
        <Link href={href} className={className} onClick={() => sendGAEvent(eventName, params)}>
            {children}
        </Link>
    );
}
