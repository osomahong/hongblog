---
slug: what-is-css
term: CSS (Cascading Style Sheets)
definition: 'HTML로 만든 웹페이지의 색상, 글꼴, 배치를 꾸미는 스타일 언어입니다.'
category: AI_TECH
tags:
  - CSS
  - HTML
publishedAt: '2026-02-11T08:43:14.838Z'
updatedAt: '2026-07-23T00:00:00.000Z'
courseSlug: digital-basic
orderInCourse: 3
relatedTerms:
  - what-is-html
  - what-is-selector
  - what-is-element
difficulty: BEGINNER
quiz:
  - options:
      - 웹페이지에 버튼 클릭 같은 동작을 추가한다
      - 웹페이지의 구조(뼈대)를 만든다
      - '웹페이지의 색상, 크기, 배치 등 디자인을 담당한다'
      - 서버에서 데이터를 저장하고 불러온다
    question: CSS의 역할로 올바른 것은?
    explanation: >-
      CSS는 HTML로 만든 뼈대 위에 색상, 글꼴, 크기, 배치 등 디자인 규칙을 입히는 스타일링 언어입니다. 구조는 HTML, 동작은
      JavaScript가 담당합니다.
    correctIndex: 2
metaTitle: 'CSS 뜻: 웹페이지를 꾸미는 스타일 언어 기본기'
metaDescription: >-
  CSS는 HTML로 만든 웹페이지의 색상, 글꼴, 배치를 꾸미는 스타일 언어입니다. HTML과 역할이 나뉘는 지점과 기본 문법 구조를 초보자
  눈높이로 정리했습니다.
ogImage: /og/what-is-css.png
summary3:
  - 'CSS는 HTML로 만든 내용에 색과 글꼴, 배치 같은 디자인 규칙을 지정하는 스타일 언어입니다.'
  - '내용을 건드리지 않고 모양만 바꿀 수 있어서 같은 페이지에 다른 디자인을 적용하는 A/B 테스트가 가능합니다.'
  - '원리를 알면 더 예쁘게 대신 배경색을 #0054FF로 바꿔 달라처럼 값으로 요청할 수 있어 디자이너와 나누는 대화가 짧아집니다.'
---

## 🤔 혹시 이런 생각 해본 적 없나요?

- '구매하기' 버튼의 색상을 바꾸려면 어떻게 해야할까?"
- "분명 똑같은 글 내용인데, 왜 스마트폰에서 볼 때랑 PC에서 볼 때 모양이 다를까?"
- "우리 회사 사이트는 왜 경쟁사처럼 세련된 느낌이 안 날까?"

이런 질문의 답은 바로 웹사이트의 디자인과 분위기를 담당하는 CSS에 있습니다.

## 🔑 CSS, 한마디로 뭘까요?

CSS는 [HTML](/class/digital-basic/what-is-html)로 만든 뼈대 위에 디자인 규칙을 입혀주는 스타일링 언어입니다.

HTML이 "여기 제목이 있고, 여기 내용이 있어"라고 사실만 전달한다면, CSS는 "제목은 파란색으로 하고, 내용은 폰트를 키워서 보기 좋게 만들어"라고 꾸며주는 역할을 합니다.

## 🏢 첫 번째 비유: 인테리어 시공

