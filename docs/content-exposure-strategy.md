# 콘텐츠 내부 추천 전략

Class 코스 페이지의 검색 유입 한계를 내부 추천 지면으로 보완하는 실행 계획이다.
대상은 코스 8개, 클래스 77개, 인사이트 119개다.

- 작성일: 2026-08-12
- 관련 문서: `docs/ga4-event-dictionary.md`, `.claude/references/content/thumbnail-spec.md`

## 1. 현황 진단

| 지면 | 현재 상태 | 문제 |
|---|---|---|
| 메인 | Trending 4, 카테고리 3, 최신 글 6, 태그 | 코스로 가는 링크가 없다 |
| `/class` | 히어로, 목표별 시작점 7, 코스 카드 8, 전체 인덱스 | 진입 자체가 검색에 의존한다 |
| `/class/{course}` | 제목, 설명, 커리큘럼 목록 | 대표 이미지가 없어 배너로 쓸 자산이 없다 |
| 인사이트 본문 | 사이드바에 관련 개념 3, About 카드, 공유 | 한 화면에서 다음 목적지가 3개뿐이다 |
| 인사이트 하단 | 다음으로 읽어볼 글 4 | 인사이트끼리만 순환한다 |

코스 페이지로 들어오는 내부 경로가 `/class` 목록 하나뿐이다. 메인과 인사이트에서 코스로
넘어가는 길이 없어서 코스 8개가 사실상 고립돼 있다.

## 2. 전략 요약

노출 지면을 네 층으로 나눈다.

| 층 | 지면 | 노출 대상 | 목표 |
|---|---|---|---|
| 발견 | 메인 히어로 슬라이드 | 코스 8, 특집 인사이트 | 첫 화면에서 코스 존재를 알린다 |
| 탐색 | 메인 코스 캐러셀 | 코스 8 전체 | 목표별 선택지를 한 줄에 편다 |
| 체류 | 인사이트 사이드바 리스트 | 글 6, 개념 5, 코스 3 | 한 화면 노출량을 3개에서 14개로 늘린다 |
| 전역 | 내비게이션, 푸터, 태그 | 코스 8 | 모든 페이지에서 코스로 가는 링크를 만든다 |

## 3. Phase 0. 배너 자산 준비

### 3.1 파일 사양

| 용도 | 크기 | 경로 | 용량 상한 |
|---|---|---|---|
| 히어로 슬라이드 | 2400 x 1000 (2.4:1) | `public/banners/hero/{courseSlug}.webp` | 150KB |
| 캐러셀 카드 | 1200 x 630 (OG 비율) | `public/banners/card/{courseSlug}.webp` | 80KB |

### 3.2 제작 원칙

1. **이미지에 한글 텍스트를 넣지 않는다.** 제목과 설명은 HTML로 얹는다. 생성 모델의 한글
   렌더링이 불안정하고, 제목을 고칠 때마다 이미지를 다시 만들어야 하며, 텍스트가 이미지에
   묻히면 검색엔진이 읽지 못한다.
2. **히어로는 오른쪽 40%에만 그림을 둔다.** 왼쪽 60%는 단색 면으로 비워 두고 그 위에 제목,
   설명, 버튼을 올린다.
3. **카드는 가운데 정렬**로 만들고 사방 8% 여백을 확보한다. 카드 하단에 제목이 오버레이된다.
4. **PNG로 받아 WebP로 변환**한다. `cwebp -q 82 input.png -o output.webp` 기준이면 상한을
   맞춘다.
5. **next/image를 쓰지 않는다.** Vercel 이미지 최적화 과금을 피하려고 미리 최적화한 파일을
   `<img>`로 서빙한다. `next.config.ts` headers에 `/banners/:path*` 캐시 규칙을 추가한다.

### 3.3 디자인 토큰

