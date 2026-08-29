---
slug: gtm-debugging-practical-guide
title: 'GTM 디버깅 실전 가이드: 태그가 안 찍힐 때 원인 찾는 법'
excerpt: >-
  GTM에서 태그가 안 찍힐 때 원인을 빠르게 찾는 실전 가이드. Preview 모드 활용법, 5대 원인 분석, Network 탭으로 실제
  전송 확인하는 방법, 그리고 실무에서 자주 겪는 디버깅 케이스까지 정리했습니다.
category: DATA
tags:
  - GTM
  - GA4
  - 데이터 추적
quiz:
  - options:
      - GTM 트리거 조건을 다시 확인한다
      - 브라우저 Network 탭에서 실제 전송 여부를 확인한다
      - GTM 컨테이너를 다시 게시한다
    question: 'GTM Preview에서 태그가 ''Fired''로 표시되었지만 GA4에 데이터가 안 들어올 때, 다음 단계로 확인해야 할 곳은?'
    explanation: >-
      Preview에서 Fired라고 나와도 광고 차단기나 CSP 설정 때문에 실제 서버로 요청이 전송되지 않을 수 있습니다.
      Network 탭에서 collect? 등의 요청이 실제로 나가는지 확인하는 것이 다음 단계입니다.
    correctIndex: 1
metaTitle: 'GTM 디버깅 실전 가이드 : 태그가 안 찍힐 때 원인 찾는 법'
metaDescription: >-
  GTM 태그가 안 찍히는 5대 원인과 해결법을 정리했습니다. Preview 모드 활용법, Network 탭으로 실제 전송 확인, SPA
  대응, 전환 중복 해결까지 실무 체크리스트와 함께 안내합니다.
ogTitle: 'GTM 디버깅 실전 가이드: 태그가 안 찍힐 때 원인 찾는 법'
ogDescription: 'GTM Preview부터 Network 탭까지, 태그 미작동 원인을 체계적으로 찾는 실전 디버깅 가이드입니다.'
ogImage: /og/gtm-debugging-practical-guide.png
summary3:
  - 'GTM 디버깅의 첫 단계는 미리보기 모드를 켜고 발동된 태그와 안 된 태그를 나눠 보는 일입니다.'
  - '태그가 안 찍히는 가장 흔한 원인은 트리거 조건과 실제 값의 불일치이고 URL 끝 슬래시 하나로도 어긋납니다.'
  - '미리보기 창이 아예 열리지 않으면 광고 차단 확장과 이전 세션 쿠키, GTM 컨테이너 ID가 맞는지 확인합니다.'
---

GTM(Google Tag Manager)을 설정하고 나면 "잘 되겠지"라고 생각하기 쉽습니다. 그런데 막상 GA4에 들어가보면 데이터가 안 들어오거나, [전환](/class/digital-marketing-terms/what-is-conversion) 이벤트가 2번 찍히거나, 특정 페이지에서만 태그가 작동하지 않는 상황이 꽤 자주 발생합니다.

이 글에서는 GTM에서 태그가 정상 작동하지 않을 때 **원인을 빠르게 찾는 방법**을 정리합니다. Preview 모드 활용법부터 브라우저 개발자 도구까지, 실무에서 바로 쓸 수 있는 디버깅 체크리스트를 다룹니다.

## GTM Preview 모드: 디버깅의 시작점

GTM 디버깅의 첫 단계는 항상 **Preview 모드**입니다. GTM 워크스페이스 우측 상단의 [미리보기] 버튼을 클릭하면 Tag Assistant 창이 뜨면서 디버그 콘솔이 활성화됩니다.

### Preview에서 반드시 확인해야 할 3가지

| 확인 항목 | 위치 | 확인 방법 |
|---|---|---|
| **Tags Fired / Not Fired** | Summary 탭 | 발동된 태그와 안 된 태그가 구분되어 표시됨 |
| **트리거 조건** | 각 태그 클릭 > Firing Triggers | 어떤 트리거에 의해 발동됐는지(또는 왜 안 됐는지) 확인 |
| **변수 값** | Variables 탭 | 각 이벤트 시점에 변수에 어떤 값이 들어왔는지 대조 |

Preview 모드에서 태그가 "Not Fired"로 표시된다면, 해당 태그를 클릭해서 **어떤 트리거 조건이 충족되지 않았는지** 확인하세요. 대부분의 문제는 여기서 원인이 드러납니다.

