# GEO Followup Implementation Plan

**Goal:** 승인된 1~6번을 최신 블로그 소스에 반영하고 유지보수 누락을 빌드/작업 규칙에서 방지한다.
**Architecture:** 기존 data.ts, Markdown, About, cases, AUTHOR_PERSON_LD와 검색 검사 재사용. 사실 확인과 런타임 HTML을 함께 검사한다.
**Tech Stack:** Next.js 16, React, TypeScript, Markdown, tsx.

- [x] src/app/ga4-edu/data.ts 및 [slug]/page.tsx: 세션 정의 수정과 실제 확인일/공식 출처 노출.
- [x] content/insights/geo-agency-selection-criteria.md: 41배 철회, 기간/분모 표와 AI 응답 기록 기준 수정.
- [x] content/insights/seo-aeo-geo-2-months-real-data.md: referral/인용 구분, 퀴즈/요약/FAQ 일치.
- [x] src/app/about/page.tsx: 기존 education/cases로 연결하는 서비스 범위/산출물/검수 안내.
- [x] src/app/cases/[slug]/page.tsx: 공개 사례의 개인 역할/증거 범위 설명. 기존 익명화 유지.
- [x] src/lib/structured-data.ts와 Article UI: 공통 작성자 표시/Person id 확인.
- [x] scripts/check-search-readiness.ts 및 package.json: Person, 공개 본문, paywall selector, llms 링크의 회귀 검사. check:maintenance 명령과 postbuild 연결.
- [x] AGENTS.md/CLAUDE.md, geo-scan references: 변경 때마다 유지보수 결과와 미확인 항목 기록.
- [x] 문체/요약/타입/build/HTML 검사, 실패 원인 수정, 리뷰용 변경 문안과 검증 결과 저장.

서브스킬 실행기는 세션에 없으므로 이 세션에서 직접 구현한다. 기존 사용자 승인 범위를 다시 묻지 않는다. 원자료 미확인 숫자/고객 정보를 추가하지 않는다.
