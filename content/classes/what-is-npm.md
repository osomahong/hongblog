---
slug: what-is-npm
term: 패키지 매니저 (npm)
definition: >-
  다른 개발자가 만든 코드(패키지)를 쉽게 설치하고 관리할 수 있는 도구입니다. AI가 프로젝트를 만들면 가장 먼저 'npm install'을
  실행하라고 하는데, 이것이 바로 필요한 패키지를 설치하는 명령어입니다.
category: AI_TECH
tags:
  - 바이브코딩
  - JavaScript
publishedAt: '2026-02-18T15:19:53.479Z'
courseSlug: vibe-coding-basics
orderInCourse: 4
aliases:
  - npm
  - yarn
  - pnpm
  - Node Package Manager
  - 패키지 관리자
relatedTerms:
  - what-is-terminal-cli
  - what-is-git
difficulty: BEGINNER
quiz:
  - options:
      - 터미널에서 npm install을 실행하면 package.json 기반으로 다시 설치된다
      - GitHub에서 node_modules를 다시 다운로드해야 한다
      - 프로젝트를 처음부터 다시 만들어야 한다
      - node_modules는 한번 삭제하면 복구할 수 없다
    question: 프로젝트의 node_modules 폴더를 실수로 삭제했습니다. 프로젝트를 다시 실행하려면 어떻게 해야 할까요?
    explanation: >-
      package.json에 필요한 패키지 목록이 기록되어 있으므로, npm install을 실행하면 이 목록을 보고 모든 패키지를 다시
      설치합니다. node_modules는 언제든 재생성 가능하기 때문에 GitHub에도 올리지 않습니다.
    correctIndex: 0
metaTitle: 'npm 뜻: 패키지 매니저가 하는 일과 기본 개념'
metaDescription: 'npm은 다른 개발자가 만든 코드 패키지를 설치하고 관리하는 패키지 매니저입니다. 패키지 설치의 원리와 AI 코딩에서 자주 만나는 상황을 정리했습니다.'
ogImage: /og/what-is-npm.png
summary3:
  - 'npm은 다른 개발자가 만든 패키지를 내 프로젝트로 가져와 설치하고 관리하는 도구입니다.'
  - 'package.json은 필요한 패키지 목록이고 package-lock.json은 정확한 버전을 기록해 다른 컴퓨터에서도 같은 버전이 깔리게 합니다.'
  - 'node_modules는 npm install로 다시 만들어지므로 GitHub에 올리지 않고 package-lock.json은 함께 올립니다.'
---

## 🤔 혹시 이런 경험 있나요?

AI가 만들어준 프로젝트를 열었는데, 첫 번째로 하라는 말이 항상 같습니다.

> "터미널에서 `npm install`을 실행하세요."

시키는 대로 하면 뭔가 잔뜩 설치되고, `node_modules`라는 엄청나게 큰 폴더가 생깁니다. 도대체 뭘 설치한 건지, 왜 이렇게 많은 건지, 이 폴더를 지워도 되는 건지 궁금한 적 없나요?

## 🔑 패키지 매니저, 한마디로 뭘까요?

**패키지 매니저(npm)**는 다른 개발자가 만든 코드를 내 프로젝트에 쉽게 가져다 쓸 수 있게 해주는 **도구**입니다.

**npm**은 **Node Package Manager**의 약자로, JavaScript/Node.js 생태계에서 가장 많이 사용되는 패키지 매니저입니다. **패키지(Package)**란 누군가가 특정 기능을 미리 만들어놓은 코드 묶음을 말합니다.

## 🧱 레고 블록과 같습니다

집을 짓는다고 생각해보세요.

- **모든 걸 직접 만들기**: 벽돌을 직접 굽고, 시멘트를 직접 만들고, 창문 유리를 직접 자르기
- **기성품 활용하기**: 건축 자재점에서 벽돌, 시멘트, 창문을 사 와서 조립하기

프로그래밍도 마찬가지입니다. 로그인 기능, 날짜 계산, 이미지 최적화 같은 기능을 처음부터 만들 필요 없이, **이미 잘 만들어진 패키지를 가져다 쓰면** 됩니다.

npm은 이 **건축 자재점** 역할을 합니다. 전 세계 개발자가 만든 200만 개 이상의 패키지가 등록되어 있고, 명령어 한 줄로 설치할 수 있습니다.

