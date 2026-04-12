---
name: ga4-analysis
description: GA4 데이터 분석 스킬. "GA4 분석", "트래픽 분석", "콘텐츠 성과", "애널리틱스", "이번 달 트래픽" 요청 시 트리거. GA4 Data API로 실제 트래픽 데이터를 조회하고 MD 파일 콘텐츠 메타데이터와 교차 분석하여 인사이트를 생성합니다.
---

# ga4-analysis 스킬

GA4 데이터를 분석하여 콘텐츠 성과 인사이트를 생성합니다.

## 사용법

```
/ga4-analysis                          # 빠른 요약 (최근 30일)
/ga4-analysis --days 7                 # 최근 7일 분석
/ga4-analysis --mode content-perf      # 콘텐츠 성과 분석
/ga4-analysis --mode category-stats    # 카테고리별 성과
```

또는 자연어:
- "이번 달 트래픽 어때?"
- "어떤 카테고리가 인기 있어?"
- "콘텐츠 전략 추천해줘"
- "GA4 분석해줘"

## 사전 설정

```bash
# .env.local에 추가
GA4_PROPERTY_ID=123456789
GA4_SERVICE_ACCOUNT_KEY=<base64-encoded-service-account-json>
```

서비스 계정에 GA4 속성의 "뷰어" 역할이 필요합니다.

> **주의:** `scripts/ga4-report.ts` CLI 스크립트가 현재 삭제된 상태입니다. GA4 Data API 직접 호출 또는 사용자 데이터 제공 방식으로 대체합니다.

## 분석 모드

| 모드 | 설명 | 트리거 |
|------|------|--------|
| Quick Report | 핵심 지표 요약 | "트래픽 요약", "GA4 분석" |
| Content Performance | GA4+MD 메타데이터 교차 분석 | "콘텐츠 성과", "인기 글" |
| Category Stats | 카테고리별 효율 | "카테고리별 성과" |
| Strategy | 데이터 기반 전략 | "콘텐츠 전략 추천" |

## content-ops 연동

Phase 0(토픽 제안) 실행 시 GA4 데이터를 선택적으로 활용:
- ga4-analyst가 카테고리별 성과 데이터 제공
- topic-suggester가 이를 참고하여 데이터 기반 토픽 추천

## 콘텐츠 메타데이터 접근

GA4 교차 분석에 필요한 콘텐츠 정보:
- `src/lib/content.ts`의 `getInsights()`, `getClasses()`, `getAllTags()`, `getCategoryStats()`
- 또는 `Glob "content/insights/*.md"` + `Read` frontmatter

## 의존성

- `@google-analytics/data` npm 패키지
- GA4 Data API 서비스 계정
