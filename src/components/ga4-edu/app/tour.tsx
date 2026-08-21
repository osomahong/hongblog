"use client";

/**
 * 튜토리얼 안내 장치.
 *
 * 화면에 나오는 안내는 두 가지다.
 *  1. GA4 화면 안에 서 있는 도우미가 말풍선으로 건네는 지시문 한 줄
 *  2. 다음에 누를 요소를 두르는 빨간 상자
 * GA4가 강조색으로 파랑만 쓰기 때문에, 눌러야 할 곳은 빨간색으로 구분한다.
 */

import { createContext, useContext, useEffect, useRef, type ReactNode } from "react";
import { RotateCcw } from "lucide-react";
import { burstElement, glitchElement, jellyElement, scanInElement } from "@/lib/canvas-fx";

const RingContext = createContext<string | null>(null);

export function RingProvider({ value, children }: { value: string | null; children: ReactNode }) {
  return <RingContext.Provider value={value}>{children}</RingContext.Provider>;
}

/** 이 이름이 지금 스텝의 목표 지점이면 빨간 상자 클래스를 돌려준다 */
export function useRing(name: string): string {
  return useContext(RingContext) === name ? " ga4-ring" : "";
}

interface Ga4GuideProps {
  index: number;
  total: number;
  /** 지금 해야 할 일 한 줄 */
  instruction: string;
  /** 잘못 골랐을 때만 채워진다. 채워지면 이 문구가 대신 나온다 */
  miss?: string | null;
  done: boolean;
  onRestart: () => void;
}

/**
 * GA4 화면 오른쪽 아래에 서서 지시문을 건네는 도우미.
 *
 * 말풍선 내용이 바뀌는 순간에 HTML in Canvas 효과를 얹는다. 스텝을 넘기면 출렁이고,
 * 잘못 고르면 화면이 한 번 튀고, 다 끝내면 말풍선에서 파편이 터진다.
 * 미지원 브라우저에서는 세 가지 모두 아무 일도 일어나지 않는다.
 */
export function Ga4Guide({ index, total, instruction, miss, done, onRestart }: Ga4GuideProps) {
  const tone = miss ? " ga4-guide-miss" : done ? " ga4-guide-done" : "";
  const bubbleRef = useRef<HTMLDivElement | null>(null);
  // 첫 렌더에서 효과가 돌지 않도록 직전 값을 들고 있는다
  const prev = useRef({ index, miss: miss ?? null, done });

  useEffect(() => {
    const bubble = bubbleRef.current;
    const before = prev.current;
    prev.current = { index, miss: miss ?? null, done };
    if (!bubble) return;

    if (done && !before.done) {
      void burstElement(bubble);
      return;
    }
    if (miss && miss !== before.miss) {
      void glitchElement(bubble);
      return;
    }
    if (!done && index > before.index) {
      void jellyElement(bubble);
    }
  }, [index, miss, done]);

  return (
    <div className={`ga4-guide${tone}`} role="status" aria-live="polite">
      <div className="ga4-guide-bubble" ref={bubbleRef}>
        <p className="ga4-guide-step">
          {done ? "다 했습니다" : `${index + 1}단계 / 전체 ${total}단계`}
        </p>
        <p className="ga4-guide-text">{miss ?? instruction}</p>
        {done && (
          <button
            type="button"
            className="ga4-guide-restart"
            onClick={(e) => {
              // 처음 화면으로 되돌리면서 스캔 띠가 위에서 아래로 지나간다
              const app = e.currentTarget.closest(".ga4-stage")?.querySelector<HTMLElement>(".ga4-app");
              onRestart();
              if (app) void scanInElement(app);
            }}
          >
            <RotateCcw className="w-3.5 h-3.5" strokeWidth={2} aria-hidden />
            다시 하기
          </button>
        )}
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/ga4-edu/guide.png"
        alt="GA4 화면을 안내하는 도우미"
        className="ga4-guide-face"
      />
    </div>
  );
}
