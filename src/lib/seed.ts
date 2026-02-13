import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { posts, faqs, tags, postsToTags, faqsToTags } from "./schema";
import * as schema from "./schema";

const seedData = {
  tags: ["AI", "마케팅", "자동화", "데이터", "분석", "비즈니스", "SEO", "콘텐츠", "도구", "입문"],
  posts: [
    {
      slug: "ai-marketing-automation-2024",
      title: "AI 마케팅 자동화의 미래",
      excerpt: "2024년 AI 기반 마케팅 자동화 트렌드와 실전 적용 전략을 분석합니다.",
      content: `## 서론

AI 기반 마케팅 자동화는 더 이상 미래의 이야기가 아닙니다. 2024년 현재, 많은 기업들이 AI를 활용하여 마케팅 프로세스를 혁신하고 있습니다.

## 주요 트렌드

### 1. 개인화 마케팅의 진화
AI는 고객 데이터를 분석하여 초개인화된 마케팅 메시지를 생성합니다. 이를 통해 전환율을 크게 높일 수 있습니다.

### 2. 예측 분석
머신러닝 모델을 활용하여 고객 행동을 예측하고, 최적의 마케팅 타이밍을 결정합니다.

### 3. 콘텐츠 자동 생성
GPT 기반 모델을 활용하여 마케팅 카피, 이메일, 소셜 미디어 콘텐츠를 자동으로 생성합니다.

## 실전 적용 전략

1. **데이터 인프라 구축**: 고품질 데이터 수집 및 관리 시스템 구축
2. **점진적 도입**: 작은 프로젝트부터 시작하여 점진적으로 확대
3. **성과 측정**: 명확한 KPI 설정 및 지속적인 모니터링

## 결론

AI 마케팅 자동화는 경쟁 우위를 확보하기 위한 필수 요소가 되었습니다. 지금 바로 시작하세요.`,
      category: "AI_TECH" as const,
      highlights: ["실무 적용 사례", "2024 트렌드"],
      tags: ["AI", "마케팅", "자동화"],
    },
    {
      slug: "data-driven-decision-making",
      title: "데이터 기반 의사결정 프레임워크",
      excerpt: "효과적인 데이터 분석을 통한 비즈니스 의사결정 방법론을 소개합니다.",
      content: `## 개요

데이터 기반 의사결정은 현대 비즈니스의 핵심입니다.

## 프레임워크 구성요소

- 데이터 수집 및 정제
- 분석 모델 구축
- 인사이트 도출
- 의사결정 적용`,
      category: "DATA" as const,
      highlights: ["프레임워크 제공", "실전 가이드"],
      tags: ["데이터", "분석", "비즈니스"],
    },
    {
      slug: "seo-optimization-guide",
      title: "SEO 최적화 완벽 가이드",
      excerpt: "검색 엔진 최적화를 위한 기술적 SEO와 콘텐츠 전략을 다룹니다.",
      content: `## SEO 기초

SEO는 검색 엔진에서 웹사이트의 가시성을 높이는 전략입니다.

## 핵심 요소

- 키워드 리서치
- 온페이지 최적화
- 백링크 구축
- 기술적 SEO`,
      category: "MARKETING" as const,
      highlights: ["완벽 가이드", "기술적 SEO"],
      tags: ["SEO", "마케팅", "콘텐츠"],
    },
  ],
  faqs: [
    {
      slug: "what-is-ai-marketing",
      question: "AI 마케팅이란 무엇인가요?",
      answer: `AI 마케팅은 인공지능 기술을 활용해 마케팅 프로세스를 자동화하고 최적화하는 것을 말합니다. 고객 세분화, 콘텐츠 추천, 캠페인 최적화, 챗봇 고객 서비스, 광고 입찰 등 거의 모든 마케팅 영역에서 활용되고 있습니다.

가장 큰 장점은 사람이 수동으로 처리하기 어려운 대규모 데이터를 실시간으로 분석하고, 그 결과를 바로 의사결정에 반영할 수 있다는 점입니다. 예를 들어 **Meta 광고**의 Advantage+ 캠페인은 AI가 타겟·소재·예산 배분을 자동으로 최적화해줍니다.

시작하려면 먼저 명확한 목표(전환율 향상, 비용 절감 등)를 설정하고, 양질의 데이터를 확보하는 것이 중요합니다. 처음부터 고도화된 모델을 도입하기보다는 이메일 자동화나 간단한 A/B 테스트부터 시작하는 것을 추천합니다.`,
      category: "AI_TECH" as const,
      isVerified: true,
      tags: ["AI", "마케팅"],
    },
    {
      slug: "marketing-automation-tools",
      question: "추천하는 마케팅 자동화 도구는?",
      answer: "HubSpot, Marketo, Mailchimp 등이 대표적인 마케팅 자동화 도구입니다.",
      category: "MARKETING" as const,
      isVerified: true,
      tags: ["마케팅", "자동화", "도구"],
    },
    {
      slug: "ai-content-generation",
      question: "AI로 콘텐츠를 생성할 때 주의할 점은?",
      answer: "AI 생성 콘텐츠는 반드시 사람이 검토하고, 팩트체크를 거쳐야 합니다.",
      category: "AI_TECH" as const,
      isVerified: false,
      tags: ["AI", "콘텐츠"],
    },
    {
      slug: "data-analytics-basics",
      question: "데이터 분석을 시작하려면 어떻게 해야 하나요?",
      answer: "SQL, Python, 통계학 기초를 학습하고, 실제 데이터로 프로젝트를 진행해보세요.",
      category: "DATA" as const,
      isVerified: true,
      tags: ["데이터", "분석", "입문"],
    },
    {
      slug: "seo-ranking-factors",
      question: "SEO 순위에 영향을 미치는 주요 요소는?",
      answer: "콘텐츠 품질, 백링크, 페이지 속도, 모바일 최적화 등이 주요 요소입니다.",
      category: "MARKETING" as const,
      isVerified: true,
      tags: ["SEO", "마케팅"],
    },
  ],
};

