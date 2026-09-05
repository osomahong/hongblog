---
slug: claude-model-family
term: '클로드 모델 패밀리(Opus, Sonnet, Haiku) 비교하기'
definition: >-
  Claude는 단일 모델이 아니라 Fable, Opus, Sonnet, Haiku 등 여러 라인업으로 구성된 모델 패밀리입니다. 작업의
  난이도, 속도, 비용에 따라 다른 모델을 골라 쓰도록 설계되었습니다.
category: CLAUDE_EDUCATION
tags:
  - AI
  - 자동화
publishedAt: '2026-04-27T09:12:00.000Z'
updatedAt: '2026-07-26T00:00:00.000Z'
courseSlug: claude-fundamentals
orderInCourse: 3
aliases:
  - Claude Opus
  - Claude Sonnet
  - Claude Haiku
  - Claude Fable 5
  - Claude Mythos 5
  - Opus 5
  - Opus 4.8
  - Sonnet 5
  - Haiku 4.5
relatedTerms:
  - what-is-claude
  - what-is-anthropic
updateNotice:
  date: 2026-07
  items:
    - >-
      2026년 7월 24일 공개된 Claude Opus 5를 현행 라인업에 반영했습니다. 비교표와 선택 기준의 Opus 4.8을 Opus
      5로 교체했습니다.
    - Opus 4.8을 레거시 모델 목록으로 옮겼습니다. 가격은 Opus 5와 같습니다.
    - Opus 5의 신뢰 가능한 지식 기준일을 2026년 5월로 반영했습니다.
difficulty: BEGINNER
quiz:
  - question: >-
      마케터가 매일 1만 건씩 도착하는 고객 문의를 1차 자동 분류하려고 합니다. 정확도가 적당하기만 하면 되고, 응답이 빠르고 비용이
      낮을수록 좋습니다. 어떤 모델이 가장 적합할까요?
    options:
      - Claude Haiku 4.5
      - Claude Sonnet 5
      - Claude Opus 5
      - Claude Fable 5
    correctIndex: 0
    explanation: >-
      Claude Haiku 4.5는 현행 라인업 중 가장 빠르고 저렴한 모델입니다(2026년 7월 기준 입력 1M 토큰당 1달러, 출력
      1M 토큰당 5달러). 정확도가 일정 수준만 충족되면 되는 대량 자동 분류, 1차 응대처럼 빠른 속도와 낮은 비용이 더 중요한 작업에
      적합합니다. 정가 기준으로 Sonnet 5는 3배, Opus 5는 5배, Fable 5는 10배 더 비싸므로 단순 분류 용도로는
      과합니다.
metaTitle: '클로드 모델 비교 2026: 종류와 차이, 선택 기준'
metaDescription: >-
  일상 업무는 Sonnet 5, 복잡한 작업은 Opus 5, 대량 처리는 Haiku 4.5입니다. 네 라인업의 가격과 속도, 컨텍스트 차이를
  표로 비교하고 직무별  선택 기준을 정리했습니다. 2026년 7월 기준.
ogImage: /og/claude-model-family.png
summary3:
  - 'Claude는 하나가 아니라 최상위 Fable 5와 Opus, Sonnet, Haiku 네 라인업으로 함께 운영되는 모델 패밀리입니다.'
  - >-
    2026년 6월 9일 Claude 5 세대의 Fable 5가 나온 뒤에도 Opus와 Sonnet, Haiku는 그대로 남아 있어서
    라인업을 먼저 고르고 번호는 나중에 봅니다.
  - >-
    Fable 5와 사양이 같은 Mythos 5는 일반 판매용이 아니라 Project Glasswing에 참여하는 승인된 조직만 초대로
    씁니다.
---

이 글은 [앤트로픽](/class/claude-fundamentals/what-is-anthropic)이 운영하는 platform.claude.com/docs의 모델 개요 문서와 공식 발표문을 한국어 입문자가 보기 편하게 정리한 글입니다. 가격, 컨텍스트 같은 수치는 **2026년 7월 기준** 공식 문서를 그대로 옮겼고, 원문 링크는 글 끝 참고 자료에 모았습니다.

## 🤔 Claude 5 등장 이후의 모델 이름 구조

