import { Metadata } from "next";
import Link from "next/link";
import { Tag } from "lucide-react";
import { NeoTiltCard } from "@/components/neo";
import { getAllTagsWithId as getAllTags } from "@/lib/content";
import { SITE_URL } from "@/lib/constants";
import { ListViewTracker } from "@/components/ListViewTracker";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Tags",
  description: "태그별로 콘텐츠를 탐색하세요",
  alternates: { canonical: `${SITE_URL}/tags` },
};

export default function TagsPage() {
  const allTags = getAllTags();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
      <ListViewTracker eventName="view_tags_list" />

      {/* Hero Section */}
      <section className="mb-8 sm:mb-12">
        <NeoTiltCard
          className="bg-white neo-border-thick neo-shadow-lg p-5 sm:p-8 md:p-12 relative overflow-hidden text-left"
          intensity={20}
          shadowIntensity={10}
        >
          <div className="absolute top-0 right-0 w-24 sm:w-32 h-full bg-black hidden sm:block" style={{ clipPath: "polygon(20% 0, 100% 0, 100% 100%, 0% 100%)", zIndex: 0 }} />
          <div className="relative z-10">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-black uppercase text-black tracking-tighter mb-2 sm:mb-4">
              <span className="text-[#FF0033]">Tags</span>
            </h1>
            <p className="text-sm sm:text-base text-[#222] font-medium max-w-lg border-l-4 border-[#FF0033] pl-4">
              태그별로 콘텐츠를 탐색하세요
            </p>
          </div>
        </NeoTiltCard>
      </section>

      {/* Tag Cloud */}
      <section className="mb-6 sm:mb-8">
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <Link
              key={tag.id}
              href={`/tags/${encodeURIComponent(tag.name)}`}
              className="px-3 py-1.5 text-xs sm:text-sm font-bold uppercase border-2 border-black bg-white text-black neo-shadow-sm hover:bg-[#FF0033] hover:text-white hover:-translate-y-1 hover:shadow-[4px_4px_0_0_#000] active:translate-y-[2px] active:shadow-none transition-all"
            >
              #{tag.name}
            </Link>
          ))}
        </div>
      </section>

      <div className="text-center py-12">
        <Tag className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-lg font-bold">태그를 선택해주세요</p>
        <p className="text-sm text-muted-foreground">
          위의 태그를 클릭하면 관련 콘텐츠를 볼 수 있습니다
        </p>
      </div>
    </div>
  );
}
