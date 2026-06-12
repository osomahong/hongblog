/**
 * 판정 등급 표시 메타. 색에만 의존하지 않도록 라벨을 항상 함께 쓴다.
 */

import type { TierId } from "@/lib/game/types";

export const TIER_META: Record<TierId, { label: string; badgeClass: string }> = {
  excellent: { label: "우수", badgeClass: "bg-accent text-black" },
  pass: { label: "통과", badgeClass: "bg-white text-black" },
  rework: { label: "반려", badgeClass: "bg-primary text-white" },
  fail: { label: "마감 실패", badgeClass: "bg-black text-white" },
  incident: { label: "보안 사고", badgeClass: "bg-primary text-white" },
};
