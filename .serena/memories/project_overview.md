# hongblog Project Overview

## Purpose
"준이아빠블로그" - A personal tech/marketing blog built with Next.js. Features Insights (posts), FAQs, Classes (concept definitions), Courses, Life Logs.

## Tech Stack
- **Framework**: Next.js 16.1.1 (React 19, App Router)
- **Language**: TypeScript 5.9
- **CSS**: Tailwind CSS v4, Neo-brutalism design system
- **Database**: Neon (Postgres) via `@neondatabase/serverless`
- **ORM**: Drizzle ORM
- **Auth**: next-auth
- **Analytics**: GTM + custom dataLayer events (`sendGAEvent`)

## Key Directories
- `src/app/` - Next.js App Router pages
- `src/components/neo/` - Neo-brutalism UI components (NeoCard, NeoBadge, NeoButton, etc.)
- `src/components/` - Shared components
- `src/lib/schema.ts` - Drizzle DB schema
- `src/lib/queries.ts` - DB query functions and types
- `src/lib/gtm.ts` - GA/GTM event helper
- `drizzle/` - Migration files

## Commands
- `npm run dev` - Dev server
- `npm run build` - Production build
- `npm run lint` - ESLint
- `npm run db:generate` - Generate Drizzle migrations
- `npm run db:push` - Push schema to DB
- `npm run db:studio` - Drizzle Studio
- `npm run db:seed` - Seed DB

## Style
- Neo-brutalism: thick borders (`border-2 border-black`), `neo-shadow`, `halftone-bg`, `comic-emphasis`
- Responsive: mobile-first with `sm:` breakpoints
- Components use `cn()` utility for class merging
