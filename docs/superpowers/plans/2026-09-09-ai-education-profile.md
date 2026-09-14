# AI Education Profile Implementation Plan

**Goal:** 검증된 익명 사례를 소개와 기업 교육 안내에 연결한다.
**Architecture:** 기존 Next.js 정적 페이지 및 공용 공개 데이터, 공용 Person 식별자를 사용한다.
**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind.

- [x] RAG에서 본인 역할/수행 상태 근거 확인. 원본은 저장소 밖에서 관리.
- [x] src/lib/education.ts: 공개 사례 3개, 교육 소개와 주제 3개 작성.
- [x] src/components/education/ExperienceCases.tsx: 익명 사례 목록 구현.
- [x] src/app/about/page.tsx: 소개·사례·교육 링크 보강, 미검증 누적 수치 제거.
- [x] src/app/education/page.tsx: 대상·실습·진행·문의·독학 경로와 metadata/Service JSON-LD.
- [x] src/app/page.tsx, src/components/layout/Footer.tsx: 교육 안내 연결.
- [x] src/app/class/[courseSlug]/page.tsx: 주요 3개 과정의 교육 안내와 동일 Person provider.
- [x] src/app/sitemap/[id]/route.ts, scripts/check-links.ts: /education 경로 등록.
- [x] 사실·익명화·문체 검수 후 수정 파일 ESLint, npm run build, HTML 링크 검사와 브라우저 검증.
- [x] 검수 결과와 후순위 항목 기록. 커밋·배포 없이 검토 가능한 변경 전달.

## 보류
전체 계약 재집계, 상세 사례 다량 작성, 교육 대상별 랜딩페이지, 외부 후기 확보, 자동 추천 모니터링, 전면 디자인 개편.

## 검증 결과
- 빌드 성공, TypeScript 검사 통과. 수정 파일 ESLint 오류 0건(기존 img 경고 1건).
- 전체 lint는 변경하지 않은 파일의 오류 13건으로 실패. 별도 유지보수로 보류.
- 렌더 HTML 392개 내부 링크 검사 통과. 검사기가 정상 정적 경로를 누락하던 문제는 빌드 manifest 경로를 포함하도록 수정.
- 소개/교육 원고 문체 HARD 0건. 독립 사실·익명화 검토에서 교육 완료 상태 표현을 수정.
- 모바일 390px/데스크톱 1440px, 6개 경로에서 HTTP 200, H1 1개, 가로 넘침 0건, pageerror 0건.
- 추가 태블릿 768px 검사에서 기존 공통 Nav의 가로 넘침을 발견했다(문서 너비 855px). 소개/교육 본문 넘침은 없으며 공통 메뉴는 아래 후속 작업으로 수정했다.
- 신규/수정 공개 사례와 소개·교육 HTML에서 고객 관련 금지 토큰 101개 검사, 검출 0건.
- about/education 메타와 JSON-LD 정의 일치, 교육 사이트맵 포함, 홈/소개/과정/교육의 Person 식별자 일치 확인.
- 기존 사용자 수정 보존. 커밋·배포 없음.

## 후속: 태블릿 메뉴와 공개 검토본
사용자의 계속 진행 요청에 따라 기존 접이식 메뉴를 1024px 미만에서 사용한다. 항목 축소는 접근 경로를 줄이고 두 줄 배치는 헤더 높이를 늘리므로, 기존 메뉴 재사용을 선택한다.
- [x] Nav.tsx의 데스크톱/접이식 전환을 lg로 통일하고 토글의 펼침 상태를 제공한다.
- [x] 공개 사례 쉼표 공백을 정리한다.
- [x] 경계 너비와 메뉴/검색/강의/구독 동작을 브라우저에서 검증하고 빌드·링크 검사를 실행한다.
- [x] 공개 원고 전문과 전후 검수 결과를 문서로 제공한다.
