---
slug: openai-astra-for-law-guide
title: 'OpenAI Astra for Law 공개: GPT-6 아스트라 기반 법률 전용 구성의 내용과 이용 조건 정리'
excerpt: >-
  Astra for Law는 OpenAI가 2026년 9월 17일 공개한 법률 실무용 제품이고, 새 모델이 아니라 GPT-6 아스트라에 법률
  검색 인덱스와 작성 지침, 플러그인을 붙인 구성입니다. 무엇이 들어 있는지, 벤치마크 수치를 어떻게 읽어야 하는지, 지금 누가 쓸 수 있고
  미국 법 중심이라는 한계가 무엇인지 공식 발표문 기준으로 정리했습니다.
category: AI_TECH
tags:
  - AI
  - 자동화
  - API
relatedSlugs:
  - gpt-6-astra-how-to-use
  - openai-astra-model-comparison
  - gpt-6-astra-ai-transition-era
publishedAt: '2026-09-18T00:20:00.000Z'
highlights:
  - '지금은 OpenAI가 고른 로펌만 Trusted Access로 쓰고 API는 예고 단계이므로, 일반 계정에서 모델 목록을 뒤지기보다 법률 영업팀 문의 페이지로 신청하거나 API 공개를 기다립니다.'
  - '검색 인덱스가 미국 판례와 법령 중심이므로, 한국 법률 문서 작업에 붙일 때는 국내 법령 검색을 따로 연결해야 합니다.'
metaTitle: 'OpenAI Astra for Law 공개: GPT-6 아스트라 법률 구성과 이용 조건'
metaDescription: >-
  Astra for Law는 OpenAI가 2026년 9월 17일 공개한 법률 실무용 제품입니다. 새 모델이 아니라 GPT-6 아스트라에 미국
  판례 검색 인덱스와 법률 작성 지침, 플러그인을 붙인 구성이고, 선별 로펌에 Trusted Access로 먼저 열립니다. 구성 요소와
  벤치마크, 데이터 처리 조건, 한계를 정리했습니다.
ogDescription: >-
  새 모델이 아니라 GPT-6 아스트라에 판례 검색과 작성 지침, 플러그인을 붙인 법률 구성입니다. 벤치마크 54.0%의 조건과 선별 로펌
  한정 제공, 미국 법 중심이라는 한계를 공식 발표문으로 정리했습니다.
ogImage: /og/openai-astra-for-law-guide.png
quiz:
  - question: OpenAI가 밝힌 Astra for Law의 벤치마크 결과를 실무에서 어떻게 받아들이는 것이 맞을까요?
    options:
      - 웹 검색만 쓸 때보다 판례를 더 찾지만 정답률이 54.0%이므로, 답을 받은 뒤 판례를 직접 확인하는 단계는 그대로 둔다
      - 상대 기준 40% 향상이므로 기존 법률 리서치 도구를 이 제품으로 바꿔도 된다
      - 제3자 검증이 없으므로 수치를 무시하고 기본 GPT-6 아스트라와 같은 것으로 본다
    correctIndex: 0
    explanation: >-
      수치는 OpenAI 자체 측정이고 비교 대상도 자기 모델뿐이라 기존 리서치 도구와의 우열은 알 수 없습니다. 다만 같은 조건에서 웹 검색만 쓴 경우보다 판례를 24% 더 찾았다는 결과는 있습니다. 인덱스 효과는 인정하되, 절반 가까이 틀릴 수 있으니 사람이 확인하는 단계를 그대로 두는 편이 맞습니다.
summary3:
  - >-
    Astra for Law는 OpenAI가 2026년 9월 17일 공개한 법률 실무용 제품이고, 새 모델이 아니라 GPT-6 아스트라에 미국 판례와 법령을 담은 검색 인덱스, 법률 작성 지침, 플러그인 26개를 붙인 구성입니다.
  - >-
    OpenAI 자체 측정에서 법률 리서치 벤치마크 정답률이 웹 검색만 쓴 GPT-6 아스트라의 38.7%에서 54.0%로
    올랐고, 적격 로펌에는 API 데이터를 저장하지 않고 기업용 ChatGPT 사용을 사람 검토에서 빼는 조건이 기본으로 적용됩니다.
  - >-
    지금은 선별 로펌만 Trusted Access로 ChatGPT와 Codex에서 쓰고 API와 가격은 미공개이며, 검색 인덱스가 미국 법
    중심이라 한국 법률 실무에 그대로 쓰기는 어렵습니다.
