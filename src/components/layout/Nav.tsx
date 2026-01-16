"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

export function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b-4 border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 bg-white rounded-full border-2 border-black overflow-hidden neo-shadow-sm group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-hover:shadow-none transition-all">
              <Image
                src="/profile-illustration.png"
                alt="Logo"
                fill
                className="object-cover object-top scale-125"
              />
            </div>
            <span className="text-lg sm:text-xl font-black tracking-tighter">
              준이아빠<span className="text-primary">블로그</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden sm:flex items-center gap-1">
            <Link
              href="/class"
              className="px-4 py-2 font-bold uppercase text-sm tracking-wide hover:bg-accent hover:border-black border-2 border-transparent transition-colors"
            >
              Class
            </Link>
            <Link
              href="/insights"
              className="px-4 py-2 font-bold uppercase text-sm tracking-wide hover:bg-accent hover:border-black border-2 border-transparent transition-colors"
            >
              Insights
            </Link>
            <Link
              href="/logs"
              className="px-4 py-2 font-bold uppercase text-sm tracking-wide hover:bg-accent hover:border-black border-2 border-transparent transition-colors"
            >
              Logs
            </Link>
            <Link
              href="/series"
              className="px-4 py-2 font-bold uppercase text-sm tracking-wide hover:bg-accent hover:border-black border-2 border-transparent transition-colors"
            >
              Series
            </Link>
            <Link
              href="/faq"
              className="px-4 py-2 font-bold uppercase text-sm tracking-wide hover:bg-accent hover:border-black border-2 border-transparent transition-colors"
            >
              FAQ
            </Link>
            <Link
              href="/tags"
              className="px-4 py-2 font-bold uppercase text-sm tracking-wide hover:bg-accent hover:border-black border-2 border-transparent transition-colors"
            >
              Tags
            </Link>
            <Link
              href="/about/life"
              className="px-4 py-2 font-bold uppercase text-sm tracking-wide hover:bg-accent hover:border-black border-2 border-transparent transition-colors"
            >
              Life
            </Link>
            <Link
              href="/about"
              className="px-4 py-2 font-bold uppercase text-sm tracking-wide hover:bg-accent hover:border-black border-2 border-transparent transition-colors"
            >
              About
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="sm:hidden p-2 border-2 border-black neo-shadow-sm active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
            aria-label="메뉴 열기"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="sm:hidden border-t-2 border-black py-2">
            <Link
              href="/class"
              onClick={() => setIsMenuOpen(false)}
              className="block px-4 py-3 font-bold uppercase text-sm tracking-wide hover:bg-accent transition-colors"
            >
              Class
            </Link>
            <Link
              href="/insights"
              onClick={() => setIsMenuOpen(false)}
              className="block px-4 py-3 font-bold uppercase text-sm tracking-wide hover:bg-accent transition-colors"
            >
              Insights
            </Link>
            <Link
              href="/logs"
              onClick={() => setIsMenuOpen(false)}
              className="block px-4 py-3 font-bold uppercase text-sm tracking-wide hover:bg-accent transition-colors"
            >
              Logs
            </Link>
            <Link
              href="/series"
              onClick={() => setIsMenuOpen(false)}
              className="block px-4 py-3 font-bold uppercase text-sm tracking-wide hover:bg-accent transition-colors"
            >
              Series
            </Link>
            <Link
              href="/faq"
              onClick={() => setIsMenuOpen(false)}
              className="block px-4 py-3 font-bold uppercase text-sm tracking-wide hover:bg-accent transition-colors"
            >
              FAQ
            </Link>
            <Link
              href="/tags"
              onClick={() => setIsMenuOpen(false)}
              className="block px-4 py-3 font-bold uppercase text-sm tracking-wide hover:bg-accent transition-colors"
            >
              Tags
            </Link>
            <Link
              href="/about/life"
              onClick={() => setIsMenuOpen(false)}
              className="block px-4 py-3 font-bold uppercase text-sm tracking-wide hover:bg-accent transition-colors"
            >
              Life
            </Link>
            <Link
              href="/about"
              onClick={() => setIsMenuOpen(false)}
              className="block px-4 py-3 font-bold uppercase text-sm tracking-wide hover:bg-accent transition-colors"
            >
              About
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
