---
slug: what-is-extended-thinking
term: Extended Thinking (확장 추론 모드) 알아보기
definition: >-
  Claude가 최종 답을 내기 전에 내부 추론 단계를 별도 블록으로 펼쳐 깊게 생각하는 모드입니다. 복잡한 분석, 다단계 추론, 코드 작성에서
  결과 품질을 끌어올리는 데 쓰입니다.
category: CLAUDE_EDUCATION
tags:
  - AI
  - 자동화
publishedAt: '2026-04-27T09:24:00.000Z'
updatedAt: '2026-07-26T00:00:00.000Z'
courseSlug: claude-in-practice
orderInCourse: 5
aliases:
  - Adaptive Thinking
  - thinking 블록
  - 확장 추론
relatedTerms:
  - claude-model-family
  - what-are-claude-projects
updateNotice:
  date: '2026-07'
  items:
    - 모델별 지원 표를 현행 세대인 Fable 5, Opus 5, Sonnet 5, Haiku 4.5로 교체했습니다.
    - 현행 세대에서 Extended Thinking을 지원하는 모델이 Haiku 4.5뿐이라는 내용으로 수정했습니다. 이전에는 Sonnet 4.6도 지원 모델로 적혀 있었습니다.
difficulty: BEGINNER
quiz:
  - question: Extended Thinking이 가장 큰 효과를 내는 작업 유형은 무엇일까요?
    options:
      - 여러 단계 추론과 검토가 필요한 복잡한 분석, 코드 작업
      - 단순 사실 답변
      - 1줄 번역
      - 안부 인사
    correctIndex: 0
    explanation: >-
      Extended Thinking은 Claude가 최종 답을 내기 전에 내부 추론 블록을 별도로 펼쳐 깊게 생각하도록 하는 모드입니다.
      여러 단계 추론, 검토가 필요한 복잡한 분석, 다중 파일 코드 작업, 긴 자료 분석 같은 작업에서 결과 품질을 끌어올립니다. 단순 사실
      답변이나 한 줄 번역에는 일반 응답으로 충분합니다.
metaTitle: '클로드 확장 추론(Extended Thinking) 뜻과 작동 방식'
metaDescription: '확장 추론(Extended Thinking)은 Claude가 답하기 전에 내부 추론을 별도 블록으로 펼쳐 깊게 생각하는 모드입니다. 작동 방식과 잘 맞는 작업 유형을 정리했습니다.'
ogImage: /og/what-is-extended-thinking.png
summary3:
  - 'Extended Thinking은 Claude가 최종 답을 내기 전에 내부 추론 단계를 따로 펼쳐 깊게 생각하는 모드입니다.'
  - '추론 깊이를 사용자가 직접 정하는 Extended Thinking과 모델이 난이도에 맞춰 조절하는 Adaptive Thinking으로 나뉩니다.'
  - '2026년 7월 기준 Extended Thinking을 쓸 수 있는 모델은 Haiku 4.5뿐이고 Fable 5와 Opus 5, Sonnet 5는 Adaptive 방식만 지원합니다.'
---

이 글은 앤트로픽이 운영하는 platform.claude.com/docs의 Extended Thinking 자료를 한국 입문자가 보기 편하게 정리한 글입니다.

## 🤔 같은 모델인데 답이 더 좋아질 수 있나요?

Claude 같은 모델에 같은 질문을 던졌는데 어떤 날은 답이 깊고, 어떤 날은 표면적인 답만 나옵니다. 모델은 같은데 결과가 다릅니다.

답을 만들기 전에 **내부 추론 단계를 길게 거치도록 설정**할 수 있다면 결과가 안정적으로 깊어집니다. 이게 Extended Thinking이 다루는 자리입니다.

## 🔑 Extended Thinking, 무엇일까요?

**Extended Thinking**은 Claude가 최종 답을 내기 전에 내부 추론 단계를 **별도 thinking 블록**으로 펼쳐 깊게 생각하는 모드입니다.

공식 문서는 이 기능을 다음과 같이 설명합니다.

> "Extended thinking gives Claude enhanced reasoning capabilities for complex tasks by creating thinking content blocks where it outputs internal reasoning before delivering the final answer."

일반 모드에서는 모델이 답을 한 번에 만들어 내놓습니다. Extended Thinking 모드에서는 답을 만들기 전에 내부 추론을 한 단계 더 거칩니다. 사용자에게 보이는 답에는 큰 차이가 없는 듯해도, 답의 일관성, 정확도, 깊이가 분명히 달라집니다.

## 🌐 어떤 모델에서 동작하나요?

(2026년 7월 기준) 모델별 지원 상황은 다음과 같습니다.

| 모델 | Adaptive Thinking | Extended Thinking |
|---|---|---|
| **Claude Fable 5** | 지원 (항상 켜짐) | 미지원 |
| **Claude Opus 5** | 지원 (권장) | 미지원 |
| **Claude Sonnet 5** | 지원 (권장) | 미지원 |
| **Claude Haiku 4.5** | 미지원 | 지원 |

**Adaptive Thinking**과 **Extended Thinking**은 사촌 관계입니다.

- **Extended Thinking**: 사용자가 추론 깊이(`budget_tokens`)를 직접 정하는 수동 모드
- **Adaptive Thinking**: Claude가 작업 난이도에 맞춰 추론 깊이를 자동 조절하는 모드

