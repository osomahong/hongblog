---
slug: gemini-cli-install-guide
title: '제미나이 CLI 개인 계정 무료 종료, 지금 쓸 수 있는 조건과 안티그래비티 CLI 이전 방법'
excerpt: >-
  제미나이 CLI(Gemini CLI)는 구글이 만든 오픈소스 터미널 AI 코딩 에이전트입니다. 2026년 6월 18일부터 개인 구글 계정과
  구글 AI 프로, 울트라의 요청 처리가 중단됐고 지금은 API 키나 기업 라이선스로만 씁니다. 무엇이 끊겼는지, 설치와 사용법은 어떻게
  달라졌는지, 안티그래비티 CLI로 어떻게 옮기는지 정리했습니다.
category: AI_TECH
tags:
  - AI
  - 바이브코딩
  - 자동화
publishedAt: '2026-08-02T00:00:00.000Z'
updatedAt: '2026-09-03T00:00:00.000Z'
highlights:
  - >-
    개인 구글 계정으로 제미나이 CLI를 쓰던 분은 안티그래비티 CLI로 옮깁니다. 설치할 때 기존 설정 폴더를 찾아 스킬과 MCP 서버,
    에이전트를 그대로 가져갑니다.
  - >-
    제미나이 CLI를 계속 써야 하면 인증을 API 키나 기업 라이선스로 바꿉니다. 구글 계정 로그인은 2026년 6월 18일부터 막혔습니다.
quiz:
  - question: 2026년 9월 기준으로 제미나이 CLI를 쓸 수 있는 인증 방식은 무엇일까요?
    options:
      - Gemini API 키 또는 Gemini Code Assist 스탠다드와 엔터프라이즈 라이선스
      - 개인 구글 계정 로그인
      - 구글 AI 프로 구독
      - 구글 AI 울트라 구독
    correctIndex: 0
    explanation: >-
      구글은 2026년 6월 18일부터 개인 계정과 구글 AI 프로, 울트라의 요청 처리를 중단했습니다. 공식 공지에
      API 키 인증과 기업 라이선스는 영향을 받지 않는다고 적혀 있습니다.
metaTitle: 제미나이 CLI 개인 무료 종료와 안티그래비티 CLI 이전 방법 (2026)
metaDescription: >-
  제미나이 CLI는 구글이 만든 오픈소스 터미널 AI 코딩 에이전트입니다. 2026년 6월 18일부터 개인 계정 요청 처리가 중단됐고 지금은
  API 키나 기업 라이선스로만 씁니다. 남은 사용 경로와 안티그래비티 CLI 이전 방법을 정리했습니다.
ogTitle: '제미나이 CLI 개인 계정 무료 종료, 지금 쓸 수 있는 조건'
ogDescription: >-
  개인 구글 계정으로 쓰던 제미나이 CLI가 2026년 6월 18일에 막혔습니다. 지금 남은 인증 경로와 안티그래비티 CLI로 옮기는
  방법을 공식 공지로 확인한 내용입니다.
ogImage: /og/gemini-cli-install-guide.png
summary3:
  - 구글은 2026년 6월 18일부터 개인 구글 계정과 구글 AI 프로, 울트라의 제미나이 CLI 요청 처리를 중단했습니다.
  - Gemini API 키 인증과 Gemini Code Assist 스탠다드, 엔터프라이즈 라이선스는 그대로 쓸 수 있어 프로그램 자체가 없어진 것은 아닙니다.
  - 안티그래비티 CLI는 설치할 때 기존 제미나이 CLI 설정 폴더를 찾아 스킬과 MCP 서버, 에이전트 설정을 옮기고 gemini.md 파일도 그대로 읽습니다.
---

> **2026년 9월 3일 정정.** 이 글은 개인 구글 계정으로 하루 1,000회를 무료로 쓸 수 있다는 전제로 쓰였습니다. 그 전제가 2026년 6월 18일에 사라졌습니다. 구글은 같은 날 공식 저장소 공지에서 개인 계정과 구글 AI 프로, 울트라의 요청 처리를 중단한다고 밝혔습니다. 무료 한도를 다룬 대목을 현재 상태로 고치고, 안티그래비티 CLI로 옮기는 방법을 아래에 넣었습니다.

