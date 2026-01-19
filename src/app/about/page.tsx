import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Target,
  BarChart3,
  Lightbulb,
  ArrowRight,
  Database,
  LineChart,
  Settings,
  MessageSquare,
  Briefcase,
  Sparkles,
  Coffee
} from "lucide-react";
import { NeoButton } from "@/components/neo";
import { NeoTiltCard } from "@/components/neo";
import { ViewTracker } from "@/components/ViewTracker";

export const metadata: Metadata = {
  title: "About",
  description: "마케팅을 데이터의 언어로 정리하는 사람. GA4, GTM, 퍼널 분석, 캠페인 구조 설계 전문가.",
  openGraph: {
    title: "About | 준이아빠블로그",
    description: "마케팅을 데이터의 언어로 정리하는 사람",
  },
};

const skills = [
  { icon: BarChart3, label: "GA4 & GTM", desc: "데이터 수집과 분석 설계" },
  { icon: LineChart, label: "퍼널 분석", desc: "사용자 여정 구조화" },
  { icon: Settings, label: "캠페인 설계", desc: "성과 측정 가능한 구조" },
  { icon: Database, label: "대시보드", desc: "의사결정을 위한 시각화" },
];

const principles = [
  {
    title: "감으로만 설명하지 않습니다",
    desc: "마케팅 성과를 데이터로 증명하고, 구조로 설명합니다.",
  },
  {
    title: "전문가만의 영역으로 만들지 않습니다",
    desc: "누구나 이해할 수 있는 언어로 정리합니다.",
  },
  {
    title: "실무에서 쓸 수 없는 전략은 관심 없습니다",
    desc: "다음 행동으로 이어질 수 있는 인사이트만 다룹니다.",
  },
];

