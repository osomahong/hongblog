---
slug: aws-bedrock-agentcore-n8n
title: 'AWS AgentCore와 n8n 연동 정리: 기억하는 AI 에이전트를 노코드로 만드는 방법'
excerpt: >-
  Amazon Bedrock AgentCore는 AWS가 AI 에이전트의 기억, 도구 사용, 실행 과정을 대신 관리해 주는 운영 서비스입니다.
  n8n 커뮤니티 노드로 시각적 편집기 안에서 쓸 수 있게 된 AgentCore의 구조, 설치 순서, 비용, 시작 전 준비물을 정리했습니다.
category: AI_TECH
tags:
  - AI
  - 자동화
  - 노코드
publishedAt: '2026-08-06T00:00:00.000Z'
highlights:
  - 'AWS 계정, IAM 권한, 실행 역할부터 준비한 뒤에 n8n 노드를 설치합니다.'
  - 전사 자동화 대신 반복 업무 하나로 시작해 비용이 어떻게 쌓이는지부터 확인합니다.
quiz:
  - question: 노코드 사용자가 AgentCore 같은 관리형 에이전트 서비스를 도입할 때 첫 단계로 무엇이 적절할까요?
    options:
      - 반복되는 업무 하나를 골라 공식 예제 워크플로를 변형해 본다
      - 전사 자동화 계획을 먼저 세우고 승인받는다
      - 제공되는 예제 아홉 개를 전부 설치해 본다
      - 노드 대신 처음부터 코드로 에이전트를 만든다
    correctIndex: 0
    explanation: >-
      관리형 에이전트 서비스는 실행한 리소스만큼 비용이 쌓이므로, 작은 업무 하나로 비용과 결과 품질을 먼저 확인하는 편이 안전합니다.
      공식 예제 워크플로가 아홉 개 제공되므로 빈 화면에서 시작하지 않고 가까운 예제를 변형하는 쪽이 시행착오를 줄입니다.
metaTitle: 'AWS AgentCore n8n 연동 정리: 설치, 기능, 비용'
metaDescription: >-
  Amazon Bedrock AgentCore는 AWS가 AI 에이전트의 기억, 도구 사용, 실행 과정을 대신 관리해 주는 운영 서비스입니다.
  n8n 커뮤니티 노드 설치 순서와 지원 모델, 비용, 시작 전 준비물을 정리했습니다.
ogTitle: 'AWS AgentCore와 n8n 연동 정리: 기억하는 AI 에이전트를 노코드로 만드는 방법'
ogDescription: >-
  Amazon Bedrock AgentCore는 AWS가 AI 에이전트의 기억, 도구 사용, 실행 과정을 대신 관리해 주는 운영 서비스입니다.
  n8n 노드 설치, 지원 모델, 비용, 준비물을 정리했습니다.
ogImage: /og/aws-bedrock-agentcore-n8n.png
---

Amazon Bedrock AgentCore는 AWS가 AI 에이전트의 기억, 도구 사용, 실행 과정을 대신 관리해 주는 운영 서비스입니다. 2026년 6월에 핵심 기능인 harness(하네스, 에이전트 실행에 필요한 부품을 한데 묶어 관리하는 런타임)가 정식 공개됐고, AWS가 직접 만든 커뮤니티 노드가 이 기능을 n8n 시각적 편집기 안으로 가져왔습니다.

준이아빠블로그에서 n8n을 다룬 것은 이번이 두 번째입니다. [비개발자에게 n8n이 도움이 되는지 정리한 글](/insights/n8n-for-non-developers)에서는 학습량과 현실적인 장단점을 다뤘습니다. 이번에는 그 위에 올라온 변화 하나를 봅니다. 코드를 거의 쓰지 않고도 기억하는 에이전트를 n8n 워크플로에 붙일 수 있게 된 일입니다. 지금부터 AWS 공식 발표와 공개 저장소를 근거로 무엇이 되고, 무엇이 필요하고, 비용이 어떻게 붙는지 정리하겠습니다.

## n8n 기본 AI Agent 노드에 없는 3가지 기능

n8n에도 AI Agent 노드가 기본으로 있는데 왜 AgentCore가 따로 필요할까요? AWS는 노드 공개 문서에서 기본 노드의 빈자리를 세 가지로 설명합니다.

