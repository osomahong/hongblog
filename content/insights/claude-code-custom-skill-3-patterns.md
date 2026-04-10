---
slug: claude-code-custom-skill-3-patterns
title: Claude Code 커뮤니티에서 찾은 커스텀 Skill 세 가지 패턴
excerpt: Claude Code의 핵심은 코드 생성이 아니라 Skill 시스템입니다. TDD 강제, 팀 맞춤 코드 리뷰, 실행 가능한 런북까지 — 전 세계 커뮤니티에서 실제로 쓰이는 3가지 커스텀 Skill 패턴을 정리했습니다.
category: AI_TECH
tags:
  - AI
  - 바이브코딩
  - 자동화
publishedAt: '2026-02-25T15:24:42.180Z'
quiz:
  - options:
      - 테스트 작성 에이전트와 구현 에이전트를 격리하여, 서로의 맥락이 추론을 오염시키지 않게 한다
      - 테스트 실행 속도를 높이기 위해 병렬로 여러 테스트를 동시에 실행한다
      - 기존 코드를 수정하지 못하게 읽기 전용 모드로 강제한다
      - 테스트 파일과 구현 파일을 자동으로 분리된 디렉토리에 생성한다
    question: 'Claude Code의 context: fork 옵션이 TDD 워크플로우에서 핵심적인 이유는 무엇인가요?'
    explanation: 'context: fork는 스킬을 별도의 서브에이전트에서 격리 실행합니다. TDD에서 이것이 중요한 이유는, 테스트 작성자가 구현 계획을 모른 채 요구사항만 보고 테스트를 써야 하고, 구현자는 테스트만 보고 코드를 작성해야 하기 때문입니다. 맥락이 섞이면 LLM은 ''코드에 맞는 테스트''를 쓰게 되어 TDD의 의미가 사라집니다.'
    correctIndex: 0
metaTitle: Claude Code 커스텀 Skill 3가지 패턴 | TDD 강제, 팀 코드 리뷰, 런북 자동화
metaDescription: 'Claude Code 커스텀 Skill의 실전 패턴 3가지를 분석합니다. context: fork 기반 TDD 강제, 팀 맞춤 코드 리뷰, 실행 가능한 런북까지 커뮤니티가 검증한 방법론입니다.'
ogTitle: Claude Code 커스텀 Skill의 진짜 힘 — 3가지 패턴
ogDescription: TDD 강제, 팀 맞춤 코드 리뷰, 실행 가능한 런북 — 커뮤니티가 검증한 커스텀 Skill 패턴을 정리했습니다.
---

## 코드 생성은 시작일 뿐입니다

Claude Code를 처음 쓰면 자연어로 코드를 생성하는 것에 감탄합니다. 그런데 몇 주 쓰다 보면 깨닫습니다. 진짜 생산성 차이는 코드 생성이 아니라 **반복되는 개발 워크플로우를 자동화하는 것**에서 나옵니다.

Claude Code의 **Skill 시스템**이 바로 이 문제를 해결합니다. Skill은 `SKILL.md` 파일에 마크다운으로 작성하는 지시문입니다. 슬래시 명령어(`/skill-name`)로 호출하면 Claude가 해당 워크플로우를 자동으로 실행합니다.

기본 제공되는 공식 스킬도 유용하지만, Claude Code의 진짜 차별화는 **누구나 만들 수 있는 커스텀 Skill**에 있습니다. GitHub에는 이미 수천 개의 커뮤니티 스킬이 공유되고 있고, awesome-claude-skills 저장소에만 300개 이상의 스킬이 큐레이션되어 있습니다.

이 글에서는 커뮤니티에서 가장 활발하게 쓰이고 검증된 **3가지 커스텀 Skill 패턴**을 소개합니다.

---

## Skill 시스템의 핵심 메커니즘

본론에 들어가기 전에, 커스텀 스킬을 이해하는 데 필요한 3가지 핵심 메커니즘을 짚겠습니다.

### 동적 컨텍스트 주입 (`!`backtick 문법)

