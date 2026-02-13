#!/usr/bin/env npx tsx --tsconfig tsconfig.json

/**
 * 콘텐츠 배포 스크립트
 *
 * CLI에서 서비스 레이어를 직접 호출하여 DB에 콘텐츠를 삽입한다.
 * content-ops 스킬의 Phase 4에서 사용.
 *
 * 사용법:
 *   npx tsx scripts/publish-content.ts --type post < payload.json
 *   npx tsx scripts/publish-content.ts --type faq --file ./data/faq.json
 *   npx tsx scripts/publish-content.ts --type class --file ./data/class.json
 *   npx tsx scripts/publish-content.ts --type log --file ./data/log.json
 *
 * 환경 변수:
 *   DATABASE_URL - Neon DB 연결 문자열 (필수)
 */

import { postService } from "../src/features/posts/service";
import { faqService } from "../src/features/faqs/service";
import { classService } from "../src/features/classes/service";
import { logService } from "../src/features/logs/service";
import { insertPostSchema, type CreatePostInput } from "../src/features/posts/schema";
import { insertFaqSchema, type CreateFaqInput } from "../src/features/faqs/schema";
import { insertClassSchema, type CreateClassInput } from "../src/features/classes/schema";
import { insertLogSchema, type CreateLogInput } from "../src/features/logs/schema";
import { getPostBySlug, getFaqBySlug, getClassBySlug, getLogBySlug } from "../src/lib/queries";
import { generateAndInjectImages } from "../src/lib/ai-image";

// ============================================
// CLI 인자 파싱
// ============================================

type ContentType = "post" | "faq" | "class" | "log";

function parseArgs(): { type: ContentType; filePath?: string; noImages: boolean } {
  const args = process.argv.slice(2);
  let type: ContentType | undefined;
  let filePath: string | undefined;
  const noImages = args.includes("--no-images");

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
    } else if (args[i] === "--file" && args[i + 1]) {
      filePath = args[i + 1];
      i++;
    }
  }

  if (!type) {
    console.error("사용법: npx tsx scripts/publish-content.ts --type <post|faq|class|log> [--file payload.json] [--no-images]");
    process.exit(1);
  }

  return { type, filePath, noImages };
}

// ============================================
// 입력 읽기
// ============================================

async function readInput(filePath?: string): Promise<string> {
  if (filePath) {
    const fs = await import("fs");
    return fs.readFileSync(filePath, "utf-8");
  }

  // stdin에서 읽기
  return new Promise((resolve, reject) => {
    let data = "";
    process.stdin.setEncoding("utf-8");
    process.stdin.on("data", (chunk) => (data += chunk));
    process.stdin.on("end", () => resolve(data));
    process.stdin.on("error", reject);

    // 3초 내 입력 없으면 에러
    setTimeout(() => {
      if (!data) {
        reject(new Error("입력이 없습니다. --file 옵션을 사용하거나 stdin으로 JSON을 전달하세요."));
      }
    }, 3000);
  });
}

// ============================================
// 슬러그 중복 체크 + 고유 슬러그 생성
// ============================================

async function ensureUniqueSlug(type: ContentType, baseSlug: string): Promise<string> {
  const checkers: Record<ContentType, (slug: string) => Promise<unknown>> = {
    post: getPostBySlug,
    faq: getFaqBySlug,
    class: getClassBySlug,
    log: getLogBySlug,
  };

  let slug = baseSlug;
  let suffix = 2;

  while (await checkers[type](slug)) {
    slug = `${baseSlug}-${suffix}`;
    suffix++;
  }

  if (slug !== baseSlug) {
    console.log(`⚠️  슬러그 중복 감지. "${baseSlug}" → "${slug}"로 변경`);
  }

  return slug;
}

// ============================================
// 타입별 배포
// ============================================

