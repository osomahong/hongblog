---
name: topic-backlog
description: 토픽 백로그 관리 스킬. 글감 아이디어를 scripts/data/topic-backlog.json에 누적 저장하고, 필요할 때 목록 조회·우선순위 필터·카테고리 필터로 선택하여 일괄 작성할 수 있다. "토픽 저장", "글감 추가", "백로그 확인", "백로그에서 글쓰기", "/topic-backlog" 요청 시 트리거. add/list/write/done/remove 서브명령 지원.
argument-hint: 'add|list|write|done|remove [--priority HIGH|MID|LOW] [--category MARKETING|AI_TECH|DATA]'
---

# 토픽 백로그 관리 스킬

블로그 글감 아이디어를 **누적 저장**하고, 필요할 때 **조회/선택/일괄 작성**하는 스킬입니다.

## 저장소

`scripts/data/topic-backlog.json` 파일에 토픽 목록을 JSON 배열로 관리합니다.

## 사용법

### 토픽 추가

```
/topic-backlog add "제목" --category AI_TECH --priority HIGH --reason "GA4 근거 등"
```

또는 자연어: "이 토픽들 백로그에 저장해줘", "글감 추가"

### 백로그 조회

```
/topic-backlog list
/topic-backlog list --priority HIGH
/topic-backlog list --category MARKETING
```

또는 자연어: "백로그 확인", "저장된 글감 보여줘"

### 백로그에서 글쓰기

```
/topic-backlog write 1        # 1번 토픽으로 글 작성
/topic-backlog write --all    # 전체 일괄 작성 (사용자 승인 후 순차)
```

또는 자연어: "백로그에서 글쓰기", "저장된 토픽으로 글 작성"

### 토픽 삭제/완료 표시

```
/topic-backlog done 1         # 작성 완료 표시
/topic-backlog remove 3       # 삭제
```

## 데이터 구조

`scripts/data/topic-backlog.json`:

```json
[
  {
    "id": 1,
    "title": "비개발자를 위한 GA4 BigQuery 연동 실전 가이드",
    "category": "DATA",
    "priority": "HIGH",
    "reason": "DATA 카테고리 글당 2세션. '비개발자를 위한 ~' 포맷이 MARKETING에서 검증됨(66세션)",
    "tags": ["GA4", "BigQuery", "데이터 분석"],
    "contentType": "post",
    "source": "ga4-analysis",
    "addedAt": "2026-03-25",
    "status": "pending"
  }
]
```

### 필드 설명

| 필드 | 필수 | 설명 |
|------|------|------|
| id | 자동 | 순번 (자동 증가) |
| title | 필수 | 토픽 제목 |
| category | 필수 | MARKETING, AI_TECH, DATA |
| priority | 선택 | HIGH, MED, LOW (기본: MED) |
| reason | 선택 | 이 토픽을 선정한 근거 (GA4 데이터, 갭 분석 등) |
| tags | 선택 | 예상 태그 (CANONICAL_TAGS에서) |
| contentType | 선택 | post, faq, class (기본: post) |
| source | 선택 | 토픽 출처 (ga4-analysis, seo-topic-finder, blog-topic-creator, manual) |
| addedAt | 자동 | 추가 날짜 |
| status | 자동 | pending, writing, done |

## 워크플로우

### 토픽 추가 시

1. `scripts/data/topic-backlog.json` 파일 읽기 (없으면 빈 배열 생성)
2. 새 토픽 객체 생성 (id 자동 할당)
3. JSON 파일에 추가 저장
4. 현재 백로그 현황 보고

### 백로그에서 글쓰기 시

1. 백로그 목록 표시
2. 사용자가 토픽 번호 선택
3. 해당 토픽의 status를 "writing"으로 변경
4. write-insight 스킬의 워크플로우로 글 작성 (웹 리서치 → 작성 → JSON → 배포)
5. 완료 후 status를 "done"으로 변경
6. 다음 토픽 진행 여부 확인

### /newcontent 연동

/newcontent 스킬에서 토픽 제안 후 사용자가 선택하지 않은 나머지 토픽을 자동으로 백로그에 추가합니다.

## 출력 형식

### 백로그 목록

```
## 토픽 백로그 (N건)

| # | 우선순위 | 제목 | 카테고리 | 출처 | 추가일 | 상태 |
|---|---------|------|---------|------|--------|------|
| 1 | 🔴 HIGH | 비개발자를 위한 GA4 BigQuery... | DATA | ga4-analysis | 2026-03-25 | pending |
| 2 | 🟡 MED | AI 에이전트로 마케팅 업무... | MARKETING | ga4-analysis | 2026-03-25 | pending |

### 요약
- pending: N건 | writing: N건 | done: N건
- HIGH: N건 | MED: N건 | LOW: N건
```

## 참조 파일

| 파일 | 용도 |
|------|------|
| `scripts/data/topic-backlog.json` | 토픽 백로그 데이터 |
| `.claude/skills/write-insight/SKILL.md` | 글 작성 워크플로우 |
| `.claude/skills/newcontent/SKILL.md` | GA4 기반 토픽 제안 연동 |
