import Link from "next/link";
import Image from "next/image";
import { User } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-black text-white border-t-4 border-primary mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Logo & About Link */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative w-8 h-8 sm:w-9 sm:h-9 bg-white rounded-full border-2 border-red-500 overflow-hidden group-hover:border-accent transition-colors">
                <Image
                  src="/profile-illustration.png"
                  alt="Logo"
                  fill
                  className="object-cover object-top scale-125"
                />
              </div>
              <span className="text-lg sm:text-xl font-black tracking-tighter">
                준이아빠<span className="text-primary group-hover:text-accent transition-colors">블로그</span>
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-gray-400 font-mono text-center md:text-left">
              AI-Enhanced Tech Wiki<br />
              Digital Marketing • Data Analytics
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Explore</span>
            <Link href="/insights" className="text-sm text-gray-300 hover:text-accent transition-colors">
              Insights
            </Link>
            <Link href="/faq" className="text-sm text-gray-300 hover:text-accent transition-colors">
              FAQ
            </Link>
            <Link href="/tags" className="text-sm text-gray-300 hover:text-accent transition-colors">
              Tags
            </Link>
          </div>

          {/* About Section */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">About</span>
            <Link 
              href="/about" 
              className="flex items-center gap-2 text-sm text-gray-300 hover:text-accent transition-colors group"
            >
              <User className="w-4 h-4" />
              <span>작성자 소개</span>
            </Link>
            <p className="text-xs text-gray-500 mt-1 text-center md:text-left">
              마케팅을 데이터로 설명하는 사람
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-gray-800 text-center">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} 준이아빠블로그. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
