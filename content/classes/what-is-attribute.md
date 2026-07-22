---
slug: what-is-attribute
term: Attribute (속성)
definition: >-
  Attribute(속성)는 HTML Element에 붙는 추가 정보입니다. 택배 상자의 송장처럼, 이름표(id), 분류표(class),
  목적지(href) 등을 통해 각 Element를 식별하고 동작을 결정합니다.
category: AI_TECH
tags:
  - HTML
  - GTM
  - DOM
publishedAt: '2026-02-11T08:56:17.838Z'
courseSlug: digital-basic
orderInCourse: 7
relatedTerms:
  - what-is-element
  - whatishtml
  - what-is-selector
difficulty: BEGINNER
quiz:
  - options:
      - Element의 내용물(텍스트)을 Attribute라고 부른다
      - 태그 안에 이름="값" 형태로 작성된 추가 정보이다
      - CSS에서 색상이나 크기를 지정하는 코드이다
      - JavaScript에서 변수를 선언하는 문법이다
    question: HTML Attribute(속성)에 대한 설명으로 올바른 것은?
    explanation: >-
      Attribute는 HTML Element에 추가 정보를 부여하는 이름="값" 쌍입니다. 예를 들어 <button id="buy"
      class="primary">에서 id와 class가 Attribute입니다. 같은 종류의 Element를 구별하거나 동작을 지정하는
      역할을 합니다.
    correctIndex: 1
ogImage: /og/what-is-attribute.png
---

## 🤔 혹시 이런 경험 있으신가요?

- "GTM에서 클릭 트리거를 설정하려는데, Click Classes, Click ID가 뭔지 모르겠다."
- "개발자가 'class명이 뭔가요?'라고 물어보는데, 무슨 말인지 감이 안 온다."
- "웹사이트 소스를 보면 `id`, `class`, `href` 같은 게 잔뜩 붙어 있는데, 각각 무슨 역할인지 궁금하다."

이전 글에서 Element(요소)가 웹페이지를 이루는 부품이라고 배웠습니다. 그런데 같은 종류의 부품이 한 페이지에 수십 개씩 있다면, 어떻게 서로 구별할 수 있을까요?

바로 **Attribute(속성)** 덕분입니다. Attribute는 각 Element에 붙는 이름표이자 설명서입니다.

## 🔑 Attribute, 한마디로 뭘까요?

Attribute(속성)는 HTML Element에 **추가 정보를 부여하는 이름=값 쌍**입니다.

HTML 코드에서 여는 태그 안에 `이름="값"` 형태로 작성됩니다. 예를 들어 아래 코드를 보겠습니다.

```html
<button id="purchase-btn" class="primary large">구매하기</button>
```

여기서 `id="purchase-btn"`과 `class="primary large"`가 모두 Attribute입니다. `<button>`이라는 Element에 "너의 고유 이름은 purchase-btn이고, 스타일은 primary와 large를 적용해"라는 추가 정보를 붙인 것이죠.

## 🏷️ 첫 번째 비유: 택배 상자의 송장


<div style="overflow-x:auto;margin:16px 0;">
  <div style="border:3px solid #000;background:#fff;padding:16px;max-width:100%;font-family:sans-serif;">
    <div style="font-weight:bold;margin-bottom:10px;">태그에 붙은 송장 스티커 읽기</div>
    <pre style="font-family:monospace;font-size:14px;background:#F3F3F3;border:2px solid #000;padding:12px;margin:0;overflow-x:auto;">&lt;button <span style="background:#FFD700;font-weight:bold;">id="purchase-btn"</span> <span style="color:#FF0000;font-weight:bold;">class="primary large"</span>&gt;구매하기&lt;/button&gt;</pre>
    <div style="margin-top:12px;font-size:13px;">
      <div style="border:2px solid #000;background:#FFD700;padding:8px 10px;margin-bottom:6px;"><b>↑ id="purchase-btn"</b> : 운송장 번호. 이 상자(버튼)만의 고유한 이름표입니다.</div>
      <div style="border:2px solid #000;background:#fff;padding:8px 10px;margin-bottom:6px;"><b style="color:#FF0000;">↑ class="primary large"</b> : 상품 분류 스티커. 여러 상자가 같은 분류를 공유할 수 있습니다.</div>
      <div style="border:2px solid #000;background:#F3F3F3;padding:8px 10px;"><b>↑ 구매하기</b> : 상자 안의 내용물. Attribute가 아니라 콘텐츠입니다.</div>
    </div>
  </div>
  <div style="font-size:13px;color:#555;margin-top:6px;font-family:sans-serif;">여는 태그 안의 이름="값" 쌍이 전부 Attribute입니다. 송장만 보면 상자를 열지 않아도 구별할 수 있습니다.</div>
</div>

이전 글에서 Element를 택배 상자에 비유했습니다. Attribute는 그 상자에 붙어 있는 **송장 스티커**입니다.

