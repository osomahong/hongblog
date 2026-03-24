/**
 * GA4 리포트 CLI
 *
 * 사용법:
 *   npx tsx scripts/ga4-report.ts --mode top-pages --days 30
 *   npx tsx scripts/ga4-report.ts --mode traffic-sources --days 7
 *   npx tsx scripts/ga4-report.ts --mode content-perf --days 30 --category MARKETING
 *   npx tsx scripts/ga4-report.ts --mode category-stats --days 30
 *   npx tsx scripts/ga4-report.ts --mode quick --days 30
 *
 * 출력: --format json (기본) 또는 --format table
 */
import { config } from "dotenv";
config({ path: ".env.local" });

import { getTopPages, getTrafficSources, getQuickReport, getContentGroupPerformance } from "../src/lib/ga4";
import { getPublishedPosts, getPublishedFaqs, getPublishedClasses, getCategoryStats } from "../src/lib/queries";
import type { ContentPerformanceReport, CategoryStatsReport } from "../src/lib/ga4-types";

function parseArgs() {
  const args = process.argv.slice(2);
  const get = (flag: string) => {
    const idx = args.indexOf(flag);
    return idx !== -1 ? args[idx + 1] : undefined;
  };

  return {
    mode: get("--mode") || "quick",
    days: Number(get("--days") || "30"),
    limit: Number(get("--limit") || "20"),
    category: get("--category"),
    format: (get("--format") || "table") as "json" | "table",
  };
}

function printTable(headers: string[], rows: string[][]) {
  const colWidths = headers.map((h, i) =>
    Math.max(h.length, ...rows.map((r) => (r[i] || "").length)),
  );

  const headerLine = headers.map((h, i) => h.padEnd(colWidths[i])).join(" | ");
  const separator = colWidths.map((w) => "-".repeat(w)).join("-+-");

  console.log(headerLine);
  console.log(separator);
  rows.forEach((row) => {
    console.log(row.map((cell, i) => (cell || "").padEnd(colWidths[i])).join(" | "));
  });
}

async function modeTopPages(days: number, limit: number, format: string) {
  console.log(`\n📊 상위 페이지 (최근 ${days}일, 상위 ${limit}개)\n`);
  const pages = await getTopPages(days, limit);

  if (format === "json") {
    console.log(JSON.stringify(pages, null, 2));
  } else {
    printTable(
      ["순위", "경로", "세션", "페이지뷰", "참여율"],
      pages.map((p, i) => [
        String(i + 1),
        p.pagePath.substring(0, 50),
        String(p.sessions),
        String(p.screenPageViews),
        `${(p.engagementRate * 100).toFixed(1)}%`,
      ]),
    );
  }
}

async function modeTrafficSources(days: number, format: string) {
  console.log(`\n📊 트래픽 소스 (최근 ${days}일)\n`);
  const sources = await getTrafficSources(days);

  if (format === "json") {
    console.log(JSON.stringify(sources, null, 2));
  } else {
    printTable(
      ["채널", "세션", "신규 사용자", "참여율"],
      sources.map((s) => [
        s.sessionDefaultChannelGroup,
        String(s.sessions),
        String(s.newUsers),
        `${(s.engagementRate * 100).toFixed(1)}%`,
      ]),
    );
  }
}

async function modeContentPerf(days: number, category: string | undefined, format: string) {
  console.log(`\n📊 콘텐츠 성과 분석 (최근 ${days}일${category ? `, 카테고리: ${category}` : ""})\n`);

  // GA4 데이터
  const ga4Data = await getContentGroupPerformance(days);

  // 내부 DB 데이터
  const [posts, faqs, classes] = await Promise.all([
    getPublishedPosts(),
    getPublishedFaqs(),
    getPublishedClasses(),
  ]);

  // slug → 콘텐츠 매핑
  const contentMap = new Map<string, { title: string; type: string; category: string }>();
  posts.forEach((p) => {
    if (!category || p.category === category)
      contentMap.set(`/insights/${p.slug}`, { title: p.title, type: "post", category: p.category });
  });
  faqs.forEach((f) => {
    if (!category || f.category === category)
      contentMap.set(`/faq/${f.slug}`, { title: f.question, type: "faq", category: f.category });
  });
  classes.forEach((c) => {
    contentMap.set(`/class/${c.slug}`, { title: c.term, type: "class", category: "DATA" });
  });

  // GA4 + DB 교차 참조
  const results: ContentPerformanceReport[] = [];
  for (const row of ga4Data.rows) {
    const pagePath = row.dimensions.pagePathPlusQueryString?.split("?")[0] || "";
    const content = contentMap.get(pagePath);
    if (!content) continue;

    results.push({
      slug: pagePath,
      contentType: content.type,
      title: content.title,
      category: content.category,
      ga4Sessions: Number(row.metrics.sessions),
      ga4PageViews: Number(row.metrics.screenPageViews),
      ga4EngagementRate: Number(row.metrics.engagementRate),
      internalViewCount: 0, // 별도 조회 필요 시 추가
    });
  }

  results.sort((a, b) => b.ga4Sessions - a.ga4Sessions);

  if (format === "json") {
    console.log(JSON.stringify(results, null, 2));
  } else {
    printTable(
      ["순위", "타입", "카테고리", "제목", "세션", "참여율"],
      results.slice(0, 20).map((r, i) => [
        String(i + 1),
        r.contentType,
        r.category || "",
        r.title.substring(0, 30),
        String(r.ga4Sessions),
        `${(r.ga4EngagementRate * 100).toFixed(1)}%`,
      ]),
    );
  }
}

