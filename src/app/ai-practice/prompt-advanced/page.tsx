import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Monitor } from "lucide-react";
import { SITE_URL } from "@/lib/constants";
import { ViewTracker } from "@/components/ViewTracker";
import { AipblHeader } from "@/components/ai-practice/AipblHeader";
import { PromptAdvancedLab } from "@/components/ai-practice/prompt-advanced/PromptAdvancedLab";
import { FINAL_TEMPLATE } from "@/components/ai-practice/prompt-advanced/lab-data";

/** 검색, 답변 엔진이 실습 진행 없이도 읽을 수 있는 세 기술 정의문 (AEO 단정형) */
const ELEMENT_DEFINITIONS = [
  {
    name: "제약 조건",
    definition:
      "제약 조건은 결과물이 지켜야 할 기준을 숫자와 목록으로 정하는 기술입니다. 기준이 구체적일수록 결과의 편차와 다시 요청하는 횟수가 줄어듭니다.",
  },
  {
    name: "자기 점검",
    definition:
      "자기 점검은 작성한 결과를 기준과 비교해 AI가 스스로 검토하게 만드는 기술입니다. 사람이 눈으로 확인하던 검수 시간이 줄어듭니다.",
  },
  {
    name: "메타 프롬프트",
    definition:
      "메타 프롬프트는 프롬프트 자체의 설계를 AI에게 맡기는 기술입니다. 반복 업무마다 나에게 맞는 템플릿을 만들 수 있습니다.",
  },
];

export const dynamic = "force-static";

const PAGE_TITLE = "프롬프트 심화 AIPBL: 제약 조건, 자기 점검, 메타 프롬프트";
const PAGE_DESC =
  "프롬프트 심화 AIPBL에서는 제약 조건 걸기, 스스로 점검하게 하기, 메타 프롬프트 세 가지 기술을 실습으로 배울 수 있습니다. 결과물의 기준을 정하고 AI가 스스로 검토하게 만들면, 사람이 결과를 다듬는 시간을 크게 줄일 수 있습니다.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESC,
  alternates: { canonical: `${SITE_URL}/ai-practice/prompt-advanced` },
  // 초안 단계: 공개 확정 시 noindex 제거
  robots: { index: false, follow: false },
};

export default function PromptAdvancedPage() {
  // 메타 description, 본문 도입부와 개체, 정의 표현을 일치시킨 구조화 데이터 (삼중 정렬)
  const learningResourceLd = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    "@id": `${SITE_URL}/ai-practice/prompt-advanced#learningresource`,
    name: PAGE_TITLE,
    url: `${SITE_URL}/ai-practice/prompt-advanced`,
    description: PAGE_DESC,
    inLanguage: "ko",
    learningResourceType: "프로젝트 기반 학습(PBL)",
    about: ["프롬프트 엔지니어링", "프롬프트 작성"],
    teaches: ["제약 조건 걸기", "자기 점검", "메타 프롬프트"],
    educationalLevel: "심화",
    timeRequired: "PT20M",
    isPartOf: { "@id": `${SITE_URL}/ai-practice#learningresource` },
  };

  return (
    <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <ViewTracker
        contentType="ai_practice"
        contentSlug="prompt-advanced"
        contentTitle="프롬프트 심화"
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
        index="03"
        code="Prompt Advanced"
        title="프롬프트 심화"
        description="프롬프트 심화 AIPBL에서는 제약 조건 걸기, 스스로 점검하게 하기, 메타 프롬프트 세 가지 기술을 실습으로 배울 수 있습니다. 결과물의 기준을 정하고 AI가 스스로 검토하게 만들면, 사람이 결과를 다듬는 시간을 크게 줄일 수 있습니다."
        meta={[
          { iconSrc: "/images/ai-practice/icons/difficulty.png", text: "난이도 심화" },
          { iconSrc: "/images/ai-practice/icons/time.png", text: "약 20분" },
          { iconSrc: "/images/ai-practice/icons/missions.png", text: "미션 3개 + 점검 퀴즈" },
          { iconSrc: "/images/ai-practice/icons/output.png", text: "결과물: 프롬프트 종합 템플릿 1개" },
        ]}
        track={{
          label: "프롬프트 트랙",
          steps: [
            { id: "prompt-basics", label: "기초", href: "/ai-practice/prompt-basics" },
            { id: "prompt-intermediate", label: "중급", href: "/ai-practice/prompt-intermediate" },
            { id: "prompt-advanced", label: "심화" },
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
          프롬프트 심화 AIPBL은 안내 패널과 실습 채팅을 나란히 놓고 진행하는 실습이라 PC
          브라우저에서만 제공됩니다. PC에서 지금 이 주소로 다시 접속해 주세요.
        </p>
        <p className="inline-block px-4 py-2 rounded-full border border-[#e5e7eb] bg-[#f9fafb] font-mono text-xs text-[#333333] mb-6 break-all">
          {SITE_URL.replace(/^https?:\/\//, "")}/ai-practice/prompt-advanced
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
        <PromptAdvancedLab />
      </div>

      {/* 학습 요약: 실습 진행 없이도 읽히는 정적 콘텐츠 (SEO, AEO, GEO 대응) */}
      <section className="mt-14 sm:mt-20">
        <p className="ap-label mb-3">Learning Summary</p>
        <h2 className="text-xl sm:text-3xl font-semibold tracking-tight mb-5">
          이 AIPBL에서 배우는 것
        </h2>
        <p className="text-sm sm:text-base leading-relaxed text-[var(--ap-muted)] max-w-3xl mb-8">
          프롬프트 심화의 세 기술은 제약 조건, 자기 점검, 메타 프롬프트입니다. 프롬프트 심화
          AIPBL은 이 세 기술을 실습 채팅에서 하나씩 적용해 보며, 결과물의 품질을 프롬프트
          단계에서 관리하는 방법을 확인하는 구성입니다.
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
          <h3 className="font-semibold text-base mb-2">실습 결과물: 프롬프트 종합 템플릿</h3>
          <p className="text-sm leading-relaxed text-[var(--ap-muted)] mb-4">
            실습을 마치면 프롬프트 트랙 세 단계의 기술을 모두 담은 아래 종합 템플릿을 결과물로
            가져갑니다. 대괄호를 내 업무 내용으로 채워 실제 AI에게 붙여 넣는 방식으로 사용합니다.
          </p>
          <pre className="ap-prompt p-5 overflow-x-auto">{FINAL_TEMPLATE}</pre>
        </div>
      </section>
    </div>
  );
}
