import { getPublishedPosts } from "./content";
import type { PostWithTags } from "./types";

/**
 * 현재 글과 관련 있는 인사이트를 점수순으로 고른다.
 * 같은 카테고리 +2점, 태그가 1개 겹칠 때마다 +1점.
 * 점수가 0인 글은 제외하고, 동점이면 최신 글을 우선한다.
 */
export function getRelatedPosts(current: PostWithTags, limit = 4): PostWithTags[] {
  const currentTags = new Set(current.tags);

  return getPublishedPosts()
    .filter((post) => post.slug !== current.slug)
    .map((post) => {
      const tagScore = post.tags.filter((tag) => currentTags.has(tag)).length;
      const categoryScore = post.category === current.category ? 2 : 0;
      return { post, score: tagScore + categoryScore };
    })
    .filter(({ score }) => score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        (b.post.publishedAt?.getTime() ?? 0) - (a.post.publishedAt?.getTime() ?? 0)
    )
    .slice(0, limit)
    .map(({ post }) => post);
}