현행 세대에서는 Extended Thinking을 쓸 수 있는 모델이 Haiku 4.5뿐입니다. Fable 5, Opus 5, Sonnet 5는 Adaptive 방식만 지원하고, Fable 5는 끄고 켜는 선택 없이 항상 켜진 상태로 동작합니다. Sonnet 4.6 같은 이전 세대 모델에서는 두 방식을 모두 쓸 수 있었습니다.

## ⚙️ 동작 방식

API 응답을 보면 다음 형태로 결과가 옵니다.

```json
{
  "content": [
    {
      "type": "thinking",
      "thinking": "Let me analyze this step by step..."
    },
    {
      "type": "text",
      "text": "Based on my analysis..."
    }
  ]
}
```

`thinking` 블록은 모델의 내부 사고 과정이 펼쳐진 곳이고, `text` 블록은 사용자에게 보여주는 최종 답입니다. 일반 모드에서는 `thinking` 블록이 없고 `text`만 옵니다.

## 💡 어떤 작업에 가장 효과적일까요?

Extended Thinking은 다음과 같은 작업에서 큰 차이를 만듭니다.

- **여러 단계 추론**: "이 데이터의 패턴을 분석한 뒤 가설 3개를 세우고 각각 검증해 달라"
- **복잡한 코드 작성**: 다중 파일을 한 번에 수정해야 하는 리팩터링
- **긴 자료 분석**: 두꺼운 보고서 전체를 보고 결론을 도출
- **수학, 논리, 증명**: 단계별 풀이가 필요한 문제

반면 다음과 같은 작업에는 일반 모드로 충분합니다.

- 단순 사실 답변, 짧은 번역, 인사, 잡담
- 한 줄 요약, 단순 질문 응답

작업이 복잡할수록 Extended Thinking의 가치가 커집니다.

## 🔗 다른 기능과의 묶음

**1. [Projects](/class/claude-in-practice/what-are-claude-projects) + Extended Thinking**
- 프로젝트 안에서 정해진 자료 위에 추론을 깊게 거치면 결과 품질이 매우 안정됩니다.

**2. Tool Use + Extended Thinking**
- 외부 도구(검색, DB, 계산)를 호출하는 작업에서 추론을 함께 거치면 도구 호출 사이의 일관성이 살아납니다.

**3. [Claude Cowork](/class/claude-in-practice/claude-cowork-overview) + Extended Thinking**
- 자동화 작업에 깊은 분석을 결합하고 싶다면 Cowork 안에서 Extended Thinking을 사용 설정합니다.

## ⚠️ 주의할 점 3가지

**1. 비용, 속도 트레이드오프**
- 추론 블록도 토큰을 사용합니다. 비용과 응답 시간이 늘어나는 만큼, 단순 작업에는 켜지 않는 게 맞습니다.

**2. thinking 블록 보존 (Tool Use 때)**
- 도구를 호출하고 다시 답변을 이어 갈 때, 이전 thinking 블록을 함께 넘겨야 추론 일관성이 유지됩니다(API 사용자 한정).

**3. 모델 선택과 함께 결정**
- [Claude 모델 패밀리](/class/claude-fundamentals/claude-model-family)에서 다룬 대로, 모델별 지원 여부가 다릅니다. 작업 성격에 맞춰 모델과 추론 모드를 함께 골라야 합니다.

## 💼 직무별 활용 시나리오

**마케터, 기획자**
- 분기별 시장 분석: 깊은 추론으로 가설, 검증, 결론 흐름이 살아 있는 보고서 초안

**디자이너, PM**
- 사용자 인터뷰 50건에서 패턴 추출: 단순 요약이 아니라 의미 있는 그룹화

**개발자**
- 다중 파일 리팩터링: 코드 의존성을 함께 추론하며 안전한 변경

이런 작업에서 Extended Thinking을 켜고 끈 결과를 비교해 보면 차이가 분명히 보입니다.

## 📋 30초 요약

1. **Extended Thinking은 Claude가 답을 내기 전 내부 추론을 별도 thinking 블록으로 펼쳐 깊게 생각하는 모드**입니다. 일반 응답에는 없는 추론 단계가 추가됩니다.

2. **현행 세대에서 Extended Thinking을 지원하는 모델은 Haiku 4.5뿐이고, Fable 5, Opus 5, Sonnet 5는 Adaptive Thinking으로 자동 조절합니다**(2026년 7월 기준). 모델별 지원 차이를 [모델 패밀리](/class/claude-fundamentals/claude-model-family) 클래스와 함께 보세요.

3. **여러 단계 추론, 복잡한 코드, 긴 자료 분석 같은 작업에서 가장 큰 효과**가 납니다. [Projects](/class/claude-in-practice/what-are-claude-projects), Cowork와 묶으면 자동화에 깊이가 더해집니다.

## 📚 참고 자료

- Extended Thinking 공식 문서: [https://platform.claude.com/docs/en/build-with-claude/extended-thinking](https://platform.claude.com/docs/en/build-with-claude/extended-thinking)
- Adaptive Thinking 공식 문서: [https://platform.claude.com/docs/en/build-with-claude/adaptive-thinking](https://platform.claude.com/docs/en/build-with-claude/adaptive-thinking)
- Claude 모델 개요: [https://platform.claude.com/docs/en/about-claude/models/overview](https://platform.claude.com/docs/en/about-claude/models/overview)
