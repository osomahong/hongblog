---
slug: gemini-cli-install-guide
title: '제미나이 CLI 설치와 사용법: 하루 1,000회 무료 한도와 Gemini 4 준비 상황'
excerpt: >-
  제미나이 CLI(Gemini CLI)는 구글이 만든 오픈소스 터미널 AI 코딩 에이전트입니다. 개인 구글 계정으로 로그인하면 하루
  1,000회까지 무료로 쓸 수 있습니다. 설치 세 가지 방법, 첫 실행과 모델 선택, 요금제별 한도, 코덱스 CLI와 클로드 코드의 차이를
  정리했습니다.
category: AI_TECH
tags:
  - AI
  - 바이브코딩
  - 자동화
publishedAt: '2026-08-02T00:00:00.000Z'
updatedAt: '2026-08-24T00:00:00.000Z'
highlights:
  - '`npm install -g @google/gemini-cli` 한 줄이면 설치가 끝나고, 구글 계정 로그인만 하면 바로 씁니다.'
  - '개인 구글 계정 무료 한도는 하루 1,000회입니다. API 키로 붙이면 250회로 줄어듭니다.'
quiz:
  - question: 제미나이 CLI에서 개인 구글 계정으로 로그인하는 방식이 API 키를 넣는 방식보다 유리한 이유는 무엇일까요?
    options:
      - '하루 요청 한도가 1,000회로, API 키 무료 등급의 250회보다 네 배 많기 때문'
      - 구글 계정 로그인에서만 터미널 명령을 실행할 수 있기 때문
      - API 키 방식은 한국어 응답을 지원하지 않기 때문
      - 구글 계정 로그인 쪽이 응답 속도가 빠르기 때문
    correctIndex: 0
    explanation: >-
      공식 문서 기준으로 개인 구글 계정 로그인은 하루 1,000회, 요금을 붙이지 않은 API 키는 하루 250회이고 Flash 모델만
      쓸 수 있습니다. 기능 차이가 아니라 한도 차이라서, 개인 작업이라면 계정 로그인이 먼저입니다.
metaTitle: 제미나이 CLI 설치 방법과 사용법 | 무료 한도와 코덱스 CLI 비교
metaDescription: >-
  제미나이 CLI는 구글이 만든 오픈소스 터미널 AI 코딩 에이전트입니다. npm, npx, Homebrew 세 가지 설치 방법과 구글 계정
  로그인, 하루 1,000회 무료 한도, 모델 선택, 코덱스 CLI와 클로드 코드의 차이를 정리했습니다.
ogTitle: '제미나이 CLI 설치와 사용법: 하루 1,000회 무료 한도까지'
ogDescription: >-
  npm 한 줄로 설치하고 구글 계정으로 로그인하면 끝나는 제미나이 CLI 설치 가이드입니다. 요금제별 한도, 모델 선택, 코덱스 CLI와의
  차이를 함께 정리했습니다.
ogImage: /og/gemini-cli-install-guide.png
---

제미나이 CLI(Gemini CLI)는 구글이 만든 오픈소스 터미널 AI 코딩 에이전트입니다. 터미널에 `gemini`라고 치면 대화창이 열리고, 그 안에서 파일을 읽고 고치고 명령을 실행하는 일까지 맡깁니다. 라이선스는 Apache 2.0이고, 개인 구글 계정으로 로그인하면 하루 1,000회까지 무료입니다.

터미널에서 AI에게 일을 시키는 도구는 이제 세 가지로 정리됐습니다. 앤트로픽의 [클로드 코드](/insights/claude-code-mac-easy-setup-guide), OpenAI의 [코덱스 CLI](/insights/codex-cli-mac-easy-setup-guide), 그리고 구글의 제미나이 CLI입니다. 셋 중 제미나이 CLI는 무료 한도가 가장 넓은 쪽에 속합니다.

![제미나이 CLI를 처음 실행한 터미널 화면. GEMINI 아스키 로고 아래에 시작 팁 세 줄이 있고, 파이썬 프로그램을 만들어 달라는 요청에 WriteFile 도구로 hello.py를 만든 결과가 표시되어 있으며, 하단에 GEMINI.md 파일 2개와 MCP 서버 2개를 쓰고 있다는 표시가 있는 모습](/images/insights/gemini-cli-install-guide/gemini-cli-terminal-screenshot.png)

> 위 화면은 구글 공식 저장소의 소개 이미지입니다. 하단의 `Using: 2 GEMINI.md files | 2 MCP servers`는 프로젝트 설정 파일과 연결된 도구를 읽고 있다는 표시이고, 응답 위에 뜨는 모델 이름은 계정 등급에 따라 달라집니다.

