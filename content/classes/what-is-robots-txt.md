---
slug: what-is-robots-txt
term: robots.txt 알아보기
definition: 'robots.txt는 사이트 최상위 주소에 두는 텍스트 파일로, 검색엔진 크롤러에게 어느 경로를 방문하지 말라고 알려 주는 규칙 목록입니다.'
category: MARKETING
tags:
  - SEO
  - 마케팅 실무
publishedAt: '2026-08-02T00:00:00.000Z'
courseSlug: seo-fundamentals
orderInCourse: 4
aliases:
  - 로봇 텍스트
  - robots 파일
  - 크롤링 차단
  - 로봇 배제 표준
relatedTerms:
  - what-is-search-crawler
  - what-is-indexing
  - what-is-seo
difficulty: BEGINNER
quiz:
  - question: 이미 검색 결과에 나오는 페이지를 검색에서 완전히 빼려고 합니다. robots.txt로 그 경로를 차단하면 어떻게 될까요?
    options:
      - 크롤러가 들어가지 못해 색인 삭제 신호를 읽지 못하므로 검색 결과에 계속 남을 수 있다
      - 크롤러가 즉시 색인을 지우므로 검색 결과에서 바로 사라진다
      - 페이지 순위만 낮아지고 노출은 그대로 유지된다
      - 사이트 전체가 검색에서 제외된다
    correctIndex: 0
    explanation: >-
      robots.txt는 크롤링을 막는 파일이지 색인을 지우는 파일이 아닙니다. 오히려 크롤러가 페이지에 들어가지 못하면 그 안에 적힌
      색인 삭제 표시도 읽지 못합니다. 검색 결과에서 빼려면 크롤링은 열어 둔 채 페이지에 noindex 표시를 넣어야 합니다.
ogImage: /og/what-is-robots-txt.png
---

## 🤔 특정 페이지만 검색에서 빼고 싶은 상황

- "관리자 페이지나 장바구니 주소가 검색에 뜨면 곤란합니다"
- "robots.txt를 만지라는 말을 들었는데 어떤 파일인지 모르겠습니다"
- "검색에서 빼려고 차단했는데 오히려 주소가 계속 검색 결과에 남아 있습니다"

앞에서 크롤러 봇을 어떻게 오게 만드는지 봤습니다. **이 글에서는 반대로 오지 말라고 알려 주는 방법**을 다룹니다.

## 🔑 robots.txt의 정의

**robots.txt는 사이트 최상위 주소에 두는 텍스트 파일로, 검색엔진 크롤러에게 어느 경로를 방문하지 말라고 알려 주는 규칙 목록입니다.**

위치는 정해져 있습니다. 반드시 도메인 바로 뒤에 있어야 하고, 다른 폴더에 두면 크롤러가 찾지 못합니다.

```
https://example.com/robots.txt   (O)
https://example.com/files/robots.txt   (X)
```

성격도 알아 둘 필요가 있습니다. **이 파일은 명령이 아니라 요청입니다.** 구글이나 네이버 같은 주요 검색엔진은 규칙을 지키지만, 강제력이 있는 장치는 아닙니다. 그래서 외부에 알려지면 곤란한 정보를 이 파일로 가리려는 시도는 위험합니다. 파일 자체가 누구나 열어 볼 수 있는 공개 문서라서, 차단 목록에 적는 순간 그 경로가 어디인지 오히려 알려집니다.

## 🚪 robots.txt, 현관에 붙인 출입 금지 쪽지

<div style="overflow-x:auto; margin:1.5rem 0;">
  <div style="max-width:100%; border:3px solid #000; background:#fff;">
    <div style="background:#FFD700; border-bottom:3px solid #000; padding:10px 16px; font-weight:700;">현관 쪽지가 할 수 있는 일과 할 수 없는 일</div>
    <div style="padding:16px;">
      <div style="border:3px solid #000; background:#F3F3F3; padding:10px 12px; margin-bottom:8px;"><strong style="color:#FF0000;">할 수 있는 일</strong><br>예의 있는 손님이 안방에 들어가지 않게 합니다</div>
      <div style="border:3px solid #000; background:#F3F3F3; padding:10px 12px; margin-bottom:8px;"><strong style="color:#FF0000;">할 수 없는 일 1</strong><br>무례한 손님까지 막지는 못합니다</div>
      <div style="border:3px solid #000; background:#fff; padding:10px 12px;"><strong style="color:#FF0000;">할 수 없는 일 2</strong><br>안방이 있다는 것 자체는 감추지 못합니다. 쪽지에 방 이름을 적는 순간 오히려 알려집니다</div>
    </div>
  </div>
</div>

집 현관에 쪽지를 한 장 붙였습니다. "안방과 창고는 들어오지 말아 주세요"라고 적혀 있습니다.

예의를 지키는 손님은 이 쪽지를 읽고 두 방을 피해 갑니다. 여기까지는 의도한 대로입니다. 그런데 쪽지에는 두 가지 한계가 있습니다.

첫째, **예의를 안 지키는 손님은 그냥 들어갑니다.** 쪽지에 강제력이 없기 때문입니다. 정말 못 들어오게 하려면 문을 잠가야 합니다. 웹에서는 로그인을 걸거나 서버에서 접근을 막는 일이 문을 잠그는 쪽에 해당합니다.

둘째, **이 집에 안방이 있다는 것은 쪽지 때문에 오히려 알려집니다.** 쪽지를 읽은 사람은 안방 내용은 못 봐도 "저 집에 안방이 있구나"는 알게 됩니다. robots.txt도 같습니다. 차단한 경로가 파일에 그대로 적혀 있고, 그 파일은 누구나 열어 볼 수 있습니다.

