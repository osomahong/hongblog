---
slug: what-is-claude
term: '클로드(Claude) 이해하기: 입문자를 위한 앤트로픽 AI 어시스턴트 소개'
definition: '앤트로픽이 만든 AI 어시스턴트로, 한국어 대화부터 글쓰기, 코드 작성, PDF, 이미지, 표 분석까지 한 화면에서 처리합니다.'
category: CLAUDE_EDUCATION
tags:
  - AI
  - 자동화
publishedAt: '2026-04-27T09:10:00.000Z'
updatedAt: '2026-07-26T00:00:00.000Z'
courseSlug: claude-fundamentals
orderInCourse: 1
aliases:
  - 클로드
  - 클로드 입문
  - 클로드 초보
  - 클로드 이해하기
  - claude.ai
  - Anthropic Claude
relatedTerms:
  - what-is-anthropic
  - claude-model-family
updateNotice:
  date: 2026-07
  items:
    - '1M 컨텍스트 설명의 모델 이름을 현행 세대인 Opus 5, Sonnet 5로 교체했습니다.'
difficulty: BEGINNER
metaTitle: '클로드(Claude) 입문: 앤트로픽 AI 어시스턴트 첫걸음'
metaDescription: >-
  클로드 처음 쓰는 입문자를 위한 가이드입니다. Anthropic이 만든 AI 어시스턴트 Claude의 정체, ChatGPT, Gemini와의
  차이, 마케터, 디자이너, 개발자 직무별 활용법을 정리했습니다.
quiz:
  - options:
      - 'PDF, Word, Excel, 이미지 같은 파일을 직접 읽고 분석할 수 있다'
      - 인터넷에 자동 접속해 모든 파일을 다운받아온다
      - 모든 PDF를 OCR로 자동 변환해서 저장해둔다
      - 마케팅 도메인 전용으로 만들어진 AI여서 후기에 강하다
    question: >-
      마케터가 Claude에게 "고객 후기 PDF 50개에서 자주 나오는 불만 키워드만 뽑아줘"라고 시켰을 때, Claude가 이 작업을
      처리할 수 있는 가장 큰 이유는 무엇일까요?
    explanation: >-
      Claude는 텍스트뿐 아니라 PDF, Word, Excel, 이미지 같은 파일을 직접 받아 내용을 읽고 분석할 수 있도록
      설계되었습니다. 후기 PDF를 그대로 업로드하면 그 안의 텍스트를 분석해 키워드와 패턴을 정리해 줍니다. 인터넷 접속이나 OCR
      변환은 작업의 핵심이 아닙니다. 파일을 직접 이해하는 능력이 핵심입니다.
    correctIndex: 0
ogImage: /og/what-is-claude.png
summary3:
  - >-
    Claude는 미국 AI 안전 연구 회사 앤트로픽이 만든 AI 어시스턴트이고 한국어 대화와 글쓰기, 코드 작성, PDF와 이미지 분석을
    한 화면에서 처리합니다.
  - 글쓰기와 번역 같은 기본 작업은 세 AI가 비슷해서 실제 차이는 회사 성격과 붙어 있는 도구에서 납니다.
  - >-
    Claude Code와 Remote Control, Cowork의 Dispatch처럼 ChatGPT나 Gemini에 같은 형태가 없는
    도구가 옮겨 타는 이유가 됩니다.
---

이 글은 [앤트로픽](/class/claude-fundamentals/what-is-anthropic)이 운영하는 Anthropic Academy(anthropic.com/learn), claude.com/resources, platform.claude.com/docs의 공식 교육 자료 중 Claude의 정체와 기능을 한국 입문자가 보기 편하게 정리한 글입니다. 원문 링크는 글 끝 참고 자료에 모았습니다.

## 🤔 혹시 이런 경험 있나요?

