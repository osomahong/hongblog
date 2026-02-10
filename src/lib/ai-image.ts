import { GoogleGenAI } from "@google/genai";
import { put } from "@vercel/blob";
import { aiModel } from "./ai";

// ============================================
// 나노바나나 프로 (Gemini 3 Pro Image) 일러스트 생성
// ============================================

const imageAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_IMAGE_API_KEY!,
});

// --- 타입 정의 ---

interface H2Section {
  title: string;
  startLine: number;
  body: string;
  index: number;
}

interface ImagePosition {
  sectionIndex: number;
  sectionTitle: string;
  sectionContent: string;
  insertLine: number;
}

export interface GeneratedImage {
  url: string;
  altText: string;
  sectionIndex: number;
  prompt: string;
}

export interface ContentWithImages {
  content: string;
  generatedImages: GeneratedImage[];
  errors: string[];
}

// --- 메인 함수 ---

export async function generateAndInjectImages(
  content: string,
  slug: string,
  topic: string,
): Promise<ContentWithImages> {
  const errors: string[] = [];
  const generatedImages: GeneratedImage[] = [];

  try {
    const sections = parseH2Sections(content);
    const lines = content.split("\n");
    const positions = calculateImagePositions(sections, lines.length);

    for (let i = 0; i < positions.length; i++) {
      const pos = positions[i];

      try {
        // 1. 프롬프트 생성
        const prompt = await generateImagePrompt(
          pos.sectionTitle,
          pos.sectionContent,
          topic,
        );

        // 2. 이미지 생성 (1회 재시도)
        let imageBuffer: Buffer | null = null;
        try {
          imageBuffer = await generateImage(prompt);
        } catch (firstError) {
          console.error(
            `Image generation attempt 1 failed for section ${pos.sectionIndex}:`,
            firstError,
          );
          try {
            imageBuffer = await generateImage(prompt);
          } catch (retryError) {
            console.error(
              `Image generation attempt 2 failed for section ${pos.sectionIndex}:`,
              retryError,
            );
            errors.push(
              `이미지 ${i + 1} 생성 실패 (섹션: ${pos.sectionTitle}): ${retryError instanceof Error ? retryError.message : String(retryError)}`,
            );
            continue;
          }
        }

        if (!imageBuffer) {
          errors.push(
            `이미지 ${i + 1} 생성 결과가 비어 있음 (섹션: ${pos.sectionTitle})`,
          );
          continue;
        }

        // 3. Blob 업로드
        let blobUrl: string;
        try {
          blobUrl = await uploadImageToBlob(imageBuffer, slug, i);
        } catch (uploadError) {
          console.error(
            `Blob upload failed for section ${pos.sectionIndex}:`,
            uploadError,
          );
          errors.push(
            `이미지 ${i + 1} 업로드 실패 (섹션: ${pos.sectionTitle}): ${uploadError instanceof Error ? uploadError.message : String(uploadError)}`,
          );
          continue;
        }

        // 4. alt text 생성
        const altText = await generateAltText(pos.sectionTitle, topic);

        generatedImages.push({
          url: blobUrl,
          altText,
          sectionIndex: pos.sectionIndex,
          prompt,
        });
      } catch (err) {
        errors.push(
          `이미지 ${i + 1} 처리 중 예외 (섹션: ${pos.sectionTitle}): ${err instanceof Error ? err.message : String(err)}`,
        );
      }
    }

    // 5. 마크다운에 이미지 삽입
    const finalContent =
      generatedImages.length > 0
        ? injectImagesIntoMarkdown(
            content,
            positions,
            generatedImages,
          )
        : content;

    if (generatedImages.length === 0 && positions.length > 0) {
      errors.push("모든 이미지 생성에 실패하여 이미지 없이 진행합니다.");
    }

    return { content: finalContent, generatedImages, errors };
  } catch (err) {
    errors.push(
      `이미지 생성 전체 프로세스 실패: ${err instanceof Error ? err.message : String(err)}`,
    );
    return { content, generatedImages: [], errors };
  }
}

// --- 내부 함수 ---

