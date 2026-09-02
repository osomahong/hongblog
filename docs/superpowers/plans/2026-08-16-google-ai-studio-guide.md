# Google AI Studio Insight Article Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a publish-ready hongblog Insight article explaining Google AI Studio's browser workflow and Build feature for Korean beginners, with locally stored official reference images and source links.

**Architecture:** Add one Markdown Insight post under `content/insights/`, one local image directory under `public/images/insights/`, and generate the standard Neo-Brutalist OG image under `public/og/`. The article will use only Google official documentation and help pages for current product claims.

**Tech Stack:** Next.js MD content, YAML frontmatter, Markdown, existing OG generation script, prose/link check scripts.

---

### Task 1: Research and source verification

**Files:**
- Reference: Google AI Studio official documentation and help pages
- Create: `public/images/insights/google-ai-studio-guide/`

- [ ] Verify Google AI Studio's current entry point, prompt workflow, Build capability, API key handling, and usage limits from official Google sources.
- [ ] Select 2 to 3 concrete official screenshots or diagrams that directly illustrate the setup, Build flow, and result screen.
- [ ] Download image assets locally and record their source URLs for the article's Sources section.
- [ ] Confirm the article does not duplicate the existing Gemini CLI, Gemini Spark, Gemini Omni, or AI coding tools posts.

### Task 2: Write the Insight post

**Files:**
- Create: `content/insights/google-ai-studio-guide.md`

- [ ] Add required frontmatter with category `AI_TECH`, canonical tags, SEO metadata, highlights, and one quiz.
- [ ] Write the article using the existing structure: concrete opening, definition, product comparison, setup flow, Build workflow, practical examples, security and billing cautions, FAQ, three-line summary, and Sources.
- [ ] Insert locally hosted images with descriptive Korean alt text immediately after the relevant explanation.
- [ ] Keep the title focused on Google AI Studio and exclude Gemini CLI installation and general model comparisons already covered elsewhere.

### Task 3: Generate and validate publication assets

**Files:**
- Create: `public/og/google-ai-studio-guide.png`
- Modify: `content/insights/google-ai-studio-guide.md` if OG generation updates frontmatter

- [ ] Run `npx tsx scripts/generate-og.ts --slug google-ai-studio-guide`.
- [ ] Run `npm run check:prose -- content/insights/google-ai-studio-guide.md`.
- [ ] Run `node .claude/skills/prose-inspector/scripts/check-literary.mjs content/insights/google-ai-studio-guide.md`.
- [ ] Check for zero occurrences of em dash and middle dot characters.
- [ ] Run `npm run check:links`.
- [ ] Read the complete article once, including tables, image alt text, and Sources, and fix any factual, prose, or link issues.
- [ ] Present the complete draft to the user for approval; do not commit or deploy before approval.

