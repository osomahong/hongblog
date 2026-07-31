"use client";

/**
 * 마우스를 따라 라디얼 글로우가 움직이는 스포트라이트 카드.
 * 21st.dev의 spotlight card 패턴을 프로젝트 스타일에 맞게 구현했다.
 * 오버레이는 pointer-events가 없어 카드 안의 링크, 버튼 동작에 영향을 주지 않는다.
 */

import { useRef, useState } from "react";
import type { MouseEvent, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  /** 글로우 색상 (rgba 권장) */
  spotlightColor?: string;
  /** 글로우 반지름(px) */
  radius?: number;
}

export function SpotlightCard({
  children,
  className,
  spotlightColor = "rgba(167, 139, 250, 0.14)",
  radius = 480,
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={cn("relative overflow-hidden", className)}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(${radius}px circle at ${pos.x}px ${pos.y}px, ${spotlightColor}, transparent 70%)`,
        }}
      />
      {children}
    </div>
  );
}
