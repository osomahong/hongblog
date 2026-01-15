/**
 * PostManager 통합 가이드
 * 
 * hong/page.tsx에서 PostManager를 사용하는 방법
 */

## 1단계: Import 추가

```tsx
import { PostManager } from "@/features/posts/components/PostManager";
```

## 2단계:  Posts 탭에서 PostManager 사용

기존 코드:
```tsx
{activeTab === "posts" && (
  {/* 거대한 Posts 목록 및 에디터 코드 */}
)}
```

새 코드:
```tsx
{activeTab === "posts" && (
  <>
    {view === "list" && (
      <PostManager
        viewStats={viewStats}
        onEdit={handleEditPost}
        onLinkedInSummary={handleGenerateLinkedinSummary}
        isGeneratingLinkedinSummary={isGeneratingLinkedinSummary}
      />
    )}
    {view === "editor" && (
      {/* 기존 에디터 코드 유지 (나중에 리팩토링) */}
    )}
  </>
)}
```

## 3단계: 기존 함수 유지 (임시)

PostManager component가 아직 edit 기능을 포함하지 않으므로, 
기존의 handleEditPost, handleGenerateLinkedinSummary 등은 
그대로 hong/page.tsx에 남겨두세요.

나중에 PostEditor 컴포넌트를 만들면 완전히 분리할 수 있습니다.

## 장점

1. **즉시 적용 가능**: 기존 코드를 거의 수정하지 않고 통합
2. **점진적 마이그레이션**: Editor도 나중에 분리 가능
3. **Server Actions 활용**: 목록 조회/삭제/토글이 Server Actions로 동작
4. **코드 분리**: Posts 관심사가 feature 폴더로 이동

## 다음 단계

- [ ] PostEditor 컴포넌트 생성
- [ ] hong/page.tsx에서 Post 관련 state 완전 제거
- [ ] API Routes 삭제 (/api/hong/posts)