SKILL.md 안에서 `` !`shell command` `` 문법을 쓰면, 해당 셸 명령이 **스킬 로드 시점에 미리 실행**됩니다. 결과가 프롬프트에 바로 주입되므로, Claude는 추가 대화 없이 실시간 데이터를 받아서 작업할 수 있습니다.

```yaml
## 현재 상태
- Git 상태: !`git status --short`
- 변경 내역: !`git diff --stat`
```

Claude가 "뭐가 바뀌었지?"를 확인하느라 토큰을 쓸 필요가 없습니다.

### 서브에이전트 격리 (`context: fork`)

SKILL.md의 프론트매터에 `context: fork`를 추가하면, 해당 스킬은 **별도의 서브에이전트에서 격리 실행**됩니다. 메인 대화의 컨텍스트를 오염시키지 않고, 독립적인 작업 공간에서 처리합니다.

```yaml
---
name: my-skill
context: fork
agent: Explore
---
```

이것이 왜 중요한지는 첫 번째 패턴에서 구체적으로 설명합니다.

### Hooks (이벤트 가드레일)

Hooks는 특정 이벤트(파일 저장, 프롬프트 제출, 도구 호출 등)에 반응하여 자동으로 실행되는 셸 명령입니다. 스킬과 조합하면 **Claude가 규칙을 따르도록 강제**할 수 있습니다. 스킬이 "이렇게 해라"라는 지시라면, 훅은 "안 하면 막겠다"라는 가드레일입니다.

---

## 1. TDD 강제 스킬 — context: fork로 에이전트를 격리하는 패턴

### 문제: LLM은 자연스럽게 TDD를 깨뜨립니다

LLM에게 "테스트를 먼저 쓰고 구현해"라고 지시하면, 대부분 이런 일이 벌어집니다.

1. 머릿속으로 구현을 먼저 설계합니다
2. 그 구현에 맞는 테스트를 작성합니다
3. 테스트가 통과하는 코드를 씁니다

결과적으로 **코드에 맞춘 테스트**가 나옵니다. 실제 요구사항을 검증하는 것이 아니라, 자기가 쓸 코드를 미리 통과시키는 테스트입니다. TDD의 핵심인 "Red → Green → Refactor" 사이클이 완전히 무너집니다.

Matt Pocock(TypeScript 교육자)은 이 문제를 이렇게 표현합니다. "LLM이 테스트를 작성할 때 가장 큰 문제는, 구현을 상상하고 그에 맞는 테스트를 쓴다는 것입니다."

### 해결: 서브에이전트를 격리하여 맥락을 차단합니다

커뮤니티에서 가장 많이 참조되는 접근법은 **3개의 격리된 서브에이전트**를 사용하는 것입니다.

```
[오케스트레이터 스킬]
  ├─ 서브에이전트 1: 테스트 작성자 (context: fork)
  │   → 요구사항만 봅니다. 구현 계획은 모릅니다.
  ├─ 서브에이전트 2: 구현자 (context: fork)
  │   → 실패하는 테스트만 봅니다. 테스트 작성 의도는 모릅니다.
  └─ 서브에이전트 3: 리팩터러 (context: fork)
      → 통과한 코드를 봅니다. 구현 과정의 시행착오는 모릅니다.
```

`context: fork`가 핵심입니다. 각 서브에이전트는 **자기에게 필요한 맥락만** 받습니다.

- 테스트 작성자는 구현 계획을 모르기 때문에, 요구사항에 충실한 테스트를 씁니다
- 구현자는 테스트 작성 의도를 모르기 때문에, 테스트를 통과시키는 최소한의 코드만 씁니다
- 리팩터러는 시행착오 과정을 모르기 때문에, 결과 코드만 보고 구조적 개선에 집중합니다

### 실제 SKILL.md 구조

```yaml
---
name: tdd
description: TDD 워크플로우를 실행합니다
---

## TDD 사이클

### Step 1: Red (테스트 작성)
다음 요구사항에 대한 테스트를 작성하세요.
$ARGUMENTS

규칙:
- 테스트는 하나만 작성합니다 (한 번에 하나의 기능만)
- 실행하면 반드시 실패해야 합니다
- 구현을 상상하지 마세요

### Step 2: Green (최소 구현)
위 테스트가 통과하는 최소한의 코드를 작성하세요.

규칙:
- 테스트를 통과시키는 것 외에 아무것도 하지 마세요
- 하드코딩도 괜찮습니다

### Step 3: Refactor
테스트가 통과하는 상태를 유지하면서 코드를 정리하세요.
```

