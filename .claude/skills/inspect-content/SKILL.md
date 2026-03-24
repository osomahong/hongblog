---
name: inspect-content
description: SEO+AEO+GEO 통합 콘텐츠 점검 스킬. "콘텐츠 점검", "SEO 분석", "AEO 점검", "GEO 분석", "inspect-content" 요청 시 트리거. 단일 콘텐츠 심층 분석 또는 전체 일괄 점검 지원.
---

# inspect-content 스킬

블로그 콘텐츠의 SEO + AEO(Answer Engine Optimization) + GEO(Generative Engine Optimization) 통합 점검을 수행합니다.

## 사용법

```
/inspect-content [slug]          # 단일 콘텐츠 분석
/inspect-content --batch         # 전체 발행 콘텐츠 일괄 점검
/inspect-content --batch --type post  # 특정 타입만 점검
```

또는 자연어: "이 글 SEO/AEO/GEO 점검해줘", "콘텐츠 일괄 점검", "심층 분석"

## 워크플로우

### 단일 분석 (slug 지정)

1. `content-inspector` 에이전트에 위임
2. SEO + AEO + GEO 3개 영역 점수 산출
3. 항목별 개선안과 종합 점수 보고
4. 사용자 승인 시 개선 사항 적용

### 일괄 점검 (--batch)

1. `content-inspector` 에이전트에 일괄 모드로 위임
2. 전체 발행 콘텐츠의 종합 점수 산출
3. 개선 우선순위 순으로 정렬하여 보고
4. 사용자가 선택한 콘텐츠에 대해 개별 개선안 제시

## content-ops 연동

content-ops 스킬의 Phase 3(SEO 최적화)에서 사용자가 "심층 분석" 요청 시, 기존 seo-manager 대신 이 스킬의 content-inspector 에이전트에 위임됩니다.

## 점검 영역

| 영역 | 항목 수 | 주요 체크 |
|------|---------|----------|
| SEO | 8 | metaTitle, metaDescription, ogTitle, ogDescription, ogImage, 본문 길이, 헤딩 구조, 태그 |
| AEO | 7 | 직접 답변, FAQ 스키마, 질문형 헤딩, 피처드 스니펫, 핵심 요약, 음성 검색, 엔티티 |
| GEO | 7 | 출처 인용, 통계 밀도, 구조화 데이터, 전문가 신호, 콘텐츠 신선도, 주제 권위, 인용 가능성 |

## 참조 문서
- `references/seo-checklist.md`
- `references/aeo-checklist.md`
- `references/geo-checklist.md`
