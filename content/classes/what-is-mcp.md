---
slug: what-is-mcp
term: MCP (Model Context Protocol) 이해하기
definition: >-
  AI 애플리케이션이 외부 시스템(데이터, 도구, 워크플로)과 연결되는 오픈소스 표준 규격입니다. Anthropic이 제안했고 다른 AI 회사들도
  채택해 "AI를 위한 USB-C 포트"로 불립니다.
category: CLAUDE_EDUCATION
tags:
  - AI
  - 자동화
publishedAt: '2026-04-27T09:36:00.000Z'
updatedAt: '2026-07-23T00:00:00.000Z'
courseSlug: claude-code-for-everyone
orderInCourse: 7
aliases:
  - MCP
  - Model Context Protocol
  - 모델 컨텍스트 프로토콜
relatedTerms:
  - what-are-claude-skills
  - what-is-claude-code
  - what-are-subagents
difficulty: BEGINNER
quiz:
  - question: MCP의 가장 정확한 비유는 무엇일까요?
    options:
      - 'AI 애플리케이션을 외부 시스템과 연결하는 표준 규격, 즉 "AI를 위한 USB-C 포트"'
      - 더 빠른 AI 모델 이름
      - Claude 전용 데이터베이스
      - 음성 인식 전용 표준
    correctIndex: 0
    explanation: >-
      MCP는 modelcontextprotocol.io 공식 페이지에서 직접 사용하는 비유로 "AI를 위한 USB-C 포트"입니다.
      USB-C가 어떤 기기든 같은 방식으로 연결할 수 있게 해 주듯, MCP는 어떤 AI 애플리케이션이든 같은 방식으로 외부
      시스템(노션, 슬랙, DB, 파일 시스템 등)에 연결할 수 있도록 한 표준 규격입니다. 모델, DB, 음성 인식과는 다른 영역입니다.
metaTitle: 'MCP 뜻: AI를 외부 도구와 연결하는 표준 규격'
metaDescription: >-
  MCP(Model Context Protocol)는 AI를 노션, 슬랙, DB 같은 외부 시스템과 연결하는 표준 규격입니다. USB-C 비유로 개념을 잡고, 무엇이 가능해지고 어떻게 시작하는지 정리했습니다.
ogImage: /og/what-is-mcp.png
summary3:
  - 'MCP는 AI 애플리케이션이 외부 데이터와 도구에 연결되는 오픈소스 표준 규격이고 앤트로픽이 처음 제안했습니다.'
  - 'Claude와 ChatGPT, VS Code와 Cursor가 이미 지원하므로 한 번 만든 연결을 여러 도구에서 그대로 씁니다.'
  - '비개발자는 MCP를 직접 만들기보다 노션이나 슬랙처럼 이미 나와 있는 서버를 골라 연결해 씁니다.'
---

이 글은 modelcontextprotocol.io 공식 페이지와 앤트로픽 platform.claude.com/docs의 MCP 자료를 한국 입문자가 보기 편하게 정리한 글입니다.

## 🤔 AI한테 회사 노션, 슬랙을 보여줄 수 없을까요?

AI에게 회사 일을 시키려면 회사가 가진 자료에 접근할 수 있어야 합니다. 하지만 매번 노션 페이지를 복사해 붙여 넣고, 슬랙 메시지를 다시 옮겨 적기는 부담입니다.

이상적으로는 AI가 회사 노션, 슬랙, 데이터베이스를 직접 읽고 쓸 수 있으면 됩니다. 다만 그렇게 하려면 각 도구마다 별도 연결 코드를 짜야 합니다. 도구가 늘어날수록 연결의 복잡도가 폭발적으로 늘어납니다.

이 문제를 한 번에 푸는 표준이 MCP입니다.

## 🔑 MCP, 한 줄로 보면

**MCP(Model Context Protocol)**는 AI 애플리케이션이 외부 시스템(데이터, 도구, 워크플로)과 연결되는 **오픈소스 표준 규격**입니다.

modelcontextprotocol.io 공식 페이지는 다음 비유로 설명합니다.

> "Think of MCP like a USB-C port for AI applications. Just as USB-C provides a standardized way to connect electronic devices, MCP provides a standardized way to connect AI applications to external systems."

USB-C가 모니터, 키보드, 외장하드를 한 케이블로 연결하듯, MCP는 어떤 AI든 어떤 외부 시스템과 같은 방식으로 연결합니다.

## 🌐 누가 만들었고 누가 쓰나요?

MCP는 앤트로픽이 처음 제안한 오픈 표준입니다. 다만 앤트로픽 전용은 아닙니다. 공식 페이지에 따르면 다음 도구들이 이미 MCP를 지원합니다.

- **AI 어시스턴트**: Claude, ChatGPT
- **개발 도구**: VS Code, Cursor, MCPJam
- **그 외 다양한 클라이언트와 서버**

한 번 MCP 서버를 만들면 Claude, ChatGPT, VS Code 모두에서 같이 쓸 수 있습니다. "한 번 만들면 어디서나"가 핵심 가치입니다.

## 🛠️ MCP가 가능하게 하는 것들

공식 페이지에 정리된 MCP 활용 예시는 다음과 같습니다.

- **에이전트가 Google Calendar, Notion에 접근**해 더 개인화된 비서 역할
- **[Claude Code](/class/claude-code-for-everyone/what-is-claude-code)가 Figma 디자인을 보고 웹 앱 코드를 생성**
- **사내 챗봇이 여러 부서 데이터베이스를 동시에 조회**해 분석 결과 제공
- **AI가 Blender에서 3D 디자인을 만들고 3D 프린터로 출력**