---

Astra for Law는 OpenAI가 2026년 9월 17일 공개한 법률 실무용 제품입니다. 새 모델이 아니라 GPT-6 아스트라(GPT-6 Astra)에 법률 검색 인덱스와 법률 작성 지침, 법률 도구 플러그인을 붙인 구성이고, 모델 선택기에는 GPT-6 Astra Law로, API에는 `gpt-6-astra-law`로 표시됩니다. OpenAI의 산업별 제품 가운데 ChatGPT 대신 모델 이름을 제품명에 붙인 것은 이 제품이 처음으로 보입니다.

GPT-6 아스트라가 9월 3일에 나왔다는 것은 이미 널리 알려져 있습니다. 준이아빠블로그의 [GPT-6 아스트라 출시일과 가격 정리](/insights/openai-astra-model-comparison)와 [GPT-6 아스트라 사용법](/insights/gpt-6-astra-how-to-use)에서 모델 자체와 요금제별 제공 범위를 다뤘습니다. 컴퓨터를 사람처럼 조작하는 데 초점을 둔 모델이라는 점도 그 두 글에서 다뤘습니다.

그런데 이번 발표는 모델이 아니라 그 모델을 어떤 직업에 맞춰 내놓았는지를 다룹니다. 무엇이 더해졌는지, 발표문의 벤치마크 수치를 어떻게 읽어야 하는지, 지금 누가 쓸 수 있는지를 모르면 "법률 전용 GPT가 나왔다"는 요약만 남고, 정작 내 계정에서는 아무것도 보이지 않습니다. OpenAI 공식 발표문과 법률 솔루션 페이지, 플러그인 목록, 발표 전 브리핑을 전한 보도를 근거로 2026년 9월 18일 기준으로 정리하겠습니다.

![OpenAI 공식 발표 페이지 Introducing Astra for Law의 상단 화면. 제목과 발표일 2026년 9월 17일, 법률 실무를 위한 새 기반이라는 소개 문장이 보인다](/images/insights/openai-astra-for-law-guide/01-astra-for-law-page.png)

## Astra for Law 발표 내용 한눈에 보기

| 항목 | 내용 |
|---|---|
| 공개일 | 2026년 9월 17일. OpenAI 공식 블로그와 X 계정으로 발표 |
| 정체 | GPT-6 아스트라에 법률용 설정과 도구, 컨텍스트를 붙인 구성. 새 모델 아님 |
| 표시 이름 | 모델 선택기 GPT-6 Astra Law, API `gpt-6-astra-law` |
| 구성 요소 | 법률 검색 인덱스, 법률 분석과 작성 지침, 응답 길이 등 설정, 파트너 플러그인 26개와 커뮤니티 플러그인 9개, 커스텀 스킬 47개 |
| 제공 방식 | 선별 로펌에 Trusted Access로 ChatGPT와 Codex에서 제공. API는 예고 단계 |
| 데이터 처리 | 적격 로펌은 API 데이터 미보관(ZDR), 기업용 ChatGPT 사용은 사람 검토에서 기본 제외 |
| 가격 | 미공개. 기본 GPT-6 아스트라 API는 100만 토큰당 입력 10달러, 출력 50달러 |
| 협업 로펌 | 설리번 앤 크롬웰, 롭스 앤 그레이, 쿨리, 레이섬 앤 왓킨스, 와첼 립턴 |
| 같은 날 정식 출시 | 워드용 ChatGPT(ChatGPT for Word) |

표에서 먼저 볼 것은 제공 방식입니다. Plus나 Pro 구독이 있어도 지금은 모델 목록에 GPT-6 Astra Law가 나타나지 않습니다. OpenAI가 고른 로펌만 쓰는 단계이고, 일반 계정에서 쓸 수 있는 방법은 아직 없습니다.

