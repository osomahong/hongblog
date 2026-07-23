# Class 섹션 SEO 개선 진행 기록 (2026-07-23)

GSC 90일 실데이터 진단(4/21~7/20) 기반으로 진행한 개선 작업 기록입니다.

## 진단 요약 (근거 데이터)

- Class 상세 CTR 1.34% vs Insights 4.36% (순위는 6.5 vs 6.0으로 비슷): 문제는 순위가 아니라 스니펫
- Class 노출은 주 84회 → 17,048회로 90일간 급성장 중
- 60개 클래스 중 15개가 색인 안 됨 (11개는 구글이 URL 존재 자체를 모름). 사이트맵은 정상, 원인은 내부 링크·콘텐츠 신호 부족
- 실전 활용형 페이지(claude-for-marketers CTR 11.3%)가 사전형(what-is-anthropic 0.28%)보다 CTR 10배 이상
- GA4: Class 방문자 참여율 0.742로 Insights(0.580)보다 높음. 오면 만족하는데 유입과 순환이 없는 구조

## 완료된 작업

### 코드 (src/)
- [x] `relatedTerms` frontmatter 렌더링: 상세 페이지 "이어서 배우면 좋은 개념" 섹션이 큐레이션 우선 + 태그 기반 보충 (`getClassesBySlugs` 추가)
- [x] `/class` 목록: 접힌 커리큘럼도 전체 링크를 DOM에 렌더링 (기존에는 66개 중 18개만 정적 HTML에 존재)
- [x] 코스 페이지: 총 학습 시간, 클래스별 읽기 시간 표시 (`totalReadingTime`, `readingTime`)
- [x] `scripts/gsc-report.ts` 추가: GSC 주간 점검 스크립트 (`npx tsx --env-file=.env.local scripts/gsc-report.ts`)
- [x] 미사용 import 정리 (course page)

### 콘텐츠 (content/)
- [x] 스니펫 스프린트: 노출 상위 12개 클래스에 metaTitle/metaDescription 신규 작성, what-is-anthropic은 검색 의도("뭐하는 회사")에 맞게 교체
- [x] 코스 2개(digital-basic, digital-marketing-terms) metaTitle/metaDescription 추가
- [x] relatedTerms 그래프 보강: 신규 8개 파일 + 기존 8개 파일에 미색인 페이지로 향하는 링크 추가
- [x] 미색인 8개 클래스에 실전 섹션 추가 (whatishtml, git, database, rest-api, debugging, deployment, env-variables, authentication) + 본문 내부 링크 11건
- [x] 상위 insights 3곳(맥/윈도우 클로드 코드 설치, localhost 가이드)에서 미색인 클래스로 본문 링크
- [x] 추상 AI 일러스트 85개 전량 제거: 교육용 HTML 예시 블록으로 교체 또는 삭제
  - classes 19개 파일 42개, insights 20개 파일 43개
  - 계산 카드, 퍼널, 태그 해부, DOM 트리, DNS 흐름, GA4 보고서 목업 등
- [x] 문장 부호 규칙 전면 적용: em dash(—) 363건, 가운뎃점(·) 1,000여 건 → 0건 (classes, insights, courses 전체)
- [x] 문장 부호 치환으로 깨진 quiz options YAML 17개 파일 복구 (전수 검증 통과)

### 검증
- [x] `npm run build` 통과 (exit 0)
- [x] 전체 132개 MD frontmatter YAML 파싱 통과
- [x] ESLint 대상 파일 0 오류 0 경고

## 2차 작업 (스톱 훅 연장 라운드에서 추가 완료)

- [x] 학습 진도 저장: `ClassProgressMarker`(상세 방문 기록) + `CourseClassList`(코스 페이지 완료 체크·진행률 바), localStorage 기반
- [x] 목록 페이지 목표별 추천 시작점 6종 (`START_GUIDES`)
- [x] claude-model-family Claude 5 패밀리 반영 최신화 (에이전트, 공식 소스 확인)
- [x] 사전형 저CTR 클래스 6개(hallucination, anthropic, cpm, roi, ctr, cvr) 실전 섹션 (에이전트)
- [x] 스테일 `.next/dev` 타입 오류 정리, tsc --noEmit 통과

