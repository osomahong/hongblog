---
name: newcontent
description: GA4 데이터 기반 콘텐츠 자동 생성 스킬. GA4 성과(3개월/1개월/1주)를 5개 관점(카테고리 추세·글당 효율·급상승·참여율·트래픽 소스)으로 분석하여 고성과 주제를 자동 선정하고, 기존 콘텐츠 파이프라인(스타일·구조·SEO·AEO/GEO·태그)을 그대로 따라 글을 작성한다. "/newcontent", "데이터 기반 글쓰기", "성과 기반 콘텐츠", "GA4로 다음 글 추천" 요청 시 트리거.
argument-hint: '[--range 7d|30d|90d] [--category MARKETING|AI_TECH|DATA]'
---

# GA4 데이터 기반 콘텐츠 생성 스킬

블로그 GA4 성과 데이터를 분석하여 **더 좋은 성과를 낼 주제를 자동 선정**하고, 기존 콘텐츠 파이프라인(스타일, 구조, SEO, AEO/GEO, 태그)을 그대로 따라 글을 작성합니다.

## 워크플로우 (4단계)

### Phase 1: GA4 성과 분석

> **주의:** `scripts/ga4-report.ts`가 현재 삭제된 상태입니다. GA4 데이터 조회가 필요한 경우 `ga4-analysis` 스킬을 통해 GA4 Data API를 직접 호출하거나, GA4 웹 UI에서 사용자가 데이터를 제공해야 합니다.

3개 기간의 데이터를 수집하여 트렌드와 기회를 파악한다.

**분석 관점 (5가지):**

| 관점 | 분석 방법 | 인사이트 |
|------|----------|---------|
| 카테고리 추세 | 3개월→1개월→1주 세션 변화율 | 상승 중인 카테고리 = 확장 기회 |
| 글당 효율 | 카테고리별 avgSessionsPerPost | 효율 높은 카테고리에 글 추가 |
| 급상승 콘텐츠 | 1주 데이터에서 상위 진입한 새 글 | 트렌드 주제 포착 |
| 참여율 | engagementRate 상위 콘텐츠 | 독자가 깊이 읽는 주제 유형 |
| 트래픽 소스 | Organic Search 비율이 높은 콘텐츠 | SEO 잠재력 높은 주제 유형 |

**출력: 사용자에게 GA4 인사이트 요약을 표로 보고**

### Phase 2: 데이터 기반 토픽 선정

GA4 인사이트와 콘텐츠 현황을 결합하여 토픽을 추천한다.

**콘텐츠 현황 수집:**
- `Glob "content/insights/*.md"` + `Read` frontmatter → 카테고리, 태그 분포
- `Glob "content/classes/*.md"` + `Read` frontmatter → Class 현황
- 또는 `src/lib/content.ts`의 `getInsights()`, `getClasses()`, `getAllTags()`, `getCategoryStats()` 활용

**토픽 선정 로직 (4가지 기준):**

1. **고효율 확장**: GA4에서 글당 세션이 높은 카테고리 + 저빈도 태그 → 해당 영역에 새 글
2. **트렌드 추종**: 최근 1주 급상승 콘텐츠의 후속/심화 글 → 시의성 높은 주제
3. **독자 니즈**: 참여율 상위 콘텐츠와 유사한 주제 → 깊이 읽는 독자층 공략
4. **SEO 기회**: Organic Search 유입이 높은 유형 + 아직 다루지 않은 키워드 → 검색 트래픽 확대

**체크포인트 (사용자 승인):**

```
## 토픽 제안 (GA4 데이터 기반)

| 우선순위 | 제안 제목 | 카테고리 | GA4 근거 |
|----------|----------|---------|---------|
| 🔴 HIGH | "..." | AI_TECH | AI_TECH 글당 평균 세션 348, 관련 태그 미작성 |
| 🟡 MED | "..." | DATA | BigQuery 글 참여율 72%, 후속편 미작성 |
| 🟢 LOW | "..." | MARKETING | 카테고리 불균형 보강 |

어떤 토픽으로 진행할까요? (번호 선택 또는 직접 입력)
```

사용자가 토픽을 선택하면 Phase 3로 진행한다.

### Phase 3: 콘텐츠 작성

write-insight 스킬의 워크플로우를 그대로 따른다. 아래 모든 규칙을 준수한다.

