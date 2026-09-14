---
slug: codex-cli-shortcuts-guide
title: 'Codex CLI 단축 명령어 정리: 자주 쓰는 명령과 옵션'
excerpt: >-
  Codex CLI 단축 명령어와 터미널 옵션을 대화형 세션, 작업 재개, 코드 리뷰, 자동 실행 순서로 정리했습니다. /init,
  /status, /review, codex exec, codex resume, --image, --search 명령을 tmux와 함께
  사용하는 방법도 설명합니다.
category: AI_TECH
tags:
  - AI
  - 자동화
  - 바이브코딩
  - SEO
publishedAt: '2026-09-11T00:00:00.000Z'
highlights:
  - >-
    Codex CLI의 `/init`, `/status`, `/permissions`, `/model`, `/review`는 실행 중인 세션
    안에서 입력합니다.
  - '`codex resume`은 이전 대화를 다시 열고 `codex exec`는 대화형 화면 없이 반복 작업과 스크립트를 실행합니다.'
  - >-
    `--image`, `--search`, `mcp`, `completion`은 시각 자료, 최신 정보, 외부 도구, 셸 자동 완성에
    연결되는 주요 옵션입니다.
metaTitle: 'Codex CLI 명령어 정리: 단축 명령과 옵션 사용법'
metaDescription: >-
  Codex CLI는 터미널에서 코드를 읽고 수정하며 명령어를 실행하는 코딩 에이전트입니다. /init, /status, /review와
  codex exec, codex resume, --image, --search 옵션을 실제 개발 흐름에 맞춰 담았습니다.
ogTitle: 'Codex CLI 명령어 정리: /init부터 codex exec까지'
ogDescription: >-
  Codex CLI에서 자주 쓰는 /init, /status, /review, codex exec, codex resume 명령과 주요 옵션을
  한 번에 정리했습니다.
ogImage: /og/codex-cli-shortcuts-guide.png
quiz:
  - question: 대화형 화면 없이 Codex 작업을 반복 실행하거나 스크립트에 연결하려면 어떤 명령어를 사용해야 할까요?
    options:
      - codex exec를 사용합니다
      - codex resume를 사용합니다
      - /status를 사용합니다
      - /init를 사용합니다
    correctIndex: 0
    explanation: >-
      codex exec는 대화형 화면 없이 한 번의 작업을 실행하는 CLI 명령입니다. 이전 대화를 이어가는 codex resume과
      달리 반복 작업과 파이프라인에 연결할 때 사용합니다.
summary3:
  - Codex CLI는 터미널에서 저장소의 코드를 읽고 수정하며 로컬 명령어를 실행하는 코딩 에이전트입니다.
  - >-
    세션 안에서는 /init과 /status, /permissions, /model, /review를 쓰고 세션 밖에서는 codex
    resume과 codex exec를 사용합니다.
  - >-
    반복 작업은 codex exec로 자동화하고 이미지와 최신 정보가 필요할 때는 --image와 --search를 실행 옵션으로
    추가합니다.
---

## Codex CLI 단축 명령어는 어디에 입력하나요?

Codex CLI는 터미널에서 저장소의 코드를 읽고 수정하며 로컬 명령어를 실행하는 코딩 에이전트입니다. 명령어를 찾을 때는 Codex가 실행된 뒤 입력하는 명령과 일반 셸에서 입력하는 명령을 나눠야 합니다.

Codex를 실행한 뒤 프롬프트에 입력하는 `/init`, `/status`, `/permissions`, `/model`, `/review`는 **세션 안의 슬래시 명령어**입니다. 반면 `codex resume`과 `codex exec`는 Codex가 실행되기 전 일반 터미널에서 **CLI 명령어**로 입력합니다.

![OpenAI Codex CLI 공식 문서 화면. Codex를 터미널에서 실행하고 /init, /status, /permissions, /model, /review를 사용하는 예시가 표시되어 있음](/images/insights/codex-cli-shortcuts-guide/codex-cli-official-docs.png)

OpenAI 공식 문서의 시작 화면에도 이 다섯 가지 세션 명령어가 표시됩니다. 검색 결과에서 `/review`를 찾았다면 Codex를 실행한 뒤 입력하고, `codex exec`를 찾았다면 일반 셸에서 입력해야 합니다.

