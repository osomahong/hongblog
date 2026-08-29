---
slug: what-is-seo
term: 검색엔진 최적화 (SEO) 이해하기
definition: 검색엔진 최적화(SEO)는 검색엔진이 페이지를 발견하고 저장하고 검색 결과에 보여주는 과정에 맞춰 사이트와 글을 정리하는 일입니다.
category: MARKETING
tags:
  - SEO
  - 마케팅 실무
  - 데이터 분석
publishedAt: '2026-08-02T00:00:00.000Z'
courseSlug: seo-fundamentals
orderInCourse: 1
aliases:
  - SEO
  - 검색엔진최적화
  - 구글 SEO
  - 서치엔진 최적화
relatedTerms:
  - what-is-web-crawling
  - what-is-aeo
  - what-is-geo
difficulty: BEGINNER
quiz:
  - question: 발견, 저장, 표시 세 단계 가운데 '저장' 단계에서 일어나는 일은 무엇일까요?
    options:
      - 크롤러가 받아 온 페이지를 검색엔진이 분석해 데이터베이스에 넣는다
      - 크롤러가 링크를 따라다니며 새 페이지 주소를 찾아낸다
      - 검색어에 맞춰 저장된 문서 가운데 무엇을 보여줄지 고른다
      - 페이지가 모바일에서 제대로 보이는지 확인한다
    correctIndex: 0
    explanation: >-
      두 번째 선택지는 발견(크롤링), 세 번째는 표시(게재) 단계입니다. 저장은 크롤러가 받아 온 내용을 분석해 색인에 넣는 단계이고,
      구글 공식 문서에서는 색인 생성이라고 부릅니다. 세 단계는 순서대로 일어나므로 저장을 통과하지 못한 페이지는 표시 단계로 넘어가지
      않습니다.
metaTitle: '검색엔진 최적화(SEO) 기초 정리: 발견, 저장, 표시 3단계와 흔한 오해'
metaDescription: >-
  검색엔진 최적화(SEO)는 검색엔진이 페이지를 발견하고 저장하고 보여주는 과정에 맞춰 사이트를 정리하는 일입니다. 3단계가 순서대로 일어나는 이유, 테크니컬과 콘텐츠와 AEO의 구분, 실무에서 자주 겪는 상황을 정리했습니다.
ogImage: /og/what-is-seo.png
summary3:
  - '검색엔진 최적화는 검색엔진이 페이지를 발견하고 저장하고 검색 결과에 보여주는 과정에 맞춰 사이트와 글을 정리하는 일입니다.'
  - '발견과 저장, 순위 세 단계 가운데 어디가 막혔는지에 따라 봐야 할 곳이 달라집니다.'
  - '구조를 다루는 테크니컬 SEO와 검색어를 다루는 콘텐츠 SEO, AI 답변 인용을 다루는 AEO와 GEO로 성격이 나뉩니다.'
---

## 🤔 검색 결과에서 내 페이지를 찾지 못하는 상황

- "회사 홈페이지를 새로 만들었는데 회사 이름으로 검색해도 안 나옵니다"
- "블로그 글을 매주 쓰는데 방문자가 늘지 않습니다"
- "SEO를 해야 한다는 말은 많이 듣는데, 정확히 뭘 하라는 건지 모르겠습니다"

세 상황 모두 검색엔진이 페이지를 어떤 순서로 처리하는지 몰라서 생깁니다. 그 순서를 알면 어디가 막혔는지 알 수 있습니다.

## 🔑 검색엔진 최적화(SEO)의 정의

**검색엔진 최적화(SEO, Search Engine Optimization)는 검색엔진이 페이지를 발견하고 저장하고 검색 결과에 보여주는 과정에 맞춰 사이트와 글을 정리하는 일입니다.**

실제로 구글도 공식 문서에서 검색이 크롤링, 색인 생성, 검색결과 게재 세 단계로 작동한다고 설명합니다. 이 코스에서는 각각 발견, 저장, 표시로 부르겠습니다. 여기서 중요한 것은 세 단계가 순서대로 일어난다는 점입니다.

