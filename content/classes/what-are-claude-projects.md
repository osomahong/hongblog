---
slug: what-are-claude-projects
term: Claude Projects 활용하기
definition: >-
  claude.ai에서 같은 자료, 지시, 대화 기록을 묶어 두는 작업 공간입니다. 매번 새 대화에서 컨텍스트를 다시 깔지 않고, 정해진 맥락
  위에서 일관된 결과를 받기 위한 기능입니다.
category: CLAUDE_EDUCATION
tags:
  - AI
  - 자동화
publishedAt: '2026-04-27T09:20:00.000Z'
updatedAt: '2026-07-23T00:00:00.000Z'
courseSlug: claude-in-practice
orderInCourse: 1
aliases:
  - Claude 프로젝트
  - claude.ai Projects
relatedTerms:
  - what-are-claude-skills
  - what-is-extended-thinking
  - claude-document-workflow
difficulty: BEGINNER
quiz:
  - question: 마케터가 매주 같은 형식의 광고 리포트를 정리하고 싶을 때 Projects를 어떻게 활용하면 가장 효율적일까요?
    options:
      - 회사 가이드라인, 과거 리포트 샘플, 정리 형식 지시를 프로젝트 자료에 한 번 넣어두고 매주 새 데이터만 추가
      - 매주 새 대화를 열어 처음부터 모든 지시를 다시 입력
      - 한 번 만든 결과물을 복사해 매주 직접 수정
      - Excel에 데이터만 정리하고 AI는 안 씀
    correctIndex: 0
    explanation: >-
      Projects는 같은 자료, 지시, 대화 기록을 묶어두는 작업 공간입니다. 매주 반복되는 작업의 공통 자료(가이드라인, 샘플, 형식)를 한
      번 넣어두면 매주 새 데이터만 추가해 일관된 결과를 빠르게 받을 수 있습니다. 이 패턴은 [Claude
      Skills](/class/claude-in-practice/what-are-claude-skills)와 함께 쓰면 더 강해집니다.
metaTitle: '클로드 프로젝트(Projects) 사용법: 자료 넣고 나만의 AI 작업 공간 만들기'
metaDescription: >-
  클로드 프로젝트는 자료와 지침을 미리 넣어두고 반복 사용하는 작업 공간입니다. 일반 대화와의 차이, 지식 파일 활용법, 직무별 활용 예시까지 정리했습니다.
ogImage: /og/what-are-claude-projects.png
summary3:
  - 'Claude Projects는 자료와 지시, 대화 기록을 하나로 묶어 두는 claude.ai의 작업 공간입니다.'
  - '프로젝트 지식에 올린 자료와 사용자 지정 지시가 그 안의 모든 대화에 적용되므로 회사 가이드라인을 매번 붙여 넣지 않아도 됩니다.'
  - '모든 작업을 한 프로젝트에 몰아넣거나 지시를 비워 두면 결과 형식이 매번 달라지므로 목적별로 나누고 지시를 한 번 제대로 적습니다.'
---

이 글은 앤트로픽이 운영하는 claude.com/resources의 Claude.ai 기능 안내를 한국 입문자가 보기 편하게 정리한 글입니다.

## 🤔 매번 같은 설명을 다시 하고 있나요?

AI에게 회사 보고서를 정리시킬 때마다 회사 가이드라인을 처음부터 다시 붙여 넣고, "이 형식으로", "이 어조로" 같은 지시를 매번 새로 적습니다. 같은 작업이 반복될수록 이 준비 과정이 부담이 됩니다.

Claude Projects는 이 준비를 한 번만 해두면 되도록 만든 기능입니다. 자주 하는 작업을 "프로젝트"라는 작업 공간으로 묶어두는 방식입니다.

## 🔑 Claude Projects, 무엇일까요?

**Claude Projects**는 claude.ai에서 같은 자료, 지시, 대화 기록을 묶어 두는 작업 공간입니다.

각 프로젝트는 다음 세 가지를 함께 가집니다.

- **프로젝트 지식 (Project Knowledge)**: 자주 쓰는 자료(PDF, 문서, 예시)를 업로드해 두는 자료실
- **사용자 지정 지시 (Custom Instructions)**: "이 프로젝트에서는 이렇게 답해 달라"는 시스템 프롬프트
- **대화 기록**: 그 프로젝트 안에서 진행한 대화가 모두 한곳에 모임

새 대화를 열면 자동으로 위 세 가지가 컨텍스트에 깔린 상태에서 시작합니다. 매번 자료를 다시 첨부하거나 지시를 다시 적을 필요가 없습니다.

## 🧱 프로젝트가 잘 맞는 작업의 4가지 특징

**1. 같은 자료를 반복해서 본다**
- 회사 가이드라인, 브랜드 가이드, 과거 보고서 같은 자료를 자주 참조해야 한다.

**2. 같은 형식으로 결과를 받고 싶다**
- 매번 같은 분량, 구조, 어조의 결과를 원한다.

