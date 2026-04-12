# content-ops 스킬 (오케스트레이터)

블로그 콘텐츠의 생성→검수→SEO 최적화→배포를 관리하는 마스터 워크플로우.

## 서브에이전트 구성

| Phase | 에이전트 | 모델 | 역할 |
|-------|---------|------|------|
| 0 | `topic-suggester` | haiku | 콘텐츠 갭 분석 + 토픽 제안 |
| 1 | `content-creator` | sonnet | 콘텐츠 생성 |
| 2 | `content-reviewer` | sonnet | 품질 검수 |
| 3 | `seo-manager` | haiku | SEO 최적화 |
| 4 | (오케스트레이터 직접) | - | 배포 (MD 파일 생성) |

에이전트 정의: `.claude/agents/content-creator.md`, `content-reviewer.md`, `seo-manager.md`, `topic-suggester.md`

## 실행 모드

### 모드 A: 사용자 주도 (토픽 제공)

사용자가 토픽/아웃라인을 직접 제공하면 Phase 1부터 시작.

```
사용자: "AI 마케팅 자동화에 대한 Post를 써줘"
→ Phase 1 (content-creator) → Phase 2 (content-reviewer) → Phase 3 (seo-manager) → Phase 4 (배포)
```

### 모드 B: 자동 제안 (토픽 추천)

사용자가 "토픽 추천" 요청 시 Phase 0부터 시작.

```
사용자: "토픽 추천해줘"
→ Phase 0 (topic-suggester) → 사용자 선택 → Phase 1~4
```

### 부분 실행

| 사용자 요청 | 실행 Phase | 에이전트 |
|------------|-----------|---------|
| "토픽 추천해줘" | 0 | topic-suggester |
| "이 주제로 글 써줘" | 1→2→3→4 | creator→reviewer→seo→배포 |
| "이 주제로 Class 만들어줘" | 1→2→3→4 | creator(Class)→reviewer→seo→배포 |
| "글 검수해줘" + 콘텐츠 | 2 | reviewer |
| "SEO 최적화해줘" | 3 | seo-manager(single) |
| "SEO 일괄 점검" | 3 | seo-manager(batch) |
| "SEO/AEO/GEO 심층 분석" | - | inspect-content 스킬 또는 content-inspector 에이전트 |
| "전체 실행" | 0→1→2→3→4 | 전체 순차 |

## Phase 상세

### Phase 0: 토픽 제안

**트리거:** "토픽 추천", "뭐 쓸까", "콘텐츠 제안"

1. `topic-suggester` 에이전트에 위임
2. MD 파일에서 전체 콘텐츠 현황 자동 수집
3. 에이전트 LLM reasoning 기반 콘텐츠 갭 분석

**체크포인트 (사용자 승인):**
- 제안된 토픽 목록 표시
- 사용자가 토픽 선택 또는 직접 입력
- 콘텐츠 타입 확정 (post/class)
- outline/keyPoints 추가 입력 (선택)

→ 승인 시 Phase 1로 진행

### Phase 1: 콘텐츠 생성

**트리거:** Phase 0 승인 또는 사용자 직접 토픽 제공

**입력 수집:**
```
contentType: 사용자 지정 또는 Phase 0 결과
topic: 사용자 제공 또는 Phase 0에서 선택
outline: 사용자 제공 (선택)
keyPoints: 사용자 제공 (선택)
category: 사용자 지정 또는 자동 판별
courseSlug: Class 타입 시 사용자 지정
```

1. `content-creator` 에이전트에 위임
2. 기존 콘텐츠 스타일 샘플링 (`content/insights/*.md`, `content/classes/*.md` Read)
3. 에이전트 LLM이 직접 콘텐츠 생성
4. 퀴즈 생성 (Post, Class 타입) — content-creator가 본문 기반으로 자동 생성
5. 메타데이터 자동 생성

**체크포인트 (사용자 승인):**
- 생성된 콘텐츠 전문 표시
- 제목, 카테고리, 태그 확인
- 수정 요청 / 승인 / 취소

→ 승인 시 Phase 2로, 수정 요청 시 재생성, 취소 시 종료

### Phase 2: 콘텐츠 검수

**트리거:** Phase 1 승인 또는 사용자가 기존 콘텐츠 검수 요청

