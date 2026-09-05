---
slug: google-ai-studio-guide
title: 'Google AI Studio 사용법: Gemini로 앱과 웹 만들기'
excerpt: >-
  Google AI Studio는 Gemini 모델을 시험하고 자연어로 웹 앱과 Android 앱을 만드는 개발 환경입니다. 처음 접하는 분을
  위해 Playground와 Build의 차이, 앱 제작 순서, API 키와 배포 시 주의할 점을 정리했습니다.
category: AI_TECH
topicCluster: google-ai-development
contentType: guide
journeyStage: beginner
nextSlugs:
  - gemini-cli-install-guide
relatedSlugs:
  - google-workspace-studio-guide
  - vibe-coding-vs-ai-agent-difference
  - localhost-vibe-coding-beginner-guide
tags:
  - AI
  - 자동화
  - 바이브코딩
publishedAt: '2026-08-16T00:00:00.000Z'
highlights:
  - >-
    처음에는 Playground에서 Gemini 모델과 프롬프트를 시험한 뒤, 앱으로 만들 아이디어만 Build에서 작업하는 편이
    효율적입니다.
  - 'Build로 만든 앱의 API 키는 Secrets에 보관하고, 클라이언트 코드에 직접 넣지 않아야 합니다.'
  - '완성한 앱은 ZIP이나 GitHub로 내보내거나 Cloud Run으로 배포할 수 있지만, 사용량과 배포 비용은 별도로 확인해야 합니다.'
metaTitle: 'Google AI Studio 사용법: Gemini로 앱과 웹 만들기'
metaDescription: >-
  Google AI Studio는 Gemini 모델을 시험하고 자연어로 웹 앱과 Android 앱을 만드는 개발 환경입니다.
  Playground, Build, API 키, 배포 방법을 초보자 눈높이로 정리합니다.
ogDescription: '프롬프트로 Gemini 앱을 만들고, 코드 확인부터 API 키 보관과 배포까지 Google AI Studio 사용법을 정리했습니다.'
ogImage: /og/google-ai-studio-guide.png
quiz:
  - question: >-
      Google AI Studio Build에서 Gemini API를 사용하는 앱을 만들 때 API 키를 안전하게 보관하는 방법은
      무엇일까요?
    options:
      - Settings의 Secrets에 저장하고 서버 측 코드에서 사용한다
      - 브라우저에서 누구나 볼 수 있도록 HTML 파일에 직접 입력한다
      - 프롬프트 마지막 줄에 API 키를 적어 둔다
    correctIndex: 0
    explanation: >-
      Google AI Studio Build는 Gemini API 키를 서버 측 환경의 Secret으로 구성하는 방식을 안내합니다.
      브라우저에서 실행되는 클라이언트 코드에 키를 직접 넣으면 다른 사람이 확인할 수 있으므로, 민감한 값은 Secrets와 서버 측
      코드에서 관리해야 합니다.
summary3:
  - 'Google AI Studio는 제미나이 모델을 시험하고 자연어로 웹 앱과 안드로이드 앱을 만드는 브라우저 개발 환경입니다.'
  - 'Playground에서 모델과 프롬프트 조합을 먼저 시험한 뒤 앱으로 만들 아이디어만 Build로 옮기는 편이 효율적입니다.'
  - 'Build로 만든 앱의 API 키는 Secrets에 두고 클라이언트 코드에 직접 넣지 않으며 배포 비용은 따로 확인합니다.'
---

Google AI Studio에 들어가면 Gemini에게 질문하는 화면과 앱을 만드는 화면이 함께 보입니다. 처음에는 일반적인 Gemini 채팅 서비스와 무엇이 다른지 헷갈릴 수 있습니다.

Gemini 앱이 질문과 답변을 위한 서비스라면, Google AI Studio는 Gemini 모델을 시험하고 그 기능을 다른 프로그램에 연결하는 작업 공간입니다. 프롬프트를 여러 번 바꿔 보거나, 응답 형식과 안전 설정을 조정하거나, 아예 자연어로 웹 앱을 만들 수 있습니다.

