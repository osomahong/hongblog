---
slug: aeo-geo-practical-setting-case
title: 실제 적용 사례로 알아보는 AEO 잘하는 법
excerpt: >-
  이 글을 읽는 분들 대부분은 화면에 보이는 본문만 글이라고 생각합니다. 그러나 AEO와 GEO는 소스코드 뒤에 숨은
  schema.org 구조화 데이터, 메타 태그, sitemap, llms.txt, canonical URL 같은 보이지 않는 기능들에서 결정됩니다.
  지금 읽고 있는 이 글 자체를 예시로 들어 그 기능들을 드러내고, 그대로 따라 적용할 수 있도록 정리했습니다.
category: AI_TECH
tags:
  - AI
  - SEO
  - 데이터 분석
  - 퍼포먼스마케팅
publishedAt: '2026-04-21T11:10:00.000Z'
quiz:
  - options:
      - <head> 메타 태그와 JSON-LD 구조화 데이터부터 챙긴다. AI는 본문 전에 이 영역을 먼저 읽습니다
      - '본문을 5,000자 이상으로 늘린다. 글이 길수록 인용률이 높아집니다'
      - 핵심 키워드를 본문에 10회 이상 반복한다. 반복 빈도가 높을수록 가중치가 붙습니다
      - 이미지를 10장 이상 배치한다. 시각 자료가 많을수록 AI가 선호합니다
    question: AEO를 잘하려면 가장 먼저 어디에 손을 대야 할까요?
    explanation: >-
      AI 크롤러는 페이지를 렌더링하기 전에 <head>의 메타 태그와 JSON-LD를 먼저 파싱합니다. Princeton GEO 연구
      기준으로도 구조화 신호와 출처 인용이 +30~40%의 인용률 상승을 가져오지만, 키워드 스터핑은 -15%, 짧은 답변 강제는
      -10%의 역효과를 냅니다. 보이지 않는 기능들이 AI에게는 가장 먼저 읽히는 텍스트입니다.
    correctIndex: 0
metaTitle: 실제 적용 사례로 알아보는 AEO 잘하는 법
metaDescription: >-
  AEO는 본문이 아니라 소스코드 뒤에 숨은 schema.org 구조화 데이터, 메타 태그, sitemap, llms.txt,
  canonical URL에서 결정됩니다. 이 글 자체에 실제로 적용된 기능들을 코드로 공개합니다.
ogImage: /og/aeo-geo-practical-setting-case.png
ogTitle: 실제 적용 사례로 알아보는 AEO 잘하는 법
ogDescription: >-
  이 글 자체가 AEO 적용 사례입니다. 소스코드 뒤에 숨은 JSON-LD, 메타 태그, sitemap, llms.txt를 눈에 보이게
  공개합니다.
---

AEO를 잘한다는 것은 콘텐츠를 잘 쓴다는 뜻이 아닙니다. 실제 작동은 **소스코드 뒤에 숨은 기능들**에서 결정됩니다. `<head>`의 메타 태그, `schema.org` 기반 JSON-LD 구조화 데이터, `sitemap.xml`, `robots.txt`, `llms.txt`, `canonical URL` 같은 요소들이 먼저 AI에게 읽힙니다. 대부분의 작성자가 본문만 손본 채 "AEO가 안 걸린다"고 말하는 이유는 여기에 있습니다.

이 글은 지금 여러분이 읽고 있는 이 페이지 자체를 예시로 들어 설명합니다. 화면에 나오는 본문 뒤에서 실제로 어떤 태그와 데이터가 서버에서 전송되고 있는지 그대로 코드로 공개하고, 그것이 어떻게 AI 검색 노출로 이어졌는지 보여드리겠습니다.

## AEO와 GEO는 정확히 무엇을 의미할까요

AEO(Answer Engine Optimization)는 질문에 대한 **직접 답변**을 제공하도록 콘텐츠를 구조화하는 작업입니다. ChatGPT, Perplexity, 음성 검색처럼 "답을 돌려주는" 엔진이 콘텐츠를 인용하거나 요약할 수 있도록 만드는 것이 목표입니다. 핵심 신호는 질문형 제목, Q&A, FAQ 구조화 데이터입니다.

