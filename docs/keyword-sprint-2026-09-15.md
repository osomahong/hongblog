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
| 1 | `gemini-usage-guide` | 제미나이 사용법 | 네이버 6,940, SERP 열림 | 검수 통과 |
| 2 | `gemini-free-limits-guide` | 제미나이 무료 범위와 한도 | 네이버 45,100 | 검수 통과 |
| 3 | `perplexity-usage-guide` | 퍼플렉시티 사용법 | 네이버 70,500, SERP 기회 | 검수 통과 |
| 4 | `wrtn-usage-guide` | 뤼튼 사용법 | 네이버 60,100, SERP 기회 | 검수 통과 |
| 5 | `github-copilot-usage-guide` | 깃허브 코파일럿 사용법 | 네이버 20,690, SERP 기회 | 검수 통과 |
| 6 | `midjourney-usage-guide` | 미드저니 사용법 | 네이버 26,640 | 집필 중 |
| 7 | `gpt-5-6-model-guide` | GPT-5.6 정리 | GSC 1,796, 격차 6.6 | 검수 통과 |
| 8 | `deepseek-overview-guide` | 딥시크 정리 | GSC 312, 네이버 13,270 | 집필 중 |
| 9 | `claude-desktop-mac-guide` | 맥용 클로드 앱 | GSC 462, 격차 5.6 | 집필 중 |
| 10 | `glm-model-guide` | GLM 모델 정리 | GSC 238, 격차 6.2 | 집필 중 |
| 11 | `chatgpt-desktop-app-guide` | 챗지피티 데스크톱 앱 | GSC 278, 격차 6.2 | 집필 중 |
| 12 | `claude-project-instructions-guide` | 클로드 프로젝트 지침과 공유 | GSC 120, 격차 5.6 | 검수 통과 |
| 13 | `youtube-monetization-requirements` | 유튜브 수익 조건 | GSC 102, 네이버 5,560 | 집필 중 |
| 14 | `claude-code-codex-connection` | 클로드 코드와 코덱스 연결 | GSC 81, 격차 7.1 | 집필 중 |
| 15 | `claude-code-terminal-install` | 클로드 코드 터미널 설치 | GSC 79, 격차 6.3 | 집필 중 |
| 16 | `meta-ad-library-api-guide` | 메타 광고 라이브러리 API | GSC 51, 네이버 4,030 | 집필 중 |
| 17 | `ai-writing-tone-editing` | AI 말투 교정 | GSC 66, 격차 7.0 | 집필 중 |
| 18 | `codex-cli-usage-guide` | 코덱스 사용법 | GSC 36, 격차 8.2 | 집필 중 |
| 19 | `markdown-meaning-guide` | 마크다운 뜻 | GSC 61, 격차 5.2 | 집필 중 |
| 20 | `aeo-optimization-guide` | AEO 최적화 방법 | GSC 42, 격차 9.6 | 집필 중 |

상태 값: 대기 → 집필 중 → 검수 통과 → 커밋 → 배포

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