## 새 모델이 아니라 GPT-6 아스트라의 법률 구성

이번 발표에서 오해하기 쉬운 대목은 이름입니다. Astra라는 모델 이름이 앞에 붙어 있어서 새 모델로 보이기 쉬운데, OpenAI 발표문은 GPT-6 아스트라에 설정과 도구, 컨텍스트를 결합한 구성이라고 소개했고, 법률 산업 총괄 제이슨 보에믹도 브리핑에서 새 모델이 아니라고 했습니다. 보에믹은 계약 관리 소프트웨어 회사 아이언클래드의 공동 창업자로 올해 6월 OpenAI에 합류한 인물입니다.

구성이라는 말은 모델 이름보다 낯설 수 있습니다. 쉽게 말하면 **구성은 같은 모델에 어떤 자료를 찾게 하고, 어떤 지침으로 답하게 하고, 어떤 도구를 쓰게 할지 미리 정해 둔 묶음**입니다. 변호사는 그대로 두고 판례 서고 열쇠와 사무실 작성 지침서, 사건 관리 프로그램을 쥐여 주듯, 모델은 그대로 두고 주변만 법률 사무소에 맞게 꾸렸습니다.

들어 있는 것은 네 가지입니다.

- **법률 검색 인덱스**: 미국 판례와 제정법, 규정, 법원 규칙, 행정 결정을 2억 3천만 개가 넘는 URL 코퍼스에서 찾으며, 자료는 매일 추가됩니다. 비영리 단체 프리 로 프로젝트의 판례 모음이 들어가 있고, 이 모음은 공개 발간된 미국 선례 판례의 99.9% 이상을 담고 있다는 것이 OpenAI의 설명입니다.
- **법률 분석과 작성 지침**: 사실 관계를 법리에 적용하고 논거와 거래 조건을 세우는 방식이 지침으로 들어 있습니다. 약점과 불확실성을 짚고, 판시와 방론을 구분하고, 불리한 판례를 다루는 지침도 들어 있습니다.
- **설정**: 응답 길이 같은 특성입니다. 브리핑에 따르면 기본 아스트라보다 답이 평균 두 배쯤 긴데, 변호사들이 긴 답을 선호하기 때문이라고 합니다.
- **플러그인과 스킬**: 파트너가 만든 플러그인 26개, 커뮤니티 플러그인 9개, 커스텀 스킬 47개로 사건 관리와 문서 관리 도구에 연결합니다.

OpenAI는 다른 산업에는 ChatGPT for Financial Services, ChatGPT for Healthcare처럼 ChatGPT 이름을 붙여 왔습니다. 9월 10일에 나온 금융 서비스 제품도 내장 금융 데이터와 GPT-6 아스트라의 추론을 결합한 같은 구조입니다. 법률만 모델 이름을 앞세운 이유는 발표문에 없고, API 고객인 하비(Harvey)와 레고라(Legora)가 이 위에 자기 제품을 얹는다는 설명으로 보아 소비자용 화면보다 기반 제품 성격을 강조한 것으로 보입니다.

## 법률 검색 인덱스와 벤치마크 수치

발표문에 실린 수치는 벤치마크 하나에서 나왔습니다. 벤치마크는 모델마다 같은 시험지를 주고 채점한 결과인데, 여기서는 평가 기관 발스 AI(Vals AI)의 법률 리서치 벤치마크 가운데 비공개 검증 세트 200문항을 썼습니다.

| 조건 | 정답률 |
|---|---|
| Astra for Law, 최고 추론 강도 | 54.0% |
| GPT-6 아스트라 + 웹 검색만, 최고 추론 강도 | 38.7% |

OpenAI는 이 차이를 상대 기준 40% 향상이라고 표현했습니다. Astra for Law는 판례 문항에서 참조해야 할 판례를 24% 더 찾았고, 관련 구절도 최대 54% 더 찾아냈습니다.

이 수치를 읽을 때 함께 봐야 할 조건이 세 가지 있습니다.