코드에 실제로 쓰이는 값이다. `thumbnail-spec.md`의 빨강 표기(#FF0000)와 다르므로 배너는
아래 값을 기준으로 한다.

| 토큰 | 값 | 용도 |
|---|---|---|
| 배경 | #F3F3F3 | 화면 바탕 |
| 검정 | #000000 | 외곽선, 그림자 |
| 빨강 | #FF0033 | 강조, MARKETING |
| 노랑 | #FFD700 | AI_TECH |
| 파랑 | #0000FF | DATA |
| 보라 | #7C3AED | CLAUDE_EDUCATION |

### 3.4 이미지 생성 프롬프트

각 프롬프트는 히어로용이다. 카드용으로 쓸 때는 마지막 두 줄을 아래로 바꾼다.

```
Aspect ratio 1200:630. Centered composition, subject fills the middle 70% with even
margins on all four sides. No empty side panel.
```

공통 네거티브 프롬프트:

```
no text, no letters, no numbers, no words, no logos, no watermark, no korean characters,
no gradients, no soft shadows, no photorealism, no 3d render, no drop shadow blur,
no rounded corners, no human faces, no clutter
```

#### 3.4.1 claude-fundamentals (Claude 기초 교육)

```
Flat vector neo-brutalist illustration. Off-white #F3F3F3 background. A friendly boxy
robot assistant with a square head and simple dot eyes sits at a plain desk, one hand
raised in a greeting. Beside it float three stacked speech bubbles drawn as plain
rectangles with 10px solid black outlines and hard offset shadows in violet #7C3AED.
A small compass shape rests on the desk. Every shape has a uniform 10px black outline,
flat fill, zero corner radius, and a hard 12px offset shadow with no blur. Limited
palette: off-white, black, violet #7C3AED, one small accent of gold #FFD700.
Aspect ratio 2400:1000. The illustration occupies only the right 40% of the canvas.
The left 60% is a flat empty #F3F3F3 field with nothing but two small black squares
in the far corners.
```

#### 3.4.2 claude-in-practice (Claude 실무 활용)

```
Flat vector neo-brutalist illustration. Off-white #F3F3F3 background. A boxy robot hand
and a human hand pass a stack of plain rectangular documents between them. Around them
sit three flat office objects drawn as outlined rectangles: a calendar grid, an envelope,
and a bar chart with three bars. Every shape has a uniform 10px black outline, flat fill,
zero corner radius, and a hard 12px offset shadow with no blur. Limited palette:
off-white, black, violet #7C3AED, one small accent of gold #FFD700.
Aspect ratio 2400:1000. The illustration occupies only the right 40% of the canvas.
The left 60% is a flat empty #F3F3F3 field with nothing but two small black squares
in the far corners.
```

#### 3.4.3 claude-code-for-everyone (비개발자를 위한 Claude Code)

```
Flat vector neo-brutalist illustration. Off-white #F3F3F3 background. An open laptop
seen at a slight angle, its screen showing a plain black terminal window with three
horizontal bars and a solid rectangular cursor block. A boxy robot arm reaches into the
screen holding a wrench. Two flat gear shapes float above. Every shape has a uniform
10px black outline, flat fill, zero corner radius, and a hard 12px offset shadow with
no blur. Limited palette: off-white, black, violet #7C3AED, one small accent of
gold #FFD700.
Aspect ratio 2400:1000. The illustration occupies only the right 40% of the canvas.
The left 60% is a flat empty #F3F3F3 field with nothing but two small black squares
in the far corners.
```

#### 3.4.4 vibe-coding-basics (바이브코딩 기초지식)

```
Flat vector neo-brutalist illustration. Off-white #F3F3F3 background. Five plain blocks
stacked into a staircase, each block carrying one simple flat icon: a terminal prompt
mark, a branching line for version control, a key, a plug, and an upward arrow. A small
boxy rocket sits on the top block. Every shape has a uniform 10px black outline, flat
fill, zero corner radius, and a hard 12px offset shadow with no blur. Limited palette:
off-white, black, gold #FFD700, one small accent of red #FF0033.
Aspect ratio 2400:1000. The illustration occupies only the right 40% of the canvas.
The left 60% is a flat empty #F3F3F3 field with nothing but two small black squares
in the far corners.
```

#### 3.4.5 seo-fundamentals (검색엔진 최적화 기초)

```
Flat vector neo-brutalist illustration. Off-white #F3F3F3 background. A large flat
magnifying glass overlaps a plain browser window drawn as a rectangle with three small
squares in its title bar. Inside the window sit three stacked result rows as plain bars,
the top one filled solid red #FF0033. A small upward arrow climbs past them. Every shape
has a uniform 10px black outline, flat fill, zero corner radius, and a hard 12px offset
shadow with no blur. Limited palette: off-white, black, red #FF0033, one small accent
of gold #FFD700.
Aspect ratio 2400:1000. The illustration occupies only the right 40% of the canvas.
The left 60% is a flat empty #F3F3F3 field with nothing but two small black squares
in the far corners.
```

#### 3.4.6 digital-marketing-terms (디지털 마케팅 핵심 용어)

```
Flat vector neo-brutalist illustration. Off-white #F3F3F3 background. An inverted
four-step funnel drawn as four stacked trapezoid bands, the bottom band filled solid
red #FF0033. Small flat coin and cursor shapes drop into the funnel from above, and a
simple line chart with three points sits to the right. Every shape has a uniform 10px
black outline, flat fill, zero corner radius, and a hard 12px offset shadow with no blur.
Limited palette: off-white, black, red #FF0033, one small accent of blue #0000FF.
Aspect ratio 2400:1000. The illustration occupies only the right 40% of the canvas.
The left 60% is a flat empty #F3F3F3 field with nothing but two small black squares
in the far corners.
```

#### 3.4.7 digital-basic (디지털 환경 기초 지식)

```
Flat vector neo-brutalist illustration. Off-white #F3F3F3 background. A plain globe drawn
as a circle crossed by two straight lines connects with straight cables to three boxy
devices: a monitor, a phone, and a server tower with three horizontal slots. Small square
data packets sit on the cables. Every shape has a uniform 10px black outline, flat fill,
zero corner radius, and a hard 12px offset shadow with no blur. Limited palette:
off-white, black, blue #0000FF, one small accent of red #FF0033.
Aspect ratio 2400:1000. The illustration occupies only the right 40% of the canvas.
The left 60% is a flat empty #F3F3F3 field with nothing but two small black squares
in the far corners.
```

#### 3.4.8 app-marketing-basics (앱마케팅 기초)

```
Flat vector neo-brutalist illustration. Off-white #F3F3F3 background. A large boxy
smartphone stands upright, its screen holding a simple grid of four app tiles and one
download arrow. To its right, three plain flags mark a path of footsteps from install to
purchase, and a small flat shopping bag sits at the end. Every shape has a uniform 10px
black outline, flat fill, zero corner radius, and a hard 12px offset shadow with no blur.
Limited palette: off-white, black, red #FF0033, one small accent of gold #FFD700.
Aspect ratio 2400:1000. The illustration occupies only the right 40% of the canvas.
The left 60% is a flat empty #F3F3F3 field with nothing but two small black squares
in the far corners.
```

## 4. Phase 1. 메인 히어로 슬라이드 배너

### 4.1 구성

- 신규 파일: `src/components/home/HeroCarousel.tsx` (클라이언트), `src/lib/promotions.ts` (슬롯 정의)
- 위치: 메인 히어로 카드 바로 아래, Trending 위
- 슬롯 5개 구성안: 코스 3, 특집 인사이트 1, AI-Practice 1
- 슬라이드 한 장 = 왼쪽 텍스트(라벨, 제목, 한 줄 설명, 버튼) + 오른쪽 배너 이미지
- 데스크톱은 좌우 화살표와 인디케이터, 모바일은 스와이프

### 4.2 구현 기준

| 항목 | 기준 |
|---|---|
| 슬라이더 | 외부 라이브러리 없이 CSS `scroll-snap-type: x mandatory` |
| 자동 재생 | 6초 간격, 정지 버튼 필수, `prefers-reduced-motion` 존중, 호버 시 정지 |
| 레이아웃 이동 | 컨테이너에 `aspect-ratio` 고정 |
| 첫 슬라이드 | `fetchpriority="high"`, 나머지는 `loading="lazy"` |
| 크롤링 | 모든 슬라이드의 `<a>`를 서버 렌더 DOM에 포함하고 접기는 CSS로만 처리 |
| 디자인 | `border-4 border-black`, `neo-shadow-lg`, 라운드 없음 |

### 4.3 슬롯 데이터 형태

```ts
export interface PromotionSlot {
  id: string;              // 슬라이드 식별자
  href: string;            // 이동 경로
  label: string;           // 상단 라벨. 예) "COURSE"
  title: string;           // 제목
  description: string;     // 한 줄 설명
  image: string;           // /banners/hero/{slug}.webp
  accent: "red" | "gold" | "blue" | "violet";
}
```

## 5. Phase 2. 메인 코스 캐러셀

- 신규 파일: `src/components/home/CourseCarousel.tsx`
- 위치: 히어로 슬라이드와 Trending 사이
- 카드 8개를 가로 스크롤로 배치한다. 카드마다 배너 카드 이미지, 코스 제목, 개념 수, 난이도
  배지를 넣는다.
- 데스크톱은 4열이 보이고 화살표로 넘긴다. 모바일은 카드 폭 240px 스냅 스크롤이다.
  `RelatedPosts`의 가로 스크롤 방식을 그대로 따른다.
- 캐러셀 아래에 태그 칩 한 줄을 추가로 배치해 태그 페이지 유입도 함께 만든다.

## 6. Phase 3. 인사이트 사이드바 개편

### 6.1 변경 내용

| 구분 | 현재 | 변경 후 |
|---|---|---|
| 관련 개념 | 카드 3개 | 리스트 5개 + 코스 전체 보기 링크 |
| About 카드 | 사이드바 중단 | 제거. 글 본문 맨 아래 한 줄 링크로 이동 |
| 같은 주제 글 | 없음 | 리스트 6개 |
| 추천 코스 | 없음 | 리스트 3개 |
| 공유 패널 | 사이드바 하단 | 유지 |

한 화면 노출량이 3개에서 14개로 늘어난다.

### 6.2 리스트 항목 형태

```
─────────────────────────────
제목 두 줄까지 (line-clamp-2, font-bold, text-sm)
설명 한 줄 (line-clamp-1, text-xs, muted)
─────────────────────────────
```

- 카드 테두리와 그림자를 없애고 1px 구분선만 쓴다. 카드 3개가 차지하던 높이에 항목 5개가
  들어간다.
- 그룹 제목은 굵은 소문자 라벨과 4px 하단 선으로 구분한다.
- 사이드바는 `lg:sticky`와 내부 스크롤을 유지한다. 항목 상한은 14개다. 더 늘리면 본문
  집중도가 떨어지고 페이지당 링크가 과도해진다.
- About을 완전히 삭제하면 저자 정보가 글에서 사라진다. 신뢰도 평가와 About 페이지 유입을
  생각하면 본문 끝의 한 줄 링크는 남기기를 권한다.

### 6.3 신규 컴포넌트

- `src/components/SidebarContentList.tsx`: 그룹 제목과 항목 배열을 받아 리스트를 그린다.
- 데이터는 기존 함수로 충당된다. `getRelatedPosts`, `getRelatedClassesForPost`,
  `getPublishedCourses`를 그대로 쓴다. 같은 카테고리 최신 글만 새로 뽑으면 된다.
- 클래스 상세 페이지 사이드바에도 같은 컴포넌트를 재사용한다.

## 7. Phase 4. 추가 노출 다각화

우선순위는 효과 대비 작업량 기준이다.

| 순위 | 안 | 위치 | 효과 | 작업량 |
|---|---|---|---|---|
| 1 | 내비게이션 Class 드롭다운에 코스 8개 노출 | 전역 | 높음 | 낮음 |
| 2 | 푸터에 코스 8개 링크 블록 추가 | 전역 | 중간 | 낮음 |
| 3 | 인사이트 본문 세 번째 H2 뒤에 인라인 코스 카드 | 인사이트 | 높음 | 중간 |
| 4 | `/insights` 목록 다섯 번째 카드에 코스 카드 끼워 넣기 | 목록 | 중간 | 낮음 |
| 5 | 클래스 상세 하단에 관련 인사이트 리스트 확장 | 클래스 | 중간 | 낮음 |
| 6 | 태그 페이지 상단에 해당 태그 관련 코스 배너 | 태그 | 중간 | 중간 |
| 7 | 이어서 학습하기 카드를 메인으로 승격 | 메인 | 중간 | 중간 |
| 8 | 목표별 학습 경로 랜딩 페이지 신설 | 신규 | 중간 | 높음 |
| 9 | 검색 결과 0건 화면과 404에 코스 추천 | 예외 화면 | 낮음 | 낮음 |
| 10 | 최근 본 글 기반 추천 (localStorage) | 전역 | 중간 | 높음 |

1번과 2번은 전역 링크라서 코스 페이지의 내부 링크 수를 한 번에 늘린다. 링크가 늘면
크롤러가 코스 페이지를 중요한 문서로 판단할 근거가 생긴다. 검색 유입이 어려운 페이지에
가장 먼저 써야 할 수단이다.

3번은 본문 두 번째 H2 앞에 광고 슬롯이 이미 들어가 있으므로 세 번째 H2 뒤에 배치해
간격을 확보한다.

## 8. Phase 5. 계측

`docs/ga4-event-dictionary.md` 규칙을 따라 아래 이벤트를 추가한다.

| 이벤트 | 매개변수 | 발생 지점 |
|---|---|---|
| `view_main_banner` | `content_id`, `content_name`, `position` | 히어로 슬라이드가 화면에 들어올 때 |
| `click_main_banner` | `content_id`, `content_name`, `position` | 히어로 슬라이드 클릭 |
| `click_main_course` | `content_id`, `content_name`, `position` | 메인 코스 캐러셀 클릭 |
| `click_sidebar_list` | `content_id`, `content_name`, `content_type`, `position` | 사이드바 리스트 클릭 |
| `click_inline_course` | `content_id`, `course_slug` | 본문 인라인 코스 카드 클릭 |

- `content_type` 값은 `insight`, `class`, `course`를 쓴다.
- GTM에는 "GA4 - Event - 메인이벤트 관련" 태그 그룹에 트리거를 추가한다.
- 작업 후 `docs/ga4-event-dictionary.md`를 갱신한다.

### 성공 지표

| 지표 | 확인 방법 | 목표 |
|---|---|---|
| 코스 페이지 내부 유입 비중 | `/class/*` 세션의 이전 페이지 경로 | 4주 후 내부 유입 절반 이상 |
| 히어로 클릭률 | `click_main_banner` / `view_main_banner` | 3% 이상 |
| 사이드바 클릭률 | `click_sidebar_list` / 인사이트 조회수 | 5% 이상 |
| 세션당 페이지뷰 | GA4 참여도 | 개편 전 대비 상승 |

## 9. 리스크

| 리스크 | 대응 |
|---|---|
| 배너 이미지 용량이 전송 비용을 늘린다 | WebP 변환, 용량 상한 준수, 캐시 헤더 30일, 첫 장 외 지연 로딩 |
| 자동 슬라이드가 접근성을 해친다 | 정지 버튼, `prefers-reduced-motion`, 키보드 이동 지원 |
| 사이드바 링크 증가로 본문 집중도가 떨어진다 | 항목 14개 상한, 카드 대신 얇은 리스트 |
| 배너 이미지가 레이아웃을 밀어낸다 | 컨테이너 `aspect-ratio` 고정 |
| 캐러셀 링크를 크롤러가 못 읽는다 | 모든 링크를 서버 렌더 DOM에 포함, 접기는 CSS 처리 |
| 배포 횟수 증가로 비용이 오른다 | Phase 단위로 묶어 배포 |

## 10. 실행 순서

1. **Phase 0**: 배너 이미지 16장 생성과 변환 (사용자 작업), 캐시 헤더 추가
2. **Phase 4-1, 4-2**: 내비게이션과 푸터 코스 링크 (이미지 없이 바로 가능)
3. **Phase 3**: 사이드바 리스트 개편
4. **Phase 1**: 메인 히어로 슬라이드
5. **Phase 2**: 메인 코스 캐러셀
6. **Phase 5**: GA4 이벤트와 GTM 태그, 문서 갱신
7. **Phase 4-3 이후**: 잔여 다각화 안을 지표 확인 후 순차 적용

2번은 이미지 없이 먼저 배포할 수 있어서 코스 페이지 내부 링크를 가장 빨리 늘린다.
