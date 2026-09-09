import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { workCases, getWorkCase } from "@/lib/cases";
import { CaseVisual } from "@/components/cases/CaseVisual";
import { caseVisuals } from "@/lib/case-visuals";
import { educationPrograms } from "@/lib/education";
import { AUTHOR_PERSON_LD, AUTHOR_LABEL } from "@/lib/structured-data";
import { absoluteUrl } from "@/lib/utils";

export const dynamic = "force-static";
export const dynamicParams = false;
export function generateStaticParams() { return workCases.map(({ slug }) => ({ slug })); }
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const item = getWorkCase((await params).slug);
  if (!item) notFound();
  const url = absoluteUrl(`/cases/${item.slug}`);
  return {
    title: item.title, description: item.description, alternates: { canonical: url },
    openGraph: { title: item.title, description: item.description, url, type: "article", modifiedTime: item.updatedAt, images: [{ url: absoluteUrl("/og-default.png"), width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", title: item.title, description: item.description, images: [absoluteUrl("/og-default.png")] },
  };
}

export default async function CasePage({ params }: Props) {
  const item = getWorkCase((await params).slug);
  if (!item) notFound();
  const visuals = caseVisuals[item.slug] ?? [];
  const url = absoluteUrl(`/cases/${item.slug}`);
  const program = educationPrograms.find((p) => p.id === item.program)!;
  const related = item.related.map(getWorkCase).filter((value) => value !== undefined);
  const articleLd = { "@context": "https://schema.org", "@type": "Article", "@id": `${url}#article`, headline: item.title, description: item.description, mainEntityOfPage: url, url, inLanguage: "ko-KR", dateModified: item.updatedAt, author: AUTHOR_PERSON_LD, image: absoluteUrl("/og-default.png"), articleSection: item.category };
  const breadcrumbLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "홈", item: absoluteUrl("/") }, { "@type": "ListItem", position: 2, name: "실무 사례", item: absoluteUrl("/cases") }, { "@type": "ListItem", position: 3, name: item.title, item: url }] };
  return (
    <div className="bg-white">
      <article className="max-w-3xl mx-auto px-5 sm:px-8 py-8 sm:py-14">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([articleLd, breadcrumbLd]) }} />
        <Link href="/cases" className="text-sm text-gray-600 underline underline-offset-4 hover:text-black">프로젝트 사례 목록으로</Link>
        <header className="mt-8 mb-9 sm:mb-12 border-b-4 border-black pb-8">
          <p className="text-sm font-bold text-[#D0002A] mb-3">{item.category} 프로젝트</p>
          <h1 className="text-[1.8rem] sm:text-[2.3rem] font-black leading-[1.3] break-keep tracking-tight mb-5">{item.title}</h1>
          <p className="text-base sm:text-lg leading-[1.8] text-gray-600 mb-6">{item.description}</p>
          <p className="text-sm text-gray-600 mb-3">{item.sector}</p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-gray-600">
            <Link href="/about" className="underline underline-offset-4">{AUTHOR_LABEL}</Link>
          </div>
        </header>
        <div className="text-[16px] sm:text-[17px] leading-[1.95] text-gray-800 [word-break:keep-all] [overflow-wrap:anywhere]">
          <div id="background" className="space-y-5 scroll-mt-24">{item.lead.map((p) => <p key={p}>{p}</p>)}</div>
          <div id="process" className="scroll-mt-24">
            {item.sections.map((section) => (
              <section key={section.id} id={section.id} className="mt-10 sm:mt-12 scroll-mt-24">
                <h2 className="text-xl sm:text-2xl font-bold leading-snug text-black mb-5">{section.title}</h2>
                <div className="space-y-5">{section.paragraphs.map((p) => <p key={p}>{p}</p>)}</div>
                {visuals.filter((visual) => visual.after === section.id).map((visual) => <CaseVisual key={visual.id} visual={visual} number={visuals.indexOf(visual) + 1} />)}
              </section>
            ))}
          </div>
        </div>
        <footer className="mt-12 sm:mt-16 border-t border-gray-200 pt-6">
          <p className="mb-6 text-sm text-gray-500">최종 수정 <time dateTime={item.updatedAt}>{item.updatedAt}</time></p>
          {item.references?.map((reference) => <p key={reference.url} className="mb-6 text-sm text-gray-600">기술 참고: <a href={reference.url} className="underline underline-offset-4">{reference.label}</a></p>)}
          <section aria-labelledby="case-evidence" className="mb-8 text-sm text-gray-600 leading-relaxed">
            <h2 id="case-evidence" className="font-bold text-black mb-2">사례의 공개 범위</h2>
            <p>홍승협이 수행한 역할과 작업 과정을 정리한 사례입니다. 고객 이름과 내부 문서는 공개하지 않습니다. 설명을 위해 재구성한 화면은 실제 고객 원본과 구분해 표시합니다. 기술 참고 링크는 방법의 근거이며 고객의 성과를 독립적으로 검증한 자료는 아닙니다.</p>
          </section>
          <section aria-labelledby="related-title">
            <h2 id="related-title" className="text-sm font-bold text-gray-500 mb-4">함께 읽을 글</h2>
            <ul className="space-y-3">{related.map((value) => <li key={value.slug}><Link href={`/cases/${value.slug}`} className="underline underline-offset-4 leading-relaxed hover:text-[#FF0033]">{value.title}</Link></li>)}</ul>
          </section>
          <p id="education" className="mt-7 text-sm text-gray-600 scroll-mt-24">관련 교육: <Link href={`/education#${item.program}`} className="underline underline-offset-4">{program.title}</Link></p>
        </footer>
      </article>
    </div>
  );
}
