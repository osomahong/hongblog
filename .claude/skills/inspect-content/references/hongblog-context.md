# hongblog 고유 맥락

이 스킬이 의존하는 블로그 특화 규칙 스냅샷. 원본이 변경되면 이 파일도 업데이트해야 한다.

## 사이트

- 도메인: `https://www.digitalmarketer.co.kr`
- 원본: `src/lib/constants.ts` `SITE_URL`
- Non-www → www 308 리디렉트는 middleware로 처리

## 콘텐츠 타입과 URL 패턴

| 타입 | 파일 경로 | URL |
|------|-----------|-----|
| insights | `content/insights/{slug}.md` | `/insights/{slug}` |
| classes | `content/classes/{slug}.md` | `/class/{courseSlug}/{slug}` |
| courses | `content/courses/{slug}.md` | `/course/{slug}` |

- FAQ, Log 타입은 현재 MD 파일이 없다. 향후 추가되면 이 파일에 반영한다
- classes는 항상 course에 소속되므로 URL에 `courseSlug`가 필요하다

## 카테고리

원본: `src/lib/constants.ts`의 `POST_CATEGORIES`, `CLASS_CATEGORIES`, `CATEGORY_LABELS`

| 타입 | 허용값 | 레이블 |
|------|--------|--------|
| insights | MARKETING | 마케팅 |
| insights | AI_TECH | AI·테크 |
| insights | DATA | 데이터 |
| classes | MARKETING | 마케팅 |
| classes | AI_TECH | AI·테크 |

프론트매터 `category` 값이 위 목록 밖이면 즉시 FAIL 처리한다.

## CANONICAL_TAGS 스냅샷

원본: `src/lib/constants.ts`의 `CANONICAL_TAGS`. 아래는 스냅샷이며 원본 변경 시 동기화 필요.

### metrics
- CPC, CPM, CTR, CVR, CPA, CAC, LTV, ROAS, ROI

### strategy
- 퍼널, 어트리뷰션, 전환, 리타게팅, 퍼포먼스마케팅, SEO

### tools
- GA4, GTM, BigQuery

### webTech
- HTML, CSS, JavaScript, React, DOM, API

### ai
- AI, 자동화, 노코드, 바이브코딩

### adPlatform
- Meta 광고, Google 광고

### data
- 데이터 분석, 데이터 추적

### general
- 마케팅 실무, 광고

### 전체 목록 (FLAT)

`CPC`, `CPM`, `CTR`, `CVR`, `CPA`, `CAC`, `LTV`, `ROAS`, `ROI`, `퍼널`, `어트리뷰션`, `전환`, `리타게팅`, `퍼포먼스마케팅`, `SEO`, `GA4`, `GTM`, `BigQuery`, `HTML`, `CSS`, `JavaScript`, `React`, `DOM`, `API`, `AI`, `자동화`, `노코드`, `바이브코딩`, `Meta 광고`, `Google 광고`, `데이터 분석`, `데이터 추적`, `마케팅 실무`, `광고`

점검 실행 시 `frontmatter.tags` 배열의 각 항목이 위 목록에 포함되는지 엄격히 매칭한다(대소문자 민감, 공백 포함).

### 금지 태그 휴리스틱

다음은 CANONICAL_TAGS에 있더라도 **추가로 금지**하는 패턴:

- 도구 고유명이 아닌 제품명: `Claude Code`, `n8n`, `Make`, `Zapier` 등 — 도구명은 본문에 언급하되 태그화하지 않음
- 대상자명: `마케터`, `비개발자`, `초보자` — 대상자는 태그가 아님
- 동일 개념 한/영 중복: `어트리뷰션`과 `Attribution`, `전환`과 `Conversion` 동시 사용 금지

위반 시 강제 FAIL.

## 디자인 시스템 관련 규칙 (본문)

Neo-Brutalism 디자인이지만 이 스킬은 디자인 점검은 하지 않는다. 다만 본문 내 이미지 마크다운 링크(`![alt](/path)`)의 alt 속성이 비어있으면 접근성 경고로 `low` severity에 기록한다.

## 한국어 톤

- 존댓말 기본(`~입니다`, `~합니다`)
- 국립국어원 맞춤법/띄어쓰기 기준
- 외래어 표기법 준수 (예: "컨텐츠" → "콘텐츠")
- 기술 용어는 업계 통용 표기 우선: "로그인"(O), "log in"(X)
- 동일 개념은 한글 또는 영어 하나로 통일: "어트리뷰션" 또는 "Attribution" 둘 중 하나만

본문에서 반말/존댓말 혼용이 발견되면 `low` severity로 보고한다.

## Sitemap 구조

- `sitemap/0.xml` — insights
- `sitemap/1.xml` — classes, courses, tags, 메인
- `lastmod`: `publishedAt` 값 사용. 기본값 `2025-01-01T00:00:00.000Z`는 제외

점검 대상 콘텐츠가 기본값 `publishedAt`을 가지고 있으면 `low` severity로 보고 (실제 발행일 업데이트 권장).

## 슬러그 규칙

- kebab-case 영어 (한글 금지)
- 중복 시 `-2`, `-3` 접미사
- 파일명과 frontmatter.slug가 반드시 일치해야 함 — 불일치 시 high severity

## 내부 링크 판정

`R-GEO-06` 실행 시 "내부 링크"로 인정되는 URL 패턴:

- `/insights/{slug}`
- `/class/{courseSlug}/{slug}`
- `/course/{slug}`
- `/tags/{tag}`
- `/category/{category}`

외부 도메인이거나 `digitalmarketer.co.kr` 도메인이라도 위 경로 패턴을 따르지 않으면 외부 링크로 분류(R-GEO-01의 출처 인용 카운트에 기여).

## 확장 시 주의

- 현재 FAQ/Log 타입은 비어있으므로 관련 규칙은 주석으로만 남겨둠. 실제 콘텐츠가 생기면 이 파일 + 각 rules 파일에 타입 예외를 추가
- `seriesSlug`/`seriesOrder` 시리즈는 소수 콘텐츠에만 사용됨 → 미사용이라고 페널티 주지 않음 (R-GEO-06에서만 보너스 요인)
