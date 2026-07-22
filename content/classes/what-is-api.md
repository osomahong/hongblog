---
slug: what-is-api
term: API (Application Programming Interface)
definition: 서로 다른 프로그램이나 서비스가 서로 소통하고 데이터를 주고받을 수 있도록 만들어진 '약속된 연결 통로'입니다.
category: AI_TECH
tags:
  - API
  - 자동화
  - 마케팅 실무
publishedAt: '2026-02-11T09:00:03.586Z'
courseSlug: digital-basic
orderInCourse: 9
aliases:
  - REST API
  - 웹 API
relatedTerms:
  - what-is-javascript
  - what-is-dom
  - what-is-rest-api
  - what-is-json-and-data-structures
difficulty: BEGINNER
quiz:
  - options:
      - 'GA4 API와 Google Sheets API를 연결하는 자동화 도구(Zapier, n8n 등)를 사용한다'
      - 매일 GA4에 접속해서 데이터를 수동으로 복사-붙여넣기 한다
      - 개발자에게 GA4 소스코드를 수정해달라고 요청한다
      - 스프레드시트에 직접 JavaScript 코드를 작성한다
    question: '마케터가 ''GA4 이벤트 데이터를 자동으로 스프레드시트에 저장하고 싶다''고 할 때, 가장 적절한 방법은 무엇일까요?'
    explanation: >-
      API는 서로 다른 서비스를 연결하는 통로입니다. GA4 API로 데이터를 요청하고, Google Sheets API로 저장하는
      과정을 자동화 도구로 연결하면 수동 작업 없이 자동으로 데이터를 수집할 수 있습니다. 이것이 API의 가장 실용적인 활용 방법입니다.
    correctIndex: 0
ogImage: /og/what-is-api.png
---

## 🤔 혹시 이런 생각 해본 적 없나요?

- "GA4 데이터를 자동으로 스프레드시트로 가져올 수 없을까?"
- "메타 광고 데이터를 우리 대시보드에서 한 번에 볼 수 없을까?"
- "n8n이나 Zapier는 도대체 어떻게 여러 툴을 연결하는 걸까?"

이 모든 게 가능한 이유는 바로 **API** 덕분입니다.

## 🔑 API, 한마디로 뭘까요?

**API(Application Programming Interface)**는 서로 다른 프로그램이나 서비스가 서로 소통하고 데이터를 주고받을 수 있도록 만들어진 **'약속된 연결 통로'**입니다.

쉽게 말해, 여러분이 직접 프로그램 내부를 건드리지 않아도 **정해진 방식으로 요청하면 원하는 기능이나 데이터를 받을 수 있게 해주는 중간 다리** 같은 존재입니다.

## 🍽️ 레스토랑의 메뉴판과 웨이터

<div style="overflow-x:auto; margin:16px 0;">
  <div style="max-width:100%; display:flex; flex-wrap:wrap; gap:8px; align-items:stretch;">
    <div style="flex:1; min-width:200px; border:3px solid #000; background:#fff; padding:10px;">
      <div style="display:inline-block; font-weight:bold; background:#FFD700; border:2px solid #000; padding:2px 8px; margin-bottom:8px;">1. 요청 (주문)</div>
      <div style="font-family:monospace; font-size:0.85em; background:#F3F3F3; border:2px solid #000; padding:8px;">GET /menu/carbonara</div>
      <p style="margin:8px 0 0; color:#555;">"까르보나라 1개 주세요"</p>
    </div>
    <div style="align-self:center; font-weight:bold; font-size:1.2em;">→</div>
    <div style="flex:1; min-width:160px; border:3px solid #000; background:#F3F3F3; padding:10px;">
      <div style="display:inline-block; font-weight:bold; background:#fff; border:2px solid #000; padding:2px 8px; margin-bottom:8px;">2. 서버 (주방)</div>
      <p style="margin:0; color:#555;">메뉴 확인, 조리 후 결과를 준비합니다</p>
    </div>
    <div style="align-self:center; font-weight:bold; font-size:1.2em;">→</div>
    <div style="flex:1; min-width:200px; border:3px solid #000; background:#fff; padding:10px;">
      <div style="display:inline-block; font-weight:bold; background:#FFD700; border:2px solid #000; padding:2px 8px; margin-bottom:8px;">3. 응답 (서빙)</div>
      <div style="font-family:monospace; font-size:0.85em; background:#F3F3F3; border:2px solid #000; padding:8px;">{<br>&nbsp;&nbsp;"menu": "까르보나라",<br>&nbsp;&nbsp;"price": 15000,<br>&nbsp;&nbsp;"status": "완료"<br>}</div>
    </div>
  </div>
  <p style="margin:8px 0 0; font-size:0.9em; color:#555;">API는 정해진 형식으로 요청을 받아 주방(서버)에 전달하고, 결과를 JSON으로 돌려줍니다.</p>
