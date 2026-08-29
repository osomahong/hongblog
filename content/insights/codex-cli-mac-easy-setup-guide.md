---
slug: codex-cli-mac-easy-setup-guide
title: 쉽게 설치하는 코덱스(Codex) CLI 세팅가이드(맥)
excerpt: >-
  맥(Mac)에 OpenAI 코덱스 CLI(Codex CLI)를 처음 설치하는 분을 위해, 터미널 실행부터 Homebrew, Node.js 사전
  준비, 본체 설치, ChatGPT 로그인, GPT-5.6 모델 선택까지 단순하게 정리했습니다. 클로드 코드(Claude Code)와의 차이도
  마지막에 짧게 짚었습니다.
category: AI_TECH
tags:
  - AI
  - 바이브코딩
  - 자동화
publishedAt: '2026-05-14T10:05:00.000Z'
updatedAt: '2026-08-17T00:00:00.000Z'
highlights:
  - 터미널에서 Homebrew와 Node.js 한 줄씩만 깔면 사전 준비가 끝납니다.
  - >-
    `npm i -g @openai/codex` 한 줄로 코덱스 CLI 본체를 받고, `codex` 명령과 ChatGPT 계정 로그인 한
    번으로 첫 실행 준비가 끝납니다.
  - >-
    기본 모델은 `gpt-5.6-sol`이고 기본 추론 깊이는 `none`입니다. `/model` 명령이나 config.toml에서
    Terra, Luna로 바꿀 수 있습니다.
quiz:
  - question: '맥에서 코덱스 CLI를 설치할 때, Homebrew를 먼저 깔아야 하는 이유는 무엇일까요?'
    options:
      - Node.js와 같은 사전 도구를 한 줄로 받을 수 있는 맥용 패키지 관리자이기 때문이다
      - Homebrew 안에 코덱스 CLI 본체가 들어 있기 때문이다
      - ChatGPT 로그인이 Homebrew 인증을 거치기 때문이다
      - 한국어 설정이 Homebrew 환경에서만 동작하기 때문이다
    correctIndex: 0
    explanation: >-
      맥에는 윈도우의 winget 같은 기본 패키지 관리자가 없습니다. Homebrew를 먼저 설치해야 그 뒤 brew 명령으로
      Node.js를 깔 수 있고, 그 위에 npm으로 코덱스 CLI 본체를 올릴 수 있습니다.
metaTitle: 쉽게 설치하는 코덱스 CLI 세팅가이드(맥)
metaDescription: >-
  맥에 OpenAI 코덱스 CLI를 설치하고 GPT-5.6 모델로 첫 작업을 시작하는 가이드입니다. 2026년 8월 기준으로 확인했으며
  터미널, Homebrew, Node.js, npm 설치, ChatGPT 로그인, 추론 깊이 설정까지 정리했습니다.
ogImage: /og/codex-cli-mac-easy-setup-guide.png
ogTitle: 쉽게 설치하는 코덱스 CLI 세팅가이드(맥)
ogDescription: >-
  터미널 실행부터 Homebrew, Node.js 사전 준비, 코덱스 CLI 본체 설치, ChatGPT 로그인, GPT-5.6 모델과 추론
  깊이 설정까지. 맥 입문자를 위한 코덱스 CLI 설치 가이드입니다.
summary3:
  - '맥에서 코덱스 CLI는 Node.js를 깐 뒤 npm 전역 설치 한 줄로 본체를 받고 ChatGPT 계정으로 로그인하면 준비가 끝납니다.'
  - '기본 모델은 gpt-5.6-sol이고 기본 추론 깊이는 none이라 필요하면 model 명령이나 설정 파일에서 Terra와 Luna로 바꿉니다.'
  - '별도 언어 설정이 없어 안내는 영문으로 나오지만 한국어로 물으면 한국어로 답합니다.'
---

## 터미널 기반 AI 코딩 도구가 표준이 되는 시기

2025년부터 2026년 사이, 코딩을 돕는 AI 도구의 무게중심이 빠르게 바뀌었습니다. Cursor 같은 IDE 안의 자동완성에서 출발해, 이제는 [터미널](/class/vibe-coding-basics/what-is-terminal-cli) 안에서 직접 일을 시키는 에이전트 형태가 표준에 가까워졌습니다. 앤트로픽의 [클로드 코드(Claude Code)](/insights/claude-code-mac-easy-setup-guide)가 그 흐름의 한 축이었다면, OpenAI 진영에서 그에 대응해 정리한 도구가 **코덱스 CLI(Codex CLI)** 입니다.

