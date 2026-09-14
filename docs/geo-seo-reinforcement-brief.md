# GEO/SEO 보강 작업 지침

`npx tsx scripts/geo-seo-score.ts --worklist`가 뽑아 준 파일을 고칠 때 따르는 지침이다.
점수를 올리려고 없는 내용을 만들지 않는다. 이미 본문에 있는 것을 검색엔진과 답변 엔진이
집어 갈 수 있는 형태로 바꾸는 작업이다.

## 먼저 읽는 것

1. `~/.claude/skills/korean-prose-rules/SKILL.md` (전역 한국어 문장 지침)
2. 담당 파일과 같은 코스의 다른 클래스 한 편. 문장 결을 맞춘다
3. 기준판: `content/classes/what-is-kpi.md`

## 손대지 않는 것

- 숫자, 계산 과정, 표 안의 값, 공식
- 기존 H2/H3 헤딩 문구 (FAQ 섹션을 새로 넣는 경우만 예외)
- `summary3` 프론트매터
- `slug`, `publishedAt`, `courseSlug`, `orderInCourse`, `ogImage`

## 조치별 기준

### R-SEO-02: metaDescription

- 120자 이상 160자 이하. 공백 포함해 센다
- 첫 문장은 그 글이 답하는 질문에 대한 직답. 정의형 글이면 "X는 ~입니다" 형태
- 두 번째 문장부터 본문이 실제로 다루는 항목을 나열한다. 본문에 없는 내용을 넣지 않는다
- 검색 결과에 그대로 보이는 문장이므로 과장과 호기심 유발 표현을 쓰지 않는다
- YAML 블록 스칼라(`>-`)로 적고 들여쓰기 두 칸을 지킨다

### R-SEO-07: 태그

- `src/lib/constants.ts`의 `CANONICAL_TAGS_FLAT`에 있는 값만 쓴다. 새 태그를 만들지 않는다
- 3개 이상 5개 이하. 글의 주제와 실제로 맞는 것만 고른다. 수를 채우려고 억지로 넣지 않는다
- 억지로 3개가 되지 않는 주제라면 2개로 두고 작업 보고에 이유를 적는다

### R-SEO-01: metaTitle

- 표시 폭 18 이상 36 이하 (한글과 한자 1, 나머지 0.5로 환산)
- 사이트명을 넣지 않는다. 루트 템플릿이 붙인다
- H1(`title` 또는 `term`)과 첫 어절이 같아야 한다
- 고친 뒤 `npm run check:titles -- --warn`으로 확인한다

### R-SEO-06: ogDescription

- 50자 이상 120자 이하. 공유 카드에 보이는 한 문장
- metaDescription을 그대로 자르지 않는다. 공유받은 사람이 열어 볼 이유가 한 문장에 담겨야 한다

### R-AEO-02: 자주 묻는 질문

- `## ❓ 자주 묻는 질문` H2 아래 H3 질문 3개. 3줄 요약 섹션이 있으면 그 바로 앞에 둔다
- H3는 해요체 질문이고 물음표로 끝난다. `-는가` 같은 문어체 의문형을 쓰지 않는다
- 각 답은 문단 하나, 2~3문장. 첫 문장에서 결론을 먼저 말한다
- **본문이 이미 다루는 내용에서 뽑되 본문 문장을 그대로 복사하지 않는다.** 본문에서 한 번 스치고 지나간 판단 기준, 예외 상황, 자주 나오는 오해를 질문으로 세운다
- 이 헤딩은 `src/lib/extract-faq.ts`가 읽어 FAQPage 구조화 데이터로 발행한다. 질문 바로 아래 문단이 답변으로 들어가므로 질문과 답 사이에 표나 목록을 넣지 않는다

### R-GEO-06: 내부 링크

- 본문 안에 관련 클래스나 인사이트로 가는 링크 2개 이상
- 문장 안에서 그 개념이 처음 나오는 곳에 건다. 글 끝에 링크 목록을 붙이지 않는다
- 클래스 경로는 `/class/{courseSlug}/{slug}`다. courseSlug를 빠뜨리면 링크가 깨진다
- 실재하는 경로인지 `npx tsx scripts/check-links.ts`로 확인한다
- 이미 같은 대상으로 링크가 있으면 다른 대상을 고른다

## 끝내기 전 검사

담당 파일 전체를 넘겨 세 가지를 돌리고 HARD 0건을 확인한다.

```
npm run check:prose -- <파일들>
node .claude/skills/prose-inspector/scripts/check-literary.mjs <파일들>
npx tsx scripts/check-summary3.ts <파일들>
npx tsx scripts/check-links.ts
```

점수는 `npx tsx scripts/geo-seo-score.ts --slug <slug>`로 확인한다.

## 보고

고친 파일 수, 조치별 건수, 손대지 못한 항목과 그 이유를 적는다. 본문은 돌려주지 않는다.
