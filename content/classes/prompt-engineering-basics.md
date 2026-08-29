---
slug: prompt-engineering-basics
term: 프롬프트 엔지니어링 기본 익히기
definition: >-
  AI에게 일을 시킬 때 결과 품질을 결정하는 지시 작성법입니다. 역할, 맥락, 작업, 제약, 예시를 갖춘 프롬프트가 좋은 결과를 안정적으로
  만듭니다.
category: CLAUDE_EDUCATION
tags:
  - AI
publishedAt: '2026-04-27T09:16:00.000Z'
updatedAt: '2026-07-23T00:00:00.000Z'
courseSlug: claude-fundamentals
orderInCourse: 7
aliases:
  - 프롬프트 엔지니어링
  - Prompt Engineering
  - 프롬프트 작성법
relatedTerms:
  - four-ds-of-ai-fluency
  - context-window-explained
  - what-are-claude-skills
difficulty: BEGINNER
quiz:
  - question: 'AI에게 회의록 정리를 시킬 때, 같은 결과 품질을 매번 안정적으로 받기 위해 가장 효과적인 프롬프트 작성법은 무엇일까요?'
    options:
      - 역할, 맥락, 작업, 제약, 예시 다섯 갈래를 갖춘 프롬프트로 작성한다
      - '"회의록 잘 정리해 줘"라고 짧게 지시한다'
      - 매번 다른 표현으로 새로 시켜본다
      - '"전문가처럼" 같은 수식만 길게 붙인다'
    correctIndex: 0
    explanation: >-
      좋은 프롬프트의 다섯 요소는 역할, 맥락, 작업, 제약, 예시(필요 시)입니다. 매번 같은 골격을 유지하면 결과의 분산이 줄어들어 같은
      품질을 안정적으로 얻을 수 있습니다. "전문가처럼" 같은 막연한 수식만으로는 결과가 일관되지 않습니다.
metaTitle: '프롬프트 엔지니어링 뜻과 기본기: 좋은 지시문 작성법'
metaDescription: '프롬프트 엔지니어링은 AI에게 일을 시킬 때 결과 품질을 결정하는 지시 작성법입니다. 역할, 맥락, 작업, 제약, 예시를 갖춘 프롬프트 구조를 정리했습니다.'
ogImage: /og/prompt-engineering-basics.png
summary3:
  - '프롬프트 엔지니어링은 AI에게 일을 시킬 때 결과 품질을 정하는 지시 작성법이고 모델을 바꾸기 전에 지시를 먼저 다듬는 쪽이 효과가 큽니다.'
  - '좋은 지시는 역할과 맥락, 작업, 제약, 예시 다섯 가지를 갖춥니다.'
  - '막연한 수식어에 기대거나 한 프롬프트에 일곱 가지가 넘는 작업을 묶으면 일부가 빠지므로 큰 작업은 단계로 나눕니다.'
---

이 글은 앤트로픽이 운영하는 platform.claude.com/docs의 Prompt Engineering 가이드를 한국 입문자가 보기 편하게 정리한 글입니다. 원문 링크는 글 끝 참고 자료에 모았습니다.

## 🤔 같은 AI인데 왜 결과가 매번 다를까요?

AI에게 "회의록 정리해 줘"라고 시키면 어떤 날은 깔끔한 표가 나오고, 어떤 날은 줄글로 나옵니다. 어떤 날은 결정 사항만 뽑고, 어떤 날은 잡담까지 다 옮깁니다.

문제는 AI가 아니라 지시(프롬프트)에 있습니다. 같은 지시라도 모델 입장에서 해석할 여지가 너무 많으면 결과는 매번 다른 방향으로 흩어집니다. 좋은 결과를 안정적으로 받으려면 지시 자체를 다르게 써야 합니다.

## 🔑 프롬프트 엔지니어링, 무엇을 다루나요?

**프롬프트 엔지니어링(Prompt Engineering)**은 AI에게 일을 시킬 때 결과 품질을 결정하는 지시 작성법입니다.

코드를 짜는 일이 아닙니다. 한국어 한 문단을 어떻게 구성하느냐의 문제입니다. 다섯 가지 요소를 의식적으로 담는 것이 출발점입니다.

## 🧱 좋은 프롬프트의 5가지 요소

**1. 역할 (Role)**
- "당신은 한국 디지털 마케팅 전문가입니다." 같은 한 문장.
- AI가 어떤 시각으로 답할지 정해줍니다.

**2. 맥락 (Context)**
- "지금 작성 중인 보고서는 임원진 대상 분기 정리이고, 분량은 A4 2장 이내입니다."
- 결과물이 어디에 쓰일지 알면 어조와 분량이 달라집니다.

**3. 작업 (Task)**
- "다음 회의록을 결정 사항, 할 일, 미해결 이슈 세 갈래로 정리해 달라."
- 동사로 시작하는 한 문장으로 분명하게.

