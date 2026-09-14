---
slug: tmux-shortcuts-guide
title: 'tmux 단축키 정리: 세션, 윈도, 패널 명령어 모음'
excerpt: >-
  tmux 단축키와 명령어를 세션, 윈도, 패널 관리 순서로 정리했습니다. Ctrl+b 접두 키부터 분할, 이동, 복사, 종료까지 Claude
  Code와 Codex를 터미널에서 오래 실행할 때 필요한 명령을 예시와 함께 설명합니다.
category: AI_TECH
tags:
  - AI
  - 자동화
  - 바이브코딩
  - SEO
publishedAt: '2026-09-11T00:00:00.000Z'
highlights:
  - tmux 단축키는 대부분 Ctrl+b를 먼저 누른 다음 두 번째 키를 누르는 방식으로 실행합니다.
  - '세션은 작업 묶음이고, 윈도는 탭이며, 패널은 한 화면 안에서 나눈 터미널입니다.'
  - tmux 세션을 만들어 두면 터미널을 닫아도 Claude Code와 Codex 작업 화면에 다시 연결합니다.
metaTitle: 'tmux 단축키 정리: 세션, 윈도, 패널 명령어 모음'
metaDescription: >-
  tmux는 터미널 세션을 유지하고 여러 작업 화면을 나누는 도구입니다. tmux 단축키와 세션, 윈도, 패널 명령어를 Claude Code와
  Codex를 실행하는 실전 예시와 SSH 연결이 끊겨도 작업을 이어 가는 방법으로 정리했습니다.
ogTitle: 'tmux 단축키 총정리: Ctrl+b부터 세션 복구까지'
ogDescription: 'Ctrl+b 접두 키부터 세션 생성, 패널 분할, 복사 모드, 작업 복구까지 tmux에서 자주 쓰는 단축키를 한 번에 정리했습니다.'
ogImage: /og/tmux-shortcuts-guide.png
quiz:
  - question: tmux에서 실행 중인 작업을 계속 둔 채 터미널 화면만 빠져나오려면 어떤 단축키를 사용해야 할까요?
    options:
      - Ctrl+b를 누른 뒤 d를 누릅니다
      - Ctrl+b를 누른 뒤 x를 누릅니다
      - Ctrl+b를 누른 뒤 &를 누릅니다
      - Ctrl+c를 누릅니다
    correctIndex: 0
    explanation: >-
      Ctrl+b 다음에 d를 누르면 현재 tmux 세션에서 분리됩니다. 세션과 안에서 실행 중인 프로세스는 남아 있으므로 나중에 tmux
      attach -t 이름으로 다시 연결합니다.
summary3:
  - tmux는 터미널 세션을 유지하면서 하나의 창 안에서 여러 작업 화면을 관리하는 터미널 멀티플렉서입니다.
  - '기본 단축키는 Ctrl+b를 먼저 누른 뒤 두 번째 키를 누르며 세션, 윈도, 패널을 각각 관리합니다.'
  - tmux new -s 이름으로 세션을 만들고 Ctrl+b d로 빠져나온 뒤 tmux attach -t 이름으로 작업 화면을 다시 엽니다.
---

## tmux 단축키를 먼저 찾는 이유

tmux는 터미널 세션을 유지하면서 하나의 창 안에서 여러 작업 화면을 관리하는 터미널 멀티플렉서입니다. 터미널을 닫거나 SSH 연결이 끊겨도 세션을 남겨 둘 수 있어, 오래 걸리는 테스트와 Claude Code, Codex 작업을 실행할 때 유용합니다.

검색 결과에서 가장 자주 찾는 tmux 단축키는 `Ctrl+b d`입니다. `Ctrl+b`를 먼저 누르고 손을 뗀 뒤 `d`를 누르면 현재 세션에서 빠져나옵니다. 실행 중인 프로세스는 계속 남아 있으므로, 나중에 같은 세션으로 다시 들어가면 작업 화면이 그대로 보입니다.

![tmux로 나뉜 터미널 실제 화면. 편집기와 셸 프롬프트, tmux 매뉴얼이 한 창 안의 여러 패널에 표시되어 있음](/images/insights/tmux-shortcuts-guide/tmux-with-panes.png)

