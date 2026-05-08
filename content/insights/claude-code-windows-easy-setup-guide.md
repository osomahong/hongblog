---
slug: claude-code-windows-easy-setup-guide
title: 쉽게 설치하는 클로드코드 세팅가이드(윈도우)
excerpt: >-
  윈도우 PC에 클로드 코드(Claude Code)를 처음 설치하는 분을 위해, PowerShell 관리자 모드부터 한국어 설정, 첫 작업
  시작까지 9단계로 단순하게 정리했습니다.
category: AI_TECH
tags:
  - AI
  - 바이브코딩
  - 자동화
publishedAt: '2026-05-08T15:37:58.000Z'
highlights:
  - PowerShell 관리자 모드에서 winget 명령 두 줄로 Git과 Node.js 사전 준비를 끝낼 수 있습니다.
  - >-
    설치 스크립트 한 줄(irm https://claude.ai/install.ps1 | iex)로 클로드 코드 본체를 받고 브라우저 로그인
    한 번으로 계정을 연결합니다.
  - >-
    /config 한국어 설정과 앤트로픽 공식 스킬 마켓플레이스 등록까지 마치면 첫 작업을 바로 시작할 수
    있습니다.
quiz:
  - question: 클로드 코드를 윈도우에 설치할 때 가장 먼저 해야 하는 일은 무엇일까요?
    options:
      - PowerShell을 관리자 권한으로 실행한다
      - claude.ai 사이트에 회원가입한다
      - Visual Studio Code를 먼저 설치한다
      - GitHub에서 저장소를 만든다
    correctIndex: 0
    explanation: >-
      모든 설치 명령어(winget, irm 등)는 PowerShell 관리자 모드에서 실행해야 합니다. 관리자 권한이 없으면 Git과
      Node.js 설치 자체가 진행되지 않고, 그 뒤 단계도 모두 멈춥니다.
metaTitle: 쉽게 설치하는 클로드코드 세팅가이드(윈도우) 9단계
metaDescription: >-
  윈도우 PC에 클로드 코드를 설치하고 한국어로 첫 작업을 시작하는 9단계 가이드입니다. PowerShell, Git, Node.js, 본체
  설치, /config 한국어, 공식 스킬 마켓플레이스 등록까지 포함합니다.
ogImage: /og/claude-code-windows-easy-setup-guide.png
ogTitle: 쉽게 설치하는 클로드코드 세팅가이드(윈도우) 9단계
ogDescription: 'PowerShell 관리자 모드부터 클로드 코드 본체 설치, 한국어 설정, 첫 작업 시작까지 9단계로 정리한 윈도우 입문 가이드입니다.'
---

## 윈도우 사용자가 가장 먼저 만나는 검은 화면

윈도우 PC에서 [클로드 코드(Claude Code)](/class/claude-code-for-everyone/what-is-claude-code) (클로드 코드에 대한 설명 글 바로가기) 설치를 시작하면, 가장 먼저 마주치는 화면이 PowerShell입니다. 평소 작업 표시줄과 파일 탐색기로 컴퓨터를 쓰던 분이라면 익숙하지 않은 도구입니다. 게다가 안내문에는 **"관리자 권한으로 실행"**이라는 단계도 끼어 있어, 시작 전부터 한 번 멈칫하게 됩니다.

그런데 PowerShell은 사실 윈도우에 기본으로 들어 있는 도구입니다. 클릭과 드래그 대신 짧은 문장으로 컴퓨터에 일을 시키는 방식이라는 점만 다를 뿐입니다. 그리고 설치만 끝내면 클로드 코드를 사용하는 일상적인 흐름은 평소 [claude.ai](https://claude.ai) 같은 웹 채팅과 거의 같습니다. 질문을 입력하고 답을 받는 구조 그대로, 화면만 PowerShell로 바뀌는 정도입니다.

정리하면, 윈도우에서 클로드 코드는 **설치 한 번이 전체에서 가장 까다로운 단계**입니다. 그 한 단계만 통과하면 다음부터는 익숙한 채팅형 AI처럼 쓸 수 있습니다. 아래 안내를 순서대로 따라가 주세요. 윈도우 10·11 어느 쪽이든 동일하게 진행됩니다.

설치 도중에 "winget을 찾을 수 없습니다", "git을 찾을 수 없습니다", "이 시스템에서 스크립트를 실행할 수 없습니다" 같은 메시지가 뜬다면 자주 발생하는 문제의 해결 방법을 글 끝의 [자주 발생하는 문제](#troubleshooting) 섹션에 따로 모아 두었으니 문제 발생 시 확인해 보세요.

> 클로드 코드(Claude Code)는 앤트로픽이 만든 터미널 기반 AI 코딩 도구입니다. 윈도우에서는 PowerShell 관리자 모드를 열어 winget으로 Git과 Node.js를 먼저 깔고, 설치 스크립트 한 줄(`irm https://claude.ai/install.ps1 | iex`)로 본체를 받은 뒤 브라우저 로그인과 `/config` 한국어 설정만 마치면 첫 실행 준비가 끝납니다.

이 글은 윈도우 PC를 기준으로 합니다. 맥(Mac)을 쓰시는 분은 [맥용 가이드](/insights/claude-code-mac-easy-setup-guide) (맥에서 설치하는 방법 바로가기)를 참고하세요.

## Step 1. PowerShell을 관리자 모드로 실행

설치 작업은 모두 PowerShell이라는 윈도우 기본 도구 안에서 합니다. 일반 모드가 아닌 **관리자 모드**여야 설치 명령어가 실제로 실행됩니다.

1. 키보드의 Windows 키를 누르세요.
2. "PowerShell"이라고 입력하세요.
3. 검색 결과에서 **"관리자 권한으로 실행"**을 클릭하세요.

✅ 성공 신호: 창 제목 줄에 "관리자: Windows PowerShell"이라고 표시됩니다. 이후 모든 명령어는 이 창에 입력합니다.

## Step 2. Git 설치

Git은 클로드 코드가 내부적으로 사용하는 코드 관리 도구입니다. 아래 명령어를 PowerShell 창에 복사해서 붙여넣고 엔터를 누르세요.

```powershell
winget install Git.Git
```

설치가 끝나면 **PowerShell을 닫았다가 다시 관리자 모드로 열어** 주세요. 새로 설치한 도구를 PowerShell이 인식하려면 창을 한 번 새로 띄워야 합니다.

확인 명령어:

```powershell
git --version
```

✅ 성공 신호: `git version 2.x.x` 같은 버전 번호가 나오면 설치 완료입니다.

## Step 3. Node.js 설치

Node.js는 클로드 코드와 함께 쓰는 npm 기반 도구나 자바스크립트 프로젝트를 다룰 때 필요한 환경입니다. 마찬가지로 winget 명령어로 설치합니다.

```powershell
winget install OpenJS.NodeJS.LTS
```

설치가 끝나면 **PowerShell을 닫았다가 다시 관리자 모드로 열어** 주세요.

확인 명령어 3개를 하나씩 입력하세요.

```powershell
node -v
```

```powershell
npm -v
```

```powershell
npx -v
```

✅ 성공 신호: 세 명령어 모두 버전 번호가 출력되면 사전 준비 끝입니다.

## Step 4. 클로드 코드 본체 설치

이제 본격적으로 클로드 코드를 설치합니다. 아래 한 줄을 PowerShell에 복사해서 붙여넣고 엔터를 누르세요.

```powershell
irm https://claude.ai/install.ps1 | iex
```

설치가 끝나면 PowerShell을 닫았다가 다시 여세요. 이때부터는 **관리자 모드가 아니어도 됩니다**. 일반 PowerShell 창으로 충분합니다.

확인 명령어:

```powershell
claude --version
```

✅ 성공 신호: 버전 번호가 출력되면 본체 설치 완료입니다.

## Step 5. 최초 실행과 로그인

PowerShell에 아래 명령어를 입력해 클로드 코드를 처음 실행해 보세요.

```powershell
claude
```

실행하면 웹 브라우저가 자동으로 열립니다. 브라우저에서 앤트로픽 계정으로 로그인을 끝내고, 다시 PowerShell 창으로 돌아오세요. 로그인 정보가 자동으로 PowerShell에 전달됩니다.

✅ 성공 신호: PowerShell 창에 클로드 코드 인터페이스가 떠 있고, 메시지를 입력할 수 있는 상태가 됩니다. 다음 단계로 넘어가기 위해 **Ctrl+C를 두 번** 눌러 클로드 코드를 종료하세요.

## Step 6. 언어를 한국어로 변경

기본 언어는 영어입니다. 한국어로 바꿔두면 응답과 설명이 모두 한국어로 나옵니다.

PowerShell에서 클로드 코드를 다시 실행하세요.

```powershell
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

PowerShell에서 클로드 코드를 다시 실행하세요.

```powershell
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

PowerShell에서 아래 세 줄을 차례로 입력하세요.

```powershell
mkdir C:\Projects\my-project
cd C:\Projects\my-project
claude
```

첫 줄은 폴더를 만들고, 둘째 줄은 그 폴더로 이동하고, 셋째 줄은 그 폴더 안에서 클로드 코드를 실행합니다.

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

PowerShell을 열고, 작업 폴더로 이동한 다음 `claude`를 입력하면 됩니다.

```powershell
cd C:\Projects\my-project
claude
```

## 자주 묻는 질문 (AEO)

> Q. 클로드 코드는 윈도우 어느 버전부터 설치할 수 있나요?
>
> A. winget 명령을 지원하는 Windows 10(1809 빌드 이상)과 Windows 11에서 설치할 수 있습니다. 그보다 낮은 버전은 winget이 동작하지 않으므로 윈도우 자체를 먼저 업데이트해야 합니다.

> Q. PowerShell을 관리자 모드로 실행하지 않으면 어떻게 되나요?
>
> A. winget으로 Git이나 Node.js를 시스템에 설치하는 단계에서 권한 부족으로 막힙니다. 클로드 코드 본체 설치 스크립트는 사용자 폴더에 깔리지만, 사전 도구 설치 단계에서 멈추지 않으려면 처음부터 관리자 모드 PowerShell로 시작하는 편이 안전합니다.

> Q. 명령 프롬프트(cmd)에서 설치해도 되나요?
>
> A. 권장하지 않습니다. 본 가이드의 명령어들(특히 `irm ... | iex`)은 PowerShell 문법을 기반으로 합니다. 윈도우 11 또는 윈도우 10 최신 빌드에서는 PowerShell이 기본 셸이며, 시작 메뉴에서 검색해 관리자 모드로 실행하시면 됩니다.

> Q. 설치 스크립트가 차단되면 어떻게 하나요?
>
> A. 가장 흔한 원인은 PowerShell의 실행 정책입니다. 관리자 모드 PowerShell에서 `Set-ExecutionPolicy RemoteSigned`로 정책을 한 번 풀어 주시면 대부분 해결됩니다. 백신 프로그램이 직접 차단한다면 잠시 실시간 검사를 끄고 설치한 뒤 다시 켜시면 됩니다. 클로드 코드 공식 설치 스크립트(`claude.ai/install.ps1`)는 앤트로픽이 직접 호스팅하는 파일입니다.

<a id="troubleshooting"></a>

## 자주 발생하는 문제

- **"winget을 찾을 수 없습니다"**: 윈도우 버전이 오래된 경우입니다. Microsoft Store에서 "앱 설치 관리자(App Installer)"를 업데이트하거나, 윈도우 업데이트를 먼저 진행하세요.
- **"git을 찾을 수 없습니다"**: Git을 설치한 PowerShell 창에서 그대로 확인하면 인식되지 않습니다. 창을 닫고 관리자 모드로 새 창을 연 뒤 다시 `git --version`을 입력하세요.
- **npm 또는 npx 명령어가 인식되지 않을 때**: PowerShell을 닫았다 다시 여세요. Node.js 경로가 새 창에만 반영됩니다.
- **"이 시스템에서 스크립트를 실행할 수 없습니다"**: 설치 스크립트 실행이 차단된 경우입니다. PowerShell 관리자 창에서 아래 명령으로 정책을 풀어 주세요.

```powershell
Set-ExecutionPolicy RemoteSigned
```

## 정리

- 사전 준비: PowerShell 관리자 모드를 열고 winget으로 Git과 Node.js를 한 줄씩 설치합니다.
- 본체 설치: `irm https://claude.ai/install.ps1 | iex` 한 줄과 브라우저 로그인 한 번으로 끝납니다.
- 초기 설정: `/config`에서 한국어로 바꾸고 앤트로픽 공식 스킬 마켓플레이스를 등록하면 첫 작업을 바로 시작할 수 있습니다.

윈도우는 winget이 마이크로소프트가 공식으로 제공하는 패키지 관리자라서, 한 번 익혀 두면 다른 개발 도구도 같은 방식으로 깔 수 있습니다. 이후 단계로는 사용량 HUD, LSP 플러그인, everything-claude-code 같은 확장 설정도 있지만, 우선은 이 9단계까지 마치고 클로드 코드와 첫 대화를 나눠 보신 다음 필요한 것만 골라서 추가하셔도 충분합니다.
