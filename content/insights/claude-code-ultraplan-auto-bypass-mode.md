---
slug: claude-code-ultraplan-auto-bypass-mode
title: 'Ultraplan, Auto 모드, bypass 모드의 차이와 사용 맥락을 정리했습니다'
excerpt: >-
  Claude Opus 4.7 출시와 함께 Claude Code에 Ultraplan과 Auto 모드가 추가되면서
  --dangerously-skip-permissions(bypass 모드)와 어떻게 다른지 헷갈리는 분이 많습니다. 공식 문서 기준 3가지
  실행 방식의 차이, 플랜별 가용성, 그리고 일상 작업에서 어떤 조합을 써야 하는지 정리했습니다.
category: AI_TECH
tags:
  - AI
  - 자동화
  - 바이브코딩
publishedAt: '2026-04-22T13:00:00.000Z'
updatedAt: '2026-07-23T00:00:00.000Z'
quiz:
  - options:
      - Auto 모드를 켠다. 분류기가 위험 액션만 차단하고 안전한 액션은 자동 실행하므로 피로와 사고 위험을 동시에 줄인다
      - '--dangerously-skip-permissions를 쓴다. 모든 권한 프롬프트가 사라져 가장 빠르다'
      - 모든 프롬프트를 수동 승인한다. 안전이 최우선이므로 다른 모드는 고려하지 않는다
      - plan 모드로 계획만 세우고 실행은 나중에 몰아서 처리한다
    question: '하루 종일 장기 에이전트 작업을 돌려야 하는 상황에서, 안전과 생산성을 동시에 잡는 가장 합리적인 선택은 무엇일까요?'
    explanation: >-
      Auto 모드는 Sonnet 4.6 기반 분류기가 권한 밖 위험 액션(코드 다운로드, 실행, 민감 데이터 유출, 프로덕션 배포 등)만
      차단하고 나머지는 자동 실행합니다. --dangerously-skip-permissions는 안전 검사 자체가 없어 격리
      컨테이너, VM 외에서는 공식적으로 권장되지 않습니다. Plan 모드는 실행을 막는 설계라 여기선 부적합합니다.
    correctIndex: 0
metaTitle: 'Claude Code Ultraplan, Auto, Bypass 모드 차이 정리'
metaDescription: >-
  Claude Opus 4.7 시점 추가된 Ultraplan, Auto 모드와 기존
  --dangerously-skip-permissions(bypass 모드)의 정확한 차이, 플랜별 가용성, 분류기 작동 원리, 일상 작업
  조합을 공식 문서 기준으로 정리했습니다.
ogImage: /og/claude-code-ultraplan-auto-bypass-mode.png
ogTitle: Ultraplan, Auto, Bypass 모드의 차이와 사용 맥락
ogDescription: '클로드 코드에 새로 추가된 세 가지 실행 방식을 공식 문서 기준으로 비교하고, 일상 작업에서 어떤 조합이 안전한지 정리했습니다.'
summary3:
  - 'Ultraplan은 클라우드에서 계획을 만들어 브라우저에서 검토하는 기능이고 Auto 모드는 분류기가 위험한 동작만 막으며 자동으로 실행하는 모드입니다.'
  - 'bypass 모드는 모든 안전 검사를 없애고 보호된 경로만 예외로 남기는 실행 방식입니다.'
  - 'Opus 4.7이 장기 실행 작업에서 더 자율적으로 움직이면서 계획은 촘촘히 보고 실행은 끊지 않되 위험만 걸러 내려는 요구가 커진 결과입니다.'
---

결론부터 말씀드립니다. 세 가지는 **"어디까지 자동으로 실행하고 무엇을 검사하느냐"**가 근본적으로 다릅니다. Ultraplan은 **계획을 클라우드에서 만들고 브라우저에서 검토**하는 기능이고, Auto 모드는 **분류기가 위험 액션만 차단하면서 자동 실행**하는 모드이며, bypass 모드(`--dangerously-skip-permissions`)는 **모든 안전 검사를 제거**하고 실행만 합니다. Ultraplan은 계획 단계, Auto와 Bypass는 실행 단계의 선택지라 "대체" 관계가 아니라 **층이 다른 도구**입니다.

