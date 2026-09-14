# 제목·메타데이터 전수 조사 및 수정 제안

조사일: 2026-09-05, 운영 사이트 https://www.digitalmarketer.co.kr 및 현재 작업 디렉터리 기준.

제목이 다르다는 이유만으로 전부 통일할 필요는 없다. 우선 고쳐야 하는 것은 브랜드 중복, 사건의 확정 여부·조건·범위를 다르게 전달하는 문구, 실제 콘텐츠 수와 다른 설명이다. 짧은 목록 이름과 검색용 설명형 제목의 차이는 유지할 수 있다.

## 조사 범위와 결과

- 콘텐츠 원본 286개: 인사이트 180개, 클래스 97개, 코스 9개.
- 고정·허브 10개, GA4 튜토리얼 30개, AI 실습·레거시 9개, 태그 상세 36개, 목업 HTML 4개, 독립 정책 1개를 더해 총 376개 URL.
- 운영 응답: 375개 HTTP 200, 1개 HTTP 404. 운영 사이트맵 353개 URL은 모두 이 조사 집합에 포함됐다.
- 현재 소스, 기존 로컬 빌드 HTML, 운영 HTML을 대조했다. 소스 수정이나 새 배포는 수행하지 않았다.
- H1, 최종 HTML title, og:title, twitter:title, description 3종, 대표 이미지 URL, robots, 구조화 데이터 이름을 수집했다.
- 브랜드·섹션 라벨을 제거해도 제목 문자열이 다른 URL은 로컬 기준 354개다. 이는 오류 개수가 아니다. 어순·한영 표기·문장 부호·정상 축약·실습 목업까지 포함한 기계적 차이다.
- 홈·소개·검색·AI 기초 실습·GA4 기초 실습은 실제 Chrome에서도 확인했다. 검색의 원시 HTML에는 Suspense 때문에 H1 두 개가 있으나, 렌더 후에는 하나다.

| 구분 | 전수 대상 | 차이 |
|---|---:|---|
| 인사이트 | 180 | title과 명시된 metaTitle이 다른 파일 136개. ogTitle과 metaTitle이 다른 파일 151개. 브랜드를 제외한 H1/title/OG/Twitter 핵심 문자열 차이는 163개이며 이 중 1개는 운영 404 |
| 클래스 | 97 | H1/목록의 term과 metaTitle이 다른 파일 96개 |
| 코스 | 9 | course.title과 metaTitle이 모두 다름 |
| GA4 튜토리얼 | 30 | 화면 t.title과 검색 seoTitle이 모두 다름 |
| AI 상세 | 9 | 신규 실습 6개는 짧은 H1과 긴 검색 제목, 레거시 3개는 AI-Practice 라벨 중복 |
| 태그 상세 | 36 | H1의 ‘태그 콘텐츠’와 검색의 ‘태그 인사이트와 클래스 … 모음’ 문형이 다름 |
| 기타 | 15 | 허브·정책·목업 포함. 전체 현황은 부록 참조 |

전수 원문 및 제안값:
- [376개 URL 전체 대조표](./2026-09-05-title-metadata-all-pages.md)
- [필터·정렬용 CSV](./2026-09-05-title-metadata-all-pages.csv)

CSV에는 현재 화면 제목, 원본 title/term·metaTitle·ogTitle, 운영 최종 title, 모든 메타 설명, 구조화 데이터 이름, 운영/빌드 차이, 우선순위, 노출별 제안값을 담았다. 운영 404 행은 로컬값임을 표시했다.

## P1: 먼저 수정할 확정 문제

### 1. 인사이트 6개에서 브랜드가 두 번 붙음

원인: frontmatter metaTitle에 이미 ‘| 준이아빠블로그’가 있는데 루트 title.template이 다시 같은 접미사를 붙인다. 운영 HTML에서도 확인했다.

| 슬러그 | 수정 후 HTML title |
|---|---|
| claude-cowork-5-ai-tasks-for-beginners | 클로드 코워크로 해야 할 5가지 AI 작업 \| 준이아빠블로그 |
| claude-cowork-what-you-can-do | 클로드 코워크로 할 수 있는 것 - 총 정리 \| 준이아빠블로그 |
| claude-work-use-cases-and-projects | 클로드 업무 활용 사례 4가지와 프로젝트 설정법 정리 \| 준이아빠블로그 |
| mcp-easy-guide-for-non-developers | MCP란? 비전문가를 위한 MCP 쉽게 이해하기 \| 준이아빠블로그 |
| non-developer-chrome-extension-deployment-guide | 비개발자의 크롬 확장 프로그램 배포기록 A to Z \| 준이아빠블로그 |
| why-markdown-matters-in-ai-era | AI시대에 마크다운이 중요한 이유: md파일은 뭘까요 \| 준이아빠블로그 |