async function injectImages(content: string, slug: string, topic: string): Promise<string> {
  console.log("🖼️  일러스트 생성 중...");
  try {
    const result = await generateAndInjectImages(content, slug, topic);
    if (result.generatedImages.length > 0) {
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
    return result.content;
  } catch (err) {
    console.error(`  ⚠️  이미지 생성 실패 (이미지 없이 진행):`, err instanceof Error ? err.message : err);
    return content;
  }
}

async function publishPost(data: unknown, noImages: boolean) {
  const parsed = insertPostSchema.parse(data);
  parsed.slug = await ensureUniqueSlug("post", parsed.slug);

  if (!noImages) {
    parsed.content = await injectImages(parsed.content, parsed.slug, parsed.title);
  }

  const result = await postService.create(parsed as CreatePostInput);
  return {
    id: result.id,
    slug: result.slug,
    title: result.title,
    url: `/insights/${result.slug}`,
    isPublished: result.isPublished,
  };
}

async function publishFaq(data: unknown, _noImages: boolean) {
  const parsed = insertFaqSchema.parse(data);
  parsed.slug = await ensureUniqueSlug("faq", parsed.slug);

  // FAQ는 짧은 대화체 답변이므로 이미지 삽입 생략

  const result = await faqService.create(parsed as CreateFaqInput);
  return {
    id: result.id,
    slug: result.slug,
    question: result.question,
    url: `/faq/${result.slug}`,
    isPublished: result.isPublished,
  };
}

async function publishClass(data: unknown, noImages: boolean) {
  const parsed = insertClassSchema.parse(data);
  parsed.slug = await ensureUniqueSlug("class", parsed.slug);

  if (!noImages) {
    parsed.content = await injectImages(parsed.content, parsed.slug, parsed.term);
  }

  const result = await classService.create(parsed as CreateClassInput);
  return {
    id: result.id,
    slug: result.slug,
    term: result.term,
    url: result.courseId ? `/class/${result.slug}` : `/class/${result.slug}`,
    isPublished: result.isPublished,
  };
}

async function publishLog(data: unknown, noImages: boolean) {
  const parsed = insertLogSchema.parse(data);
  parsed.slug = await ensureUniqueSlug("log", parsed.slug);

  if (!noImages) {
    parsed.content = await injectImages(parsed.content, parsed.slug, parsed.title);
  }

  const result = await logService.create(parsed as CreateLogInput);
  return {
    id: result.id,
    slug: result.slug,
    title: result.title,
    url: `/logs/${result.slug}`,
    isPublished: result.isPublished,
  };
}

// ============================================
// 메인
// ============================================

async function main() {
  const { type, filePath, noImages } = parseArgs();

  console.log(`\n📄 콘텐츠 배포 시작 (타입: ${type})\n`);

  // 환경 변수 확인
  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL 환경 변수가 설정되지 않았습니다.");
    console.error("   .env.local 파일을 확인하거나 환경 변수를 설정하세요.");
    process.exit(1);
  }

  // 입력 읽기
  let rawInput: string;
  try {
    rawInput = await readInput(filePath);
  } catch (error) {
    console.error(`❌ 입력 읽기 실패: ${error instanceof Error ? error.message : error}`);
    process.exit(1);
  }

  // JSON 파싱
  let payload: unknown;
  try {
    payload = JSON.parse(rawInput);
  } catch {
    console.error("❌ JSON 파싱 실패. 올바른 JSON 형식인지 확인하세요.");
    process.exit(1);
  }

  // 타입별 배포 실행
  const publishers: Record<ContentType, (data: unknown, noImages: boolean) => Promise<Record<string, unknown>>> = {
    post: publishPost,
    faq: publishFaq,
    class: publishClass,
    log: publishLog,
  };

  try {
    const result = await publishers[type](payload, noImages);

    console.log("✅ 배포 완료!\n");
    console.log("   ID:", result.id);
    console.log("   Slug:", result.slug);
    console.log("   Title:", result.title || result.question || result.term);
    console.log("   URL:", result.url);
    console.log("   상태:", result.isPublished ? "🟢 배포됨" : "🟡 초안");
    console.log("");

    // JSON 출력 (파이프 체이닝용)
    if (!process.stdout.isTTY) {
      process.stdout.write(JSON.stringify(result, null, 2));
    }
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      console.error("❌ 데이터 검증 실패:");
      console.error(JSON.stringify(JSON.parse((error as any).message), null, 2));
    } else {
      console.error(`❌ 배포 실패: ${error instanceof Error ? error.message : error}`);
    }
    process.exit(1);
  }
}

main();
