"use client";

/**
 * 튜토리얼 안내 장치.
 *
 * 화면에 나오는 안내는 두 가지다.
 *  1. GA4 화면 안에 서 있는 도우미가 말풍선으로 건네는 지시문 한 줄
 *  2. 다음에 누를 요소를 두르는 빨간 상자
 * GA4가 강조색으로 파랑만 쓰기 때문에, 눌러야 할 곳은 빨간색으로 구분한다.
 */

import { createContext, useContext, type ReactNode } from "react";
import { RotateCcw } from "lucide-react";

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

/** GA4 화면 오른쪽 아래에 서서 지시문을 건네는 도우미 */
export function Ga4Guide({ index, total, instruction, miss, done, onRestart }: Ga4GuideProps) {
  const tone = miss ? " ga4-guide-miss" : done ? " ga4-guide-done" : "";

  return (
    <div className={`ga4-guide${tone}`} role="status" aria-live="polite">
      <div className="ga4-guide-bubble">
        <p className="ga4-guide-step">
          {done ? "다 했습니다" : `${index + 1}단계 / 전체 ${total}단계`}
        </p>
        <p className="ga4-guide-text">{miss ?? instruction}</p>
        {done && (
          <button type="button" className="ga4-guide-restart" onClick={onRestart}>
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