async function modeCategoryStats(days: number, format: string) {
  console.log(`\n📊 카테고리별 성과 (최근 ${days}일)\n`);

  const ga4Data = await getContentGroupPerformance(days);
  const dbStats = await getCategoryStats();
  const posts = await getPublishedPosts();

  // 카테고리별 GA4 세션 집계
  const categoryGa4: Record<string, { sessions: number; pageViews: number }> = {};
  for (const row of ga4Data.rows) {
    const pagePath = row.dimensions.pagePathPlusQueryString?.split("?")[0] || "";
    const post = posts.find((p) => `/insights/${p.slug}` === pagePath);
    if (!post) continue;

    if (!categoryGa4[post.category]) categoryGa4[post.category] = { sessions: 0, pageViews: 0 };
    categoryGa4[post.category].sessions += Number(row.metrics.sessions);
    categoryGa4[post.category].pageViews += Number(row.metrics.screenPageViews);
  }

  const results: CategoryStatsReport[] = dbStats.map((stat) => {
    const ga4 = categoryGa4[stat.category] || { sessions: 0, pageViews: 0 };
    return {
      category: stat.category,
      postCount: stat.postCount,
      totalSessions: ga4.sessions,
      totalPageViews: ga4.pageViews,
      avgSessionsPerPost: stat.postCount > 0 ? Math.round(ga4.sessions / stat.postCount) : 0,
    };
  });

  if (format === "json") {
    console.log(JSON.stringify(results, null, 2));
  } else {
    printTable(
      ["카테고리", "게시글", "총 세션", "총 페이지뷰", "글당 평균 세션"],
      results.map((r) => [
        r.category,
        String(r.postCount),
        String(r.totalSessions),
        String(r.totalPageViews),
        String(r.avgSessionsPerPost),
      ]),
    );
  }
}

async function modeQuick(days: number, format: string) {
  console.log(`\n📊 GA4 Quick Report (최근 ${days}일)\n`);
  const report = await getQuickReport(days);

  if (format === "json") {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log("### 핵심 지표");
    console.log(`  총 세션: ${report.totalSessions.toLocaleString()}`);
    console.log(`  총 페이지뷰: ${report.totalPageViews.toLocaleString()}`);
    console.log(`  총 사용자: ${report.totalUsers.toLocaleString()}`);
    console.log(`  평균 참여율: ${(report.avgEngagementRate * 100).toFixed(1)}%`);
    console.log(`  평균 세션 시간: ${Math.round(report.avgSessionDuration)}초\n`);

    console.log("### 상위 페이지 (Top 10)");
    printTable(
      ["순위", "경로", "세션"],
      report.topPages.slice(0, 10).map((p, i) => [
        String(i + 1),
        p.pagePath.substring(0, 50),
        String(p.sessions),
      ]),
    );

    console.log("\n### 트래픽 소스");
    printTable(
      ["채널", "세션", "참여율"],
      report.trafficSources.map((s) => [
        s.sessionDefaultChannelGroup,
        String(s.sessions),
        `${(s.engagementRate * 100).toFixed(1)}%`,
      ]),
    );
  }
}

async function main() {
  const { mode, days, limit, category, format } = parseArgs();

  switch (mode) {
    case "top-pages":
      await modeTopPages(days, limit, format);
      break;
    case "traffic-sources":
      await modeTrafficSources(days, format);
      break;
    case "content-perf":
      await modeContentPerf(days, category, format);
      break;
    case "category-stats":
      await modeCategoryStats(days, format);
      break;
    case "quick":
      await modeQuick(days, format);
      break;
    default:
      console.error(`알 수 없는 모드: ${mode}`);
      console.error("사용 가능: top-pages, traffic-sources, content-perf, category-stats, quick");
      process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ 오류:", err.message || err);
    process.exit(1);
  });
