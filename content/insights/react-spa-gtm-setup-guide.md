---
slug: react-spa-gtm-setup-guide
title: React SPA에서 GTM 설치하기 | 페이지뷰 추적 완벽 가이드
excerpt: >-
  리액트 같은 SPA 환경에서는 일반 웹사이트처럼 GTM을 설치해서는 안 됩니다. dataLayer를 올바르게 설정하고, 라우팅 이벤트를
  추적하는 방법을 단계별로 설명합니다.
category: AI_TECH
tags:
  - React
  - 데이터 추적
  - GTM
  - GA4
  - 자동화
  - 데이터 분석
publishedAt: '2026-02-26T02:48:50.896Z'
quiz:
  - options:
      - 리액트가 GTM 스크립트를 차단하기 때문
      - SPA는 페이지 이동 시 HTML을 새로 로드하지 않고 DOM만 교체하기 때문
      - GTM이 리액트 프레임워크를 공식 지원하지 않기 때문
      - 브라우저 보안 정책이 SPA의 반복 이벤트를 제한하기 때문
    question: 리액트 SPA에서 GTM의 기본 Page View 트리거가 첫 로딩에서만 작동하는 근본적인 이유는 무엇일까요?
    explanation: >-
      SPA는 최초에 HTML을 한 번만 로드하고, 이후 페이지 전환은 JavaScript로 DOM을 교체하며
      history.pushState()로 URL만 변경합니다. 브라우저 입장에서 '새 페이지를 열었다'는 이벤트가 발생하지 않으므로,
      GTM의 기본 Page View 트리거(gtm.js)는 최초 로딩 시에만 작동합니다.
    correctIndex: 1
metaTitle: React SPA에서 GTM 설치하기 | 페이지뷰 추적 완벽 가이드
metaDescription: >-
  리액트 SPA에서 GTM을 올바르게 설치하는 방법을 코드 예시와 함께 설명합니다. dataLayer 설정부터 페이지뷰 추적, Next.js
  환경까지 실전 가이드를 확인하세요.
ogTitle: '리액트 SPA에서 GTM 설치, 왜 데이터가 안 잡힐까?'
ogDescription: SPA 환경에서 GTM이 제대로 작동하지 않는 이유와 해결법. dataLayer 설정으로 정확한 추적을 시작하세요.
ogImage: /og/react-spa-gtm-setup-guide.png
---

## 도입부: 그냥 붙여넣으면 되는 거 아닌가요?

Google Tag Manager 설치는 간단합니다. 공식 문서대로 `<head>`와 `<body>`에 스니펫 두 개를 붙여넣으면 끝입니다. WordPress든 쇼핑몰이든 대부분의 웹사이트에서는 이 방법이 통합니다.

그런데 리액트(React)로 만든 **SPA(Single Page Application)**에서는 이야기가 달라집니다. GTM 스니펫을 그대로 넣었는데 페이지뷰가 첫 로딩 한 번만 찍히거나, 이벤트가 아예 수집되지 않는 상황을 겪어보신 분이 많을 겁니다. "분명 설치했는데 데이터가 안 들어온다"는 문의는 마케팅 실무에서 정말 자주 듣는 이야기입니다.

이 글에서는 **SPA 환경에서 GTM이 왜 제대로 작동하지 않는지**, 그리고 **리액트 프로젝트에 GTM을 올바르게 설치하는 구체적인 방법**을 코드 예시와 함께 정리합니다. Next.js 같은 프레임워크 환경도 함께 다룹니다.

## SPA에서 GTM이 다르게 동작하는 이유

일반 웹사이트(MPA, Multi Page Application)는 페이지를 이동할 때마다 서버에서 새 HTML을 받아옵니다. 브라우저가 HTML을 새로 로드하면 GTM 스니펫도 다시 실행되고, **페이지뷰 트리거가 자동으로 발생**합니다.

