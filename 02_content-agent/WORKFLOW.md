# 블로그 콘텐츠 자동화 - 워크플로우 & 사용법

## 전체 흐름

```
┌─────────────────────────────────────────────────────────────┐
│                     사용자 요청                               │
│  "AI 마케팅에 대한 글 써줘" / "토픽 추천해줘" / "SEO 점검"     │
└─────────────┬───────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────┐
│   content-ops 오케스트레이터  │  ← 요청을 분석해 적절한 Phase로 라우팅
└─────────────┬───────────────┘
              │
    ┌─────────┼─────────┬──────────┬──────────┐
    ▼         ▼         ▼          ▼          ▼
 Phase 0   Phase 1   Phase 2   Phase 3   Phase 4
 토픽제안   콘텐츠생성  검수       SEO       배포
 (선택)    (필수)     (필수)    (선택)    (필수)
    │         │         │          │          │
    ▼         ▼         ▼          ▼          ▼
 topic-   content-  content-    seo-      DB 저장
 suggester creator  reviewer   manager   (직접실행)
 [haiku]  [sonnet]  [sonnet]   [haiku]
```

---

## Phase별 상세

### Phase 0. 토픽 제안

> 에이전트: `topic-suggester` (haiku)

**언제 실행되나?**
- "토픽 추천해줘", "뭐 쓸까", "콘텐츠 제안" 요청 시

**하는 일:**
1. DB에서 전체 콘텐츠 현황 자동 수집
   - 카테고리별 Post/FAQ/Class 분포
   - 태그 커버리지 (1~2건만 있는 태그 = 확장 기회)
   - 미완성 시리즈
   - 코스별 클래스 수
2. AI가 콘텐츠 갭 분석
3. 우선순위별 토픽 5~10개 제안

**사용자 액션:**
- 제안된 토픽 중 하나 선택 → Phase 1로 진행
- 직접 토픽 입력 → Phase 1로 진행
- 취소

---

### Phase 1. 콘텐츠 생성

> 에이전트: `content-creator` (sonnet)

**언제 실행되나?**
- Phase 0에서 토픽 선택 후
- 사용자가 직접 "이 주제로 글 써줘" 요청 시

**하는 일:**
1. 같은 카테고리의 기존 글 2~3개를 샘플링하여 스타일 분석
2. 사용자 제공 정보(토픽, 아웃라인, 키포인트) 기반으로 콘텐츠 생성
3. 메타데이터 자동 생성 (slug, excerpt, tags, highlights)

**지원 콘텐츠 타입:**

| 타입 | 생성물 | 길이 기준 |
|------|--------|----------|
| Post | 마크다운 인사이트 글 | 1000~3000단어 |
| FAQ | 질문 + 마크다운 답변 | 500~1500단어 |
| Class | 용어 정의 + 상세 설명 | 500~1500단어 |
| LifeLog | 일상/경험 글 | 500~2000단어 |

**사용자 액션:**
- 승인 → Phase 2로 진행
- 수정 요청 → 피드백 반영 후 재생성
- 취소

---

### Phase 2. 콘텐츠 검수

> 에이전트: `content-reviewer` (sonnet)

**언제 실행되나?**
- Phase 1 승인 후 자동
- 사용자가 "글 검수해줘" + 기존 콘텐츠 제공 시

**검수 4개 항목:**

| 항목 | 체크 내용 | 예시 |
|------|----------|------|
| 사실 확인 | 미확인 통계, 부정확한 기술 설명 | "90%의 기업이..." (출처?) |
| 논리 일관성 | 자기 모순, 논리 비약 | 앞에서 A → 뒤에서 not-A |
| 구조 분석 | 서론-본론-결론, 헤딩 계층 | H3 아래 H2 사용 |
| 한국어 교정 | 맞춤법, 띄어쓰기, 외래어, 어투 | 됬다→됐다, 컨텐츠→콘텐츠 |

**검수 결과:**

| 판정 | 기준 | 후속 |
|------|------|------|
| **PASS** | CRITICAL 0건, WARNING 2건 이하 | → Phase 3 진행 |
| **REVISE** | CRITICAL 1~2건 또는 WARNING 3건+ | → 수정 적용 후 재검수 |
| **REWRITE** | CRITICAL 3건+ 또는 구조 문제 | → Phase 1 재실행 |

**사용자 액션:**
- PASS 확인 → Phase 3으로 진행
- 수정사항 전체 적용 / 선택 적용 / 거부
- 재생성 요청

---

### Phase 3. SEO 최적화

> 에이전트: `seo-manager` (haiku)

**언제 실행되나?**
- Phase 2 통과 후 자동
- 사용자가 "SEO 최적화해줘" 요청 시

**최적화 대상 필드:**

| 필드 | 기준 | 예시 |
|------|------|------|
| metaTitle | 30~60자, 키워드 포함 | "AI 마케팅 자동화 전환율 높이는 5가지 전략" |
| metaDescription | 120~160자 | "AI 기반 마케팅 자동화 전략을 실무 사례와 함께..." |
| ogTitle | 40~60자, SNS 클릭 유도 | "마케터 필수! AI 자동화 가이드" |
| ogDescription | 80~120자 | 가치 제안 중심 요약 |

**사용자 액션:**
- 전체 적용 / 선택 적용 / 건너뛰기 → Phase 4로 진행

---

### Phase 4. 배포

> 오케스트레이터 직접 실행 (에이전트 없음)

