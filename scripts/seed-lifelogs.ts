import { config } from "dotenv";
config({ path: ".env.local" });

import { db } from "../src/lib/db";
import { lifeLogs, Category } from "../src/lib/schema";

const demoLifeLogs: {
  slug: string;
  title: string;
  content: string;
  category: Category;
  location: string;
  visitedAt: string;
  rating: number;
  isPublished: boolean;
}[] = [
    {
      slug: "gangnam-sushi-omakase",
      title: "강남 스시 오마카세 방문기",
      content: `## 첫인상

오랜만에 제대로 된 스시를 먹고 싶어서 예약한 곳. 강남역에서 도보 5분 거리에 위치해 있어 접근성이 좋았다.

## 코스 구성

총 15피스 구성의 런치 오마카세였는데, 가격 대비 퀄리티가 훌륭했다.

- **전채**: 참치 타르타르, 연어 카르파초
- **니기리**: 광어, 참치 뱃살, 새우, 성게, 장어 등
- **마무리**: 참치 김밥, 된장국

## 하이라이트

특히 **참치 뱃살(오토로)**이 입에서 녹는 수준이었다. 밥알 온도와 식초 밸런스도 적절했고, 셰프분이 직접 설명해주시는 것도 좋았다.

## 총평

가격은 점심 기준 8만원대로 오마카세치고는 합리적인 편. 특별한 날 방문하기 좋은 곳으로 추천한다.

> 재방문 의사: ⭐⭐⭐⭐⭐`,
      category: "MARKETING",
      location: "서울 강남구",
      visitedAt: "2025-12-15",
      rating: 5,
      isPublished: true,
    },
    {
      slug: "consulting-project-alpha",
      title: "알파 프로젝트 컨설팅",
      content: "# 알파 프로젝트 컨설팅 로그\\n\\n클라이언트의 마케팅 전략 수립을 위한 컨설팅 작업...",
      category: "MARKETING" as const,
      location: "서울 강남구",
      visitedAt: "2024-01-15",
      rating: 5,
      isPublished: true,
    },
    {
      slug: "data-analysis-beta",
      title: "베타 기업 데이터 분석",
      content: "# 데이터 분석 프로젝트\\n\\nGA4 데이터 연동 및 분석...",
      category: "DATA" as const,
      location: "온라인",
      visitedAt: "2024-01-20",
      rating: 4,
      isPublished: true,
    },
    {
      slug: "ai-tech-workshop",
      title: "AI 기술 워크샵 진행",
      content: "# AI 기술 워크샵\\n\\nChatGPT API 활용 워크샵 진행...",
      category: "AI_TECH" as const,
      location: "판교 스타트업 캠퍼스",
      visitedAt: "2024-02-01",
      rating: 5,
      isPublished: false,
    },
    {
      slug: "ux-design-lecture-review",
      title: "UX 디자인 실무 강의 후기",
      content: `## 강의 개요

- **강의명**: UX 디자인 실무 마스터 클래스
- **플랫폼**: 온라인 (라이브)
- **기간**: 4주 (주 2회, 회당 2시간)
- **수강료**: 45만원

## 커리큘럼

1주차: UX 리서치 방법론
2주차: 사용자 여정 맵핑
3주차: 와이어프레임 & 프로토타이핑
4주차: 사용성 테스트 & 개선

## 좋았던 점

- **실무 중심**: 이론보다 실제 프로젝트 기반 학습
- **피드백**: 과제마다 상세한 피드백 제공
- **네트워킹**: 수강생들과 슬랙 커뮤니티 운영

## 아쉬운 점

- 4주는 다소 짧은 느낌
- 심화 과정이 없음

## 추천 대상

마케터나 PM 중에서 UX에 대한 기본기를 다지고 싶은 분들에게 추천. 디자이너 전환을 원하는 분들에게는 입문용으로 적합하다.

---

*다음에는 데이터 분석 관련 강의도 들어볼 예정*`,
      category: "DATA",
      location: "온라인",
      visitedAt: "2025-11-20",
      rating: 4,
      isPublished: true,
    },
  ];

async function seedLifeLogs() {
  console.log("🌱 Seeding life logs...");

  for (const log of demoLifeLogs) {
    try {
      await db.insert(lifeLogs).values(log).onConflictDoNothing();
      console.log(`✅ Created: ${log.title}`);
    } catch (error) {
      console.error(`❌ Failed to create: ${log.title}`, error);
    }
  }

  console.log("✨ Life logs seeding complete!");
  process.exit(0);
}

seedLifeLogs();
