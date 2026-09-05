---
slug: ox-alpha-claude-code-codex-setup
title: Ox Alpha를 클로드 코드와 코덱스 CLI에서 쓰는 방법
excerpt: >-
  Ox Alpha는 Z.AI의 GLM-5.3-Flash입니다. 클로드 코드와 코덱스 CLI는 모두 Z.AI 공식 지원 목록에 올라 있습니다. 도구를 바꾸지 않고 요청을 보내는 주소만 Z.AI로 돌리면 되며, 두 도구의 설정 파일과 값이 서로 다릅니다. 공식 문서
  기준으로 설정 방법과 요금제, 붙이기 전에 확인할 것을 정리했습니다.
category: AI_TECH
tags:
  - AI
  - API
  - 바이브코딩
  - 자동화
publishedAt: '2026-08-27T00:00:00.000Z'
summary3:
  - >-
    Ox Alpha는 Z.AI의 GLM-5.3-Flash이고 클로드 코드와 코덱스 CLI 모두 Z.AI가 공식 지원하는 15개 도구에 들어 있습니다.
  - >-
    클로드 코드는 `~/.claude/settings.json`에, 코덱스 CLI는 `~/.codex/config.toml`에 주소와 API 키를 넣습니다.
  - >-
    클로드 코드는 Anthropic Messages, 코덱스는 OpenAI Responses 주소를 쓰며 잘못 넣으면 구독 사용량이 적용되지 않습니다.
highlights:
  - 엔드포인트 주소를 도구에 맞게 고릅니다. 잘못 넣으면 구독 사용량이 적용되지 않는다고 공식 문서가 경고합니다.
  - >-
    앤트로픽 구독으로 클로드 코드를 쓰던 환경이라면 설정을 되돌릴 방법을 먼저 준비합니다. 같은 파일을 덮어쓰는 방식이라 원래 모델로
    돌아가려면 값을 지워야 합니다.
metaTitle: Ox Alpha를 클로드 코드와 코덱스 CLI에서 쓰는 방법
metaDescription: >-
  Ox Alpha는 Z.AI의 GLM-5.3-Flash입니다. 클로드 코드와 코덱스 CLI는 모두 Z.AI가 공식 지원하는 도구입니다. 두 도구의 설정
  파일 위치와 값, 프로토콜별 주소, 요금제 한도를 공식 문서 기준으로 정리했습니다.
ogDescription: '도구는 그대로 두고 요청을 보내는 주소만 Z.AI로 돌리는 방식입니다. 설정 파일 위치와 값, 주의할 점을 정리했습니다.'
ogImage: /og/ox-alpha-claude-code-codex-setup.png
quiz:
  - question: 클로드 코드에서 Ox Alpha를 쓰려면 무엇을 바꿔야 할까요?
    options:
      - '`~/.claude/settings.json`의 env에 Z.AI 주소와 API 키, 모델 이름을 넣는다'
      - 클로드 코드를 지우고 Z.AI가 만든 전용 프로그램을 새로 설치한다
      - 앤트로픽 계정 설정 화면에서 기본 모델을 GLM으로 바꾼다
      - 터미널에서 `claude --model glm` 옵션을 붙여 실행한다
    correctIndex: 0
    explanation: >-
      클로드 코드는 요청을 보낼 주소와 모델 이름을 환경 변수로 받습니다. 설정 파일의 env에 Z.AI의 Anthropic 호환 주소와
      API 키를 넣으면 프로그램은 그대로 두고 요청만 Z.AI 쪽으로 갑니다. Z.AI가 앤트로픽 형식으로 받아 GLM 모델로 처리한 뒤
      같은 형식으로 돌려주기 때문에 도구를 다시 설치할 일은 없습니다.
---

Ox Alpha는 Z.AI가 이름을 감춘 채 공개했던 GLM-5.3-Flash입니다. 클로드 코드와 코덱스 CLI는 모두 Z.AI가 공식으로 지원하는 도구라, 새 프로그램을 설치하는 대신 쓰던 도구에 모델만 바꿔 끼우면 됩니다. 고치는 곳은 설정 파일 하나입니다.

