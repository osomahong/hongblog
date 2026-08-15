"use client";

/**
 * 보고서 화면과 탐색 화면이 함께 쓰는 GA4 껍데기 조각.
 * 위쪽 상단바와 왼쪽 아이콘 줄은 어느 화면에서나 같은 자리에 같은 모양으로 놓인다.
 * 강조색은 파랑 하나만 쓰고, 화면 고정 버튼만 GA4에 없는 요소라 따로 구분한다.
 */

import {
  House,
  ChartNoAxesColumn,
  Radar,
  ChartLine,
  CircleCheck,
  Settings,
  Search,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Grip,
  UserRound,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { useRing } from "./tour";

/** 아이콘 줄에서 지금 열려 있는 영역 */
export type Ga4Section = "reports" | "explore";

interface Ga4TopBarProps {
  /** 계정 이름. 속성 위 작은 줄에 놓인다 */
  account: string;
  /** 속성 이름. 계정 아래 굵은 줄에 놓인다 */
  property: string;
  /** 검색창에 흐리게 적히는 문구 */
  searchHint: string;
  pinned: boolean;
  onTogglePin: () => void;
}

export function Ga4TopBar({
  account,
  property,
  searchHint,
  pinned,
  onTogglePin,
}: Ga4TopBarProps) {
  return (
    <header className="ga4-topbar">
      <span className="ga4-wordmark">
        <span className="ga4-wordmark-mark" aria-hidden />
        애널리틱스
      </span>

      <span className="ga4-topbar-divider" aria-hidden />

      <div className="ga4-account">
        <p className="ga4-account-path">
          모든 계정 <ChevronRight className="w-3 h-3" strokeWidth={2} aria-hidden /> {account}
        </p>
        <button type="button" className="ga4-account-property">
          {property}
          <ChevronDown className="w-4 h-4" strokeWidth={2} aria-hidden />
        </button>
      </div>

      <div className="ga4-omnibox" aria-hidden>
        <Search className="w-4 h-4" strokeWidth={1.8} />
        <span>{searchHint}</span>
      </div>

      <button
        type="button"
        onClick={onTogglePin}
        className="ga4-pin"
        aria-pressed={pinned}
        title={pinned ? "화면 고정 풀기 (Esc)" : "GA4 화면을 넓게 고정합니다"}
      >
        {pinned ? (
          <>
            <Minimize2 className="w-4 h-4" strokeWidth={2} aria-hidden /> 고정 풀기
          </>
        ) : (
          <>
            <Maximize2 className="w-4 h-4" strokeWidth={2} aria-hidden /> 화면 고정
          </>
        )}
      </button>

      <span className="ga4-topbar-icons" aria-hidden>
        <span className="ga4-topbar-icon">
          <Grip className="w-5 h-5" strokeWidth={2} />
        </span>
        <span className="ga4-topbar-icon">
          <CircleHelp className="w-5 h-5" strokeWidth={1.8} />
        </span>
        <span className="ga4-topbar-avatar">
          <UserRound className="w-4 h-4" strokeWidth={2} />
        </span>
      </span>
    </header>
  );
}

interface Ga4IconRailProps {
  section: Ga4Section;
  /** 영역을 옮길 수 있는 튜토리얼에서만 넘긴다 */
  onOpenSection?: (section: Ga4Section) => void;
}

export function Ga4IconRail({ section, onOpenSection }: Ga4IconRailProps) {
  const reportsRing = useRing("iconrail:reports");
  const exploreRing = useRing("iconrail:explore");

  return (
    <nav className="ga4-iconrail" aria-label="Analytics 메뉴">
      <button type="button" className="ga4-iconrail-btn" aria-label="홈">
        <House className="w-5 h-5" strokeWidth={1.7} aria-hidden />
      </button>
      <button
        type="button"
        data-tour="iconrail:reports"
        onClick={() => onOpenSection?.("reports")}
        className={`ga4-iconrail-btn${section === "reports" ? " ga4-iconrail-on" : ""}${reportsRing}`}
        aria-label="보고서"
        aria-current={section === "reports"}
      >
        <ChartNoAxesColumn className="w-5 h-5" strokeWidth={2} aria-hidden />
      </button>
      <button
        type="button"
        data-tour="iconrail:explore"
        onClick={() => onOpenSection?.("explore")}
        className={`ga4-iconrail-btn${section === "explore" ? " ga4-iconrail-on" : ""}${exploreRing}`}
        aria-label="탐색"
        aria-current={section === "explore"}
      >
        <ChartLine className="w-5 h-5" strokeWidth={1.7} aria-hidden />
      </button>
      <button type="button" className="ga4-iconrail-btn" aria-label="광고">
        <Radar className="w-5 h-5" strokeWidth={1.7} aria-hidden />
      </button>
      <span className="ga4-iconrail-gap" />
      <button type="button" className="ga4-iconrail-btn" aria-label="계정 진단">
        <CircleCheck className="w-5 h-5" strokeWidth={1.7} aria-hidden />
      </button>
      <button type="button" className="ga4-iconrail-btn" aria-label="관리">
        <Settings className="w-5 h-5" strokeWidth={1.7} aria-hidden />
      </button>
    </nav>
  );
}