이 글은 설치와 첫 실행까지를 순서대로 다룹니다. 그다음 요금제별 한도, 모델 선택, 다른 두 도구와의 차이, 그리고 구글이 준비 중인 다음 세대 모델까지 정리합니다. 맥과 윈도우 모두 같은 명령으로 진행됩니다.

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

## 첫 실행과 구글 계정 로그인

설치한 폴더에서 아래를 입력합니다.

```bash
gemini
```

처음 실행하면 테마를 고르고, 그다음 인증 방식을 묻습니다. 선택지는 세 가지입니다.

| 인증 방식 | 언제 쓰나 |
|---|---|
| **구글 계정 로그인** | 개인 작업의 기본값. 브라우저가 열리고 계정을 고르면 끝 |
| Gemini API 키 | 스크립트에 넣어 자동 실행할 때. `GEMINI_API_KEY` 환경 변수로 지정 |
| Vertex AI | 회사 구글 클라우드 프로젝트에 붙여 쓸 때 |

개인 작업이라면 **구글 계정 로그인**을 고르십시오. 뒤에서 보겠지만 무료 한도가 API 키 방식보다 네 배 넓습니다.

로그인이 끝나면 프롬프트 입력창이 뜹니다. 여기서부터는 한국어로 그냥 말하면 됩니다.

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

## 요금제별 하루 요청 한도

공식 문서에 정리된 한도입니다. 2026년 8월 기준이고 시점이 지나면 달라집니다.

| 인증 방식 | 하루 요청 한도 | 모델 |
|---|---|---|
| 개인 구글 계정 (무료) | **1,000회** | 제미나이 모델 전반, CLI가 자동 배분 |
| Gemini API 키 (요금 미연결) | 250회 | Flash 계열만 |
| Google AI Pro | 1,500회 | 제미나이 모델 전반 |
| Google AI Ultra | 2,000회 | 제미나이 모델 전반 |
| Vertex AI, 유료 API 키 | 사용량 과금 | 모델과 토큰 사용량에 따름 |

분당 한도는 개인 계정 기준 60회로 걸려 있습니다.

대학생이라면 위 표의 유료 등급을 1년간 무료로 받는 경로를 함께 확인해 볼 만합니다. 구글이 2026년 8월 20일부터 대학생에게 유료 요금제를 1년 무료로 제공하는데, 미국은 Google AI Pro가 대상이고 한국을 포함한 140여 개 시장은 Google AI Plus가 대상입니다. 한국 학생이 받는 것은 AI Plus라서 표에 적힌 AI Pro의 하루 1,500회와는 다릅니다. AI Plus의 CLI 요청 한도는 공식 문서에 따로 적혀 있지 않으므로, 한도를 보고 신청할 계획이라면 결제 전에 현재 문서를 확인해야 합니다.

> 제미나이 CLI의 무료 한도는 개인 구글 계정 기준 하루 1,000회, 분당 60회입니다. 요금을 연결하지 않은 API 키로 붙이면 하루 250회에 Flash 계열 모델만 쓸 수 있습니다.

한도를 다 쓰면 CLI가 알려 주고, 아래 등급 모델로 내려가서 계속할지 물어봅니다. 작업이 중간에 끊기지는 않습니다.

체감 한도가 공식 수치보다 빠르게 소진된다는 이야기가 사용자들 사이에서 나오기도 합니다. 다만 구글이 별도로 조정 내역을 공개한 적은 없어서, 실제 적용 값은 확인하지 못했습니다. 한도가 궁금하면 `/stats`로 이번 세션 사용량을 직접 확인하는 편이 정확합니다.

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
| 무료 한도 | 하루 1,000회 | 유료 구독 필요 | 유료 구독 필요 |
| 소스 공개 | Apache 2.0 | 공개 | 비공개 |
| 프로젝트 설정 파일 | `GEMINI.md` | `AGENTS.md` | `CLAUDE.md` |
| 웹 검색 | 구글 검색 그라운딩 내장 | 별도 도구 | 별도 도구 |

가장 큰 차이는 **무료로 시작할 수 있다는 점**입니다. 클로드 코드와 코덱스 CLI는 각각 클로드와 챗GPT 유료 구독을 요구하는데, 제미나이 CLI는 구글 계정만 있으면 하루 1,000회를 씁니다. 터미널 기반 도구가 처음이라면 여기서 시작해 보고 손에 맞는지 확인하는 방법이 부담이 적습니다.

구글 검색 그라운딩이 내장된 점도 실무에서는 차이를 만듭니다. 최신 문서를 확인해야 하는 작업에서 별도 설정 없이 검색 결과를 근거로 답하게 시킵니다.