같은 크기의 갈색 박스가 100개 있다고 생각해 보세요. 겉모습만으로는 어떤 상자에 뭐가 들었는지 알 수 없습니다. 하지만 송장을 보면 모든 것을 파악할 수 있습니다.

| 송장 항목 | HTML Attribute | 예시 |
|-----------|---------------|------|
| 운송장 번호 | `id` | `id="order-12345"` |
| 상품 분류 | `class` | `class="fragile express"` |
| 배송지 주소 | `href` | `href="https://example.com"` |
| 내용물 사진 | `src` | `src="/images/product.jpg"` |
| 취급 주의 메모 | `alt`, `title` | `alt="유리 제품 주의"` |

택배 기사가 송장만 보고 상자를 정확히 분류하듯, JavaScript나 CSS도 Attribute를 보고 정확한 Element를 찾아 스타일을 입히거나 동작을 실행합니다.

## 🪪 두 번째 비유: 사람의 신분증

Attribute를 사람에게 비유하면 더 직관적입니다.

회사에 "김민수"라는 이름의 직원이 3명 있다고 합시다. 이름(태그)만으로는 누구를 말하는지 알 수 없습니다. 하지만 추가 정보가 붙으면 구분이 가능합니다.

- **사번(id)**: 유일한 식별 번호. `id="EMP-0042"` → 딱 한 명만 가리킵니다.
- **소속 부서(class)**: 여러 명이 같은 부서일 수 있습니다. `class="마케팅팀 시니어"` → 마케팅팀 시니어 전원을 한 번에 묶을 수 있습니다.
- **이메일(href)**: 연락할 수 있는 주소. `href="mailto:minsu@company.com"` → 어디로 연결되는지 알려줍니다.

이것이 Attribute의 핵심입니다. **같은 종류의 Element라도 Attribute가 달라지면 완전히 다른 역할**을 하게 됩니다.

## ⚙️ 자주 만나는 Attribute 6가지

<div style="overflow-x:auto;margin:16px 0;">
  <div style="border:3px solid #000;background:#fff;padding:16px;max-width:100%;font-family:sans-serif;">
    <div style="font-weight:bold;margin-bottom:10px;">실제 코드에서 6가지 Attribute 찾아보기</div>
    <pre style="font-family:monospace;font-size:13px;background:#F3F3F3;border:2px solid #000;padding:12px;margin:0;overflow-x:auto;">&lt;img <span style="background:#FFD700;font-weight:bold;">src</span>="/images/banner.jpg" <span style="background:#FFD700;font-weight:bold;">alt</span>="프로모션 배너"&gt;
&lt;a <span style="color:#FF0000;font-weight:bold;">href</span>="/pricing" <span style="color:#FF0000;font-weight:bold;">id</span>="pricing-link" <span style="color:#FF0000;font-weight:bold;">class</span>="nav-link" <span style="color:#FF0000;font-weight:bold;">data-event</span>="click"&gt;요금제&lt;/a&gt;</pre>
    <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:12px;font-size:13px;">
      <div style="flex:1 1 150px;border:2px solid #000;background:#fff;padding:8px 10px;"><b style="font-family:monospace;">id</b> : 페이지에서 딱 하나뿐인 이름</div>
      <div style="flex:1 1 150px;border:2px solid #000;background:#fff;padding:8px 10px;"><b style="font-family:monospace;">class</b> : 여러 요소가 공유하는 분류표</div>
      <div style="flex:1 1 150px;border:2px solid #000;background:#fff;padding:8px 10px;"><b style="font-family:monospace;">href</b> : 클릭하면 이동할 목적지 주소</div>
      <div style="flex:1 1 150px;border:2px solid #000;background:#FFD700;padding:8px 10px;"><b style="font-family:monospace;">src</b> : 불러올 파일이 있는 경로</div>
      <div style="flex:1 1 150px;border:2px solid #000;background:#FFD700;padding:8px 10px;"><b style="font-family:monospace;">alt</b> : 이미지 대신 보여줄 설명 텍스트</div>
      <div style="flex:1 1 150px;border:2px solid #000;background:#F3F3F3;padding:8px 10px;"><b style="font-family:monospace;">data-*</b> : 추적용으로 자유롭게 만드는 커스텀 정보</div>
    </div>
  </div>
  <div style="font-size:13px;color:#555;margin-top:6px;font-family:sans-serif;">여는 태그 안에서 이 6가지만 읽어낼 수 있어도 GTM 설정과 개발자 소통이 훨씬 쉬워집니다.</div>
</div>

웹에는 수십 가지 Attribute가 있지만, 마케터가 실무에서 특히 자주 마주치는 것은 아래 6가지입니다.

### 1. `id`: 유일한 이름표

페이지 전체에서 **단 하나**만 존재하는 고유 식별자입니다. 주민등록번호처럼 중복이 없어야 합니다.