### Preview 모드가 아예 안 뜰 때

Preview 버튼을 눌렀는데 Tag Assistant 창이 열리지 않는 경우가 있습니다. 이때 확인할 것들입니다.

- **브라우저 확장 프로그램 확인** : 광고 차단기(AdBlock, uBlock 등)가 GTM 스크립트를 차단할 수 있습니다. 시크릿 모드에서 테스트해보세요.
- **[쿠키](/class/digital-basic/what-is-cookie)/캐시 삭제** : 이전 Preview 세션의 쿠키가 충돌할 수 있습니다.
- **GTM 컨테이너 ID 확인** : 웹사이트에 설치된 GTM ID와 워크스페이스의 ID가 일치하는지 확인하세요.
- **브라우저 변경** : 간혹 특정 브라우저에서만 Preview가 작동하지 않는 경우가 있습니다. Chrome이 가장 안정적입니다.

## 태그가 안 찍히는 5대 원인

### 원인 1: 트리거 조건 불일치

가장 흔한 원인입니다. 트리거에 설정한 조건과 실제 값이 다른 경우입니다.

**자주 하는 실수:**

| 실수 유형 | 예시 | 해결 방법 |
|---|---|---|
| URL 끝 슬래시 누락 | 트리거: `/products` vs 실제: `/products/` | "포함" 조건 사용 또는 정규식으로 처리 |
| 대소문자 불일치 | 트리거: `click_button` vs 실제: `Click_Button` | 소문자 변환 변수 사용 또는 "대소문자 무시" 정규식 |
| Page URL vs Page Path 혼동 | `Page URL`에 `/products` 입력 | `Page URL`은 전체 URL, `Page Path`는 경로만 |
| 정규식 오타 | `\.` 대신 `.` 사용 | 정규식 테스트 도구에서 먼저 검증 |

Preview 모드에서 해당 이벤트가 발생했을 때 **Variables 탭**을 열어 `Click URL`, `Page Path`, `Click Element` 등의 실제 값을 확인하세요. 트리거 조건에 입력한 값과 비교하면 어디가 다른지 바로 보입니다.

### 원인 2: dataLayer 이벤트 누락

맞춤 이벤트(Custom Event) 트리거를 사용할 때, 개발팀에서 `dataLayer.push()`를 구현하지 않았거나 이벤트 이름이 다른 경우입니다.

**확인 방법:**

브라우저 개발자 도구(F12) > Console 탭에서 직접 확인할 수 있습니다.

```javascript
// dataLayer 전체 내용 확인
console.table(dataLayer)

// 특정 이벤트만 필터링
dataLayer.filter(item => item.event === 'purchase')
```

원하는 이벤트가 dataLayer 배열에 없다면, 개발팀에 `dataLayer.push()` 구현을 요청해야 합니다. 이때 **정확한 이벤트 이름과 포함되어야 할 파라미터**를 명세서로 전달하는 것이 좋습니다.

```javascript
// 개발팀에 전달할 명세 예시
dataLayer.push({
  event: 'purchase',
  ecommerce: {
    transaction_id: 'T12345',
    value: 59000,
    currency: 'KRW',
    items: [{ item_name: '상품A', price: 59000 }]
  }
});
```

### 원인 3: GTM 컨테이너 미게시

의외로 자주 발생하는 실수입니다. GTM에서 태그와 트리거를 설정한 후 **게시(Publish)를 하지 않으면**, 변경 사항은 Preview 모드에서만 확인 가능하고 실제 웹사이트에는 반영되지 않습니다.

GTM 워크스페이스 상단에 "변경사항 X개"라는 배지가 보이면 게시가 안 된 상태입니다. [제출] 버튼을 눌러 게시하세요.

**주의:** Preview 모드에서는 잘 작동하는데 실제 사이트에서는 안 되는 경우, 가장 먼저 게시 여부를 확인하세요.

### 원인 4: 태그 타이밍/순서 문제

태그가 발동되는 시점에 필요한 데이터가 아직 준비되지 않은 경우입니다.

**대표적인 케이스:**

