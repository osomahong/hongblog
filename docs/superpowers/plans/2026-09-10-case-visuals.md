# 사례 목업 구현 계획

**Goal:** 완료 상태 표시를 제거하고 사례 본문에 13개 설명용 실무 목업을 넣는다.
**Architecture:** src/lib/case-visuals.ts에 사례별 화면 내용, src/components/cases/CaseVisual.tsx에 화면 표현을 분리. 상세 섹션 다음에 렌더링.
**Tech Stack:** Next.js, React, TypeScript, Tailwind CSS.

- [x] 목록/상세 status 표시 제거.
- [x] 사례별 문서/시트/작업 화면 내용 구성. 가상 예시와 실제 수행 범위 구분.
- [x] 화면 공통 프레임 및 13개 목업 렌더링. 접근 가능한 표/캡션/앵커, 모바일 스크롤.
- [x] 독립 검토 후 수정. 빌드/타입/린트/링크/정보노출/브라우저 검수.
- [x] localhost 갱신 및 결과 보고.