1. **발견**: 크롤러 봇이 내 페이지 주소를 찾아냅니다
2. **저장**: 크롤러 봇이 받아 온 페이지를 검색엔진이 자체 데이터베이스에 넣습니다
3. **표시**: 누군가 검색했을 때 그 데이터베이스에서 꺼내 보여줍니다

앞 단계를 통과하지 못하면 뒤 단계는 아예 일어나지 않습니다. 발견되지 않은 페이지는 저장될 수 없고, 저장되지 않은 페이지는 검색 결과에 나올 수 없습니다.

SEO가 아닌 것도 정리해 두겠습니다. 도구를 한 번 돌려서 끝나는 작업이 아니고, 같은 단어를 본문에 여러 번 넣는 기법과도 다릅니다. 순위를 직접 조작하는 방법과는 더 거리가 멉니다.

## 🏪 SEO의 세 단계, 새로 연 가게가 손님을 만나기까지

<div style="overflow-x:auto; margin:1.5rem 0;">
  <div style="max-width:100%; border:3px solid #000; background:#fff;">
    <div style="background:#FFD700; border-bottom:3px solid #000; padding:10px 16px; font-weight:700;">가게가 손님을 만나기까지 거치는 세 단계</div>
    <div style="padding:16px;">
      <div style="display:flex; align-items:center; gap:8px; margin-bottom:10px;">
        <span style="background:#000; color:#fff; font-weight:700; padding:4px 10px; min-width:74px; text-align:center;">발견</span>
        <span style="flex:1; border:3px solid #000; background:#F3F3F3; padding:8px 12px;">지나가던 사람이 새 가게를 봅니다</span>
      </div>
      <div style="display:flex; align-items:center; gap:8px; margin-bottom:10px;">
        <span style="background:#000; color:#fff; font-weight:700; padding:4px 10px; min-width:74px; text-align:center;">저장</span>
        <span style="flex:1; border:3px solid #000; background:#F3F3F3; padding:8px 12px;">"저기 파스타집이 생겼다"고 기억해 둡니다</span>
      </div>
      <div style="display:flex; align-items:center; gap:8px;">
        <span style="background:#FF0000; color:#fff; font-weight:700; padding:4px 10px; min-width:74px; text-align:center;">표시</span>
        <span style="flex:1; border:3px solid #000; background:#fff; padding:8px 12px;">누가 "근처 파스타집?"이라고 물으면 그 가게를 말해 줍니다</span>
      </div>
      <div style="border-top:3px solid #000; margin-top:14px; padding-top:10px; font-size:0.85em; color:#555;">앞 단계가 끊기면 뒤 단계는 일어나지 않습니다.</div>
    </div>
  </div>
</div>

골목에 가게를 하나 열었다고 해 보겠습니다. 간판을 달고 문을 열었는데 손님이 오지 않습니다. 이유는 셋으로 나뉩니다.

- **아무도 그 골목을 지나가지 않았습니다.** 가게가 생긴 것을 본 사람이 없습니다. 검색엔진으로 치면 페이지가 발견되지 않은 상태입니다.
- **지나가긴 했는데 기억에 남지 않았습니다.** 간판이 가려져 있었거나 문이 닫혀 있었습니다. 페이지가 발견은 됐지만 저장되지 않은 상태입니다.
- **기억은 하는데 다른 가게를 먼저 말합니다.** 근처에 더 유명한 파스타집이 있습니다. 저장은 됐지만 순위가 밀린 상태입니다.

이유가 다르면 해야 할 일도 전혀 다릅니다. 아무도 지나가지 않는 골목이면 길을 내야 하고, 간판이 가려졌으면 간판을 치워야 하고, 경쟁 가게에 밀렸으면 메뉴를 손봐야 합니다. **그런데 실무에서는 세 경우를 구분하지 않고 전부 메뉴부터 바꿉니다.** 글을 다시 쓰는 것입니다. 발견이 막혔는데 글을 수정하면 아무것도 달라지지 않습니다.

## 🧭 SEO가 나뉘는 세 가지

SEO는 하나의 작업이 아니라 성격이 다른 세 가지로 나뉩니다. 각각 확인할 것도 손댈 곳도 달라서, 지금 무엇이 막혔는지에 따라 봐야 할 곳이 달라집니다.

