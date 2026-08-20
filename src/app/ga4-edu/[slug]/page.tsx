import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { SITE_URL } from "@/lib/constants";
import { LabStage } from "@/components/ga4-edu/lab/LabStage";
import { Ga4EduGate } from "@/components/ga4-edu/Ga4EduGate";
import { StepsSection, FaqSection } from "@/components/ga4-edu/TutorialSections";
import { BottomHero } from "@/components/ga4-edu/BottomHero";
import { RelatedGrid } from "@/components/ga4-edu/RelatedGrid";
import { Ga4EduCanvasFx } from "@/components/ga4-edu/Ga4EduCanvasFx";
import {
  GA4_EDU_TUTORIALS,
  getTutorial,
  LEVEL_LABEL,
  AREA_LABEL,
  tutorialHref,
  type Ga4EduTutorial,
} from "../data";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return GA4_EDU_TUTORIALS.map((t) => ({ slug: t.slug }));
}

/** metaDescription은 정의 문장으로 시작한다. 본문 도입부, JSON-LD와 같은 문장을 공유한다 */
function buildDescription(t: Ga4EduTutorial): string {
  if (!t.definition) {
    return `${t.title}는 GA4 Edu에서 ${t.screen} 화면을 직접 조작하며 배우는 튜토리얼입니다.`;
  }
  return t.summary ? `${t.definition} ${t.summary}` : t.definition;
}

function buildTitle(t: Ga4EduTutorial): string {
  return t.seoTitle ?? `GA4 ${t.title}`;
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const t = getTutorial(slug);
  if (!t) return {};

  const url = `${SITE_URL}${tutorialHref(slug)}`;
  const title = buildTitle(t);
  const description = buildDescription(t);
  // 구독자에게만 열리는 편은 색인하지 않는다. 검색으로 들어와 막힌 화면을 만나지 않게 한다
  const indexable = t.isOpen && t.status === "ready";

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: indexable ? undefined : { index: false, follow: true },
    openGraph: {
      title,
      description,
      type: "article",
      url,
      images: [{ url: `${SITE_URL}/og-default.png`, width: 1200, height: 630 }],
    },
  };
}

