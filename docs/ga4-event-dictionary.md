# GA4 이벤트, 매개변수 사전

hongblog(GTM-5H3Z6ZLZ, GA4 G-ZR3B2C2QG1)의 이벤트 수집 체계를 관리하는 기준 문서다.
새 이벤트나 매개변수를 추가하기 전에 반드시 이 문서를 먼저 확인하고, 변경 후에는 이 문서를 갱신한다.

- 기준 시점: 2026-08-05, GTM 라이브 버전 v12 (newsletter-cta-tracking)
- GTM 컨테이너: 준이아빠블로그 `GTM-5H3Z6ZLZ` (accounts/6334092009/containers/240704263)
- 전송 함수: `src/lib/gtm.ts`의 `sendGAEvent(eventName, params)` (dataLayer.push)

## 네이밍 규칙

| 규칙 | 내용 |
|------|------|
| 이벤트명 | `view_` (조회), `click_` (클릭), 도메인 접두어(`aipbl_`) + snake_case |
| 콘텐츠 슬러그 | `content_id` (kebab-case 슬러그, 접두어 없이) |
| 콘텐츠 제목 | `content_name` (dataLayer 키도 `content_name`으로 통일. `content_title` 금지) |
| 콘텐츠 유형 | `content_type` (`insight`, `class`, `faq`, `log`, `ai_practice` 등) |
| 서수(몇 번째) | `position` (목록 위치, 미션 순서, 문항 번호 등 문맥 내 서수는 모두 이 하나로) |
| UI 요소 이름 | `button_name` (버튼, 메뉴 등 클릭한 요소의 이름) |
| 컨테이너 슬러그 | `course_slug` (코스, 트랙처럼 콘텐츠를 묶는 부모의 슬러그) |
| 공유 | GA4 권장 이벤트 `share`의 표준 매개변수(`method`, `content_type`, `item_id`)를 그대로 쓴다. `item_id`는 `content_id`와 같은 값이지만 GA4 표준을 따르는 의도적 예외다 |

## GTM 컨테이너 컨벤션

- 태그: `GA4 - Event - {그룹명}` 그룹 태그 1개에 이벤트명 `{{Event}}` + 트리거 여러 개 연결
- 트리거: 이벤트당 맞춤 이벤트 트리거 1개, 이름 `Event - {이벤트명}`
- 변수: 데이터 영역 변수 `DLV - {매개변수명}` (매개변수명과 dataLayer 키를 일치시킨다)
- 매개변수 없는 이벤트는 "GA4 - Event - 매개변수 없는 이벤트" 태그에 트리거만 추가

## 매개변수 사전

| 매개변수 | 의미 | 쓰는 이벤트 | GA4 맞춤 측정기준 |
|----------|------|------------|------------------|
| `content_id` | 콘텐츠 슬러그 | view_*, related_*, click_main_*, quiz_*, aipbl 계열, click_curriculum, click_resume_learning | 등록 확인 필요 |
| `content_name` | 콘텐츠 제목 | content_id와 동일 + click_expand, share | 등록 확인 필요 |
| `content_type` | 콘텐츠 유형 | quiz_answer, quiz_retry, share | 등록 확인 필요 |
| `position` | 문맥 내 서수 (목록 위치, 미션 순서, 문항 번호) | click_aipractice_start, click_curriculum, aipbl_mission_complete, quiz_answer | 등록됨 |
| `button_name` | 클릭한 UI 요소 이름 | click_expand_btn, click_aipractice_start | 등록 확인 필요 |
| `menu_name` | 메뉴 이름 (기존 이력 유지, 신규 이벤트는 button_name 사용) | click_nav, click_footer | 등록 확인 필요 |
| `mission_name` | AIPBL 미션 식별자 (role, context, format 등) | aipbl_mission_complete | 등록됨 |
| `quiz_score` | 점검 퀴즈 점수 | aipbl_complete | 등록됨 |
| `selected_option` | 퀴즈에서 고른 보기 인덱스 | quiz_answer | 등록 확인 필요 |
| `is_correct` | 퀴즈 정답 여부 | quiz_answer | 등록 확인 필요 |
| `method` | 공유 채널 (kakao, link_copy 등) | share | 등록됨 |
| `item_id` | 공유한 콘텐츠 슬러그 (GA4 표준) | share | 등록됨 |
| `share_transport` | 공유 실행 방식 | share | 등록됨 |
| `course_slug` | 코스(컨테이너) 슬러그 | click_curriculum, click_resume_learning | 등록됨 |
| `is_new_course` | 이어보기 대상이 새 코스인지 | click_resume_learning | 등록됨 |
| `scroll_depth` | 스크롤 도달 비율 | scroll | 등록 확인 필요 |
| `resume_from` | AIPBL 이어하기 시작 지점 (mission, quiz) | aipbl_start | 등록됨 |
| `location` | CTA가 클릭된 위치 (nav, nav_mobile, post_bottom, home, footer) | click_newsletter | 등록됨 (CTA 위치) |

폐기된 매개변수 (v10에서 position으로 통합, 새 이벤트에 사용 금지): `mission_index`, `question_index`.
GA4 측정기준은 과거 조회를 위해 남겨 두었다.

## 이벤트 사전 (GTM 태그 그룹 기준)

### GA4 - Event - 콘텐츠 관련 이벤트
`content_id`, `content_name`

view_insights, view_class, view_faq, view_life, view_logs, view_tag, view_about,
related_insights, related_classes, related_faqs, related_logs,
view_aipractice_promo, close_aipractice_promo (AI-Practice 유도 팝업 노출과 닫기.
content_id는 팝업이 뜬 글의 슬러그. 전송: `AiPracticePromo.tsx`.
CTA 클릭은 click_aipractice_start에 button_name "content_popup",
퀴즈 풀이 후 이동 배너 클릭은 button_name "quiz_banner"로 수집)