- [x] `/class` 목록 하단 전체 개념 인덱스 (코스별 전 클래스 링크 모음)
- [x] what-is-roi 깨진 마크다운 표 복구, what-is-cpm/ctr 오탈자(캐페인, 봄니다, 끋지) 수정
- [x] 최종 빌드 통과 (183 페이지 SSG), YAML 132개 통과, em dash/가운뎃점 0건

## 3차 작업 (배포 후 피드백 대응)

- [x] main 병합(충돌 1건 해결) 후 배포: 커밋 3개 + 병합 커밋, Vercel 반영 라이브 확인
- [x] 미공개 초안(gemini-3-6-flash)은 커밋에서 제외해 로컬 보존
- [x] 코스 목록 호버 색 충돌 수정(빨강 배경에 빨강 제목 → 연한 골드 배경 + 빨강 제목), 배포 반영 확인
- [x] 유사 색 충돌 패턴 전수 검사: Nav, NeoButton, 태그, 링크, 아코디언은 빨강 배경 + 흰 텍스트 조합으로 문제없음 확인

## 4차 작업: 내부 링크 404 수정 (2026-07-23)

사용자가 "프롬프트 엔지니어링 기본 익히기" 페이지의 이전 개념 링크에서 404를 만난 건에 대한 조치.

### 근본 원인

`getClassBySlugWithMeta()`가 `classToMeta(cls, 1)`로 **id를 항상 1로 고정**해서 반환했다.
상세 페이지는 그 id로 `getNextPrevClass(classData.id)`를 호출했기 때문에, 모든 클래스
페이지가 "전체 정렬 목록의 첫 번째 클래스"를 기준으로 이전/다음을 계산했다. 결과로 나온
다른 코스의 클래스 슬러그가 현재 페이지의 `courseSlug`와 조립되어
`/class/claude-fundamentals/what-is-mcp` 같은 존재하지 않는 URL이 만들어졌다
(`dynamicParams = false`이므로 실제 조합이 아닌 경로는 404).

### 조치

- [x] `getNextPrevClass`를 slug 기반으로 변경, 진행 표시를 1-based로 교정
- [x] prev/next/연관 개념 링크가 각 항목의 실제 코스 슬러그를 사용하도록 수정
- [x] `src/lib/links.ts`의 `classHref()`로 링크 생성 일원화. 코스 정보가 없으면 null을 반환해
      링크 자체를 렌더링하지 않음 (기존에 흩어져 있던 `?? ""` 폴백은 `/class//slug`를 만들 수 있었음)
- [x] 미들웨어: 코스 조각이 틀린 클래스 URL을 정규 경로로 **301** (이미 색인된 URL 구제)
- [x] `scripts/generate-class-map.ts` + prebuild: 미들웨어용 슬러그-코스 매핑 자동 생성
- [x] `scripts/check-links.ts`: 콘텐츠 소스와 빌드 HTML의 내부 링크 전수 검사.
      **prebuild에 편입해 깨진 링크가 있으면 빌드가 종료 코드 1로 중단** (재발 방지 검증 완료)
- [x] CLAUDE.md에 링크 규칙 명문화

### 검증 결과

| 검사 | 결과 |
|---|---|
| 콘텐츠 소스 링크 (relatedTerms, 본문, courseSlug) | 0건 |
| 빌드 산출물 HTML 185개의 모든 내부 href | 0건 |
| 라이브 사이트 크롤링 182개 페이지 | 404 0건, 의도치 않은 리디렉트 0건 |
| 사이트맵, RSS, llms.txt의 182개 URL 응답 | 비정상 0건 |
| 문제 URL `/class/claude-fundamentals/what-is-mcp` | 301 → `/class/claude-code-for-everyone/what-is-mcp` |
| 깨진 링크 주입 시 빌드 | 중단됨 (exit 1, 페이지 생성 도달 못 함) |

## 5차 작업: 기술적 SEO 전면 검수 (2026-07-23)

### 색인 현황 (GSC URL Inspection 182개 전수 조회)

