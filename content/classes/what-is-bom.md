---
slug: what-is-bom
term: ' BOM (Browser Object Model)'
definition: >-
  BOM(Browser Object Model)이란 웹 브라우저 자체를 제어하는 기술입니다. 브라우저의 기능(뒤로 가기, 화면 크기, 브라우저
  종류 등)을 JavaScript로 조작할 수 있게 해줍니다. BOM을 활용하여 사용자 경험을 개선하고, 다양한 환경에 최적화된 웹 페이지를
  만들 수 있습니다.
category: AI_TECH
tags:
  - DOM
publishedAt: '2026-02-11T08:47:58.303Z'
updatedAt: '2026-07-23T00:00:00.000Z'
courseSlug: digital-basic
orderInCourse: 5
relatedTerms:
  - what-is-dom
  - what-is-javascript
  - what-is-cookie
difficulty: BEGINNER
quiz:
  - options:
      - 'DOM은 오래된 기술이고, BOM은 최신 기술이다'
      - 'DOM은 웹페이지 내용(문서)을 다루고, BOM은 브라우저 자체(주소창, 화면 크기 등)를 다룬다'
      - 'BOM은 모바일에서만 사용하고, DOM은 PC에서만 사용한다'
      - DOM과 BOM은 같은 것을 부르는 다른 이름이다
    question: BOM과 DOM의 차이로 올바른 것은?
    explanation: >-
      DOM은 웹페이지 안의 콘텐츠(글자, 이미지, 버튼 등)를 다루는 반면, BOM은 브라우저 창 자체의 기능(주소 이동, 화면 크기,
      뒤로 가기 등)을 제어합니다. TV로 비유하면 DOM은 방영 중인 드라마 내용, BOM은 TV 리모컨입니다.
    correctIndex: 1
metaTitle: ' BOM (브라우저 객체 모델) | 비개발자도 쉽게 배우는 디지털 환경 기초 지식'
metaDescription: >-
  BOM(브라우저 객체 모델)이란 웹 브라우저 자체를 제어하는 기술입니다. 브라우저의 기능(뒤로 가기, 화면 크기, 브라우저 종류 등)을
  JavaScript로 조작할 수 있게 해줍니다. BOM을 활용하여 사용자 경험을 개선하고, 다양한 환경에 최적화된 웹 페이지를 만들 수
  있습니다.
ogImage: /og/what-is-bom.png
summary3:
  - 'BOM은 웹페이지 내용이 아니라 브라우저 창 자체를 자바스크립트로 다루는 기술입니다.'
  - '주소창의 URL과 뒤로 가기, 화면 크기, 브라우저 종류 같은 환경 정보가 여기에 담깁니다.'
  - 'GA4가 주소창의 utm 값을 읽어 유입 채널을 기록하고 광고가 아이폰 사용자만 골라내는 일이 모두 이 값 위에서 일어납니다.'
---

## 🤔 혹시 이런 생각 해본 적 없나요?

- 브라우저의 '뒤로 가기' 버튼을 눌렀는데, 방금 본 상품 창만 닫히게 만드는 기술은 뭘까?"
- "이 사이트는 어떻게 내 폰 화면 크기를 딱 알고 모바일용 화면을 보여주지?"
- "내가 크롬을 쓰는지, 아이폰 사파리를 쓰는지 어떻게 알까?"

웹페이지 안의 내용물(글자, 그림)이 아니라, 그 페이지를 감싸고 있는 브라우저(인터넷 창)의 정보를 알아내고 조작하는 기술, 그게 바로 BOM입니다.

## 🔑 BOM, 한마디로 뭘까요?

BOM(Browser Object Model)은 웹페이지 내용(문서)이 아닌, 웹 브라우저 자체를 제어하는 리모컨입니다.

쉽게 말해, 브라우저가 가진 고유의 기능들(주소창, 뒤로 가기 버튼, 즐겨찾기, 화면 크기, 브라우저 종류)을 [JavaScript](/class/digital-basic/what-is-javascript)가 만질 수 있도록 만들어 놓은 것입니다.

## 📺 첫 번째 비유: TV 리모컨

