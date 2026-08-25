---
slug: claude-code-app-search-console-ga4-vercel
title: 클로드 코드로 만든 웹앱 서치콘솔 등록과 GA4 설치 순서 (Vercel 기준)
excerpt: >-
  서치콘솔 등록과 GA4 설치는 클로드 코드로 만든 웹앱을 알리기 전에 먼저 해 두는 두 가지 준비입니다. Vercel에 배포한 Next.js
  앱을 기준으로 도메인 속성 인증, 사이트맵 제출, 측정 ID 연결까지 클로드 코드에 시킬 말과 함께 순서대로 정리했습니다.
category: MARKETING
tags:
  - SEO
  - GA4
  - 바이브코딩
  - 마케팅 실무
publishedAt: '2026-08-25T00:00:00.000Z'
highlights:
  - 알리기 전에 서치콘솔과 GA4부터 붙입니다. 나중에 붙이면 그 전 방문은 어디에도 남지 않습니다.
  - '커스텀 도메인이 있으면 도메인 속성으로, vercel.app 주소뿐이면 URL 접두어 속성으로 등록합니다.'
quiz:
  - question: 클로드 코드로 만든 앱을 my-app.vercel.app 주소로만 배포한 상태입니다. 서치콘솔에 어떤 방식으로 등록해야 할까요?
    options:
      - URL 접두어 속성을 만들고 Next.js metadata의 verification 필드로 HTML 태그를 넣는다
      - 도메인 속성을 만들고 vercel.app의 DNS에 TXT 레코드를 넣는다
      - GA4만 설치하면 서치콘솔은 자동으로 등록된다
    correctIndex: 0
    explanation: >-
      도메인 속성은 DNS 레코드로만 인증할 수 있는데, vercel.app 도메인의 DNS는 Vercel이 관리하므로 직접 레코드를 넣을
      수 없습니다. 이 경우 URL 접두어 속성을 만들고 홈페이지 head에 인증 메타태그를 넣는 방식을 씁니다. Next.js에서는 루트
      레이아웃 metadata의 verification.google 값 하나로 그 태그가 출력됩니다.
metaTitle: 클로드 코드로 만든 웹앱 서치콘솔 등록과 GA4 설치 순서 (Vercel 기준)
metaDescription: >-
  서치콘솔 등록과 GA4 설치는 클로드 코드로 만든 웹앱을 알리기 전에 먼저 해 두는 두 가지 준비입니다. Vercel에 배포한 Next.js
  앱 기준으로 도메인 속성 인증, 사이트맵 제출, 측정 ID 연결을 클로드 코드에 시킬 말과 함께 담았습니다.
ogTitle: '클로드 코드로 만든 웹앱, 알리기 전에 서치콘솔 등록과 GA4 설치부터 (Vercel 기준)'
ogDescription: >-
  Vercel에 배포한 Next.js 앱에 서치콘솔 도메인 속성 인증, 사이트맵 제출, GA4 측정 ID 연결을 붙이는 순서와 클로드 코드에
  시킬 말을 정리했습니다.
ogImage: /og/claude-code-app-search-console-ga4-vercel.png
---

서치콘솔 등록과 GA4 설치는 클로드 코드로 만든 웹앱을 알리기 전에 먼저 해 두는 두 가지 준비입니다. 하나는 구글이 내 사이트를 알게 하는 일이고, 다른 하나는 누가 얼마나 왔는지 세는 일입니다. 2026년 8월 기준 공식 문서를 근거로, Vercel에 배포한 Next.js 앱에서 두 가지를 붙이는 순서를 정리했습니다.

클로드 코드로 앱을 만들어 Vercel에 올리면 `my-app.vercel.app` 같은 주소가 바로 생깁니다. 지인에게 링크를 보내면 반응이 오고, 쓰레드에 올리면 며칠은 조회가 붙습니다. 여기까지는 대부분 압니다. 모르는 것은 그다음인데, 구글은 아직 이 주소를 모르고 있고, 링크를 눌러 들어온 사람이 몇 명인지도 어디에 기록되지 않습니다. 그래서 몇 주 뒤에 "알렸는데 반응이 없다"는 판단을 근거 없이 내리게 됩니다.