- **세션 간 기억**: 기본 노드의 기억은 한 번의 실행 안에서만 유지됩니다. 어제 문의한 고객이 오늘 다시 문의하면 처음 보는 사람이 됩니다.
- **실제 브라우저와 코드 실행**: 기본 노드는 웹 페이지를 실제로 열어 조작하거나 파이썬 코드를 격리 환경에서 실행하는 기능이 없습니다.
- **긴 작업 시간**: 기본 노드는 실행 시간 제한이 짧아 오래 걸리는 작업은 도중에 끊기기 쉽습니다.

AgentCore 노드는 이 세 가지를 AWS가 관리하는 인프라로 채웁니다. 실행 사이에 이어지는 기억, 격리된 브라우저와 코드 실행 환경, 긴 작업을 버티는 런타임이 노드 하나에 들어 있습니다.

## AgentCore harness의 구조와 지원 모델

harness는 에이전트를 만들 때 따로따로 조립해야 했던 부품들을 API 호출 두 번으로 묶은 구조입니다. 구성을 정의하는 CreateHarness와 실행하는 InvokeHarness입니다.

![AWS가 공개한 AgentCore harness 구조도, CreateHarness와 InvokeHarness 두 API 아래에 모델, 도구, 메모리, 스킬 구성 요소와 런타임, 인증, 관측 기능이 정리된 다이어그램](/images/insights/aws-bedrock-agentcore-n8n/agentcore-harness-architecture.png)

위 다이어그램은 AWS 공식 발표문에 실린 구조도입니다. 구성 요소는 네 묶음입니다.

- **모델**: Bedrock 안의 클로드(Claude), 아마존 노바, 라마 같은 모델뿐 아니라 OpenAI와 Gemini의 직접 API, LiteLLM을 거친 외부 모델까지 고를 수 있습니다. 대화 도중에 모델을 바꿔도 맥락이 유지됩니다.
- **도구**: 브라우저, 코드 실행기, 웹 검색, MCP 서버 연결이 기본으로 제공됩니다.
- **메모리**: 단기와 장기 기억을 기본 관리형으로 사용 설정해 두거나, 직접 만든 기억 저장소를 연결합니다.
- **스킬**: AWS가 골라 둔 스킬 묶음, Git 저장소, S3에 올린 파일을 에이전트의 작업 절차로 불러옵니다.

실행 기록은 CloudWatch로 모입니다. 세션 수, 호출 수, 토큰 사용량, 도구별 오류율이 화면 하나에 정리되므로 에이전트가 무엇을 얼마나 했는지 나중에 확인하기 쉽습니다.

![AgentCore 관측 콘솔 화면, 세션 9건, 호출 29건, 토큰 96만 5천 건과 메모리, 브라우저, 코드 실행기별 오류율이 표시된 대시보드](/images/insights/aws-bedrock-agentcore-n8n/agentcore-observability-console.png)

## n8n에서 AgentCore 노드를 설치하고 연결하는 순서

노드 이름은 `@aws/n8n-nodes-agentcore`이고, AWS가 만든 MIT 라이선스 오픈소스입니다. 설치와 연결은 세 단계로 진행됩니다.

1. **노드 설치**: n8n 편집기에서 노드 추가 화면을 열고 "Amazon Bedrock AgentCore"를 검색해 선택하면 설치까지 이어집니다. 설정 메뉴의 Community Nodes에서 패키지 이름을 직접 입력하는 방법도 있습니다.
2. **자격 증명 연결**: AWS 액세스 키, 리전, 실행 역할(Execution Role) ARN을 노드 자격 증명에 등록합니다. 사용할 기능에 맞는 IAM 권한이 계정에 있어야 합니다.
3. **예제 워크플로 가져오기**: 공식 저장소의 examples 폴더에 가져와 변형하면 되는 워크플로 아홉 개가 들어 있습니다. 빈 화면에서 시작하지 않아도 됩니다.

예제 하나를 구체적으로 보면 흐름이 잡힙니다. 다중 턴 상담 에이전트 예제는 웹훅으로 문의를 받고, AgentCore 노드가 세션 정보를 유지한 채 답변을 만듭니다. 같은 고객이 다시 문의하면 이전 대화가 기억에 남아 있으므로 처음부터 설명을 반복하지 않아도 됩니다. 이 밖에 파이썬 코드를 실행하는 데이터 분석 예제, 외부 검색을 MCP로 연결한 리서치 예제, 대화 도중 모델을 바꾸는 예제가 함께 제공됩니다.

