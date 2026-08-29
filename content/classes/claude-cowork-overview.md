---
slug: claude-cowork-overview
term: Claude Cowork (작업 자동화, Dispatch) 활용하기
definition: >-
  Claude가 사용자의 데스크톱에서 직접 앱을 열고, 스프레드시트를 채우고, 브라우저를 탐색해 완성된 결과물을 돌려주는 작업 자동화
  도구입니다. "Hand off a task, get a polished deliverable"이 공식 슬로건입니다.
category: CLAUDE_EDUCATION
tags:
  - AI
  - 자동화
publishedAt: '2026-04-27T09:23:00.000Z'
updatedAt: '2026-07-23T00:00:00.000Z'
courseSlug: claude-in-practice
orderInCourse: 4
aliases:
  - Cowork
  - Claude Dispatch
  - 작업 자동화
relatedTerms:
  - what-are-claude-skills
  - what-is-extended-thinking
  - claude-for-marketers
difficulty: BEGINNER
quiz:
  - question: Claude.ai와 Claude Cowork의 가장 큰 차이는 무엇일까요?
    options:
      - 'Claude.ai는 대화형 챗, Cowork는 작업을 넘기면 결과물을 돌려주는 실행형 자동화'
      - 'Claude.ai는 한국어, Cowork는 영어 전용'
      - 'Claude.ai는 무료, Cowork는 유료'
      - 두 도구는 같은 도구의 다른 이름
    correctIndex: 0
    explanation: >-
      Claude.ai는 단계별 지시를 주고받으며 아이디어, 초안을 받는 대화형 챗 형태입니다. Cowork는 작업을 넘기면(hand
      off) Claude가 데스크톱에서 직접 실행해 완성된 파일, 보고서, 발표 자료를 돌려주는 실행형 자동화 도구입니다. 두 도구의 작동
      방식과 결과물 형태가 다릅니다.
metaTitle: '클로드 코워크(Claude Cowork) 정리: 기능, 클로드 코드와 차이, 활용'
metaDescription: >-
  클로드 코워크는 파일 정리, 문서 작성 같은 사무 작업을 AI에게 맡기는 앤트로픽의 데스크톱 기능입니다. 클로드 코드와의 차이, 대표 활용 시나리오, 시작 방법을 정리했습니다.
ogImage: /og/claude-cowork-overview.png
summary3:
  - 'Claude Cowork는 Claude가 사용자 데스크톱에서 직접 앱을 열고 조작해 완성된 파일을 돌려주는 실행형 자동화 도구입니다.'
  - 'claude.ai 챗이 초안과 답변을 주는 데서 끝난다면 Cowork는 Dispatch로 컴퓨터를 조작하고 정해 둔 시각에 같은 작업을 반복합니다.'
  - '처음부터 큰 자동화를 맡기지 말고 한 번에 5분에서 10분 걸리는 반복 작업부터 넘긴 뒤 결과를 확인하는 단계를 넣습니다.'
---

이 글은 앤트로픽이 운영하는 claude.com/product/cowork와 Anthropic Academy 자료를 한국 입문자가 보기 편하게 정리한 글입니다.

## 🤔 매주 같은 작업을 자동으로 돌릴 수 없을까요?

매주 금요일 광고 리포트를 만드는 흐름이 있습니다. 데이터 다운로드 → 엑셀 정리 → 그래프 생성 → 슬라이드 옮기기 → 슬랙 발송. 한 번에 한두 시간이 들고, 매주 똑같이 반복됩니다.

Claude.ai 챗으로는 이 흐름을 한 번에 자동화하기 어렵습니다. 챗은 단계별 답을 주는 도구이지 직접 컴퓨터를 조작하는 도구가 아니기 때문입니다.

Claude Cowork가 이 자리를 채웁니다.

## 🔑 Claude Cowork, 무엇이 다른가요?

**Claude Cowork**는 Claude가 사용자의 데스크톱에서 직접 앱을 열고 작업을 실행해 완성된 결과물을 돌려주는 도구입니다. 공식 슬로건은 **"Hand off a task, get a polished deliverable"**(작업을 넘기면 완성된 결과물을 돌려준다)입니다.

claude.ai와 비교하면 다음 표처럼 정리됩니다.

| 측면 | Claude.ai (챗) | Claude Cowork (실행) |
|---|---|---|
| **방식** | 대화형 챗 | 실행형 자동화 |
| **사용자가 받는 것** | 아이디어, 초안, 답변 | 완성된 파일, 보고서, 발표 자료 |
| **컴퓨터 조작** | 불가 | 가능 (Dispatch) |
| **스케줄링** | 불가 | 일회 설정 후 반복 가능 |
| **모바일에서 지시** | 같은 챗 사용 | 모바일 → 데스크톱 작업 트리거 |

## 🚀 Cowork의 4가지 핵심 기능

**1. Dispatch (컴퓨터 자동화)**
- "Anything you can do on your computer, Claude can do"가 공식 표현입니다.
- 데스크톱에서 앱을 열고, 스프레드시트를 채우고, 브라우저를 탐색합니다.
- 추가 설정이 필요 없습니다.

**2. 스케줄된 작업**
- 반복되는 작업을 일회 설정해두면 정해진 시간에 자동 실행됩니다.
- 예: 매주 금요일 오전 9시에 광고 리포트 자동 작성 후 슬랙 발송.

