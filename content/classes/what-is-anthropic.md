---
slug: what-is-anthropic
term: 초보자를 위한 Anthropic (앤트로픽) 이해하기
definition: >-
  미국 샌프란시스코에 본사를 둔 AI 안전 연구 회사로, AI 어시스턴트 Claude를 만든 곳입니다. 일반 영리법인이 아닌 Public
  Benefit Corporation 형태로 운영됩니다.
category: CLAUDE_EDUCATION
tags:
  - AI
publishedAt: '2026-04-27T09:11:00.000Z'
courseSlug: claude-fundamentals
orderInCourse: 2
aliases:
  - 앤트로픽
  - 앤트로픽 초보
  - 앤트로픽 입문
  - 앤트로픽이란
  - Anthropic PBC
  - Claude 만든 회사
relatedTerms:
  - what-is-claude
  - claude-model-family
difficulty: BEGINNER
metaTitle: 앤트로픽(Anthropic) 입문 | Claude를 만든 AI 안전 연구 회사, 초보자 가이드
metaDescription: >-
  앤트로픽 처음 알아보는 초보자를 위한 가이드입니다. Claude를 만든 미국 AI 안전 연구 회사 Anthropic의 창립 배경,
  Public Benefit Corporation·LTBT 거버넌스, Constitutional AI까지 정리했습니다.
quiz:
  - question: >-
      앤트로픽이 일반 영리법인이 아닌 Public Benefit Corporation(공익 회사) 형태로 설립된 이유와 가장 가까운 것은
      무엇일까요?
    options:
      - AI 안전 연구라는 장기 목표가 단기 주주 이익에 밀리지 않도록 법적 근거를 두기 위해서다
      - 미국 세법상 세금을 면제받기 위해서다
      - 경쟁사보다 빠르게 모델을 출시하기 위해서다
      - 비공개 회사로 남기 위해서다
    correctIndex: 0
    explanation: >-
      Public Benefit Corporation은 영리 추구와 함께 공익 목적을 정관에 공식적으로 명시할 수 있는 미국의 회사
      형태입니다. 앤트로픽이 이 형태를 택한 이유는 AI 안전 연구라는 장기 목표가 단기 주주 이익보다 우선될 수 있도록 법적 근거를 두기
      위함입니다. 세금 면제나 모델 출시 속도와는 관련이 없습니다.
ogImage: /og/what-is-anthropic.png
---

이 글은 앤트로픽이 운영하는 Anthropic Academy(anthropic.com/learn), claude.com/resources, platform.claude.com/docs의 공식 교육 자료 중 회사 자체에 대한 소개를 한국어 입문자가 보기 편하게 정리한 글입니다. 원문 링크는 글 끝 참고 자료에 모았습니다.

## 🤔 Claude는 알았는데 회사도 알아야 하나요?

Claude를 처음 써 보면 "그래서 이 AI는 누가 만든 거야?"라는 궁금증이 자연스럽게 따라옵니다. AI 도구를 도입할 때, 특히 회사 업무에 쓸 때는 그 도구를 만든 회사가 어떤 곳인지가 곧 신뢰 판단의 기준이 됩니다.

데이터를 어떻게 다루는지, 모델이 갑자기 사라지지는 않을지, 안전하게 쓰도록 설계된 회사인지를 알아두면 도구 선택의 무게가 달라집니다.

## 🔑 Anthropic, 왜 알아야 할까요?

**Anthropic(앤트로픽)**은 미국 샌프란시스코에 본사를 둔 **AI 안전 연구 회사**입니다. 우리가 매일 쓰는 AI 어시스턴트 Claude를 만든 곳이며, 일반 영리법인이 아닌 **Public Benefit Corporation**(공익 회사) 형태로 운영됩니다.

알아야 하는 이유는 단순합니다. 앤트로픽은 AI를 빠르게 만드는 회사이면서, 동시에 그 위험을 측정하고 통제하는 방법을 회사 핵심 미션으로 둡니다. "AI safety as a systematic science"(체계적 과학으로서의 AI 안전성)라는 표현이 공식 문서에 반복되는 회사라는 사실을 알면, Claude가 다른 AI와 답변·정책에서 왜 다르게 움직이는지 이해가 빨라집니다.