제미나이 CLI(Gemini CLI)는 구글이 만든 오픈소스 터미널 AI 코딩 에이전트입니다. 터미널에 `gemini`라고 치면 대화창이 열리고, 그 안에서 파일을 읽고 고치고 명령을 실행하는 일까지 맡깁니다. 라이선스는 Apache 2.0이고 저장소는 지금도 갱신되고 있지만, 개인 계정으로 무료로 쓰던 길은 막혔습니다.

터미널에서 AI에게 일을 시키는 도구로는 앤트로픽의 [클로드 코드](/insights/claude-code-mac-easy-setup-guide), OpenAI의 [코덱스 CLI](/insights/codex-cli-mac-easy-setup-guide), 그리고 구글의 제미나이 CLI가 있습니다. 구글 쪽은 2026년 6월부터 [안티그래비티 CLI](/insights/google-antigravity-guide)가 그 역할을 이어받았습니다.

![제미나이 CLI를 처음 실행한 터미널 화면. GEMINI 아스키 로고 아래에 시작 팁 세 줄이 있고, 파이썬 프로그램을 만들어 달라는 요청에 WriteFile 도구로 hello.py를 만든 결과가 표시되어 있으며, 하단에 GEMINI.md 파일 2개와 MCP 서버 2개를 쓰고 있다는 표시가 있는 모습](/images/insights/gemini-cli-install-guide/gemini-cli-terminal-screenshot.png)

> 위 화면은 구글 공식 저장소의 소개 이미지입니다. 하단의 `Using: 2 GEMINI.md files | 2 MCP servers`는 프로젝트 설정 파일과 연결된 도구를 읽고 있다는 표시이고, 응답 위에 뜨는 모델 이름은 계정 등급에 따라 달라집니다.

이 글은 설치와 첫 실행까지를 순서대로 다룹니다. 그다음 2026년 6월에 무엇이 끊겼는지, 안티그래비티 CLI로 어떻게 옮기는지, 다른 두 도구와는 무엇이 다른지 정리합니다. 맥과 윈도우 모두 같은 명령으로 진행됩니다.

## 설치 전에 확인할 한 가지

필요한 사전 준비는 Node.js 하나뿐입니다. 공식 요구 사항은 **Node.js 20 이상**입니다.

[터미널](/class/vibe-coding-basics/what-is-terminal-cli)을 열고 아래를 입력해 보세요.

```bash
node -v
```

`v20.` 이상이 나오면 다음 단계로 넘어가면 됩니다. `command not found`가 뜨면 Node.js가 없는 것이고, 설치 방법은 운영체제별로 다릅니다.

```bash
# 맥: Homebrew로 설치
brew install node

# 윈도우: winget으로 설치
winget install OpenJS.NodeJS.LTS
```

클로드 코드나 코덱스 CLI를 이미 설치한 적이 있다면 Node.js가 그대로 남아 있어서 이 단계는 건너뛰게 됩니다.

## 설치 방법 세 가지

제미나이 CLI는 [npm](/class/vibe-coding-basics/what-is-npm) 패키지로 배포됩니다. 상황에 맞는 것 하나만 고르면 됩니다.

**첫째, 설치 없이 한 번 써 보는 방법입니다.**

```bash
npx @google/gemini-cli
```

내려받아 바로 실행하고 끝냅니다. 계속 쓸지 정하기 전에 화면만 확인하고 싶을 때 적합합니다.

**둘째, 전역 설치입니다. 대부분 이 방법을 씁니다.**

```bash
npm install -g @google/gemini-cli
```

**셋째, 맥과 리눅스에서는 Homebrew로도 받습니다.**

```bash
brew install gemini-cli
```

설치가 끝났는지는 버전 확인으로 알아봅니다.

```bash
gemini --version
```

2026년 8월 기준 안정 버전은 `0.53.1`입니다.

> 제미나이 CLI 설치 명령은 `npm install -g @google/gemini-cli`입니다. 설치 없이 한 번만 실행하려면 `npx @google/gemini-cli`, 맥과 리눅스에서 Homebrew를 쓴다면 `brew install gemini-cli`를 씁니다. 필요한 사전 준비는 Node.js 20 이상뿐입니다.