- **GA4 Config 태그보다 이벤트 태그가 먼저 실행됨** : GA4 Config 태그가 로드되기 전에 이벤트 태그가 발동되면 이벤트가 수집되지 않습니다. 태그 시퀀싱(Tag Sequencing)으로 순서를 강제하세요.
- **DOM Ready 전에 클릭 트리거 설정** : 페이지가 완전히 로드되기 전에 요소를 감지하려 하면 실패합니다. 트리거 타이밍을 `DOM Ready` 또는 `Window Loaded`로 변경하세요.

**태그 시퀀싱 설정 방법:**
1. 이벤트 태그 편집 화면으로 이동
2. 하단의 [고급 설정] > [태그 시퀀싱] 클릭
3. "이 태그가 실행되기 전에 태그 실행"에 GA4 Config 태그를 지정

### 원인 5: SPA(Single Page Application) 환경

React, Vue, Angular 같은 SPA 프레임워크에서는 페이지 이동 시 실제로 새 페이지를 로드하지 않습니다. URL만 바뀌고 DOM만 업데이트되기 때문에, GTM의 기본 Page View 트리거는 **최초 로딩 시 한 번만 작동**합니다.

**해결 방법:**

| 방법 | 설명 | 적용 상황 |
|---|---|---|
| History Change 트리거 | URL 변경(pushState/popState)을 감지 | 대부분의 SPA |
| 맞춤 이벤트 트리거 | 라우터에서 직접 dataLayer.push | 정밀한 제어가 필요할 때 |

History Change 트리거를 사용할 때는 GA4 Config 태그에서 `send_page_view` 옵션이 `true`로 설정되어 있는지 함께 확인하세요. 이 부분은 [React SPA에서 GTM 설치하기](/insights/react-spa-gtm-setup-guide) 글에서 자세히 다루고 있습니다.

## 브라우저 Network 탭으로 실제 전송 확인하기

<div style="overflow-x:auto;margin:24px 0">
<div style="min-width:420px;max-width:100%;border:3px solid #000;background:#fff">
<div style="background:#000;color:#fff;padding:8px 14px;font-weight:800;font-size:13px;font-family:monospace">DevTools > Network | 필터: collect?</div>
<table style="width:100%;border-collapse:collapse;font-size:12px;font-family:monospace">
<tr style="background:#F3F3F3"><th style="border:2px solid #000;padding:6px 8px;text-align:left">Name</th><th style="border:2px solid #000;padding:6px 8px;text-align:left">Status</th><th style="border:2px solid #000;padding:6px 8px;text-align:left">해석</th></tr>
<tr><td style="border:2px solid #000;padding:6px 8px">g/collect?v=2&en=page_view...</td><td style="border:2px solid #000;padding:6px 8px;background:#FFD700;font-weight:800">204</td><td style="border:2px solid #000;padding:6px 8px;font-family:inherit">GA4 정상 전송</td></tr>
<tr><td style="border:2px solid #000;padding:6px 8px">g/collect?v=2&en=purchase...</td><td style="border:2px solid #000;padding:6px 8px;background:#FFD700;font-weight:800">204</td><td style="border:2px solid #000;padding:6px 8px;font-family:inherit">전환 이벤트 정상 전송</td></tr>
<tr><td style="border:2px solid #000;padding:6px 8px">(요청 없음)</td><td style="border:2px solid #000;padding:6px 8px;font-weight:800">-</td><td style="border:2px solid #000;padding:6px 8px;font-family:inherit">태그 설정 또는 차단 의심</td></tr>
</table>
</div>
</div>

GTM Preview에서 "Fired"로 표시되더라도, 실제로 데이터가 GA4나 광고 플랫폼 서버에 전송되지 않는 경우가 있습니다. 최종 확인은 **브라우저 개발자 도구의 Network 탭**에서 해야 합니다.

### 플랫폼별 검색 키워드

| 플랫폼 | Network 탭 검색어 | 정상 응답 |
|---|---|---|
| **GA4** | `collect?` 또는 `g/collect?` | Status 200 또는 204 |
| **Meta Pixel** | `facebook.com/tr` | Status 200 |
| **카카오 픽셀** | `pixel.kakao.com` | Status 200 |
| **네이버 전환 스크립트** | `wcs.naver.net` | Status 200 |
| **Google Ads** | `googleads.g.doubleclick.net` | Status 200 |

