---
slug: gpt-5-6-sol-terra-luna-comparison
title: 'GPT-5.6 Sol, Terra, Luna 모델과 Claude, Gemini 사용법 비교'
excerpt: >-
  GPT-5.6은 OpenAI가 2026년 7월 출시한 3단계 모델 제품군으로, 최상위 Sol, 균형형 Terra, 경량 Luna로
  구성됩니다. 세 모델의 차이와 요금제별 사용 범위, Claude와 Gemini 경쟁 모델과의 가격, 벤치마크 비교를 정리했습니다.
category: AI_TECH
tags:
  - AI
  - API
  - 자동화
publishedAt: '2026-07-31T00:00:00.000Z'
updatedAt: '2026-08-24T00:00:00.000Z'
highlights:
  - '기본값은 Terra로 잡고, 대량 반복 작업은 Luna로, 복잡한 추론과 에이전트 작업만 Sol로 올리는 방식이 비용 효율적입니다.'
  - 순수 코드 품질이 중요한 작업이라면 벤치마크 지표를 기준으로 Claude 계열과 교차 비교 후 선택하세요.
metaTitle: 'GPT-5.6 Sol, Terra, Luna 모델과 Claude, Gemini 사용법 비교 (2026년 7월 기준)'
metaDescription: >-
  GPT-5.6은 OpenAI의 3단계 모델 제품군으로 최상위 Sol, 균형형 Terra, 경량 Luna로 나뉩니다. 세 모델의 차이,
  ChatGPT 요금제별 사용 범위, Claude와 Gemini 대비 가격과 벤치마크를 정리했습니다.
ogTitle: 'GPT-5.6 Sol, Terra, Luna 모델과 Claude, Gemini 사용법 비교'
ogDescription: 'GPT-5.6 세 모델의 역할 차이와 요금제별 사용 범위, Claude와 Gemini 경쟁 모델과의 가격, 벤치마크 비교를 정리했습니다.'
ogImage: /og/gpt-5-6-sol-terra-luna-comparison.png
quiz:
  - question: GPT-5.6 세 모델 가운데 대량 텍스트 분류나 반복 자동화처럼 호출 횟수가 많은 작업에 가장 적합한 모델은 무엇일까요?
    options:
      - 'Luna: 세 모델 중 가장 저렴하고 빨라서 대량 호출 작업에 적합하다'
      - 'Terra: 성능과 비용의 균형이 좋아 모든 작업의 기본값이다'
      - 'Sol: 성능이 가장 높아 어떤 작업이든 가장 효율적이다'
    correctIndex: 0
    explanation: >-
      Luna는 입력 100만 토큰당 0.20달러로 세 모델 중 가장 저렴하고 응답 속도도 가장 빠릅니다. 분류, 추출, 요약처럼
      단순하지만 호출 횟수가 많은 작업일수록 Luna의 비용 우위가 커집니다. Sol은 성능이 가장 높지만 단가가 25배라 대량 호출에는
      비효율적입니다.
---

GPT-5.6은 OpenAI가 2026년 7월 9일 정식 출시한 3단계 AI 모델 제품군입니다. 최고 성능의 Sol(솔), 균형형 Terra(테라), 경량 Luna(루나) 세 모델로 구성됩니다. 태양, 지구, 달이라는 이름 그대로 크기와 역할이 층을 이루는 구조입니다.

출시 3주 만인 7월 30일에는 Luna 가격이 80%, Terra 가격이 20% 인하되면서 세 모델의 위치가 한 번 더 정리되었습니다. 인하 내용은 [GPT-5.6 Luna 가격 인하 글](/insights/gpt-5-6-luna-price-cut)에서 따로 다뤘습니다. 이 글에서는 세 모델의 차이, ChatGPT 요금제별 사용 범위, 그리고 Claude와 Gemini의 경쟁 모델과 견줬을 때의 위치를 정리했습니다.

## GPT-5.6 세 모델은 무엇이 다를까요?

세 모델은 같은 기반에서 크기와 단가를 달리한 형제 모델입니다. 공통 사양부터 확인하면 다음과 같습니다.

- **컨텍스트 윈도**: 세 모델 모두 100만 토큰입니다. 컨텍스트 윈도는 모델이 한 번에 읽고 기억할 수 있는 분량으로, 100만 토큰이면 장편 소설 7~8권을 한 번에 넣을 수 있는 크기입니다.
- **최대 출력**: 12만 8천 토큰입니다.
- **지식 기준일**: 2026년 2월 16일까지의 정보를 학습했습니다.

성능과 단가에서 차이가 납니다. 2026년 7월 30일 인하가 반영된 정가 기준입니다.

