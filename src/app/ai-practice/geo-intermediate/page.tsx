import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Monitor } from "lucide-react";
import { SITE_URL } from "@/lib/constants";
import { ViewTracker } from "@/components/ViewTracker";
import { AipblHeader } from "@/components/ai-practice/AipblHeader";
import { GeoIntermediateLab } from "@/components/ai-practice/geo-intermediate/GeoIntermediateLab";
import { FINAL_TEMPLATE } from "@/components/ai-practice/geo-intermediate/lab-data";

/** 검색, 답변 엔진이 실습 진행 없이도 읽을 수 있는 3요소 정의문 (AEO 단정형) */
const ELEMENT_DEFINITIONS = [
  {
    name: "근거 단정형 문장",
    definition:
      "근거 단정형 문장은 단정형 종결, 수치와 기간, 산출 기준 세 조건을 갖춘 문장입니다. 감상형 문장과 달리 AI가 답변의 근거로 그대로 옮겨 쓸 수 있습니다.",
  },
  {
    name: "질문 조건 매칭",
    definition:
      "질문 조건 매칭은 질문의 조건과 일치하는 근거가 인용된다는 원리입니다. 근거가 없는 질문은 잡지 않는 것도 GEO 전략의 일부입니다.",
  },
  {
    name: "구조 보강",
    definition:
      "구조 보강은 정의문, 산출 기준, 질문 문형 FAQ로 페이지를 보강하는 작업입니다. 인용 근거가 문장 단위에서 페이지 구조로 확장됩니다.",
  },
];

export const dynamic = "force-static";

const PAGE_TITLE = "GEO 중급 AIPBL: 인용되는 문장의 세 조건과 구조 보강";
// AEO 정의 문장: 헤더 도입부, JSON-LD description과 삼중 정렬
const PAGE_DESC =
  "GEO 중급 AIPBL은 인용되기 좋은 문장의 세 조건을 익히고 페이지 구조를 보강하는 프로젝트 실습입니다. 기초에서 만든 목업 사이트의 근거 문장을 다듬고, 질문 조건에 근거를 매칭하고, 정의문과 산출 기준과 FAQ를 추가합니다.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESC,
  alternates: { canonical: `${SITE_URL}/ai-practice/geo-intermediate` },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESC,
    type: "website",
    url: `${SITE_URL}/ai-practice/geo-intermediate`,
    images: [{ url: `${SITE_URL}/og-default.png`, width: 1200, height: 630 }],
  },
};

export default function GeoIntermediatePage() {
  // 메타 description, 본문 도입부와 개체, 정의 표현을 일치시킨 구조화 데이터 (삼중 정렬)
  const learningResourceLd = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    "@id": `${SITE_URL}/ai-practice/geo-intermediate#learningresource`,
    name: PAGE_TITLE,
    url: `${SITE_URL}/ai-practice/geo-intermediate`,
    description: PAGE_DESC,
    inLanguage: "ko",
    learningResourceType: "프로젝트 기반 학습(PBL)",
    about: ["GEO(생성형 엔진 최적화)", "AI 검색 최적화"],
    teaches: ["근거 단정형 문장 작성", "질문 조건 매칭", "정의문과 FAQ 구조 보강"],
    educationalLevel: "중급",
    timeRequired: "PT15M",
    isPartOf: { "@id": `${SITE_URL}/ai-practice#learningresource` },
  };

  return (
    <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <ViewTracker
        contentType="ai_practice"
        contentSlug="geo-intermediate"
        contentTitle="GEO 중급"
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
        index="05"
        code="GEO Intermediate"
        title="GEO 중급"
        description={PAGE_DESC}
        meta={[
          { iconSrc: "/images/ai-practice/icons/difficulty.png", text: "난이도 중급" },
          { iconSrc: "/images/ai-practice/icons/time.png", text: "약 15분" },
          { iconSrc: "/images/ai-practice/icons/missions.png", text: "미션 3개 + 점검 퀴즈" },
          { iconSrc: "/images/ai-practice/icons/output.png", text: "결과물: 인용 문장 점검 카드 1개" },
        ]}
        track={{
          label: "GEO 트랙",
          steps: [
            { id: "geo-basics", label: "기초", href: "/ai-practice/geo-basics" },
            { id: "geo-intermediate", label: "중급" },
            { id: "geo-advanced", label: "심화", href: "/ai-practice/geo-advanced" },
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
          GEO 중급 AIPBL은 목업 사이트와 실습 채팅을 나란히 놓고 진행하는 실습이라 PC
          브라우저에서만 제공됩니다. PC에서 지금 이 주소로 다시 접속해 주세요.
        </p>
        <p className="inline-block px-4 py-2 rounded-full border border-[#e5e7eb] bg-[#f9fafb] font-mono text-xs text-[#333333] mb-6 break-all">
          {SITE_URL.replace(/^https?:\/\//, "")}/ai-practice/geo-intermediate
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
        <GeoIntermediateLab />
      </div>

      {/* 학습 요약: 실습 진행 없이도 읽히는 정적 콘텐츠 (SEO, AEO, GEO 대응) */}
      <section className="mt-14 sm:mt-20">
        <p className="ap-label mb-3">Learning Summary</p>
        <h2 className="text-xl sm:text-3xl font-semibold tracking-tight mb-5">
          이 AIPBL에서 배우는 것
        </h2>
        <p className="text-sm sm:text-base leading-relaxed text-[var(--ap-muted)] max-w-3xl mb-8">
          인용되기 좋은 문장의 세 조건은 단정형, 수치와 기간, 산출 기준입니다. GEO 중급
          AIPBL은 이 조건으로 문장을 다듬고, 질문 조건에 근거를 매칭하고, 정의문과 산출
          기준과 질문 문형 FAQ로 페이지 구조를 보강하는 구성입니다.
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
          <h3 className="font-semibold text-base mb-2">실습 결과물: GEO 인용 문장 점검 카드</h3>
          <p className="text-sm leading-relaxed text-[var(--ap-muted)] mb-4">
            실습을 마치면 아래 점검 카드를 결과물로 가져갑니다. 내 사이트의 대표 문장을
            대괄호 항목에 대입해 검사하는 방식으로 사용합니다.
          </p>
          <pre className="ap-prompt p-5 overflow-x-auto">{FINAL_TEMPLATE}</pre>
        </div>
      </section>
    </div>
  );
}
