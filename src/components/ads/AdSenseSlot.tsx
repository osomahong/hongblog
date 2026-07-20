"use client";

import { useEffect, useRef } from "react";
import { ADSENSE_CLIENT } from "@/lib/ads";

declare global {
  interface Window {
    adsbygoogle?: object[];
  }
}

interface AdSenseSlotProps {
  /** 광고 단위 슬롯 ID. 빈 문자열이면 아무것도 렌더링하지 않는다. */
  slot: string;
  /** 반응형 디스플레이는 "auto", 인아티클/인피드는 "fluid" */
  format?: "auto" | "fluid";
  /** 인아티클 광고: "in-article" */
  layout?: string;
  /** 인피드 광고 레이아웃 키 */
  layoutKey?: string;
  /** CLS(레이아웃 밀림) 방지용 예약 최소 높이(px) */
  minHeight?: number;
  className?: string;
}

export function AdSenseSlot({
  slot,
  format = "auto",
  layout,
  layoutKey,
  minHeight = 250,
  className = "",
}: AdSenseSlotProps) {
  const insRef = useRef<HTMLModElement>(null);
  const pushedRef = useRef(false);

  useEffect(() => {
    if (!slot || pushedRef.current) return;
    // 이미 광고가 채워진 요소에 다시 push하면 애드센스 스크립트가 에러를 던진다
    if (insRef.current?.getAttribute("data-adsbygoogle-status")) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushedRef.current = true;
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("[AdSenseSlot] adsbygoogle push 실패", error);
      }
    }
  }, [slot]);

  if (!slot) return null;

  return (
    <div className={className} style={{ minHeight }} aria-label="광고">
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-ad-layout={layout}
        data-ad-layout-key={layoutKey}
        data-full-width-responsive="true"
      />
    </div>
  );
}
