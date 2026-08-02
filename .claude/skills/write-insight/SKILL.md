---
name: write-insight
description: 블로그 Insight 포스트를 주제 기반으로 리서치, 작성, 문체 검수, MD 파일 생성까지 수행하는 스킬. 담백체 톤, 명사형 소제목, 1000단어 이상, 3줄 요약, 외부 실제 예시 이미지를 강제한다. 문체 규칙은 references/prose-rules.md 한곳에 모아 두고 매 글에 적용한다. 초안이 완성되면 기계 검사 2종과 낭독 검수를 거쳐야 하며, 이 게이트를 통과하지 않은 글은 파일로 만들지 않는다. 사용자 승인 없이 커밋하거나 배포하지 않는다.
when_to_use: |
  (1) "블로그 글 써줘", "인사이트 포스트 작성", "이 주제로 인사이트 써줘",
  (2) /write-insight [주제] 직접 호출,
  (3) seo-topic-finder로 주제를 확정한 뒤 그 주제로 글을 쓸 때.
  기존 글 수정이나 클래스, 코스 작성에는 쓰지 않는다.
argument-hint: '[주제] [--category MARKETING|AI_TECH|DATA]'
model: opus
effort: high
allowed-tools: >-
  Bash(npm run check:prose *)
  Bash(node .claude/skills/prose-inspector/scripts/check-literary.mjs *)
  Bash(npx tsx scripts/generate-og.ts *)
  Bash(grep *) Bash(mkdir *) Bash(curl *)
  Read Write Edit Glob Grep WebSearch WebFetch AskUserQuestion
---

# Insight 포스트 작성 스킬

블로그 Insight 포스트를 **주제 분석 → 리서치 → 작성 → 문체 검수 → 승인 → MD 파일 생성**까지 수행한다.

## 두 가지 원칙

**문체 규칙은 `references/prose-rules.md` 한곳에 있다.** 글을 쓰기 전에 읽는다. 규칙이 여러 곳에 흩어져 있으면 절반만 적용되고, 그것이 같은 지적이 반복된 원인이었다.

**기계 통과는 검수의 시작이지 끝이 아니다.** 2026-08에 `check-prose.ts` HARD 0건을 문체 검증으로 착각해 배포했다가 9강을 전량 재수정했다. 그 스크립트는 정규식 20여 개만 본다. 문어체 어휘는 `check-literary.mjs`가, 호응과 주어 누락은 낭독 검수가 잡는다. 셋 다 돌린다.

## 워크플로우

### 1단계: 주제 분석

- `$ARGUMENTS`에서 주제, 카테고리, 핵심 포인트를 파악한다.
- 카테고리는 `MARKETING`, `AI_TECH`, `DATA` 중 하나.
- 불명확하면 AskUserQuestion으로 확인한다. 되묻는 횟수는 최소로 한다.

### 2단계: 웹 리서치

- WebSearch, WebFetch로 공식 문서와 최신 자료를 조사한다.
- 수집할 것: 기능 목록, 통계, 실무 사례, 공식 문서 URL
- 검색에 현재 연도(2026)를 포함해 최신 정보를 우선한다.
- **공식 문서로 확인한 것과 커뮤니티에서 본 것을 구분해 기록한다.** 이 구분이 본문의 단정 강도를 정한다.

### 3단계: 콘텐츠 작성

**작성 전에 `references/prose-rules.md`를 읽는다.** 아래는 그중 가장 자주 어긋나는 네 가지만 옮긴 것이고, 전체 규칙은 그 문서에 있다.

1. **소제목은 명사형과 선언형.** 구어체 질문형(`~할까요?`, `그래서~`, `그런데~`)을 쓰지 않는다. 물음표로 끝나는 H2만 FAQPage JSON-LD로 추출되므로 명사형에서는 FAQPage가 발행되지 않는다. 사용자가 이 비용을 알고 명사형을 선택했다.
2. **em dash(`—`)와 가운뎃점(`·`)을 쓰지 않는다.** 콜론과 쉼표로 대체한다.
3. **근거에 따라 단정 강도를 조절한다.** 공식 문서로 확인된 것만 `~입니다`로 쓰고, 커뮤니티나 경험담은 `~생길 수 있습니다`로 완화한다.
4. **헤딩에서 대상을 생략하지 않는다.** 헤딩만 떼어 놓고 봐도 무엇에 관한 이야기인지 알 수 있어야 한다.