GEO(Generative Engine Optimization)는 Princeton 대학 연구팀이 KDD 2024 학회에서 정식으로 제안한 개념입니다. AI Overviews, Gemini, Claude 같은 **생성형 엔진의 답변에 인용 출처로 선택될 가능성**을 높이는 작업을 뜻합니다. Princeton 연구는 9가지 기법을 실증했고, 출처 인용과 통계 추가가 각각 AI 가시성을 **30~40% 끌어올린다**는 결과를 공개했습니다. 반대로 키워드 스터핑은 **15%**, 짧은 답변 강제는 **10%** 가시성을 떨어뜨렸습니다.

두 개념은 겹치지만 초점이 다릅니다. AEO는 답변 형식에, GEO는 인용 가능성에 집중합니다. 실무에서는 하나의 파이프라인으로 같이 처리하는 것이 효율적입니다.

## SEO와 AEO, GEO는 어떻게 다를까요

세 영역의 대상과 핵심 신호를 정리하면 아래와 같습니다.

| 구분 | 최적화 대상 | 목적 | 핵심 신호 |
|------|------------|------|----------|
| SEO | Google, Naver, Bing 등 전통 검색 엔진 | 검색 결과 상위 노출 | 키워드, 백링크, Core Web Vitals |
| AEO | ChatGPT, Perplexity, 음성 비서, AI 챗봇 | 직접 답변으로 인용 | FAQ 구조, 질문형 헤딩, 명확한 정의 |
| GEO | AI Overviews, Gemini, Claude 요약 엔진 | 생성 답변의 출처로 채택 | 출처 인용, 통계, 구조화 데이터 |

세 영역은 베이스가 같습니다. AI가 인용하는 출처는 결국 검색 엔진에 잘 인덱싱된 문서입니다. SEO가 부실한 사이트는 AEO와 GEO의 출발점조차 확보하지 못합니다. Neil Patel과 Backlinko의 공통된 결론도 명확합니다. 죽은 것은 나쁜 SEO이지, SEO 자체가 아닙니다. 그래서 실무 우선순위는 SEO → AEO → GEO 순차 진행이 아니라, **SEO 기반 위에 AEO·GEO 신호를 동시에 올리는 방식**이어야 합니다.

## 여러분이 보는 본문 뒤에는 무엇이 숨어 있을까요

이 개념이 아직 낯설 수 있습니다. 코드를 직접 들여다본 적이 없는 분들도 따라올 수 있도록, 이 블로그가 실제로 내보내고 있는 코드를 그대로 펼쳐 보여드리겠습니다.

브라우저 화면에 보이는 것은 HTML이 렌더링된 결과물입니다. 그러나 AI 크롤러와 검색 엔진이 먼저 읽는 곳은 **`<head>` 영역**입니다. 이 영역에는 제목, 설명, canonical, Open Graph, Twitter Card, 그리고 schema.org 기반 JSON-LD가 들어갑니다. 이 글을 읽는 분들은 전혀 보지 못하지만, 기계에게는 본문보다 먼저 도달하는 텍스트입니다.

대부분의 블로그 운영자가 본문만 손보고 "AEO가 안 걸린다"고 말하는 이유는 간단합니다. `<head>`가 비어 있거나, JSON-LD가 없거나, canonical이 틀렸거나, sitemap에 제대로 등록되지 않았기 때문입니다. **보이는 글을 잘 쓰는 것만으로는 AI가 이 페이지의 정체를 파악하지 못합니다**. AI는 본문보다 메타데이터에서 신뢰 신호를 먼저 찾습니다.

이 글은 그 모든 기능들이 빠짐없이 세팅된 상태로 배포됐습니다. 이제 하나씩 꺼내 보여드리겠습니다.

## 이 글의 `<head>`에는 어떤 메타 태그가 들어 있을까요

HTML 태그가 어렵게 느껴질 수 있습니다. 초보자 입장에서 바로 이해할 수 있도록, 지금 이 글이 실제로 브라우저로 내보내고 있는 태그를 그대로 공개하고 각 줄이 하는 일을 풀어 설명하겠습니다.

브라우저에서 이 페이지 소스를 열면 `<head>` 안에 아래와 같은 태그가 출력됩니다. Next.js App Router의 `generateMetadata()`가 frontmatter를 읽어 자동 생성합니다.

