/**
 * Class를 upsert(없으면 생성, 있으면 수정)하는 스크립트
 * neon-http 드라이버가 트랜잭션을 지원하지 않아 직접 처리
 *
 * 사용법:
 *   npx tsx scripts/upsert-class-direct.ts <payload.json>
 *   npx tsx scripts/upsert-class-direct.ts <payload.json> --no-images
 */
import { config } from "dotenv";
config({ path: ".env.local" });
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import * as schema from "../src/lib/schema";
import * as fs from "fs";
import { generateAndInjectImages } from "../src/lib/ai-image";

async function main() {
  const args = process.argv.slice(2);
  const noImages = args.includes("--no-images");
  const filePath = args.find((a) => !a.startsWith("--"));
  if (!filePath) {
    console.error("Usage: npx tsx scripts/upsert-class-direct.ts <payload.json> [--no-images]");
    process.exit(1);
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(raw);

  const sql = neon(process.env.DATABASE_URL!);
  const db = drizzle(sql, { schema });

  const { tags: tagNames, ...classData } = data;

  // 슬러그로 기존 레코드 확인
  const existing = await db.query.classes.findFirst({
    where: eq(schema.classes.slug, data.slug),
  });

  let classId: number;
  let action: string;

  if (existing) {
    // UPDATE
    const [updated] = await db
      .update(schema.classes)
      .set({ ...classData, updatedAt: new Date() })
      .where(eq(schema.classes.id, existing.id))
      .returning();
    classId = updated.id;
    action = "수정";
    console.log(`✏️  기존 클래스 수정 완료! (id: ${classId})`);

    // 기존 태그 연결 삭제
    await db.delete(schema.classesToTags).where(eq(schema.classesToTags.classId, classId));
  } else {
    // INSERT
    const [newClass] = await db.insert(schema.classes).values(classData).returning();
    classId = newClass.id;
    action = "생성";
    console.log(`✅ 새 클래스 생성 완료! (id: ${classId})`);
  }

  // 태그 연결
  if (tagNames && tagNames.length > 0) {
    for (const name of tagNames) {
      let tagRecord = await db.query.tags.findFirst({
        where: eq(schema.tags.name, name),
      });
      if (!tagRecord) {
        const [created] = await db.insert(schema.tags).values({ name }).returning();
        tagRecord = created;
      }
      await db.insert(schema.classesToTags).values({
        classId,
        tagId: tagRecord.id,
      });
      console.log(`  태그 연결: ${name}`);
    }
  }

  // 이미지 자동 삽입
  if (!noImages) {
    console.log("\n🖼️  일러스트 생성 중...");
    try {
      const result = await generateAndInjectImages(classData.content || data.content, data.slug, data.term);
      if (result.generatedImages.length > 0) {
        await db.update(schema.classes)
          .set({ content: result.content, updatedAt: new Date() })
          .where(eq(schema.classes.id, classId));
        console.log(`  ✅ 이미지 ${result.generatedImages.length}개 삽입 완료`);
        for (const img of result.generatedImages) {
          console.log(`  📷 ${img.url}`);
        }
      }
      if (result.errors.length > 0) {
        for (const err of result.errors) {
          console.log(`  ⚠️  ${err}`);
        }
      }
    } catch (err) {
      console.error(`  ⚠️  이미지 생성 실패 (콘텐츠는 정상 저장됨):`, err instanceof Error ? err.message : err);
    }
  }

  console.log("");
  console.log(`📄 결과 (${action}):`);
  console.log(`  ID: ${classId}`);
  console.log(`  Slug: ${data.slug}`);
  console.log(`  Term: ${data.term}`);
  console.log(`  상태: ${data.isPublished ? "🟢 배포됨" : "🟡 초안"}`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("❌ 오류:", e.message || e);
    process.exit(1);
  });
