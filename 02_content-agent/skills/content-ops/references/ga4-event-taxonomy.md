# GA4 이벤트 분류표 (블로그 이상적 구성)

블로그에 최적화된 GA4 이벤트 분류표입니다. GTM Inspector 에이전트가 현재 구현 상태를 이 분류표와 비교하여 갭을 분석합니다.

## 이벤트 분류

### 자동 수집 (GA4 Enhanced Measurement)

| 이벤트 | 설명 | 설정 위치 |
|--------|------|----------|
| `page_view` | 페이지 조회 | GA4 자동 |
| `scroll` | 90% 스크롤 | GA4 Enhanced Measurement |
| `click` (outbound) | 외부 링크 클릭 | GA4 Enhanced Measurement |
| `session_start` | 세션 시작 | GA4 자동 |
| `first_visit` | 첫 방문 | GA4 자동 |
| `user_engagement` | 참여 | GA4 자동 |

### 콘텐츠 조회 (커스텀)

| 이벤트 | 파라미터 | 설명 |
|--------|---------|------|
| `view_content` | `content_type`, `content_id`, `content_title`, `content_category` | 콘텐츠 상세 조회 |

콘텐츠 타입별 `content_type` 값: `post`, `faq`, `class`, `log`

### 내비게이션 (커스텀)

| 이벤트 | 파라미터 | 설명 |
|--------|---------|------|
| `click_navigation` | `link_text`, `link_url`, `navigation_type` | 내비게이션 클릭 |

`navigation_type` 값: `nav`, `footer`, `sidebar`, `breadcrumb`

### 참여 (커스텀)

| 이벤트 | 파라미터 | 설명 |
|--------|---------|------|
| `quiz_interaction` | `content_type`, `content_id`, `action`, `is_correct` | 퀴즈 답변/재시도 |
| `content_engagement` | `content_type`, `content_id`, `engagement_time_msec` | 콘텐츠 체류 |
| `click_related_content` | `source_content_id`, `target_content_id`, `related_type` | 관련 콘텐츠 클릭 |
| `share` | `method`, `content_type`, `content_id` | SNS 공유 |
| `click_expand` | `content_title` | 포커스 레이아웃 확장 |

`quiz_interaction.action` 값: `answer`, `retry`

### 검색 (Enhanced Measurement)

| 이벤트 | 파라미터 | 설명 |
|--------|---------|------|
| `search` | `search_term` | 사이트 내 검색 (Enhanced Measurement로 자동 수집 가능) |

## 파라미터 네이밍 규칙

- **snake_case** 사용 (GA4 권장)
- 이벤트명도 **snake_case**
- 한국어 값 허용 (카테고리명 등)
- `content_type`, `content_id`는 모든 콘텐츠 관련 이벤트에 공통 포함

## 콘텐츠 그룹 매핑

| URL 패턴 | content_group |
|----------|---------------|
| `/insights/*` | Insights |
| `/faq/*` | FAQ |
| `/class/*` | Class |
| `/logs/*` | Logs |
| `/series/*` | Series |
| `/tags/*` | Tags |
| `/about*` | About |
| `/` | Home |

## GTM 컨테이너 권장 사항

- 컨테이너 ID는 환경 변수(`NEXT_PUBLIC_GTM_ID`)로 관리
- `<script>` 전략: `afterInteractive` (Next.js 권장)
- `<noscript>` 폴백: `<body>` 직후 배치
- Consent Mode v2: `default` 상태에서 `denied` → 동의 후 `granted`로 업데이트

## 타입 안전성 권장 구조

```typescript
// gtm.ts에 타입 정의 추가 권장
type GA4Event =
  | { event: 'view_content'; content_type: string; content_id: string; content_title: string; content_category: string }
  | { event: 'click_navigation'; link_text: string; link_url: string; navigation_type: 'nav' | 'footer' | 'sidebar' }
  | { event: 'quiz_interaction'; content_type: string; content_id: string; action: 'answer' | 'retry'; is_correct?: boolean }
  | { event: 'share'; method: string; content_type: string; content_id: string };
```
