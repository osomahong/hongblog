---
slug: what-are-claude-skills
term: Claude Skills (재사용 가능한 작업 단위) 활용하기
definition: >-
  자주 시키는 작업을 폴더 단위로 묶어 두고, 필요할 때 Claude가 자동으로 불러 써먹게 만든 재사용 단위입니다. SKILL.md 파일과
  보조 스크립트, 자료로 구성되며, claude.ai와 Claude Code 양쪽에서 쓸 수 있습니다.
category: CLAUDE_EDUCATION
tags:
  - AI
  - 자동화
publishedAt: '2026-04-27T09:22:00.000Z'
updatedAt: '2026-07-23T00:00:00.000Z'
courseSlug: claude-in-practice
orderInCourse: 3
aliases:
  - Agent Skills
  - SKILL.md
  - Claude 스킬
relatedTerms:
  - what-are-claude-projects
  - claude-cowork-overview
  - what-is-mcp
  - what-is-claude-code
difficulty: BEGINNER
quiz:
  - question: Claude Skills가 일반 프롬프트와 가장 다른 점은 무엇일까요?
    options:
      - 'SKILL.md 파일 + 보조 스크립트, 자료가 묶인 폴더로, Claude가 작업에 맞을 때 자동으로 불러서 쓴다'
      - 가격이 더 비싸다
      - 한국어를 더 잘한다
      - 인터넷 접속 기능이 추가된다
    correctIndex: 0
    explanation: >-
      Skills는 SKILL.md 파일을 핵심으로 한 폴더로, 보조 스크립트, 자료를 함께 담을 수 있고 Claude가 작업 맥락에 맞는
      스킬을 자동으로 골라 호출합니다. 일반 프롬프트는 매번 사용자가 다시 적어야 하지만, Skills는 한 번 만들면 작업 환경 전체에서
      재사용 됩니다. 가격, 언어, 접속 기능과는 직접 관련이 없습니다.
metaTitle: '클로드 스킬(Claude Skills) 뜻과 만드는 방법'
metaDescription: '클로드 스킬(Claude Skills)은 자주 시키는 작업을 폴더 단위로 묶어 Claude가 자동으로 불러 쓰게 만든 재사용 단위입니다. 구조와 만드는 순서를 정리했습니다.'
ogImage: /og/what-are-claude-skills.png
---

이 글은 앤트로픽이 운영하는 claude.com/blog의 Skills 공식 발표와 Anthropic Academy 자료를 한국 입문자가 보기 편하게 정리한 글입니다.

## 🤔 같은 작업을 매번 다시 설명하고 있나요?

회사 글 검수, 회의록 정리, 광고 리포트 요약 같은 작업을 매주 시킬 때마다 같은 지시를 다시 적습니다. 잘 됐던 프롬프트를 노션에 적어두고 복사해 쓰는 사람도 있지만, 그조차 매번 붙여 넣어야 합니다.

Claude Skills는 이 반복을 끝낸 기능입니다. 잘 됐던 프롬프트를 한 번 만들어두면 Claude가 작업에 맞을 때 알아서 그 스킬을 불러 적용합니다.

## 🔑 Claude Skills, 무엇일까요?

**Claude Skills**는 자주 시키는 작업을 **폴더 단위로 묶어 두고, 필요할 때 Claude가 자동으로 불러 써먹게 만든 재사용 단위**입니다.

앤트로픽 공식 발표는 Skills를 다음과 같이 설명합니다.

> "Skills are composable, portable, efficient, and powerful... folders containing instructions, scripts, and resources that Claude can load when relevant to a task."

즉 스킬은 단순 프롬프트가 아니라 **지시, 스크립트, 자료를 담은 폴더**입니다. 코드도 함께 담을 수 있어 토큰 생성보다 코드 실행이 더 안정적인 작업(파일 변환, 표 정리, 계산)에 유리합니다.

## 🧱 Skills의 핵심 구조

스킬 폴더 안에는 다음이 들어갑니다.

- **`SKILL.md`** (필수): 스킬의 이름, 설명, 사용 시점, 작업 절차를 적은 마크다운 파일
- **참조 자료**: 예시, 가이드라인, 체크리스트 같은 추가 자료
- **보조 스크립트**: 코드 실행이 필요한 경우 Python, Bash 스크립트
- **출력 템플릿**: 결과물 형식이 정해진 경우 템플릿 파일

`SKILL.md`의 첫 부분에 적힌 설명을 보고 Claude가 이 스킬이 현재 작업에 맞는지 자동으로 판단합니다.

## 🔁 Skills가 동작하는 흐름

**1단계: 사용자가 일반 지시를 보냄**
- "이번 주 광고 리포트 정리해 줘"

**2단계: Claude가 사용 가능한 스킬을 자동으로 스캔**
- 등록된 스킬 중 "주간 광고 리포트" 스킬이 매치됨