2026년 6월 9일, 앤트로픽이 [Claude](/class/claude-fundamentals/what-is-claude) 5 세대의 첫 모델인 **Claude Fable 5**와 **Claude Mythos 5**를 발표했습니다. "Claude 5가 나왔다는데 그럼 Opus는 이제 못 쓰는 건가?" 하는 혼란이 생기기 쉬운 시점입니다.

답은 단순합니다. **Claude는 여전히 한 모델이 아닙니다**. Opus, Sonnet, Haiku 세 라인업은 그대로 운영되고, 그 위에 최상위 라인업인 Fable 5가 더해졌습니다. 어떤 라인업을 고를지가 먼저고, 모델 번호(Opus 5, Sonnet 5 같은 표기)는 그 라인업 안에서의 세대를 가리킵니다.

## 🔑 Claude는 한 모델이 아닌 패밀리입니다

2026년 7월 기준 Claude 모델 패밀리는 **네 가지 라인업**으로 구성됩니다. 같은 시점에 함께 운영되며, 작업의 난이도, 속도, 비용에 따라 골라 쓰도록 설계되어 있습니다.

| 라인업 | 성격 | 핵심 키워드 |
|---|---|---|
| **Fable 5** | 최상위 성능 | 장시간 에이전트 작업, 최고 난도 |
| **Opus** | 매우 똑똑함 | 복잡한 에이전트형 코딩, 기업 업무 |
| **Sonnet** | 똑똑함과 속도의 균형 | 일상 업무, 대부분의 실무 |
| **Haiku** | 가장 빠름 | 대량 처리, 비용 민감한 작업 |

Opus, Sonnet, Haiku라는 이름은 시(詩)의 형식에서 따왔습니다. Opus는 대작, Sonnet은 14행시, Haiku는 17음절 짧은 시. 새로 더해진 Fable(우화)과 Mythos(신화)는 시가 아니라 이야기 형식에서 온 이름으로 보입니다.

Fable 5와 같은 사양의 **Claude Mythos 5**도 함께 발표되었지만, 이 모델은 일반 사용자용이 아닙니다. 앤트로픽의 Project Glasswing에 참여하는 승인된 조직만 초대 방식으로 쓸 수 있습니다. 아래에서 다시 설명합니다.

## 📊 현행 라인업 한눈에 비교 (2026년 7월 기준)

| 항목 | Claude Fable 5 | Claude Opus 5 | Claude Sonnet 5 | Claude Haiku 4.5 |
|---|---|---|---|---|
| **API 모델 ID** | claude-fable-5 | claude-opus-5 | claude-sonnet-5 | claude-haiku-4-5 |
| **가격(입력)** | $10 / 1M 토큰 | $5 / 1M 토큰 | $3 / 1M 토큰 | $1 / 1M 토큰 |
| **가격(출력)** | $50 / 1M 토큰 | $25 / 1M 토큰 | $15 / 1M 토큰 | $5 / 1M 토큰 |
| **컨텍스트 윈도우** | 1M 토큰 | 1M 토큰 | 1M 토큰 | 200K 토큰 |
| **최대 출력** | 128K 토큰 | 128K 토큰 | 128K 토큰 | 64K 토큰 |
| **상대적 속도** | 느림 | 보통 | 빠름 | 가장 빠름 |
| **신뢰 가능한 지식 기준일** | 2026년 1월 | 2026년 5월 | 2026년 1월 | 2025년 2월 |
| **Adaptive thinking** | 지원(항상 켜짐) | 지원 | 지원 | 미지원 |
| **Extended thinking** | 미지원 | 미지원 | 미지원 | 지원 |

> **참고**: 위 수치는 platform.claude.com/docs 공식 모델 개요 문서를 옮긴 것입니다. Sonnet 5는 2026년 8월 31일까지 입력 $2, 출력 $10의 도입 가격이 적용됩니다. 시점이 지나면 모델 번호와 가격이 모두 달라질 수 있으니, 글 끝 참고 자료의 원문 페이지를 함께 확인하세요. 이전 세대인 Opus 4.8, Opus 4.7, Sonnet 4.6 등은 레거시 모델로 여전히 사용할 수 있습니다.

## 🚀 Fable 5와 Mythos 5, 새로 더해진 최상위 라인업

