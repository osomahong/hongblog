---
slug: claude-code-memory
term: Memory와 CLAUDE.md (영속 컨텍스트) 이해하기
definition: >-
  Claude Code가 세션을 넘어 기억할 수 있도록 만든 영속 컨텍스트 시스템입니다. 사용자가 직접 적은 CLAUDE.md 파일과
  Claude가 작업 중 자동으로 쌓는 auto memory 두 갈래로 구성됩니다.
category: CLAUDE_EDUCATION
tags:
  - AI
  - 바이브코딩
publishedAt: '2026-04-27T09:37:00.000Z'
updatedAt: '2026-07-23T00:00:00.000Z'
courseSlug: claude-code-for-everyone
orderInCourse: 8
aliases:
  - CLAUDE.md
  - auto memory
  - Claude Code 메모리
relatedTerms:
  - what-is-claude-code
  - what-are-hooks
  - what-are-subagents
difficulty: BEGINNER
quiz:
  - question: CLAUDE.md 파일은 어떤 역할을 할까요?
    options:
      - 프로젝트 루트에 두고 Claude Code가 모든 세션 시작 시 읽어 들이는 영속 지시, 표준 문서
      - Claude Code의 설치 로그
      - 자동으로 백업되는 파일
      - 한국어 번역 사전
    correctIndex: 0
    explanation: >-
      CLAUDE.md는 프로젝트 루트에 두는 마크다운 파일로, Claude Code가 매 세션 시작 시 자동으로 읽어 들입니다. 회사
      코딩 표준, 아키텍처 결정, 선호 라이브러리, 검토 체크리스트 같은 영속 지시를 적어두면 매번 다시 설명할 필요가 없습니다. 설치
      로그, 백업, 번역 사전과는 관련이 없습니다.
metaTitle: '클로드 코드 메모리 사용법: CLAUDE.md와 자동 메모리 정리'
metaDescription: '클로드 코드 메모리는 Claude Code가 세션을 넘어 기억하도록 만든 영속 컨텍스트 시스템입니다. CLAUDE.md와 자동 메모리의 차이, 관리 방법을 정리했습니다.'
ogImage: /og/claude-code-memory.png
summary3:
  - 'Memory는 Claude Code가 세션을 넘어 기억하게 만드는 구조이고 사용자가 적는 CLAUDE.md와 자동으로 쌓이는 auto memory 두 가지로 이뤄집니다.'
  - 'CLAUDE.md는 프로젝트 폴더에 두면 매 세션이 시작할 때 자동으로 읽히므로 코딩 표준이나 글쓰기 규칙을 다시 설명하지 않아도 됩니다.'
  - 'CLAUDE.md는 프로젝트 단위와 사용자 단위 두 곳에 둘 수 있고 길게 쓸수록 지켜지지 않으므로 비밀번호와 키는 빼고 짧게 유지합니다.'
---

이 글은 앤트로픽이 운영하는 code.claude.com/docs의 Memory와 CLAUDE.md 자료를 한국 비개발자 입문자가 보기 편하게 정리한 글입니다.

## 🤔 매번 같은 설명을 다시 해야 하나요?

Claude Code를 한 번 닫고 다시 열면 이전 대화를 기억하지 못합니다. 회사 코딩 표준, 사용 중인 라이브러리, "이 프로젝트에서는 이렇게 해 달라" 같은 지시를 매 세션마다 다시 적어야 합니다.

같은 지시를 매번 반복하기는 부담스럽고, 빠뜨리면 결과가 흔들립니다. 이 빈틈을 채우는 것이 영속 컨텍스트(Memory) 시스템입니다.

## 🔑 Memory, 무엇일까요?

**Memory**는 Claude Code가 세션을 넘어 **기억할 수 있도록 만든 영속 컨텍스트 시스템**입니다. 두 가지로 나뉩니다.

- **CLAUDE.md**: 사용자가 직접 적는 영속 지시 파일
- **auto memory**: Claude가 작업하면서 자동으로 쌓는 학습 기록

두 가지 모두 매 세션 시작 시 자동으로 컨텍스트에 깔립니다.

## 📄 CLAUDE.md가 무엇일까요?

**CLAUDE.md**는 프로젝트 루트에 두는 마크다운 파일입니다. Claude Code가 매 세션 시작 시 이 파일을 자동으로 읽어 들입니다. 공식 안내는 다음과 같이 설명합니다.

> "CLAUDE.md is a markdown file you add to your project root that Claude Code reads at the start of every session. Use it to set coding standards, architecture decisions, preferred libraries, and review checklists."

비유하자면 새로 합류한 동료에게 건네는 **온보딩 문서**입니다. 회사, 프로젝트의 표준을 한 번 적어두면, Claude가 매번 그 위에서 작업합니다.

## ✏️ CLAUDE.md에 무엇을 적을까요?

자주 적는 항목은 다음과 같습니다.

**1. 코딩 표준**
- "들여쓰기 2칸, 세미콜론 사용, 변수명은 camelCase"

**2. 아키텍처 결정**
- "데이터베이스는 PostgreSQL, ORM은 Prisma"

**3. 선호 라이브러리**
- "날짜는 date-fns, 검증은 Zod"

**4. 검토 체크리스트**
- "PR 전에 lint, 테스트, 타입체크가 모두 통과해야 함"

**5. 회사, 팀 컨벤션**
- "커밋 메시지는 영어, 변수명은 영어, 주석은 한국어"

**6. 자주 쓰는 명령**
- "개발 서버: npm run dev, 빌드: npm run build"

**7. 보안 정책**
- "API 키는 환경 변수로만, 절대 코드에 하드코딩 금지"

