---
slug: slash-commands-explained
term: 슬래시 명령 (Slash Commands) 알아보기
definition: >-
  Claude Code에서 / 로 시작하는 명령으로 자주 쓰는 작업을 한 번에 부르는 기능입니다. 기본 제공 명령(/help, /clear
  등) 외에도 사용자가 직접 자기만의 슬래시 명령을 만들어 팀과 공유할 수 있습니다.
category: CLAUDE_EDUCATION
tags:
  - AI
  - 바이브코딩
publishedAt: '2026-04-27T09:32:00.000Z'
courseSlug: claude-code-for-everyone
orderInCourse: 3
aliases:
  - Slash Commands
  - 슬래시 커맨드
  - 커스텀 명령
relatedTerms:
  - what-is-claude-code
  - claude-code-plan-mode
  - what-are-subagents
  - what-are-claude-skills
difficulty: BEGINNER
quiz:
  - question: 회사에서 매주 PR을 같은 형식으로 리뷰하고 싶을 때 슬래시 명령을 어떻게 활용하면 좋을까요?
    options:
      - 회사 리뷰 체크리스트를 담은 /review-pr 같은 커스텀 슬래시 명령을 만들어 팀에 공유
      - 매번 새로운 프롬프트를 다시 작성
      - 슬랙으로 매번 같은 안내 메시지 보내기
      - 사용 안 함
    correctIndex: 0
    explanation: >-
      슬래시 명령의 핵심 가치는 자주 쓰는 작업을 한 번 정의해두고 / 한 글자로 호출하는 것입니다. 회사 PR 리뷰 체크리스트를 담은
      /review-pr 슬래시 명령을 만들어 팀과 공유하면 매주 같은 형식의 리뷰가 자동으로 적용됩니다. 매번 다시 작성하거나 슬랙
      안내로는 일관성을 유지하기 어렵습니다.
metaTitle: '클로드 코드 슬래시 명령어 정리: 기본 명령과 커스텀 명령'
metaDescription: '슬래시 명령은 Claude Code에서 /로 시작해 자주 쓰는 작업을 한 번에 부르는 기능입니다. 기본 제공 명령과 직접 만드는 커스텀 명령을 정리했습니다.'
ogImage: /og/slash-commands-explained.png
summary3:
  - '슬래시 명령은 Claude Code에서 슬래시로 시작해 자주 쓰는 작업을 한 번에 부르는 기능이고 기본 제공 명령과 직접 만든 커스텀 명령으로 나뉩니다.'
  - '입문자가 자주 쓰는 명령은 목록을 보는 /help와 대화를 비우는 /clear, 프로젝트에 CLAUDE.md를 만드는 /init입니다.'
  - '커스텀 명령은 .claude/commands 폴더에 마크다운으로 만들어 프로젝트 단위로 공유하고 Claude가 맥락을 보고 알아서 부르게 하려면 Skills로 만듭니다.'
---

이 글은 앤트로픽이 운영하는 code.claude.com/docs의 슬래시 명령(Slash Commands), Skills 자료를 한국 비개발자 입문자가 보기 편하게 정리한 글입니다.

## 🤔 매번 같은 작업을 입력하고 있나요?

Claude Code를 쓰다 보면 매번 같은 패턴의 작업을 시키게 됩니다. "지금까지 변경된 코드를 검수해 줘", "오늘 한 작업 요약해 줘", "이 PR 잘 작성됐는지 봐 줘". 매번 처음부터 입력하기는 부담스럽습니다.

슬래시 명령은 이 반복을 한 줄로 줄인 기능입니다. `/review-pr`처럼 짧게 한 번 입력하면 그 안에 정의해둔 작업이 통째로 실행됩니다.

## 🔑 슬래시 명령, 무엇일까요?

**슬래시 명령(Slash Commands)**은 Claude Code에서 `/` 로 시작하는 명령으로 자주 쓰는 작업을 한 번에 부르는 기능입니다.

크게 두 종류가 있습니다.

- **기본 제공 명령**: Claude Code가 처음부터 가진 명령들(`/help`, `/clear`, `/login` 등)
- **커스텀 명령**: 사용자가 직접 만들어 등록하는 명령(`/review-pr`, `/deploy-staging` 같은 회사 표준)

기본 명령은 즉시 쓸 수 있고, 커스텀 명령은 한 번 만들어두면 팀 전체가 같은 흐름을 공유할 수 있습니다.

## 🧰 자주 쓰는 기본 슬래시 명령

Claude Code 화면에서 `/`만 누르면 사용 가능한 명령 목록이 나옵니다. 입문자가 자주 쓰는 명령은 다음과 같습니다.

| 명령 | 역할 |
|---|---|
| `/help` | 사용 가능한 명령 목록 보기 |
| `/clear` | 현재 대화 컨텍스트 초기화 |
| `/login` | 로그인, 계정 전환 |
| `/init` | 새 프로젝트에서 CLAUDE.md 초기화 |
| `/schedule` | 정기 작업(Routines) 만들기 |
| `/loop` | 같은 작업을 일정 간격으로 반복 |
| `/desktop` | 터미널 세션을 데스크톱 앱으로 넘김 |