이 글에서는 2026년 4월 15일 Opus 4.7 출시를 전후해 등장한 이 세 기능을 공식 문서 기준으로 비교하고, 플랜별 가용성과 일상 작업에서 어떤 조합을 써야 하는지 정리하겠습니다.

## Ultraplan, Auto 모드, bypass 모드는 정확히 어떤 차이가 있을까요?

먼저 공식 문서 기준으로 3가지의 역할과 실행 단계를 정리한 표입니다.

| 구분 | 실행 단계 | 무엇을 하는지 | 안전 검사 | 실행 플래그 |
|------|---------|------------|----------|-----------|
| **Ultraplan** | 계획 | Claude Code on the web에서 계획 초안 작성, 브라우저에서 댓글, 수정 후 실행 위치 선택 | Plan 모드라 실행 없음 (읽기, 분석만) | `/ultraplan`, 프롬프트 내 `ultraplan` 키워드 |
| **Auto 모드** | 실행 | 권한 프롬프트 없이 실행하되 Sonnet 4.6 기반 분류기가 액션마다 검사 | 프롬프트 인젝션 탐지 + 위험 액션 분류기 | `--permission-mode auto`, `defaultMode: "auto"` |
| **Bypass 모드** | 실행 | 모든 권한 프롬프트, 안전 검사 제거, 보호된 경로만 예외 | 없음 (보호 경로 차단만 존재) | `--dangerously-skip-permissions`, `--permission-mode bypassPermissions` |

세 기능이 같은 시기에 주목받은 이유는 명확합니다. Opus 4.7이 장기 실행 에이전트 작업에서 훨씬 자율적으로 움직이기 시작하면서, **"계획은 더 촘촘하게 검토하고 실행은 중단 없이 돌리되 위험만 걸러내자"**는 요구가 커졌기 때문입니다. Ultraplan은 계획 검토를 강화하고, Auto 모드는 실행 중 안전망을 자동화하며, Bypass 모드는 극단적 자율성을 원할 때 쓰는 선택지입니다.

아래는 실제 [Claude Code](/class/claude-code-for-everyone/what-is-claude-code) CLI에서 Auto 모드가 활성화된 상태 표시줄입니다. 위쪽에 `[Opus 4.7 (1M context) | Max]` 모델 정보와 사용량 게이지가 뜨고, 아래쪽에 `▶▶ auto mode on (shift+tab to cycle)` 한 줄이 보이면 지금 세션이 Auto 모드로 돌고 있다는 신호입니다.

![실제 Claude Code CLI 상태 표시줄. 'Opus 4.7 (1M context) | Max' 모델 정보와 23% 사용량 게이지가 위쪽에, '▶▶ auto mode on (shift+tab to cycle)' Auto 모드 활성화 표시가 아래쪽에 뜬 모습](/images/insights/claude-code-ultraplan-auto-bypass-mode/auto-mode-status-bar.png)

[Anthropic](/class/claude-fundamentals/what-is-anthropic)은 이 발표에서 Auto 모드를 **"무조건 허용(위험함)과 수동 승인(피로함) 사이의 중간 지점"**이라고 명시했습니다. Bypass 모드를 완전히 대체하려는 의도가 아니라, 대부분의 장기 작업에서 더 안전한 기본값을 제공하려는 설계입니다.

## Opus 4.7 출시 시점에 왜 이런 모드들이 동시에 등장했을까요?

타임라인을 시간 순으로 정리하면 배경이 선명해집니다.

- **2026년 3월 24일**: Anthropic, Auto 모드 공식 발표 (Claude Code v2.1.83+). 초기에는 Team 연구 미리보기로만 제공
- **2026년 4월 6~10일경**: Ultraplan이 Claude Code v2.1.91~2.1.92에서 등장. Opus 4.7 출시 **1주 전**에 실린 기능
- **2026년 4월 15일**: Opus 4.7 일반 출시. 소프트웨어 엔지니어링, 장기 에이전트 작업 중심으로 최적화
- **Opus 4.7과 함께**: Auto 모드가 Max 플랜에서도 활성화, `xhigh` effort 레벨이 기본값으로 설정

공식 문서가 명시한 배경은 이렇습니다.

