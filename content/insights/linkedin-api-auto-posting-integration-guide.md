---
slug: linkedin-api-auto-posting-integration-guide
title: >-
  블로그 관리 페이지에서 LinkedIn에 바로 글을 올리는 기능을 만들었습니다: LinkedIn API 연동 과정을 처음부터 끝까지
  정리합니다
excerpt: >-
  블로그에서 AI로 LinkedIn 소개글을 생성한 뒤, 복사-붙여넣기 없이 바로 게시할 수 있도록 LinkedIn Posts API를 연동한
  과정을 OAuth 인증부터 실제 게시까지 단계별로 정리했습니다.
category: AI_TECH
tags:
  - API
  - 자동화
  - AI
quiz:
  - options:
      - 사용자를 LinkedIn 인증 페이지로 리디렉트하여 권한 승인을 받는다
      - LinkedIn API에 Client ID와 Secret을 직접 전송하여 토큰을 요청한다
      - DB에 저장된 기존 토큰을 확인하고 유효하면 그대로 사용한다
      - LinkedIn Developer App에서 토큰을 수동으로 복사해 온다
    question: LinkedIn OAuth 2.0 인증에서 액세스 토큰을 발급받기 위해 가장 먼저 해야 하는 단계는 무엇인가요?
    explanation: >-
      OAuth 2.0의 3-legged 인증 흐름에서는 반드시 사용자가 먼저 LinkedIn 인증 페이지에서 직접 권한을 승인해야
      합니다. 승인 후 받은 인증 코드(authorization code)를 서버에서 액세스 토큰으로 교환하는 것이 올바른 순서입니다.
    correctIndex: 0
metaTitle: LinkedIn API 연동으로 자동 포스팅 만들기 | OAuth부터 게시까지
metaDescription: >-
  LinkedIn Posts API를 Next.js 블로그에 연동하여 관리 페이지에서 바로 게시하는 기능을 만든 과정을 OAuth 인증, 토큰
  관리, API 호출까지 단계별로 정리했습니다.
ogImage: /og/linkedin-api-auto-posting-integration-guide.png
ogTitle: 'LinkedIn에 자동으로 글 올리기: API 연동 전 과정 공개'
ogDescription: 복사-붙여넣기 없이 블로그 관리 페이지에서 LinkedIn에 바로 게시하는 기능을 만든 과정을 정리했습니다.
summary3:
  - '블로그 관리 페이지에서 링크드인으로 바로 올리려면 OAuth 인증과 토큰 저장, API 호출 세 단계가 필요합니다.'
  - '만든 것은 토큰을 담을 DB 테이블 하나와 서비스 파일 하나, 인증 시작과 콜백, 상태 조회, 게시를 맡는 API 라우트 넷입니다.'
  - '복사해서 링크드인에 붙여 넣던 다섯 단계가 버튼 한 번으로 줄고 3,000자 제한도 실시간으로 확인됩니다.'
---

## 복사-붙여넣기가 싫었습니다

이 블로그에는 관리 페이지가 있습니다. 글을 쓰고, 수정하고, [배포](/class/vibe-coding-basics/what-is-deployment) 상태를 관리하는 곳입니다. 여기에 AI로 LinkedIn 소개글을 자동 생성하는 기능도 만들어 뒀습니다.

그런데 생성된 글을 LinkedIn에 올리려면 매번 같은 과정을 반복해야 했습니다. 모달에서 텍스트를 복사하고, LinkedIn을 열고, 새 게시물을 만들고, 붙여넣고, 게시 버튼을 누르는 5단계입니다.

글 하나에 30초밖에 안 걸리는 작업이지만, 반복될수록 거슬립니다. "여기서 바로 올릴 수 없나?"라는 생각이 들었고, LinkedIn API를 연동하기로 했습니다.

이 글에서는 LinkedIn Posts API를 Next.js 프로젝트에 연동한 전체 과정을 정리합니다. [OAuth](/class/vibe-coding-basics/what-is-authentication) 인증이 처음이어도 따라갈 수 있도록, 각 단계에서 무엇이 왜 필요한지를 중심으로 설명합니다.

## 완성된 모습부터 보겠습니다

구현이 완료된 후의 흐름은 이렇습니다.

1. 관리 페이지에서 포스트를 선택합니다
2. "LinkedIn Summary" 버튼을 누르면 AI가 소개글을 생성합니다
3. 모달에서 내용을 편집할 수 있습니다
4. "Post to LinkedIn" 버튼을 누르면 LinkedIn 피드에 바로 게시됩니다

