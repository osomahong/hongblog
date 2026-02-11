/**
 * 디지털 마케팅 핵심 용어 코스 + CPM/CPC/CTR 클래스 일괄 upsert 스크립트
 *
 * 사용법:
 *   npx tsx scripts/seed-marketing-terms.ts
 *   npx tsx scripts/seed-marketing-terms.ts --no-images
 */
import { config } from "dotenv";
config({ path: ".env.local" });
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import * as schema from "../src/lib/schema";
import * as fs from "fs";
import * as path from "path";

const DATA_DIR = path.join(__dirname, "data");

const COURSE_FILE = "digital-marketing-terms-course.json";
const CLASS_FILES = [
  "cpm-class.json",
  "cpc-class.json",
  "ctr-class.json",
  "conversion-class.json",
  "cvr-class.json",
  "roas-class.json",
  "roi-class.json",
];

async function main() {
  const noImages = process.argv.includes("--no-images");

  const sql = neon(process.env.DATABASE_URL!);
  const db = drizzle(sql, { schema });

  // 1. 코스 upsert
  console.log("📚 코스 upsert...");
  const courseRaw = fs.readFileSync(path.join(DATA_DIR, COURSE_FILE), "utf-8");
  const courseData = JSON.parse(courseRaw);

  const existingCourse = await db.query.courses.findFirst({
    where: eq(schema.courses.slug, courseData.slug),
  });

  let courseId: number;

  if (existingCourse) {
    const [updated] = await db
      .update(schema.courses)
      .set({ ...courseData, updatedAt: new Date() })
      .where(eq(schema.courses.id, existingCourse.id))
      .returning();
    courseId = updated.id;
    console.log(`✏️  코스 수정 완료: "${updated.title}" (id: ${courseId})`);
  } else {
    const [created] = await db
      .insert(schema.courses)
      .values(courseData)
      .returning();
    courseId = created.id;
    console.log(`✅ 코스 생성 완료: "${created.title}" (id: ${courseId})`);
  }

  // 2. 클래스 upsert (courseId 주입)
  console.log(`\n📖 클래스 upsert (courseId: ${courseId})...`);

  for (const file of CLASS_FILES) {
    const raw = fs.readFileSync(path.join(DATA_DIR, file), "utf-8");
    const data = JSON.parse(raw);
    const { tags: tagNames, ...classData } = data;
    classData.courseId = courseId;

    const existing = await db.query.classes.findFirst({
      where: eq(schema.classes.slug, classData.slug),
    });

    let classId: number;

    if (existing) {
      const [updated] = await db
        .update(schema.classes)
        .set({ ...classData, updatedAt: new Date() })
        .where(eq(schema.classes.id, existing.id))
        .returning();
      classId = updated.id;
      console.log(`  ✏️  클래스 수정: "${classData.term}" (id: ${classId})`);

      await db
        .delete(schema.classesToTags)
        .where(eq(schema.classesToTags.classId, classId));
    } else {
      const [created] = await db
        .insert(schema.classes)
        .values(classData)
        .returning();
      classId = created.id;
      console.log(`  ✅ 클래스 생성: "${classData.term}" (id: ${classId})`);
    }

    // 태그 연결
    if (tagNames && tagNames.length > 0) {
      for (const name of tagNames) {
        let tagRecord = await db.query.tags.findFirst({
          where: eq(schema.tags.name, name),
        });
        if (!tagRecord) {
          const [created] = await db
            .insert(schema.tags)
            .values({ name })
            .returning();
          tagRecord = created;
        }
        await db
          .insert(schema.classesToTags)
          .values({ classId, tagId: tagRecord.id });
        console.log(`    태그 연결: ${name}`);
      }
    }

    // 이미지 자동 삽입
    if (!noImages) {
      console.log(`  🖼️  일러스트 생성 중...`);
      try {
        const { generateAndInjectImages } = await import("../src/lib/ai-image");
        const result = await generateAndInjectImages(
          classData.content || "",
          classData.slug,
          classData.term
        );
        if (result.generatedImages.length > 0) {
          const ogImage = result.generatedImages[0].url;
          await db
            .update(schema.classes)
            .set({ content: result.content, ogImage, updatedAt: new Date() })
            .where(eq(schema.classes.id, classId));
          console.log(
            `    ✅ 이미지 ${result.generatedImages.length}개 삽입 완료`
          );
          console.log(`    🖼️  ogImage 설정: ${ogImage}`);
          for (const img of result.generatedImages) {
            console.log(`    📷 ${img.url}`);
          }
        }
        if (result.errors.length > 0) {
          for (const err of result.errors) {
            console.log(`    ⚠️  ${err}`);
          }
        }
      } catch (err) {
        console.error(
          `    ⚠️  이미지 생성 실패 (콘텐츠는 정상 저장됨):`,
          err instanceof Error ? err.message : err
        );
      }
    }
  }

  console.log("\n🎉 디지털 마케팅 핵심 용어 코스 시드 완료!");
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("❌ 오류:", e.message || e);
    process.exit(1);
  });