**3. 작업이 단계로 이루어진다**
- 자료 정리 → 분석 → 보고서 초안 → 다듬기처럼 이어지는 작업이다.

**4. 다른 작업과 섞고 싶지 않다**
- 다른 주제 대화와 컨텍스트가 섞이지 않게 분리해두고 싶다.

이 네 가지 중 두 개 이상에 해당하면 프로젝트로 만들 가치가 충분합니다.

## ⚙️ 프로젝트 만드는 흐름

claude.ai에서 프로젝트는 다음 단계로 만듭니다.

**1. 좌측 사이드바에서 "Projects" 또는 "프로젝트" 클릭 후 새 프로젝트 생성**

**2. 프로젝트 이름과 설명 입력**
- 예: "주간 광고 리포트", "콘텐츠 캘린더 관리"

**3. 프로젝트 지식에 자료 업로드**
- 가이드라인 PDF, 과거 결과물 샘플, 참조 문서

**4. 사용자 지정 지시 작성**
- 역할, 형식, 제약을 [프롬프트 엔지니어링 기본](/class/claude-fundamentals/prompt-engineering-basics)의 다섯 요소대로 작성

**5. 첫 대화 시작**
- 자료와 지시가 자동으로 깔린 상태에서 작업 시작

## 💼 직무별 활용 시나리오

**마케터, 기획자**
- "주간 광고 리포트" 프로젝트: 회사 가이드라인 + 과거 리포트 샘플 + 정리 형식 지시. 매주 새 데이터만 던지면 동일 형식의 리포트가 나옵니다.
- "고객 리서치" 프로젝트: 페르소나 자료 + 과거 인터뷰 + 분석 프레임워크. 새 인터뷰를 넣으면 같은 시각으로 정리됩니다.

**디자이너, PM**
- "디자인 시스템" 프로젝트: 브랜드 가이드 + 컴포넌트 명세 + 사례. 새 화면 설계 시 일관된 어휘로 의견을 받습니다.
- "PRD 작성" 프로젝트: 회사 PRD 템플릿 + 과거 PRD 사례 + 검토 체크리스트. 새 기능 PRD 초안을 표준 형식으로 받습니다.

**교육 종사자**
- "수업 자료 만들기" 프로젝트: 학생 수준 정의 + 수업 톤 가이드 + 과거 자료. 새 주제를 넣으면 같은 결을 가진 자료가 나옵니다.

## 🔁 Projects + Skills, 더 강하게 묶기

같은 작업을 매번 자동화하고 싶다면 Projects 위에 [Claude Skills](/class/claude-in-practice/what-are-claude-skills)를 더할 수 있습니다.

- **Projects**: 자료, 지시, 기록의 컨테이너
- **Skills**: 작업 단위(매크로)의 재사용

예를 들어 "주간 광고 리포트" 프로젝트 안에 "리포트 생성" 스킬을 만들어두면, 새 데이터만 던지고 스킬을 호출해 한 번에 결과를 받을 수 있습니다.

긴 작업이라면 [Extended Thinking](/class/claude-in-practice/what-is-extended-thinking)을 함께 사용 설정하면 추론 깊이가 늘어 결과 품질이 안정됩니다.

## ⚠️ 자주 하는 실수 3가지

**1. 모든 작업을 한 프로젝트에 몰아넣기**
- 서로 다른 작업을 한 프로젝트에 넣으면 자료가 섞여 답이 흐려집니다. 작업 단위로 분리하세요.

**2. 사용자 지정 지시를 비워두기**
- 자료만 올리고 지시를 비워두면 결과 형식이 매번 달라집니다. 5요소를 명시한 지시를 한 번 잘 써두는 게 가장 큰 차이를 만듭니다.

**3. 자료를 너무 많이 넣기**
- 프로젝트 지식이 너무 크면 [컨텍스트 윈도우](/class/claude-fundamentals/context-window-explained) 한도에 부담을 줍니다. 핵심 자료만 압축해 올립니다.

## 📋 3줄 요약

1. Claude Projects는 자료와 지시, 대화 기록을 하나로 묶어 두는 claude.ai의 작업 공간입니다.

2. 프로젝트 지식에 올린 자료와 사용자 지정 지시가 그 안의 모든 대화에 적용되므로 회사 가이드라인을 매번 붙여 넣지 않아도 됩니다.

3. 모든 작업을 한 프로젝트에 몰아넣거나 지시를 비워 두면 결과 형식이 매번 달라지므로 목적별로 나누고 지시를 한 번 제대로 적습니다.

## 📚 참고 자료

- Claude.ai 공식 안내: [https://claude.com/product/overview](https://claude.com/product/overview)
- Claude 활용 사례 모음: [https://claude.com/resources/use-cases](https://claude.com/resources/use-cases)
- Anthropic Academy: [https://www.anthropic.com/learn](https://www.anthropic.com/learn)