### GA4 - Event - 메인이벤트 관련
`content_id`, `content_name`

click_main_trendingnow, click_main_browsebycategory, click_main_latestinsights,
click_main_latestlogs, click_main_popularfaqs

### GA4 - Event - 매개변수 없는 이벤트
view_insights_list, view_class_list, view_faq_list, view_life_list, view_logs_list,
view_series_list, view_tags_list, view_category_list, view_ai_practice_list

### GA4 - Event - 메뉴 클릭
`menu_name` (button_name으로 통합 예정)

click_nav, click_footer
(커뮤니티 입장하기 버튼은 menu_name "Community"로 이 그룹에서 수집. 전송: `Nav.tsx`, `Footer.tsx`)

### GA4 - Event - 뉴스레터
`location`

click_newsletter (스티비 구독 페이지로 나가는 뉴스레터 CTA 클릭.
location 값: nav, nav_mobile, post_bottom, home, footer.
전송: `NewsletterCta.tsx`, `Nav.tsx`)

### GA4 - Event - 퀴즈 관련
`content_id`, `content_type`, `content_name`, `is_correct`, `selected_option`, `position`

quiz_answer, quiz_retry (전송: `ContentQuiz.tsx`, `ai-practice/lab/QuizPhase.tsx`)

### GA4 - Event - AI실습 관련
`content_id`, `content_name`, `button_name`, `position`, `mission_name`, `quiz_score`, `resume_from`

view_ai_practice, click_aipractice_start, aipbl_start, aipbl_mission_complete,
aipbl_complete, aipbl_restart, click_copy_template
(전송: `ViewTracker.tsx`, `ai-practice/EventLink.tsx`, `ai-practice/lab/LabShell.tsx`, `WrapPhase.tsx`)

### GA4 - Event - 코스 관련
`course_slug`, `content_id`, `content_name`, `position`, `is_new_course`

click_curriculum, click_resume_learning
(전송: `CourseCurriculumPanel.tsx`, `ResumeLearningCard.tsx`)

### GA4 - Event - 공유
`method`, `content_type`, `item_id`, `share_transport`, `content_name`

share (전송: `ShareBar.tsx`)

### GA4 - Event - 확장버튼 클릭 / 도움 말풍선
click_expand, click_compress (`content_name`), click_expand_btn (`button_name`)
(전송: `ContentFocusLayout.tsx`, `FocusGuideBubble.tsx`)

### GA4 - Event - 스크롤
scroll (`scroll_depth`)

## 새 이벤트 추가 절차

1. 이 문서의 매개변수 사전에서 재사용할 매개변수가 있는지 먼저 확인한다. 새 매개변수는 정말 필요할 때만 만든다.
2. 코드에서 `sendGAEvent(이벤트명, 매개변수)` 추가 (dataLayer 키는 매개변수 사전의 이름 그대로).
3. GTM에 `Event - {이벤트명}` 트리거를 만들고, 매개변수 조합이 같은 기존 태그 그룹에 트리거만 연결한다. 조합이 다르면 새 그룹 태그를 만든다.
4. 새 매개변수가 생겼으면 `DLV - {이름}` 변수 추가 + GA4 이벤트 범위 맞춤 측정기준 등록.
5. GTM 미리보기로 dataLayer 값 확인 후 버전 게시.
6. 이 문서의 사전과 변경 이력을 갱신한다.

## 남은 확인 사항

1. GA4 초기 매개변수(content_id, content_name, content_type, menu_name, button_name, is_correct, selected_option, scroll_depth)의 맞춤 측정기준 등록 여부 확인.
2. menu_name → button_name 통합 여부 결정 보류 중 (기존 수집 이력과의 단절 때문에 현행 유지).

## 변경 이력

- 2026-07-31: v8 AI-Practice 이벤트 세팅, v9 퀴즈 태그 content_title → content_name 정정. GA4 이벤트 범위 맞춤 측정기준 10개 등록(mission_index, mission_name, quiz_score, question_index, position, course_slug, is_new_course, method, share_transport, item_id). 이 문서 최초 작성.
- 2026-07-31: v11 aipractice-promo-events 게시. AI 관련 인사이트, 클래스에서 50% 스크롤 시 노출되는 AI-Practice 유도 팝업 이벤트(view_aipractice_promo, close_aipractice_promo) 수집 추가. 두 트리거를 기존 콘텐츠 관련 태그에 연결 (새 매개변수 없음).
- 2026-08-05: v12 newsletter-cta-tracking 게시. 뉴스레터 CTA 이벤트 click_newsletter 수집 추가 (DLV - location 변수, Event - click_newsletter 트리거, GA4 - Event - 뉴스레터 태그). GA4 이벤트 범위 맞춤 측정기준 "CTA 위치"(location) 등록. 커뮤니티 입장하기 버튼(구 카카오톡 문의하기)은 기존 메뉴 클릭 태그에서 menu_name "Community"로 수집.
- 2026-07-31: v10 param-consolidation 게시. 서수 통합(mission_index, question_index → position), dataLayer 키 content_name 통일과 DLV - content_title 삭제, click_compress 트리거 추가, share 태그 content_name 추가, aipbl_start resume_from 매핑과 측정기준 등록, 미사용 addToCart 트리거 삭제. `sendGAEvent`가 dataLayer 큐를 직접 초기화하도록 수정해 GTM 로드 전 이벤트 유실 제거.
