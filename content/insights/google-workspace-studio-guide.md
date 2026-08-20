---
slug: google-workspace-studio-guide
title: 'Google Workspace Studio 사용법: Gmail, Sheets, Drive 업무 자동화하기'
excerpt: >-
  Google Workspace Studio는 Gmail, Drive, Sheets, Docs 같은 Workspace 앱의 반복 업무를
  Gemini와 함께 자동화하는 도구입니다. 시작 조건, 단계, 변수의 구조부터 이메일 요약과 첨부파일 저장 플로우를 만드는 방법까지
  정리했습니다.
category: AI_TECH
topicCluster: google-workspace
contentType: guide
journeyStage: advanced
nextSlugs:
  - google-sheets-ai-function-guide
relatedSlugs:
  - gmail-api-what-you-can-do
  - gemini-notebook-guide
  - n8n-for-non-developers
  - google-ai-studio-guide
tags:
  - AI
  - 자동화
  - 마케팅 실무
publishedAt: '2026-08-16T00:00:00.000Z'
highlights:
  - 'Workspace Studio 플로우는 시작 조건 하나와 여러 단계, 단계 사이에서 값을 전달하는 변수로 구성됩니다.'
  - 처음에는 템플릿을 복사한 뒤 Gmail 요약이나 Drive 파일 저장처럼 결과를 확인하기 쉬운 업무부터 자동화하는 편이 좋습니다.
  - '플로우를 켜기 전 테스트 실행과 활동 기록을 확인하고, Gmail과 Drive에 접근하는 권한을 필요한 범위로 제한해야 합니다.'
metaTitle: 'Google Workspace Studio 사용법: Gmail, Sheets, Drive 자동화'
metaDescription: >-
  Google Workspace Studio는 Gmail, Drive, Sheets 업무를 Gemini로 자동화하는 도구입니다. 시작 조건,
  단계, 변수, 이메일 요약과 파일 저장 플로우를 설명합니다.
ogTitle: 'Google Workspace Studio 사용법: Gmail, Sheets, Drive 업무 자동화'
ogDescription: '코딩 없이 Gmail, Drive, Sheets를 연결하는 Workspace Studio의 플로우 구조와 실전 자동화 방법을 정리했습니다.'
ogImage: /og/google-workspace-studio-guide.png
quiz:
  - question: Google Workspace Studio에서 새 이메일이 도착했을 때 자동화를 시작하게 만드는 요소는 무엇일까요?
    options:
      - '시작 조건: 특정 이메일 수신이나 일정 같은 플로우 실행 조건을 정한다'
      - '변수: 이전 단계의 결과를 저장하고 플로우를 처음 실행한다'
      - '단계: 시작 시점을 정하지 않고 수행할 작업만 작성한다'
    correctIndex: 0
    explanation: >-
      시작 조건은 플로우를 실행하는 이벤트나 일정입니다. 특정 발신자의 이메일 수신, 첨부파일이 있는 새 메일, 매주 월요일 오전 9시
      같은 조건으로 플로우를 시작할 수 있습니다.
---

Gmail에서 받은 메일을 읽고, 첨부파일을 Drive에 저장하고, 팀 채팅에 알림을 보내는 업무를 매번 반복하는 경우가 있습니다. 한 번에 걸리는 시간은 짧아도 하루에 여러 번 실행하면 다른 업무를 끊는 원인이 됩니다.

Google Workspace Studio는 이런 반복 작업을 Gemini와 함께 자동화하는 도구입니다. Gmail, Drive, Docs, Sheets, Calendar, Chat, Forms, Tasks 같은 Workspace 서비스를 하나의 플로우로 연결할 수 있습니다.

Google AI Studio가 Gemini를 사용한 앱을 만드는 개발 환경이라면, Workspace Studio는 이미 사용하는 Google Workspace 안에서 업무 흐름을 자동화하는 공간입니다. 이 글에서는 Workspace Studio의 기본 구조와 접근 조건, 자연어로 플로우를 만드는 방법, 이메일 요약과 첨부파일 저장 사례를 정리합니다.

아래 이미지는 Google Workspace 공식 페이지에 공개된 Workspace Studio 소개 화면입니다. Gmail, Gemini, Chat과 함께 업무 자동화를 설명하는 프롬프트가 배치되어 있어 Workspace 앱 사이의 작업을 연결하는 구조를 보여줍니다.