- Opus 4.7은 장기 실행 작업(long-horizon agentic work)을 가장 큰 개선 영역으로 잡음
- 장기 작업은 수십~수백 번의 도구 호출을 수반하는데, 매번 승인 프롬프트를 처리하면 피로도가 급증
- 일부 사용자는 `--dangerously-skip-permissions`로 우회해 왔지만, 이 방식은 프롬프트 인젝션, 잘못된 삭제 같은 사고에 완전히 무방비

Auto 모드와 Ultraplan은 **"모델 자율성은 올리되 사람의 검토 지점을 재배치"**하는 방향으로 설계된 것입니다. Ultraplan은 계획 단계에 검토를 집중시키고, Auto 모드는 실행 중 위험 액션에만 차단을 집중시킵니다.

## Ultraplan은 언제 쓰는 게 좋을까요?

Ultraplan이라는 단어가 처음 보이실 수 있습니다. 쉽게 말해 **"터미널에서 계획 만들기를 클라우드에 맡기고, 브라우저에서 공동 검토 후 실행 위치를 고르는 기능"**입니다. 공식 문서에서 제시하는 권장 사용 맥락은 다음과 같습니다.

- **계획이 크고 다단계일 때**: auth 서비스 전체를 JWT로 마이그레이션하는 규모의 작업
- **브라우저에서 더 풍부한 검토가 필요할 때**: 특정 섹션에 인라인 댓글, 이모지 반응, 아웃라인 사이드바 활용
- **터미널을 다른 작업에 쓰고 싶을 때**: 계획 초안 작업이 클라우드에서 돌아가므로 로컬 CLI는 자유
- **실행 위치를 유연하게 선택하고 싶을 때**: 클라우드에서 바로 PR 생성하거나, 터미널로 "텔레포트"해 로컬 구현

실행은 두 가지 옵션입니다.

1. **클라우드에서 바로 구현**: Claude Code on the web 세션이 계속 작업하고, 완료 후 PR로 연결
2. **터미널로 텔레포트**: 브라우저에서 승인한 계획이 로컬 CLI로 돌아오고, "여기서 구현 / 새 세션 시작 / 계획만 파일 저장" 중 선택

사용 조건도 확인해 두셔야 합니다. Ultraplan은 **Claude Code on the web 계정 + GitHub 리포지토리**가 필수이고, **Amazon Bedrock, Google Cloud Vertex AI, Microsoft Foundry에서는 동작하지 않습니다**. Anthropic API 기반 사용자만 쓸 수 있습니다.

## Auto 모드는 --dangerously-skip-permissions와 무엇이 다를까요?

두 모드 모두 "프롬프트 없이 실행"이라는 표면적 공통점이 있어 많은 분이 같은 기능으로 오해하십니다. 실제로는 **안전 검사 유무**에서 근본적으로 다릅니다.

| 항목 | Auto 모드 | Bypass 모드 (`--dangerously-skip-permissions`) |
|------|----------|----------------------------------------------|
| 권한 프롬프트 | 없음 | 없음 |
| 프롬프트 인젝션 탐지 | 있음 (서버 측 입력 스캐너) | 없음 |
| 액션별 위험 분류 | 있음 (Sonnet 4.6 기반 분류기) | 없음 |
| 위험 액션 차단 | 자동 | 차단 없이 실행 |
| 보호 경로(.git, .claude 등) | 분류기로 라우팅 | 프롬프트는 뜸 |
| 권장 환경 | 일반 개발 환경 | 격리 컨테이너, VM만 |
| 플랜 제약 | Max, Team, Enterprise, API | 플랜 제약 없음 (관리자가 차단 가능) |

Auto 모드의 핵심은 **"차단 시 중단하지 않고 다른 방법을 시도한다"**는 설계입니다. 분류기가 액션을 차단하면 [Claude](/class/claude-fundamentals/what-is-claude)는 멈춰서 사용자를 기다리는 대신 더 안전한 대안을 찾습니다. 다만 3연속 차단 또는 세션 내 20회 누적 차단 시에는 사용자에게 제어를 돌려줍니다.

