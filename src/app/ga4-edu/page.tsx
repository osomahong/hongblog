import type { Metadata } from "next";
import Link from "next/link";
import { Lock, PlayCircle, Radio } from "lucide-react";
import { SITE_URL, SITE_NAME, SECTION_LABELS } from "@/lib/constants";
import { Ga4Logo } from "@/components/icons/Ga4Logo";
import {
  getTutorialsByLevel,
  LEVEL_LABEL,
  LEVEL_ORDER,
  AREA_LABEL,
  tutorialHref,
  type Ga4EduLevel,
} from "./data";

export const dynamic = "force-static";

const PAGE_TITLE = "GA4 실습 튜토리얼 30편";
// layout의 title template은 하위 세그먼트에만 적용되고 같은 세그먼트의 page는 건너뛴다.
// 그래서 섹션 루트인 이 페이지는 라벨과 브랜드를 붙인 완성형을 직접 지정한다.
const FULL_TITLE = `${SECTION_LABELS.ga4Edu} | ${PAGE_TITLE} | ${SITE_NAME}`;
// AEO 정의 문장: 도입부, metaDescription, JSON-LD를 같은 개체와 정의로 맞춘다
const PAGE_DEFINITION =
  "GA4 Edu는 GA4와 같은 모양의 데모 화면을 정해진 순서대로 조작하면서 GA4 사용법과 데이터 해석법을 배우는 준이아빠블로그의 실습 학습 코스입니다.";
const PAGE_DESC = `${PAGE_DEFINITION} 초급, 중급, 심화 각 10편씩 모두 30편으로 이뤄지고, 보고서 읽기부터 탐색 보고서 제작, 수집 설정 변경까지 다룹니다.`;

export const metadata: Metadata = {
  title: { absolute: FULL_TITLE },
  description: PAGE_DESC,
  alternates: { canonical: `${SITE_URL}/ga4-edu` },
  openGraph: {
    title: FULL_TITLE,
    description: PAGE_DESC,
    type: "website",
    url: `${SITE_URL}/ga4-edu`,
    images: [{ url: `${SITE_URL}/og-default.png`, width: 1200, height: 630 }],
  },
};

const LEVEL_DESC: Record<Ga4EduLevel, string> = {
  basic:
    "표준 보고서에서 원하는 숫자를 찾아 읽습니다. 설정은 바꾸지 않고 보는 것에만 집중합니다. 세션수와 사용자 수처럼 비슷해 보이는 값을 구분하고, 두 열을 나란히 놓고 판단하는 방법을 여기서 익힙니다.",
  intermediate:
    "탐색 보고서를 직접 만들고, 관리 화면에서 수집 설정을 바꿉니다. 표준 보고서로 답이 나오지 않는 질문을 직접 만들어 답을 찾는 단계입니다. 설정을 바꾸는 편에서는 되돌리는 절차까지 함께 다룹니다.",
  advanced:
    "여러 설정이 맞물린 상황을 다루고, 숫자가 어긋나는 원인을 찾습니다. 기여 분석 모델에 따라 채널 평가가 뒤집히거나, 데이터 필터와 추천 제외가 서로 얽히는 경우를 봅니다. 실무에서 자주 막히는 항목으로 채웠습니다.",
};