1. `content-reviewer` 에이전트에 위임
2. 5개 항목 검수 (사실확인, 논리, 구조, 한국어, 퀴즈)
3. 종합 판정 (PASS/REVISE/REWRITE)

**체크포인트 (사용자 승인):**

| 판정 | 후속 |
|------|------|
| **PASS** | 사용자 확인 → Phase 3 진행 |
| **REVISE** | 수정사항 표시 → 전체적용/선택적용/거부 → 재검수 또는 Phase 3 |
| **REWRITE** | 사유 설명 → Phase 1 재실행 또는 취소 |

→ PASS/수정 완료 시 Phase 3으로

### Phase 3: SEO 최적화

**트리거:** Phase 2 완료 또는 사용자 직접 SEO 요청

1. `seo-manager` 에이전트에 위임
2. MD frontmatter의 SEO 필드를 체크리스트 기준으로 분석
3. 필드별 개선안 생성
4. [선택] 사용자가 "심층 분석" 요청 시 → `content-inspector` 에이전트에 위임 (SEO+AEO+GEO 통합 점검)

**체크포인트 (사용자 승인):**
- SEO 점수 + 필드별 개선안 표시
- 전체 적용 / 선택 적용 / 건너뛰기

→ 적용/건너뛰기 후 Phase 4로

### Phase 4: 배포

**트리거:** Phase 3 완료

오케스트레이터가 직접 실행 (에이전트 위임 없음).

**배포 방법:**

1. `Write` tool로 MD 파일 생성:
   - Post: `content/insights/{slug}.md` (frontmatter + 본문)
   - Class: `content/classes/{slug}.md` (frontmatter + 본문)
2. [선택] `generate-thumbnail` 스킬로 og:image 생성:
   - `npx tsx scripts/generate-og.ts --slug <slug>`
   - `public/og/{slug}.png` 생성
   - frontmatter의 `ogImage` 필드 업데이트

**체크포인트 (사용자 승인):**

| 옵션 | 동작 |
|------|------|
| **파일 생성** | MD 파일 Write |
| **썸네일 포함** | MD 파일 Write + generate-thumbnail 실행 |
| **취소** | 저장하지 않고 종료 |

**완료 보고:**
- 생성된 파일 경로
- slug, URL (`/insights/{slug}` 또는 `/class/{courseSlug}/{slug}`)
- 최종 SEO 점수

## 연계 스킬

| 스킬 | 연계 시점 | 용도 |
|------|----------|------|
| `generate-thumbnail` | Phase 4 | SVG 기반 og:image 생성 |
| `inspect-content` | Phase 3 (선택) | SEO+AEO+GEO 통합 심층 점검 |
| `write-insight` | Phase 1 대안 | Insight 포스트 직접 작성 (단독 실행) |

## 참조 문서

| 문서 | 경로 | 용도 |
|------|------|------|
| 작성 스타일 가이드 | `.claude/skills/content-ops/references/writing-style-guide.md` | content-creator 참조 |
| SEO 체크리스트 | `.claude/skills/content-ops/references/seo-checklist.md` | seo-manager 참조 |
| AEO 체크리스트 | `.claude/skills/content-ops/references/aeo-checklist.md` | inspect-content 연계 |
| GEO 체크리스트 | `.claude/skills/content-ops/references/geo-checklist.md` | inspect-content 연계 |
| 검수 기준 | `.claude/skills/content-ops/references/review-criteria.md` | content-reviewer 참조 |

## 에러 처리

| 에러 상황 | 대응 |
|----------|------|
| 슬러그 중복 | 자동으로 `-2`, `-3` 접미사 추가 |
| MD 파일 Write 실패 | 에러 상세 보고 |
| 썸네일 생성 실패 | 사용자에게 보고, ogImage 없이 진행 가능 |

## 관련 코드

| 파일 | 용도 |
|------|------|
| `src/lib/content.ts` | MD 파일 기반 콘텐츠 조회 (getInsights, getClasses, getAllTags 등) |
| `src/lib/constants.ts` | CANONICAL_TAGS, POST_CATEGORIES, CATEGORY_LABELS |
| `src/lib/types.ts` | Insight, ClassItem, Course 등 타입 정의 |
| `scripts/generate-og.ts` | SVG 기반 og:image 생성 CLI |
