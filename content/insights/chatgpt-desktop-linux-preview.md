---
slug: chatgpt-desktop-linux-preview
title: '챗GPT 리눅스 데스크톱 앱 프리뷰 정리: 설치 패키지와 지원 기능'
excerpt: >-
  챗GPT 리눅스 데스크톱 앱은 오픈AI가 2026년 8월 11일 프리뷰로 공개한 리눅스용 공식 앱으로, ChatGPT와 Work,
  Codex를 하나의 앱에서 쓸 수 있습니다. 설치 패키지 4종과 테스트된 배포판, 요금 조건에서 확인된 것과 아직 확정되지 않은 것을 구분해
  정리했습니다.
category: AI_TECH
tags:
  - AI
  - 자동화
  - 바이브코딩
publishedAt: '2026-08-12T00:00:00.000Z'
highlights:
  - '설치는 openai.com/codex의 x64와 ARM64용 .deb, .rpm 4종 가운데 배포판에 맞는 패키지를 고릅니다.'
  - '프리뷰 단계라 공식 문서가 아직 갱신되지 않았으므로, 요금 조건과 기능 범위는 실제 계정에서 확인한 뒤 팀에 안내합니다.'
metaTitle: '챗GPT 리눅스 앱 프리뷰: 설치 방법과 기능 정리'
metaDescription: >-
  챗GPT 리눅스 데스크톱 앱은 오픈AI가 2026년 8월 11일 프리뷰로 공개한 리눅스용 공식 앱입니다. 설치 패키지 4종, 테스트된
  배포판, ChatGPT와 Work, Codex 통합 구성, 요금 조건에서 확인된 사실을 정리했습니다.
ogDescription: '오픈AI가 리눅스용 챗GPT 데스크톱 앱을 프리뷰로 공개했습니다. 설치 패키지와 배포판, Work와 Codex 통합 구성을 정리했습니다.'
ogImage: /og/chatgpt-desktop-linux-preview.png
quiz:
  - question: 챗GPT 리눅스 데스크톱 앱 발표에서 말하는 "ChatGPT Work"는 무엇일까요?
    options:
      - 브리프나 분석처럼 결과물이 있는 작업을 챗GPT에 맡기는 앱 안의 작업 위임 기능이다
      - 기업용 요금제 ChatGPT Business의 새 이름이다
      - 리눅스 전용으로 새로 만든 업무용 별도 앱이다
      - 유료 구독자만 쓰는 문서 편집기다
    correctIndex: 0
    explanation: >-
      오픈AI 공식 문서는 ChatGPT Work를 실제 업무를 챗GPT에 위임하는 방식으로 정의합니다. 기업용 요금제의 이름은
      Business이고 Work는 요금제가 아니라 기능입니다. 리눅스 앱에서는 상단 토글로 일반 대화(Chat)와 작업 위임(Work)을
      오가는 구성입니다.
summary3:
  - '챗GPT 리눅스 데스크톱 앱은 오픈AI가 2026년 8월 11일 프리뷰로 공개한 리눅스용 공식 앱입니다.'
  - '설치 패키지는 x64와 ARM64용 deb와 rpm 네 종이고 검증된 환경은 우분투 24.04와 26.04 LTS, 데비안 13, 페도라 43과 44입니다.'
  - '앱 안의 Work는 기업용 요금제가 아니라 결과물이 있는 업무를 챗GPT에 맡기는 기능이고 Codex는 코딩 에이전트로 함께 들어 있습니다.'
---

챗GPT 리눅스 데스크톱 앱은 오픈AI가 2026년 8월 11일(현지 기준) 프리뷰로 공개한 리눅스용 공식 앱으로, ChatGPT와 Work, Codex를 하나의 앱에서 쓸 수 있습니다. 오픈AI는 공식 X 게시물에서 "이미 일하고 개발하는 곳에서 프로젝트, 브라우저 워크플로우와 함께 쓰라"고 소개했습니다.

맥과 윈도우에서 데스크톱 앱을 쓰던 분들에게 앱 자체는 익숙할 겁니다. 낯선 것은 조건 쪽입니다. 이번 공개는 정식 출시가 아니라 프리뷰이고, 글을 쓰는 2026년 8월 12일 기준으로 오픈AI 공식 문서에는 아직 리눅스 관련 안내가 없습니다. 발표 문구만 보고 팀에 "리눅스도 다 된다"고 안내하면, 요금 조건이나 기능 범위에서 어긋나는 부분이 생길 수 있습니다.

