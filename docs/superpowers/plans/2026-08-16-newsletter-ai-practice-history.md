# Newsletter and AI-Practice Integration Implementation Plan

> **For implementers:** Execute the tasks in order, keeping each change small and testable. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** AI 시대를 준비하려는 구독자에게 꾸준한 자신감과 실행 가능한 도움을 제공하는 뉴스레터 시스템을 구축한다.

**Architecture:** 스티비는 발송과 자동 온보딩을 담당하고, Neon은 구독자와 참여 기록의 원장으로 사용한다. 블로그는 설명과 검색 유입을 담당하고, AI-Practice는 실제로 따라 해볼 수 있는 실습 공간으로 연결한다. 가입 시에는 이메일과 동의만 받고, 웰컴 메일의 관심 주제 클릭으로 개인화를 시작한다.

**Tech Stack:** Next.js App Router, TypeScript, Neon Postgres, Drizzle ORM(기존 프로젝트 패턴 확인 후 적용), 스티비 API·웹훅·자동 이메일, GA4/GTM, Resend(매직링크 인증이 필요할 때).

---

## 0. 이 문서의 성격과 기준

이 문서는 2026-08-16까지 대화에서 확정한 결정, 보류한 결정, 구현 현황을 한곳에 모은 실행 기준이다. 기존 `docs/newsletter-plan.md`의 초안과 충돌하는 항목은 이 문서의 최신 결정을 따른다.

구독자에게 공개하는 문장에서는 내부 설계 비유인 운동, 코치, 헬스장, 교재, 인바디를 사용하지 않는다. 이메일은 차분하게 AI 변화와 활용 방법을 설명하는 뉴스레터로 보인다.

## 1. 결정 히스토리

### 1.1 문제 정의

- 검색으로 들어온 방문자가 글을 한 번 읽고 떠나는 현상이 두드러진다.
- Direct/none 비중이 늘어 반복 방문자가 생길 가능성은 확인됐다.
- 검색 유입에만 의존하지 않고, 직접 다시 찾아오는 유입 파이프라인이 필요하다.
- 뉴스레터는 일회성 트렌드 요약이 아니라, 흥미를 유지하면서 실제 사용까지 이어지게 해야 한다.

### 1.2 대상과 약속

대상은 AI 시대가 겁나지만 준비하고 싶은 사람이다. 뉴스레터를 읽은 뒤 다음 감정을 갖는 것이 목표다.

> “그래도 내가 적당히 잘 따라가고 있고, 여기 도움을 받았구나.”

따라서 매 호는 결론을 먼저 주고, 독자가 바로 확인할 수 있는 작은 선택이나 사례를 하나 제공한다. 긴 설명보다 핵심과 다음 행동이 먼저 보여야 한다.

### 1.3 서비스 역할 구분

내부 운영 구조는 다음처럼 확정했다.

| 채널 | 내부 역할 | 구독자에게 보이는 형태 |
|---|---|---|
| 이메일 | 코치 역할 | 다음에 읽을 내용과 바로 적용할 방법을 안내하는 뉴스레터 |
| 블로그 | 교재 역할 | 검색 가능한 배경 설명과 상세 해설 |
| AI-Practice | 헬스장 역할 | 브라우저에서 직접 따라 하는 실습 환경 |

위 표현은 내부 기획용이며 구독자-facing 카피에는 노출하지 않는다.

### 1.4 참여 방식

뉴스레터 안에서 참여는 가능해야 한다. 첫 단계는 별도 가입 폼이 아니라 웰컴 메일의 관심 주제 링크 클릭이다.

- 클릭 링크는 `goal`과 구독자 식별자를 가진다.
- 착지 API가 클릭을 Neon에 저장하고, 다음 메일 순서를 정하는 데 사용한다.
- 사용자는 답장을 보내도 된다. 링크 선택지가 맞지 않는 경우를 위한 대체 경로다.
- 초기 링크는 `CHECKIN_TOKEN` 자리표시자를 사용하며, Neon 연동 후 구독자별 일회용 서명 토큰을 스티비 사용자 정의 필드로 주입한다.

### 1.5 데이터베이스 결정

