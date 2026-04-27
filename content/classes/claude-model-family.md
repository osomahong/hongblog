---
slug: claude-model-family
term: Claude 모델 패밀리 (Opus·Sonnet·Haiku)
definition: >-
  Claude는 단일 모델이 아니라 Opus·Sonnet·Haiku 세 라인업으로 구성된 모델 패밀리입니다. 작업의 난이도·속도·비용에 따라
  다른 모델을 골라 쓰도록 설계되었습니다.
category: CLAUDE_EDUCATION
tags:
  - AI
  - 자동화
publishedAt: '2026-04-27T09:12:00.000Z'
courseSlug: claude-fundamentals
orderInCourse: 3
aliases:
  - Claude Opus
  - Claude Sonnet
  - Claude Haiku
  - Opus 4.7
  - Sonnet 4.6
  - Haiku 4.5
difficulty: BEGINNER
quiz:
  - question: >-
      마케터가 매일 1만 건씩 도착하는 고객 문의를 1차 자동 분류하려고 합니다. 정확도가 적당하기만 하면 되고, 응답이 빠르고 비용이
      낮을수록 좋습니다. 어떤 모델이 가장 적합할까요?
    options:
      - Claude Haiku 4.5
      - Claude Sonnet 4.6
      - Claude Opus 4.7
      - Claude Opus 4.5 (레거시)
    correctIndex: 0
    explanation: >-
      Claude Haiku 4.5는 세 라인업 중 가장 빠르고 저렴한 모델입니다(입력 1M 토큰당 1달러, 출력 1M 토큰당 5달러).
      정확도가 일정 수준만 충족되면 되는 대량 자동 분류·1차 응대처럼 빠른 속도와 낮은 비용이 더 중요한 작업에 적합합니다. Opus는
      비용이 5배, Sonnet도 3배 더 비싸므로 단순 분류 용도로는 과합니다.
  - question: >-
      Claude Opus 4.7과 Sonnet 4.6의 컨텍스트 윈도우(한 번에 처리할 수 있는 입력 길이)는 모두 동일하게 '1M
      tokens'입니다. 이 1M tokens는 한국어 기준 대략 어느 정도 분량일까요?
    options:
      - 책 한 권 분량
      - 단편 소설 한 편 분량
      - 트윗 100개 분량
      - 이메일 한 통 분량
    correctIndex: 0
    explanation: >-
      Claude 공식 문서에 따르면 1M tokens는 영어 기준 약 75만 단어, 약 340만 유니코드 글자에 해당합니다. 한국어로
      환산하면 평균 분량의 단행본 한 권에서 두 권 사이입니다. 즉 두꺼운 책 한 권을 통째로 넣고 분석을 시킬 수 있는 규모입니다.
ogImage: /og/claude-model-family.png
---

이 글은 앤트로픽이 운영하는 platform.claude.com/docs의 모델 개요 문서를 한국어 입문자가 한눈에 따라갈 수 있도록 정리한 것입니다. 가격·컨텍스트 같은 수치는 2026년 4월 기준 공식 문서를 그대로 옮겼고, 원문 링크는 글 끝 참고 자료에 모았습니다.

## Claude는 한 모델이 아닙니다

처음 Claude를 쓰는 사람들이 자주 헷갈리는 지점이 하나 있습니다. **"Claude 4가 최신이라던데, 그게 한 모델인가요?"**

답은 아닙니다. **Claude는 모델 패밀리**입니다. 같은 시점에 세 가지 라인업이 함께 운영되며, 작업의 난이도·속도·비용에 따라 골라 쓰도록 설계되어 있습니다.

| 라인업 | 성격 | 핵심 키워드 |
|---|---|---|
| **Opus** | 가장 똑똑함 | 복잡한 추론, 에이전트형 코딩 |
| **Sonnet** | 똑똑함과 속도의 균형 | 일상 업무, 대부분의 실무 |
| **Haiku** | 가장 빠름 | 대량 처리, 비용 민감한 작업 |

## 현행 라인업 비교 (2026년 4월 기준)

| 항목 | Claude Opus 4.7 | Claude Sonnet 4.6 | Claude Haiku 4.5 |
|---|---|---|---|
| **API 모델 ID** | claude-opus-4-7 | claude-sonnet-4-6 | claude-haiku-4-5 |
| **가격(입력)** | $5 / 1M 토큰 | $3 / 1M 토큰 | $1 / 1M 토큰 |
| **가격(출력)** | $25 / 1M 토큰 | $15 / 1M 토큰 | $5 / 1M 토큰 |
| **컨텍스트 윈도우** | 1M 토큰 | 1M 토큰 | 200K 토큰 |
| **최대 출력** | 128K 토큰 | 64K 토큰 | 64K 토큰 |
| **상대적 속도** | 보통 | 빠름 | 가장 빠름 |
| **신뢰 가능한 지식 기준일** | 2026년 1월 | 2025년 8월 | 2025년 2월 |
| **Adaptive thinking** | 지원 | 지원 | 미지원 |
| **Extended thinking** | 미지원 | 지원 | 지원 |

## Opus 4.7 — 가장 똑똑한 라인업

Claude Opus 4.7은 앤트로픽이 현시점 일반 공급 중인 모델 가운데 **가장 강력한 추론 능력**을 가진 모델입니다. 공식 문서는 이 모델을 **"step-change improvement in agentic coding"**(에이전트형 코딩에서의 계단식 도약)으로 표현합니다.

