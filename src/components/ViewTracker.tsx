"use client";

import { useEffect } from "react";

type ContentType = "post" | "faq" | "log" | "class";

type Props = {
  contentType: ContentType;
  contentId: number;
  contentTitle?: string;
  contentSlug?: string;
  category?: string;
  tags?: string[];
};

export function ViewTracker({
  contentType,
  contentId,
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
  }, [contentType, contentId]);

  return null;
}
