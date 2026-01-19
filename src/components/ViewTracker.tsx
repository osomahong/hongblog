"use client";

import { useEffect, useRef } from "react";
import { sendGAEvent } from "@/lib/gtm";

export type ContentType = "post" | "faq" | "log" | "class" | "life" | "tags" | "about";

type Props = {
  contentType: ContentType;
  contentId?: number; // Optional now for tag/about
  contentTitle?: string;
  contentSlug?: string;
  category?: string;
  tags?: string[];
};

export function ViewTracker({
  contentType,
  contentId,
  contentTitle,
  contentSlug,
}: Props) {
  const firedRef = useRef<string | null>(null);

  useEffect(() => {
    // 식별자 생성을 위해 currentId 구성
    const currentId = contentId?.toString() || contentSlug || "";
    const currentIdentifier = `${contentType}:${currentId}`;

    // 이미 해당 식별자로 실행되었다면 중복 실행 방지
    if (firedRef.current === currentIdentifier) {
      return;
    }

    // 1. DB 조회수 기록 API 호출 (기존 로직 유지)
    if (contentId && ["post", "faq", "log", "class"].includes(contentType)) {
      fetch("/api/views", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentType, contentId }),
      }).catch((err) => {
        console.error("Failed to record view:", err);
      });
    }

    // 2. GTM dataLayer 이벤트 전송 (신생활용)
    const eventMapping: Record<ContentType, string> = {
      class: "view_class",
      post: "view_insights",
      log: "view_logs",
      faq: "view_faq",
      life: "view_life",
      tags: "view_tag",
      about: "view_about",
    };

    const eventName = eventMapping[contentType];
    if (eventName) {
      sendGAEvent(eventName, {
        content_id: contentSlug || "", // content_id: 접두어 제거
        content_name: contentTitle || "",
      });
      // 실행 기록 업데이트
      firedRef.current = currentIdentifier;
    }
  }, [contentType, contentId, contentTitle, contentSlug]);

  return null;
}