**구조 요건:**

- 존댓말(`~습니다`, `~합니다`) 통일
- H2 헤딩 최소 3개
- 본문 최소 1000단어
- 실무에 적용할 수 있는 구체적 예시 최소 1개
- 마지막에 3줄 요약
- 표와 리스트를 적극 활용한다

**본문 이미지 (필수):**

시각 자료를 최소 1장, 권장 2~3장 넣는다. **추상 일러스트나 자체 생성 그래픽이 아니라 외부에서 검색한 실제 예시 이미지**여야 한다.

1. WebSearch, WebFetch로 주제와 직접 관련된 실제 예시를 찾는다.
   - 우선순위: 공식 발표 페이지 → 평판 있는 외신 기사 → 공식 문서
   - 적절한 것: 실제 인터페이스 화면, 결과물 스크린샷, 공식 다이어그램
   - 부적절한 것: 추상 일러스트, 상징 그림, 자체 생성 SVG, 의미 없는 헤더 아트
2. `mkdir -p public/images/insights/{slug}` 후 `curl -sL -o`로 내려받는다. **외부 핫링크를 쓰지 않는다.**
3. `![구체적 alt 설명](/images/insights/{slug}/{filename})` 형태로 넣는다. alt는 이미지가 무엇을 보여주는지 한 문장으로 쓴다.
4. 위치: 도입부 직후 1장, 본론 중간 1~2장
5. 본문에서 출처와 맥락을 밝힌다.

### 4단계: 문체 검수 게이트 (생략 불가)

**네 단계를 순서대로 통과해야 파일을 만든다.** 배포 후 반복 수정을 막기 위한 장치이고, 하나라도 건너뛰지 않는다.

초안은 먼저 `content/insights/{slug}.md`에 쓴다. 검사 도구가 파일을 대상으로 하기 때문이다. 게이트를 통과하지 못하면 그 파일을 고치고 다시 돌린다.

**4-1. 번역투와 금지 기호 (HARD 0건)**

```bash
npm run check:prose -- content/insights/{slug}.md
```

em dash, 가운뎃점, `~에 대한`, `~을 통해`, 이중 피동, 과장 표현, AI식 안내 지시문을 본다. HARD 위반은 단어만 바꾸지 말고 **문장 전체를 다시 쓴다.** 단어만 치환하면 문장이 어색해진다.

오탐이 나올 수 있다. 오탐이면 우회하거나 예외를 등록하고, **왜 오탐인지 사용자에게 보고한다.** 조용히 넘기지 않는다.

**4-2. 문어체와 추상 표현 (HARD 0건)**

```bash
node .claude/skills/prose-inspector/scripts/check-literary.mjs content/insights/{slug}.md
```

`갈래`, `얹히다`, `비로소` 같은 문어체 어휘를 사전으로 잡는다. **4-1이 통과했다고 이 단계를 건너뛰지 않는다.** 두 스크립트는 서로 다른 것을 본다.

WARN은 맥락에 따라 허용되므로 4-3에서 판단한다.

**4-3. 낭독 검수 (기계가 못 하는 층위)**

전문을 처음부터 끝까지 읽으며 아래를 본다. **표와 인라인 HTML 도표 안의 문장까지 본다.** 실제로 그 세 곳이 가장 많이 샜다.

| 항목 | 무엇을 보는가 |
|---|---|
| 주어와 서술어 호응 | 주어가 그 동사를 할 수 있는가 |
| 주어와 목적어 누락 | 무엇이 무엇을 하는지 적혔는가 |
| 비유 성립 | 비유의 원재료가 만질 수 있는 사물인가, 논리가 깨지지 않았는가 |
| 비유 중복 | 같은 비유를 두 번 쓰지 않았는가 |
| 지시어 선행사 | `이 상태`, `그 결과`의 대상이 바로 앞 문장에서 명확한가 |
| 같은 말 반복 | 한 문장에 같은 동사 어근 3회, 인접 문장에 같은 종결어가 없는가 |
| 처음 언급에 `다시` | 아직 다루지 않은 내용을 `다시 다루겠습니다`로 쓰지 않았는가 |
| 검증 불가 단정 | `처음으로`, `최초로`, `가장`을 출처 없이 쓰지 않았는가 |
| 의미 불명 압축 | 그 문장만 떼어 읽었을 때 뜻이 한 번에 잡히는가 |
| 개념 정확성 | 원문 개념을 요약하며 뜻이 바뀌지 않았는가 |

