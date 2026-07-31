import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Monitor } from "lucide-react";
import { SITE_URL } from "@/lib/constants";
import { ViewTracker } from "@/components/ViewTracker";
import { AipblHeader } from "@/components/ai-practice/AipblHeader";
import { PromptIntermediateLab } from "@/components/ai-practice/prompt-intermediate/PromptIntermediateLab";
import { FINAL_TEMPLATE } from "@/components/ai-practice/prompt-intermediate/lab-data";

/** 검색, 답변 엔진이 실습 진행 없이도 읽을 수 있는 세 기술 정의문 (AEO 단정형) */
const ELEMENT_DEFINITIONS = [
  {
    name: "예시 제시",
    definition:
      "예시 제시는 원하는 결과물의 견본을 프롬프트에 붙이는 기술입니다. 형용사로 설명하는 것보다 톤과 구성이 정확하게 전달됩니다.",
  },
  {
    name: "단계 나누기",
    definition:
      "단계 나누기는 큰 요청을 작은 작업으로 쪼개 순서대로 맡기는 기술입니다. 단계마다 결과를 확인하고 방향을 바로잡을 수 있습니다.",
  },
  {
    name: "질문 유도",
    definition:
      "질문 유도는 답하기 전에 AI가 먼저 질문하게 만드는 기술입니다. 내가 놓친 조건을 AI가 채워 결과의 수준이 올라갑니다.",
  },
];

export const dynamic = "force-static";

const PAGE_TITLE = "프롬프트 중급 AIPBL: 예시, 단계, 질문으로 끌어올리는 답변 수준";
// AEO 정의 문장: 헤더 도입부, JSON-LD description과 삼중 정렬
const PAGE_DESC =
  "프롬프트 중급 AIPBL은 예시 제시, 단계 나누기, 질문 유도 세 가지 기술로 AI 답변의 수준을 끌어올리는 프로젝트 실습입니다. 기초에서 익힌 역할, 맥락, 형식 위에 세 기술을 더해 답변의 톤과 깊이를 원하는 방향으로 조정합니다.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESC,
  alternates: { canonical: `${SITE_URL}/ai-practice/prompt-intermediate` },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESC,
    type: "website",
    url: `${SITE_URL}/ai-practice/prompt-intermediate`,
    images: [{ url: `${SITE_URL}/og-default.png`, width: 1200, height: 630 }],
  },
};

