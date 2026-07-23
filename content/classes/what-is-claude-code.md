---
slug: what-is-claude-code
term: Claude Code (CLI 코딩 에이전트) 이해하기
definition: >-
  앤트로픽이 만든 에이전트형 코딩 도구입니다. 터미널, VS Code, JetBrains, 데스크톱 앱, 웹 어디서나 같은 엔진으로 동작하며,
  사용자의 코드베이스를 직접 읽고, 수정하고, 명령을 실행하고, 개발 도구와 연동합니다.
category: CLAUDE_EDUCATION
tags:
  - AI
  - 자동화
  - 바이브코딩
publishedAt: '2026-04-27T09:30:00.000Z'
updatedAt: '2026-07-23T00:00:00.000Z'
courseSlug: claude-code-for-everyone
orderInCourse: 1
aliases:
  - Claude Code
  - 클로드 코드
  - Anthropic CLI
relatedTerms:
  - claude-code-installation-basics
  - slash-commands-explained
  - what-is-mcp
difficulty: BEGINNER
quiz:
  - question: Claude Code가 ChatGPT, Gemini의 일반 코딩 답변과 가장 크게 다른 점은 무엇일까요?
    options:
      - 터미널에서 실제 파일을 읽고, 수정하고, 명령을 실행하며 사용자의 코드베이스 안에서 직접 일한다
      - 한국어를 더 잘한다
      - 더 빠르게 답한다
      - 무료로만 쓸 수 있다
    correctIndex: 0
    explanation: >-
      ChatGPT, Gemini는 코드 답변을 메시지로 돌려주고, 사용자가 그걸 복사해서 자기 환경에 옮겨 실행해야 합니다. Claude
      Code는 에이전트형 도구로 사용자의 터미널, IDE 안에서 실제 파일을 직접 읽고 수정하고 명령을 실행합니다. 이 차이가 다중 파일
      작업, 테스트 실행, 커밋까지 한 흐름으로 가능하게 만듭니다.
metaTitle: '클로드 코드(Claude Code) 뜻: 터미널에서 쓰는 AI 코딩 CLI'
metaDescription: >-
  클로드 코드는 터미널(CLI)에서 대화로 코딩을 시키는 앤트로픽의 AI 도구입니다. 일반 클로드와의 차이, 할 수 있는 일, 시작 방법까지 비개발자도 이해할 수 있게 정리했습니다.
ogImage: /og/what-is-claude-code.png
---

이 글은 앤트로픽이 운영하는 code.claude.com/docs와 platform.claude.com/docs의 Claude Code 공식 가이드를 한국 비개발자 입문자가 보기 편하게 정리한 글입니다.

## 🤔 ChatGPT한테 코딩 시키는 거랑 뭐가 다른가요?

비개발자도 ChatGPT에 코드를 부탁해 본 경험이 있을 겁니다. "이런 기능 만들고 싶어"라고 했더니 코드를 길게 답으로 돌려줍니다. 다음 단계가 문제입니다. 그 코드를 어디에 넣어야 할지, 어떻게 실행해야 할지를 다시 사람이 해야 합니다.

Claude Code는 이 다음 단계까지 같이 처리하는 도구입니다. 사용자의 컴퓨터 안에 들어와 파일을 직접 읽고, 수정하고, 명령을 실행합니다.

## 🔑 Claude Code, 한 줄 정의

**Claude Code**는 앤트로픽이 만든 **에이전트형 코딩 도구(agentic coding tool)**입니다. 공식 문서는 다음과 같이 설명합니다.

> "Claude Code is an agentic coding tool that reads your codebase, edits files, runs commands, and integrates with your development tools. Available in your terminal, IDE, desktop app, and browser."

핵심은 **"에이전트형"**이라는 단어입니다. 답을 돌려주고 끝나는 도구가 아니라, 코드베이스 안에 들어와 일을 직접 진행하는 도구라는 뜻입니다.

## 🌐 어디서 쓸 수 있나요?

Claude Code는 한 엔진을 다섯 가지 환경에서 같이 씁니다.

- **터미널 (CLI)**: macOS, Linux, Windows에서 명령어로 실행
- **VS Code 확장**: 에디터 안에서 인라인 diff, @-mention, 계획 검토
- **JetBrains 플러그인**: IntelliJ, PyCharm, WebStorm 등 IDE 통합
- **데스크톱 앱**: macOS, Windows 네이티브 앱, 여러 세션 동시 실행
- **웹**: claude.ai/code에서 브라우저로 실행, 모바일 iOS 앱 연동

같은 CLAUDE.md 파일, 설정, MCP 서버가 어느 환경에서나 그대로 작동합니다. 한 환경에서 시작한 작업을 다른 환경에서 이어 갈 수 있습니다.

## 🛠️ Claude Code가 잘하는 9가지

공식 문서에 정리된 활용 영역은 다음과 같습니다.

