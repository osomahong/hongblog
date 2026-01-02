"use client";

import { useEffect } from "react";

type Props = {
  contentType: "post" | "faq";
  contentId: number;
};

export function ViewTracker({ contentType, contentId }: Props) {
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