```html
<div id="hero-section">메인 배너 영역</div>
```

GTM에서 특정 버튼 하나만 추적하고 싶을 때, `id`로 정확히 지목할 수 있습니다.

### 2. `class`: 분류 태그

여러 Element에 **같은 이름을 공유**할 수 있는 분류표입니다. 하나의 Element에 여러 class를 띄어쓰기로 붙일 수도 있습니다.

```html
<button class="btn primary large">시작하기</button>
<button class="btn secondary">취소</button>
```

위 두 버튼은 모두 `btn` class를 공유하지만, 하나는 `primary large`, 다른 하나는 `secondary`입니다. CSS는 이 class를 보고 각각 다른 색상과 크기를 입힙니다.

### 3. `href`: 목적지 주소

링크(`<a>`) Element가 **어디로 연결되는지** 알려주는 Attribute입니다.

```html
<a href="https://example.com/pricing">요금제 보기</a>
```

GA에서 외부 링크 클릭을 추적할 때, `href` 값을 기준으로 필터링하는 경우가 많습니다.

### 4. `src`: 파일 경로

이미지(`<img>`), 스크립트(`<script>`) 등이 **불러올 파일의 위치**를 지정합니다.

```html
<img src="/images/banner.jpg" alt="신년 프로모션 배너">
```

### 5. `alt`: 대체 텍스트

이미지가 로드되지 않을 때 보여줄 **설명 텍스트**입니다. 검색 엔진이 이미지 내용을 파악하는 데도 사용하므로 SEO에 중요합니다.

```html
<img src="/images/chart.png" alt="2024년 분기별 매출 성장 추이 그래프">
```

### 6. `data-*`: 사용자 정의 속성

개발자가 자유롭게 만드는 **커스텀 Attribute**입니다. `data-` 뒤에 원하는 이름을 붙여 사용합니다.

```html
<button data-event="signup" data-location="header">무료 체험</button>
```

GTM에서 `data-event`, `data-location` 같은 커스텀 속성을 읽어 이벤트 추적에 활용하는 경우가 매우 많습니다. 개발자에게 "이 버튼에 `data-event` 속성을 추가해 주세요"라고 요청하면, 복잡한 CSS Selector 없이도 깔끔하게 추적할 수 있습니다.

## 💡 이걸 알면 마케터에게 뭐가 좋을까요?

### 1. GTM 트리거 설정이 자유로워집니다

GTM에서 클릭 이벤트를 설정하면 **Click ID**, **Click Classes**, **Click URL** 같은 변수가 자동으로 잡힙니다. 이것들이 전부 클릭된 Element의 Attribute 값입니다.

- `Click ID` = 클릭된 Element의 `id` Attribute
- `Click Classes` = 클릭된 Element의 `class` Attribute
- `Click URL` = 클릭된 `<a>` Element의 `href` Attribute

Attribute를 이해하면 "CTA 버튼 클릭만 추적"하는 트리거를 직접 만들 수 있습니다. 예를 들어, `Click Classes`에 `cta-button`이 포함된 경우에만 이벤트를 발생시키는 식이죠.

### 2. CSS Selector를 읽을 수 있게 됩니다

GA나 히트맵 도구에서 "이 Element를 추적합니다"라는 메시지와 함께 `#hero-section .cta-button` 같은 코드를 보여줄 때가 있습니다.

- `#hero-section` = `id`가 "hero-section"인 Element
- `.cta-button` = `class`가 "cta-button"인 Element

이 표기법을 이해하면, 어떤 Element가 추적되고 있는지 바로 파악할 수 있습니다.

### 3. 개발자와 소통이 정확해집니다

"그 버튼에 추적 코드 좀 넣어주세요" 대신 "CTA 버튼에 `data-event="signup"` Attribute를 추가해 주세요"라고 요청하면, 개발자가 정확히 무엇을 해야 하는지 즉시 이해합니다. 커뮤니케이션 비용이 크게 줄어듭니다.

## 📋 30초 요약

1. **Attribute(속성)** 는 Element에 붙는 추가 정보로, `이름="값"` 형태입니다. 택배 송장처럼 각 Element를 식별하고 동작을 결정합니다.
2. 가장 많이 쓰이는 Attribute는 **id**(고유 이름), **class**(분류), **href**(링크 주소), **src**(파일 경로), **alt**(대체 텍스트), **data-***(커스텀) 입니다.
3. GTM의 Click ID, Click Classes, Click URL은 모두 **클릭된 Element의 Attribute 값**입니다. 이 연결 고리를 이해하면 이벤트 추적 설정이 훨씬 쉬워집니다.

다음에 GTM에서 트리거를 설정할 때, "이 변수가 어떤 Attribute를 읽어오는 거지?"라고 한번 생각해 보세요. 그 순간, 단순한 설정 따라하기에서 원리를 이해하는 단계로 올라서게 됩니다!