- **OpenAI 자체 측정입니다.** 제3자가 같은 조건으로 재현한 결과는 아직 없습니다.
- **비교 대상이 자기 모델입니다.** 기존 법률 리서치 제품과 견준 수치는 발표문에 없습니다.
- **정답률 54.0%는 절반을 조금 넘는 값입니다.** 인덱스를 붙여도 열 문항 가운데 넷 이상은 틀렸다는 뜻이므로, 답을 받은 뒤 판례를 직접 확인하는 일은 그대로 필요합니다.

발표문에는 같은 프롬프트를 클로드 페이블 5.1과 나란히 돌린 시연도 있습니다. 소송 예시에서 클로드는 항소심에서 뒤집힌 판시를 그대로 답했고, 거래 예시에서는 해당 판례를 찾지 못했습니다. 이것도 OpenAI가 고른 사례라 양쪽을 같은 조건에서 비교한 결과로 보기는 어렵습니다. 다만 판례 서고 열쇠가 있는 쪽과 없는 쪽의 차이가 어디서 나는지는 이 시연이 보여 줍니다. 뒤집힌 판시를 걸러내는 것은 모델의 추론이 아니라 최신 판례 검색 인덱스이기 때문입니다.

## 플러그인과 파트너 로펌

플러그인은 ChatGPT 안에서 다른 서비스를 부르는 연결 통로입니다. 발표문이 예로 든 흐름은 이렇습니다.

- **아이매니지(iManage)**: 협상 브리프를 쓴 뒤 사건 파일에 저장합니다.
- **인탭(Intapp)**: 시간 기록이 필요한 활동을 표시합니다.
- **딥저지(DeepJudge)**: 지금 다루는 거래를 과거 거래와 비교합니다.
- **Thomson Reuters**: HighQ에서 사건 맥락을 불러옵니다. 코카운슬 리걸(CoCounsel Legal) 커넥터는 예고 단계입니다.

![OpenAI 플러그인 목록 페이지의 법률 탭. Box, HighQ, Clio, Ironclad, Relativity, iManage, NetDocuments, Legora, Harvey, LegalZoom 등 법률 서비스 플러그인 카드가 나열되어 있다](/images/insights/openai-astra-for-law-guide/02-legal-plugins-list.png)

플러그인 목록 페이지의 법률 탭에는 이 밖에 클리오와 넷다큐먼츠, 렐러티비티 등이 올라 있습니다. 경쟁 관계로 볼 수 있는 하비와 레고라도 플러그인과 API 고객으로 함께 들어 있는데, OpenAI는 이 방식을 "열려 있고 조합할 수 있는 접근"이라고 부르며 기존 도구를 대체하기보다 함께 쓰는 쪽으로 설명합니다.

협업 로펌은 두 종류입니다. 하나는 발표 전 시험에 참여한 곳이고, 다른 하나는 OpenAI 엔지니어가 파견되어 맞춤 도구를 함께 만든 곳입니다. 설리번 앤 크롬웰은 계약 분석기를, 롭스 앤 그레이는 거래 실사 시스템을, 쿨리는 상장 준비 도구인 GO Public을 함께 만들었습니다. 쿨리도 같은 날 OpenAI의 설계 파트너였다고 따로 밝혔습니다.

## 데이터 처리와 기밀 조건

법률 사무소가 AI 도구를 들일 때 먼저 묻는 것은 기밀이 어떻게 처리되는지입니다. 발표문에 있는 조건은 세 가지입니다.

- **API 데이터 미보관(Zero Data Retention)**: 적격 로펌에는 API 사용 데이터를 저장하지 않는 조건이 적용됩니다.
- **사람 검토 제외**: 기업용 ChatGPT 사용은 기본적으로 OpenAI 직원의 검토 대상에서 빠집니다.
- **거버넌스 설계**: 레이섬 앤 왓킨스와 함께 정보 접근 권한, 이해상충 차단벽, 고객 지시, 로펌 감독을 설계하고 있습니다.

