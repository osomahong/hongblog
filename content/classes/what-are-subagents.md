---
slug: what-are-subagents
term: 서브에이전트 (Subagents) 알아보기
definition: >-
  한 작업의 부분을 따로 나눠 처리하는 보조 에이전트입니다. 주력 에이전트가 작업 전체를 조율하고, 서브에이전트들이 코드 검토, 자료 조사,
  테스트 작성 같은 부분 작업을 동시에 처리해 결과를 합칩니다.
category: CLAUDE_EDUCATION
tags:
  - AI
  - 바이브코딩
publishedAt: '2026-04-27T09:34:00.000Z'
courseSlug: claude-code-for-everyone
orderInCourse: 5
aliases:
  - Subagents
  - 서브 에이전트
  - 보조 에이전트
relatedTerms:
  - slash-commands-explained
  - what-are-hooks
  - claude-code-memory
difficulty: BEGINNER
quiz:
  - question: 서브에이전트가 가장 큰 효과를 내는 작업 유형은 무엇일까요?
    options:
      - 코드 작성·검토·테스트처럼 성격이 다른 부분을 동시에 진행해야 하는 큰 작업
      - 한 줄 답변이 필요한 단순 질문
      - 파일 이름 확인
      - 짧은 번역
    correctIndex: 0
    explanation: >-
      서브에이전트는 주력 에이전트가 큰 작업을 작은 부분으로 나눠 보조 에이전트들에게 동시에 맡기고 결과를 합치는 구조입니다. 코드
      작성·검토·테스트처럼 성격이 다른 부분을 동시에 진행해야 하는 큰 작업에서 효과가 큽니다. 단순 질문이나 한 줄 작업에는
      서브에이전트가 과합니다.
ogImage: /og/what-are-subagents.png
---

이 글은 앤트로픽이 운영하는 code.claude.com/docs의 Subagents·Agent SDK 자료를 한국 비개발자 입문자가 보기 편하게 정리한 글입니다.

## 🤔 한 명이 다 하면 너무 느리지 않나요?

큰 작업을 한 번에 시키면 Claude Code가 차례대로 처리합니다. 코드 작성 → 검토 → 테스트 → 커밋 메시지 작성 순서로. 한 단계가 끝나야 다음이 시작되니 시간이 오래 걸립니다.

서브에이전트는 이 흐름을 동시 작업으로 바꾸는 구조입니다. 주력 에이전트가 큰 작업을 작은 부분으로 나눠 여러 보조 에이전트에 한꺼번에 맡기고, 결과를 모아 합치는 방식입니다.

## 🔑 서브에이전트, 무엇일까요?

**서브에이전트(Subagents)**는 한 작업의 부분을 따로 나눠 처리하는 **보조 에이전트**입니다. 앤트로픽 공식 안내는 다음과 같이 설명합니다.

> "Spawn multiple Claude Code agents that work on different parts of a task simultaneously. A lead agent coordinates the work, assigns subtasks, and merges results."

핵심 구조는 다음과 같습니다.

- **주력 에이전트(Lead Agent)**: 작업 전체를 조율하고 부분 작업을 분배
- **서브에이전트(Subagent)**: 분배된 부분 작업을 동시에 처리
- **결과 병합**: 주력 에이전트가 부분 결과를 모아 최종 결과물 생성

## 🧰 어떤 서브에이전트를 만들 수 있나요?

서브에이전트는 작업 성격에 따라 자유롭게 만들 수 있습니다. 자주 쓰이는 유형은 다음과 같습니다.

**1. 코드 검토 (Code Reviewer)**
- 새로 작성된 코드의 품질·보안·표준 준수를 점검.

**2. 테스트 작성 (Tester)**
- 새 코드에 대한 단위 테스트·통합 테스트를 작성.

**3. 자료 조사 (Researcher)**
- 회사 가이드라인·외부 문서를 검색해 결과 자료 수집.

**4. 빌드 오류 해결 (Build Error Resolver)**
- 빌드 실패 시 오류 메시지를 분석해 최소 수정 제안.

**5. 보안 검토 (Security Reviewer)**
- 비밀번호 노출, 인젝션 위험, 권한 누락을 점검.

**6. 문서 작성 (Doc Writer)**
- 코드 변경에 따른 README·CLAUDE.md 갱신.

각 서브에이전트는 자기 영역에서 전문가처럼 동작하도록 별도 지시가 들어갑니다.

## 📂 서브에이전트는 어디 정의되어 있나요?

프로젝트 단위로 서브에이전트를 정의하려면 다음 폴더를 씁니다.

- `.claude/agents/` 폴더 안에 마크다운 파일로 작성
- 예: `.claude/agents/code-reviewer.md` → "code-reviewer" 서브에이전트 등록

