/**
 * 기존 포스트의 ogImage를 콘텐츠 내 첫 번째 이미지로 일괄 업데이트하는 마이그레이션 스크립트
 *
 * 사용법:
 *   npx tsx scripts/update-og-images.ts --dry-run   # 대상 확인만
 *   npx tsx scripts/update-og-images.ts              # 실제 업데이트
 */

import { config } from "dotenv";
config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import { posts } from "../src/lib/schema";
import * as schema from "../src/lib/schema";
import { extractFirstImageUrl } from "../src/lib/markdown-utils";

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL 환경 변수가 필요합니다.");
    process.exit(1);
  }

  const dryRun = process.argv.includes("--dry-run");

  const sql = neon(process.env.DATABASE_URL);
  const db = drizzle(sql, { schema });

  console.log(`\n🔍 ogImage 업데이트 ${dryRun ? "(DRY RUN)" : ""}\n`);

  const allPosts = await db.query.posts.findMany({
    columns: { id: true, slug: true, title: true, content: true, ogImage: true },
  });

  let updated = 0;
  let skipped = 0;

  for (const post of allPosts) {
    const firstImage = extractFirstImageUrl(post.content);

    if (!firstImage) {
      console.log(`  ⏭️  [${post.id}] ${post.slug} — 콘텐츠에 이미지 없음`);
      skipped++;
      continue;
    }

    if (post.ogImage === firstImage) {
      console.log(`  ✅ [${post.id}] ${post.slug} — 이미 일치`);
      skipped++;
      continue;
    }

    const prev = post.ogImage || "(없음)";
    console.log(`  🔄 [${post.id}] ${post.slug}`);
    console.log(`       이전: ${prev}`);
    console.log(`       변경: ${firstImage}`);

    if (!dryRun) {
      await db.update(posts)
        .set({ ogImage: firstImage, updatedAt: new Date() })
        .where(eq(posts.id, post.id));
    }

    updated++;
  }

  console.log("\n────────────────────────────");
  console.log(`  전체: ${allPosts.length}개`);
  console.log(`  업데이트${dryRun ? " 예정" : ""}: ${updated}개`);
  console.log(`  스킵: ${skipped}개`);
  console.log("────────────────────────────\n");
}

main().catch((err) => {
  console.error("❌ 오류:", err instanceof Error ? err.message : err);
  process.exit(1);
});
