---
slug: what-is-selector
term: Selector (선택자)
definition: >-
  웹페이지에서 특정 Element를 찾아내기 위한 '주소'나 '이름표' 같은 것입니다. CSS에서 스타일을 적용하거나, GTM에서 클릭
  이벤트를 추적할 때 '이 버튼'을 지정하는 방법입니다.
category: AI_TECH
tags:
  - CSS
  - GTM
  - DOM
publishedAt: '2026-02-11T09:05:59.355Z'
courseSlug: digital-basic
orderInCourse: 8
aliases:
  - CSS Selector
  - CSS 선택자
  - 선택자
relatedTerms:
  - what-is-element
  - what-is-attribute
  - whatiscss
difficulty: BEGINNER
quiz:
  - options:
      - btn-purchase
      - .btn-purchase
      - '#btn-purchase'
      - button.btn-purchase
    question: >-
      GTM에서 '구매하기' 버튼 클릭을 추적하려고 합니다. 개발자 도구로 확인했더니 <button class="btn-purchase"
      id="buy-now">구매하기</button>로 되어 있습니다. GTM 트리거 설정 시 Class Selector를 사용한다면
      어떻게 입력해야 할까요?
    explanation: >-
      GTM의 Click Classes 필드에는 점(.) 없이 클래스 이름만 입력합니다. CSS 코드에서는 .btn-purchase로
      쓰지만, GTM 트리거 설정에서는 btn-purchase만 입력하면 됩니다. #는 ID Selector에 사용되는 기호입니다.
    correctIndex: 0
ogImage: /og/what-is-selector.png
---

## 🤔 혹시 이런 생각 해본 적 없나요?

- GTM에서 클릭 추적 설정할 때 '일부 클릭'을 선택하면 나오는 **Click Classes**, **Click ID** 같은 옵션들, 이게 뭘까?
- 개발자에게 "이 버튼 클릭 추적해주세요"라고 요청했더니 "어떤 selector로 할까요?"라고 물어봤는데, 뭘 말하는 걸까?
- 웹페이지 검사 모드에서 코드를 보면 `class="button-primary"` 같은 게 보이는데, 이걸 어떻게 활용하는 걸까?

## 🔑 Selector, 한마디로 뭘까요?

**Selector(선택자)**는 웹페이지에서 특정 Element를 찾아내기 위한 **'주소'** 같은 것입니다.

마치 "서울시 강남구 테헤란로 123번지"처럼 건물의 주소를 알려주면 그 건물을 찾을 수 있듯이, Selector는 "이 버튼", "저 이미지", "이 텍스트"를 정확하게 지정하는 방법입니다.

CSS에서 스타일을 적용할 때도, GTM에서 클릭을 추적할 때도, 개발자 도구로 Element를 찾을 때도 모두 Selector를 사용합니다.

## 📞 Selector는 사람 이름 부르기와 같습니다


<div style="overflow-x:auto;margin:16px 0;">
  <div style="border:3px solid #000;background:#fff;padding:16px;max-width:100%;font-family:sans-serif;">
    <div style="font-weight:bold;margin-bottom:10px;">같은 HTML, 부르는 방법 3가지</div>
    <pre style="font-family:monospace;font-size:13px;background:#F3F3F3;border:2px solid #000;padding:12px;margin:0;overflow-x:auto;">&lt;button <span style="background:#FFD700;font-weight:bold;">id="buy-now"</span> <span style="color:#FF0000;font-weight:bold;">class="btn"</span>&gt;구매하기&lt;/button&gt;
&lt;button <span style="color:#FF0000;font-weight:bold;">class="btn"</span>&gt;장바구니&lt;/button&gt;
&lt;a href="/help"&gt;고객센터&lt;/a&gt;</pre>
    <div style="margin-top:12px;font-size:13px;">
      <div style="border:2px solid #000;padding:8px 10px;margin-bottom:6px;background:#FFD700;"><span style="font-family:monospace;font-weight:bold;">#buy-now</span> → "김철수 씨!" : '구매하기' 버튼 딱 하나만 선택</div>
      <div style="border:2px solid #000;padding:8px 10px;margin-bottom:6px;background:#fff;"><span style="font-family:monospace;font-weight:bold;color:#FF0000;">.btn</span> → "마케팅팀 분들!" : '구매하기'와 '장바구니' 버튼 둘 다 선택</div>
      <div style="border:2px solid #000;padding:8px 10px;background:#F3F3F3;"><span style="font-family:monospace;font-weight:bold;">button</span> → "학생 여러분!" : 페이지의 모든 button 요소 선택</div>
    </div>
  </div>
  <div style="font-size:13px;color:#555;margin-top:6px;font-family:sans-serif;">어떤 호칭(선택자)을 쓰느냐에 따라 잡히는 요소의 범위가 달라집니다.</div>
</div>

100명이 모인 강의실에서 특정 사람을 부를 때를 생각해보세요.

- **"김철수씨!"** - 이름으로 부르기 (ID Selector)
- **"마케팅팀 분들!"** - 그룹으로 부르기 (Class Selector)
- **"학생 여러분!"** - 전체 유형으로 부르기 (Tag Selector)

