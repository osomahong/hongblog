---
slug: claude-code-agents-md-support
title: '클로드 코드 AGENTS.md 공식 지원(v2.1.277): 읽는 조건과 읽지 않는 조건 정리'
excerpt: >-
  AGENTS.md는 여러 AI 코딩 도구가 함께 읽도록 만든 프로젝트 지시 파일입니다. 클로드 코드가 2026년 9월 18일
  v2.1.277부터 이 파일을 직접 읽기 시작했습니다. 다만 CLAUDE.md가 위쪽 폴더에 하나라도 남아 있으면 클로드는
  AGENTS.md를 읽지 않습니다. 공식 문서와 직접 확인한 결과로 읽는 조건과 읽지 않는 조건을 정리했습니다.
category: AI_TECH
tags:
  - AI
  - 바이브코딩
  - 자동화
relatedSlugs:
  - claude-md-setup-official-docs
  - codex-claude-code-import-migration
  - claude-code-practical-guide
publishedAt: '2026-09-19T00:00:00.000Z'
highlights:
  - >-
    AGENTS.md만 남기려고 CLAUDE.md를 지우기 전에 상위 폴더와 CLAUDE.local.md까지 확인합니다. 위쪽에 하나라도
    남아 있으면 클로드가 AGENTS.md를 읽지 않습니다.
  - >-
    두 파일을 함께 읽으려면 `/config`의 Project instructions를 claude-md-and-agents-md로
    바꿉니다. 프로젝트 폴더의 settings.json에 적으면 무시되므로 사용자 설정 파일에 적습니다.
  - >-
    AGENTS.md로 읽은 내용은 `/memory` 목록에 뜨지 않고 `InstructionsLoaded` 훅도 실행되지 않으므로,
    훅으로 지시문을 검증하던 설정이 있으면 함께 확인합니다.
metaTitle: '클로드 코드 AGENTS.md 공식 지원(v2.1.277), 읽는 조건과 읽지 않는 조건'
metaDescription: >-
  AGENTS.md는 여러 AI 코딩 도구가 함께 읽도록 만든 프로젝트 지시 파일입니다. 클로드 코드 v2.1.277부터 직접 읽지만, 작업
  폴더 위쪽에 CLAUDE.md가 하나라도 남아 있으면 읽지 않습니다. 설정값 네 가지와 기능이 켜지지 않는 경우를 공식 문서로 정리했습니다.
ogTitle: '클로드 코드 AGENTS.md 지원이 켜지지 않는 이유'
ogDescription: >-
  CLAUDE.md가 위쪽 폴더에 하나라도 남아 있으면 클로드는 AGENTS.md를 읽지 않습니다. 직접 폴더 네 개로 확인한 결과와 설정값
  네 가지를 정리했습니다.
ogImage: /og/claude-code-agents-md-support.png
quiz:
  - question: 작업 폴더에 AGENTS.md가 있고 그 위쪽 폴더에 CLAUDE.md가 있으면 클로드 코드는 무엇을 읽을까요?
    options:
      - 위쪽 폴더의 CLAUDE.md만 읽고 작업 폴더의 AGENTS.md는 읽지 않는다
      - 가까운 쪽이 이기므로 작업 폴더의 AGENTS.md를 읽는다
      - 둘 다 읽어서 순서대로 합친다
    correctIndex: 0
    explanation: >-
      기본값에서 클로드는 작업 폴더와 그 위쪽 어느 폴더든 CLAUDE.md, .claude/CLAUDE.md,
      CLAUDE.local.md 가운데 하나라도 찾으면 AGENTS.md를 열지 않습니다. 가까운 쪽을 읽는 것이 아니라 CLAUDE.md가 있는지 없는지로 정해집니다. 둘 다
      읽게 하려면 Project instructions를 claude-md-and-agents-md로 바꿉니다.