</div>

레스토랑에서 음식을 주문할 때를 생각해보세요.

- **주방(서버)**: 실제 음식을 만드는 곳. 여러분은 들어갈 수 없습니다.
- **메뉴판(API 문서)**: 주문 가능한 음식 목록과 방법이 적혀있습니다.
- **웨이터(API)**: 여러분의 주문을 받아 주방에 전달하고, 완성된 음식을 가져다줍니다.
- **손님(사용자)**: 메뉴판을 보고 웨이터에게 주문합니다.

여러분은 주방에 직접 들어가지 않아도, **웨이터에게 "까르보나라 1개 주세요"라고 정확히 요청**하면 음식을 받을 수 있습니다. API도 마찬가지입니다. **정해진 방식으로 요청하면, 원하는 데이터나 기능을 받을 수 있습니다.**

## 📦 택배 주문 시스템

온라인 쇼핑몰에서 물건을 주문하는 과정도 API와 비슷합니다.

- 여러분은 **상품 번호와 배송지를 입력(요청)**합니다.
- 쇼핑몰 시스템은 **창고에서 물건을 찾아 포장(처리)**합니다.
- 며칠 후 **택배가 도착(응답)**합니다.

여러분은 창고 내부를 볼 수 없지만, **정해진 양식으로 주문하면 원하는 물건을 받을 수 있습니다.** API도 이렇게 **요청(Request)**과 **응답(Response)**으로 작동합니다.

## ⚙️ API는 어떤 종류가 있나요?

<div style="overflow-x:auto; margin:16px 0;">
  <div style="max-width:100%; border:3px solid #000; background:#fff; padding:16px;">
    <div style="display:inline-block; font-weight:bold; background:#FFD700; border:3px solid #000; padding:4px 12px; margin-bottom:10px;">REST API: 하나의 주소, 네 가지 요청 방식</div>
    <div style="font-family:monospace; font-size:0.9em; background:#F3F3F3; border:2px solid #000; padding:8px; margin-bottom:10px;">https://api.example.com/users</div>
    <div style="display:flex; flex-wrap:wrap; gap:8px; align-items:center; margin-bottom:8px;">
      <div style="min-width:90px; text-align:center; font-family:monospace; font-weight:bold; border:2px solid #000; background:#FFD700; padding:6px;">GET</div>
      <div style="flex:1; min-width:180px; border:2px solid #000; padding:6px 10px;">사용자 목록을 조회합니다</div>
    </div>
    <div style="display:flex; flex-wrap:wrap; gap:8px; align-items:center; margin-bottom:8px;">
      <div style="min-width:90px; text-align:center; font-family:monospace; font-weight:bold; border:2px solid #000; background:#F3F3F3; padding:6px;">POST</div>
      <div style="flex:1; min-width:180px; border:2px solid #000; padding:6px 10px;">새 사용자를 등록합니다</div>
    </div>
    <div style="display:flex; flex-wrap:wrap; gap:8px; align-items:center; margin-bottom:8px;">
      <div style="min-width:90px; text-align:center; font-family:monospace; font-weight:bold; border:2px solid #000; background:#F3F3F3; padding:6px;">PUT</div>
      <div style="flex:1; min-width:180px; border:2px solid #000; padding:6px 10px;">기존 사용자 정보를 수정합니다</div>
    </div>
    <div style="display:flex; flex-wrap:wrap; gap:8px; align-items:center;">
      <div style="min-width:90px; text-align:center; font-family:monospace; font-weight:bold; border:2px solid #000; background:#F3F3F3; padding:6px;">DELETE</div>
      <div style="flex:1; min-width:180px; border:2px solid #000; padding:6px 10px;">사용자를 삭제합니다</div>
    </div>
  </div>
  <p style="margin:8px 0 0; font-size:0.9em; color:#555;">같은 엔드포인트(URL)라도 HTTP 방식에 따라 서버가 다른 작업을 수행합니다.</p>
