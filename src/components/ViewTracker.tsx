"use client";

import { useEffect } from "react";
import { trackViewContent } from "@/lib/gtm";

type ContentType = "post" | "faq" | "class";

type Props = {
  contentType: ContentType;
  contentId: number;
  contentTitle: string;
  contentSlug: string;
  category?: string;
  tags?: string[];
};

export function ViewTracker({
  contentType,
  contentId,
  contentTitle,
  contentSlug,
  category,
  tags
}: Props) {
  useEffect(() => {
    // 조회수 기록 API 호출
    fetch("/api/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contentType, contentId }),
    }).catch((err) => {
      console.error("Failed to record view:", err);
    });

    // GTM dataLayer 이벤트 전송
    trackViewContent({
      contentType,
      contentId,
      contentTitle,
      contentSlug,
      category,
      tags,
    });
  }, [contentType, contentId, contentTitle, contentSlug, category, tags]);

  return null;
}