기존 Neon 연결은 유지한다. 현재 연결은 `.env.local`과 Vercel 환경에 있으며 읽기 전용 진단 결과 DB 크기는 약 10.03MB, 기존 테이블은 콘텐츠·SEO·LinkedIn 관련 15개다. 현재 애플리케이션 코드에서는 DB를 실질적으로 사용하지 않는다.

구독자 DB는 같은 Neon 인스턴스에 붙인다. 기존 테이블은 실제 사용처와 마이그레이션 상태를 다시 확인한 뒤, 사용하지 않는 것이 확정되었을 때만 삭제한다. 삭제와 뉴스레터 테이블 생성은 별도 마이그레이션으로 남겨 복구 가능성을 확보한다.

### 1.6 비용 결정

주 300~400명에게 한 번씩 보내고 웰컴·온보딩 메일을 추가해도 스티비 과금 기준은 발송 횟수가 아니라 유효 구독자 수다. 500명 이하라면 스탠다드 월 8,900원 구간에서 발송·자동 이메일을 사용할 수 있다. 따라서 먼저 8,900원 결제 후 API 키와 웹훅을 확인하고, 결제 전에는 설계와 카피를 보완한다.

### 1.7 1차 범위와 후속 범위

1차 범위는 구독, 웰컴 메일, 관심 주제 체크인, Neon 저장, 온보딩 발송까지다. AI-Practice 실습 잠금과 Resend 매직링크 로그인은 이 계획에서 구현하지 않고 후속 단계로 둔다. 로그인 단계가 필요해지면 기존 `auth_token` 개념을 `newsletter_tokens`와 분리된 인증 세션 설계로 다시 검토한다.

## 2. 현재 구현 현황

### 완료

- 뉴스레터 전략의 대상, 목표 감정, 채널 역할을 합의했다.
- 스티비 구독 페이지와 뉴스레터 CTA는 이미 배포되어 있다. CTA 위치는 내비, 모바일 내비, 글 하단, 홈, 푸터 및 AI-Practice 완료 화면이다.
- `click_newsletter` 이벤트는 GTM v12에서 이미 게시되어 있다. 현재는 `location`을 수집하며, 이후 캠페인·목표 매개변수를 추가할 때 기존 태그를 확장한다.
- Neon 연결과 기존 테이블 규모를 읽기 전용으로 확인했다.
- 스티비 스탠다드의 대략적인 비용과 자동 이메일 사용 조건을 검토했다.
- 웰컴 메일 초안을 만들었다.
- 웰컴 메일을 AI-Practice의 미니멀 다크 디자인으로 다시 작성했다.
- 최신 웰컴 메일은 표 레이아웃과 인라인 스타일만 사용한다.
- AI-Practice의 검은 배경, 얇은 카드 선, 하늘색·보라색·분홍색·노란색 리본을 이메일 호환 방식으로 번역했다.
- `npm run check:prose -- docs/newsletter/drafts/day0-welcome.html` 통과.
- 문학적 표현 검사 통과.
- 금지 태그, em dash, middle dot 검사를 통과했다.
- 브라우저와 Chrome headless 렌더링으로 시각 확인했다.

### 아직 구현하지 않은 것

- 스티비 결제, API 키 발급, 사용자 정의 필드 생성
- Neon 뉴스레터 스키마와 마이그레이션
- 웰컴 메일 링크의 착지 API와 참여 저장
- 스티비 사용자별 토큰 메일머지 연결
- 구독자 동기화 웹훅
- 자체 구독 폼 또는 현재 스티비 폼과의 데이터 연결
- 온보딩 자동 이메일 실제 등록
- 정기 뉴스레터 발송 템플릿과 성과 대시보드
- 기존 Neon 미사용 테이블의 삭제 여부 확정

## 3. 파일 구조와 책임

### 현재 파일

- `docs/newsletter-plan.md`: 기존 전체 계획. 이 문서가 최신 결정의 기준이 되면 내용을 갱신한다.
- `docs/newsletter/drafts/day0-welcome.html`: 구독 직후 발송할 웰컴 메일 초안.
- `docs/newsletter/drafts/day1-mission.html`: 기존 온보딩 초안. 카피와 데이터가 최신 전략에 맞는지 다시 검토한다.
- `docs/newsletter/drafts/day2-metrics.html`: 기존 온보딩 초안. 가상 수치 사용 여부를 확인한다.
- `docs/newsletter/drafts/day3-bounce.html`: 기존 온보딩 초안. 가상 진행률 카드 제거 여부를 확인한다.
- `src/app/ai-practice/ai-practice.css`: AI-Practice의 디자인 토큰과 카드 규칙의 원본.

