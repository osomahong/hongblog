---
slug: what-is-dom
term: DOM (Document Object Model)
definition: >-
  웹 개발, DOM이 궁금하다면? 버튼, 텍스트, 이미지까지, 웹 페이지의 모든 요소를 이해하고 다룰 수 있도록 돕는 DOM의 개념과 활용법을
  지금 바로 확인하세요! 클릭 한 번으로 디지털 이해력과 실력을 성장시킬 수 있습니다.
category: AI_TECH
tags:
  - DOM
publishedAt: '2026-02-11T08:58:45.297Z'
updatedAt: '2026-07-23T00:00:00.000Z'
courseSlug: digital-basic
orderInCourse: 4
relatedTerms:
  - whatishtml
  - what-is-javascript
  - what-is-element
  - what-is-bom
difficulty: BEGINNER
quiz:
  - options:
      - HTML 파일 자체를 의미한다
      - 웹페이지의 디자인(CSS)을 저장하는 공간이다
      - '브라우저가 HTML을 분석해 만든, 요소를 찾고 조작할 수 있는 트리 구조이다'
      - JavaScript 코드를 실행하는 엔진이다
    question: DOM에 대한 설명으로 올바른 것은?
    explanation: >-
      DOM은 브라우저가 HTML 문서를 읽고, 각 요소를 부모-자식 관계의 트리 구조(객체)로 변환한 것입니다. JavaScript나
      GTM은 이 DOM을 통해 특정 요소를 찾고 수정할 수 있습니다. HTML 원본 파일 그 자체가 아닌, 브라우저가 해석한
      결과물입니다.
    correctIndex: 2
metaTitle: 'DOM 뜻: 브라우저가 HTML을 다루는 구조'
metaDescription: >-
  웹 개발, DOM이 궁금하다면? 버튼, 텍스트, 이미지까지, 웹 페이지의 모든 요소를 이해하고 다룰 수 있도록 돕는 DOM의 개념과 활용법을
  지금 바로 확인하세요! 클릭 한 번으로 디지털 이해력과 실력을 성장시킬 수 있습니다.
ogImage: /og/what-is-dom.png
---

## 🤔 혹시 이런 생각 해본 적 없나요?

- "JavaScript는 어떻게 수많은 버튼 중에서 '구매하기' 버튼만 콕 집어서 색깔을 바꿀까?"
- "똑같이 생긴 '담기' 버튼이 10개나 있는데, 컴퓨터는 내가 3번째 상품을 눌렀는지 어떻게 알까?"
- "분명 같은 페이지인데, 로그인한 저에게는 '김마케터님, 환영합니다!'라는 문구가 어떻게 보일 수 있을까?"

우리는 눈으로 보고 "아, 이게 구매 버튼이네"라고 알지만, 눈이 없는 컴퓨터는 그걸 볼 수 없습니다.
이처럼 컴퓨터(브라우저)가 웹페이지의 구성 요소를 인식하고, 찾아내고, 조작할 수 있도록 만들어주는 숨겨진 지도, 그것이 바로 DOM입니다.

## 🔑 DOM, 한마디로 뭘까요?

DOM(Document Object Model)은 웹페이지의 모든 요소에 '이름표'와 '주소'를 붙여 만든 상세한 지도입니다.

쉽게 말해, HTML이 그냥 글자로 적힌 텍스트 문서라면, DOM은 그 문서를 분석해서 "이건 제목, 이건 본문, 이건 버튼"이라고 컴퓨터가 이해할 수 있는 객체(물건)로 바꿔놓은 상태를 말합니다.

JavaScript나 GTM 같은 도구들은 이 DOM이라는 지도가 없으면 아무것도 찾을 수 없고, 아무 일도 할 수 없습니다.

## 🏢 첫 번째 비유: 회사의 '조직도'


