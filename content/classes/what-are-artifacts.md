---
slug: what-are-artifacts
term: Artifacts (실시간 결과물 생성) 활용하기
definition: >-
  claude.ai 화면 한쪽에서 코드, 문서, HTML, SVG, 표 같은 결과물을 별도 패널로 띄워 보여주는 기능입니다. 대화 중에 만든 결과물을
  즉시 보고, 수정, 반복하며 다듬을 수 있습니다.
category: CLAUDE_EDUCATION
tags:
  - AI
  - 자동화
publishedAt: '2026-04-27T09:21:00.000Z'
updatedAt: '2026-07-23T00:00:00.000Z'
courseSlug: claude-in-practice
orderInCourse: 2
aliases:
  - Claude Artifacts
  - 아티팩트
relatedTerms:
  - what-are-claude-projects
  - claude-document-workflow
difficulty: BEGINNER
quiz:
  - question: Artifacts가 가장 큰 효과를 내는 작업 유형은 무엇일까요?
    options:
      - HTML 한 페이지나 SVG 다이어그램처럼 결과물을 즉시 시각으로 확인하면서 다듬어야 하는 작업
      - 단순 한 줄 답변이 필요한 사실 확인 질문
      - 대화 한 번에 끝나는 짧은 번역
      - 비밀번호 같은 민감 정보 입력
    correctIndex: 0
    explanation: >-
      Artifacts는 코드, HTML, SVG, 문서 같은 결과물을 별도 패널로 띄워 즉시 보고 다듬을 수 있는 기능입니다. 한 페이지
      HTML이나 다이어그램처럼 결과물을 시각으로 확인하며 반복 수정해야 하는 작업에서 가장 효과가 큽니다. 단순 사실 답변이나 짧은
      번역은 일반 답변 형식으로 충분합니다.
metaTitle: '클로드 아티팩트(Artifacts) 뜻과 사용법, 활용 예시'
metaDescription: '아티팩트(Artifacts)는 claude.ai 화면 한쪽 패널에 코드, 문서, HTML 같은 결과물을 띄워 주는 기능입니다. 여는 방법과 활용 예시를 정리했습니다.'
ogImage: /og/what-are-artifacts.png
---

이 글은 앤트로픽이 운영하는 claude.com/resources와 Claude.ai 기능 안내를 한국 입문자가 보기 편하게 정리한 글입니다.

## 🤔 답을 받았는데 결과를 어떻게 확인하죠?

AI에게 "한 페이지짜리 회사 소개 HTML을 만들어 달라"고 했더니 코드가 길게 출력됩니다. 이 코드를 메모장에 옮겨 저장하고 브라우저로 열어야 결과를 볼 수 있습니다. 수정 한 번 할 때마다 같은 과정을 반복합니다.

Artifacts는 이 번거로움을 없앤 기능입니다. 결과물이 화면 오른쪽 패널에 즉시 뜨고, 대화로 수정 지시를 내리면 바로 반영됩니다.

## 🔑 Artifacts, 무엇이 다른가요?

**Artifacts**는 claude.ai 화면 한쪽에서 코드, 문서, HTML, SVG, 표 같은 결과물을 별도 패널로 띄워 보여주는 기능입니다.

일반 답변은 메시지 한 덩어리로 끝납니다. Artifacts는 결과물이 별도 영역에 살아 있어 대화로 수정 지시를 내리면 그 영역이 즉시 갱신됩니다. 결과물이 길고 시각으로 확인해야 할 때 효과가 큽니다.

## 🎨 Artifacts가 다루는 결과물 5가지

**1. HTML 페이지**
- 회사 소개, 랜딩 페이지, 간단한 인터랙티브 데모

**2. 코드 (Python, JavaScript, SQL 등)**
- 함수 한 묶음, 스크립트, SQL 쿼리

**3. SVG 다이어그램**
- 플로우차트, 구조도, 아이콘

**4. 마크다운 문서**
- 보고서, 기획서, 회의록 정리본

**5. React 컴포넌트**
- 간단한 UI 부품(미리보기 포함)

이 다섯 가지가 Artifacts 패널에 살아 있는 결과물로 표시됩니다.