<div style="overflow-x:auto;margin:16px 0;">
  <div style="display:flex;flex-wrap:wrap;gap:12px;max-width:100%;font-family:sans-serif;">
    <div style="flex:1 1 220px;border:3px solid #000;background:#fff;">
      <div style="background:#F3F3F3;border-bottom:3px solid #000;padding:6px 10px;font-weight:bold;">CSS 적용 전</div>
      <div style="padding:14px;">
        <div style="font-size:15px;">구매하기</div>
        <div style="margin-top:10px;color:#555;font-size:13px;">HTML만 있는 상태. 내용은 있지만 검은 글자뿐입니다.</div>
      </div>
    </div>
    <div style="flex:1 1 220px;border:3px solid #000;background:#fff;">
      <div style="background:#FFD700;border-bottom:3px solid #000;padding:6px 10px;font-weight:bold;">CSS 적용 후</div>
      <div style="padding:14px;">
        <span style="display:inline-block;background:#0054FF;color:#fff;padding:10px 22px;border-radius:10px;font-weight:bold;">구매하기</span>
        <div style="margin-top:10px;color:#555;font-size:13px;">배경색, 글자색, 둥근 모서리가 입혀진 상태입니다.</div>
      </div>
    </div>
  </div>
  <div style="font-size:13px;color:#555;margin-top:6px;font-family:sans-serif;">같은 HTML이라도 CSS라는 인테리어를 입히면 전혀 다른 모습이 됩니다.</div>
</div>

HTML 설명에서 건물의 '뼈대(골조)' 이야기를 했었죠? 그 뼈대만 있는 회색 콘크리트 건물에 들어가면 삭막하고 사람이 살 수 없습니다.

우리가 아는 아늑한 집이 되려면 인테리어가 필요합니다.

- 벽지: 삭막한 회색 벽에 따뜻한 베이지색 페인트 칠하기
- 가구 배치: 거실 중앙에 소파 놓기
- 조명: 은은한 조명 달기

CSS가 바로 이 인테리어 역할을 합니다. HTML이라는 튼튼한 골조 위에, 사용자가 보기 편하고 아름답게 느끼도록 디자인을 입히는 과정이죠.

## 📊 두 번째 비유: PPT '디자인 테마' 적용하기

마케터라면 PPT 많이 만드시죠? 이 비유가 가장 확실할 겁니다.

흰 바탕에 검은 글씨로만 내용을 잔뜩 적은 PPT 슬라이드가 바로 HTML입니다. 내용은 있지만 보기에 예쁘지는 않죠.

이때 상단 메뉴에서 [디자인 테마] 버튼을 누르면 어떻게 되나요?

- 클릭 한 번에 모든 페이지의 배경이 남색으로 변하고
- 제목 폰트가 굵은 고딕체로 바뀌고
- 본문 줄 간격이 시원하게 벌어집니다.

내용(텍스트)은 단 한 글자도 바꾸지 않았는데, 보이는 디자인이 완전히 달라졌죠?

CSS가 바로 웹사이트의 **디자인 테마**입니다.
"우리 사이트의 모든 제목은 파란색으로 보여줘!"라고 CSS 파일에 딱 한 번만 적어두면, 수천 페이지의 웹사이트 디자인이 동시에 적용되는 원리입니다.

## ⚙️ 그래서 CSS는 어떻게 생겼나요?

<div style="overflow-x:auto;margin:16px 0;">
  <div style="border:3px solid #000;background:#fff;padding:16px;max-width:100%;font-family:sans-serif;">
    <div style="font-weight:bold;margin-bottom:10px;">CSS 규칙 한 줄 해부하기</div>
    <pre style="font-family:monospace;font-size:14px;background:#F3F3F3;border:2px solid #000;padding:12px;margin:0;overflow-x:auto;"><span style="background:#FFD700;font-weight:bold;">.buy-button</span> {
  <span style="color:#FF0000;font-weight:bold;">background-color</span>: <span style="text-decoration:underline;font-weight:bold;">blue</span>;
}</pre>
    <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:12px;font-size:13px;">
      <div style="flex:1 1 140px;border:2px solid #000;background:#FFD700;padding:8px 10px;"><b>[선택자](/class/digital-basic/what-is-selector)(Selector)</b><br>누구를 꾸밀지 지정</div>
      <div style="flex:1 1 140px;border:2px solid #000;background:#fff;padding:8px 10px;"><b style="color:#FF0000;">속성(Property)</b><br>무엇을 바꿀지 지정</div>
      <div style="flex:1 1 140px;border:2px solid #000;background:#F3F3F3;padding:8px 10px;"><b>값(Value)</b><br>어떻게 바꿀지 지정</div>
    </div>
  </div>
  <div style="font-size:13px;color:#555;margin-top:6px;font-family:sans-serif;">CSS 문법은 "누구를(선택자), 무엇을(속성), 어떻게(값)" 세 부분으로 이루어집니다.</div>
