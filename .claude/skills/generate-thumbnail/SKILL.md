---
name: generate-thumbnail
description: SVG 기반 블로그 썸네일(og:image) 생성 스킬. "썸네일 만들어줘", "og:image 생성", "generate-thumbnail" 요청 시 트리거. 콘텐츠 타입별(Post, Class) Neo-Brutalism 디자인 썸네일을 SVG로 생성하고 public/og/에 PNG로 저장 후 frontmatter ogImage 필드를 업데이트합니다.
---

# generate-thumbnail 스킬

블로그 콘텐츠의 브랜드 썸네일(og:image)을 SVG 기반으로 생성합니다.

## 사용법

```
/generate-thumbnail [slug]                    # 단일 생성 (타입 자동 감지)
/generate-thumbnail [slug] --type post        # 타입 지정
/generate-thumbnail --batch --type post       # ogImage 없는 Post 일괄 생성
/generate-thumbnail --all                     # 모든 타입 일괄 생성
```

또는 자연어: "이 글 썸네일 만들어줘", "og:image 생성해줘"

## 실행

```bash
npx tsx scripts/generate-og.ts --slug <slug>
npx tsx scripts/generate-og.ts --slug <slug> --type post
npx tsx scripts/generate-og.ts --batch --type post
npx tsx scripts/generate-og.ts --all
npx tsx scripts/generate-og.ts --slug <slug> --svg-only  # SVG 디버그
```

## 파이프라인

```
MD frontmatter 읽기 → SVG 문자열 빌드 → @resvg/resvg-js PNG 변환 → public/og/ 저장 → frontmatter ogImage 업데이트
```

## 디자인

Neo-Brutalism 디자인 시스템, 세이프존 기반 레이아웃:
- 1200x630px (og:image 표준)
- 좌측 70-80%: 카테고리 배지 + 제목 + 구분선 + 블로그명
- 우측 20-30%: 카테고리별 장식 SVG (MARKETING=사각형, AI_TECH=노드그래프, DATA=바차트)
- Pretendard OTF 폰트, 한국어 적응형 크기 (15자 56px ~ 41자+ 34px)
- 세이프존: 정사각형/직사각형 크롭 모두 제목 텍스트 보존

상세 스펙: [references/svg-design-spec.md](references/svg-design-spec.md)

## 스크립트 구조

```
scripts/
├── generate-og.ts          # CLI 진입점
└── lib/
    ├── og-template.ts      # SVG 빌더
    ├── og-text.ts          # 한국어 텍스트 측정/줄바꿈
    ├── og-decorations.ts   # 카테고리별 장식 요소
    └── og-render.ts        # resvg 래퍼 (Pretendard 폰트 로딩)
```

## 역할 분리

- **og:image 썸네일**: 이 스킬 (SVG 프로그래매틱 생성, SNS 공유용)
- **출력 위치**: `public/og/{slug}.png` (git 커밋, 정적 서빙)
