---
slug: claude-code-shortcuts-guide
title: Claude Code 단축키와 슬래시 명령어 정리
excerpt: >-
  Claude Code 단축키와 슬래시 명령어를 터미널 실행, 세션 관리, 컨텍스트 정리, 코드 리뷰 순서로 정리했습니다. /clear,
  /compact, /resume와 Ctrl 단축키의 차이, tmux에서 Claude Code를 실행하는 방법까지 설명합니다.
category: AI_TECH
tags:
  - AI
  - 자동화
  - 바이브코딩
  - SEO
publishedAt: '2026-09-11T00:00:00.000Z'
highlights:
  - 'Claude Code의 슬래시 명령어는 실행 중인 세션 안에서 입력하고, `claude` CLI 명령은 세션 밖의 터미널에서 입력합니다.'
  - '`/clear`는 새 대화를 시작하고 `/compact`는 현재 대화의 핵심을 요약해 컨텍스트를 줄입니다.'
  - tmux에서 Claude Code를 실행하면 터미널 연결이 끊겨도 작업 세션에 다시 연결합니다.
metaTitle: 'Claude Code 단축키 정리: 슬래시 명령어와 CLI 사용법'
metaDescription: >-
  Claude Code는 터미널에서 프로젝트 파일을 읽고 수정하는 AI 코딩 도구입니다. /clear, /compact, /resume,
  /review와 Ctrl 단축키, claude CLI 명령어를 실제 작업 순서에 맞춰 담았습니다.
ogTitle: 'Claude Code 단축키 정리: /clear, /compact, /resume'
ogDescription: >-
  Claude Code에서 자주 쓰는 /clear, /compact, /resume, /review와 Ctrl 단축키를 터미널 예시와 함께
  정리했습니다.
ogImage: /og/claude-code-shortcuts-guide.png
quiz:
  - question: Claude Code에서 같은 작업을 계속하면서 대화 맥락만 줄이려면 어떤 명령어를 사용해야 할까요?
    options:
      - /compact를 사용합니다
      - /clear를 사용합니다
      - /resume을 사용합니다
      - /doctor를 사용합니다
    correctIndex: 0
    explanation: >-
      /compact는 기존 대화의 핵심을 요약해 컨텍스트 사용량을 줄이고 같은 작업을 이어 가는 명령입니다. /clear는 새 대화를
      시작할 때 사용하며, 이전 세션은 /resume으로 다시 엽니다.
summary3:
  - Claude Code는 터미널에서 프로젝트 파일을 읽고 수정하며 명령어를 실행하는 AI 코딩 도구입니다.
  - 세션 안에서는 /clear와 /compact로 대화 맥락을 관리하고 /resume과 /review로 이전 작업과 변경 사항을 확인합니다.
  - >-
    세션 밖에서는 claude -c와 claude -r로 작업을 이어가며 tmux를 함께 쓰면 터미널 연결이 끊겨도 실행 화면을 보존할 수
    있습니다.
---

## Claude Code 단축키는 세 종류로 나뉩니다

Claude Code는 터미널에서 프로젝트 파일을 읽고 수정하며 명령어를 실행하는 AI 코딩 도구입니다. 단축키를 찾을 때는 입력 위치를 먼저 구분해야 합니다.

첫째는 `claude`와 `claude -p`처럼 **터미널 셸에서 입력하는 CLI 명령어**입니다. 둘째는 Claude Code가 실행된 뒤 `/clear`와 `/compact`처럼 **세션 안에서 입력하는 슬래시 명령어**를 씁니다. 셋째는 `Ctrl+C`와 `Ctrl+R`처럼 **키보드로 바로 실행하는 단축키**입니다.

![클로드 코드가 실행되어 입력을 기다리는 터미널 화면. 입력란에 클로드 코드 작업을 시작할 수 있는 프롬프트가 표시되어 있음](/images/insights/claude-code-shortcuts-guide/claude-running.png)

