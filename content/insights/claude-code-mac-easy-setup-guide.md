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
updatedAt: '2026-08-17T00:00:00.000Z'
highlights:
  - >-
    설치 스크립트 한 줄(curl -fsSL https://claude.ai/install.sh | bash)로 클로드 코드 본체를 받고
    브라우저 로그인 한 번으로 계정을 연결합니다.
  - >-
    클로드 코드 본체에는 Node.js가 필요하지 않습니다. 자체 실행 파일로 동작하며, Node.js는 나중에
    다른 도구를 붙일 때를 위해 함께 깔아 둡니다.
  - >-
    무료 플랜으로는 클로드 코드를 쓸 수 없습니다. Pro, Max, Team, Enterprise, Console 계정 가운데
    하나가 필요합니다.
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
  맥에 클로드 코드를 설치하고 한국어로 첫 작업을 시작하는 9단계 가이드입니다. 2026년 8월 기준으로 확인했으며 터미널,
  Homebrew, Git, 본체 설치, /config 한국어, 공식 스킬 마켓플레이스 등록까지 포함합니다.
ogImage: /og/claude-code-mac-easy-setup-guide.png
ogDescription: >-
  터미널 실행부터 Homebrew, Git, Node.js 사전 준비, 클로드 코드 본체 설치, 한국어 설정, 첫 작업 시작까지 9단계로 정리한
  맥 입문 가이드입니다.
summary3:
  - '맥에서 클로드 코드는 공식 설치 스크립트 한 줄로 받고 브라우저 로그인 한 번으로 계정을 연결합니다.'
  - '클로드 코드 본체는 자체 실행 파일로 돌아가 Node.js가 필요 없고 npm 방식으로 설치할 때만 Node.js 22 이상이 필요합니다.'
  - '사양은 macOS 13.0 이상에 메모리 4GB 이상이고 무료 플랜으로는 쓸 수 없어 Pro와 Max, Team, Enterprise, Console 가운데 하나가 있어야 합니다.'
---

## AI시대에는 터미널과 친해져야 합니다

요즘 AI 도구를 본격적으로 쓰려고 하면, 점점 **터미널(Terminal)**이라는 검은 화면을 만나게 됩니다. [클로드 코드(Claude Code)](/class/claude-code-for-everyone/what-is-claude-code) (클로드 코드를 설명한 글 바로가기)가 그런 도구입니다. 평소 맥에서 Spotlight와 Finder로만 일을 처리해 오신 분이라면 처음에는 낯설게 느껴지지만, 그동안 클릭으로 하던 작업이 짧은 한 줄로 바뀌는 정도로 이해하시면 됩니다.

설치만 끝내면, 클로드 코드를 쓰는 일상은 평소 [claude.ai](https://claude.ai) 같은 웹 채팅과 거의 같습니다. 질문을 던지고 답을 받는 흐름은 동일하고, 화면만 브라우저가 아니라 터미널로 바뀌는 정도입니다.

맥에서 클로드 코드는 **설치가 전체에서 가장 손이 많이 가는 단계**이고, 그 한 번만 통과하면 다음부터는 익숙한 채팅형 AI처럼 쓸 수 있습니다. 아래 9단계를 순서대로 따라가 주세요. 중간에 막히는 메시지가 뜬다면 자주 발생하는 문제의 해결 방법을 글 끝의 [자주 발생하는 문제](#troubleshooting) 섹션에 따로 모아 두었으니 문제 발생 시 확인해 보세요.

> 클로드 코드(Claude Code)는 앤트로픽이 만든 터미널 기반 AI 코딩 도구입니다. 맥에서는 Homebrew를 깔고 `brew install git`으로 사전 도구를 받은 뒤 설치 스크립트 한 줄(`curl -fsSL https://claude.ai/install.sh | bash`)로 본체를 내려받고, 브라우저 로그인과 `/config` 한국어 설정만 마치면 첫 실행 준비가 끝납니다.

**2026년 8월 17일에 공식 문서와 대조해 다시 확인했습니다.** 확인 시점의 클로드 코드 버전은 2.1.233이고, 설치 명령과 요구 사양은 아래에 적은 대로입니다.

시작하기 전에 두 가지만 확인해 주세요.

- **사양**: macOS 13.0(Ventura) 이상, 메모리 4GB 이상. Apple Silicon과 Intel 맥 모두 됩니다.
- **계정**: 클로드 코드는 Pro, Max, Team, Enterprise, Console 계정에서 동작합니다. **무료 Claude.ai 플랜으로는 쓸 수 없습니다.**

이 글은 맥(macOS) 기준입니다. 윈도우 PC를 쓰시는 분은 [윈도우용 가이드](/insights/claude-code-windows-easy-setup-guide) (윈도우에서 설치하는 방법 바로가기)를 참고하세요.

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

먼저 오해를 하나 풀고 가겠습니다. **Node.js는 클로드 코드의 필수 조건이 아닙니다.** Step 4의 설치 스크립트로 깔면 클로드 코드는 자체 실행 파일로 동작하고 Node.js를 쓰지 않습니다. Node.js가 필요한 경우는 `npm install -g @anthropic-ai/claude-code` 방식으로 설치할 때이고, 그때는 Node.js 22 이상이 필요합니다.

그런데도 여기서 함께 까는 이유는, 앞으로 자동화 스크립트나 다른 CLI 도구를 붙일 때 필요해지는 경우가 많아서입니다. 지금 한 줄로 끝내 두면 나중에 다시 찾지 않아도 됩니다. 건너뛰고 Step 4로 가셔도 클로드 코드는 정상 동작합니다.

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

설치가 끝나면 **터미널을 닫았다가 다시 열어** 주세요. `⌘ Command + Q`로 종료한 뒤 다시 실행하면 됩니다.

확인 명령어:

```bash
claude --version
```

`2.1.233 (Claude Code)` 같은 버전 번호가 나오면 정상입니다.

Homebrew를 선호하신다면 다음 방식도 공식으로 지원됩니다.

```bash
brew install --cask claude-code
```

두 방식에는 차이가 하나 있습니다. **설치 스크립트로 깔면 새 버전이 나올 때 백그라운드에서 알아서 갱신됩니다.** Homebrew로 깔면 자동 갱신이 되지 않아 `brew upgrade claude-code`를 직접 실행해야 합니다. 게다가 Homebrew 쪽은 안정 채널이라 한 주쯤 뒤처집니다. 실제로 2026년 8월 17일에 확인해 보니 설치 스크립트 쪽은 2.1.233인데 Homebrew는 2.1.224였습니다. 처음이라면 설치 스크립트 쪽을 권합니다.

✅ 성공 신호: 버전 번호가 출력되면 본체 설치 완료입니다.

## Step 5. 최초 실행과 로그인

터미널에 아래 명령어를 입력해 클로드 코드를 처음 실행해 보세요.

```bash
claude
```

실행하면 웹 브라우저가 자동으로 열립니다. 브라우저에서 앤트로픽 계정으로 로그인을 끝내고, 다시 터미널 창으로 돌아오세요. 로그인 정보가 자동으로 터미널에 전달됩니다.

여기서 계정 종류를 한 번 짚고 가겠습니다. **무료 Claude.ai 플랜에는 클로드 코드 사용 권한이 들어 있지 않습니다.** Pro, Max, Team, Enterprise, Console 가운데 하나가 필요합니다. Amazon Bedrock이나 구글 클라우드 같은 외부 API 사업자를 연결하는 방법도 있습니다.

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

> Q. 무료 클로드 계정으로도 클로드 코드를 쓸 수 있나요?
>
> A. 쓸 수 없습니다. 앤트로픽 공식 문서는 클로드 코드에 Pro, Max, Team, Enterprise, Console 계정이 필요하고 무료 Claude.ai 플랜에는 사용 권한이 들어 있지 않다고 안내합니다. Amazon Bedrock, 구글 클라우드의 에이전트 플랫폼, 마이크로소프트 파운드리 같은 외부 API 사업자를 연결해 쓰는 방법도 있습니다.

> Q. 설치할 때 Node.js를 꼭 깔아야 하나요?
>
> A. 본체만 놓고 보면 필요하지 않습니다. 설치 스크립트로 깐 클로드 코드는 자체 실행 파일로 동작합니다. Node.js가 필요한 경우는 `npm install -g @anthropic-ai/claude-code` 방식으로 설치할 때이고, 그때는 Node.js 22 이상이 필요합니다. 이 가이드에서 Node.js를 함께 까는 이유는 나중에 다른 도구를 붙일 때 쓰기 위해서입니다.

> Q. 맥 기본 셸이 zsh인데 bash로 바꿔야 하나요?
>
> A. 그대로 zsh로 사용하시면 됩니다. macOS 카탈리나(10.15) 이후의 기본 셸이 zsh이고, 클로드 코드와 Homebrew, Node.js 모두 zsh에서 정상 동작합니다. 이전 글이나 영상에서 `~/.bash_profile`을 편집하라는 안내가 보이면, 맥에서는 `~/.zshrc`로 바꿔서 적용하시면 됩니다.

<a id="troubleshooting"></a>

## 자주 발생하는 문제

무엇이 잘못됐는지 모르겠다면 진단 명령을 먼저 돌려 보세요. 설치 상태와 설정 파일 오류를 읽기만 하고 알려주기 때문에 안전합니다.

```bash
claude doctor
```

설치가 정상인지, 설정 파일에 문제가 있는지, 마지막 자동 갱신이 어떻게 끝났는지를 한 화면에 보여줍니다. 아래 항목들은 이 명령으로도 풀리지 않을 때 확인하세요.

- **"brew: command not found"**: Homebrew 설치 직후 PATH가 반영되지 않은 경우입니다. Apple Silicon 맥(M1/M2/M3)이라면 터미널에 `echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zshrc && source ~/.zshrc`를 입력하세요. Intel 맥은 `/opt/homebrew` 대신 `/usr/local`을 사용합니다.
- **"git을 찾을 수 없습니다"**: Git을 설치한 터미널 창에서 그대로 확인하면 인식되지 않을 수 있습니다. 터미널을 종료(`⌘ Command + Q`)하고 다시 연 뒤 `git --version`을 입력하세요. 처음 실행 시 "Command Line Tools를 설치하시겠습니까?" 안내가 뜨면 그대로 설치하시면 됩니다.
- **npm 또는 npx 명령어가 인식되지 않을 때**: 터미널을 닫았다 다시 여세요. Node.js 경로가 새 창에만 반영됩니다.
- **"Permission denied" 또는 권한 오류**: Homebrew 명령에는 절대 `sudo`를 붙이지 마세요. Homebrew는 사용자 권한으로 실행되도록 설계되어 있습니다. `sudo`로 한 번 실행했다면 `sudo chown -R $(whoami) /opt/homebrew`로 소유권을 되돌릴 수 있습니다(Intel 맥은 `/usr/local/Cellar` 등).

## 정리

- 사전 준비: 터미널을 열고 Homebrew를 설치한 뒤 `brew install git`으로 Git을 받습니다. Node.js는 필수가 아니지만 나중을 위해 함께 깔아 둡니다.
- 본체 설치: `curl -fsSL https://claude.ai/install.sh | bash` 한 줄과 브라우저 로그인 한 번으로 끝납니다. 이 방식은 새 버전이 나오면 알아서 갱신됩니다.
- 계정: Pro, Max, Team, Enterprise, Console 가운데 하나가 필요합니다. 무료 플랜으로는 쓸 수 없습니다.
- 초기 설정: `/config`에서 한국어를 선택하고 앤트로픽 공식 스킬 마켓플레이스를 등록하면 첫 작업을 바로 시작할 수 있습니다.
- 막혔을 때: `claude doctor`로 설치와 설정 상태를 먼저 확인합니다.

OpenAI 쪽 도구도 함께 써 보고 싶다면 [코덱스 CLI 세팅 가이드](/insights/codex-cli-mac-easy-setup-guide)를 이어서 보세요. 두 도구를 같은 작업에 붙여 결과를 비교한 기록은 [코덱스 CLI와 클로드 코드 비교](/insights/codex-cli-vs-claude-code)에 정리해 두었습니다.

맥에서는 한 번 깔아 둔 Homebrew가 이후 어떤 개발 도구를 추가할 때도 그대로 쓰입니다. Python, 데이터베이스, 다른 CLI 도구도 모두 `brew install` 한 줄로 끝나므로, 이 9단계는 클로드 코드 한 가지를 위한 작업이 아니라 맥을 작업 환경으로 한 단계 키워 두는 과정에 가깝습니다. 이후로는 사용량 HUD, LSP 플러그인, everything-claude-code 같은 확장 설정을 필요할 때 골라서 추가하시면 됩니다.
