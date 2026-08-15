import Link from "next/link";
import { Sparkles, ArrowUpRight } from "lucide-react";
import { LEVEL_LABEL, tutorialHref, type Ga4EduTutorial } from "@/app/ga4-edu/data";

interface BottomHeroProps {
  /** 바로 이어서 볼 다음 편. 없으면 목록으로만 보낸다 */
  next?: Ga4EduTutorial;
}

/** 튜토리얼 맨 아래에서 다음 편으로 넘겨 주는 자리 */
export function BottomHero({ next }: BottomHeroProps) {
  return (
    <section className="ga4-bottomhero">
      <div className="ga4-bottomhero-inner">
        <p className="ga4-bottomhero-kicker">
          <Sparkles className="w-4 h-4" strokeWidth={2} aria-hidden /> NEXT TUTORIAL
        </p>
        <h2 className="ga4-bottomhero-title">
          {next ? (
            <>
              다음은 {LEVEL_LABEL[next.level]} {next.order}번
              <br />
              {next.title}
            </>
          ) : (
            <>
              GA4 화면은
              <br />
              눌러 볼수록 익숙해집니다
            </>
          )}
        </h2>
        <p className="ga4-bottomhero-desc">
          {next
            ? `${next.screen} 화면을 같은 방식으로 조작하며 익힙니다.`
            : "초급 10편, 중급 10편, 심화 10편이 같은 방식으로 이어집니다."}
        </p>
        <div className="ga4-bottomhero-btns">
          {next && (
            <Link href={tutorialHref(next.slug)} className="ga4-hero-btn ga4-hero-btn-solid">
              다음 튜토리얼 <ArrowUpRight className="w-4 h-4" strokeWidth={2.2} aria-hidden />
            </Link>
          )}
          <Link href="/ga4-edu" className="ga4-hero-btn">
            전체 목록 보기
          </Link>
        </div>
      </div>
    </section>
  );
}