위 화면처럼 Claude Code가 입력을 기다리는 상태에서 `/`를 누르면 세션 명령어 목록이 열립니다. 터미널에서 `claude`를 실행하는 방법과 세션 안에서 `/compact`를 입력하는 방법을 구분하면 검색한 명령어를 어디에 입력해야 하는지 바로 판단하게 됩니다. [Claude Code 대화형 모드 공식 문서](https://code.claude.com/docs/en/interactive-mode)도 이 두 입력 방식을 별도로 설명합니다.

## Claude Code CLI 명령어 정리

아직 Claude Code를 실행하지 않은 터미널에서 다음 명령어를 사용합니다.

| 명령어 | 기능 | 예시 |
| --- | --- | --- |
| `claude` | 대화형 세션 시작 | `claude` |
| `claude "작업"` | 초기 요청과 함께 세션 시작 | `claude "프로젝트 구조를 설명해 줘"` |
| `claude -p "질문"` | 답변을 출력하고 종료 | `claude -p "이 함수의 역할을 설명해 줘"` |
| `claude -c` | 현재 폴더의 최근 대화 이어가기 | `claude -c` |
| `claude -r` | 이전 세션 선택 화면 열기 | `claude -r` |
| `claude -r 이름` | 이름이나 ID로 세션 이어가기 | `claude -r auth-refactor` |
| `claude update` | Claude Code 업데이트 | `claude update` |
| `claude doctor` | 설치와 설정 상태 점검 | `claude doctor` |
| `exit` 또는 `Ctrl+D` | 현재 세션 종료 | `exit` |

`claude -c`는 현재 작업 폴더의 가장 최근 대화를 이어갈 때 씁니다. 특정 세션을 고르려면 `claude -r`을 실행하고, 이름을 알고 있다면 `claude -r 이름`으로 바로 연결합니다. 공식 문서에서는 `--continue`와 `--resume`을 긴 형식으로도 안내합니다.

```bash
# 프로젝트 폴더에서 Claude Code를 시작합니다.
cd ~/work/my-app
claude

# 최근 세션을 이어갑니다.
claude -c

# 이름을 지정한 세션을 이어갑니다.
claude -r auth-refactor
```

## Claude Code 슬래시 명령어 정리

Claude Code가 실행된 뒤 프롬프트에 `/`를 입력하면 사용할 수 있는 명령어 목록이 나타납니다. 설치된 플러그인과 스킬에 따라 목록이 달라질 수 있으므로, 아래 표는 일상 작업에서 자주 쓰는 기본 명령어를 중심으로 봐야 합니다.

### 세션과 컨텍스트 관리

컨텍스트는 Claude Code가 현재 대화와 파일, 명령어 결과를 바탕으로 작업하는 범위입니다. 대화가 길어졌을 때 어떤 명령어를 써야 하는지가 가장 많이 헷갈립니다.

| 슬래시 명령어 | 기능 | 언제 사용하나요 |
| --- | --- | --- |
| `/help` | 사용 가능한 명령과 도움말 보기 | 명령어가 기억나지 않을 때 |
| `/clear` | 새 대화 시작 | 완전히 다른 작업을 시작할 때 |
| `/compact` | 대화 내용을 요약해 컨텍스트 줄이기 | 같은 작업을 계속하되 대화가 길어졌을 때 |
| `/context` | 컨텍스트 사용 현황 보기 | 어떤 내용이 공간을 차지하는지 확인할 때 |
| `/resume` | 다른 세션 선택해 이어가기 | 현재 세션에서 이전 세션으로 이동할 때 |
| `/rename 이름` | 현재 세션 이름 바꾸기 | 나중에 찾기 쉽게 이름을 붙일 때 |
| `/export 파일명` | 현재 대화를 파일로 저장 | 작업 기록을 보관하거나 공유할 때 |

`/clear`와 `/compact`의 차이는 분명합니다. `/clear`는 현재 대화를 비우고 새 작업을 시작합니다. 이전 세션은 나중에 다시 엽니다. `/compact`는 지금까지의 작업을 요약한 뒤 같은 작업을 계속합니다.

```text
/context
/compact API 변경과 테스트 실패 원인을 중심으로 요약해 줘
/clear
```

대화가 길어졌다는 이유만으로 `/clear`를 실행하면 필요한 결정 사항까지 현재 세션에서 빠질 수 있습니다. 같은 기능을 계속 고치는 중이라면 먼저 `/context`로 상태를 확인한 뒤 `/compact`를 사용하는 편이 맞습니다.

### 모델과 권한 설정

모델과 권한은 작업을 시작하기 전에 확인할 수 있는 설정입니다. 파일을 수정하거나 셸 명령어를 실행할 수 있는 범위가 달라지므로, 처음 실행한 세션에서는 현재 상태를 한 번 확인하는 편이 좋습니다.

| 슬래시 명령어 | 기능 |
| --- | --- |
| `/model` | 현재 모델과 추론 수준 변경 |
| `/effort` | 추론에 사용할 노력 수준 조정 |
| `/permissions` | 파일과 명령어 권한 확인 및 변경 |
| `/config` | 설정 화면 열기 |
| `/status` | 현재 세션 상태 확인 |
| `/init` | 프로젝트 지침 파일을 준비하는 초기화 흐름 시작 |

설정 이름과 사용 가능한 값은 버전과 계정 환경에 따라 달라질 수 있습니다. 화면에 표시되는 항목을 기준으로 선택하고, 기억나지 않는 명령어는 `/`를 입력한 뒤 검색하는 방식이 가장 정확합니다.

### 계획, 변경 사항, 리뷰

코드 수정 전후에 사용할 명령어도 따로 있습니다.

| 슬래시 명령어 | 기능 | 사용 순서 |
| --- | --- | --- |
| `/plan` | 계획 모드로 전환 | 큰 변경을 시작하기 전 |
| `/diff` | 현재 변경 사항 보기 | 수정된 파일을 확인할 때 |
| `/review` | 변경 내용 리뷰 | 커밋이나 PR 전 |
| `/simplify` | 최근 변경 사항을 단순화하는 검토 | 기능을 구현한 뒤 |
| `/rewind` | 대화나 코드 상태를 이전 시점으로 되돌리기 | 잘못된 변경을 되돌릴 때 |
| `/doctor` | 설치와 실행 문제 진단 | Claude Code가 이상하게 동작할 때 |

`/review`는 코드가 맞는지 보장하는 명령어가 아닙니다. 리뷰 결과를 확인하고 실제 테스트를 실행해야 합니다. `/rewind`도 모든 외부 상태를 되돌리는 기능으로 생각하면 안 됩니다. Git 커밋과 작업 트리를 별도로 확인해야 합니다.

![Claude Code에서 권한 우회 모드가 활성화된 화면. 입력란 아래에 bypass permissions on 상태가 표시되어 있음](/images/insights/claude-code-shortcuts-guide/claude-permissions-status.png)

권한 상태는 작업을 시작하기 전에 확인해야 하는 정보입니다. Claude Code 공식 문서의 CLI 참조에도 권한 모드를 지정하는 옵션이 따로 안내되어 있으므로, 장시간 작업을 맡길 때는 현재 승인 범위를 확인한 뒤 실행하는 편이 좋습니다.

## Claude Code 키보드 단축키

슬래시 명령어는 `/`를 입력하고 Enter를 누르는 방식이지만, 키보드 단축키는 현재 입력이나 실행 상태를 즉시 바꿉니다.

| 단축키 | 기능 | 설명 |
| --- | --- | --- |
| `Ctrl+C` | 현재 입력이나 실행 중인 작업 중단 | 멈추고 새 요청을 입력할 때 |
| `Ctrl+D` | Claude Code 종료 | 입력이 비어 있을 때 사용 |
| `Ctrl+O` | 대화 기록 표시 전환 | 도구 실행 과정까지 자세히 볼 때 |
| `Ctrl+R` | 이전 프롬프트 검색 | 과거에 입력한 요청을 다시 찾을 때 |
| `Esc` | 현재 입력 취소 또는 모드 전환 | 작성 중인 요청을 버릴 때 |
| `Tab` | 자동 완성 | 파일 경로와 명령어를 입력할 때 |
| `?` | 단축키 도움말 보기 | 현재 화면에서 가능한 키를 확인할 때 |
| `Ctrl+B` | 실행 중인 Bash 명령을 백그라운드로 보내기 | 오래 걸리는 테스트나 서버를 계속 실행할 때 |

Claude Code가 실행 중인 Bash 명령을 백그라운드로 보내면 작업 ID가 표시되고, Claude Code는 다음 요청을 바로 받습니다. tmux를 함께 사용하는 경우 `Ctrl+B`가 tmux의 기본 접두 키와 겹치므로, Claude Code 문서에 안내된 대로 `Ctrl+B`를 두 번 눌러야 할 수 있습니다.

## Claude Code와 tmux를 함께 쓰는 기본 흐름

tmux는 터미널 세션을 유지하는 도구이고 Claude Code는 프로젝트를 작업하는 도구입니다. Claude Code가 긴 테스트나 개발 서버를 실행하는 동안 터미널 연결이 끊길 수 있다면 tmux 안에서 세션을 시작합니다.

```bash
# 새 tmux 세션을 만듭니다.
tmux new -s claude-work

# Claude Code를 시작합니다.
claude
```

Claude Code에서 작업을 시작한 뒤 tmux 세션에서 빠져나오려면 `Ctrl+B`를 누르고 `d`를 누릅니다. 나중에 다음 명령어로 돌아옵니다.

```bash
tmux attach -t claude-work
```

Claude Code 자체의 세션 기록은 `claude -c`, `claude -r`, `/resume`으로 관리하고, 터미널 화면의 보존은 tmux가 맡습니다. 두 기능을 분리해서 기억하면 `/resume`과 `tmux attach`를 헷갈리지 않습니다.

## Claude Code 명령어를 검색할 때 같이 찾는 말

검색어에 따라 필요한 명령어가 달라집니다.

| 검색하려는 문제 | 먼저 확인할 명령어 |
| --- | --- |
| Claude Code 이전 대화 이어가기 | `claude -c`, `claude -r`, `/resume` |
| Claude Code 컨텍스트 줄이기 | `/context`, `/compact` |
| Claude Code 대화 초기화 | `/clear` |
| Claude Code 변경 사항 확인 | `/diff`, `/review` |
| Claude Code 권한 설정 | `/permissions`, `/config` |
| Claude Code가 멈췄을 때 | `Ctrl+C`, `/doctor` |
| Claude Code를 오래 실행하기 | `tmux new -s`, `Prefix d`, `tmux attach` |

## 자주 묻는 질문

### Claude Code에서 `/clear`를 실행하면 이전 대화가 삭제되나요?

현재 세션의 대화 맥락이 비워지고 새 대화가 시작됩니다. 이전 세션은 저장되어 있으므로 `/resume`이나 `claude -r`로 다시 열 수 있습니다.

### `/compact`와 자동 압축은 같은 기능인가요?

둘 다 대화 기록을 요약해 컨텍스트 사용량을 줄이는 기능입니다. 자동 압축은 컨텍스트가 차면 Claude Code가 실행하고, `/compact`는 사용자가 원하는 시점에 직접 실행합니다.

### Claude Code 단축키 목록은 어디에서 확인하나요?

실행 중인 Claude Code 프롬프트에서 `/`를 입력하면 쓸 수 있는 슬래시 명령어가 표시됩니다. 키보드 단축키는 `?`를 입력하거나 공식 대화형 모드 문서에서 확인할 수 있습니다.

### Claude Code와 Codex의 단축 명령어가 같은가요?

둘 다 터미널에서 실행하고 세션 안에 명령어를 입력한다는 점은 비슷하지만 명령 이름과 설정 파일, 권한 방식은 다릅니다. Codex 명령어는 [Codex CLI 단축 명령어 정리](/insights/codex-cli-shortcuts-guide)에서 별도로 확인하는 편이 정확합니다.

## Sources

- [Claude Code 대화형 모드 공식 문서](https://code.claude.com/docs/en/interactive-mode)
- [Claude Code 명령어 공식 문서](https://code.claude.com/docs/en/commands)
- [Claude Code 세션 관리 공식 문서](https://code.claude.com/docs/en/sessions)
- [Claude Code CLI 공식 문서](https://code.claude.com/docs/en/cli-usage)