### 앞으로 만들 파일

- `drizzle/` 또는 프로젝트의 기존 마이그레이션 경로: Neon 뉴스레터 테이블 변경 이력.
- `src/app/api/newsletter/check-in/route.ts`: 웰컴 메일 클릭을 검증하고 참여를 저장하는 API.
- `src/app/api/stibee/webhook/route.ts`: 구독·정보변경·수신거부 이벤트 동기화.
- `src/lib/newsletter/`: 구독자, 체크인, 토큰 저장 로직의 작은 모듈.
- `src/app/newsletter/check-in/page.tsx`: 링크 클릭 후 결과와 다음 콘텐츠를 보여주는 착지 화면.
- `docs/newsletter/drafts/day7-summary.html`: 첫 주를 마무리하는 온보딩 메일.

## 4. 구현 작업

### Task 1: 스티비 계정과 필드 계약 확정

**Files:**
- Modify: `docs/newsletter-plan.md`
- Create: `docs/newsletter/stibee-field-contract.md`

- [ ] 스티비 스탠다드 결제 후 API 키와 구독자 목록 ID를 확보한다.
- [ ] 가입 시 수집할 필드는 `email`, `consent_version`, `consented_at`으로 고정한다. 이름은 가입 폼에서 받지 않으며, 필요할 때 별도 프로필 단계에서 검토한다.
- [ ] 시스템 필드는 `goal`, `signup_source`, `stibee_id`, `welcome_token`으로 정의한다. 스티비에는 `welcome_token`의 서명된 값만 넣고, Neon에는 토큰 원문이 아닌 해시만 저장한다.
- [ ] `goal`의 허용값을 `ai-flow`, `ai-work`, `content-marketing`, `build-automation`으로 고정한다.
- [ ] API로 테스트 구독자를 추가했을 때 확인 메일과 자동 이메일 트리거가 어떻게 동작하는지 확인한다.
- [ ] 실제 설정값과 확인 결과를 `docs/newsletter/stibee-field-contract.md`에 기록한다.

### Task 2: Neon 스키마와 기존 테이블 정리 기준 확정

**Files:**
- Create: 프로젝트의 기존 Drizzle 마이그레이션 경로에 뉴스레터 마이그레이션
- Create: `src/lib/newsletter/schema.ts` 또는 기존 스키마 파일의 뉴스레터 영역
- Create: `docs/newsletter/neon-inventory.md`

- [ ] 기존 테이블별 마지막 사용 코드와 마이그레이션을 읽기 전용으로 확인한다.
- [ ] 삭제 대상과 보존 대상을 목록으로 분리한다.
- [ ] 사용자 확인 없이 기존 테이블을 삭제하지 않는다.
- [ ] 아래 세 테이블을 최소 구조로 만든다.

| 테이블 | 핵심 컬럼 |
|---|---|
| `newsletter_subscribers` | email, status, signup_source, consented_at, consent_version, stibee_id, goal |
| `newsletter_checkins` | subscriber_id 또는 email, goal, campaign, clicked_at, user_agent_hash |
| `newsletter_tokens` | token_hash, subscriber_id, purpose, expires_at, used_at |

기존 `docs/newsletter-plan.md`의 개념명인 `subscriber`와 `survey_answer`는 각각 이 문서의 `newsletter_subscribers`, `newsletter_checkins`로 매핑한다. `auth_token`은 후속 매직링크 로그인용 개념으로 보류하며, 1차 웰컴 체크인 전용인 `newsletter_tokens`와 분리한다. 실제 테이블명은 첫 마이그레이션 전에 프로젝트의 기존 명명 규칙을 확인해 한 번만 확정하고, 이후 이름을 바꾸지 않는다.

- [ ] 이메일은 정규화해 unique 제약을 둔다.
- [ ] 수신거부와 삭제를 보존할 수 있도록 status와 시각 컬럼을 둔다.
- [ ] `package.json`과 기존 DB 설정에서 실제 마이그레이션 도구와 명령을 확인한 뒤, 존재하는 명령만 문서화하고 실행한다. 현재 `npm run db:generate` 스크립트는 없다.