## Codex CLI 기본 명령어 정리

프로젝트 폴더에서 가장 기본이 되는 명령은 `codex`입니다.

| 명령어 | 기능 | 예시 |
| --- | --- | --- |
| `codex` | 대화형 Codex 세션 시작 | `codex` |
| `codex resume` | 저장된 대화 다시 열기 | `codex resume` |
| `codex exec` | 대화형 화면 없이 작업 실행 | `codex exec "테스트를 실행하고 실패 원인을 정리해 줘"` |
| `codex --image 파일` | 이미지나 화면을 프롬프트에 추가 | `codex --image error.png` |
| `codex --search` | 현재 웹 검색을 사용하는 세션 시작 | `codex --search` |
| `codex mcp` | MCP 서버와 연결 관리 | `codex mcp` |
| `codex completion` | 셸 자동 완성 설정 생성 | `codex completion` |
| `codex --help` | 도움말 보기 | `codex --help` |

OpenAI 공식 문서는 Codex CLI를 로컬 저장소를 탐색하고, 파일을 수정하고, 로컬 도구를 실행하는 터미널 작업 흐름으로 설명합니다. 같은 문서에서 `codex exec`는 반복 가능한 작업과 파이프라인에 사용할 수 있는 명령으로 안내합니다.

```bash
# 프로젝트 폴더로 이동합니다.
cd ~/work/my-app

# 대화형 세션을 시작합니다.
codex
```

첫 실행 뒤에는 프로젝트 설명이나 작업 요청을 입력합니다.

```text
이 프로젝트의 폴더 구조와 실행 방법을 설명해 줘.
```

## Codex 세션 안에서 쓰는 슬래시 명령어

Codex 세션 안에서 `/`를 입력하면 명령어 목록이 열립니다. 작업을 시작하기 전 프로젝트 지침을 만들고, 현재 설정과 권한을 확인하는 흐름이 기본입니다.

| 슬래시 명령어 | 기능 | 사용하는 순간 |
| --- | --- | --- |
| `/init` | `AGENTS.md` 등 프로젝트 지침 파일 준비 | 처음 프로젝트를 열었을 때 |
| `/status` | 현재 세션 설정 확인 | 모델, 폴더, 권한 상태를 볼 때 |
| `/permissions` | 파일 수정과 명령 실행 권한 선택 | 작업 범위를 정할 때 |
| `/model` | 모델과 추론 노력 수준 변경 | 작업 특성에 맞게 조정할 때 |
| `/review` | 변경 사항 리뷰 시작 | 커밋이나 PR 전에 확인할 때 |
| `?` | 현재 단축키 도움말 보기 | 키보드 조작을 확인할 때 |

`/init`은 단순히 대화 내용을 저장하는 명령이 아닙니다. Codex가 프로젝트에서 지켜야 할 작업 규칙을 파일에 적어 두는 초기화 흐름입니다. 코드 스타일, 테스트 명령, 디렉터리 구조처럼 매번 설명할 내용을 프로젝트 지침 파일에 남길 수 있습니다.

`/permissions`는 작업 전에 확인할 가치가 큽니다. Codex 공식 문서도 모델, 추론 노력, 권한과 실행 명령을 작업에 맞게 선택할 수 있다고 설명합니다. 파일 수정이나 명령 실행을 맡길 때는 현재 권한과 작업 폴더를 먼저 확인하는 편이 안전합니다.

## Codex 작업을 다시 시작하는 명령어

터미널을 닫았거나 다른 작업으로 이동한 뒤 이전 Codex 대화를 이어가려면 `codex resume`을 사용합니다.

```bash
# 최근 저장된 대화를 선택합니다.
codex resume
```

대화형 화면이 열리면 최근 작업을 골라 다시 시작합니다. Codex 공식 문서는 현재 저장소의 최근 대화를 다시 열거나 로컬 대화 목록에서 이전 작업을 찾는 용도로 `codex resume`을 안내합니다.