회사 동료가 "어제 Claude한테 시켜서 한 시간 만에 끝냈어"라고 말합니다. 또 다른 동료는 "ChatGPT랑 비슷한 거 아니야? 왜 굳이 Claude를 써?"라고 묻습니다.

가입은 해뒀지만 막상 어디서부터 시작해야 할지 막막합니다. 이름은 들어봤는데 ChatGPT, Gemini와 정확히 뭐가 다른지, 무엇을 더 잘하는지 정리해본 적이 없기 때문입니다.

## 🔑 Claude, 왜 요새 많이 쓸까요?

**Claude**는 미국 AI 안전 연구 회사 **앤트로픽(Anthropic)**이 만든 AI 어시스턴트입니다. 이름은 들어봤는데 ChatGPT가 이미 있는데도 굳이 Claude로 갈아타거나 같이 쓰는 분이 왜 늘어나는지 궁금한 분이 많습니다.

이유는 단순합니다. Claude는 단순 챗봇 한 가지가 아니라, **개발자와 실무자가 매일 쓰는 도구를 같이 묶어 제공**하기 때문입니다. 터미널에서 코드를 직접 수정해주는 Claude Code, 자주 시키는 작업을 재사용 단위로 만드는 Claude Skills, 화면을 직접 조작해 일을 대신하는 Computer Use 같은 기능이 모두 Claude에 묶여 있습니다. 이 점이 다른 AI 어시스턴트와의 가장 큰 차이입니다.

## 🤖 ChatGPT, Gemini와 어떻게 다를까요?

세 AI 모두 글쓰기, 번역, 학습 보조 같은 기본 작업은 다 잘합니다. 그래서 그 영역으로 비교하는 건 의미가 크지 않습니다. 회사 성격과 접근 방식이 다릅니다.

- **ChatGPT (OpenAI)**: 대중 인지도가 가장 높고, 이미지 생성, 음성 같은 부가 기능이 풍부합니다.
- **Gemini (Google)**: 구글 검색, Workspace와 깊게 묶여 있어 Gmail, Docs, Drive와 함께 쓸 때 강합니다.
- **Claude (Anthropic)**: AI 안전성을 회사 핵심 미션으로 두고, 코딩과 긴 문서 처리에 특화된 도구를 묶어 제공합니다.

세 가지를 다 써본 분들이 Claude로 돌아오는 이유는 다음 섹션에서 다섯 가지 무기로 정리합니다.

## 🚀 Claude만의 무기 (다른 AI에 없는 것)

다른 AI에서는 못 찾고 Claude로 갈아타게 만드는 핵심 차별점은 다음과 같습니다. 모두 앤트로픽이 직접 만들거나 표준으로 제안한 기능이며, 코스 2와 3에서 하나씩 자세히 다룹니다.

**1. Claude Code + Remote Control (터미널 코딩 에이전트)**
- 터미널에서 실제 파일을 읽고, 수정하고, 커밋까지 하는 코딩 전용 에이전트입니다.
- "이 프로젝트에 로그인 기능 붙여줘"라고 시키면 여러 파일을 한 번에 작업합니다.
- **Remote Control**로 진행 중인 Claude Code 세션을 외부에서 모바일, 웹으로 원격 조작할 수 있습니다. 출퇴근 중에도 빌드 결과를 보고 다음 지시를 보낼 수 있습니다.
- ChatGPT, Gemini에는 같은 형태의 공식 도구가 없습니다. 코스 3에서 자세히 다룹니다.

**2. Claude Cowork (작업 자동화, Dispatch)**
- "Hand off a task, get a polished deliverable"(작업을 넘기면 완성된 결과물을 돌려준다)이 공식 슬로건입니다.
- **Dispatch** 기능으로 Claude가 데스크톱에서 직접 앱을 열고, 스프레드시트를 채우고, 브라우저를 탐색합니다. 추가 설정이 필요 없습니다.
- 매주 금요일 광고 리포트 자동 정리, 영수증 사진을 스프레드시트로 변환 같은 반복 업무를 일회 설정 후 자동 실행합니다.
- 모바일에서 지시하면 회사 컴퓨터에서 작업이 진행되고 결과물을 받아볼 수 있습니다.