기존에는 3번에서 끝이었습니다. 복사 버튼만 있었고, 텍스트는 읽기 전용이었습니다. 이제는 편집도 가능하고, 글자 수 카운터(LinkedIn 3,000자 제한)도 표시되며, 연결 상태에 따라 게시 버튼이 자동으로 나타납니다.

변경 전후를 비교하면 이렇습니다.

| 항목 | 변경 전 | 변경 후 |
|------|--------|--------|
| 소개글 편집 | 불가 (읽기 전용) | 가능 |
| 게시 방식 | 복사 → LinkedIn 수동 붙여넣기 | 버튼 한 번으로 자동 게시 |
| 글자 수 확인 | 불가 | 실시간 카운터 (3,000자 제한) |
| LinkedIn 연결 | 없음 | OAuth 연결 상태 표시 |

## 전체 구조를 먼저 이해합니다

코드를 쓰기 전에, 전체 흐름을 머릿속에 그리는 것이 중요합니다. LinkedIn API 연동은 크게 세 단계로 나뉩니다.

**1단계: OAuth 인증**: 사용자가 LinkedIn에 로그인하고, "이 앱이 내 계정에 글을 올려도 됩니다"라고 허락하는 과정입니다.

**2단계: 토큰 저장**: 허락의 증거로 받은 "액세스 토큰"을 DB에 저장합니다. 이 토큰이 있어야 API를 호출할 수 있습니다.

**3단계: 게시**: 저장된 토큰을 사용해 LinkedIn Posts API를 호출하고, 텍스트를 게시합니다.

이 세 단계를 구현하기 위해 만들어야 하는 것은 다음과 같습니다.

- **DB 테이블** 1개: 토큰을 저장할 곳
- **서비스 레이어** 1개: LinkedIn 관련 로직을 모아둔 파일
- **API 라우트** 4개: 인증 시작, 콜백 처리, 상태 조회, 게시
- **UI 수정**: 기존 모달에 버튼과 상태 표시 추가

## OAuth 2.0이 뭔가요

LinkedIn API를 사용하려면 OAuth 2.0 인증을 거쳐야 합니다. 처음 들으면 복잡하게 느껴지지만, 핵심은 단순합니다.

일상에서 비유하면 이렇습니다. 아파트 택배 보관함에서 택배를 찾으려면 비밀번호가 필요합니다. 그런데 이 비밀번호는 아파트 관리실(LinkedIn)이 발급합니다. 본인(사용자)이 관리실에 가서 "이 사람(우리 앱)이 내 보관함에 접근해도 됩니다"라고 동의하면, 관리실이 임시 비밀번호(액세스 토큰)를 발급합니다.

기술적으로 정리하면 이런 흐름입니다.

1. 우리 앱이 사용자를 LinkedIn 인증 페이지로 보냅니다
2. 사용자가 LinkedIn에서 "허용"을 누릅니다
3. LinkedIn이 우리 앱에 "인증 코드"를 전달합니다
4. 우리 앱이 인증 코드를 "액세스 토큰"으로 교환합니다
5. 이 토큰으로 API를 호출합니다

왜 인증 코드를 한 번 더 토큰으로 교환하는 걸까요? 보안 때문입니다. 인증 코드는 URL에 노출되지만 짧은 시간 안에 만료됩니다. 토큰 교환은 서버 간 통신으로 이루어지므로 외부에 노출되지 않습니다.

## 사전 준비: LinkedIn Developer App 등록

코드를 작성하기 전에 LinkedIn Developer 포털에서 앱을 등록해야 합니다.

1. LinkedIn Developer Apps 페이지에서 앱을 생성합니다
2. Products 탭에서 두 가지를 추가합니다: "Share on LinkedIn"과 "Sign In with LinkedIn using OpenID Connect"
3. Auth 탭에서 Client ID와 Client Secret을 확인합니다
4. 같은 탭에서 Redirect URL을 등록합니다

Redirect URL은 OAuth 인증이 완료된 후 LinkedIn이 사용자를 돌려보내는 주소입니다. 개발 환경과 프로덕션 환경 각각 등록해야 합니다.

```
개발: http://localhost:3000/api/linkedin/callback
프로덕션: https://yourdomain.com/api/linkedin/callback
```

발급받은 Client ID와 Secret은 `.env.local` 파일에 저장합니다.

```
LINKEDIN_CLIENT_ID=your_client_id
LINKEDIN_CLIENT_SECRET=your_client_secret
LINKEDIN_REDIRECT_URI=http://localhost:3000/api/linkedin/callback
```

## 1단계: DB 테이블 만들기