</div>

**1. Open API (공개 API)**

누구나 사용할 수 있도록 공개된 API입니다.

- 예시: Google Maps API, OpenWeather API, 공공데이터포털

- 대부분 무료 사용량 제한이 있고, 그 이상은 유료입니다.

**2. Partner API (파트너 API)**
특정 파트너사에게만 제공되는 API입니다.
- 예시: Meta Ads API, Google Ads API (승인 필요)
- 사용 권한을 받아야 접근 가능합니다.

**3. Private API (내부 API)**
회사 내부에서만 사용하는 API입니다.
- 예시: 사내 데이터베이스 연동, 내부 툴 연결
- 외부에서는 접근할 수 없습니다.

**4. REST API (가장 흔한 방식)**
웹 표준을 따르는 가장 일반적인 API 형태입니다.
- **엔드포인트(Endpoint)**: API에 접근하는 URL 주소입니다.
- 예시: `https://api.example.com/users` → 사용자 정보 요청
- HTTP 방식(GET, POST, PUT, DELETE)으로 요청합니다.

## 💡 이걸 알면 마케터에게 뭐가 좋을까요?

**1. 툴 간 자동화 연결이 가능합니다**
- Zapier, Make, n8n 같은 자동화 도구는 모두 API를 사용합니다.
- "GA4에서 데이터 받아서 → 스프레드시트에 저장 → 슬랙 알림" 같은 워크플로우를 만들 수 있습니다.
- 반복 작업을 자동화하여 시간을 절약할 수 있습니다.

**2. 광고 데이터를 효율적으로 관리할 수 있습니다**
- Meta Ads API, Google Ads API를 통해 광고 성과 데이터를 자동으로 수집할 수 있습니다.
- 여러 플랫폼의 데이터를 한 곳에 모아 통합 대시보드를 만들 수 있습니다.
- 수동으로 다운로드하던 리포트를 자동화할 수 있습니다.

**3. 개발자와 원활하게 소통할 수 있습니다**
- "API로 GA4에 이벤트를 보내주세요"라고 구체적으로 요청할 수 있습니다.
- 어떤 데이터를 어떻게 연결해야 하는지 명확하게 전달할 수 있습니다.
- 기술 용어를 이해하면 프로젝트 협업이 훨씬 수월해집니다.

## 📋 30초 요약

1. **API는 서로 다른 프로그램이 소통하는 '약속된 통로'**입니다. 레스토랑의 웨이터처럼, 정해진 방식으로 요청하면 원하는 데이터나 기능을 받을 수 있습니다.

2. **REST API는 URL 주소(엔드포인트)로 요청을 보내고 응답을 받는 방식**입니다. Google Maps API, Meta Ads API 등 대부분의 웹 서비스가 이 방식을 사용합니다.

3. **마케터는 API를 통해 툴 간 자동화 연결, 광고 데이터 수집, 개발자와의 협업**을 훨씬 효율적으로 할 수 있습니다. Zapier, n8n 같은 도구가 API를 활용한 대표적인 예시입니다.
