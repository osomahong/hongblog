import { Metadata } from "next";
import { NeoTiltCard } from "@/components/neo";
import { getPublishedFaqs } from "@/lib/queries";
import { ListViewTracker } from "@/components/ListViewTracker";
import { FaqFilter } from "./_components/faq-filter";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "FAQ | 자주 묻는 질문",
  description: "디지털 마케팅, AI, 데이터 분석에 대한 자주 묻는 질문과 답변",
};

export default async function FAQPage() {
  const faqs = await getPublishedFaqs();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
      <ListViewTracker eventName="view_faq_list" />
      <section className="mb-8 sm:mb-12">
        <NeoTiltCard className="bg-gradient-to-br from-cyan-600 to-indigo-700 border-4 border-black p-5 sm:p-8 md:p-12 rotate-1 halftone-corner text-left" intensity={20} shadowIntensity={10}>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black uppercase text-white tracking-tighter mb-2 sm:mb-4 relative z-10">
            <span className="text-accent comic-emphasis">FAQ</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-2xl relative z-10">
            자주 묻는 질문과 답변을 검색하고 탐색하세요
          </p>
        </NeoTiltCard>
      </section>

      <FaqFilter faqs={faqs} />
    </div>
  );
}
