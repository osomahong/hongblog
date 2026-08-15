import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SITE_URL } from "@/lib/constants";
import { Ga4Logo } from "@/components/icons/Ga4Logo";
import { RealtimeDashboard } from "./RealtimeDashboard";

const PAGE_TITLE = "GA4 Edu: GA4 실시간 보고서 실습";
// AEO 정의 문장: 도입부, metaDescription, JSON-LD를 같은 개체와 정의로 맞춘다
const PAGE_DESC =
  "이 화면은 준이아빠블로그의 실제 GA4 데이터로 GA4 실시간 개요 보고서를 그대로 재현한 교육용 화면입니다. 화면의 각 카드가 GA4 Data API의 어떤 측정기준과 측정항목으로 만들어지는지 함께 표시합니다.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESC,
  alternates: { canonical: `${SITE_URL}/ga4-edu/realtime` },
  // 실시간 수치만 담긴 화면이라 색인 대상으로 두지 않는다
  robots: { index: false, follow: true },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESC,
    type: "website",
    url: `${SITE_URL}/ga4-edu/realtime`,
    images: [{ url: `${SITE_URL}/og-default.png`, width: 1200, height: 630 }],
  },
};

export default function Ga4EduRealtimePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <Link href="/ga4-edu" className="ga4-back">
        <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.8} /> GA4 Edu 목록으로
      </Link>

      <header className="mb-8">
        <div className="flex items-center gap-2.5 mb-3">
          <Ga4Logo className="w-7 h-7" />
          <span
            className="text-xs font-semibold tracking-wide uppercase"
            style={{ color: "var(--ga4-amber-deep)" }}
          >
            GA4 Edu
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-medium tracking-tight mb-3">
          실시간 개요 보고서
        </h1>
        <p
          className="text-sm sm:text-base leading-relaxed max-w-3xl"
          style={{ color: "var(--ga4-muted)" }}
        >
          이 화면은 준이아빠블로그의 실제 GA4 데이터를 GA4 Data API로 불러와 GA4 실시간 개요
          보고서를 그대로 재현한 것입니다. 지금 이 사이트를 보고 있는 사용자가 30초마다 숫자에
          반영됩니다. 오른쪽 위 &ldquo;API 항목 보기&rdquo;를 켜면 카드마다 어떤 측정기준과
          측정항목을 쓰는지 볼 수 있습니다.
        </p>
      </header>

      <RealtimeDashboard />

      <section
        className="mt-10 pt-6 text-sm leading-relaxed"
        style={{ borderTop: "1px solid var(--ga4-line)", color: "var(--ga4-muted)" }}
      >
        <h2 className="text-base font-medium mb-3" style={{ color: "var(--ga4-ink)" }}>
          실시간 보고서를 읽을 때 알아 둘 점
        </h2>
        <ul className="space-y-2 max-w-3xl list-disc pl-5">
          <li>
            실시간 보고서는 최근 30분만 다룹니다. 하루 단위 집계나 기간 비교는 실시간이 아닌 일반
            보고서에서 봅니다.
          </li>
          <li>
            활성 사용자는 중복을 제거한 값이라 기기별, 국가별 숫자를 더해도 전체와 맞지 않을 수
            있습니다. 이벤트 수와 조회수는 더하면 맞습니다.
          </li>
          <li>
            실시간 API는 GA4 화면보다 다룰 수 있는 항목이 적습니다. 회색 빗금이 그어진 카드가 그
            차이를 보여 줍니다.
          </li>
        </ul>
      </section>
    </div>
  );
}
