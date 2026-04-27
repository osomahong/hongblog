---
slug: what-is-claude
term: Claude (앤트로픽 AI 어시스턴트)
definition: '앤트로픽이 만든 AI 어시스턴트로, 한국어 대화·문서 작성·코드 작성·이미지 이해·파일 분석까지 한 화면에서 처리합니다.'
category: CLAUDE_EDUCATION
tags:
  - AI
  - 자동화
publishedAt: '2026-04-27T09:10:00.000Z'
courseSlug: claude-fundamentals
orderInCourse: 1
aliases:
  - 클로드
  - claude.ai
  - Anthropic Claude
difficulty: BEGINNER
quiz:
  - question: >-
      Claude를 처음 써 보는 마케터가 '고객 후기 PDF 50개에서 자주 나오는 불만 키워드만 뽑아줘'라고 시켰습니다. Claude가
      이 작업을 처리할 수 있는 가장 큰 이유는 무엇일까요?
    options:
      - Claude는 PDF·Word·Excel·이미지 같은 파일을 직접 읽고 분석할 수 있기 때문이다
      - Claude는 인터넷에 접속해 외부 데이터를 자동으로 가져오기 때문이다
      - Claude는 모든 PDF 파일을 자동으로 OCR로 변환해 저장하기 때문이다
      - Claude는 마케팅 도메인 전용으로 만들어진 AI이기 때문이다
    correctIndex: 0
    explanation: >-
      Claude는 텍스트뿐 아니라 PDF·Word·Excel 같은 문서와 이미지까지 직접 받아 내용을 읽고 분석할 수 있도록
      설계되었습니다. 마케터가 후기 PDF를 업로드하면 그 안의 텍스트를 분석해 키워드와 패턴을 정리해 줍니다. 인터넷 접속이나 OCR
      변환은 요청에 따라 추가로 동작할 수 있는 기능이지만, 이 작업의 핵심은 파일을 직접 이해하는 능력입니다.
  - question: Claude를 사용할 수 있는 공식 경로가 아닌 것은 무엇일까요?
    options:
      - 웹 브라우저(claude.ai)
      - 데스크톱 앱(macOS·Windows)
      - Chrome·Slack·Excel 같은 외부 도구 연동
      - SMS 문자 메시지 전용 챗봇
    correctIndex: 3
    explanation: >-
      Claude는 claude.ai 웹, 데스크톱·모바일 앱, Claude API, 그리고
      Chrome·Slack·Excel·Word·PowerPoint 같은 외부 도구 연동을 공식 경로로 제공합니다. SMS 문자 전용
      챗봇은 앤트로픽이 운영하는 공식 채널이 아닙니다.
ogImage: /og/what-is-claude.png
---

이 글은 앤트로픽이 운영하는 Anthropic Academy(anthropic.com/learn), claude.com/resources, platform.claude.com/docs에 흩어져 있는 공식 교육 자료 중 Claude의 정체와 기능에 해당하는 내용을 한국어 입문자가 한눈에 따라갈 수 있도록 정리한 것입니다. 원문 링크는 글 끝 참고 자료에 모두 모았습니다.

## Claude의 한 줄 정의

**Claude**는 미국 AI 안전 연구 회사 **앤트로픽(Anthropic)**이 만든 AI 어시스턴트입니다. 한국어로 대화하고, 글을 쓰고, 코드를 작성·검토하고, PDF·이미지·표를 직접 읽어 정리하는 일을 한 화면에서 처리합니다.

대중적으로 잘 알려진 ChatGPT나 Gemini와 같은 부류로, 대형 언어 모델(LLM, Large Language Model)을 기반으로 한 대화형 AI입니다.

## Claude가 처리하는 일

앤트로픽 공식 소개에 따르면 Claude가 잘하는 일은 크게 다섯 갈래입니다.

**1. 글쓰기와 편집**
- 보고서·기획서·이메일 초안 작성
- 문서 검토와 어투 다듬기
- 아이디어 브레인스토밍

**2. 학습과 설명**
- 어려운 개념을 쉬운 한국어로 풀어 설명
- 외국어 자료 번역과 요약
- 책·논문 핵심 정리