세션 재개와 tmux 세션 재연결은 서로 다른 기능입니다. `codex resume`은 Codex의 대화와 작업 맥락을 다시 여는 명령이고, `tmux attach -t 이름`은 터미널 화면을 다시 여는 명령입니다. Codex 화면이 그대로 남아 있다면 tmux만 다시 연결해도 되지만, 화면을 종료했다면 `codex resume`이 필요합니다.

## Codex CLI 자동 실행 명령어

`codex exec`는 대화형 화면을 열지 않고 한 번의 작업을 실행하는 명령입니다. 반복 작업, 셸 스크립트, CI와 같은 자동 실행 환경에서 씁니다.

```bash
codex exec "현재 변경 사항을 읽고 테스트를 실행한 뒤 실패 원인을 report.md에 정리해 줘"
```

기본 작업은 읽기 중심으로 시작하고, 파일을 만들거나 수정해야 할 때는 실행 환경의 권한과 샌드박스 설정을 명시해야 합니다. 권한 옵션은 설치 버전과 설정에 따라 다를 수 있으므로 실행 전에 `codex --help`와 공식 CLI 문서를 확인하는 편이 정확합니다.

프롬프트를 파일에 적어 두고 반복해서 실행할 수도 있습니다.

```bash
codex exec "$(cat prompt.txt)"
```

프롬프트 파일을 사용하면 긴 요구 사항을 셸 명령어에 직접 붙이지 않아도 됩니다. 같은 작업을 다시 실행하거나 요구 사항을 수정할 때도 변경 지점을 추적하기 쉽습니다.

## Codex CLI 주요 옵션

### `--image`

에러 화면, 디자인 시안, 구조도처럼 이미지에 정보가 있을 때 `--image`를 사용합니다.

```bash
codex --image error.png
```

이미지를 추가한 뒤 화면에 보이는 오류와 관련 파일을 함께 설명하면, Codex가 시각 자료와 저장소 내용을 연결해 작업합니다. 이미지 경로는 현재 환경에서 Codex가 읽을 수 있는 파일이어야 합니다.

![Codex CLI 작업 결과 화면. 터미널에서 실행한 작업의 결과와 점검 내용이 출력되어 있음](/images/insights/codex-cli-shortcuts-guide/codex-result.png)

대화형 명령과 자동 실행 명령은 결과 형태가 서로 다릅니다. 공식 문서에서 `codex exec`를 반복 가능한 작업과 파이프라인에 사용하는 방식으로 설명하는 이유도 여기에 있습니다.

### `--search`

현재 라이브러리 버전, 공식 문서, 외부 서비스 동작처럼 최신 정보가 필요한 작업에서는 `--search`를 붙입니다.

```bash
codex --search
```

검색이 필요한 이유와 확인할 공식 문서 범위를 프롬프트에 함께 적는 편이 좋습니다. 검색 결과가 있다고 해서 저장소의 코드와 자동으로 일치하는 것은 아니므로, 실제 설치 버전과 테스트 결과를 따로 확인해야 합니다.

### `mcp`

MCP는 외부 도구와 데이터를 Codex에 연결하는 표준입니다. `codex mcp`는 MCP 서버 연결을 설정하고 현재 세션에서 사용할 도구를 확인할 때 쓰는 명령입니다.

```bash
codex mcp
```

MCP 서버를 연결하면 Codex가 외부 서비스의 데이터를 읽거나 작업을 실행합니다. 연결 대상과 권한 범위가 넓어질 수 있으므로, 실제로 필요한 서버만 활성화하고 로그인 상태를 확인하는 편이 좋습니다.

### `completion`

셸 자동 완성은 긴 명령어와 옵션을 입력할 때 도움을 줍니다.

```bash
codex completion
```

출력되는 설정 방법은 사용 중인 셸과 설치 방식에 따라 다를 수 있습니다. zsh와 bash에서 설정 파일 위치가 다르므로 안내된 명령어를 현재 셸에 맞게 적용해야 합니다.

## Codex CLI를 tmux에서 실행하기

Codex와 tmux를 함께 쓰면 작업 화면을 유지하면서 여러 터미널 작업을 나눕니다. tmux는 화면을 관리하고 Codex는 저장소를 작업하므로, 두 도구의 명령어를 섞어 기억하지 않는 것이 핵심입니다.