**3단계: 그 스킬의 SKILL.md를 컨텍스트에 로드**
- 회사 가이드라인, 형식 지시, 보조 스크립트가 함께 깔림

**4단계: 작업 수행**
- 스킬에 정의된 절차대로 결과물 생성

**5단계: 결과 반환**
- 매번 같은 형식의 결과를 받음

이 흐름은 사용자가 별도로 "이 스킬을 써 달라"고 명시할 필요가 없습니다.

## 🌐 Skills를 쓸 수 있는 자리

앤트로픽 공식 안내에 따르면 Skills는 다음 환경에서 사용할 수 있습니다.

- **Claude.ai 앱**: Pro, Max, Team, Enterprise 플랜
- **[Claude Code](/class/claude-code-for-everyone/what-is-claude-code)**: 플러그인 또는 수동 설치 방식
- **Claude Developer Platform / API**: Code Execution Tool 베타 환경

같은 스킬을 한 번 만들면 위 세 환경에서 같이 재사용됩니다.

## 💼 직무별 활용 시나리오

**마케터, 기획자**
- "주간 광고 리포트" 스킬: 회사 형식 + 검토 체크리스트. 매주 데이터만 던지면 동일 형식 결과
- "콘텐츠 캘린더 정리" 스킬: 우리 회사 채널, 톤 가이드 + 일정 양식

**디자이너, PM**
- "PRD 초안 생성" 스킬: 회사 PRD 템플릿 + 검토 항목. 새 기능 이름만 던지면 표준 PRD가 나옴
- "디자인 리뷰 체크리스트" 스킬: 브랜드 가이드 + 접근성 점검 항목

**교육 종사자**
- "강의 자료 만들기" 스킬: 학생 수준 정의 + 강의 톤 + 퀴즈 형식. 새 주제만 던지면 동일 결의 자료
- "수업 평가 초안" 스킬: 평가 기준 + 피드백 양식

**개발자**
- "코드 리뷰 체크리스트" 스킬: 회사 코딩 표준 + 보안 점검 항목
- "릴리스 노트 정리" 스킬: 형식 가이드 + 변경 분류 기준

## 🔗 Projects, MCP와의 관계

Skills는 다른 두 기능과 묶일 때 효과가 커집니다.

- **[Projects](/class/claude-in-practice/what-are-claude-projects) + Skills**: 프로젝트 안에서만 쓰는 전용 스킬을 만들어 컨텍스트와 자동화를 한 번에 묶음
- **[MCP](/class/claude-code-for-everyone/what-is-mcp) + Skills**: 외부 도구(노션, 슬랙, DB) 연결을 스킬 안에서 호출해 한 번의 명령으로 외부 시스템까지 자동화

스킬은 작은 단위지만 여러 기능을 묶는 접착제 역할을 합니다.

## ⚠️ 스킬 만들 때 주의할 점

**1. 한 스킬에 너무 많은 일을 넣지 말기**
- 한 스킬은 하나의 작업 단위에 집중해야 합니다. 너무 큰 스킬은 Claude가 정확히 매치하기 어렵습니다.

**2. SKILL.md 첫 줄 설명을 정확히**
- Claude가 스킬을 자동 매치할 때 SKILL.md 첫 부분 설명을 봅니다. "언제 이 스킬을 써야 하는지"를 분명히 적어야 잘못된 호출을 피할 수 있습니다.

**3. 보안 정보 포함 금지**
- API 키, 비밀번호, 고객 정보를 스킬 안에 넣지 마세요. 환경 변수로 분리합니다.

## 📋 30초 요약

1. **Claude Skills는 자주 시키는 작업을 폴더 단위로 묶은 재사용 단위**입니다. SKILL.md + 보조 스크립트, 자료로 구성되며, Claude가 작업 맥락에 맞을 때 자동으로 불러 적용합니다.

2. **claude.ai 앱, [Claude Code](/class/claude-code-for-everyone/what-is-claude-code), Developer Platform 세 환경에서 같이 쓸 수 있습니다.** 한 번 만들면 작업 환경 전체에 재사용됩니다.

3. **[Projects](/class/claude-in-practice/what-are-claude-projects)와 [MCP](/class/claude-code-for-everyone/what-is-mcp)에 묶이면 자동화 깊이가 커집니다.** 한 스킬은 하나의 작업 단위에 집중하고, 보안 정보는 절대 안에 넣지 않는 게 표준 원칙입니다.

## 📚 참고 자료

- Claude Skills 공식 발표: [https://claude.com/blog/skills](https://claude.com/blog/skills)
- Anthropic Academy: [https://www.anthropic.com/learn](https://www.anthropic.com/learn)
- Claude 활용 사례 모음: [https://claude.com/resources/use-cases](https://claude.com/resources/use-cases)
