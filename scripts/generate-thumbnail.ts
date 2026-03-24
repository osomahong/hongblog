/**
 * Remotion 기반 썸네일 생성 CLI
 *
 * 사용법:
 *   npx tsx scripts/generate-thumbnail.ts --slug my-post-slug
 *   npx tsx scripts/generate-thumbnail.ts --slug my-post-slug --type post
 *   npx tsx scripts/generate-thumbnail.ts --batch --type post
 */
import { config } from "dotenv";
config({ path: ".env.local" });

import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import { put } from "@vercel/blob";
import path from "path";
import fs from "fs";

// DB imports
const ROOT = path.resolve(__dirname, "..");

async function getDb() {
  const { db } = await import("../src/lib/db");
  return db;
}

async function getContent(slug: string, type: string) {
  const db = await getDb();
  const { posts, faqs, classes, courses } = await import("../src/lib/schema");
  const { eq } = await import("drizzle-orm");

  if (type === "post") {
    const [post] = await db.select().from(posts).where(eq(posts.slug, slug)).limit(1);
    if (!post) throw new Error(`Post not found: ${slug}`);
    return { title: post.title, category: post.category, id: post.id, type: "post", courseName: undefined };
  } else if (type === "faq") {
    const [faq] = await db.select().from(faqs).where(eq(faqs.slug, slug)).limit(1);
    if (!faq) throw new Error(`FAQ not found: ${slug}`);
    return { title: faq.question, category: faq.category, id: faq.id, type: "faq", courseName: undefined };
  } else if (type === "class") {
    const [cls] = await db.select({ term: classes.term, id: classes.id, courseId: classes.courseId }).from(classes).where(eq(classes.slug, slug)).limit(1);
    if (!cls) throw new Error(`Class not found: ${slug}`);
    let courseName: string | undefined;
    if (cls.courseId) {
      const [course] = await db.select({ title: courses.title }).from(courses).where(eq(courses.id, cls.courseId)).limit(1);
      courseName = course?.title;
    }
    return { title: cls.term, category: "DATA", id: cls.id, type: "class", courseName };
  }

  throw new Error(`Unknown type: ${type}`);
}

async function getAllContent(type: string) {
  const db = await getDb();
  const { posts, faqs, classes } = await import("../src/lib/schema");
  const { eq, isNull } = await import("drizzle-orm");

  if (type === "post") {
    return db.select({ slug: posts.slug, ogImage: posts.ogImage }).from(posts).where(eq(posts.isPublished, true));
  } else if (type === "faq") {
    return db.select({ slug: faqs.slug, ogImage: faqs.ogImage }).from(faqs).where(eq(faqs.isPublished, true));
  } else if (type === "class") {
    return db.select({ slug: classes.slug, ogImage: classes.ogImage }).from(classes).where(eq(classes.isPublished, true));
  }

  throw new Error(`Unknown type: ${type}`);
}

async function updateOgImage(id: number, type: string, ogImageUrl: string) {
  const db = await getDb();
  const { posts, faqs, classes } = await import("../src/lib/schema");
  const { eq } = await import("drizzle-orm");

  if (type === "post") {
    await db.update(posts).set({ ogImage: ogImageUrl }).where(eq(posts.id, id));
  } else if (type === "faq") {
    await db.update(faqs).set({ ogImage: ogImageUrl }).where(eq(faqs.id, id));
  } else if (type === "class") {
    await db.update(classes).set({ ogImage: ogImageUrl }).where(eq(classes.id, id));
  }
}

function getCompositionId(type: string): string {
  switch (type) {
    case "post": return "PostThumbnail";
    case "faq": return "FaqThumbnail";
    case "class": return "ClassThumbnail";
    default: return "PostThumbnail";
  }
}

async function generateThumbnail(slug: string, type: string, bundleLocation: string) {
  console.log(`  📐 ${slug} 썸네일 생성 중...`);

  const content = await getContent(slug, type);
  const compositionId = getCompositionId(type);

  const inputProps = type === "class"
    ? { title: content.title, courseName: content.courseName }
    : { title: content.title, category: content.category };

  const outputPath = path.join(ROOT, "tmp", `thumbnail-${slug}.png`);

  // Composition 선택 + renderStill
  const composition = await selectComposition({
    serveUrl: bundleLocation,
    id: compositionId,
    inputProps,
  });

  await renderStill({
    serveUrl: bundleLocation,
    composition,
    output: outputPath,
    inputProps,
  });

  // Vercel Blob 업로드
  const fileBuffer = fs.readFileSync(outputPath);
  const blob = await put(`thumbnails/${slug}.png`, fileBuffer, {
    access: "public",
    contentType: "image/png",
  });

  // DB 업데이트
  await updateOgImage(content.id, type, blob.url);

  // 임시 파일 정리
  fs.unlinkSync(outputPath);

  console.log(`  ✅ ${slug} → ${blob.url}`);
  return blob.url;
}

async function main() {
  const args = process.argv.slice(2);
  const slugIndex = args.indexOf("--slug");
  const typeIndex = args.indexOf("--type");
  const isBatch = args.includes("--batch");

  const slug = slugIndex !== -1 ? args[slugIndex + 1] : undefined;
  const type = typeIndex !== -1 ? args[typeIndex + 1] : "post";

  if (!slug && !isBatch) {
    console.error("사용법: npx tsx scripts/generate-thumbnail.ts --slug <slug> [--type post|faq|class]");
    console.error("        npx tsx scripts/generate-thumbnail.ts --batch --type post");
    process.exit(1);
  }

  // tmp 디렉토리 생성
  const tmpDir = path.join(ROOT, "tmp");
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

  console.log("🎨 Remotion 번들링 중...");
  const bundleLocation = await bundle({
    entryPoint: path.join(ROOT, "remotion", "Root.tsx"),
  });
  console.log("✅ 번들링 완료\n");

  if (isBatch) {
    console.log(`📦 ${type} 일괄 썸네일 생성...\n`);
    const items = await getAllContent(type!);
    const noImage = items.filter((item: { ogImage: string | null }) => !item.ogImage);
    console.log(`  ogImage 없는 항목: ${noImage.length}건\n`);

    for (const item of noImage) {
      try {
        await generateThumbnail((item as { slug: string }).slug, type!, bundleLocation);
      } catch (err) {
        console.error(`  ❌ ${(item as { slug: string }).slug}: ${(err as Error).message}`);
      }
    }
  } else {
    await generateThumbnail(slug!, type!, bundleLocation);
  }

  console.log("\n🎉 썸네일 생성 완료!");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ 오류:", err.message || err);
  process.exit(1);
});
