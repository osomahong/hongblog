"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Mail, MessageCircle, Search } from "lucide-react";
import { sendGAEvent } from "@/lib/gtm";
import { cn } from "@/lib/utils";
import { NEWSLETTER_URL, KAKAO_INQUIRY_URL } from "@/lib/constants";
import { SearchDialog } from "@/components/search/SearchDialog";

// Tags는 사이트 내 검색으로 대체해 내비에서 뺐다. /tags 페이지와 푸터 링크는
// 색인과 내부 링크 경로를 위해 그대로 둔다.
const NAV_LINKS = [
  { href: "/ai-practice", label: "AI-Practice" },
  { href: "/class", label: "Class" },
  { href: "/insights", label: "Insights" },
  { href: "/about", label: "About" },
];

interface NavCtaButtonsProps {
  apTheme: boolean;
  location: "nav" | "nav_mobile";
  /** true면 lg 미만에서 아이콘만 남긴다 (데스크톱 내비 전용) */
  compactLabels?: boolean;
}

/** 상단 내비, 모바일 메뉴 공용 뉴스레터·커뮤니티 CTA 버튼 쌍 */
function NavCtaButtons({ apTheme, location, compactLabels }: NavCtaButtonsProps) {
  const labelClass = compactLabels ? "hidden lg:inline" : undefined;
  const baseClass = "inline-flex items-center gap-1.5 px-3 py-2 text-xs font-black transition-all";
  const shapeClass = apTheme
    ? "rounded-[10px] border"
    : "border-2 border-black neo-shadow-sm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]";

  return (
    <>
      <a
        href={NEWSLETTER_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => sendGAEvent("click_newsletter", { location })}
        aria-label="뉴스레터 구독하기"
        className={cn(
          baseClass,
          shapeClass,
          "bg-accent text-black",
          apTheme && "border-[rgba(255,215,0,0.5)] hover:shadow-[0_0_18px_rgba(255,215,0,0.35)]"
        )}
      >
        <Mail className="w-4 h-4 flex-shrink-0" />
        <span className={labelClass}>뉴스레터 구독하기</span>
      </a>
      <a
        href={KAKAO_INQUIRY_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => sendGAEvent("click_nav", { menu_name: "Community" })}
        aria-label="커뮤니티 입장하기"
        className={cn(
          baseClass,
          shapeClass,
          "bg-primary text-white",
          apTheme && "border-[rgba(255,92,125,0.5)] hover:shadow-[0_0_18px_rgba(255,92,125,0.35)]"
        )}
      >
        <MessageCircle className="w-4 h-4 flex-shrink-0" />
        <span className={labelClass}>커뮤니티 입장하기</span>
      </a>
    </>
  );
}

/** 내비 돋보기 버튼. 데스크톱과 모바일이 같은 오버레이를 연다. */
function SearchTrigger({ apTheme, onOpen }: { apTheme: boolean; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label="사이트 내 검색 열기"
      className={cn(
        "p-2 border-2 transition-all flex-shrink-0",
        apTheme
          ? "border-white/25 text-white rounded-[8px] hover:border-[#ffd700] hover:text-[#ffd700]"
          : "border-black neo-shadow-sm hover:bg-[#FFD700] active:shadow-none active:translate-x-0.5 active:translate-y-0.5"
      )}
    >
      <Search className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
    </button>
  );
}

export function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();
  // AI-Practice 하위 경로에서는 다크/네온 테마 변형을 쓴다 (구조는 동일)
  const isApTheme = pathname?.startsWith("/ai-practice") ?? false;

  function openSearch() {
    sendGAEvent("click_nav", { menu_name: "Search" });
    setIsMenuOpen(false);
    setIsSearchOpen(true);
  }

  // Cmd/Ctrl+K로도 열 수 있게 한다. 입력 중에는 가로채지 않는다.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "k" || !(event.metaKey || event.ctrlKey)) return;
      event.preventDefault();
      setIsSearchOpen(true);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

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
        <div className="flex items-center justify-between h-14 sm:h-16 gap-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
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
                // sm~md 구간은 메뉴, CTA 버튼과 폭 경합이 나서 로고 텍스트를 숨긴다
                "text-lg sm:text-xl font-black tracking-tighter sm:hidden md:inline",
                isApTheme && "text-white"
              )}
            >
              준이아빠<span className="text-primary">블로그</span>
            </span>
          </Link>

          {/* 메뉴, CTA 버튼, 햄버거를 묶어 오른쪽 정렬한다 */}
          <div className="flex items-center gap-3 min-w-0">
          {/* Desktop Navigation Links. CTA 버튼과 한 줄에 공존해야 해서 lg 미만에서는 밀도를 줄인다 */}
          <div className="hidden sm:flex items-center gap-1 lg:gap-1.5">
            {NAV_LINKS.map(({ href, label }) => {
              // AI-Practice는 핵심 메뉴라 다크 필 + 히어로 그라데이션 텍스트로 강조한다
              if (href === "/ai-practice") {
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => sendGAEvent("click_nav", { menu_name: label })}
                    className={cn(
                      "nav-aip-pill px-3 lg:px-4 py-2 mr-1.5 font-bold uppercase text-xs lg:text-sm tracking-wide whitespace-nowrap transition-all hover:brightness-125",
                      isApTheme
                        ? "border border-white/20"
                        : "neo-shadow-sm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
                    )}
                  >
                    <span className="nav-aip-text">{label}</span>
                  </Link>
                );
              }
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => sendGAEvent("click_nav", { menu_name: label })}
                  className={cn(
                    "px-2 lg:px-4 py-2 font-bold uppercase text-xs lg:text-sm tracking-wide whitespace-nowrap transition-colors",
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
              );
            })}
          </div>

          {/* Desktop CTA Buttons. 돋보기는 뉴스레터 버튼 왼쪽에 둔다 */}
          <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
            <SearchTrigger apTheme={isApTheme} onOpen={openSearch} />
            <NavCtaButtons apTheme={isApTheme} location="nav" compactLabels />
          </div>

          {/* Mobile: 검색은 햄버거를 열지 않고 바로 닿아야 해서 밖에 둔다 */}
          <div className="sm:hidden">
            <SearchTrigger apTheme={isApTheme} onOpen={openSearch} />
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
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div
            className={cn(
              "sm:hidden py-2 flex items-start gap-2",
              isApTheme ? "border-t border-white/10" : "border-t-2 border-black"
            )}
          >
            <div className="flex-1 min-w-0">
            {NAV_LINKS.map(({ href, label }) => {
              if (href === "/ai-practice") {
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => { sendGAEvent("click_nav", { menu_name: label }); setIsMenuOpen(false); }}
                    className={cn(
                      "nav-aip-pill block text-center mx-2 my-2 px-4 py-2.5 font-bold uppercase text-sm tracking-wide",
                      isApTheme && "border border-white/20"
                    )}
                  >
                    <span className="nav-aip-text">{label}</span>
                  </Link>
                );
              }
              return (
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
              );
            })}
            </div>

            {/* 모바일 메뉴 우측 여백에 배치하는 CTA 버튼 */}
            <div className="flex flex-col items-stretch gap-2 pt-2 pr-1 flex-shrink-0">
              <NavCtaButtons apTheme={isApTheme} location="nav_mobile" />
            </div>
          </div>
        )}
      </div>

      {/* 닫으면 언마운트한다. 검색어와 선택 상태가 매번 초기화되고, 열기 전에는
          인덱스 요청이 아예 나가지 않는다. */}
      {isSearchOpen && <SearchDialog onClose={() => setIsSearchOpen(false)} />}
    </nav>
  );
}
