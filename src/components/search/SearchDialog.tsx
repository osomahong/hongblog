"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { Search, X, CornerDownLeft } from "lucide-react";
import { sendGAEvent } from "@/lib/gtm";
import { parseTerms, search } from "@/lib/search";
import { SearchResultList } from "./SearchResultList";
import { useSearchIndex } from "./useSearchIndex";

/** 오버레이에 보여줄 결과 수. 나머지는 전체 결과 페이지로 넘긴다. */
const PREVIEW_LIMIT = 8;

/** 빈 상태에서 보여줄 추천 검색어. 실제 태그가 아니라 검색 유도용 단어다. */
const SUGGESTED_TERMS = ["GA4", "GEO", "클로드", "챗GPT", "SEO", "앱마케팅"];

interface SearchDialogProps {
  onClose: () => void;
}

/**
 * 내비 돋보기로 여는 즉시 검색 오버레이.
 *
 * 결과를 바로 보여 주되, Enter나 "전체 결과 보기"는 /search?q=로 넘긴다.
 * 오버레이는 빠른 이동용이고, 공유와 GA4 검색어 집계는 파라미터 페이지가 맡는다.
 *
 * 열려 있을 때만 마운트되는 것을 전제로 한다. 닫으면 컴포넌트째 사라지므로
 * 지난 검색어를 비우는 별도 처리가 필요 없고, 인덱스도 열기 전에는 받지 않는다.
 */
export function SearchDialog({ onClose }: SearchDialogProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);

  const { docs, isLoading, hasBody, error } = useSearchIndex(true);

  const terms = useMemo(() => parseTerms(query), [query]);
  const hits = useMemo(
    () => (terms.length === 0 ? [] : search(docs, query, { limit: PREVIEW_LIMIT })),
    [docs, query, terms.length]
  );

  // 모바일 키보드가 올라오도록 렌더 직후에 포커스를 준다.
  useEffect(() => {
    const timer = window.setTimeout(() => inputRef.current?.focus(), 0);
    return () => window.clearTimeout(timer);
  }, []);

  // 오버레이 뒤 본문이 같이 스크롤되지 않게 막는다.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  function submit(term: string) {
    const trimmed = term.trim();
    if (!trimmed) return;
    sendGAEvent("search", { search_term: trimmed, location: "nav_overlay" });
    onClose();
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((i) => (hits.length === 0 ? -1 : (i + 1) % hits.length));
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => (hits.length === 0 ? -1 : (i <= 0 ? hits.length : i) - 1));
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      const selected = hits[activeIndex];
      if (selected) {
        sendGAEvent("search", { search_term: query.trim(), location: "nav_overlay" });
        onClose();
        router.push(selected.doc.href);
        return;
      }
      submit(query);
    }
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center px-3 sm:px-4 pt-16 sm:pt-24"
      role="dialog"
      aria-modal="true"
      aria-label="사이트 내 검색"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label="검색 닫기"
        tabIndex={-1}
      />

      <div
        className="relative w-full max-w-2xl bg-white border-4 border-black neo-shadow-lg max-h-[80vh] flex flex-col"
        onKeyDown={(event) => {
          if (event.key === "Escape") onClose();
        }}
      >
        <div className="flex items-center gap-2 p-3 sm:p-4 border-b-4 border-black flex-shrink-0">
          <Search className="w-5 h-5 flex-shrink-0" aria-hidden />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              // 목록이 바뀌면 지난 선택 위치는 의미가 없다
              setActiveIndex(-1);
            }}
            onKeyDown={handleKeyDown}
            placeholder="제목, 설명, 본문에서 검색"
            aria-label="검색어"
            // 크롬 기본 지우기(✕)를 숨긴다. 바로 옆 닫기 버튼과 ✕가 두 개로 겹쳐 보인다.
            className="flex-1 min-w-0 text-base sm:text-lg font-bold bg-transparent focus:outline-none placeholder:text-gray-400 placeholder:font-medium [&::-webkit-search-cancel-button]:appearance-none"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="검색 닫기"
            className="p-1.5 border-2 border-black neo-shadow-sm active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1">
          {error && <p className="p-4 text-sm text-gray-600">{error}</p>}

          {!error && terms.length === 0 && (
            <div className="p-4">
              <p className="text-xs font-black uppercase tracking-wide text-gray-500 mb-2.5">
                추천 검색어
              </p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_TERMS.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => {
                      sendGAEvent("search", {
                        search_term: term,
                        location: "nav_overlay_suggest",
                      });
                      setQuery(term);
                      setActiveIndex(-1);
                      inputRef.current?.focus();
                    }}
                    className="px-3 py-1.5 text-xs font-bold border-2 border-black neo-shadow-sm bg-white hover:bg-[#FFD700] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!error && terms.length > 0 && isLoading && (
            <p className="p-4 text-sm text-gray-500">검색 데이터를 불러오는 중입니다.</p>
          )}

          {!error && terms.length > 0 && !isLoading && hits.length === 0 && (
            <p className="p-4 text-sm text-gray-600">
              &lsquo;{query.trim()}&rsquo; 검색 결과가 없습니다.
              {!hasBody && " 본문 데이터를 아직 불러오는 중입니다."}
            </p>
          )}

          {hits.length > 0 && (
            <SearchResultList
              hits={hits}
              terms={terms}
              variant="compact"
              activeIndex={activeIndex}
              onNavigate={(hit) => {
                sendGAEvent("search", {
                  search_term: query.trim(),
                  location: "nav_overlay",
                  destination: hit.doc.href,
                });
                // 닫지 않으면 이동한 글 위에 오버레이가 그대로 덮이고
                // body의 스크롤 잠금도 풀리지 않는다.
                onClose();
              }}
            />
          )}
        </div>

        {terms.length > 0 && hits.length > 0 && (
          <button
            type="button"
            onClick={() => submit(query)}
            className="flex-shrink-0 flex items-center justify-center gap-2 p-3 border-t-4 border-black bg-black text-white text-sm font-black uppercase tracking-wide hover:bg-[#FF0033] transition-colors"
          >
            <CornerDownLeft className="w-4 h-4" />
            전체 결과 보기
          </button>
        )}
      </div>
    </div>,
    document.body
  );
}