### 릴리스 채널 세 가지

버전이 자주 올라갑니다. 구글은 세 가지 채널을 나눠 운영합니다.

| 채널 | 주기 | 설치 명령 | 성격 |
|---|---|---|---|
| Stable | 매주 화요일 | `npm install -g @google/gemini-cli@latest` | 검증을 마친 기본 채널 |
| Preview | 매주 화요일 | `npm install -g @google/gemini-cli@preview` | 다음 주 안정판 후보, 회귀 가능성 있음 |
| Nightly | 매일 | `npm install -g @google/gemini-cli@nightly` | main 브랜치 그대로, 검증 전 |

특별한 이유가 없으면 Stable을 쓰면 됩니다. 새 기능을 먼저 보고 싶을 때만 Preview로 옮기고, Nightly는 문제가 생겨도 되는 환경에서만 씁니다.

## 첫 실행과 인증 방식 고르기

설치한 폴더에서 아래를 입력합니다.

```bash
gemini
```

처음 실행하면 테마를 고르고, 그다음 인증 방식을 묻습니다. 선택지는 세 가지입니다.

| 인증 방식 | 2026년 9월 기준 상태 |
|---|---|
| 구글 계정 로그인 | **막혔습니다.** 개인 계정과 구글 AI 프로, 울트라 모두 요청이 처리되지 않습니다 |
| **Gemini API 키** | 유지. `GEMINI_API_KEY` 환경 변수로 지정합니다 |
| Vertex AI | 유지. 회사 구글 클라우드 프로젝트에 붙여 쓰는 방식입니다 |

개인 작업이면 **Gemini API 키**를 고릅니다. 구글 AI 스튜디오에서 키를 받아 환경 변수에 넣으면 됩니다. 무료 등급의 하루 한도는 구글이 문서에 숫자로 공개하지 않고 AI 스튜디오 대시보드에서 확인하라고 안내합니다.

인증이 끝나면 프롬프트 입력창이 뜹니다. 여기서부터는 한국어로 그냥 말하면 됩니다.

```
이 폴더에 뭐가 들어 있는지 정리해 줘
```

## 처음에 익혀 둘 명령 여섯 개

대화창 안에서 `/`로 시작하는 명령을 씁니다. 전체 목록은 `/help`에 있고, 처음에 쓸 만한 것은 이 정도입니다.

| 명령 | 하는 일 |
|---|---|
| `/model` | 쓸 모델을 고릅니다. Auto를 고르면 작업에 맞춰 자동으로 정해집니다 |
| `/init` | 현재 프로젝트를 훑어 `GEMINI.md` 설정 파일을 만듭니다 |
| `/memory` | 프로젝트에 계속 기억시킬 내용을 관리합니다 |
| `/mcp` | 연결된 [MCP](/insights/mcp-easy-guide-for-non-developers) 서버를 확인합니다 |
| `/compress` | 길어진 대화를 요약해 컨텍스트를 비웁니다 |
| `/stats` | 이번 세션에서 쓴 요청 수와 토큰을 봅니다 |

`/init`은 처음 한 번 돌려 두는 편이 좋습니다. 프로젝트 구조와 규칙을 `GEMINI.md`에 적어 두면 이후 대화에서 매번 설명하지 않아도 됩니다. 클로드 코드의 `CLAUDE.md`, 코덱스 CLI의 `AGENTS.md`와 같은 역할입니다.

## 2026년 6월 18일에 끊긴 것과 남은 것

구글은 2026년 6월 18일 공식 저장소에 제미나이 CLI 팀 명의로 공지를 올렸습니다. 그날부터 제미나이 CLI가 구글 AI 프로와 울트라, 무료 개인 계정의 요청을 처리하지 않는다는 내용입니다. 같은 공지에 기업 사용자와 API 키 인증은 영향을 받지 않는다고 적혀 있습니다.

구글의 별도 지원 문서에도 같은 날짜가 나옵니다. 제미나이 코드 어시스트 개인 등급과 구글 AI 프로, 울트라에서 제미나이 CLI와 구글 계정 로그인이 중단됐고, 스탠다드와 엔터프라이즈 구독은 그대로라는 안내입니다.