### Task 3: 웰컴 메일 체크인 API 만들기

**Files:**
- Create: `src/app/api/newsletter/check-in/route.ts`
- Create: `src/lib/newsletter/check-in.ts`
- Create: `src/app/newsletter/check-in/page.tsx`
- Test: 프로젝트의 API 테스트 경로에 체크인 테스트

- [ ] `goal` 허용값과 캠페인 값을 서버에서 검증한다.
- [ ] 이번 1차 구현은 로그인 쿠키 없이 구독자별 일회용 서명 토큰을 사용한다. 구독자 생성 시 토큰 원문은 한 번만 만들고 해시만 Neon에 저장하며, 스티비 사용자 정의 필드에는 서명된 URL용 값만 넣는다.
- [ ] 토큰은 URL·로그·리퍼러에 오래 남지 않도록 착지 후 즉시 폐기하고, 페이지 주소에서 제거한다.
- [ ] 토큰 만료·재사용을 거절한다. 비토큰 검토용 링크는 화면만 표시하고 저장하지 않는다.
- [ ] 유효한 클릭을 `newsletter_checkins`에 idempotent하게 저장한다.
- [ ] 구독자의 현재 `goal`을 갱신하되 같은 클릭을 중복 집계하지 않는다.
- [ ] 착지 화면에는 선택이 저장되었다는 사실과 다음 메일 예고만 보여준다.
- [ ] API 테스트를 실행해 허용 goal, 잘못된 goal, 만료 토큰, 중복 클릭을 각각 검증한다.

### Task 4: 웰컴 메일과 스티비 자동 이메일 연결

**Files:**
- Modify: `docs/newsletter/drafts/day0-welcome.html`
- Modify: `docs/newsletter/stibee-field-contract.md`

- [ ] `CHECKIN_TOKEN`을 스티비에서 사용할 실제 치환 방식으로 교체한다.
- [ ] 구독자 추가 또는 동기화 시 토큰을 먼저 생성하고, 토큰 필드가 채워진 뒤 자동 이메일을 발송하도록 순서를 확인한다.
- [ ] 링크가 HTTPS 착지 API로 이동하는지 테스트한다.
- [ ] 스티비 자동 이메일 트리거를 구독자 추가, 즉시 발송으로 설정한다.
- [ ] 테스트 구독자 한 명으로 메일 수신, 링크 이동, Neon 저장을 end-to-end 확인한다.
- [ ] HTML 금지 태그·금지 문장 검사와 Chrome 렌더링 검사를 다시 실행한다.

### Task 5: 구독자 수집과 웹훅 동기화

**Files:**
- Create: `src/app/api/subscribe/route.ts` 또는 기존 구독 라우트
- Create: `src/app/api/stibee/webhook/route.ts`
- Create: `src/lib/newsletter/stibee.ts`
- Modify: 실제 CTA와 구독 페이지 컴포넌트

- [ ] 가입 순간에는 이메일과 필수 동의만 받는다.
- [ ] 동의 문구 버전과 시각을 Neon에 저장한다.
- [ ] 스티비 구독자 API와 Neon 원장을 같은 요청에서 동기화한다.
- [ ] 웹훅의 구독, 정보변경, 수신거부, 삭제 이벤트를 검증하고 멱등 처리한다.
- [ ] 웹훅 재시도에도 중복 레코드가 생기지 않는지 테스트한다.

### Task 6: 온보딩과 정기호 운영 체계 확정

**Files:**
- Modify: `docs/newsletter/drafts/day1-mission.html`
- Modify: `docs/newsletter/drafts/day2-metrics.html`
- Modify: `docs/newsletter/drafts/day3-bounce.html`
- Create: `docs/newsletter/drafts/day7-summary.html`
- Create: `docs/newsletter/editorial-calendar.md`