## 📄 robots.txt 파일의 구조

실제 파일은 짧습니다. 줄 단위로 규칙을 적습니다.

```
User-agent: *
Disallow: /admin/
Disallow: /cart/
Allow: /admin/public-notice/

Sitemap: https://example.com/sitemap.xml
```

각 줄이 하는 일입니다.

- **User-agent**: 어느 크롤러에게 하는 말인지 지정합니다. `*`는 모든 크롤러를 뜻합니다
- **Disallow**: 방문하지 말라고 지정하는 경로입니다
- **Allow**: 차단한 폴더 안에서 예외로 열어 둘 경로입니다
- **Sitemap**: 사이트맵 주소를 알려 줍니다. 차단과는 무관하고, 발견을 돕는 줄입니다

마지막 줄은 눈여겨볼 만합니다. 이 파일은 막는 일만 하지 않고 **길을 알려 주는 역할도 함께 합니다.** 사이트맵은 다음 글에서 다룹니다.

## ⚠️ 크롤링 차단과 색인 차단의 차이

이 강에서 가장 중요한 부분입니다. 실무 사고의 대부분이 여기서 나옵니다.

| 구분 | robots.txt | noindex 표시 |
|---|---|---|
| 막는 대상 | 크롤러의 방문 | 검색 결과 저장 |
| 적는 위치 | 사이트 최상위 파일 | 각 페이지 안 |
| 크롤러 동작 | 페이지에 들어가지 않음 | 들어가서 읽고 저장은 안 함 |
| 쓰는 상황 | 크롤링 낭비를 줄이고 싶을 때 | 검색 결과에서 빼고 싶을 때 |

문장으로 정리하면 이렇습니다. **robots.txt는 들어오지 말라는 뜻이고, noindex는 들어와도 되지만 기록에 남기지 말라는 뜻입니다.**

둘을 섞으면 사고가 납니다. 검색 결과에서 페이지를 빼려고 robots.txt로 그 경로를 막으면, 크롤러가 들어가지 못해서 페이지 안에 적어 둔 noindex 표시를 읽지 못합니다. 결과적으로 **색인이 지워지지 않고 남습니다.** 검색 결과에는 제목 없이 주소만 뜨는 형태로 계속 보이기도 합니다.

검색에서 빼는 것이 목적이라면 순서는 이렇습니다. 크롤링은 열어 둔 채 페이지에 noindex를 넣고, 색인이 빠진 것을 확인한 다음에 필요하면 그때 robots.txt로 막습니다.

## 🔍 robots.txt에서 자주 나오는 사고 세 가지

**개발 중 걸어 둔 전체 차단이 그대로 배포될 때**

사이트를 만드는 동안에는 검색 노출을 막아 두는 것이 보통입니다. 이때 `Disallow: /` 한 줄을 넣는데, 이 줄은 사이트 전체를 막습니다. 공개할 때 지우는 것을 잊으면 페이지를 아무리 만들어도 크롤러가 한 곳도 방문하지 않습니다. 새 사이트가 검색되지 않을 때 가장 먼저 열어 볼 파일입니다.

**디자인 파일 폴더를 막아서 페이지가 깨져 보일 때**

용량을 아끼려고 스타일 파일이나 스크립트 폴더를 차단하는 경우가 있습니다. 크롤러는 사람이 보는 화면과 같은 모습으로 페이지를 확인하는데, 이 파일들을 못 받으면 화면을 제대로 그리지 못합니다. 모바일에서 제대로 보이는 페이지인지 판단하는 데도 영향을 줍니다.

**검색에 뜨는 주소를 지우려고 차단만 걸어 둘 때**

앞에서 본 사고입니다. 담당자는 차단했으니 곧 사라질 것이라 생각하는데, 몇 달이 지나도 주소가 검색 결과에 남아 있습니다. 크롤러가 들어가지 못해 삭제 신호를 읽지 못한 상태입니다. 차단을 풀고 noindex를 넣는 순서로 바꿔야 풀립니다.

세 사고 모두 **파일 한 줄이 사이트 전체를 결정합니다.** 짧은 파일이지만 배포 전에 확인할 가치가 큽니다.

다음 글에서는 반대 방향의 신호인 사이트맵을 봅니다.

## 📋 30초 요약

1. **robots.txt는 크롤러에게 어느 경로를 방문하지 말라고 알려 주는 파일입니다.** 사이트 최상위 주소에 있어야 하고, 강제력이 있는 장치가 아니라 요청입니다.

2. **현관에 붙인 출입 금지 쪽지와 같습니다.** 예의 있는 손님은 지키지만 무례한 손님은 무시하고, 방이 있다는 것 자체는 오히려 알려집니다.

3. **크롤링 차단과 색인 차단은 다릅니다.** 검색 결과에서 빼려면 robots.txt로 막지 말고 페이지에 noindex를 넣어야 합니다. 막아 버리면 삭제 신호를 읽지 못해 오히려 색인이 남습니다.

## 참고 자료

- [robots.txt 소개 및 가이드 (Google 검색 센터)](https://developers.google.com/search/docs/crawling-indexing/robots/intro?hl=ko)
- [robots.txt 작성 및 제출 방법 (Google 검색 센터)](https://developers.google.com/search/docs/crawling-indexing/robots/create-robots-txt?hl=ko)
- [색인 생성 차단하기: noindex (Google 검색 센터)](https://developers.google.com/search/docs/crawling-indexing/block-indexing?hl=ko)