export default async function Ga4EduTutorialPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const t = getTutorial(slug);
  if (!t) notFound();

  const url = `${SITE_URL}${tutorialHref(slug)}`;
  const title = buildTitle(t);
  const description = buildDescription(t);
  const ready = t.status === "ready";
  const explicitRelated = (t.related ?? [])
    .map((s) => getTutorial(s))
    .filter((x): x is Ga4EduTutorial => Boolean(x));
  // 관련 편을 지정하지 않은 튜토리얼에는 지금 볼 수 있는 편을 대신 보여 준다.
  // 방문자를 막다른 화면에 두지 않고, 내부 링크도 끊기지 않게 한다.
  const related =
    explicitRelated.length > 0
      ? explicitRelated
      : GA4_EDU_TUTORIALS.filter((x) => x.status === "ready" && x.slug !== t.slug);
  // 바텀 히어로에서 이어 볼 편. 지금 편 다음으로 준비된 것을 고른다
  const readyList = GA4_EDU_TUTORIALS.filter((x) => x.status === "ready");
  const here = readyList.findIndex((x) => x.slug === t.slug);
  const nextTutorial = here >= 0 ? readyList[here + 1] : readyList[0];

  const learningResourceLd = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    "@id": `${url}#learningresource`,
    name: title,
    url,
    description,
    inLanguage: "ko",
    learningResourceType: "대화형 튜토리얼",
    about: ["Google Analytics 4", AREA_LABEL[t.area]],
    teaches: t.teaches ?? [t.title],
    educationalLevel: LEVEL_LABEL[t.level],
    ...(t.timeRequired ? { timeRequired: t.timeRequired } : {}),
    isPartOf: { "@id": `${SITE_URL}/ga4-edu#course` },
    provider: { "@type": "Organization", name: "준이아빠블로그", url: SITE_URL },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "홈", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "GA4 Edu", item: `${SITE_URL}/ga4-edu` },
      { "@type": "ListItem", position: 3, name: t.title, item: url },
    ],
  };

  const faqLd =
    t.faq && t.faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "@id": `${url}#faq`,
          mainEntity: t.faq.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        }
      : null;

  return (
    <div className="ga4-tut">
      <Ga4EduCanvasFx />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(learningResourceLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      {faqLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      )}

      {/* ===== 머리말: 정의 한 문장까지만 둔다 ===== */}
      <div className="ga4-wrap">
        <Link href="/ga4-edu" className="ga4-back">
          <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.8} /> GA4 Edu 목록으로
        </Link>

        <div className="ga4-tut-badges">
          <span className="ga4-badge ga4-badge-level">{LEVEL_LABEL[t.level]}</span>
          <span className="ga4-badge">{AREA_LABEL[t.area]}</span>
          <span className="ga4-badge">{t.screen}</span>
        </div>

        <h1 className="ga4-tut-title">{t.title}</h1>
        {t.definition && <p className="ga4-tut-lead">{t.definition}</p>}
      </div>

      {/* ===== GA4 화면: 좌우 끝까지 ===== */}
      <div className="ga4-tut-stage">
        {!ready ? (
          <div className="ga4-wrap">
            <div className="ga4-notice">
              이 튜토리얼은 아직 제작 중입니다. 준비되면 뉴스레터로 알려 드립니다.
            </div>
          </div>
        ) : !t.isOpen ? (
          <Ga4EduGate
            slug={t.slug}
            title={t.title}
            teaches={t.teaches ?? []}
            url={`${SITE_URL.replace(/^https?:\/\//, "")}${tutorialHref(t.slug)}`}
          />
        ) : (
          <LabStage
            slug={t.slug}
            url={`${SITE_URL.replace(/^https?:\/\//, "")}${tutorialHref(t.slug)}`}
          />
        )}
      </div>

      {/* ===== 아래부터는 검색과 답변 엔진이 읽는 본문 ===== */}
      <div className="ga4-wrap ga4-tut-body">
        {ready && (
          <>
            <section className="ga4-tut-section">
              <h2 className="ga4-h2">{t.title}, 무엇을 배우는지</h2>
              {t.intro && <p className="ga4-p">{t.intro}</p>}

              {t.terms && t.terms.length > 0 && (
                <div className="ga4-term-grid">
                  {t.terms.map((term, i) => (
                    <div key={term.term} className="ga4-term-card">
                      <span className="ga4-term-num">{String(i + 1).padStart(2, "0")}</span>
                      <h3 className="ga4-term-name">{term.term}</h3>
                      <p className="ga4-term-def">{term.definition}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {t.steps && t.steps.length > 0 && (
              <StepsSection
                title={`${t.screen} 화면에서 따라 하는 순서`}
                lead="실습에서 진행하는 순서를 글로 옮기면 아래와 같습니다. 실제 GA4 속성에서도 같은 순서로 하면 됩니다. 단계를 누르면 그때 화면을 크게 볼 수 있습니다."
                steps={t.steps}
              />
            )}

            {t.faq && t.faq.length > 0 && <FaqSection faq={t.faq} />}

            {t.takeaways && t.takeaways.length > 0 && (
              <section className="ga4-tut-section">
                <h2 className="ga4-h2">3줄 요약</h2>
                <ol className="ga4-takeaways">
                  {t.takeaways.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ol>
              </section>
            )}
          </>
        )}

        <RelatedGrid items={related.slice(0, 4)} />

        {t.sources && t.sources.length > 0 && (
          <section className="ga4-tut-section">
            <h2 className="ga4-h2">참고 자료</h2>
            <ul className="ga4-sources">
              {t.sources.map((s) => (
                <li key={s.url}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer">
                    {s.label} <ExternalLink className="w-3 h-3" strokeWidth={1.8} />
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      <div className="ga4-wrap">
        <BottomHero next={nextTutorial} />
      </div>
    </div>
  );
}