## 🔁 Artifacts의 반복 수정 흐름

Artifacts의 진짜 효과는 반복 수정에서 옵니다.

**1단계: 첫 결과 받기**
- "회사 소개 한 페이지 HTML을 만들어 달라" → 패널에 HTML 결과물 등장

**2단계: 시각으로 확인**
- 미리보기를 즉시 봄. "헤더가 너무 작다", "이 색은 빼고 싶다" 같은 피드백을 떠올림

**3단계: 자연어로 수정 지시**
- "헤더 폰트 크기를 두 배로", "보라색을 회색으로 바꿔 달라" → 패널이 즉시 갱신

**4단계: 만족할 때까지 반복**
- 수정, 확인을 빠르게 반복하며 결과를 다듬음

이 흐름은 디자인, 마케팅, 교육 자료 만들기에서 매우 효과적입니다.

## 💼 직무별 활용 시나리오

**마케터, 기획자**
- 캠페인 랜딩 페이지 시안: HTML 한 페이지로 빠르게 시안 제작 후 동료에게 미리보기 공유
- 광고 카피 비교표: 마크다운 표로 후보 카피 5종을 한 화면에서 비교

**디자이너, PM**
- 플로우차트 시안: SVG로 사용자 흐름을 그려 회의 자료로 활용
- 기능 명세서: 마크다운 문서로 PRD 초안을 즉시 보고 다듬음

**교육 종사자**
- 학생용 HTML 학습 자료: 인터랙티브 퀴즈가 들어간 한 페이지를 빠르게 제작
- 강의 슬라이드 초안: 마크다운으로 작성 후 슬라이드 도구로 옮김

## 🔗 Projects, Skills와의 묶음

Artifacts는 단독으로도 강력하지만 다른 기능과 묶으면 효과가 커집니다.

- **[Projects](/class/claude-in-practice/what-are-claude-projects) 안에서 사용**: 회사 가이드라인을 적용한 Artifacts를 일관된 톤으로 받음
- **[문서 워크플로](/class/claude-in-practice/claude-document-workflow)와 묶음**: PDF 자료를 분석한 결과를 Artifacts 마크다운으로 정리

이 흐름이 자리 잡으면 결과물 만드는 시간이 크게 줄어듭니다.

## ⚠️ Artifacts를 쓸 때 주의할 점

**1. 너무 큰 결과물은 한 번에 만들지 말 것**
- 한 페이지 분량이 적당합니다. 사이트 전체를 한 Artifact에 만들려고 하면 수정이 어려워집니다.

**2. 외부에 공유할 때는 다시 검수**
- Artifacts에서 만든 결과물을 그대로 회사 사이트나 외부에 발행하기 전에는 반드시 사람이 검수합니다.

**3. 민감 정보 입력 주의**
- Artifacts 안에 회사 보안 정보, 고객 개인정보를 직접 넣지 마세요. [책임감 있는 AI 사용](/class/claude-fundamentals/responsible-ai-use)의 보안 기준이 그대로 적용됩니다.

## 📋 30초 요약

1. **Artifacts는 코드, HTML, SVG, 문서 같은 결과물을 별도 패널로 띄워 시각 확인 + 즉시 수정을 가능케 하는 claude.ai 기능**입니다.

2. **반복 수정 흐름이 핵심 가치**입니다. 첫 결과 → 시각 확인 → 자연어 수정 → 즉시 갱신을 빠르게 반복하며 다듬습니다.

3. **[Projects](/class/claude-in-practice/what-are-claude-projects), [문서 워크플로](/class/claude-in-practice/claude-document-workflow)와 묶으면 효과가 커집니다.** 한 번에 너무 큰 결과물을 만들지 말고, 외부 공유 전에는 사람 검수가 필수입니다.

## 📚 참고 자료

- Claude.ai 공식 안내: [https://claude.com/product/overview](https://claude.com/product/overview)
- Claude 활용 사례 모음: [https://claude.com/resources/use-cases](https://claude.com/resources/use-cases)
- Anthropic Academy: [https://www.anthropic.com/learn](https://www.anthropic.com/learn)