export default function Ga4EduHubPage() {
  const courseLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    "@id": `${SITE_URL}/ga4-edu#course`,
    name: PAGE_TITLE,
    url: `${SITE_URL}/ga4-edu`,
    description: PAGE_DESC,
    inLanguage: "ko",
    about: ["Google Analytics 4", "웹 데이터 분석"],
    teaches: ["GA4 보고서 읽기", "탐색 보고서 제작", "GA4 수집 설정"],
    provider: { "@type": "Organization", name: "준이아빠블로그", url: SITE_URL },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      courseWorkload: "PT6H",
    },
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseLd) }}
      />

      <header className="ga4-hub-head">
        <div className="flex items-center gap-2.5 mb-3">
          <Ga4Logo className="w-7 h-7" />
          <span className="ga4-hub-kicker">GA4 Edu</span>
        </div>
        <h1 className="ga4-hub-title">GA4 실습 튜토리얼 30편</h1>
        <p className="ga4-hub-lead">{PAGE_DESC}</p>

        <div className="ga4-hub-links">
          <Link href="/ga4-edu/realtime" className="ga4-hub-link">
            <Radio className="w-3.5 h-3.5" strokeWidth={1.8} /> 실시간 개요 보고서 재현 화면
          </Link>
        </div>
      </header>

      <section className="ga4-tut-section">
        <h2 className="ga4-h2">GA4 Edu 학습 방식</h2>
        <p className="ga4-p">
          튜토리얼을 열면 GA4와 같은 모양의 화면이 나옵니다. 설명을 먼저 읽고 시작하는 방식이
          아니라, 화면을 직접 누르면서 배웁니다. 안내는 두 가지뿐입니다. 오른쪽 아래 도우미가
          지금 할 일을 한 줄로 알려 주고, 눌러야 할 곳에 빨간 상자가 그려집니다. GA4는 강조색으로
          파랑만 쓰기 때문에, 화면에서 빨간색은 지금 누를 곳 하나입니다.
        </p>
        <p className="ga4-p">
          어디를 누를지는 화면이 알려 주지만, 표를 어떻게 해석할지는 학습자가 직접 판단합니다.
          예를 들어 초급 1번에서는 참여율이 가장 낮은 채널을 고르라고 하지 않고, 세션수가 일정
          규모를 넘는 채널 가운데 참여율이 가장 낮은 곳을 고르게 합니다. 참여율 열만 보고 맨
          아랫줄을 고르면 틀립니다. 순서대로 누르기만 해서는 끝나지 않습니다.
        </p>
        <p className="ga4-p">
          화면에 나오는 숫자는 교육용으로 만든 가상 계정 준준상점의 데이터입니다. 실제 GA4 계정
          없이도 모든 조작을 해 볼 수 있고, 설정을 잘못 바꿔도 되돌릴 걱정이 없습니다. GA4
          보고서는 가로로 넓어야 표를 다 볼 수 있어서, 화면 오른쪽 위 화면 고정을 누르면 브라우저
          창 전체를 GA4가 채웁니다. Esc를 누르면 원래 화면으로 돌아옵니다.
        </p>
      </section>

      {LEVEL_ORDER.map((level) => {
        const items = getTutorialsByLevel(level);
        return (
          <section key={level} className="ga4-tut-section">
            <h2 className="ga4-h2">
              {LEVEL_LABEL[level]} {items.length}편
            </h2>
            <p className="ga4-p">{LEVEL_DESC[level]}</p>

            <ul className="ga4-hub-list">
              {items.map((t) => {
                const ready = t.status === "ready";
                return (
                  <li key={t.slug} className={ready ? "" : "ga4-hub-item-planned"}>
                    <Link href={tutorialHref(t.slug)} className="ga4-hub-item">
                      <span className="ga4-hub-item-num">{String(t.order).padStart(2, "0")}</span>
                      <span className="ga4-hub-item-body">
                        <span className="ga4-hub-item-title">{t.title}</span>
                        <span className="ga4-hub-item-meta">
                          {AREA_LABEL[t.area]}, {t.screen}
                        </span>
                      </span>
                      <span className="ga4-hub-item-state">
                        {!ready ? (
                          "준비 중"
                        ) : t.isOpen ? (
                          <>
                            <PlayCircle className="w-3.5 h-3.5" strokeWidth={1.8} /> 공개
                          </>
                        ) : (
                          <>
                            <Lock className="w-3.5 h-3.5" strokeWidth={1.8} /> 구독자
                          </>
                        )}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
