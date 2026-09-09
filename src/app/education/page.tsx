import { workCases } from "@/lib/cases";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { absoluteUrl } from "@/lib/utils";
import { AUTHOR_PERSON_LD } from "@/lib/structured-data";
import { EDUCATION_TITLE, EDUCATION_DESCRIPTION, EDUCATION_CONTACT, PROFILE_DESCRIPTION, educationPrograms } from "@/lib/education";

export const dynamic = "force-static";
const pageUrl = absoluteUrl("/education");
const imageUrl = absoluteUrl("/og-default.png");
export const metadata: Metadata = {
  title: EDUCATION_TITLE,
  description: EDUCATION_DESCRIPTION,
  alternates: { canonical: pageUrl },
  openGraph: { title: EDUCATION_TITLE, description: EDUCATION_DESCRIPTION, url: pageUrl, type: "website", images: [{ url: imageUrl, width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title: EDUCATION_TITLE, description: EDUCATION_DESCRIPTION, images: [imageUrl] },
};

export default function EducationPage() {
  const serviceLd = {
    "@context": "https://schema.org", "@type": "Service", "@id": `${pageUrl}#service`,
    name: EDUCATION_TITLE, description: EDUCATION_DESCRIPTION, url: pageUrl, image: imageUrl,
    serviceType: "기업, 기관 AI 실무 교육", provider: AUTHOR_PERSON_LD,
    audience: { "@type": "Audience", audienceType: "비개발자, 마케터, 기업, 기관 실무자" },
    areaServed: { "@type": "Country", name: "대한민국" },
  };
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd) }} />
      <section className="bg-white border-4 border-black p-6 sm:p-10 neo-shadow mb-10">
        <p className="text-sm font-bold mb-3">홍승협(준이아빠), 기업, 기관 교육</p>
        <h1 className="text-3xl sm:text-4xl font-black leading-tight break-keep mb-5">{EDUCATION_TITLE}</h1>
        <p className="text-base sm:text-lg leading-relaxed text-gray-700">{EDUCATION_DESCRIPTION}</p>
        <p className="mt-3 text-base leading-relaxed text-gray-700">마케팅과 데이터 분석 업무에서 겪는 문제를 바탕으로, AI에 요청하고 결과를 검토하는 과정을 함께 연습합니다.</p>
        <div className="flex flex-wrap gap-3 mt-6">
          <a href="#contact" className="inline-flex items-center gap-2 bg-black text-white px-4 py-3 font-bold hover:bg-gray-800">교육 문의 안내 <ArrowRight className="w-4 h-4" /></a>
          <Link href="/about#experience" className="inline-flex items-center border-2 border-black px-4 py-3 font-bold hover:bg-gray-100">강사 이력과 사례</Link>
        </div>
      </section>

      <section aria-labelledby="programs-title" className="mb-10">
        <h2 id="programs-title" className="text-2xl font-black border-b-4 border-black pb-3 mb-4">교육 주제와 실습 결과물</h2>
        <p className="leading-relaxed text-gray-700 mb-6">아래는 대상과 업무에 맞춰 협의할 수 있는 교육 구성입니다. 산출물은 실습 예시이며, 교육 시간, 난이도, 사용 도구는 사전 협의로 정합니다.</p>
        <div className="space-y-5">
          {educationPrograms.map((program) => (
            <article key={program.id} id={program.id} className="border-2 sm:border-4 border-black bg-white p-5 sm:p-7 scroll-mt-24">
              <h3 className="text-xl font-black mb-4">{program.title}</h3>
              <dl className="text-sm sm:text-base space-y-3 leading-relaxed">
                <div><dt className="font-bold">대상</dt><dd className="text-gray-700">{program.audience}</dd></div>
                <div><dt className="font-bold">선수 지식, 준비</dt><dd className="text-gray-700">{program.prerequisite}</dd></div>
              </dl>
              <ol className="list-decimal pl-5 my-4 space-y-2 text-sm sm:text-base text-gray-700 leading-relaxed">
                {program.topics.map((topic) => <li key={topic}>{topic}</li>)}
              </ol>
              <p className="text-sm sm:text-base leading-relaxed"><strong>실습 산출물 예시: </strong>{program.output}</p>
              <Link className="inline-block mt-4 font-bold underline underline-offset-4" href={`/class/${program.courseSlug}`}>{program.courseLabel}</Link>
            </article>
          ))}
        </div>
      </section>

      <section className="mb-10" aria-labelledby="method-title">
        <h2 id="method-title" className="text-2xl font-black border-b-4 border-black pb-3 mb-5">교육 진행 방식</h2>
        <ol className="list-decimal pl-5 space-y-4 leading-relaxed">
          <li><strong>업무와 수준 확인.</strong> 교육 대상, 사용 중인 도구, 해결하려는 업무를 먼저 확인합니다.</li>
          <li><strong>짧은 설명과 단계별 실습.</strong> 기능을 설명한 뒤 예제에 적용하고, 결과를 확인하며 다음 단계로 넘어갑니다.</li>
          <li><strong>검토와 수정.</strong> 원문과 수치를 대조하고, AI가 만든 결과에서 수정할 부분을 찾습니다.</li>
          <li><strong>현업 적용 과제 정리.</strong> 교육 후 시도할 업무와 준비할 데이터를 정리합니다. 추가 피드백이나 구축 지원이 필요한 경우 범위를 별도로 협의합니다.</li>
        </ol>
        <p className="mt-5 text-sm text-gray-700 leading-relaxed">실습은 예제 또는 익명화된 자료를 기준으로 준비합니다. 필요한 계정, 구독, 설치 환경과 도구 사용료 부담 여부는 교육 전에 안내합니다.</p>
      </section>

      <section className="mb-10 bg-white border-2 sm:border-4 border-black p-5 sm:p-7" aria-labelledby="instructor-title">
        <h2 id="instructor-title" className="text-2xl font-black mb-4">강사 홍승협(준이아빠)</h2>
        <p className="leading-relaxed text-gray-700">{PROFILE_DESCRIPTION}</p>
        <p className="mt-3 leading-relaxed text-gray-700">오픈소스마케팅 컨설팅 랩 차장으로 일하며, 기업과 공공 교육기관에서 디지털 마케팅 교육을 진행했습니다. 소비재 기업 교육에서는 다른 컨설턴트와 역할을 나눠 교육을 조율하고, 데이터 기반 실무사례와 질의응답, 보고서 해석을 다뤘습니다. 온라인 서비스 기업의 AI 분석 도입 계획을 수립한 경험도 있습니다.</p>
        <Link href="/about#experience" className="inline-block mt-4 font-bold underline underline-offset-4">강사 이력과 대표 사례 확인</Link>
      </section>

      <section className="mb-10" aria-labelledby="cases-title">
        <h2 id="cases-title" className="text-2xl font-black border-b-4 border-black pb-3 mb-5">교육과 컨설팅의 실제 작업 과정</h2>
        <p className="leading-relaxed text-gray-700 mb-4">기업 교육을 준비하고 데이터 측정 기준을 정리하며 마주한 문제들을 소개합니다. 고객 담당자와 협의한 내용, 작업 순서와 결과를 사례에서 살펴보세요.</p>
        <ul className="space-y-3">{workCases.filter((item) => item.category !== "데이터 분석").map((item) => <li key={item.slug}><Link href={`/cases/${item.slug}`} className="font-bold underline underline-offset-4 leading-relaxed">{item.title}</Link><span className="block text-sm text-gray-600 mt-1">{item.status}</span></li>)}</ul>
        <Link href="/cases" className="inline-block mt-5 font-bold underline underline-offset-4">데이터 구축을 포함한 전체 사례 보기</Link>
      </section>

      <section id="contact" className="mb-10 border-4 border-black bg-[#FFD700] p-6 sm:p-8 scroll-mt-24" aria-labelledby="contact-title">
        <h2 id="contact-title" className="text-2xl font-black mb-4">교육 문의</h2>
        <p className="leading-relaxed">기업, 공공기관 출강과 온라인 교육을 협의할 수 있습니다. 교육 대상, 인원, 해결하려는 업무, 희망 일정, 시간, 진행 방식과 예산 범위를 보내주시면 교육 구성안을 안내합니다.</p>
        <a href={`mailto:${EDUCATION_CONTACT}?subject=${encodeURIComponent("AI 실무 교육 문의")}`} className="inline-block mt-5 break-all bg-black text-white font-bold px-4 py-3 hover:bg-gray-800">{EDUCATION_CONTACT}</a>
        <p className="mt-4 text-sm leading-relaxed">시간, 비용, 실습 범위, 교육 후 지원은 협의 후 확정합니다. 문의 단계에는 고객 개인정보나 사내 기밀 자료를 첨부하지 않아도 됩니다.</p>
      </section>

      <section aria-labelledby="self-study-title">
        <h2 id="self-study-title" className="text-xl font-black mb-3">개인 학습으로 먼저 시작하기</h2>
        <p className="text-gray-700 leading-relaxed mb-4">준이아빠블로그의 클래스는 개인이 읽으며 배우는 개념 학습 자료입니다. 강사와 함께 진행하는 기업 교육은 대상과 업무에 맞춰 별도로 구성합니다.</p>
        <div className="flex flex-wrap gap-4 font-bold underline underline-offset-4">
          <Link href="/class">전체 클래스</Link><Link href="/ai-practice">AI 실습</Link><Link href="/ga4-edu">GA4 학습</Link>
        </div>
      </section>
    </div>
  );
}
