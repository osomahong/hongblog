# Fix Plan 출력 포맷

이 스킬은 파일을 직접 수정하지 않고 구조화된 제안만 출력한다. 출력은 두 가지 포맷을 지원한다: 단일 점검과 배치 점검. 사용자 가독성을 위해 YAML이 아닌 마크다운 표로 렌더링하되, 내부 구조는 아래 스키마를 따른다.

## 내부 스키마

```yaml
fixPlan:
  slug: string
  type: insights | classes | courses
  title: string
  scores:
    seo: number
    aeo: number
    geo: number
    overall: number     # seo*0.35 + aeo*0.30 + geo*0.35
  grade: A | B | C | D
  violations:
    - ruleId: string           # R-SEO-02 형식
      severity: high | medium | low
      area: SEO | AEO | GEO
      field: string            # frontmatter.metaDescription | body | tags | heading
      location: string | null  # "도입부", "## 개요 아래", "5번째 문단" 등
      current: string          # 현재 값/스니펫, 200자 이내로 요약
      proposed: string         # 제안 값/스니펫, 구체적이어야 함
      rationale: string        # 규칙 ID + 왜 이게 개선인지 한 줄
```

## Severity 결정

- `high`: 가중치 15 이상 규칙의 FAIL (metaTitle/metaDescription/R-AEO-01/R-GEO-01 등)
- `medium`: 중간 가중치(10-14) FAIL, 또는 고가중치 PARTIAL
- `low`: 가중치 10 미만 PARTIAL, 또는 권장 개선

## 단일 점검 출력 포맷

마크다운으로 다음 순서대로 출력한다:

```markdown
## 점검 리포트: {title}

- 타입: {insights|classes|courses}
- 슬러그: `{slug}`
- 파일: `content/{type}/{slug}.md`

### 종합 점수

| 영역 | 점수 | 등급 |
|------|------|------|
| SEO | {seoScore}/100 | {grade} |
| AEO | {aeoScore}/100 | {grade} |
| GEO | {geoScore}/100 | {grade} |
| **종합** | **{overall}/100** | **{overallGrade}** |

### 위반 항목 (Severity 순)

| # | ruleId | severity | 영역 | 필드 | 현재 | 제안 | 근거 |
|---|--------|----------|------|------|------|------|------|
| 1 | R-SEO-02 | high | SEO | frontmatter.metaDescription | (98자) "GA4 소스/매체..." | (142자) "GA4에서 Session source/medium이 ..." | 120-160자 권장 |
| 2 | R-AEO-01 | high | AEO | body 첫 문단 | "GA4 보고서를 보다가 당혹스러운..." | "Session source/medium이 (not set)으로 표시되는 이유는 X 때문입니다. ..." | 결론 선행 |
| 3 | R-GEO-02 | medium | GEO | body | 통계 1개 | 통계 3개 이상 추가 | Princeton GEO 연구: 통계 추가 시 AI 가시성 30-40% 향상 |

### 제안 요약

- [high] metaDescription을 {X}자로 확장 — SEO R-SEO-02
- [high] 도입부를 결론 선행 구조로 재작성 — AEO R-AEO-01
- [medium] 구체적 통계 2개 이상 추가 — GEO R-GEO-02
- [low] 질문형 H2 1개 추가 — AEO R-AEO-03

### 강점

- ✅ ogImage/ogTitle/ogDescription 완비 (R-SEO-05, R-SEO-06)
- ✅ H2 구조 충분 (R-SEO-04)
- ✅ 내부 링크 3개로 주제 권위 확보 (R-GEO-06)

### 적용 방법

이 스킬은 제안만 생성합니다. 적용하시려면 "제안 1~3번 적용해줘" 형태로 요청해주세요.
```

## 배치 점검 출력 포맷

```markdown
## 배치 점검 리포트

- 대상: {type} ({count}건)
- 실행 시각: {timestamp}

### 전체 통계

| 지표 | 값 |
|------|-----|
| 총 콘텐츠 | {count}건 |
| 평균 종합 점수 | {avg}/100 |
| A 등급 | {aCount}건 |
| B 등급 | {bCount}건 |
| C 등급 | {cCount}건 |
| D 등급 | {dCount}건 |
| 개선 필요 (<60점) | {lowCount}건 |

### 영역별 평균

| 영역 | 평균 | 가장 약한 규칙 | 위반율 |
|------|------|---------------|--------|
| SEO | {seoAvg} | R-SEO-02 metaDescription | {rate}% |
| AEO | {aeoAvg} | R-AEO-01 직접 답변 | {rate}% |
| GEO | {geoAvg} | R-GEO-01 출처 인용 | {rate}% |

### 개선 우선순위 상위 10건

| 순위 | 타입 | 제목 | SEO | AEO | GEO | 종합 | 핵심 위반 |
|------|------|------|-----|-----|-----|------|----------|
| 1 | insights | "제목1" | 45 | 30 | 25 | 33 | metaDesc 없음, 직접 답변 없음, 출처 0개 |
| 2 | insights | "제목2" | 60 | 40 | 35 | 45 | 통계 부족, H2 2개 |
| ... |

### 공통 패턴

전체 콘텐츠에서 반복 발견된 위반을 요약:

- 전체 {N}건 중 {M}건이 R-SEO-02 (metaDescription 길이) 위반
- 전체 {N}건 중 {M}건이 R-GEO-01 (출처 인용) 위반 — 외부 링크 삽입 일괄 보강 권장
- CANONICAL_TAGS 이탈 태그 발견: `{tag1}`, `{tag2}` ({N}건)

### 다음 단계 제안

1. 우선순위 1~3번 콘텐츠부터 개별 점검 실행: `/inspect-content {slug}`
2. 전체 R-SEO-02 위반 메타디스크립션 일괄 재작성
3. CANONICAL_TAGS 이탈 태그 교체 (단일 PR)

### 적용 방법

이 스킬은 제안만 생성합니다. 개별 slug로 상세 점검을 원하시면 `/inspect-content {slug}` 또는 "제안 1~3번 적용해줘"라고 요청해주세요.
```

## 출력 규칙

- `current` 필드가 너무 길면 200자 이내로 말줄임(`...`) 처리
- `proposed`는 가능한 한 완성된 문장/필드값을 제시 — "확장 필요" 같은 지시어가 아니라 실제 대체 텍스트
- `rationale`은 한 줄, 규칙 ID 직접 인용
- 위반이 없는 영역은 "강점" 섹션에 별도 표시해 사용자가 현재 좋은 부분을 알 수 있게 함
- 점수가 85 이상인 영역은 위반 테이블에 포함하지 않음
