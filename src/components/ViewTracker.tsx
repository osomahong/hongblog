"use client";

import { useEffect, useRef } from "react";
import { sendGAEvent } from "@/lib/gtm";

export type ContentType = "post" | "class" | "tags" | "about" | "ai_practice";

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

    // GTM dataLayer 이벤트 전송
    const eventMapping: Record<ContentType, string> = {
      class: "view_class",
      post: "view_insights",
      tags: "view_tag",
      about: "view_about",
      ai_practice: "view_ai_practice",
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