export default function PromptIntermediatePage() {
  // 메타 description, 본문 도입부와 개체, 정의 표현을 일치시킨 구조화 데이터 (삼중 정렬)
  const learningResourceLd = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    "@id": `${SITE_URL}/ai-practice/prompt-intermediate#learningresource`,
    name: PAGE_TITLE,
    url: `${SITE_URL}/ai-practice/prompt-intermediate`,
    description: PAGE_DESC,
    inLanguage: "ko",
    learningResourceType: "프로젝트 기반 학습(PBL)",
    about: ["프롬프트 엔지니어링", "프롬프트 작성"],
    teaches: ["예시 제시", "단계 나누기", "질문 유도"],
    educationalLevel: "중급",
    timeRequired: "PT20M",
    isPartOf: { "@id": `${SITE_URL}/ai-practice#learningresource` },
  };

  return (
    <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <ViewTracker
        contentType="ai_practice"
        contentSlug="prompt-intermediate"
        contentTitle="프롬프트 중급"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(learningResourceLd) }}
      />

      <Link
        href="/ai-practice"
        className="inline-flex items-center gap-2 text-xs font-medium text-[var(--ap-muted)] hover:text-white transition-colors mb-8"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> AI-PRACTICE 소개로
      </Link>

      <AipblHeader
        index="02"
        code="Prompt Intermediate"
        title="프롬프트 중급"
        description={PAGE_DESC}
        meta={[
          { iconSrc: "/images/ai-practice/icons/difficulty.png", text: "난이도 중급" },
          { iconSrc: "/images/ai-practice/icons/time.png", text: "약 20분" },
          { iconSrc: "/images/ai-practice/icons/missions.png", text: "미션 3개 + 점검 퀴즈" },
          { iconSrc: "/images/ai-practice/icons/output.png", text: "결과물: 프롬프트 중급 템플릿 1개" },
        ]}
        track={{
          label: "프롬프트 트랙",
          steps: [
            { id: "prompt-basics", label: "기초", href: "/ai-practice/prompt-basics" },
            { id: "prompt-intermediate", label: "중급" },
            { id: "prompt-advanced", label: "심화", href: "/ai-practice/prompt-advanced" },
          ],
          current: 1,
        }}
      />

      {/* 모바일: PC 이용 안내 (AIPBL은 PC 전용) */}
      <div className="lg:hidden ap-paper ap-paper-accent p-8 text-center">
        <span
          className="inline-flex items-center justify-center w-14 h-14 rounded-full border border-[#e5e7eb] bg-[#f9fafb] mb-5"
          aria-hidden
        >
          <Monitor className="w-6 h-6 text-[#2563eb]" strokeWidth={1.5} />
        </span>
        <h2 className="text-lg font-semibold mb-3">이 AIPBL은 PC 전용입니다</h2>
        <p className="text-sm leading-relaxed text-[#6b7280] mb-6">
          프롬프트 중급 AIPBL은 안내 패널과 실습 채팅을 나란히 놓고 진행하는 실습이라 PC
          브라우저에서만 제공됩니다. PC에서 지금 이 주소로 다시 접속해 주세요.
        </p>
        <p className="inline-block px-4 py-2 rounded-full border border-[#e5e7eb] bg-[#f9fafb] font-mono text-xs text-[#333333] mb-6 break-all">
          {SITE_URL.replace(/^https?:\/\//, "")}/ai-practice/prompt-intermediate
        </p>
        <div>
          <Link
            href="/ai-practice"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-[#e5e7eb] text-sm font-semibold text-[#333333] hover:border-[#9ca3af] transition-colors"
          >
            AI-PRACTICE 소개 보기
          </Link>
        </div>
      </div>

      {/* 데스크톱: 실습 화면 */}
      <div className="hidden lg:block">
        <PromptIntermediateLab />
      </div>

      {/* 학습 요약: 실습 진행 없이도 읽히는 정적 콘텐츠 (SEO, AEO, GEO 대응) */}
      <section className="mt-14 sm:mt-20">
        <p className="ap-label mb-3">Learning Summary</p>
        <h2 className="text-xl sm:text-3xl font-semibold tracking-tight mb-5">
          이 AIPBL에서 배우는 것
        </h2>
        <p className="text-sm sm:text-base leading-relaxed text-[var(--ap-muted)] max-w-3xl mb-8">
          프롬프트 중급의 세 기술은 예시 제시, 단계 나누기, 질문 유도입니다. 프롬프트 중급
          AIPBL은 이 세 기술을 실습 채팅에서 하나씩 적용해 보며, 같은 요청의 답변이 어떻게
          달라지는지 확인하는 구성입니다.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {ELEMENT_DEFINITIONS.map((el, i) => (
            <div key={el.name} className="ap-card ap-card-accent p-6">
              <span className="ap-step-index mb-3">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="font-semibold text-base mb-2">{el.name}</h3>
              <p className="text-sm leading-relaxed text-[var(--ap-muted)]">{el.definition}</p>
            </div>
          ))}
        </div>
        <div className="ap-card ap-card-accent p-6 sm:p-8">
          <h3 className="font-semibold text-base mb-2">실습 결과물: 프롬프트 중급 템플릿</h3>
          <p className="text-sm leading-relaxed text-[var(--ap-muted)] mb-4">
            실습을 마치면 아래 템플릿을 결과물로 가져갑니다. 대괄호를 내 업무 내용으로 채워
            실제 AI에게 붙여 넣는 방식으로 사용합니다.
          </p>
          <pre className="ap-prompt p-5 overflow-x-auto">{FINAL_TEMPLATE}</pre>
        </div>
      </section>
    </div>
  );
}