쓰임새가 분명합니다.
- 여러 단계 추론이 필요한 복잡한 문제 해결
- 코드를 직접 수정하고 결과를 확인하며 다음 작업을 이어가는 에이전트형 코딩
- 긴 문서 전체를 깊이 있게 분석해야 하는 연구·기획 작업

가격은 그만큼 높습니다. Sonnet의 약 1.7배, Haiku의 5배입니다.

## Sonnet 4.6 — 균형의 모델

Claude Sonnet 4.6은 **"the best combination of speed and intelligence"**(속도와 지능의 가장 좋은 조합)으로 소개됩니다. 일상 실무에서 가장 자주 쓰이는 라인업이며, 대부분의 사용자에게는 이 모델이 표준 선택지입니다.

쓰임새는 다음과 같습니다.
- 보고서·기획서·이메일 작성 같은 일상 글쓰기
- 코드 리뷰·디버깅·리팩터링
- 회의록 정리·자료 요약·외국어 번역
- Extended thinking과 Adaptive thinking을 모두 지원해 복잡한 작업도 어느 정도 처리

컨텍스트 윈도우는 Opus와 같은 1M 토큰입니다. 즉 두꺼운 책 한 권을 통째로 입력해도 문제없이 처리합니다.

## Haiku 4.5 — 빠르고 저렴한 라인업

Claude Haiku 4.5는 **"the fastest model with near-frontier intelligence"**(최전선에 가까운 지능을 가진 가장 빠른 모델)로 소개됩니다. 응답 속도와 비용이 우선되는 자리에 적합합니다.

쓰임새는 다음과 같습니다.
- 대량 자동화 — 수만 건의 텍스트를 일괄 분류·태깅
- 실시간 응답이 필요한 챗봇·도움말 봇
- 사용자 입력의 1차 검증·라우팅 같은 가벼운 작업

컨텍스트 윈도우는 200K 토큰으로 다른 두 라인업보다 작지만, 대부분의 짧은 입력 작업에는 충분합니다.

## 모델 선택 기준

처음 쓰는 사람이 외울 만한 단순한 기준은 다음 세 가지입니다.

**1. 잘 모르겠으면 Sonnet으로 시작합니다.**
앤트로픽 공식 문서도 같은 권고를 합니다. 가격·속도·지능의 균형이 가장 좋아 표준 선택지로 검증된 라인업입니다.

**2. 결과 품질이 가장 중요하면 Opus로 올립니다.**
Sonnet의 결과가 충분하지 않다고 느낄 때, 같은 프롬프트를 Opus에 다시 넣어 비교합니다. 비용이 1.7배지만 추론이 깊어집니다.

**3. 비용·속도가 가장 중요하면 Haiku로 내립니다.**
대량 처리, 1차 응대, 실시간 응답처럼 정확도가 일정 수준만 되면 되는 자리에는 Haiku가 더 적합합니다.

## 헤비 유저와 처음 쓰는 사람의 모델 선택

매일 Claude를 쓰는 헤비 유저는 한 작업 안에서도 모델을 갈아탑니다. 1차 분류는 Haiku, 본문 작성은 Sonnet, 최종 검토는 Opus로 보내는 식입니다. 이렇게 하면 품질을 유지하면서 비용은 절반 이하로 줄일 수 있습니다.

처음 쓰는 사람은 다릅니다. claude.ai 웹에서 기본 모델 하나만 쓰며 깊이 들어가지 않습니다. 이것도 충분히 좋은 출발점입니다. 앞에서 말했듯 **"잘 모르겠으면 Sonnet으로 시작"**이 공식 권고이기도 합니다.

각자의 속도로 익히면 됩니다. Opus·Sonnet·Haiku를 매번 다 쓸 필요는 없습니다.

## 30초 요약

1. **Claude는 단일 모델이 아니라 Opus·Sonnet·Haiku 세 라인업의 모델 패밀리**입니다. 같은 시점에 함께 운영되며, 작업의 난이도·속도·비용에 따라 골라 씁니다.

2. **Opus는 가장 똑똑함, Sonnet은 균형, Haiku는 가장 빠름**으로 기억하면 됩니다. 가격은 Opus($5/$25) > Sonnet($3/$15) > Haiku($1/$5) 순입니다(1M 토큰 기준 입력/출력).

3. **잘 모르겠으면 Sonnet으로 시작**하라는 게 앤트로픽 공식 권고입니다. 결과가 부족하면 Opus로 올리고, 비용·속도가 우선되는 작업은 Haiku로 내려도 됩니다.

## 참고 자료

- Claude 모델 개요 문서 — [https://platform.claude.com/docs/en/about-claude/models/overview](https://platform.claude.com/docs/en/about-claude/models/overview)
- Claude 가격 정책 — [https://platform.claude.com/docs/en/about-claude/pricing](https://platform.claude.com/docs/en/about-claude/pricing)
- Opus 4.7 마이그레이션 가이드 — [https://platform.claude.com/docs/en/about-claude/models/migration-guide](https://platform.claude.com/docs/en/about-claude/models/migration-guide)
- 모델 사용 중단 일정 — [https://platform.claude.com/docs/en/about-claude/model-deprecations](https://platform.claude.com/docs/en/about-claude/model-deprecations)