| 구분 | 다루는 것 | 확인하는 지점 |
|---|---|---|
| 테크니컬 SEO | 검색엔진이 페이지를 발견하고 저장하는 구조 | 이 페이지의 색인 여부 |
| 콘텐츠 SEO | 어떤 검색어에서 무엇을 보여줄 것인지 | 사람들이 실제로 쓰는 검색어 |
| AEO와 GEO | AI가 만든 답변에 인용되는 조건 | 답변에 인용되는 문장 |

이 코스가 다루는 것은 테크니컬 SEO입니다. 콘텐츠 SEO와 AEO, GEO는 이어지는 코스에서 다룹니다.

순서에는 이유가 있습니다. 검색어를 아무리 잘 골라도 페이지가 색인되지 않으면 의미가 없고, AI 답변에 인용되려면 그 전에 검색엔진이 페이지를 읽을 수 있어야 합니다. **테크니컬 SEO가 되어 있어야 콘텐츠 SEO와 AEO, GEO도 의미가 있습니다.**

## 🧱 이 코스가 다루는 순서

이 코스는 앞에서 본 발견과 저장 두 단계를 아홉 편으로 나눠 다룹니다. 순서대로 따라가면 하나씩 쌓입니다.

<div style="overflow-x:auto; margin:1.5rem 0;">
  <div style="max-width:100%; border:3px solid #000; background:#fff;">
    <div style="background:#FFD700; border-bottom:3px solid #000; padding:10px 16px; font-weight:700;">이 코스가 다루는 순서</div>
    <div style="padding:16px;">
      <div style="border:3px solid #000; background:#F3F3F3; padding:8px 12px; margin-bottom:8px;"><strong>시작</strong> 전체 지도. 지금 읽고 있는 글입니다</div>
      <div style="border-left:8px solid #FF0000; border-top:3px solid #000; border-right:3px solid #000; border-bottom:3px solid #000; background:#fff; padding:8px 12px; margin-bottom:4px;"><strong>크롤러와 색인</strong> 발견과 저장이 일어나는 방식</div>
      <div style="border-left:8px solid #FF0000; border-top:3px solid #000; border-right:3px solid #000; border-bottom:3px solid #000; background:#fff; padding:8px 12px; margin-bottom:4px;"><strong>robots.txt와 사이트맵</strong> 검색엔진에게 보내는 두 가지 신호</div>
      <div style="border-left:8px solid #FF0000; border-top:3px solid #000; border-right:3px solid #000; border-bottom:3px solid #000; background:#fff; padding:8px 12px; margin-bottom:4px;"><strong>정규 URL과 내부 링크</strong> 주소가 여러 개일 때의 정리와 페이지끼리 잇는 방법</div>
      <div style="border-left:8px solid #FF0000; border-top:3px solid #000; border-right:3px solid #000; border-bottom:3px solid #000; background:#fff; padding:8px 12px; margin-bottom:8px;"><strong>페이지 속도</strong> 느린 페이지가 받는 불이익</div>
      <div style="border:3px solid #000; background:#F3F3F3; padding:8px 12px;"><strong>마무리</strong> 지금까지 배운 것을 서치 콘솔에서 직접 확인</div>
    </div>
  </div>
</div>

크롤러부터 페이지 속도까지는 개념을 하나씩 익히고, 마지막에 그 개념들을 실제 화면에 대입해 봅니다. 중간에 막히면 앞으로 돌아가면 됩니다.

## ⚠️ SEO를 둘러싼 흔한 오해 세 가지

**"AI 도구에 주소를 주면 알아서 해 줍니다"**

AI가 한 번에 읽을 수 있는 분량은 정해져 있습니다. 사이트 하나를 보려면 페이지 구조, 메타 정보, 본문, 내부 링크, 서버 기록을 다 봐야 하는데 한 번에 들어가지 않습니다. 그래서 나눠서 봐야 하고, **어떤 기준으로 어떤 순서로 나눌지는 사람이 정해야 합니다.** 이 코스가 그 순서를 다룹니다.

**"키워드를 본문에 많이 넣으면 순위가 오릅니다"**

같은 단어를 의미 없이 반복해 채워 넣는 방식은 구글이 스팸 정책에서 직접 금지하고 있습니다. 다만 사람들이 실제로 쓰는 표기를 한 번도 쓰지 않으면 그 검색어에서는 잡히기 어렵습니다. 반복이 아니라 누락이 문제입니다.

