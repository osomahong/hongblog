import Link from "next/link";
import { LEVEL_LABEL, AREA_LABEL, tutorialHref, type Ga4EduTutorial } from "@/app/ga4-edu/data";
import { Ga4Thumb } from "./Ga4Thumb";

/** 튜토리얼 아래에 놓이는 추천 카드 묶음 */
export function RelatedGrid({ items }: { items: Ga4EduTutorial[] }) {
  if (items.length === 0) return null;

  return (
    <section className="ga4-tut-section">
      <p className="ga4-related-kicker">GA4 EDU</p>
      <h2 className="ga4-related-head">이어서 볼 튜토리얼</h2>
      <p className="ga4-related-sub">
        지금 튜토리얼에서 다룬 화면과 이어지는 편입니다. 순서대로 하지 않아도 됩니다.
      </p>

      <ul className="ga4-cards">
        {items.map((item) => (
          <li key={item.slug}>
            <Link href={tutorialHref(item.slug)} className="ga4-post">
              <span className="ga4-post-thumb">
                <Ga4Thumb
                  title={item.title}
                  level={item.level}
                  area={item.area}
                  order={item.order}
                />
              </span>
              <span className="ga4-post-body">
                <span className="ga4-post-cat">{AREA_LABEL[item.area]}</span>
                <span className="ga4-post-title">{item.title}</span>
                <span className="ga4-post-desc">
                  {item.definition ?? `${item.screen} 화면을 직접 조작하며 익히는 튜토리얼입니다.`}
                </span>
                <span className="ga4-post-meta">
                  <span className="ga4-post-level">{LEVEL_LABEL[item.level]}</span>
                  <span className="ga4-post-dot" aria-hidden />
                  {item.screen}
                  {item.status === "planned" && (
                    <>
                      <span className="ga4-post-dot" aria-hidden />
                      준비 중
                    </>
                  )}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
