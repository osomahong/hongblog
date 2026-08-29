---
slug: claude-code-plan-mode
term: Plan Mode (실행 전 검토 단계) 활용하기
definition: >-
  Claude Code가 실제로 파일을 수정하기 전에 무엇을 어떻게 바꿀지 계획만 먼저 보여주는 모드입니다. 사용자가 계획을 검토, 승인한
  뒤에야 실제 변경이 진행됩니다.
category: CLAUDE_EDUCATION
tags:
  - AI
  - 바이브코딩
publishedAt: '2026-04-27T09:33:00.000Z'
courseSlug: claude-code-for-everyone
orderInCourse: 4
aliases:
  - Plan Mode
  - 플랜 모드
  - 검토 모드
relatedTerms:
  - slash-commands-explained
  - what-is-claude-code
difficulty: BEGINNER
quiz:
  - question: Plan Mode가 가장 큰 효과를 내는 자리는 어디일까요?
    options:
      - 여러 파일을 동시에 수정하거나 되돌리기 어려운 큰 변경 작업 전에
      - 한 줄 짜리 단순 오타 수정
      - 파일 이름 확인
      - 간단한 질문 답변
    correctIndex: 0
    explanation: >-
      Plan Mode는 실제 변경 전에 계획을 먼저 검토하는 모드입니다. 여러 파일을 동시에 수정하는 큰 작업, 되돌리기 어려운 변경,
      비개발자가 영향 범위를 미리 확인하고 싶을 때 가장 큰 효과가 납니다. 한 줄 오타 수정이나 단순 질문에는 일반 모드로 충분합니다.
metaTitle: '클로드 코드 플랜 모드(Plan Mode) 뜻과 활용 시점'
metaDescription: '플랜 모드(Plan Mode)는 Claude Code가 파일을 수정하기 전에 계획만 먼저 보여주는 기능입니다. 실행 전 검토 흐름과 실수를 줄이는 활용 시점을 정리했습니다.'
ogImage: /og/claude-code-plan-mode.png
summary3:
  - 'Plan Mode는 Claude Code가 파일을 고치기 전에 무엇을 어떻게 바꿀지 계획만 먼저 보여주고 승인을 기다리는 모드입니다.'
  - '슬래시 명령 /plan이나 Shift+Tab 단축키로 들어가며 여러 파일을 한꺼번에 바꾸거나 되돌리기 어려운 변경을 할 때 효과가 큽니다.'
  - '계획서는 형식만 보지 말고 어떤 파일이 왜 바뀌는지까지 확인하고 100개가 넘는 파일을 한 번에 바꾸는 계획이면 단계로 나눕니다.'
---

이 글은 앤트로픽이 운영하는 code.claude.com/docs의 Plan Mode 자료를 한국 비개발자 입문자가 보기 편하게 정리한 글입니다.

## 🤔 큰 작업을 시키기 전에 미리 보고 싶다면

Claude Code는 사용자의 코드베이스 안에 들어와 파일을 직접 수정합니다. 작업이 커질수록 영향 범위도 커집니다. "이 프로젝트에 로그인 기능 붙여 줘"라고 시켰을 때 어떤 파일이 새로 생기고, 어떤 파일이 수정되는지 미리 알 수 있다면 안심됩니다.

Plan Mode는 이 자리를 채우는 모드입니다. 변경 자체를 시작하기 전에 **계획만 먼저 보여주고**, 사용자가 검토, 승인한 뒤에야 실제 변경을 진행합니다.

## 🔑 Plan Mode, 무엇일까요?

**Plan Mode**는 Claude Code가 실제로 파일을 수정하기 전에 **무엇을 어떻게 바꿀지 계획만 먼저 보여주는 모드**입니다. 다음과 같은 흐름으로 작동합니다.

**1. 사용자가 작업 요청**
- "로그인 기능을 추가해 달라"

**2. Claude Code가 계획 작성**
- 어떤 파일을 새로 만들지, 어떤 파일을 수정할지, 어떤 명령을 실행할지를 단계별로 정리한 계획서.
- 이때까지는 실제 파일이 수정되지 않습니다.

**3. 사용자 검토**
- 계획이 적절한지 봄. 수정, 재계획 요청 가능.

**4. 승인 후 실제 진행**
- 사용자가 OK 하면 그제서야 변경이 진행됩니다.

## 🚦 Plan Mode가 잘 맞는 자리

다음 작업에 Plan Mode가 특히 효과적입니다.

- **여러 파일을 동시에 수정하는 큰 작업**: 새 기능 추가, 리팩터링, 의존성 업그레이드
- **되돌리기 어려운 변경**: 데이터 마이그레이션, 빌드 설정 변경
- **비개발자가 변경 범위를 미리 확인**: 어떤 파일이 영향을 받는지 안심
- **회사 표준 검토 절차**: 계획을 동료에게 공유한 뒤 진행