이 명령들을 익혀두면 작업 흐름이 빠르게 매끄러워집니다.

## ✨ 커스텀 슬래시 명령 만들기

회사 표준 작업을 한 번 만들어두면 팀 전체가 같은 흐름을 공유할 수 있습니다.

**1. 명령 파일 위치**
- 프로젝트 루트의 `.claude/commands/` 폴더 안에 마크다운 파일로 작성합니다.
- 예: `.claude/commands/review-pr.md` → `/review-pr` 명령이 됩니다.

**2. 파일 안 내용**
- 평범한 마크다운 파일에 작업 지시를 적습니다.
- "지금까지 변경된 코드를 회사 표준에 맞게 검수해 달라" 같은 지시.

**3. 변수 사용**
- `$ARGUMENTS` 같은 변수를 사용해 사용자가 명령에 인자를 넘길 수 있습니다.
- 예: `/review-pr 1234` → PR 1234번을 검수.

**4. 팀 공유**
- 명령 파일을 git에 커밋해 팀이 같은 명령을 쓰도록 합니다.

## 💼 직무, 역할별 활용 시나리오

**개발자**
- `/review-pr`: 회사 PR 리뷰 체크리스트 적용
- `/deploy-staging`: 스테이징 배포 절차 자동화
- `/write-tests`: 새 기능에 대한 테스트 작성

**기획자, PM**
- `/prd-draft`: 회사 PRD 템플릿으로 초안 생성
- `/release-notes`: 변경 사항을 사용자 친화 안내문으로 변환

**운영, QA**
- `/triage`: 새 이슈를 우선순위별로 분류
- `/log-summary`: 야간 로그를 핵심 5개로 요약

이 명령들은 한 번 만들어두면 팀 전체의 작업 표준이 됩니다.

## 🔗 [Skills](/class/claude-in-practice/what-are-claude-skills)와 어떻게 다를까요?

슬래시 명령과 [Claude Skills](/class/claude-in-practice/what-are-claude-skills)는 닮은 듯 다른 도구입니다.

| 항목 | 슬래시 명령 | Claude Skills |
|---|---|---|
| **호출 방식** | `/명령` 직접 입력 | Claude가 작업 맥락에 맞을 때 자동 호출 |
| **위치** | `.claude/commands/` | 별도 SKILL.md 폴더 구조 |
| **보조 자료** | 마크다운 본문만 | 마크다운 + 보조 스크립트 + 자료 |
| **공유 단위** | 프로젝트 단위 | 작업 환경 전반(claude.ai, Code 양쪽) |

작업이 단순한 명령이라면 슬래시 명령이, 복잡한 작업 단위라면 Skills가 적합합니다. 둘을 함께 쓰면 작업 자동화의 깊이가 더해집니다.

## 🔗 다른 클래스와의 묶음

- **[Plan Mode](/class/claude-code-for-everyone/claude-code-plan-mode)**: `/plan` 같은 명령으로 실행 전 검토 단계 진입
- **[Subagents](/class/claude-code-for-everyone/what-are-subagents)**: 슬래시 명령 안에서 특정 서브에이전트 호출 가능
- **[CLAUDE.md Memory](/class/claude-code-for-everyone/claude-code-memory)**: 프로젝트 표준을 슬래시 명령에 자연스럽게 끌어옴

## ⚠️ 자주 하는 실수 3가지

**1. 너무 많은 명령 만들기**
- 자주 쓰지 않는 명령까지 만들면 자동완성 목록이 지저분해집니다. 한 달에 5번 이상 쓰는 작업만 명령으로 만드세요.

**2. 명령 안 지시가 모호함**
- 명령 본문이 모호하면 결과 품질이 매번 다릅니다. [프롬프트 엔지니어링 5요소](/class/claude-fundamentals/prompt-engineering-basics)를 명령 안에 적용하세요.

**3. 보안 정보 포함**
- API 키, 비밀번호를 명령 본문에 넣지 마세요. 환경 변수로 분리합니다.

## 📋 30초 요약

1. **슬래시 명령은 `/`로 시작하는 명령으로 자주 쓰는 작업을 한 번에 부르는 Claude Code 기능**입니다. 기본 명령(`/help`, `/clear`)과 커스텀 명령(`/review-pr` 같은 회사 표준)으로 나뉩니다.

2. **`.claude/commands/` 폴더 안에 마크다운 파일로 만들고 git으로 팀과 공유**하면 작업 흐름이 표준화됩니다.

3. **단순 명령은 슬래시 명령, 복잡한 작업 단위는 [Skills](/class/claude-in-practice/what-are-claude-skills)** 로 분리하세요. 한 달에 5번 이상 쓰는 작업만 명령으로 만들고, 명령 본문은 [프롬프트 엔지니어링 5요소](/class/claude-fundamentals/prompt-engineering-basics)로 작성합니다.

## 📚 참고 자료

- Claude Code overview: [https://code.claude.com/docs/en/overview](https://code.claude.com/docs/en/overview)
- Skills 안내: [https://code.claude.com/docs/en/skills](https://code.claude.com/docs/en/skills)
- CLI reference: [https://code.claude.com/docs/en/cli-reference](https://code.claude.com/docs/en/cli-reference)