export default async function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
      <ViewTracker
        contentType="about"
        contentTitle="About"
        contentSlug="about"
      />
      {/* Hero Section */}
      <section className="mb-12 sm:mb-16">
        <NeoTiltCard className="bg-gradient-to-br from-rose-500 to-red-600 border-4 border-black p-6 sm:p-10 -rotate-1 halftone-corner text-left" intensity={20} shadowIntensity={10}>
          <div className="flex items-center gap-3 mb-4">
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full border-3 border-black overflow-hidden rotate-3">
              <Image
                src="/profile-illustration.png"
                alt="Profile"
                fill
                className="object-cover object-top scale-125"
              />
            </div>
            <span className="text-white/80 font-mono text-sm uppercase tracking-wider">About Me</span>
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight mb-4">
            마케팅을 실행하는 사람이었고,<br />
            <span className="text-accent">데이터로 설명하려는 사람</span>입니다.
          </h1>
        </NeoTiltCard>
      </section>

      {/* Story Section */}
      <section className="mb-12 sm:mb-16">
        <NeoTiltCard className="bg-white border-4 border-black p-6 sm:p-8 rotate-0.5" intensity={15}>
          <div className="flex items-center gap-2 mb-6">
            <div className="bg-accent border-2 border-black p-1.5 -rotate-2">
              <Target className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black uppercase">The Question</h2>
          </div>

          <div className="space-y-4 text-base sm:text-lg leading-relaxed text-gray-700">
            <p>
              광고를 집행하고, 콘텐츠를 만들고, 캠페인을 설계해왔습니다.
            </p>
            <p>
              하지만 성과가 나왔는지에 대한 질문 앞에서는 늘 같은 생각을 했습니다.
            </p>
            <div className="bg-black text-white p-4 sm:p-6 border-4 border-black -rotate-0.5 my-6">
              <p className="text-lg sm:text-xl font-black italic">
                "그래서, 무엇이 실제로 바뀌었는가?"
              </p>
            </div>
            <p>
              그 질문에 답하기 위해 마케팅을 <strong className="text-primary">데이터의 언어</strong>로 정리하기 시작했습니다.
            </p>
          </div>
        </NeoTiltCard>
      </section>

      {/* Approach Section */}
      <section className="mb-12 sm:mb-16">
        <NeoTiltCard className="bg-accent border-4 border-black p-6 sm:p-8 -rotate-0.5 halftone-bg" intensity={15}>
          <div className="flex items-center gap-2 mb-6 relative z-10">
            <div className="bg-black border-2 border-black p-1.5 rotate-2">
              <Lightbulb className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black uppercase">My Approach</h2>
          </div>

          <div className="space-y-4 text-base sm:text-lg leading-relaxed relative z-10">
            <p>
              트래픽이 늘었다는 말보다 <strong>어떤 사용자가, 어떤 경로로 들어와, 어디에서 멈췄는지</strong> 설명하는 쪽을 선택했습니다.
            </p>
            <p>
              전환율이 낮다는 진단보다 <strong>왜 낮을 수밖에 없었는지</strong>를 구조로 보여주고 싶었습니다.
            </p>
            <p className="pt-4 border-t-2 border-black/20">
              제가 해온 일은 화려한 기법을 만드는 것이 아니라<br />
              <strong className="text-primary">복잡한 상황을 이해 가능한 형태로 정리하는 일</strong>이었습니다.
            </p>
          </div>
        </NeoTiltCard>
      </section>

      {/* Skills Section */}
      <section className="mb-12 sm:mb-16">
        <div className="flex items-center gap-2 mb-6">
          <div className="bg-primary border-2 border-black p-1.5 -rotate-3">
            <Settings className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black uppercase">Tools & Skills</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {skills.map((skill, index) => {
            const Icon = skill.icon;
            const rotations = ["-rotate-1", "rotate-1", "rotate-0.5", "-rotate-0.5"];
            return (
              <NeoTiltCard
                key={skill.label}
                className={`bg-white border-4 border-black p-4 ${rotations[index]} hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all`}
                intensity={10}
              >
                <Icon className="w-8 h-8 mb-3 text-primary" />
                <h3 className="font-black text-sm sm:text-base mb-1">{skill.label}</h3>
                <p className="text-xs text-muted-foreground">{skill.desc}</p>
              </NeoTiltCard>
            );
          })}
        </div>

        <p className="mt-6 text-sm sm:text-base text-gray-600 bg-gray-100 border-2 border-black p-4">
          이 도구들은 단순한 기술이 아니라 <strong>사고를 정리하는 수단</strong>입니다.<br />
          숫자를 많이 아는 것보다 <strong>'의사결정에 쓰일 수 있는가'</strong>를 더 중요하게 봅니다.
        </p>
      </section>

      {/* Principles Section */}
      <section className="mb-12 sm:mb-16">
        <div className="flex items-center gap-2 mb-6">
          <div className="bg-black border-2 border-black p-1.5 rotate-2">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black uppercase">Who I Am</h2>
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
        <NeoTiltCard className="bg-gradient-to-br from-neutral-800 to-neutral-950 text-white border-4 border-black p-6 sm:p-10 rotate-0.5 text-center" intensity={20}>
          <p className="text-lg sm:text-xl md:text-2xl font-black leading-relaxed">
            "왜 이렇게 했는지<br />
            <span className="text-accent">설명할 수 있는 마케팅</span>을<br />
            만들고 싶은 사람입니다."
          </p>
        </NeoTiltCard>
      </section>

      {/* Portfolio CTA */}
      <section className="mb-12 sm:mb-16">
        <Link href="/about/portfolio">
          <NeoTiltCard className="bg-gradient-to-br from-red-600 to-orange-600 text-white border-4 border-black p-6 sm:p-8 -rotate-0.5 hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all group halftone-corner speed-lines relative overflow-hidden" intensity={15}>
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 relative z-10">
              <div className="bg-white p-3 border-2 border-black rotate-3 group-hover:-rotate-3 transition-transform">
                <Briefcase className="w-8 h-8 text-primary" />
              </div>
              <div className="text-center sm:text-left flex-1">
                <div className="flex items-center gap-2 justify-center sm:justify-start mb-2">
                  <span className="bg-accent text-black text-xs font-bold px-2 py-1 border-2 border-black">NEW</span>
                  <span className="text-white/70 font-mono text-xs uppercase">Portfolio</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black uppercase mb-2">전문 영역 & 포트폴리오</h3>
                <p className="text-sm sm:text-base text-white/80">
                  데이터 기반 마케팅 컨설팅, 광고 운영, 분석 환경 구축, 그로스해킹 등 전문 영역을 확인하세요.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-accent" />
                <ArrowRight className="w-6 h-6 text-accent group-hover:translate-x-2 transition-transform" />
              </div>
            </div>
          </NeoTiltCard>
        </Link>
      </section>

      {/* Life Log CTA */}
      <section className="mb-12 sm:mb-16">
        <Link href="/about/life">
          <NeoTiltCard className="bg-gradient-to-br from-amber-400 to-yellow-500 border-4 border-black p-6 sm:p-8 rotate-0.5 hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all group relative overflow-hidden" intensity={15}>
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 relative z-10">
              <div className="bg-white p-3 border-2 border-black -rotate-3 group-hover:rotate-3 transition-transform">
                <Coffee className="w-8 h-8 text-primary" />
              </div>
              <div className="text-center sm:text-left flex-1">
                <div className="flex items-center gap-2 justify-center sm:justify-start mb-2">
                  <span className="text-black/60 font-mono text-xs uppercase">Personal</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black uppercase mb-2">Life Log</h3>
                <p className="text-sm sm:text-base text-black/70">
                  맛집 탐방, 강의 후기, 문화생활, 여행 등 개인적인 일상의 기록들.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <ArrowRight className="w-6 h-6 text-black group-hover:translate-x-2 transition-transform" />
              </div>
            </div>
          </NeoTiltCard>
        </Link>
      </section>

      {/* CTA Section */}
      <section className="text-center">
        <p className="text-gray-600 mb-6">
          더 많은 인사이트가 궁금하시다면
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/insights">
            <NeoButton size="lg">
              Insights 보기 <ArrowRight className="w-4 h-4 ml-2" />
            </NeoButton>
          </Link>
          <Link href="/faq">
            <NeoButton variant="outline" size="lg">
              FAQ 둘러보기 <ArrowRight className="w-4 h-4 ml-2" />
            </NeoButton>
          </Link>
        </div>
      </section>
    </div>
  );
}