이 글에서는 Google AI Studio의 두 가지 사용법을 나눠 설명합니다. 먼저 Playground에서 모델을 시험하는 흐름을 보고, 이어서 Build에서 프롬프트로 웹 앱을 만드는 과정을 정리합니다.

아래 이미지는 Google Developers Codelabs에 공개된 Google AI Studio Build 화면입니다. 왼쪽에는 Build 메뉴와 프로젝트 목록이 있고, 가운데에는 앱 아이디어를 입력하는 창과 바로 시작할 수 있는 기능 카드가 배치되어 있습니다.

![Google AI Studio Build 시작 화면에 앱 아이디어 입력창과 Nano Banana, 음성 앱, Veo, Google 검색 데이터 기능 카드가 보이는 공식 화면](/images/insights/google-ai-studio-guide/build-mode-official.png)

이미지 출처: [Google Developers Codelabs, Gemini for Developers](https://codelabs.developers.google.com/gemini-for-developers)

## Google AI Studio는 무엇인가요?

Google AI Studio는 Google의 Gemini 모델을 시험하고, Gemini API를 사용하는 애플리케이션을 만들 수 있는 브라우저 기반 환경입니다. Google은 AI Studio를 Gemini를 사용한 개발을 시작하는 빠른 방법으로 소개하고 있습니다.

쉽게 설명하면 AI Studio는 **Gemini를 시험하는 작업대와 앱 제작 도구를 한곳에 모은 서비스**입니다. 완성된 채팅 서비스만 사용하는 대신, 모델을 선택하고 지시문을 바꾸면서 결과가 어떻게 달라지는지 확인할 수 있습니다.

AI Studio에서는 다음과 같은 작업을 할 수 있습니다.

- **프롬프트 테스트**: 같은 질문에 여러 지시문을 적용하고 응답을 비교합니다.
- **모델 설정 조정**: 모델 매개변수, 안전 설정, 응답 형식과 도구를 조정합니다.
- **코드 확인**: 만든 프롬프트를 Gemini API 호출 코드로 변환합니다.
- **앱 제작**: Build에서 자연어로 웹 앱이나 Android 앱의 기능을 설명하고 코드를 생성합니다.

여기서 Gemini 앱과 AI Studio를 구분할 필요가 있습니다. Gemini 앱은 최종 사용자가 대화와 작업을 수행하는 서비스에 가깝고, AI Studio는 개발자가 모델과 앱을 시험하는 환경에 가깝습니다.

| 구분 | Gemini 앱 | Google AI Studio |
|---|---|---|
| 주요 목적 | 질문, 검색, 문서 작업 | 모델 시험, 프롬프트 작성, 앱 제작 |
| 사용 방식 | 완성된 화면에서 대화 | 모델과 설정을 직접 선택 |
| 코드 확인 | 일반적으로 제공하지 않음 | API 코드 확인과 내보내기 가능 |
| 앱 제작 | 제한적인 맞춤 기능 | Build에서 웹 앱과 Android 앱 제작 |
| 주요 대상 | 일반 사용자 | 개발자, 마케터, 기획자, 학습자 |

## Playground에서 Gemini 모델 시험하기

Playground는 Gemini에게 질문을 보내고 모델의 응답을 확인하는 화면입니다. 아직 앱을 만들 생각이 없더라도, 어떤 모델과 프롬프트 조합이 업무에 맞는지 확인할 때 사용할 수 있습니다.

Google AI Studio를 열고 왼쪽 메뉴에서 **Playground**를 선택합니다. 화면 아래쪽 입력창에 질문을 적고 실행하면, 가운데 영역에 응답이 표시됩니다. 오른쪽의 Run settings에서는 모델과 시스템 지시문, 사고 수준, 도구 설정을 조정할 수 있습니다.

![Google AI Studio Playground에서 Gemini 모델을 선택하고 시스템 지시문과 구조화된 출력, 코드 실행, Google 검색 기반 기능을 설정하는 공식 화면](/images/insights/google-ai-studio-guide/8e814b6f6bf27d1f.png)

이미지 출처: [Google Developers Codelabs, Gemini for Developers](https://codelabs.developers.google.com/gemini-for-developers)

### 모델 선택과 시스템 지시문

모델 선택은 답변의 속도와 작업 성격에 영향을 줍니다. 단순한 분류나 짧은 초안은 빠른 모델로 시험하고, 긴 문서 분석이나 복잡한 코드 작업은 더 높은 성능의 모델로 확인하는 방식이 일반적입니다. 실제 모델 이름과 제공 여부는 계정과 시점에 따라 달라질 수 있습니다.

시스템 지시문은 대화 전체에 적용할 기본 규칙입니다. 예를 들어 다음처럼 작성할 수 있습니다.

```
디지털 마케팅 데이터를 분석하는 담당자입니다.
답변은 표와 세 줄 요약으로 작성합니다.
확인할 수 없는 수치는 추측하지 않고 추가 자료가 필요하다고 말합니다.
```

사용자 프롬프트에 매번 같은 규칙을 반복해서 넣는 대신, 시스템 지시문에 공통 기준을 저장하면 결과를 비교하기 쉽습니다.

### Run settings의 주요 기능

Google AI Studio의 Run settings에는 모델별로 사용할 수 있는 여러 조정 항목이 있습니다.

- **구조화된 출력**: JSON처럼 정해진 형식으로 응답하게 합니다.
- **코드 실행**: 계산이나 데이터 처리에 필요한 코드를 실행하게 합니다.
- **함수 호출**: 모델의 응답을 외부 프로그램의 함수와 연결합니다.
- **Google 검색 기반 기능**: 최신 정보가 필요한 질문에 검색 결과를 참고하게 합니다.
- **URL context**: 지정한 웹페이지의 내용을 모델 입력에 포함합니다.

모든 도구를 켠다고 답변이 좋아지는 것은 아닙니다. 계산이 필요한 질문에는 코드 실행을, 최신 자료가 필요한 질문에는 검색 기반 기능을 선택하는 식으로 작업 목적에 맞춰야 합니다.

## Playground에서 앱 제작으로 이어지는 흐름

Playground는 모델의 반응을 확인하는 곳이고, Build는 그 반응을 실제 앱의 기능으로 확장하는 곳입니다. 예를 들어 다음과 같은 순서로 사용할 수 있습니다.

1. Playground에서 고객 문의를 분류하는 프롬프트를 작성합니다.
2. 시스템 지시문에 분류 기준과 답변 형식을 적습니다.
3. 예시 문의를 넣어 결과가 일정한지 확인합니다.
4. 코드 받기 기능으로 API 호출 구조를 확인합니다.
5. 화면과 데이터 입력이 필요한 경우 Build에서 앱으로 확장합니다.

Google의 빠른 시작 문서도 AI Studio에서 프롬프트를 시험한 뒤, 준비가 되면 **Get code**로 원하는 프로그래밍 언어의 Gemini API 코드를 확인하는 흐름을 안내합니다.

이 단계는 앱 제작 전에 모델의 역할을 좁히는 데 도움이 됩니다. 처음부터 "고객센터 앱을 만들어 줘"라고 요청하는 것보다, 먼저 분류 기준과 출력 형식을 시험하면 Build에서 수정해야 할 부분을 줄일 수 있습니다.

## Build에서 웹 앱 만들기

Build는 자연어로 앱의 목적과 기능을 설명하면 Gemini가 코드와 파일을 생성하는 영역입니다. Google 공식 문서에 따르면 기본 웹 앱은 클라이언트 화면과 Node.js 서버 측 실행 환경을 포함할 수 있습니다.

Build를 시작하는 방법은 몇 가지입니다.

- Build 화면의 입력창에 앱 설명을 직접 적습니다.
- AI Chips에서 이미지 생성이나 Google Maps 같은 기능을 추가합니다.
- App Gallery의 프로젝트를 복사해 수정합니다.
- GitHub의 기존 프로젝트를 가져옵니다.

처음 만들 앱은 기능을 작게 정하는 편이 좋습니다. 예를 들어 "마케팅 대시보드"라고만 쓰면 결과 범위가 넓어집니다. 다음처럼 화면, 입력값, 결과를 함께 적으면 작업 범위를 좁힐 수 있습니다.

```
광고 캠페인 CSV 파일을 업로드하면 캠페인별 비용, 클릭 수, 전환 수를 표로 보여주는 웹 앱을 만들어 주세요.

필수 기능:
1. CSV 업로드
2. 캠페인별 합계와 평균 계산
3. 전환율 계산
4. 비용이 높은 캠페인을 색상으로 표시
5. 모바일 화면에서도 읽기 쉬운 표 구성

먼저 화면 구조와 데이터 처리 방법을 설명한 뒤 앱을 만들어 주세요.
```

입력한 프롬프트를 실행하면 AI Studio가 프로젝트 파일을 만들고, 화면 오른쪽에 앱 미리보기를 표시합니다. 이후 채팅창에 수정 사항을 추가로 요청하거나 Code 탭에서 직접 코드를 확인할 수 있습니다.

## Build가 생성하는 앱의 구조

Build에서 기본으로 생성하는 웹 앱은 단순한 HTML 조각에 그치지 않습니다. 공식 문서가 설명하는 구성은 다음과 같습니다.

- **클라이언트**: 화면과 사용자 입력을 담당합니다. React가 기본 프레임워크로 사용됩니다.
- **서버**: Node.js 런타임에서 API 호출과 서버 작업을 처리합니다.
- **패키지**: 필요한 npm 패키지를 요청하면 에이전트가 설치와 연결을 처리할 수 있습니다.
- **Secrets**: API 키와 같은 민감한 값을 서버 측 환경에 저장합니다.
- **Firebase 연동**: 필요한 경우 Firestore와 Google 로그인 구성을 추가할 수 있습니다.
- **Workspace 연동**: Gmail, Sheets, Docs, Drive, Calendar 같은 Google Workspace API를 앱에 연결할 수 있습니다.

다만 이 목록이 앱마다 모두 자동으로 활성화된다는 뜻은 아닙니다. 어떤 기능을 요청했고 어떤 설정을 선택했는지에 따라 생성되는 파일과 연결 서비스가 달라집니다.

## API 키와 Secrets 관리

Gemini API를 사용하는 앱에서 가장 먼저 확인해야 할 부분은 API 키입니다. API 키는 서비스를 호출할 수 있는 인증 정보이므로 코드 저장소나 브라우저에 노출되면 안 됩니다.

Google AI Studio Build는 새 앱에서 Gemini API를 사용할 때 API 키를 서버 측 Secret으로 구성하는 방식을 안내합니다. 설정 메뉴의 Secrets에서 키를 확인하고 관리할 수 있으며, API 호출은 서버 측 코드에서 수행하도록 구성됩니다.

다음 원칙을 지키는 것이 안전합니다.

- API 키를 React 컴포넌트나 HTML 파일에 직접 입력하지 않습니다.
- GitHub에 올리는 파일에 키 문자열을 적지 않습니다.
- 외부 API 키는 AI Studio의 Secrets에 저장합니다.
- 키가 노출되었다면 해당 키를 폐기하고 새 키를 발급합니다.
- 공유나 배포 전에 어떤 사용자가 API 호출 비용을 부담하는지 확인합니다.

기존 프로젝트를 ZIP으로 내려받아 다른 호스팅 환경에서 실행할 때는 해당 호스팅 서비스에 `GEMINI_API_KEY` 환경 변수를 별도로 등록해야 할 수 있습니다. AI Studio 안에서 자동으로 설정된 값이 외부 환경까지 따라가는 것은 아닙니다.

## 생성한 앱 검수 순서

AI가 파일 여러 개를 한 번에 만들었다고 해서 바로 공개할 수 있는 상태라는 뜻은 아닙니다. 다음 순서로 확인하는 편이 안전합니다.

1. **화면 확인**: 버튼, 입력창, 오류 메시지가 의도한 위치에 있는지 봅니다.
2. **실제 데이터 확인**: 빈 파일, 큰 파일, 잘못된 형식의 입력을 넣어 봅니다.
3. **코드 확인**: API 키와 개인정보가 클라이언트 파일에 들어가지 않았는지 확인합니다.
4. **권한 확인**: Gmail, Drive, Sheets 같은 외부 서비스 연결이 필요한 범위만 열려 있는지 봅니다.
5. **비용 확인**: 유료 모델과 Cloud Run 배포가 연결되어 있는지 확인합니다.
6. **내보내기 전 확인**: ZIP이나 GitHub로 옮기기 전에 환경 변수 목록과 실행 방법을 기록합니다.

AI Studio의 미리보기는 검수 과정에 도움이 되지만, 실제 서비스 환경의 모든 오류를 대신 확인하지는 않습니다. 특히 로그인, 결제, 개인정보, 외부 API가 들어간 앱은 사람이 직접 테스트해야 합니다.

## 앱 공유와 배포

완성한 앱은 여러 방식으로 다음 작업을 이어 갈 수 있습니다.

| 방식 | 적합한 상황 | 확인할 점 |
|---|---|---|
| AI Studio 안에서 공유 | 시연, 피드백 수집 | 공유한 사람이 코드를 보고 복사할 수 있음 |
| ZIP 다운로드 | 로컬 개발, 다른 호스팅으로 이동 | 외부 환경에 API 키와 환경 변수 설정 필요 |
| GitHub 내보내기 | 버전 관리, 협업 | 저장소에 비밀 값이 들어가지 않았는지 확인 |
| Cloud Run 배포 | 공개 URL로 서비스 | Google Cloud 사용량과 비용 확인 |

Google 공식 문서에 따르면 Build 앱은 Cloud Run으로 배포할 수 있고, ZIP으로 내려받거나 GitHub로 내보낼 수도 있습니다. Cloud Run 배포에는 사용량에 따른 비용이 생길 수 있고, 공유한 앱에서도 API 호출이 사용량에 포함될 수 있습니다.

초보자라면 먼저 AI Studio 안에서 미리보기와 공유 기능을 사용해 흐름을 확인한 뒤, 실제 공개가 필요할 때 배포를 검토하는 편이 좋습니다. 공개 URL이 생겼다는 이유만으로 로그인과 결제까지 바로 연결할 필요는 없습니다.

## Google AI Studio를 업무에 활용하는 방법

Google AI Studio는 단순한 코드 생성기보다, 반복 업무를 작은 앱으로 시험하는 환경으로 사용할 수 있습니다. 마케팅 실무에서는 다음과 같은 시작점이 있습니다.

- 광고 리포트 CSV를 업로드하면 캠페인별 핵심 지표를 계산하는 앱
- 여러 광고 문구를 입력하면 브랜드 문체와 금칙어를 검사하는 앱
- 설문 응답을 넣으면 자유 응답을 주제별로 분류하는 앱
- 상품 설명을 입력하면 검색용 제목과 메타 설명 초안을 만드는 앱
- 회의록을 넣으면 담당자와 마감일을 표로 추출하는 앱

예를 들어 광고 리포트 앱을 만든다면 처음부터 Google Ads API를 연결하지 않아도 됩니다. CSV 업로드와 계산 기능만 먼저 만들고, 결과가 맞는지 확인한 뒤에 API 연결을 추가하는 편이 오류 원인을 찾기 쉽습니다.

프롬프트에도 작업 순서를 적어 두는 것이 좋습니다.

```
1. 먼저 현재 프로젝트의 파일 구조를 설명합니다.
2. CSV의 열 이름과 자료형을 확인합니다.
3. 계산식을 표로 정리합니다.
4. 화면을 만든 뒤 테스트용 CSV로 결과를 검증합니다.
5. 문제가 없을 때만 추가 기능을 제안합니다.
```

이렇게 요청하면 앱이 생성되는 과정과 결과를 함께 확인할 수 있습니다. 기능을 한 번에 많이 넣기보다, 입력 하나와 결과 하나가 명확한 작은 앱부터 시작하는 방식이 관리하기 쉽습니다.

## Google AI Studio는 무료인가요?

Google AI Studio의 사용 가능 범위와 Gemini API의 사용량, Build 앱의 배포 비용은 서로 다른 항목으로 확인해야 합니다. 무료로 시험할 수 있는 모델과 한도가 있더라도, 모델과 기능에 따라 제한이 달라질 수 있습니다.

특히 다음 상황에서는 비용이 생길 수 있습니다.

- 유료 Gemini API 모델을 호출할 때
- 공유한 앱의 사용자가 Gemini API를 호출할 때
- Cloud Run에 앱을 배포하고 서버 자원을 사용할 때
- 외부 API나 데이터베이스를 연결해 별도 사용량이 발생할 때

Google AI Studio 화면과 공식 가격표에서 현재 계정의 한도와 모델별 비용을 확인하는 것이 정확합니다. 가격이나 무료 한도는 변경될 수 있으므로, 이 글에서는 특정 금액을 고정해 적지 않았습니다.

## 자주 묻는 질문

### Google AI Studio와 Gemini 앱은 같은 서비스인가요?

같은 Gemini 모델 생태계를 사용하지만 목적이 다릅니다. Gemini 앱은 질문과 답변을 위한 완성형 서비스이고, Google AI Studio는 모델 테스트, 프롬프트 조정, API 코드 확인과 앱 제작을 위한 환경입니다.

### 코딩을 몰라도 Google AI Studio Build를 쓸 수 있나요?

간단한 웹 앱의 첫 버전을 만드는 데는 자연어 프롬프트만 사용할 수 있습니다. 다만 로그인, 결제, 개인정보, 외부 API가 들어가면 생성된 코드와 권한 구조를 확인할 수 있어야 하며, 오류를 수정하려면 HTML, JavaScript, React, API의 기본 개념이 도움이 됩니다.

### Build로 만든 앱을 바로 서비스해도 되나요?

바로 공개하기보다 화면, 입력 오류, 권한, API 키, 비용을 먼저 확인해야 합니다. Google 공식 문서도 앱 소유자에게 앱의 동작과 처리하는 데이터 책임이 있다고 안내합니다.

## 정리하며

Google AI Studio는 Gemini 모델을 시험하는 Playground와 자연어로 앱을 만드는 Build를 함께 제공하는 개발 환경입니다. Gemini 앱에서 질문하는 데서 멈추지 않고, 특정 업무에 맞는 작은 도구를 만들어 볼 수 있습니다.

처음에는 Playground에서 프롬프트와 모델을 확인하고, 기능이 정리되면 Build에서 화면과 데이터 흐름을 만들면 됩니다. API 키는 Secrets에 보관하고, 공유와 배포 단계에서는 사용량과 비용을 함께 확인해야 합니다.

**Sources:**

- [Google AI Studio 공식 시작 페이지](https://ai.google.dev/aistudio)
- [Google AI Studio 빠른 시작](https://ai.google.dev/gemini-api/docs/ai-studio-quickstart)
- [Google AI Studio에서 앱 만들기](https://ai.google.dev/gemini-api/docs/aistudio-build-mode)
- [Google AI Studio에서 풀스택 앱 개발하기](https://ai.google.dev/gemini-api/docs/aistudio-fullstack)
- [Google AI Studio에서 앱 배포하기](https://ai.google.dev/gemini-api/docs/aistudio-deploying)
- [Google Developers Codelabs, Gemini for Developers](https://codelabs.developers.google.com/gemini-for-developers)