## 📦 핵심 파일과 폴더 이해하기

### 1. package.json - 재료 목록표
프로젝트에 필요한 패키지 목록이 적혀있는 파일입니다.

```json
{
  "name": "my-project",
  "dependencies": {
    "next": "14.0.0",
    "react": "18.2.0",
    "openai": "4.0.0"
  },
  "devDependencies": {
    "typescript": "5.0.0",
    "eslint": "8.0.0"
  }
}
```

- **dependencies**: 프로젝트 실행에 필요한 패키지 (재료)
- **devDependencies**: 개발할 때만 필요한 패키지 (공구)

### 2. node_modules - 실제 재료 보관 창고
`npm install`을 실행하면 생기는 폴더입니다. package.json에 적힌 패키지들이 여기에 설치됩니다.

- 용량이 매우 큽니다 (수백 MB인 경우도 있습니다)
- **GitHub에 올리면 안 됩니다** (.gitignore에 포함되어 있어야 합니다)
- 삭제해도 `npm install` 하면 다시 생깁니다

### 3. package-lock.json - 정확한 버전 기록표
설치된 패키지의 정확한 버전을 기록하는 파일입니다. 다른 컴퓨터에서도 동일한 버전의 패키지가 설치되도록 보장합니다.

- **삭제하지 마세요.**
- **GitHub에 함께 올려야 합니다.**

## 🛠️ 바이브코딩에서 자주 쓰는 npm 명령어

```bash
npm install              # package.json의 모든 패키지 설치
npm install axios        # axios 패키지 추가 설치
npm run dev              # 개발 서버 실행
npm run build            # 배포용 빌드
npm uninstall axios      # axios 패키지 제거
```

> **팁**: AI가 "이 패키지를 설치하세요"라고 하면, `npm install 패키지이름`을 터미널에 입력하면 됩니다.

## ⚡ npm vs yarn vs pnpm

패키지 매니저는 npm 말고도 여러 가지가 있습니다.

| 패키지 매니저 | 특징 | 설치 명령어 |
|-------------|------|----------|
| **npm** | Node.js에 기본 포함, 가장 보편적 | `npm install` |
| **yarn** | Facebook이 만듦, npm보다 빠름 | `yarn install` |
| **pnpm** | 디스크 절약, 가장 빠름 | `pnpm install` |

기능은 거의 같습니다. AI가 `yarn add`라고 하면 yarn을, `pnpm add`라고 하면 pnpm을 쓰면 됩니다. 프로젝트에서 사용하는 것 하나를 골라 일관되게 사용하는 것이 중요합니다.

## ⚠️ 바이브코딩할 때 주의할 점

**1. "npm install 안 돼요" 대처법**
- Node.js가 설치되어 있는지 확인하세요. (`node --version`으로 확인)
- 올바른 폴더에서 실행하고 있는지 확인하세요. (package.json이 있는 폴더)

**2. node_modules를 GitHub에 올리지 마세요**
- `.gitignore`에 `node_modules`가 포함되어 있는지 확인하세요.
- 다른 사람은 `npm install`로 직접 설치하면 됩니다.

**3. 패키지 버전 충돌에 주의하세요**
- AI가 최신 패키지를 설치하라고 했는데 에러가 난다면, 다른 패키지와 버전이 맞지 않는 경우가 많습니다.
- 에러 메시지를 AI에게 보여주면 호환되는 버전을 알려줄 것입니다.

## 📋 3줄 요약

1. npm은 다른 개발자가 만든 패키지를 내 프로젝트로 가져와 설치하고 관리하는 도구입니다.

2. package.json은 필요한 패키지 목록이고 package-lock.json은 정확한 버전을 기록해 다른 컴퓨터에서도 같은 버전이 깔리게 합니다.

3. node_modules는 npm install로 다시 만들어지므로 GitHub에 올리지 않고 package-lock.json은 함께 올립니다.

명령어를 입력하는 창은 [터미널과 CLI](/class/vibe-coding-basics/what-is-terminal-cli) 클래스에서, 코드 이력 관리는 [Git](/class/vibe-coding-basics/what-is-git) 클래스에서 이어집니다.

## 참고 자료

- [npm 공식 문서, About npm](https://docs.npmjs.com/about-npm)
