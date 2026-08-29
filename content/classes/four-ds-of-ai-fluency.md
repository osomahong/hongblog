---
slug: four-ds-of-ai-fluency
term: AI Fluency 4D 프레임워크 (Delegation, Description, Discernment, Diligence) 알아보기
metaTitle: 'AI Fluency 4D 프레임워크 뜻과 4단계 정리'
definition: >-
  앤트로픽이 제안하는 AI 활용 행동 프레임워크입니다. 무엇을 맡길지(Delegation), 어떻게 설명할지(Description), 결과를
  어떻게 분별할지(Discernment), 책임감 있게 다룰지(Diligence) 네 단계로 구성됩니다.
category: CLAUDE_EDUCATION
tags:
  - AI
publishedAt: '2026-04-27T09:15:00.000Z'
updatedAt: '2026-07-23T00:00:00.000Z'
courseSlug: claude-fundamentals
orderInCourse: 6
aliases:
  - 4D 프레임워크
  - AI Fluency
  - Delegation Description Discernment Diligence
relatedTerms:
  - what-is-hallucination
  - what-is-sycophancy
  - prompt-engineering-basics
  - responsible-ai-use
difficulty: BEGINNER
quiz:
  - question: AI Fluency 4D 프레임워크에서 AI 답변에 환각, 아부가 있는지 의심하고 검증하는 단계는 어디일까요?
    options:
      - Discernment(분별력)
      - Delegation(위임)
      - Description(설명)
      - Diligence(책임감)
    correctIndex: 0
    explanation: >-
      Discernment(분별력)는 AI가 내놓은 답을 그대로 받지 않고 검증, 의심, 비교하는 단계입니다. 환각이 섞이지 않았는지, 모델
      아부로 흔들린 답은 아닌지를 확인합니다. Delegation은 위임 범위 결정, Description은 명확한 지시,
      Diligence는 사용 전반의 책임감을 다룹니다.
metaDescription: 'AI Fluency 4D는 앤트로픽이 제안하는 AI 활용 행동 프레임워크입니다. Delegation, Description, Discernment, Diligence 네 축의 뜻과 실무 적용을 정리했습니다.'
ogImage: /og/four-ds-of-ai-fluency.png
summary3:
  - 'AI Fluency 4D는 앤트로픽이 제안한 AI 활용 절차이고 위임과 설명, 분별력, 책임감 네 단계로 이뤄집니다.'
  - '설명 단계에서는 누가 읽는지와 무엇을 할지, 어떤 형식으로 낼지, 어디까지 허용할지 네 가지를 담아야 결과가 흔들리지 않습니다.'
  - '분별력 단계에서 환각과 아부를 걸러 내고 책임감 단계에서 저작권과 개인정보, 편향을 마지막으로 점검합니다.'
---

이 글은 앤트로픽이 운영하는 Anthropic Academy의 AI Fluency 트랙 핵심 자료를 한국 입문자가 보기 편하게 정리한 글입니다. 원문 링크는 글 끝 참고 자료에 모았습니다.

## 🤔 AI 잘 쓴다는 게 뭘까요?

AI를 쓰는 사람은 많지만, "잘 쓴다"는 게 뭔지 정확히 설명하기는 어렵습니다. 프롬프트를 길게 쓰는 사람이 잘 쓰는 걸까요. 결과를 그대로 받지 않고 다시 시키는 사람이 잘 쓰는 걸까요.

앤트로픽은 이 질문의 답으로 **AI Fluency 4D 프레임워크**를 제안합니다. AI를 능숙하게 다루는 행동을 네 가지 동사형 단어(D로 시작하는 4개 단어)로 정리한 모델입니다.

## 🔑 4D, 한 줄로 보면

| 단계 | 영문 | 한국어 | 핵심 |
|---|---|---|---|
| **D1** | Delegation | 위임 | 무엇을 AI에게 맡길지 결정 |
| **D2** | Description | 설명 | 맡길 일을 어떻게 설명할지 |
| **D3** | Discernment | 분별력 | 결과를 어떻게 검증할지 |
| **D4** | Diligence | 책임감 | 윤리, 보안, 사실 책임을 어떻게 질지 |

이 네 가지를 차례로 거치면 AI 사용이 흐름이 됩니다. 어느 한 단계라도 빠지면 AI가 만든 답이 그대로 결과물이 되어 버립니다.

## 📥 D1. Delegation, 무엇을 맡길까요?

가장 먼저 결정할 것은 **AI에게 맡길 일과 사람이 직접 할 일을 나누는 것**입니다.

