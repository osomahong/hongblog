import { Metadata } from "next";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { SITE_URL, SITE_NAME, SECTION_LABELS } from "@/lib/constants";
import { EventLink } from "@/components/ai-practice/EventLink";
import { GradientStream } from "@/components/ai-practice/GradientStream";
import { HeroMethodButton } from "@/components/ai-practice/HeroMethodButton";
import { PracticeDashboard } from "@/components/ai-practice/PracticeDashboard";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { ListViewTracker } from "@/components/ListViewTracker";

export const dynamic = "force-static";

const PAGE_TITLE = "PBL 기반 AI Self Education";
// layout의 title template은 하위 세그먼트에만 적용되고 같은 세그먼트의 page는 건너뛴다.
// 그래서 섹션 루트인 이 페이지는 라벨과 브랜드를 붙인 완성형을 직접 지정한다.
const FULL_TITLE = `${SECTION_LABELS.aiPractice} | ${PAGE_TITLE} | ${SITE_NAME}`;
// AEO 정의 문장: 히어로 도입부, JSON-LD description과 삼중 정렬
const PAGE_DESC =
  "AI-PRACTICE는 실습으로 AI와 AX(AI 전환)를 배우는 PBL 기반 AI Self Education 웹사이트입니다. 모든 교육은 웹사이트 안의 실습 화면에서 정해진 패턴의 AIPBL(프로젝트 기반 AI 실습)로 진행됩니다.";

export const metadata: Metadata = {
  title: { absolute: FULL_TITLE },
  description: PAGE_DESC,
  alternates: { canonical: `${SITE_URL}/ai-practice` },
  // og 제목은 섹션 라벨과 브랜드 없이 페이지 제목만 쓴다 (브랜드는 og:site_name)
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESC,
    type: "website",
    url: `${SITE_URL}/ai-practice`,
    images: [{ url: `${SITE_URL}/og-default.png`, width: 1200, height: 630 }],
  },
};

/** AIPBL의 고정 진행 패턴 */
const PBL_STEPS = [
  {
    step: "01",
    title: "과제 확인",
    body: "이번 AIPBL에서 만들 결과물과 진행 순서를 확인합니다.",
  },
  {
    step: "02",
    title: "수행",
    body: "안내에 따라 실습 화면 안에서 과제를 수행합니다.",
  },
  {
    step: "03",
    title: "점검",
    body: "단계마다 제시되는 기준과 비교해 결과를 점검합니다.",
  },
  {
    step: "04",
    title: "정리",
    body: "수행한 내용을 정리하고, 내 업무에 적용할 지점을 기록합니다.",
  },
];

/** AIPBL 커리큘럼 영역. href가 있으면 열린 AIPBL, 없으면 준비 중. */
const CURRICULUM = [
  {
    iconSrc: "/images/ai-practice/icons/curriculum-prompt.png",
    title: "프롬프트 기초",
    body: "역할, 맥락, 형식 3요소부터 예시, 단계, 검증까지 다루는 AIPBL입니다. 프롬프트 트랙은 기초, 중급, 심화 3단계가 모두 열려 있습니다.",
    href: "/ai-practice/prompt-basics",
  },
  {
    iconSrc: "/images/ai-practice/icons/sparkle-ai.png",
    title: "GEO 기초",
    body: "가상의 복숭아 농장 목업 사이트를 AI 답변에 인용되게 만들어 보는 AIPBL입니다. GEO 트랙은 기초, 중급, 심화 3단계가 모두 열려 있습니다.",
    href: "/ai-practice/geo-basics",
  },
  {
    iconSrc: "/images/ai-practice/icons/curriculum-automation.png",
    title: "AI 업무 자동화",
    body: "요약, 초안, 정리처럼 매주 반복되는 업무를 AI에게 맡기는 구조를 만듭니다.",
    href: null,
  },
  {
    iconSrc: "/images/ai-practice/icons/curriculum-vibecoding.png",
    title: "바이브코딩 입문",
    body: "코드 지식 없이 말로 설명해서 작동하는 웹 페이지를 만드는 과정을 다룹니다.",
    href: null,
  },
];

