import Link from "next/link";
import { experienceCases } from "@/lib/education";

export function ExperienceCases() {
  return (
    <section id="experience" className="mb-12 sm:mb-16 scroll-mt-24" aria-labelledby="experience-title">
      <h2 id="experience-title" className="text-xl sm:text-2xl font-black border-b-4 border-black pb-3 mb-4">교육과 컨설팅 대표 사례</h2>
      <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-6">
        기업 실무자 교육과 데이터 컨설팅에서 맡았던 작업입니다. 각 사례에서 고객의 상황을 살펴보고 교육과 실행 계획을 어떻게 구성했는지 소개합니다.
      </p>
      <div className="space-y-5">
        {experienceCases.map((item) => (
          <article key={item.id} id={item.id} className="bg-white border-2 sm:border-4 border-black p-5 sm:p-7 scroll-mt-24">
            <div className="flex flex-wrap gap-2 text-xs font-bold mb-3">
              <span className="bg-black text-white px-2 py-1">{item.sector}</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black mb-4">{item.title}</h3>
            <dl className="space-y-3 text-sm sm:text-base leading-relaxed">
              {[["업무 배경", item.context], ["맡은 역할", item.role], ["수행 내용, 결과물", item.output], ["교육에 연결하는 경험", item.lesson]].map(([label, value]) => (
                <div key={label}>
                  <dt className="font-bold text-black">{label}</dt>
                  <dd className="text-gray-700 mt-1">{value}</dd>
                </div>
              ))}
            </dl>
            <Link href={`/cases/${item.caseSlug}`} className="inline-block mt-5 font-bold underline underline-offset-4">작업 과정과 결과 보기</Link>
          </article>
        ))}
      </div>
      <Link href="/cases" className="inline-block mt-6 font-bold underline underline-offset-4">교육과 컨설팅 사례 전체 보기</Link>
    </section>
  );
}