토큰을 어딘가에 저장해야 합니다. 환경 변수에 넣을 수도 있지만, 토큰은 갱신될 때마다 값이 바뀌기 때문에 DB가 적합합니다.

이 프로젝트는 Drizzle ORM을 사용하고 있으므로, 스키마 파일에 테이블 정의를 추가합니다.

```typescript
export const linkedinTokens = pgTable("linkedin_tokens", {
  id: serial("id").primaryKey(),
  personUrn: varchar("person_urn", { length: 255 }).notNull(),
  accessToken: text("access_token").notNull(),
  refreshToken: text("refresh_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at").notNull(),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scopes: varchar("scopes", { length: 500 }),
  linkedinName: varchar("linkedin_name", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
```

각 컬럼의 역할을 짚어보겠습니다.

- **personUrn**: LinkedIn 사용자 고유 식별자입니다. `urn:li:person:abc123` 형태로, 게시물을 올릴 때 "누구의 이름으로 올릴지"를 지정하는 데 사용됩니다
- **accessToken**: API를 호출할 때 매번 보내야 하는 인증 키입니다. 60일 후 만료됩니다
- **refreshToken**: 액세스 토큰이 만료되었을 때 새 토큰을 발급받는 데 사용됩니다. 재로그인 없이 갱신할 수 있게 해주는 장치입니다
- **accessTokenExpiresAt**: 토큰 만료 시점입니다. 이 시간이 지나면 토큰이 무효화됩니다

이 프로젝트는 1인 관리자용이므로 테이블에 항상 1행만 유지합니다. 새 인증이 들어오면 기존 행을 삭제하고 새로 삽입합니다.

테이블 정의를 추가한 후 `npm run db:push`로 실제 DB에 반영합니다.

## 2단계: 서비스 레이어 만들기

서비스 레이어는 LinkedIn 관련 로직을 한 곳에 모아둔 파일입니다. API 라우트에서 직접 LinkedIn 로직을 쓰면 코드가 뒤섞이기 때문에, 별도 파일로 분리합니다.

이 파일에 들어가는 함수는 6개입니다.

### 인증 URL 생성

```typescript
export function getAuthorizationUrl(state: string): string {
  const authClient = getAuthClient();
  return authClient.generateMemberAuthorizationUrl(
    ["openid", "profile", "w_member_social"],
    state
  );
}
```

`openid`와 `profile`은 사용자 정보를 가져오기 위한 권한이고, `w_member_social`은 게시물을 올리기 위한 권한입니다. `state` 파라미터는 CSRF 공격을 방지하는 보안 장치입니다.

### 토큰 교환

LinkedIn이 보내준 인증 코드를 액세스 토큰으로 바꾸는 함수입니다.

```typescript
export async function exchangeCodeForTokens(code: string) {
  const authClient = getAuthClient();
  return authClient.exchangeAuthCodeForAccessToken(code);
}
```

`linkedin-api-client` 라이브러리가 HTTP 요청을 대신 처리해 주므로, 코드는 간단합니다.

### 프로필 조회

LinkedIn 사용자의 이름과 고유 ID(Person URN)를 가져옵니다.

```typescript
export async function getLinkedInProfile(accessToken: string) {
  const response = await fetch("https://api.linkedin.com/v2/userinfo", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = await response.json();
  return {
    personUrn: `urn:li:person:${data.sub}`,
    name: data.name || "LinkedIn User",
  };
}
```

OpenID Connect의 `/userinfo` 엔드포인트를 사용합니다. `data.sub`이 사용자의 고유 ID이고, 이것을 `urn:li:person:` 형태로 조합하면 LinkedIn API에서 사용할 수 있는 Person URN이 됩니다.

### 토큰 자동 갱신

이 함수가 가장 중요합니다. 게시 요청이 들어올 때마다 토큰이 유효한지 확인하고, 만료가 임박하면 자동으로 갱신합니다.

```typescript
export async function getValidAccessToken() {
  const tokens = await db.select().from(linkedinTokens).limit(1);
  if (tokens.length === 0) return null;

  const token = tokens[0];
  const now = new Date();
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;

  // 만료까지 7일 이상 남았으면 그대로 사용
  if (token.accessTokenExpiresAt.getTime() - now.getTime() > sevenDaysMs) {
    return { accessToken: token.accessToken, personUrn: token.personUrn };
  }

  // 리프레시 토큰으로 갱신 시도
  if (token.refreshToken && token.refreshTokenExpiresAt > now) {
    const refreshed = await authClient.exchangeRefreshTokenForAccessToken(
      token.refreshToken
    );
    // DB 업데이트 후 새 토큰 반환
  }

  return null; // 갱신 불가 시
}
```