웹페이지도 마찬가지입니다. 수백 개의 Element 중에서 **"정확히 이것"**을 지정하려면 적절한 '호칭'이 필요한데, 그게 바로 Selector입니다.

## 📚 Selector는 도서관에서 책 찾기와 같습니다

도서관에서 책을 찾는 방법을 생각해보세요.

- **청구기호(고유번호)로 찾기** → ID Selector (`#login-button`)
  - 세상에 단 하나만 존재하는 고유한 Element를 찾을 때
- **분류(소설, 에세이)로 찾기** → Class Selector (`.btn-primary`)
  - 같은 스타일, 같은 기능을 가진 여러 Element를 한 번에 찾을 때
- **형태(책, 잡지)로 찾기** → Tag Selector (`button`, `a`)
  - 같은 종류의 모든 Element를 찾을 때

## ⚙️ 어떤 종류가 있나요?

### 1. **Tag Selector (태그 선택자)**
같은 종류의 Element를 모두 선택합니다.

<div style="overflow-x:auto;margin:16px 0;">
  <div style="display:flex;flex-wrap:wrap;gap:12px;max-width:100%;font-family:sans-serif;">
    <div style="flex:1 1 220px;border:3px solid #000;background:#fff;">
      <div style="background:#F3F3F3;border-bottom:3px solid #000;padding:6px 10px;font-weight:bold;">CSS 코드</div>
      <pre style="font-family:monospace;font-size:13px;padding:12px;margin:0;overflow-x:auto;"><span style="background:#FFD700;font-weight:bold;">button</span> { color: blue; }</pre>
    </div>
    <div style="flex:1 1 220px;border:3px solid #000;background:#fff;">
      <div style="background:#FFD700;border-bottom:3px solid #000;padding:6px 10px;font-weight:bold;">선택 결과</div>
      <div style="padding:12px;font-size:13px;">
        <div style="border:2px solid #000;display:inline-block;padding:4px 10px;color:#0054FF;font-weight:bold;margin:2px;">구매하기 ✔</div>
        <div style="border:2px solid #000;display:inline-block;padding:4px 10px;color:#0054FF;font-weight:bold;margin:2px;">장바구니 ✔</div>
        <div style="border:2px dashed #999;display:inline-block;padding:4px 10px;color:#555;margin:2px;">고객센터 링크 ✘</div>
      </div>
    </div>
  </div>
  <div style="font-size:13px;color:#555;margin-top:6px;font-family:sans-serif;">Tag Selector는 같은 태그 이름을 가진 요소를 전부 선택합니다. 링크(a)는 button이 아니라서 제외됩니다.</div>
</div>

```css

button { color: blue; }

```

→ 페이지의 **모든 버튼**을 선택

### 2. **Class Selector (클래스 선택자)**
같은 class Attribute를 가진 Element들을 선택합니다. 앞에 `.`(점)을 붙입니다.
```css
.btn-primary { background: blue; }
```
→ `class="btn-primary"`를 가진 **모든 Element** 선택

**GTM에서 가장 많이 사용하는 Selector입니다!**

### 3. **ID Selector (아이디 선택자)**
고유한 id Attribute를 가진 Element를 선택합니다. 앞에 `#`(샵)을 붙입니다.
```css
#login-button { border: 1px solid; }
```
→ `id="login-button"`를 가진 **단 하나의 Element** 선택

### 4. **Attribute Selector (속성 선택자)**
특정 Attribute를 가진 Element를 선택합니다.
```css
[data-event="click"] { ... }
```
→ GTM 추적용으로 자주 사용되는 방식입니다

## 💡 이걸 알면 마케터에게 뭐가 좋을까요?

### 1. **GTM 클릭 추적을 직접 설정할 수 있습니다**
"구매하기" 버튼 클릭을 추적하고 싶을 때, 개발자 없이도 직접 설정할 수 있습니다.
- 트리거 조건: Click Classes에 `btn-purchase` 입력
- 또는: Click ID에 `checkout-button` 입력

### 2. **개발자와 정확하게 소통할 수 있습니다**
"메인페이지 파란색 버튼"이 아니라, **"class가 hero-cta인 버튼"**처럼 정확하게 요청할 수 있습니다. 개발자는 이 말을 듣는 순간 정확히 어떤 Element인지 알 수 있습니다.

### 3. **문제가 생겼을 때 스스로 확인할 수 있습니다**
GTM 태그가 안 작동할 때, 개발자 도구(F12)로 Element를 확인하고 "아, class 이름이 바뀌었네"라고 스스로 원인을 파악할 수 있습니다.

## 📋 30초 요약

1. **Selector는 웹페이지에서 특정 Element를 찾아내는 '주소'입니다.** 사람 이름 부르기, 책 찾기처럼 대상을 정확하게 지정하는 방법입니다.

2. **주요 종류는 Tag(button), Class(.btn-primary), ID(#login-button)가 있으며,** GTM에서는 주로 Class와 ID Selector를 사용해 클릭 이벤트를 추적합니다.

3. **Selector를 알면 GTM 설정을 직접 할 수 있고,** 개발자와 정확하게 소통할 수 있으며, 추적 오류를 스스로 해결할 수 있습니다.
