---
slug: what-is-cookie
term: Cookie (쿠키)
definition: '웹사이트가 사용자의 브라우저에 저장하는 작은 텍스트 파일로, 사용자를 기억하고 추적하기 위한 정보를 담고 있습니다.'
category: AI_TECH
tags:
  - 리타게팅
  - GA4
  - 데이터 추적
publishedAt: '2026-02-11T09:03:46.046Z'
updatedAt: '2026-07-23T00:00:00.000Z'
courseSlug: digital-basic
orderInCourse: 11
aliases:
  - 웹 쿠키
  - HTTP Cookie
  - 브라우저 쿠키
relatedTerms:
  - what-is-bom
  - what-is-javascript
difficulty: BEGINNER
quiz:
  - options:
      - '장바구니는 퍼스트파티 쿠키로 작동하고, 리타게팅 광고는 서드파티 쿠키로 작동하기 때문에 차단 정책의 영향을 다르게 받는다'
      - '장바구니와 리타게팅 광고 모두 서드파티 쿠키를 사용하지만, 쇼핑몰은 예외 정책을 받아서 작동한다'
      - '장바구니는 LocalStorage를 사용하고, 리타게팅 광고는 쿠키를 사용하지 않기 때문에 영향이 없다'
      - 두 기능 모두 퍼스트파티 쿠키를 사용하므로 크롬 정책과 무관하다
    question: >-
      쇼핑몰에서 장바구니에 담은 상품은 브라우저를 닫아도 유지되지만, 리타게팅 광고는 크롬의 서드파티 쿠키 차단 이후 작동하지 않습니다.
      이 상황을 가장 정확하게 설명한 것은?
    explanation: >-
      장바구니는 쇼핑몰 자체 도메인에서 만든 퍼스트파티 쿠키로 작동하므로 차단되지 않습니다. 반면 페이스북 픽셀이 만드는 리타게팅용 쿠키는
      서드파티 쿠키이기 때문에 크롬의 차단 정책에 영향을 받습니다. 이것이 바로 마케터들이 퍼스트파티 데이터 수집(회원가입, 이메일
      수집)에 집중하는 이유입니다.
    correctIndex: 0
metaTitle: '쿠키(Cookie) 뜻: 브라우저가 나를 기억하는 방식'
metaDescription: '쿠키는 웹사이트가 사용자의 브라우저에 저장하는 작은 텍스트 파일입니다. 로그인 유지와 광고 추적에 쿠키가 쓰이는 원리를 정리했습니다.'
ogImage: /og/what-is-cookie.png
---

## 🤔 혹시 이런 생각 해본 적 없나요?

- "GA4에서 자꾸 쿠키 동의를 받으라는데, 이게 정확히 뭐지?"
- "크롬에서 서드파티 쿠키를 차단한다는데, 우리 리타게팅 광고는 괜찮을까?"
- "개인정보 보호 정책 때문에 전환 추적이 어려워졌다는데, 쿠키랑 무슨 관계지?"

## 🔑 Cookie, 한마디로 뭘까요?

**Cookie(쿠키)**는 웹사이트가 여러분의 브라우저에 저장하는 작은 메모 같은 것입니다. "이 사람 10분 전에 우리 사이트 방문했어", "로그인 상태야", "장바구니에 신발 담았어" 같은 정보를 기록해두는 거죠. 마치 카페에서 받는 **스탬프 카드**처럼, 여러분이 다시 방문했을 때 "아, 이 손님!" 하고 알아볼 수 있게 해줍니다.

## 🏷️ 쿠키는 '웹사이트가 주는 이름표'

<div style="overflow-x:auto; margin:16px 0;">
  <div style="max-width:100%; border:3px solid #000; background:#fff; padding:16px;">
    <div style="display:inline-block; font-weight:bold; background:#FFD700; border:3px solid #000; padding:4px 12px; margin-bottom:10px;">내 브라우저에 저장된 쿠키 (shop.example.com)</div>
    <div style="display:flex; flex-wrap:wrap; gap:8px; margin-bottom:8px;">
      <div style="flex:1; min-width:200px; font-family:monospace; border:2px solid #000; background:#F3F3F3; padding:6px 10px;">user_id=user12345</div>
      <div style="min-width:150px; border:2px solid #000; padding:6px 10px;">만료: 2027-07-23</div>
    </div>
    <div style="display:flex; flex-wrap:wrap; gap:8px; margin-bottom:8px;">
      <div style="flex:1; min-width:200px; font-family:monospace; border:2px solid #000; background:#F3F3F3; padding:6px 10px;">cart=sneakers_270mm</div>
      <div style="min-width:150px; border:2px solid #000; padding:6px 10px;">브라우저 닫으면 삭제</div>
    </div>
    <div style="display:flex; flex-wrap:wrap; gap:8px; margin-bottom:12px;">
      <div style="flex:1; min-width:200px; font-family:monospace; border:2px solid #000; background:#F3F3F3; padding:6px 10px;">login=true</div>
      <div style="min-width:150px; border:2px solid #000; padding:6px 10px;">만료: 2026-08-23</div>
    </div>
    <div style="display:flex; flex-wrap:wrap; gap:8px; align-items:center;">
      <div style="flex:1; min-width:120px; border:2px solid #000; background:#fff; padding:6px 10px;">다시 방문</div>
      <div style="font-weight:bold;">→</div>
      <div style="flex:1; min-width:150px; border:2px solid #000; background:#F3F3F3; padding:6px 10px;">브라우저가 쿠키를 자동 전송</div>
      <div style="font-weight:bold;">→</div>
      <div style="flex:1; min-width:170px; border:2px solid #000; background:#FFD700; padding:6px 10px;">"user12345님, 장바구니에 신발 있어요!"</div>
    </div>
  </div>
  <p style="margin:8px 0 0; font-size:0.9em; color:#555;">쿠키는 이름=값 형태로 저장되고, 재방문 시 브라우저가 자동으로 웹사이트에 보여줍니다.</p>
