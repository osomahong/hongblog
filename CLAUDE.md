# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run dev          # Next.js dev server (localhost:3000)
npm run build        # Production build (use to verify changes)
npm run lint         # ESLint

# Database (Drizzle ORM + Neon PostgreSQL)
npm run db:generate  # Generate migration files from schema changes
npm run db:migrate   # Run pending migrations
npm run db:push      # Push schema directly (skip migration files)
npm run db:studio    # Open Drizzle Studio GUI

# Content publishing (CLI)
npx tsx scripts/publish-content.ts --type post --file scripts/data/my-post.json
npx tsx scripts/publish-content.ts --type faq < payload.json
```

## Architecture

**Next.js 16 App Router** full-stack blog with AI-augmented content pipeline. Korean-first content, Neo-Brutalism design system, deployed on Vercel.

### Core layers

```
src/
├── app/                    # Routes (insights, faq, class, logs, series, tags, category)
├── features/{type}/        # Feature modules: service.ts (CRUD), schema.ts (Zod), components/
│   ├── posts/              # Blog insights (MARKETING | AI_TECH | DATA)
│   ├── faqs/               # Q&A content
│   ├── classes/            # Hierarchical courses (course → class units)
│   ├── logs/               # LifeLogs (맛집, 강의, 문화생활, 여행, 일상)
│   └── series/             # Ordered post collections
├── lib/
│   ├── schema.ts           # Drizzle table definitions (single source of truth)
│   ├── queries.ts          # 40+ read-only DB query functions
│   ├── db.ts               # Drizzle client (auto-detects CLI vs serverless context)
│   ├── ai.ts               # Gemini content generation (blog, FAQ, SEO, tags)
│   ├── ai-image.ts         # Gemini image generation + Vercel Blob upload
│   ├── constants.ts        # Categories, canonical tags, site URL
│   └── linkedin.ts         # LinkedIn OAuth & auto-posting
└── components/
    ├── neo/                # Neo-Brutalism design components (NeoCard, NeoButton, etc.)
    ├── layout/             # Nav, Footer
    └── ui/                 # shadcn/ui base components
```

### Key patterns

- **Service layer**: Each content type exposes `{type}Service.create()`, `.getBySlug()`, `.update()`, `.togglePublished()` in `features/{type}/service.ts`
- **Validation**: Zod schemas generated via `drizzle-zod` in each feature's `schema.ts`
- **DB client**: Lazy-initialized Proxy in `db.ts` — uses WebSocket pool for CLI scripts, HTTP for serverless
- **Path alias**: `@/*` maps to `src/*`

### Database (Neon PostgreSQL + Drizzle)

Schema in `src/lib/schema.ts`. Key tables: `posts`, `faqs`, `classes`, `courses`, `lifeLogs`, `series`, `tags` (with junction tables `postsToTags`, `faqsToTags`, etc.), `contentDailyStats`, `seoDocuments`.

Environment variables: `DATABASE_URL` (pooled), `DIRECT_URL` (for migrations).

### Design system: Neo-Brutalism

- Zero border-radius everywhere (`--radius-*: 0px`)
- Black borders: `border-4 border-black` (cards), `border-2 border-black` (inputs)
- Hard shadows: `neo-shadow` (4px 4px), `neo-shadow-sm` (2px 2px), `neo-shadow-lg` (6px 6px)
- Primary red `#FF0000`, accent gold `#FFD700`, background `#F3F3F3`
- `NeoCard` on mobile: transparent bg, no border/shadow; on sm+: white bg with full neo styling
- Font: Pretendard (Korean-optimized, loaded in root layout)
- Mobile base font: `16px`; desktop `html { font-size: 110% }`

### Content agent system

Orchestrator skill at `02_content-agent/skills/content-ops/SKILL.md`. Sub-agents in `.claude/agents/`:

| Agent | Role |
|-------|------|
| `topic-suggester` | Content gap analysis, topic recommendations |
| `content-creator` | Generate content matching existing style |
| `content-reviewer` | Fact-check, grammar, structure validation |
| `seo-manager` | SEO score analysis and field optimization |

Pipeline: topic suggestion → content creation → review → SEO → deploy (with user approval gates at each phase).

## Conventions

- **Korean content**: 국립국어원 맞춤법, 외래어 표기법 준수. 기술 용어는 업계 통용 표기 우선.
- **Tags**: Must use canonical tags from `CANONICAL_TAGS` in `constants.ts`. No free-form tags.
- **Slugs**: Kebab-case English. Duplicate slugs get `-2`, `-3` suffix.
- **Loading UI**: `LoadingUI` component used by all `loading.tsx` files. Shows after 200ms delay to prevent flash.
- **React Compiler**: Enabled in `next.config.ts`. No manual `useMemo`/`useCallback` needed for rendering optimization.
- **Image handling**: Use native `<img>` in client components for lightweight loading; `next/image` in server components.

### LinkedIn Auto-Posting (`src/lib/linkedin.ts`)

- **little Text Format 이스케이프 필수**: LinkedIn Posts API의 `commentary` 필드는 "little Text Format"이라는 자체 마크업을 사용한다. `()`, `[]`, `{}`, `@`, `#`, `*`, `_`, `~`, `<>`, `|`, `\` 문자가 예약되어 있으며, 이스케이프 없이 전송하면 **해당 문자 이후 텍스트가 전부 잘린다**. `escapeLinkedInLittleText()` 함수가 이를 처리하므로 절대 제거하거나 우회하지 말 것.
- **Content-Type**: `application/json` 만 사용. `charset=UTF-8` 붙이지 말 것 (LinkedIn API 비표준).
- **LinkedIn-Version**: 헤더 값을 `YYYYMM` 형식으로 최신 유지 (현재 `202602`).
