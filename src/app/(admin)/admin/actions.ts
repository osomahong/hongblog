"use server";

import { generateTagsFromContent } from "@/lib/ai";

export async function generateTagsAction(content: string): Promise<{
  success: boolean;
  tags?: string[];
  error?: string;
}> {
  if (!content || content.trim().length < 50) {
    return {
      success: false,
      error: "콘텐츠가 너무 짧습니다. 최소 50자 이상 입력해주세요.",
    };
  }

  try {
    const tags = await generateTagsFromContent(content);
    return {
      success: true,
      tags,
    };
  } catch (error) {
    console.error("Tag generation error:", error);
    return {
      success: false,
      error: "태그 생성 중 오류가 발생했습니다. 다시 시도해주세요.",
    };
  }
}