각 마크다운 파일은 다음 구조를 가집니다.

- 서브에이전트 이름·설명·역할
- 사용 시점("이 에이전트를 언제 호출하는지")
- 작업 절차

[Claude Code](/class/claude-code-for-everyone/what-is-claude-code)의 주력 에이전트가 작업 맥락에 맞춰 어느 서브에이전트를 호출할지 결정합니다.

## 🔁 서브에이전트가 동작하는 흐름

**시나리오: 새 기능 추가**

"이 프로젝트에 결제 기능 추가해 줘"라는 큰 요청을 받으면 다음 흐름이 진행됩니다.

**1. 주력 에이전트 분석**
- 작업을 부분으로 나눔: 코드 작성, 보안 검토, 테스트 작성, 문서 갱신.

**2. 서브에이전트 동시 호출**
- 코드 작성 에이전트, 보안 에이전트, 테스트 에이전트, 문서 에이전트가 동시에 시작.

**3. 부분 결과 합치기**
- 각 서브에이전트가 결과를 돌려주면 주력 에이전트가 충돌 없이 합칩니다.

**4. 최종 결과**
- 사용자에게 한 묶음으로 보여줌.

이 구조 덕분에 한 명이 차례로 다 하는 것보다 시간·품질이 모두 좋아집니다.

## 🔗 [슬래시 명령](/class/claude-code-for-everyone/slash-commands-explained)과의 묶음

슬래시 명령 안에서 서브에이전트를 호출할 수 있습니다. 예를 들어 `/review-pr` 명령 안에 다음을 정의해두면 한 번의 호출로 여러 서브에이전트가 동시에 동작합니다.

- 코드 검토 서브에이전트
- 보안 검토 서브에이전트
- 테스트 누락 서브에이전트

회사 표준 PR 리뷰가 한 명령으로 자동화됩니다. 자동 실행 규칙은 [Hooks](/class/claude-code-for-everyone/what-are-hooks)에서 다룹니다.

## 💼 활용 시나리오 3가지

**1. 다중 파일 리팩터링**
- 코드 작성 + 코드 검토 + 테스트 작성 서브에이전트가 동시에 동작.

**2. PR 자동 리뷰**
- 보안·품질·테스트 누락 점검을 동시에 진행해 한 번에 리뷰 결과 반환.

**3. 회사 표준 적용 점검**
- 회사 코딩 표준·문서 표준·보안 표준을 각각 다른 서브에이전트가 점검.

비개발자도 자기 작업(블로그 글 검수, 회사 자료 정리)에 같은 패턴을 적용할 수 있습니다. 예: 글 검수 + 사실 확인 + 어조 통일을 각각 다른 서브에이전트로.

## ⚠️ 자주 하는 실수 3가지

**1. 서브에이전트를 너무 많이 만들기**
- 자주 쓰지 않는 서브에이전트가 많으면 호출 매칭이 흐려집니다. 핵심 5~7개 정도가 적당합니다.

**2. 역할이 겹치는 서브에이전트 등록**
- 코드 검토와 보안 검토가 같은 영역을 다루면 결과가 중복됩니다. 영역을 명확히 분리하세요.

**3. 결과 검증 단계 생략**
- 서브에이전트가 동시에 일하더라도, 합쳐진 결과는 사람이 한 번 검수해야 합니다. [책임감 있는 AI 사용](/class/claude-fundamentals/responsible-ai-use)의 원칙은 그대로 적용됩니다.

## 📋 30초 요약

1. **서브에이전트는 큰 작업의 부분을 따로 처리하는 보조 에이전트**입니다. 주력 에이전트가 작업을 나눠 동시에 맡기고 결과를 합치는 구조입니다.

2. **`.claude/agents/` 폴더 안 마크다운 파일로 정의**하고, [슬래시 명령](/class/claude-code-for-everyone/slash-commands-explained) 안에서 호출할 수 있습니다. 코드 검토·테스트·자료 조사·빌드 오류·보안·문서 같은 역할이 표준입니다.

3. **다중 파일 작업·PR 자동 리뷰·회사 표준 점검에서 가장 큰 효과**가 납니다. 너무 많이 만들지 말고, 역할이 겹치지 않게 분리하고, 결과는 반드시 사람이 검수하세요.

## 📚 참고 자료

- Subagents 안내: [https://code.claude.com/docs/en/sub-agents](https://code.claude.com/docs/en/sub-agents)
- Claude Code overview: [https://code.claude.com/docs/en/overview](https://code.claude.com/docs/en/overview)
- Agent SDK: [https://code.claude.com/docs/en/agent-sdk/overview](https://code.claude.com/docs/en/agent-sdk/overview)
