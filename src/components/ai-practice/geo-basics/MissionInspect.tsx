"use client";

/**
 * 미션 2: 목업 사이트(웹인웹)를 사람의 눈과 AI의 눈으로 번갈아 보면서,
 * 통 이미지 상세페이지가 크롤러에게 어떻게 읽히는지 확인한다.
 * 왼쪽은 모바일 목업 사이트, 오른쪽은 설명란이다.
 */

import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { EXTRACT_BEFORE, M2, PAGE_AUDIT } from "./lab-data";
import { MockSiteViewer } from "./MockSiteViewer";
import { NoteCard } from "./NoteCard";

/** 페이지 구성 요소별 판독 카드: 어떤 요소가 읽히고 어떤 이미지가 안 읽히는지 보여 준다 */
function PageAuditCard() {
  return (
    <div className="ap-card ap-card-accent p-5">
      <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-[var(--ap-muted)] mb-3.5">
        이 페이지의 구성 요소 판독
      </p>
      <div className="space-y-3">
        {PAGE_AUDIT.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-3.5 rounded-[12px] border border-white/10 bg-white/[0.02] p-3"
          >
            {item.thumb ? (
              <img
                src={item.thumb}
                alt={`${item.label} 미리보기`}
                className="w-14 h-14 rounded-[8px] object-cover object-top flex-shrink-0 border border-white/10"
              />
            ) : (
              <span
                className="w-14 h-14 rounded-[8px] flex items-center justify-center flex-shrink-0 border border-white/10 bg-white/[0.05] font-semibold text-lg text-gray-200"
                aria-hidden
              >
                가
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white mb-0.5">{item.label}</p>
              <p className="text-[12px] leading-relaxed text-[var(--ap-muted)]">{item.note}</p>
            </div>
            {item.readable ? (
              <span className="inline-flex items-center gap-1.5 flex-shrink-0 text-[12px] font-semibold text-[#7dd3fc]">
                <CheckCircle2 className="w-4 h-4" strokeWidth={1.8} /> 읽힘
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 flex-shrink-0 text-[12px] font-semibold text-[#ff8fa3]">
                <XCircle className="w-4 h-4" strokeWidth={1.8} /> 읽을 수 없음
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function MissionInspect({ onComplete }: { onComplete: () => void }) {
  const [aiViewed, setAiViewed] = useState(false);
  const [aiViewRequest, setAiViewRequest] = useState(0);

  return (
    <MockSiteViewer
      src={M2.siteSrc}
      fakeUrl="momofarm.example/peach"
      extraction={EXTRACT_BEFORE}
      onAiViewOpened={() => setAiViewed(true)}
      aiTabCue
      aiViewRequest={aiViewRequest}
    >
      <NoteCard
        text={M2.introNote}
        actionLabel={aiViewed ? undefined : "AI의 눈으로 보기"}
        onAction={aiViewed ? undefined : () => setAiViewRequest((n) => n + 1)}
      />
      <PageAuditCard />
      {aiViewed && (
        <NoteCard text={M2.revealNote} actionLabel="미션 2 완료, 다음으로" onAction={onComplete} />
      )}
    </MockSiteViewer>
  );
}