반면 Bypass 모드는 **차단 자체가 없어서 모델이 어떤 판단을 하든 그대로 실행**됩니다. Anthropic은 공식 문서에 "격리된 컨테이너, VM, 인터넷 없는 devcontainer에서만 사용"을 명시했고, 관리자는 `permissions.disableBypassPermissionsMode: "disable"` 설정으로 조직 전체에서 차단할 수 있습니다.

## 클로드 코드는 언제 위험을 감지하여 차단을 판단하는 걸까요?

분류기(classifier)라는 용어가 낯설 수 있습니다. 쉽게 말하면 **"실행 직전에 '이 액션이 안전한지'를 별도 모델로 한 번 더 판정하는 검문소"**입니다. 공식 엔지니어링 블로그가 공개한 작동 구조를 그대로 정리합니다.

- **입력 계층(input layer)**: 서버 측 프롬프트 인젝션 탐지기가 파일 읽기, 웹 페치, 셸 출력 등 들어오는 내용을 스캔. 공격 시도로 판단되면 에이전트 컨텍스트에 경고 추가
- **출력 계층(output layer)**: Sonnet 4.6 기반 분류기가 각 도구 호출 직전에 평가. 먼저 "yes/no 단일 토큰 필터"로 빠르게 결정하고, 플래그되면 체인-오브-소트 추론 수행
- **분류기가 보는 정보**: 사용자 메시지 + 도구 호출 내용 + CLAUDE.md 일부. **도구 실행 결과는 제외** (악성 파일 내용이 분류기 조작 못하게)
- **실행 순서**: (1) 명시 허용/거부 규칙 → (2) 워킹 디렉토리 내 읽기, 편집은 자동 승인 → (3) 그 외는 분류기로 라우팅 → (4) 차단되면 Claude가 대안 탐색

분류기 기본 규칙도 공식 문서에 명시되어 있습니다.

**기본 차단**: `curl | bash` 같은 외부 코드 실행, 외부 엔드포인트로 민감 데이터 전송, 프로덕션 배포, 마이그레이션, 클라우드 스토리지 대량 삭제, IAM 권한 부여, 공유 인프라 수정, 세션 전 존재 파일의 비가역 파괴, main 브랜치 force push 또는 직접 push.

**기본 허용**: 워킹 디렉토리 내 로컬 파일 조작, lock file에 선언된 의존성 설치, `.env` 읽고 매칭되는 API에 자격증명 전송, 읽기 전용 HTTP 요청, 시작한 브랜치나 Claude가 만든 브랜치로 push.

또 하나 중요한 설계는 **"대화 속 경계선(boundaries)도 분류기가 차단 신호로 사용한다"**는 점입니다. "푸시하지 마", "배포 전에 내가 검토할게"라고 말하면 기본 허용 액션도 분류기가 막아줍니다. 단, 이 경계선은 규칙으로 저장되는 게 아니라 매번 트랜스크립트에서 재독해서 평가되므로, 컨텍스트 압축으로 해당 메시지가 사라지면 경계선도 사라집니다. **확실한 차단은 `deny` 규칙을 별도로 추가하시는 편이 안전합니다**.

## 어떤 플랜에서 각 모드를 쓸 수 있을까요?

이 부분이 실제로 가장 자주 묻는 질문입니다. 아래 표는 **2026년 4월 기준** 공식 요구 사항이며, Anthropic이 플랜 구조를 재편하는 중이라 시점이 지나면 달라질 수 있습니다.

| 모드 | Free | Pro | Max | Team | Enterprise | API |
|------|------|-----|-----|------|-----------|-----|
| default | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| acceptEdits | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| plan | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Ultraplan** | ❌ | Claude Code on the web 가능 시 | Claude Code on the web 가능 시 | Claude Code on the web 가능 시 | Claude Code on the web 가능 시 | ❌ (Bedrock/Vertex/Foundry 불가) |
| **Auto 모드** | ❌ | ❌ | ✅ (Opus 4.7만 지원) | ✅ (관리자 활성화 필요) | ✅ (관리자 활성화 필요) | ✅ (Sonnet 4.6, Opus 4.6, Opus 4.7) |
| dontAsk | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Bypass 모드** | ✅ | ✅ | ✅ | ✅ (관리자 차단 가능) | ✅ (관리자 차단 가능) | ✅ |