여기서 조심할 점이 있습니다. 미보관 조건은 발표문에 한 문장으로 적혀 있지만, 보에믹은 브리핑에서 실제 계약은 약 30쪽이고 그 한 문장보다 복잡하다고 인정했습니다. 어느 로펌이 적격인지 기준도 공개되지 않았습니다. 데이터를 학습에 쓰는지는 Astra for Law 페이지에 따로 적혀 있지 않고, OpenAI 일반 정책에는 기업용과 API 데이터를 기본적으로 학습에 쓰지 않는다고 적혀 있습니다. 플러그인으로 외부 서비스에 넘어간 데이터에는 그 서비스의 조건이 적용되므로, 도구를 연결할 때는 따로 확인해야 합니다.

## 지금 Astra for Law를 쓸 수 있는 대상과 API 제공 시점

지금 쓸 수 있는 쪽은 OpenAI가 고른 로펌뿐입니다. Trusted Access라는 이름의 프로그램으로 ChatGPT와 Codex에서 열리고, 대상은 미국 대형 로펌 200곳과 법률 테크 회사로 알려져 있습니다. API는 곧 나온다고만 적혀 있고, 가격과 요금제별 제공 조건, 신청 자격은 어느 문서에도 없습니다. 공개 대기자 양식도 없어서 법률 영업팀 문의 페이지가 유일한 창구입니다.

한국에서 쓰려면 조건이 하나 더 붙습니다. 검색 인덱스가 미국 판례와 법령을 대상으로 한다는 점입니다. 검색 인덱스가 미국 자료로 만들어져 한국 법령과 판례는 들어 있지 않고, 작성 지침도 미국 소송과 거래 관행을 전제로 합니다. 그래서 한국 법률 문서 작업에 붙이려면 국내 법령 검색을 별도로 연결해야 하고, 그 경우 이 제품의 핵심인 인덱스 효과는 기대하기 어렵다고 봅니다. 한국에서는 당분간 GPT-6 아스트라를 그대로 쓰는 것과 Astra for Law를 쓰는 것 사이에 차이가 거의 없을 것으로 보입니다.

## 기존 법률 AI 제품과의 비교

올해 들어 여러 회사가 법률 AI 제품을 냈습니다. 정면으로 겹치는 경쟁 제품이라기보다 맡는 범위가 서로 다르므로 표로 비교하겠습니다.

| 기준 | Astra for Law | 클로드 포 리걸(Claude for Legal) | 코카운슬 리걸(CoCounsel Legal) | 하비 |
|---|---|---|---|---|
| 만든 곳 | OpenAI | 앤트로픽 | Thomson Reuters | 하비 |
| 공개 시점 | 2026년 9월 17일 | 2026년 5월 12일 | 차세대 판 2026년 8월 20일 | 자체 모델 테넷 2026년 8월 |
| 정체 | 모델 구성과 검색 인덱스 | 실무 영역 플러그인 12개와 커넥터 20개 이상 | 웨스트로 자료에 붙은 법률 AI 시스템, 자체 모델 톰슨 병행 | 로펌용 앱. Astra for Law 위에 구축 예정 |
| 제공 대상 | 선별 로펌 | 모든 유료 클로드 고객 | Thomson Reuters 고객 | 계약 로펌 |
| 자료 출처 | 프리 로 프로젝트 등 공개 자료 | 커넥터로 연결한 외부 도구 | 웨스트로, 프랙티컬 로 | 자체와 파트너 |

표에서 볼 것은 두 가지입니다. 하나는 제공 대상의 차이입니다. 클로드 포 리걸은 유료 고객이면 누구나 쓰지만 Astra for Law는 선별 로펌부터 시작합니다. 다른 하나는 자료 출처입니다. Thomson Reuters는 자기 데이터베이스를 갖고 있고, OpenAI는 공개 판례 모음을 인덱스로 삼았습니다. Thomson Reuters가 자체 모델을 내면서도 OpenAI 플러그인에 참여한 것을 보면, 당분간은 로펌이 여러 회사의 도구를 함께 쓰는 구조가 이어질 것으로 보입니다.

## 자주 묻는 질문

