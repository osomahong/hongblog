---
name: generate-thumbnail
description: Remotion 기반 블로그 썸네일(og:image) 생성 스킬. "썸네일 만들어줘", "og:image 생성", "generate-thumbnail" 요청 시 트리거. 콘텐츠 타입별(Post, FAQ, Class) Neo-Brutalism 디자인 썸네일을 생성하고 Vercel Blob에 업로드 후 ogImage 필드를 업데이트합니다.
---

# generate-thumbnail 스킬

블로그 콘텐츠의 브랜드 썸네일(og:image)을 Remotion으로 생성합니다.

## 사용법

```
/generate-thumbnail [slug]                    # 단일 생성 (타입 자동 감지)
/generate-thumbnail [slug] --type post        # 타입 지정
/generate-thumbnail --batch --type post       # ogImage 없는 Post 일괄 생성
```

또는 자연어: "이 글 썸네일 만들어줘", "og:image 생성해줘"

## 실행

```bash
npx tsx scripts/generate-thumbnail.ts --slug <slug> --type <post|faq|class>
npx tsx scripts/generate-thumbnail.ts --batch --type post
```

## 템플릿

| 타입 | Composition ID | 레이아웃 |
|------|---------------|---------|
| Post | PostThumbnail | 카테고리 배지 + 큰 제목 + 구분선 + 블로그명 |
| FAQ | FaqThumbnail | FAQ 배지 + 물음표 아이콘 + 질문 텍스트 |
| Class | ClassThumbnail | CLASS 배지 + 용어명 + 코스명(옵션) |

## 디자인

Neo-Brutalism 디자인 시스템 적용:
- 1200x630px (og:image 표준)
- Pretendard 폰트
- 검정 4px 테두리, 6px 하드 섀도우
- 카테고리별 색상: MARKETING=#FF0000, AI_TECH=#FFD700, DATA=#0000FF
- 기울어진 장식 사각형(좌상/우상/좌하/우하)

## 미리보기

```bash
npx remotion studio remotion/Root.tsx
```

## 역할 분리

- **본문 일러스트**: `generateAndInjectImages()` (Gemini AI 생성, 본문 1/3, 2/3 지점 삽입)
- **og:image 썸네일**: 이 스킬 (Remotion 프로그래매틱 생성, SNS 공유용)