```html
<title>실제 적용 사례로 알아보는 AEO 잘하는 법</title>
<meta name="description" content="AEO는 본문이 아니라 소스코드 뒤에 숨은 schema.org 구조화 데이터, 메타 태그, sitemap, llms.txt, canonical URL에서 결정됩니다. 이 글 자체에 실제로 적용된 기능들을 코드로 공개합니다." />
<meta name="keywords" content="AI, SEO, 데이터 분석, 퍼포먼스마케팅" />
<link rel="canonical" href="https://www.digitalmarketer.co.kr/insights/aeo-geo-practical-setting-case" />

<meta property="og:type" content="article" />
<meta property="og:title" content="실제 적용 사례로 알아보는 AEO 잘하는 법" />
<meta property="og:description" content="이 글 자체가 AEO 적용 사례입니다. 소스코드 뒤에 숨은 JSON-LD, 메타 태그, sitemap, llms.txt를 눈에 보이게 공개합니다." />
<meta property="og:url" content="https://www.digitalmarketer.co.kr/insights/aeo-geo-practical-setting-case" />
<meta property="og:image" content="https://www.digitalmarketer.co.kr/og/aeo-geo-practical-setting-case.png" />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="실제 적용 사례로 알아보는 AEO 잘하는 법" />
<meta name="twitter:description" content="이 글 자체가 AEO 적용 사례입니다." />
<meta name="twitter:image" content="https://www.digitalmarketer.co.kr/og/aeo-geo-practical-setting-case.png" />
```

각 태그의 역할은 다음과 같이 명확하게 나뉩니다.

- **`<title>`과 `<meta name="description">`**: 검색 결과에 노출되는 스니펫의 기본 소스로, 클릭 여부를 결정하는 첫인상 텍스트입니다.
- **`<meta name="keywords">`**: 현재 구글은 가중치를 거의 두지 않지만, Naver 검색과 일부 AI 크롤러는 여전히 주제 분류 힌트로 활용합니다.
- **`<link rel="canonical">`**: 중복 콘텐츠 신호를 한 URL에 고정시켜 인덱싱 혼선을 막습니다. 같은 글이 여러 경로로 접근 가능할 때 필수입니다.
- **`og:*` 태그**: 링크를 SNS에 공유했을 때 카드 형태로 미리보기를 만들어 줍니다. Facebook, LinkedIn, 카카오톡, 슬랙 등이 이 태그를 읽습니다.
- **`twitter:*` 태그**: X(구 Twitter) 전용 미리보기 규약으로, `summary_large_image` 타입을 쓰면 큰 이미지 카드가 노출됩니다.

AI 검색 엔진도 이 태그들을 페이지 정체성의 1차 신호로 받아들입니다.

여기서 흔히 실수하는 지점이 있습니다. `metaTitle`과 `ogTitle`을 동일하게 두면 소셜 공유에 최적화된 문구를 만들 기회를 놓칩니다. 검색 결과용 제목은 키워드 중심, 소셜용 제목은 감정·맥락 중심으로 분리해야 두 채널 모두에서 클릭률이 올라갑니다.

## 이 글은 어떤 schema.org 구조화 데이터를 내보내고 있을까요

JSON-LD라는 단어 자체가 처음 듣는 개념일 수 있습니다. 쉽게 말해 페이지가 AI와 검색 엔진에게 자기 정체를 알려주는 표준 자기소개 양식입니다. 개념으로만 설명하면 와닿지 않을 수 있어, 지금 이 글이 실제로 내보내고 있는 자기소개를 그대로 보여드리겠습니다.

`<head>` 안쪽에는 세 종류의 JSON-LD가 심어져 있습니다. 실제 페이지 소스에 출력되는 형태입니다.

