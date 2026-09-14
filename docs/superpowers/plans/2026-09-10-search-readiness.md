# 검색 준비 점검 및 수정 계획

Goal: 클래스 성과 차이를 실측하고 사례 경로 배포 전 검증.
Architecture: 기존 콘텐츠 구조 유지, 구조화 데이터 및 메타 정합성 수정과 빌드 회귀검사 추가.
Tech: Next.js/TypeScript, GSC readonly API, HTML 분석.

- [x] GSC 성과조회, 빌드 기본 감사, 코드 경로 비교.
- [x] 전체 클래스 URL검사 및 공개 HTML/robots/sitemap 비교 완료.
- [x] 확인된 코스 구조화 데이터 오류 수정 및 사례 갱신일 정합성.
- [x] scripts/check-search-readiness.ts 추가 및 빌드검증, 의도적 실패 실험.
- [x] 결과보고서/검수/localhost 갱신, 배포 없음.