/**
 * 마크다운을 H2 기준으로 분리, 각 섹션의 제목/시작줄/본문 추출
 */
function parseH2Sections(content: string): H2Section[] {
  const lines = content.split("\n");
  const sections: H2Section[] = [];

  let currentSection: H2Section | null = null;
  let bodyLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith("## ")) {
      // 이전 섹션 저장
      if (currentSection) {
        currentSection.body = bodyLines.join("\n").trim();
        sections.push(currentSection);
      }

      currentSection = {
        title: line.replace(/^## /, "").trim(),
        startLine: i,
        body: "",
        index: sections.length,
      };
      bodyLines = [];
    } else if (currentSection) {
      bodyLines.push(line);
    }
  }

  // 마지막 섹션 저장
  if (currentSection) {
    currentSection.body = bodyLines.join("\n").trim();
    sections.push(currentSection);
  }

  return sections;
}

/**
 * 글의 1/3, 2/3 지점에 해당하는 H2 섹션 찾기 → 삽입 줄 번호 반환
 */
function calculateImagePositions(
  sections: H2Section[],
  totalLines: number,
): ImagePosition[] {
  if (sections.length === 0) return [];

  const positions: ImagePosition[] = [];

  if (sections.length >= 3) {
    // N >= 3: sections[floor(N/3)], sections[floor(2*N/3)]
    const idx1 = Math.floor(sections.length / 3);
    const idx2 = Math.floor((2 * sections.length) / 3);

    positions.push(makePosition(sections[idx1]));
    positions.push(makePosition(sections[idx2]));
  } else if (sections.length === 2) {
    // 2개: 각 섹션 첫 문단 뒤
    positions.push(makePosition(sections[0]));
    positions.push(makePosition(sections[1]));
  } else {
    // 1개 이하: 전체 줄 수 기준 1/3, 2/3 지점
    const oneThird = Math.floor(totalLines / 3);
    const twoThirds = Math.floor((2 * totalLines) / 3);

    positions.push({
      sectionIndex: 0,
      sectionTitle: sections[0]?.title || "본문",
      sectionContent: sections[0]?.body.substring(0, 500) || "",
      insertLine: findNearestParagraphEnd(
        sections[0]?.body || "",
        oneThird - (sections[0]?.startLine || 0),
        sections[0]?.startLine || 0,
      ),
    });
    positions.push({
      sectionIndex: 0,
      sectionTitle: sections[0]?.title || "본문",
      sectionContent: sections[0]?.body.substring(0, 500) || "",
      insertLine: findNearestParagraphEnd(
        sections[0]?.body || "",
        twoThirds - (sections[0]?.startLine || 0),
        sections[0]?.startLine || 0,
      ),
    });
  }

  return positions;
}

/**
 * 섹션에서 첫 문단 끝 줄 번호를 찾아 ImagePosition 생성
 */
function makePosition(section: H2Section): ImagePosition {
  const bodyLines = section.body.split("\n");
  let insertLine = section.startLine + 1; // 기본: H2 바로 다음 줄

  // 첫 문단 끝 찾기 (빈 줄로 구분)
  for (let i = 0; i < bodyLines.length; i++) {
    if (bodyLines[i].trim() === "" && i > 0) {
      insertLine = section.startLine + 1 + i;
      break;
    }
    // 마지막 줄까지 빈 줄이 없으면 본문 끝
    if (i === bodyLines.length - 1) {
      insertLine = section.startLine + 1 + i + 1;
    }
  }

  return {
    sectionIndex: section.index,
    sectionTitle: section.title,
    sectionContent: section.body.substring(0, 500),
    insertLine,
  };
}

/**
 * 특정 오프셋에 가장 가까운 문단 끝(빈 줄) 찾기
 */
function findNearestParagraphEnd(
  body: string,
  targetOffset: number,
  sectionStart: number,
): number {
  const lines = body.split("\n");
  const paragraphEnds: number[] = [];

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === "" && i > 0) {
      paragraphEnds.push(i);
    }
  }

  if (paragraphEnds.length === 0) {
    return sectionStart + Math.min(targetOffset, lines.length);
  }

  // targetOffset에 가장 가까운 문단 끝 찾기
  let closest = paragraphEnds[0];
  let minDist = Math.abs(paragraphEnds[0] - targetOffset);

  for (const end of paragraphEnds) {
    const dist = Math.abs(end - targetOffset);
    if (dist < minDist) {
      closest = end;
      minDist = dist;
    }
  }

  return sectionStart + closest + 1;
}