</div>

여러분이 백화점 회원카드를 만들면, 그 카드에 고객번호가 적혀있죠? 쿠키도 똑같습니다. 웹사이트가 여러분의 브라우저에 "당신은 user12345번 고객입니다"라는 작은 파일을 저장해둡니다. 다음에 그 사이트를 다시 방문하면, 브라우저가 자동으로 그 파일을 웹사이트에 보여주면서 "저 왔어요!"라고 알려주는 겁니다.

이 덕분에 로그인을 계속 유지할 수 있고, 장바구니에 담아둔 상품이 사라지지 않고, 여러분이 어떤 페이지를 봤는지 웹사이트가 기억할 수 있습니다.

## 🍪 쿠키는 '디지털 세계의 방명록'

카페에 갔을 때를 생각해보세요. 단골 카페라면 "아메리카노 한 잔이요"라고만 해도 바리스타가 "얼음 많이, 시럽 빼고 드릴게요!" 하고 기억하죠. 쿠키가 바로 이런 역할입니다. 여러분의 선호도, 방문 기록, 설정을 기억해서 **개인화된 경험**을 제공합니다.

마케터 입장에서는? 이 방명록을 보고 "이 사람은 운동화 페이지를 5번 봤네, 광고를 보여줘야겠다"라고 판단할 수 있습니다. 바로 **리타게팅 광고**의 핵심 원리입니다.

## ⚙️ 어떤 종류가 있나요?

### 1️⃣ **퍼스트파티 쿠키 vs 서드파티 쿠키**

- **퍼스트파티 쿠키(1st-party Cookie)**: 여러분이 직접 방문한 웹사이트가 만드는 쿠키입니다. 예를 들어 coupang.com에 가면 쿠팡이 직접 여러분의 브라우저에 저장하는 쿠키죠. 로그인 정보, 장바구니 같은 핵심 기능에 사용됩니다.

- **서드파티 쿠키(3rd-party Cookie)**: 여러분이 방문한 사이트가 아닌, **다른 도메인**에서 만드는 쿠키입니다. 예를 들어 패션 블로그를 보는데, 그 안에 숨어있는 페이스북 픽셀이나 구글 광고 스크립트가 만드는 쿠키가 바로 이겁니다. 여러분이 어떤 사이트들을 돌아다니는지 추적해서 광고를 보여주는 데 사용됩니다.

💥 **중요!** 2024년부터 크롬이 서드파티 쿠키를 단계적으로 차단하고 있습니다. 이게 바로 마케터들이 "쿠키리스(cookieless) 시대"라고 난리인 이유입니다.

### 2️⃣ **세션 쿠키 vs 영구 쿠키**

- **세션 쿠키(Session Cookie)**: 브라우저를 닫으면 사라지는 쿠키입니다. 임시 로그인이나 쇼핑몰 장바구니 같은 단기 정보 저장에 사용됩니다.

- **영구 쿠키(Persistent Cookie)**: 만료 날짜가 정해져 있어서, 브라우저를 닫아도 남아있습니다. "로그인 상태 유지", "30일 동안 이 창 보지 않기" 같은 기능에 사용되죠. GA4의 **_ga 쿠키**는 2년짜리 영구 쿠키입니다.

## 💡 이걸 알면 마케터에게 뭐가 좋을까요?