<div style="overflow-x:auto;margin:16px 0;">
  <div style="border:3px solid #000;background:#fff;padding:16px;max-width:100%;font-family:sans-serif;font-size:13px;">
    <div style="font-weight:bold;margin-bottom:10px;">DOM 트리: 상자 안의 상자 구조</div>
    <div style="border:3px solid #000;background:#F3F3F3;padding:10px;">
      <div style="font-family:monospace;font-weight:bold;margin-bottom:8px;">document <span style="font-family:sans-serif;font-weight:normal;color:#555;">(회사 전체)</span></div>
      <div style="border:2px solid #000;background:#fff;padding:10px;">
        <div style="font-family:monospace;font-weight:bold;margin-bottom:8px;">&lt;body&gt; <span style="font-family:sans-serif;font-weight:normal;color:#555;">(마케팅본부)</span></div>
        <div style="border:2px solid #000;background:#F3F3F3;padding:10px;">
          <div style="font-family:monospace;font-weight:bold;margin-bottom:8px;">&lt;div&gt; <span style="font-family:sans-serif;font-weight:normal;color:#555;">(퍼포먼스2팀)</span></div>
          <div style="border:2px solid #000;background:#FFD700;padding:8px;display:inline-block;">
            <span style="font-family:monospace;font-weight:bold;">&lt;button&gt;</span> <span style="color:#555;">(팀원: 구매 버튼)</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div style="font-size:13px;color:#555;margin-top:6px;font-family:sans-serif;">바깥 상자가 부모, 안쪽 상자가 자식입니다. JavaScript는 이 소속 관계를 따라 원하는 요소를 찾아갑니다.</div>
</div>

가장 이해하기 쉬운 비유는 회사의 조직도입니다.

- HTML: "김철수, 이영희, 박민준..." 그냥 직원 이름만 쭉 적어놓은 명단입니다. 누가 부장이고 누가 사원인지, 누가 누구 팀인지 알기 어렵습니다.
- DOM: 이것을 바탕으로 만든 체계적인 조직도입니다.

JavaScript(사장님)가 일을 시킬 때를 생각해 볼까요?
"거기 안경 쓴 사람 들어오라고 해"라고 하면 누군지 못 찾겠죠?
하지만 조직도(DOM)가 있으면 이렇게 명령할 수 있습니다.

"마케팅본부(body) 산하의 퍼포먼스2팀(div)에 있는 안경쓴 여성팀원(button)에게 가서, 색깔을 빨갛게 바꾸라고 전해."

DOM은 이렇게 웹페이지의 모든 요소를 부모(상위 폴더)와 자식(하위 파일) 관계인 트리 구조(Tree Structure)로 정리해 둡니다. 덕분에 아주 복잡한 웹사이트에서도 원하는 요소를 정확하게 찾아갈 수 있는 것이죠.

## 🗺️ 두 번째 비유: 내비게이션 주소 시스템

조금 더 쉬운 비유를 들어볼까요? 웹사이트를 거대한 도시라고 생각해 보세요.

1. 우리가 보는 웹사이트 화면은 도시의 풍경입니다. 건물이 있고, 간판이 보이죠.
2. 하지만 택배 기사(JavaScript/GTM)는 풍경만 보고는 집을 찾을 수 없습니다. "파란 지붕 집으로 가주세요"라고 하면 헷갈리니까요.
3. 그래서 모든 건물에는 고유한 주소(DOM)가 붙어 있습니다.
- "서울특별시 강남구 테헤란로 123번지 1층 (상세주소)"

브라우저는 HTML 코드를 읽어서, 이런 주소 체계를 만듭니다.
"이 이미지는 메인 섹션(Main Section) 안에 있는, 세 번째 박스(Div) 안에 들어있는 이미지(Img)야."

이렇게 정확한 주소가 생성되어야만, 웹사이트에게 "'테헤란로 123번지'에 누가 방문해서 벨을 누르면(Click) 나한테 알려줘!"라고 시킬 수 있는 겁니다.

## ⚙️ 그래서 DOM은 어떻게 작동하나요?


<div style="overflow-x:auto;margin:16px 0;">
  <div style="display:flex;flex-wrap:wrap;gap:12px;max-width:100%;font-family:sans-serif;font-size:13px;">
    <div style="flex:1 1 220px;border:3px solid #000;background:#fff;">
      <div style="background:#F3F3F3;border-bottom:3px solid #000;padding:6px 10px;font-weight:bold;">1. HTML 원본 (텍스트 문서)</div>
      <pre style="font-family:monospace;font-size:12px;padding:12px;margin:0;overflow-x:auto;">&lt;body&gt;
  &lt;div&gt;
    &lt;button&gt;구매하기&lt;/button&gt;
  &lt;/div&gt;
