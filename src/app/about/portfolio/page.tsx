import { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Target,
  Megaphone,
  Settings,
  Layout,
  FlaskConical,
  GraduationCap,
  CheckCircle,
  ChevronRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Portfolio | About",
  description:
    "데이터 기반 디지털 마케팅 컨설팅, 광고 운영, 분석 환경 구축, UI/UX 개선, 그로스해킹 전문가 포트폴리오",
  openGraph: {
    title: "Portfolio | 준이아빠블로그",
    description: "데이터로 마케팅을 설계하는 전문가의 포트폴리오",
  },
};

const services = [
  {
    id: "consulting",
    icon: BarChart3,
    category: "Consulting",
    title: "데이터 기반 디지털 마케팅 컨설팅",
    description:
      "B2B·B2C 기업 및 공공기관 대상으로 마케팅 성과를 진단하고, 전환 구조를 분석합니다. 현재 상태를 객관적으로 파악하고, 개선 방향을 데이터로 도출합니다.",
    targets: ["이커머스 기업", "플랫폼 스타트업", "공공기관"],
    deliverables: [
      "마케팅 성과 진단 리포트",
      "전환 구조 분석",
      "채널별 기여도 분석",
      "개선 우선순위 도출",
    ],
  },
  {
    id: "ads",
    icon: Megaphone,
    category: "Advertising",
    title: "광고 운영 및 전환 최적화",
    description:
      "검색 광고와 소셜 광고를 중심으로 캠페인을 운영하고, 전환율을 높이기 위한 구조 개선을 수행합니다. 단순 집행이 아닌, 성과 측정이 가능한 구조를 설계합니다.",
    targets: ["커머스 기업", "앱 기반 서비스"],
    deliverables: [
      "캠페인 구조 설계",
      "타겟 세그먼트 최적화",
      "소재 A/B 테스트",
      "전환 추적 및 성과 분석",
    ],
  },
  {
    id: "analytics",
    icon: Settings,
    category: "Analytics",
    title: "분석 환경 구축",
    description:
      "GA4와 GTM을 기반으로 이벤트를 설계하고, 전환 추적 환경을 구축합니다. 수집된 데이터를 기반으로 퍼널 분석과 대시보드를 제작하여 의사결정에 활용할 수 있도록 합니다.",
    targets: ["서비스형 플랫폼", "콘텐츠 기업", "커머스 기업"],
    deliverables: [
      "GA4 이벤트 설계 및 구현",
      "GTM 컨테이너 세팅",
      "전환 추적 환경 구축",
      "맞춤 대시보드 제작",
    ],
  },
  {
    id: "ux",
    icon: Layout,
    category: "UX Optimization",
    title: "UI/UX 및 퍼널 개선",
    description:
      "사용자 행동 데이터를 기반으로 이탈 지점을 분석하고, 전환 흐름을 개선합니다. 감이 아닌 데이터로 문제를 정의하고, 검증 가능한 방식으로 개선안을 도출합니다.",
    targets: ["웹 서비스", "앱 서비스"],
    deliverables: [
      "사용자 행동 분석",
      "이탈 지점 진단",
      "퍼널 최적화 제안",
      "개선 효과 측정",
    ],
  },
  {
    id: "growth",
    icon: FlaskConical,
    category: "Growth",
    title: "그로스해킹 및 실험 설계",
    description:
      "캠페인, 소재, 타겟, UX 단위로 가설을 수립하고 반복 테스트를 수행합니다. 작은 실험을 빠르게 반복하여 성장 동력을 찾아냅니다.",
    targets: ["스타트업", "성장 단계 서비스"],
    deliverables: [
      "실험 가설 수립",
      "A/B 테스트 설계 및 실행",
      "결과 분석 및 인사이트 도출",
      "반복 실험 프로세스 구축",
    ],
  },
  {
    id: "education",
    icon: GraduationCap,
    category: "Education",
    title: "교육 및 멘토링",
    description:
      "마케터, 실무자, 소상공인을 대상으로 디지털 마케팅과 데이터 분석 실습 교육을 진행합니다. 이론이 아닌 실무에서 바로 적용할 수 있는 내용을 다룹니다.",
    targets: ["마케터", "실무자", "소상공인"],
    deliverables: [
      "GA4/GTM 실습 교육",
      "광고 운영 기초 교육",
      "데이터 분석 워크숍",
      "1:1 멘토링",
    ],
  },
];