Claude Fable 5는 앤트로픽이 일반 공급하는 모델 가운데 **가장 성능이 높은 모델**입니다. 공식 문서는 이 모델을 **"Next-generation intelligence for long-running agents"**(장시간 실행되는 에이전트를 위한 차세대 지능)로 소개합니다. 발표문에는 통상 두 달 걸릴 것으로 예상된 코드베이스 이전 작업을 Stripe가 하루 만에 마쳤다는 사례가 실려 있습니다.

두 모델의 차이는 성능이 아니라 **접근 방식과 안전장치**입니다.

- **Fable 5**: 모든 사용자에게 일반 제공됩니다. 사이버 보안, 생물학 등 영역별 안전 분류기가 함께 작동하며, 분류기가 작동한 요청은 거절 대신 Claude Opus 계열 모델이 대신 응답합니다.
- **Mythos 5**: 일반 제공되지 않습니다. Project Glasswing에 참여하는 승인된 사이버 보안 조직, 신뢰 접근 프로그램에 참여하는 생의학 연구자 등 제한된 대상에게 일부 안전장치를 해제한 상태로 제공됩니다. 사양과 가격은 Fable 5와 같습니다.

가격은 입력 $10, 출력 $50으로 Opus 5의 2배입니다. 일상 업무보다는 최고 난도 작업, 오래 도는 에이전트 작업에 맞는 라인업입니다.

## 🎯 Opus 5, 복잡한 실무의 표준 라인업

Claude Opus 5는 2026년 7월 24일 공개된 Opus 라인업의 현행 세대입니다. 공식 문서는 이 모델을 **"For complex agentic coding and enterprise work"**(복잡한 에이전트형 코딩과 기업 업무용)로 소개하며, 어떤 모델을 쓸지 확신이 없을 때 복잡한 코딩과 기업 업무라면 Opus 5로 시작하라고 권합니다. 직전 세대인 Opus 4.8은 같은 가격으로 레거시 목록에 남아 있습니다.

쓰임새가 분명합니다.

- 여러 단계 추론이 필요한 복잡한 문제 해결
- 코드를 직접 수정하고 결과를 확인하며 다음 작업을 이어가는 에이전트형 코딩(Claude Code의 주력 모델)
- 긴 문서 전체를 깊이 있게 분석해야 하는 연구, 기획 작업

가격은 Sonnet 5 정가의 약 1.7배, Haiku의 5배입니다. Fable 5의 절반이기도 합니다.

## ⚖️ Sonnet 5, 균형의 라인업

Claude Sonnet 5는 공식 문서에서 **"The best combination of speed and intelligence"**(속도와 지능의 가장 좋은 조합)으로 소개됩니다. 일상 실무에서 가장 자주 쓰이는 라인업이며, 대부분의 사용자에게는 이 모델이 무난한 출발점입니다.

쓰임새는 다음과 같습니다.

- 보고서, 기획서, 이메일 작성 같은 일상 글쓰기
- 코드 리뷰, 디버깅, 리팩터링
- 회의록 정리, 자료 요약, 외국어 번역

컨텍스트 윈도우는 Fable 5, Opus 5와 같은 1M 토큰입니다. 두꺼운 책 한 권 분량을 통째로 입력해도 잘라 보낼 필요가 없습니다. 2026년 8월 31일까지는 입력 $2, 출력 $10의 도입 가격이 적용되어 정가보다 저렴하게 쓸 수 있습니다.

## ⚡ Haiku 4.5, 가장 빠른 라인업

Claude Haiku 4.5는 공식 문서에서 **"The fastest model with near-frontier intelligence"**(최전선에 가까운 지능을 가진 가장 빠른 모델)로 소개됩니다. 응답 속도와 비용이 우선되는 자리에 적합합니다.

쓰임새는 다음과 같습니다.

- 대량 자동화: 수만 건의 텍스트를 일괄 분류, 태깅
- 실시간 응답이 필요한 챗봇, 도움말 봇
- 사용자 입력의 1차 검증, 라우팅 같은 가벼운 작업

컨텍스트 윈도우는 200K 토큰으로 다른 라인업보다 작지만, 대부분의 짧은 입력 작업에는 충분합니다.

## 💼 직무별 모델 선택 가이드