위 화면처럼 한 윈도 안에 여러 패널을 만들면 편집기와 로그, 테스트 명령이 한 화면에 놓입니다. 화면 구성은 단축키로 바꿀 수 있고, 세션 이름은 셸 명령어로 관리합니다. [tmux 공식 위키의 Getting Started 가이드](https://github.com/tmux/tmux/wiki/Getting-Started)도 같은 기본 구조를 세션, 윈도, 패널 순서로 설명합니다.

tmux의 단축키는 일반 키 하나가 아니라 **접두 키(prefix)**와 두 번째 키를 조합합니다. 기본 접두 키는 `Ctrl+b`입니다. 아래 표에서 `Prefix`라고 표시한 항목은 `Ctrl+b`를 먼저 누른다는 뜻입니다.

## tmux 단축키 한눈에 보기

### 세션과 윈도 관리

세션은 하나의 작업 묶음입니다. 프로젝트별로 세션을 만들고, 한 세션 안에서 윈도와 패널을 나누면 작업 위치를 기억하기 쉽습니다.

| 단축키 | 기능 | 사용하는 순간 |
| --- | --- | --- |
| `Prefix d` | 현재 세션에서 빠져나오기 | 작업을 계속 실행한 채 터미널로 돌아갈 때 |
| `Prefix c` | 새 윈도 만들기 | 같은 세션에서 새 터미널이 필요할 때 |
| `Prefix n` | 다음 윈도로 이동 | 오른쪽 윈도로 이동할 때 |
| `Prefix p` | 이전 윈도로 이동 | 왼쪽 윈도로 이동할 때 |
| `Prefix w` | 윈도 목록 열기 | 이름을 보고 이동할 때 |
| `Prefix ,` | 현재 윈도 이름 바꾸기 | `server`, `claude`, `tests`처럼 구분할 때 |
| `Prefix &` | 현재 윈도 닫기 | 윈도와 그 안의 프로세스를 종료할 때 |
| `Prefix l` | 직전 윈도로 이동 | 방금 사용한 윈도와 오갈 때 |

### 패널 분할과 이동

패널은 한 윈도 안에서 나눈 터미널 영역입니다. 서버를 실행하는 패널, AI 코딩 도구를 실행하는 패널, 테스트 명령을 실행하는 패널을 나눠 두면 화면을 바꾸는 횟수가 줄어듭니다.

| 단축키 | 기능 | 사용하는 순간 |
| --- | --- | --- |
| `Prefix %` | 화면을 좌우로 나누기 | 두 터미널을 나란히 볼 때 |
| `Prefix "` | 화면을 위아래로 나누기 | 로그와 명령 입력을 함께 볼 때 |
| `Prefix o` | 다음 패널로 이동 | 패널을 순서대로 확인할 때 |
| `Prefix 방향키` | 해당 방향의 패널로 이동 | 원하는 패널로 바로 갈 때 |
| `Prefix z` | 현재 패널을 전체 화면으로 전환 | 한 패널의 로그를 크게 볼 때 |
| `Prefix x` | 현재 패널 닫기 | 패널과 프로세스를 종료할 때 |
| `Prefix q` | 패널 번호 표시 | 번호를 보고 이동할 때 |

`Prefix %`에서 `%`는 키보드 배열에 따라 `Shift+5`를 눌러 입력합니다. `Prefix "`도 같은 방식으로 큰따옴표를 넣습니다. 화면을 분할한 뒤에는 `Prefix 방향키`가 `Prefix o`보다 빠르게 느껴지는 경우가 많습니다.

![tmux 공식 위키의 기본 화면. 터미널 아래에 초록색 상태줄이 있고 세션과 윈도 정보가 표시되어 있음](/images/insights/tmux-shortcuts-guide/tmux-default.png)

상태줄은 현재 세션과 윈도 위치를 확인하는 곳입니다. `Prefix w`로 윈도 목록을 열었을 때도 이 이름이 기준이 되므로, 오래 실행하는 작업에는 `Prefix ,`로 윈도 이름을 붙여 두는 편이 좋습니다.

### 스크롤과 복사

터미널에 출력된 로그는 화면을 넘어가면 바로 사라진 것처럼 보입니다. tmux의 복사 모드를 쓰면 이전 출력으로 올라가 내용을 확인하고 텍스트를 복사합니다.

| 단축키 | 기능 |
| --- | --- |
| `Prefix [` | 복사 모드 시작 |
| 방향키 또는 `PageUp` | 화면 위아래로 이동 |
| `q` | 복사 모드 종료 |
| `Prefix ]` | tmux 버퍼에 복사한 내용 붙여 넣기 |
| `Prefix ?` | 현재 키 바인딩 목록 보기 |

복사 모드에서 마우스 동작은 터미널 설정과 tmux 설정에 따라 달라질 수 있습니다. 키보드 방식으로 확인하려면 `Prefix [`를 누른 뒤 이동하고, 필요한 내용을 선택하는 방식이 안전합니다.

## tmux 세션을 만드는 명령어

단축키는 이미 열린 세션을 조작할 때 쓰고, 세션을 만들거나 다시 연결할 때는 셸에서 `tmux` 명령어를 실행합니다. 세션, 윈도, 패널을 각각 독립된 대상으로 생각하면 명령어를 외우기 쉽습니다.

| 명령어 | 기능 | 예시 |
| --- | --- | --- |
| `tmux new -s 이름` | 이름을 정한 새 세션 만들기 | `tmux new -s my-app` |
| `tmux ls` | 실행 중인 세션 목록 보기 | `tmux ls` |
| `tmux attach -t 이름` | 기존 세션에 다시 연결하기 | `tmux attach -t my-app` |
| `tmux kill-session -t 이름` | 세션 종료하기 | `tmux kill-session -t my-app` |
| `tmux rename-session -t 이전 새이름` | 세션 이름 바꾸기 | `tmux rename-session -t 0 api` |
| `tmux new-window -n 이름` | 이름을 정한 윈도 만들기 | `tmux new-window -n tests` |
| `tmux split-window -h` | 좌우 패널 만들기 | `tmux split-window -h` |
| `tmux split-window -v` | 위아래 패널 만들기 | `tmux split-window -v` |

새 세션을 만드는 기본 흐름은 다음과 같습니다.

```bash
# 프로젝트 폴더로 이동합니다.
cd ~/work/my-app

# my-app이라는 tmux 세션을 만듭니다.
tmux new -s my-app

# 작업을 실행합니다.
claude

# Ctrl+b를 누른 뒤 d를 눌러 세션에서 빠져나옵니다.
```

다시 연결할 때는 다음 명령어를 실행합니다.

```bash
tmux ls
tmux attach -t my-app
```

세션 이름을 붙이지 않고 `tmux attach`만 실행하면 연결할 세션을 고르는 화면이 열립니다. 여러 프로젝트를 동시에 다룬다면 처음부터 이름을 붙이는 편이 관리하기 쉽습니다.

## Claude Code와 Codex를 tmux에서 실행하는 방법

tmux와 AI 코딩 도구의 역할은 다릅니다. tmux는 터미널 화면과 세션을 유지하고, Claude Code와 Codex는 프로젝트 파일을 읽고 수정하는 작업을 수행합니다. 두 기능을 한 도구로 생각하지 않으면 명령어를 눌러야 하는 위치도 헷갈리지 않습니다.

### 패널 두 개로 나누기

아래 예시는 왼쪽 패널에서 Claude Code를 실행하고 오른쪽 패널에서 Codex를 실행하는 방식입니다.

```bash
tmux new -s ai-work
```

세션 안에서 다음 순서로 실행합니다.

```text
1. claude 실행
2. Ctrl+b를 누른 뒤 %를 눌러 좌우로 분할
3. codex 실행
```

한 패널에서 코드를 수정하고 다른 패널에서 테스트 결과나 리뷰를 확인합니다. 두 에이전트가 같은 파일을 동시에 수정하게 두면 변경 내용이 충돌할 수 있으므로, 한쪽은 읽기와 검토에 사용하는 편이 안전합니다.

### 긴 작업을 실행하고 터미널을 닫기

서버 실행이나 테스트처럼 시간이 오래 걸리는 작업은 tmux 세션 안에서 실행합니다.

```bash
tmux new -s build
npm run build
```

작업을 계속 실행한 채 화면에서 빠져나오려면 `Prefix d`를 사용합니다. 다시 접속한 뒤 출력이 멈췄는지, 프로세스가 끝났는지 확인하려면 다음 명령어를 실행합니다.

```bash
tmux attach -t build
```

SSH로 서버에 접속해 작업할 때도 같은 방식이 적용됩니다. SSH 연결이 끊겨도 tmux 서버가 살아 있다면 작업 화면에 다시 들어갑니다. 다만 서버 자체가 재부팅되거나 tmux 프로세스가 종료된 경우에는 세션도 남지 않습니다.

## tmux 단축키가 작동하지 않을 때

### `Ctrl+b`를 눌렀는데 아무 변화가 없을 때

접두 키인 `Ctrl+b`는 눌러도 화면에 아무 문자가 뜨지 않는 키입니다. 누른 다음 손을 떼고 두 번째 키를 눌러야 합니다. `Ctrl+b`를 계속 누른 상태에서 `d`를 누르면 동작하지 않는 것처럼 보일 수 있습니다.

### `Ctrl+b`가 Claude Code에 전달되지 않을 때

tmux 안에서 Claude Code를 실행하면 `Ctrl+b`를 tmux가 먼저 해석합니다. Claude Code의 `Ctrl+B`는 실행 중인 Bash 명령을 백그라운드로 보내는 단축키인데, tmux 기본 접두 키와 겹칩니다. Claude Code 문서도 tmux 환경에서는 이 동작을 위해 `Ctrl+B`를 두 번 눌러야 한다고 안내합니다.

### 세션 이름을 찾지 못할 때

먼저 세션 목록을 확인합니다.

```bash
tmux ls
```

목록에 세션이 없으면 이미 종료된 것입니다. 목록에는 있는데 연결되지 않는다면 이름을 정확히 확인한 뒤 다음 명령어를 실행합니다.

```bash
tmux attach -t 세션이름
```

### tmux 안에서 또 tmux를 실행했을 때

`$TMUX` 환경 변수가 설정되어 있으면 이미 tmux 안에 있다는 뜻입니다. 이 상태에서 다시 `tmux new`를 실행하면 접두 키와 화면 구조가 겹쳐 헷갈릴 수 있습니다. 현재 세션을 확인하려면 다음 명령어를 실행합니다.

```bash
echo "$TMUX"
tmux display-message -p '#S:#I.#P'
```

## 자주 묻는 질문

### tmux에서 가장 먼저 외울 단축키는 무엇인가요?

`Prefix d`와 `Prefix c`, `Prefix n`, `Prefix p`를 먼저 외우면 됩니다. 세션에서 빠져나오고, 새 윈도를 만들고, 윈도 사이를 이동하는 기본 흐름을 만들 수 있습니다.

### tmux를 종료하면 실행 중인 Claude Code도 종료되나요?

`Prefix d`로 세션에서 빠져나오는 것은 tmux 세션을 종료하는 동작이 아닙니다. 프로세스는 계속 실행됩니다. `Prefix &`, `Prefix x`, `tmux kill-session`처럼 윈도나 세션을 종료하는 명령을 실행하면 안에서 실행한 프로세스도 종료될 수 있습니다.

### tmux 세션은 컴퓨터를 재부팅한 뒤에도 남아 있나요?

컴퓨터가 실행 중이고 tmux 서버가 살아 있는 동안 유지됩니다. 재부팅 뒤에는 기존 프로세스와 세션이 자동으로 복원되지 않으므로, 필요한 작업은 별도의 프로세스 관리자나 재시작 설정이 필요합니다.

### tmux와 터미널 탭은 무엇이 다른가요?

터미널 탭은 터미널 애플리케이션이 관리하는 화면이고, tmux 세션은 터미널 안에서 별도로 실행되는 작업 공간입니다. SSH 연결이 끊겨도 작업을 유지해야 하거나 서버에서 여러 작업을 묶어 관리할 때 tmux가 더 적합합니다.

## Sources

- [tmux 공식 GitHub 저장소](https://github.com/tmux/tmux)
- [tmux 매뉴얼](https://man7.org/linux/man-pages/man1/tmux.1.html)
- [Claude Code 대화형 모드 공식 문서](https://code.claude.com/docs/en/interactive-mode)
- [Claude Code 명령어 공식 문서](https://code.claude.com/docs/en/commands)