**배포 옵션:**

| 옵션 | 동작 |
|------|------|
| 초안 저장 | `isPublished: false`로 DB 저장 (관리자만 볼 수 있음) |
| 바로 배포 | `isPublished: true`로 DB 저장 (사이트에 즉시 노출) |
| 취소 | 저장하지 않고 종료 |

**완료 시 출력:**
- 생성된 ID, slug, 접근 URL
- 최종 SEO 점수
- 배포 상태

---

## 사용법 가이드

### 기본 사용 (자연어 요청)

Claude Code에서 자연어로 요청하면 적절한 Phase가 자동으로 실행됩니다.

#### 전체 파이프라인 (생성→검수→SEO→배포)

```
"AI 마케팅 자동화에 대한 인사이트 글을 써줘"
```
→ Phase 1 → 2 → 3 → 4 자동 진행 (각 Phase마다 사용자 승인)

#### 타입 지정 생성

```
"GA4 이벤트 추적에 대한 FAQ를 만들어줘"
"마케팅 코스에 'Attribution Model' 클래스를 추가해줘"
"제주도 여행 라이프로그를 써줘"
```

#### 아웃라인/키포인트 제공

```
"다음 아웃라인으로 AI_TECH 카테고리 글을 써줘:
1. RAG 개념 소개
2. 파이프라인 설계
3. 실무 적용 사례
핵심 포인트: 벡터 DB 선택 기준, 청킹 전략"
```

### 부분 실행

#### 토픽 추천만

```
"블로그에 쓸 만한 토픽 추천해줘"
"MARKETING 카테고리가 부족한 것 같은데 토픽 제안해줘"
```

#### 검수만

```
"이 글 검수해줘: [마크다운 콘텐츠]"
"최근 작성한 Post 검수해줘"
```

#### SEO만

```
"이 글 SEO 최적화해줘"
"전체 콘텐츠 SEO 일괄 점검해줘"
```

### CLI 배포 스크립트 (직접 사용)

에이전트를 거치지 않고 JSON 파일을 DB에 직접 삽입합니다.

```bash
# Post 배포
npx tsx scripts/publish-content.ts --type post --file ./data/post.json

# FAQ 배포
npx tsx scripts/publish-content.ts --type faq --file ./data/faq.json

# Class 배포
npx tsx scripts/publish-content.ts --type class --file ./data/class.json

# LifeLog 배포
npx tsx scripts/publish-content.ts --type log --file ./data/log.json

# stdin으로 전달
cat payload.json | npx tsx scripts/publish-content.ts --type post
```

> `.env.local`의 DATABASE_URL이 필요합니다. dotenv-cli 사용:
> ```bash
> npx dotenv -e .env.local -- npx tsx scripts/publish-content.ts --type post --file data.json
> ```

---

## 요청 → Phase 매핑 요약

| 요청 패턴 | Phase | 에이전트 |
|----------|-------|---------|
| "토픽 추천" / "뭐 쓸까" | 0 | topic-suggester |
| "글 써줘" / "Post 작성" | 1→2→3→4 | creator→reviewer→seo→배포 |
| "FAQ 만들어줘" | 1→2→3→4 | creator(FAQ)→reviewer→seo→배포 |
| "Class 추가해줘" | 1→2→3→4 | creator(Class)→reviewer→seo→배포 |
| "라이프로그 써줘" | 1→2→3→4 | creator(Log)→reviewer→seo→배포 |
| "검수해줘" | 2 | reviewer |
| "SEO 최적화" | 3 | seo-manager |
| "SEO 일괄 점검" | 3 (batch) | seo-manager |
| "전체 실행" | 0→1→2→3→4 | 전체 순차 |

---

## 파일 구조

```
hongblog/
├── .claude/agents/                          # 에이전트 정의
│   ├── content-creator.md                   #   콘텐츠 생성 (sonnet)
│   ├── content-reviewer.md                  #   콘텐츠 검수 (sonnet)
│   ├── seo-manager.md                       #   SEO 최적화 (haiku)
│   └── topic-suggester.md                   #   토픽 제안 (haiku)
│
├── 02_content-agent/
│   ├── SETUP.md                             # 환경 설정 가이드
│   ├── WORKFLOW.md                          # 이 문서
│   └── skills/content-ops/
│       ├── SKILL.md                         # 오케스트레이터 스킬 정의
│       └── references/
│           ├── writing-style-guide.md       #   작성 스타일 가이드
│           ├── seo-checklist.md             #   SEO 체크리스트
│           └── review-criteria.md           #   검수 기준 상세
│
├── scripts/
│   └── publish-content.ts                   # CLI 배포 스크립트
│
└── src/lib/
    ├── ai.ts                                # AI 함수
    │   ├── generateBlogContent()            #   Post/Class/Log 생성
    │   ├── generateFaqContent()             #   FAQ 생성
    │   ├── analyzeContentGaps()             #   토픽 제안
    │   ├── analyzeSeoScore()                #   SEO 점수 (로컬)
    │   ├── generateSeoSuggestions()         #   SEO 개선안 (AI)
    │   └── generateMetaDescription()        #   메타 설명 생성
    │
    └── queries.ts                           # DB 조회 함수
        ├── getPublishedPosts/Faqs/Classes() #   발행 콘텐츠 조회
        ├── getAllTags()                      #   전체 태그
        ├── getCategoryStats()               #   카테고리별 통계
        └── getAllSeries()                    #   시리즈 목록
```