SPA는 다릅니다. 리액트 앱은 처음에 HTML을 한 번만 로드하고, 이후 페이지 전환은 **JavaScript로 DOM을 교체**하는 방식으로 이루어집니다. 브라우저 입장에서는 "새 페이지를 열었다"는 이벤트가 발생하지 않습니다. URL이 바뀌는 것처럼 보이지만, 실제로는 `history.pushState()`로 주소만 변경한 것입니다.

이 차이 때문에 GTM의 기본 **Page View** 트리거(`gtm.js` 이벤트)는 최초 로딩 시 한 번만 작동합니다. 사용자가 메뉴를 클릭해서 `/about`에서 `/products`로 이동해도 GTM은 이를 감지하지 못합니다. GA4에서 페이지뷰가 하나만 찍히는 이유가 바로 이것입니다.

**핵심 정리:**

- **MPA**: 페이지 이동 → HTML 새로 로드 → GTM 자동 실행 → 페이지뷰 자동 수집
- **SPA**: 페이지 이동 → DOM만 교체 → GTM 모름 → **직접 알려줘야 함**

## 리액트 프로젝트에 GTM 설치하기: 3가지 방법

리액트 SPA에 GTM을 설치하는 방법은 크게 세 가지입니다. 프로젝트 상황에 맞는 방법을 선택하면 됩니다.

| 방법 | 장점 | 단점 | 추천 상황 |
|------|------|------|----------|
| react-gtm-module | 간편한 설치, 커뮤니티 넓음 | TypeScript 타입 지원 부실 | 빠른 설치가 필요한 JS 프로젝트 |
| @gtm-support/react-gtm | TypeScript 지원, 타입 안정성 | 상대적으로 적은 사용자 | TypeScript 프로젝트 |
| 직접 구현 | 외부 의존성 없음, 가장 가벼움 | 직접 관리 필요 | 번들 크기 민감한 프로젝트 |

### 방법 1: react-gtm-module 패키지 사용 (가장 간편)

가장 널리 쓰이는 방법입니다. `react-gtm-module` 패키지가 GTM 스니펫 삽입과 `dataLayer` 관리를 대신 해줍니다.

```bash
npm install react-gtm-module
```

앱의 진입점(`App.tsx` 또는 `main.tsx`)에서 초기화합니다.

```typescript
import TagManager from 'react-gtm-module';

const tagManagerArgs = {
  gtmId: 'GTM-XXXXXXX', // 본인의 GTM 컨테이너 ID
};

TagManager.initialize(tagManagerArgs);
```

이것만으로 GTM 컨테이너가 로드됩니다. 하지만 SPA 페이지뷰 문제는 별도로 해결해야 합니다. **라우트 변경 시 수동으로 페이지뷰를 전송**하는 코드가 필요합니다.

```typescript
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import TagManager from 'react-gtm-module';

function App() {
  const location = useLocation();

  useEffect(() => {
    TagManager.dataLayer({
      dataLayer: {
        event: 'page_view',
        page_path: location.pathname + location.search,
        page_title: document.title,
      },
    });
  }, [location]);

  return <RouterOutlet />;
}
```

`useLocation` 훅이 URL 변경을 감지할 때마다 `dataLayer.push()`로 커스텀 이벤트를 전송합니다. GTM에서는 이 `page_view` 커스텀 이벤트를 트리거로 사용하면 됩니다.

### 방법 2: @gtm-support/react-gtm 사용 (TypeScript 친화적)

`react-gtm-module`은 TypeScript 타입 지원이 부실한 편입니다. TypeScript 프로젝트라면 `@gtm-support/react-gtm`이 더 나은 선택입니다.

```bash
npm install @gtm-support/react-gtm
```

```typescript
import { GtmSupport, useGtm } from '@gtm-support/react-gtm';

// 앱 진입점에서 초기화
const gtm = new GtmSupport({ id: 'GTM-XXXXXXX' });

function App() {
  return (
    <GtmProvider gtm={gtm}>
      <RouterOutlet />
    </GtmProvider>
  );
}
```