수정 지점: 위 6개 content/insights/*.md의 metaTitle에서 브랜드 접미사 제거. 화면 H1은 그대로 두고 루트 템플릿이 브랜드를 한 번만 붙이게 한다.

### 2. 예정·조건·모델 버전이 노출 위치에 따라 달라짐

| 페이지 | 현재 문제 | 권장 공통 제목 |
|---|---|---|
| /insights/claude-code-codex-usage-limit-race | H1은 ‘8월 31일 종료 예정’, 검색은 ‘8월 31일 종료’로 단정. OG는 그 날짜가 이미 세 번 연장된 듯 읽힘. 본문 기준일은 8월 27일 | 클로드 코드 주간 한도 50% 상향과 종료 예정일 변경 기록 (2026년 8월 27일 기준) |
| /insights/prompt-cache-claude-code-codex | 검색은 클로드 코드 대 코덱스 비용이 10배 다른 것으로 읽힐 수 있고, OG는 몰아서 작업하면 총비용이 항상 10배 절감되는 것처럼 표현. 본문은 캐시 적중 조건과 비용 예시 | 클로드 코드와 코덱스 프롬프트 캐시: 비용 절감 조건과 계산 예시 |
| /insights/gemini-spark-guide | H1·검색은 일반적인 제미나이 모델인데 OG에만 ‘제미나이 3.5’가 남음 | 제미나이 스파크(Gemini Spark) 사용법과 제미나이 모델의 장점 |

이 제안은 현재 저장된 본문과 제목 간 일관성을 맞추는 안이다. 실제 최신 프로모션 종료 여부나 모델 사양을 확인한 결과가 아니다. 한도 글을 최신 뉴스로 운영하려면 실제 공지를 확인한 뒤 기준일과 본문을 함께 갱신해야 한다.

### 3. 설명의 숫자가 실제 내용과 다름

| 위치 | 현재 노출 | 확인 결과 | 수정안 |
|---|---|---|---|
| /class/claude-code-for-everyone | metaDescription에 ‘8개 개념’ | 연결된 클래스 9개 | ‘9개 개념’으로 수정하거나 classCount에서 동적 생성 |
| /tags | 운영 meta/OG/Twitter 설명에 ‘인사이트와 클래스 801건’, 로컬은 804건 | 태그별 count 합계이므로 같은 글이 중복 집계됨. 로컬 고유 인사이트+클래스는 277개 | ‘36개 태그로 AI·마케팅·데이터 분석 인사이트와 클래스를 탐색하세요’로 수정. 고유 건수를 표시하려면 별도 계산 |
| 루트 설명과 /about 설명 | 루트 ‘9년 차’, 소개 ‘10년차’ | 페이지별 경력 표기 불일치 | 동일한 기준일·계산 방식에서 생성. 어떤 값이 맞는지는 경력 산정 방식에 맞춰 결정 |

### 4. 운영과 로컬 배포 상태가 다름

/insights/gemini-3-6-flash는 로컬에 원본과 정상 HTML이 있으나 운영에서는 404다. 게시 의도·배포 상태를 먼저 확인해야 한다. 보고서의 이 글 제목은 로컬 기준이다.

| 태그 | 로컬 title/H1의 건수 | 운영 title/H1의 건수 |
|---|---:|---:|
| AI | 174 | 173 |
| 바이브코딩 | 86 | 85 |
| 자동화 | 137 | 136 |

세 태그의 차이는 해당 글의 태그와 일치한다. 각 환경 안에서는 H1과 메타의 건수가 일치하므로 제목 생성 오류로 볼 사안은 아니다. 누락 원인은 이번 조사에서 확정하지 않았다.

## 노출 위치에 따른 수정 원칙

| 노출 위치 | 권장 규칙 | 현재 구조에서의 제안 |
|---|---|---|
| 본문 H1 | 방문자가 이 글이 무엇을 다루는지 즉시 식별 | 인사이트의 서술형 제목은 유지 가능. 클래스·GA4는 상세 H1에 검색에서 약속한 학습 범위를 포함 |
| 브라우저 탭·검색용 HTML title | 핵심 주제 앞, 브랜드 뒤 한 번 | 상세 페이지의 Class/GA4 Edu/AI-Practice 접두사는 breadcrumb·상단 라벨로 옮기는 안을 권장. 섹션 허브에서는 식별용으로 유지 가능 |
| OG·Twitter·공유 버튼 | 같은 사건·대상·숫자·시점·조건 유지 | 문체 차이는 허용. 최신 정보와 연결된 수치·버전·확정 여부를 바꾸는 제목은 함께 수정 |
| Article.headline / LearningResource.name | 실제 화면의 문서명과 대응 | 인사이트는 이미 post.title 사용. 클래스는 metaTitle 사용 중이므로 상세 H1을 같은 값으로 맞추는 안. GA4도 같은 원칙 |
| 코스·태그·관련 글 카드 | 공간에 맞춘 짧은 이름 허용 | 카드명 때문에 상세 H1까지 짧게 만들 필요 없음. 같은 제품명·코스명을 유지하고 보조 설명으로 범위를 연결 |
| 사이트 내부 검색 | 짧은 제목과 검색용 설명을 함께 사용 | 현재 title/term + metaDescription 조합은 유지 가능. 고정 페이지 이름은 중앙 데이터에서 파생 |
| RSS | 구독자가 아는 원래 글 제목 유지 | title/term/course.title 유지. 피드 전체 제목만 홈 브랜딩과 함께 관리. 최신 50개만 노출 |
| GA4 페이지 제목 보고서 | HTML title 변경을 측정 관점에서도 관리 | 제목 변경 전후를 비교할 때 URL 기준으로 묶기. 같은 URL이라도 수집된 페이지 제목 문자열이 바뀔 수 있음 |
| 목업·404·noindex 보조 화면 | 목적에 맞는 제목, 검색 노출과 분리 | 목업 4개는 실습 자료이므로 유지. 검색·정책·레거시 문구는 UX 우선의 낮은 우선순위 |

Google은 HTML title뿐 아니라 화면의 큰 제목, H1, og:title, 링크 텍스트 등을 참고해 검색 결과 제목을 자동 생성한다. 따라서 세 문구를 반드시 글자 단위로 같게 만들 필요는 없지만, 핵심 의미를 맞추는 편이 일관성을 높인다. 검색에서 실제로 어떤 문구가 뜰지는 HTML만으로 확정할 수 없다. [Google 제목 링크 문서](https://developers.google.com/search/docs/appearance/title-link)

메타 설명과 본문 도입부도 반드시 같을 필요는 없다. Google은 검색어에 따라 본문을 스니펫으로 선택할 수 있으므로 설명은 본문이 제공하는 내용을 정확하게 요약해야 한다. [Google 스니펫 문서](https://developers.google.com/search/docs/appearance/snippet)

## 섹션별 적용안

### 인사이트

180개를 모두 점검했다. 151개의 OG/metaTitle 차이를 일괄 삭제하는 안은 권하지 않는다. 검색어에 맞춘 설명형 제목과 SNS용 자연스러운 제목이 같은 내용을 전달하면 유지할 수 있다. 전수표에서 P2 선택으로 표시한 행은 이런 경우다.

P1 외에 다음은 주제를 더 정확히 맞추는 개선안이다.

| 슬러그 | 제안 제목 | 이유 |
|---|---|---|
| performance-marketing-measurement-guide | 퍼포먼스 마케팅 성과 지표 5가지: CTR, CPC, CVR, CPA, ROAS | 본문은 측정 방법보다 지표 5개 설명이 중심 |
| ga4-lead-events-explained | GA4 리드 이벤트: disqualify_lead, close_unconvert_lead 뜻과 활용 | 현재 검색 제목에서 두 번째 이벤트가 빠짐 |
| google-ads-analytics-ai-features | 구글애즈·GA4 AI 기능: Ask Advisor, 대시보드, 벤치마킹 | 검색 제목에서 구글애즈·벤치마킹 범위가 빠짐 |
| gpt-5-6-luna-price-cut | GPT-5.6 Luna 가격 인하: 인하 폭과 경쟁 구도 | ‘가격 공개’와 ‘가격 인하’라는 서로 다른 사건 표현을 맞춤 |
| ai-content-seo-not-penalized | AI 콘텐츠와 SEO: 직접 운영한 블로그의 검색 노출 실험 | 일반적인 무불이익 단정보다 실제 실험 범위를 명시 |

나머지 수치 추가를 곧바로 오류로 보지는 않았다. 예를 들어 data-visualization-best-practices의 OG ‘7가지 원칙’, zero-click-marketing-strategy의 OG ‘5가지’는 본문에 해당 구성이 있다.

### 클래스 97개 중 96개

현재: 목록·H1·breadcrumb·RSS는 term, 검색·OG·Twitter·공유 버튼·Article.headline은 metaTitle.

권장: term은 짧은 탐색 이름으로 유지하고, 상세 H1을 metaTitle || term으로 만든다. 이렇게 하면 기존 검색 제목을 바꾸지 않고 상세 화면·구조화 데이터·공유를 맞출 수 있다.

예:
- 목록: CPC (Cost Per Click)
- 상세 H1 / Article.headline / OG: CPC 뜻: 클릭당 비용 계산 공식과 예시
- HTML title: CPC 뜻: 클릭당 비용 계산 공식과 예시 | 준이아빠블로그

what-is-json-and-data-structures는 metaTitle이 없어 H1과 검색 핵심 제목이 이미 같다. what-is-bom은 선행 공백을 없애고 긴 코스 소개를 description으로 옮기는 안을 별도로 제시했다.

what-is-web-crawling의 frontmatter에는 ogTitle도 있지만 클래스 로더가 읽지 않는다. 현재는 metaTitle과 값이 같아 실제 노출 차이는 없으나, 향후 이 필드를 수정해도 반영되지 않는 구조다. 지원할지 제거할지 데이터 규칙을 정하는 편이 좋다.

### 코스 9개

전체 코스명과 검색용 범위 설명이 다른 상태다. 기본 코스명은 유지할 수 있으나 Claude 기초, 디지털 기초, 바이브코딩처럼 명칭 자체가 달라지는 곳은 기본 이름을 한곳에서 관리하는 편이 좋다. 모든 코스의 현재값과 구체적 제안값은 전수표에 있다.

홈 히어로 5개도 검사했다. 그중 코스 이름 자체가 다른 것은 다음 2개다.

| 코스 | 히어로 이름 | 상세 이름 | 제안 |
|---|---|---|---|
| claude-fundamentals | Claude 기초 교육 | Claude 기초 교육, AI를 제대로 쓰는 첫걸음 | 짧은 이름은 허용하되 공통 데이터의 shortTitle에서 파생 |
| vibe-coding-basics | 바이브코딩 기초지식 | 바이브코딩을 위한 기초지식 | ‘바이브코딩 기초지식’으로 핵심 이름 통일 |

‘반복 업무 지친다면 / 코딩 없이 맡겨보세요’ 같은 히어로 headline은 코스명과 별개인 홍보 문구라 동일할 필요가 없다. 나머지 히어로 3개의 title은 상세 course.title과 일치한다.

### GA4 30개와 AI 실습 6개

GA4는 t.title을 과제명으로 쓰고 seoTitle을 검색·OG·LearningResource.name으로 쓴다. 상세 H1만 seoTitle로 바꾸고 카드의 짧은 과제명은 유지하는 안을 권한다. 예: ‘맞춤 측정기준 등록해 매개변수를 보고서에 올리기’ → ‘GA4 맞춤 측정기준 등록 방법과 (not set) 이유’.

AI 실습 H1은 ‘프롬프트 기초’처럼 지나치게 짧다. ‘프롬프트 기초: 역할·맥락·형식 실습’처럼 수행 내용을 포함하면 검색·공유에서 본 약속과 연결된다. AIPBL 약어 설명은 부제에 두고 상세 제목에는 주제·결과를 우선한다.

레거시 3개는 noindex이며 ‘AI-Practice | … : AI-Practice 실습 | 준이아빠블로그’에서 섹션명을 한 번만 남기는 정도면 충분하다.

### 홈·소개·허브·내부 검색

| URL | 현재 화면 제목 | 제안 |
|---|---|---|
| / | H1은 sr-only. 일반 화면에 대표 제목 없음 | 보이는 ‘AI 활용·디지털 마케팅·데이터 분석’과 동일한 검색·공유 제목 |
| /about | 마케팅 성과를 데이터로 확인하는 일을 합니다. | H1에 ‘AI·데이터 분석 컨설턴트 홍승협(준이아빠) 소개’, 기존 슬로건은 부제 |
| /insights | Insights | AI·마케팅 인사이트 |
| /class | Class | AI·마케팅 개념 학습 코스 |
| /tags | Tags | 태그로 탐색하는 콘텐츠 모음 |
| /search | Search | 사이트 내 검색. noindex 유지 |
| /ai-practice | 실습으로 배우는 PBL 기반 AI Self Education | AI-Practice: 실습으로 배우는 AI 활용 |
| /ga4-edu/realtime | 실시간 개요 보고서 | GA4 실시간 개요 보고서 실습. noindex 유지 |

src/lib/search-index.ts의 고정 페이지 5개는 또 다른 제목을 쓴다: ‘About 작성자 소개’, ‘AI-Practice 실습’, ‘Insights 전체 글 목록’, ‘Class 용어 강의 목록’, ‘Tags 태그 모음’. 각 페이지의 제안 기본 이름에서 파생하도록 정리하면 업데이트 누락을 줄일 수 있다.

## 수정 지점과 완료 판단

1. 콘텐츠 frontmatter에서 브랜드 중복 6개, 의미·조건 불일치 3개, 잘못된 설명 숫자를 먼저 수정.
2. 클래스·GA4 상세 H1의 제목 선택 규칙을 정리. 코스·고정 페이지는 기본 이름을 중앙 데이터에서 파생.
3. OG/Twitter/공유 버튼에 같은 소셜 제목 함수를 사용. 인사이트는 이미 같은 fallback을 쓰므로 중복 로직 정리 수준으로 접근.
4. 현재 scripts/generate-og.ts는 이미지에 title || term을 넣고 metaTitle/ogTitle은 사용하지 않는다. 제목을 고친다면 이미지 속 문구도 함께 검토하고 필요할 때 새 파일명으로 재생성.
5. 재배포 후 운영 HTML을 다시 확인하고, 공유 서비스의 캐시가 갱신된 뒤 카드도 확인. 현재 설정상 이미지 캐시 기간은 30일이므로 동일 URL 파일 교체만으로 즉시 바뀐다고 가정하지 않는다.
6. 브랜드 중복 없음, 제목·설명의 숫자와 실제 콘텐츠 일치, H1과 JSON-LD의 동일 대상, 대표 페이지의 검색·공유 문구 일관성, 운영 404 처리 여부로 완료 판단.

주요 소스:
- [루트 메타데이터](/Users/hsh/Documents/00_project/hongblog/src/app/layout.tsx:15)
- [인사이트 메타데이터](/Users/hsh/Documents/00_project/hongblog/src/app/insights/[slug]/page.tsx:61)
- [클래스 상세](/Users/hsh/Documents/00_project/hongblog/src/app/class/[courseSlug]/[classSlug]/page.tsx:52)
- [코스 상세](/Users/hsh/Documents/00_project/hongblog/src/app/class/[courseSlug]/page.tsx:30)
- [GA4 제목 생성](/Users/hsh/Documents/00_project/hongblog/src/app/ga4-edu/[slug]/page.tsx:41)
- [태그 설명 집계](/Users/hsh/Documents/00_project/hongblog/src/app/tags/page.tsx:23)
- [내부 검색 이름](/Users/hsh/Documents/00_project/hongblog/src/lib/search-index.ts:57)
- [히어로 코스명](/Users/hsh/Documents/00_project/hongblog/src/lib/promotions.ts:93)
- [OG 이미지 문구 생성](/Users/hsh/Documents/00_project/hongblog/scripts/generate-og.ts:38)

## 확인 범위의 한계

‘운영 노출 확인’은 운영 HTML 응답과 일부 실제 브라우저 렌더 확인을 뜻한다. Google/Naver의 검색어별 실제 검색 결과 제목이나 카카오·Slack의 현재 캐시 카드까지 전수 확인한 것은 아니다. 이미지에 박힌 글자는 전체 OCR을 하지 않았으며 이미지 URL과 생성 로직을 검사했다. 오류 페이지는 정상 콘텐츠 집계에서 별도로 취급했다: 404의 ‘페이지를 찾을 수 없습니다’와 화면의 ‘찾으시는 페이지가 없습니다’는 정상적인 문구 차이다. 500 페이지의 숫자/오류 제목도 일반 콘텐츠 수정 대상이 아니다.

이번 결과물은 조사 보고서와 제안표다. 애플리케이션 코드·콘텐츠·배포는 변경하지 않았다.
