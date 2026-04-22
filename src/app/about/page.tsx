import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { SITE_URL } from "@/lib/constants";
import { absoluteUrl } from "@/lib/utils";
import {
  ArrowRight,
  MessageSquare,
  BookOpen,
  Layers,
  Award,
  Users,
  Building2,
  GraduationCap,
  CalendarDays,
  Tag,
  FileText,
  GitBranch,
  UserCheck,
  Lock,
  Smartphone,
  Database,
  Workflow,
} from "lucide-react";
import { NeoButton } from "@/components/neo";
import { NeoTiltCard } from "@/components/neo";
import { ViewTracker } from "@/components/ViewTracker";

const BASE_YEAR = 2017;
const REFERENCE_YEAR = 2026;
const YEARS_OF_EXPERIENCE = REFERENCE_YEAR - BASE_YEAR + 1;
const CLIENT_COUNT_LABEL = "120곳+";

export const metadata: Metadata = {
  title: "About | GA4·GTM·AEO 전문가",
  description: `${YEARS_OF_EXPERIENCE}년차 디지털 마케터·데이터 분석가. 한국관광공사, 교보문고, 유진투자증권 등 ${CLIENT_COUNT_LABEL} 기업·기관의 GA4·GTM 환경 구축, 누적 1,000명 이상 실무 교육. 설명 가능한 마케팅과 AEO·GEO 전문성을 공유합니다.`,
  alternates: { canonical: `${SITE_URL}/about` },
  openGraph: {
    title: "About | 준이아빠블로그",
    description: `${YEARS_OF_EXPERIENCE}년차 마케터·데이터 분석가. GA4·GTM 분석 환경 구축, AEO·GEO 실무 전문가.`,
  },
};

const stats = [
  {
    icon: CalendarDays,
    value: `${YEARS_OF_EXPERIENCE}년차`,
    label: "디지털 마케팅 경력",
    sub: `${BASE_YEAR}년~${REFERENCE_YEAR}년 기준`,
  },
  {
    icon: Building2,
    value: CLIENT_COUNT_LABEL,
    label: "누적 고객사 프로젝트",
    sub: "최근 5년 누적 기준",
  },
  {
    icon: Tag,
    value: "3,000+",
    label: "누적 설계 이벤트·파라미터",
    sub: "고객사당 20~30개 × 120곳+",
  },
  {
    icon: Users,
    value: "1,000명+",
    label: "누적 실무 교육 수강자",
    sub: "기업 담당자·공공 아카데미",
  },
  {
    icon: BookOpen,
    value: "93편",
    label: "공개 인사이트·Class",
    sub: "GA4·AEO·GEO·AI 실전 해설",
  },
  {
    icon: GraduationCap,
    value: "12개+",
    label: "산업군 경험",
    sub: "공공·금융·이커머스·제조 외",
  },
];

const representativeClients = [
  "신세계면세점",
  "신세계사이먼",
  "혼다코리아모터사이클",
  "안랩",
  "베스핀글로벌",
  "반다이남코코리아",
  "스케쳐스코리아",
  "이벤터스",
  "도매꾹",
  "고려대학교",
  "연세대학교",
  "한림대학교",
  "사이버한국외국어대학교",
  "한국관광공사(KTO)",
  "교보문고",
  "유진투자증권",
];

const educationPartners = [
  "KOTRA 아카데미",
  "사회적기업진흥원",
  "기업 내부 담당자 교육",
];

const principles = [
  {
    title: "감으로 설명하지 않습니다",
    desc: "마케팅 성과는 데이터로 증명하고, 구조로 설명합니다. 결과가 나온 이유를 재현 가능한 형태로 남깁니다.",
  },
  {
    title: "전문가 용어로 숨기지 않습니다",
    desc: "담당자·경영진·실무진 누구나 읽을 수 있는 언어로 정리합니다. 낯선 개념은 비유와 예시로 먼저 연결합니다.",
  },
  {
    title: "직접 쓰고, 직접 운영합니다",
    desc: "이 사이트의 기획·구현·콘텐츠를 직접 운영합니다. 일반 기업이 겪는 문제를 같은 자리에서 부딪쳐 배웁니다.",
  },
];