| 구분 | Sol | Terra | Luna |
|------|-----|-------|------|
| 위치 | 최상위 | 균형형 | 경량 |
| 입력 (100만 토큰당) | $5.00 | $2.00 | $0.20 |
| 출력 (100만 토큰당) | $30.00 | $12.00 | $1.20 |
| 어울리는 일 | 복잡한 추론, 에이전트 작업, 까다로운 코드 수정 | 문서 요약, 초안 작성, 일반 질의응답 | 대량 분류, 데이터 추출, 단순 변환 |

위 표의 Sol 단가는 그 뒤 한 번 더 내려갔습니다. OpenAI는 2026년 8월 21일부터 11월 21일까지 Sol을 입력 100만 토큰당 $4, 출력 $20으로 한시 인하했고, Terra와 Luna 단가는 그대로 뒀습니다.

OpenAI는 Terra가 이전 세대 GPT-5.5와 비슷한 성능을 절반 가격에 낸다고 설명합니다. 실제로 뒤에서 볼 벤치마크에서도 Terra는 GPT-5.5와 같은 점수대에 있습니다. 그래서 실무 기본값은 Terra로 잡고, 단순 반복 작업은 Luna로 내리고, 어려운 작업만 Sol로 올리는 구조가 자연스럽습니다.

## ChatGPT 요금제에서는 어떤 모델이 열릴까요?

API가 아니라 ChatGPT 앱에서 쓰는 경우, 요금제에 따라 접근 범위가 달라집니다. 한 가지 특이한 점은 채팅 화면에 Sol, Terra, Luna를 직접 고르는 메뉴가 없다는 것입니다. 모델 선택기에서 추론 수준을 고르면 그에 맞는 모델이 배정되는 방식으로 알려져 있습니다.

- **무료, Go 요금제**: 일반 대화의 기본 모델은 GPT-5.5 Instant이고, 대화에서 GPT-5.6 계열을 직접 선택할 수 없는 것으로 전해집니다.
- **Plus 요금제 (월 20달러)**: 추론 수준 미디엄과 하이를 선택할 수 있고, 이 구간부터 Sol이 열립니다.
- **Pro, Business, Enterprise 요금제**: 엑스트라 하이와 프로 수준까지 제공됩니다.

요금제별 세부 기준은 자주 바뀌므로, 결제 전에는 OpenAI 공식 도움말에서 현재 기준을 확인하는 편이 안전합니다.

## Claude, Gemini와 비교하면 어느 쪽이 유리할까요?

모델 비교에는 독립 벤치마크 기관 Artificial Analysis의 집계를 기준으로 사용했습니다. 아래 차트는 여러 시험을 종합한 지능 지수(Intelligence Index)와, 코딩 도구에 물려 실제 개발 작업을 시킨 코딩 에이전트 지수(Coding Agent Index)입니다.

![Artificial Analysis Intelligence Index와 Coding Agent Index 차트. 지능 지수는 Claude Fable 5가 60으로 1위, GPT-5.6 Sol이 59로 2위이고, 코딩 에이전트 지수는 Codex와 GPT-5.6 Sol 조합이 80으로 1위다](/images/insights/gpt-5-6-sol-terra-luna-comparison/aa-intelligence-vs-cost.png)

차트의 핵심 숫자를 정리하면 다음과 같습니다.

- **지능 지수**: Claude Fable 5가 60으로 1위, GPT-5.6 Sol이 59로 2위입니다. 이어서 Claude Opus 4.8이 56, GPT-5.6 Terra가 55, Claude Sonnet 5가 53, GPT-5.6 Luna가 51입니다.
- **코딩 에이전트 지수**: Codex와 GPT-5.6 Sol 조합이 80으로 1위입니다. Terra가 77로 Claude Code와 Fable 5 조합(77)과 같은 점수이고, Luna도 75로 Claude Code와 Opus 4.8 조합(73)보다 높습니다.
- **작업당 비용**: 지능 지수 측정 기준으로 Sol은 작업당 1.04달러입니다. 비슷한 점수대의 Claude Fable 5 대비 약 3분의 1 비용입니다. Terra는 0.55달러, Luna는 0.21달러입니다.

다만 순수 코드 생성 품질을 보는 SWE-bench Pro에서는 Claude Fable 5가 80%로 Sol의 64.6%를 크게 앞선다는 집계도 있습니다. 저장소 수준의 코드 품질이 중요한 작업과, 터미널에서 여러 단계를 수행하는 에이전트형 작업의 승자가 서로 다른 셈입니다.

가격 축에서 각 체급의 경쟁 모델과 나란히 놓으면 다음과 같습니다. 2026년 7월 기준 입력/출력 가격입니다.

