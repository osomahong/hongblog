---
name: inspect-content
description: hongblog의 MD 기반 콘텐츠(content/insights, content/classes, content/courses)를 대상으로 SEO + AEO(Answer Engine Optimization) + GEO(Generative Engine Optimization) 통합 점검을 수행하고, 각 위반 항목에 대한 구체적인 수정 계획(fix plan)을 제안한다. 단일 콘텐츠 분석과 타입별 배치 점검 두 모드를 지원하며, 파일을 직접 수정하지 않고 구조화된 제안만 출력한다. 문체와 번역투 검수는 다루지 않는다.
when_to_use: |
  (1) "콘텐츠 점검", "SEO 분석", "AEO 점검", "GEO 분석", "인사이트 점검", "심층 분석",
  (2) /inspect-content [slug] 또는 --batch 직접 호출,
  (3) 검색 노출이나 AI 답변 인용이 안 되는 원인을 구조에서 찾을 때.
  문체, 번역투, 문어체 어휘, 비문 검수는 prose-inspector로 간다.
  새 주제 발굴은 seo-topic-finder, 제목 추천은 seo-title-creator로 간다.
argument-hint: '[slug] | --batch [--type insights|classes|courses]'
model: opus
effort: high
allowed-tools: Read, Glob, Grep, Bash(npx tsx *), Agent, AskUserQuestion
---

# inspect-content

hongblog MD 콘텐츠의 SEO + AEO + GEO 통합 점검 스킬. 검증과 수정 계획(fix plan) 제안을 한 번에 수행한다.

## 진입 확인

"점검해줘", "검수해줘"는 구조 점검일 수도 문체 검수일 수도 있다. 시작 전에 순서대로 확인하고, 앞 단계에서 갈리면 묻지 않는다.

1. **요청에 신호가 있으면 그대로 따른다.** SEO, AEO, GEO, 메타, 태그, 검색 노출, 슬러그, 구조가 언급되면 이 스킬이 맞다. 문체, 번역투, 문어체, 비문, 어투, 낭독이 언급되면 이 스킬이 아니다. `prose-inspector`로 넘긴다.
2. **`--batch`나 `--type` 인자가 있으면 이 스킬이 맞다.** 문체 검수에는 배치 모드가 없다.
3. **둘 다 없으면 한 번 묻는다.** `AskUserQuestion`으로 "검색 구조 점검(SEO/AEO/GEO)"과 "문체 검수" 중 고르게 한다. 답을 받기 전에는 파일을 읽지 않는다. 둘 다 필요하다고 하면 이 스킬을 먼저 돌리고 `prose-inspector`로 넘긴다. 구조를 고치면 문장이 바뀌므로 순서가 반대면 검수를 두 번 하게 된다.

## 범위

- 대상: `content/insights/*.md` (49건), `content/classes/*.md` (34건), `content/courses/*.md` (3건)
- 제외: FAQ/Log 타입은 현재 MD 파일로 존재하지 않으므로 점검하지 않는다
- 파일 자동 수정 없음 — 구조화된 제안만 출력. 사용자가 "제안 N번 적용해줘"라고 명시 요청할 때만 별도 Edit 수행

## 사용 방법

```
/inspect-content [slug]                   # 단일 콘텐츠 점검
/inspect-content --batch                  # 전체 콘텐츠 배치 점검
/inspect-content --batch --type insights  # insights 타입만 배치
/inspect-content --batch --type classes   # classes 타입만 배치
```

자연어 트리거도 수용한다: "이 글 점검해줘", "인사이트 전체 SEO 분석", "ga4-not-set 글 GEO 점검".

## 콘텐츠 식별

slug가 주어지면 다음 순서로 파일을 탐색한다:

1. `content/insights/{slug}.md`
2. `content/classes/{slug}.md`
3. `content/courses/{slug}.md`

첫 번째로 존재하는 파일을 점검 대상으로 삼는다. 타입이 명시된 경우(`--type`) 해당 디렉토리만 탐색한다.

## 로드 방법

### 단일 점검

`Read` 도구로 `content/{type}/{slug}.md` 파일을 직접 읽는다. frontmatter는 `---`로 감싸진 YAML 블록이고 그 아래가 본문이다.

### 배치 점검

`Glob` 도구로 `content/{type}/*.md` 목록을 얻고 각 파일을 `Read`로 읽는다. 49건 이상일 때는 한 번에 읽지 말고 10건 단위로 순차 처리한다. 과도한 context 소모가 우려되면 `getInsights()`/`getClasses()`/`getCourses()`(`src/lib/content.ts`)를 `npx tsx -e "..."` 한 번으로 호출해 slug + metaFields만 추출한 뒤, 점검이 필요한 파일만 Read로 열어도 된다.

## 워크플로우