<div style="overflow-x:auto;margin:16px 0;">
  <div style="border:3px solid #000;background:#fff;max-width:100%;font-family:sans-serif;font-size:13px;">
    <div style="background:#FFD700;border-bottom:3px solid #000;padding:8px 10px;">
      <span style="font-family:monospace;font-weight:bold;">← → ⟳</span>
      <span style="border:2px solid #000;background:#fff;padding:2px 8px;margin-left:6px;font-family:monospace;">https://example.com</span>
      <div style="margin-top:6px;font-weight:bold;">↑ 여기가 BOM의 영역 : 뒤로 가기, 주소창 등 브라우저 기계 자체</div>
    </div>
    <div style="padding:14px;background:#F3F3F3;">
      <div style="border:2px solid #000;background:#fff;padding:10px;">
        <div style="font-weight:bold;">신년 프로모션</div>
        <div style="color:#555;margin:6px 0;">지금 가입하면 첫 달 무료!</div>
        <span style="display:inline-block;border:2px solid #000;background:#FF0000;color:#fff;padding:4px 12px;font-weight:bold;">구매하기</span>
      </div>
      <div style="margin-top:8px;font-weight:bold;">↑ 여기가 [DOM](/class/digital-basic/what-is-dom)의 영역 : 페이지 안에 담긴 내용물(드라마 내용)</div>
    </div>
  </div>
  <div style="font-size:13px;color:#555;margin-top:6px;font-family:sans-serif;">DOM은 화면 속 콘텐츠를, BOM은 그 콘텐츠를 감싼 브라우저(TV 기계)를 다룹니다.</div>
</div>

DOM과 BOM의 차이를 가장 쉽게 설명하는 비유는 TV입니다.

- DOM (콘텐츠): TV 화면 안에 나오는 드라마 내용, 주인공의 대사, 배경음악입니다. (드라마 내용 바꾸기)
- BOM (브라우저): TV 기계 자체의 기능입니다. 채널 변경, 볼륨 조절, 화면 밝기 조절, 전원 끄기 등이죠. (TV 기계 조작하기)

BOM은 바로 이 TV 기계(브라우저)를 조작하는 리모컨입니다.
"야 브라우저야, 지금 보고 있는 페이지 말고 다른 주소(채널)로 이동해!"
"지금 화면 크기(볼륨)가 몇인지 알려줘!"
이렇게 명령하는 것이죠.

## 🖼️ 두 번째 비유: '액자'와 '사진'

웹 브라우저를 하나의 액자라고 생각해 보세요.

1. DOM은 액자 속에 끼워진 '사진'입니다.
우리가 사진 속 인물의 표정을 고치거나 색칠을 하는 건 DOM 작업입니다. 사진(내용)을 건드리는 것이니까요.
2. BOM은 사진을 감싸고 있는 '액자틀' 그 자체입니다.
사진은 그대로 두고 액자만 가지고 할 수 있는 일들을 생각해 보세요.
- 액자 위치 옮기기 (Location): 액자를 거실에서 안방으로 옮겨 겁니다. (다른 주소로 이동)
- 액자 크기 바꾸기 (Screen/Resize): 액자틀을 더 큰 것으로 바꾸거나 작게 만듭니다. (창 크기 조절)
- 새 액자 걸기 (Window Open): 옆에다가 조그만 액자를 하나 더 겁니다. (새 탭/팝업창 띄우기)
- 액자 치우기 (Window Close): 걸려 있던 액자를 떼어냅니다. (창 닫기)
- 액자 브랜드 확인 (Navigator): 이 액자가 '삼성' 건지 'LG' 건지 확인합니다. (크롬인지 사파리인지 확인)

즉, BOM은 사진(내용물)에는 관심이 없습니다. 오직 사진을 담고 있는 액자(브라우저)를 어디에 걸고, 어떻게 보여줄지를 관리하는 것입니다.
## ⚙️ 그래서 BOM은 어떻게 작동하나요?