판단이 서지 않는 표현은 이 질문으로 정한다.

> 이 표현을 평범한 사람이 동료에게 말할 때 자연스러운가, 아니면 신문 사설 같은가?

기호도 여기서 함께 확인한다. 둘 다 0건이어야 한다.

```bash
grep -n "—" content/insights/{slug}.md
grep -n "·" content/insights/{slug}.md
```

**4-4. 승인 게이트**

- 검수를 통과한 **전문을 사용자에게 출력하고 승인을 받는다.**
- **승인 전에는 커밋도 배포도 하지 않는다.** `써줘`는 초안 요청이지 배포 승인이 아니다.
- 사용자가 `배포해줘`, `올려줘`라고 한 경우에만 커밋하고 푸시한다.

**사용자가 표현을 지적하면 그 자리에서 등록한다.** `references/prose-rules.md`의 해당 절에 추가하고, 기계로 잡을 수 있으면 `prose-inspector`의 사전에도 넣는다. 등록하지 않으면 다음 글에서 같은 표현이 다시 나온다.

### 5단계: frontmatter와 썸네일

- `references/post-schema.md`를 참조한다.
- 필수 필드: slug, title, excerpt, category, tags, publishedAt, metaTitle, metaDescription, ogTitle, ogDescription, ogImage, quiz
- **metaDescription 첫 문장은 핵심 개체를 포함한 `X는 Y입니다` 단정형 정의로 쓴다.** 본문 도입부, 메타, JSON-LD의 개체와 표현을 일치시킨다.
- 태그는 `src/lib/constants.ts`의 `CANONICAL_TAGS`에서만 3~5개 고른다.
- slug는 영문 소문자와 하이픈.
- 퀴즈는 선택지 3~4개, explanation 2~3문장.

```bash
npx tsx scripts/generate-og.ts --slug {slug}
```

생성 후 frontmatter `ogImage`에 경로를 넣는다.

### 6단계: 결과 보고

파일 경로, slug, URL(`/insights/{slug}`)을 출력하고 추가 작업 여부를 확인한다.

## 완료 전 점검

**게이트 (생략 불가):**

- [ ] `npm run check:prose` HARD 0건
- [ ] `check-literary.mjs` HARD 0건
- [ ] 낭독 검수 1회 완료 (표와 HTML 도표 안 문장 포함)
- [ ] `grep "—"`, `grep "·"` 각 0건
- [ ] 전문을 사용자에게 출력하고 승인 획득

**문체:**

- [ ] 소제목이 명사형이나 선언형이고 구어체 질문형이 없음
- [ ] 헤딩만 떼어 봐도 무엇에 관한 항목인지 알 수 있음
- [ ] 공식 근거는 단정형, 커뮤니티 근거는 완화형으로 구분됨
- [ ] 추상 명사와 과장된 극적 은유 없음
- [ ] `독자` 단어 없음
- [ ] 병렬 설명 3개 이상은 불릿으로 분리됨
- [ ] 시간에 민감한 정보에 시점 명시

**구조:**

- [ ] 본문 1000단어 이상, H2 3개 이상
- [ ] 외부 실제 예시 이미지 1장 이상, `public/images/insights/{slug}/`에 저장, 핫링크 없음
- [ ] 모든 이미지 alt가 무엇을 보여주는지 구체적으로 설명
- [ ] 실무 예시 1개 이상, 퀴즈 1개, 3줄 요약
- [ ] Sources에 공식 문서만
- [ ] 태그 3~5개, metaTitle 70자 이하, metaDescription 170자 이하

## 주의사항

- 배포는 GitHub push로 자동 처리된다. `npx vercel --prod`를 직접 실행하지 않는다.
- 콘텐츠는 `content/insights/{slug}.md` 파일 Write로만 만든다.

## 참조

| 파일 | 용도 |
|---|---|
| `references/prose-rules.md` | **문체 규칙 전체. 작성 전 필독** |
| `references/post-schema.md` | frontmatter 스키마 |
| `.claude/skills/prose-inspector/` | 문어체 사전과 낭독 검수 절차 |
| `src/lib/constants.ts` | `CANONICAL_TAGS`, `POST_CATEGORIES` |
| `scripts/generate-og.ts` | og:image 생성 |