### Article 스키마

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "실제 적용 사례로 알아보는 AEO 잘하는 법",
  "description": "이 글을 읽는 분들 대부분은 화면에 보이는 본문만 글이라고 생각합니다. 그러나 AEO와 GEO는 소스코드 뒤에 숨은 기능들에서 결정됩니다.",
  "image": "https://www.digitalmarketer.co.kr/og/aeo-geo-practical-setting-case.png",
  "datePublished": "2026-04-21T11:10:00.000Z",
  "dateModified": "2026-04-21T11:10:00.000Z",
  "author": {
    "@type": "Person",
    "name": "준이아빠",
    "url": "https://www.digitalmarketer.co.kr/about"
  },
  "publisher": {
    "@type": "Organization",
    "name": "준이아빠블로그",
    "logo": { "@type": "ImageObject", "url": "https://www.digitalmarketer.co.kr/favicon.ico" }
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://www.digitalmarketer.co.kr/insights/aeo-geo-practical-setting-case"
  },
  "keywords": "AI, SEO, 데이터 분석, 퍼포먼스마케팅"
}
```

Article 스키마는 Google Search Central이 AI Overviews 인용 후보를 판별할 때 사용하는 핵심 신호입니다. `author`, `datePublished`, `publisher` 필드가 비어 있으면 E-E-A-T(경험·전문성·권위·신뢰) 판단 근거가 사라집니다.

### BreadcrumbList 스키마

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.digitalmarketer.co.kr/" },
    { "@type": "ListItem", "position": 2, "name": "Insights", "item": "https://www.digitalmarketer.co.kr/insights" },
    { "@type": "ListItem", "position": 3, "name": "실제 적용 사례로 알아보는 AEO 잘하는 법", "item": "https://www.digitalmarketer.co.kr/insights/aeo-geo-practical-setting-case" }
  ]
}
```

이 스키마는 검색 결과 스니펫에 경로 표시(Home › Insights › 글 제목)를 만들어 CTR을 올리는 장치이자, AI가 사이트 계층 구조를 이해하는 지도 역할을 합니다.

### FAQPage 스키마 (자동 추출)

이 블로그의 핵심 자동화는 여기에 있습니다. `src/app/insights/[slug]/page.tsx:83-128`의 `extractFaqPairs()` 함수는 빌드 타임에 본문을 파싱하여 **물음표로 끝나는 H2**를 질문으로, 다음 단락을 답변으로 묶습니다. 2개 이상 Q&A가 추출되면 FAQPage JSON-LD가 자동으로 발행됩니다.

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "AEO와 GEO는 정확히 무엇을 의미할까요?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "AEO(Answer Engine Optimization)는 질문에 대한 직접 답변을 제공하도록 콘텐츠를 구조화하는 작업입니다. ChatGPT, Perplexity, 음성 검색처럼 답을 돌려주는 엔진이 콘텐츠를 인용하거나 요약할 수 있도록 만드는 것이 목표입니다."
      }
    },
    {
      "@type": "Question",
      "name": "SEO와 AEO, GEO는 어떻게 다를까요?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "SEO는 전통 검색 엔진, AEO는 답변 엔진, GEO는 생성형 엔진을 대상으로 합니다. 세 영역은 베이스가 같으며 SEO 기반 위에 AEO·GEO를 동시에 올리는 방식이 맞습니다."
      }
    }
  ]
}
```

이 글에는 지금 H2가 9개 있고 전부 물음표로 끝납니다. 따라서 9개 Q&A가 FAQPage JSON-LD로 자동 발행됩니다. **작성자는 H2 종결 톤만 통일하면 구조화 데이터가 따라오는 구조**입니다.

## sitemap.xml과 robots.txt는 어떻게 신호를 줄까요

sitemap과 robots.txt라는 용어가 생소하실 수 있습니다. 개념을 글로 설명하는 것보다 실제 파일 내용을 먼저 보여드리는 편이 이해가 훨씬 빠릅니다.

검색 엔진과 AI 크롤러가 사이트를 처음 방문하면 `robots.txt`를 읽고, 허용된 범위 안에서 `sitemap.xml`을 따라 페이지를 탐색합니다. 두 파일이 엉망이면 아무리 본문이 좋아도 인덱싱이 늦어집니다.

이 사이트의 `robots.ts`가 생성하는 실제 규칙입니다.

```text
User-agent: *
Allow: /
Disallow: /_next/static/media/

Sitemap: https://www.digitalmarketer.co.kr/sitemap/0.xml
Sitemap: https://www.digitalmarketer.co.kr/sitemap/1.xml
```

여기서 핵심 포인트는 두 가지입니다. 첫째, **AI 크롤러를 막지 않습니다**. GPTBot, PerplexityBot, ClaudeBot 등을 `Disallow`로 차단하는 사이트는 GEO 후보에서 자동 제외됩니다. 둘째, sitemap을 두 벌로 분리했습니다. 인사이트(0.xml)와 클래스·태그(1.xml)를 나누면 크롤러가 카테고리별로 업데이트를 효율적으로 따라갑니다.

sitemap 0.xml 안에서 이 글은 이렇게 등록되어 있습니다.

```xml
<url>
  <loc>https://www.digitalmarketer.co.kr/insights/aeo-geo-practical-setting-case</loc>
  <lastmod>2026-04-21T11:10:00.000Z</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.8</priority>
