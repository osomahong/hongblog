import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Monitor } from "lucide-react";
import { SITE_URL } from "@/lib/constants";
import { ViewTracker } from "@/components/ViewTracker";
import { AipblHeader } from "@/components/ai-practice/AipblHeader";
import { GeoBasicsLab } from "@/components/ai-practice/geo-basics/GeoBasicsLab";
import { FINAL_TEMPLATE } from "@/components/ai-practice/geo-basics/lab-data";

/** 검색, 답변 엔진이 실습 진행 없이도 읽을 수 있는 3단계 정의문 (AEO 단정형) */
const ELEMENT_DEFINITIONS = [
  {
    name: "목표 질문",
    definition:
      "목표 질문은 우리 브랜드가 AI 답변에 인용되길 원하는 질문입니다. 그 질문을 AI에게 던져 보면 지금 누가 어떤 이유로 인용되는지 드러납니다.",
  },
  {
    name: "읽히는 텍스트",
    definition:
      "읽히는 텍스트는 크롤러와 AI가 HTML에서 실제로 읽는 내용입니다. 이미지 안에만 있는 정보는 AI 답변에 인용될 확률이 매우 낮습니다.",
  },
  {
    name: "근거 문장",
    definition:
      "근거 문장은 수치와 기간이 붙은 검증 가능한 단정형 문장입니다. AI는 근거가 붙은 문장을 답변에 우선 인용합니다.",
  },
];

export const dynamic = "force-static";

const PAGE_TITLE = "GEO 기초 AIPBL: 목업 사이트를 AI 답변에 인용되게 만들기";
// AEO 정의 문장: 헤더 도입부, JSON-LD description과 삼중 정렬
const PAGE_DESC =
  "GEO 기초 AIPBL은 가상의 복숭아 농장 사이트를 AI 답변에 인용되게 만들어 보는 프로젝트 실습입니다. 목표 질문 던지기, AI의 눈으로 사이트 확인, 근거 문장 추가 3단계를 실습 화면 안의 목업 사이트에서 직접 진행합니다.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESC,
  alternates: { canonical: `${SITE_URL}/ai-practice/geo-basics` },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESC,
    type: "website",
    url: `${SITE_URL}/ai-practice/geo-basics`,
    images: [{ url: `${SITE_URL}/og-default.png`, width: 1200, height: 630 }],
  },
};

export default function GeoBasicsPage() {
  // 메타 description, 본문 도입부와 개체, 정의 표현을 일치시킨 구조화 데이터 (삼중 정렬)
  const learningResourceLd = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    "@id": `${SITE_URL}/ai-practice/geo-basics#learningresource`,
    name: PAGE_TITLE,
    url: `${SITE_URL}/ai-practice/geo-basics`,
    description: PAGE_DESC,
    inLanguage: "ko",
    learningResourceType: "프로젝트 기반 학습(PBL)",
    about: ["GEO(생성형 엔진 최적화)", "AI 검색 최적화"],
    teaches: ["목표 질문 정하기", "크롤러가 읽는 텍스트 확인", "근거 문장 작성"],
    educationalLevel: "기초",
    timeRequired: "PT15M",
    isPartOf: { "@id": `${SITE_URL}/ai-practice#learningresource` },
  };

  return (
    <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <ViewTracker contentType="ai_practice" contentSlug="geo-basics" contentTitle="GEO 기초" />
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
        index="04"
        code="GEO Basics"
        title="GEO 기초"
        description={PAGE_DESC}
        meta={[
          { iconSrc: "/images/ai-practice/icons/difficulty.png", text: "난이도 기초" },
          { iconSrc: "/images/ai-practice/icons/time.png", text: "약 15분" },
          { iconSrc: "/images/ai-practice/icons/missions.png", text: "미션 3개 + 점검 퀴즈" },
          { iconSrc: "/images/ai-practice/icons/output.png", text: "결과물: GEO 시작 체크리스트 1개" },
        ]}
        track={{
          label: "GEO 트랙",
          steps: [
            { id: "geo-basics", label: "기초" },
            { id: "geo-intermediate", label: "중급", href: "/ai-practice/geo-intermediate" },
            { id: "geo-advanced", label: "심화", href: "/ai-practice/geo-advanced" },
          ],
          current: 0,
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
          GEO 기초 AIPBL은 목업 사이트와 실습 채팅을 나란히 놓고 진행하는 실습이라 PC
          브라우저에서만 제공됩니다. PC에서 지금 이 주소로 다시 접속해 주세요.
        </p>
        <p className="inline-block px-4 py-2 rounded-full border border-[#e5e7eb] bg-[#f9fafb] font-mono text-xs text-[#333333] mb-6 break-all">
          {SITE_URL.replace(/^https?:\/\//, "")}/ai-practice/geo-basics
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
        <GeoBasicsLab />
      </div>

      {/* 학습 요약: 실습 진행 없이도 읽히는 정적 콘텐츠 (SEO, AEO, GEO 대응) */}
      <section className="mt-14 sm:mt-20">
        <p className="ap-label mb-3">Learning Summary</p>
        <h2 className="text-xl sm:text-3xl font-semibold tracking-tight mb-5">
          이 AIPBL에서 배우는 것
        </h2>
        <p className="text-sm sm:text-base leading-relaxed text-[var(--ap-muted)] max-w-3xl mb-8">
          GEO(생성형 엔진 최적화)는 AI가 만드는 답변에 내 콘텐츠가 인용되도록 만드는 작업입니다.
          GEO 기초 AIPBL은 목표 질문, 읽히는 텍스트, 근거 문장 세 단계를 목업 사이트에 직접
          적용하면서, 같은 질문의 AI 답변이 어떻게 달라지는지 확인하는 구성입니다.
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
          <h3 className="font-semibold text-base mb-2">실습 결과물: GEO 시작 체크리스트</h3>
          <p className="text-sm leading-relaxed text-[var(--ap-muted)] mb-4">
            실습을 마치면 아래 체크리스트를 결과물로 가져갑니다. 대괄호를 내 브랜드 내용으로
            채워, 모모팜에서 한 순서 그대로 내 사이트에 적용하는 방식으로 사용합니다.
          </p>
          <pre className="ap-prompt p-5 overflow-x-auto">{FINAL_TEMPLATE}</pre>
        </div>
      </section>
    </div>
  );
}