요약하면 이렇습니다.

- **Pro 플랜 사용자**: Auto 모드 사용 불가. Ultraplan은 Claude Code on the web 자격이 있으면 가능. Bypass 모드는 가능하지만 권장되지 않음.
- **Max 플랜 사용자**: Opus 4.7로만 Auto 모드 가능. Sonnet이나 Opus 4.6으로는 Auto 모드가 켜지지 않음.
- **Team, Enterprise**: 관리자가 Claude Code admin 설정에서 켜야 사용자가 활성화 가능.
- **API 사용자**: Anthropic API 직접 사용 시에만. Bedrock, Vertex, Foundry는 Auto 모드, Ultraplan 모두 불가.

Pro 플랜에서 Auto 모드를 쓰려는 분들이 가장 많이 좌절하는 지점입니다. **Auto 모드를 쓰려면 최소 Max 5x($100/월) 플랜이 필요합니다**. 이 점이 4월 22일의 Pro 플랜 Claude Code 포함 논란과 맞물려 있어 혼란이 큰 상황입니다.

## 일상 작업에서 어떤 조합을 써야 할까요?

실무에서 쓰는 대표 시나리오를 정리합니다.

1. **코드베이스 탐색, 리서치 단계**: `plan` 모드. 파일을 읽고 분석만 하며 수정은 하지 않으므로 민감한 레포에서 가장 안전합니다.
2. **중간 규모 리팩토링**: `acceptEdits` 모드. 편집은 자동 승인하되 셸 명령은 프롬프트가 뜨므로 리뷰 흐름이 자연스럽게 유지됩니다.
3. **대규모 마이그레이션, 멀티 파일 작업**: `/ultraplan`으로 계획을 먼저 브라우저에서 검토한 뒤, 터미널로 텔레포트해 `acceptEdits`나 `auto`로 실행.
4. **장기 실행 에이전트 작업(1시간+)**: Max 이상이면 `auto` 모드. 분류기가 위험 액션만 걸러내므로 중단 피로를 크게 줄일 수 있습니다.
5. **격리된 CI, 샌드박스 자동화**: `dontAsk` 모드 + 사전 허용 규칙 조합. Bypass 모드보다 훨씬 안전합니다.
6. **완전 격리된 컨테이너에서 실험**: `bypassPermissions`. 인터넷 없는 devcontainer나 VM에서만, 실험용 브랜치, 분리된 디렉토리에서만.

**절대 피해야 할 조합**은 명확합니다. 로컬 호스트 머신에서 `--dangerously-skip-permissions` + 인터넷 접속 + 민감 레포를 같이 두는 것입니다. 프롬프트 인젝션이 `.env` 파일을 외부로 유출하거나, 잘못된 추론이 원격 브랜치를 대량 삭제하는 사고가 이 조합에서 주로 발생합니다.

의사결정을 단순화하면 이렇게 정리됩니다. **"안전은 한 단계씩 자동화한다"**가 핵심입니다. default → acceptEdits → plan → auto 순서로 필요에 따라 올라가고, bypass는 격리 환경 전용으로 분리해 두는 것이 원칙입니다.

**Sources:**
- [Anthropic Engineering: Claude Code auto mode: a safer way to skip permissions](https://www.anthropic.com/engineering/claude-code-auto-mode)
- [Claude.com: Auto mode for Claude Code (공식 발표, 2026-03-24)](https://claude.com/blog/auto-mode)
- [Claude Code Docs: Choose a permission mode](https://code.claude.com/docs/en/permission-modes)
- [Claude Code Docs: Plan in the cloud with ultraplan](https://code.claude.com/docs/en/ultraplan)
- [Anthropic: Introducing Claude Opus 4.7 (2026-04-15)](https://www.anthropic.com/news/claude-opus-4-7)
- [Claude.com: Best practices for using Claude Opus 4.7 with Claude Code](https://claude.com/blog/best-practices-for-using-claude-opus-4-7-with-claude-code)
- [9to5Mac: Claude Code gives developers auto mode, a safer alternative to skipping permissions (2026-03-24)](https://9to5mac.com/2026/03/24/claude-code-gives-developers-auto-mode-a-safer-alternative-to-skipping-permissions/)