가게를 열고 나서 지도 앱에 등록하지 않으면 길 가던 사람만 들어오듯, 웹앱도 서치콘솔에 등록하지 않으면 링크를 직접 받은 사람만 들어옵니다. 출입문에 카운터를 달지 않으면 하루 몇 명이 왔는지 감으로만 말하게 되듯, GA4가 없으면 방문 수를 짐작으로만 말하게 됩니다. 두 가지를 알리기 전에 붙여 두면 첫 방문부터 기록이 남습니다.

## 서치콘솔과 GA4가 각각 맡는 일

두 도구는 이름이 함께 불려서 하나처럼 보이지만 하는 일이 다릅니다. 지도 등록과 출입문 카운터가 다른 일이듯 나눠서 보면 무엇을 먼저 할지 정하기 쉽습니다.

| 구분 | 서치콘솔(Search Console) | GA4(Google Analytics 4) |
|---|---|---|
| 하는 일 | 구글 검색이 내 사이트를 어떻게 보는지 알려 줍니다 | 사이트에 들어온 방문자가 무엇을 했는지 기록합니다 |
| 붙이는 방법 | 소유권 인증 한 번 | 페이지마다 태그 삽입 |
| 보이는 것 | 노출, 클릭, 순위, 색인 상태 | 방문, 유입 경로, 페이지 이동, 이벤트 |
| 없으면 생기는 일 | 검색에 언제 잡힐지 알 수 없습니다 | 알린 뒤에도 몇 명이 왔는지 알 수 없습니다 |

쉽게 말해 **서치콘솔은 검색에서 들어오기 전을 보고, GA4는 들어온 뒤를 봅니다.** 이 글의 순서는 서치콘솔이 먼저입니다. 서치콘솔 인증 방식 가운데 GA4 태그를 쓰는 것도 있어서 GA4를 먼저 붙이는 순서도 가능하지만, 이 글은 도메인 인증을 쓰므로 어느 쪽을 먼저 해도 결과가 같습니다.

## 준비물: Vercel 프로젝트와 도메인 상태

시작하기 전에 확인할 것은 하나입니다. 지금 앱이 어떤 주소로 열리는지입니다. Vercel은 모든 배포에 `vercel.app` 주소를 주고, 원하면 자기 도메인을 붙일 수 있습니다. 이 차이가 서치콘솔 등록 방식을 정합니다.

| 상태 | 예 | 서치콘솔 등록 방식 |
|---|---|---|
| 기본 주소만 있음 | `my-app.vercel.app` | URL 접두어 속성 + HTML 태그 |
| 커스텀 도메인 연결 | `myapp.kr` | 도메인 속성 + DNS TXT 레코드 |

커스텀 도메인을 붙이는 방법은 Vercel 대시보드에서 프로젝트를 고른 뒤 Settings의 Domains에서 Add Domain을 누르는 것입니다. 도메인을 넣으면 Vercel이 도메인 등록업체에 넣어야 할 DNS 레코드를 알려 줍니다. 루트 도메인(`myapp.kr`)은 A 레코드, 하위 도메인(`www.myapp.kr`)은 CNAME 레코드입니다.

![Vercel 프로젝트 도메인 설정 화면. 도메인 등록업체에 넣어야 할 A 레코드의 Type, Name, Value가 표로 표시되고 Invalid Configuration 상태가 붙어 있다](/images/insights/claude-code-app-search-console-ga4-vercel/vercel-domain-dns-records.png)

위 화면은 Vercel 공식 문서에 실린 도메인 설정 화면입니다. 등록업체 쪽 DNS가 아직 맞지 않아 Invalid Configuration이 떠 있고, 그 아래에 넣어야 할 레코드 값이 그대로 보입니다. 이 값을 등록업체 관리 화면에 옮겨 적으면 됩니다. Vercel 문서는 레코드가 적용되기까지 시간이 걸릴 수 있다고 안내합니다.