- **반복 작업 자동화**: 테스트 작성, lint 오류 수정, 의존성 업데이트, 릴리스 노트 작성
- **기능 추가, 버그 수정**: 자연어 요청 → 다중 파일 코드 작성 → 검증
- **커밋, PR 생성**: git 통합으로 변경 사항 stage, 커밋 메시지 작성, 브랜치 생성, PR 오픈
- **MCP 도구 연동**: 디자인 문서, 이슈 트래커, DB, 슬랙을 모두 한 자리에서
- **CLAUDE.md, Skills, Hooks 커스터마이징**: 회사 표준, 작업 흐름, 자동 검사 등록
- **에이전트 팀 운영**: 여러 [Subagent](/class/claude-code-for-everyone/what-are-subagents)가 작업 부분을 나눠 동시 진행
- **CLI 파이프, 스크립트**: Unix 철학을 따라 다른 명령과 체인 가능
- **Routines (스케줄)**: 매일 PR 리뷰, 야간 CI 실패 분석 같은 정기 작업
- **Remote Control, Channels**: 외부에서 모바일, 메신저로 진행 상황 조작

## 🧰 비개발자가 쉽게 시작하는 3가지 사용처

코드를 직접 안 짜는 사람도 Claude Code의 일부 능력을 곧장 쓸 수 있습니다.

**1. 폴더 안 파일 일괄 정리**
- "Downloads 폴더에서 PDF만 따로 모아 연도별로 분류해 줘"
- 사진, 자료 파일을 규칙대로 정리.

**2. 데이터 변환**
- "이 폴더 안의 CSV를 모두 합쳐서 한 시트로"
- 표 형식 변환, 정리.

**3. 문서 일괄 작업**
- "이 마크다운 파일들에서 오타를 모두 찾아 줘"
- 회사 자료, 블로그 글 일괄 검수.

[설치 첫걸음](/class/claude-code-for-everyone/claude-code-installation-basics) 클래스에서 비개발자도 따라할 수 있는 설치 단계를 다룹니다.

## 🔗 코스 3에서 다루는 다른 7가지

이 코스의 나머지 클래스는 Claude Code를 깊게 쓰는 데 필요한 7가지 개념을 차례로 다룹니다.

- [설치 첫걸음](/class/claude-code-for-everyone/claude-code-installation-basics)
- [슬래시 명령](/class/claude-code-for-everyone/slash-commands-explained)
- [Plan Mode](/class/claude-code-for-everyone/claude-code-plan-mode)
- [Subagents](/class/claude-code-for-everyone/what-are-subagents)
- [Hooks](/class/claude-code-for-everyone/what-are-hooks)
- [MCP](/class/claude-code-for-everyone/what-is-mcp)
- [Memory와 CLAUDE.md](/class/claude-code-for-everyone/claude-code-memory)

이 일곱이 Claude Code를 회사 표준 도구로 만드는 핵심입니다.

## 💼 Claude Code가 가장 큰 효과를 내는 자리

**1. 다중 파일 코드 작업**
- "이 프로젝트에 로그인 기능 붙여줘" → 여러 파일을 한 번에 작업.

**2. 반복 작업 자동화**
- 매주 같은 형식의 코드 검수, 릴리스 노트, 테스트 작성.

**3. 외부 도구 연동 작업**
- [MCP](/class/claude-code-for-everyone/what-is-mcp)로 노션, 슬랙, DB, Figma를 한 자리에서 다룸.

**4. CI 자동화**
- GitHub Actions, GitLab CI에 Claude Code를 끼워 넣어 PR 리뷰 자동화.

## ⚠️ 시작하기 전 알아둘 점

**1. 유료 구독 필요**
- 대부분 환경에서 Claude 구독 또는 Anthropic Console 계정이 필요합니다(2026년 4월 기준). 일부 무료 시도는 가능하지만 실무 사용은 유료 플랜이 표준입니다.

**2. 권한 관리**
- Claude Code는 사용자의 컴퓨터에 들어와 파일을 직접 다룹니다. 어떤 폴더, 도구를 허용할지 설치 단계에서 한 번 점검하세요.

**3. [책임감 있는 AI 사용](/class/claude-fundamentals/responsible-ai-use)의 검증 흐름**
- 자동화 결과를 그대로 사용하지 말고, 사람이 검수하는 단계를 흐름에 넣으세요.

## 📋 30초 요약

1. **Claude Code는 앤트로픽이 만든 에이전트형 코딩 도구**입니다. 코드 답을 돌려주는 게 아니라, 코드베이스 안에 들어와 파일을 직접 읽고 수정하고 명령을 실행합니다.

2. **터미널, VS Code, JetBrains, 데스크톱 앱, 웹 다섯 환경에서 같은 엔진이 동작합니다.** CLAUDE.md, 설정, MCP가 환경 사이를 따라옵니다.

3. **다중 파일 작업, 반복 자동화, 외부 도구 연동, CI 자동화에 가장 큰 효과**가 납니다. 비개발자도 폴더 정리, 데이터 변환, 문서 일괄 작업 같은 자리에 곧장 쓸 수 있습니다. 다음 클래스 [설치 첫걸음](/class/claude-code-for-everyone/claude-code-installation-basics)부터 따라가세요.

## 📚 참고 자료

- Claude Code overview: [https://code.claude.com/docs/en/overview](https://code.claude.com/docs/en/overview)
- Claude Code 공식 페이지: [https://code.claude.com/](https://code.claude.com/)
- Anthropic Academy: [https://www.anthropic.com/learn](https://www.anthropic.com/learn)