/**
 * 기존 aiModel로 섹션 내용→영어 일러스트 프롬프트 변환
 */
async function generateImagePrompt(
  sectionTitle: string,
  sectionContent: string,
  topic: string,
): Promise<string> {
  const prompt = `Given this blog section about "${sectionTitle}" (topic: "${topic}"):
"${sectionContent.substring(0, 500)}"

Generate a single-sentence illustration prompt for an AI image generator.
The illustration should be:
- Clean, professional conceptual diagram or illustration
- Flat design style, minimal, suitable for a tech/marketing blog
- No text in the image
- White or light background
Output only the prompt, nothing else.`;

  try {
    const result = await aiModel.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error("Image prompt generation failed:", error);
    // 폴백: 직접 프롬프트 생성
    return `A clean, minimal flat design illustration about ${sectionTitle}, professional conceptual diagram, white background, no text`;
  }
}

/**
 * Gemini 3 Pro Image API 호출 → base64 PNG를 Buffer로 반환
 */
async function generateImage(prompt: string): Promise<Buffer> {
  const response = await imageAI.models.generateContent({
    model: "gemini-3-pro-image-preview",
    contents: prompt,
    config: { responseModalities: ["TEXT", "IMAGE"] },
  });

  if (!response.candidates?.[0]?.content?.parts) {
    throw new Error("Gemini 응답에 콘텐츠가 없습니다");
  }

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData?.data) {
      return Buffer.from(part.inlineData.data, "base64");
    }
  }

  throw new Error("Gemini 응답에 이미지 데이터가 없습니다");
}

/**
 * Vercel Blob에 PNG 업로드 → 공개 URL 반환
 */
async function uploadImageToBlob(
  imageBuffer: Buffer,
  slug: string,
  index: number,
): Promise<string> {
  const blob = await put(
    `illustrations/${slug}-${index}-${Date.now()}.png`,
    imageBuffer,
    { access: "public", contentType: "image/png" },
  );
  return blob.url;
}

/**
 * 섹션 제목과 토픽 기반으로 한국어 alt text 생성
 */
async function generateAltText(
  sectionTitle: string,
  topic: string,
): Promise<string> {
  try {
    const result = await aiModel.generateContent(
      `다음 블로그 섹션의 일러스트에 적합한 한국어 alt text를 작성하세요.
섹션: "${sectionTitle}" (주제: "${topic}")

규칙:
- 30-80자
- "~를 보여주는 개념도" 또는 "~를 설명하는 일러스트" 형태
- alt text만 출력, 따옴표 없이`,
    );
    return result.response.text().trim();
  } catch {
    return `${sectionTitle} 관련 개념을 설명하는 일러스트`;
  }
}

/**
 * 줄 번호 기준으로 ![alt](url) 삽입 (역순 삽입으로 인덱스 보정)
 */
function injectImagesIntoMarkdown(
  content: string,
  positions: ImagePosition[],
  images: GeneratedImage[],
): string {
  const lines = content.split("\n");

  // 이미지를 positions와 매칭 (sectionIndex 기준)
  const insertions: { line: number; markdown: string }[] = [];

  for (const image of images) {
    const pos = positions.find((p) => p.sectionIndex === image.sectionIndex);
    if (pos) {
      insertions.push({
        line: pos.insertLine,
        markdown: `\n![${image.altText}](${image.url})\n`,
      });
    }
  }

  // 역순 삽입 (뒤에서부터 삽입해야 앞쪽 인덱스가 밀리지 않음)
  insertions.sort((a, b) => b.line - a.line);

  for (const insertion of insertions) {
    const lineIdx = Math.min(insertion.line, lines.length);
    lines.splice(lineIdx, 0, insertion.markdown);
  }

  return lines.join("\n");
}
