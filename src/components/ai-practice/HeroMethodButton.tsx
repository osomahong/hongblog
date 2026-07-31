"use client";

/**
 * 히어로의 "수업 방식 안내" CTA.
 * LiquidButton은 내부 구조상 asChild(Slot)를 지원하지 못해, onClick 스크롤로 이동한다.
 */

import { LiquidButton } from "@/components/ui/liquid-glass-button";

export function HeroMethodButton() {
  return (
    <LiquidButton
      size="lg"
      className="rounded-full text-white font-semibold"
      onClick={() => document.getElementById("method")?.scrollIntoView({ behavior: "smooth" })}
    >
      수업 방식 안내
    </LiquidButton>
  );
}