```bash
# Codex 작업용 세션을 만듭니다.
tmux new -s codex-work

# 프로젝트로 이동한 뒤 Codex를 시작합니다.
cd ~/work/my-app
codex
```

터미널을 잠시 닫아야 한다면 `Ctrl+B`를 누르고 `d`를 누릅니다. 여기서 `Ctrl+B`는 tmux의 접두 키입니다. 나중에 다음 명령어로 Codex가 실행 중인 화면에 돌아옵니다.

```bash
tmux attach -t codex-work
```

Codex와 Claude Code를 같은 프로젝트에서 번갈아 사용한다면 세션이나 패널 이름을 구분해 두는 편이 좋습니다.

```text
tmux 세션: ai-work
윈도 0: claude
윈도 1: codex
윈도 2: tests
```

같은 파일을 Claude Code와 Codex가 동시에 수정하게 두면 변경 내용이 섞일 수 있습니다. 한 도구가 수정하는 동안 다른 도구는 리뷰와 테스트 결과 확인에 사용하는 식으로 작업 순서를 나누는 편이 안전합니다.

## Codex CLI와 Claude Code 명령어 비교

두 도구 모두 터미널에서 실행하고 세션 안에서 명령을 입력하지만, 명령어 이름은 서로 다릅니다.

| 작업 | Codex CLI | Claude Code |
| --- | --- | --- |
| 세션 시작 | `codex` | `claude` |
| 프로젝트 초기화 | `/init` | `/init` |
| 상태 확인 | `/status` | `/status` |
| 권한 설정 | `/permissions` | `/permissions` 또는 `/config` |
| 모델 변경 | `/model` | `/model` |
| 코드 리뷰 | `/review` | `/review` |
| 이전 세션 재개 | `codex resume` | `claude -c`, `claude -r`, `/resume` |
| 비대화형 실행 | `codex exec` | `claude -p` |

이름이 같아도 동작과 설정은 같다고 볼 수 없습니다. 특히 비대화형 실행과 권한 설정은 도구별 공식 문서를 기준으로 확인해야 합니다. Claude Code 단축키는 [Claude Code 단축키와 슬래시 명령어 정리](/insights/claude-code-shortcuts-guide)에서 따로 정리했습니다.

## 자주 묻는 질문

### Codex CLI에서 가장 먼저 외울 명령어는 무엇인가요?

`codex`, `/status`, `/permissions`, `/review`, `codex resume`을 먼저 익히면 됩니다. 세션을 시작하고 현재 설정을 확인한 뒤 변경 사항을 리뷰하고, 나중에 이전 작업을 이어가는 기본 흐름을 만들 수 있습니다.

### `codex exec`와 `codex`는 무엇이 다른가요?

`codex`는 대화형 세션을 열어 작업 중간에 계속 요청을 주고받는 명령입니다. `codex exec`는 한 번의 작업을 실행하고 결과를 받는 방식이라 스크립트와 반복 작업에 맞습니다.

### Codex CLI에서 이전 대화를 어떻게 찾나요?

일반 터미널에서 `codex resume`을 실행하면 저장된 대화를 골라 다시 엽니다. 현재 tmux 화면이 살아 있다면 `tmux attach -t 세션이름`으로 먼저 화면을 확인합니다.

### Codex CLI는 Claude Code와 같은 명령어를 사용하나요?

`/init`, `/status`, `/permissions`, `/model`, `/review`처럼 이름이 같은 명령은 있지만 세부 동작과 설정은 도구마다 다릅니다. 두 도구의 명령어를 섞어 입력하지 말고 각 공식 문서를 기준으로 확인해야 합니다.

## Sources

- [Codex CLI 공식 문서](https://learn.chatgpt.com/docs/codex/cli)
- [Codex CLI 참조 문서](https://learn.chatgpt.com/docs/codex/cli)
- [Codex CLI 자동화 공식 문서](https://learn.chatgpt.com/docs/non-interactive-mode)
- [tmux 공식 GitHub 저장소](https://github.com/tmux/tmux)
