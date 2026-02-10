/**
 * 기존 콘텐츠에 AI 일러스트를 삽입하는 범용 스크립트
 *
 * 사용법:
 *   npx tsx scripts/inject-images.ts --type class --slug what-is-attribute
 *   npx tsx scripts/inject-images.ts --type post --slug my-post-slug
 *   npx tsx scripts/inject-images.ts --type faq --slug my-faq-slug
 *   npx tsx scripts/inject-images.ts --type log --slug my-log-slug
 *
 * 환경 변수:
 *   DATABASE_URL          - Neon DB 연결 문자열 (필수)
 *   GEMINI_IMAGE_API_KEY  - Gemini 이미지 생성 API 키 (필수)
 *   BLOB_READ_WRITE_TOKEN - Vercel Blob 업로드 토큰 (필수)
 */

import { config } from "dotenv";
config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import * as schema from "../src/lib/schema";
import { generateAndInjectImages } from "../src/lib/ai-image";

type ContentType = "post" | "faq" | "class" | "log";

function parseArgs(): { type: ContentType; slug: string } {
  const args = process.argv.slice(2);
  let type: ContentType | undefined;
  let slug: string | undefined;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--type" && args[i + 1]) {
      const t = args[i + 1];
      if (!["post", "faq", "class", "log"].includes(t)) {
        console.error(`❌ 지원하지 않는 타입: ${t}`);
        console.error("   사용 가능: post, faq, class, log");
        process.exit(1);
      }
      type = t as ContentType;
      i++;
    } else if (args[i] === "--slug" && args[i + 1]) {
      slug = args[i + 1];
      i++;
    }
  }

  if (!type || !slug) {
    console.error("사용법: npx tsx scripts/inject-images.ts --type <post|faq|class|log> --slug <slug>");
    process.exit(1);
  }

  return { type, slug };
}

async function main() {
  const { type, slug } = parseArgs();

  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL 환경 변수가 설정되지 않았습니다.");
    process.exit(1);
  }

  const sql = neon(process.env.DATABASE_URL!);
  const db = drizzle(sql, { schema });

  console.log(`\n🖼️  이미지 삽입 시작 (타입: ${type}, slug: ${slug})\n`);

  // 타입별 콘텐츠 조회 및 업데이트
  if (type === "post") {
    const record = await db.query.posts.findFirst({
      where: eq(schema.posts.slug, slug),
    });
    if (!record) {
      console.error(`❌ Post를 찾을 수 없습니다: ${slug}`);
      process.exit(1);
    }

    console.log(`📄 대상: "${record.title}"`);
    const result = await generateAndInjectImages(record.content, slug, record.title);
    logResult(result);

    if (result.generatedImages.length > 0) {
      await db.update(schema.posts)
        .set({ content: result.content, updatedAt: new Date() })
        .where(eq(schema.posts.id, record.id));
      console.log("✅ DB 업데이트 완료!");
    }
  } else if (type === "faq") {
    const record = await db.query.faqs.findFirst({
      where: eq(schema.faqs.slug, slug),
    });
    if (!record) {
      console.error(`❌ FAQ를 찾을 수 없습니다: ${slug}`);
      process.exit(1);
    }

    console.log(`📄 대상: "${record.question}"`);
    const result = await generateAndInjectImages(record.answer, slug, record.question);
    logResult(result);

    if (result.generatedImages.length > 0) {
      await db.update(schema.faqs)
        .set({ answer: result.content, updatedAt: new Date() })
        .where(eq(schema.faqs.id, record.id));
      console.log("✅ DB 업데이트 완료!");
    }
  } else if (type === "class") {
    const record = await db.query.classes.findFirst({
      where: eq(schema.classes.slug, slug),
    });
    if (!record) {
      console.error(`❌ Class를 찾을 수 없습니다: ${slug}`);
      process.exit(1);
    }

    console.log(`📄 대상: "${record.term}"`);
    const result = await generateAndInjectImages(record.content, slug, record.term);
    logResult(result);

    if (result.generatedImages.length > 0) {
      await db.update(schema.classes)
        .set({ content: result.content, updatedAt: new Date() })
        .where(eq(schema.classes.id, record.id));
      console.log("✅ DB 업데이트 완료!");
    }
  } else if (type === "log") {
    const record = await db.query.lifeLogs.findFirst({
      where: eq(schema.lifeLogs.slug, slug),
    });
    if (!record) {
      console.error(`❌ LifeLog를 찾을 수 없습니다: ${slug}`);
      process.exit(1);
    }

    console.log(`📄 대상: "${record.title}"`);
    const result = await generateAndInjectImages(record.content, slug, record.title);
    logResult(result);

    if (result.generatedImages.length > 0) {
      await db.update(schema.lifeLogs)
        .set({ content: result.content, updatedAt: new Date() })
        .where(eq(schema.lifeLogs.id, record.id));
      console.log("✅ DB 업데이트 완료!");
    }
  }
}

function logResult(result: { generatedImages: { url: string }[]; errors: string[] }) {
  console.log(`  생성된 이미지: ${result.generatedImages.length}개`);
  for (const img of result.generatedImages) {
    console.log(`  📷 ${img.url}`);
  }
  if (result.errors.length > 0) {
    console.log(`  ⚠️  경고:`);
    for (const err of result.errors) {
      console.log(`    - ${err}`);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("❌ 오류:", e.message || e);
    process.exit(1);
  });
