/**
 * 본문 마크다운에서 H2 또는 H3가 질문형(?로 끝남)인 경우, 다음 헤딩 직전까지의 첫 단락을
 * 답변으로 추출하여 FAQ 쌍 배열로 반환한다. 2개 이상이면 FAQPage 스키마 노출 가치 있음.
 *
 * H3를 함께 인식하는 이유: 소제목은 명사형·선언형으로 쓰고 "## 자주 묻는 질문" 섹션 아래
 * H3로 개별 질문을 두는 구조가 표준이 되었다. H2만 훑으면 그 구조의 FAQ가 전부 누락된다.
 *
 * Insight·Class 페이지 모두에서 사용한다(AEO/FAQPage 구조화 데이터 발행 목적).
 */
export function extractFaqPairs(markdown: string): { question: string; answer: string }[] {
  const lines = markdown.split("\n");
  const pairs: { question: string; answer: string }[] = [];
  let currentQ: string | null = null;
  let answerLines: string[] = [];

  const flush = () => {
    if (!currentQ) return;
    const answer = answerLines.join(" ").replace(/\s+/g, " ").trim();
    if (answer.length > 20) {
      pairs.push({ question: currentQ, answer });
    }
    currentQ = null;
    answerLines = [];
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    const qHeading = /^#{2,3}\s+(.+?)\s*$/.exec(line);
    if (qHeading) {
      flush();
      // 헤딩에서 선두 이모지(공백 포함)는 제거하여 질문 텍스트만 남긴다.
      const heading = qHeading[1].trim().replace(/^[\p{Extended_Pictographic}☀-➿]+\s*/u, "");
      // 클래스 도입부의 관심 유도 헤딩은 실제 질문이 아니므로 FAQ에서 제외한다.
      // 넣으면 답이 없는 Q&A 쌍이 FAQPage 스키마 첫 항목으로 발행된다.
      const isHookHeading = /혹시 이런 생각/.test(heading);
      if (!isHookHeading && /[?？]\s*$/.test(heading)) {
        currentQ = heading.replace(/[?？]\s*$/, "?").trim();
      }
      continue;
    }
    if (currentQ === null) continue;
    if (/^#{1,6}\s/.test(line)) {
      flush();
      continue;
    }
    if (line.trim() === "") {
      if (answerLines.length > 0) {
        flush();
      }
      continue;
    }
    if (/^!\[/.test(line.trim()) || /^\|/.test(line.trim()) || /^[-*]\s/.test(line.trim())) {
      continue;
    }
    answerLines.push(
      line
        .trim()
        .replace(/\*\*([^*]+)\*\*/g, "$1")
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1"),
    );
  }
  flush();
  return pairs;
}
