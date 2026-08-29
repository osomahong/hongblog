---
slug: what-is-element
term: Element (요소)
definition: >-
  웹페이지를 구성하는 가장 작은 부품이 Element(요소)입니다. 버튼, 이미지, 텍스트 등 화면에 보이는 모든 것이 각각 하나의
  Element이며, 이들이 조립되어 하나의 웹사이트를 완성합니다.
category: AI_TECH
tags:
  - HTML
  - DOM
publishedAt: '2026-02-11T09:04:49.815Z'
updatedAt: '2026-07-23T00:00:00.000Z'
courseSlug: digital-basic
orderInCourse: 7
relatedTerms:
  - what-is-html
  - what-is-attribute
  - what-is-selector
  - what-is-dom
difficulty: BEGINNER
quiz:
  - options:
      - CSS 스타일 규칙 하나하나를 Element라고 부른다
      - 웹페이지에서 눈에 보이는 것만 Element이다
      - <태그>내용</태그> 형태로 작성된 웹페이지의 개별 부품이다
      - JavaScript 함수를 Element라고 부른다
    question: HTML Element(요소)를 바르게 설명한 것은?
    explanation: >-
      Element(요소)는 HTML에서 <태그>내용</태그> 형태로 작성된 웹페이지의 가장 작은 단위의 부품입니다. <h1>,
      <button>, <img> 등이 모두 Element이며, 눈에 보이지 않는 <div> 같은 투명한 상자도 Element입니다.
    correctIndex: 2
metaTitle: 'HTML 요소(Element) 뜻: 웹페이지를 만드는 기본 부품'
metaDescription: '요소(Element)는 버튼, 이미지, 텍스트처럼 웹페이지를 구성하는 가장 작은 부품입니다. 태그와의 관계와 화면에서 하는 역할을 초보자 눈높이로 정리했습니다.'
ogImage: /og/what-is-element.png
summary3:
  - 'Element는 웹페이지를 이루는 가장 작은 부품이고 HTML에서 여는 태그와 내용, 닫는 태그로 이뤄진 하나하나가 여기에 해당합니다.'
  - '화면에 보이지 않으면서 다른 요소를 담는 구조용 요소와 제목이나 버튼처럼 눈에 보이는 콘텐츠 요소로 나뉩니다.'
  - '개발자가 이 Element를 고쳐 달라고 할 때 가리키는 단위가 이것이고 id와 class 같은 속성이 붙어야 그중 하나를 정확히 집을 수 있습니다.'
---

## 🤔 혹시 이런 생각 해본 적 없나요?

- "개발자가 '이 Element 수정해 주세요'라고 할 때, Element가 정확히 뭘 말하는 걸까?"
- "웹사이트에 보이는 버튼, 이미지, 텍스트… 이것들을 통틀어 부르는 이름이 있을까?"
- "크롬 개발자 도구를 열면 꺾쇠괄호(`< >`) 안에 뭔가 잔뜩 적혀 있는데, 저게 다 뭘까?"

우리가 매일 보는 웹사이트는 수십, 수백 개의 부품으로 조립되어 있습니다. 제목도 부품, 버튼도 부품, 입력란도 부품, 심지어 눈에 보이지 않는 투명한 상자도 부품입니다. 이 하나하나의 부품을 웹에서는 **Element(요소)** 라고 부릅니다.

## 🔑 Element, 한마디로 뭘까요?

Element(요소)는 웹페이지를 이루는 **가장 작은 단위의 부품**입니다.

HTML 코드에서 `<태그>내용</태그>` 형태로 작성된 것 하나하나가 모두 Element입니다. `<h1>제목</h1>`은 제목 요소, `<button>구매하기</button>`은 버튼 요소, `<img>`는 이미지 요소입니다.

이전에 배운 [DOM](/class/digital-basic/what-is-dom)(조직도)에서 하나하나의 직원 카드에 해당하는 것이 바로 이 Element입니다. DOM이 전체 지도라면, Element는 지도 위에 찍힌 건물 하나하나인 셈이죠.

## 🧱 첫 번째 비유: 레고 블록

