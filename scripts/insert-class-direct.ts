/**
 * 트랜잭션 없이 Class를 직접 삽입하는 스크립트
 * neon-http 드라이버가 트랜잭션을 지원하지 않아 사용
 */
import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import * as schema from "../src/lib/schema";
import * as fs from "fs";

async function main() {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error("Usage: npx tsx scripts/insert-class-direct.ts <payload.json>");
    process.exit(1);
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(raw);

  const sql = neon(process.env.DATABASE_URL!);
  const db = drizzle(sql, { schema });

  // 슬러그 중복 체크
  const existing = await db.query.classes.findFirst({
    where: eq(schema.classes.slug, data.slug),
  });
  if (existing) {
    console.error(`❌ 슬러그 '${data.slug}' 이미 존재합니다. (id: ${existing.id})`);
    process.exit(1);
  }

  // tags를 분리
  const { tags: tagNames, ...classData } = data;

  // 클래스 삽입
  const [newClass] = await db.insert(schema.classes).values(classData).returning();
  console.log("✅ 클래스 생성 완료! ID:", newClass.id);

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
        classId: newClass.id,
        tagId: tagRecord.id,
      });
      console.log("  태그 연결:", name);
    }
  }

  console.log("");
  console.log("📄 결과:");
  console.log("  ID:", newClass.id);
  console.log("  Slug:", newClass.slug);
  console.log("  Term:", newClass.term);
  console.log("  URL: /class/digital-basic/what-is-element");
  console.log("  상태:", newClass.isPublished ? "🟢 배포됨" : "🟡 초안");
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("❌ 오류:", e.message || e);
    process.exit(1);
  });