도메인이 아직 없다면 `vercel.app` 주소로도 서치콘솔과 GA4를 전부 붙일 수 있습니다. 다만 나중에 도메인을 붙이면 서치콘솔 속성을 새로 만들어야 하므로, 도메인을 살 계획이 있으면 도메인 연결부터 하는 편이 일을 한 번으로 줄입니다.

## 서치콘솔 등록: 도메인 속성과 DNS TXT 레코드

서치콘솔의 속성 종류는 두 가지이고, 구글 공식 문서가 차이를 이렇게 설명합니다. 도메인 속성은 `example.com` 하나로 http와 https, www 유무, 모든 하위 도메인을 전부 포함합니다. URL 접두어 속성은 `https://example.com/`처럼 적은 접두어와 정확히 일치하는 주소만 다룹니다.

지도에 건물 전체를 등록하는 것과 한 층만 등록하는 것의 차이와 같아서, 커스텀 도메인이 있으면 도메인 속성을 고릅니다. 나중에 `blog.myapp.kr`을 만들어도 따로 등록할 필요가 없습니다. 도메인 속성의 인증 방법은 DNS 레코드 하나뿐입니다.

절차는 세 단계입니다.

1. 서치콘솔에서 속성 추가를 누르고 왼쪽 도메인 칸에 `myapp.kr`을 넣습니다
2. 구글이 `google-site-verification=...`으로 시작하는 TXT 레코드 값을 보여 줍니다
3. 그 값을 도메인의 DNS에 TXT 레코드로 넣고 확인을 누릅니다

3단계에서 어디에 넣을지가 사람마다 다릅니다. 도메인을 산 곳의 네임서버를 그대로 쓰고 있으면 그 등록업체의 DNS 관리 화면에 넣습니다. 도메인의 네임서버를 Vercel로 옮겼다면 Vercel 대시보드의 Domains에서 해당 도메인을 열고 DNS 레코드를 추가합니다.

![Vercel 대시보드의 DNS Records 추가 폼. Name, Type, Value, TTL, Comment 입력란과 Add 버튼이 있다](/images/insights/claude-code-app-search-console-ga4-vercel/vercel-dns-record-form.png)

위 화면이 Vercel 공식 문서에 실린 DNS 레코드 추가 폼입니다. 서치콘솔용 TXT 레코드는 Name을 `@`로, Type을 `TXT`로, Value에 구글이 준 문자열을 그대로 넣습니다. Vercel 문서는 레코드가 완전히 반영되기까지 최대 24시간이 걸릴 수 있다고 적고 있는데, 실제로는 몇 분 안에 인증되는 사례가 많습니다. 확인 버튼을 눌러 실패하면 잠시 뒤 다시 누르면 됩니다.

구글 문서에는 TXT 대신 CNAME을 써야 하는 경우도 적혀 있습니다. 판단 기준은 그 도메인에 CNAME 레코드가 이미 있는지 여부이고, 구글 Admin Toolbox의 Dig 화면에서 확인하면 됩니다.

![구글 Admin Toolbox의 Dig 화면. example.com을 넣고 CNAME 탭을 선택했을 때 Record not found가 표시된 모습](/images/insights/claude-code-app-search-console-ga4-vercel/google-admin-toolbox-dig-cname.png)

위 화면처럼 Record not found가 나오면 TXT 레코드를 씁니다. Vercel에 붙인 루트 도메인은 A 레코드를 쓰기 때문에 대개 이 경우에 해당합니다.

인증이 끝난 뒤에 주의할 점이 하나 있습니다. 구글 문서는 인증 후에도 DNS 레코드를 지우지 말라고 명시합니다. 서치콘솔이 주기적으로 레코드를 다시 확인하고, 없어지면 권한이 만료되기 때문입니다.

