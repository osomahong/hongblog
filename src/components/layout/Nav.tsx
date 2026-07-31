"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { sendGAEvent } from "@/lib/gtm";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/ai-practice", label: "AI-Practice" },
  { href: "/class", label: "Class" },
  { href: "/insights", label: "Insights" },
  { href: "/tags", label: "Tags" },
  { href: "/about", label: "About" },
];

export function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  // AI-Practice 하위 경로에서는 다크/네온 테마 변형을 쓴다 (구조는 동일)
  const isApTheme = pathname?.startsWith("/ai-practice") ?? false;

  return (
    <nav
      className={cn(
        "sticky top-0 z-50",
        isApTheme
          ? "bg-[#050507]/90 backdrop-blur border-b border-white/10"
          : "bg-white border-b-4 border-black"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div
              className={cn(
                "relative w-8 h-8 sm:w-9 sm:h-9 bg-white rounded-full border-2 overflow-hidden group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-all",
                isApTheme
                  ? "border-white/30"
                  : "border-black neo-shadow-sm group-hover:shadow-none"
              )}
            >
              <Image
                src="/profile-illustration.png"
                alt="Logo"
                fill
                className="object-cover object-top scale-125"
              />
            </div>
            <span
              className={cn(
                "text-lg sm:text-xl font-black tracking-tighter",
                isApTheme && "text-white"
              )}
            >
              준이아빠<span className="text-primary">블로그</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden sm:flex items-center gap-1">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => sendGAEvent("click_nav", { menu_name: label })}
                className={cn(
                  "px-4 py-2 font-bold uppercase text-sm tracking-wide transition-colors",
                  isApTheme
                    ? cn(
                        "text-gray-300 hover:text-[#ffd700]",
                        pathname?.startsWith(href) && "text-[#ff5c7d]"
                      )
                    : "hover:bg-[#FF0033] hover:text-white hover:border-black border-2 border-transparent"
                )}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={cn(
              "sm:hidden p-2 border-2 active:translate-x-0.5 active:translate-y-0.5 transition-all",
              isApTheme
                ? "border-white/25 text-white rounded-[8px]"
                : "border-black neo-shadow-sm active:shadow-none"
            )}
            aria-label="메뉴 열기"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div
            className={cn(
              "sm:hidden py-2",
              isApTheme ? "border-t border-white/10" : "border-t-2 border-black"
            )}
          >
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => { sendGAEvent("click_nav", { menu_name: label }); setIsMenuOpen(false); }}
                className={cn(
                  "block px-4 py-3 font-bold uppercase text-sm tracking-wide transition-colors",
                  isApTheme
                    ? "text-gray-200 hover:text-[#ffd700]"
                    : "hover:bg-[#FF0033] hover:text-white"
                )}
              >
                {label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