## 👥 누가, 언제 만든 회사일까요?

앤트로픽은 2021년 형제 자매인 **다리오 아모데이(Dario Amodei)**와 **다니엘라 아모데이(Daniela Amodei)**가 공동 창립했습니다. 두 사람 모두 OpenAI 출신으로, 다리오는 연구 부문 부사장이었고 다니엘라는 안전·정책 부문을 맡았습니다.

회사 이사회에는 두 공동 창립자 외에 다음 인물이 포함됩니다.

- **Jay Kreps**: Confluent 공동 창립자, Apache Kafka 창시자
- **Reed Hastings**: Netflix 공동 창립자
- **Chris Liddell**: 전 마이크로소프트·제너럴모터스 CFO
- **Vas Narasimhan**: 노바티스 전 CEO

OpenAI 출신이 안전 연구를 더 깊게 하려고 분리해서 만든 회사라는 점이 앤트로픽의 출발점입니다.

## 🏛️ 공익 회사(PBC) + 장기 이익 신탁(LTBT)

앤트로픽은 일반 회사에서 보기 어려운 두 가지 거버넌스 장치를 둡니다.

**1. Public Benefit Corporation (PBC)**
- 미국에서 PBC는 영리 추구와 함께 정관에 명시한 공익 목적을 동시에 추구할 수 있는 회사 형태입니다.
- 일반 주식회사가 주주 이익을 우선해야 하는 것과 달리, PBC는 사회 전체 이익도 의사결정의 공식 기준으로 둘 수 있습니다.
- 앤트로픽이 이 형태를 택한 이유는 AI 안전이라는 장기 목표가 분기 실적에 밀리지 않게 법적 근거를 마련하기 위함입니다.

**2. Long-Term Benefit Trust (LTBT, 장기 이익 신탁)**
- 회사의 장기 의사결정이 인류 전체 이익에 부합하는지 감독하는 별도 신탁 기구입니다.
- 신탁의 신탁인은 다음과 같은 외부 인물로 구성됩니다.
  - **Neil Buddy Shah**: Clinton Health Access Initiative CEO
  - **Richard Fontaine**: Center for a New American Security CEO
  - **Mariano-Florentino Cuéllar**: 카네기 국제평화재단 이사장
- LTBT는 단기 주주 압력이 회사의 장기 미션을 흔들지 못하도록 만든 안전장치입니다.

두 장치 모두 "안전 연구를 회사 핵심으로 두겠다"는 약속을 정관과 신탁 문서로 못 박아둔 결과물입니다.

## 🔒 "AI 안전을 회사 미션으로"의 실제 의미

말로만 안전을 강조하는 회사는 많습니다. 앤트로픽이 다른 점은 안전 연구를 구체적인 정책·문서로 공개한다는 것입니다.

**1. Constitutional AI (헌법적 AI)**
- 모델이 답변을 만들 때 따라야 할 원칙(헌법)을 별도 문서로 정의하고, 그 원칙을 학습 단계에 반영하는 기법입니다.
- 사람이 일일이 답을 검수해서 가르치는 RLHF 방식의 한계를 보완하기 위해 앤트로픽이 제안한 접근입니다.

**2. Responsible Scaling Policy (책임 있는 스케일링 정책)**
- 모델 능력이 일정 단계를 넘을 때마다 거쳐야 하는 안전 점검·완화 조치를 단계별로 명시한 공식 문서입니다.
- "능력이 커질수록 더 엄격한 안전 기준을 통과해야 출시한다"는 약속을 외부에서 검증할 수 있게 공개해둔 정책입니다.

**3. 산업 전체의 안전 경쟁 유도**
- 앤트로픽 공식 가치 중 하나가 "A race to the top on safety"(안전성에서의 경쟁)입니다.
- 우리만 안전하게 하는 게 아니라, 다른 AI 회사도 안전성에서 더 잘하지 않으면 시장에서 불리해지도록 산업 전체 기준을 끌어올린다는 전략입니다.

## 🛠️ Anthropic이 만드는 제품들

