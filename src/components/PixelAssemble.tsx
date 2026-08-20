"use client";

import { useEffect, useRef } from "react";
import { assembleElement } from "@/lib/canvas-fx";

// 감싼 영역이 흩어진 픽셀이 모여드는 연출로 나타난다.
// HTML in Canvas 미지원 브라우저에서는 아무 효과 없이 즉시 보인다.
// 404처럼 서버 컴포넌트인 페이지에서 일부 영역만 감싸는 용도다.
export function PixelAssemble({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // 웹폰트와 레이아웃이 자리 잡은 뒤에 캡처해야 파편이 최종 모습과 같다
    const timer = setTimeout(() => {
      void assembleElement(el);
    }, 120);
    return () => clearTimeout(timer);
  }, []);

  return <div ref={ref}>{children}</div>;
}