export default function AiPracticePage() {
  // 메타 description, 본문 도입부와 개체, 정의 표현을 일치시킨 구조화 데이터 (삼중 정렬)
  const learningResourceLd = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    "@id": `${SITE_URL}/ai-practice#learningresource`,
    name: PAGE_TITLE,
    url: `${SITE_URL}/ai-practice`,
    description: PAGE_DESC,
    inLanguage: "ko",
    learningResourceType: "프로젝트 기반 학습(PBL)",
    teaches: ["AI 활용", "AX", "프롬프트 엔지니어링", "AI 업무 자동화", "바이브코딩"],
    educationalLevel: "입문부터 심화",
    isPartOf: { "@id": `${SITE_URL}/#website` },
  };

  return (
    <div className="relative">
      <ListViewTracker eventName="view_ai_practice_list" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(learningResourceLd) }}
      />
      {/* Hero */}
      <section className="relative overflow-hidden">
        <GradientStream className="ap-stream bottom-[-30px] sm:bottom-[-60px]" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center pt-16 sm:pt-28 pb-48 sm:pb-72">
          <p className="ap-label mb-6">AI-Practice</p>
          <h1 className="text-3xl sm:text-6xl font-medium tracking-tight leading-tight mb-6">
            실습으로 배우는
            <br />
            <span className="ap-gradient-text">PBL 기반 AI Self Education</span>
          </h1>
          <p className="text-sm sm:text-lg leading-relaxed text-[var(--ap-muted)] max-w-2xl mx-auto mb-10">
            AI-PRACTICE는 실습으로 AI와 AX(AI 전환)를 배우는 PBL 기반 AI Self Education
            웹사이트입니다. AI를 쓰는 사람은 많아졌지만, 사용 범위는 채팅창에 기초적인 질문을
            하는 수준에 머무는 경우가 많습니다. 그 지점에서 출발해, 정해진 패턴의 프로젝트
            실습을 따라가면서 사용 범위를 한 단계씩 넓히는 것이 목표입니다.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <EventLink
              href="/ai-practice/prompt-basics"
              eventName="click_aipractice_start"
              params={{ content_id: "prompt-basics", content_name: "프롬프트 기초", button_name: "hero" }}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#ff0033] text-white text-sm font-semibold hover:bg-[#e0002d] transition-colors"
            >
              첫 AIPBL 시작하기: 프롬프트 기초
            </EventLink>
            <HeroMethodButton />
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 내 학습 기록: localStorage 기반 대시보드 */}
        <PracticeDashboard />

        <div className="ap-hairline max-w-3xl mx-auto mb-16 sm:mb-20" aria-hidden />

        {/* 수업 방식: PBL */}
        <section id="method" className="relative mb-16 sm:mb-20 scroll-mt-24">
          <div className="ap-glow w-[480px] h-[480px] left-[-260px] top-[-80px] bg-[rgba(167,139,250,0.10)]" aria-hidden />
          <div className="relative">
            <p className="ap-label mb-3">Learning Method</p>
            <h2 className="text-xl sm:text-3xl font-semibold tracking-tight mb-5">
              수업 방식: 프로젝트 기반 학습
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-[var(--ap-muted)] max-w-3xl mb-10">
              PBL(Project Based Learning)은 개념 설명을 먼저 듣는 대신, 작은 프로젝트를 수행하면서
              필요한 개념을 익히는 학습 방식입니다. 이 안에서 진행되는 모든 교육은 아래 네 단계
              과정으로 진행됩니다. 이렇게 진행하는 프로젝트 한 편을 AIPBL(AI Project)로 부릅니다.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {PBL_STEPS.map(({ step, title, body }) => (
                <SpotlightCard
                  key={step}
                  className="ap-card ap-card-accent p-6 sm:p-7"
                  spotlightColor="rgba(125, 211, 252, 0.12)"
                  radius={360}
                >
                  <span className="ap-step-index mb-4">{step}</span>
                  <h3 className="font-semibold text-base mb-2">{title}</h3>
                  <p className="text-sm leading-relaxed text-[var(--ap-muted)]">{body}</p>
                </SpotlightCard>
              ))}
            </div>
          </div>
        </section>

        <div className="ap-hairline max-w-3xl mx-auto mb-16 sm:mb-20" aria-hidden />

        {/* 진행 환경: web in web */}
        <section className="relative mb-16 sm:mb-20">
          <div className="ap-glow w-[520px] h-[520px] right-[-280px] top-[60px] bg-[rgba(255,92,125,0.09)]" aria-hidden />
          <div className="relative">
            <p className="ap-label mb-3">Practice Environment</p>
            <h2 className="text-xl sm:text-3xl font-semibold tracking-tight mb-5">
              진행 환경: 웹 안의 실습 화면
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-[var(--ap-muted)] max-w-3xl mb-10">
              AIPBL은 별도 프로그램 설치 없이 이 웹사이트 안의 실습 화면에서 진행됩니다. 왼쪽에는
              단계별 안내가, 오른쪽에는 수행 영역이 함께 표시됩니다. 안내를 보면서 같은 화면에서
              바로 수행하는 구조입니다.
            </p>

            {/* 실습 화면 미리보기 (정적 목업) */}
            <div className="ap-card ap-card-accent overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
                <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
                <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
                <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
                <span className="ml-3 text-[11px] font-mono text-[var(--ap-muted)]">
                  AIPBL 화면 미리보기: 준비 중인 화면 구성입니다
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-[280px_1fr]">
                {/* 좌: 안내 패널 */}
                <div className="border-b md:border-b-0 md:border-r border-white/10 p-5 sm:p-6">
                  <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-[var(--ap-muted)] mb-4">
                    진행 안내
                  </p>
                  <ol className="space-y-3 text-sm">
                    <li className="flex items-center gap-2.5 text-gray-200">
                      <CheckCircle2 className="w-4 h-4 text-[#7dd3fc]" strokeWidth={1.5} />
                      과제 확인
                    </li>
                    <li className="flex items-center gap-2.5 text-white font-medium">
                      <span className="w-4 h-4 rounded-full border border-white/40 flex items-center justify-center text-[9px]">
                        2
                      </span>
                      수행
                    </li>
                    <li className="flex items-center gap-2.5 text-[var(--ap-muted)]">
                      <span className="w-4 h-4 rounded-full border border-white/15 flex items-center justify-center text-[9px]">
                        3
                      </span>
                      점검
                    </li>
                    <li className="flex items-center gap-2.5 text-[var(--ap-muted)]">
                      <span className="w-4 h-4 rounded-full border border-white/15 flex items-center justify-center text-[9px]">
                        4
                      </span>
                      정리
                    </li>
                  </ol>
                  <div className="mt-6 pt-5 border-t border-white/10">
                    <p className="text-xs leading-relaxed text-[var(--ap-muted)]">
                      현재 단계의 안내문이 이 영역에 표시됩니다. 안내는 한 번에 한 단계씩
                      제공됩니다.
                    </p>
                  </div>
                </div>
                {/* 우: 수행 패널 */}
                <div className="p-5 sm:p-6">
                  <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-[var(--ap-muted)] mb-4">
                    수행 영역
                  </p>
                  <div className="space-y-2.5 mb-5">
                    <div className="h-3 w-3/4 rounded bg-white/8" />
                    <div className="h-3 w-1/2 rounded bg-white/8" />
                  </div>
                  <div className="rounded-[12px] border border-white/10 bg-white/[0.02] p-4 mb-4">
                    <div className="h-3 w-2/3 rounded bg-white/6 mb-2.5" />
                    <div className="h-3 w-5/6 rounded bg-white/6 mb-2.5" />
                    <div className="h-3 w-2/5 rounded bg-white/6" />
                  </div>
                  <div className="flex justify-end">
                    <span className="inline-flex items-center px-5 py-2 rounded-full bg-white/8 text-xs font-medium text-gray-300">
                      결과 점검
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="ap-hairline max-w-3xl mx-auto mb-16 sm:mb-20" aria-hidden />

        {/* AIPBL 커리큘럼 */}
        <section className="relative pb-8 sm:pb-12">
          <div className="ap-glow w-[460px] h-[460px] left-[-240px] top-[40px] bg-[rgba(255,215,0,0.06)]" aria-hidden />
          <div className="relative">
            <p className="ap-label mb-3">Curriculum</p>
            <h2 className="text-xl sm:text-3xl font-semibold tracking-tight mb-5">
              AIPBL 커리큘럼
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-[var(--ap-muted)] max-w-3xl mb-10">
              프롬프트 트랙과 GEO 트랙의 기초, 중급, 심화 AIPBL이 모두 열렸습니다.
              나머지 영역도 순서대로 준비하고 있으며, 새 AIPBL이 열리면 이 페이지에서
              안내합니다. AIPBL 실습 화면은 PC 브라우저에서 제공됩니다.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
              {CURRICULUM.map(({ iconSrc, title, body, href }, i) =>
                href ? (
                  <EventLink
                    key={title}
                    href={href}
                    eventName="click_aipractice_start"
                    params={{
                      content_id: href.split("/").pop(),
                      content_name: title,
                      button_name: "curriculum",
                      position: i + 1,
                    }}
                    className="block"
                  >
                    <SpotlightCard
                      className="ap-card ap-card-accent ap-card-hover p-6 sm:p-7 h-full"
                      spotlightColor="rgba(255, 215, 0, 0.10)"
                      radius={360}
                    >
                      <div className="flex items-center justify-between gap-3 mb-4">
                        <img
                          src={iconSrc}
                          alt=""
                          aria-hidden
                          className="ap-icon-3d w-10 h-10"
                        />
                        <span className="px-2.5 py-1 rounded-full border border-[rgba(255,215,0,0.5)] text-[11px] font-medium text-[#ffe08a] flex-shrink-0">
                          지금 시작
                        </span>
                      </div>
                      <h3 className="font-semibold text-base mb-2 flex items-center gap-2">
                        {title} <ArrowRight className="w-4 h-4" strokeWidth={1.8} />
                      </h3>
                      <p className="text-sm leading-relaxed text-[var(--ap-muted)]">{body}</p>
                    </SpotlightCard>
                  </EventLink>
                ) : (
                  <SpotlightCard
                    key={title}
                    className="ap-card ap-card-accent p-6 sm:p-7"
                    spotlightColor="rgba(255, 255, 255, 0.06)"
                    radius={360}
                  >
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <img
                        src={iconSrc}
                        alt=""
                        aria-hidden
                        className="ap-icon-3d w-10 h-10 opacity-60 saturate-50"
                      />
                      <span className="px-2.5 py-1 rounded-full border border-white/15 text-[11px] font-medium text-[var(--ap-muted)] flex-shrink-0">
                        준비 중
                      </span>
                    </div>
                    <h3 className="font-semibold text-base mb-2">{title}</h3>
                    <p className="text-sm leading-relaxed text-[var(--ap-muted)]">{body}</p>
                  </SpotlightCard>
                )
              )}
            </div>
          </div>
        </section>
      </div>

      {/* 하단 마감: 리본 잔상. 리본 띠를 영역 정중앙에 고정해 어느 화면 폭에서도 잘리지 않는다 */}
      <div className="relative h-36 sm:h-48 overflow-hidden opacity-80" aria-hidden>
        <GradientStream className="ap-stream ap-stream-center" />
      </div>
    </div>
  );
}