summary3:
  - 클로드 코드는 2026년 9월 18일 공개한 v2.1.277부터 AGENTS.md를 프로젝트 지시 파일로 직접 읽습니다.
  - >-
    두 파일을 합쳐 읽는 것이 아니라 CLAUDE.md도 CLAUDE.local.md도 작업 폴더와 그 위쪽에 없을 때만 AGENTS.md를 읽는 방식입니다.
  - >-
    두 파일을 함께 읽게 하려면 /config의 Project instructions를 claude-md-and-agents-md로 바꿔야 하고 이 값은 프로젝트 settings.json에 적으면 무시됩니다.
---

AGENTS.md는 여러 AI 코딩 도구가 함께 읽도록 만든 프로젝트 지시 파일입니다. 앤트로픽은 현지 시간 2026년 9월 18일 내놓은 클로드 코드 v2.1.277부터 이 파일을 직접 읽기 시작했습니다. 한국 시간으로는 9월 19일 새벽에 배포됐습니다.

클로드 코드를 써 본 분이라면 CLAUDE.md는 익숙할 것입니다. 프로젝트 규칙을 적어 두면 세션이 열릴 때마다 클로드가 읽어 가는 파일이고, 준이아빠블로그에서도 [CLAUDE.md 세팅과 공식 문서 대조](/insights/claude-md-setup-official-docs)로 한 번 다뤘습니다. 코덱스나 커서, 깃허브 코파일럿을 같이 쓰는 팀은 같은 내용을 AGENTS.md에도 적어 두 벌로 관리해 왔습니다.

이번 변화로 두 벌을 한 벌로 줄일 수 있게 됐는데, 클로드가 AGENTS.md를 읽어 주는 조건이 생각보다 까다롭습니다. 조건을 모르고 파일부터 정리하면 팀 규칙이 빠진 채로 작업이 진행될 수 있습니다. 공식 문서와 릴리스 노트를 근거로 삼고 직접 돌려 본 결과를 붙여 2026년 9월 19일 기준으로 정리하겠습니다.

![클로드 코드 공식 문서의 AGENTS.md 절. 저장소에 어떤 파일이 있을 때 클로드가 무엇을 읽는지 조합 세 가지로 나눈 표가 있고, 아래에 v2.1.277 이상이 필요하다는 안내 상자가 붙어 있다](/images/insights/claude-code-agents-md-support/01-docs-which-file-loads.png)

## AGENTS.md 공식 지원 발표 내용 한눈에 보기

| 항목 | 내용 |
|---|---|
| 적용 버전 | 클로드 코드 v2.1.277. 현지 시간 2026년 9월 18일, 한국 시간 9월 19일 새벽에 배포됐습니다 |
| 기본 동작 | 작업 폴더와 그 위쪽에 CLAUDE.md가 없을 때만 AGENTS.md를 대신 읽습니다 |
| 바꾸는 방법 | 세션에서 `/config`를 열고 Project instructions 값을 고릅니다 |
| 세션 시작에 읽는 것 | 작업 폴더와 상위 폴더의 `AGENTS.md`, `.claude/AGENTS.md` |
| 하위 폴더 | 그 폴더에 CLAUDE.md가 없고 클로드가 그 폴더의 파일을 열 때 그 폴더의 AGENTS.md를 추가로 읽습니다 |
| 읽지 않는 것 | `AGENTS.local.md`, `AGENTS.override.md`, `.agents/` 아래 전부 |
| 쓸 수 없는 환경 | 아마존 베드록 같은 제3자 제공자, 텔레메트리를 끈 세션, 설치 직후 첫 세션, 훅을 막아 둔 설정 |

표에서 먼저 볼 것은 기본 동작입니다. 두 파일을 합쳐 읽는 것이 아니라 CLAUDE.md가 없을 때만 대신 읽는 방식이라, 이미 CLAUDE.md를 쓰던 프로젝트에서는 아무것도 달라지지 않습니다.

