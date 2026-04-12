---
slug: what-is-json-and-data-structures
term: JSON과 데이터 구조 (JSON & Data Structures)
definition: >-
  JSON은 데이터를 주고받을 때 가장 널리 쓰이는 텍스트 형식이고, 데이터 구조는 정보를 담는 그릇의 모양입니다. AI에게 원하는 결과물의
  형태를 알려줄 때 핵심이 되는 개념입니다.
category: AI_TECH
tags:
  - 바이브코딩
courseSlug: digital-basic
orderInCourse: 12
aliases:
  - JSON
  - 제이슨
  - 배열
  - Array
  - 객체
  - Object
  - 데이터 구조
relatedTerms:
  - what-is-rest-api
  - what-is-npm
  - what-is-env-variables
difficulty: BEGINNER
quiz:
  - options:
      - '{ name: "홍승협", age: 30 }'
      - '{ "name": "홍승협", "age": 30, }'
      - '{ "name": "홍승협", "age": 30 }'
      - '{ ''name'': ''홍승협'', ''age'': 30 }'
    question: 다음 JSON 중 올바른 형식은 무엇일까요?
    explanation: >-
      JSON은 세 가지 규칙이 엄격합니다. (1) 키는 반드시 큰따옴표로 감싸야 합니다. (2) 문자열도 큰따옴표만 허용됩니다
      (작은따옴표 불가). (3) 마지막 항목 뒤에 쉼표(trailing comma)를 넣으면 안 됩니다. 세 번째 보기만 이 규칙을 모두
      충족합니다.
    correctIndex: 2
metaTitle: JSON과 데이터 구조 (JSON & Data Structures)
metaDescription: >-
  JSON은 데이터를 주고받을 때 가장 널리 쓰이는 텍스트 형식이고, 데이터 구조는 정보를 담는 그릇의 모양입니다. AI에게 원하는 결과물의
  형태를 알려줄 때 핵심이 되는 개념이고 JSON은 시스템 간 데이터 교환의 표준 형식입니다.
ogImage: /og/what-is-json-and-data-structures.png
---

## 🤔 혹시 이런 경험 있나요?

AI에게 "사용자 정보를 저장하는 기능 만들어줘"라고 했더니 코드가 나왔는데, 중간에 `{ }`, `[ ]`, `"key": "value"` 같은 것들이 가득합니다. 또는 API 응답을 보니 알 수 없는 중괄호 덩어리가 쏟아집니다. 에러 메시지에는 "Unexpected token in JSON"이라고 나옵니다. 이런 상황을 이해하려면, 프로그래밍에서 데이터를 담는 방법인 **JSON과 데이터 구조**를 알아야 합니다.

## 📦 데이터 구조란?

**데이터 구조(Data Structure)**는 정보를 담는 그릇의 모양입니다.

실생활에서도 정보를 담는 방식이 다양합니다.

- **목록**: 장보기 리스트 — 순서대로 나열
- **사전**: 영어 사전 — 단어(키)로 뜻(값)을 찾기
- **표**: 엑셀 시트 — 행과 열로 구조화

프로그래밍에서도 똑같습니다. 어떤 그릇에 담느냐에 따라 데이터를 다루는 방식이 달라집니다.

## 🧱 프로그래밍의 기본 데이터 구조

바이브코딩에서 반드시 알아야 할 데이터 구조는 딱 세 가지입니다.

### 1. 변수 — 이름표 붙은 상자

하나의 값을 저장하는 가장 단순한 구조입니다.

```javascript
const name = "홍승협"          // 문자열 (텍스트)
const age = 30                 // 숫자
const isAdmin = true           // 불리언 (참/거짓)
```

### 2. 배열 (Array) — 번호가 매겨진 목록

여러 개의 값을 **순서대로** 나열한 것입니다. 대괄호 `[ ]`로 감쌉니다.

```javascript
const fruits = ["사과", "바나나", "딸기"]
//               [0]      [1]      [2]    ← 순서 번호(인덱스)는 0부터 시작

fruits[0]   // "사과"
fruits[2]   // "딸기"
```

**언제 쓸까요?** 태그 목록, 게시글 목록, 장바구니 상품 등 "여러 개를 순서대로 나열"할 때 사용합니다.

### 3. 객체 (Object) — 이름표가 붙은 서랍장

값에 **이름(키)**을 붙여서 저장하는 구조입니다. 중괄호 `{ }`로 감쌉니다.

```javascript
const user = {
  name: "홍승협",
  email: "hong@example.com",
  age: 30
}

user.name    // "홍승협"
user.email   // "hong@example.com"
```

**언제 쓸까요?** 사용자 정보, 설정 값, API 응답 등 "속성별로 구분되는 하나의 덩어리"를 표현할 때 사용합니다.

## 🔗 배열 + 객체 = 실전 데이터


