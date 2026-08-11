"use client";

import { useEffect, useState } from "react";
import { prepareDocs, type PreparedDoc, type SearchBodyDoc, type SearchDoc } from "@/lib/search";

/**
 * 검색 인덱스를 받아 오는 훅.
 *
 * 1차(제목, 설명, 태그)를 먼저 받아 결과를 그리고, 2차(소제목, 본문)는 뒤이어 받아
 * 도착하면 다시 매긴다. 2차가 5배 무거워서 함께 기다리면 첫 결과가 그만큼 늦어진다.
 *
 * 모듈 스코프에 Promise를 캐시해 두므로 검색창을 몇 번 여닫아도 요청은 세션당 한 번이다.
 */

let indexPromise: Promise<SearchDoc[]> | null = null;
let bodyPromise: Promise<SearchBodyDoc[]> | null = null;

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`검색 인덱스를 불러오지 못했습니다: ${response.status}`);
  return (await response.json()) as T;
}

function loadIndex(): Promise<SearchDoc[]> {
  // 실패한 Promise를 캐시에 남기면 재시도가 영영 막힌다. 실패 시 캐시를 비운다.
  indexPromise ??= fetchJson<SearchDoc[]>("/search-index.json").catch((error) => {
    indexPromise = null;
    throw error;
  });
  return indexPromise;
}

function loadBody(): Promise<SearchBodyDoc[]> {
  bodyPromise ??= fetchJson<SearchBodyDoc[]>("/search-body.json").catch((error) => {
    bodyPromise = null;
    throw error;
  });
  return bodyPromise;
}

export interface SearchIndexState {
  /** 검색 가능한 문서. 1차만 도착한 단계에서도 값이 찬다. */
  docs: PreparedDoc[];
  /** 1차조차 아직 없는 상태 */
  isLoading: boolean;
  /** 본문 인덱스까지 반영됐는지. "본문까지 검색 중" 표시에 쓴다. */
  hasBody: boolean;
  error: string | null;
}

/**
 * @param enabled 검색창을 열기 전에는 인덱스를 받지 않는다. 첫 화면 비용을 0으로 둔다.
 */
export function useSearchIndex(enabled: boolean): SearchIndexState {
  const [docs, setDocs] = useState<PreparedDoc[]>([]);
  const [hasBody, setHasBody] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;

    loadIndex()
      .then((index) => {
        if (cancelled) return;
        setDocs(prepareDocs(index));
        setError(null);

        return loadBody().then((bodies) => {
          if (cancelled) return;
          setDocs(prepareDocs(index, bodies));
          setHasBody(true);
        });
      })
      .catch(() => {
        if (cancelled) return;
        // 본문 인덱스만 실패하면 1차 결과는 이미 그려져 있으므로 오류로 덮지 않는다.
        setDocs((current) => {
          if (current.length === 0) setError("검색 데이터를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.");
          return current;
        });
      });

    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return { docs, isLoading: enabled && docs.length === 0 && error === null, hasBody, error };
}