| 인증 방식 | 2026년 9월 기준 |
|---|---|
| 개인 구글 계정 로그인 | 중단 |
| 구글 AI 프로, 울트라 | 중단 |
| Gemini API 키 | 유지 |
| Gemini Code Assist 스탠다드, 엔터프라이즈 | 유지 |
| Vertex AI | 유지 |

> 제미나이 CLI는 2026년 6월 18일부터 개인 구글 계정과 구글 AI 프로, 울트라의 요청을 처리하지 않습니다. Gemini API 키 인증과 Gemini Code Assist 스탠다드, 엔터프라이즈 라이선스는 그대로 쓸 수 있습니다.

**프로그램이 없어진 것은 아닙니다.** 저장소는 지금도 열려 있고 릴리스가 계속 올라옵니다. 끊긴 것은 구글이 무료로 대주던 요청 처리이지 도구 자체가 아닙니다.

한 가지 주의할 점이 있습니다. **저장소 README에는 아직 개인 계정 하루 1,000회 무료라는 문구가 남아 있습니다.** 공지와 지원 문서가 중단을 밝힌 뒤에도 그 문구가 고쳐지지 않았으므로, README를 근거로 판단하지 않는 편이 안전합니다.

## 안티그래비티 CLI로 옮기는 방법

구글이 안내한 이전 대상은 [안티그래비티 CLI](/insights/google-antigravity-guide)입니다. 명령어는 `agy`이고 설치 명령은 이렇습니다.

```bash
# macOS, Linux
curl -fsSL https://antigravity.google/cli/install.sh | bash

# Windows PowerShell
irm https://antigravity.google/cli/install.ps1 | iex
```

공지에 따르면 설치할 때 컴퓨터에 있는 제미나이 CLI 폴더를 찾아 설정을 옮깁니다.

- **스킬**: 직접 만든 것과 설치한 것이 함께 넘어갑니다
- **MCP 서버**: 등록해 둔 서버가 전부 옮겨집니다
- **에이전트**: 만들어 둔 에이전트 설정이 그대로 유지됩니다
- **메모리 파일**: 기존 `gemini.md` 파일을 그대로 읽습니다

설정을 다시 만들 필요는 없다는 뜻입니다. 다만 무료로 쓸 수 있는 양은 예전 제미나이 CLI 때와 다릅니다. 안티그래비티는 요금제에 따라 할당량이 갈리고, 프로와 울트라가 아닌 사용자는 주 단위로만 다시 채워집니다.

## 모델 선택 방식

제미나이 CLI는 모델을 하나로 고정해 두지 않습니다. `/model`에서 Auto를 고르면 작업 성격에 따라 CLI가 알아서 상위 모델과 경량 모델을 오갑니다. 특정 모델을 지정하고 싶으면 Manual을 고르거나 실행할 때 플래그로 넘깁니다.

```bash
gemini -m <모델 이름>
```

목록에 무엇이 보이는지는 계정 등급과 롤아웃 상태에 따라 다릅니다. 모델 이름이 자주 바뀌는 영역이라, 본인 계정에서 `/model`을 열어 확인하는 것이 문서를 찾는 것보다 빠릅니다.

## 코덱스 CLI, 클로드 코드와의 차이

셋 다 터미널에서 도는 AI 코딩 에이전트이고, 기본 사용법도 비슷합니다. 실제로 달라지는 지점은 네 가지입니다.

| 항목 | 제미나이 CLI | 코덱스 CLI | 클로드 코드 |
|---|---|---|---|
| 만든 곳 | 구글 | OpenAI | 앤트로픽 |
| 개인 무료 경로 | 2026년 6월 종료 | 유료 구독 필요 | 유료 구독 필요 |
| 소스 공개 | Apache 2.0 | 공개 | 비공개 |
| 프로젝트 설정 파일 | `GEMINI.md` | `AGENTS.md` | `CLAUDE.md` |
| 웹 검색 | 구글 검색 그라운딩 내장 | 별도 도구 | 별도 도구 |

제미나이 CLI를 고르던 가장 큰 이유가 **무료로 시작할 수 있다는 점**이었는데, 그 이유가 2026년 6월에 사라졌습니다. 지금은 셋 다 돈을 내야 쓸 수 있고, 구글 쪽에서 무료로 시작하려면 안티그래비티 CLI로 가야 합니다.

