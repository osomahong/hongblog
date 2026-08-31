import { getPublishedPosts } from "./content";
import type { PostWithTags } from "./types";

/**
 * 태그 빈도가 높을수록 추천 신호를 낮춘다. AI, 자동화처럼 거의 모든 글에
 * 붙는 태그보다 GA4, BigQuery처럼 구체적인 태그가 더 강하게 작동한다.
 */
function buildTagWeights(posts: PostWithTags[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of new Set(post.tags)) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }

  const total = Math.max(posts.length, 1);
  return new Map(
    [...counts].map(([tag, count]) => [
      tag,
      1 + Math.log((total + 1) / (count + 1)),
    ]),
  );
}

const JOURNEY_NEXT: Record<string, string | undefined> = {
  beginner: "practical",
  practical: "advanced",
  advanced: undefined,
};

export function rankRelatedPosts(
  current: PostWithTags,
  candidates: PostWithTags[],
  limit = 4,
  excludeSlugs: string[] = [],
): PostWithTags[] {
  const excluded = new Set([current.slug, ...excludeSlugs]);
  const currentTags = new Set(current.tags);
  const tagWeights = buildTagWeights([current, ...candidates]);
  const explicitNext = new Map(current.nextSlugs.map((slug, index) => [slug, index]));
  const explicitRelated = new Map(current.relatedSlugs.map((slug, index) => [slug, index]));

  return candidates
    .filter((post) => !excluded.has(post.slug))
    .map((post) => {
      const nextIndex = explicitNext.get(post.slug);
      const relatedIndex = explicitRelated.get(post.slug);
      const tagScore = post.tags
        .filter((tag) => currentTags.has(tag))
        .reduce((score, tag) => score + (tagWeights.get(tag) ?? 1), 0);
      const clusterScore =
        current.topicCluster && post.topicCluster === current.topicCluster ? 12 : 0;
      const seriesScore =
        current.seriesInfo && post.seriesInfo?.slug === current.seriesInfo.slug ? 10 : 0;
      const journeyScore =
        current.journeyStage &&
        post.journeyStage === JOURNEY_NEXT[current.journeyStage]
          ? 4
          : 0;
      const contentTypeScore =
        current.contentType && post.contentType === current.contentType ? 1 : 0;
      const categoryScore = post.category === current.category ? 0.5 : 0;
      const editorialScore =
        nextIndex !== undefined
          ? 50 - nextIndex
          : relatedIndex !== undefined
            ? 30 - relatedIndex
            : 0;

      return {
        post,
        score:
          editorialScore +
          clusterScore +
          seriesScore +
          journeyScore +
          contentTypeScore +
          tagScore +
          categoryScore,
      };
    })
    .filter(({ score }) => score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        (b.post.publishedAt?.getTime() ?? 0) - (a.post.publishedAt?.getTime() ?? 0) ||
        a.post.slug.localeCompare(b.post.slug),
    )
    .slice(0, limit)
    .map(({ post }) => post);
}

export function getNextPost(current: PostWithTags): PostWithTags | null {
  return rankRelatedPosts(current, getPublishedPosts(), 1)[0] ?? null;
}

export function getRelatedPosts(
  current: PostWithTags,
  limit = 4,
  excludeSlugs: string[] = [],
): PostWithTags[] {
  return rankRelatedPosts(current, getPublishedPosts(), limit, excludeSlugs);
}