**3. Claude Design (디자인, UX 프로토타이핑)**
- Anthropic Labs가 만든 **디자이너, PM 전용** 도구입니다.
- 콘셉트를 동작하는 인터랙티브 프로토타입으로 빠르게 옮기는 데 특화되어 있습니다. 정적 목업이 아닙니다.
- 깃허브 리포지터리를 연결하면 회사가 이미 쓰는 실제 컴포넌트, 스타일, 레이아웃을 그대로 써서 프로토타입을 생성합니다.
- 디자인이 끝나면 Claude Code로 곧장 핸드오프해 디자인 의도를 유지한 채 구현 단계로 넘어갑니다.

**4. 1M 토큰 컨텍스트 (긴 문서 분석)**
- Claude [Opus](/class/claude-fundamentals/claude-model-family) 5와 Sonnet 5는 한 번에 단행본 한 권 분량(약 1M 토큰)을 그대로 입력받습니다.
- 두꺼운 보고서, 논문 PDF, 회의록 모음을 통째로 던져도 잘라 보낼 필요가 없습니다.
- 모델별 차이는 클래스 3(Claude 모델 패밀리)에서 자세히 다룹니다.

**5. Claude Skills (재사용 가능한 작업 단위)**
- 자주 시키는 작업(블로그 글 검수, 회의록 정리 등)을 한 번 만들어두면 매번 호출해서 같은 결과를 얻습니다.
- 매번 프롬프트를 다시 짜지 않아도 됩니다. 팀 안에서 공유해 같은 작업 표준을 맞출 수도 있습니다.
- 코스 2에서 자세히 다룹니다.

**6. MCP (Model Context Protocol)**
- Claude가 외부 도구(노션, 슬랙, 데이터베이스 등)와 안전하게 연결되는 표준 규격입니다.
- 한 번 연결해두면 매번 복사, 붙여넣기 없이 Claude가 외부 자료를 직접 보고 작업합니다.
- 앤트로픽이 제안한 오픈 표준이고, 지금은 다른 AI 회사들도 채택하고 있습니다.

## 💼 실제로 어떻게 쓰이고 있을까요?

이 무기들을 실무자가 자기 자리에서 어떻게 쓰는지 직무별로 정리하면 다음과 같습니다.

**마케터, 기획자**
- 매주 금요일 광고 리포트 PDF를 **Cowork**로 자동 정리해서 슬랙에 발송시킵니다.
- 회의록 정리 형식을 **Skills**로 등록해 매번 같은 구조(결정 사항, 할 일, 이슈)로 받습니다.
- **MCP**로 노션 데이터베이스를 연결하면 Claude가 콘텐츠 캘린더를 직접 읽고 다음 주 일정을 짜줍니다.

**디자이너, PM**
- 새 기능 제안을 **Claude Design**으로 동작하는 프로토타입까지 5분 안에 만듭니다.
- 깃허브 리포지터리를 연결해 실제 회사 컴포넌트가 적용된 화면을 만들어 이해관계자 리뷰에 씁니다.
- 리뷰 후 **Claude Code**로 핸드오프해 구현 작업을 곧장 시작합니다.

**개발자**
- **Claude Code**로 여러 파일 동시 수정, 테스트, 커밋을 맡깁니다.
- 외출, 출퇴근 중에는 **Remote Control**로 진행 상황을 확인하고 다음 지시를 보냅니다.
- 1M 토큰 컨텍스트로 코드베이스 전체를 한 번에 읽혀서 리팩터링 작업을 시킵니다.

## 🛠️ Claude를 만나는 네 가지 경로

