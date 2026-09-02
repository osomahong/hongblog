# Insight Meta Compact Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the insight header metadata use available horizontal space before wrapping, reducing wasted vertical space on mobile.

**Architecture:** Keep the existing server-rendered content and semantic order unchanged. Change only the Tailwind layout classes in the insight detail header so metadata and tag badges participate in one responsive wrapping flow.

**Tech Stack:** Next.js 16.1.1, React 19, TypeScript, Tailwind CSS

---

## File map

- Modify `src/app/insights/[slug]/page.tsx`: compact the metadata wrapper and allow tag badges to join its flex flow.
- Reference `docs/superpowers/specs/2026-08-16-insight-meta-compact-layout-design.md`: approved responsive behavior and validation criteria.

### Task 1: Compact the insight metadata flow

**Files:**
- Modify: `src/app/insights/[slug]/page.tsx:321-343`

- [ ] **Step 1: Record the current narrow-screen behavior**

Open `http://localhost:3000/insights/orca-ide-easy-guide` at a 375px-wide viewport and confirm that the metadata wrapper's `flex-col` class places date, reading time, popularity, and tags on separate rows. This article is present in the current `scripts/data/trending.json`, so all metadata variants are visible.

- [ ] **Step 2: Replace the vertical mobile layout with one wrapping flow**

Change the wrapper and child classes to this structure:

```tsx
<div className="flex flex-wrap items-center gap-x-3 gap-y-2 sm:gap-x-4 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t-2 border-black">
  <span className="shrink-0 whitespace-nowrap text-xs sm:text-sm font-mono">
    {post.createdAt.toLocaleDateString("ko-KR")}
  </span>
  <span className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap text-xs sm:text-sm font-mono text-muted-foreground">
    <Clock3 className="w-3.5 h-3.5" /> 약 {post.readingTime}분
  </span>
  {isTrending && (
    <span className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap text-[11px] sm:text-xs font-bold text-[#FF0033]">
      <Flame className="w-3.5 h-3.5" /> 최근 7일 인기 글
    </span>
  )}
  <div className="contents">
    {post.tags.map((tag) => (
      <NeoTagBadge
        key={tag}
        tag={tag}
        className="shrink-0 text-[11px] sm:text-xs px-1.5 sm:px-3 py-0.5 sm:py-1"
      />
    ))}
  </div>
</div>
```

- [ ] **Step 3: Run static validation**

Run: `npm run lint -- --quiet`

Expected: exit code 0 with no ESLint errors.

- [ ] **Step 4: Run the type checker**

Run: `npx tsc --noEmit`

Expected: exit code 0 with no TypeScript errors.

- [ ] **Step 5: Run the production build**

Run: `npm run build`

Expected: exit code 0 and all static insight routes generate successfully.

- [ ] **Step 6: Verify responsive layout**

Check these articles at 375px and 1280px widths:

- `http://localhost:3000/insights/orca-ide-easy-guide` for the date, reading-time, popularity, and three-tag combination.
- `http://localhost:3000/insights/react-spa-gtm-setup-guide` for the six-tag overflow case, including the longer `데이터 추적` and `데이터 분석` labels.

Expected at 375px:
- Date, reading time, and popularity use the same first-line flow when space permits.
- Tags start in the remaining space or wrap to the next line without a forced full-width container.
- No horizontal scrollbar appears.

Expected at 1280px:
- Metadata remains readable in one compact flow.
- Existing border, typography, colors, and tag appearance are unchanged.

- [ ] **Step 7: Review the focused diff**

Run: `git diff -- src/app/insights/'[slug]'/page.tsx`

Expected: the header metadata layout is the only new change from this task. Do not commit the page independently because it already contains overlapping, uncommitted content-discovery work that must be committed as one reviewed unit later.
