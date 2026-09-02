# Content Discovery Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve internal content discovery without popups or SEO/GEO schema changes by separating ads, ranking recommendations by topical relevance, adding one clear next step, collecting lightweight feedback, and exposing a modest popularity signal.

**Architecture:** Keep every recommendation server-rendered as a normal internal link. Add optional editorial relationship fields to Insight frontmatter, combine them with topic inference and inverse-frequency tag scoring, and render a compact reading path around the existing article footer. Keep Article, FAQPage, BreadcrumbList, canonical, robots, and sitemap behavior unchanged.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Markdown frontmatter, Tailwind CSS, GA4 dataLayer events, existing static content utilities.

---

### Task 1: Recommendation metadata and scoring

**Files:**
- Modify: `src/lib/types.ts`
- Modify: `src/lib/content.ts`
- Modify: `src/lib/related-posts.ts`
- Create: `src/lib/related-posts.test.ts`
- Modify: selected `content/insights/*.md` Google Workspace articles

- [ ] Add optional `topicCluster`, `contentType`, `journeyStage`, `nextSlugs`, and `relatedSlugs` fields to Insight and PostWithTags.
- [ ] Parse and expose the new frontmatter fields.
- [ ] Implement explicit editorial recommendation priority, same-cluster scoring, inverse-frequency tag scoring, category fallback, and deterministic tie-breaking.
- [ ] Exclude the selected next-step article from the generic related list.
- [ ] Add focused tests for explicit recommendations, broad-tag down-weighting, and deterministic output.

### Task 2: Reading-path UI and ad separation

**Files:**
- Create: `src/components/NextContentCard.tsx`
- Modify: `src/components/RelatedPosts.tsx`
- Modify: `src/app/insights/[slug]/page.tsx`

- [ ] Render one server-selected next-step card after the article interaction area.
- [ ] Remove the in-feed ad from inside the related-content card array.
- [ ] Render the same ad slot in a separately labelled and visually distinct block after recommendations.
- [ ] Replace the sidebar latest-post list with ranked topical recommendations.
- [ ] Keep the footer order compact on mobile: quiz, feedback, next step, related content, ad, newsletter.

### Task 3: Lightweight reader feedback

**Files:**
- Create: `src/components/ContentFeedback.tsx`
- Modify: `src/app/insights/[slug]/page.tsx`

- [ ] Add a compact “도움이 되었나요?” control with positive and improvement choices.
- [ ] Send `content_feedback` events with content slug, answer, and optional reason.
- [ ] Prevent repeated UI submissions per browser with localStorage while keeping the controls accessible.
- [ ] Do not publish counts, comments, ratings, or review structured data in this phase.

### Task 4: Internal link and popularity signals

**Files:**
- Modify: `src/components/MarkdownRenderer.tsx`
- Modify: `src/lib/content.ts`
- Modify: `src/app/insights/[slug]/page.tsx`

- [ ] Open internal site links in the same tab and external links in a new tab.
- [ ] Reuse the existing seven-day trending data to identify popular articles.
- [ ] Show a small “최근 7일 인기 글” badge and reading-time value in the article header without exposing unstable raw counts.
- [ ] Leave Article structured data and metadata unchanged.

### Task 5: Verification

**Files:**
- Test: `src/lib/related-posts.test.ts`
- Verify: generated Next.js pages and SEO audit output

- [ ] Run the recommendation unit tests.
- [ ] Run `npm run lint` and fix errors introduced by this change.
- [ ] Run `npm run build` and verify static rendering succeeds.
- [ ] Run `npx tsx scripts/check-internal-links.ts`.
- [ ] Run `npx tsx scripts/seo-audit.ts` and confirm canonical, Article, FAQPage, BreadcrumbList, and orphan checks do not regress.
- [ ] Inspect the article footer at mobile and desktop widths.

