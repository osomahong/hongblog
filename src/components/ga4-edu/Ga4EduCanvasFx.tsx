"use client";

/**
 * GA4 Edu 페이지의 HTML in Canvas 장식 묶음.
 *
 * 목록과 카드는 서버 컴포넌트로 그리고 있어서, 이벤트 위임으로 효과만 얹는다.
 * 이렇게 하면 링크 하나하나를 클라이언트 컴포넌트로 바꾸지 않아도 된다.
 *
 * 1) 목록 줄에 마우스를 잠깐 올려 두면 글자가 출렁인다
 * 2) 카드에 마우스를 올리면 홀로그램 스캔 띠가 지나간다
 * 3) 튜토리얼로 이동할 때 지금 화면이 재가 되어 날아간다
 *
 * 크롬 실험 API를 지원하지 않는 브라우저에서는 세 가지 모두 조용히 생략되고
 * 링크는 평소대로 동작한다.
 */

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ashNavigate,
  hologramElement,
  jellyElement,
  supportsHtmlInCanvas,
} from "@/lib/canvas-fx";

/** 재 날림 전환을 걸 링크. 목록 줄, 추천 카드, 허브로 돌아가는 링크 */
const NAV_SELECTOR = "a.ga4-hub-item, a.ga4-post, a.ga4-back";

/**
 * 목록 줄 위에 마우스가 머물러야 하는 시간.
 * 30줄짜리 목록을 살펴보고 지나갈 때마다 줄이 출렁이면 눈이 어지럽다.
 */
const ROW_HOVER_DELAY = 180;

export function Ga4EduCanvasFx() {
  const router = useRouter();

  useEffect(() => {
    if (!supportsHtmlInCanvas()) return;

    let hoverTimer = 0;

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const row = target?.closest<HTMLElement>("a.ga4-hub-item");
      window.clearTimeout(hoverTimer);
      if (row) {
        hoverTimer = window.setTimeout(() => void jellyElement(row), ROW_HOVER_DELAY);
        return;
      }
      const card = target?.closest<HTMLElement>("a.ga4-post");
      if (card) void hologramElement(card);
    };

    const onClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement | null)?.closest<HTMLElement>(NAV_SELECTOR);
      const href = link?.getAttribute("href");
      if (!href || !href.startsWith("/")) return;
      ashNavigate(e, () => router.push(href));
    };

    document.addEventListener("mouseover", onOver, { passive: true });
    document.addEventListener("click", onClick, true);
    return () => {
      window.clearTimeout(hoverTimer);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("click", onClick, true);
    };
  }, [router]);

  return null;
}
