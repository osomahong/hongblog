import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { SITE_URL } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function absoluteUrl(path: string) {
  // If it's localhost, use production URL for SEO/schema purposes
  if (SITE_URL.includes("localhost")) {
    return `https://www.digitalmarketer.co.kr${path}`;
  }

  return `${SITE_URL}${path}`;
}

/**
 * 마크다운 문법을 제거하고 순수 텍스트만 반환 (미리보기용)
 */
export function stripMarkdown(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, "")       // 코드 블록
    .replace(/`([^`]+)`/g, "$1")           // 인라인 코드
    .replace(/^#{1,6}\s+/gm, "")           // 헤딩
    .replace(/\*\*(.+?)\*\*/g, "$1")       // 볼드
    .replace(/\*(.+?)\*/g, "$1")           // 이탤릭
    .replace(/~~(.+?)~~/g, "$1")           // 취소선
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // 링크
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "") // 이미지
    .replace(/^[-*+]\s+/gm, "")            // 비순서 목록
    .replace(/^\d+\.\s+/gm, "")            // 순서 목록
    .replace(/^>\s+/gm, "")                // 인용
    .replace(/^---+$/gm, "")               // 수평선
    .replace(/\|[^\n]+\|/g, "")            // 테이블
    .replace(/\n{2,}/g, " ")               // 다중 줄바꿈 → 공백
    .replace(/\n/g, " ")                   // 줄바꿈 → 공백
    .trim();
}

export function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