**AI에게 맡기기 좋은 일**
- 정해진 패턴이 있는 작업: 회의록 정리, 외국어 번역, 표 정리
- 초안 작성: 이메일, 보고서, 기획서 1차 초안
- 자료 요약: 긴 문서 핵심 추출

**사람이 직접 해야 하는 일**
- 최종 의사결정 (투자, 채용, 발표)
- 민감 정보가 들어간 작업
- 사실 검증이 절대적으로 중요한 작업

위임 범위가 너무 좁으면 AI 도입 효과가 없고, 너무 넓으면 검증 부담이 폭발합니다.

## ✏️ D2. Description, 어떻게 설명할까요?

같은 일이라도 어떻게 설명하느냐에 따라 결과 품질이 달라집니다. 좋은 설명은 보통 다음 네 가지를 담습니다.

- **누가**: "마케터가 읽을 글이다"
- **무엇을**: "이 PDF 자료를 한국어로 요약해 달라"
- **어떻게**: "결정 사항, 할 일, 미해결 이슈 세 가지로 나눠 정리"
- **어디까지**: "분량은 5줄 이내, 출처가 없는 통계는 빼라"

이 네 가지가 빠진 짧은 지시("요약해 줘")로는 결과 품질을 통제하기 어렵습니다. 자세한 작성법은 다음 클래스 [프롬프트 엔지니어링 기본](/class/claude-fundamentals/prompt-engineering-basics)에서 다룹니다.

## 🔍 D3. Discernment, 결과를 어떻게 분별할까요?

AI 답변을 그대로 받지 않고 검증, 의심하는 단계입니다. 앞서 다룬 두 가지 함정을 다루는 자리이기도 합니다.

- [환각](/class/claude-fundamentals/what-is-hallucination): 출처 없는 사실은 의심하고, 외부 자료로 검증한다
- [모델 아부](/class/claude-fundamentals/what-is-sycophancy): 같은 질문을 반대 입장으로 다시 묻고 일관성을 본다

이 단계가 빠진 사용자는 AI에게서 그럴듯하지만 검증되지 않은 답을 받아 그대로 결과물에 넣게 됩니다.

## 🛡️ D4. Diligence, 책임감 있게 쓰고 있나요?

AI를 일에 쓴다는 것은 그 결과의 책임이 사용자에게 돌아온다는 뜻입니다. Diligence 단계에서는 다음 세 가지를 점검합니다.

- **사실 책임**: AI 답변에 환각이 섞이지 않았는지 최종 확인
- **윤리, 법 책임**: 저작권, 개인정보, 보안 정책에 맞는지
- **공정성 책임**: 특정 집단을 비하하거나 편향된 결론은 없는지

자세한 내용은 [책임감 있는 AI 사용](/class/claude-fundamentals/responsible-ai-use) 클래스에서 별도로 다룹니다.

## 💼 4D를 일상 업무에 적용하는 시나리오

마케터가 매주 광고 리포트 자동 정리를 AI에게 맡긴다고 가정합니다.

- **D1 Delegation**: 데이터 수집, 표 정리는 AI, 결론 코멘트는 사람이 직접
- **D2 Description**: "지난주 캠페인 5개의 CTR, CVR을 표로 정리하고 가장 큰 변화 3개를 짚어 달라"
- **D3 Discernment**: 표의 숫자가 원본 자료와 일치하는지 무작위 3개 셀 검증
- **D4 Diligence**: 보고서에 들어가는 고객 실명, 매출 수치는 별도 검수

이 흐름이 자리 잡으면 AI 사용이 안전하고 일관된 업무 도구가 됩니다.

## 📋 3줄 요약

1. AI Fluency 4D는 앤트로픽이 제안한 AI 활용 절차이고 위임과 설명, 분별력, 책임감 네 단계로 이뤄집니다.

2. 설명 단계에서는 누가 읽는지와 무엇을 할지, 어떤 형식으로 낼지, 어디까지 허용할지 네 가지를 담아야 결과가 흔들리지 않습니다.

3. 분별력 단계에서 환각과 아부를 걸러 내고 책임감 단계에서 저작권과 개인정보, 편향을 마지막으로 점검합니다.

## 📚 참고 자료

- The 4 Ds of AI Fluency (Anthropic Academy): [https://claude.com/resources/tutorials](https://claude.com/resources/tutorials)
- Getting good at Claude: A research-backed curriculum: [https://www.anthropic.com/learn](https://www.anthropic.com/learn)
- AI Fluency newsletter: [https://www.anthropic.com/learn](https://www.anthropic.com/learn)