그다음은 하위 폴더입니다. 세션이 열릴 때 한꺼번에 올라오는 것은 작업 폴더와 그 위쪽 파일이고, 하위 폴더의 AGENTS.md는 클로드가 그 폴더의 파일을 실제로 열 때 뒤늦게 올라옵니다. 이때도 그 하위 폴더에 CLAUDE.md가 없어야 합니다. 모노레포에서 패키지마다 규칙을 나눠 둘 수 있다는 뜻입니다.

`.agents/` 폴더를 읽지 않는다는 항목도 함께 봐야 합니다. 다른 도구들이 스킬이나 하위 에이전트를 그 폴더에 모아 두는 경우가 있는데, 클로드 코드는 그 안을 들여다보지 않습니다.

## 클로드 코드가 AGENTS.md를 읽는 조건

현관에 우리 집 전용 안내문이 붙어 있으면 기사가 그 옆의 공용 안내문은 읽지 않듯, 클로드는 CLAUDE.md를 찾으면 AGENTS.md를 열지 않습니다. 공식 문서가 조합 세 가지로 정리한 내용입니다.

| 저장소에 있는 파일 | 클로드가 읽는 것 |
|---|---|
| AGENTS.md만 있고 위쪽에도 CLAUDE.md가 없음 | AGENTS.md |
| AGENTS.md와 CLAUDE.md가 함께 있음 | CLAUDE.md만 |
| CLAUDE.md 안에 `@AGENTS.md`가 적혀 있음 | CLAUDE.md, 불러온 AGENTS.md 포함 |

여기서 CLAUDE.md로 세는 파일은 세 가지입니다. 작업 폴더나 그 위쪽의 `CLAUDE.md`, `.claude/CLAUDE.md`, `CLAUDE.local.md`입니다. 반대로 개인 설정인 `~/.claude/CLAUDE.md`와 회사가 배포한 관리 정책 파일, `.claude/rules/` 파일은 여기서 세지 않으며 AGENTS.md와 함께 올라옵니다.

문서만으로는 상위 폴더 조건이 어디까지 걸리는지 가늠하기 어려워서, v2.1.277을 설치한 맥에서 폴더 네 개를 만들어 직접 확인했습니다. 파일마다 다른 확인 코드를 적어 두고 클로드에게 그 코드를 물어봤습니다. 2026년 9월 19일에 돌린 결과입니다.

| 폴더 구성 | 클로드가 답한 코드 | 실제로 읽은 파일 |
|---|---|---|
| AGENTS.md 하나만 둠 | AAA-111 | AGENTS.md |
| AGENTS.md와 CLAUDE.md를 같이 둠 | CCC-333 | CLAUDE.md |
| 상위 폴더에 CLAUDE.md, 작업 폴더에 AGENTS.md | DDD-444 | 상위 폴더의 CLAUDE.md |
| AGENTS.md와 CLAUDE.local.md를 같이 둠 | GGG-777 | CLAUDE.local.md |

네 줄 모두 문서와 맞아떨어졌습니다. 두 번째 폴더에서 `claude-md-and-agents-md` 설정으로 한 번 더 돌리자, 클로드가 CLAUDE.md의 코드를 먼저 대고 AGENTS.md에 적어 둔 코드를 뒤이어 말했습니다. 폴더마다 CLAUDE.md를 먼저 올리고 AGENTS.md를 나중에 올린다는 문서 설명이 그대로 재현됐습니다.

## 상위 폴더의 CLAUDE.md 하나 때문에 팀의 AGENTS.md가 올라오지 않는 구조

앞 표의 세 번째 줄이 실무에서 자주 걸리는 대목입니다. 건물 공동현관의 안내문을 보고 돌아선 기사가 세대 문 앞까지 오지 않듯, 작업 폴더 위쪽 어느 폴더에 CLAUDE.md가 있어도 바로 앞의 AGENTS.md는 열리지 않습니다. 클로드가 읽는 파일은 거리가 아니라 CLAUDE.md가 있는지 없는지로 정해집니다.

