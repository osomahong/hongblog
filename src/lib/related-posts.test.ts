import assert from "node:assert/strict";
import test from "node:test";
import { rankRelatedPosts } from "./related-posts";
import type { PostWithTags } from "./types";

function post(overrides: Partial<PostWithTags> & Pick<PostWithTags, "slug">): PostWithTags {
  const { slug, ...rest } = overrides;
  return {
    id: 1,
    slug,
    title: slug,
    excerpt: "",
    content: "",
    category: "AI_TECH",
    tags: [],
    readingTime: 3,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
    publishedAt: new Date("2026-01-01"),
    thumbnailUrl: null,
    metaTitle: null,
    metaDescription: null,
    ogImage: null,
    ogTitle: null,
    ogDescription: null,
    highlights: null,
    quiz: null,
    seriesId: null,
    seriesOrder: null,
    seriesInfo: null,
    topicCluster: null,
    contentType: null,
    journeyStage: null,
    nextSlugs: [],
    relatedSlugs: [],
    ...rest,
  };
}

test("편집자가 지정한 다음 글을 가장 먼저 추천한다", () => {
  const current = post({ slug: "current", nextSlugs: ["chosen"], tags: ["AI"] });
  const candidates = [
    post({ slug: "popular", tags: ["AI"], topicCluster: "same" }),
    post({ slug: "chosen", tags: [] }),
  ];

  assert.equal(rankRelatedPosts(current, candidates, 2)[0]?.slug, "chosen");
});

test("넓은 공통 태그보다 같은 주제 클러스터를 우선한다", () => {
  const current = post({
    slug: "current",
    tags: ["AI", "자동화"],
    topicCluster: "google-workspace",
  });
  const candidates = [
    post({ slug: "generic", tags: ["AI", "자동화"] }),
    post({ slug: "cluster", tags: ["AI"], topicCluster: "google-workspace" }),
  ];

  assert.equal(rankRelatedPosts(current, candidates, 2)[0]?.slug, "cluster");
});

test("기존 시리즈 메타데이터를 같은 학습 흐름으로 반영한다", () => {
  const seriesInfo = { id: 1, slug: "digitalmarketing", title: "digitalmarketing" };
  const current = post({ slug: "current", tags: ["마케팅 실무"], seriesInfo });
  const candidates = [
    post({ slug: "generic", tags: ["마케팅 실무", "AI"] }),
    post({ slug: "series", tags: [], seriesInfo }),
  ];

  assert.equal(rankRelatedPosts(current, candidates, 2)[0]?.slug, "series");
});

test("점수가 같으면 날짜와 slug로 결과를 안정적으로 정렬한다", () => {
  const current = post({ slug: "current", tags: ["AI"] });
  const sameDate = new Date("2026-02-01");
  const candidates = [
    post({ slug: "beta", tags: ["AI"], publishedAt: sameDate }),
    post({ slug: "alpha", tags: ["AI"], publishedAt: sameDate }),
  ];

  assert.deepEqual(
    rankRelatedPosts(current, candidates, 2).map((item) => item.slug),
    ["alpha", "beta"],
  );
});