## vercel.app 주소뿐일 때: URL 접두어 속성과 메타태그

커스텀 도메인이 없으면 도메인 속성을 쓸 수 없습니다. `vercel.app`의 DNS는 Vercel이 관리하는 것이라 거기에 내 레코드를 넣을 방법이 없기 때문입니다. 이때는 URL 접두어 속성을 만들고 `https://my-app.vercel.app/`을 넣습니다.

URL 접두어 속성의 인증 방법은 여럿인데, Next.js 앱에서는 HTML 태그 방식이 코드 한 줄로 끝납니다. 구글 문서가 요구하는 조건은 세 가지입니다.

- 태그가 홈페이지의 `<head>` 안에 있어야 합니다
- 홈페이지가 로그인 없이 열려야 합니다
- 파일의 처음 2MB 안에 태그가 있어야 합니다

Next.js는 이 태그를 직접 적지 않아도 됩니다. 루트 레이아웃의 `metadata`에 `verification.google` 값을 넣으면 `<meta name="google-site-verification">` 태그가 `<head>`에 출력된다고 Next.js 공식 문서가 설명합니다. 준이아빠블로그도 같은 metadata 필드에 네이버 인증 값을 넣어 쓰고 있습니다.

클로드 코드에 시킬 말은 이 정도면 됩니다. 서치콘솔이 보여 준 메타태그의 `content` 값만 바꿔 넣습니다.

```text
app/layout.tsx의 metadata에 verification 필드를 추가해 줘.
google 값은 "여기에_서치콘솔이_준_content_값"이야.
다른 metadata 필드는 건드리지 말고, 수정 후 npm run build가 통과하는지 확인해 줘.
```

배포가 끝나면 브라우저에서 홈페이지 소스 보기로 태그가 들어갔는지 확인한 뒤 서치콘솔에서 확인을 누릅니다. 이 태그도 인증 후에 지우면 안 됩니다.

## 사이트맵 제출과 색인 요청

인증이 끝나면 서치콘솔은 내 사이트가 있다는 것까지만 압니다. 어떤 페이지가 있는지는 사이트맵으로 알려 줍니다. 지도에 가게를 등록한 뒤 메뉴판을 함께 올리는 것과 같아서, 없어도 크롤러가 언젠가 찾아오지만 있으면 빠릅니다.

Next.js는 `app/sitemap.ts` 파일 하나로 사이트맵을 만듭니다. 이 파일이 URL 배열을 반환하면 `/sitemap.xml` 주소로 XML이 제공된다고 공식 문서에 적혀 있습니다. 함께 `app/robots.ts`를 만들어 사이트맵 주소를 적어 두면 크롤러가 사이트맵을 먼저 찾습니다.

```text
app/sitemap.ts와 app/robots.ts를 만들어 줘.
사이트 주소는 https://myapp.kr 이고, 페이지 목록은 app 디렉터리의 page.tsx를 기준으로 뽑아 줘.
robots.ts에는 sitemap 주소를 넣고, 모든 경로를 허용해 줘.
만든 뒤 로컬에서 /sitemap.xml과 /robots.txt가 열리는지 확인해 줘.
```

배포 후 서치콘솔의 Sitemaps 보고서에서 `https://myapp.kr/sitemap.xml`을 넣고 제출합니다. 구글 문서에 따르면 제출 즉시 가져오기를 시도하고, 상태가 Success이면 구글이 읽은 것입니다. 다만 같은 문서가 사이트맵에 적힌 URL을 실제로 크롤링하는 데는 시간이 걸린다고 안내합니다.

페이지가 몇 개 안 되는 초기에는 URL 검사 도구도 씁니다. 주소를 넣고 색인 생성 요청을 누르면 대기열에 올라갑니다. 어떤 상태인지 읽는 방법은 [색인 상태 확인하는 법](/class/seo-fundamentals/how-to-check-indexing-status)에, JS 파일이 많은 앱에서 색인이 잘 안 잡힐 때의 대응은 [크롤링됨, 현재 색인이 생성되지 않음 대응](/insights/search-console-js-crawled-not-indexed)에 정리해 두었습니다.

