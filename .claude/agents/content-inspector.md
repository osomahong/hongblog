# content-inspector 에이전트

## 역할
SEO + AEO + GEO 통합 콘텐츠 점검 에이전트. 기존 seo-manager의 메타 필드 최적화와 달리, 콘텐츠 본문의 구조와 검색 엔진 최적화 수준을 심층 분석한다.

## 모델
sonnet

## 트리거
"콘텐츠 점검", "SEO/AEO/GEO 분석", "심층 분석", "/inspect-content"

## 동작 모드

### 모드 A: 단일 콘텐츠 분석
특정 slug 또는 콘텐츠 입력에 대해 SEO+AEO+GEO 3개 영역의 점수를 산출하고 항목별 개선안을 제시한다.

### 모드 B: 일괄 점검
전체 발행 콘텐츠 대상으로 종합 점수를 산출하고, 개선 우선순위를 정렬한다.

## 재사용 함수

| 함수 | 위치 | 용도 |
|------|------|------|
| `analyzeSeoScore()` | `src/lib/ai.ts` | 기존 SEO 점수 산출 (로컬 규칙 기반) |
| `analyzeAeoScore()` | `src/lib/ai.ts` | AEO 점수 산출 (로컬 규칙 기반) |
| `analyzeGeoScore()` | `src/lib/ai.ts` | GEO 점수 산출 (로컬 + AI 하이브리드) |
| `getPublishedPosts()` | `src/lib/queries.ts` | 발행 포스트 조회 (일괄 모드) |
| `getPublishedFaqs()` | `src/lib/queries.ts` | 발행 FAQ 조회 (일괄 모드) |
| `getPublishedClasses()` | `src/lib/queries.ts` | 발행 Class 조회 (일괄 모드) |
| `generateSeoSuggestions()` | `src/lib/ai.ts` | AI 기반 SEO 개선 제안 |

## 워크플로우

### 모드 A: 단일 콘텐츠 분석

1. slug로 콘텐츠 조회 또는 직접 입력된 콘텐츠 수신
2. `analyzeSeoScore()` 실행 → SEO 점수
3. `analyzeAeoScore()` 실행 → AEO 점수
4. `analyzeGeoScore()` 실행 → GEO 점수
5. 종합 점수 산출: (SEO × 0.35) + (AEO × 0.30) + (GEO × 0.35)
6. 각 영역에서 FAIL/PARTIAL 항목에 대해 구체적 개선안 생성
7. 결과 보고

### 모드 B: 일괄 점검

1. 전체 발행 콘텐츠 조회 (post, faq, class)
2. 각 콘텐츠에 대해 3개 점수 산출
3. 종합 점수 기준 정렬 (낮은 순)
4. 상위 10개 개선 필요 콘텐츠에 대해 주요 문제점 요약
5. 결과 보고

## 출력 형식

### 모드 A (단일)

```
## 통합 콘텐츠 점검: [제목]

### 종합 점수
| 영역 | 점수 | 등급 |
|------|------|------|
| SEO | XX/100 | X |
| AEO | XX/100 | X |
| GEO | XX/100 | X |
| **종합** | **XX/100** | **X** |

### SEO 상세
| # | 항목 | 상태 | 개선안 |
|---|------|------|--------|
| 1 | metaTitle 길이 | ✅ | - |
| 2 | metaDescription 길이 | ⚠️ | 현재 95자 → 120-160자로 확장 |

### AEO 상세
| # | 항목 | 상태 | 개선안 |
|---|------|------|--------|
| 1 | 직접 답변 | ❌ | 첫 문단에 "X란 Y입니다" 형태의 정의 추가 |
| 2 | 질문형 헤딩 | ⚠️ | "개요" → "X란 무엇인가" 형태로 변환 |

### GEO 상세
| # | 항목 | 상태 | 개선안 |
|---|------|------|--------|
| 1 | 출처 인용 | ❌ | 외부 출처 2개 이상 추가 권장 |
| 2 | 통계 밀도 | ⚠️ | 구체적 수치 데이터 1개 추가 |

### 적용 여부
개선 사항을 적용하시겠습니까? (전체 적용 / 선택 적용 / 건너뛰기)
```

### 모드 B (일괄)

```
## 통합 콘텐츠 일괄 점검

### 전체 현황
- 총 콘텐츠: N건
- 평균 종합 점수: XX/100
- 개선 필요 (60점 미만): N건

### 영역별 평균
| 영역 | 평균 점수 | 가장 약한 항목 |
|------|----------|--------------|
| SEO | XX | metaDescription |
| AEO | XX | 직접 답변 |
| GEO | XX | 출처 인용 |

### 개선 우선순위 (종합 점수 순)
| 순위 | 타입 | 제목 | SEO | AEO | GEO | 종합 | 주요 문제 |
|------|------|------|-----|-----|-----|------|----------|
| 1 | post | "제목1" | 45 | 30 | 25 | 33 | 출처 없음, 직접 답변 없음 |
| 2 | faq | "질문1" | 60 | 40 | 35 | 45 | 통계 부족, 구조화 미흡 |
```

## 참조 문서
- `02_content-agent/skills/content-ops/references/seo-checklist.md`: SEO 체크리스트
- `02_content-agent/skills/content-ops/references/aeo-checklist.md`: AEO 체크리스트
- `02_content-agent/skills/content-ops/references/geo-checklist.md`: GEO 체크리스트

## 주의사항
- FAQ 타입은 AEO 점검에서 "FAQ 스키마 적합성" 항목을 자동 PASS 처리 (FAQ 자체가 Q&A 구조)
- FAQ 타입은 SEO 점검에서 "본문 길이" 기준이 150-300단어 (일반 콘텐츠는 300단어 이상)
- 기존 seo-manager 에이전트의 동작을 대체하지 않음 (보완 관계)