&lt;/body&gt;</pre>
    </div>
    <div style="flex:1 1 220px;border:3px solid #000;background:#fff;">
      <div style="background:#FFD700;border-bottom:3px solid #000;padding:6px 10px;font-weight:bold;">2. 브라우저가 만든 DOM 지도</div>
      <div style="padding:12px;font-family:monospace;line-height:2;">document<br>└ body <span style="font-family:sans-serif;color:#555;">(본문)</span><br>&nbsp;&nbsp;└ div <span style="font-family:sans-serif;color:#555;">(상품 구역)</span><br>&nbsp;&nbsp;&nbsp;&nbsp;└ <span style="background:#FFD700;font-weight:bold;">button</span> <span style="font-family:sans-serif;color:#FF0000;font-weight:bold;">← 여기를 찾아 '품절'로 변경</span></div>
    </div>
  </div>
  <div style="font-size:13px;color:#555;margin-top:6px;font-family:sans-serif;">JavaScript와 GTM은 왼쪽 텍스트가 아니라 오른쪽 지도를 보고 경로를 따라가 요소를 조작합니다.</div>
</div>

JavaScript나 GTM은 원본 HTML 파일(텍스트)을 직접 뒤지지 않습니다. 대신, 브라우저가 깔끔하게 정리해놓은 DOM이라는 입체적인 지도를 보고 움직입니다.

실제 작동 과정을 훔쳐보면 이렇습니다.

1. 마케터의 명령: "구매 버튼을 찾아서 '품절'로 글씨를 바꿔줘."
2. JavaScript의 탐색: DOM 지도를 펼칩니다.
3. 경로 추적: document(문서 전체) → body(본문) → div(상품 구역) → button(구매 버튼) 순서로 찾아갑니다.
4. 조작(Manipulation): 해당 버튼을 꽉 잡고, 텍스트 내용을 '구매하기'에서 '품절'로 갈아 끼웁니다.

이 과정이 0.01초 만에 일어나기 때문에, 우리 눈에는 버튼이 순식간에 바뀌는 것처럼 보이는 것입니다.

## 💡 이걸 알면 마케터에게 뭐가 좋을까요?

"전 개발자가 아닌데 굳이 이 복잡한 걸 알아야 하나요?"
네, 특히 데이터 분석과 그로스 해킹에 관심이 있다면 필수입니다.

### 1. GTM(구글 태그 매니저)의 작동 원리를 깨닫게 됩니다.

GTM에서 '트리거'를 설정할 때, "CSS 선택자(Selector)"라는 말을 들어보셨을 겁니다. 이게 바로 DOM 주소입니다.
"클릭이 안 잡혀요!"라고 답답해하는 상황의 90%는, GTM이 DOM이라는 주소를 제대로 못 찾고 있거나, 주소가 모호하기 때문입니다. DOM의 계층 구조(부모-자식 관계)를 이해하면, GTM 세팅 능력이 전문가 수준으로 올라갑니다.

### 2. 크롤링(데이터 수집)과 SEO를 이해할 수 있습니다.

네이버나 구글의 검색 로봇은 우리 사이트의 DOM을 읽어갑니다.
만약 우리 사이트가 DOM을 너무 늦게 만들거나 꼬아 놓으면, 검색 로봇이 "아, 여기는 지도가 엉망이라 무슨 내용인지 모르겠네" 하고 떠나버립니다. DOM 구조가 깔끔해야 검색 노출도 잘 된다는 사실을 이해하게 됩니다.

### 3. 개발자에게 '구체적인' 요청이 가능해집니다.

개발자에게 "이 버튼 클릭 추적이 안 돼요"라고 말하면 서로 답답합니다.
하지만 "이 버튼이 DOM 상에서 고유한 ID가 없어서 GTM이 못 찾네요. ID 하나만 부여해 주실 수 있나요?"라고 말해보세요. 개발자가 깜짝 놀라며 즉시 해결해 줄 겁니다.

## 📋 30초 요약

1. DOM은 HTML 문서를 컴퓨터가 이해하기 쉽게 정리한 조직도이자 지도입니다.
2. 모든 웹페이지 요소에 정확한 주소와 소속(부모-자식 관계)을 부여합니다.
3. JavaScript와 GTM은 이 DOM 지도를 보고 원하는 요소를 찾아가서 클릭을 세거나 내용을 바꿉니다.

이제 웹페이지를 볼 때 단순히 그림으로 보지 마세요.
"아, 저 버튼은 어떤 부모 태그 밑에 소속되어 있는 녀석일까?"
이런 궁금증이 든다면, 여러분은 이미 웹의 구조를 꿰뚫어 보는 마케터입니다! 🧐
