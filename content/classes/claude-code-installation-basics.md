---
slug: claude-code-installation-basics
term: Claude Code 설치 첫걸음 (터미널 입문 포함) 따라하기
definition: >-
  Claude Code를 처음 설치하고 실행하는 단계를 비개발자 눈높이로 정리한 가이드입니다. 터미널이 무엇인지부터 설치 명령 한 줄, 첫
  로그인, 첫 실행까지 다룹니다.
category: CLAUDE_EDUCATION
tags:
  - AI
  - 바이브코딩
publishedAt: '2026-04-27T09:31:00.000Z'
courseSlug: claude-code-for-everyone
orderInCourse: 2
aliases:
  - Claude Code 설치
  - claude code 시작
relatedTerms:
  - what-is-claude-code
  - slash-commands-explained
difficulty: BEGINNER
quiz:
  - question: Mac 사용자가 Claude Code를 설치하는 가장 표준적인 방법은 무엇일까요?
    options:
      - '터미널에서 curl -fsSL https://claude.ai/install.sh | bash 한 줄 실행'
      - App Store에서 검색해서 설치
      - 공식 사이트에서 dmg 파일 다운로드 후 더블클릭
      - 누군가가 메일로 보내주는 zip 파일 압축 해제
    correctIndex: 0
    explanation: >-
      앤트로픽 공식 가이드의 macOS·Linux 표준 설치 방법은 터미널에서 install.sh 한 줄 실행입니다. 데스크톱 앱은 별도
      다운로드 방법이 있지만 터미널 CLI 환경 설치는 install.sh 또는 brew install --cask claude-code가
      표준입니다. App Store나 메일 첨부는 공식 채널이 아닙니다.
ogImage: /og/claude-code-installation-basics.png
---

이 글은 앤트로픽이 운영하는 code.claude.com/docs/en/overview의 Claude Code 공식 설치 가이드를 한국 비개발자 입문자가 따라하기 쉽게 정리한 글입니다.

## 🤔 터미널이 뭔가요?

비개발자에게 Claude Code의 가장 큰 장벽은 도구 자체가 아니라 **터미널**이라는 단어입니다. 검은 화면에 글자만 나오는 그 창을 처음 보면 막막합니다.

터미널은 컴퓨터에게 글자로 명령을 내리는 창입니다. 마우스로 폴더를 더블클릭하는 대신 키보드로 "이 폴더 열어"라고 글자로 적는 방식입니다. 익숙해지면 마우스보다 빠릅니다.

## 🔑 설치 전에 알아둘 3가지

**1. Claude 구독 필요**
- 2026년 4월 기준 Claude Code 사용에는 Claude 구독(Pro 이상) 또는 Anthropic Console 계정이 필요합니다.

**2. 인터넷 연결 필요**
- 설치 단계에서 약 100~300MB 정도를 다운로드합니다.

**3. 터미널 권한**
- 설치 명령은 사용자 폴더 안에 파일을 만듭니다. 관리자 비밀번호를 묻지 않아도 됩니다.

## 💻 macOS·Linux 설치 (가장 쉬운 방법)

**1단계. 터미널 열기 (macOS)**
- Spotlight(Cmd + Space) 누르고 "터미널" 입력 → 엔터.

**2단계. 설치 명령 한 줄 실행**

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

복사해서 터미널에 붙여 넣고 엔터. 약 1~3분 정도 걸립니다.

**3단계. 새 터미널 창 열기**
- 설치 후에는 터미널을 닫고 다시 열어야 명령어가 인식됩니다.

**4단계. 첫 실행**

```bash
claude
```

이렇게만 입력하면 Claude Code가 시작됩니다. 첫 실행 시 로그인 안내가 나옵니다.

## 🪟 Windows 설치

**방법 1. PowerShell (가장 쉬움)**

```powershell
irm https://claude.ai/install.ps1 | iex
```

PowerShell을 시작 메뉴에서 검색해 열고 위 명령을 붙여 넣습니다.

**방법 2. WinGet**

```powershell
winget install Anthropic.ClaudeCode
```