라우트 변경 시 페이지뷰 전송은 동일한 패턴입니다.

```typescript
import { useGtm } from '@gtm-support/react-gtm';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

function PageTracker() {
  const gtm = useGtm();
  const location = useLocation();

  useEffect(() => {
    gtm.trackEvent({
      event: 'page_view',
      page_path: location.pathname,
    });
  }, [location, gtm]);

  return null;
}
```

### 방법 3: 패키지 없이 직접 구현 (가장 가벼움)

외부 의존성을 최소화하고 싶다면 GTM 스니펫을 직접 삽입하고 `dataLayer`를 수동 관리할 수 있습니다.

`index.html`의 `<head>`에 GTM 스니펫을 그대로 넣습니다.

```html
<!-- Google Tag Manager -->
<script>
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-XXXXXXX');
</script>
```

그리고 라우트 변경 시 `dataLayer.push()`를 직접 호출합니다.

```typescript
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'page_view',
      page_path: location.pathname + location.search,
      page_title: document.title,
    });
  }, [location]);
}
```

TypeScript를 사용한다면 `window.dataLayer`의 타입을 선언해줘야 합니다.

```typescript
// global.d.ts
declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}
```

세 가지 방법 모두 결국 같은 원리입니다. **라우트가 바뀔 때 `dataLayer`에 이벤트를 push하고, GTM에서 해당 이벤트를 트리거로 설정**하는 것입니다.

## GTM에서 SPA 페이지뷰 트리거 설정하기

리액트 앱에서 `dataLayer.push()`로 이벤트를 보내는 것은 절반입니다. GTM 컨테이너 안에서 이 이벤트를 받아서 GA4로 전달하는 설정도 필요합니다.

### 1단계: 커스텀 이벤트 트리거 생성

GTM 워크스페이스에서 **트리거 → 새로 만들기**를 클릭합니다. 트리거 유형은 **맞춤 이벤트(Custom Event)**를 선택하고, 이벤트 이름에 `page_view`를 입력합니다. 이 이름은 리액트 코드에서 `dataLayer.push()`할 때 사용한 `event` 값과 정확히 일치해야 합니다.

### 2단계: GA4 이벤트 태그 연결

GA4 설정 태그가 이미 있다면, 새 **GA4 이벤트 태그**를 만듭니다. 이벤트 이름은 `page_view`로 설정하고, 트리거를 방금 만든 커스텀 이벤트 트리거로 연결합니다. 이벤트 매개변수로 `page_path`를 추가하면 GA4에서 어떤 페이지가 조회되었는지 정확히 확인할 수 있습니다.

### 3단계: 기존 Page View 트리거 정리

기본 제공되는 **All Pages** 트리거(초기 로딩 시 발동)와 커스텀 `page_view` 트리거가 중복 발동되면 페이지뷰가 이중으로 찍힙니다. 두 가지 방법으로 해결할 수 있습니다.

- **방법 A**: 기존 All Pages 트리거를 사용하는 GA4 페이지뷰 태그를 삭제하고, 커스텀 트리거만 사용
- **방법 B**: 리액트 코드에서 초기 로딩 시에는 `page_view` 이벤트를 보내지 않고, 라우트 변경 시에만 전송

실무에서는 **방법 A**가 더 깔끔합니다. 리액트 코드에서 초기 로딩을 포함한 모든 페이지뷰를 커스텀 이벤트로 통일하면 관리 포인트가 줄어듭니다.

## Next.js 환경에서의 GTM 설치

Next.js를 사용하고 있다면 접근 방식이 조금 다릅니다. Next.js는 SSR(Server Side Rendering)과 클라이언트 라우팅을 혼합하기 때문입니다.

Next.js 14 이상의 **App Router**를 사용하는 경우, 공식적으로 권장하는 방법은 `@next/third-parties` 패키지입니다.

