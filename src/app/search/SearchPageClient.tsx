"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { sendGAEvent } from "@/lib/gtm";
import { parseTerms, search, type SearchDocType } from "@/lib/search";
import { SearchResultList } from "@/components/search/SearchResultList";
import { useSearchIndex } from "@/components/search/useSearchIndex";
import { cn } from "@/lib/utils";

const RESULT_LIMIT = 60;

const TYPE_FILTERS: { value: SearchDocType | "all"; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "insight", label: "인사이트" },
  { value: "class", label: "클래스" },
  { value: "course", label: "코스" },
];

/**
 * /search?q= 결과 페이지.
 *
 * 검색어를 URL에 두면 결과를 그대로 공유할 수 있고, GA4 search 이벤트의
 * search_term으로 어떤 질의가 들어오는지 그대로 쌓인다.
 */
export function SearchPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("q") ?? "";

  const [input, setInput] = useState(queryParam);
  const [typeFilter, setTypeFilter] = useState<SearchDocType | "all">("all");
  const lastTrackedRef = useRef<string | null>(null);

  const { docs, isLoading, hasBody, error } = useSearchIndex(true);

  // 뒤로 가기나 오버레이에서 넘어온 경우에도 입력창이 URL을 따라가야 한다.
  useEffect(() => {
    setInput(queryParam);
  }, [queryParam]);

  // 같은 검색어로 리렌더될 때 이벤트가 중복 발생하지 않게 마지막 값을 기억한다.
  useEffect(() => {
    const trimmed = queryParam.trim();
    if (!trimmed || lastTrackedRef.current === trimmed) return;
    lastTrackedRef.current = trimmed;
    sendGAEvent("search", { search_term: trimmed, location: "search_page" });
  }, [queryParam]);

  const terms = useMemo(() => parseTerms(queryParam), [queryParam]);
  const hits = useMemo(
    () =>
      terms.length === 0
        ? []
        : search(docs, queryParam, {
            limit: RESULT_LIMIT,
            types: typeFilter === "all" ? undefined : [typeFilter],
          }),
    [docs, queryParam, terms.length, typeFilter]
  );

  // 타입 칩에 붙일 개수는 필터를 걸기 전 결과에서 센다.
  const countsByType = useMemo(() => {
    if (terms.length === 0) return null;
    const all = search(docs, queryParam, { limit: RESULT_LIMIT });
    const counts: Record<string, number> = { all: all.length };
    for (const hit of all) counts[hit.doc.type] = (counts[hit.doc.type] ?? 0) + 1;
    return counts;
  }, [docs, queryParam, terms.length]);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    router.replace(`/search?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
      <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tighter mb-4 sm:mb-6">
        <span className="text-[#FF0033]">Search</span>
      </h1>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-4 sm:mb-6">
        <div className="flex items-center gap-2 flex-1 min-w-0 bg-white border-4 border-black neo-shadow px-3 py-2.5">
          <Search className="w-5 h-5 flex-shrink-0" aria-hidden />
          <input
            type="search"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="제목, 설명, 본문에서 검색"
            aria-label="검색어"
            className="flex-1 min-w-0 text-base font-bold bg-transparent focus:outline-none placeholder:text-gray-400 placeholder:font-medium"
          />
        </div>
        <button
          type="submit"
          className="px-4 sm:px-6 bg-black text-white font-black uppercase text-sm border-4 border-black neo-shadow hover:bg-[#FF0033] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all flex-shrink-0"
        >
          검색
        </button>
      </form>

      {terms.length > 0 && countsByType && (
        <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
          {TYPE_FILTERS.map(({ value, label }) => {
            const count = countsByType[value] ?? 0;
            if (value !== "all" && count === 0) return null;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setTypeFilter(value)}
                className={cn(
                  "px-3 py-1.5 text-xs font-black uppercase border-2 border-black transition-all",
                  typeFilter === value
                    ? "bg-black text-white"
                    : "bg-white text-black neo-shadow-sm hover:bg-[#FFF7CC]"
                )}
              >
                {label} {count}
              </button>
            );
          })}
        </div>
      )}

      {error && <p className="text-sm text-gray-600">{error}</p>}

      {!error && terms.length === 0 && (
        <p className="text-sm text-gray-500">
          검색어를 입력하면 인사이트, 클래스, 코스를 한 번에 찾습니다.
        </p>
      )}

      {!error && terms.length > 0 && (
        <>
          <p className="text-xs sm:text-sm font-mono text-gray-500 mb-3 sm:mb-4">
            {isLoading
              ? "검색 데이터를 불러오는 중입니다."
              : `‘${queryParam.trim()}’ 결과 ${hits.length}건${hasBody ? "" : " (본문 데이터 불러오는 중)"}`}
          </p>

          {!isLoading && hits.length === 0 && (
            <p className="text-sm text-gray-600">
              검색 결과가 없습니다. 더 짧은 단어로 다시 찾아 보세요.
            </p>
          )}

          {hits.length > 0 && (
            <SearchResultList
              hits={hits}
              terms={terms}
              onNavigate={(hit) =>
                sendGAEvent("search", {
                  search_term: queryParam.trim(),
                  location: "search_page",
                  destination: hit.doc.href,
                })
              }
            />
          )}
        </>
      )}
    </div>
  );
}