모노레포에서는 이 조건에 걸리기 쉽습니다. 저장소 루트에 예전에 만든 CLAUDE.md가 남아 있고 패키지 폴더마다 AGENTS.md를 새로 만들어 두었다면, 패키지 폴더에서 세션을 열어도 루트의 CLAUDE.md만 올라옵니다. AGENTS.md로 옮기는 작업을 폴더 단위로 나눠서 하기 어렵다는 뜻이기도 합니다.

더 조용히 걸리는 것은 `CLAUDE.local.md`입니다. 공식 문서도 이 파일을 따로 경고하고 있는데, 팀이 AGENTS.md를 쓰기로 한 저장소라도, 한 사람이 개인 메모용으로 만든 파일 하나면 팀 지시문이 통째로 빠집니다. 커밋되지 않는 파일이라 다른 사람 화면에서는 멀쩡하게 동작하고, 그 사람 화면에서만 규칙이 빠진 채로 작업이 진행됩니다.

개인 메모를 유지하면서 AGENTS.md도 읽게 하려면 설정을 바꿔야 합니다. 다음 절의 `claude-md-and-agents-md`가 그 답입니다.

![클로드 코드 공식 문서의 Project instructions 설정값 표. claude-md-or-agents-md, claude-md-and-agents-md, claude-md, managed-only 네 가지가 각각 무엇을 읽는지 설명하고 있다](/images/insights/claude-code-agents-md-support/02-docs-four-setting-values.png)

## Project instructions 설정값 네 가지

세션에서 `/config`를 열면 Project instructions 항목이 있고, 값은 네 가지입니다.

| 값 | 클로드가 읽는 것 |
|---|---|
| `claude-md-or-agents-md` | 기본값입니다. CLAUDE.md가 있으면 그것만, 없으면 AGENTS.md를 읽습니다 |
| `claude-md-and-agents-md` | 둘 다 읽습니다. 폴더마다 CLAUDE.md를 먼저, AGENTS.md를 나중에 올립니다 |
| `claude-md` | CLAUDE.md만 읽습니다 |
| `managed-only` | 세션이 열릴 때는 회사가 배포한 관리 정책 파일과 자동 메모리만 올라옵니다 |

`claude-md-and-agents-md`를 골라도 같은 파일이 두 번 올라오지는 않습니다. CLAUDE.md가 `@AGENTS.md`로 불러오거나 심볼릭 링크로 연결해 둔 경우, 클로드 코드가 이미 읽은 AGENTS.md를 건너뜁니다.

이 값을 설정 파일에 직접 적을 수도 있는데 적는 위치가 특이합니다. AGENTS.md 지원이 내장 플러그인으로 들어가 있어서 `pluginConfigs`의 `agents-md@builtin` 아래에 적습니다.

```json
{
  "pluginConfigs": {
    "agents-md@builtin": {
      "options": { "instructionFiles": "claude-md-and-agents-md" }
    }
  }
}
```

**여기서 놓치기 쉬운 것은 이 값을 프로젝트 폴더의 `.claude/settings.json`에 적으면 무시된다는 점입니다.** 사용자 설정 파일인 `~/.claude/settings.json`이나 `--settings`로 넘기는 파일, 회사 관리 설정에만 적용됩니다. 팀 전체에 같은 값을 적용하고 싶어서 저장소에 커밋하는 방법은 통하지 않습니다.

## AGENTS.md로 읽을 때 CLAUDE.md와 달라지는 곳

설정을 켰어도 CLAUDE.md와 똑같이 동작하지는 않습니다. 공식 문서가 차이 네 가지를 명시하고 있습니다.

