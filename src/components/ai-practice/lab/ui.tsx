"use client";

import type { ReactNode } from "react";
import { ArrowUp } from "lucide-react";

/** 다크 배경용 고스트 버튼 */
export const BTN_GHOST =
  "inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full border border-white/15 text-sm font-semibold text-white hover:border-white/40 transition-colors disabled:opacity-40 disabled:pointer-events-none";

/** 기본 진행 버튼: 사이트 CTA와 같은 빨간 필. 다크 배경에서 클릭 대상을 분명하게 보여 준다 */
export const BTN_PRIMARY =
  "inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-[#ff0033] text-white text-sm font-semibold hover:bg-[#e0002d] transition-colors disabled:opacity-40 disabled:pointer-events-none";

/** 채팅 안내 말풍선 안에서 쓰는 작은 진행 버튼 */
export const BTN_PRIMARY_SM =
  "inline-flex items-center justify-center gap-1.5 px-5 py-2 rounded-full bg-[#ff0033] text-white text-xs font-semibold hover:bg-[#e0002d] transition-colors disabled:opacity-40 disabled:pointer-events-none";

/* ===== 인사이트 카드 (정리 단계 등 정적 화면 전용) ===== */

export function Callout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="ap-card ap-card-accent p-6 sm:p-7 ap-fade-up">
      <div className="flex items-start gap-4">
        <img
          src="/images/ai-practice/icons/bulb-note.png"
          alt=""
          aria-hidden
          className="ap-icon-3d w-10 h-10"
        />
        <div className="min-w-0">
          <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[#a78bfa] mb-2">
            Insight : {title}
          </p>
          <div className="text-sm sm:text-[15px] leading-relaxed text-gray-200 space-y-2">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===== 미니멀 다크 컴포저 ===== */

export interface PromptSegment {
  text: string;
  highlight?: boolean;
  /** 블록 구분 태그. 예: "역할", "맥락 조건", "형식 지정". 새 블록이 있을 때만 표시된다. */
  label?: string;
}

interface ComposerProps {
  segments: PromptSegment[];
  onSend: () => void;
  disabled?: boolean;
  children?: ReactNode;
  /** children 옵션 영역의 ARIA role. 단일 선택 칩이면 "radiogroup", 복수 선택이면 "group" */
  optionsRole?: "radiogroup" | "group";
  optionsLabel?: string;
}

/**
 * 보낼 프롬프트를 보여 주는 다크 플로팅 입력 바.
 * children은 조건 칩, 형식 선택 같은 옵션 영역. 스트리밍 중에도 사라지지 않고
 * 전송 버튼만 비활성화되어 화면 높이가 흔들리지 않는다.
 */
export function Composer({
  segments,
  onSend,
  disabled,
  children,
  optionsRole,
  optionsLabel,
}: ComposerProps) {
  const hasNew = segments.some((s) => s.highlight);

  return (
    <div className="ap-composer p-4 sm:p-5">
      <div className="min-h-[48px] mb-3 space-y-2.5">
        {segments.map((seg, i) => {
          if (seg.highlight) {
            return (
              <div key={`${i}-${seg.label ?? "added"}`} className="ap-seg-added ap-fade-up">
                <span className="ap-seg-badge">+ 새로 추가된 {seg.label ?? "블록"}</span>
                <p className="text-sm leading-relaxed whitespace-pre-wrap break-keep text-[#ffeecb]">
                  {seg.text}
                </p>
              </div>
            );
          }
          return (
            <div key={`${i}-${seg.label ?? "base"}`}>
              {hasNew && (
                <span className="ap-seg-tag text-[var(--ap-muted)]">
                  {seg.label ?? "기존 프롬프트"}
                </span>
              )}
              <p className="text-sm leading-relaxed whitespace-pre-wrap break-keep text-gray-200">
                {seg.text}
              </p>
            </div>
          );
        })}
      </div>
      <div className="flex items-end justify-between gap-3">
        <div className="flex flex-wrap gap-2" role={optionsRole} aria-label={optionsLabel}>
          {children}
        </div>
        <button
          type="button"
          onClick={onSend}
          disabled={disabled}
          aria-label="프롬프트 전송"
          className="flex-shrink-0 w-10 h-10 rounded-full bg-white text-[#17171c] flex items-center justify-center transition-opacity hover:opacity-90 disabled:opacity-30 disabled:pointer-events-none"
        >
          <ArrowUp className="w-4.5 h-4.5" strokeWidth={2.2} />
        </button>
      </div>
    </div>
  );
}
