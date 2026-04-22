# SEO 점검 규칙 (R-SEO-01 ~ R-SEO-08)

hongblog 콘텐츠의 SEO 기본 최적화 규칙. 모든 규칙은 결정론적이며 LLM 판단 없이 실행 가능하다.

## 점수 산출

총점 = Σ(PASS 규칙 가중치) + Σ(PARTIAL 규칙 가중치 × 0.5)
만점 = 100 (가중치 합계 = 100)

등급: A(80+), B(60-79), C(40-59), D(~39)

---

## R-SEO-01: metaTitle 길이

- 필드: `frontmatter.metaTitle`
- 가중치: 15
- PASS: 30 ≤ length ≤ 60 (한글 1자 = 1자)
- PARTIAL: 25 ≤ length < 30 또는 60 < length ≤ 70
- FAIL: length < 25 또는 length > 70 또는 필드 없음
- 타입 예외: courses는 그대로 적용

Fix 전략:
- 없음/짧음 → "현재 X자. +Y자 확장. 슬러그 토큰 `{slug.split('-')}`과 카테고리 레이블을 조합해 30-60자로 생성. 예: `{예시}`"
- 김 → "현재 X자. 앞부분에 핵심 키워드 남기고 후미 수식어 제거. 예: `{현재}` → `{짧은 제안}`"

---

## R-SEO-02: metaDescription 길이

- 필드: `frontmatter.metaDescription`
- 가중치: 15
- PASS: 120 ≤ length ≤ 160
- PARTIAL: 100 ≤ length < 120 또는 160 < length ≤ 180
- FAIL: length < 100 또는 length > 180 또는 필드 없음
- 타입 예외: 모든 타입 동일

Fix 전략:
- 없음/짧음 → "현재 X자 → 120-160자. 본문 첫 2문단에서 핵심 가치 + 행동 유도 문구(확인하세요/알아보세요) 조합. 제안 초안: `{생성}`"
- 김 → "현재 X자. 핵심 답변만 남기고 세부 설명은 본문에 위임. 제안 초안: `{축약}`"

---

## R-SEO-03: 본문 길이

- 필드: 본문 전체(frontmatter 제외)
- 가중치: 10
- 단어 카운트 방법: `content.trim().split(/\s+/).length` — 한국어는 공백 단위 분리
- PASS:
  - insights: wordCount ≥ 300
  - classes: wordCount ≥ 150
  - courses: 면제 → 항상 PASS
- PARTIAL:
  - insights: 200 ≤ wordCount < 300
  - classes: 100 ≤ wordCount < 150
- FAIL: 그 외

Fix 전략:
- "본문 X단어 → 목표 Y단어. 다음 H2 섹션 추가 권장: `{추천 섹션}` — 해당 주제의 실무 예시 또는 수치 추가"

---

## R-SEO-04: H2 헤딩 구조

- 필드: 본문 H2 개수 (`^## ` 로 시작하는 라인)
- 가중치: 5
- PASS:
  - insights: H2 ≥ 3
  - classes: 면제 → 항상 PASS
  - courses: 면제 → 항상 PASS
- PARTIAL: insights에서 H2 = 2
- FAIL: insights에서 H2 ≤ 1

Fix 전략:
- "현재 H2 X개. 본문 흐름 기반으로 논리적 구획 3개 이상 제안: `## {섹션1}`, `## {섹션2}`, `## {섹션3}`"

---

## R-SEO-05: ogImage 존재

- 필드: `frontmatter.ogImage`
- 가중치: 10
- PASS: 값 존재하고 URL 형태 (http(s):// 또는 / 로 시작)
- FAIL: 필드 없음 또는 빈 문자열

Fix 전략:
- "ogImage 누락 → `/skills/generate-thumbnail` 또는 Remotion 기반 썸네일 생성 권장. 파일명 `{slug}.png`, 1200x630px, Vercel Blob 업로드"

---

## R-SEO-06: ogTitle / ogDescription 존재

- 필드: `frontmatter.ogTitle`, `frontmatter.ogDescription`
- 가중치: 5 (둘 다 있으면 PASS, 하나만 있으면 PARTIAL)
- PASS: 둘 다 존재, ogTitle 40-70자, ogDescription 80-120자
- PARTIAL: 둘 중 하나만 존재하거나 길이 범위 벗어남
- FAIL: 둘 다 없음

Fix 전략:
- "metaTitle/metaDescription과 다른 표현으로 SNS 공유용 카피 작성. ogTitle은 호기심 유발형, ogDescription은 가치 제안 중심"

---

## R-SEO-07: 태그 규격

- 필드: `frontmatter.tags`
- 가중치: 10
- PASS: 3 ≤ len(tags) ≤ 5 AND 모든 태그가 `CANONICAL_TAGS_FLAT`에 속함 (`references/hongblog-context.md` 참조)
- PARTIAL:
  - 개수 OK + 1개만 비표준
  - 2 ≤ len(tags) < 3 또는 5 < len(tags) ≤ 6 + 모두 표준
- FAIL:
  - 태그 없음, 또는 2개 이상 비표준, 또는 len(tags) > 6

Fix 전략:
- 비표준 태그 포함 → "비표준 태그 `{tag}` 발견. `hongblog-context.md`의 CANONICAL_TAGS에서 가장 가까운 항목으로 교체: `{대안}`"
- 개수 미달 → "태그 X개 → 3-5개로 확장. 본문 키워드 분석 결과 추천: `{tag1}`, `{tag2}`"
- 개수 초과 → "태그 X개 → 5개로 축소. 우선순위가 낮은 항목 제거: `{제거 후보}`"
- **금지 태그**: 도구 고유명(Claude Code, n8n 등), 대상자명(마케터, 비개발자), 동일 개념 한/영 중복(어트리뷰션+Attribution) → 발견 시 강제 FAIL

---

## R-SEO-08: 첫 100단어 내 키워드 출현

- 필드: 본문 첫 100단어 슬라이스
- 가중치: 10
- 키워드 소스: `frontmatter.title` 단어 분해 + slug 토큰(`slug.split('-')`)
- PASS: 키워드 2개 이상 출현
- PARTIAL: 키워드 1개 출현
- FAIL: 키워드 0개 출현

Fix 전략:
- "첫 100단어에 핵심 키워드 `{keyword}` 미출현. 도입부를 '결론 선행' 구조로 수정: 첫 문장에서 제목이 암시하는 질문의 답을 제시"

---

## 실행 체크리스트

점검 실행 시 다음 순서로 프론트매터 필드를 확인한다:

```
metaTitle → R-SEO-01
metaDescription → R-SEO-02
ogImage → R-SEO-05
ogTitle + ogDescription → R-SEO-06
tags → R-SEO-07 (+ hongblog-context.md의 CANONICAL_TAGS 대조)

본문 파싱 후:
wordCount → R-SEO-03
H2 개수 → R-SEO-04
첫 100단어 → R-SEO-08
```

각 규칙의 판정 결과를 `references/fix-plan-format.md`의 `violations` 배열에 누적한다.
