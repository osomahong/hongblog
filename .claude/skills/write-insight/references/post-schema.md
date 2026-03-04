# Post JSON 스키마 레퍼런스

## JSON 파일 구조

파일 경로: `scripts/data/{slug}-post.json`

```jsonc
{
  // === 필수 필드 ===
  "title": "string (max 255자)",
  "slug": "string (영문 소문자+하이픈, max 255자, unique)",
  "category": "MARKETING | AI_TECH | DATA",
  "content": "string (마크다운 본문)",
  "excerpt": "string (1~2문장 요약)",
  "tags": ["string", "..."],           // CANONICAL_TAGS에서 3~5개 선택

  // === SEO 메타데이터 (필수) ===
  "metaTitle": "string (max 70자)",
  "metaDescription": "string (max 170자)",
  "ogTitle": "string (max 100자)",
  "ogDescription": "string (max 200자)",

  // === 퀴즈 (필수) ===
  "quiz": [
    {
      "question": "string",
      "options": ["string", "..."],     // 3~4개 선택지
      "correctIndex": 0,                // 0-based 정답 인덱스
      "explanation": "string (2~3문장)"
    }
  ],

  // === 선택 필드 ===
  "isPublished": false,                 // 기본값 false (초안)
  "highlights": ["string", "..."],      // 핵심 포인트 (jsonb)
  "canonicalUrl": "string (max 500자)",
  "noIndex": false
}
```

> **참고:** `ogImage`는 JSON에 넣지 않는다. `direct-publish.ts`가 AI 이미지 생성 후 자동으로 첫 번째 이미지 URL을 `ogImage`로 설정한다. AI 이미지 생성이 실패하거나 `--no-images`를 사용한 경우에도, 콘텐츠 내 첫 번째 마크다운 이미지(`![alt](url)`)가 `ogImage`로 자동 fallback된다.

---

## posts 테이블 스키마 (schema.ts)

| 컬럼 | 타입 | 제약조건 |
|------|------|----------|
| id | serial | PK, 자동 생성 |
| slug | varchar(255) | NOT NULL, UNIQUE |
| title | varchar(255) | NOT NULL |
| excerpt | text | nullable |
| content | text | NOT NULL |
| category | varchar(50) | NOT NULL, enum |
| highlights | jsonb (string[]) | nullable |
| thumbnailUrl | varchar(500) | nullable |
| isPublished | boolean | default false |
| metaTitle | varchar(70) | nullable |
| metaDescription | varchar(170) | nullable |
| ogImage | varchar(500) | nullable |
| ogTitle | varchar(100) | nullable |
| ogDescription | varchar(200) | nullable |
| canonicalUrl | varchar(500) | nullable |
| noIndex | boolean | default false |
| quiz | jsonb (QuizQuestion[]) | nullable |
| seriesId | integer | FK → series.id, nullable |
| seriesOrder | integer | nullable |
| createdAt | timestamp | default now() |
| updatedAt | timestamp | default now() |

---

## 카테고리 (Insight 포스트용)

| 값 | 설명 |
|----|------|
| `MARKETING` | 마케팅 전략, 광고, 퍼포먼스 |
| `AI_TECH` | AI, 자동화, 개발, 바이브코딩 |
| `DATA` | 데이터 분석, GA4, BigQuery |

---

## CANONICAL_TAGS 전체 목록

태그는 반드시 아래 목록에서만 선택한다 (3~5개).

| 카테고리 | 태그 |
|----------|------|
| 마케팅 지표 | CPC, CPM, CTR, CVR, CPA, CAC, LTV, ROAS, ROI |
| 마케팅 전략/개념 | 퍼널, 어트리뷰션, 전환, 리타게팅, 퍼포먼스마케팅, SEO |
| 분석/도구 | GA4, GTM, BigQuery |
| 웹 기술 | HTML, CSS, JavaScript, React, DOM, API |
| AI/자동화 | AI, 자동화, 노코드, 바이브코딩 |
| 광고 플랫폼 | Meta 광고, Google 광고 |
| 데이터 | 데이터 분석, 데이터 추적 |
| 일반 | 마케팅 실무, 광고 |

---

## QuizQuestion 인터페이스

```typescript
interface QuizQuestion {
  question: string;      // 질문
  options: string[];     // 선택지 (3~4개)
  correctIndex: number;  // 정답 인덱스 (0-based)
  explanation: string;   // 해설 (2~3문장)
}
```

---

## JSON 예시

```json
{
  "title": "Gmail API를 활용해서 할 수 있는 것",
  "slug": "gmail-api-what-you-can-do",
  "category": "AI_TECH",
  "content": "## 바이브코딩 시대, API가 곧 능력이다\n\nAI 활용 시대가 본격화되면서...(본문 생략)...\n\n**3줄 요약:**\n- Gmail API는 7개 리소스로 구성되며, 50개 이상의 메서드를 제공합니다.\n- 이 메서드들을 조합하면 다양한 자동화 서비스를 만들 수 있습니다.\n- 시작은 공식 문서의 Quickstart를 따라하는 것이 가장 좋습니다.",
  "excerpt": "Gmail API가 제공하는 7개 리소스와 50개 이상의 메서드를 한눈에 정리하고, 이를 활용해 만들 수 있는 자동화 서비스 아이디어까지 소개합니다.",
  "tags": ["AI", "자동화", "API"],
  "isPublished": false,
  "metaTitle": "Gmail API를 활용해서 할 수 있는 것 — 기능 전체 맵과 아이디어 5가지",
  "metaDescription": "Gmail API의 7개 리소스와 50개 이상의 메서드를 한눈에 정리합니다. 모닝 다이제스트 봇, 스마트 분류기 등 실전 아이디어도 함께 소개합니다.",
  "ogTitle": "Gmail API 기능 전체 맵 — 바이브코딩 시대에 이메일로 만들 수 있는 것들",
  "ogDescription": "Gmail API의 7개 핵심 리소스와 50개 이상의 메서드를 정리하고, AI와 결합한 자동화 서비스 아이디어 5가지를 소개합니다.",
  "quiz": [
    {
      "question": "Gmail API에서 새 이메일이 도착했을 때 실시간으로 감지하려면 어떤 메서드를 사용해야 할까요?",
      "options": [
        "users.watch — Google Cloud Pub/Sub와 연동하여 실시간 푸시 알림을 받을 수 있다",
        "messages.list — 주기적으로 메시지 목록을 조회하여 새 메일을 확인한다",
        "history.list — 변경 이력을 조회하여 새로 추가된 메시지를 찾는다"
      ],
      "correctIndex": 0,
      "explanation": "users.watch 메서드는 Google Cloud Pub/Sub와 연동하여 메일함에 변화가 생기면 즉시 푸시 알림을 받을 수 있게 해줍니다. 폴링 방식보다 효율적이고 실시간 반응이 가능합니다."
    }
  ]
}
```