const approach = [
  {
    step: "01",
    title: "현황 파악",
    description: "현재 데이터 수집 환경과 마케팅 구조를 점검합니다.",
  },
  {
    step: "02",
    title: "문제 정의",
    description: "데이터를 기반으로 핵심 이슈와 개선 포인트를 정의합니다.",
  },
  {
    step: "03",
    title: "전략 수립",
    description: "실행 가능한 전략과 우선순위를 도출합니다.",
  },
  {
    step: "04",
    title: "실행 및 검증",
    description: "실행 후 성과를 측정하고, 반복 개선합니다.",
  },
];

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b-4 border-black bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/about"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            About
          </Link>
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
              Portfolio
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black leading-tight">
              전문 서비스 영역
            </h1>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl">
              데이터를 기반으로 마케팅 성과를 진단하고, 측정 가능한 구조를
              설계합니다. 감이 아닌 근거로 의사결정을 지원합니다.
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Services */}
        <section className="mb-16 sm:mb-24">
          <div className="space-y-12 sm:space-y-16">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <article
                  key={service.id}
                  className="border-b border-gray-200 pb-12 sm:pb-16 last:border-b-0"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12">
                    {/* Left Column */}
                    <div className="lg:col-span-4">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-black flex items-center justify-center">
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {service.category}
                        </span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold text-black leading-tight">
                        {service.title}
                      </h2>
                    </div>

                    {/* Right Column */}
                    <div className="lg:col-span-8">
                      <p className="text-gray-600 leading-relaxed mb-6">
                        {service.description}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Targets */}
                        <div>
                          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                            주요 대상
                          </h3>
                          <ul className="space-y-2">
                            {service.targets.map((target) => (
                              <li
                                key={target}
                                className="flex items-center gap-2 text-sm text-gray-700"
                              >
                                <ChevronRight className="w-3 h-3 text-gray-400" />
                                {target}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Deliverables */}
                        <div>
                          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                            주요 산출물
                          </h3>
                          <ul className="space-y-2">
                            {service.deliverables.map((item) => (
                              <li
                                key={item}
                                className="flex items-start gap-2 text-sm text-gray-700"
                              >
                                <CheckCircle className="w-3 h-3 text-black mt-1 flex-shrink-0" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Approach */}
        <section className="mb-16 sm:mb-24">
          <div className="border-4 border-black p-6 sm:p-10 bg-gray-50">
            <div className="flex items-center gap-3 mb-8">
              <Target className="w-6 h-6" />
              <h2 className="text-xl sm:text-2xl font-bold">업무 접근 방식</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {approach.map((item, index) => (
                <div key={item.step} className="relative">
                  <div className="text-4xl font-bold text-gray-200 mb-2">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-bold text-black mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                  {index < approach.length - 1 && (
                    <div className="hidden lg:block absolute top-4 -right-3">
                      <ArrowRight className="w-5 h-5 text-gray-300" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Philosophy */}
        <section className="mb-16 sm:mb-24">
          <div className="bg-black text-white p-6 sm:p-10">
            <h2 className="text-xl sm:text-2xl font-bold mb-6">
              일하는 방식에 대하여
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-bold mb-2">데이터로 말합니다</h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  감이나 경험에만 의존하지 않습니다. 모든 판단과 제안은 데이터를
                  근거로 합니다.
                </p>
              </div>
              <div>
                <h3 className="font-bold mb-2">실행 가능해야 합니다</h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  이론적으로 완벽한 전략보다 실무에서 바로 적용할 수 있는 방안을
                  우선합니다.
                </p>
              </div>
              <div>
                <h3 className="font-bold mb-2">측정할 수 있어야 합니다</h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  성과를 측정할 수 없는 활동은 개선할 수 없습니다. 측정 가능한
                  구조를 먼저 설계합니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <p className="text-gray-600 mb-6">
            프로젝트 문의나 상담이 필요하시면 연락해 주세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/insights"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-black text-white font-medium hover:bg-gray-800 transition-colors"
            >
              Insights 보기
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="https://open.kakao.com/o/sS5vN58c"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-black text-black font-medium transition-colors bg-[#FEE500] hover:bg-[#F7E600]"
            >
              카카오톡 문의
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