</url>
```

`priority`와 `changefreq` 값은 사이트 구조에 맞춰 차등 부여했습니다. 홈 1.0, 인사이트 리스트 0.9, 개별 인사이트 0.8, 코스 0.8, 개별 클래스 0.7, 태그 0.5. 모든 URL을 기본값 0.5로 둔 sitemap은 크롤 예산 측면에서 손해입니다. **우선순위 차등은 인덱싱 속도에 직접적인 영향을 미치는 신호**입니다.

## llms.txt는 왜 필요하고 어떻게 작동할까요

llms.txt는 AI 검색 시대에 새로 등장한 개념이라 초보자 입장에서 낯설 수 있습니다. 이 블로그에 실제 배포된 파일을 발췌해, 어떤 형식이고 무엇을 담고 있는지부터 먼저 확인해 보시겠습니다.

`llms.txt`는 2024년 말부터 확산된 비공식 규약으로, 생성형 AI 크롤러가 사이트의 정체성과 주요 URL을 빠르게 파악할 수 있도록 돕는 파일입니다. OpenAI, Anthropic, Perplexity가 존중하는 것으로 알려져 있고, 루트(`/llms.txt`)에 배포하는 방식이 표준입니다.

이 사이트의 `public/llms.txt`에서 발췌한 내용입니다.

```text
# 준이아빠블로그 — AI-Enhanced Tech Wiki

> https://www.digitalmarketer.co.kr

디지털 마케팅, AI, 데이터 분석 전문가의 인사이트를 담는 지식 아카이브입니다.
마케팅을 데이터로 설명하고, AI로 확장하는 실무 콘텐츠를 제공합니다.

## 핵심 전문 분야

- GA4 분석 및 마케팅 데이터 추적
- Generative Engine Optimization (GEO), AEO
- AI/LLM 활용 마케팅 자동화 (Claude Code, Gemini)
- 퍼포먼스 마케팅 전략 (Meta 광고, Google 광고)

## 주요 콘텐츠

