"use client";

/** 채팅 밖에서 쓰는 안내 말풍선. SimChat의 NoteBubble과 같은 스타일을 쓴다. */

import { ArrowRight } from "lucide-react";
import { BTN_PRIMARY_SM } from "../lab/ui";

interface NoteCardProps {
  text: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function NoteCard({ text, actionLabel, onAction }: NoteCardProps) {
  return (
    <div className="ap-fade-up ap-bubble-note px-4 py-3.5" role="status">
      <div className="flex items-start gap-2.5">
        <img
          src="/images/ai-practice/icons/bulb-note.png"
          alt=""
          aria-hidden
          className="ap-icon-3d ap-note-icon"
        />
        <div className="min-w-0">
          <p className="text-[13px] leading-relaxed text-gray-300 whitespace-pre-line">{text}</p>
          {actionLabel && onAction && (
            <button type="button" onClick={onAction} className={`${BTN_PRIMARY_SM} mt-3`}>
              {actionLabel} <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
