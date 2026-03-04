/**
 * DB 콘텐츠를 JSON 파일로 덤프하는 빌드 타임 스크립트
 * Usage: npx tsx scripts/export-data.ts
 */
import { config } from "dotenv";
config({ path: ".env.local" });

import fs from "fs/promises";
import path from "path";

import {
  getPublishedPosts,
  getPublishedFaqs,
  getPublishedCourses,
  getPublishedClasses,
  getPublishedSeries,
  getPublishedLogs,
  getPublishedLifeLogsPersonal,
  getAllTags,
  getContentByTag,
  getCategoryStats,
  getPostBySlug,
  getFaqBySlug,
  getCourseBySlug,
  getClassBySlug,
  getSeriesBySlug,
  getLogBySlug,
  getTrendingMixed,
  getPopularFaqs,
  getRelatedFaqsWithPopularity,
  getSeriesNavigation,
  getRelatedClassesForPost,
  getRelatedPostsWithPopularity,
  getRelatedClassesByTags,
  getRelatedPostsForClass,
  getNextPrevClass,
  getRelatedLogsWithPopularity,
  getRelatedPostsWithPopularity as getRelatedPostsWithPop,
} from "../src/lib/queries";

const OUTPUT_DIR = path.join(process.cwd(), "src/data/generated");

function dateReplacer(_key: string, value: unknown): unknown {
  if (value instanceof Date) {
    return value.toISOString();
  }
  return value;
}

async function writeJson(filePath: string, data: unknown) {
  const fullPath = path.join(OUTPUT_DIR, filePath);
  await fs.mkdir(path.dirname(fullPath), { recursive: true });
  await fs.writeFile(fullPath, JSON.stringify(data, dateReplacer, 2), "utf-8");
}

async function exportPosts() {
  console.log("  Exporting posts...");
  const posts = await getPublishedPosts();
  await writeJson("posts/_index.json", posts);

  for (const post of posts) {
    const detail = await getPostBySlug(post.slug);
    if (detail) {
      const relatedFaqs = await getRelatedFaqsWithPopularity(detail.tags, detail.category, detail.id);
      const relatedClasses = await getRelatedClassesForPost(detail.tags, detail.category, 3);
      const seriesNav = detail.seriesId ? await getSeriesNavigation(detail.seriesId, detail.id) : null;
      await writeJson(`posts/${post.slug}.json`, {
        ...detail,
        relatedFaqs,
        relatedClasses,
        seriesNav,
      });
    }
  }
  console.log(`  -> ${posts.length} posts exported`);
}

async function exportFaqs() {
  console.log("  Exporting FAQs...");
  const faqs = await getPublishedFaqs();
  await writeJson("faqs/_index.json", faqs);

  for (const faq of faqs) {
    const detail = await getFaqBySlug(faq.slug);
    if (detail) {
      const relatedPosts = await getRelatedPostsWithPopularity(detail.tags, detail.category, detail.id);
      const relatedFaqs = await getRelatedFaqsWithPopularity(detail.tags, detail.category, detail.id, 4);
      await writeJson(`faqs/${faq.slug}.json`, {
        ...detail,
        relatedPosts,
        relatedFaqs,
      });
    }
  }
  console.log(`  -> ${faqs.length} FAQs exported`);
}

async function exportCourses() {
  console.log("  Exporting courses...");
  const courses = await getPublishedCourses();
  await writeJson("courses/_index.json", courses);

  for (const course of courses) {
    const detail = await getCourseBySlug(course.slug);
    if (detail) {
      await writeJson(`courses/${course.slug}.json`, detail);
    }
  }
  console.log(`  -> ${courses.length} courses exported`);
}

async function exportClasses() {
  console.log("  Exporting classes...");
  const allClasses = await getPublishedClasses();

  for (const cls of allClasses) {
    const detail = await getClassBySlug(cls.slug);
    if (detail) {
      const relatedClasses = await getRelatedClassesByTags(detail.tags, detail.id, 3);
      const relatedPosts = await getRelatedPostsForClass(detail.tags, detail.category, 3);
      const relatedFaqs = await getRelatedFaqsWithPopularity(detail.tags, detail.category, undefined, 3);
      const navigation = await getNextPrevClass(detail.id);
      await writeJson(`classes/${cls.slug}.json`, {
        ...detail,
        relatedClasses,
        relatedPosts,
        relatedFaqs,
        navigation,
      });
    }
  }
  console.log(`  -> ${allClasses.length} classes exported`);
}

async function exportSeries() {
  console.log("  Exporting series...");
  const seriesList = await getPublishedSeries();
  await writeJson("series/_index.json", seriesList);

  for (const s of seriesList) {
    const detail = await getSeriesBySlug(s.slug);
    if (detail) {
      await writeJson(`series/${s.slug}.json`, detail);
    }
  }
  console.log(`  -> ${seriesList.length} series exported`);
}

async function exportLogs() {
  console.log("  Exporting logs...");
  const logs = await getPublishedLogs();
  await writeJson("logs/_index.json", logs);

  const personalLogs = await getPublishedLifeLogsPersonal();
  await writeJson("logs/personal.json", personalLogs);

  for (const log of logs) {
    const detail = await getLogBySlug(log.slug);
    if (detail) {
      const relatedFaqs = await getRelatedFaqsWithPopularity(detail.tags, detail.category, undefined, 3);
      const relatedPosts = await getRelatedPostsWithPop(detail.tags, detail.category, undefined, 2);
      await writeJson(`logs/${log.slug}.json`, {
        ...detail,
        relatedFaqs,
        relatedPosts,
      });
    }
  }
  console.log(`  -> ${logs.length} logs exported`);
}

async function exportTags() {
  console.log("  Exporting tags...");
  const allTags = await getAllTags();
  await writeJson("tags/_index.json", allTags);

  for (const tag of allTags) {
    const content = await getContentByTag(tag.name);
    if (content) {
      await writeJson(`tags/${tag.name}.json`, content);
    }
  }
  console.log(`  -> ${allTags.length} tags exported`);
}

async function exportCategories() {
  console.log("  Exporting categories...");
  const stats = await getCategoryStats();
  await writeJson("categories/stats.json", stats);
  console.log(`  -> category stats exported`);
}

async function exportTrending() {
  console.log("  Exporting trending...");
  const trending = await getTrendingMixed(7, 4);
  await writeJson("trending/mixed.json", trending);

  const popularFaqs = await getPopularFaqs(30, 5);
  await writeJson("trending/popular-faqs.json", popularFaqs);
  console.log(`  -> trending data exported`);
}

async function main() {
  console.log("=== hongblog data export ===");
  console.log(`Output: ${OUTPUT_DIR}\n`);

  // Clean output directory
  await fs.rm(OUTPUT_DIR, { recursive: true, force: true });
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  await exportPosts();
  await exportFaqs();
  await exportCourses();
  await exportClasses();
  await exportSeries();
  await exportLogs();
  await exportTags();
  await exportCategories();
  await exportTrending();

  console.log("\n=== Export complete ===");
  process.exit(0);
}

main().catch((err) => {
  console.error("Export failed:", err);
  process.exit(1);
});