[스텔스 모델로 등장했던 Ox Alpha](/insights/ox-alpha-stealth-model-zai-glm)가 정체를 드러낸 뒤 자연스럽게 따라오는 질문이 하나 있습니다. 무료 기간에 써 봤다면 평소 쓰는 터미널 도구에도 그대로 붙일 수 있는지입니다. 결론부터 적으면 붙일 수 있고 방법도 공식 문서에 정해져 있습니다. 다만 두 도구가 쓰는 설정 파일과 주소가 서로 달라서, 한쪽 설정을 다른 쪽에 그대로 옮기면 동작하지 않습니다.

이 글은 Z.AI 개발자 문서에 적힌 값을 2026년 8월 27일 기준으로 정리한 것입니다. 직접 결제해 돌려 본 기록이 아니라 공식 문서 기준이라는 점을 먼저 밝힙니다.

## 클로드 코드와 코덱스 모두 공식 지원 목록에 있습니다

![Z.AI 개발자 문서의 지원 도구 목록 화면. ZCode, Claude Code, Claude for IDE, Codex, OpenCode, Pi가 카드 형태로 나열되어 있고 Codex 카드에는 코드를 작성하고 검토하고 디버깅하도록 돕는 OpenAI의 AI 코딩 에이전트라는 설명이 붙어 있다](/images/insights/ox-alpha-claude-code-codex-setup/zai-supported-tools.png)

위 화면은 Z.AI 개발자 문서의 지원 도구 목록입니다. 클로드 코드와 코덱스가 나란히 올라 있고, OpenCode와 Cursor를 비롯한 다른 도구까지 더하면 모두 열다섯 개에 연동 안내가 붙어 있습니다.

목록을 보면 Z.AI의 선택이 드러납니다. 자기 도구를 새로 만들어 쓰게 하는 대신, 이미 사람들이 쓰는 도구에 모델을 얹는 쪽을 골랐습니다. [코덱스 CLI와 클로드 코드를 비교했던 글](/insights/codex-cli-vs-claude-code)에서 다룬 두 도구의 차이는 그대로 남고, 그 안에서 돌아가는 모델만 달라지는 셈입니다.

## 도구는 그대로 두고 주소만 바꾸는 방식

클로드 코드는 앤트로픽 서버로 요청을 보내도록 만들어져 있습니다. 그 주소를 Z.AI로 바꾸면 같은 프로그램이 같은 형식으로 편지를 쓰되 배달지만 달라집니다. Z.AI가 앤트로픽 형식으로 받아 GLM 모델로 처리한 뒤 다시 같은 형식으로 돌려주기 때문에, 도구 입장에서는 무엇이 바뀌었는지 알 필요가 없습니다.

봉투 형식이 도구마다 다르다는 점만 주의하면 됩니다. Z.AI는 세 가지 형식을 받고 주소를 따로 두고 있습니다.

![Z.AI 개발자 문서의 코딩 엔드포인트 표 화면. Anthropic Messages는 api.z.ai/api/anthropic, OpenAI Chat Completions는 api.z.ai/api/coding/paas/v4, OpenAI Responses는 api.z.ai/api/v1이고 아래에 잘못된 엔드포인트를 설정하면 구독 사용량을 쓸 수 없다는 경고가 있다](/images/insights/ox-alpha-claude-code-codex-setup/zai-coding-endpoints.png)

| 형식 | 주소 | 쓰는 도구 |
|---|---|---|
| Anthropic Messages | `https://api.z.ai/api/anthropic` | 클로드 코드 |
| OpenAI Chat Completions | `https://api.z.ai/api/coding/paas/v4` | Cline, Roo Code 등 |
| OpenAI Responses | `https://api.z.ai/api/v1` | 코덱스 CLI |

문서는 이 대목에 경고를 하나 달아 두었습니다. 도구에 맞지 않는 주소를 넣으면 구독 사용량이 적용되지 않는다는 내용입니다. 주소를 잘못 적은 편지가 반송되는 대신 다른 요금으로 처리되는 셈이라, 설정 직후에 사용량이 제대로 잡히는지 확인하는 편이 좋습니다.

## 클로드 코드 설정

