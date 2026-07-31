import Image from "next/image";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { AipblTrackNav, type AipblTrackStep } from "./AipblTrackNav";

/**
 * AIPBL 공통 히어로 헤더.
 * 모든 AIPBL 상세 페이지가 동일한 구성(번호 배지, 제목, 정의 문장, 메타 칩, 트랙 스테퍼)을 쓴다.
 */

export interface AipblHeaderMeta {
  /** 다크 테마용 아이콘 이미지 (검정 배경, mix-blend-screen으로 합성) */
  iconSrc: string;
  text: string;
}

export interface AipblHeaderTrack {
  label: string;
  steps: AipblTrackStep[];
  current: number;
}

interface AipblHeaderProps {
  index: string;
  code: string;
  title: string;
  description: string;
  meta: AipblHeaderMeta[];
  track?: AipblHeaderTrack;
}

export function AipblHeader({ index, code, title, description, meta, track }: AipblHeaderProps) {
  return (
    <SpotlightCard
      className="ap-hero p-7 sm:p-12 mb-10"
      spotlightColor="rgba(167, 139, 250, 0.15)"
      radius={640}
    >
      <div className="ap-hero-grid" aria-hidden />
      <span className="ap-hero-num" aria-hidden>
        {index}
      </span>

      <div className="relative max-w-3xl">
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="ap-hero-badge">AIPBL {index}</span>
          <span className="text-[11px] font-mono font-medium tracking-[0.28em] uppercase text-[var(--ap-muted)]">
            {code}
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight leading-tight mb-5">
          {title}
        </h1>
        <div className="ap-hero-underline mb-6" aria-hidden />

        <p className="text-sm sm:text-base leading-relaxed text-[var(--ap-muted)] mb-8">
          {description}
        </p>

        <div className="flex flex-wrap gap-2.5">
          {meta.map(({ iconSrc, text }) => (
            <span
              key={text}
              className="inline-flex items-center gap-2 pl-2.5 pr-3.5 py-1.5 rounded-full border border-white/12 bg-white/[0.03] text-xs font-medium text-gray-200"
            >
              <Image
                src={iconSrc}
                alt=""
                width={24}
                height={24}
                className="w-7 h-7 mix-blend-screen"
                aria-hidden
              />
              {text}
            </span>
          ))}
        </div>

        {track && (
          <AipblTrackNav label={track.label} steps={track.steps} current={track.current} />
        )}
      </div>
    </SpotlightCard>
  );
}