</div>

CSS는 "누구(Selector)를 콕 집어서, 어떻게(Property) 꾸며줘"라고 명령하는 방식입니다.

### 비포 & 애프터로 확인해보기

HTML만 있을 때 (디자인 없는 PPT):

> 구매하기
> 

CSS를 입히면 (디자인 적용된 PPT):

> [ 배경은 파랗고 글자는 하얀 둥근 버튼 ]
> 

이걸 코드로 보면 이렇게 생겼습니다.

```css
/* 구매 버튼(buy-button)을 찾아서 이렇게 꾸며줘! */
.buy-button {
  background-color: blue; /* 배경은 파란색 */
  color: white;           /* 글자는 흰색 */
  border-radius: 10px;    /* 모서리는 둥글게 */
  padding: 20px;          /* 크기는 넉넉하게 */
}

```

브라우저는 이 주문서를 읽고, 그냥 텍스트였던 '구매하기'를 우리가 아는 '클릭하고 싶은 파란 버튼'으로 바꿔 줍니다.

## 💡 이걸 알면 마케터에게 뭐가 좋을까요?

디자인은 디자이너가 하는 거 아닌가요? 맞습니다. 하지만 마케터가 CSS의 원리를 알면 업무 효율이 기하급수적으로 올라갑니다.

### 1. "느낌적인 느낌" 말고 "정확한 값"으로 소통합니다.

디자이너나 개발자에게 수정 요청할 때 가장 힘든 게 모호한 표현입니다.

- ❌ 나쁜 예: "버튼 색깔 좀 더 쨍하고 예쁜 파란색으로 해주세요."
- ⭕ 좋은 예: "지금 버튼 배경색(CSS)을 우리 브랜드 컬러 코드인 #0054FF로 변경해 주세요."
👉 피드백이 명확해지면 수정 횟수가 줄어들고 작업 속도가 빨라집니다.

### 2. A/B 테스트의 구조가 보입니다.

"버튼을 빨간색으로 바꿨을 때 클릭률이 오를까?"
이런 테스트를 할 때, 웹사이트를 새로 만드는 게 아닙니다. HTML은 그대로 두고, CSS에서 색상 코드 한 줄만 바꿔서 사용자에게 보여주는 원리입니다. 이 구조를 이해하면 개발자의 도움 없이도 간단한 스타일 테스트를 기획할 수 있는 눈이 생깁니다.

### 3. 반응형 웹(모바일 화면)을 이해하게 됩니다.

요즘은 PC보다 모바일이 중요하죠? "PC에서는 가로로 보이던 게 왜 모바일에서는 세로로 보이지?"
이것도 CSS가 하는 일입니다. "화면이 작아지면 배치를 바꿔라"라는 CSS 규칙을 이해하면, 모바일 최적화 마케팅에서 더 구체적인 아이디어를 낼 수 있습니다.

## 📋 3줄 요약

1. CSS는 HTML로 만든 내용에 색과 글꼴, 배치 같은 디자인 규칙을 지정하는 스타일 언어입니다.
2. 내용을 건드리지 않고 모양만 바꿀 수 있어서 같은 페이지에 다른 디자인을 적용하는 A/B 테스트가 가능합니다.
3. 원리를 알면 더 예쁘게 대신 배경색을 #0054FF로 바꿔 달라처럼 값으로 요청할 수 있어 디자이너와 나누는 대화가 짧아집니다.

웹사이트가 갑자기 예뻐 보인다면? "아, CSS가 열일하고 있구나!" 하고 생각해 주세요! 

## 참고 자료

- [MDN CSS 문서](https://developer.mozilla.org/ko/docs/Web/CSS)