**Windows 설치 시 주의**
- 네이티브 Windows 설치는 [Git for Windows](https://git-scm.com/downloads/win)가 먼저 설치되어 있어야 합니다.
- WSL(Windows Subsystem for Linux)에서는 macOS와 같은 install.sh 명령을 씁니다.

## 🍺 Homebrew 설치 (Mac 사용자가 이미 brew를 쓰고 있다면)

```bash
brew install --cask claude-code
```

Homebrew는 자동 업데이트가 안 되므로 가끔 직접 업데이트해야 합니다.

```bash
brew upgrade claude-code
```

## 🚀 첫 실행과 로그인

설치 후 처음 `claude` 명령을 실행하면 다음 흐름이 진행됩니다.

**1. 로그인 링크 안내**
- 터미널에 로그인 URL이 표시됩니다.

**2. 브라우저로 로그인**
- 그 URL을 브라우저에 붙여 넣어 클로드 계정으로 로그인.

**3. 인증 완료**
- 인증이 끝나면 터미널이 자동으로 진행됩니다.

**4. 작업 폴더 진입**
- 작업할 프로젝트 폴더로 이동한 뒤 `claude`를 다시 실행하면 그 폴더 안에서 Claude Code가 시작됩니다.

```bash
cd ~/Documents/my-project
claude
```

## 🧰 IDE에 설치할 때

터미널 CLI 외에 다음 환경도 같이 설치할 수 있습니다.

**VS Code**
- 확장 프로그램 검색에서 "Claude Code"로 검색해 설치.
- Cmd+Shift+P (Mac) 또는 Ctrl+Shift+P (Windows)로 명령 팔레트 열고 "Claude Code" 검색.

**JetBrains (IntelliJ·PyCharm·WebStorm)**
- 플러그인 마켓플레이스에서 "Claude Code" 검색해 설치.
- IDE 재시작 후 사용 가능.

**데스크톱 앱**
- claude.com/download에서 macOS/Windows 앱 다운로드.
- 시각적 diff 검토, 여러 세션 동시 실행, 스케줄 작업이 강합니다.

같은 CLAUDE.md 파일·MCP 설정이 모든 환경에서 그대로 작동합니다.

## 💼 비개발자를 위한 첫 작업 3가지

설치 후 다음 작업을 한 번씩 해보면 감을 잡을 수 있습니다.

**1. 폴더 분석**
- 작업 폴더에 들어가서 `claude` 실행 → "이 폴더에 어떤 파일이 있어?" 질문.

**2. 텍스트 파일 정리**
- 폴더 안 markdown 파일을 정리해 달라고 요청.

**3. 간단한 자동화**
- "downloads 폴더의 PDF만 골라 documents 폴더로 옮겨 줘" 같은 폴더 정리.

이 작업을 통해 Claude Code가 실제로 파일을 다루는 모습을 직접 보게 됩니다. 다음 클래스의 [슬래시 명령](/class/claude-code-for-everyone/slash-commands-explained)부터는 좀 더 본격적인 작업 방식을 다룹니다.

## ⚠️ 자주 마주치는 에러 3가지

**1. `claude: command not found`**
- 설치 후 새 터미널 창을 열지 않은 경우입니다. 터미널을 닫고 다시 여세요.

**2. Windows에서 `'irm' is not recognized`**
- PowerShell이 아니라 CMD에 명령을 입력한 경우입니다. PowerShell을 사용하세요.

**3. 로그인 화면이 뜨지 않음**
- 방화벽·VPN이 차단할 수 있습니다. VPN을 잠시 끄거나 다른 네트워크에서 시도해 보세요.

문제가 풀리지 않으면 공식 troubleshooting 페이지를 참고하세요(글 끝 참고 자료).

## 📋 30초 요약

1. **macOS·Linux는 터미널에 `curl -fsSL https://claude.ai/install.sh | bash` 한 줄, Windows는 PowerShell에 `irm https://claude.ai/install.ps1 | iex`** 한 줄로 설치 끝납니다.

2. **설치 후 새 터미널을 열고 `claude` 명령으로 첫 실행** → 브라우저에서 로그인 → 작업 폴더에 들어가 다시 `claude` 실행하면 시작됩니다.

3. **VS Code·JetBrains·데스크톱 앱·웹도 같은 엔진을 씁니다.** 폴더 분석, 텍스트 정리, 간단한 자동화 세 가지부터 손에 익히고 다음 클래스 [슬래시 명령](/class/claude-code-for-everyone/slash-commands-explained)으로 넘어가세요.

## 📚 참고 자료

- Claude Code overview·설치: [https://code.claude.com/docs/en/overview](https://code.claude.com/docs/en/overview)
- Quickstart: [https://code.claude.com/docs/en/quickstart](https://code.claude.com/docs/en/quickstart)
- Troubleshooting: [https://code.claude.com/docs/en/troubleshooting](https://code.claude.com/docs/en/troubleshooting)
