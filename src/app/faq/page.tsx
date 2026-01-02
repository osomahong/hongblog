"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Sparkles, Database, TrendingUp } from "lucide-react";
import { NeoCard, NeoCardHeader, NeoCardTitle, NeoCardContent } from "@/components/neo";
import { NeoBadge } from "@/components/neo";
import { NeoInput } from "@/components/neo";
import { NeoTagBadge } from "@/components/neo";

type Faq = {
  id: number;
  slug: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  recommendedYear?: string;
  recommendedPositions?: string[];
  difficulty?: string;
  referenceUrl?: string;
  techStack?: string[];
};

const categoryIcons = {
  AI_TECH: Sparkles,
  DATA: Database,
  MARKETING: TrendingUp,
};

const categoryLabels = {
  AI_TECH: "AI & Tech",
  DATA: "Data",
  MARKETING: "Marketing",
};

export default function FAQPage() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/faqs")
      .then((res) => res.json())
      .then((data) => {
        setFaqs(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = !selectedCategory || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["AI_TECH", "DATA", "MARKETING"] as const;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
      {/* Hero Section */}
      <section className="mb-8 sm:mb-12">
        <div className="bg-black border-4 border-black neo-shadow-lg p-5 sm:p-8 md:p-12 rotate-1 halftone-corner">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black uppercase text-white tracking-tighter mb-2 sm:mb-4 relative z-10">
            <span className="text-accent comic-emphasis">FAQ</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-2xl relative z-10">
            자주 묻는 질문과 답변을 검색하고 탐색하세요
          </p>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="mb-6 sm:mb-8">
        <div className="flex flex-col gap-3 sm:gap-4">
          <div className="relative">
            <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
            <NeoInput
              type="text"
              placeholder="질문, 답변, 태그로 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 sm:pl-12 text-sm sm:text-base py-2.5 sm:py-3"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:overflow-visible">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 font-bold uppercase text-xs sm:text-sm border-2 border-black transition-all whitespace-nowrap flex-shrink-0 ${!selectedCategory ? "bg-black text-white" : "bg-white text-black hover:bg-gray-100"
                }`}
            >
              All
            </button>
            {categories.map((cat) => {
              const Icon = categoryIcons[cat];
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 font-bold uppercase text-xs sm:text-sm border-2 border-black transition-all flex items-center gap-1 whitespace-nowrap flex-shrink-0 ${selectedCategory === cat
                    ? "bg-black text-white"
                    : "bg-white text-black hover:bg-gray-100"
                    }`}
                >
                  <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">{categoryLabels[cat]}</span>
                  <span className="xs:hidden">{cat.split("_")[0]}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Results Count */}
      <div className="mb-4 sm:mb-6">
        <span className="font-mono text-xs sm:text-sm text-muted-foreground">
          {isLoading ? "Loading..." : `${filteredFaqs.length} results found`}
        </span>
      </div>

      {/* FAQ List */}
      <section className="space-y-3 sm:space-y-4">
        {filteredFaqs.map((faq, index) => {
          const Icon = categoryIcons[faq.category as keyof typeof categoryIcons];
          return (
            <Link key={faq.id} href={`/faq/${faq.slug}`}>
              <NeoCard
                hover
                className={`${index % 3 === 0 ? "-rotate-0.5" : index % 3 === 1 ? "rotate-0.5" : ""} p-4 sm:p-6`}
              >
                <NeoCardHeader className="mb-2 sm:mb-4">
                  <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap">
                      <NeoBadge
                        variant={
                          faq.category === "AI_TECH"
                            ? "primary"
                            : faq.category === "DATA"
                              ? "default"
                              : "accent"
                        }
                      >
                        <span className="flex items-center gap-1">
                          <Icon className="w-3 h-3" />
                          {categoryLabels[faq.category as keyof typeof categoryLabels]}
                        </span>
                      </NeoBadge>
                      {faq.difficulty && (
                        <NeoBadge variant="outline" className="bg-white">
                          {faq.difficulty === "EASY" ? "쉬움" : faq.difficulty === "MEDIUM" ? "보통" : faq.difficulty === "HARD" ? "어려움" : "공식문서"}
                        </NeoBadge>
                      )}
                      {faq.recommendedYear && (
                        <NeoBadge variant="default" className="bg-gray-200 text-gray-700 hover:bg-gray-300">
                          {faq.recommendedYear === "JUNIOR" ? "주니어" : faq.recommendedYear === "MID" ? "미들" : faq.recommendedYear === "SENIOR" ? "시니어" : "전체"}
                        </NeoBadge>
                      )}
                    </div>
                  </div>
                  <NeoCardTitle className="text-lg sm:text-xl">{faq.question}</NeoCardTitle>
                </NeoCardHeader>
                <NeoCardContent>
                  <p className="text-sm sm:text-base text-muted-foreground line-clamp-2">
                    {faq.answer}
                  </p>
                  <div className="flex gap-1.5 mt-2 sm:mt-3 flex-wrap">
                    {faq.tags.map((tag) => (
                      <NeoTagBadge key={tag} tag={tag} clickable={false} className="text-[10px] px-2 py-0.5" />
                    ))}
                  </div>
                </NeoCardContent>
              </NeoCard>
            </Link>
          );
        })}

        {!isLoading && filteredFaqs.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <Search className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-muted-foreground mb-3 sm:mb-4" />
            <p className="text-base sm:text-lg font-bold">검색 결과가 없습니다</p>
            <p className="text-sm sm:text-base text-muted-foreground">다른 키워드로 검색해보세요</p>
          </div>
        )}
      </section>
    </div>
  );
}
