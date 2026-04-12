/**
 * 한국어/영문 혼합 텍스트의 측정 및 줄바꿈 처리
 */

function isKorean(char: string): boolean {
  const code = char.charCodeAt(0);
  return (
    (code >= 0xac00 && code <= 0xd7af) || // Hangul syllables
    (code >= 0x3130 && code <= 0x318f) || // Hangul jamo
    (code >= 0x1100 && code <= 0x11ff) // Hangul jamo extended
  );
}

function isFullWidth(char: string): boolean {
  const code = char.charCodeAt(0);
  return (
    isKorean(char) ||
    (code >= 0x4e00 && code <= 0x9fff) || // CJK Unified
    (code >= 0x3000 && code <= 0x303f) || // CJK Symbols
    (code >= 0xff00 && code <= 0xffef) // Fullwidth Forms
  );
}

function charWidth(char: string, fontSize: number): number {
  if (char === " ") return fontSize * 0.3;
  if (isFullWidth(char)) return fontSize * 0.95;
  // Latin, numbers, punctuation
  return fontSize * 0.55;
}

function measureWidth(text: string, fontSize: number): number {
  let w = 0;
  for (const ch of text) {
    w += charWidth(ch, fontSize);
  }
  return w;
}

export interface TitleStyle {
  fontSize: number;
  lineHeight: number;
  maxLines: number;
}

export function getTitleStyle(title: string): TitleStyle {
  const len = title.length;
  if (len <= 15) return { fontSize: 68, lineHeight: 88, maxLines: 3 };
  if (len <= 25) return { fontSize: 58, lineHeight: 77, maxLines: 4 };
  if (len <= 40) return { fontSize: 48, lineHeight: 66, maxLines: 5 };
  return { fontSize: 42, lineHeight: 56, maxLines: 6 };
}

export function wrapTitle(
  title: string,
  fontSize: number,
  maxWidth: number,
  maxLines: number,
): string[] {
  const safeWidth = maxWidth * 0.95; // 5% margin for measurement error
  const lines: string[] = [];
  let current = "";
  let currentWidth = 0;

  for (const char of title) {
    const cw = charWidth(char, fontSize);

    if (currentWidth + cw > safeWidth && current.length > 0) {
      // Try to break at last space
      const lastSpace = current.lastIndexOf(" ");
      if (lastSpace > current.length * 0.3) {
        lines.push(current.slice(0, lastSpace));
        current = current.slice(lastSpace + 1) + char;
        currentWidth = measureWidth(current, fontSize);
      } else {
        lines.push(current);
        current = char;
        currentWidth = cw;
      }
    } else {
      current += char;
      currentWidth += cw;
    }
  }
  if (current) lines.push(current);

  // Truncate with ellipsis if exceeding maxLines
  if (lines.length > maxLines) {
    const truncated = lines.slice(0, maxLines);
    const last = truncated[maxLines - 1];
    truncated[maxLines - 1] = last.slice(0, -1) + "…";
    return truncated;
  }

  return lines;
}

export function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