![Z.AI 개발자 문서의 클로드 코드 설정 화면. 클로드 코드 내부 모델 환경 변수와 GLM 모델의 대응이 기본 설정으로 제시되어 있고 ANTHROPIC_DEFAULT_OPUS_MODEL, ANTHROPIC_DEFAULT_SONNET_MODEL, ANTHROPIC_DEFAULT_HAIKU_MODEL 세 가지가 모두 GLM-5.3-Flash로 적혀 있다](/images/insights/ox-alpha-claude-code-codex-setup/zai-claude-code-settings.png)

위 화면이 이 글의 질문에 답하는 대목입니다. 클로드 코드가 안에서 쓰는 모델 항목 세 개를 모두 GLM-5.3-Flash로 채우는 것이 문서가 안내하는 기본값입니다. Ox Alpha로 알려졌던 그 모델이 오퍼스 항목까지 대신한다는 뜻입니다.

설정하는 방법은 세 가지인데 가장 간단한 것은 Z.AI가 만든 도우미를 실행하는 쪽입니다.

```bash
npx @z_ai/coding-helper
```

직접 적고 싶다면 `~/.claude/settings.json`을 열어 아래 값을 채웁니다. `your_zai_api_key` 부분에는 Z.AI 플랫폼에서 발급받은 키를 넣습니다.

```json
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "your_zai_api_key",
    "ANTHROPIC_BASE_URL": "https://api.z.ai/api/anthropic",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "glm-5.3-flash[1m]",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "glm-5.3-flash[1m]",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "glm-5.3-flash[1m]",
    "CLAUDE_CODE_AUTO_COMPACT_WINDOW": "1000000",
    "API_TIMEOUT_MS": "3000000"
  }
}
```

모델 이름 뒤의 `[1m]`은 컨텍스트를 100만 토큰으로 늘려 쓰겠다는 표시입니다. 아래 두 값도 그 길이에 맞춘 것인데, `CLAUDE_CODE_AUTO_COMPACT_WINDOW`는 대화가 길어졌을 때 자동으로 요약을 시작하는 시점이고 `API_TIMEOUT_MS`는 응답을 기다리는 한계 시간입니다. 오래 걸리는 작업에서 중간에 끊기지 않도록 넉넉하게 잡아 둔 값입니다.

설정을 저장한 뒤에는 열려 있던 창을 모두 닫고 새 터미널에서 `claude`를 실행합니다. 문서가 이 순서를 따로 적어 둔 이유는 이미 떠 있는 창이 옛 설정을 그대로 들고 있기 때문입니다.

문서 안에서 값이 어긋나는 곳도 하나 눈에 띕니다. 안내 문단은 세 항목을 모두 GLM-5.3-Flash로 적어 두었는데, 같은 페이지의 수동 설정 예시에는 소네트와 오퍼스 항목이 `glm-5.3`으로 적혀 있습니다. 모델 전환을 다루는 다른 문서는 다시 세 항목을 모두 `glm-5.3-flash[1m]`으로 안내합니다. Ox Alpha가 공개된 지 얼마 지나지 않아 문서마다 갱신 시점이 다른 것으로 보이므로, 실제로 어느 모델이 응답하는지는 붙인 뒤에 확인하는 편이 안전합니다.

## 코덱스 CLI 설정

코덱스는 파일 위치도 형식도 다릅니다. `~/.codex/config.toml`에 아래 내용을 넣습니다.

```toml
model_provider = "ZAI"
model = "glm-5.3"
model_reasoning_effort = "max"
model_catalog_json = "~/.codex/models.json"

[model_providers.ZAI]
name = "ZAI"
base_url = "https://api.z.ai/api/v1"
experimental_bearer_token = "<Your API Key>"
wire_api = "responses"
```

여기서 놓치기 쉬운 값이 `wire_api`입니다. 문서는 이 값을 반드시 `responses`로 두라고 적고 있으며, 주소도 앞의 표에서 본 OpenAI Responses 쪽인 `https://api.z.ai/api/v1`을 씁니다. 클로드 코드에 쓴 주소를 그대로 옮겨 적으면 동작하지 않습니다.

설치 자체가 처음이라면 [코덱스 CLI 설치 안내](/insights/codex-cli-mac-easy-setup-guide)를 먼저 보고 도구를 올린 뒤에 이 설정을 얹는 순서가 낫습니다.

## 요금제와 사용량 한도

이 방식은 무료가 아닙니다. Z.AI의 GLM Coding Plan을 구독하거나 API를 종량으로 결제해야 합니다. 공식 문서가 밝힌 플랜별 한도는 다음과 같습니다.

