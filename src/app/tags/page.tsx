import Link from "next/link";
import { Tag } from "lucide-react";
import { NeoTiltCard } from "@/components/neo";
import { getAllTagsWithId as getAllTags } from "@/lib/content";
import { ListViewTracker } from "@/components/ListViewTracker";

export const dynamic = "force-static";

export default function TagsPage() {
  const allTags = getAllTags();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
      <ListViewTracker eventName="view_tags_list" />

      {/* Hero Section */}
      <section className="mb-8 sm:mb-12">
        <NeoTiltCard
          className="bg-black border-4 border-black p-5 sm:p-8 md:p-12 -rotate-1 halftone-corner text-left"
          intensity={20}
          shadowIntensity={10}
        >
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black uppercase text-white tracking-tighter mb-2 sm:mb-4 relative z-10">
            <span className="text-accent comic-emphasis">Tags</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-2xl relative z-10">
            태그별로 콘텐츠를 탐색하세요
          </p>
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