더 정교한 구현은 각 Step을 별도의 SKILL.md 파일로 분리하고, `context: fork`로 격리합니다.

### Hooks와 조합: 규칙을 강제합니다

community의 **tdd-guard** 프로젝트는 여기서 한 발 더 나갑니다. Hooks를 활용하여 TDD 규칙을 **물리적으로 강제**합니다.

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Write|Edit",
        "command": "node .claude/hooks/tdd-guard.js"
      }
    ]
  }
}
```

파일을 수정하려 할 때 Hook이 먼저 실행됩니다. 현재 TDD 단계가 "Red"인데 구현 파일을 수정하려 하면 **차단**됩니다. 테스트 파일만 수정할 수 있습니다. "Green" 단계에서는 구현 파일만 수정할 수 있습니다.

스킬이 "이렇게 해라"라면, 훅은 "안 하면 못 한다"입니다. 이 조합으로 스킬 활성화율이 약 20%에서 84%까지 올라갔다는 커뮤니티 보고가 있습니다.

### 지원 프레임워크

Jest, Vitest, pytest, PHPUnit, Go test, Rust 등 주요 테스트 프레임워크를 모두 지원하며, 언어별 설정만 맞추면 즉시 사용할 수 있습니다.

---

## 2. 팀 맞춤 코드 리뷰 스킬 — Progressive Disclosure 패턴

### 문제: 팀마다 코드 규칙이 다릅니다

일반적인 린터는 문법 오류와 포매팅을 잡습니다. 그런데 실무에서 코드 리뷰가 시간을 잡아먹는 이유는 그런 것들 때문이 아닙니다.

- "우리 팀은 React 컴포넌트에서 이 패턴을 쓰기로 했는데, 이 PR은 다른 패턴을 썼네요"
- "에러 핸들링 가이드라인에 따르면 이 경우에는 커스텀 에러 클래스를 써야 합니다"
- "이 API 엔드포인트는 rate limiting이 빠져 있습니다"

이런 **팀 고유의 규칙**은 린터로 잡을 수 없습니다. 사람이 매번 기억하고 지적해야 합니다.

### 해결: 팀 규칙을 스킬로 코드화합니다

커스텀 코드 리뷰 스킬은 팀의 규칙을 마크다운으로 작성하고, Claude가 PR을 해당 규칙에 맞게 검토하도록 합니다.

```yaml
---
name: review
description: 팀 규칙에 맞게 코드를 리뷰합니다
context: fork
allowed-tools: Bash(gh *), Read, Grep, Glob
---

## 리뷰 대상
- PR diff: !`gh pr diff`
- 변경 파일: !`gh pr diff --name-only`

## 리뷰 규칙
@reference/react-rules.md
@reference/api-rules.md
@reference/security-rules.md

## 출력 형식
각 이슈에 대해:
1. 파일 경로와 라인 번호
2. 위반한 규칙
3. 수정 방안

사소한 스타일 지적은 하지 마세요.
```

### Progressive Disclosure가 핵심입니다

여기서 가장 중요한 설계 패턴은 **Progressive Disclosure**입니다.

SKILL.md 자체는 200줄 이내로 짧게 유지합니다. 상세한 규칙은 `reference/` 디렉토리의 별도 파일에 작성합니다.

```
.claude/skills/review/
├── SKILL.md              (200줄 — 핵심 지시만)
└── reference/
    ├── react-rules.md    (800줄 — React 19 패턴)
    ├── api-rules.md      (600줄 — REST API 규칙)
    ├── security-rules.md (400줄 — 보안 체크리스트)
    └── typescript.md     (500줄 — TS 컨벤션)
