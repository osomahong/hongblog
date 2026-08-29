---
slug: what-is-env-variables
term: 환경 변수와 .env (Environment Variables)
definition: '프로그램이 실행될 때 참조하는 설정값으로, API 키나 비밀번호 같은 민감한 정보를 코드와 분리하여 안전하게 관리하는 방법입니다.'
category: AI_TECH
tags:
  - 바이브코딩
publishedAt: '2026-02-18T15:19:52.600Z'
updatedAt: '2026-07-23T00:00:00.000Z'
courseSlug: vibe-coding-basics
orderInCourse: 2
aliases:
  - 환경변수
  - Environment Variables
  - dotenv
  - .env 파일
relatedTerms:
  - what-is-terminal-cli
  - what-is-deployment
  - what-is-authentication
difficulty: BEGINNER
quiz:
  - options:
      - .gitignore 파일에 .env가 포함되어 있는지 확인한다
      - .env 파일의 내용을 코드 파일 안에 복사해둔다
      - API 키를 NEXT_PUBLIC_ 접두사를 붙여 저장한다
      - .env 파일 이름을 secrets.txt로 바꾼다
    question: 바이브코딩으로 프로젝트를 만들고 GitHub에 올리려고 합니다. 다음 중 반드시 확인해야 할 사항은 무엇일까요?
    explanation: >-
      .env 파일에는 API 키, 비밀번호 등 민감한 정보가 담겨 있습니다. .gitignore에 .env를 추가하지 않으면
      GitHub에 그대로 공개됩니다. 코드에 직접 복사하거나 NEXT_PUBLIC_ 접두사를 붙이면 오히려 브라우저에서 노출되므로
      위험합니다.
    correctIndex: 0
metaTitle: '환경 변수와 .env 파일 뜻: API 키를 안전하게 두는 방법'
metaDescription: '환경 변수는 API 키나 비밀번호 같은 민감한 정보를 코드와 분리해 저장하는 설정값입니다. .env 파일의 역할과 유출을 막는 관리 방법을 정리했습니다.'
ogImage: /og/what-is-env-variables.png
summary3:
  - '환경 변수는 프로그램이 실행될 때 읽는 설정값이고 API 키나 비밀번호를 코드에서 떼어 내 따로 두는 방법입니다.'
  - '값은 프로젝트 최상위의 .env 파일에 적고 이 파일을 .gitignore에 넣어야 저장소에 올라가지 않습니다.'
  - '공개 저장소에 키가 올라가면 봇이 몇 분 안에 찾아가므로 코드에서 지우는 것으로 끝내지 말고 즉시 재발급해 이전 키를 폐기합니다.'
---

## 🤔 혹시 이런 경험 있나요?

AI에게 "OpenAI API 연동해줘"라고 했더니, 코드를 만들어주면서 이렇게 말합니다.

> ".env 파일에 `OPENAI_API_KEY=sk-xxxxx`를 추가하세요."

.env 파일? 환경 변수? 왜 코드에 직접 안 넣고 따로 파일을 만들라는 걸까요?

이걸 제대로 이해하지 않으면, 바이브코딩으로 만든 프로젝트를 GitHub에 올렸다가 **API 키가 전 세계에 공개되는 사고**가 벌어질 수 있습니다. 실제로 매우 흔하게 일어나는 일입니다.

## 🔑 환경 변수, 한마디로 뭘까요?

**환경 변수(Environment Variable)**는 프로그램이 실행될 때 참조하는 **외부 설정값**입니다.

코드 안에 직접 적지 않고, **별도의 장소에 보관해두는 비밀 메모장** 같은 것입니다. 프로그램이 실행되면 "비밀 메모장에서 이 값을 읽어와"라고 요청하는 방식으로 작동합니다.

## 🔐 사물함 비밀번호와 같습니다

학교 사물함을 생각해보세요.

- **나쁜 방법**: 사물함 비밀번호를 사물함 문 앞에 포스트잇으로 붙여놓는 것 → 코드에 API 키를 직접 적는 것
- **좋은 방법**: 비밀번호를 자기 지갑에 따로 보관하는 것 → .env 파일에 API 키를 저장하는 것

두 경우 모두 사물함을 열 수 있지만, 포스트잇 방식은 **지나가는 누구나** 비밀번호를 볼 수 있습니다.

## 📄 .env 파일이란?

`.env`는 환경 변수를 모아놓은 파일입니다. 프로젝트 폴더의 최상위에 만들며, 형식은 매우 간단합니다.

```bash
# .env 파일 예시
OPENAI_API_KEY=sk-abc123def456
DATABASE_URL=postgresql://user:password@localhost:5432/mydb
NEXT_PUBLIC_SITE_URL=https://mysite.com
```

코드에서는 이렇게 사용합니다.

```javascript
// 코드에서 환경 변수 읽기
const apiKey = process.env.OPENAI_API_KEY;
```

이렇게 하면 코드에는 비밀번호가 전혀 남지 않습니다. `.env` 파일만 안전하게 관리하면 됩니다.

## ⚠️ .gitignore가 왜 중요한가요?

바이브코딩의 가장 흔한 보안 사고는 이런 순서로 일어납니다.

