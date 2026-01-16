"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";

interface NeoTagBadgeProps {
  tag: string;
  clickable?: boolean;
  className?: string;
}

export function NeoTagBadge({
  tag,
  clickable = true,
  className,
}: NeoTagBadgeProps) {
  const baseStyles = cn(
    "inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider border-2 border-black bg-white text-black",
    clickable && "hover:bg-black hover:text-white transition-colors cursor-pointer",
    className
  );

  if (clickable) {
    return (
      <Link
        href={`/tags?tag=${encodeURIComponent(tag)}`}
        className={baseStyles}
      >
        #{tag}
      </Link>
    );
  }

  return <span className={baseStyles}>#{tag}</span>;
}