맥에서 코덱스 CLI를 처음 깔 때 마주치는 화면은 클로드 코드와 마찬가지로 **터미널(Terminal)** 입니다. 평소 Spotlight와 Finder로만 일을 처리해 오신 분이라면 낯설게 느껴지지만, 클릭과 드래그 대신 짧은 한 줄로 컴퓨터에 일을 시키는 방식이라는 점만 다를 뿐입니다. 클로드 코드를 이미 설치한 적이 있다면 Homebrew와 Node.js가 그대로 있어, 코덱스 CLI 설치는 한 줄로 끝납니다.

맥에서 코덱스 CLI는 **설치 자체가 매우 짧습니다**. 사실상 한 줄짜리 [npm](/class/vibe-coding-basics/what-is-npm) 명령이 본체 설치의 전부이고, 그다음은 ChatGPT 계정 로그인뿐입니다. 아래 순서대로 따라가 주세요. Apple Silicon(M1/M2/M3)과 Intel 맥 모두 동일하게 진행됩니다. 설치 도중에 막히는 메시지가 뜬다면 글 끝의 [자주 발생하는 문제](#troubleshooting) 섹션을 확인해 보세요.

> 코덱스 CLI(Codex CLI)는 OpenAI가 만든 터미널 기반 AI 코딩 도구입니다. 맥에서는 Homebrew를 깔고 `brew install node`로 Node.js를 받은 뒤(이미 있다면 건너뛰어도 됩니다), `npm i -g @openai/codex` 한 줄로 본체를 받고, `codex` 명령으로 실행해 ChatGPT 계정으로 로그인하면 첫 실행 준비가 끝납니다. 기본 모델은 `gpt-5.6-sol`이고, 추론 깊이는 none부터 xhigh까지 다섯 단계에서 고를 수 있습니다.

**2026년 8월 17일에 공식 문서와 대조하고 명령을 직접 실행해 다시 확인했습니다.** 확인 시점의 코덱스 CLI 버전은 0.147.0입니다.

이 글은 맥(macOS) 기준입니다. 윈도우 PC를 쓰시는 분은 [윈도우용 가이드](/insights/codex-cli-windows-easy-setup-guide) (윈도우에서 설치하는 방법 바로가기)를 참고하세요.

## Step 1. 터미널 실행

설치 작업은 모두 **터미널(Terminal)** 안에서 합니다. 맥에 기본으로 깔려 있는 도구입니다.

1. 키보드의 `⌘ Command + Space`를 누르세요. (Spotlight 검색)
2. "터미널" 또는 "Terminal"이라고 입력하세요.
3. 엔터를 눌러 터미널을 실행하세요.

✅ 성공 신호: 검은(또는 흰) 창이 열리고 깜빡이는 커서가 나타납니다. 이후 모든 명령어는 이 창에 입력합니다.

## Step 2. Homebrew와 Node.js가 깔려 있는지 확인

코덱스 CLI는 npm 글로벌 패키지로 배포됩니다. 즉 **Node.js가 깔려 있으면 본체 설치는 한 줄로 끝납니다**. 클로드 코드를 이미 설치하신 분이라면 보통은 이 단계가 그대로 통과됩니다.

먼저 확인부터 합니다.

```bash
node -v
```

```bash
npm -v
```

두 명령어 모두 버전 번호가 나오면 Step 3으로 바로 넘어가세요.

만약 "command not found"가 나오면 Homebrew와 Node.js를 차례로 설치합니다. Homebrew가 이미 있다면 `brew install node`부터 진행하시면 됩니다.

Homebrew 설치:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

설치 도중 맥 비밀번호를 입력하라는 메시지가 나오면 비밀번호를 입력하세요. **입력 시 화면에는 아무것도 보이지 않는 것이 정상**입니다. 다 입력한 뒤 엔터를 누르세요.

Node.js 설치:

```bash
brew install node
```

✅ 성공 신호: `node -v`, `npm -v` 모두 버전 번호가 출력되면 사전 준비 완료입니다.

## Step 3. 코덱스 CLI 본체 설치

이제 본체를 설치합니다. 터미널 한 줄이면 끝납니다.

```bash
npm i -g @openai/codex
```

`-g`는 글로벌 설치를 뜻하며, 어느 폴더에서든 `codex` 명령을 부를 수 있게 됩니다. 설치가 끝나면 확인합니다.

```bash
codex --version
```

`codex-cli 0.147.0` 같은 버전 번호가 나오면 정상입니다. 2026년 8월 17일 확인 시점의 최신 버전이 0.147.0이었습니다.

Homebrew를 선호하시는 분이라면 다음 방식도 가능합니다.

```bash
brew install codex
```

같은 날 확인해 보니 Homebrew 쪽도 0.147.0으로 npm과 같은 버전이었습니다. 어느 쪽을 써도 결과가 같고, 이 가이드에서는 npm 쪽을 따라갑니다.

✅ 성공 신호: 버전 번호가 출력되면 본체 설치 완료입니다.

## Step 4. 최초 실행과 ChatGPT 로그인

터미널에 아래 명령어를 입력해 코덱스 CLI를 처음 실행해 보세요.

```bash
codex
```

처음 실행하면 인증 안내가 뜹니다. 기본 옵션은 **ChatGPT 계정으로 로그인**입니다. 화면의 안내를 따라 엔터를 누르면 웹 브라우저가 열리고, OpenAI 계정에 로그인하면 자동으로 코덱스 CLI 창에 인증 정보가 전달됩니다. ChatGPT Plus, Pro, Business, Enterprise 어느 플랜이든 모두 로그인 가능합니다.

API key를 별도로 발급해 사용하는 방식도 있지만, 처음에는 ChatGPT 계정 로그인 쪽이 훨씬 간단합니다.

✅ 성공 신호: 터미널 창에 코덱스 CLI 인터페이스가 떠 있고, 메시지를 입력할 수 있는 상태가 됩니다.

## Step 5. 한국어로 대화하고, 기본 사용 흐름 익히기

코덱스 CLI는 별도의 언어 설정이 없습니다. 기본 영문 안내가 보이지만, **한국어로 질문을 입력하면 한국어로 답변이 옵니다**. 첫 시도로는 다음 정도의 메시지를 던져 보시면 감이 잡힙니다.

```text
이 폴더의 파일 구조를 한국어로 설명해 줘.
```

또는

```text
README.md 파일을 한국어로 다듬어 줘.
```

종료는 클로드 코드와 같습니다. `Ctrl+C`를 두 번 누르거나, `/exit` 명령을 입력하면 됩니다. 다음번에 다시 시작할 때는 터미널을 열고 작업 폴더로 이동한 뒤 `codex`만 입력하면 됩니다.

```bash
cd ~/Projects/my-project
codex
```

✅ 성공 신호: 한국어 질문에 한국어 답변이 정상적으로 돌아오면 설치와 첫 실행이 모두 끝난 것입니다.

## GPT-5.6 모델과 추론 깊이, 한눈에 정리

코덱스 CLI를 설정 없이 실행하면 기본 모델은 **`gpt-5.6-sol`**, 기본 추론 깊이는 **`none`**입니다. 2026년 8월 17일에 사용자 설정을 배제하고 직접 실행해 확인한 값입니다.

GPT-5.6은 [2026년 7월에 나온 3단계 제품군](/insights/gpt-5-6-sol-terra-luna-comparison)입니다. 태양, 지구, 달이라는 이름 그대로 체급이 층을 이룹니다.

| 모델 이름 | 위치 | 어울리는 일 |
|---|---|---|
| `gpt-5.6-sol` | 최상위 | 복잡한 추론, 에이전트 작업, 까다로운 코드 수정 |
| `gpt-5.6-terra` | 균형형 | 문서 요약, 초안 작성, 일반 질의응답 |
| `gpt-5.6-luna` | 경량 | 대량 분류, 데이터 추출, 단순 변환 |

여기에 더해 **추론 깊이(reasoning effort)** 라는 또 하나의 축이 있습니다. 같은 모델이라도 답하기 전에 얼마나 오래 생각할지를 따로 정합니다.

| 옵션 | 의미 |
|---|---|
| `none` | 기본값. 추론을 거의 하지 않아 가장 빠릅니다 |
| `low` | 가볍게 한 번 검토합니다 |
| `medium` | 일반적인 작업에 적합합니다 |
| `high` | 어려운 문제일 때 더 신중하게 처리합니다 |
| `xhigh` | 가장 깊이 생각하고, 시간은 가장 오래 걸립니다 |

`gpt-5.6-sol xhigh` 같은 표현을 보셨다면, 이것은 **모델 이름이 아니라 Sol에 xhigh 추론을 적용한 조합**입니다. 어려운 버그를 잡거나 큰 리팩토링을 부탁할 때 한 번씩 꺼내 쓰는 카드로 이해하시면 됩니다.

모델과 추론 깊이는 코덱스 CLI 안에서 `/model` 명령으로 바꿀 수 있고, 실행할 때 `codex -m gpt-5.6-terra`처럼 지정할 수도 있습니다. 매번 같은 값을 쓰신다면 설정 파일에 적어 두면 됩니다.

```bash
open -e ~/.codex/config.toml
```

파일에 아래 두 줄을 넣고 저장하면 다음 실행부터 기본값이 바뀝니다.

```toml
model = "gpt-5.6-terra"
model_reasoning_effort = "medium"
```

> 코덱스 CLI의 기본 모델은 `gpt-5.6-sol`이고 기본 추론 깊이는 `none`입니다. 모델과 추론 깊이는 별도 축이며, `/model` 명령이나 `config.toml`에서 바꿀 수 있습니다.

## 클로드 코드와 코덱스 CLI의 차이점

처음 두 도구를 비교하시는 분께 가장 정확한 답은 "사실상 거의 같다"입니다. 둘 다 터미널에서 자연어로 일을 시키고, 파일을 직접 읽고 고치고, 명령을 대신 실행해 주는 에이전트 형태의 AI 코딩 도구입니다. 사용감도 매우 비슷합니다.

차이점을 굳이 짚으면 다음 정도입니다.

| 항목 | 클로드 코드 | 코덱스 CLI |
|---|---|---|
| 만든 곳 | 앤트로픽(Anthropic) | OpenAI |
| 백엔드 모델 | Claude (Opus, Sonnet, Haiku, Fable 등) | GPT-5.6 계열 (Sol, Terra, Luna) |
| 로그인 | 앤트로픽 계정 | ChatGPT 계정 또는 API key |
| 설치 명령 | `curl -fsSL https://claude.ai/install.sh \| bash` | `npm i -g @openai/codex` |
| 실행 명령 | `claude` | `codex` |
| 한국어 설정 | `/config`에서 명시적 선택 | 별도 설정 없이 한국어 입력 |
| 스킬, 플러그인 | 앤트로픽 공식 마켓플레이스 | 비교적 단순한 명령 체계 |

즉 두 도구는 같은 카테고리의 비슷한 도구이며, 어느 한쪽만 써야 할 이유는 거의 없습니다. 보통은 **둘 다 깔아 두고 작업 성격에 따라 골라 쓰는 쪽**이 자연스럽습니다. 같은 문제에 두 모델의 답을 한 번씩 받아 보면, AI 도구 활용 감각 자체가 빠르게 좋아집니다.

> 코덱스 CLI와 클로드 코드는 같은 카테고리의 비슷한 도구입니다. 둘 다 깔아 두고 작업 성격에 따라 골라 쓰는 편이 가장 실용적입니다.

## 자주 묻는 질문 (AEO)

> Q. 코덱스 CLI는 맥의 어느 버전부터 설치할 수 있나요?
>
> A. macOS 13.0(Ventura) 이상이라면 Homebrew와 Node.js, 코덱스 CLI 모두 안정적으로 동작합니다. Apple Silicon(M1/M2/M3) 맥과 Intel 맥 모두 같은 명령어로 설치할 수 있습니다.

> Q. 코덱스 CLI를 쓰려면 유료 ChatGPT 구독이 꼭 필요한가요?
>
> A. OpenAI 도움말은 코덱스가 무료 플랜을 포함한 ChatGPT 플랜 전반에서 제공된다고 안내합니다. 다만 플랜에 따라 쓸 수 있는 사용량과 모델 범위가 달라서, GPT-5.6 계열을 넉넉히 쓰려면 Plus 이상이 편합니다. API key를 직접 발급해 사용량 기반으로 쓰는 방법도 있습니다.

> Q. 클로드 코드를 이미 쓰고 있는데, 코덱스 CLI를 같이 깔아도 충돌이 없나요?
>
> A. 충돌이 없습니다. 두 도구는 서로 다른 명령(`claude`와 `codex`)으로 실행되고, 설정 파일도 별도로 보관됩니다. 동일 폴더에서 한쪽을 종료하고 다른 쪽을 띄워 같은 작업을 시켜 보면 두 도구의 응답 차이를 직접 비교해 볼 수 있습니다.

> Q. xhigh 추론 모드는 항상 사용 설정해 두는 게 좋지 않나요?
>
> A. 일반적인 작업에서는 권장하지 않습니다. xhigh는 답하기 전에 가장 깊게 생각하기 때문에 응답 시간이 눈에 띄게 길어지고, 그만큼 비용이나 사용량 한도도 더 빨리 소진됩니다. 어려운 디버깅이나 큰 리팩토링을 부탁할 때만 한 번씩 꺼내 쓰는 편이 효율적입니다.

<a id="troubleshooting"></a>

## 자주 발생하는 문제

무엇이 잘못됐는지 모르겠다면 진단 명령을 먼저 돌려 보세요. 설치 방식, 인증 상태, 실행 환경을 읽기만 하고 알려줍니다.

```bash
codex doctor
```

버전과 설치 경로, ChatGPT 로그인과 API key 가운데 무엇으로 인증돼 있는지까지 한 화면에 나옵니다. 아래 항목들은 이 명령으로도 풀리지 않을 때 확인하세요.

- **"brew: command not found"**: Homebrew 설치 직후 PATH가 반영되지 않은 경우입니다. Apple Silicon 맥(M1/M2/M3)이라면 터미널에 `echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zshrc && source ~/.zshrc`를 입력하세요. Intel 맥은 `/opt/homebrew` 대신 `/usr/local`을 사용합니다.
- **`npm i -g`에서 권한 오류가 납니다**: Homebrew로 설치한 Node.js는 보통 사용자 권한으로 동작합니다. 그래도 EACCES 권한 오류가 보이면 `sudo` 대신 npm의 prefix 설정을 사용자 폴더로 옮기는 편이 안전합니다. `mkdir -p ~/.npm-global && npm config set prefix '~/.npm-global'`을 한 번 적용한 뒤 다시 시도해 보세요.
- **`codex` 명령이 인식되지 않습니다**: 설치 직후 현재 터미널에서는 인식되지 않을 수 있습니다. 터미널을 종료(`⌘ Command + Q`)하고 다시 연 뒤 `codex --version`을 시도해 주세요.
- **ChatGPT 로그인 창이 열리지 않습니다**: 기본 브라우저 설정이 비어 있거나, 회사 네트워크가 외부 OAuth 페이지를 차단하는 경우입니다. 개인 네트워크로 옮겨 본 뒤에도 같은 증상이라면 API key 방식으로 인증을 시도해 보세요.
- **원하는 GPT-5.6 모델이 선택 목록에 보이지 않습니다**: 사용 중인 ChatGPT 플랜에서 아직 열리지 않은 모델일 수 있습니다. 일단 기본 모델로 쓰고 며칠 뒤에 다시 `/model`을 열어 보세요.

## 정리

- 사전 준비: 터미널을 열고 Homebrew, Node.js가 깔려 있는지 확인합니다. 없으면 Homebrew를 깐 뒤 `brew install node` 한 줄을 추가합니다.
- 본체 설치: `npm i -g @openai/codex` 한 줄과 `codex` 실행, ChatGPT 계정 로그인 한 번으로 끝납니다.
- 첫 사용: 한국어로 바로 질문해도 한국어로 답이 옵니다. 기본값(`gpt-5.6-sol`, 추론 깊이 `none`)으로 시작해, 어려운 작업에서만 추론 깊이를 한 단계씩 올려 보시면 됩니다.
- 막혔을 때: `codex doctor`로 설치와 인증 상태를 먼저 확인합니다.
- 클로드 코드와는 본질적으로 같은 카테고리의 도구이므로 둘 다 깔아 두고 작업별로 골라 쓰시면 됩니다. 같은 작업을 두 도구에 시켜 결과를 비교한 기록은 [코덱스 CLI와 클로드 코드 비교](/insights/codex-cli-vs-claude-code)에 정리해 두었습니다.

맥에서는 한 번 깔아 둔 Homebrew와 Node.js가 다른 AI 코딩 CLI를 추가할 때도 그대로 쓰입니다. 이 가이드 다섯 단계까지 마치고 코덱스 CLI와 첫 대화를 한 번 나눠 보신 뒤에, 필요한 확장 설정은 그때그때 골라서 추가하시면 충분합니다.
