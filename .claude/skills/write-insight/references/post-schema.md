# Post (Insight) MD 파일 스키마 레퍼런스

## 파일 구조

파일 경로: `content/insights/{slug}.md`

```yaml
---
# === 필수 필드 ===
slug: "english-lowercase-with-hyphen"     # 영문 소문자+하이픈, unique
title: "글 제목 (max 255자)"
excerpt: "1~2문장 요약"
category: "MARKETING"                     # MARKETING | AI_TECH | DATA
tags: ["태그1", "태그2", "태그3"]          # CANONICAL_TAGS에서 3~5개 선택
publishedAt: "2026-04-12T00:00:00.000Z"   # ISO 8601 형식

# === SEO 메타데이터 (필수) ===
metaTitle: "SEO 제목 (30-60자)"
metaDescription: "SEO 설명 (120-160자)"
ogTitle: "SNS 제목 (40-60자)"
ogDescription: "SNS 설명 (80-120자)"

# === 퀴즈 (필수) ===
quiz:
  - question: "질문 내용"
    options: ["선택지1", "선택지2", "선택지3"]   # 3~4개 선택지
    correctIndex: 0                               # 0-based 정답 인덱스
    explanation: "정답 근거 설명 (2~3문장)"

# === 선택 필드 ===
highlights: ["핵심1", "핵심2", "핵심3"]   # 핵심 포인트
ogImage: "/og/slug-name.png"              # generate-thumbnail 스킬로 생성
thumbnailUrl: "https://..."               # 외부 썸네일 URL (선택)
seriesSlug: "series-slug"                 # 시리즈 소속 시
seriesOrder: 1                            # 시리즈 내 순서
---

마크다운 본문 (여기에 콘텐츠 작성)
```

> **참고:** `ogImage`는 `generate-thumbnail` 스킬(`/generate-thumbnail [slug]` 또는 `npx tsx scripts/generate-og.ts --slug <slug>`)로 생성한다. 생성 후 `public/og/{slug}.png` 파일이 만들어지며, frontmatter에 `/og/{slug}.png` 경로를 설정한다.

## 카테고리 (Insight 포스트용)

| 값 | 설명 |
|----|------|
| `MARKETING` | 마케팅 전략, 광고, 퍼포먼스 |
| `AI_TECH` | AI, 자동화, 개발, 바이브코딩 |
| `DATA` | 데이터 분석, GA4, BigQuery |

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

## Quiz 구조

```typescript
interface QuizQuestion {
  question: string;      // 질문
  options: string[];     // 선택지 (3~4개)
  correctIndex: number;  // 정답 인덱스 (0-based)
  explanation: string;   // 해설 (2~3문장)
}
```

## MD 파일 예시

```markdown
---
slug: "gmail-api-what-you-can-do"
title: "Gmail API를 활용해서 할 수 있는 것"
excerpt: "Gmail API가 제공하는 7개 리소스와 50개 이상의 메서드를 한눈에 정리하고, 이를 활용해 만들 수 있는 자동화 서비스 아이디어까지 소개합니다."
category: "AI_TECH"
tags: ["AI", "자동화", "API"]
publishedAt: "2026-03-15T00:00:00.000Z"
highlights:
  - "Gmail API는 7개 리소스로 구성되며, 50개 이상의 메서드를 제공합니다."
  - "이 메서드들을 조합하면 다양한 자동화 서비스를 만들 수 있습니다."
  - "시작은 공식 문서의 Quickstart를 따라하는 것이 가장 좋습니다."
metaTitle: "Gmail API를 활용해서 할 수 있는 것: 기능 전체 맵과 아이디어 5가지"
metaDescription: "Gmail API의 7개 리소스와 50개 이상의 메서드를 한눈에 정리합니다. 모닝 다이제스트 봇, 스마트 분류기 등 실전 아이디어도 함께 소개합니다."
ogTitle: "Gmail API 기능 전체 맵: 바이브코딩 시대에 이메일로 만들 수 있는 것들"
ogDescription: "Gmail API의 7개 핵심 리소스와 50개 이상의 메서드를 정리하고, AI와 결합한 자동화 서비스 아이디어 5가지를 소개합니다."
ogImage: "/og/gmail-api-what-you-can-do.png"
quiz:
  - question: "Gmail API에서 새 이메일이 도착했을 때 실시간으로 감지하려면 어떤 메서드를 사용해야 할까요?"
    options:
      - "users.watch: Google Cloud Pub/Sub와 연동하여 실시간 푸시 알림을 받을 수 있다"
      - "messages.list: 주기적으로 메시지 목록을 조회하여 새 메일을 확인한다"
      - "history.list: 변경 이력을 조회하여 새로 추가된 메시지를 찾는다"
    correctIndex: 0
    explanation: "users.watch 메서드는 Google Cloud Pub/Sub와 연동하여 메일함에 변화가 생기면 즉시 푸시 알림을 받을 수 있게 해줍니다. 폴링 방식보다 효율적이고 실시간 반응이 가능합니다."
---

## 바이브코딩 시대, API가 곧 능력이다

AI 활용 시대가 본격화되면서...

(본문 계속)

**3줄 요약:**
- Gmail API는 7개 리소스로 구성되며, 50개 이상의 메서드를 제공합니다.
- 이 메서드들을 조합하면 다양한 자동화 서비스를 만들 수 있습니다.
- 시작은 공식 문서의 Quickstart를 따라하는 것이 가장 좋습니다.
```
