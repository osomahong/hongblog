import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, Clock3, ListChecks, Wrench } from "lucide-react";
import { SITE_URL } from "@/lib/constants";
import { ViewTracker } from "@/components/ViewTracker";
import { PRACTICE_TRACKS, getPracticeTrack } from "../data";

export const dynamic = "force-static";
export const dynamicParams = false;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return PRACTICE_TRACKS.map((track) => ({ slug: track.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const track = getPracticeTrack(slug);
  if (!track) return {};
  return {
    title: `${track.title}: AI-Practice 실습`,
    description: track.subtitle,
    alternates: { canonical: `${SITE_URL}/ai-practice/${track.slug}` },
    // og 제목은 섹션 라벨과 브랜드 없이 페이지 제목만 (템플릿 fallback을 막는다)
    openGraph: { title: `${track.title}: AI-Practice 실습`, description: track.subtitle },
    // 레거시 텍스트 트랙: AIPBL 실습으로 대체되어 비색인 유지 (사이트맵 미포함)
    robots: { index: false, follow: false },
  };
}

export default async function PracticeTrackPage({ params }: PageProps) {
  const { slug } = await params;
  const track = getPracticeTrack(slug);
  if (!track) notFound();

  const currentIndex = PRACTICE_TRACKS.findIndex((t) => t.slug === track.slug);
  const nextTrack = PRACTICE_TRACKS[currentIndex + 1];

  return (
    <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <ViewTracker contentType="ai_practice" contentSlug={track.slug} contentTitle={track.title} />
      {/* 상단 이동 */}
      <Link
        href="/ai-practice"
        className="inline-flex items-center gap-2 text-xs font-medium text-[var(--ap-muted)] hover:text-white transition-colors mb-10"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> AI-PRACTICE 목록으로
      </Link>

      {/* 헤더 */}
      <header className="mb-14">
        <p className="ap-label mb-4">Practice Track {String(currentIndex + 1).padStart(2, "0")}</p>
        <h1 className="text-2xl sm:text-4xl font-semibold tracking-tight leading-tight mb-4">
          {track.title}
        </h1>
        <p className="text-sm sm:text-base leading-relaxed text-[var(--ap-muted)] max-w-2xl mb-7">
          {track.subtitle}
        </p>
        <div className="flex flex-wrap gap-2.5 text-xs font-mono">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 text-[var(--ap-muted)]">
            <Clock3 className="w-3.5 h-3.5" strokeWidth={1.5} /> {track.duration}
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 text-[var(--ap-muted)]">
            <ListChecks className="w-3.5 h-3.5" strokeWidth={1.5} /> {track.steps.length}단계
          </span>
          {track.tools.map((tool) => (
            <span
              key={tool}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 text-[var(--ap-muted)]"
            >
              <Wrench className="w-3.5 h-3.5" strokeWidth={1.5} /> {tool}
            </span>
          ))}
        </div>
      </header>

      {/* 단계 목록 */}
      <ol className="space-y-5 mb-16">
        {track.steps.map((step, index) => (
          <li key={step.title} className="ap-card p-6 sm:p-8">
            <div className="flex items-start gap-4 mb-6">
              <span className="ap-step-num">{index + 1}</span>
              <div>
                <h2 className="font-semibold text-lg sm:text-xl leading-snug mb-1.5">
                  {step.title}
                </h2>
                <p className="text-sm text-[var(--ap-muted)] leading-relaxed">{step.goal}</p>
              </div>
            </div>

            <p className="text-sm leading-relaxed mb-3 sm:pl-14">{step.action}</p>

            {step.prompt && (
              <div className="sm:ml-14 mb-4">
                <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-[#ffe08a] mb-2">
                  입력할 문장
                </p>
                <pre className="ap-prompt p-4 overflow-x-auto">{step.prompt}</pre>
              </div>
            )}

            <div className="ap-expected p-4 sm:ml-14">
              <p className="flex items-start gap-2 text-sm leading-relaxed text-gray-300">
                <CheckCircle2
                  className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#7dd3fc]"
                  strokeWidth={1.5}
                />
                <span>{step.expected}</span>
              </p>
            </div>
          </li>
        ))}
      </ol>

      {/* 마무리 */}
      <section className="ap-card p-8 sm:p-10 text-center">
        <h2 className="text-lg sm:text-2xl font-semibold tracking-tight mb-3">
          여기까지 왔다면 실습 완료입니다
        </h2>
        <p className="text-sm text-[var(--ap-muted)] mb-7 max-w-lg mx-auto">
          예시 문장을 내 업무 내용으로 바꿔 한 번 더 진행하면 오늘 익힌 방식을 실제 업무에 바로
          쓸 수 있습니다.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {nextTrack ? (
            <Link
              href={`/ai-practice/${nextTrack.slug}`}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#ff0033] text-white font-semibold text-sm hover:bg-[#e0002d] transition-colors"
            >
              다음 트랙: {nextTrack.title} <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <Link
              href="/ai-practice"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#ff0033] text-white font-semibold text-sm hover:bg-[#e0002d] transition-colors"
            >
              전체 트랙 다시 보기 <ArrowRight className="w-4 h-4" />
            </Link>
          )}
          <Link
            href="/class"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full border border-white/15 text-sm font-semibold hover:border-white/40 transition-colors"
          >
            개념이 궁금하면 CLASS로
          </Link>
        </div>
      </section>
    </div>
  );
}
