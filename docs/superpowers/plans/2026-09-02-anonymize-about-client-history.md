# About 고객사 연혁 익명화 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `/about`의 고객사 연혁에서 법인명·브랜드명·로고를 제거하고, 조사 근거에 맞는 업종형 라벨과 대표 이모지를 표시한다. `오픈소스마케팅` 소속 정보는 유지하고 `레아딜` 항목은 삭제한다.

**Architecture:** `src/app/about/page.tsx`의 연혁 표시 데이터를 원본 `company`/`logo` 중심 구조에서 `label`/`emoji` 중심 구조로 바꾼다. 고객사별 로고 매핑과 외부 파비콘 요청은 제거하고, 이모지는 접근 가능한 장식 요소로 렌더링한다. 정확한 73개 매핑과 조사 기준은 설계 문서에서 단일 기준으로 사용한다.

**Tech Stack:** Next.js App Router, React, TypeScript, Lucide, ESLint, Next production build, Vercel Git Integration.

**Spec:** `docs/superpowers/specs/2026-09-02-anonymize-about-client-history-design.md`

---

## Task 1: 연혁 데이터를 업종형 표시 데이터로 교체

**Files:** `src/app/about/page.tsx`

- [ ] `workHistory`의 74개 원본 고객사 항목을 설계 문서의 73개 최종 매핑으로 교체한다.
- [ ] 각 항목을 `year`, `label`, `emoji`, `work` 필드로 구성하고, `label`은 업종·시장 설명과 `A사/B사/C` 식별자를 사용한다.
- [ ] `레아딜` 항목을 추가 라벨 없이 완전히 삭제한다.
- [ ] 업무 문구의 고객사 고유 제품명(`네이버페이` 등)은 설계 문서의 일반 업종 표현으로 치환하고, 허용된 도구명은 유지한다.
- [ ] 연혁 외 About 소개 문구와 FAQ JSON-LD/화면 문구에 남은 `한국관광공사`는 `관광 진흥 공공기관`, `KOTRA아카데미`는 `무역·투자 진흥 공공기관 아카데미`로 일반화한다.
- [ ] 자기소개 문구와 Person JSON-LD의 `worksFor.name: "오픈소스마케팅"`은 수정하지 않는다.

## Task 2: 로고 렌더링과 식별자 의존성 제거

**Files:** `src/app/about/page.tsx`

- [ ] `localLogoByCompany`, `logoDomainByCompany`, `companyLogo` 및 고객사 로고 자산/파비콘 URL을 생성하는 코드를 삭제한다.
- [ ] `milestones` 데이터와 연혁 JSX를 `label`/`emoji` 기반으로 변경한다.
- [ ] 이모지는 `<span aria-hidden="true">` 등 이미지가 아닌 요소로 표시하고, 라벨 텍스트가 의미를 독립적으로 전달하도록 한다.
- [ ] 고객사 원본명이 `alt`, `title`, `aria-label`, JSON-LD, URL, 이미지 요청에 재생성되지 않는지 확인한다.
- [ ] 기존 연도, 업무 설명의 의미, 정렬, 카드 레이아웃은 유지한다.

## Task 3: 소스·빌드 산출물 검증

**Files:** `src/app/about/page.tsx`, generated `.next/`

- [ ] `workHistory`의 `label`과 `emoji`가 각각 정확히 73개인지 확인하고, 대학 식별자 5개가 설계 문서와 일치하는지 확인한다.
- [ ] 설계 문서의 금지 토큰과 `레아딜`, 로고 경로(`/images/about/logos`), Google favicon URL이 About 페이지 전체 소스에 남지 않았는지 검사한다. `오픈소스마케팅`과 허용 도구명은 예외로 둔다.
- [ ] `npm run lint`, `npm run check:links`, `npm run build`를 실행한다.
- [ ] 빌드된 `.next/server`의 About 관련 출력 파일 전체에 같은 금지 토큰·로고 URL 검사를 실행한다.
- [ ] production server를 `npm run start -- --hostname 127.0.0.1 --port 3100`으로 실행하고 `curl -fsS http://127.0.0.1:3100/about`으로 최종 HTML에 업종형 라벨·이모지·`오픈소스마케팅`이 있고 금지 토큰과 로고 URL이 없는지 확인한다.

## Task 4: 변경사항 커밋

**Files:** `src/app/about/page.tsx`

- [ ] `git diff --check`와 변경 파일 목록을 확인해 이번 작업 파일만 커밋 대상에 포함한다.
- [ ] 검증을 통과한 코드만 `feat(about): anonymize client history` 메시지로 커밋한다. 기존 미커밋 파일은 건드리지 않는다.

## Task 5: Vercel 배포 및 production 확인

**Files:** none (remote deployment)

- [ ] 현재 연결된 `origin`의 `main` 브랜치로 커밋을 push해 Vercel Git Integration 배포를 시작한다.
- [ ] 배포 완료를 확인하고 `https://www.digitalmarketer.co.kr/about`에 요청해 새 업종형 라벨, 이모지, `오픈소스마케팅` 유지 여부와 금지 토큰·로고 URL 부재를 검증한다.
- [ ] 배포가 실패하면 로그와 빌드 오류를 확인해 수정·재검증 후 재배포하고, 성공 시 커밋과 production URL을 최종 보고한다.

## Verification Commands

```bash
git diff --check
npm run lint
npm run check:links
npm run build
npm run start -- --hostname 127.0.0.1 --port 3100
curl -fsS http://127.0.0.1:3100/about
curl -fsS https://www.digitalmarketer.co.kr/about
```

## Completion Criteria

- [ ] `/about`의 고객사 연혁에는 73개의 업종형 라벨과 대표 이모지가 표시된다.
- [ ] 고객사 법인명·브랜드명·영문명·제품명·로고·외부 파비콘이 소스와 About 렌더링 결과에 없다.
- [ ] `레아딜`이 완전히 제거되고 `오픈소스마케팅` 소속 정보는 유지된다.
- [ ] lint, 링크 검사, production build, local/production HTML 검증이 통과한다.
- [ ] 변경 커밋이 origin/main에 push되고 Vercel production에 반영된다.