"만료 7일 전"을 기준으로 잡은 이유는, 갱신 시점을 여유 있게 가져가기 위해서입니다. 딱 만료 직전에 갱신하면 타이밍 이슈로 실패할 수 있습니다.

### 게시 함수

```typescript
export async function postToLinkedIn(text: string) {
  const tokenData = await getValidAccessToken();
  if (!tokenData) {
    return { success: false, error: "LinkedIn 연결이 필요합니다." };
  }

  const response = await restliClient.create({
    resourcePath: "/posts",
    entity: {
      author: tokenData.personUrn,
      commentary: text,
      visibility: "PUBLIC",
      distribution: {
        feedDistribution: "MAIN_FEED",
        targetEntities: [],
        thirdPartyDistributionChannels: [],
      },
      lifecycleState: "PUBLISHED",
      isReshareDisabledByAuthor: false,
    },
    accessToken: tokenData.accessToken,
    versionString: "202401",
  });

  return { success: true, postUrn: response.createdEntityId };
}
```

LinkedIn Posts API의 `/posts` 엔드포인트를 호출합니다. `commentary`가 게시물 본문이고, `visibility: "PUBLIC"`은 누구나 볼 수 있는 공개 게시물이라는 뜻입니다. `versionString`은 API 버전으로, LinkedIn은 날짜 기반 버전 관리를 사용합니다.

## 3단계: API 라우트 만들기

서비스 레이어의 함수들을 HTTP 요청으로 호출할 수 있게 API 라우트를 만듭니다. Next.js의 App Router 방식을 사용합니다.

총 4개의 라우트가 필요합니다.

### /api/linkedin/authorize

OAuth 인증을 시작하는 라우트입니다. 관리자 인증을 확인한 후 LinkedIn 인증 페이지로 리디렉트합니다.

```typescript
export async function GET() {
  // 관리자 인증 확인
  const session = await getServerSession();
  if (!session || session.user?.email !== allowedEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const state = crypto.randomBytes(16).toString("hex");
  const authUrl = getAuthorizationUrl(state);
  return NextResponse.redirect(authUrl);
}
```

### /api/linkedin/callback

LinkedIn이 인증 코드와 함께 사용자를 돌려보내는 라우트입니다. 여기서 토큰 교환과 DB 저장이 이루어집니다.

```typescript
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const error = request.nextUrl.searchParams.get("error");

  if (error || !code) {
    return NextResponse.redirect("/hong?linkedin=error");
  }

  const tokenData = await exchangeCodeForTokens(code);
  const profile = await getLinkedInProfile(tokenData.access_token);
  await saveTokens({ ...tokenData, ...profile });

  return NextResponse.redirect("/hong?linkedin=connected");
}
```

인증 성공 시 `/hong?linkedin=connected`로 리디렉트합니다. 관리 페이지에서 이 쿼리 파라미터를 감지해 "연결 완료" 알림을 표시합니다.

### /api/linkedin/status

현재 LinkedIn 연결 상태를 반환합니다. [프론트엔드](/class/vibe-coding-basics/what-is-frontend-backend)에서 페이지 로드 시 호출하여 UI를 업데이트합니다.

### /api/linkedin/post

실제 게시를 수행합니다. 텍스트를 받아 3,000자 제한을 검증한 후 LinkedIn에 게시합니다.

모든 라우트는 기존 관리 페이지와 동일한 인증 패턴(`getServerSession()` + `ALLOWED_GOOGLE_ID`)으로 보호됩니다.

## 4단계: UI 수정

<div style="overflow-x:auto;margin:24px 0">
<div style="max-width:420px;margin:0 auto;border:3px solid #000;background:#fff">
<div style="background:#000;color:#fff;padding:10px 14px;font-weight:800;font-size:13px;display:flex;justify-content:space-between;gap:8px"><span>LinkedIn Summary</span><span style="background:#FFD700;color:#000;padding:1px 8px;font-size:11px;font-weight:800">연결됨: 홍OO</span></div>
<div style="padding:14px">
<div style="border:2px solid #000;background:#F3F3F3;padding:10px;font-size:12px;line-height:1.7;min-height:70px">AI가 생성한 소개글이 여기에 표시되고, 게시 전에 자유롭게 편집할 수 있습니다.</div>
<div style="text-align:right;font-family:monospace;font-size:11px;margin-top:6px">1,240 / 3,000자</div>
<div style="display:flex;gap:8px;margin-top:10px">
<div style="flex:1;border:2px solid #000;background:#fff;padding:8px;text-align:center;font-size:12px;font-weight:700">복사</div>
<div style="flex:1;border:2px solid #000;background:#FFD700;padding:8px;text-align:center;font-size:12px;font-weight:800">Post to LinkedIn</div>
</div>
</div>
<div style="border-top:2px solid #000;background:#F3F3F3;padding:8px 14px;font-size:11px;line-height:1.6">3,000자 초과 시 카운터가 빨간색으로 바뀌고 게시 버튼이 비활성화됩니다.</div>
</div>
</div>

