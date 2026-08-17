---
slug: claude-code-windows-easy-setup-guide
title: 쉽게 설치하는 클로드 코드(Claude Code) 설치 가이드 (윈도우)
excerpt: >-
  윈도우 PC에 클로드 코드(Claude Code)를 처음 설치하는 분을 위해, 명령 한 줄로 Git과 Node.js, 본체를 한 번에 까는
  방법과 자주 막히는 지점의 해결법을 정리했습니다.
category: AI_TECH
tags:
  - AI
  - 바이브코딩
  - 자동화
publishedAt: '2026-05-08T15:37:58.000Z'
updatedAt: '2026-08-17T00:00:00.000Z'
highlights:
  - 설치를 시작하기 전에 유료 구독부터 확인합니다. 무료 계정으로는 클로드 코드에 로그인되지 않습니다.
  - >-
    명령을 하나씩 나눠 치지 말고 통합 한 줄을 붙여 넣습니다. Git과 Node.js, 본체가 한 번에 설치되고 창을 다시 여는 횟수도
    줄어듭니다.
quiz:
  - question: 윈도우에 클로드 코드를 설치하기 전에 가장 먼저 확인해야 하는 것은 무엇일까요?
    options:
      - Claude 유료 구독이 활성화되어 있는지
      - Visual Studio Code가 깔려 있는지
      - GitHub 계정이 있는지
      - 그래픽 카드 사양이 충분한지
    correctIndex: 0
    explanation: >-
      클로드 코드는 Pro, Max, Team, Enterprise 구독이나 Console 계정이 있어야 로그인됩니다. 무료 플랜에는
      포함되지 않습니다. 설치를 모두 마친 뒤 로그인 단계에서 막히면 앞의 작업이 헛수고가 되므로 구독부터 확인하는 편이 낫습니다.
metaTitle: 클로드 코드(Claude Code) 윈도우 설치 가이드
metaDescription: >-
  클로드 코드 윈도우 설치는 PowerShell에 명령 한 줄을 붙여 넣는 작업입니다. 통합 설치 명령, 유료 구독 조건, 자주 막히는 오류
  해결법, 터미널 없이 쓰는 데스크톱 앱까지 정리했습니다.
ogImage: /og/claude-code-windows-easy-setup-guide.png
ogTitle: 쉽게 설치하는 클로드 코드(Claude Code) 설치 가이드 (윈도우)
ogDescription: 통합 명령 한 줄로 끝내는 윈도우 클로드 코드 설치 절차와 자주 막히는 지점의 해결법입니다.
---

## 윈도우 사용자가 가장 먼저 만나는 검은 화면, PowerShell

[클로드 코드(Claude Code)](/class/claude-code-for-everyone/what-is-claude-code) (클로드 코드가 무엇인지 설명한 글 바로가기)는 앤트로픽이 만든 터미널 기반 AI 코딩 도구입니다. 윈도우 PC에서 설치를 시작하면 가장 먼저 마주치는 화면이 PowerShell입니다. 평소 작업 표시줄과 파일 탐색기로 컴퓨터를 쓰던 분이라면 익숙하지 않은 도구입니다.