공식 X 게시물과 개발자 포럼 공지, 공식 문서를 대조해 확인된 것과 아직 확정되지 않은 것을 구분해 정리하겠습니다.

![오픈AI가 공식 X 게시물에 실은 발표 카드. 은하수 배경에 ChatGPT Desktop now on Linux 문구가 표시되어 있다](/images/insights/chatgpt-desktop-linux-preview/openai-announcement-card.jpg)

## 발표의 정확한 형태: X 게시물과 포럼 공지

이번 발표의 1차 출처는 공식 블로그 글이 아니라 오픈AI의 X 게시물과 개발자 포럼 공지입니다. 두 곳의 문구를 합치면 발표 내용은 이렇게 정리됩니다.

- 리눅스용 ChatGPT 데스크톱 앱이 프리뷰로 제공됩니다.
- ChatGPT, Work, Codex를 하나의 네이티브 앱에서 함께 씁니다.
- 프로젝트와 브라우저 워크플로우를 지원 리눅스 시스템에서 쓸 수 있다고 소개합니다.

"프리뷰"라는 표현이 조건의 핵심입니다. 정식 버전이 아니고, 공식 문서(learn.chatgpt.com)의 다운로드 안내는 아직 윈도우와 맥만 언급하고 있는 상태입니다. 문서화가 발표를 따라오지 못한 시점이라, 세부 조건은 앞으로 갱신될 수 있다는 전제로 읽어야 합니다.

## 설치: 패키지 4종과 테스트된 배포판

다운로드는 오픈AI의 Codex 페이지(openai.com/codex)에서 제공되며, 패키지는 네 종류입니다.

| 패키지 | 대상 |
|--------|------|
| x64 .deb | 우분투, 데비안 (인텔, AMD) |
| arm64 .deb | 우분투, 데비안 (ARM) |
| x64 .rpm | 페도라 (인텔, AMD) |
| arm64 .rpm | 페도라 (ARM) |

오픈AI 개발자 포럼 공지 기준으로 테스트된 환경은 우분투 24.04와 26.04 LTS, 데비안 13, 페도라 43과 44입니다. 목록에 없는 배포판에서 막힌다는 뜻이 아니라 검증 범위가 여기까지라는 성격이므로, 목록 밖 환경은 직접 확인이 필요합니다. Flatpak이나 Snap, AppImage는 현재 다운로드 옵션에 없고, 자동 업데이트 방식은 출처마다 서술이 달라 이 글에서는 다루지 않습니다.

## 앱에 담긴 세 가지: ChatGPT, Work, Codex

앱 이름은 ChatGPT지만 안에는 성격이 다른 세 가지가 들어 있습니다. 특히 Work는 이름 때문에 오해가 잦은 부분입니다.

- **ChatGPT**: 익숙한 대화 화면입니다. 관련 대화와 파일, 연결된 소스를 묶는 프로젝트 기능이 함께 제공됩니다.
- **Work**: 기업용 요금제가 아닙니다. 오픈AI 공식 문서 기준으로 Work는 브리프, 분석, 정기 업데이트처럼 결과물이 있는 업무를 챗GPT에 위임하는 기능이고, 앱 상단의 토글로 일반 대화와 오갑니다. 기업용 요금제의 이름은 Business입니다.
- **Codex**: 코딩 에이전트입니다. 앱 좌상단에서 ChatGPT 모드와 나란히 선택하는 구성으로 통합되어 있습니다.

![데비안 13에서 실행 중인 챗GPT 리눅스 앱 화면. 좌상단 드롭다운에 ChatGPT와 Codex 모드가 나란히 열려 있고 상단에 Chat과 Work 토글이 보인다. 출처는 Linuxiac](/images/insights/chatgpt-desktop-linux-preview/app-on-debian.jpg)

위 화면은 리눅스 전문 매체 Linuxiac이 데비안 13에서 촬영한 실제 실행 화면으로, 세 요소가 한 앱에 모인 구성이 그대로 보입니다. 브라우저 워크플로우는 챗GPT가 웹사이트를 열어 정보를 모으고 작업을 수행하는 기능인데, 공식 기능 문서에는 아직 리눅스 표기가 없어 실제 동작 범위는 프리뷰에서 확인이 필요한 부분입니다.

## 요금 조건: 확실한 것 하나와 상충하는 것 하나

프리뷰 시점의 요금 조건은 공식 문서 안에서도 정리가 덜 된 상태라, 확인된 층위만 구분해 두겠습니다.