**"SEO는 개발자가 하는 일입니다"**

이 코스에서 다루는 항목 중 개발이 필요한 것은 일부입니다. robots.txt와 사이트맵은 대부분의 사이트 제작 도구가 자동으로 만들어 주고, 확인은 서치 콘솔 화면에서 클릭 몇 번으로 끝납니다. **무엇이 잘못됐는지 판단하는 데는 개발 실력이 아니라 구조를 아는 것이 필요합니다.**

## 🔍 검색이 안 될 때 실제로 벌어지는 상황 세 가지

**회사 홈페이지를 새로 만들었는데 회사 이름으로도 검색되지 않을 때**

가장 흔한 원인은 테스트 환경에서 걸어 둔 색인 거부 설정이 그대로 배포에 넘어간 경우입니다. 사이트를 만들 때는 검색에 노출되면 곤란하니 막아 두는데, 공개할 때 그 설정을 푸는 것을 잊습니다. 글을 수정해도 의미가 없고, 설정 한 줄을 지워야 풀립니다.

**쇼핑몰 상품 페이지 수백 개 중 일부만 검색될 때**

이 상황은 상품 수가 많은 사이트에서 자주 나옵니다. 실제로 구글도 관련 문서에서 사이트 한 곳을 크롤링하는 데 쓰는 자원에 한도가 있다고 밝히고 있습니다. 이 한도를 크롤링 예산이라고 부릅니다. 안쪽 깊이 들어가야 나오는 페이지는 그만큼 발견이 늦어집니다. 사이트맵에 상품 주소를 모아 알려 주거나, 카테고리 페이지에서 상품으로 이어지는 링크를 정리하면 나아집니다.

**블로그 글을 발행했는데 며칠째 검색되지 않을 때**

이 경우는 대개 문제가 아닙니다. 새 글은 발견에서 저장까지 며칠에서 몇 주가 걸리기도 합니다. 다만 한 달이 지나도 그대로라면 발견 경로가 없는 것입니다. 사이트맵에 들어가 있는지, 다른 페이지에서 그 글로 가는 링크가 하나라도 있는지 확인합니다.

세 경우 모두 **글을 잘 썼는지와는 상관이 없습니다.** 어디가 막혔는지 먼저 확인하는 것이 SEO의 첫 단계입니다.

크롤러 봇이 페이지를 어떻게 찾아오는지는 [검색엔진 크롤러](/class/seo-fundamentals/what-is-search-crawler)에서, 받아 온 뒤 저장되는 과정은 [색인](/class/seo-fundamentals/what-is-indexing)에서 이어집니다. 참고로 데이터를 모으는 용도의 [웹 크롤링](/class/digital-basic/what-is-web-crawling)과는 목적이 다른 개념입니다.

## 📋 3줄 요약

1. 검색엔진 최적화는 검색엔진이 페이지를 발견하고 저장하고 검색 결과에 보여주는 과정에 맞춰 사이트와 글을 정리하는 일입니다.

2. 발견과 저장, 순위 세 단계 가운데 어디가 막혔는지에 따라 봐야 할 곳이 달라집니다.

3. 구조를 다루는 테크니컬 SEO와 검색어를 다루는 콘텐츠 SEO, AI 답변 인용을 다루는 AEO와 GEO로 성격이 나뉩니다.

## 참고 자료

아래 공식 문서는 2026년 8월 기준으로 확인했습니다. 검색엔진 정책은 바뀔 수 있으므로 최신 내용은 원문에서 확인하시면 됩니다.

- [Google 검색의 작동 방식 (Google 검색 센터)](https://developers.google.com/search/docs/fundamentals/how-search-works)
- [검색의 작동 방식 기본사항 (Search Console 고객센터)](https://support.google.com/webmasters/answer/9128586?hl=ko)
- [크롤링 예산 관리 (Google 크롤링 인프라 문서)](https://developers.google.com/crawling/docs/crawl-budget)
- [스팸 관련 정책 (Google 검색 센터)](https://developers.google.com/search/docs/essentials/spam-policies?hl=ko)
