/**
 * Element 클래스 글에 일러스트 이미지 2장을 생성하고 DB를 업데이트하는 스크립트
 */
import "dotenv/config";
import { GoogleGenAI } from "@google/genai";
import { put } from "@vercel/blob";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import * as schema from "../src/lib/schema";

const imageAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_IMAGE_API_KEY!,
});

async function generateImage(prompt: string): Promise<Buffer> {
  console.log("  이미지 생성 중...", prompt.substring(0, 80));
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

async function main() {
  const sql = neon(process.env.DATABASE_URL!);
  const db = drizzle(sql, { schema });

  // 1. Element 클래스 조회
  const elementClass = await db.query.classes.findFirst({
    where: eq(schema.classes.slug, "what-is-element"),
  });

  if (!elementClass) {
    console.error("❌ what-is-element 클래스를 찾을 수 없습니다");
    process.exit(1);
  }

  console.log("✅ Element 클래스 조회 완료 (ID:", elementClass.id, ")");

  // 2. 이미지 프롬프트 정의
  const imagePrompts = [
    {
      prompt:
        "A clean, minimal flat design illustration showing colorful LEGO-like building blocks assembling into a webpage layout. Different colored blocks represent different elements: red block for button, blue flat block for container, green block with a picture icon for image, yellow block with text lines for paragraph. White background, no text, professional conceptual diagram style.",
      section: "레고 블록 비유",
      insertAfter: "## 🧱 첫 번째 비유: 레고 블록",
    },
    {
      prompt:
        "A clean, minimal flat design illustration showing three delivery boxes with different labels/stickers. First box has a tag showing its type (div, button), second box has a shipping label with attributes (id, class), third box is open showing content inside (text, image). White background, no text in the illustration, professional conceptual diagram style suitable for a tech blog.",
      section: "택배 상자 비유",
      insertAfter: "## 📦 두 번째 비유: 택배 상자의 '송장'",
    },
  ];

  let content = elementClass.content;

  for (let i = 0; i < imagePrompts.length; i++) {
    const { prompt, section, insertAfter } = imagePrompts[i];
    console.log(`\n🎨 이미지 ${i + 1}/2 생성: ${section}`);

    try {
      const buffer = await generateImage(prompt);
      console.log("  ✅ 이미지 생성 성공 (크기:", buffer.length, "bytes)");

      // Vercel Blob 업로드
      const blob = await put(
        `illustrations/what-is-element-${i}-${Date.now()}.png`,
        buffer,
        { access: "public", contentType: "image/png" },
      );
      console.log("  ✅ 업로드 완료:", blob.url);

      // 마크다운에 이미지 삽입 (H2 헤딩 다음 첫 빈 줄 뒤)
      const marker = insertAfter;
      const markerIdx = content.indexOf(marker);
      if (markerIdx !== -1) {
        const afterMarker = content.indexOf("\n\n", markerIdx);
        if (afterMarker !== -1) {
          const altText =
            i === 0
              ? "웹사이트 요소를 레고 블록에 비유한 개념도"
              : "웹사이트 요소의 구성을 택배 상자에 비유한 개념도";
          const imgMarkdown = `\n\n![${altText}](${blob.url})\n`;
          content =
            content.slice(0, afterMarker + 2) +
            imgMarkdown +
            content.slice(afterMarker + 2);
          console.log("  ✅ 마크다운에 이미지 삽입 완료");
        }
      }
    } catch (err) {
      console.error(
        `  ❌ 이미지 ${i + 1} 실패:`,
        err instanceof Error ? err.message : err,
      );
    }
  }

  // 3. DB 업데이트
  if (content !== elementClass.content) {
    await db
      .update(schema.classes)
      .set({ content, updatedAt: new Date() })
      .where(eq(schema.classes.id, elementClass.id));
    console.log("\n✅ DB 업데이트 완료!");
  } else {
    console.log("\n⚠️ 이미지 삽입 변경사항 없음");
  }
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("❌ 오류:", e.message || e);
    process.exit(1);
  });