1. AI가 .env 파일을 만들라고 안내합니다.
2. API 키를 .env에 저장합니다.
3. `git add .` → `git commit` → `git push`를 합니다.
4. **.env 파일까지 GitHub에 올라갑니다.**
5. 전 세계 누구나 여러분의 API 키를 볼 수 있게 됩니다.

이걸 방지하는 것이 **`.gitignore`** 파일입니다.

```bash
# .gitignore 파일에 이 한 줄을 추가하세요
.env
```

이렇게 하면 git이 .env 파일을 무시해서, GitHub에 올라가지 않습니다.

> **중요**: 대부분의 프로젝트 템플릿(create-next-app 등)은 .gitignore에 .env가 이미 포함되어 있습니다. 하지만 **반드시 확인하세요.** AI가 만든 프로젝트에서 .gitignore가 빠져있는 경우도 있습니다.

## 🛠️ 바이브코딩에서 자주 만나는 환경 변수

| 환경 변수 | 용도 | 예시 |
|----------|------|------|
| `OPENAI_API_KEY` | AI API 호출 | `sk-abc123...` |
| `DATABASE_URL` | 데이터베이스 연결 | `postgresql://...` |
| `NEXTAUTH_SECRET` | 인증 암호화 키 | `my-secret-key` |
| `NEXT_PUBLIC_*` | 브라우저에서도 사용 가능한 값 | 사이트 URL 등 |

> **주의**: `NEXT_PUBLIC_`으로 시작하는 환경 변수는 브라우저에서도 보입니다. 여기에 비밀 키를 넣으면 안 됩니다.

## 💡 실수를 방지하는 체크리스트

바이브코딩으로 프로젝트를 만들 때, 이 체크리스트를 따르세요.

1. **프로젝트 시작 시**: `.env` 파일이 `.gitignore`에 포함되어 있는지 확인
2. **API 키 입력 시**: 코드 파일이 아닌 `.env` 파일에만 입력
3. **GitHub에 올리기 전**: `git status`로 .env가 추적 목록에 없는지 확인
4. **이미 올려버렸다면**: API 키를 즉시 재발급하고, 이전 키를 폐기
5. **배포할 때**: Vercel, Netlify 등 배포 플랫폼의 환경 변수 설정에 별도로 입력

## 🚀 배포할 때 환경 변수는 어떻게 하나요?

.env 파일은 여러분의 컴퓨터에만 존재합니다. 프로젝트를 Vercel이나 Netlify에 배포할 때는 **배포 플랫폼의 대시보드에서 환경 변수를 별도로 설정**해야 합니다.

- Vercel: Settings → Environment Variables
- Netlify: Site settings → Environment variables
- Railway: Variables 탭

이렇게 하면 코드에는 비밀이 없고, 실행 환경에서만 안전하게 값을 읽어올 수 있습니다.

## 💼 환경 변수가 문제의 원인이 되는 순간들

### 공개 저장소에 키를 올려버렸을 때

프로젝트를 GitHub 공개 저장소에 올린 직후, OpenAI에서 API 키가 노출됐다는 메일을 받는 경우가 실제로 있습니다. 봇들이 공개 저장소를 자동으로 훑으며 키를 수집하기 때문에, 노출된 키는 몇 분 안에 악용될 수 있습니다. 이때는 키를 코드에서 지우는 것으로는 부족하고, 즉시 재발급해서 이전 키를 폐기해야 합니다.

### 로컬에서는 되는데 배포하면 안 될 때

내 컴퓨터에서는 잘 돌아가던 AI 기능이 [배포](/class/vibe-coding-basics/what-is-deployment) 후에 "API key not found" 에러를 냅니다. `.env` 파일은 내 컴퓨터에만 있고 GitHub을 거쳐 배포 서버로 전달되지 않기 때문입니다. Vercel 대시보드의 환경 변수 설정에 같은 값을 등록하면 해결됩니다.

### 다른 컴퓨터에서 프로젝트를 열었을 때

회사 컴퓨터에서 작업하던 프로젝트를 집에서 내려받아 실행하면 바로 에러가 납니다. `.env`가 GitHub에 올라가지 않으니, 새 컴퓨터에는 환경 변수가 하나도 없는 상태이기 때문입니다. 그래서 실무에서는 값을 비운 `.env.example` 파일을 함께 올려서, 어떤 변수가 필요한지 목록만 공유하는 방식을 씁니다. [인증](/class/vibe-coding-basics/what-is-authentication)에 쓰이는 비밀 키들도 같은 방식으로 관리합니다.

## 📋 3줄 요약

1. 환경 변수는 프로그램이 실행될 때 읽는 설정값이고 API 키나 비밀번호를 코드에서 떼어 내 따로 두는 방법입니다.

2. 값은 프로젝트 최상위의 .env 파일에 적고 이 파일을 .gitignore에 넣어야 저장소에 올라가지 않습니다.

3. 공개 저장소에 키가 올라가면 봇이 몇 분 안에 찾아가므로 코드에서 지우는 것으로 끝내지 말고 즉시 재발급해 이전 키를 폐기합니다.