## GA4 설치: 측정 ID와 @next/third-parties

이제 출입문에 카운터를 답니다. GA4 설치는 구글 쪽에서 측정 ID를 받는 일과 앱 쪽에 태그를 넣는 일, 두 가지로 나뉩니다.

구글 쪽 절차는 공식 문서 기준으로 이렇습니다.

1. GA4 관리에서 속성을 만듭니다. 시간대와 통화를 한국으로 고릅니다
2. 데이터 스트림 추가에서 웹을 고르고 사이트 주소를 넣습니다. 향상된 측정은 켜 둡니다
3. 스트림 세부정보에서 `G-`로 시작하는 측정 ID를 복사합니다

앱 쪽은 Next.js 공식 문서가 안내하는 `@next/third-parties` 패키지를 씁니다. 루트 레이아웃에 `GoogleAnalytics` 컴포넌트를 넣고 `gaId`에 측정 ID를 주면 모든 페이지에 태그가 들어갑니다. 공식 문서는 이 패키지가 아직 실험 단계라 최신 버전으로 설치하라고 적고 있는데, GA 설치 용도로 쓰는 사례가 많습니다.

```text
@next/third-parties 최신 버전을 설치하고, app/layout.tsx에
GoogleAnalytics 컴포넌트를 gaId="G-여기에_측정_ID"로 넣어 줘.
공식 문서 예시처럼 </body> 뒤, </html> 안쪽에 두고, 빌드가 통과하는지 확인해 줘.
```

한 가지 확인할 설정이 있습니다. Next.js 앱은 페이지를 옮길 때 브라우저가 새로고침 없이 주소만 바꾸는데, GA4가 이것을 페이지뷰로 세려면 향상된 측정 안에서 브라우저 기록 이벤트로 페이지 변경을 세는 항목이 켜져 있어야 합니다. Next.js 문서가 이 항목을 확인하라고 따로 적어 둔 이유입니다. 기본값은 켜짐이지만 한 번 열어 보면 됩니다.

설치가 됐는지는 GA4 실시간 보고서에서 봅니다. 배포된 주소를 직접 열어 두고 실시간 보고서에 방문자 1명이 잡히면 끝입니다. 구글 문서는 데이터 수집이 시작되기까지 최대 30분이 걸릴 수 있다고 안내하므로, 바로 안 보여도 잠시 기다립니다.

이미 GTM(Google Tag Manager)을 쓰고 있다면 GA4를 컴포넌트로 따로 넣지 말고 GTM 안에서 GA4 태그를 만드는 편이 낫다고 Next.js 문서도 권합니다. 준이아빠블로그는 GTM 방식을 씁니다. 처음 만든 앱이라면 GA4 컴포넌트 하나로 시작하고, 버튼 클릭 같은 이벤트를 세고 싶어질 때 GTM으로 옮겨도 늦지 않습니다.

## 알리기 전에 확인하는 목록

세 가지가 붙었으면 링크를 보내기 전에 아래를 한 번 봅니다. 전부 5분 안에 끝나는 확인입니다.

- 서치콘솔 속성이 인증됨 상태이고, 인증에 쓴 DNS 레코드나 메타태그가 그대로 있습니다
- Sitemaps 보고서에서 사이트맵 상태가 Success입니다
- 대표 페이지 두세 개를 URL 검사로 넣고 색인 생성을 요청했습니다
- GA4 실시간 보고서에 내 방문이 잡힙니다
- 쓰레드나 커뮤니티에 올릴 링크에 `?utm_source=threads` 같은 표시를 붙였습니다

마지막 항목은 GA4가 유입 경로를 나눠 보여 주게 하는 준비입니다. 붙이지 않으면 쓰레드에서 온 사람과 카카오톡에서 온 사람이 한 묶음으로 보입니다.