![JSON에서 배열과 객체를 결합하여 실전 데이터를 표현하는 개념도](https://avqz4vnz10fk0ilw.public.blob.vercel-storage.com/illustrations/what-is-json-and-data-structures-0-1772120092846.png)

실제 프로젝트에서는 배열과 객체를 **조합**해서 사용합니다.

```javascript
// 게시글 목록: 객체의 배열
const posts = [
  {
    id: 1,
    title: "바이브코딩 시작하기",
    tags: ["AI", "코딩"],
    isPublished: true
  },
  {
    id: 2,
    title: "터미널 기초",
    tags: ["바이브코딩", "CLI"],
    isPublished: false
  }
]
```

이 구조를 읽을 수 있으면, AI가 작성하는 코드의 데이터 흐름을 따라갈 수 있습니다. `posts[0].title`은 "바이브코딩 시작하기"이고, `posts[1].tags[0]`은 "바이브코딩"입니다.

## 📄 JSON이란?

**JSON(JavaScript Object Notation)**은 위에서 본 객체와 배열 형식을 텍스트로 표현한 데이터 교환 형식입니다.

프로그래밍 언어마다 데이터를 표현하는 문법이 다릅니다. 하지만 서로 다른 시스템이 데이터를 주고받으려면 **공통 형식**이 필요합니다. 그 공통 형식이 JSON입니다.

```json
{
  "name": "홍승협",
  "age": 30,
  "skills": ["마케팅", "데이터분석", "바이브코딩"],
  "isAdmin": true
}
```

JavaScript 객체와 비슷하게 생겼지만, JSON만의 규칙이 있습니다.

| 규칙 | JavaScript 객체 | JSON |
|------|-----------------|------|
| 키 따옴표 | 없어도 됨 | **반드시 큰따옴표** |
| 문자열 따옴표 | 작은따옴표 가능 | **큰따옴표만 허용** |
| 마지막 쉼표 | 허용됨 | **허용 안 됨** |
| 주석 | 가능 | **불가능** |

이 규칙을 어기면 "Unexpected token in JSON" 에러가 발생합니다.

## 🌍 JSON은 어디에서 쓰일까요?

바이브코딩을 하면 JSON을 만나지 않는 날이 없습니다.

### 1. API 통신
서버와 브라우저가 데이터를 주고받을 때 JSON을 사용합니다.

```
브라우저 → 서버: "1번 사용자 정보 줘"
서버 → 브라우저: { "id": 1, "name": "홍승협" }  ← JSON
```

### 2. 설정 파일
프로젝트 설정의 상당수가 JSON 형식입니다.

```
package.json     → npm 패키지 설정
tsconfig.json    → TypeScript 설정
.eslintrc.json   → 코드 스타일 규칙
```

### 3. 데이터 저장
간단한 데이터를 파일로 저장할 때 JSON을 사용합니다.

```
scripts/data/my-post.json  → 블로그 글 데이터
config/settings.json       → 앱 설정
```

### 4. AI와의 소통
AI에게 "JSON 형식으로 응답해줘"라고 하면 구조화된 데이터를 받을 수 있습니다.

```
프롬프트: "과일 3개의 이름과 가격을 JSON 배열로 알려줘"

AI 응답:
[
  { "name": "사과", "price": 1500 },
  { "name": "바나나", "price": 3000 },
  { "name": "딸기", "price": 5000 }
]
```

## 🔧 JSON 다루기: 자주 쓰는 두 가지 변환

```javascript
// 객체 → JSON 문자열 (보낼 때)
const data = { name: "홍길동", age: 30 }
const jsonString = JSON.stringify(data)

![JSON 데이터 구조를 시각화하고, 이를 두 가지 방식으로 변환하는 과정을 보여주는 개념도](https://avqz4vnz10fk0ilw.public.blob.vercel-storage.com/illustrations/what-is-json-and-data-structures-1-1772120126920.png)

// '{"name":"홍길동","age":30}'

// JSON 문자열 → 객체 (받을 때)
const parsed = JSON.parse(jsonString)
// { name: "홍길동", age: 30 }
```

`JSON.stringify`는 데이터를 JSON 텍스트로 변환하고, `JSON.parse`는 JSON 텍스트를 다시 데이터로 복원합니다. API 통신에서 이 두 함수가 항상 등장합니다.

## ⚠️ 바이브코딩할 때 흔한 JSON 실수

**1. 마지막 쉼표 (Trailing Comma)**
```json
{
  "name": "홍길동",
  "age": 30,          ← 이 쉼표 때문에 에러!
}
```
JSON에서는 마지막 항목 뒤에 쉼표를 넣으면 안 됩니다.

**2. 작은따옴표 사용**
```json
{ 'name': '홍길동' }    ← 에러! JSON은 큰따옴표만 허용
{ "name": "홍길동" }    ← 올바른 형식
```

**3. undefined 사용**
```json
{ "data": undefined }    ← 에러! JSON에 undefined 없음
{ "data": null }         ← null은 허용
```

AI가 생성한 JSON에서 에러가 나면, 이 세 가지를 먼저 확인하세요.

## 💡 AI에게 데이터 구조를 잘 요청하는 방법

AI에게 데이터 형식을 명확히 알려주면 원하는 결과를 훨씬 정확하게 받을 수 있습니다.

**나쁜 예시:**
> "사용자 정보 저장하는 거 만들어줘"

**좋은 예시:**
> "사용자 정보를 이런 JSON 구조로 저장하고 싶어:
> ```json
> { "name": "string", "email": "string", "age": "number", "tags": ["string"] }
> ```
> 이 구조를 받아서 DB에 저장하는 API를 만들어줘"

원하는 데이터 구조를 JSON으로 보여주면 AI가 정확한 타입 정의, API 라우트, DB 스키마를 한 번에 만들어줍니다.

## 📋 30초 요약

1. **배열은 순서 있는 목록 `[ ]`, 객체는 이름표 붙은 데이터 `{ }`**입니다. 실전에서는 이 둘을 조합한 "객체의 배열"이 가장 많이 쓰입니다.

2. **JSON은 시스템 간 데이터 교환의 표준 형식**입니다. API 통신, 설정 파일, 데이터 저장에 모두 사용되며, 큰따옴표만 허용하고 마지막 쉼표를 쓸 수 없다는 규칙만 기억하세요.

3. **AI에게 원하는 결과물의 JSON 구조를 먼저 보여주면**, 코드 생성 정확도가 크게 올라갑니다. 데이터의 모양을 설명할 수 있는 것이 바이브코딩의 핵심 소통 능력입니다.
