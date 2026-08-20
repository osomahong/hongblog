"use client";

/**
 * 슬러그별 실습 컴포넌트 지연 로딩.
 * 30편을 한 묶음으로 내려보내면 첫 화면이 느려지므로, 열린 튜토리얼의 실습만 받아 온다.
 * 새 실습을 만들면 아래 표에 한 줄만 추가한다.
 */

import dynamic from "next/dynamic";
import type { ComponentType } from "react";

const LoadingBox = () => (
  <div className="ga4-lab-loading">실습 화면을 불러오는 중입니다.</div>
);

const LABS: Record<string, ComponentType> = {
  "traffic-acquisition-channels": dynamic(
    () => import("../labs/traffic-acquisition"),
    { loading: LoadingBox }
  ),
  "exploration-free-form": dynamic(
    () => import("../labs/exploration-free-form"),
    { loading: LoadingBox }
  ),
  "page-and-screen-report": dynamic(
    () => import("../labs/page-and-screen"),
    { loading: LoadingBox }
  ),
  "engagement-rate-and-bounce": dynamic(
    () => import("../labs/engagement-and-bounce"),
    { loading: LoadingBox }
  ),
  "users-sessions-events": dynamic(
    () => import("../labs/users-sessions-events"),
    { loading: LoadingBox }
  ),
  "landing-page-report": dynamic(
    () => import("../labs/landing-page"),
    { loading: LoadingBox }
  ),
  "secondary-dimension-and-filter": dynamic(
    () => import("../labs/secondary-dimension"),
    { loading: LoadingBox }
  ),
  "date-range-comparison": dynamic(
    () => import("../labs/date-range-comparison"),
    { loading: LoadingBox }
  ),
  "automatic-events": dynamic(
    () => import("../labs/automatic-events"),
    { loading: LoadingBox }
  ),
  "new-vs-returning": dynamic(
    () => import("../labs/new-vs-returning"),
    { loading: LoadingBox }
  ),
  "geo-and-device": dynamic(
    () => import("../labs/geo-and-device"),
    { loading: LoadingBox }
  ),
  "custom-event-and-key-event": dynamic(
    () => import("../labs/custom-event-and-key-event"),
    { loading: LoadingBox }
  ),
  "custom-dimension-registration": dynamic(
    () => import("../labs/custom-dimension-registration"),
    { loading: LoadingBox }
  ),
  "funnel-exploration": dynamic(
    () => import("../labs/funnel-exploration"),
    { loading: LoadingBox }
  ),
  "paid-search-performance": dynamic(
    () => import("../labs/paid-search-performance"),
    { loading: LoadingBox }
  ),
  "utm-campaign-tracking": dynamic(
    () => import("../labs/utm-campaign-tracking"),
    { loading: LoadingBox }
  ),
  "segment-basics": dynamic(
    () => import("../labs/segment-basics"),
    { loading: LoadingBox }
  ),
  "enhanced-measurement-toggle": dynamic(
    () => import("../labs/enhanced-measurement-toggle"),
    { loading: LoadingBox }
  ),
  "cohort-retention": dynamic(
    () => import("../labs/cohort-retention"),
    { loading: LoadingBox }
  ),
  "path-exploration": dynamic(
    () => import("../labs/path-exploration"),
    { loading: LoadingBox }
  ),
};

export function LabLoader({ slug }: { slug: string }) {
  const Lab = LABS[slug];
  if (!Lab) {
    return (
      <div className="ga4-lab-loading">
        이 튜토리얼의 실습 화면은 아직 준비 중입니다.
      </div>
    );
  }
  return <Lab />;
}
