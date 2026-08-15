"use client";

/**
 * 튜토리얼 페이지 아래쪽 본문 조각.
 * 순서는 왼쪽 설명과 오른쪽 세로 타임라인으로 나누고, 단계 카드를 누르면 크게 볼 수 있다.
 * 자주 묻는 질문은 첫 항목만 열어 두고 나머지는 눌러야 열린다.
 */

import { useEffect, useState } from "react";
import { ChevronRight, ChevronDown, X, Route, CircleHelp } from "lucide-react";
import type { TutorialStep, FaqPair } from "@/app/ga4-edu/data";

/* ===================== 순서 ===================== */

interface StepsSectionProps {
  title: string;
  lead: string;
  steps: TutorialStep[];
}

export function StepsSection({ title, lead, steps }: StepsSectionProps) {
  const [zoom, setZoom] = useState<number | null>(null);
  // 첫 단계만 펼쳐 두고 나머지는 번호나 제목을 눌러야 열린다.
  // 하나를 열어도 앞서 연 단계는 그대로 두어, 여러 단계를 나란히 놓고 볼 수 있다
  const [open, setOpen] = useState<number[]>([0]);
  const toggleStep = (i: number) =>
    setOpen((prev) => (prev.includes(i) ? prev.filter((n) => n !== i) : [...prev, i]));

  return (
    <section className="ga4-tut-section ga4-split">
      <div className="ga4-split-left">
        <p className="ga4-split-kicker">
          <Route className="w-4 h-4" strokeWidth={1.8} aria-hidden /> STEPS
        </p>
        <h2 className="ga4-split-title">{title}</h2>
        <p className="ga4-split-lead">{lead}</p>
      </div>

      <ol className="ga4-timeline">
        {steps.map((step, i) => {
          const isOpen = open.includes(i);
          const toggle = () => toggleStep(i);
          const panelId = `ga4-step-panel-${i}`;
          return (
            <li key={step.title} className={`ga4-timeline-item${isOpen ? " ga4-timeline-on" : ""}`}>
              <span className="ga4-timeline-rail">
                <button
                  type="button"
                  className="ga4-timeline-num"
                  onClick={toggle}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  aria-label={`${i + 1}단계 ${step.title} ${isOpen ? "접기" : "펼치기"}`}
                >
                  {String(i + 1).padStart(2, "0")}
                </button>
                {i < steps.length - 1 && <span className="ga4-timeline-line" aria-hidden />}
              </span>

              <div className="ga4-timeline-card">
                <button
                  type="button"
                  className="ga4-timeline-head"
                  onClick={toggle}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                >
                  <h3 className="ga4-timeline-title">{step.title}</h3>
                  <ChevronDown className="w-4 h-4 ga4-timeline-caret" strokeWidth={2} aria-hidden />
                </button>

                {isOpen && (
                  <div id={panelId}>
                    <p className="ga4-timeline-body">{step.body}</p>
                    {step.image && (
                      <button
                        type="button"
                        className="ga4-timeline-shot"
                        onClick={() => setZoom(i)}
                        aria-label={`${step.title} 화면 크게 보기`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={step.image}
                          alt={step.imageAlt ?? `${step.title} 화면`}
                          loading="lazy"
                          width={1280}
                          height={720}
                        />
                        <span className="ga4-timeline-zoom">크게 보기</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      {zoom !== null && (
        <StepZoom step={steps[zoom]} index={zoom} total={steps.length} onClose={() => setZoom(null)} />
      )}
    </section>
  );
}

function StepZoom({
  step,
  index,
  total,
  onClose,
}: {
  step: TutorialStep;
  index: number;
  total: number;
  onClose: () => void;
}) {
  // 열려 있는 동안에는 뒤쪽 문서가 움직이지 않게 막고 Esc로 닫는다
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div
      className="ga4-zoom-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={step.title}
      onClick={onClose}
    >
      <div className="ga4-zoom-panel" onClick={(e) => e.stopPropagation()}>
        <div className="ga4-zoom-head">
          <div>
            <p className="ga4-zoom-step">
              {index + 1}단계 / 전체 {total}단계
            </p>
            <h3 className="ga4-zoom-title">{step.title}</h3>
          </div>
          <button type="button" className="ga4-zoom-close" onClick={onClose} aria-label="닫기">
            <X className="w-4 h-4" strokeWidth={2} aria-hidden />
          </button>
        </div>
        <p className="ga4-zoom-body">{step.body}</p>
        {step.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={step.image}
            alt={step.imageAlt ?? `${step.title} 화면`}
            className="ga4-zoom-img"
            width={1280}
            height={720}
          />
        )}
      </div>
    </div>
  );
}

/* ===================== 자주 묻는 질문 ===================== */

export function FaqSection({ faq }: { faq: FaqPair[] }) {
  // 대표 질문 하나는 열어 두고 나머지는 눌러야 열린다.
  // 한 번 연 질문은 다른 질문을 열어도 닫히지 않는다
  const [open, setOpen] = useState<number[]>([0]);
  const toggle = (i: number) =>
    setOpen((prev) => (prev.includes(i) ? prev.filter((n) => n !== i) : [...prev, i]));

  return (
    <section className="ga4-tut-section ga4-split">
      <div className="ga4-split-left">
        <p className="ga4-split-kicker">
          <CircleHelp className="w-4 h-4" strokeWidth={1.8} aria-hidden /> FAQ
        </p>
        <h2 className="ga4-split-title">자주 묻는 질문</h2>
        <p className="ga4-split-lead">
          실습을 마친 뒤 자주 나오는 질문을 정리했습니다. 질문을 누르면 답이 열립니다.
        </p>
      </div>

      <div className="ga4-accordion">
        {faq.map((item, i) => {
          const isOpen = open.includes(i);
          return (
            <div key={item.question} className={`ga4-acc-item${isOpen ? " ga4-acc-open" : ""}`}>
              <button
                type="button"
                className="ga4-acc-q"
                aria-expanded={isOpen}
                onClick={() => toggle(i)}
              >
                <span className="ga4-acc-icon" aria-hidden>
                  {isOpen ? (
                    <ChevronDown className="w-4 h-4" strokeWidth={2.2} />
                  ) : (
                    <ChevronRight className="w-4 h-4" strokeWidth={2.2} />
                  )}
                </span>
                {item.question}
              </button>
              {isOpen && <p className="ga4-acc-a">{item.answer}</p>}
            </div>
          );
        })}
      </div>
    </section>
  );
}