구글 검색 그라운딩이 내장된 점도 실무에서는 차이를 만듭니다. 최신 문서를 확인해야 하는 작업에서 별도 설정 없이 검색 결과를 근거로 답하게 시킵니다.

반대로 코드 작업의 완성도만 놓고 보면 클로드 코드 쪽 평가가 아직 앞선다는 의견이 많습니다. 이 부분은 벤치마크마다 결과가 갈려서 하나로 정리하기 어렵습니다.

## 다음 세대 모델 준비 상황

터미널 도구가 바뀌어도 구글의 모델 일정은 따로 돕니다.

구글은 2026년 7월 알파벳 2분기 실적 발표에서 **Gemini 4의 사전 학습을 시작했다고 밝혔습니다.** 순다르 피차이는 이 모델을 이전 세대보다 상당히 큰 기반 모델로 설명했고, 다음 단계의 성능에 도달하려면 더 큰 기반 모델을 학습시켜야 한다는 판단을 근거로 들었습니다. 개선이 필요한 영역으로는 코딩과 에이전트 작업을 함께 언급했습니다.

여기서 조심스럽게 확인해 둘 것이 있습니다. 공개된 것은 **사전 학습을 시작했다는 사실뿐**입니다. 공개 시점, 모델 크기, 컨텍스트 길이, 가격은 발표되지 않았습니다. 사전 학습 이후에도 사후 학습과 안전성 평가, 서빙 최적화가 남아 있어서, 언제 손에 잡힐지는 지금 단정하기 어렵습니다.

다만 방향은 읽힙니다. 구글이 개선 대상으로 코딩과 에이전트 작업을 지목했다는 것은, 다음 모델의 성능 향상이 **제미나이 CLI 같은 터미널 도구에서 가장 먼저 체감될 가능성이 적지 않다**는 뜻으로 보입니다. 채팅창에서 문장을 주고받는 작업보다, 파일을 수정하고 명령을 실행하는 작업이 그 개선의 영향을 크게 받는 쪽이기 때문입니다.

제미나이 CLI는 매주 안정 버전을 냅니다. 모델이 바뀌면 도구를 새로 배울 필요 없이 `npm install -g @google/gemini-cli@latest` 한 줄로 따라갑니다. 지금 설치해 두는 비용이 낮은 이유가 여기에 있습니다.

## 자주 발생하는 문제

설치와 로그인에서 막히는 지점은 구글이 문제 해결 문서로 정리해 두었습니다. 국내 환경에서 특히 자주 걸리는 다섯 가지를 옮깁니다.

### `gemini` 명령을 찾지 못하는 경우

`command not found: gemini`가 뜬다면 설치는 끝났는데 실행 경로가 잡히지 않은 상태입니다. npm 전역 설치 폴더가 PATH에 들어 있는지 확인하고, 터미널을 새로 연 뒤 다시 시도하십시오. 그래도 같으면 아래로 다시 설치합니다.

```bash
npm install -g @google/gemini-cli@latest
```

### 회사 구글 계정으로 로그인이 안 되는 경우