<div style="overflow-x:auto;margin:16px 0;">
  <div style="border:3px solid #000;background:#F3F3F3;padding:14px;max-width:100%;font-family:sans-serif;font-size:13px;">
    <div style="font-family:monospace;font-weight:bold;margin-bottom:10px;">window <span style="font-family:sans-serif;font-weight:normal;color:#555;">(브라우저 창 전체, BOM의 대장)</span></div>
    <div style="display:flex;flex-wrap:wrap;gap:8px;">
      <div style="flex:1 1 150px;border:2px solid #000;background:#FFD700;padding:8px 10px;"><b style="font-family:monospace;">location</b><br>주소창 정보와 페이지 이동</div>
      <div style="flex:1 1 150px;border:2px solid #000;background:#FFD700;padding:8px 10px;"><b style="font-family:monospace;">history</b><br>뒤로 가기, 방문 기록</div>
      <div style="flex:1 1 150px;border:2px solid #000;background:#FFD700;padding:8px 10px;"><b style="font-family:monospace;">navigator</b><br>브라우저와 기기 종류</div>
      <div style="flex:1 1 150px;border:2px solid #000;background:#FFD700;padding:8px 10px;"><b style="font-family:monospace;">screen</b><br>화면 크기 정보</div>
      <div style="flex:1 1 100%;border:2px solid #000;background:#fff;padding:8px 10px;"><b style="font-family:monospace;">document</b> <span style="color:#FF0000;font-weight:bold;">← 이게 바로 DOM</span><br>웹페이지 내용물도 window 안에 들어 있는 한 부분일 뿐입니다.</div>
    </div>
  </div>
  <div style="font-size:13px;color:#555;margin-top:6px;font-family:sans-serif;">window라는 큰 상자 안에 브라우저 제어 도구들(BOM)과 페이지 내용(document, DOM)이 함께 들어 있습니다.</div>
</div>

BOM의 대장은 'window(창)'라는 녀석입니다. 브라우저 창 전체를 의미하죠.

우리가 보는 웹페이지(document/DOM)도 사실 이 window라는 창문 안에 들어있는 작은 부분일 뿐입니다.

마케터가 가장 많이 쓰는 BOM 기능들을 살펴볼까요?

1. 주소창 조작 (Location)
- 명령: `window.location.href = 'https://naver.com'`
- 결과: 네이버로 페이지가 이동합니다. (리다이렉트)

2. 브라우저 정보 확인 (Navigator)
- 명령: `window.navigator.userAgent`
- 결과: "이 사람은 지금 아이폰에서 사파리 브라우저로 접속 중입니다"라는 정보를 줍니다.

3. 방문 기록 제어 (History)
- 명령: `window.history.back()`
- 결과: 뒤로 가기 버튼을 누른 것처럼 이전 페이지로 돌아갑니다.

## 💡 이걸 알면 마케터에게 뭐가 좋을까요?

"이건 개발자 영역 아닌가요?", 사실 퍼포먼스 마케터가 매일 보는 데이터의 80%는 사실 BOM에서 옵니다. 이건 디지털마케터에게 매우 중요한 지식입니다.

### 1. UTM 파라미터 분석의 원리입니다.
"우리 사이트에 들어온 사람이 페이스북 링크(utm_source=facebook)를 타고 왔는지 어떻게 알지?"
바로 BOM의 `location(주소창)` 정보를 읽어왔기 때문입니다.
GA4(구글 애널리틱스4)는 항상 브라우저 주소창을 쓱 훑어보고, "?utm..." 뒤에 붙은 꼬리표를 읽어서 보고서에 기록하는 겁니다.

### 2. 타겟팅(Targeting)의 비밀을 알게 됩니다.
"아이폰 유저에게만 앱 설치 광고를 보여주고 싶어."
이게 어떻게 가능할까요? BOM의 `navigator(브라우저 정보)`를 확인하면 이 사람이 안드로이드 폰인지 아이폰인지 즉시 알 수 있습니다. 이 정보를 바탕으로 특정 기기 사용자에게만 팝업을 띄우는 것도 가능한 셈이죠.

### 3. 리다이렉트(Redirect)를 이해합니다.
"회원가입 완료하면 '감사합니다' 페이지로 이동시켜 주세요."
이건 JavaScript를 사용해 BOM의 `location` 기능을 건드려 강제로 주소를 바꿔버린 겁니다. 랜딩 페이지 A/B 테스트를 할 때, A안 주소로 들어왔지만 B안 주소로 보내는 원리도 이와 같습니다.

## 📋 3줄 요약

1. BOM은 웹페이지 내용이 아니라 브라우저 창 자체를 자바스크립트로 다루는 기술입니다.
2. 주소창의 URL과 뒤로 가기, 화면 크기, 브라우저 종류 같은 환경 정보가 여기에 담깁니다.
3. GA4가 주소창의 utm 값을 읽어 유입 채널을 기록하고 광고가 아이폰 사용자만 골라내는 일이 모두 이 값 위에서 일어납니다.

이제 주소창을 볼 때 그냥 주소로 보지 마세요.
"아, 지금 BOM의 location 객체가 열일하고 있구나!"
이게 바로 데이터의 출처를 아는 마케터의 올바른 시선입니다! 🕵️‍♀️

## 참고 자료

- [MDN Window API 문서](https://developer.mozilla.org/ko/docs/Web/API/Window)