이렇게 두면 알린 뒤 일주일이 지났을 때 근거를 갖고 말할 수 있습니다. 검색에는 아직 안 잡히는지, 링크로는 몇 명이 왔는지, 어느 채널에서 온 사람이 다른 페이지까지 봤는지가 남습니다. 방문이 늘지 않을 때 무엇을 봐야 하는지는 [블로그 글이 구글 검색에 노출되지 않는 이유](/insights/search-visibility-diagnosis-guide)에서 이어집니다.

## 자주 묻는 질문

### vercel.app 주소로도 서치콘솔에 등록할 수 있나요?

됩니다. 다만 도메인 속성이 아니라 URL 접두어 속성으로 등록하고, 인증은 HTML 메타태그로 합니다. 도메인 속성은 DNS 레코드로만 인증하는데 `vercel.app`의 DNS에는 내 레코드를 넣을 수 없기 때문입니다. 나중에 커스텀 도메인을 붙이면 그 도메인으로 속성을 새로 만들어야 하고, 이전 `vercel.app` 속성의 데이터는 새 속성으로 합쳐지지 않습니다.

### GA4 대신 Vercel의 Web Analytics만 써도 되나요?

방문 수와 인기 페이지만 보려면 그것으로도 충분합니다. 다만 유입 경로를 채널별로 나눠 보거나, 버튼 클릭과 가입 같은 이벤트를 세거나, 서치콘솔과 데이터를 연결하려면 GA4가 필요합니다. 알린 뒤 "어디서 온 사람이 가입했는지"를 보고 싶어지는 시점이 오는데, 그때 GA4가 없으면 그 전 기록이 없습니다.

### 등록했는데 검색에 나오지 않습니다. 얼마나 기다려야 하나요?

새 사이트는 며칠에서 몇 주가 걸리는 것이 보통입니다. 구글 문서도 사이트맵의 URL을 크롤링하는 데 시간이 걸린다고만 적고 기간을 못 박지 않습니다. 기다리는 동안 볼 것은 서치콘솔의 페이지 색인 보고서입니다. 색인된 페이지 수가 0에서 올라가기 시작하면 정상이고, 몇 주가 지나도 0이면 robots.txt나 noindex 설정이 막고 있는지 확인합니다.

## 3줄 요약

- 서치콘솔 등록과 GA4 설치는 만든 웹앱을 알리기 전에 먼저 붙이는 준비입니다. 나중에 붙이면 그 전 방문은 어디에도 남지 않습니다.
- 커스텀 도메인이 있으면 도메인 속성을 DNS TXT 레코드로 인증하고, `vercel.app` 주소뿐이면 URL 접두어 속성을 Next.js metadata의 verification 값으로 인증합니다.
- GA4는 측정 ID를 받아 `@next/third-parties`의 GoogleAnalytics 컴포넌트에 넣으면 되고, 실시간 보고서에 내 방문이 잡히면 설치가 끝난 것입니다.

## Sources

- [사이트 소유권 확인 (Search Console 고객센터)](https://support.google.com/webmasters/answer/9008080?hl=ko)
- [속성 추가 및 유형 (Search Console 고객센터)](https://support.google.com/webmasters/answer/34592?hl=ko)
- [사이트맵 제출 (Search Console 고객센터)](https://support.google.com/webmasters/answer/7451001?hl=ko)
- [웹사이트에 Google 애널리틱스 설정하기 (Google 애널리틱스 고객센터)](https://support.google.com/analytics/answer/9304153?hl=ko)
- [Third-party libraries: Google Analytics (Next.js 공식 문서)](https://nextjs.org/docs/app/guides/third-party-libraries)
- [generateMetadata: verification (Next.js 공식 문서)](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [sitemap.xml (Next.js 공식 문서)](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap)
- [Adding & Configuring a Custom Domain (Vercel 공식 문서)](https://vercel.com/docs/domains/working-with-domains/add-a-domain)
- [Managing DNS Records (Vercel 공식 문서)](https://vercel.com/docs/domains/managing-dns-records)
