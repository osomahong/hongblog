import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { SITE_URL } from "@/lib/constants";
import "./globals.css";

const pretendard = localFont({
  src: [
    {
      path: "../../node_modules/pretendard/dist/web/static/woff2/Pretendard-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../node_modules/pretendard/dist/web/static/woff2/Pretendard-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../node_modules/pretendard/dist/web/static/woff2/Pretendard-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../node_modules/pretendard/dist/web/static/woff2/Pretendard-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../node_modules/pretendard/dist/web/static/woff2/Pretendard-ExtraBold.woff2",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-pretendard",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.digitalmarketer.co.kr"),
  title: {
    default: "준이아빠블로그 | AI-Enhanced Tech Wiki",
    template: "%s | 준이아빠블로그",
  },
  description:
    "디지털 마케팅, AI, 데이터 분석 전문가의 인사이트를 담는 지식 아카이브",
  keywords: ["AI", "디지털 마케팅", "데이터 분석", "테크 블로그", "위키"],
  authors: [{ name: "준이아빠" }],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "준이아빠블로그",
    images: [
      {
        url: `${SITE_URL}/og-default.png`,
        width: 1200,
        height: 630,
        alt: "준이아빠블로그 - AI-Enhanced Tech Wiki",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [`${SITE_URL}/og-default.png`],
  },
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: "/icon-512.png",
    apple: "/icon-512.png",
    shortcut: "/favicon.ico",
  },
  verification: {
    google: "NXtbFzm3hDrs3VRLp_TOLSyz-pi-6lVeIQWVZitJc9k",
    other: {
      "naver-site-verification": "36e7f419b1b60e4468b3eb47486548111d9beaeb",
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FF0000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link
          rel="alternate"
          type="application/rss+xml"
          href={`${SITE_URL}/rss.xml`}
          title="준이아빠블로그 RSS"
        />
      </head>
      <body className={`${pretendard.variable} antialiased min-h-screen flex flex-col`}>
        {/* Google Tag Manager */}
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-5H3Z6ZLZ');`}
        </Script>

        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5H3Z6ZLZ"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>

        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
