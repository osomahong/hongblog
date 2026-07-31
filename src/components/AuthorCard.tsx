import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Zap } from "lucide-react";

interface AuthorCardProps {
  className?: string;
  compact?: boolean;
}

export function AuthorCard({ className = "", compact = false }: AuthorCardProps) {
  const profileImage = "/profile-illustration.png";

  if (compact) {
    return (
      <Link href="/about" className={className}>
        <div className="flex items-center gap-3 p-3 bg-white border-4 border-black neo-shadow-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all -rotate-0.5">
          <div className="w-10 h-10 bg-white border-3 border-black rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center relative p-1">
            <Image
              src={profileImage}
              alt="Author"
              fill
              className="object-contain"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-black uppercase truncate">Written by</p>
            <p className="text-xs text-muted-foreground truncate">데이터로 설명하는 마케터</p>
          </div>
        </div>
      </Link>
    );
  }

  // 사이드바가 sticky라 카드가 높으면 아래에 오는 공유 패널이 뷰포트 밖으로
  // 밀려 영영 보이지 않는다. 프로필과 소개를 세로로 쌓지 않고 가로로 배치해
  // 높이를 절반 이하로 줄인다.
  return (
    <div className={`bg-transparent sm:bg-white border-0 sm:border-4 border-black sm:neo-shadow p-0 sm:p-4 sm:rotate-1 halftone-corner ${className}`}>
      {/* Header Badge */}
      <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
        <div className="bg-primary p-1 border-2 border-black -rotate-3">
          <Zap className="w-3 h-3 text-white" fill="white" />
        </div>
        <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider comic-emphasis">About the Author</span>
      </div>

      <div className="flex items-start gap-3 relative z-10">
        {/* Profile Image */}
        <div className="relative shrink-0">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white border-3 border-black rounded-full overflow-hidden flex items-center justify-center -rotate-3 neo-shadow-sm relative p-1.5 sm:p-2">
            <Image
              src={profileImage}
              alt="Author"
              fill
              className="object-contain"
            />
          </div>
          {/* Decorative burst */}
          <div className="absolute -top-1 -right-1 bg-primary text-white text-[7px] font-black px-1 py-0.5 border-2 border-black rotate-12">
            HI!
          </div>
        </div>

        <div className="min-w-0 flex-1">
          {/* Author Info */}
          <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed">
            마케팅을 데이터로 설명하는 사람.
            복잡한 상황을 이해 가능한 형태로 정리합니다.
          </p>

          {/* Skills Tags */}
          <div className="flex flex-wrap gap-1 sm:gap-1.5 mt-2">
            {["GA4", "GTM", "퍼널분석"].map((skill, index) => {
              const rotations = ["-rotate-1", "rotate-1", "-rotate-0.5"];
              return (
                <span
                  key={skill}
                  className={`text-[9px] sm:text-[10px] font-mono font-bold bg-black text-white px-1.5 sm:px-2 py-0.5 border-2 border-black ${rotations[index]}`}
                >
                  {skill}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA Link */}
      <Link
        href="/about"
        className="relative z-10 mt-3 flex items-center justify-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs font-black uppercase bg-primary text-white px-3 py-1.5 border-2 sm:border-3 border-black neo-shadow-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all group"
      >
        더 알아보기
        <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
}