반대로 다음 작업은 Plan Mode가 과합니다.

- 한 줄 오타 수정, 변수명 변경
- "이 폴더 안에 어떤 파일이 있어?" 같은 질문 답변

## 🛠️ 사용 방법

Claude Code 안에서 Plan Mode 진입은 보통 다음 중 하나입니다.

**1. `/plan` 슬래시 명령**
- 작업 시작 전에 `/plan`을 입력해 계획만 받기.

**2. 키보드 단축키 (Shift+Tab)**
- 일반 모드에서 Shift+Tab을 누르면 Plan Mode로 전환됩니다(터미널 환경 기준).

**3. IDE/데스크톱 앱의 토글**
- VS Code 확장, 데스크톱 앱에서는 화면 UI에서 Plan Mode 토글을 직접 켤 수 있습니다.

진입 후 `/exit-plan-mode` 또는 화면의 "실행" 버튼으로 계획을 승인하고 실제 진행을 시작합니다.

## 💼 비개발자에게 Plan Mode가 특히 유용한 이유

비개발자에게 Plan Mode는 단순히 안전장치 그 이상입니다.

**1. 영향 범위를 한국어로 미리 본다**
- 영문 코드 변경 내용을 한국어 설명으로 받으면, 어떤 파일이 어떻게 바뀌는지 쉽게 이해할 수 있습니다.

**2. "정말 이렇게 해도 되나?" 확인 단계**
- 자동화 도구에 너무 많은 권한을 준 건 아닌지 매 작업마다 점검할 수 있습니다.

**3. 동료, 상사와 공유 가능한 계획서**
- 계획서 자체를 복사해서 동료에게 공유하면 검토를 함께할 수 있습니다.

[책임감 있는 AI 사용](/class/claude-fundamentals/responsible-ai-use)의 검증 단계가 자연스럽게 워크플로 안에 들어옵니다.

## 🔁 Plan Mode 흐름 시나리오

**시나리오: 회사 블로그 자동 정리 작업**

블로그 폴더의 마크다운 파일을 회사 형식으로 일괄 정리하고 싶다고 가정합니다.

**1. 작업 요청**: "이 폴더 안의 모든 마크다운 파일을 회사 형식 가이드에 맞게 다듬어 줘"

**2. Plan Mode 진입**: `/plan` 입력

**3. 계획서 받기**:
- "47개 파일 발견"
- "각 파일에서 H1 제목 → H2로 변경"
- "참고 자료 섹션 통일"
- "예상 소요 시간 약 3분"

**4. 검토**: 47개라는 숫자가 예상과 맞는지, H1 → H2 변경이 의도와 맞는지 확인.

**5. 승인 후 진행**: 한 번에 47개 파일이 정리됩니다.

이 흐름은 [슬래시 명령](/class/claude-code-for-everyone/slash-commands-explained)과 묶이면 더 매끄러워집니다.

## ⚠️ Plan Mode 사용 시 주의할 점

**1. 계획서를 형식만 읽지 말고 의도까지 확인**
- 파일 이름이 비슷해 보여도 다른 폴더의 다른 파일일 수 있습니다. 경로를 한 번 점검하세요.

**2. 계획이 과도하게 클 때는 분할**
- 100개 이상의 파일을 한 번에 바꾸는 계획이 나오면, 단계로 나눠 진행하는 게 안전합니다.

**3. 외부 시스템 호출 검토**
- 계획에 외부 API 호출, [MCP](/class/claude-code-for-everyone/what-is-mcp) 도구 사용이 포함되어 있다면 권한 범위를 한 번 더 점검합니다.

## 📋 3줄 요약

1. Plan Mode는 Claude Code가 파일을 고치기 전에 무엇을 어떻게 바꿀지 계획만 먼저 보여주고 승인을 기다리는 모드입니다.

2. 슬래시 명령 /plan이나 Shift+Tab 단축키로 들어가며 여러 파일을 한꺼번에 바꾸거나 되돌리기 어려운 변경을 할 때 효과가 큽니다.

3. 계획서는 형식만 보지 말고 어떤 파일이 왜 바뀌는지까지 확인하고 100개가 넘는 파일을 한 번에 바꾸는 계획이면 단계로 나눕니다.

## 📚 참고 자료

- Claude Code overview: [https://code.claude.com/docs/en/overview](https://code.claude.com/docs/en/overview)
- Common workflows: [https://code.claude.com/docs/en/common-workflows](https://code.claude.com/docs/en/common-workflows)
- Best practices: [https://code.claude.com/docs/en/best-practices](https://code.claude.com/docs/en/best-practices)