<div style="overflow-x:auto;margin:16px 0;">
  <div style="border:3px solid #000;background:#fff;padding:16px;max-width:100%;font-family:sans-serif;">
    <div style="font-weight:bold;margin-bottom:10px;">Element(부품) 하나의 구조</div>
    <pre style="font-family:monospace;font-size:15px;background:#F3F3F3;border:2px solid #000;padding:12px;margin:0;overflow-x:auto;"><span style="background:#FFD700;font-weight:bold;">&lt;button&gt;</span><span style="color:#FF0000;font-weight:bold;">구매하기</span><span style="background:#FFD700;font-weight:bold;">&lt;/button&gt;</span></pre>
    <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:12px;font-size:13px;">
      <div style="flex:1 1 140px;border:2px solid #000;background:#FFD700;padding:8px 10px;"><b>여는 태그</b><br>부품의 시작. 종류(button)를 알려줍니다.</div>
      <div style="flex:1 1 140px;border:2px solid #000;background:#fff;padding:8px 10px;"><b style="color:#FF0000;">내용(콘텐츠)</b><br>블록 안에 담긴 실제 내용물입니다.</div>
      <div style="flex:1 1 140px;border:2px solid #000;background:#FFD700;padding:8px 10px;"><b>닫는 태그</b><br>부품의 끝. 슬래시(/)가 붙습니다.</div>
    </div>
  </div>
  <div style="font-size:13px;color:#555;margin-top:6px;font-family:sans-serif;">여는 태그부터 닫는 태그까지, 이 한 덩어리가 레고 블록 하나 즉 Element 하나입니다.</div>
</div>

웹사이트는 거대한 레고 작품에 가깝습니다.

- 빨간 블록 하나는 **버튼(Button Element)** 입니다.
- 넓적한 판 블록은 페이지 전체를 감싸는 **컨테이너(Div Element)** 입니다.
- 스티커가 붙은 블록은 **이미지(Img Element)** 입니다.
- 글씨가 적힌 블록은 **텍스트(Paragraph Element)** 입니다.

레고 작품이 수백 개의 블록으로 이루어지듯, 웹사이트도 수백 개의 Element로 조립됩니다. 각 블록에는 고유한 모양(태그 이름)이 있고, 색깔(CSS 스타일)을 입히고, 특정 위치에 끼워 넣습니다.

핵심은 이겁니다. 레고를 조립할 때 "파란색 2x4 블록"이라고 부르듯, 웹에서는 `<button>`, `<img>`, `<p>` 같은 태그 이름으로 각 부품을 구별합니다.

## 📦 두 번째 비유: 택배 상자의 '송장'

좀 더 실용적인 비유를 들어볼까요? Element를 택배 상자라고 생각해 보세요.

택배 상자에는 세 가지 정보가 있습니다.

1. **상자 종류(태그 이름)**: 일반 박스인지, 냉장 박스인지, 서류 봉투인지. 웹에서는 `<div>`, `<button>`, `<input>` 같은 태그 이름이 이 역할을 합니다.
2. **송장 스티커(속성, Attribute)**: 받는 사람, 보내는 사람, 취급 주의 표시. 웹에서는 `id="purchase-btn"`, `class="primary"`, `href="https://..."` 같은 속성이 이 역할을 합니다.
3. **내용물(콘텐츠)**: 상자 안에 든 실제 물건. 웹에서는 텍스트, 이미지, 또는 다른 Element(상자 안의 상자!)가 이에 해당합니다.

택배 기사(JavaScript)가 "id가 'purchase-btn'인 상자를 찾아서 내용물을 '품절'로 바꿔줘"라고 명령받으면, 송장(속성)을 보고 정확한 상자(Element)를 찾아낼 수 있는 것입니다.

> 💡 **속성(Attribute)** 은 Element에 붙는 추가 정보입니다. 이 개념은 다음 글에서 자세히 다룹니다.

## ⚙️ Element는 어떤 종류가 있나요?

<div style="overflow-x:auto;margin:16px 0;">
  <div style="display:flex;flex-wrap:wrap;gap:12px;max-width:100%;font-family:sans-serif;font-size:13px;">
    <div style="flex:1 1 180px;border:3px solid #000;background:#fff;">
      <div style="background:#F3F3F3;border-bottom:3px solid #000;padding:6px 10px;font-weight:bold;">구조 (뼈대)</div>
      <div style="padding:10px;font-family:monospace;line-height:1.9;">&lt;div&gt;<br>&lt;header&gt;<br>&lt;section&gt;<br>&lt;footer&gt;</div>
      <div style="padding:0 10px 10px;color:#555;">다른 부품을 담는 투명한 상자</div>
    </div>
    <div style="flex:1 1 180px;border:3px solid #000;background:#fff;">
      <div style="background:#FFD700;border-bottom:3px solid #000;padding:6px 10px;font-weight:bold;">콘텐츠 (살)</div>
      <div style="padding:10px;font-family:monospace;line-height:1.9;">&lt;h1&gt;<br>&lt;p&gt;<br>&lt;img&gt;<br>&lt;a&gt;</div>
      <div style="padding:0 10px 10px;color:#555;">눈에 직접 보이는 내용물</div>
    </div>
    <div style="flex:1 1 180px;border:3px solid #000;background:#fff;">
      <div style="background:#FF0000;color:#fff;border-bottom:3px solid #000;padding:6px 10px;font-weight:bold;">상호작용 (기능)</div>
      <div style="padding:10px;font-family:monospace;line-height:1.9;">&lt;button&gt;<br>&lt;input&gt;<br>&lt;form&gt;<br>&lt;select&gt;</div>
      <div style="padding:0 10px 10px;color:#555;">클릭하고 입력하는 부품</div>
    </div>
  </div>
  <div style="font-size:13px;color:#555;margin-top:6px;font-family:sans-serif;">세 종류의 Element가 조합되어 하나의 웹페이지가 완성됩니다.</div>
