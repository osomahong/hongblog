/**
 * 마크다운 본문을 n번째 H2(`## `) 직전에서 두 조각으로 나눈다.
 * 본문 중간 광고 삽입 위치를 계산하는 용도.
 *
 * - 펜스 코드 블록(``` 또는 ~~~) 안의 `## `는 헤딩으로 세지 않는다.
 * - H2가 n개 미만이면 [원본 전체, ""]를 반환한다 (짧은 글에는 광고 미삽입).
 */
export function splitMarkdownAtNthH2(content: string, n: number): [string, string] {
  const lines = content.split("\n");
  let inFence = false;
  let h2Count = 0;

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (trimmed.startsWith("```") || trimmed.startsWith("~~~")) {
      inFence = !inFence;
      continue;
    }
    if (!inFence && /^##\s/.test(lines[i])) {
      h2Count++;
      if (h2Count === n) {
        return [lines.slice(0, i).join("\n"), lines.slice(i).join("\n")];
      }
    }
  }
  return [content, ""];
}
