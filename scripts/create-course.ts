#!/usr/bin/env npx tsx --tsconfig tsconfig.json

/**
 * 코스 생성 스크립트
 *
 * 사용법:
 *   DOTENV_CONFIG_PATH=.env.local npx tsx -r dotenv/config scripts/create-course.ts --file ./data/course.json
 */

import { courseService } from "../src/features/classes/service";
import { insertCourseSchema } from "../src/features/classes/schema";

async function main() {
  const args = process.argv.slice(2);
  let filePath: string | undefined;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--file" && args[i + 1]) {
      filePath = args[i + 1];
      i++;
    }
  }

  if (!filePath) {
    console.error("사용법: npx tsx scripts/create-course.ts --file ./data/course.json");
    process.exit(1);
  }

  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL 환경 변수가 설정되지 않았습니다.");
    process.exit(1);
  }

  const fs = await import("fs");
  const raw = fs.readFileSync(filePath, "utf-8");
  const payload = JSON.parse(raw);

  const parsed = insertCourseSchema.parse(payload);
  const result = await courseService.create(parsed);

  console.log("✅ 코스 생성 완료!\n");
  console.log("   ID:", result.id);
  console.log("   Slug:", result.slug);
  console.log("   Title:", result.title);
  console.log("   상태:", result.isPublished ? "🟢 배포됨" : "🟡 초안");
  console.log("");

  // JSON 출력 (파이프 체이닝용)
  if (!process.stdout.isTTY) {
    process.stdout.write(JSON.stringify(result, null, 2));
  }
}

main().catch((err) => {
  console.error("❌ 코스 생성 실패:", err instanceof Error ? err.message : err);
  process.exit(1);
});