</div>

웹사이트에서 자주 만나는 Element를 크게 세 가지로 나눠볼 수 있습니다.

### 1. 구조를 잡는 Element (뼈대)

눈에 보이지 않지만, 다른 요소들을 담는 투명한 상자 역할을 합니다.

- `<div>`: 만능 상자. 여러 요소를 하나로 묶을 때 사용합니다.
- `<header>`: 페이지 상단 영역(로고, 메뉴가 들어가는 곳)
- `<section>`: 주제별로 콘텐츠를 구분하는 구역
- `<footer>`: 페이지 하단 영역(회사 정보, 링크 등)

### 2. 콘텐츠를 보여주는 Element (살)

우리 눈에 직접 보이는 내용물입니다.

- `<h1>` ~ `<h6>`: 제목(숫자가 작을수록 큰 제목)
- `<p>`: 문단 텍스트
- `<img>`: 이미지
- `<a>`: 클릭하면 다른 페이지로 이동하는 링크
- `<span>`: 텍스트 일부분만 따로 꾸밀 때 쓰는 인라인 상자

### 3. 사용자와 상호작용하는 Element (기능)

클릭하고, 입력하고, 선택하는 등 동작이 있는 부품입니다.

- `<button>`: 버튼(클릭 이벤트의 주인공)
- `<input>`: 텍스트 입력란, 체크박스, 라디오 버튼 등
- `<form>`: 입력 데이터를 서버로 보내는 양식 묶음
- `<select>`: 드롭다운 선택 메뉴

이 세 종류가 서로 조합되어 하나의 완성된 웹페이지를 만듭니다. 구조 Element 안에 콘텐츠 Element를 넣고, 그 사이에 상호작용 Element를 배치하는 것이죠.

## 💡 이걸 알면 마케터에게 뭐가 좋을까요?

"전 코드를 짤 일이 없는데, 왜 Element까지 알아야 하나요?" 실무에서 생각보다 자주 마주치는 개념이기 때문입니다.

### 1. GTM에서 '클릭 추적'이 훨씬 쉬워집니다

GTM으로 버튼 클릭을 추적할 때, "Click Element"라는 변수를 만나게 됩니다. 이것이 바로 사용자가 클릭한 그 Element(요소)입니다. Element의 종류와 속성(id, class)을 이해하면, "이 버튼만 정확히 추적해줘"라는 설정을 혼자서도 할 수 있게 됩니다.

### 2. 개발자에게 정확한 수정 요청이 가능합니다

"메인 페이지 중간에 있는 그 파란 버튼 좀 바꿔주세요"라고 하면, 개발자는 어떤 버튼인지 찾는 데 시간을 쓰게 됩니다. 하지만 "hero-section 안에 있는 cta-button Element의 텍스트를 변경해 주세요"라고 말하면, 개발자가 단 10초 만에 찾아서 수정할 수 있습니다.

### 3. 웹 접근성과 SEO의 핵심을 이해하게 됩니다

검색 엔진은 Element의 태그 이름을 보고 콘텐츠의 중요도를 판단합니다. `<h1>` 안에 들어 있는 텍스트는 "이 페이지의 핵심 제목"으로 인식하고, `<p>` 안의 텍스트는 "본문 내용"으로 파악합니다. 올바른 Element를 사용하는 것 자체가 SEO의 기본입니다.

## 📋 3줄 요약

1. Element는 웹페이지를 이루는 가장 작은 부품이고 HTML에서 여는 태그와 내용, 닫는 태그로 이뤄진 하나하나가 여기에 해당합니다.
2. 화면에 보이지 않으면서 다른 요소를 담는 구조용 요소와 제목이나 버튼처럼 눈에 보이는 콘텐츠 요소로 나뉩니다.
3. 개발자가 이 Element를 고쳐 달라고 할 때 가리키는 단위가 이것이고 id와 class 같은 속성이 붙어야 그중 하나를 정확히 집을 수 있습니다.

이제 웹사이트를 볼 때 이 화면이 어떤 Element로 조립되어 있는지 헤아려 보게 됩니다. 크롬에서 마우스 오른쪽 클릭 → '검사'를 누르면, 그 궁금증을 직접 눈으로 확인할 수 있습니다!

## 참고 자료

- [MDN HTML 요소 참고서](https://developer.mozilla.org/ko/docs/Web/HTML/Element)
