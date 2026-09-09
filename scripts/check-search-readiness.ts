/** Search landing pages: validate rendered HTML, not just metadata source code.
 * Run after build: npm run check:search
 * --app-dir <dir> supports checking an isolated build fixture.
 */
import fs from "node:fs";
import path from "node:path";
import { marked } from "marked";
import { getClasses, getCourses, getInsights } from "../src/lib/content";
import { workCases } from "../src/lib/cases";
import { caseVisuals } from "../src/lib/case-visuals";
import { SITE_URL } from "../src/lib/constants";

const arg = process.argv.indexOf("--app-dir");
const appDir = arg < 0 ? path.resolve(".next/server/app") : path.resolve(process.argv[arg + 1]);
const errors: string[] = [];
const fail = (route: string, message: string) => errors.push(`${route}: ${message}`);
function text(html: string) {
  return html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#(?:x27|39);/g, "'").replace(/&nbsp;/g, " ")
    // MarkdownRenderer normalizes Korean-adjacent bold markers before rendering.
    .replace(/(?:\*\*|＊＊)/g, "")
    .replace(/\s+/g, "").trim();
}
function attributes(tag: string) {
  return Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(m => [m[1], m[2].replace(/&amp;/g, "&")]));
}
type JsonNode = Record<string, unknown>;
function nodes(value: unknown): JsonNode[] {
  if (Array.isArray(value)) return value.flatMap(nodes);
  if (!value || typeof value !== "object") return [];
  const node = value as JsonNode;
  return [node, ...Object.values(node).flatMap(nodes)];
}
const courses = getCourses();
const classes = getClasses();
const insights = getInsights();
const routes = ["/class", "/insights", "/cases", ...courses.map(c => `/class/${c.slug}`), ...classes.map(c => `/class/${c.courseSlug}/${c.slug}`), ...insights.map(i => `/insights/${i.slug}`), ...workCases.map(c => `/cases/${c.slug}`)];
const xml = ["0", "1"].map(id => {
  const file = path.join(appDir, `sitemap/${id}.xml.body`);
  if (!fs.existsSync(file)) { fail("sitemap", `${file} missing`); return ""; }
  return fs.readFileSync(file, "utf8");
}).join("\n");
const sitemap = new Map([...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(m => {
  const loc = m[1].match(/<loc>([^<]+)<\/loc>/)?.[1];
  return [loc, m[1].match(/<lastmod>([^<]+)<\/lastmod>/)?.[1]];
}));
const htmlByRoute = new Map<string, string>();
for (const route of routes) {
  const file = path.join(appDir, `${route.slice(1)}.html`);
  if (!fs.existsSync(file)) { fail(route, "missing static HTML"); continue; }
  const html = fs.readFileSync(file, "utf8");
  htmlByRoute.set(route, html);
  const expected = `${SITE_URL}${route}`;
  const metas = [...html.matchAll(/<meta\b[^>]*>/g)].map(m => attributes(m[0]));
  const links = [...html.matchAll(/<link\b[^>]*>/g)].map(m => attributes(m[0]));
  const canonicals = links.filter(l => l.rel === "canonical");
  if (canonicals.length !== 1 || canonicals[0].href !== expected) fail(route, "canonical mismatch or duplicate");
  if (!sitemap.has(expected)) fail(route, "absent from sitemap");
  if (metas.some(m => ["robots", "googlebot"].includes(m.name) && /noindex|none|nosnippet/i.test(m.content))) fail(route, "index/snippet blocked");
  if (!/<title>[^<]+<\/title>/.test(html)) fail(route, "missing title");
  if (!metas.some(m => m.name === "description" && m.content)) fail(route, "missing description");
  if ((html.match(/<h1[\s>]/g) ?? []).length !== 1) fail(route, "H1 count is not one");
  if (!metas.some(m => m.property === "og:url" && m.content === expected)) fail(route, "og:url mismatch");
  const ogImage = metas.find(m => m.property === "og:image")?.content;
  if (!ogImage) fail(route, "missing og:image");
  else {
    const imageUrl = new URL(ogImage, SITE_URL);
    if (imageUrl.origin === new URL(SITE_URL).origin && !fs.existsSync(path.join("public", decodeURIComponent(imageUrl.pathname)))) fail(route, "missing local og:image file");
  }
  const ld: JsonNode[] = [];
  for (const match of html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    try { ld.push(...nodes(JSON.parse(match[1]))); } catch { fail(route, "invalid JSON-LD"); }
  }
  if (!ld.length) fail(route, "missing JSON-LD");
  const detail = classes.find(c => route === `/class/${c.courseSlug}/${c.slug}`) ?? insights.find(i => route === `/insights/${i.slug}`);
  const caseItem = workCases.find(c => route === `/cases/${c.slug}`);
  if (detail || caseItem) {
    const article = ld.find(n => n["@type"] === "Article");
    if (!article) fail(route, "missing Article");
    if (!ld.some(n => n["@type"] === "BreadcrumbList")) fail(route, "missing breadcrumb");
    const expectedTitle = caseItem?.title ?? (detail && (detail.metaTitle || ("term" in detail ? detail.term : detail.title)));
    if (article?.headline !== expectedTitle) fail(route, "Article headline mismatch");
    const bodyText = text(html);
    if (caseItem) {
      for (const paragraph of [...caseItem.lead, ...caseItem.sections.flatMap(s => s.paragraphs)]) {
        if (!bodyText.includes(text(paragraph))) fail(route, "case paragraph missing from server HTML");
      }
      if (!metas.some(m => m.property === "article:modified_time" && m.content === caseItem.updatedAt)) fail(route, "case OG modified date mismatch");
      const figureIds = [...html.matchAll(/<figure\b[^>]*>/g)].map(m => attributes(m[0]).id);
      for (const visual of caseVisuals[caseItem.slug] ?? []) {
        if (figureIds.filter(id => id === `figure-${visual.id}`).length !== 1) fail(route, `case figure missing or duplicated: ${visual.id}`);
      }
      if (article?.dateModified !== caseItem.updatedAt || sitemap.get(expected) !== caseItem.updatedAt) fail(route, "case modified date mismatch");
      if (!html.includes(`datetime="${caseItem.updatedAt}"`) && !html.includes(`dateTime="${caseItem.updatedAt}"`)) fail(route, "case modified date not visible");
    } else if (detail) {
      const rendered = marked.parse(detail.content, { async: false });
      const firstParagraph = rendered.match(/<p[^>]*>([\s\S]*?)<\/p>/)?.[1];
      if (!firstParagraph || !bodyText.includes(text(firstParagraph).slice(0, 80))) fail(route, "article body missing from server HTML");
    }
  }
  const course = courses.find(c => route === `/class/${c.slug}`);
  if (course) {
    const courseLd = ld.find(n => n["@type"] === "Course");
    if (!courseLd) fail(route, "missing Course");
    if (courseLd && "numberOfCredits" in courseLd) fail(route, "non-credit course declares credits");
    const workload = ld.find(n => n["@type"] === "CourseInstance")?.courseWorkload;
    const minutes = classes.filter(c => c.courseSlug === course.slug).reduce((n, c) => n + c.readingTime, 0);
    if (minutes > 0 && workload !== `전체 콘텐츠 예상 읽기 ${minutes}분`) fail(route, "course workload mismatch");
  }
}
// Every target must have a crawlable incoming link from another rendered page.
const incoming = new Set<string>();
for (const [route, html] of htmlByRoute) {
  for (const m of html.matchAll(/<a\b[^>]*href="([^"]+)"/g)) {
    const url = new URL(m[1].replace(/&amp;/g, "&"), SITE_URL);
    if (url.origin === new URL(SITE_URL).origin && url.pathname !== route) incoming.add(url.pathname.replace(/\/$/, ""));
  }
}
for (const route of routes) if (!incoming.has(route)) fail(route, "no crawlable incoming link in search pages");
if (errors.length) {
  console.error(errors.join("\n"));
  console.error(`Search readiness failed: ${errors.length} issues across ${routes.length} routes`);
  process.exitCode = 1;
} else console.log(`Search readiness passed: ${routes.length} routes; HTML, canonical, sitemap, metadata, body, links and schema checked.`);
