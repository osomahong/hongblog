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
npm run check:links        # 콘텐츠 소스의 링크, relatedTerms, courseSlug 검사
npm run check:links:html   # 빌드 산출물 HTML의 모든 내부 링크까지 검사

# 기술적 SEO 검수 (빌드 후 실행)
npx tsx scripts/seo-audit.ts   # 메타, canonical, 중복, 구조화 데이터, 고아 페이지, 사이트맵 정합성

# 콘텐츠 윤문 검사 (새 글은 HARD 0건이 배포 조건)
npm run check:prose -- content/insights/{slug}.md   # 번역투·과장·AI식 지시문·비문 패턴 검출

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
- 클래스를 추가, 이동하면 `npm run build`(prebuild)가 `src/lib/generated/class-course-map.ts`를
  다시 생성한다. 이 매핑은 미들웨어가 잘못된 코스 경로를 정규 경로로 301 보낼 때 쓴다.

### SEO 규칙

- 콘텐츠를 **실질적으로 개편**하면 frontmatter에 `updatedAt`을 기록한다. 사이트맵 `lastmod`와
  Article `dateModified`가 이 값을 쓰므로 재크롤링 우선순위에 직접 영향을 준다.
  오탈자 수정 같은 사소한 변경에는 쓰지 않는다.
- 태그 페이지는 콘텐츠가 `MIN_TAG_ITEMS_FOR_INDEX`(3) 미만이면 자동으로 `noindex, follow`가 되고
  사이트맵에서도 빠진다. noindex 페이지를 사이트맵에 넣지 않는다는 원칙을 코드가 강제한다.
- 새 페이지 타입을 만들면 canonical, og:image, 구조화 데이터를 반드시 넣는다.
  `scripts/seo-audit.ts`가 누락을 잡아준다.
- **모든 문장 생성(콘텐츠, UI 카피, 메타 필드)에 AEO/GEO 정의 문장 규칙을 적용한다.**
  페이지 도입부와 metaDescription의 첫 문장은 핵심 개체를 포함한 "X는 Y입니다" 단정형
  정의로 쓰고, 메타·본문·JSON-LD 세 곳의 개체와 정의 표현을 일치시킨다. 행동 유도
  문구는 쓰지 않는다. 상세: `.claude/references/content/writing-style-guide.md`의
  "페이지 정의 문장 규칙" 섹션.


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

### 정렬 규칙 (AI-Practice 포함 전 페이지 공통)

**정렬은 매우 중요하다.** 한 섹션 안의 블록 요소(카드, 그리드, 목업, `pre` 등)는
좌우 끝을 모두 컨테이너 폭에 맞춘다.

- 같은 섹션의 카드/그리드가 여러 개면 **전부 같은 폭**을 쓴다. 단일 카드에만
  `max-w-*`를 걸어 위 그리드와 오른쪽 끝이 어긋나게 하지 말 것.
- `max-w-3xl`은 **본문 문단(가독성 목적)에만** 허용한다. 카드, 코드 블록, 목업 같은
  시각 블록에는 쓰지 않는다.
- 새 섹션을 만들면 커밋 전에 위아래 섹션과 좌우 가장자리가 일치하는지 스크린샷으로 확인한다.

### Content skill system

콘텐츠 작업은 스킬로 나뉘어 있고, 각각을 필요할 때 따로 부른다. 오케스트레이터는 없다.
`.claude/agents/`에 서브에이전트를 두지 않는다.

| 단계 | 스킬 | 하는 일 |
|---|---|---|
| 주제 | `blog-topic-creator` | 핫토픽·SNS·직접 지정 중 방향을 고르고 주제를 확정 |
| 주제 | `seo-topic-finder` | Search Console 검색 데이터로 빈자리 발굴 |
| 작성 | `write-insight` | 리서치 → 작성 → 문체 검수 → MD 생성 |
| 작성 | `newcontent` | GA4 성과를 근거로 주제 선정 후 작성 |
| 검수 | `prose-inspector` | 문체, 번역투, 문어체, 비문 |
| 검수 | `inspect-content` | SEO + AEO + GEO 구조 점검 |
| 제목 | `seo-title-creator` | 검색 경쟁력 있는 제목 3안 |
| 배포 | `generate-thumbnail` | og:image 생성 |
| 확산 | `sns-writer` | 쓰레드·인스타·링크드인 카피 |

공용 참조 문서는 `.claude/references/content/`에 있다 (작성 스타일, SEO/AEO/GEO 체크리스트,
GA4 용어, 썸네일 규격). 특정 스킬 전용 규칙은 그 스킬의 `references/`에 둔다.

### 콘텐츠 배포 게이트 (배포 후 수정 금지 원칙)

새 글과 대규모 개정은 반드시 이 순서를 지킨다. 배포 후 반복 수정을 막기 위한 규칙이다.

1. `npm run check:prose -- <파일>` HARD 0건
2. `node .claude/skills/prose-inspector/scripts/check-literary.mjs <파일>` HARD 0건
3. 낭독 검수 1회 (`prose-inspector` 스킬의 7개 항목. 표와 HTML 도표 안 문장까지 본다)
4. **전문을 사용자에게 출력하고 승인받은 뒤에만 커밋·배포** ("써줘"는 초안 요청이지 배포 승인이 아니다)

> **1번 통과는 문체 검증이 아니다.** `check-prose.ts`는 정규식 20여 개만 본다. 문어체 어휘(`갈래`,
> `얹히다`, `비로소` 등)는 2번이 잡고, 호응과 주어 누락은 3번이 잡는다. 2026-08에 1번만 믿고
> 배포했다가 9강을 전량 재수정했다. 사용자가 새 표현을 지적하면 `prose-inspector` 사전에 등록한다.

## Conventions

- **Korean content**: 국립국어원 맞춤법, 외래어 표기법 준수. 기술 용어는 업계 통용 표기 우선.
- **Tags**: Must use canonical tags from `CANONICAL_TAGS` in `constants.ts`. No free-form tags.
- **Slugs**: Kebab-case English. Duplicate slugs get `-2`, `-3` suffix.
- **React Compiler**: Enabled in `next.config.ts`. No manual `useMemo`/`useCallback` needed for rendering optimization.
- **Image handling**: Use native `<img>` in client components for lightweight loading; `next/image` in server components.
