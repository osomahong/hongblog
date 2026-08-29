---
slug: what-are-hooks
term: 훅 (Hooks) 알아보기
definition: >-
  Claude Code가 특정 행동을 하기 전, 후에 자동으로 실행되는 명령입니다. 파일 수정 직후 자동 포맷, 커밋 직전 lint 실행 같은
  자동 검사, 자동 작업을 만들 때 씁니다.
category: CLAUDE_EDUCATION
tags:
  - AI
  - 바이브코딩
publishedAt: '2026-04-27T09:35:00.000Z'
updatedAt: '2026-07-23T00:00:00.000Z'
courseSlug: claude-code-for-everyone
orderInCourse: 6
aliases:
  - Hooks
  - 훅
  - 자동 실행 규칙
relatedTerms:
  - what-are-subagents
  - claude-code-memory
  - slash-commands-explained
difficulty: BEGINNER
quiz:
  - question: Claude Code의 Hooks가 가장 적절히 쓰이는 자리는 어디일까요?
    options:
      - '파일 수정 직후 자동 포맷 적용, 커밋 직전 lint 실행 같은 매번 빠뜨리고 싶지 않은 검사, 작업'
      - 사용자가 가끔만 하는 특수 작업
      - 사용자에게 보이지 않게 데이터를 빼돌리는 작업
      - 단순 한국어 답변
    correctIndex: 0
    explanation: >-
      Hooks는 Claude Code가 특정 행동(파일 수정, 커밋, 도구 호출 등) 전, 후에 자동으로 실행되는 명령입니다. 매번
      빠뜨리고 싶지 않은 검사, 자동 작업을 흐름에 못 박아 두는 데 적합합니다. 가끔 쓰는 작업은 슬래시 명령이 더 어울리고, 보안을
      우회하거나 사용자에게 숨기는 용도로는 절대 쓰지 않습니다.
metaTitle: '클로드 코드 훅(Hooks) 사용법: 자동 실행 명령 설정'
metaDescription: '훅(Hooks)은 Claude Code가 특정 행동을 하기 전후에 자동으로 실행되는 명령입니다. 파일 수정 직후 포맷팅 같은 자동화 설정 방법과 활용 예시를 정리했습니다.'
ogImage: /og/what-are-hooks.png
summary3:
  - '훅은 Claude Code가 파일 수정이나 명령 실행, 세션 시작과 종료 같은 시점에 자동으로 실행되는 명령입니다.'
  - 'settings.json 파일에 등록하며 자동 포맷과 lint, 테스트, 보안 검사가 대표적인 쓰임입니다.'
  - '슬래시 명령은 사용자가 부르고 서브에이전트는 주력 에이전트가 나누지만 훅은 이벤트가 생기면 사람이 의식하지 않아도 돌아갑니다.'
---

이 글은 앤트로픽이 운영하는 code.claude.com/docs의 Hooks 자료를 한국 비개발자 입문자가 보기 편하게 정리한 글입니다.

## 🤔 매번 빠뜨리는 검사 단계가 있다면

코드를 수정한 뒤에 항상 포맷을 맞추기로 정했는데, 사람이 직접 하다 보면 가끔 빠뜨립니다. 커밋 직전에 lint를 돌리기로 했는데 깜빡합니다. "알아서 매번 자동으로 해 주면 좋겠다"는 생각이 자연스럽게 듭니다.

훅(Hooks)이 이 빈틈을 채웁니다. Claude Code가 특정 행동을 할 때마다 자동으로 따라 실행되는 명령을 미리 등록해두는 기능입니다.

## 🔑 훅, 무엇일까요?

**훅(Hooks)**은 Claude Code가 특정 행동을 하기 전 또는 후에 **자동으로 실행되는 명령**입니다. 앤트로픽 공식 안내는 다음과 같이 설명합니다.

> "Hooks let you run shell commands before or after Claude Code actions, like auto-formatting after every file edit or running lint before a commit."

핵심은 **"매번 자동"**이라는 단어입니다. 사용자가 매번 기억해서 명령을 실행할 필요가 없도록, 흐름에 못 박아 두는 자동 실행 규칙입니다.

## 🛠️ 훅이 발동하는 시점

훅은 Claude Code가 다음과 같은 이벤트를 만났을 때 발동합니다.

- **파일 수정 후 (PostToolUse)**: 파일 하나를 고친 직후
- **명령 실행 전 (PreToolUse)**: 셸 명령을 실행하기 직전
- **세션 시작 시 (SessionStart)**: 새 작업 세션을 시작할 때
- **세션 종료 시 (Stop)**: 작업이 끝날 때

각 이벤트마다 다른 훅을 등록할 수 있고, 같은 이벤트에 여러 훅을 연결할 수도 있습니다.

## 💡 어떤 자리에 훅을 쓰나요?