네 라인업을 자기 자리에서 어떻게 묶어 쓰는지 직무별로 정리하면 다음과 같습니다.

**마케터, 기획자**
- 일상 작업(보고서 초안, 이메일, 회의록 정리)은 **Sonnet** 한 모델로 충분합니다.
- 매일 1만 건 이상 도착하는 광고 리포트나 고객 문의 1차 분류 같은 대량 자동화에는 **Haiku**를 붙입니다.
- 분기별 큰 보고서나 시장 분석 자료처럼 깊이 있는 추론이 필요한 작업만 **Opus**로 보냅니다.

**디자이너, PM**
- Claude Design을 통한 일반 프로토타이핑은 **Sonnet**으로 충분합니다.
- 복잡한 인터랙션, 여러 화면을 묶은 워크플로 설계는 **Opus**로 올려 결과 품질을 높입니다.

**개발자**
- Claude Code 주력 작업(여러 파일 동시 수정, 리팩터링)은 **Opus**가 표준입니다.
- 대규모 코드베이스 이전이나 오래 도는 에이전트 작업처럼 난도가 가장 높은 자리에는 **Fable 5**를 검토합니다.
- 단순 코드 자동완성이나 짧은 함수 생성은 **Haiku**로 내려서 비용과 속도 둘 다 챙깁니다.

매일 Claude를 쓰는 헤비 유저는 한 작업 안에서도 모델을 갈아탑니다. 1차 분류는 Haiku, 본문 작성은 Sonnet, 최종 검토는 Opus로 보내는 식입니다. 이렇게 묶으면 품질을 유지하면서 비용은 절반 이하로 줄일 수 있습니다.

## 🚦 모델 선택 3가지 기준

처음 쓰는 분이 외울 만한 단순한 기준은 다음 세 가지입니다.

**1. 일상 실무는 Sonnet 5로 시작합니다**
- 가격, 속도, 지능의 균형이 가장 좋은 라인업입니다. 2026년 8월 말까지는 도입 가격까지 적용되어 부담이 더 적습니다.

**2. 결과 품질이 부족하다고 느끼면 Opus 5, 그래도 부족하면 Fable 5로 올립니다**
- 앤트로픽 공식 문서도 복잡한 에이전트형 코딩과 기업 업무에는 Opus 5를, 가장 높은 성능이 필요한 작업에는 Fable 5를 권합니다.
- 같은 프롬프트를 상위 모델에 다시 넣어 결과를 비교해 보면 차이를 확인할 수 있습니다.

**3. 비용, 속도가 가장 중요하면 Haiku로 내립니다**
- 대량 처리, 1차 응대, 실시간 응답처럼 정확도가 일정 수준만 되면 되는 자리에는 Haiku가 더 적합합니다.

## 📋 3줄 요약

1. Claude는 하나가 아니라 최상위 Fable 5와 Opus, Sonnet, Haiku 네 라인업으로 함께 운영되는 모델 패밀리입니다.

2. 2026년 6월 9일 Claude 5 세대의 Fable 5가 나온 뒤에도 Opus와 Sonnet, Haiku는 그대로 남아 있어서 라인업을 먼저 고르고 번호는 나중에 봅니다.

3. Fable 5와 사양이 같은 Mythos 5는 일반 판매용이 아니라 Project Glasswing에 참여하는 승인된 조직만 초대로 씁니다.

## 📚 참고 자료

- Claude Fable 5, Mythos 5 공식 발표문: [https://www.anthropic.com/news/claude-fable-5-mythos-5](https://www.anthropic.com/news/claude-fable-5-mythos-5)
- Claude 모델 개요 문서: [https://platform.claude.com/docs/en/about-claude/models/overview](https://platform.claude.com/docs/en/about-claude/models/overview)
- Claude 가격 정책: [https://platform.claude.com/docs/en/about-claude/pricing](https://platform.claude.com/docs/en/about-claude/pricing)
- Opus 5 마이그레이션 가이드: [https://platform.claude.com/docs/en/about-claude/models/migration-guide](https://platform.claude.com/docs/en/about-claude/models/migration-guide)
- 모델 사용 중단 일정: [https://platform.claude.com/docs/en/about-claude/model-deprecations](https://platform.claude.com/docs/en/about-claude/model-deprecations)