반대로 코드 작업의 완성도만 놓고 보면 클로드 코드 쪽 평가가 아직 앞선다는 의견이 많습니다. 이 부분은 벤치마크마다 결과가 갈려서 하나로 정리하기 어렵습니다.

## 다음 세대 모델 준비 상황

지금 제미나이 CLI를 익혀 둘 이유 하나가 모델 쪽 일정에 있습니다.

구글은 2026년 7월 알파벳 2분기 실적 발표에서 **Gemini 4의 사전 학습을 시작했다고 밝혔습니다.** 순다르 피차이는 이 모델을 이전 세대보다 상당히 큰 기반 모델로 설명했고, 다음 단계의 성능에 도달하려면 더 큰 기반 모델을 학습시켜야 한다는 판단을 근거로 들었습니다. 개선이 필요한 영역으로는 코딩과 에이전트 작업을 함께 언급했습니다.

여기서 조심스럽게 짚어 둘 것이 있습니다. 공개된 것은 **사전 학습을 시작했다는 사실뿐**입니다. 공개 시점, 모델 크기, 컨텍스트 길이, 가격은 발표되지 않았습니다. 사전 학습 이후에도 사후 학습과 안전성 평가, 서빙 최적화가 남아 있어서, 언제 손에 잡힐지는 지금 단정하기 어렵습니다.

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

`Failed to sign in. Message: Request contains an invalid argument`가 뜨는 경우입니다. 구글 워크스페이스 계정이나 구글 클라우드에 연결된 계정은 무료 등급 활성화가 막히기도 합니다. 개인 지메일 계정으로 바꿔 로그인하거나, [구글 AI 스튜디오](https://aistudio.google.com/app/apikey)에서 API 키를 받아 그쪽 무료 등급을 쓰는 방법이 있습니다.

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

**제미나이 CLI는 무료인가요.**
개인 구글 계정으로 로그인하면 하루 1,000회, 분당 60회까지 무료입니다. 결제 수단은 등록하지 않아도 무방합니다.

**윈도우에서도 되나요.**
됩니다. 설치 명령이 맥과 같습니다. Node.js 20 이상만 준비되어 있으면 `npm install -g @google/gemini-cli`로 동일하게 진행됩니다.

**클로드 코드를 쓰고 있는데 같이 깔아도 되나요.**
됩니다. 서로 다른 패키지라 충돌하지 않고, 프로젝트 설정 파일도 `GEMINI.md`와 `CLAUDE.md`로 나뉘어 있습니다.

**한국어로 써도 되나요.**
됩니다. 프롬프트를 한국어로 넣으면 한국어로 답합니다. 다만 코드 주석이나 커밋 메시지 형식을 지정하려면 `GEMINI.md`에 규칙으로 적어 두는 편이 안정적입니다.

**설치했는데 `gemini` 명령을 못 찾습니다.**
전역 설치 경로가 PATH에 잡히지 않은 경우입니다. `npm list -g --depth=0`으로 설치 여부를 먼저 확인하고, 터미널을 새로 연 뒤 다시 시도해 보세요.

## 3줄 요약

- 제미나이 CLI는 구글이 만든 오픈소스 터미널 AI 코딩 에이전트입니다. `npm install -g @google/gemini-cli` 한 줄로 설치하고 구글 계정으로 로그인하면 끝납니다.
- 개인 구글 계정 무료 한도는 하루 1,000회, 분당 60회입니다. 클로드 코드와 코덱스 CLI가 유료 구독을 요구하는 것과 달라지는 지점입니다.
- 구글은 Gemini 4의 사전 학습을 시작했다고 밝혔고 코딩과 에이전트 작업을 개선 대상으로 지목했습니다. 공개 시점은 발표되지 않았습니다.

## Sources

- [Gemini CLI 공식 저장소](https://github.com/google-gemini/gemini-cli)
- [Gemini CLI 설치 문서](https://www.geminicli.com/docs/get-started/installation)
- [Gemini CLI 인증 문서](https://geminicli.com/docs/get-started/authentication)
- [Gemini CLI 할당량과 요금 문서](https://geminicli.com/docs/resources/quota-and-pricing/)
- [Gemini CLI 명령어 레퍼런스](https://github.com/google-gemini/gemini-cli/blob/main/docs/reference/commands.md)
- [Gemini CLI 문제 해결 문서](https://github.com/google-gemini/gemini-cli/blob/main/docs/resources/troubleshooting.md)
- [Google for Developers, Gemini CLI](https://developers.google.com/gemini-code-assist/docs/gemini-cli?hl=ko)