이런 정보를 한 번 적어두면 매번 다시 설명할 필요가 없습니다.

## 🤖 auto memory란

**auto memory**는 Claude가 작업 중 자동으로 쌓는 학습 기록입니다. 공식 안내에 따르면 "build commands and debugging insights" 같은 정보를 사용자가 따로 적지 않아도 자동으로 저장합니다.

예를 들면 다음과 같은 정보가 auto memory에 들어갑니다.

- "이 프로젝트의 빌드 명령은 npm run build:prod"
- "이 디버깅 패턴이 자주 반복됨"
- "이 폴더 구조는 이런 의미"

사용자가 의식하지 않아도 Claude가 작업 중에 알게 된 정보를 다음 세션에 끌어옵니다.

## 🌐 사용자 단위 vs 프로젝트 단위

CLAUDE.md는 두 위치에 둘 수 있습니다.

**1. 프로젝트 단위**
- `<프로젝트 루트>/CLAUDE.md`
- 그 프로젝트에서만 적용.

**2. 사용자 단위 (Global)**
- `~/.claude/CLAUDE.md`
- 모든 프로젝트에 공통 적용.

회사 표준은 프로젝트 CLAUDE.md, 개인 선호는 사용자 CLAUDE.md에 분리해두면 깔끔합니다.

## 🔁 Memory가 동작하는 흐름

**시나리오: 새 세션 시작**

**1. Claude Code 실행 (`claude` 명령)**

**2. 자동 로드**
- 사용자 CLAUDE.md 읽기
- 프로젝트 CLAUDE.md 읽기
- auto memory 불러오기

**3. 컨텍스트 깔린 상태로 작업 시작**
- "이 프로젝트는 PostgreSQL을 쓰고, 들여쓰기는 2칸, 빌드 명령은 npm run build:prod"인 점이 이미 깔려 있음.

**4. 작업 진행**
- 사용자가 매번 표준을 다시 알려주지 않아도 일관된 결과 생성.

## 🔗 Hooks, Subagents, Skills와의 묶음

Memory는 다른 도구들의 **공통 토대**가 됩니다.

- **[Hooks](/class/claude-code-for-everyone/what-are-hooks)**: CLAUDE.md에 적힌 표준을 자동 검사하는 훅 등록
- **[Subagents](/class/claude-code-for-everyone/what-are-subagents)**: 코드 검토 서브에이전트가 CLAUDE.md 표준을 참조해 검토
- **[Skills](/class/claude-in-practice/what-are-claude-skills)**: 스킬 본문에서 "CLAUDE.md의 표준을 따른다"고만 적으면 됨

Memory가 잘 정리된 프로젝트는 다른 자동화 도구들의 효과가 함께 커집니다.

## 💼 비개발자도 쓸 수 있는 CLAUDE.md 활용 시나리오

비개발자도 자기 작업에 CLAUDE.md를 쓸 수 있습니다.

**1. 블로그 글 작성 프로젝트**
- "블로그 글은 한국어 존댓말, 분량 1500자 이내, 이모지 H2 사용, 30초 요약 필수"

**2. 회사 보고서 작성**
- "회사 톤: 차분한 존댓말, 추상 비유 금지, 결과 우선"

**3. 학생 자료 만들기**
- "학생 수준: 고등학생, 영어 용어는 한국어 풀이 함께, 분량 2쪽 이내"

작업 표준을 한 번 적어두면 매번 같은 결의 결과가 나옵니다. [프롬프트 엔지니어링 5요소](/class/claude-fundamentals/prompt-engineering-basics)를 CLAUDE.md에 정리해두면 강력한 효과가 납니다.

## ⚠️ CLAUDE.md 작성 시 주의할 점

**1. 너무 길지 않게**
- CLAUDE.md는 매 세션 [컨텍스트 윈도우](/class/claude-fundamentals/context-window-explained)에 들어가므로 길어질수록 비용, 속도에 영향이 있습니다. 핵심만 압축해서 적습니다.

**2. 자주 갱신**
- 프로젝트가 진행되면서 표준이 바뀌면 CLAUDE.md도 함께 갱신합니다. 한 번 쓰고 잊지 마세요.

**3. 보안 정보 포함 금지**
- API 키, 비밀번호, 고객 정보를 CLAUDE.md에 넣지 마세요. 환경 변수로 분리합니다.

**4. git 커밋 여부 결정**
- 프로젝트 CLAUDE.md를 git에 커밋해 팀과 공유할지, gitignore에 두고 개인 설정으로 둘지 미리 정합니다.

## 📋 3줄 요약

1. Memory는 Claude Code가 세션을 넘어 기억하게 만드는 구조이고 사용자가 적는 CLAUDE.md와 자동으로 쌓이는 auto memory 두 가지로 이뤄집니다.

2. CLAUDE.md는 프로젝트 폴더에 두면 매 세션이 시작할 때 자동으로 읽히므로 코딩 표준이나 글쓰기 규칙을 다시 설명하지 않아도 됩니다.

3. CLAUDE.md는 프로젝트 단위와 사용자 단위 두 곳에 둘 수 있고 길게 쓸수록 지켜지지 않으므로 비밀번호와 키는 빼고 짧게 유지합니다.

## 📚 참고 자료

- Memory와 CLAUDE.md 안내: [https://code.claude.com/docs/en/memory](https://code.claude.com/docs/en/memory)
- Claude Code overview: [https://code.claude.com/docs/en/overview](https://code.claude.com/docs/en/overview)
- Best practices: [https://code.claude.com/docs/en/best-practices](https://code.claude.com/docs/en/best-practices)