```

`@reference/react-rules.md`로 참조하면, Claude는 React 파일을 리뷰할 때만 해당 규칙을 로드합니다. Python 파일을 리뷰할 때는 로드하지 않습니다.

이 구조의 장점은 3가지입니다.

1. **컨텍스트 효율성** — 필요한 규칙만 로드하므로 토큰을 절약합니다
2. **유지보수성** — React 규칙이 바뀌면 `react-rules.md`만 수정하면 됩니다
3. **확장성** — 새 언어나 프레임워크 규칙을 파일 하나 추가하는 것으로 확장합니다

community의 code-review-skill 프로젝트는 이 패턴으로 React 19, Vue 3, Rust, TypeScript, Java, Python, Go, C, C++ 등 **9,500줄**의 리뷰 가이드라인을 관리합니다. 하지만 한 번에 로드되는 것은 메인 SKILL.md의 190줄뿐입니다.

### 실전 팁: 리뷰 품질을 높이는 방법

커뮤니티에서 가장 많이 공유하는 팁은 **"하지 마세요" 규칙**을 명시하는 것입니다.

```markdown
## 하지 마세요
- 변수명 스타일 지적 (Prettier가 처리)
- import 순서 지적 (ESLint가 처리)
- "이렇게 하면 더 좋을 수도" 수준의 제안
- 기존에 이미 있던 문제 (이 PR에서 새로 도입된 것만)
```

이 규칙이 없으면 Claude는 사소한 것까지 전부 지적합니다. 결과적으로 진짜 중요한 이슈가 노이즈에 묻힙니다. "무엇을 하지 말아야 하는가"를 알려주는 것이 리뷰 품질을 극적으로 높입니다.

---

## 3. 실행 가능한 런북 — 문서가 곧 자동화인 패턴

### 문제: 팀 지식은 사라집니다

"프로덕션에 배포하려면 어떻게 하지?"
"이 서비스 모니터링 알럿이 울리면 어떻게 대응하지?"
"신규 개발자 온보딩 절차가 뭐지?"

이런 지식은 보통 위키, 노션 페이지, 슬랙 DM, 또는 특정 사람의 머릿속에 있습니다. 해당 사람이 자리를 비우거나 퇴사하면 지식이 사라집니다.

문서를 작성해도 문제입니다. 시스템이 바뀌면 문서가 업데이트되지 않습니다. 오래된 문서는 없는 것보다 나쁩니다.

### 해결: 문서 자체를 실행 가능하게 만듭니다

Claude Code Skill의 가장 혁신적인 점은, **사람이 읽는 문서와 Claude가 실행하는 지시문이 동일한 파일**이라는 것입니다.

```yaml
---
name: deploy
description: 프로덕션에 배포합니다
disable-model-invocation: true
context: fork
---

## 배포 절차

### 1. 사전 확인
- 현재 브랜치: !`git branch --show-current`
- main과의 차이: !`git log main..HEAD --oneline`
- 테스트 결과: !`npm test 2>&1 | tail -5`

### 2. 빌드
`npm run build`를 실행하세요.
빌드 에러가 있으면 사용자에게 보고하고 중단하세요.

### 3. 배포
`vercel deploy --prod`를 실행하세요.

### 4. 검증
배포 후 `curl -s https://example.com/api/health`로 상태를 확인하세요.
200 응답이 아니면 즉시 사용자에게 알리세요.

### 5. 알림
배포 완료 후 변경 사항 요약을 출력하세요.
```

이 파일은 두 가지 역할을 동시에 합니다.

- 신규 개발자가 읽으면 **배포 절차 문서**입니다
- `/deploy`를 실행하면 **자동화 스크립트**입니다

문서와 실행 코드가 같은 파일이기 때문에 **절대 어긋나지 않습니다**. Zack Proser(WorkOS)는 이것을 "문서와 실행이 분리될 수 없다 — 같은 산출물이기 때문이다"라고 표현했습니다.

### disable-model-invocation: 위험한 작업은 수동으로만

`disable-model-invocation: true`는 Claude가 상황을 판단하여 자동으로 이 스킬을 실행하는 것을 막습니다. 반드시 사용자가 `/deploy`를 직접 입력해야만 실행됩니다.

배포, DB 마이그레이션, 프로덕션 데이터 수정 같은 **비가역적 작업**에는 이 옵션이 필수입니다.

### 커뮤니티 활용 사례

이 패턴은 배포 외에도 다양한 팀 런북에 적용됩니다.

#### 인시던트 대응

```yaml
---
name: incident
description: 프로덕션 장애 대응 절차를 실행합니다
disable-model-invocation: true
---