- [ ] 기존 초안의 가상 정답률·진행률을 실제 데이터 또는 예시임을 밝힌 문장으로 바꾼다.
- [ ] `day1-mission.html`부터 `day3-bounce.html`까지의 기존 GA4 교육 중심 초안은 최신 AI 뉴스레터 전략에 맞춰 재작성한다. GA4 예시는 AI 업무와 연결되는 경우에만 남기고, 기존 수치와 미션을 그대로 온보딩에 등록하지 않는다.
- [ ] 내부 운동 비유가 구독자 문장에 남아 있지 않은지 검사한다.
- [ ] 각 메일은 결론, 한 가지 적용 방법, 다음 행동 순서를 유지한다.
- [ ] 온보딩은 구독 직후, 1일차, 3일차, 7일차 흐름으로 스티비에 등록한다.
- [ ] 정기호는 주 1회로 시작한다. 제작 부담이 커져 격주로 바꿀 경우 편집 캘린더와 구독자 안내 문구를 함께 갱신한다.
- [ ] 각 호의 고정 코너를 정한다: 이번 호 핵심, 참여 링크, 지난 참여 결과, 자세한 설명 링크.

### Task 7: 측정과 개선 루프 구축

**Files:**
- Modify: GA4/GTM 이벤트 정의 문서
- Create: `docs/newsletter/measurement-plan.md`
- Modify: 관련 CTA 컴포넌트

- [ ] 이미 게시된 `click_newsletter`의 `location` 수집을 회귀 검증한다.
- [ ] 웰컴 메일 링크 클릭에는 campaign과 goal을 별도 이벤트 매개변수로 추가한다.
- [ ] 웰컴 메일 링크 클릭, 체크인 저장, 착지 완료를 각각 구분한다.
- [ ] 스티비 오픈율·클릭률과 Neon 참여율을 주간 단위로 비교한다.
- [ ] 구독 지점별 전환과 목표별 선택 분포를 확인한다.
- [ ] 첫 4주 후 제목, 선택지, 발송 간격을 한 번에 하나씩 개선한다.

## 5. 검증 기준

### 카피와 디자인

- `npm run check:prose -- <파일>`에서 HARD 0, SOFT 0.
- 문학적 표현 검사에서 HARD 0.
- em dash `—`, middle dot `·`, 금지 태그가 없다.
- 네이버 메일을 포함한 제한된 이메일 클라이언트를 고려해 테이블과 인라인 스타일만 사용한다.
- 내부 역할 비유가 최종 HTML에 노출되지 않는다.

### 데이터와 보안

- 같은 클릭을 여러 번 눌러도 참여가 한 번만 집계된다.
- 만료·재사용 토큰은 저장되지 않는다.
- 웹훅 재시도는 멱등 처리된다.
- 수신거부 후 자체 DB status가 스티비와 일치한다.
- 로그와 분석 이벤트에 원문 이메일을 불필요하게 남기지 않는다.

### 운영

- 테스트 구독자 한 명으로 구독, 웰컴 메일, 관심 주제 클릭, Neon 저장, 후속 메일을 확인한다.
- 300~400명 발송 시 스티비 구간과 예상 비용을 월별로 기록한다.
- 정기호 발송 전 링크, 수신거부, 모바일 렌더링을 체크리스트로 검사한다.

## 6. 실행 순서와 다음 작업

1. 스티비 결제 후 필드·API 동작을 확인한다.
2. Neon 기존 테이블 인벤토리를 문서화하고 뉴스레터 마이그레이션을 만든다.
3. 체크인 API와 착지 화면을 구현한다.
4. 웰컴 메일의 실제 토큰을 연결한다.
5. 구독·웹훅 동기화를 구현한다.
6. 온보딩 초안을 최신 카피와 실제 측정 방식에 맞게 보완한다.
7. GA4/GTM 측정과 4주 운영 리뷰를 시작한다.

현재 가장 작은 다음 작업은 Task 1이다. 결제 전에는 API 코드를 만들기보다, 스티비 필드 계약과 체크인 URL 규칙을 먼저 확정한다. 기존 CTA와 `click_newsletter`는 이미 배포된 기반으로 보고 회귀만 확인한다.

## 참고 파일

- `docs/newsletter-plan.md`
- `docs/newsletter/drafts/day0-welcome.html`
- `src/app/ai-practice/ai-practice.css`
- `src/app/ai-practice/page.tsx`
- `docs/content-exposure-strategy.md`
- `docs/content-seo-strategy.md`