<div style="overflow-x:auto; margin:16px 0;">
  <div style="max-width:100%; border:3px solid #000; background:#fff; padding:16px;">
    <div style="display:inline-block; font-weight:bold; background:#FFD700; border:3px solid #000; padding:4px 12px; margin-bottom:10px;">마케팅 도구가 심어두는 추적 쿠키</div>
    <div style="display:flex; flex-wrap:wrap; gap:8px; margin-bottom:8px;">
      <div style="min-width:110px; font-family:monospace; font-weight:bold; border:2px solid #000; background:#F3F3F3; padding:6px 10px;">_ga</div>
      <div style="flex:1; min-width:170px; border:2px solid #000; padding:6px 10px;">GA4 사용자 구분</div>
      <div style="min-width:100px; border:2px solid #000; background:#FFD700; padding:6px 10px;">2년 유지</div>
    </div>
    <div style="display:flex; flex-wrap:wrap; gap:8px; margin-bottom:8px;">
      <div style="min-width:110px; font-family:monospace; font-weight:bold; border:2px solid #000; background:#F3F3F3; padding:6px 10px;">_gid</div>
      <div style="flex:1; min-width:170px; border:2px solid #000; padding:6px 10px;">GA4 일 단위 세션 구분</div>
      <div style="min-width:100px; border:2px solid #000; background:#FFD700; padding:6px 10px;">24시간</div>
    </div>
    <div style="display:flex; flex-wrap:wrap; gap:8px;">
      <div style="min-width:110px; font-family:monospace; font-weight:bold; border:2px solid #000; background:#F3F3F3; padding:6px 10px;">_fbp</div>
      <div style="flex:1; min-width:170px; border:2px solid #000; padding:6px 10px;">메타 픽셀 전환 추적</div>
      <div style="min-width:100px; border:2px solid #000; background:#FFD700; padding:6px 10px;">90일</div>
    </div>
  </div>
  <p style="margin:8px 0 0; font-size:0.9em; color:#555;">이 쿠키들이 차단되면 사용자 구분이 끊겨서 전환 수치가 갑자기 줄어든 것처럼 보입니다.</p>
</div>

### 1) **GA4와 Meta Pixel이 작동하는 원리를 이해할 수 있습니다**

GA4를 설치하면 **_ga, _gid** 같은 쿠키가 자동으로 생깁니다. 이게 사용자를 구분하고 추적하는 핵심입니다. 메타 픽셀도 **_fbp, _fbc** 쿠키로 전환을 추적하죠. 쿠키가 차단되면? 추적이 안 됩니다. "전환이 갑자기 줄었어요!"의 진짜 이유가 바로 이겁니다.

### 2) **리타게팅 광고가 왜 안 되는지 설명할 수 있습니다**

"iOS에서 리타게팅 성과가 떨어졌어요"라는 말, 들어보셨죠? iOS 14.5부터 애플이 **앱 추적 투명성(ATT)**을 도입하면서 서드파티 쿠키와 유사한 추적을 차단했기 때문입니다. 크롬의 서드파티 쿠키 차단도 같은 맥락입니다. 이제는 **퍼스트파티 데이터**(우리 사이트에서 직접 수집한 정보)가 금이 된 이유입니다.

### 3) **GDPR과 쿠키 동의 배너를 이해할 수 있습니다**

유럽 사이트에 가면 뜨는 "쿠키 사용에 동의하시겠습니까?" 팝업, 이게 바로 **GDPR** 때문입니다. 개인정보 추적에는 반드시 동의를 받아야 하거든요. 한국도 개인정보보호법이 강화되면서 쿠키 동의를 받는 사이트가 늘고 있습니다. GTM으로 쿠키 동의 관리(Consent Mode)를 설정해야 하는 이유가 여기 있습니다.

## 🔄 쿠키의 대안: LocalStorage와 SessionStorage

쿠키가 점점 제한받으면서, **[BOM](/class/digital-basic/what-is-bom)(Browser Object Model)**의 다른 저장 방식도 주목받고 있습니다.

- **LocalStorage**: 브라우저에 영구적으로 저장. 쿠키보다 용량이 크고(5MB vs 4KB), 자동으로 서버에 전송되지 않습니다.
- **SessionStorage**: 탭을 닫으면 사라지는 임시 저장소.

하지만 이것들도 **퍼스트파티**에서만 작동합니다. 여러 사이트를 넘나들며 추적하는 건 불가능하죠. 그래서 지금 광고 업계는 **서버 사이드 추적**, **Google Topics API** 같은 새로운 방법을 찾고 있습니다.

## 📋 30초 요약

1. **쿠키는 웹사이트가 브라우저에 저장하는 작은 파일**로, 사용자를 기억하고 추적합니다. 퍼스트파티(우리 사이트)와 서드파티(광고 추적용)로 나뉩니다.

2. **GA4의 _ga 쿠키, 메타 픽셀의 _fbp 쿠키**가 바로 쿠키입니다. 크롬의 서드파티 쿠키 차단으로 리타게팅 광고가 어려워지고 있습니다.

3. **개인정보 보호 강화로 쿠키 동의가 필수**가 되었고, 퍼스트파티 데이터 수집(이메일 수집, CRM 구축)이 마케팅의 핵심 전략이 되었습니다.

## 참고 자료

- [MDN HTTP 쿠키 문서](https://developer.mozilla.org/ko/docs/Web/HTTP/Cookies)