| 상태 | 건수 |
|---|---|
| 제출되고 색인이 생성되었습니다 | 177 |
| Google에 아직 알려지지 않은 URL | 2 (what-is-element, whatishtml) |
| 발견됨, 현재 색인이 생성되지 않음 | 1 (what-is-json-and-data-structures) |
| 크롤링됨, 현재 색인이 생성되지 않음 | 1 (/tags/DOM, 이번에 noindex 처리) |
| 찾을 수 없음(404) | 1 (/tags/노코드, 4월 크롤 기록. 현재 200 정상) |

7월 23일 이전 미색인 15개 중 12개가 색인 완료됐다. 구글이 선택한 canonical이
선언 canonical과 다른 페이지는 0건이다.

### 조치한 항목

- [x] 얇은 태그 페이지 15개 noindex, follow (90일 노출 344회에 클릭 0회, 항목 2개 이하)
- [x] noindex URL을 사이트맵에서 제외해 제출 의도와 색인 의도를 일치
- [x] 사이트맵 lastmod와 Article dateModified가 실제 수정일을 반영하도록 `updatedAt` 필드 도입
      (실질 개편한 콘텐츠 90개에 기록, 라이브 사이트맵에서 46개 URL 갱신 확인)
- [x] 홈, 인사이트 목록의 중복되고 짧던 description 차별화
- [x] 홈에 WebSite/Person, 인사이트 목록에 CollectionPage/ItemList/Breadcrumb JSON-LD 추가
- [x] 태그 38개, about, 태그 허브에 og:image와 twitter 카드 추가
- [x] 검색 결과에서 잘리던 title 7건 축약, 본문 중복 h1 제거, 짧은 description 보강
- [x] robots.txt에서 `/_next/static/media` 차단 해제 (폰트는 렌더링 리소스)
- [x] llms.txt 문장 부호 정리, 기준 시점 갱신
- [x] 300KB 초과 본문 이미지 7개 WebP 변환: 8.3MB -> 649KB (92% 감소)

### 검증 결과

| 항목 | 결과 |
|---|---|
| 자체 SEO 검수 이슈 | 80건 -> 15건 (잔여는 전부 의도된 noindex 태그) |
| 라이브 크롤링 182페이지 | 404 0건, 의도치 않은 리디렉트 0건 |
| 홈 기준 클릭 깊이 | 최대 2클릭, 도달 불가 페이지 0건 |
| URL 정규화 | non-www, http, 트레일링 슬래시 모두 1~2홉 내 정착 |
| 구글 선택 canonical 불일치 | 0건 |

### 도구

`npx tsx scripts/seo-audit.ts` (빌드 후 실행): 메타, canonical, 중복, 구조화 데이터,
고아 페이지, 사이트맵 정합성, 얇은 콘텐츠를 전수 검사한다.

## 최종 검증 상태 (2026-07-23 배포 시점)

- 본문 추상 일러스트: 0건 (85개 전량 HTML 예시 교체 또는 삭제)
- em dash, 가운뎃점: 0건 / YAML 132개 전수 통과 / 빌드 194 페이지 통과
- 세션 토큰: 목표치(40%) 도달 후 스톱 훅 연장 지시로 잔여 항목까지 완료하고 종료

## 남은 작업 (백로그)

1. **[사용자 작업] GSC 수동 색인 요청**: Search Console UI에서 미색인 15개 URL 개별 요청 (특히 what-is-mcp). Indexing API는 일반 페이지 미지원이라 자동화 불가. 배포 후 진행할 것
2. insights → class "다음 학습" 배너: 설치 가이드류에서 관련 개념 클래스로 연결하는 공통 컴포넌트
3. **[시간 경과 필요] 배포 2주 후 `scripts/gsc-report.ts`로 CTR/색인 변화 측정**

## 주의 사항

- 이번 변경은 미커밋 상태. 커밋 전 `git status`로 이전 세션의 무관한 변경(.agents/, higgsfield 스킬, gemini-3-6-flash 글)과 분리해서 커밋할 것
- `what-is-debugging.md`, `what-is-roi.md`의 이전 버전 백업이 세션 scratchpad에 있음 (충돌 복구 과정에서 생성)
