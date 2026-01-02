import Link from "next/link";
import Image from "next/image";
import { User, ArrowRight, Zap } from "lucide-react";

interface AuthorCardProps {
  className?: string;
  compact?: boolean;
}

export function AuthorCard({ className = "", compact = false }: AuthorCardProps) {
  // TODO: 프로필 이미지 경로 설정 (예: /uploads/profile.jpg)
  const profileImage = null;

  if (compact) {
    return (
      <Link href="/about" className={className}>
        <div className="flex items-center gap-3 p-3 bg-white border-4 border-black neo-shadow-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all -rotate-0.5">
          <div className="w-10 h-10 bg-accent border-3 border-black rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center">
            {profileImage ? (
              <Image
                src={profileImage}
                alt="Author"
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-5 h-5 text-black" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-black uppercase truncate">Written by</p>
            <p className="text-xs text-muted-foreground truncate">데이터로 설명하는 마케터</p>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <div className={`bg-white border-3 sm:border-4 border-black neo-shadow p-3 sm:p-5 sm:rotate-1 halftone-corner ${className}`}>
      {/* Header Badge */}
      <div className="flex items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4">
        <div className="bg-primary p-1 sm:p-1.5 border-2 border-black -rotate-3">
          <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="white" />
        </div>
        <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider comic-emphasis">About the Author</span>
      </div>

      <div className="flex flex-col items-center text-center relative z-10">
        {/* Profile Image */}
        <div className="relative mb-3 sm:mb-4">
          <div className="w-16 h-16 sm:w-24 sm:h-24 bg-accent border-3 sm:border-4 border-black rounded-full overflow-hidden flex items-center justify-center -rotate-3 neo-shadow-sm">
            {profileImage ? (
              <Image
                src={profileImage}
                alt="Author"
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-8 h-8 sm:w-12 sm:h-12 text-black" />
            )}
          </div>
          {/* Decorative burst */}
          <div className="absolute -top-1 -right-1 bg-primary text-white text-[7px] sm:text-[8px] font-black px-1 sm:px-1.5 py-0.5 border-2 border-black rotate-12">
            HI!
          </div>
        </div>

        {/* Author Info */}
        <p className="text-[11px] sm:text-sm text-muted-foreground mb-2.5 sm:mb-3 leading-relaxed">
          마케팅을 데이터로 설명하는 사람.<br />
          복잡한 상황을 이해 가능한 형태로 정리합니다.
        </p>

        {/* Skills Tags */}
        <div className="flex flex-wrap justify-center gap-1 sm:gap-1.5 mb-3 sm:mb-4">
          {["GA4", "GTM", "퍼널분석"].map((skill, index) => {
            const rotations = ["-rotate-1", "rotate-1", "-rotate-0.5"];
            return (
              <span
                key={skill}
                className={`text-[9px] sm:text-[10px] font-mono font-bold bg-black text-white px-1.5 sm:px-2 py-0.5 sm:py-1 border-2 border-black ${rotations[index]}`}
              >
                {skill}
              </span>
            );
          })}
        </div>

        {/* CTA Link */}
        <Link
          href="/about"
          className="inline-flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-sm font-black uppercase bg-primary text-white px-3 sm:px-4 py-1.5 sm:py-2 border-2 sm:border-3 border-black neo-shadow-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all group"
        >
          더 알아보기
          <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