- **`/memory`와 `/context`의 Memory files 목록에 뜨지 않습니다.** 기본값을 쓰는 대화형 세션에서는 시작할 때 `no CLAUDE.md found; AGENTS.md loaded: 경로` 줄이 나오므로 그것으로 확인합니다. 설정을 바꿨거나 그 줄이 나오지 않는 세션에서는 클로드에게 프로젝트 지시문에 무엇이 적혀 있는지 물어봅니다.
- **`InstructionsLoaded` 훅이 실행되지 않습니다.** 지시문이 올라올 때 훅으로 검증하거나 기록을 남기던 설정은 아무 말 없이 동작하지 않게 됩니다. CLAUDE.md가 불러온 AGENTS.md에서는 평소대로 실행됩니다.
- **`--add-dir`로 추가한 폴더에서는 AGENTS.md가 빠집니다.** `CLAUDE_CODE_ADDITIONAL_DIRECTORIES_CLAUDE_MD`를 켜 두면 그 폴더의 CLAUDE.md는 올라오지만 AGENTS.md는 올라오지 않습니다.
- **작업 폴더 밖의 파일을 `@경로`로 불러올 때 승인을 묻지 않습니다.** CLAUDE.md를 쓸 때는 외부 파일을 불러오기 전에 승인을 묻는데, AGENTS.md는 그 프로젝트에서 한 번 승인했으면 묻지 않고 불러옵니다.

두 번째와 네 번째는 보안이나 운영 규칙을 훅으로 강제하던 팀에서 확인해 볼 만합니다. 하위 에이전트 쪽은 달라지지 않습니다. 프로젝트 지시문으로 올라온 AGENTS.md는 CLAUDE.md와 마찬가지로 하위 에이전트에게도 전달되고, Explore와 Plan 에이전트는 두 파일을 모두 건너뜁니다.

## 기능이 켜지지 않는 네 가지 경우

Project instructions 항목이 `/config`에 아예 보이지 않는다면 아래 네 가지 가운데 하나에 해당합니다.

- **v2.1.277보다 낮은 버전**입니다. `claude --version`으로 확인합니다.
- **피처 플래그를 받아 오지 않는 세션**입니다. 아마존 베드록이나 마이크로소프트 파운드리 같은 제3자 제공자를 쓰거나 `DISABLE_TELEMETRY`처럼 관련 변수를 켜 두면 여기 해당합니다.
- **설치나 업그레이드 직후 첫 세션**을 쓰고 있습니다. 그 세션에서 플래그를 받아 오므로 다음 세션부터 동작합니다.
- **훅을 막아 둔 설정**입니다. `disableAllHooks`나 `allowManagedHooksOnly`를 켜 두었거나 `/plugin`에서 내장 `agents-md` 플러그인을 껐으면 기능도 함께 꺼집니다.

앞의 세 가지는 버전과 환경만 보면 짐작할 수 있지만 마지막 항목은 그렇지 않습니다. 공식 문서는 훅을 막는 설정 두 가지와 내장 `agents-md` 플러그인 끄기를 함께 적어 두었습니다. 보안 정책으로 훅을 전부 막아 둔 회사라면 버전을 올려도 기능이 열리지 않습니다. 이런 세션에서는 예전처럼 CLAUDE.md에 `@AGENTS.md`를 적어 두는 방법을 씁니다.

![깃허브 anthropics/claude-code 저장소의 6235번 이슈 화면. 제목은 Feature Request: Support AGENTS.md이고 Closed 상태이며, 본문 아래 반응 표시에 엄지 5168개와 하트 440개가 붙어 있다](/images/insights/claude-code-agents-md-support/03-github-issue-6235.png)

## 1년 넘게 쌓인 요청과 공개 직후 반응

이 기능은 깃허브 이슈 하나에 1년 넘게 요청이 쌓인 끝에 나왔습니다. 2025년 8월 21일에 올라온 6235번 이슈는 "코덱스와 앰프, 커서가 AGENTS.md로 표준을 잡아 가는데 CLAUDE.md는 클로드 코드에만 너무 맞춰져 있어서, 클로드 코드를 쓰지 않는 개발자와 협업할 때 잘 맞지 않는다"는 짧은 글로 시작했습니다.

