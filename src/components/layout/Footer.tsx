"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { User, MessageCircle } from "lucide-react";
import { sendGAEvent } from "@/lib/gtm";
import { cn } from "@/lib/utils";

const EXPLORE_LINKS = [
  { href: "/ai-practice", label: "AI-Practice" },
  { href: "/class", label: "Class" },
  { href: "/insights", label: "Insights" },
  { href: "/tags", label: "Tags" },
];

export function Footer() {
  const pathname = usePathname();
  // AI-Practice 하위 경로에서는 다크/네온 테마 변형을 쓴다 (구조는 동일)
  const isApTheme = pathname?.startsWith("/ai-practice") ?? false;
  const linkHover = isApTheme ? "hover:text-[#ffd700]" : "hover:text-[#FF0033]";

  return (
    <footer
      className={cn(
        "text-white mt-auto",
        isApTheme
          ? "bg-[#050507] border-t border-white/10"
          : "bg-black border-t-4 border-primary"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Logo & About Link */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <Link
              href="/"
              onClick={() => sendGAEvent("click_footer", { menu_name: "Home" })}
              className="flex items-center gap-2 group"
            >
              <div
                className={cn(
                  "relative w-8 h-8 sm:w-9 sm:h-9 bg-white rounded-full border-2 overflow-hidden transition-colors",
                  isApTheme
                    ? "border-white/30 group-hover:border-[#ffd700]"
                    : "border-red-500 group-hover:border-[#FF0033]"
                )}
              >
                <Image
                  src="/profile-illustration.png"
                  alt="Logo"
                  fill
                  className="object-cover object-top scale-125"
                />
              </div>
              <span className="text-lg sm:text-xl font-black tracking-tighter">
                준이아빠<span className={cn("text-primary transition-colors", !isApTheme && "group-hover:text-[#FF0033]")}>블로그</span>
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-gray-400 font-mono text-center md:text-left">
              AI-Enhanced Tech Wiki<br />
              Digital Marketing &bull; Data Analytics
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Explore</span>
            {EXPLORE_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => sendGAEvent("click_footer", { menu_name: label })}
                className={cn("text-sm text-gray-300 transition-colors", linkHover)}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* About Section */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">About</span>
            <Link
              href="/about"
              onClick={() => sendGAEvent("click_footer", { menu_name: "About" })}
              className={cn("flex items-center gap-2 text-sm text-gray-300 transition-colors group", linkHover)}
            >
              <User className="w-4 h-4" />
              <span>작성자 소개</span>
            </Link>
            <p className="text-xs text-gray-500 mt-1 text-center md:text-left">
              마케팅을 데이터로 설명하는 사람
            </p>
            <a
              href="https://open.kakao.com/o/pvUCYfci"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sendGAEvent("click_footer", { menu_name: "KakaoTalk" })}
              className={cn(
                "mt-3 inline-flex items-center gap-2 px-4 py-2 bg-[#FEE500] text-black text-xs font-black transition-all sm:self-start",
                isApTheme
                  ? "rounded-[10px] border border-[rgba(255,215,0,0.5)] hover:shadow-[0_0_18px_rgba(255,215,0,0.35)]"
                  : "border-2 border-white hover:bg-[#F7E600] neo-shadow-sm"
              )}
            >
              <MessageCircle className="w-4 h-4" />
              카카오톡 문의하기
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div
          className={cn(
            "mt-8 pt-6 border-t text-center",
            isApTheme ? "border-white/10" : "border-gray-800"
          )}
        >
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} 준이아빠블로그. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
