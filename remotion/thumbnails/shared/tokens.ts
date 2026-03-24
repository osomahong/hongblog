/**
 * Neo-Brutalism 디자인 토큰
 * generate-brand-assets.ts와 동일한 디자인 시스템을 따름
 */

export const NEO = {
  BG: "#F3F3F3",
  BLACK: "#000000",
  WHITE: "#FFFFFF",
  RED: "#FF0000",
  YELLOW: "#FFD700",
  BLUE: "#0000FF",
  BORDER: 4,
  SHADOW: 6,
  SHADOW_SM: 2,
  FONT: "'Pretendard', 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif",
} as const;

export const CATEGORY_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  MARKETING: { bg: NEO.RED, text: NEO.WHITE, label: "MARKETING" },
  AI_TECH: { bg: NEO.YELLOW, text: NEO.BLACK, label: "AI · TECH" },
  DATA: { bg: NEO.BLUE, text: NEO.WHITE, label: "DATA" },
};

export const THUMBNAIL = {
  WIDTH: 1200,
  HEIGHT: 630,
  PADDING: 60,
} as const;