| 체급 | GPT-5.6 | Claude | Gemini |
|------|---------|--------|--------|
| 최상위 | Sol $5 / $30 | Opus 5 $5 / $25, Fable 5 $10 / $50 | Gemini 3.1 Pro $2 / $12 |
| 중간 | Terra $2 / $12 | Sonnet 5 $2 / $10 (9월부터 $3 / $15) | Gemini 3.1 Pro $2 / $12 |
| 경량 | Luna $0.20 / $1.20 | Haiku 4.5 $1 / $5 | Gemini 3.6 Flash $1.50 / $7.50 |

체급별로 구도가 다릅니다.

- **최상위 구간**: Sol은 Opus 5와 입력 가격이 같고 출력은 조금 더 비쌉니다. 이 구간은 가격보다 작업 유형이 선택 기준입니다. 지표상 에이전트형 작업은 Sol, 순수 코드 품질은 Claude 계열이 앞서는 구도입니다.
- **중간 구간**: Terra와 Sonnet 5, Gemini 3.1 Pro가 모두 입력 2달러 안팎에 몰려 있어 가장 치열한 구간입니다. Sonnet 5의 프로모션 가격이 8월 말 종료되면 Terra의 가격 우위가 커집니다.
- **경량 구간**: Luna가 Haiku 4.5의 5분의 1, Gemini 3.6 Flash의 7분의 1 수준 입력 가격으로 가장 저렴합니다. 다만 Haiku 4.5는 컨텍스트 윈도가 20만 토큰으로 작고, Gemini 3.6 Flash는 이미지, 영상, 음성 입력을 함께 처리하는 멀티모달이 강점이라 단순 가격만으로 비교하기 어려운 면이 있습니다.

## 어떤 기준으로 선택하면 될까요?

기준을 작업 유형으로 잡으면 선택이 단순해집니다. 마케팅 팀에서 AI 자동화를 운영하는 상황을 예로 들어 정리하면 다음과 같습니다.

- **리뷰 수천 건 감성 분류, 키워드 추출**: Luna가 적합합니다. 입력 100만 토큰당 0.20달러라 호출 횟수가 많을수록 유리하고, 분류 정확도는 이 급 모델로 충분한 경우가 많습니다.
- **보고서 초안, 광고 문구 작성, 회의록 요약**: Terra가 기본값입니다. GPT-5.5급 성능을 절반 가격에 쓰는 위치라 일상 업무 대부분을 감당합니다.
- **여러 데이터를 종합한 캠페인 전략 분석, 멀티스텝 에이전트**: Sol이 어울립니다. 단가가 높으므로 전체 작업이 아니라 이 단계에만 배정합니다.
- **저장소 수준의 코드 작성과 리팩터링**: 벤치마크 지표를 참고해 Claude 계열과 교차 비교 후 선택하는 편이 안전합니다.
- **영상, 음성, 이미지가 섞인 입력 처리**: Gemini 계열이 강점을 가진 영역입니다.

한 가지 유의할 점이 있습니다. 이 글의 가격과 벤치마크는 2026년 7월 기준이고, 이번 달에만 Gemini 3.6 Flash 출시(7월 21일)와 GPT-5.6 가격 인하(7월 30일)가 연달아 있었습니다. 모델 선택을 확정하기 전에는 각 사의 공식 가격 페이지에서 최신 숫자를 확인하는 과정이 필요합니다.

**3줄 요약:**
- GPT-5.6은 최상위 Sol, 균형형 Terra, 경량 Luna의 3단계 제품군이며, 세 모델 모두 100만 토큰 컨텍스트를 제공하고 가격은 25배까지 차이 납니다.
- Artificial Analysis 집계에서 지능 지수는 Claude Fable 5(60)에 이어 Sol(59)이 2위이고, 코딩 에이전트 지수는 Codex와 Sol 조합(80)이 1위입니다.
- 실무에서는 Terra를 기본값으로 두고 대량 작업은 Luna, 복잡한 추론은 Sol로 나누는 방식이 비용 효율적이며, 순수 코드 품질은 Claude 계열과 교차 비교가 필요합니다.

## Sources

- [OpenAI, GPT-5.6 소개 페이지](https://openai.com/index/gpt-5-6/)
- [OpenAI API 가격 페이지](https://platform.openai.com/docs/pricing)
- [OpenAI 도움말, GPT-5.6 in ChatGPT](https://help.openai.com/en/articles/20001325-a-preview-of-gpt-56-sol-terra-and-luna)
- [Artificial Analysis, GPT-5.6 벤치마크 분석](https://artificialanalysis.ai/articles/gpt-5-6-has-landed)
- [Anthropic, Claude 모델 가격](https://claude.com/pricing)
- [Google, Gemini API 가격](https://ai.google.dev/gemini-api/docs/pricing)
