/**
 * 마크다운 콘텐츠에서 이미지 URL을 추출하는 유틸리티
 */

const MARKDOWN_IMAGE_REGEX = /!\[([^\]]*)\]\(([^)]+)\)/g;

export function extractMarkdownImages(
  content: string
): Array<{ alt: string; url: string }> {
  const images: Array<{ alt: string; url: string }> = [];
  let match;
  while ((match = MARKDOWN_IMAGE_REGEX.exec(content)) !== null) {
    images.push({ alt: match[1], url: match[2] });
  }
  return images;
}

export function extractFirstImageUrl(content: string): string | null {
  const match = /!\[[^\]]*\]\(([^)]+)\)/.exec(content);
  return match ? match[1] : null;
}
