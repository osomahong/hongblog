"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { NeoBadge } from "@/components/neo";
import { sendGAEvent } from "@/lib/gtm";
import type { PromotionSlot } from "@/lib/promotions";

const AUTO_ADVANCE_MS = 6000;
const SETTLE_MS = 160;
/** 슬라이드를 세 벌 이어 붙이고 가운데 벌에서만 논다. 양끝에 닿기 전에 되돌린다. */
const COPIES = 3;

interface HeroCarouselProps {
  slots: PromotionSlot[];
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function slideElements(track: HTMLDivElement) {
  return Array.from(track.querySelectorAll<HTMLElement>("[data-slide]"));
}

/** 트랙 가운데에서 가장 가까운 슬라이드의 번호 */
function nearestIndex(track: HTMLDivElement, slides: HTMLElement[]) {
  const viewportCenter = track.scrollLeft + track.clientWidth / 2;
  let nearest = 0;
  let shortest = Number.POSITIVE_INFINITY;

  slides.forEach((slide, slideIndex) => {
    const distance = Math.abs(slide.offsetLeft + slide.clientWidth / 2 - viewportCenter);
    if (distance < shortest) {
      shortest = distance;
      nearest = slideIndex;
    }
  });

  return nearest;
}

function centerOffset(track: HTMLDivElement, slide: HTMLElement) {
  return slide.offsetLeft - (track.clientWidth - slide.clientWidth) / 2;
}

/**
 * 메인 상단 추천 배너.
 * 가운데 슬라이드 양옆으로 앞뒤 슬라이드가 걸쳐 보이고, 끝에서 처음으로 이어진다.
 * 슬라이드를 세 벌 이어 붙인 뒤 스크롤이 멈출 때마다 가운데 벌로 되돌리는 방식이라
 * 브라우저의 스크롤과 스냅 동작을 그대로 쓴다.
 *
 * 배너 그림은 이미지마다 시작 지점이 48%에서 61% 사이로 다르다. 텍스트를 이미지 위에
 * 얹으면 어떤 배너에서는 반드시 겹치므로, 640px 이상에서는 텍스트 45%와 이미지 55%를
 * 나란히 두고 이미지를 오른쪽 기준으로 잘라 넣는다.
 */
export function HeroCarousel({ slots }: HeroCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const seenRef = useRef(new Set<string>());
  const settleTimerRef = useRef<number | null>(null);
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const count = slots.length;
  const isLooping = count > 1;
  const rendered = isLooping ? Array.from({ length: COPIES }, () => slots).flat() : slots;
  /** 가운데 벌의 첫 슬라이드 번호 */
  const baseOffset = isLooping ? count : 0;

  // 처음에는 가운데 벌의 첫 슬라이드에서 시작한다.
  useEffect(() => {
    const track = trackRef.current;
    if (!track || !isLooping) return;

    const slides = slideElements(track);
    const first = slides[baseOffset];
    if (first) track.scrollLeft = centerOffset(track, first);
  }, [baseOffset, isLooping]);

  // 노출 이벤트는 슬라이드마다 페이지뷰당 한 번만 보낸다.
  useEffect(() => {
    const slot = slots[index];
    if (!slot || seenRef.current.has(slot.id)) return;

    seenRef.current.add(slot.id);
    sendGAEvent("view_main_banner", {
      content_id: slot.id,
      content_name: slot.title,
      position: index + 1,
    });
  }, [index, slots]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const onScroll = () => {
      const slides = slideElements(track);
      if (slides.length === 0) return;

      const nearest = nearestIndex(track, slides);
      const real = ((nearest % count) + count) % count;
      setIndex((prev) => (prev === real ? prev : real));

      // 스크롤이 멎은 뒤에 가운데 벌로 되돌린다. 스크롤 도중에 옮기면 화면이 튄다.
      if (!isLooping) return;
      if (settleTimerRef.current) window.clearTimeout(settleTimerRef.current);

      settleTimerRef.current = window.setTimeout(() => {
        const settled = nearestIndex(track, slideElements(track));
        if (settled >= count && settled < count * 2) return;

        const target = slideElements(track)[(settled % count) + count];
        if (target) track.scrollLeft = centerOffset(track, target);
      }, SETTLE_MS);
    };

    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", onScroll);
      if (settleTimerRef.current) window.clearTimeout(settleTimerRef.current);
    };
  }, [count, isLooping]);

  useEffect(() => {
    if (!isPlaying || isPaused || count < 2) return;
    if (prefersReducedMotion()) return;

    const timer = window.setInterval(() => {
      const track = trackRef.current;
      if (!track || document.hidden) return;

      const slides = slideElements(track);
      const next = slides[nearestIndex(track, slides) + 1];
      if (next) track.scrollTo({ left: centerOffset(track, next), behavior: "smooth" });
    }, AUTO_ADVANCE_MS);

    return () => window.clearInterval(timer);
  }, [isPlaying, isPaused, count]);

  if (count === 0) return null;

  /** 화살표용. 지금 위치를 기준으로 한 칸 옮긴다 */
  const step = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;

    const slides = slideElements(track);
    const target = slides[nearestIndex(track, slides) + direction];
    if (!target) return;

    track.scrollTo({
      left: centerOffset(track, target),
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  };

  /** 점 인디케이터용. 가운데 벌의 해당 슬라이드로 옮긴다 */
  const goToReal = (real: number) => {
    const track = trackRef.current;
    if (!track) return;

    const target = slideElements(track)[real + baseOffset];
    if (!target) return;

    track.scrollTo({
      left: centerOffset(track, target),
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      step(-1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      step(1);
    }
  };

  return (
    <section
      className="mb-6 sm:mb-12 relative left-1/2 -translate-x-1/2 w-screen max-w-[100vw]"
      aria-roledescription="carousel"
      aria-label="추천 코스 배너"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
    >
      <div
        ref={trackRef}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        className="relative flex items-stretch gap-3 sm:gap-5 overflow-x-auto snap-x snap-mandatory pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden focus:outline-none"
      >
        {rendered.map((slot, slideIndex) => {
          const real = slideIndex % count;
          const isClone = isLooping && (slideIndex < count || slideIndex >= count * 2);
          const isActive = real === index && !isClone;

          return (
            <div
              key={`${slot.id}-${slideIndex}`}
              data-slide=""
              role="group"
              aria-roledescription="slide"
              aria-label={`${real + 1} / ${count}`}
              aria-hidden={isClone}
              // 모바일은 걸쳐 보이는 폭이 20px 남짓이라 축소까지 하면 옆 슬라이드가 사라진다.
              // 크기 차이는 640px 이상에서만 준다.
              style={{ backgroundColor: slot.bgColor }}
              className={`w-[84vw] lg:w-[min(90vw,76rem)] flex-shrink-0 snap-center overflow-hidden border-4 border-black neo-shadow transition-[transform,opacity] duration-300 ease-out ${
                real === index ? "opacity-100 scale-100 z-10" : "opacity-45 md:scale-[0.9]"
              }`}
            >
              <Link
                href={slot.href}
                tabIndex={isClone ? -1 : undefined}
                className="group flex flex-col lg:grid lg:grid-cols-[55%_45%] lg:min-h-[clamp(20rem,24vw,26rem)]"
                onClick={() =>
                  sendGAEvent("click_main_banner", {
                    content_id: slot.id,
                    content_name: slot.title,
                    position: real + 1,
                  })
                }
              >
                {/*
                  배너 파일은 이미 피사체 쪽으로 잘라 둔 것이라 가운데 기준으로 채운다.
                  원본을 그대로 쓰면 이미지 안 빈 배경 때문에 글과 그림 사이가 벌어진다.
                */}
                <picture className="order-1 lg:order-2 lg:h-full lg:min-w-0">
                  <source media="(min-width: 1024px)" srcSet={slot.heroImage} />
                  <img
                    src={slot.cardImage}
                    alt=""
                    aria-hidden="true"
                    loading={isActive ? "eager" : "lazy"}
                    fetchPriority={isActive ? "high" : "auto"}
                    decoding="async"
                    className="w-full aspect-[1200/630] max-h-80 lg:max-h-none lg:aspect-auto lg:h-full object-cover object-center border-b-4 border-black lg:border-b-0"
                  />
                </picture>

                {/*
                  글 덩어리를 칸 왼쪽 끝에 붙이면 그림과 사이가 벌어진다. 폭을 묶고 칸 가운데에
                  두어 슬라이드 전체가 가운데로 모이게 한다.
                */}
                <div className="order-2 lg:order-1 p-4 sm:p-6 lg:p-7 flex flex-col justify-center lg:min-w-0 lg:max-w-[36rem] lg:mx-auto lg:-translate-x-[10px]">
                  <NeoBadge variant={slot.badge} className="self-start text-[10px] sm:text-xs">
                    {slot.label}
                  </NeoBadge>
                  {/*
                    headline의 \n을 그대로 살린다. 줄바꿈 자리를 브라우저에 맡기지 않는다.
                    픽셀 서체라 크기를 14의 배수로만 준다. 중간 값을 쓰면 획 굵기가 자리마다
                    달라져 글자가 지저분해진다. 그래서 clamp가 아니라 단계로 끊는다.
                  */}
                  <h2
                    style={{ fontFamily: "var(--font-pixel)" }}
                    className="mt-2 sm:mt-3 lg:mt-4 text-[28px] lg:text-[42px] leading-[1.25] [font-synthesis:none] whitespace-pre-line"
                  >
                    {slot.headline}
                  </h2>
                  <p className="mt-2 sm:mt-3 text-sm sm:text-base lg:text-[clamp(0.875rem,1.15vw,1.0625rem)] text-[#222] leading-relaxed whitespace-pre-line">
                    {slot.description}
                  </p>
                  <div className="mt-2 sm:mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] sm:text-xs font-mono text-muted-foreground">
                    <span className="font-bold text-black">{slot.title}</span>
                    <span>{slot.classCount}개 개념</span>
                  </div>
                  <span className="mt-3 sm:mt-5 inline-flex self-start items-center gap-1.5 bg-black text-white text-xs sm:text-sm font-black uppercase px-3 sm:px-4 py-1.5 sm:py-2 border-2 border-black neo-shadow-sm group-hover:translate-x-1 group-hover:translate-y-1 group-hover:shadow-none transition-all">
                    코스 보기
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                  </span>
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          {slots.map((slot, slotIndex) => (
            <button
              key={slot.id}
              type="button"
              onClick={() => goToReal(slotIndex)}
              aria-label={`${slotIndex + 1}번째 배너로 이동`}
              aria-current={slotIndex === index}
              className={`h-2.5 border-2 border-black transition-all ${
                slotIndex === index ? "w-6 bg-[#FF0033]" : "w-2.5 bg-white hover:bg-gray-200"
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="font-mono text-[10px] sm:text-xs text-muted-foreground">
            {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
          </span>
          <button
            type="button"
            onClick={() => setIsPlaying((prev) => !prev)}
            aria-label={isPlaying ? "배너 자동 넘김 정지" : "배너 자동 넘김 시작"}
            className="p-1 sm:p-1.5 bg-white border-2 border-black hover:bg-black hover:text-white transition-colors"
          >
            {isPlaying ? <Pause className="w-3 h-3 sm:w-4 sm:h-4" /> : <Play className="w-3 h-3 sm:w-4 sm:h-4" />}
          </button>
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label="이전 배너"
            className="p-1 sm:p-1.5 bg-white border-2 border-black hover:bg-black hover:text-white transition-colors"
          >
            <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            aria-label="다음 배너"
            className="p-1 sm:p-1.5 bg-white border-2 border-black hover:bg-black hover:text-white transition-colors"
          >
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