## 장애 대응 절차

### 1. 현황 파악
- 서비스 상태: !`curl -s https://example.com/api/health`
- 최근 배포: !`gh release list --limit 3`
- 에러 로그: 최근 에러를 확인하세요

### 2. 원인 분석
최근 변경 사항과 에러 로그를 교차 분석하세요.

### 3. 조치
원인이 최근 배포라면 롤백 옵션을 제시하세요.
모든 조치는 사용자 승인 후 실행하세요.
```

#### 온보딩

```yaml
---
name: onboarding
description: 신규 개발자 환경 설정을 안내합니다
---

## 개발 환경 설정

### 1. 의존성 확인
- Node.js: !`node --version`
- npm: !`npm --version`

### 2. 프로젝트 설정
npm install을 실행하세요.
.env.example을 .env.local로 복사하고
필요한 환경 변수를 안내하세요.

### 3. 로컬 실행 확인
npm run dev를 실행하고 정상 작동을 확인하세요.
```

#### Git 워크플로우 표준화

팀의 브랜치 전략, 커밋 메시지 컨벤션, PR 템플릿을 스킬로 코드화하면 **팀원 모두가 동일한 워크플로우**를 따릅니다. 구두로 약속한 규칙은 잊히지만, 스킬로 코드화한 규칙은 실행됩니다.

### 버전 관리의 이점

스킬은 마크다운 파일이므로 Git에 커밋됩니다. 이것은 3가지 부수 효과를 만듭니다.

1. **PR 리뷰 가능** — 배포 절차가 바뀌면 해당 SKILL.md의 diff를 리뷰합니다
2. **히스토리 추적** — "언제, 왜 이 절차가 바뀌었는가"를 git log로 확인합니다
3. **팀 공유** — `.claude/skills/`에 넣으면 프로젝트의 모든 참여자가 자동으로 사용합니다

---

## 정리: 3가지 패턴이 보여주는 방향

| 패턴 | 핵심 메커니즘 | 해결하는 문제 |
|------|-------------|-------------|
| TDD 강제 | context: fork + Hooks | LLM이 TDD를 깨뜨리는 문제 |
| 팀 맞춤 코드 리뷰 | Progressive Disclosure | 팀 규칙을 린터로 잡을 수 없는 문제 |
| 실행 가능한 런북 | 문서 = 실행 | 팀 지식이 사라지고 문서가 낡는 문제 |

세 패턴의 공통점이 있습니다. **마크다운 파일 하나**로 시작한다는 것입니다.

SKILL.md에 지시문을 쓰고, 필요하면 `context: fork`로 격리하고, 위험한 작업에는 `disable-model-invocation: true`를 붙이고, 실시간 데이터가 필요하면 `!`backtick으로 셸 명령을 주입합니다.

다른 AI 코딩 도구도 코드 생성은 잘 합니다. 하지만 **셸 명령을 실행하고, 서브에이전트를 격리하고, 팀 고유의 워크플로우를 마크다운으로 자동화**할 수 있는 시스템은 Claude Code의 Skill이 유일합니다.

시작은 간단합니다. 하루에 3번 이상 반복하는 작업이 있다면, 그것이 첫 번째 스킬의 후보입니다.

---

## 참고 자료

- [Claude Code Skills 공식 문서](https://code.claude.com/docs/en/skills)
- [awesome-claude-skills](https://github.com/travisvn/awesome-claude-skills) — 300+ 커뮤니티 스킬 큐레이션
- [awesome-agent-skills](https://github.com/VoltAgent/awesome-agent-skills) — 크로스 플랫폼 스킬 모음
- [obra/superpowers](https://github.com/obra/superpowers) — 20+ 실전 검증 스킬 프레임워크
- [nizos/tdd-guard](https://github.com/nizos/tdd-guard) — Hook 기반 TDD 강제 도구
- [Simon Willison: Skills are awesome](https://simonwillison.net/2025/Oct/16/claude-skills/) — "MCP보다 큰 딜일 수 있다"