**1. 자동 포맷**
- 파일을 수정할 때마다 prettier, eslint를 자동 실행해 코드 스타일을 통일.

**2. 자동 lint**
- 커밋 직전에 lint를 돌려 표준에 맞지 않는 코드를 차단.

**3. 자동 테스트**
- 특정 파일을 수정하면 그 파일의 테스트를 자동 실행.

**4. 보안 검사**
- 셸 명령 실행 전에 위험한 명령(rm -rf, sudo)을 차단.

**5. 자동 알림**
- 작업이 끝나면 슬랙으로 결과 자동 발송.

이런 검사, 작업은 매번 사람이 하기 부담스럽기 때문에 훅으로 자동화하는 게 표준입니다.

## 📂 훅은 어디 정의되어 있나요?

훅은 두 곳에 등록할 수 있습니다.

**1. 사용자 단위 (Global)**
- `~/.claude/settings.json`
- 모든 프로젝트에서 공통으로 동작

**2. 프로젝트 단위 (Project)**
- 프로젝트 루트의 `.claude/settings.json`
- 그 프로젝트에서만 동작

settings.json 안에 어떤 이벤트에 어떤 명령을 실행할지를 JSON 형식으로 적어둡니다.

## 🔁 훅 동작 흐름 시나리오

**시나리오: 자동 포맷 + 자동 lint**

회사에서 모든 코드는 prettier로 포맷, ESLint를 통과해야 한다고 가정합니다.

**훅 1 (PostToolUse, 파일 수정 직후)**
- prettier --write {수정된 파일}

**훅 2 (PreToolUse, 셸 명령 실행 직전)**
- 명령이 git commit이면 lint를 먼저 실행하고, 실패 시 커밋 차단

이렇게 등록해두면 사용자는 코드만 작성하고, 포맷, lint는 자동으로 따라옵니다. 깜빡할 일이 없습니다.

## 🔗 [Subagents](/class/claude-code-for-everyone/what-are-subagents), [슬래시 명령](/class/claude-code-for-everyone/slash-commands-explained)과의 차이

세 도구는 닮은 듯 다릅니다.

| 도구 | 호출 방식 | 사용 시점 |
|---|---|---|
| **슬래시 명령** | 사용자가 `/명령` 직접 입력 | 자주 쓰지만 매번 의식적으로 호출 |
| **서브에이전트** | 주력 에이전트가 작업 분배 | 큰 작업의 부분을 동시에 처리 |
| **훅** | 이벤트 발생 시 자동 실행 | 매번 빠뜨리고 싶지 않은 검사, 작업 |

세 도구를 묶어 쓰면 작업 흐름의 자동화 깊이가 매우 커집니다.

## 💼 직무, 역할별 활용 시나리오

**개발자**
- 자동 포맷, lint, 테스트
- 위험 명령 차단 (rm -rf 같은 명령)
- 커밋 직전 보안 점검

**마케터, 기획자**
- 회사 가이드라인 위반 자동 알림
- 매주 작업 결과를 슬랙에 자동 발송

**교육자**
- 학생 자료 자동 포맷 점검
- 자료 변경 시 학생용 PDF 자동 변환

훅은 비개발자에게도 "매번 빠뜨리는 작업"을 자동화하는 데 유용합니다.

## ⚠️ 훅 사용 시 주의할 점

**1. 너무 많이 만들지 말기**
- 매번 발동하는 훅이 많으면 작업이 느려집니다. 정말 매번 필요한 것만 등록하세요.

**2. 보안 우회 용도로 쓰지 않기**
- 사용자 모르게 데이터를 외부로 보내거나 보안 검사를 해제하는 훅은 절대 만들지 마세요.

**3. 실패 시 동작 정의**
- 훅이 실패했을 때 작업을 중단할지, 무시하고 진행할지 명확히 정해야 합니다. 보안 검사 훅은 실패 시 차단이 표준입니다.

**4. 환경 변수로 비밀 분리**
- 훅 안에 API 키, 비밀번호를 직접 넣지 마세요. 환경 변수로 분리합니다.

## 📋 3줄 요약

1. 훅은 Claude Code가 파일 수정이나 명령 실행, 세션 시작과 종료 같은 시점에 자동으로 실행되는 명령입니다.

2. settings.json 파일에 등록하며 자동 포맷과 lint, 테스트, 보안 검사가 대표적인 쓰임입니다.

3. 슬래시 명령은 사용자가 부르고 서브에이전트는 주력 에이전트가 나누지만 훅은 이벤트가 생기면 사람이 의식하지 않아도 돌아갑니다.

## 📚 참고 자료

- Hooks 안내: [https://code.claude.com/docs/en/hooks](https://code.claude.com/docs/en/hooks)
- Settings: [https://code.claude.com/docs/en/settings](https://code.claude.com/docs/en/settings)
- Best practices: [https://code.claude.com/docs/en/best-practices](https://code.claude.com/docs/en/best-practices)