![Gmail과 Google Workspace 아이콘, Gemini 프롬프트, 업무 자동화 예시가 함께 배치된 Google Workspace Studio 공식 소개 화면](/images/insights/google-workspace-studio-guide/workspace-studio-overview.webp)

이미지 출처: [Google Workspace Studio 공식 페이지](https://workspace.google.com/intl/ko/studio/)

## Google Workspace Studio는 무엇인가요?

Google Workspace Studio는 Google Workspace 안에서 반복 업무를 자동화하고, Gemini를 사용한 AI 에이전트형 플로우를 만들고 관리하는 도구입니다. 과거 Google Workspace Flows라는 이름으로 알파 버전이 제공되었고, 현재는 Workspace Studio라는 이름으로 안내됩니다.

쉽게 말하면 Workspace Studio는 **업무가 시작되는 조건과 뒤이어 할 일을 연결해 두는 자동화 서류철**입니다. 특정 이메일이 도착하면 요약하고, 그 결과를 Chat으로 보내고, 첨부파일을 Drive에 저장하는 식으로 여러 작업을 이어 붙일 수 있습니다.

Workspace Studio에서 할 수 있는 작업은 다음과 같습니다.

- Gmail에 특정 발신자의 메일이 도착하면 요약합니다.
- 이메일 첨부파일을 지정한 Drive 폴더에 저장합니다.
- Google Form 응답이 제출되면 Chat으로 알립니다.
- 정해진 시간에 읽지 않은 이메일을 요약합니다.
- Gemini가 문서에서 작업 항목을 뽑아 Docs나 Sheets에 기록합니다.
- Calendar 일정이나 Chat 스페이스 참여를 시작 조건으로 사용합니다.

Google 공식 도움말은 Workspace Studio를 프로그래밍 없이 Workspace 간 작업을 자동화하는 도구로 설명합니다. 다만 계정 종류와 관리자 설정에 따라 사용할 수 있는 앱과 기능은 달라질 수 있습니다.

## Google AI Studio와 Workspace Studio의 차이

두 도구 모두 Gemini라는 이름을 사용하지만 목적은 다릅니다. Google AI Studio는 Gemini API를 사용하는 앱과 프롬프트를 시험하는 개발 환경이고, Workspace Studio는 Gmail과 Drive 같은 기존 업무 도구 사이의 반복 과정을 자동화하는 환경입니다.

| 구분 | Google AI Studio | Google Workspace Studio |
|---|---|---|
| 주요 목적 | AI 앱 프로토타입과 API 테스트 | Workspace 업무 자동화 |
| 작업 대상 | 새로 만드는 웹 앱, Android 앱 | Gmail, Drive, Sheets, Docs 등 |
| 시작 방법 | 프롬프트로 앱 기능 설명 | 플로우의 시작 조건과 단계 설정 |
| 코드 필요 여부 | 생성 앱에 따라 코드 확인 필요 | 기본 플로우는 코딩 없이 구성 |
| 대표 사례 | Gemini를 이용한 대시보드 제작 | 이메일 요약과 Chat 알림 |
| 접속 환경 | AI Studio 웹사이트 | Workspace Studio 웹사이트와 Workspace 앱 |

이미 업무가 Gmail과 Drive 안에서 진행되고 있다면 Workspace Studio가 더 직접적인 선택이 될 수 있습니다. 반대로 별도의 웹서비스나 고객용 화면을 만들려면 Google AI Studio가 더 적합합니다.

## Workspace Studio 플로우의 기본 구조

Workspace Studio의 플로우는 세 가지 요소로 이해하면 쉽습니다.

- **시작 조건**: 플로우를 실행하는 이벤트나 일정입니다.
- **단계**: 시작 조건이 발생한 뒤 실행할 작업입니다.
- **변수**: 시작 조건이나 이전 단계에서 나온 값을 다음 단계로 전달합니다.

예를 들어 다음과 같은 플로우를 만들 수 있습니다.

| 순서 | 구성 요소 | 설정 예시 |
|---|---|---|
| 1 | 시작 조건 | 제목에 견적서가 포함된 새 Gmail 수신 |
| 2 | 단계 | 첨부파일을 Google Drive의 견적서 폴더에 저장 |
| 3 | 단계 | Gemini로 이메일 내용을 세 줄로 요약 |
| 4 | 변수 | 이메일 제목과 요약 결과를 다음 단계로 전달 |
| 5 | 단계 | Google Chat에 새 견적서 알림 전송 |

서류철 첫 장에 접수 조건을 적고 뒤쪽에 처리 순서를 적어 두는 것과 같습니다. 시작 조건은 플로우마다 하나만 설정하고, 그 뒤에 여러 단계를 붙입니다.

변수는 단계 사이에서 정보를 옮기는 역할을 합니다. 이메일 제목, 보낸 사람, 첨부파일 이름, Gemini가 만든 요약 결과를 다음 단계의 메시지나 문서에 넣을 때 사용합니다.

## Workspace Studio에 접속하기

Workspace Studio는 컴퓨터 브라우저에서 studio.workspace.google.com으로 접속합니다. Google 공식 도움말에 따르면 플로우를 만드는 작업은 지원되는 웹브라우저가 설치된 컴퓨터에서 진행하고, 한 번 사용 설정한 플로우는 다른 기기에서도 실행할 수 있습니다.

계정 조건은 2026년 8월 기준으로 다음과 같이 안내됩니다.

- **직장 또는 학교 계정**: Business Starter, Standard, Plus, Enterprise Standard, Enterprise Plus와 일부 Education 요금제에서 사용할 수 있습니다.
- **개인 계정**: Google Workspace Experiments가 필요할 수 있습니다.
- **관리자 설정**: 회사나 학교 계정은 관리자가 Gemini와 Workspace Studio를 허용해야 합니다.
- **앱 권한**: Gmail이나 Drive가 계정에서 사용 중지되어 있으면 해당 앱을 쓰는 템플릿이 보이지 않을 수 있습니다.
- **기기 조건**: 플로우를 만드는 작업은 컴퓨터 브라우저에서 진행합니다.

Workspace Studio가 보이지 않는다면 먼저 계정 유형과 관리자 설정을 확인해야 합니다. 개인 Google 계정으로 로그인했는데도 메뉴가 없다면 제공 조건이나 실험 기능 접근 여부가 맞지 않을 수 있습니다.

## 템플릿으로 첫 플로우 만들기

처음에는 빈 화면에서 플로우를 만드는 것보다 템플릿을 복사하는 편이 이해하기 쉽습니다. Workspace Studio의 디스커버 페이지에서는 앱이나 업무 유형에 맞는 플로우 템플릿을 찾을 수 있습니다.

Google 공식 시작 가이드가 예로 드는 플로우는 읽지 않은 이메일을 Gemini가 요약하고, 결과를 Google Chat으로 보내는 자동화입니다. 이 플로우를 복사한 뒤 다음 항목을 확인합니다.

1. 어떤 이메일을 읽을지 시작 조건을 확인합니다.
2. Gemini 요약 단계에서 사용할 입력값을 확인합니다.
3. Chat 메시지에 어떤 변수가 들어가는지 확인합니다.
4. 실행 시간을 조정합니다.
5. 테스트 실행으로 결과를 확인합니다.
6. 문제가 없을 때 플로우를 사용 설정합니다.

템플릿은 완성된 자동화라기보다 구조를 보여주는 출발점으로 보는 편이 좋습니다. Gmail 전체를 대상으로 설정된 플로우는 불필요한 메일까지 요약할 수 있으므로, 특정 발신자나 제목 단어를 조건에 넣어 범위를 좁히는 것이 안전합니다.

## Gemini로 자연어 플로우 만들기

Workspace Studio에서는 자동화하려는 일을 자연어로 설명해 Gemini가 플로우 초안을 만들게 할 수 있습니다. 좋은 결과를 얻으려면 다음 네 가지를 함께 적는 것이 좋습니다.

- 플로우가 시작되는 조건
- 사용할 Google Workspace 앱
- 실행할 단계의 순서
- 마지막에 받을 결과

예를 들어 다음처럼 요청할 수 있습니다.

~~~
특정 발신자가 보낸 이메일에 PDF 첨부파일이 있으면 플로우를 시작해 주세요.

1. 첨부파일을 Google Drive의 비공개 '계약서 검토' 폴더에 저장합니다.
2. 이메일 본문과 첨부파일 이름을 Gemini로 세 줄 요약합니다.
3. 이메일 제목, 보낸 사람, 요약 내용을 Google Chat의 '법무 검토' 스페이스에 알립니다.
4. 저장이나 알림에 실패하면 활동 기록에 오류를 남깁니다.

처음에는 이메일을 실제로 보내지 말고 테스트 실행으로 결과를 확인할 수 있게 구성해 주세요.
~~~

이처럼 시작 조건, 앱, 단계, 결과를 구체적으로 적으면 Gemini가 플로우 구조를 만들기 쉽습니다. 단순히 "이메일을 자동화해 줘"라고 입력하면 어떤 메일을 대상으로 할지, 결과를 어디에 보낼지 다시 정해야 합니다.

자연어로 만든 플로우도 바로 사용 설정하지 않는 편이 좋습니다. Gemini가 선택한 시작 조건과 단계가 실제 업무 범위에 맞는지 먼저 확인해야 합니다.

아래 이미지는 Google Workspace 공식 페이지의 자연어 자동화 프롬프트 화면입니다. "What would you like to automate?"라는 입력창에 자동화할 업무를 적고 Create 버튼으로 플로우 생성을 시작하는 구조입니다.

![What would you like to automate 입력창과 Create 버튼, Gmail과 Calendar 등 Workspace 앱 아이콘이 보이는 공식 화면](/images/insights/google-workspace-studio-guide/workspace-studio-prompt.webp)

이미지 출처: [Google Workspace Studio 공식 페이지](https://workspace.google.com/intl/ko/studio/)

## 처음부터 직접 플로우 구성하기

템플릿이나 Gemini가 만든 초안이 업무에 맞지 않으면 빈 플로우에서 직접 구성할 수 있습니다.

1. 컴퓨터에서 studio.workspace.google.com으로 이동합니다.
2. 새 플로우를 선택합니다.
3. 시작 조건을 클릭해 이벤트나 일정을 고릅니다.
4. 단계 선택을 눌러 수행할 작업을 추가합니다.
5. 플로우 이름을 정합니다.
6. 필요하면 변수로 이전 단계의 값을 다음 단계에 넣습니다.
7. 테스트 실행으로 결과를 확인합니다.
8. 문제가 없을 때 사용 설정을 선택합니다.

시작 조건은 보통 일정이나 이벤트입니다.

- 매주 월요일 오전 9시처럼 정해진 시간
- 특정 발신자에게서 새 이메일이 도착하는 이벤트
- 첨부파일이 있는 이메일 수신
- Google Form에 새 응답이 제출되는 이벤트
- Drive 폴더에 새 파일이 추가되는 이벤트
- Google Chat 스페이스에 새 사용자가 참여하는 이벤트

단계는 시작 조건 뒤에 실행할 작업입니다. Gemini로 요약하거나 답장 초안을 만들고, Drive에 파일을 저장하거나 Chat에 알림을 보내는 방식으로 이어집니다.

## Gmail과 Drive 자동화 사례

마케팅팀에서 광고 플랫폼이 보내는 주간 리포트 이메일을 자동으로 정리한다고 가정해 보겠습니다. 매주 월요일 오전에 이메일을 열고 첨부파일을 내려받은 뒤, 팀 채팅에 전달하는 업무입니다.

플로우는 다음처럼 구성할 수 있습니다.

| 순서 | 설정 |
|---|---|
| 시작 조건 | 특정 발신자에게서 제목에 주간 리포트가 포함된 이메일 수신 |
| 1단계 | 첨부파일을 Drive의 광고 리포트 폴더에 저장 |
| 2단계 | Gemini로 이메일 본문과 파일명을 요약 |
| 3단계 | Google Sheets에 날짜, 캠페인명, 파일 링크 기록 |
| 4단계 | Google Chat에 새 리포트 도착 알림 |
| 예외 | 첨부파일이 없으면 저장 단계를 건너뛰고 오류 알림 |

이 플로우에서 시작 조건을 모든 이메일 수신으로 설정하면 광고 리포트가 아닌 메일까지 처리할 수 있습니다. 제목, 발신자, 첨부파일 여부를 함께 제한해야 실제 업무 범위에 맞게 작동합니다.

또한 Gemini가 만든 요약은 담당자가 확인할 수 있어야 합니다. 요약 결과를 바로 외부 고객에게 보내기보다, 먼저 Chat 알림이나 Docs 초안으로 보내는 방식이 검토 단계에 적합합니다.

## 조건 확인과 변수 활용

조건 확인 단계는 특정 조건이 맞을 때만 다음 작업을 진행하게 합니다. 예를 들어 이메일 제목에 인보이스가 포함되어 있을 때만 첨부파일을 재무 폴더에 저장할 수 있습니다.

조건은 다음처럼 만들 수 있습니다.

- 이메일 제목에 특정 단어가 포함되는지 확인합니다.
- 발신자 주소가 지정된 주소와 같은지 확인합니다.
- 첨부파일이 있는지 확인합니다.
- 이전 단계의 결과가 비어 있지 않은지 확인합니다.
- 금액이나 날짜가 정해진 조건에 맞는지 확인합니다.

변수는 한 단계의 값을 다른 단계에 넣을 때 사용합니다. 이메일 제목을 Chat 알림에 넣거나, Gemini의 요약 결과를 Google Docs에 추가하는 방식입니다.

조건과 변수는 플로우를 복잡하게 만드는 기능처럼 보이지만, 실제로는 불필요한 실행을 줄이고 결과의 누락을 확인하는 데 필요합니다. 모든 이메일을 AI에게 보내는 구조보다, 필요한 이메일만 조건으로 골라 다음 단계로 넘기는 구조가 비용과 오류를 줄이기 쉽습니다.

## 테스트 실행과 활동 기록 확인

플로우를 만들었다면 바로 사용 설정하지 말고 테스트 실행을 먼저 진행합니다. 테스트에서는 시작 조건에 맞는 샘플 데이터가 각 단계로 어떻게 전달되는지 확인합니다.

확인할 항목은 다음과 같습니다.

- 예상한 이메일만 시작 조건에 걸리는지 확인합니다.
- 첨부파일이 올바른 Drive 폴더에 저장되는지 확인합니다.
- Gemini 요약에 필요한 본문이나 파일 정보가 전달되는지 확인합니다.
- Google Chat 메시지에 제목과 요약이 제대로 표시되는지 확인합니다.
- 조건에 맞지 않는 이메일이 다음 단계로 넘어가지 않는지 확인합니다.
- 실패한 단계와 오류 메시지가 활동 기록에 남는지 확인합니다.

Workspace Studio에는 활동 탭이 있어 플로우 실행 결과와 오류를 확인할 수 있습니다. 실행이 너무 자주 일어나거나 잘못된 데이터가 들어오면 플로우가 중지될 수 있으므로, 문제가 생겼을 때는 활동 기록부터 확인하는 편이 좋습니다.

Google 공식 도움말은 프롬프트 인젝션 공격 가능성이 감지되거나 사용량 한도에 도달한 경우 플로우 실행이 중지될 수 있다고 안내합니다. 이메일이나 외부 문서의 내용을 AI 단계에 전달하는 플로우라면, 원문에 포함된 지시가 자동화 규칙을 바꾸지 않는지 확인해야 합니다.

## Workspace Studio의 한도와 주의점

Google 공식 도움말에 따르면 2026년 8월 기준 Workspace Studio에는 다음 한도가 안내되어 있습니다.

- 생성할 수 있는 플로우는 최대 25개입니다.
- 하나의 플로우에는 최대 20개의 단계를 구성할 수 있습니다.
- Gmail 이벤트로 시작하는 활성 플로우는 최대 25개입니다.
- 일일 실행 횟수에는 계정과 환경에 따른 한도가 적용됩니다.

한도는 변경될 수 있습니다. 특히 일정 기반 플로우를 너무 자주 실행하면 하루 실행 한도에 빨리 도달할 수 있습니다. 꼭 실시간일 필요가 없는 업무라면 1분마다 실행하는 대신 한 시간에 한 번으로 줄이는 편이 안정적입니다.

권한도 확인해야 합니다.

- Gmail과 Calendar 내용이 외부 통합 서비스로 전달될 수 있는지 확인합니다.
- 공유 Drive나 공유 폴더를 사용하는 플로우는 제한으로 실패할 수 있습니다.
- 개인 계정과 회사 계정의 사용 조건이 다를 수 있습니다.
- 회사 계정의 플로우는 관리자 정책에 따라 보이지 않을 수 있습니다.
- 외부로 이메일을 보내는 단계는 초안 작성으로 시작하는 편이 안전합니다.

특히 삭제, 외부 발송, 권한 변경처럼 되돌리기 어려운 작업은 처음부터 자동 실행하지 않는 편이 좋습니다. AI가 판단하는 단계는 요약이나 분류처럼 검토 가능한 작업부터 시작하고, 사람의 확인 뒤에 최종 실행을 배치하는 방식이 안전합니다.

## Google Workspace Studio는 어떤 업무에 적합한가요?

Workspace Studio는 일정한 조건이 생기고, 정해진 순서로 여러 앱을 거쳐야 하는 업무에 적합합니다.

- 반복되는 이메일 요약
- 첨부파일의 Drive 저장
- Forms 응답 알림
- 회의록에서 작업 항목 추출
- 정기적인 보고서 수집
- 고객 문의 분류와 담당자 알림
- Calendar 일정 생성 전 초안 확인
- Sheets의 새 행을 Chat 메시지로 전달

반대로 매번 판단 기준이 크게 달라지거나, 최종 결과에 법적 책임이 있는 업무는 완전 자동 실행보다 초안과 알림 단계에서 멈추도록 구성하는 편이 좋습니다.

## 자주 묻는 질문

### Google Workspace Studio는 개인 계정에서도 사용할 수 있나요?

개인 계정에서도 사용할 수 있는 경로가 있지만, Google 공식 도움말은 Google Workspace Experiments가 필요할 수 있다고 안내합니다. 직장이나 학교 계정은 지원되는 Workspace 요금제와 관리자의 Gemini 및 Studio 설정이 필요합니다.

### Workspace Studio와 Zapier, Make는 같은 도구인가요?

반복 업무를 연결한다는 점은 비슷하지만, Workspace Studio는 Gmail, Drive, Docs, Sheets 같은 Google Workspace 안에서 작동하도록 설계된 도구입니다. Zapier나 Make는 더 많은 외부 서비스 연결을 제공할 수 있으므로, 사용하는 앱과 필요한 조건을 기준으로 선택해야 합니다.

### Workspace Studio 플로우를 만들면 바로 모든 이메일이 처리되나요?

그렇지 않습니다. 시작 조건에서 특정 발신자, 제목, 첨부파일 여부, 시간 조건 등을 설정해야 합니다. 조건을 넓게 잡으면 원하지 않는 이메일까지 처리할 수 있으므로, 테스트 실행과 활동 기록을 먼저 확인해야 합니다.

## 정리하며

Google Workspace Studio는 Gmail, Drive, Sheets, Docs 같은 Workspace 앱 사이의 반복 업무를 Gemini와 함께 자동화하는 도구입니다. 플로우는 시작 조건 하나와 여러 단계, 단계 사이의 값을 전달하는 변수로 구성됩니다.

처음에는 읽지 않은 이메일 요약이나 첨부파일 Drive 저장처럼 결과를 확인하기 쉬운 업무부터 시작하는 편이 좋습니다. 템플릿을 복사하거나 자연어로 초안을 만든 뒤, 테스트 실행과 활동 기록을 확인하고 사용 설정을 진행하면 됩니다.

**3줄 요약:**

- Google Workspace Studio는 Gmail, Drive, Sheets, Docs 등의 반복 업무를 Gemini와 함께 자동화하는 도구입니다.
- 플로우는 시작 조건, 단계, 변수로 구성되며 자연어 설명이나 템플릿으로 만들 수 있습니다.
- 자동 실행 전에는 권한, 조건, 오류, 사용량 한도를 확인하고 외부 발송이나 삭제 작업은 사람의 검토 단계를 두는 편이 안전합니다.

**Sources:**

- [Google Workspace Studio 공식 페이지](https://workspace.google.com/intl/ko/studio/)
- [Google Workspace Studio 시작하기](https://support.google.com/workspace-studio/answer/16444479?hl=ko)
- [Google Workspace Studio에 액세스하기](https://support.google.com/workspace-studio/answer/16782648?hl=ko)
- [Workspace Studio의 시작 조건 및 단계 가이드](https://support.google.com/workspace-studio/table/17176961?hl=ko)
- [Workspace Studio에서 Gemini AI로 플로우 만들기](https://support.google.com/workspace-studio/answer/16448469?hl=ko)
- [Workspace Studio 플로우 관련 문제 해결](https://support.google.com/workspace-studio/answer/16430806?hl=ko)
- [Google Workspace Studio 한도](https://support.google.com/workspace-studio/answer/16765942?hl=ko)