## AgentCore 사용 비용과 시작 전 준비물 (2026년 8월 기준)

AWS 공식 발표 기준으로 harness 자체에는 별도 요금이 없고, 실행한 리소스만큼 과금됩니다.

- **런타임**: vCPU 시간당 0.0895달러, 메모리 GB 시간당 0.00945달러입니다. 에이전트가 실제로 움직인 시간만 계산됩니다.
- **게이트웨이와 메모리**: 호출 1,000건, 기억 이벤트 1,000건 단위로 과금됩니다.
- **모델 추론**: Bedrock이나 연결한 외부 모델의 요금이 별도로 붙습니다.

쓰지 않으면 비용이 없는 구조라서 실험 단계의 부담은 크지 않습니다. 다만 런타임, 게이트웨이, 메모리, 모델 추론의 과금 단위가 서로 다르므로, 에이전트가 브라우저와 코드 실행기를 얼마나 자주 켜는지에 따라 총비용이 달라집니다. 에이전트가 반복 실행되도록 걸어 두면 비용이 조용히 쌓이므로, 위에서 본 관측 화면으로 호출 수와 토큰 사용량을 초기에 확인하는 습관이 필요합니다.

시작 전 준비물은 세 가지입니다. AWS 계정, AgentCore 기능에 맞는 IAM 권한, 그리고 노드에 등록할 실행 역할입니다. n8n만 쓰던 분들에게는 이 AWS 쪽 설정이 노드 설치보다 큰 관문입니다. 권한 이름을 하나씩 찾는 일이 어렵다면, 공식 저장소 문서에 기능별로 필요한 권한이 정리되어 있으니 그 목록대로 요청하거나 설정하면 됩니다.

## 비개발자가 시작하기에 현실적인 순서

이 조합이 모든 자동화의 정답은 아닙니다. 단발성 요약이나 알림처럼 기억이 필요 없는 작업은 n8n 기본 노드로 충분하고, AWS 설정이라는 진입 관문도 분명히 있습니다.

AgentCore 노드가 값어치를 하는 지점은 기억과 실행 환경이 필요한 반복 업무입니다. 같은 고객을 이어서 상대하는 문의 처리, 매주 같은 형식으로 데이터를 받아 분석하는 업무, 웹 화면을 직접 열어 확인해야 하는 점검 업무가 여기에 해당합니다. 이런 업무는 사람이 매번 맥락을 처음부터 설명해야 하는 부담이 커서, 기억이 유지되는 것만으로도 체감 차이가 납니다.

시작 순서는 단순한 쪽이 안전합니다. 반복되는 업무 하나를 고르고, 아홉 개 예제 중 가장 가까운 것을 가져와 변형하고, 관측 화면에서 비용과 결과를 확인한 뒤에 다음 업무로 넓히는 순서입니다. 전사 자동화 그림은 그 뒤에 그려도 늦지 않습니다.

## 3줄 요약

- Amazon Bedrock AgentCore는 AI 에이전트의 기억, 도구 사용, 실행 과정을 AWS가 대신 관리해 주는 서비스이고, AWS가 직접 만든 커뮤니티 노드로 n8n 편집기와 연결됩니다.
- n8n 기본 AI Agent 노드에 없는 세션 간 기억, 실제 브라우저와 코드 실행, 긴 작업 시간을 채워 주며, 모델은 클로드를 포함한 Bedrock 모델과 OpenAI, Gemini까지 고를 수 있습니다.
- harness 자체 요금은 없고 실행한 만큼 과금되므로, AWS 계정과 IAM 권한을 준비한 뒤 반복 업무 하나에 예제 워크플로를 변형해 적용하는 것이 현실적인 시작 순서입니다.

## Sources

- [AWS, Amazon Bedrock AgentCore harness is now generally available](https://aws.amazon.com/blogs/machine-learning/amazon-bedrock-agentcore-harness-is-now-generally-available-go-from-idea-to-production-grade-agent-in-minutes/)
- [AWS, Make agents a reality with Amazon Bedrock AgentCore: Now generally available](https://aws.amazon.com/blogs/machine-learning/amazon-bedrock-agentcore-is-now-generally-available/)
- [GitHub, aws/n8n-nodes-agentcore](https://github.com/aws/n8n-nodes-agentcore)
