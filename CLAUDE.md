# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run dev          # Next.js dev server (localhost:3000)
npm run build        # Production build (use to verify changes)
npm run lint         # ESLint

# OG Image Generation
npx tsx scripts/generate-og.ts --slug <slug>   # 단일 썸네일 생성
npx tsx scripts/generate-og.ts --all           # 전체 썸네일 생성

# 내부 링크 검사 (prebuild에서 자동 실행, 실패 시 빌드 중단)
npm run check:links        # 콘텐츠 소스의 링크·relatedTerms·courseSlug 검사
npm run check:links:html   # 빌드 산출물 HTML의 모든 내부 링크까지 검사

# SEO 점검
npx tsx --env-file=.env.local scripts/gsc-report.ts   # Search Console 성과 리포트
```

### 링크 규칙 (404 재발 방지)

- 클래스 상세 경로는 `/class/{courseSlug}/{classSlug}`다. **코스 조각을 현재 페이지 값으로
  조립하지 말 것.** 다른 코스의 클래스를 현재 코스 경로에 붙이면 404가 된다
  (`dynamicParams = false`라 실제 조합만 라우트로 생성됨).
- 링크는 항상 `src/lib/links.ts`의 `classHref()`로 만든다. 코스 정보가 없으면 `null`을
  반환하므로 호출부에서 링크를 렌더링하지 않는다.
- `content/classes/*.md`는 `courseSlug`가 필수이고 `relatedTerms`는 실재하는 슬러그만 쓴다.
- 클래스를 추가·이동하면 `npm run build`(prebuild)가 `src/lib/generated/class-course-map.ts`를
  다시 생성한다. 이 매핑은 미들웨어가 잘못된 코스 경로를 정규 경로로 301 보낼 때 쓴다.

## Architecture

**Next.js 16 App Router** SSG 블로그. MD 파일 기반 콘텐츠, Neo-Brutalism 디자인, Vercel 배포.

### Core layers

```
src/
├── app/                    # Routes (insights, class, tags, about)
├── lib/
│   ├── content.ts          # MD 파일 기반 콘텐츠 조회 (getInsights, getClasses, getCourses 등)
│   ├── types.ts            # TypeScript 타입 정의 (Insight, ClassItem, Course 등)
│   ├── constants.ts        # Categories, canonical tags, site URL
│   ├── gtm.ts              # Google Tag Manager (sendGAEvent)
│   └── utils.ts            # cn(), absoluteUrl(), formatDate()
├── components/
│   ├── neo/                # Neo-Brutalism 디자인 컴포넌트 (NeoCard, NeoButton 등)
│   └── layout/             # Nav, Footer
├── middleware.ts            # Legacy URL 리다이렉트
content/
├── insights/               # 블로그 인사이트 포스트 (MD 파일)
├── classes/                # 용어 정의 + 상세 설명 (MD 파일)
└── courses/                # 강의 코스 컨테이너 (MD 파일)
scripts/
├── generate-og.ts          # SVG 기반 og:image 생성 CLI
└── lib/                    # OG 이미지 관련 라이브러리
```

### Key patterns

- **Content layer**: `src/lib/content.ts`가 `content/*.md` 파일을 gray-matter로 파싱하여 타입 안전한 데이터 반환
- **SSG**: 모든 페이지가 `generateStaticParams()`로 빌드 시 정적 생성
- **콘텐츠 배포**: MD 파일 Write → git push → Vercel Git Integration 자동 배포
- **Path alias**: `@/*` maps to `src/*`

### Design system: Neo-Brutalism

- Zero border-radius everywhere (`--radius-*: 0px`)
- Black borders: `border-4 border-black` (cards), `border-2 border-black` (inputs)
- Hard shadows: `neo-shadow` (4px 4px), `neo-shadow-sm` (2px 2px), `neo-shadow-lg` (6px 6px)
- Primary red `#FF0000`, accent gold `#FFD700`, background `#F3F3F3`
- `NeoCard` on mobile: transparent bg, no border/shadow; on sm+: white bg with full neo styling
- Font: Pretendard (Korean-optimized, loaded in root layout)
- Mobile base font: `16px`; desktop `html { font-size: 110% }`

### Content agent system

Orchestrator skill at `.claude/skills/content-ops/SKILL.md`. Sub-agents in `.claude/agents/`:

| Agent | Role |
|-------|------|
| `topic-suggester` | Content gap analysis, topic recommendations |
| `content-creator` | Generate content matching existing style |
| `content-reviewer` | Fact-check, grammar, structure validation |
| `seo-manager` | SEO field optimization |
| `content-inspector` | SEO+AEO+GEO 통합 심층 점검 |
| `ga4-analyst` | GA4 데이터 분석 |
| `gtm-inspector` | GTM/GA4 설정 코드 감사 |

Pipeline: topic suggestion → content creation → review → SEO → deploy (with user approval gates at each phase).

## Conventions

- **Korean content**: 국립국어원 맞춤법, 외래어 표기법 준수. 기술 용어는 업계 통용 표기 우선.
- **Tags**: Must use canonical tags from `CANONICAL_TAGS` in `constants.ts`. No free-form tags.
- **Slugs**: Kebab-case English. Duplicate slugs get `-2`, `-3` suffix.
- **React Compiler**: Enabled in `next.config.ts`. No manual `useMemo`/`useCallback` needed for rendering optimization.
- **Image handling**: Use native `<img>` in client components for lightweight loading; `next/image` in server components.