**확인 순서:**
1. 개발자 도구(F12) > Network 탭 열기
2. 필터에 위 검색어 입력
3. 웹사이트에서 해당 이벤트 수행 (버튼 클릭, 페이지 이동 등)
4. 요청이 나타나는지 확인
5. Status 코드 확인 (200이면 정상)

요청 자체가 안 나타나면 태그 설정 문제이고, 요청은 나타나지만 에러가 발생하면 **광고 차단기**나 **CSP(Content Security Policy)** 설정 문제일 가능성이 높습니다.

### CSP 문제 확인

Console 탭에 아래와 같은 메시지가 있다면 CSP 차단입니다.

```
Refused to connect to 'https://www.google-analytics.com/g/collect' 
because it violates the following Content Security Policy directive...
```

이 경우 웹사이트의 CSP 헤더에 해당 도메인을 허용해야 합니다. 서버 설정 권한이 있는 개발팀이나 인프라 담당자에게 요청하세요.

## 실전에서 자주 겪는 디버깅 케이스

### 케이스 A: 전환 이벤트가 2번 찍힘

**증상:** GA4에서 구매(purchase) 이벤트가 한 건인데 2건으로 찍힘.

**원인 찾기:**
1. Preview에서 해당 이벤트 시점에 같은 태그가 2번 Fired 되는지 확인
2. 2번 찍히면: 트리거가 중복 설정되어 있거나, 태그가 2개 존재
3. 1번만 찍히면: 페이지 새로고침으로 인한 중복 발동 가능성

**해결:**
- 트리거 설정에서 "한 이벤트당 한 번(Once per event)" 또는 "한 페이지당 한 번(Once per page)" 옵션 활용
- 전환 확인 페이지(Thank you page)에서 `dataLayer.push` 후 즉시 리다이렉트하여 새로고침 방지

### 케이스 B: 특정 페이지에서만 태그가 안 먹힘

**증상:** 대부분의 페이지에서는 잘 되는데, 특정 페이지에서만 태그가 작동하지 않음.

**원인 찾기:**
1. 해당 페이지의 소스 보기(Ctrl+U)에서 GTM 스니펫이 있는지 확인
2. Console 탭에서 JavaScript 에러가 있는지 확인
3. Network 탭에서 GTM 컨테이너 파일(gtm.js) 로딩 여부 확인

**흔한 원인:**
- CMS에서 해당 페이지 템플릿에 GTM 코드가 누락됨
- 해당 페이지에서 JavaScript 에러가 발생하여 GTM 실행이 중단됨
- iframe 내부 페이지라서 부모 페이지의 GTM이 적용되지 않음

### 케이스 C: 이벤트 파라미터 값이 undefined

**증상:** GA4에 이벤트는 들어오는데, 파라미터 값이 `(not set)` 또는 비어있음.

**원인 찾기:**
1. Preview > Variables 탭에서 해당 시점의 변수 값 확인
2. 변수 이름의 **대소문자** 확인 (dataLayer 변수는 대소문자를 구분합니다)
3. 변수 타입 확인 (데이터 영역 변수 vs JavaScript 변수 vs DOM 요소)

**대표적인 실수:**

| 실수 | 예시 |
|---|---|
| 대소문자 불일치 | GTM 변수: `productName` vs dataLayer: `productname` |
| 변수 버전 불일치 | GTM 변수: 데이터 영역 변수 v2 사용 필요한데 v1으로 설정 |
| 타이밍 문제 | dataLayer.push가 태그 발동보다 늦게 실행됨 |

### 케이스 D: 크로스 도메인 추적이 안 됨

**증상:** 메인 사이트(example.com)에서 결제 페이지(pay.example.com)로 이동하면 새 세션으로 잡힘.

**확인 방법:**
1. GA4 관리 > 데이터 스트림 > 태그 설정 > 도메인 구성에서 크로스 도메인 설정 확인
2. 결제 페이지 URL에 `_gl` 파라미터가 붙어서 전달되는지 Network 탭에서 확인
3. 결제 페이지에도 같은 GTM 컨테이너가 설치되어 있는지 확인

## 디버깅 체크리스트 (실무용)