확실한 것은 브라우저 기능의 조건입니다. 오픈AI 공식 문서는 브라우저 기능을 Free와 Go를 제외한 유료 플랜에서 제공한다고 명시하고 있습니다.

상충하는 것은 앱 자체의 무료 사용 여부입니다. 같은 공식 요금 문서 안에서 도입부는 Work와 Codex가 Free를 포함한 모든 플랜에 포함된다고 적고, 가용성 표의 데스크톱 앱 행은 유료 플랜에만 표시되어 있습니다. 무료 계정에서 앱이 실행된 화면이 매체 보도로 확인되기는 하지만, 문서가 정리되기 전까지는 "무료로 전부 된다"도 "유료 전용이다"도 단정할 수 없습니다. 팀에 안내해야 한다면 실제 계정으로 설치해 확인한 결과를 기준으로 삼는 것이 안전합니다.

## 이 출시가 놓인 자리

이번 프리뷰로 챗GPT 데스크톱 앱은 맥, 윈도우에 이어 주요 데스크톱 운영체제 세 곳을 모두 커버하게 됐습니다. 오픈AI는 언론에 배포한 설명에서 리눅스가 데스크톱 앱에서 가장 많이 요청받은 플랫폼의 하나였다고 밝혔습니다.

리눅스 데스크톱 사용자에 개발자가 많다는 점을 생각하면, 이 앱의 무게 중심이 Codex 쪽에 있다고 보는 해석에 힘이 실립니다. 다운로드가 Codex 페이지에서 제공되고 배포 경로에도 Codex 이름이 남아 있어, 코딩 에이전트를 쓰는 개발 환경으로서의 리눅스를 겨냥한 확장으로 읽을 수 있습니다. 비슷한 시기 앤트로픽의 클로드 데스크톱도 리눅스 베타를 냈다는 보도가 있어, AI 앱들의 리눅스 지원이 넓어지는 추세와도 맞물립니다.

## 무료 계정으로도 쓸 수 있나요?

현재로서는 확정 답이 없습니다. 공식 요금 문서의 서술이 서로 어긋나 있는 상태이고, 확실하게 명시된 것은 브라우저 기능이 Free와 Go 플랜에서 제외된다는 점입니다. 무료 계정으로 설치를 시도해 보는 것 자체는 막혀 있지 않은 것으로 보이나, 어느 기능까지 열리는지는 계정에서 직접 확인하는 것이 현재의 정확한 방법입니다.

## 우분투가 아니면 설치할 수 없나요?

그렇지 않습니다. 공지된 목록(우분투, 데비안, 페도라)은 오픈AI가 테스트했다고 밝힌 환경이고, 다른 배포판을 차단한다는 안내는 없습니다. 다만 .deb와 .rpm 패키지만 제공되므로 다른 패키지 체계를 쓰는 배포판에서는 변환이나 커뮤니티 패키지가 필요할 수 있고, 그 경우 동작은 검증 범위 밖입니다. 프리뷰 단계라는 점까지 감안하면, 주력 작업 환경보다는 시험 환경에서 먼저 써 보는 순서를 권합니다.

**Sources:**
- [ChatGPT 데스크톱 앱 리눅스 프리뷰 발표 (OpenAI 공식 X 게시물)](https://x.com/OpenAI/status/2087231350134980830)
- [Codex in ChatGPT desktop app for Linux is now in preview (OpenAI 개발자 포럼)](https://community.openai.com/t/codex-in-chatgpt-desktop-app-for-linux-is-now-in-preview/1390027)
- [ChatGPT desktop app (OpenAI 공식 문서)](https://learn.chatgpt.com/codex/app)
- [Get started with Work (OpenAI 공식 문서)](https://learn.chatgpt.com/codex/get-started-with-work)
- [Browser (OpenAI 공식 문서)](https://learn.chatgpt.com/docs/browser)
- [Projects (OpenAI 공식 문서)](https://learn.chatgpt.com/docs/projects)
- [Pricing (OpenAI 공식 문서)](https://learn.chatgpt.com/docs/pricing)
- [OpenAI launches ChatGPT desktop app for Linux (TechCrunch)](https://techcrunch.com/2026/08/11/openai-launches-chatgpt-desktop-app-for-linux/)
- [OpenAI Launches Official ChatGPT Desktop App for Linux in Preview (Linuxiac)](https://linuxiac.com/openai-launches-official-chatgpt-desktop-app-for-linux-in-preview/)