기존 LinkedIn Summary 모달을 개선합니다. 변경 사항은 네 가지입니다.

### 편집 가능한 텍스트 영역

기존에는 `readOnly` 속성이 있어서 생성된 텍스트를 수정할 수 없었습니다. 이 속성을 제거하고 `onChange` 핸들러를 추가하여 게시 전에 내용을 편집할 수 있게 했습니다.

### 글자 수 카운터

LinkedIn은 게시물에 3,000자 제한이 있습니다. 실시간으로 글자 수를 표시하고, 초과 시 빨간색으로 경고합니다. 초과 상태에서는 게시 버튼이 비활성화됩니다.

### 연결 상태 표시

모달 헤더에 LinkedIn 연결 상태와 연결된 계정 이름을 표시합니다. 연결되지 않은 상태에서는 "Connect LinkedIn" 버튼이, 연결된 상태에서는 "Post to LinkedIn" 버튼이 나타납니다.

### 게시 결과 피드백

게시 성공 시 LinkedIn 피드로 가는 링크를, 실패 시 에러 메시지와 재연결 안내를 표시합니다.

## 토큰 관리 전략

구현에서 가장 신경 쓴 부분은 토큰 관리입니다. LinkedIn 액세스 토큰의 수명은 60일입니다. 60일이 지나면 토큰이 무효화되고, API 호출이 실패합니다.

이 문제를 해결하기 위해 세 가지 전략을 적용했습니다.

**자동 갱신**: 만료 7일 전에 리프레시 토큰으로 자동 갱신을 시도합니다. 게시 요청이 들어올 때마다 토큰 유효성을 확인하므로, 사용자가 신경 쓸 필요가 없습니다.

**단계적 폴백**: 갱신에 실패하면, 아직 만료 전이라면 기존 토큰을 그대로 사용합니다. 완전히 만료된 경우에만 재인증을 안내합니다.

**상태 표시**: 프론트엔드에서 연결 상태를 실시간으로 보여줍니다. 토큰이 만료되면 "재연결 필요" 상태가 표시되고, 재연결 버튼이 나타납니다.

## 주의할 점

### LinkedIn API 제한

LinkedIn은 API 사용에 Rate Limit을 적용합니다. 정확한 수치는 공개되지 않지만, 하루에 과도한 게시를 하면 스팸으로 감지될 수 있습니다. 일반적인 사용 패턴(하루 1-3회 게시)에서는 문제가 없습니다.

### 앱 등록 시 Company Page

LinkedIn Developer App을 등록할 때 Company Page를 연결하라는 안내가 나옵니다. 개인 프로필에 게시하는 것이 목적이라면, Individual Developer용 기본 Company Page를 선택하면 됩니다. Company Page 연결은 앱 식별용이며, 게시 대상을 제한하는 것이 아닙니다.

### 3,000자 제한

LinkedIn 게시물의 최대 길이는 3,000자입니다. AI가 생성한 소개글이 이 제한을 넘는 경우는 드물지만, 편집 과정에서 내용을 추가하다가 초과할 수 있으므로 실시간 글자 수 표시가 필요합니다.

## 정리

LinkedIn API 연동의 전체 흐름을 다시 정리합니다.

1. **LinkedIn Developer App 등록**: Client ID/Secret 발급, Redirect URL 설정
2. **DB 테이블 추가**: 토큰 저장용 테이블 1개
3. **서비스 레이어**: OAuth, 토큰 관리, 게시 함수를 한 파일에 구현
4. **API 라우트 4개**: 인증 시작, 콜백, 상태, 게시
5. **UI 수정**: 편집, 글자 수, 게시 버튼, 상태 표시

OAuth 2.0이 처음에는 복잡해 보이지만, 핵심은 "사용자 동의 → 인증 코드 → 토큰 교환" 세 단계입니다. 이 흐름만 이해하면 LinkedIn뿐 아니라 Google, Facebook, X(Twitter) 등 대부분의 소셜 미디어 API에 동일한 패턴을 적용할 수 있습니다.

자동화할 수 있는 반복 작업이 보이면, 그것이 API 연동의 출발점입니다.