여기에 엄지 반응 5,168개와 댓글 399개가 붙었습니다. 지원을 미루는 이유는 기술이 아니라 브랜드 노출이라고 보는 댓글이 여러 개 달렸고, `echo "See ./AGENTS.md" > CLAUDE.md`로 우회한 뒤 CLAUDE.md를 `.gitignore`에 넣는 방법이 공유되기도 했습니다. 공개 당일에는 앤트로픽 쪽 공지 게시글을 그대로 옮겨 붙이고 "Finally!!"를 덧붙인 댓글이 올라왔습니다.

![AGENTS.md 표준 공식 사이트 첫 화면. 코딩 에이전트를 위한 단순하고 개방된 형식이라는 설명과 6만 개가 넘는 오픈소스 프로젝트가 쓰고 있다는 문장이 있고, 오른쪽에 예시 파일 내용이 보인다](/images/insights/claude-code-agents-md-support/04-agents-md-standard-site.png)

그사이 AGENTS.md를 쓰는 곳도 크게 늘었습니다. 공식 사이트는 6만 개가 넘는 오픈소스 프로젝트가 쓰고 있다고 적고 있고, 지금은 리눅스 재단 산하 Agentic AI Foundation이 관리합니다. 사이트에 지원 도구로 이름이 올라 있는 곳만 23곳이고, 클로드 코드는 아직 그 목록에 없습니다.

## 쓰던 우회법을 정리하는 방법

공식 지원 전에 직접 만들어 둔 설정이 있다면 지금 정리해야 할 것과 그대로 둬도 되는 것을 먼저 구분해야 합니다.

| 쓰던 방법 | 지금 할 일 |
|---|---|
| CLAUDE.md에 `@AGENTS.md`를 적어 둠 | 그대로 둬도 됩니다. 어느 설정값에서도 두 번 읽지 않습니다 |
| CLAUDE.md에 "AGENTS.md를 읽어라"라고 문장으로 적어 둠 | CLAUDE.md를 지우거나 그 문장을 `@AGENTS.md`로 바꿉니다 |
| CLAUDE.md를 AGENTS.md로 심볼릭 링크 | 그대로 둬도 되고 지워도 됩니다 |
| SessionStart 훅으로 AGENTS.md를 출력 | 지웁니다. 그대로 두면 같은 내용이 두 번 올라옵니다 |

가장 급한 것은 마지막 줄입니다. 훅이 그대로 남아 있으면 클로드가 직접 읽은 AGENTS.md 위에 훅이 출력한 사본이 한 벌 더 올라옵니다. 컨텍스트를 두 배로 쓰면서 클로드가 같은 규칙을 두 번 읽습니다.

심볼릭 링크를 쓰던 팀은 두 가지를 같이 확인하는 편이 좋습니다. 클로드는 링크를 따라 읽지만 Edit와 Write 도구는 링크로 연결된 파일에 쓰지 못하고, 윈도우에서는 관리자 권한이나 개발자 모드 없이 링크를 만들지 못합니다. 링크가 평범한 텍스트 파일로 체크아웃되면 그 컴퓨터에서는 한 줄짜리 CLAUDE.md가 지시문을 대신하게 됩니다.

## 실제로 옮길 때 따르는 순서

두 벌로 관리하던 저장소를 한 벌로 줄인다면 이 순서가 안전합니다.