앤트로픽 제품 라인업은 다음과 같이 정리됩니다.

- **Claude**: AI 어시스턴트(웹 claude.ai, 데스크톱·모바일 앱)
- **Claude Code**: 터미널 기반 코딩 에이전트
- **Claude Cowork**: 작업 자동화·Dispatch 도구
- **Claude Design**: 디자이너·PM용 프로토타이핑 도구(Anthropic Labs)
- **Claude API / Managed Agents**: 개발자·기업용 API와 에이전트 플랫폼
- **Anthropic Academy**: 일반 사용자·개발자 교육 자료 허브(`anthropic.com/learn`)

회사 조직은 연구·정책·제품·운영 네 영역에 걸쳐 학제 간 팀으로 구성됩니다. 단순 LLM 회사가 아니라 연구·정책 인력이 제품 인력만큼 큰 비중을 차지하는 곳입니다.

## 💼 Anthropic을 알면 무엇이 달라질까요?

회사를 알면 도구 선택과 사용에서 다음 세 가지가 달라집니다.

**1. 도구 신뢰 판단**
- 회사 형태(PBC + LTBT)와 안전 정책(RSP, Constitutional AI)을 알면, 이 회사의 모델·도구를 회사 업무에 도입했을 때 정책 변동·중단 위험이 어떤 수준인지 판단이 됩니다.
- "어느 날 갑자기 모델이 사라지지 않을까", "약관이 바뀌어 데이터가 학습에 쓰이지 않을까" 같은 질문에 사실 기반으로 답할 근거가 생깁니다.

**2. 답변 차이의 이해**
- Claude가 ChatGPT·Gemini와 답변 톤·거절 정책에서 다르게 움직이는 이유가 Constitutional AI 같은 회사 차원의 설계 결정에서 옵니다.
- "Claude는 왜 이 질문에는 답을 안 해주지?"의 답이 모델이 아니라 회사 정책에 있다는 점을 알면, 적합한 도구를 빠르게 고를 수 있습니다.

**3. 정책·뉴스 해석**
- AI 산업 정책 뉴스(미국 행정부 AI 행정명령, EU AI Act, 한국 AI 기본법)에서 앤트로픽이 자주 인용되는 이유를 이해하면, 산업 전체 흐름을 더 정확하게 읽을 수 있습니다.

## 📋 30초 요약

1. **앤트로픽은 미국 샌프란시스코의 AI 안전 연구 회사**입니다. 2021년 OpenAI 출신 다리오·다니엘라 아모데이 남매가 공동 창립했고, AI 어시스턴트 Claude를 만듭니다.

2. **회사 형태는 Public Benefit Corporation**이며, **Long-Term Benefit Trust**라는 별도 신탁이 장기 의사결정을 감독합니다. 둘 다 AI 안전이라는 장기 목표가 단기 수익에 밀리지 않도록 만든 장치입니다.

3. **회사를 알면 도구 신뢰 판단·답변 차이의 이해·정책 뉴스 해석 세 가지가 달라집니다.** 단순 LLM 회사가 아닌 연구·정책 회사로 보면 Claude의 행동이 더 잘 읽힙니다.

## 📚 참고 자료

- 앤트로픽 회사 소개: [https://www.anthropic.com/company](https://www.anthropic.com/company)
- 앤트로픽 핵심 가치: [https://www.anthropic.com/values](https://www.anthropic.com/values)
- Long-Term Benefit Trust 안내: [https://www.anthropic.com/news/the-long-term-benefit-trust](https://www.anthropic.com/news/the-long-term-benefit-trust)
- 책임 있는 스케일링 정책(RSP): [https://www.anthropic.com/news/anthropics-responsible-scaling-policy](https://www.anthropic.com/news/anthropics-responsible-scaling-policy)
- Constitutional AI 연구 논문 소개: [https://www.anthropic.com/research/constitutional-ai-harmlessness-from-ai-feedback](https://www.anthropic.com/research/constitutional-ai-harmlessness-from-ai-feedback)
- Anthropic Academy: [https://www.anthropic.com/learn](https://www.anthropic.com/learn)
