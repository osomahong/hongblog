"use client";

/**
 * GA4 Edu 페이지의 HTML in Canvas 장식 묶음.
 *
 * 카드와 링크는 서버 컴포넌트로 그리고 있어서, 이벤트 위임으로 효과만 얹는다.
 * 이렇게 하면 링크 하나하나를 클라이언트 컴포넌트로 바꾸지 않아도 된다.
 *
 * 1) 관련 글 카드에 마우스를 올리면 홀로그램 스캔 띠가 지나간다
 * 2) 튜토리얼로 이동할 때 지금 화면이 재가 되어 날아간다
 *
 * 목록 줄의 출렁임 효과는 30줄을 훑을 때 눈이 어지러워 2026-08-21에 뺐다.
 *
 * 크롬 실험 API를 지원하지 않는 브라우저에서는 두 가지 모두 조용히 생략되고
 * 링크는 평소대로 동작한다.
 */

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ashNavigate, hologramElement, supportsHtmlInCanvas } from "@/lib/canvas-fx";

/** 재 날림 전환을 걸 링크. 목록 줄, 추천 카드, 허브로 돌아가는 링크 */
const NAV_SELECTOR = "a.ga4-hub-item, a.ga4-post, a.ga4-back";

export function Ga4EduCanvasFx() {
  const router = useRouter();

  useEffect(() => {
    if (!supportsHtmlInCanvas()) return;

    const onOver = (e: MouseEvent) => {
      const card = (e.target as HTMLElement | null)?.closest<HTMLElement>("a.ga4-post");
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
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("click", onClick, true);
    };
  }, [router]);

  return null;
}
