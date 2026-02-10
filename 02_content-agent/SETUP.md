# 블로그 콘텐츠 자동화 에이전트 - 설정 가이드

## 사전 요구사항

### 1. 환경 변수

`.env.local` 파일에 다음 변수가 설정되어 있어야 합니다:

```bash
# DB 연결 (필수)
DATABASE_URL="postgresql://..."

# AI 모델 (필수 - Gemini API)
GOOGLE_AI_API_KEY="your-api-key"
AI_MODEL_NAME="gemini-1.5-flash"  # 기본값

# 이미지 생성 (Post 타입 일러스트 자동 생성용)
GEMINI_IMAGE_API_KEY="your-gemini-image-api-key"

# Vercel Blob (이미지 호스팅 - Vercel 배포 환경에서 자동 설정, CLI 사용 시 필요)
# BLOB_READ_WRITE_TOKEN="your-blob-token"
```

### 2. 의존성

프로젝트 루트에서:

```bash
npm install
```

`tsx`가 devDependencies에 포함되어 있어야 합니다 (이미 설치됨).

## 사용법

### Claude Code에서 직접 사용

에이전트 시스템은 Claude Code의 Task 도구를 통해 동작합니다. 별도 실행 명령 없이 자연어로 요청합니다.

```
# 토픽 추천
"블로그에 쓸 만한 토픽 추천해줘"

# Post 생성 (전체 파이프라인)
"AI 마케팅 자동화에 대한 인사이트 글을 써줘"

# FAQ 생성
"GA4 이벤트 추적 방법에 대한 FAQ를 만들어줘"

# Class 생성
"마케팅 코스에 'Attribution Model' 클래스를 추가해줘"

# 기존 글 검수
"최근 작성한 글 검수해줘"

# SEO 최적화
"이 글 SEO 최적화해줘"

# SEO 일괄 점검
"전체 콘텐츠 SEO 일괄 점검해줘"
```

### 배포 스크립트 단독 사용

에이전트를 거치지 않고 직접 DB에 콘텐츠를 삽입할 수 있습니다.

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
echo '{"title":"테스트","slug":"test","content":"내용...","category":"AI_TECH"}' | \
  npx tsx scripts/publish-content.ts --type post
```

### Payload 예시

#### Post
```json
{
  "title": "AI 마케팅 자동화 도입 가이드",
  "slug": "ai-marketing-automation-guide",
  "content": "## 도입\n\nAI 마케팅 자동화는...",
  "category": "MARKETING",
  "excerpt": "AI 기반 마케팅 자동화 전략",
  "highlights": ["전환율 개선", "고객 세그먼트"],
  "tags": ["AI", "마케팅", "자동화"],
  "isPublished": false,
  "metaTitle": "AI 마케팅 자동화로 전환율 200% 높이는 방법",
  "metaDescription": "AI 기반 마케팅 자동화 전략 5가지를 실무 사례와 함께 소개합니다."
}
```

#### FAQ
```json
{
  "question": "GA4에서 이벤트 추적은 어떻게 설정하나요?",
  "slug": "ga4-event-tracking-setup",
  "answer": "## 핵심 답변\n\nGA4 이벤트 추적은...",
  "category": "DATA",
  "difficulty": "INTERMEDIATE",
  "techStack": ["GA4", "GTM"],
  "tags": ["GA4", "이벤트추적", "데이터분석"],
  "isPublished": false
}
```

#### Class
```json
{
  "term": "Attribution Model",
  "slug": "attribution-model",
  "definition": "마케팅 전환에 기여한 채널별 기여도를 산정하는 모델",
  "content": "## 상세 설명\n\nAttribution Model은...",
  "category": "MARKETING",
  "courseId": 1,
  "orderInCourse": 5,
  "difficulty": "INTERMEDIATE",
  "tags": ["어트리뷰션", "마케팅분석"],
  "isPublished": false
}
```

## 에이전트 구조

```
.claude/agents/
├── content-creator.md   # 콘텐츠 생성 (sonnet)
├── content-reviewer.md  # 콘텐츠 검수 (sonnet)
├── seo-manager.md       # SEO 최적화 (haiku)
└── topic-suggester.md   # 토픽 제안 (haiku)

02_content-agent/
├── SETUP.md             # 이 파일
└── skills/content-ops/
    ├── SKILL.md          # 오케스트레이터 워크플로우
    └── references/
        ├── writing-style-guide.md  # 작성 스타일 가이드
        ├── seo-checklist.md        # SEO 체크리스트
        └── review-criteria.md      # 검수 기준 상세
```

## 트러블슈팅

### "DATABASE_URL 환경 변수가 설정되지 않았습니다"
→ `.env.local` 파일에 `DATABASE_URL` 확인. dotenv 자동 로드는 Next.js 런타임에서만 동작하므로, 스크립트 실행 시 `dotenv` 패키지가 필요할 수 있습니다.

```bash
# dotenv-cli 사용
npx dotenv -e .env.local -- npx tsx scripts/publish-content.ts --type post --file data.json
```

### "슬러그 중복 감지"
→ 동일한 슬러그가 이미 DB에 존재합니다. 스크립트가 자동으로 `-2`, `-3` 접미사를 추가합니다.

### AI 생성 실패
→ `GOOGLE_AI_API_KEY` 확인 및 API 할당량 확인. Gemini API Rate Limit에 도달했을 수 있습니다.

### 이미지 생성 실패
→ `GEMINI_IMAGE_API_KEY` 확인. 이미지 생성은 비차단(non-blocking) 처리되므로 실패 시 이미지 없이 콘텐츠가 진행됩니다. Vercel Blob 업로드 실패 시 `BLOB_READ_WRITE_TOKEN` 확인.
