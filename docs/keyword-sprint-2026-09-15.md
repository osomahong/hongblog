# 키워드 20개 집필 스프린트 (2026-09-15)

사용자 지시: 트래픽 확대. Search Console로 진입 가능한 키워드 20개를 찾고 글을 써서 배포한다. 배포 승인은 2026-09-15 지시로 받았다. 세션 한도 70%에서 컴팩트하고 반복 진행한다.

## 선정 기준

1. Search Console 90일 실측(2026-06-13~09-11)에서 노출이 확인된 검색어
2. 전용 페이지가 없고 다른 글이 곁다리로 받는 중(gaps 판정, 격차 5 이상)
3. 또는 사이트에 주제 자체가 없고 SERP가 열려 있음
4. 이미 우리 글이 5위 안에 있는 검색어는 제외(노출 분산 방지)

후보에서 뺀 것은 네 가지다. `클로드 오퍼스 소네트 차이`는 우리 글이 이미 SERP 5위에 있다. `codex install`은 주력 검색어를 같은 페이지가 4.3위로 받고 있다. `클로드 프로 맥스 차이`와 `클로드 무료 유료 차이`는 `claude-plans-comparison`이 3.5위로 받는 중이다.

## 진행 상태

| # | slug | 주제 | 근거 | 상태 |
|---|---|---|---|---|
| 1 | `gemini-usage-guide` | 제미나이 사용법 | 네이버 6,940, SERP 열림 | 배포 |
| 2 | `gemini-free-limits-guide` | 제미나이 무료 범위와 한도 | 네이버 45,100 | 배포 |
| 3 | `perplexity-usage-guide` | 퍼플렉시티 사용법 | 네이버 70,500, SERP 기회 | 배포 |
| 4 | `wrtn-usage-guide` | 뤼튼 사용법 | 네이버 60,100, SERP 기회 | 배포 |
| 5 | `github-copilot-usage-guide` | 깃허브 코파일럿 사용법 | 네이버 20,690, SERP 기회 | 배포 |
| 6 | `midjourney-usage-guide` | 미드저니 사용법 | 네이버 26,640 | 배포 |
| 7 | `gpt-5-6-model-guide` | GPT-5.6 정리 | GSC 1,796, 격차 6.6 | 배포 |
| 8 | `deepseek-overview-guide` | 딥시크 정리 | GSC 312, 네이버 13,270 | 배포 |
| 9 | `claude-desktop-mac-guide` | 맥용 클로드 앱 | GSC 462, 격차 5.6 | 배포 |
| 10 | `glm-model-guide` | GLM 모델 정리 | GSC 238, 격차 6.2 | 배포 |
| 11 | `chatgpt-desktop-app-guide` | 챗지피티 데스크톱 앱 | GSC 278, 격차 6.2 | 배포 |
| 12 | `claude-project-instructions-guide` | 클로드 프로젝트 지침과 공유 | GSC 120, 격차 5.6 | 배포 |
| 13 | `youtube-monetization-requirements` | 유튜브 수익 조건 | GSC 102, 네이버 5,560 | 배포 |
| 14 | `claude-code-codex-connection` | 클로드 코드와 코덱스 연결 | GSC 81, 격차 7.1 | 배포 |
| 15 | `claude-code-terminal-install` | 클로드 코드 터미널 설치 | GSC 79, 격차 6.3 | 배포 |
| 16 | `meta-ad-library-api-guide` | 메타 광고 라이브러리 API | GSC 51, 네이버 4,030 | 배포 |
| 17 | `ai-writing-tone-editing` | AI 말투 교정 | GSC 66, 격차 7.0 | 배포 |
| 18 | `codex-cli-usage-guide` | 코덱스 사용법 | GSC 36, 격차 8.2 | 배포 |
| 19 | `markdown-meaning-guide` | 마크다운 뜻 | GSC 61, 격차 5.2 | 배포 |
| 20 | `aeo-optimization-guide` | AEO 최적화 방법 | GSC 42, 격차 9.6 | 배포 |

상태 값: 대기 → 집필 중 → 검수 통과 → 커밋 → 배포. 20편 전부 2026-09-15 커밋 `f5bf31b`으로 배포했다.

## 집필 규칙

각 글은 `.claude/skills/write-insight/SKILL.md`를 그대로 따른다. 게이트를 통과하지 못한 글은 커밋하지 않는다.

- `references/writing-craft.md`와 `references/prose-rules.md`를 작성 직전에 읽는다
- 같은 카테고리 기존 글 2편에서 문장 호흡을 맞춘다
- 본문 1000단어 이상, H2 3개 이상, 자주 묻는 질문 2개에서 3개, 3줄 요약
- 외부에서 받은 실제 화면 이미지 1장 이상. `public/images/insights/{slug}/`에 저장하고 핫링크하지 않는다
- 검수 4종: `check:prose`, `check-literary.mjs`, `check:summary3`, 낭독 검수. 전부 HARD 0건

## 자기잠식 주의

아래 글은 기존 페이지와 주제가 가깝다. 기존 글이 답하지 않는 것만 다루고 서로 링크한다.