**3. 코드 작업**
- 여러 프로그래밍 언어로 코드 작성
- 버그 찾기와 수정 제안
- 코드 리뷰와 리팩터링 안내

**4. 파일 분석**
- PDF·Word·Excel 문서 업로드 후 내용 분석
- 이미지·도표·차트 이해
- 데이터 기반 보고서 정리

**5. 멀티 도구 연동**
- Chrome 확장으로 웹 페이지 요약
- Slack·Excel·Word·PowerPoint 안에서 직접 호출
- API로 다른 시스템과 연결

## Claude를 만나는 네 가지 경로

**1. claude.ai (웹)** — 가장 흔한 입구입니다. 브라우저에서 가입하면 바로 대화창이 열립니다.

**2. 데스크톱 앱 (macOS·Windows)** — 항상 켜놓고 단축키로 부르는 형태입니다.

**3. 모바일 앱 (iOS·Android)** — 외부에서 사진을 찍어 분석을 맡기는 데 강합니다.

**4. Claude API와 외부 통합** — 직접 코드를 짜는 개발자, 또는 Chrome·Slack·Excel 같은 도구 안에서 Claude를 부르려는 사용자를 위한 경로입니다.

## 헤비 유저와 처음 쓰는 사람의 차이

Claude를 매일 쓰는 헤비 유저들은 한 가지 작업에 30분씩 매달리지 않습니다. 짧은 지시를 여러 번 던지고, 결과를 확인한 뒤 다음 지시를 추가합니다. 파일을 첨부하고, 이전 대화를 가져와 붙이고, 결과를 다시 다른 도구로 보냅니다.

처음 쓰는 사람은 다릅니다. 한 번에 길고 완벽한 질문을 만드느라 입력창 앞에서 망설입니다. 답이 마음에 안 들면 "역시 AI는 별로네"라고 결론짓고 닫아버리기 쉽습니다.

두 모습 사이에 위계는 없습니다. 다만 **짧게 묻고, 결과를 보고, 다시 다듬는 습관**이 헤비 유저 쪽에 있다는 것뿐입니다. 이 습관은 며칠만 의식해도 손에 붙습니다.

## 처음 쓰는 사람을 위한 시작점

처음부터 거창한 자동화를 만들 필요는 없습니다. 다음 세 가지 중 하나만 골라 한 주 동안 해보는 것으로 충분합니다.

- **이메일 초안 다듬기** — 작성한 메일을 붙여 넣고 "더 간결하게" 또는 "더 정중하게"라고 시킵니다.
- **외국어 자료 요약** — 영문 기사·논문 PDF를 올리고 "한국어로 핵심 5개만"이라고 시킵니다.
- **회의록 정리** — 받아쓴 메모를 붙이고 "결정 사항·할 일·미해결 이슈로 나눠줘"라고 시킵니다.

각자의 속도로 익히면 됩니다. 헤비 유저처럼 매일 50번씩 부를 필요는 없습니다.

## 30초 요약

1. **Claude는 앤트로픽이 만든 AI 어시스턴트**입니다. 한국어 대화, 글쓰기, 코드 작성, PDF·이미지·Excel 분석까지 한 화면에서 처리합니다.

2. **Claude를 만나는 경로는 claude.ai 웹·데스크톱 앱·모바일 앱·외부 도구 연동** 네 가지입니다. 어느 경로로 시작하든 가입 한 번으로 같은 대화 기록이 따라옵니다.

3. **헤비 유저와 처음 쓰는 사람의 차이는 도구가 아니라 습관**입니다. 짧게 묻고 결과를 보고 다시 다듬는 흐름을 며칠만 익히면 충분합니다.

## 참고 자료

- Claude 공식 소개 — [https://claude.com/product/overview](https://claude.com/product/overview)
- Claude 모델 패밀리 문서 — [https://platform.claude.com/docs/en/about-claude/models/overview](https://platform.claude.com/docs/en/about-claude/models/overview)
- Anthropic Academy(공식 학습 허브) — [https://www.anthropic.com/learn](https://www.anthropic.com/learn)
- Claude 활용 사례 모음 — [https://claude.com/resources/use-cases](https://claude.com/resources/use-cases)