```
1. 콘텐츠 로드 (Read)
2. frontmatter 파싱 (--- 사이 YAML 영역)
3. 본문 파싱 (H2/H3 헤딩, 문단, 리스트, 표, 링크 추출)
4. 결정론 계층 점검
   - references/seo-rules.md 규칙 전체 순회
   - references/aeo-rules.md 결정론 가능 항목
   - references/geo-rules.md 결정론 가능 항목
5. 의미 판정 계층 점검 (LLM reasoning)
   - AEO R-AEO-01, R-AEO-07 (직접 답변, 엔티티 명확성)
   - GEO R-GEO-04, R-GEO-07의 의미 보정 (전문가 신호, 인용 가능성)
6. 블로그 고유 규칙 대조 (references/hongblog-context.md)
   - 태그가 CANONICAL_TAGS 범위 안에 있는가
   - 카테고리 값이 허용 목록에 있는가
   - 톤/존댓말 일관성 (샘플 문단 확인)
7. 점수 산출
   - 각 영역 점수 = sum(PASS 가중치) + sum(PARTIAL 가중치 * 0.5)
   - 종합 점수 = SEO × 0.35 + AEO × 0.30 + GEO × 0.35
   - 등급: A(80+), B(60-79), C(40-59), D(~39)
8. Fix plan 생성 (references/fix-plan-format.md 스키마 준수)
9. 사용자에게 리포트 출력 — 파일은 수정하지 않는다
```

## 콘텐츠 타입별 예외

| 타입 | 본문 길이 기준 | H2 필수 | AEO 점검 | GEO 점검 |
|------|--------------|---------|---------|---------|
| insights | 300단어 이상 | 3개 이상 | 전체 | 전체 |
| classes | 150단어 이상 | 면제(정의형) | 직접 답변, 엔티티 명확성만 | 전체 |
| courses | metaDescription만 | 면제 | 생략 | 생략 |

courses는 목차 페이지 성격이므로 SEO 필드 검증(metaTitle/metaDescription)만 수행한다.

## 참조 문서

점검 실행에 필요한 세부 규칙은 아래 파일에서 읽는다. SKILL.md 본문에 규칙을 반복해 쓰지 않는다.

- `references/seo-rules.md` — SEO 8개 규칙(R-SEO-01~08), PASS/FAIL 기준, fix 전략
- `references/aeo-rules.md` — AEO 7개 규칙(R-AEO-01~07), 결정론/의미 판정 구분
- `references/geo-rules.md` — GEO 7개 규칙(R-GEO-01~07), 정규식 패턴
- `references/fix-plan-format.md` — fix plan YAML 스키마, 단일/배치 리포트 출력 예시
- `references/hongblog-context.md` — CANONICAL_TAGS, 카테고리, URL 패턴, 톤 규칙

규칙 파일은 점검을 시작할 때 한 번에 모두 읽지 말고, 해당 영역(SEO/AEO/GEO)을 점검하는 단계에서 필요한 파일만 순차적으로 Read한다. 배치 점검 시에는 세 영역 규칙 파일을 먼저 모두 읽어 캐시해 두는 게 효율적이다.

## 배치 점검 병렬화

30건이 넘는 배치는 파일을 순차로 읽지 않는다. 본문 전체가 메인 컨텍스트에 쌓여 뒤쪽 파일의 판정이 흐려진다.

`Explore` 에이전트를 **10건 단위로 나눠 병렬로** 띄우고, 각 에이전트에 이 스킬의 `references/` 규칙 파일 경로와 담당 파일 목록을 그대로 넘긴다. 규칙은 한 곳(`references/`)에만 두고 에이전트는 그것을 읽는다. 규칙을 프롬프트에 복사하지 않는다.

각 에이전트가 돌려주는 것은 담당 파일의 위반 목록과 영역별 점수뿐이다. 본문은 돌려받지 않는다. 취합과 우선순위 정렬은 이 스킬이 한다.

## 출력

`references/fix-plan-format.md`에 정의된 두 포맷 중 하나로 출력한다.

- 단일: 종합 점수 + 영역별 위반 테이블 + 제안 요약
- 배치: 전체 통계 + 영역별 약점 + 우선순위 정렬 상위 10건

출력 마지막에 다음 문구를 반드시 포함한다:

> 이 스킬은 제안만 생성합니다. 적용하시려면 "제안 1~3번 적용해줘" 형태로 요청해주세요.

## 주의

- `.claude/references/content/{seo,aeo,geo}-checklist.md`는 **작성 가이드**이고, 이 스킬의 `references/` 파일은 **점검 실행 규칙**이다. 두 문서는 분리를 유지한다
- 현재 저장소에는 `src/lib/ai.ts`, `src/lib/queries.ts`가 존재하지 않는다. 이 스킬의 어느 파일도 해당 경로를 참조해서는 안 된다
- `CANONICAL_TAGS`의 원본은 `src/lib/constants.ts`다. `hongblog-context.md`의 스냅샷은 주기적으로 원본과 diff 대조해야 한다