export async function seed() {
  const sql = neon(process.env.DATABASE_URL!);
  const db = drizzle(sql, { schema });

  console.log("🌱 Seeding database...");

  // 1. 태그 생성
  console.log("Creating tags...");
  const tagRecords = await db
    .insert(tags)
    .values(seedData.tags.map((name) => ({ name })))
    .onConflictDoNothing()
    .returning();

  // 태그 이름 -> ID 매핑
  const allTags = await db.select().from(tags);
  const tagMap = new Map(allTags.map((t) => [t.name, t.id]));

  // 2. Posts 생성
  console.log("Creating posts...");
  for (const postData of seedData.posts) {
    const { tags: postTags, ...postValues } = postData;
    const [post] = await db
      .insert(posts)
      .values(postValues)
      .onConflictDoNothing()
      .returning();

    if (post) {
      // Post-Tag 연결
      const tagLinks = postTags
        .map((tagName) => ({
          postId: post.id,
          tagId: tagMap.get(tagName)!,
        }))
        .filter((link) => link.tagId);

      if (tagLinks.length > 0) {
        await db.insert(postsToTags).values(tagLinks).onConflictDoNothing();
      }
    }
  }

  // 3. FAQs 생성
  console.log("Creating FAQs...");
  for (const faqData of seedData.faqs) {
    const { tags: faqTags, ...faqValues } = faqData;
    const [faq] = await db
      .insert(faqs)
      .values(faqValues)
      .onConflictDoNothing()
      .returning();

    if (faq) {
      // FAQ-Tag 연결
      const tagLinks = faqTags
        .map((tagName) => ({
          faqId: faq.id,
          tagId: tagMap.get(tagName)!,
        }))
        .filter((link) => link.tagId);

      if (tagLinks.length > 0) {
        await db.insert(faqsToTags).values(tagLinks).onConflictDoNothing();
      }
    }
  }

  console.log("✅ Seeding complete!");
}