이 모든 일이 도구마다 별도 연결 코드를 짜지 않고 MCP 표준 한 가지로 가능합니다.

## 📂 MCP의 두 가지 역할

MCP는 두 가지 역할로 나뉩니다.

**1. MCP 서버 (Server)**
- 외부 시스템(노션, 슬랙, DB)을 AI에 노출하는 쪽.
- "이 시스템에서 이런 데이터를 읽거나 쓸 수 있다"고 표준 규격으로 알리는 역할.

**2. MCP 클라이언트 (Client)**
- AI 애플리케이션 쪽.
- 서버가 노출한 데이터, 도구를 표준 방식으로 호출.

Claude는 MCP 클라이언트 역할을 하고, 노션, 슬랙, DB 같은 외부 시스템 옆에는 MCP 서버가 함께 동작합니다.

## 🧰 비개발자가 MCP를 만나는 경우

비개발자가 MCP를 직접 만들 일은 거의 없지만, **이미 만들어진 MCP 서버를 골라 연결**하는 일은 자주 합니다.

**1. 노션 MCP**
- Claude가 회사 노션 워크스페이스를 직접 보고 쓰게 함.

**2. 슬랙 MCP**
- 슬랙 채널의 메시지를 분석하거나, Claude가 직접 메시지를 보내게 함.

**3. 구글 캘린더 MCP**
- 일정 자동 조회, 추가.

**4. 깃허브 MCP**
- 이슈, PR 직접 다루기.

**5. 파일 시스템 MCP**
- 로컬 폴더 파일을 안전하게 다루기.

각 MCP 서버는 표준 규격을 따르므로, 한 번 연결하면 [Claude Code](/class/claude-code-for-everyone/what-is-claude-code), claude.ai, VS Code 어디서나 같이 동작합니다.

## 🔁 MCP 동작 흐름 시나리오

**시나리오: 회사 노션 + 슬랙 자동 정리**

월요일 아침 일정을 자동 정리하고 싶다고 가정합니다.

**1. 노션 MCP, 슬랙 MCP 연결**
- 한 번만 설정.

**2. Claude에게 작업 요청**
- "오늘 노션 캘린더의 회의 일정을 정리해서 슬랙 #공지에 발송해 줘"

**3. 흐름 진행**
- Claude가 노션 MCP로 일정을 직접 조회
- 정리해서 슬랙 MCP로 메시지 발송
- 사용자는 결과만 확인

이 작업은 [슬래시 명령](/class/claude-code-for-everyone/slash-commands-explained), [Hooks](/class/claude-code-for-everyone/what-are-hooks), [Skills](/class/claude-in-practice/what-are-claude-skills)와 묶이면 매주 자동 실행으로 만들 수 있습니다.

## 🔗 [Skills](/class/claude-in-practice/what-are-claude-skills)와 어떻게 다를까요?

MCP와 Skills는 닮은 듯 역할이 다릅니다.

| 항목 | MCP | Claude Skills |
|---|---|---|
| **목적** | 외부 시스템과의 표준 연결 | 자주 쓰는 작업 단위의 재사용 |
| **단위** | 시스템, 도구 | 작업, 워크플로 |
| **예시** | 노션 MCP, 슬랙 MCP | "주간 광고 리포트" 스킬 |
| **묶임** | 스킬 안에서 호출됨 | MCP를 호출하는 상위 단위 |

Skills는 작업의 골격, MCP는 그 안에서 호출되는 외부 도구의 표준 연결이라고 보면 자연스럽습니다.

## ⚠️ MCP 사용 시 주의할 점

**1. 권한 범위 점검**
- MCP 서버가 회사 노션 전체에 쓰기 권한을 가지면 사고 위험이 큽니다. 읽기 전용, 특정 워크스페이스로 제한하세요.

**2. 인증 정보 분리**
- MCP 서버 설정에 들어가는 API 토큰, 키는 환경 변수로 분리합니다.

**3. 신뢰할 만한 서버만 연결**
- 외부에서 가져온 MCP 서버를 무작정 연결하면 보안 위험이 큽니다. 회사 보안 정책에 따라 검증된 서버만 쓰세요. [책임감 있는 AI 사용](/class/claude-fundamentals/responsible-ai-use)의 보안 기준이 그대로 적용됩니다.

**4. 로그, 기록 확보**
- MCP가 어떤 호출을 언제 했는지 기록을 남겨 사후 추적이 가능하게 합니다.

## 📋 3줄 요약

1. MCP는 AI 애플리케이션이 외부 데이터와 도구에 연결되는 오픈소스 표준 규격이고 앤트로픽이 처음 제안했습니다.

2. Claude와 ChatGPT, VS Code와 Cursor가 이미 지원하므로 한 번 만든 연결을 여러 도구에서 그대로 씁니다.

3. 비개발자는 MCP를 직접 만들기보다 노션이나 슬랙처럼 이미 나와 있는 서버를 골라 연결해 씁니다.

## 📚 참고 자료

- MCP 공식 페이지: [https://modelcontextprotocol.io/](https://modelcontextprotocol.io/)
- Claude Code의 MCP 통합: [https://code.claude.com/docs/en/mcp](https://code.claude.com/docs/en/mcp)
- Claude Connectors: [https://claude.com/docs/connectors/building](https://claude.com/docs/connectors/building)
