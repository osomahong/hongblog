#!/usr/bin/env npx tsx --tsconfig tsconfig.json

/**
 * 코스 + 클래스 일괄 배포 스크립트
 *
 * 코스를 생성하고, 지정된 클래스 JSON 파일들을 순차적으로 배포합니다.
 *
 * 사용법:
 *   DOTENV_CONFIG_PATH=.env.local npx tsx -r dotenv/config scripts/batch-publish-course.ts \
 *     --course ./data/vibe-coding-basics-course.json \
 *     --classes ./data/class-01-terminal-cli.json ./data/class-02-env-variables.json ...
 */

import { courseService, classService } from "../src/features/classes/service";
import { insertCourseSchema, insertClassSchema } from "../src/features/classes/schema";
import { getClassBySlug } from "../src/lib/queries";
import type { CreateClassInput } from "../src/features/classes/schema";
import * as fs from "fs";
import * as path from "path";

function parseArgs() {
  const args = process.argv.slice(2);
  let courseFile: string | undefined;
  const classFiles: string[] = [];
  let noImages = false;

  let mode: "course" | "classes" | null = null;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--course") {
      mode = "course";
      continue;
    }
    if (args[i] === "--classes") {
      mode = "classes";
      continue;
    }
    if (args[i] === "--no-images") {
      noImages = true;
      continue;
    }

    if (mode === "course") {
      courseFile = args[i];
      mode = null;
    } else if (mode === "classes") {
      classFiles.push(args[i]);
    }
  }

  if (!courseFile || classFiles.length === 0) {
    console.error("사용법: npx tsx scripts/batch-publish-course.ts --course <course.json> --classes <class1.json> <class2.json> ...");
    process.exit(1);
  }

  return { courseFile, classFiles, noImages };
}

async function ensureUniqueSlug(baseSlug: string): Promise<string> {
  let slug = baseSlug;
  let suffix = 2;

  while (await getClassBySlug(slug)) {
    slug = `${baseSlug}-${suffix}`;
    suffix++;
  }

  if (slug !== baseSlug) {
    console.log(`  ⚠️  슬러그 중복: "${baseSlug}" → "${slug}"`);
  }

  return slug;
}

async function main() {
  const { courseFile, classFiles, noImages } = parseArgs();

  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL 환경 변수가 설정되지 않았습니다.");
    process.exit(1);
  }

  // 1. 코스 생성
  console.log("\n📚 코스 생성 중...\n");
  const courseRaw = fs.readFileSync(courseFile, "utf-8");
  const courseData = insertCourseSchema.parse(JSON.parse(courseRaw));
  const course = await courseService.create(courseData);

  console.log(`  ✅ 코스 생성 완료: "${course.title}" (ID: ${course.id})`);
  console.log(`     Slug: ${course.slug}`);
  console.log(`     상태: ${course.isPublished ? "🟢 배포됨" : "🟡 초안"}\n`);

  // 2. 클래스 순차 배포
  console.log(`📝 클래스 ${classFiles.length}개 배포 시작...\n`);

  const results: Array<{ order: number; slug: string; term: string; id: number }> = [];

  for (const classFile of classFiles) {
    const resolved = path.resolve(classFile);
    const raw = fs.readFileSync(resolved, "utf-8");
    const json = JSON.parse(raw);

    // courseId 주입
    json.courseId = course.id;

    const parsed = insertClassSchema.parse(json);
    parsed.slug = await ensureUniqueSlug(parsed.slug);

    const result = await classService.create(parsed as CreateClassInput);

    console.log(`  ✅ [${json.orderInCourse || "?"}] ${result.term} (ID: ${result.id})`);
    results.push({
      order: json.orderInCourse || 0,
      slug: result.slug,
      term: result.term || "",
      id: result.id,
    });
  }

  // 3. 결과 요약
  console.log("\n" + "=".repeat(60));
  console.log("📊 배포 결과 요약\n");
  console.log(`  코스: ${course.title} (ID: ${course.id})`);
  console.log(`  클래스: ${results.length}개 생성 완료\n`);

  console.log("  | # | 용어 | Slug | ID |");
  console.log("  |---|------|------|----|");
  for (const r of results.sort((a, b) => a.order - b.order)) {
    console.log(`  | ${r.order} | ${r.term} | ${r.slug} | ${r.id} |`);
  }
  console.log("");
}

main().catch((err) => {
  console.error("❌ 배포 실패:", err instanceof Error ? err.message : err);
  process.exit(1);
});
