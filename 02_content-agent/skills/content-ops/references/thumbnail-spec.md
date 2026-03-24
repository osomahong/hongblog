# 썸네일 템플릿 스펙

## 공통 사양

- **크기**: 1200 x 630px (Open Graph 표준)
- **포맷**: PNG
- **렌더러**: Remotion `renderStill()`
- **업로드**: Vercel Blob (영구 URL)
- **저장 경로**: `thumbnails/{slug}.png`

## 디자인 토큰

| 토큰 | 값 | 용도 |
|------|-----|------|
| BG | #F3F3F3 | 배경색 |
| BLACK | #000000 | 텍스트, 테두리 |
| WHITE | #FFFFFF | 카드 배경 |
| RED | #FF0000 | MARKETING 카테고리 |
| YELLOW | #FFD700 | AI_TECH 카테고리 |
| BLUE | #0000FF | DATA 카테고리 |
| BORDER | 4px | 카드 테두리 |
| SHADOW | 6px | 하드 섀도우 |
| FONT | Pretendard | 기본 폰트 |

## 카드 레이아웃 (공통)

```
┌──────────────────────────────────────────────┐
│  ■ (장식)                         ■ (장식)   │
│                                              │
│     ┌────────────────────────────────────┐   │
│     │ ██████ 액센트 바 ██████████████████│   │
│     │                                    │   │
│     │         [배지]                     │   │
│     │                                    │   │
│     │       제 목 텍 스 트              │   │
│     │                                    │   │
│     │     ─────────────────────          │   │
│     │      digitalmarketer.co.kr         │   │
│     └────────────────────────────────────┘   │
│  ■ (장식)                         ■ (장식)   │
└──────────────────────────────────────────────┘
```

## 제목 폰트 크기 자동 조정

| 글자 수 | 폰트 크기 |
|---------|----------|
| 20자 이하 | 52px |
| 21~30자 | 44px |
| 31자 이상 | 38px |

## Remotion 파일 구조

```
remotion/
├── Root.tsx                        # Composition 등록
├── remotion.config.ts              # 설정
└── thumbnails/
    ├── PostThumbnail.tsx           # Post 템플릿
    ├── FaqThumbnail.tsx            # FAQ 템플릿
    ├── ClassThumbnail.tsx          # Class 템플릿
    └── shared/
        ├── tokens.ts               # 디자인 토큰
        └── NeoCard.tsx             # 공통 카드 컴포넌트
```