<div style="overflow-x:auto;margin:24px 0">
<div style="max-width:100%;border:3px solid #000;background:#fff">
<div style="background:#000;color:#fff;padding:10px 16px;font-weight:800;font-size:14px">태그 미작동 진단 흐름</div>
<div style="padding:16px;display:flex;flex-wrap:wrap;gap:8px;align-items:center;justify-content:center;text-align:center;font-size:13px">
<div style="border:3px solid #000;background:#FFD700;padding:10px 12px;font-weight:800">Preview에서<br>Fired인가?</div>
<div style="display:flex;flex-direction:column;gap:8px">
<div style="display:flex;gap:8px;align-items:center"><span style="font-family:monospace;font-weight:800">No →</span><div style="border:3px solid #000;background:#F3F3F3;padding:8px 10px">트리거 조건과<br>변수 값 대조</div></div>
<div style="display:flex;gap:8px;align-items:center"><span style="font-family:monospace;font-weight:800">Yes →</span><div style="border:3px solid #000;background:#FFD700;padding:8px 10px;font-weight:800">Network 탭에<br>요청이 나가는가?</div></div>
</div>
<div style="display:flex;flex-direction:column;gap:8px">
<div style="display:flex;gap:8px;align-items:center"><span style="font-family:monospace;font-weight:800">No →</span><div style="border:3px solid #000;background:#F3F3F3;padding:8px 10px">태그 설정,<br>게시 여부 확인</div></div>
<div style="display:flex;gap:8px;align-items:center"><span style="font-family:monospace;font-weight:800">에러 →</span><div style="border:3px solid #000;background:#F3F3F3;padding:8px 10px">광고 차단기,<br>CSP 확인</div></div>
</div>
</div>
</div>
</div>

아래 체크리스트를 순서대로 확인하면 대부분의 GTM 문제를 해결할 수 있습니다.

| 순서 | 확인 항목 | 확인 방법 |
|---|---|---|
| 1 | GTM 스니펫이 `<head>`와 `<body>`에 모두 있는가? | 페이지 소스 보기(Ctrl+U) |
| 2 | GTM 컨테이너가 최신 버전으로 게시되었는가? | GTM 워크스페이스 상단 확인 |
| 3 | Preview 모드에서 태그가 Fired인가? | Tag Assistant |
| 4 | 트리거 조건(URL, 이벤트명 등)이 정확한가? | Preview > Firing Triggers |
| 5 | Variables 탭에서 변수 값이 예상대로인가? | Preview > Variables |
| 6 | dataLayer에 필요한 데이터가 들어오는가? | Console > `dataLayer` 입력 |
| 7 | Network 탭에서 실제 요청이 나가는가? | Network > 플랫폼별 키워드 검색 |
| 8 | 광고 차단기/CSP가 요청을 막고 있지 않은가? | Console > 에러 메시지 확인 |
| 9 | SPA인 경우 History Change 트리거를 사용하고 있는가? | GTM 트리거 설정 확인 |
| 10 | 태그 시퀀싱(실행 순서)이 올바른가? | 태그 > 고급 설정 확인 |

## dataLayer 실시간 모니터링 팁

디버깅할 때 dataLayer에 어떤 데이터가 언제 push되는지 실시간으로 보고 싶다면, Console에 아래 코드를 붙여넣으세요.

```javascript
// dataLayer push를 실시간으로 모니터링
(function() {
  var originalPush = dataLayer.push;
  dataLayer.push = function() {
    console.log('%c[dataLayer Push]', 'color: #4CAF50; font-weight: bold;', arguments[0]);
    return originalPush.apply(dataLayer, arguments);
  };
  console.log('%cdataLayer 모니터링 시작', 'color: #2196F3; font-weight: bold;');
})();
```

이 코드를 실행한 후 웹사이트에서 버튼 클릭, 페이지 이동 등을 수행하면, Console에 push된 데이터가 실시간으로 출력됩니다. 개발팀이 구현한 dataLayer 이벤트가 제대로 들어오는지 확인할 때 매우 유용합니다.

## 마무리

GTM 디버깅은 결국 **"어디서 끊겼는지"를 찾는 과정**입니다.

1. GTM Preview에서 태그가 Fired인지 확인
2. Fired인데 데이터가 안 들어오면 Network 탭에서 실제 전송 확인
3. Not Fired이면 트리거 조건과 변수 값 대조
4. 변수 값이 이상하면 dataLayer 확인

이 흐름만 기억하면 대부분의 문제를 체계적으로 해결할 수 있습니다.