**3-1. 웹 리서치**
- WebSearch / WebFetch로 선택된 토픽의 최신 정보 수집
- 현재 연도(2026)를 검색어에 포함하여 최신성 확보
- 공식 문서, 통계, 실무 사례 수집

**3-2. 콘텐츠 작성**

| 규칙 | 기준 | 참조 문서 |
|------|------|----------|
| 어투 | 존댓말(~습니다/~합니다) 통일 | writing-style-guide.md |
| 금지 | em dash(—), 수평 구분선(---) | writing-style-guide.md |
| 제목 | 담백체 서술문 (마케팅 수사 금지) | write-insight SKILL.md |
| 구조 | H2 3개 이상, 본문 1000자 이상 | writing-style-guide.md |
| 문단 | 3~4문장 (최소 2, 최대 5) | writing-style-guide.md |
| 요약 | 마지막에 3줄 요약 필수 | write-insight SKILL.md |
| AEO | 첫 문단에 직접 답변, 질문형 헤딩 | aeo-checklist.md |
| GEO | 출처 인용 2개+, 통계 2개+, 구조화 데이터 | geo-checklist.md |

**3-3. MD 파일 생성**

파일 경로: `content/insights/{slug}.md`

frontmatter 필수 필드:
- slug, title, excerpt, category, publishedAt
- tags (CANONICAL_TAGS에서 3~5개)
- metaTitle (30~60자), metaDescription (120~160자)
- ogTitle (40~60자), ogDescription (80~120자)
- quiz (선택지 3~4개, explanation 2~3문장)

**3-4. 검수**

content-reviewer 기준으로 자체 검수:
- 사실확인: 웹 리서치와 대조
- 한국어: 맞춤법, 외래어 표기법
- 구조: 도입부→본론→결론, H2 계층
- 퀴즈: Post는 의견형 질문 (암기형 금지)

**3-5. SEO 최적화**

seo-checklist.md 기준으로 SEO 필드 점검:
- metaTitle: 핵심 키워드 앞배치, 30~60자
- metaDescription: 가치 제안 + 행동 유도, 120~160자
- 본문 첫 100단어 안에 핵심 키워드

**사용자 피드백:**
- 초안 완성 후 사용자에게 공유
- 피드백 반영 → 최종본 확정

### Phase 4: 배포

1. `Write` tool로 `content/insights/{slug}.md` 파일 생성
2. `/generate-thumbnail` 스킬로 og:image 생성
   - `npx tsx scripts/generate-og.ts --slug <slug>`
   - frontmatter `ogImage` 필드 업데이트

**결과 보고:**
- 생성된 파일 경로, slug, URL (`/insights/{slug}`)
- GA4 근거 요약 (어떤 데이터를 기반으로 이 주제를 선택했는지)

## 재사용 컴포넌트

| 컴포넌트 | 경로 |
|----------|------|
| 콘텐츠 조회 | `src/lib/content.ts` → `getInsights()`, `getAllTags()`, `getCategoryStats()` |
| 태그 목록 | `src/lib/constants.ts` → `CANONICAL_TAGS` |
| 썸네일 생성 | `scripts/generate-og.ts` (generate-thumbnail 스킬) |

## 참조 문서

| 문서 | 경로 |
|------|------|
| 작성 스타일 | `.claude/skills/content-ops/references/writing-style-guide.md` |
| SEO 체크리스트 | `.claude/skills/content-ops/references/seo-checklist.md` |
| AEO 체크리스트 | `.claude/skills/content-ops/references/aeo-checklist.md` |
| GEO 체크리스트 | `.claude/skills/content-ops/references/geo-checklist.md` |
| GA4 용어 가이드 | `.claude/skills/content-ops/references/ga4-metrics-guide.md` |
| MD 스키마 | `.claude/skills/write-insight/references/post-schema.md` |

## 사전 조건

- `GA4_PROPERTY_ID` 환경 변수 설정 (GA4 분석 시)
- `GA4_SERVICE_ACCOUNT_KEY` 환경 변수 설정 (GA4 분석 시)

## 주의사항

- 콘텐츠 배포는 `content/insights/{slug}.md` 파일 Write로만 수행
- `npx vercel --prod` 직접 실행 금지 (Git Integration 자동 배포)
- 슬러그 중복 시 자동 `-2`, `-3` 접미사 추가
