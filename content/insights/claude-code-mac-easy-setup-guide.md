---
slug: claude-code-mac-easy-setup-guide
title: 쉽게 설치하는 클로드코드 세팅가이드(맥)
excerpt: >-
  맥(Mac)에 클로드 코드(Claude Code)를 처음 설치하는 분을 위해, 터미널 실행부터 Homebrew, Git, Node.js 사전
  준비, 본체 설치, 한국어 설정, 첫 작업 시작까지 9단계로 단순하게 정리했습니다.
category: AI_TECH
tags:
  - AI
  - 바이브코딩
  - 자동화
publishedAt: '2026-05-08T15:49:04.000Z'
highlights:
  - >-
    터미널에서 Homebrew를 먼저 깔고 brew install git, brew install node 두 줄로 사전 준비를 끝낼 수
    있습니다.
  - >-
    설치 스크립트 한 줄(curl -fsSL https://claude.ai/install.sh | bash)로 클로드 코드 본체를 받고
    브라우저 로그인 한 번으로 계정을 연결합니다.
  - >-
    /config 한국어 설정과 앤트로픽 공식 스킬 마켓플레이스 등록까지 마치면 첫 작업을 바로 시작할 수
    있습니다.
quiz:
  - question: 맥에서 클로드 코드를 설치하기 전에 가장 먼저 깔아야 하는 것은 무엇일까요?
    options:
      - Homebrew (맥용 패키지 관리자)
      - Visual Studio Code
      - Docker Desktop
      - GitHub Desktop
    correctIndex: 0
    explanation: >-
      맥에는 윈도우의 winget 같은 기본 패키지 관리자가 없습니다. Homebrew를 먼저 설치해야 그 뒤 brew 명령으로 Git과
      Node.js를 깔 수 있고, 그 위에 클로드 코드를 올릴 수 있습니다.
metaTitle: 쉽게 설치하는 클로드코드 세팅가이드(맥) 9단계
metaDescription: >-
  맥에 클로드 코드를 설치하고 한국어로 첫 작업을 시작하는 9단계 가이드입니다. 터미널, Homebrew, Git, Node.js, 본체
  설치, /config 한국어, 공식 스킬 마켓플레이스 등록까지 포함합니다.
ogImage: /og/claude-code-mac-easy-setup-guide.png
ogTitle: 쉽게 설치하는 클로드코드 세팅가이드(맥) 9단계
ogDescription: >-
  터미널 실행부터 Homebrew, Git, Node.js 사전 준비, 클로드 코드 본체 설치, 한국어 설정, 첫 작업 시작까지 9단계로 정리한
  맥 입문 가이드입니다.
---

## AI시대에는 터미널과 친해져야 합니다

요즘 AI 도구를 본격적으로 쓰려고 하면, 점점 **터미널(Terminal)**이라는 검은 화면을 만나게 됩니다. [클로드 코드(Claude Code)](/class/claude-code-for-everyone/what-is-claude-code) (클로드 코드에 대한 설명 글 바로가기)도 그중 하나입니다. 평소 맥에서 Spotlight와 Finder로만 일을 처리해 오신 분이라면 처음에는 낯설게 느껴지지만, 그동안 클릭으로 하던 작업이 짧은 한 줄로 바뀌는 정도로 이해하시면 됩니다.

설치만 끝내면, 클로드 코드를 쓰는 일상은 평소 [claude.ai](https://claude.ai) 같은 웹 채팅과 거의 같습니다. 질문을 던지고 답을 받는 흐름은 동일하고, 화면만 브라우저가 아니라 터미널로 바뀌는 정도입니다.

맥에서 클로드 코드는 **설치가 전체에서 가장 손이 많이 가는 단계**이고, 그 한 번만 통과하면 다음부터는 익숙한 채팅형 AI처럼 쓸 수 있습니다. 아래 9단계를 순서대로 따라가 주세요. 중간에 막히는 메시지가 뜬다면 자주 발생하는 문제의 해결 방법을 글 끝의 [자주 발생하는 문제](#troubleshooting) 섹션에 따로 모아 두었으니 문제 발생 시 확인해 보세요.

> 클로드 코드(Claude Code)는 앤트로픽이 만든 터미널 기반 AI 코딩 도구입니다. 맥에서는 Homebrew를 깔고 `brew install git`, `brew install node`로 사전 도구를 받은 뒤 설치 스크립트 한 줄(`curl -fsSL https://claude.ai/install.sh | bash`)로 본체를 내려받고, 브라우저 로그인과 `/config` 한국어 설정만 마치면 첫 실행 준비가 끝납니다.

이 글은 맥(macOS)을 기준으로 합니다. 윈도우 PC를 쓰시는 분은 [윈도우용 가이드](/insights/claude-code-windows-easy-setup-guide) (윈도우에서 설치하는 방법 바로가기)를 참고하세요.

## Step 1. 터미널 실행

설치 작업은 모두 **터미널(Terminal)** 안에서 합니다. 맥에 기본으로 깔려 있는 도구입니다.

1. 키보드의 `⌘ Command + Space`를 누르세요. (Spotlight 검색)
2. "터미널" 또는 "Terminal"이라고 입력하세요.
3. 엔터를 눌러 터미널을 실행하세요.

✅ 성공 신호: 검은(또는 흰) 창이 열리고 깜빡이는 커서가 나타납니다. 이후 모든 명령어는 이 창에 입력합니다.

## Step 2. Homebrew와 Git 설치

맥에는 윈도우의 winget 같은 기본 패키지 관리자가 없습니다. 그래서 먼저 **Homebrew**라는 맥용 패키지 관리자를 설치한 뒤, 그것으로 [Git](/class/vibe-coding-basics/what-is-git)을 깝니다.

먼저 Homebrew 설치 명령어를 터미널에 복사해서 붙여넣고 엔터를 누르세요.

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

설치 도중 맥 비밀번호를 입력하라는 메시지가 나오면 비밀번호를 입력하세요. **입력 시 화면에는 아무것도 보이지 않는 것이 정상**입니다. 다 입력한 뒤 엔터를 누르세요.

설치가 끝나면 확인합니다.

```bash
brew --version
```

이어서 Git을 설치하세요.

```bash
brew install git
```

확인 명령어:

```bash
git --version
```

✅ 성공 신호: `brew --version`과 `git --version` 모두 버전 번호가 출력되면 사전 준비 절반이 끝났습니다.

## Step 3. Node.js 설치

Node.js는 클로드 코드와 함께 쓰는 npm 기반 도구나 자바스크립트 프로젝트를 다룰 때 필요한 환경입니다. Homebrew로 그대로 설치합니다.

```bash
brew install node
```

확인 명령어 3개를 하나씩 입력하세요.

```bash
node -v
```

```bash
npm -v
```

```bash
npx -v
```

✅ 성공 신호: 세 명령어 모두 버전 번호가 출력되면 사전 준비 끝입니다.

## Step 4. 클로드 코드 본체 설치

이제 본격적으로 클로드 코드를 설치합니다. 아래 한 줄을 터미널에 복사해서 붙여넣고 엔터를 누르세요.

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

설치가 끝나면 **터미널을 닫았다가 다시 열어** 주세요. (`⌘ Command + Q`로 종료한 뒤 다시 실행)

확인 명령어:

```bash
claude --version
```

✅ 성공 신호: 버전 번호가 출력되면 본체 설치 완료입니다.

## Step 5. 최초 실행과 로그인

터미널에 아래 명령어를 입력해 클로드 코드를 처음 실행해 보세요.

```bash
claude
```

실행하면 웹 브라우저가 자동으로 열립니다. 브라우저에서 앤트로픽 계정으로 로그인을 끝내고, 다시 터미널 창으로 돌아오세요. 로그인 정보가 자동으로 터미널에 전달됩니다.

✅ 성공 신호: 터미널 창에 클로드 코드 인터페이스가 떠 있고, 메시지를 입력할 수 있는 상태가 됩니다. 다음 단계로 넘어가기 위해 **Ctrl+C를 두 번** 눌러 클로드 코드를 종료하세요.

## Step 6. 언어를 한국어로 변경

기본 언어는 영어입니다. 한국어로 바꿔두면 응답과 설명이 모두 한국어로 나옵니다.

터미널에서 클로드 코드를 다시 실행하세요.

```bash
claude
```

클로드 코드 안에서 아래를 입력하세요.

```text
/config
```

설정 화면이 뜨면 **언어(Language)** 항목에서 한국어를 선택하세요. 화살표 키로 이동, 스페이스로 선택, 엔터로 저장하는 방식입니다.

✅ 성공 신호: 설정 저장 후 클로드 코드의 안내 문구가 한국어로 바뀝니다. 마치고 **Ctrl+C 두 번**으로 종료하세요.

## Step 7. 필수 스킬 설치

스킬은 클로드 코드 안에서 자주 쓰는 작업 흐름을 슬래시(`/`) 명령으로 묶어 둔 기능입니다. 앤트로픽 공식 스킬 마켓플레이스를 등록한 뒤, 입문자에게 도움이 되는 예시 스킬 모음을 한 번에 설치합니다.

터미널에서 클로드 코드를 다시 실행하세요.

```bash
claude
```

클로드 코드 안에서 다음 명령으로 마켓플레이스를 등록합니다.

```text
/plugin marketplace add anthropics/skills
```

등록이 끝나면 예시 스킬 모음을 설치합니다.

```text
/plugin install example-skills@anthropic-agent-skills
```

✅ 성공 신호: 슬래시(`/`) 자동 완성 목록에 `/brainstorming`, `/writing-plan` 같은 새 명령이 추가됩니다. 마치고 **Ctrl+C 두 번**으로 클로드 코드를 종료하세요.

## Step 8. 프로젝트 폴더 만들고 클로드 실행

클로드 코드는 **현재 작업 폴더 단위로 실행**합니다. 글쓰기, 자료 정리, 자동화 어떤 용도든 작업할 폴더를 먼저 만들어 두는 편이 깔끔합니다.

터미널에서 아래 세 줄을 차례로 입력하세요.

```bash
mkdir -p ~/Projects/my-project
cd ~/Projects/my-project
claude
```

첫 줄은 홈 디렉터리 안에 폴더를 만들고, 둘째 줄은 그 폴더로 이동하고, 셋째 줄은 그 폴더 안에서 클로드 코드를 실행합니다.

✅ 성공 신호: 클로드 코드가 실행되면 자유롭게 대화하면서 작업할 수 있는 상태입니다. 첫 메시지로 `/brainstorming`을 입력해 한 번 사용해 보세요.

## Step 9. 자주 쓰는 조작법

설치를 마치면 일상에서 반복적으로 쓰게 되는 조작법은 다음 정도입니다.

**스킬 호출 (클로드 코드 실행 중에 입력)**

- `/skill-creator`: 새로운 스킬 만들기
- `/brainstorming`: 아이디어 발산
- `/writing-plan`: 글이나 작업의 구현 계획 세우기
- `/find-skills`: 새로운 스킬 검색하고 설치하기

**클로드 코드 종료**

`Ctrl+C`를 **두 번** 누르면 종료됩니다.

**다음에 다시 시작하려면**

터미널을 열고, 작업 폴더로 이동한 다음 `claude`를 입력하면 됩니다.

```bash
cd ~/Projects/my-project
claude
```

## 자주 묻는 질문 (AEO)

> Q. 클로드 코드는 맥의 어느 버전부터 설치할 수 있나요?
>
> A. macOS 13.0(Ventura) 이상에서 동작합니다. 그보다 낮은 버전이라면 macOS 업데이트를 먼저 하시는 편이 안전합니다. Apple Silicon(M1/M2/M3) 맥과 Intel 맥 모두 설치할 수 있습니다.

> Q. 비밀번호를 입력하는데 화면에 아무것도 보이지 않습니다. 정상인가요?
>
> A. 정상입니다. 맥 터미널은 보안을 위해 비밀번호 입력 시 별표(*)나 점(•)도 표시하지 않습니다. 그냥 비밀번호를 입력하고 엔터를 누르시면 됩니다.

> Q. M1, M2, M3 같은 Apple Silicon 맥과 Intel 맥은 설치 방법이 다른가요?
>
> A. 본 가이드의 명령어는 두 종류 맥에서 모두 그대로 동작합니다. 다만 Homebrew의 설치 위치가 달라서, Apple Silicon은 `/opt/homebrew`에, Intel 맥은 `/usr/local`에 자리잡습니다. 만약 "brew: command not found"가 나오면 트러블슈팅 섹션의 PATH 설정 명령어를 본인 칩에 맞춰 사용하시면 됩니다.

> Q. 맥 기본 셸이 zsh인데 bash로 바꿔야 하나요?
>
> A. 그대로 zsh로 사용하시면 됩니다. macOS 카탈리나(10.15) 이후의 기본 셸이 zsh이고, 클로드 코드와 Homebrew, Node.js 모두 zsh에서 정상 동작합니다. 이전 글이나 영상에서 `~/.bash_profile`을 편집하라는 안내가 보이면, 맥에서는 `~/.zshrc`로 바꿔서 적용하시면 됩니다.

<a id="troubleshooting"></a>

## 자주 발생하는 문제

- **"brew: command not found"**: Homebrew 설치 직후 PATH가 반영되지 않은 경우입니다. Apple Silicon 맥(M1/M2/M3)이라면 터미널에 `echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zshrc && source ~/.zshrc`를 입력하세요. Intel 맥은 `/opt/homebrew` 대신 `/usr/local`을 사용합니다.
- **"git을 찾을 수 없습니다"**: Git을 설치한 터미널 창에서 그대로 확인하면 인식되지 않을 수 있습니다. 터미널을 종료(`⌘ Command + Q`)하고 다시 연 뒤 `git --version`을 입력하세요. 처음 실행 시 "Command Line Tools를 설치하시겠습니까?" 안내가 뜨면 그대로 설치하시면 됩니다.
- **npm 또는 npx 명령어가 인식되지 않을 때**: 터미널을 닫았다 다시 여세요. Node.js 경로가 새 창에만 반영됩니다.
- **"Permission denied" 또는 권한 오류**: Homebrew 명령에는 절대 `sudo`를 붙이지 마세요. Homebrew는 사용자 권한으로 실행되도록 설계되어 있습니다. `sudo`로 한 번 실행했다면 `sudo chown -R $(whoami) /opt/homebrew`로 소유권을 되돌릴 수 있습니다(Intel 맥은 `/usr/local/Cellar` 등).

## 정리

- 사전 준비: 터미널을 열고 Homebrew를 설치한 뒤, `brew install git`과 `brew install node`로 사전 도구를 차례로 받습니다.
- 본체 설치: `curl -fsSL https://claude.ai/install.sh | bash` 한 줄과 브라우저 로그인 한 번으로 끝납니다.
- 초기 설정: `/config`에서 한국어를 선택하고 앤트로픽 공식 스킬 마켓플레이스를 등록하면 첫 작업을 바로 시작할 수 있습니다.

맥에서는 한 번 깔아 둔 Homebrew가 이후 어떤 개발 도구를 추가할 때도 그대로 쓰입니다. Python, 데이터베이스, 다른 CLI 도구도 모두 `brew install` 한 줄로 끝나므로, 이 9단계는 클로드 코드 한 가지를 위한 작업이 아니라 맥을 작업 환경으로 한 단계 키워 두는 과정에 가깝습니다. 이후로는 사용량 HUD, LSP 플러그인, everything-claude-code 같은 확장 설정을 필요할 때 골라서 추가하시면 됩니다.
