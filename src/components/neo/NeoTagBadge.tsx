"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { trackTagClick } from "@/lib/gtm";

interface NeoTagBadgeProps {
  tag: string;
  clickable?: boolean;
  className?: string;
  // GTM tracking props
  sourcePage?: 'home' | 'post' | 'faq' | 'class' | 'series';
  sourceLocation?: 'explore_tags' | 'content_header' | 'content_footer';
  sourceContentId?: number;
  sourceContentTitle?: string;
}

export function NeoTagBadge({
  tag,
  clickable = true,
  className,
  sourcePage = 'home',
  sourceLocation = 'explore_tags',
  sourceContentId,
  sourceContentTitle,
}: NeoTagBadgeProps) {
  const baseStyles = cn(
    "inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider border-2 border-black bg-white text-black",
    clickable && "hover:bg-black hover:text-white transition-colors cursor-pointer",
    className
  );

  const handleClick = () => {
    if (clickable) {
      trackTagClick({
        tagName: tag,
        sourcePage,
        sourceLocation,
        sourceContentId,
        sourceContentTitle,
      });
    }
  };

  if (clickable) {
    return (
      <Link
        href={`/tags?tag=${encodeURIComponent(tag)}`}
        className={baseStyles}
        onClick={handleClick}
      >
        #{tag}
      </Link>
    );
  }

  return <span className={baseStyles}>#{tag}</span>;
}