**4. 제약 (Constraints)**
- "분량은 5줄 이내, 출처 없는 통계는 빼라, 한국어 존댓말로."
- 안 했으면 하는 행동도 명시합니다.

**5. 예시 (Examples, 필요 시)**
- "결과 형식은 다음 예시처럼 만들어 달라"고 한두 개 보여줍니다.
- 형식이 까다로울수록 예시가 가장 효과적입니다.

이 다섯 가지를 갖춘 프롬프트는 [AI Fluency 4D 프레임워크](/class/claude-fundamentals/four-ds-of-ai-fluency)의 D2(Description) 단계가 실제로 어떻게 적용되는지 보여줍니다.

## ✍️ Before / After 예시

**Before**
```
회의록 정리해 줘.
```

**After**
```
당신은 회의 진행자 역할이다.
오늘 마케팅 팀 회의록(아래 첨부)을 정리해야 한다.

다음 세 갈래로 분리해 달라:
- 결정 사항 (확정된 것만)
- 할 일 (담당자와 마감일을 함께)
- 미해결 이슈 (다음 회의로 넘기는 항목)

분량은 각 항목 5개 이내, 한국어 존댓말로.
잡담, 중복 발언은 빼라.

[회의록 본문]
```

같은 회의록이라도 두 번째 프롬프트는 매번 같은 형식의 결과를 만들어냅니다.

## 🔁 결과가 부족할 때 다듬는 4가지 흐름

**1. 한 번에 다 시키지 말고 단계로 쪼개기**
- "초안 → 검토 → 다듬기" 세 번에 나눠 시키면 한 번에 시킨 것보다 품질이 안정됩니다.

**2. 부족한 부분만 짚어 다시 시키기**
- "전체 다시"가 아니라 "결정 사항 부분만 더 짧게"처럼 영역을 좁혀 요청합니다.

**3. 출력 형식 강제**
- "표 형태로", "마크다운 리스트로", "JSON 형식으로" 등 형식을 명시하면 후처리가 쉬워집니다.

**4. 잘 됐던 프롬프트는 보관**
- 같은 작업을 반복한다면 잘 됐던 프롬프트를 재사용 단위로 저장합니다. [Claude Skills](/class/claude-in-practice/what-are-claude-skills)가 이 흐름을 자동화한 기능입니다.

## ⚠️ 자주 하는 실수 3가지

**1. 막연한 수식어 의존**
- "전문가답게", "창의적으로", "프로처럼" 같은 표현은 모델에게 거의 정보가 없습니다. 구체적인 행동 지시로 바꿔야 합니다.

**2. 한 번에 너무 많은 지시**
- 한 프롬프트에 7~8가지 작업을 묶어 넣으면 AI가 일부를 빼먹기 쉽습니다. 큰 작업은 단계로 나눕니다.

**3. 컨텍스트 한계 무시**
- 너무 긴 자료를 통째로 던지면 모델이 앞부분을 흐릿하게 처리할 수 있습니다. [컨텍스트 윈도우](/class/claude-fundamentals/context-window-explained)의 개념을 알면 이 한계를 피할 수 있습니다.

## 💼 직무별 프롬프트 시나리오

**마케터**
- "광고 리포트(첨부) 5개 캠페인의 CTR, CVR을 표로, 가장 큰 변화 3개를 짚어 달라."

**기획자**
- "다음 사용자 인터뷰(첨부)에서 반복되는 불만 키워드 5개를 빈도와 함께 정리해 달라."

**교육자**
- "다음 강의 자료(첨부)를 학생 눈높이의 한국어 요약 10줄로 만들어 달라. 영어 용어는 한국어 풀이를 괄호로 함께."

각 시나리오 모두 역할, 맥락, 작업, 제약을 모두 갖춘 형태입니다.

## 📋 30초 요약

1. **프롬프트 엔지니어링은 결과 품질을 결정하는 지시 작성법**입니다. AI를 바꾸기 전에 지시를 먼저 다듬는 게 가장 큰 변화를 만듭니다.

2. **역할, 맥락, 작업, 제약, 예시 다섯 가지가 좋은 프롬프트의 골격**입니다. 짧게 지시할 때조차 이 다섯 가지를 머릿속에서 거치는 습관이 핵심입니다.

3. **막연한 수식, 한 번에 다 시키기, 컨텍스트 한계 무시 세 가지가 가장 흔한 실수**입니다. 잘 됐던 프롬프트는 [Claude Skills](/class/claude-in-practice/what-are-claude-skills)로 저장해 재사용하면 같은 품질을 매번 받을 수 있습니다.

## 📚 참고 자료

- Prompt Engineering 가이드: [https://platform.claude.com/docs/en/build-with-claude/prompt-engineering](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering)
- Claude Prompting Best Practices: [https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices)
- Anthropic Academy: [https://www.anthropic.com/learn](https://www.anthropic.com/learn)