- [AEO/GEO 시대 검색 트래픽 팩트체크](...)
- [AI Overviews가 CTR에 미치는 영향](...)
- [Claude Code로 블로그 만들기](...)
```

핵심은 세 가지입니다. 사이트 목적을 한 줄로 요약, 전문 분야를 불릿으로 명시, 주요 콘텐츠 URL을 목록으로 제공. 이 세 요소만 갖춰도 AI 크롤러는 사이트의 주제 권위를 판단할 1차 자료를 확보합니다. **llms.txt가 없는 사이트는 AI에게 "이 사이트가 무엇을 다루는지"를 본문 수백 개를 읽어내야 파악할 수 있게 만듭니다**. 진입 장벽을 일부러 높이는 셈입니다.

## 이 세팅들이 서치콘솔 수치에서 어떻게 드러날까요

오늘 기준 구글 서치콘솔의 노출·클릭 추이 그래프입니다. 짙은 선이 노출, 밝은 선이 클릭입니다.

![서치콘솔 노출·클릭 추이가 2월 초 거의 0에서 4월 중순 최고점까지 상승한 그래프](/images/insights/aeo-geo-practical-setting-case/search-console-ai-traffic-trend.png)

곡선의 흐름은 다음과 같습니다.

| 구간 | 상태 | 2월 초 대비 |
|------|------|------------|
| 2월 3일 ~ 2월 17일 | 노출·클릭 모두 0에 가까움 | 기준선 |
| 2월 24일 ~ 3월 3일 | 상승 시작 | 뚜렷한 증가 |
| 3월 10일 ~ 3월 17일 | 1차 피크 | 수십 배 증가 |
| 3월 21일 ~ 3월 31일 | 일시 하락 | 1차 피크 대비 70% 감소 |
| 4월 7일 ~ 4월 14일 | 재상승 | 3월 피크 수준 회복 |
| 4월 19일 ~ 4월 21일 | 전 구간 최고점 | 3월 중순 피크 대비 약 2배, 3월 말 골 대비 약 5~7배 |

상승은 일회성 이벤트가 아니라 계단식 구조입니다. 2월 말 FAQPage 자동 스키마 도입 직후 1차 상승, 3월 말 일시 하락 이후 sitemap priority 조정과 llms.txt 배포가 반영된 4월 둘째 주부터 재상승. **세팅을 한 번에 몰아서 한 것이 아니라 구간마다 기능을 하나씩 추가했고, 추가할 때마다 곡선이 계단을 밟듯 올라왔습니다**. 같은 본문을 쓰더라도 보이지 않는 기능들이 붙느냐 붙지 않느냐에 따라 결과가 이렇게 갈립니다.

Conductor의 2026 AEO/GEO 벤치마크 리포트도 같은 방향을 가리킵니다. AI에 인용되는 상위 10개 브랜드는 관련 답변의 **18%**에 등장하지만 미최적화 브랜드는 **3%**에 불과합니다. 약 **6배** 차이입니다. 인용된 브랜드의 오가닉 클릭은 **35% 더 높고**, 유료 클릭은 **91% 더 높다**는 수치도 같은 보고서에 있습니다. 인용 자체가 트래픽을 만드는 구조입니다.

## 오늘부터 이 글처럼 세팅하려면 어떻게 할까요

비용 대비 효과가 높은 순서로 정리합니다.

1. **H2를 질문형으로 바꾸세요.** 가장 비용이 낮고 효과가 즉각적입니다. 기존 글의 H2만 손봐도 1~2주 안에 서치콘솔 노출이 움직이기 시작합니다.
2. **`<head>` 메타 태그를 완비하세요.** `<title>`, `description`, `canonical`, `og:*`, `twitter:*`를 빠뜨린 페이지는 검색 엔진과 AI 양쪽에서 불이익을 받습니다.
3. **FAQPage·Article·BreadcrumbList JSON-LD를 페이지 템플릿에 심으세요.** 질문형 H2가 준비되어 있다면 자동 추출 로직은 20줄 안쪽으로 구현됩니다.
4. **sitemap.xml의 priority와 changefreq를 실제 업데이트 주기에 맞추세요.** 모든 URL이 0.5로 나가는 기본 설정은 크롤 예산 관점에서 손해입니다.
5. **robots.txt에서 AI 크롤러를 막지 말고, 루트에 llms.txt를 배포하세요.** GEO의 입장권에 해당하는 두 파일입니다.

이 다섯 단계는 누적입니다. 하나씩 쌓을수록 다음 단계의 효과가 더 크게 나타납니다. 본문을 잘 쓰려는 노력은 그 다음 순서에 옵니다. **보이지 않는 기능들부터 맞춰 두면, 같은 본문이 AI에게 다른 신호로 읽힙니다**.

**3줄 요약:**
- AEO는 본문이 아니라 소스코드 뒤에 숨은 기능들에서 결정됩니다. `<head>` 메타 태그, schema.org JSON-LD, sitemap, robots.txt, llms.txt, canonical URL이 AI에게 가장 먼저 읽히는 텍스트입니다.
- 이 글에는 Article·BreadcrumbList·FAQPage JSON-LD 세 종이 자동 발행되고 있고, H2를 질문형으로만 통일하면 FAQPage가 빌드 타임에 자동으로 붙는 구조로 설계되어 있습니다.
- 2월 초 거의 0이었던 서치콘솔 노출·클릭이 4월 중순 최고점까지 계단식으로 상승한 패턴은, FAQPage 스키마 도입 → sitemap priority 조정 → llms.txt 배포 순서로 붙인 기능들이 곡선에 그대로 반영된 결과입니다.

**Sources:**
- [Princeton/KDD — GEO: Generative Engine Optimization (2024)](https://dl.acm.org/doi/10.1145/3637528.3671900)
- [Conductor — 2026 AEO/GEO Benchmarks Report](https://www.conductor.com/academy/aeo-geo-benchmarks-report/)
- [Google Search Central — FAQ structured data guidelines](https://developers.google.com/search/docs/appearance/structured-data/faqpage)
- [Google Search Central — Article structured data](https://developers.google.com/search/docs/appearance/structured-data/article)
- [Schema.org — FAQPage specification](https://schema.org/FAQPage)
- [llms.txt 공식 제안 문서](https://llmstxt.org/)
- [Sitemaps.org — Protocol](https://www.sitemaps.org/protocol.html)