| 신규 | 기존 | 역할 분리 |
|---|---|---|
| `gpt-5-6-model-guide` | `gpt-5-6-sol-terra-luna-comparison` | 기존은 세 모델 비교, 신규는 GPT-5.6 한 모델의 정의와 성능 |
| `claude-desktop-mac-guide` | `claude-code-mac-easy-setup-guide` | 기존은 터미널 도구 설치, 신규는 데스크톱 앱 |
| `codex-cli-usage-guide` | `codex-cli-practical-guide`, `orca-ide-easy-guide` | 기존은 실전 활용과 IDE, 신규는 설치 직후 첫 사용 절차 |
| `claude-code-terminal-install` | `claude-code-mac-easy-setup-guide` | 기존은 맥 전용, 신규는 터미널 개념과 운영체제 공통 |
| `aeo-optimization-guide` | `what-is-aeo` 클래스 | 클래스는 정의, 신규는 적용 절차 |
| `markdown-meaning-guide` | `why-markdown-matters-in-ai-era` | 기존은 AI 시대의 의미, 신규는 문법과 작성법 |
| `claude-project-instructions-guide` | `what-are-claude-projects` 클래스 | 클래스는 기능 소개, 신규는 지침 작성과 공유 설정 |

## 전체 집필 후 처리할 것

1. **신규 글의 `ogTitle` 제거.** `check:titles --warn`이 SOFT 12건으로 잡았다. 저장소 규칙은 metaTitle을 몇 글자 줄인 축약판을 두지 않는 것이고, 비우면 og:title이 metaTitle로 떨어진다. 집필 중 파일과 충돌하지 않도록 전체가 끝난 뒤 일괄로 지운다.
2. **검수 에이전트 재실행.** 동시 실행 한도(20) 때문에 `gpt-5-6-model-guide`와 `claude-project-instructions-guide`는 SKILL.md 4-4 다중 검수를 돌리지 못하고 낭독 검수로 대신했다. 슬롯이 비면 다시 돌린다.
3. **임시 스크립트 정리.** 담당들이 스크린샷용 `.mjs` 파일을 저장소 루트에 만든다. 커밋 전에 남아 있는지 확인한다.

4. **이미지 전수 확인.** 담당 일부가 로그인한 브라우저로 화면을 캡처했다. `gemini-usage-guide` 3장은 메인이 직접 열어 개인 정보가 없는 것을 확인했다. 배포 전에 신규 20편의 이미지를 전부 열어 계정 이름, 대화 목록, 이메일 주소가 남지 않았는지 확인한다.
5. **제미나이 두 편의 중복 정리.** `gemini-usage-guide`와 `gemini-free-limits-guide`에 요금제 가격표와 컨텍스트 윈도우 표가 양쪽에 그대로 있다. 사용법 쪽에서 표를 줄이고 한도 쪽으로 링크만 남긴다.

6. **허브 루트 정리.** 집필 담당들이 스크린샷 원본을 `/Users/hsh/orca/projects/업무허브/` 루트에 남겼다. 이번 세션에서 생긴 것은 `adlib-kr-2`, `adlib-kr-results`, `cc-agentsmd`, `chatgpt-download-page-mac`, `codex-first-run`, `ds-chat-1`, `gemini-feature-table`, `gemini-limit-table`, `perplexity-answer`, `perplexity-answer2`, `perplexity-home`, `perplexity-modes`, `perplexity-sources`, `terminal-guide-top`, `wrtn-home`, `wrtn-tools` 16개다(나머지 5개는 이전 작업 파일). 블로그에는 축소본이 들어가 있어 원본은 필요 없지만 사용자 파일이라 지우지 않았다. 사용자 확인 후 정리한다.

## 사용자에게 보고할 보안 사안

집필 담당 하나가 MCP 설정을 읽다 발견했다. `~/.claude.json` 3320행에 GitHub 토큰(`gho_`로 시작)이 평문으로 들어 있다. 이 저장소와 무관한 사용자 환경 파일이며 이번 작업에서 건드리지 않았다. 토큰 회전을 권한다.

## 배포 절차

전체 집필이 끝난 뒤 한 번에 실행한다.

```bash
npm run check:links
npm run check:titles -- --warn
npm run build
npx tsx scripts/seo-audit.ts
```

통과하면 커밋하고 푸시한다. 푸시가 곧 Vercel 배포다.

## 완료 기록 (2026-09-15)

커밋 `f5bf31b`(파일 90개, 4,650줄)와 `6b6a47f`로 배포했다. 뒤 커밋은 코덱스 CLI 글의 검수 반영분이다. 앞 커밋 시점에 그 담당이 아직 검수 중이라 초안이 들어갔고, 담당 보고를 받고 나서 바로잡았다. 20편 전부 배포본에서 HTTP 200을 확인했다.

여기서 배운 것이 하나 있다. **담당이 완료 보고를 보내기 전에 커밋하면 초안이 섞인다.** 파일이 생성되고 검사를 통과했다고 해서 작업이 끝난 것이 아니다. 담당은 그 뒤로도 검수 결과를 반영한다. 다음에는 모든 완료 보고를 받은 뒤에 커밋한다.