1. `claude --version`으로 v2.1.277 이상인지 확인합니다.
2. 작업 폴더에서 위쪽으로 올라가며 `CLAUDE.md`, `.claude/CLAUDE.md`, `CLAUDE.local.md`가 있는지 찾습니다.
3. 내용을 AGENTS.md로 합치고, 클로드에게만 줄 규칙이 남으면 CLAUDE.md에 `@AGENTS.md`와 그 규칙만 남깁니다.
4. 새 세션을 열어 `no CLAUDE.md found; AGENTS.md loaded:` 줄이 나오는지 봅니다. 이 줄은 기본값을 쓰는 대화형 세션에만 나오므로, 보이지 않으면 클로드에게 프로젝트 지시문에 무엇이 적혀 있는지 물어봅니다.
5. 개인 메모용 `CLAUDE.local.md`를 유지해야 하면 `/config`에서 `claude-md-and-agents-md`로 바꿉니다.

옮기다 막히는 경우는 대부분 2번을 건너뛴 탓입니다. 저장소 루트만 보고 "CLAUDE.md가 없으니 되겠지"라고 판단했다가 그 위 폴더에서 걸리는 일이 실제로 나옵니다.

## 자주 묻는 질문

### CLAUDE.md를 지우면 AGENTS.md를 바로 읽나요?

작업 폴더와 그 위쪽에 남은 CLAUDE.md가 없다면 다음 세션부터 읽습니다. `.claude/CLAUDE.md`와 `CLAUDE.local.md`도 함께 확인해야 하고, 설치나 업그레이드 직후 첫 세션에서는 아직 동작하지 않을 수 있습니다.

### 두 파일을 함께 쓰면 규칙이 충돌하지 않나요?

올라오는 순서는 정해져 있습니다. 폴더마다 CLAUDE.md가 먼저 올라오고 그 뒤에 AGENTS.md가 올라옵니다. 충돌 자체를 막아 주는 장치는 없으므로, 공통 규칙은 AGENTS.md에 두고 클로드에만 해당하는 내용만 CLAUDE.md에 남기는 방법이 무난하다고 봅니다.

### 아마존 베드록에서도 쓸 수 있나요?

지금은 쓸 수 없습니다. 베드록이나 마이크로소프트 파운드리처럼 제3자 제공자를 거치는 세션은 앤트로픽에서 피처 플래그를 받아 오지 않아 CLAUDE.md만 읽습니다. 클로드 코드를 품고 있는 호스트가 `CLAUDE_CODE_PROVIDER_MANAGED_BY_HOST`를 따로 설정한 경우는 예외입니다. 우회법은 앞에서 적은 `@AGENTS.md` 방식이 그대로 통합니다.

## 3줄 요약

1. **클로드 코드는 2026년 9월 18일 공개한 v2.1.277부터 AGENTS.md를 프로젝트 지시 파일로 직접 읽습니다.**
2. **두 파일을 합쳐 읽는 것이 아니라 CLAUDE.md도 CLAUDE.local.md도 작업 폴더와 그 위쪽에 없을 때만 AGENTS.md를 읽는 방식입니다.**
3. **두 파일을 함께 읽게 하려면 `/config`의 Project instructions를 claude-md-and-agents-md로 바꿔야 하고, 이 값은 프로젝트 settings.json에 적으면 무시됩니다.**

## Sources

- [How Claude remembers your project (클로드 코드 문서)](https://code.claude.com/docs/en/memory)
- [Claude Code CHANGELOG v2.1.277](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md)
- [Settings reference: pluginConfigs (클로드 코드 문서)](https://code.claude.com/docs/en/settings-reference)
- [Environment variables: Features that need feature-flag fetching (클로드 코드 문서)](https://code.claude.com/docs/en/env-vars)
- [Hooks reference: InstructionsLoaded (클로드 코드 문서)](https://code.claude.com/docs/en/hooks)
- [Subagents: What loads at startup (클로드 코드 문서)](https://code.claude.com/docs/en/sub-agents)
- [Feature Request: Support AGENTS.md (깃허브 이슈 6235)](https://github.com/anthropics/claude-code/issues/6235)
- [AGENTS.md 공식 사이트](https://agents.md/)
