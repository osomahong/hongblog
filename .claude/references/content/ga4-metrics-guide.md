# GA4 측정기준/측정항목 한국어 가이드

GA4 Data API에서 사용하는 주요 측정기준(Dimension)과 측정항목(Metric)의 한국어 대응표입니다.

> **용어 규칙**: Dimension = 측정기준, Metric = 측정항목. "차원", "값" 표현을 사용하지 않습니다.

## 주요 측정기준 (Dimensions)

| API 이름 | 한국어 | 설명 |
|----------|--------|------|
| `pagePath` | 페이지 경로 | URL 경로 (/insights/my-post) |
| `pageTitle` | 페이지 제목 | HTML title 태그 값 |
| `sessionDefaultChannelGroup` | 기본 채널 그룹 | Organic Search, Direct, Social 등 |
| `sessionSource` | 세션 소스 | google, naver, direct 등 |
| `sessionMedium` | 세션 매체 | organic, cpc, referral 등 |
| `country` | 국가 | South Korea, United States 등 |
| `city` | 도시 | Seoul, Busan 등 |
| `deviceCategory` | 기기 카테고리 | desktop, mobile, tablet |
| `date` | 날짜 | YYYYMMDD 형식 |
| `newVsReturning` | 신규/재방문 | new, returning |

## 주요 측정항목 (Metrics)

| API 이름 | 한국어 | 설명 |
|----------|--------|------|
| `sessions` | 세션 | 방문 수 |
| `totalUsers` | 총 사용자 | 고유 사용자 수 |
| `newUsers` | 신규 사용자 | 첫 방문 사용자 |
| `screenPageViews` | 페이지뷰 | 조회 수 |
| `engagementRate` | 참여율 | 참여 세션 / 전체 세션 (0~1) |
| `averageSessionDuration` | 평균 세션 시간 | 초 단위 |
| `bounceRate` | 이탈률 | 1 - 참여율 |
| `sessionsPerUser` | 사용자당 세션 | 평균 방문 빈도 |
| `eventsPerSession` | 세션당 이벤트 | 세션 내 평균 이벤트 수 |
| `conversions` | 전환 | 전환 이벤트 수 |

## 기본 채널 그룹 한국어

| 채널 | 한국어 | 설명 |
|------|--------|------|
| Organic Search | 자연 검색 | Google, Naver 등 검색 엔진 |
| Direct | 직접 유입 | URL 직접 입력 또는 북마크 |
| Referral | 추천 | 외부 사이트 링크 |
| Organic Social | 자연 소셜 | SNS 무료 게시물 |
| Paid Search | 유료 검색 | 검색 광고 (Google Ads 등) |
| Paid Social | 유료 소셜 | SNS 광고 (Meta Ads 등) |
| Email | 이메일 | 뉴스레터 등 |
| Display | 디스플레이 | 배너 광고 |

## CLI 스크립트 사용법

```bash
# 빠른 요약
npx tsx scripts/ga4-report.ts --mode quick --days 30

# 상위 페이지
npx tsx scripts/ga4-report.ts --mode top-pages --days 30 --limit 10

# 트래픽 소스
npx tsx scripts/ga4-report.ts --mode traffic-sources --days 7

# 콘텐츠 성과 (GA4 + DB 교차)
npx tsx scripts/ga4-report.ts --mode content-perf --days 30

# 카테고리별 통계
npx tsx scripts/ga4-report.ts --mode category-stats --days 30

# JSON 출력 (프로그래매틱 사용)
npx tsx scripts/ga4-report.ts --mode quick --days 30 --format json
```
