/**
 * 마크다운 원문에서 사람이 읽는 평문을 뽑아내는 공용 유틸.
 * content.ts의 카드 미리보기와 summary.ts의 3줄 요약이 같은 규칙을 쓰도록 한곳에 둔다.
 */

/**
 * raw text 영역(카드 description, excerpt 등)에서 마크다운 기호를 제거한다.
 * 본문 자체(content)는 그대로 두고, 별도로 노출되는 짧은 미리보기 문자열에만 사용.
 */
export function stripMarkdown(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, "") // 코드 블록 제거
    .replace(/<a [^>]*>[\s\S]*?<\/a>/g, "") // inline anchor 태그 제거
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1") // 이미지
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // 링크
    .replace(/`([^`\n]+)`/g, "$1") // 인라인 코드
    .replace(/\*\*\*([^*\n]+)\*\*\*/g, "$1") // bold+italic
    .replace(/\*\*([^*\n]+)\*\*/g, "$1") // bold
    .replace(/__([^_\n]+)__/g, "$1") // bold (underscore)
    .replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, "$1") // italic
    .replace(/(?<!_)_([^_\n]+)_(?!_)/g, "$1") // italic (underscore)
    .replace(/^#{1,6}\s+/gm, "") // 헤딩 prefix
    .replace(/^>\s*/gm, "") // blockquote
    .replace(/^[\s]*[-*+]\s+/gm, "") // 리스트 마커
    .replace(/^[\s]*\d+\.\s+/gm, "") // 번호 리스트
    .replace(/^---+\s*$/gm, "") // 수평선
    .replace(/\n{3,}/g, "\n\n") // 빈 줄 압축
    .trim();
}

/** 인라인 HTML 태그를 지우고 공백을 한 칸으로 정리한다. */
export function normalizeInline(text: string): string {
  return text
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * 평문을 문장 단위로 나눈다. 마침표 뒤에 공백이 있어야 자르므로
 * "3.5배", "v1.2" 같은 소수점과 버전 표기는 쪼개지지 않는다.
 */
export function splitSentences(text: string): string[] {
  return normalizeInline(text)
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}
