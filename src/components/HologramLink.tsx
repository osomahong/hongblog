"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { hologramElement } from "@/lib/canvas-fx";

// 서버 컴포넌트 목록에서 카드를 감싸는 링크.
// HTML in Canvas 지원 브라우저에서는 hover 시 홀로그램 스캔이 지나가고,
// 미지원 브라우저에서는 일반 Link와 동일하게 동작한다.
export function HologramLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={className}
      onMouseEnter={(e) => void hologramElement(e.currentTarget)}
    >
      {children}
    </Link>
  );
}
