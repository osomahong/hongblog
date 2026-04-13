---
name: write-insight
description: 블로그 Insight 포스트를 주제 기반으로 리서치, 작성, MD 파일 생성까지 자동 수행하는 스킬. 사용자가 "블로그 글 써줘", "인사이트 포스트 작성", "write insight about X" 등으로 요청할 때 트리거. /write-insight [주제] 형태로 직접 호출 가능.
---

# Insight 포스트 작성 스킬

블로그 Insight 포스트를 **주제 분석 → 웹 리서치 → 콘텐츠 작성 → MD 파일 생성**까지 일괄 수행한다.

## 워크플로우 (5단계)

### 1단계: 주제 분석 & 요구사항 정리

- `$ARGUMENTS`에서 주제, 카테고리, 핵심 포인트를 파악한다.
- 카테고리는 `MARKETING`, `AI_TECH`, `DATA` 중 하나 (Insight 전용).
- 불명확한 사항이 있으면 AskUserQuestion으로 사용자에게 확인한다.
  - 예: 카테고리, 기술 수준, 강조할 포인트 등

### 2단계: 웹 리서치

- WebSearch / WebFetch로 공식 문서, 최신 자료를 조사한다.
- 수집할 것: 기능 목록, 통계 데이터, 실무 사례, 공식 문서 URL
- 검색 시 현재 연도(2026)를 포함해 최신 정보를 우선한다.
- 수집한 Sources URL은 마지막에 본문에 포함한다.

### 3단계: 콘텐츠 작성

**제목·헤딩 규칙 (담백체):**
- 마케팅적 수사, 감탄사, 질문형 제목 금지
- **담백한 서술문** 형태로 작성 — 사실을 그대로 진술하듯 쓴다
- 독자를 자극하거나 호기심을 유발하려는 표현을 쓰지 않는다
- 글 제목(title)과 본문 H2 헤딩 모두 동일한 규칙을 따른다

| 금지 패턴 | 올바른 예시 |
|-----------|-----------|
| ~~"검색 트래픽 25% 증발" — 그 뉴스, 진짜일까요?~~ | AEO/GEO 시대, 검색 트래픽 변화를 데이터로 검증했습니다 |
| ~~마크다운, 들어는 봤는데 뭔가요?~~ | AI시대에 마크다운이 중요한 이유 |
| ~~충격! AI가 검색을 죽이고 있다~~ | AI Overviews 도입 이후 오가닉 CTR은 61% 하락했습니다 |
| ~~당신이 몰랐던 SEO의 비밀 5가지~~ | SEO에서 자주 오해되는 5가지 사실 |

**스타일 규칙:**
- 존댓말 어투 (~습니다/~합니다) 통일
- H2 헤딩(`##`) 최소 3개
- 본문 최소 1000단어
- 실무 적용 가능한 구체적 예시 최소 1개
- 마지막에 **3줄 요약** 포함
- 마크다운 테이블, 리스트 적극 활용

**사용자 피드백:**
- 초안 작성 후 사용자에게 공유하고 피드백을 받는다.
- 피드백 반영 후 최종본을 확정한다.

### 4단계: MD 파일 생성

- `references/post-schema.md`를 참조하여 MD 파일을 생성한다.
- 파일 경로: `content/insights/{slug}.md`
- **frontmatter 필수 필드:** slug, title, excerpt, category, tags, publishedAt, metaTitle, metaDescription, ogTitle, ogDescription, ogImage, quiz
- 태그는 `src/lib/constants.ts`의 `CANONICAL_TAGS` 목록에서만 선택 (3~5개)
- 퀴즈: 선택지 3~4개, explanation 2~3문장
- slug: 영문 소문자 + 하이픈, 간결하게 (예: `gmail-api-what-you-can-do`)

**썸네일 생성:**
- `/generate-thumbnail` 스킬 또는 `npx tsx scripts/generate-og.ts --slug <slug>`
- `public/og/{slug}.png` 생성 후 frontmatter `ogImage` 필드에 경로 설정

### 5단계: 결과 보고

- 생성된 파일 경로, slug, URL(`/insights/{slug}`) 출력
- 사용자에게 추가 작업 여부를 확인한다 (SEO 점검 등)

## 품질 기준 체크리스트

- [ ] 본문 최소 1000단어
- [ ] H2 헤딩 최소 3개
- [ ] 실무 적용 가능한 구체적 예시 1개 이상
- [ ] 퀴즈 1개 (선택지 3~4개, explanation 2~3문장)
- [ ] 존댓말(~습니다/~합니다) 어투 통일
- [ ] 3줄 요약 포함
- [ ] Sources 섹션에 참고 URL 포함
- [ ] 태그 3~5개 (CANONICAL_TAGS에서 선택)
- [ ] SEO 메타데이터 완비 (metaTitle ≤70자, metaDescription ≤170자)

## 주의사항

- 배포는 GitHub push로 자동 처리 (Vercel Git Integration), `npx vercel --prod` 직접 실행 금지
- 콘텐츠 배포는 `content/insights/{slug}.md` 파일 Write로만 수행

## 핵심 파일 참조

| 파일 | 용도 |
|------|------|
| `src/lib/content.ts` | MD 파일 기반 콘텐츠 조회 (getInsights, getInsightBySlug 등) |
| `src/lib/constants.ts` | `CANONICAL_TAGS` 태그 목록, `POST_CATEGORIES` |
| `src/lib/types.ts` | `Insight` 타입 정의 |
| `scripts/generate-og.ts` | SVG 기반 og:image 생성 CLI |
| `references/post-schema.md` | MD frontmatter 스키마 레퍼런스 |