| 플랜 | 5시간 크레딧 | 주간 크레딧 |
|---|---|---|
| Lite | 2,000 | 10,000 |
| Pro | 12,000 | 60,000 |
| Max | 28,000 | 140,000 |

Pro는 월 18달러부터 시작한다고 적혀 있습니다. 5시간 크레딧은 쓰고 나서 5시간 뒤에 다시 차고, 주간 크레딧은 일주일마다 초기화됩니다. 모든 플랜이 GLM-5.3과 GLM-5.3-Flash를 지원하며 이전 버전으로 보낸 요청은 최신 모델로 자동 연결됩니다.

## 붙이기 전에 확인할 것

- **되돌릴 방법을 먼저 준비합니다.** 클로드 코드는 앤트로픽 구독으로 쓰던 설정 파일을 그대로 덮어씁니다. 원래대로 돌아가려면 넣었던 값을 지워야 하므로, 고치기 전에 파일을 복사해 두는 편이 안전합니다.
- **도구에 맞는 주소인지 확인합니다.** 클로드 코드는 `api/anthropic`, 코덱스는 `api/v1`입니다. 잘못 넣으면 구독 사용량이 적용되지 않는다고 문서가 경고합니다.
- **어느 모델이 응답하는지 확인합니다.** 문서마다 모델 매핑이 조금씩 다르게 적혀 있어서, 붙인 뒤 실제로 어떤 모델이 답하는지 세션에서 한 번 확인해 두면 나중에 헷갈리지 않습니다.
- **긴 작업을 돌릴 계획이면 대기 시간 값을 함께 넣습니다.** 문서가 제시한 `API_TIMEOUT_MS`는 3,000,000이고 분으로 치면 50분입니다. 기본값으로 두면 오래 걸리는 작업이 중간에 끊길 수 있습니다.

## 앤트로픽 구독을 그대로 두고 둘을 번갈아 쓸 수 있나요?

설정 파일을 바꿔 끼우는 방식으로는 가능하지만 한 번에 하나만 쓰게 됩니다. 클로드 코드는 `~/.claude/settings.json` 하나를 읽으므로, Z.AI 값을 넣어 두면 그 창에서는 GLM 모델이 응답합니다. 앤트로픽 모델로 돌아가려면 넣었던 값을 지우고 새 창을 열어야 합니다. 두 가지를 자주 오갈 계획이라면 설정 파일을 두 벌 만들어 두고 필요할 때 바꿔 넣는 방법이 현실적입니다. 코덱스는 파일이 `~/.codex/config.toml`로 따로 있으니 클로드 코드 설정과 서로 간섭하지 않습니다.

## 로컬에 내려받은 가중치로도 클로드 코드에 붙일 수 있나요?

가능은 하지만 이 글에서 다룬 방법과는 다른 준비가 필요합니다. GLM-5.3-Flash는 MIT 라이선스로 가중치가 공개돼 있어 자기 장비에서 돌릴 수 있고, vLLM이나 SGLang으로 서버를 띄우면 OpenAI 호환 주소가 생깁니다. 다만 클로드 코드는 앤트로픽 형식을 쓰므로 그 사이에 형식을 옮겨 주는 중계가 하나 더 필요합니다. 장비 조건도 만만치 않습니다. 총 파라미터가 3,200억 개라 토큰마다 쓰는 180억 개와 별개로 가중치 전체를 메모리에 올려야 합니다. 양자화한 파일과 실행 도구 지원도 아직 준비 중이라고 적혀 있어서, 결제 없이 쓰고 싶다는 이유만으로 로컬을 고르기에는 확인할 것이 많은 편입니다.

**Sources:**
- [Claude Code에서 GLM Coding Plan 쓰기 (Z.AI 개발자 문서)](https://docs.z.ai/devpack/tool/claude)
- [도구 연동 안내와 엔드포인트 (Z.AI 개발자 문서)](https://docs.z.ai/devpack/tool/others)
- [모델 전환 안내 (Z.AI 개발자 문서)](https://docs.z.ai/devpack/latest-model)
- [GLM Coding Plan 개요와 사용량 (Z.AI 개발자 문서)](https://docs.z.ai/devpack/overview)
