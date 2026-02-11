/**
 * 이미지가 없는 모든 클래스에 AI 일러스트를 일괄 삽입하는 스크립트
 *
 * - content에 ![  패턴이 없는 클래스를 대상으로 함
 * - 각 클래스에 generateAndInjectImages 실행
 * - 생성된 첫 번째 이미지를 ogImage로 설정
 * - API rate limit 고려하여 순차 실행
 *
 * 사용법:
 *   npx tsx scripts/inject-images-all.ts
 *   npx tsx scripts/inject-images-all.ts --dry-run   # 대상만 확인
 *   npx tsx scripts/inject-images-all.ts --force      # 기존 이미지 제거 후 재생성
 */
import { config } from "dotenv";
config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import * as schema from "../src/lib/schema";

function stripExistingImages(content: string): string {
  return content.replace(/\n?\!\[.*?\]\(.*?\)\n?/g, "\n").replace(/\n{3,}/g, "\n\n");
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const force = process.argv.includes("--force");

  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL 환경 변수가 설정되지 않았습니다.");
    process.exit(1);
  }

  const sql = neon(process.env.DATABASE_URL!);
  const db = drizzle(sql, { schema });

  // 모든 클래스 조회
  const allClasses = await db.query.classes.findMany();

  // --force: 모든 클래스 대상, 기본: 이미지 없는 클래스만
  const targets = force
    ? allClasses
    : allClasses.filter((c) => !c.content.includes("!["));

  console.log(`\n📊 전체 클래스: ${allClasses.length}개`);
  console.log(`🎯 대상 클래스: ${targets.length}개${force ? " (--force: 전체 재생성)" : ""}\n`);

  if (targets.length === 0) {
    console.log("✅ 모든 클래스에 이미지가 있습니다. 작업 완료!");
    return;
  }

  for (const cls of targets) {
    const hasImages = cls.content.includes("![");
    console.log(`  - [${cls.id}] ${cls.term} (${cls.slug})${hasImages ? " [기존 이미지 교체]" : ""}`);
  }

  if (dryRun) {
    console.log("\n🔍 --dry-run 모드: 실제 이미지 생성 없이 종료합니다.");
    return;
  }

  console.log("\n🖼️  이미지 일괄 생성 시작...\n");

  const { generateAndInjectImages } = await import("../src/lib/ai-image");

  let successCount = 0;
  let failCount = 0;
  let totalImages = 0;

  for (let i = 0; i < targets.length; i++) {
    const cls = targets[i];
    console.log(`[${i + 1}/${targets.length}] "${cls.term}" (${cls.slug})`);

    // --force 시 기존 이미지 마크다운 제거
    const contentToProcess = force ? stripExistingImages(cls.content) : cls.content;

    try {
      const result = await generateAndInjectImages(
        contentToProcess,
        cls.slug,
        cls.term
      );

      if (result.generatedImages.length > 0) {
        const ogImage = result.generatedImages[0].url;
        await db
          .update(schema.classes)
          .set({ content: result.content, ogImage, updatedAt: new Date() })
          .where(eq(schema.classes.id, cls.id));

        totalImages += result.generatedImages.length;
        successCount++;
        console.log(`  ✅ 이미지 ${result.generatedImages.length}개 삽입, ogImage 설정 완료`);
        for (const img of result.generatedImages) {
          console.log(`  📷 ${img.url}`);
        }
      } else {
        failCount++;
        console.log(`  ⚠️  이미지 생성 결과 없음`);
      }

      if (result.errors.length > 0) {
        for (const err of result.errors) {
          console.log(`  ⚠️  ${err}`);
        }
      }
    } catch (err) {
      failCount++;
      console.error(
        `  ❌ 실패:`,
        err instanceof Error ? err.message : err
      );
    }

    // API rate limit 방지를 위한 딜레이 (마지막 항목 제외)
    if (i < targets.length - 1) {
      console.log(`  ⏳ 5초 대기...\n`);
      await new Promise((r) => setTimeout(r, 5000));
    }
  }

  console.log(`\n${"=".repeat(50)}`);
  console.log(`📊 결과 요약`);
  console.log(`  성공: ${successCount}개 클래스`);
  console.log(`  실패: ${failCount}개 클래스`);
  console.log(`  총 이미지: ${totalImages}장`);
  console.log(`${"=".repeat(50)}\n`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("❌ 오류:", e.message || e);
    process.exit(1);
  });