그런데 PowerShell은 윈도우에 기본으로 들어 있는 프로그램입니다. 클릭과 드래그 대신 짧은 문장으로 컴퓨터에 일을 시키는 방식이라는 점만 다릅니다. 설치만 끝내면 클로드 코드를 쓰는 일상적인 흐름은 평소 [claude.ai](https://claude.ai) 같은 웹 채팅과 거의 같습니다. 질문을 입력하고 답을 받는 구조 그대로, 화면만 PowerShell로 바뀌는 정도입니다.

> 윈도우에서 클로드 코드를 설치하는 방법은 관리자 권한 PowerShell에 통합 명령 한 줄을 붙여 넣는 것입니다. Git과 Node.js, 본체가 한 번에 설치되고, 브라우저 로그인과 `/config` 한국어 설정을 마치면 첫 실행 준비가 끝납니다.

이 글은 윈도우 PC를 기준으로 합니다. 맥(Mac)을 쓰시는 분은 [맥용 가이드](/insights/claude-code-mac-easy-setup-guide) (맥에서 설치하는 방법 바로가기)를 참고하세요. 아래 내용은 2026년 8월 기준 앤트로픽 공식 문서를 따랐습니다.

## 설치 전에 확인할 두 가지

설치 자체보다 먼저 확인해야 할 것이 있습니다. 이 두 가지가 어긋나면 명령을 아무리 정확히 쳐도 마지막 단계에서 막힙니다.

**첫째, 유료 구독이 있어야 합니다.** 클로드 코드는 Pro, Max, Team, Enterprise 구독이나 Claude Console 계정으로 로그인합니다. 무료 플랜에는 포함되지 않습니다. 이 조건을 모른 채 설치부터 시작했다가 마지막 로그인 단계에서 되돌아오는 사례가 있습니다.

**둘째, 윈도우 버전과 사양을 봅니다.** 공식 요구 사항은 윈도우 10(1809 빌드 이상) 또는 윈도우 서버 2019 이상이고, 메모리는 4GB 이상입니다. 그보다 낮은 버전에서는 설치 도구인 winget 자체가 동작하지 않으므로 윈도우 업데이트를 먼저 진행해야 합니다.

## 한 줄로 끝내는 통합 설치 명령

Git과 Node.js, 클로드 코드를 하나씩 나눠 설치하는 안내가 많지만, 명령을 세미콜론으로 이어 붙이면 한 번에 끝납니다.

먼저 PowerShell을 관리자 권한으로 엽니다. Windows 키를 누르고 `PowerShell`을 입력한 뒤, 검색 결과에서 마우스 오른쪽 버튼을 눌러 관리자 권한으로 실행을 고릅니다.

여기서 한 가지 함정이 있습니다. 검색하면 **Windows PowerShell**과 **Windows PowerShell (x86)**이 나란히 나옵니다. **(x86)이 없는 쪽**을 골라야 합니다. (x86)은 32비트용이고, 클로드 코드는 32비트 윈도우를 지원하지 않아 `Claude Code does not support 32-bit Windows` 오류로 멈춥니다.

관리자 창이 열렸다면 아래 한 줄을 붙여 넣고 엔터를 누릅니다.

```powershell
winget install --id Git.Git -e --accept-package-agreements --accept-source-agreements; winget install --id OpenJS.NodeJS.LTS -e --accept-package-agreements --accept-source-agreements; irm https://claude.ai/install.ps1 | iex
```

한 줄이지만 안에서 세 가지 일이 일어납니다.

- **`winget install --id Git.Git`**: 파일 변경 이력을 다루는 [Git](/class/vibe-coding-basics/what-is-git)을 설치합니다. 없어도 클로드 코드는 실행되지만, 설치해 두면 Bash 도구를 쓸 수 있습니다.
- **`winget install --id OpenJS.NodeJS.LTS`**: Node.js를 설치합니다. 2026년 8월 기준 LTS 버전은 24입니다.
- **`irm https://claude.ai/install.ps1 | iex`**: 클로드 코드 본체를 내려받아 설치합니다.

뒤에 붙은 `--accept-package-agreements`와 `--accept-source-agreements`는 설치 중 나오는 동의 질문을 자동으로 넘기는 옵션입니다. 이 옵션이 없으면 중간에 `Y`를 입력하라는 문구에서 멈춰 있게 됩니다.

설치가 끝나면 **PowerShell을 닫고 다시 엽니다.** 새로 설치한 프로그램은 새 창에서만 인식되기 때문입니다.

## 클로드 코드 설치에서 오해하기 쉬운 세 가지

설치 안내에서 자주 보이는 설명 가운데 공식 문서와 어긋나는 것이 있습니다.

**Node.js는 클로드 코드의 필수 조건이 아닙니다.** 위 명령의 마지막 부분처럼 설치 스크립트로 깔면 클로드 코드는 자체 실행 파일로 동작하며 Node.js를 쓰지 않습니다. Node.js가 필요한 경우는 `npm install -g @anthropic-ai/claude-code` 방식으로 설치할 때이고, 이때는 Node.js 22 이상이 필요합니다. 그래도 위 명령에 Node.js를 넣어 둔 이유는, 앞으로 자동화 스크립트나 다른 도구를 붙일 때 필요해지는 경우가 많기 때문입니다.

**클로드 코드 본체 설치에는 관리자 권한이 필요 없습니다.** 공식 문서는 PowerShell이나 CMD에서 관리자 권한 없이 설치할 수 있다고 안내합니다. 관리자 권한이 필요한 쪽은 winget으로 Git과 Node.js를 시스템에 설치하는 부분입니다. 통합 명령에는 winget이 포함되므로 관리자 창에서 실행하는 편이 편합니다.

**Git for Windows는 선택 사항입니다.** Git이 없으면 클로드 코드는 PowerShell 도구로 명령을 실행하고, Git이 있으면 Git Bash로 Bash 도구를 씁니다. 다만 뒤에서 다룰 데스크톱 앱을 쓸 계획이라면 Git이 반드시 필요합니다.

## winget으로 설치하는 방법

앞의 통합 명령 대신 winget으로 클로드 코드 본체를 깔 수도 있습니다. 공식 문서가 함께 안내하는 방식입니다.

```powershell
winget install Anthropic.ClaudeCode
```

한 가지 차이를 알고 고르셔야 합니다. **설치 스크립트로 깔면 새 버전이 나올 때 백그라운드에서 알아서 갱신되지만, winget으로 깔면 자동 갱신이 되지 않습니다.** 이때는 아래 명령을 가끔 직접 실행해야 합니다.

```powershell
winget upgrade Anthropic.ClaudeCode
```

클로드 코드가 실행 중이면 윈도우가 실행 파일을 잠가서 갱신이 실패할 수 있습니다. 그런 경우에는 클로드 코드를 종료하고 다시 시도하면 됩니다. 처음 설치하시는 분께는 자동 갱신이 되는 설치 스크립트 쪽을 권합니다.

## 설치 확인과 첫 실행

새로 연 PowerShell 창에서 아래를 입력합니다.

```powershell
claude --version
```

`2.1.233 (Claude Code)`처럼 버전 번호와 이름이 나오면 설치가 끝난 것입니다. 숫자는 설치 시점에 따라 달라지며, 2026년 8월 17일 확인 시점의 최신 버전이 2.1.233이었습니다. 설치 상태를 더 자세히 보고 싶다면 `claude doctor`를 실행하면 설정 오류까지 함께 점검해 줍니다.

이제 실행합니다.

```powershell
claude
```

웹 브라우저가 자동으로 열립니다. 구독이 연결된 계정으로 로그인하고 승인을 마치면 PowerShell 창으로 인증 정보가 전달됩니다. 로그인은 한 번만 하면 되고, 나중에 계정을 바꿀 때는 클로드 코드 안에서 `/login`을 입력합니다.

기본 언어는 영어입니다. 클로드 코드가 실행된 상태에서 `/config`를 입력하고 언어 항목에서 한국어를 고르면 안내 문구가 한국어로 바뀝니다.

## 작업 폴더를 만들고 시작하는 방법

클로드 코드는 현재 열려 있는 폴더 안에서 작업합니다. 글쓰기, 자료 정리, 자동화 어떤 용도든 작업할 폴더를 먼저 만들어 두는 편이 깔끔합니다.

`/exit`으로 클로드 코드를 종료한 뒤, PowerShell에서 아래 세 줄을 차례로 입력합니다.

```powershell
mkdir C:\Projects\my-project
cd C:\Projects\my-project
claude
```

첫 줄은 폴더를 만들고, 둘째 줄은 그 폴더로 이동하고, 셋째 줄은 그 폴더 안에서 클로드 코드를 실행합니다. 다음에 다시 시작할 때는 `cd` 줄과 `claude` 줄 두 개만 입력하면 됩니다.

자주 쓰게 되는 명령은 다음 정도입니다.

| 입력 | 하는 일 |
|---|---|
| `claude` | 시작 |
| `claude -c` | 직전 대화를 이어서 시작 |
| `claude update` | 최신 버전으로 갱신 |
| `claude doctor` | 설치 상태 점검 |
| `/help` | 명령 목록 보기 |
| `/exit` | 종료 |

슬래시를 입력하면 명령 목록이 자동으로 뜨므로 외우지 않아도 됩니다.

## 설치 중 자주 막히는 지점과 해결법

메시지별로 원인이 다릅니다. 아래는 공식 문제 해결 문서에 정리된 항목 가운데 윈도우 입문자가 자주 겪는 것들입니다.

| 화면에 나오는 메시지 | 원인과 해결 방법 |
|---|---|
| `winget을 찾을 수 없습니다` | 윈도우가 오래된 경우입니다. Microsoft Store에서 앱 설치 관리자(App Installer)를 업데이트하거나 윈도우 업데이트를 진행합니다 |
| `claude 명령을 찾을 수 없습니다` | 설치 후 창을 새로 열지 않은 경우가 대부분입니다. 그래도 같은 메시지가 나오면 설치 위치인 `%USERPROFILE%\.local\bin`이 PATH에 등록되지 않은 상태입니다 |
| `이 시스템에서 스크립트를 실행할 수 없습니다` | 실행 정책에 막힌 경우입니다. 관리자 창에서 `Set-ExecutionPolicy RemoteSigned`를 실행하고 `Y`를 누른 뒤 다시 시도합니다 |
| `irm is not recognized` | PowerShell이 아닌 명령 프롬프트(CMD)에 입력하면 나옵니다. 프롬프트 앞에 `PS`가 붙어 있는지 확인합니다 |
| `The token '&&' is not a valid statement separator` | 반대로 CMD용 명령을 PowerShell에 입력한 경우입니다 |
| `A parameter cannot be found that matches parameter name 'fsSL'` | 맥이나 리눅스용 설치 명령을 붙여 넣은 경우입니다 |
| `Claude Code does not support 32-bit Windows` | PowerShell (x86)을 실행한 경우입니다. (x86)이 붙지 않은 창으로 다시 엽니다 |

백신 프로그램이 설치 스크립트를 차단하는 사례도 있습니다. 이때는 잠시 실시간 검사를 끄고 설치한 뒤 다시 켜면 됩니다. 클로드 코드 공식 설치 스크립트는 앤트로픽이 직접 호스팅하는 파일입니다.

## 터미널 없이 쓰는 방법: 데스크톱 앱

검은 화면이 계속 부담스럽다면 데스크톱 앱이라는 선택지가 있습니다. 앱 안에 클로드 코드가 들어 있어 CLI를 따로 설치하지 않아도 되고, 파일이 바뀌는 내용을 화면에서 보고 승인하는 방식이라 입문자가 익히기 편합니다. [claude.com/download](https://claude.com/download)에서 윈도우용을 내려받습니다.

다만 두 가지 제약이 있습니다.

- **윈도우에서는 Git이 먼저 설치되어 있어야 합니다.** Code 탭을 처음 열 때 Git for Windows가 필요하고, Git을 나중에 깔았다면 앱을 다시 시작해야 합니다.
- **앱을 설치해도 PowerShell에서 `claude` 명령을 쓸 수 있는 것은 아닙니다.** 터미널에서도 쓰려면 위의 설치 절차를 따로 진행합니다.

## 설치를 클로드 코드에게 맡길 수 있는 범위

앱을 먼저 깔고 나머지를 시켜도 되는지 궁금할 수 있습니다. Git과 Node.js는 사람이 먼저 설치해야 합니다. 데스크톱 앱은 Git이 있어야 Code 탭이 열리고, 앱 안의 터미널도 작업 폴더를 연 뒤에만 쓸 수 있어서 순서상 앱에게 Git 설치를 맡길 수 없습니다.

설치를 마친 뒤에는 맡길 수 있는 일이 늘어납니다.

- **스킬과 플러그인 추가**: 데스크톱 앱에서는 입력창 옆 `+` 버튼에서 Plugins를 고르면 공식 마켓플레이스가 열립니다. 터미널에서는 `claude plugin install` 명령을 씁니다.
- **버전 관리**: `claude update`로 갱신하고, 특정 버전이 필요하면 `claude install stable`처럼 지정합니다.
- **필요한 도구 확인**: 무엇을 더 설치해야 하는지 클로드 코드에게 물어보고 알려주는 명령을 실행하면 됩니다.

## 3줄 요약

- 설치 전에 유료 구독부터 확인합니다. 무료 계정으로는 로그인 단계에서 막힙니다.
- 관리자 권한 PowerShell에 통합 명령 한 줄을 붙여 넣으면 Git과 Node.js, 클로드 코드가 한 번에 설치됩니다.
- 창을 새로 연 뒤 `claude --version`으로 확인하고, 로그인과 `/config` 한국어 설정까지 마치면 바로 쓸 수 있습니다.

윈도우의 winget은 마이크로소프트가 공식으로 제공하는 설치 도구입니다. 한 번 익혀 두면 다른 개발 도구도 같은 방식으로 깔 수 있습니다. 우선 여기까지 마치고 클로드 코드와 첫 대화를 나눠 보신 다음, 스킬이나 플러그인 같은 확장은 필요할 때 골라서 추가하셔도 충분합니다.

OpenAI 쪽 도구도 함께 써 보고 싶다면 [코덱스 CLI 윈도우 세팅 가이드](/insights/codex-cli-windows-easy-setup-guide)를 이어서 보세요. 같은 작업을 두 도구에 시켜 결과를 비교한 기록은 [코덱스 CLI와 클로드 코드 비교](/insights/codex-cli-vs-claude-code)에 정리해 두었습니다.

## Sources

- [Claude Code 고급 설치 가이드](https://code.claude.com/docs/en/setup)
- [Claude Code 빠른 시작](https://code.claude.com/docs/en/quickstart)
- [Claude Code 설치와 로그인 문제 해결](https://code.claude.com/docs/en/troubleshoot-install)
- [Claude Code 데스크톱 앱 시작하기](https://code.claude.com/docs/en/desktop-quickstart)
- [winget import 명령 문서](https://learn.microsoft.com/en-us/windows/package-manager/winget/import)