```bash
npm install @next/third-parties
```

```typescript
// app/layout.tsx
import { GoogleTagManager } from '@next/third-parties/google';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        {children}
        <GoogleTagManager gtmId="GTM-XXXXXXX" />
      </body>
    </html>
  );
}
```

라우트 변경 감지는 Next.js의 `usePathname` 훅을 사용합니다.

```typescript
'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export function PageTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'page_view',
        page_path: pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : ''),
      });
    }
  }, [pathname, searchParams]);

  return null;
}
```

이 컴포넌트를 `layout.tsx`에 포함시키면 모든 페이지 [전환](/class/digital-marketing-terms/what-is-conversion)이 GTM으로 전달됩니다. `react-router-dom` 대신 Next.js 자체 라우팅 훅을 쓴다는 점만 다르고, 원리는 동일합니다.

## 설치 후 반드시 확인해야 할 것들

GTM 설치가 끝났다고 바로 넘어가면 안 됩니다. SPA 환경에서는 특히 검증 단계가 중요합니다.

### GTM 미리보기 모드로 테스트

GTM 워크스페이스에서 **미리보기** 버튼을 클릭하면 Tag Assistant가 열립니다. 리액트 앱에서 여러 페이지를 이동하면서 `page_view` 이벤트가 매번 발생하는지 확인합니다. 이벤트가 찍히지 않는다면 `useEffect`의 의존성 배열이나 `location` 객체를 점검해야 합니다.

### GA4 실시간 보고서 확인

GA4 관리 화면의 **실시간** 보고서에서 페이지뷰가 들어오는지 확인합니다. 특히 페이지 경로(`page_path`)가 올바른 값으로 찍히는지 주의깊게 봐야 합니다. `/`만 계속 찍히고 있다면 `location.pathname` 대신 다른 값이 전달되고 있을 가능성이 높습니다.

### 이벤트 중복 발동 체크

한 번의 페이지 이동에 `page_view`가 두 번 이상 찍히는지 확인합니다. `useEffect`의 의존성 배열에 불필요한 값이 포함되어 있거나, `StrictMode`에서 개발 중 이중 실행되는 것일 수 있습니다. 프로덕션 빌드에서 반드시 재확인해야 합니다.

**SPA 전용 디버깅 팁:**

- 브라우저 콘솔에서 `window.dataLayer`를 직접 확인하면 어떤 이벤트가 쌓여 있는지 볼 수 있습니다
- Chrome 확장 프로그램 **Tag Assistant Companion**을 설치하면 실시간 태그 발동 상태를 모니터링할 수 있습니다
- GA4 **DebugView**를 활용하면 이벤트 파라미터까지 상세하게 확인할 수 있습니다

## 정리: SPA GTM 설치, 원리만 알면 어렵지 않습니다

리액트 SPA에서 GTM이 제대로 작동하지 않는 이유는 단순합니다. **페이지 전환을 브라우저가 아니라 JavaScript가 처리하기 때문에, GTM에 직접 알려줘야 한다**는 것입니다.

해결 방법도 명확합니다.

1. GTM 스니펫을 설치한다 (패키지 사용 또는 직접 삽입)
2. 라우트 변경 시 `dataLayer.push()`로 커스텀 이벤트를 전송한다
3. GTM에서 해당 이벤트를 트리거로 설정하여 GA4에 연결한다
4. 미리보기와 실시간 보고서로 검증한다

한 번 설정해두면 이후에는 GTM 안에서 태그를 자유롭게 추가할 수 있습니다. 페이스북 픽셀, 카카오 전환 추적, Hotjar 같은 도구도 동일한 `dataLayer` 이벤트를 활용하면 됩니다. **결국 핵심은 `dataLayer`에 이벤트를 push하는 한 줄**이고, 나머지는 GTM 안에서 해결되는 문제입니다.
