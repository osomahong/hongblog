# content-ops 스킬 (오케스트레이터)

블로그 콘텐츠의 생성→검수→SEO 최적화→배포를 관리하는 마스터 워크플로우.

## 서브에이전트 구성

| Phase | 에이전트 | 모델 | 역할 |
|-------|---------|------|------|
| 0 | `topic-suggester` | haiku | 콘텐츠 갭 분석 + 토픽 제안 |
| 1 | `content-creator` | sonnet | 콘텐츠 생성 |
| 2 | `content-reviewer` | sonnet | 품질 검수 |
| 3 | `seo-manager` | haiku | SEO 최적화 |
| 4 | (오케스트레이터 직접) | - | 배포 (DB 저장) |

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
| "이 주제로 FAQ 만들어줘" | 1→2→3→4 | creator(FAQ)→reviewer→seo→배포 |
| "이 주제로 Class 만들어줘" | 1→2→3→4 | creator(Class)→reviewer→seo→배포 |
| "글 검수해줘" + 콘텐츠 | 2 | reviewer |
| "SEO 최적화해줘" | 3 | seo-manager(single) |
| "SEO 일괄 점검" | 3 | seo-manager(batch) |
| "전체 실행" | 0→1→2→3→4 | 전체 순차 |

## Phase 상세

### Phase 0: 토픽 제안

**트리거:** "토픽 추천", "뭐 쓸까", "콘텐츠 제안"

1. `topic-suggester` 에이전트에 위임
2. DB에서 전체 콘텐츠 현황 자동 수집
3. AI 기반 콘텐츠 갭 분석

**체크포인트 (사용자 승인):**
- 제안된 토픽 목록 표시
- 사용자가 토픽 선택 또는 직접 입력
- 콘텐츠 타입 확정 (post/faq/class/lifeLog)
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
courseId: Class 타입 시 사용자 지정
```

1. `content-creator` 에이전트에 위임
2. 기존 콘텐츠 스타일 샘플링
3. AI 콘텐츠 생성
4. 퀴즈 생성 (Post, Class 타입만) — content-creator가 본문 기반으로 자동 생성
5. 나노바나나 프로로 일러스트 2장 생성 → Vercel Blob 업로드 → 마크다운 삽입 (`generateAndInjectImages()`, 모든 콘텐츠 타입 적용)
6. [선택] Remotion 브랜드 썸네일 생성 → ogImage 설정 (`scripts/generate-thumbnail.ts`)
7. 메타데이터 자동 생성

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
2. 현재 SEO 점수 산출 (`analyzeSeoScore()`)
3. 필드별 개선안 생성
4. [선택] 사용자가 "심층 분석" 요청 시 → `content-inspector` 에이전트에 위임 (SEO+AEO+GEO 통합 점검)

**체크포인트 (사용자 승인):**
- SEO 점수 + 필드별 개선안 표시
- 전체 적용 / 선택 적용 / 건너뛰기

→ 적용/건너뛰기 후 Phase 4로

### Phase 4: 배포

**트리거:** Phase 3 완료

오케스트레이터가 직접 실행 (에이전트 위임 없음).

**배포 옵션 (사용자 선택):**

| 옵션 | 동작 |
|------|------|
| **초안 저장** | `isPublished: false`로 DB 저장 |
| **바로 배포** | `isPublished: true`로 DB 저장 |
| **취소** | 저장하지 않고 종료 |

**실행:**
```bash
npx tsx scripts/publish-content.ts --type <contentType> < payload.json
# 이미지는 배포 시 자동 삽입됨 (--no-images로 건너뛰기 가능)
```

또는 서비스 레이어 직접 호출:
- `postService.create()` → Post
- `faqService.create()` → FAQ
- `classService.create()` → Class
- `logService.create()` → LifeLog

**완료 보고:**
- 생성된 ID, slug, URL
- 최종 SEO 점수
- 배포 상태 (초안/배포완료)

## 참조 문서

| 문서 | 경로 | 용도 |
|------|------|------|
| 작성 스타일 가이드 | `references/writing-style-guide.md` | content-creator 참조 |
| SEO 체크리스트 | `references/seo-checklist.md` | seo-manager 참조 |
| 검수 기준 | `references/review-criteria.md` | content-reviewer 참조 |

## 에러 처리

| 에러 상황 | 대응 |
|----------|------|
| AI 생성 실패 | 재시도 1회 → 실패 시 사용자 보고 |
| 슬러그 중복 | 자동으로 `-2`, `-3` 접미사 추가 |
| DB 저장 실패 | 트랜잭션 롤백 → 에러 상세 보고 |
| 서비스 연결 불가 | 환경 변수 확인 안내 |

## 관련 코드

| 파일 | 용도 |
|------|------|
| `src/lib/ai.ts` | AI 함수 (generateBlogContent, generateFaqContent, analyzeContentGaps 등) |
| `src/lib/ai-image.ts` | 일러스트 생성 (generateAndInjectImages - Gemini 3 Pro Image + Vercel Blob) |
| `src/lib/queries.ts` | DB 조회 함수 (getPublishedPosts, getAllTags 등) |
| `src/features/posts/service.ts` | Post CRUD 서비스 |
| `src/features/faqs/service.ts` | FAQ CRUD 서비스 |
| `src/features/classes/service.ts` | Class CRUD 서비스 |
| `src/features/logs/service.ts` | LifeLog CRUD 서비스 |
| `scripts/publish-content.ts` | CLI 배포 스크립트 |
