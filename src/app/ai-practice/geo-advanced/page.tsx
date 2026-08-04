import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Monitor } from "lucide-react";
import { SITE_URL } from "@/lib/constants";
import { ViewTracker } from "@/components/ViewTracker";
import { AipblHeader } from "@/components/ai-practice/AipblHeader";
import { GeoAdvancedLab } from "@/components/ai-practice/geo-advanced/GeoAdvancedLab";
import { FINAL_TEMPLATE } from "@/components/ai-practice/geo-advanced/lab-data";

/** 검색, 답변 엔진이 실습 진행 없이도 읽을 수 있는 3요소 정의문 (AEO 단정형) */
const ELEMENT_DEFINITIONS = [
  {
    name: "크롤러 접근",
    definition:
      "크롤러 접근은 AI 크롤러가 robots.txt의 허용을 받아 페이지를 읽을 수 있는 상태입니다. 차단된 사이트는 어떤 보강을 해도 AI 답변에 인용되기 어렵습니다.",
  },
  {
    name: "구조화 데이터",
    definition:
      "구조화 데이터(JSON-LD)는 페이지 정보의 의미를 정해진 형식으로 선언하는 코드입니다. 화면에는 보이지 않지만 AI가 정보를 추측 없이 확정하도록 돕습니다.",
  },
  {
    name: "llms.txt",
    definition:
      "llms.txt는 사이트 전체를 AI에게 요약해 주는 안내 파일입니다. 사이트 정의와 핵심 페이지, 근거 요약을 본문과 일치하게 담습니다.",
  },
];

export const dynamic = "force-static";

const PAGE_TITLE = "GEO 심화 AIPBL: robots.txt, 구조화 데이터, llms.txt 기술 점검";
// AEO 정의 문장: 헤더 도입부, JSON-LD description과 삼중 정렬
const PAGE_DESC =
  "GEO 심화 AIPBL은 AI 크롤러 접근, 구조화 데이터, llms.txt까지 사이트의 기술 층을 점검하는 프로젝트 실습입니다. 목업 사이트의 robots.txt 차단을 풀고, JSON-LD 이름표를 붙이고, 사이트 안내문 llms.txt를 만듭니다.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESC,
  alternates: { canonical: `${SITE_URL}/ai-practice/geo-advanced` },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESC,
    type: "website",
    url: `${SITE_URL}/ai-practice/geo-advanced`,
    images: [{ url: `${SITE_URL}/og-default.png`, width: 1200, height: 630 }],
  },
};

export default function GeoAdvancedPage() {
  // 메타 description, 본문 도입부와 개체, 정의 표현을 일치시킨 구조화 데이터 (삼중 정렬)
  const learningResourceLd = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    "@id": `${SITE_URL}/ai-practice/geo-advanced#learningresource`,
    name: PAGE_TITLE,
    url: `${SITE_URL}/ai-practice/geo-advanced`,
    description: PAGE_DESC,
    inLanguage: "ko",
    learningResourceType: "프로젝트 기반 학습(PBL)",
    about: ["GEO(생성형 엔진 최적화)", "AI 검색 최적화"],
    teaches: ["AI 크롤러 robots.txt 점검", "JSON-LD 구조화 데이터 추가", "llms.txt 작성"],
    educationalLevel: "심화",
    timeRequired: "PT15M",
    isPartOf: { "@id": `${SITE_URL}/ai-practice#learningresource` },
  };

  return (
    <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <ViewTracker contentType="ai_practice" contentSlug="geo-advanced" contentTitle="GEO 심화" />
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
        index="06"
        code="GEO Advanced"
        title="GEO 심화"
        description={PAGE_DESC}
        meta={[
          { iconSrc: "/images/ai-practice/icons/difficulty.png", text: "난이도 심화" },
          { iconSrc: "/images/ai-practice/icons/time.png", text: "약 15분" },
          { iconSrc: "/images/ai-practice/icons/missions.png", text: "미션 3개 + 점검 퀴즈" },
          { iconSrc: "/images/ai-practice/icons/output.png", text: "결과물: GEO 기술 점검 카드 1개" },
        ]}
        track={{
          label: "GEO 트랙",
          steps: [
            { id: "geo-basics", label: "기초", href: "/ai-practice/geo-basics" },
            { id: "geo-intermediate", label: "중급", href: "/ai-practice/geo-intermediate" },
            { id: "geo-advanced", label: "심화" },
          ],
          current: 2,
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
          GEO 심화 AIPBL은 목업 사이트와 실습 채팅을 나란히 놓고 진행하는 실습이라 PC
          브라우저에서만 제공됩니다. PC에서 지금 이 주소로 다시 접속해 주세요.
        </p>
        <p className="inline-block px-4 py-2 rounded-full border border-[#e5e7eb] bg-[#f9fafb] font-mono text-xs text-[#333333] mb-6 break-all">
          {SITE_URL.replace(/^https?:\/\//, "")}/ai-practice/geo-advanced
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
        <GeoAdvancedLab />
      </div>

      {/* 학습 요약: 실습 진행 없이도 읽히는 정적 콘텐츠 (SEO, AEO, GEO 대응) */}
      <section className="mt-14 sm:mt-20">
        <p className="ap-label mb-3">Learning Summary</p>
        <h2 className="text-xl sm:text-3xl font-semibold tracking-tight mb-5">
          이 AIPBL에서 배우는 것
        </h2>
        <p className="text-sm sm:text-base leading-relaxed text-[var(--ap-muted)] max-w-3xl mb-8">
          GEO의 기술 층은 크롤러 접근, 구조화 데이터, llms.txt 세 가지입니다. GEO 심화
          AIPBL은 robots.txt에서 AI 크롤러 차단을 풀고, JSON-LD로 정보에 이름표를 붙이고,
          사이트 안내문 llms.txt를 만드는 순서로 기술 층 전체를 점검하는 구성입니다.
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
          <h3 className="font-semibold text-base mb-2">실습 결과물: GEO 기술 점검 카드</h3>
          <p className="text-sm leading-relaxed text-[var(--ap-muted)] mb-4">
            실습을 마치면 아래 점검 카드를 결과물로 가져갑니다. 내 사이트의 robots.txt와
            구조화 데이터, llms.txt 상태를 대괄호 항목에 대입해 검사하는 방식으로 사용합니다.
          </p>
          <pre className="ap-prompt p-5 overflow-x-auto">{FINAL_TEMPLATE}</pre>
        </div>
      </section>
    </div>
  );
}