| 경로 | 특징 | 어떤 분에게 |
|------|------|-----------|
| **claude.ai (웹)** | 가입 후 브라우저에서 바로 시작 | 처음 시작하는 모든 분 |
| **데스크톱 앱 (macOS, Windows)** | 단축키로 부르고, 시스템 통합 강함 | 매일 켜놓고 쓸 분 |
| **모바일 앱 (iOS, Android)** | 사진 찍어 분석 맡기기 강함 | 외부에서 자료 정리할 분 |
| **API와 외부 통합** | Chrome, Slack, Excel 안에서 호출 | 자동화, 개발이 필요한 분 |

가입은 한 번이면 충분합니다. 어느 경로로 시작하든 같은 대화 기록이 따라옵니다.

## 💡 처음 쓰는 분들을 위한 시작점

처음부터 거창한 자동화를 만들 필요는 없습니다. 다음 세 가지 중 하나만 골라 한 주 동안 해보면 충분합니다.

**1. 이메일 초안 다듬기**
- 직접 쓴 메일을 그대로 붙여 넣고 "더 간결하게" 또는 "더 정중하게"라고 시킵니다.
- AI가 다듬은 문장을 그대로 쓰지 말고, 마음에 드는 부분만 골라서 본인 어투로 옮깁니다.

**2. 외국어 자료 한국어 요약**
- 영문 기사나 논문 PDF를 그대로 업로드하고 "한국어로 핵심 5개만"이라고 요청합니다.
- 회의 전에 자료 읽을 시간이 없을 때 특히 유용합니다.

**3. 회의록 정리**
- 받아쓴 메모를 붙여 넣고 "결정 사항, 할 일, 미해결 이슈로 나눠줘"라고 시킵니다.
- 매번 같은 형식으로 받게 시키면 회의록 작성 시간이 절반으로 줄어듭니다.

## ⚠️ 처음부터 알아둘 점

**1. 한 번에 완벽한 답을 기대하지 마세요.**
짧게 묻고, 결과를 보고, 다시 다듬는 흐름이 가장 효율적입니다. 한 번에 길고 완벽한 질문을 만들려고 입력창 앞에서 망설일 필요는 없습니다.

**2. 민감 정보는 그대로 올리지 마세요.**
고객 실명, 주민등록번호, 카드번호 같은 정보는 가명, 마스킹 후 올립니다. Claude는 입력된 내용을 학습 데이터로 쓰지 않는다고 명시하지만, 회사 보안 정책과 별개로 본인이 한 번 더 거르는 습관이 안전합니다.

**3. 답이 자신 있어 보여도 사실 확인은 별도로 하세요.**
AI는 그럴듯한 거짓 정보를 만들어내기도 합니다. 이걸 **환각(Hallucination)**이라고 부르며, 다음 클래스에서 자세히 다룹니다.

## 📋 3줄 요약

1. Claude는 미국 AI 안전 연구 회사 앤트로픽이 만든 AI 어시스턴트이고 한국어 대화와 글쓰기, 코드 작성, PDF와 이미지 분석을 한 화면에서 처리합니다.

2. 글쓰기와 번역 같은 기본 작업은 세 AI가 비슷해서 실제 차이는 회사 성격과 붙어 있는 도구에서 납니다.

3. Claude Code와 Remote Control, Cowork의 Dispatch처럼 ChatGPT나 Gemini에 같은 형태가 없는 도구가 옮겨 타는 이유가 됩니다.

## 📚 참고 자료

- Claude 공식 소개: [https://claude.com/product/overview](https://claude.com/product/overview)
- Anthropic Academy: [https://www.anthropic.com/learn](https://www.anthropic.com/learn)
- Claude 활용 사례 모음: [https://claude.com/resources/use-cases](https://claude.com/resources/use-cases)
- Claude 모델 패밀리 문서: [https://platform.claude.com/docs/en/about-claude/models/overview](https://platform.claude.com/docs/en/about-claude/models/overview)