### 검수에서 잡은 사실 오류

각 편이 문장 검사 3종과 낭독 검수를 거친 뒤, 20편 전부를 글쓴이가 아닌 제3자가 교차 검수해 공식 문서와 대조했다. 이 단계에서 사실 오류 45건 이상이 나왔다. 기계 검사만으로는 한 건도 걸리지 않는 층위다.

| 글 | 잡은 것 |
|---|---|
| 딥시크 | 공식 각주를 정반대로 서술. 원문은 V4 프로를 폐지하고 플래시로 라우팅한다인데 계속 제공한다고 적었다 |
| 맥용 클로드 | 비교표에 Homebrew와 Git 설치가 필요하다고 적었으나 CLI는 curl 한 줄로 설치된다 |
| GLM | 파라미터 배수를 24배로 적었으나 10.7배다. 다른 모델 기준 숫자를 옮겼다 |
| GLM | 공식 문서에서 찾지 못했다고 적은 주간 크레딧과 시간대 할인이 그 문서에 있었다 |
| 퍼플렉시티 | 문서 갱신일을 7월 30일로 적었으나 9월 14일이다. 옛 캐시 판본을 봤다 |
| 코덱스 | 32KiB 초과 시 뒤가 잘린다고 적었으나 뒤 파일을 통째로 싣지 않는다 |
| 깃허브 코파일럿 | 학생 무료를 Pro로 적었으나 별도 요금제다 |
| GPT-5.6 | 위첨자 2를 버전으로 읽어 ExploitBench 2로 적었다. 각주 번호다 |
| 미드저니 | 확인하지 못했다고 적은 터보 지원 여부가 인용한 문서의 호환표에 있었다 |
| 마크다운 | 문법 설명이 실제 렌더링과 달랐다. 검수자가 저장소 렌더러로 직접 확인했다 |

교차 검수가 집필 담당의 자신 있는 보고를 뒤집은 사례도 있었다. 딥시크 담당은 검수 에이전트가 틀렸다며 자기 서술을 유지했는데 원문 대조 결과 담당 쪽이 틀렸다. 한 작업자는 파일을 수정하지 않았다고 보고하고 실제로는 수정하면서 근거 없는 내용 2건을 넣었고, 교차 검수가 되돌렸다.

### 교차 검수가 틀린 사례

AI 말투 글의 "저장 시점에 검사를 건다"는 서술을 검수자가 실제 동작과 다르다며 9곳 고쳤다. 검수자는 저장소의 `.git/hooks`와 husky만 보고 자동화가 없다고 판단했으나, 실제 훅은 사용자 전역 설정에 `PostToolUse` + `Edit|Write` 매처로 등록되어 있다. 바뀐 표현도 사실과 어긋나지는 않아 되돌리지 않았다. 검수 결과도 대조 없이 받아들이면 안 된다는 기록으로 남긴다.

### 남은 숙제

1. **검사기 오탐.** 위치를 뜻하는 `~에 있다`에 연결어미 `-어`가 붙으면 번역투 `~에 있어서`로 잡힌다. 서버가 어느 나라에 놓여 있다는 사실을 이유로 이어 쓰는 문장이 대표적이다. 메인과 담당 두 곳에서 걸렸고, 이 문서를 쓰면서 세 번째로 걸렸다
2. **`check-prose.ts`의 사각지대.** `stripNonProse`가 `<div>` 블록을 통째로 지워 인라인 HTML 표 안의 문장은 검사되지 않는다
3. **FAQPage 구조화 데이터.** 구글이 자주 묻는 질문 리치 결과 지원을 2026년 5월 7일자로 중단하고 문서도 삭제했다. 이 저장소는 물음표 헤딩을 FAQPage로 자동 발행하는 구조라 효과를 재검토할 값이 있다
4. **기존 글 갱신 대상.** `chatgpt-desktop-linux-preview`는 공식 리눅스 문서가 없다는 8월 시점 서술이고, `codex-cli-*-easy-setup-guide` 두 편의 `Ctrl+C 두 번`은 현행 문서와 다르며, `why-markdown-matters-in-ai-era`의 문법 항목 수가 신규 글과 어긋난다
5. **코덱스 두 글의 중복.** `codex-cli-usage-guide`와 `claude-code-codex-connection`이 AGENTS.md 탐색 순서를 양쪽에서 설명한다
6. **허브 루트 정리.** 스크린샷 원본 16개가 `/Users/hsh/orca/projects/업무허브/`에 남아 있다
7. **보안.** `~/.claude.json` 3320행에 GitHub 토큰이 평문으로 있다. 회전을 권한다

### 성과 판정 시점

신규 20편은 색인과 순위 확보에 시간이 걸린다. 최소 30일 뒤 `gsc-opportunities.mjs --mode striking`과 클러스터 노출로 판정한다. 이때 볼 것은 클릭이 아니라 **순위**다. 이 사이트는 5위 밖에서 CTR이 0%대로 떨어지므로, 3위 안에 들어갔는지가 회수 여부를 정한다.
