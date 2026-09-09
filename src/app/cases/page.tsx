import type { Metadata } from "next";
import Link from "next/link";
import { workCases } from "@/lib/cases";
import { absoluteUrl } from "@/lib/utils";

export const dynamic = "force-static";
const title = "기업 교육과 데이터 컨설팅 사례 | 홍승협(준이아빠)";
const description = "기업 교육, 데이터 측정 설계, GA4 구축과 AI 도입 계획을 소개합니다. 고객의 업무에서 어떤 문제가 있었고, 어떤 판단과 작업으로 이어졌는지 살펴볼 수 있습니다.";
const url = absoluteUrl("/cases");
export const metadata: Metadata = {
  title, description, alternates: { canonical: url },
  openGraph: { title, description, url, type: "website", images: [{ url: absoluteUrl("/og-default.png"), width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title, description, images: [absoluteUrl("/og-default.png")] },
};

export default function CasesPage() {
  const listLd = { "@context": "https://schema.org", "@type": "ItemList", name: title, itemListElement: workCases.map((item, i) => ({ "@type": "ListItem", position: i + 1, name: item.title, url: absoluteUrl(`/cases/${item.slug}`) })) };
  return (
    <div className="bg-[#F5F5F5]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listLd) }} />
      <header className="bg-[#171717] text-white border-b-4 border-[#FF0033]">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-10 sm:py-14">
          <p className="inline-block bg-[#FFD700] text-black px-3 py-1 text-xs sm:text-sm font-bold mb-5">홍승협(준이아빠)의 프로젝트 사례</p>
          <h1 className="text-3xl sm:text-[2.6rem] font-black leading-tight break-keep mb-5">기업 교육과 데이터 컨설팅 사례</h1>
          <p className="text-gray-300 leading-relaxed max-w-3xl">고객의 요구를 진단하고 교육과 데이터 분석 업무에 적용한 사례를 소개합니다. 과업별로 어떤 기준을 세웠는지, 고객 담당자와 무엇을 협의하고 실행했는지 설명합니다.</p>
          <div className="flex flex-wrap gap-3 mt-7 text-sm font-bold">
            <Link href="/about" className="border border-white/50 px-4 py-2 hover:bg-white hover:text-black">강사 및 컨설턴트 소개</Link>
            <Link href="/education" className="bg-white text-black border border-white px-4 py-2 hover:bg-gray-200">기업 AI 교육 안내</Link>
          </div>
        </div>
      </header>
      <section aria-label="프로젝트 사례 목록" className="max-w-5xl mx-auto px-5 sm:px-8 py-8 sm:py-12">
        <p className="text-sm font-bold text-gray-600 mb-5">프로젝트 사례 <span className="ml-1 text-black">{workCases.length}</span></p>
        <div className="space-y-5">
          {workCases.map((item) => (
            <article key={item.slug} className="bg-white border-2 border-black p-5 sm:p-7 neo-shadow-sm">
              <div className="flex flex-wrap items-center gap-3 mb-3 text-xs sm:text-sm">
                <span className="bg-black text-white px-2 py-1 font-bold">{item.category}</span>
              </div>
              <p className="text-sm text-gray-500 mb-2">{item.sector}</p>
              <h2 className="text-xl sm:text-2xl font-bold break-keep leading-snug mb-3"><Link href={`/cases/${item.slug}`} className="hover:underline underline-offset-4">{item.title}</Link></h2>
              <p className="text-gray-700 leading-[1.8]">{item.description}</p>
              <Link href={`/cases/${item.slug}`} className="inline-block mt-5 text-sm font-bold underline underline-offset-4">사례 자세히 보기 <span aria-hidden="true">→</span></Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