`Failed to sign in. Message: Request contains an invalid argument`가 뜨는 경우입니다. 2026년 6월 18일 이후로는 개인 계정 로그인 자체가 막혀 있어 이 화면을 만나면 계정 문제가 아닐 가능성이 큽니다. [구글 AI 스튜디오](https://aistudio.google.com/app/apikey)에서 API 키를 받아 인증 방식을 바꾸거나, 안티그래비티 CLI로 옮기는 편이 빠릅니다.

### 조직 구독이 필요하다는 메시지가 뜨는 경우

`You must be a named user on your organization's Gemini Code Assist Standard edition subscription`이라는 안내입니다. 원인은 대개 계정이 아니라 환경 변수 쪽에 있습니다. `GOOGLE_CLOUD_PROJECT`나 `GOOGLE_CLOUD_PROJECT_ID`가 설정되어 있으면 CLI가 조직 구독 검사를 겁니다. 개인 계정으로 쓸 생각이라면 `.zshrc`, `.bashrc`, `.env`에서 이 변수를 지우십시오.

### 회사 네트워크에서 인증서 오류가 나는 경우

`UNABLE_TO_GET_ISSUER_CERT_LOCALLY` 또는 `unable to get local issuer certificate`가 떴다면 SSL 트래픽을 검사하는 사내 방화벽이 원인입니다. 운영체제에 이미 깔린 인증서를 Node.js가 쓰도록 지정하면 대개 풀립니다.

```bash
# 맥, 리눅스
export NODE_USE_SYSTEM_CA=1

# 윈도우 파워셸
$env:NODE_USE_SYSTEM_CA=1
```

이래도 같으면 사내 루트 인증서 파일의 절대 경로를 `NODE_EXTRA_CA_CERTS`에 직접 지정합니다.

### 지역이 지원되지 않는다는 메시지가 뜨는 경우

`not currently available in your location`은 접속 지역이 지원 목록에 없을 때 나옵니다. 지원 지역은 구글이 별도 문서로 관리하므로 그쪽에서 현재 상태를 확인하십시오.

## 자주 묻는 질문 (AEO)

**제미나이 CLI는 지금도 무료인가요.**
개인 계정으로는 아닙니다. 2026년 6월 18일부터 개인 구글 계정과 구글 AI 프로, 울트라의 요청이 처리되지 않습니다. Gemini API 키를 넣으면 계속 쓸 수 있고, API 무료 등급의 하루 한도는 구글이 문서에 숫자로 공개하지 않아 AI 스튜디오 대시보드에서 확인해야 합니다.

**설치는 지금도 되나요.**
됩니다. 저장소가 열려 있고 릴리스도 계속 올라옵니다. `npm install -g @google/gemini-cli`로 설치한 뒤 인증만 API 키나 기업 라이선스로 잡으면 동작합니다.

**윈도우에서도 되나요.**
됩니다. 설치 명령이 맥과 같습니다. Node.js 20 이상만 준비되어 있으면 `npm install -g @google/gemini-cli`로 동일하게 진행됩니다.

**클로드 코드를 쓰고 있는데 같이 깔아도 되나요.**
됩니다. 서로 다른 패키지라 충돌하지 않고, 프로젝트 설정 파일도 `GEMINI.md`와 `CLAUDE.md`로 나뉘어 있습니다.

**한국어로 써도 되나요.**
됩니다. 프롬프트를 한국어로 넣으면 한국어로 답합니다. 다만 코드 주석이나 커밋 메시지 형식을 지정하려면 `GEMINI.md`에 규칙으로 적어 두는 편이 안정적입니다.

**설치했는데 `gemini` 명령을 못 찾습니다.**
전역 설치 경로가 PATH에 잡히지 않은 경우입니다. `npm list -g --depth=0`으로 설치 여부를 먼저 확인하고, 터미널을 새로 연 뒤 다시 시도해 보세요.

## Sources

- [Gemini CLI 공식 저장소](https://github.com/google-gemini/gemini-cli)
- [Gemini CLI 설치 문서](https://www.geminicli.com/docs/get-started/installation)
- [Gemini CLI 인증 문서](https://geminicli.com/docs/get-started/authentication)
- [Gemini CLI 할당량과 요금 문서](https://geminicli.com/docs/resources/quota-and-pricing/)
- [Gemini CLI 명령어 레퍼런스](https://github.com/google-gemini/gemini-cli/blob/main/docs/reference/commands.md)
- [Gemini CLI 문제 해결 문서](https://github.com/google-gemini/gemini-cli/blob/main/docs/resources/troubleshooting.md)
- [Google for Developers, Gemini CLI](https://developers.google.com/gemini-code-assist/docs/gemini-cli?hl=ko)
- [Gemini CLI 팀 공지: 개인 계정 요청 처리 중단 (2026-06-18)](https://github.com/google-gemini/gemini-cli/discussions/28017)
- [Google 공식 지원 문서: 개인용 Gemini Code Assist 지원 종료](https://developers.google.com/gemini-code-assist/docs/deprecations/code-assist-individuals)
- [Google 개발자 블로그: 제미나이 CLI에서 안티그래비티 CLI로 전환](https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli/)
