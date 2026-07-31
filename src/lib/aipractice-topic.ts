/** AI-Practice 유도 팝업을 띄울 만한 글인지 판정한다 (서버, 클라이언트 공용) */

const AI_TAGS = new Set(["AI", "자동화", "노코드", "바이브코딩"]);

export function isAiPracticeTopic(category: string, tags: string[]): boolean {
  if (category === "AI_TECH" || category === "CLAUDE_EDUCATION") return true;
  return tags.some((tag) => AI_TAGS.has(tag));
}