**3. 모바일 통합**
- 휴대폰에서 작업을 지시하면 회사 데스크톱에서 작업이 진행되고 결과물을 받아볼 수 있습니다.
- 출퇴근, 외출 중에도 큰 작업을 시킬 수 있습니다.

**4. 엔터프라이즈 통제**
- 관리자 권한으로 비용 통제, 접근 제어가 가능합니다.
- 회사 단위 도입 시 보안, 예산 관리에 적합합니다.

## 💼 Cowork가 가장 큰 효과를 내는 자리

공식 페이지에 명시된 활용 예시는 다음과 같습니다.

- **파일 정리 및 이름 변경**: 다운로드 폴더의 수십 개 파일을 일정 규칙으로 자동 정리
- **스크린샷, 영수증을 스프레드시트로 변환**: 사진을 끌어다 놓으면 자동으로 표로 변환
- **보고서, 문서, 발표자료 자동 작성**: 데이터 입력 → 형식 적용 → 슬라이드 변환

[Skills](/class/claude-in-practice/what-are-claude-skills)와 함께 쓰면 회사 가이드라인을 적용한 결과물을 매번 같은 품질로 받을 수 있습니다.

## 📅 매주 광고 리포트 자동화 시나리오

마케터가 Cowork로 매주 금요일 광고 리포트를 자동화하는 흐름은 다음과 같이 설계할 수 있습니다.

- **월요일 1회 설정**:
  1. 광고 데이터 소스 연결(또는 다운로드 위치 지정)
  2. 회사 리포트 템플릿 등록
  3. 매주 금요일 09:00 자동 실행 스케줄

- **매주 금요일**:
  1. Cowork가 자동으로 데이터 수집
  2. 회사 형식의 리포트 생성
  3. 결과물을 지정한 폴더 또는 슬랙으로 발송

- **사용자 작업**:
  1. 결과물 받기
  2. 사실 검증, 요약 코멘트 추가
  3. 발표

[책임감 있는 AI 사용](/class/claude-fundamentals/responsible-ai-use)의 검증 단계가 자동화 위에 그대로 얹힙니다.

## 🔗 Cowork를 더 강하게 만드는 묶음

**1. [Claude Skills](/class/claude-in-practice/what-are-claude-skills) + Cowork**
- 회사 가이드라인을 담은 스킬을 만들어두고, Cowork 작업이 그 스킬을 자동으로 호출하게 설정.
- 매주 결과물의 형식, 어조가 똑같이 유지됩니다.

**2. [Extended Thinking](/class/claude-in-practice/what-is-extended-thinking) + Cowork**
- 복잡한 분석이 필요한 작업은 Extended Thinking을 켜서 Cowork가 더 깊은 추론을 거치게 합니다.
- 단순 정리가 아니라 인사이트 한 단락이 함께 나옵니다.

**3. 모바일 + Cowork**
- 출근길에 휴대폰에서 "어제 마감된 캠페인 5개 리포트 정리해 둬"라고 지시.
- 사무실에 도착하면 결과물이 이미 준비되어 있습니다.

## ⚠️ Cowork 사용 시 주의할 점

**1. 첫 도입은 작은 작업으로 시작**
- 갑자기 큰 자동화부터 시도하지 말고, 한 번에 5~10분이 걸리는 작은 반복 작업부터 자동화합니다.

**2. 결과물 검증 단계 흐름화**
- 자동화 결과를 그대로 발송하지 말고, 사람이 한 번 검수하는 단계를 워크플로에 넣습니다.

**3. 권한 범위 명확히**
- Cowork에 어떤 폴더, 계정, 앱 접근을 허용하는지 한 번 점검합니다. [책임감 있는 AI 사용](/class/claude-fundamentals/responsible-ai-use)의 보안 기준이 그대로 적용됩니다.

## 📋 30초 요약

1. **Claude Cowork는 작업을 넘기면 완성된 결과물을 돌려주는 실행형 자동화 도구**입니다. claude.ai 챗과 달리 Claude가 데스크톱을 직접 조작합니다(Dispatch).

2. **Dispatch, 스케줄, 모바일 통합, 엔터프라이즈 통제 네 가지가 핵심 기능**입니다. 매주 광고 리포트, 영수증 정리, 보고서 자동 작성 같은 반복 업무에 가장 큰 효과가 납니다.

3. **[Skills](/class/claude-in-practice/what-are-claude-skills), [Extended Thinking](/class/claude-in-practice/what-is-extended-thinking)과 함께 묶으면 더 강해집니다.** 첫 도입은 작은 작업, 결과물 검증 흐름화, 권한 범위 점검 세 가지를 표준 원칙으로 둡니다.

## 📚 참고 자료

- Claude Cowork 공식 페이지: [https://claude.com/product/cowork](https://claude.com/product/cowork)
- Inside Claude Cowork: [https://www.anthropic.com/product/claude-cowork](https://www.anthropic.com/product/claude-cowork)
- Claude 활용 사례 모음: [https://claude.com/resources/use-cases](https://claude.com/resources/use-cases)
- Anthropic Academy: [https://www.anthropic.com/learn](https://www.anthropic.com/learn)