### Plus나 Pro 구독이 있으면 Astra for Law를 쓸 수 있나요?

지금은 쓸 수 없습니다. OpenAI가 고른 로펌에 Trusted Access로만 열려 있고, 일반 구독 계정의 모델 목록에는 GPT-6 Astra Law가 나타나지 않습니다. API 제공은 예고만 된 상태이고 시점과 가격은 미공개입니다.

### Astra for Law는 GPT-6 아스트라와 다른 모델인가요?

같은 모델입니다. OpenAI는 GPT-6 아스트라에 법률 검색 인덱스와 작성 지침, 설정, 플러그인을 결합한 구성이라고 밝혔습니다. 모델 선택기와 API에서 이름이 따로 붙지만 기반 모델은 9월 3일에 나온 GPT-6 아스트라입니다.

### 한국 법률 업무에도 쓸 수 있나요?

직접 쓰기는 어렵습니다. 검색 인덱스가 미국 판례와 법령을 대상으로 하고 작성 지침도 미국 실무를 전제로 합니다. 한국 법령 검색을 따로 붙여야 하는데, 그러면 이 제품이 더한 인덱스 효과는 거의 남지 않는다고 봅니다.

## 3줄 요약

1. **Astra for Law는 OpenAI가 2026년 9월 17일 공개한 법률 실무용 제품이고, 새 모델이 아니라 GPT-6 아스트라에 미국 판례와 법령을 담은 검색 인덱스, 법률 작성 지침, 플러그인 26개를 붙인 구성입니다.**
2. **OpenAI 자체 측정에서 법률 리서치 벤치마크 정답률이 웹 검색만 쓴 GPT-6 아스트라의 38.7%에서 54.0%로 올랐고, 적격 로펌에는 API 데이터를 저장하지 않고 기업용 ChatGPT 사용을 사람 검토에서 빼는 조건이 기본으로 적용됩니다.**
3. **지금은 선별 로펌만 Trusted Access로 ChatGPT와 Codex에서 쓰고 API와 가격은 미공개이며, 검색 인덱스가 미국 법 중심이라 한국 법률 실무에 그대로 쓰기는 어렵습니다.**

## Sources

- [Introducing Astra for Law (OpenAI 공식 발표)](https://openai.com/index/astra-for-law/)
- [AI for Law Firms: Legal Research and Workflows (OpenAI 법률 솔루션 페이지)](https://openai.com/solutions/industries/law/)
- [OpenAI 플러그인 목록, 법률 탭](https://openai.com/business/plugins/?tab=plugins-legal)
- [GPT-6 Astra: A new generation of intelligence (OpenAI)](https://openai.com/index/gpt-6-astra/)
- [GPT-6 Astra: The next generation in intelligence for work (OpenAI)](https://openai.com/index/gpt-6-astra-next-generation-work/)
- [Business data privacy, security, and compliance (OpenAI)](https://openai.com/business-data/)
- [Introducing ChatGPT for Financial Services (OpenAI)](https://openai.com/index/introducing-chatgpt-financial-services/)
- [Cooley Launches GO Public With OpenAI (쿨리 보도자료)](https://www.cooley.com/news/coverage/2026/2026-09-16-cooley-launches-go-public-with-openai)
- [Thomson Reuters launches next generation of CoCounsel Legal (Thomson Reuters 보도자료)](https://www.thomsonreuters.com/en/press-releases/2026/august/thomson-reuters-launches-next-generation-of-cocounsel-legal-the-ai-ecosystem-built-for-legal-professionals)
- [OpenAI 공식 X 발표](https://x.com/OpenAI/status/2100679992720142459)
- [OpenAI Releases Astra for Law, a GPT-6 Model Configured for Legal Work (LawSites, 발표 전 브리핑 보도)](https://www.lawnext.com/2026/09/openai-releases-astra-for-law-a-gpt-6-model-configured-for-legal-work.html)
- [OpenAI launches Astra for Law targeting the legal tech industry (Business Insider, 발표 전 브리핑 보도)](https://www.businessinsider.com/openai-launches-astra-for-law-targeting-legal-tech-industry-2026-9)