export default async function AboutPage() {
  const personLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "준이아빠",
    alternateName: "Hong (준이아빠)",
    url: absoluteUrl("/about"),
    image: absoluteUrl("/profile-illustration.png"),
    jobTitle: "디지털 마케팅·데이터 분석 컨설턴트",
    description: `${YEARS_OF_EXPERIENCE}년차 디지털 마케터. ${CLIENT_COUNT_LABEL} 고객사의 GA4·GTM 분석 환경 구축, AEO·GEO 실무 전문가. 누적 1,000명 이상 교육 경력.`,
    knowsAbout: [
      "Google Analytics 4",
      "Google Tag Manager",
      "Answer Engine Optimization",
      "Generative Engine Optimization",
      "퍼포먼스 마케팅",
      "그로스해킹",
      "퍼널 분석",
      "데이터 시각화",
      "AI 워크플로우",
      "프롬프트 엔지니어링",
    ],
    knowsLanguage: ["ko", "en"],
    hasOccupation: {
      "@type": "Occupation",
      name: "디지털 마케팅 컨설턴트 · 데이터 분석가",
      occupationLocation: { "@type": "Country", name: "대한민국" },
      skills: "GA4, GTM, BigQuery, LookerStudio, AEO, GEO, LLM, Python",
    },
    sameAs: [SITE_URL],
  };

  const organizationLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "준이아빠블로그",
    url: SITE_URL,
    logo: absoluteUrl("/favicon.ico"),
    founder: { "@type": "Person", name: "준이아빠" },
    description: "GA4·GTM·AEO·GEO 실무 인사이트를 공유하는 디지털 마케팅 지식 아카이브.",
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
      />
      <ViewTracker
        contentType="about"
        contentTitle="About"
        contentSlug="about"
      />

      {/* Hero Section */}
      <section className="mb-12 sm:mb-16">
        <NeoTiltCard
          className="bg-white neo-border-thick neo-shadow-lg p-6 sm:p-10 relative overflow-hidden text-left"
          intensity={20}
          shadowIntensity={10}
        >
          <div
            className="absolute top-0 right-0 w-24 sm:w-32 h-full bg-[#FF0033] hidden sm:block"
            style={{ clipPath: "polygon(20% 0, 100% 0, 100% 100%, 0% 100%)", zIndex: 0 }}
          />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full border-3 border-black overflow-hidden rotate-3">
                <Image
                  src="/profile-illustration.png"
                  alt="준이아빠 프로필 일러스트"
                  fill
                  className="object-cover object-top scale-125"
                />
              </div>
              <span className="inline-block bg-black text-white font-bold px-3 py-1 text-xs uppercase tracking-widest transform -skew-x-6">
                About Me
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-black leading-tight mb-4">
              디지털 환경의 문제에 답을 찾고,
              <br />
              <span className="text-[#FF0033]">근거와 지식으로</span> 컨설팅하고 있습니다.
            </h1>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed max-w-2xl">
              <strong>{YEARS_OF_EXPERIENCE}년차 디지털 마케터</strong>입니다. 신세계면세점·혼다코리아·안랩·베스핀글로벌 등 <strong>120곳 이상의 기업·기관</strong>에서 <strong>이벤트 택소노미 설계·GA4·GTM 분석 환경 구축·BigQuery 로우데이터 분석</strong>까지, 데이터로 마케팅을 설명 가능하게 만드는 일을 해왔습니다. 기업 담당자와 공공 아카데미에서 <strong>누적 1,000명 이상</strong>을 교육해왔고, 이 사이트는 그 과정에서 정리한 실무 인사이트 아카이브입니다.
              <span className="block mt-2 text-xs text-gray-500">
                {REFERENCE_YEAR}년 4월 기준
              </span>
            </p>
          </div>
        </NeoTiltCard>
      </section>

      {/* Credentials / Stats Section */}
      <section className="mb-12 sm:mb-16">
        <div className="flex items-center gap-2 mb-6">
          <div className="bg-black border-2 border-black p-1.5 -rotate-3">
            <Award className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black uppercase">
            어떤 경력을 쌓아왔을까요?
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const rotations = [
              "-rotate-1",
              "rotate-1",
              "rotate-0.5",
              "-rotate-0.5",
              "rotate-1",
              "-rotate-1",
            ];
            return (
              <NeoTiltCard
                key={stat.label}
                className={`bg-white border-4 border-black p-4 sm:p-5 ${rotations[index]}`}
                intensity={10}
              >
                <Icon className="w-6 h-6 mb-2 text-primary" />
                <div className="text-2xl sm:text-3xl font-black text-black leading-none mb-1">
                  {stat.value}
                </div>
                <div className="font-bold text-sm text-black mb-1">
                  {stat.label}
                </div>
                <div className="text-xs text-gray-500">{stat.sub}</div>
              </NeoTiltCard>
            );
          })}
        </div>
        <p className="mt-4 text-xs text-gray-500">
          수치는 {REFERENCE_YEAR}년 4월 기준이며, 공개 가능한 레퍼런스와 내부 기록을 근거로 집계했습니다.
        </p>
      </section>

      {/* Representative Clients */}
      <section className="mb-12 sm:mb-16">
        <NeoTiltCard
          className="bg-white border-4 border-black p-6 sm:p-8 rotate-0.5"
          intensity={12}
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-primary border-2 border-black p-1.5 rotate-2">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black uppercase">
              어떤 기업·기관과 일해왔을까요?
            </h2>
          </div>
          <p className="text-base sm:text-lg text-gray-700 mb-4 leading-relaxed">
            공공·금융·이커머스·제조·유통·면세·대학 교육 등 <strong>12개 이상 산업군</strong>에 걸쳐 <strong>{CLIENT_COUNT_LABEL} 고객사 프로젝트</strong>를 진행했습니다.
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {representativeClients.map((client) => (
              <span
                key={client}
                className="inline-block bg-gray-50 border-2 border-black text-black text-xs sm:text-sm font-bold px-3 py-1.5"
              >
                {client}
              </span>
            ))}
            <span className="inline-block bg-black text-white border-2 border-black text-xs sm:text-sm font-bold px-3 py-1.5">
              외 다수
            </span>
          </div>
          <div className="pt-4 border-t-2 border-black/20">
            <p className="text-sm text-gray-600 mb-2 font-bold">교육 협력 기관</p>
            <div className="flex flex-wrap gap-2">
              {educationPartners.map((partner) => (
                <span
                  key={partner}
                  className="inline-block bg-accent border-2 border-black text-black text-xs font-bold px-3 py-1"
                >
                  {partner}
                </span>
              ))}
            </div>
          </div>
        </NeoTiltCard>
      </section>

      {/* The Question Section */}
      <section className="mb-12 sm:mb-16">
        <NeoTiltCard
          className="bg-white border-4 border-black p-6 sm:p-8 rotate-0.5"
          intensity={15}
        >
          <h2 className="text-xl sm:text-2xl font-black tracking-tight mb-6 border-b-4 border-black pb-2 flex items-center gap-3">
            <span className="w-4 h-4 bg-[#FF0033] inline-block" />
            왜 마케팅 성과를 데이터로 설명해야 할까요?
          </h2>
          <div className="space-y-4 text-base sm:text-lg leading-relaxed text-gray-700">
            <p>광고를 집행하고, 콘텐츠를 만들고, 캠페인을 설계해왔습니다.</p>
            <p>하지만 성과가 나왔는지에 대한 질문 앞에서는 늘 같은 생각을 했습니다.</p>
            <div className="bg-black text-white p-4 sm:p-6 border-4 border-black -rotate-0.5 my-6">
              <p className="text-lg sm:text-xl font-black italic">
                “그래서, 무엇이 실제로 바뀌었는가?”
              </p>
            </div>
            <p>
              그 질문에 답하기 위해 마케팅을 <strong className="text-primary">데이터의 언어</strong>로 정리하기 시작했고, AI와 기술의 변화를 마케팅 실무에 연결하는 작업으로 확장해왔습니다.
            </p>
            <p>
              지금 이 사이트는 그 과정에서 쌓인 인사이트를 정리한 <strong className="text-primary">지식 아카이브</strong>입니다.
            </p>
          </div>
        </NeoTiltCard>
      </section>

      {/* Approach Section */}
      <section className="mb-12 sm:mb-16">
        <div className="bg-white border-4 border-black p-6 sm:p-8 neo-shadow-lg">
          <h2 className="text-xl sm:text-2xl font-black tracking-tight mb-6 border-b-4 border-black pb-2 flex items-center gap-3">
            <span className="w-4 h-4 bg-black inline-block transform rotate-45" />
            어떤 일들을 하고 있을까요?
          </h2>
          <div className="space-y-3">
            {[
              {
                icon: FileText,
                title: "이벤트 택소노미·정의서 설계",
                desc: "비즈니스가 신경 써야 하는 순간을 일관된 네이밍과 계층 파라미터로 정의합니다. 고객사당 20~30개, 누적 3,000개 안팎 운영.",
              },
              {
                icon: GitBranch,
                title: "dataLayer → GTM → GA4 파이프라인 구축",
                desc: "개발자용 스크립트 가이드를 작성하고, 반영 후 콘솔 디버깅·누락 역추적까지 직접 수행합니다.",
              },
              {
                icon: UserCheck,
                title: "Client-ID · User-ID 사용자 식별 설계",
                desc: "개인정보(PII) 노출 없이 같은 사용자의 방문을 하나의 여정으로 이어 붙입니다.",
              },
              {
                icon: Lock,
                title: "Enhanced Conversions · 사용자 제공 데이터",
                desc: "3rd-party 쿠키 제한 환경에서 전환 정확도를 지키기 위한 해시 기반 전송 구조를 설계합니다.",
              },
              {
                icon: Smartphone,
                title: "Firebase ↔ GA4 웹·앱 통합",
                desc: "logEvent·setUserProperty를 웹 스키마와 동일한 네이밍으로 맞춰, 웹·앱을 한 사용자 여정으로 묶습니다.",
              },
              {
                icon: Database,
                title: "BigQuery 기반 로우데이터 분석",
                desc: "GA4 UI에서 표현되지 않는 어트리뷰션을 SQL로 재정의하고, 예약 쿼리·대시보드로 자동 리포트를 구성합니다.",
              },
              {
                icon: Workflow,
                title: "대형 프로젝트 리드 · 교육",
                desc: "한국관광공사 2023년부터 4년 연속 컨설턴트. 이벤트 정합성 90% KPI와 5단계 산출물 워크플로우로 참여 기업을 지원하고, 누적 1,000명 이상 실무자를 교육했습니다.",
              },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="bg-white border-2 border-black p-4 sm:p-5 flex gap-4 items-start"
                >
                  <span className="bg-primary text-white font-black text-sm px-2.5 py-1 border-2 border-black shrink-0 leading-none self-start mt-1">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="w-4 h-4 text-primary shrink-0" />
                      <h3 className="font-black text-sm sm:text-base">{item.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* What I Build Section */}
      <section className="mb-12 sm:mb-16">
        <NeoTiltCard
          className="bg-white border-4 border-black p-6 sm:p-8 -rotate-0.5"
          intensity={15}
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="bg-primary border-2 border-black p-1.5 rotate-2">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black uppercase">
              무엇을 만들고 있나요?
            </h2>
          </div>
          <p className="text-base sm:text-lg text-gray-700 mb-4">
            이 사이트에서 공개하고 있는 결과물은 {REFERENCE_YEAR}년 4월 기준 <strong>93편</strong>입니다.
          </p>
          <div className="space-y-3">
            {[
              { name: "Insights", desc: "마케팅·AI·데이터 분석 심화 해설 56편" },
              { name: "Class", desc: "개념을 체계적으로 정리한 학습 콘텐츠 34편" },
              { name: "Courses", desc: "주제별 학습 경로 3개" },
            ].map((item) => (
              <div
                key={item.name}
                className="flex items-start gap-3 bg-gray-50 border-2 border-black p-3"
              >
                <span className="bg-accent text-black text-xs font-bold px-2 py-0.5 border-2 border-black shrink-0">
                  {item.name}
                </span>
                <span className="text-sm sm:text-base text-gray-700">{item.desc}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            <Link
              href="/insights?category=AI_TECH"
              className="underline decoration-2 underline-offset-2 font-bold text-black hover:text-primary"
            >
              AI·기술 인사이트 →
            </Link>
            <Link
              href="/insights?category=MARKETING"
              className="underline decoration-2 underline-offset-2 font-bold text-black hover:text-primary"
            >
              마케팅 인사이트 →
            </Link>
            <Link
              href="/class"
              className="underline decoration-2 underline-offset-2 font-bold text-black hover:text-primary"
            >
              Class 모음 →
            </Link>
          </div>
        </NeoTiltCard>
      </section>

      {/* Principles Section */}
      <section className="mb-12 sm:mb-16">
        <div className="flex items-center gap-2 mb-6">
          <div className="bg-black border-2 border-black p-1.5 rotate-2">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black uppercase">
            어떤 원칙으로 일하나요?
          </h2>
        </div>
        <div className="space-y-4">
          {principles.map((principle, index) => {
            const rotations = ["rotate-0.5", "-rotate-0.5", "rotate-0"];
            return (
              <NeoTiltCard
                key={principle.title}
                className={`bg-white border-4 border-black p-5 sm:p-6 ${rotations[index]}`}
                intensity={10}
              >
                <h3 className="font-black text-base sm:text-lg mb-2 flex items-start gap-2">
                  <span className="bg-primary text-white px-2 py-0.5 text-sm border-2 border-black">
                    {index + 1}
                  </span>
                  {principle.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 ml-8">
                  {principle.desc}
                </p>
              </NeoTiltCard>
            );
          })}
        </div>
      </section>

      {/* Mission Statement */}
      <section className="mb-12 sm:mb-16">
        <NeoTiltCard
          className="bg-gradient-to-br from-neutral-800 to-neutral-950 text-white border-4 border-black p-6 sm:p-10 rotate-0.5 text-center"
          intensity={20}
        >
          <p className="text-lg sm:text-xl md:text-2xl font-black leading-relaxed">
            “<span className="text-[#FF0033]">설명할 수 있는 마케팅</span>,
            <br />
            누구나 배울 수 있는 기술을
            <br />
            만들고 기록하는 사람입니다.”
          </p>
        </NeoTiltCard>
      </section>

      {/* CTA Section */}
      <section className="text-center">
        <p className="text-gray-600 mb-6">더 많은 인사이트가 궁금하시다면</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/insights">
            <NeoButton size="lg">
              Insights 보기 <ArrowRight className="w-4 h-4 ml-2" />
            </NeoButton>
          </Link>
          <Link href="/class">
            <NeoButton size="lg">
              Class 보기 <ArrowRight className="w-4 h-4 ml-2" />
            </NeoButton>
          </Link>
          <Link href="/tags">
            <NeoButton variant="outline" size="lg">
              Tags 둘러보기 <ArrowRight className="w-4 h-4 ml-2" />
            </NeoButton>
          </Link>
        </div>
      </section>
    </div>
  );
}
