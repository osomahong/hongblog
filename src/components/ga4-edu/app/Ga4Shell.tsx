"use client";

/**
 * GA4 화면 껍데기.
 * 상단바, 왼쪽 아이콘 레일, 보고서 트리, 보고서 머리를 그린다.
 * 실제 Google Analytics 4 화면을 기준으로 배치와 색을 맞춘다. 강조색은 파랑 하나만 쓴다.
 */

import type { ReactNode } from "react";
import {
  ChartLine,
  CircleCheck,
  ChevronDown,
  ChevronLeft,
  Plus,
  UserRound,
  Share2,
  Pencil,
  Columns2,
  StickyNote,
  TrendingUp,
} from "lucide-react";
import { Ga4TopBar, Ga4IconRail } from "./Ga4Chrome";
import { useRing } from "./tour";
import { DATE_RANGE_LABEL, DATE_RANGE_SUB, type DateRangeKey, type Ga4State } from "./types";

/* ===================== 보고서 트리 ===================== */

export interface ReportNode {
  id: string;
  label: string;
  children?: ReportNode[];
}

export const REPORT_TREE: ReportNode[] = [
  { id: "reports-overview", label: "보고서 개요" },
  { id: "realtime", label: "실시간 개요" },
  {
    id: "lifecycle",
    label: "비즈니스 목표",
    children: [
      { id: "acquisition-overview", label: "개요" },
      { id: "user-acquisition", label: "사용자 획득" },
      { id: "traffic-acquisition", label: "트래픽 획득: 세션 기본 채널 그…" },
      { id: "landing-page", label: "방문 페이지" },
      { id: "page-and-screen", label: "페이지 및 화면: 페이지 경로 및…" },
      { id: "events", label: "이벤트: 이벤트 이름" },
      { id: "retention", label: "유지" },
      { id: "cohort", label: "사용자 획득 동질 집단" },
    ],
  },
  {
    id: "user",
    label: "사용자",
    children: [
      { id: "demographics", label: "사용자 속성" },
      { id: "tech", label: "기술" },
    ],
  },
  { id: "library", label: "라이브러리" },
];

/**
 * 보고서 머리에 적는 온전한 이름.
 * 트리 라벨은 자리에 맞춰 줄인 것이라 제목에 그대로 쓰면 말줄임표가 따라온다.
 */
const REPORT_TITLE: Record<string, string> = {
  "reports-overview": "보고서 개요",
  realtime: "실시간 개요",
  "acquisition-overview": "개요",
  "user-acquisition": "사용자 획득",
  "traffic-acquisition": "트래픽 획득: 세션 기본 채널 그룹(기본 채널 그룹)",
  "landing-page": "방문 페이지",
  "page-and-screen": "페이지 및 화면: 페이지 경로 및 화면 클래스",
  events: "이벤트: 이벤트 이름",
  retention: "유지",
  cohort: "사용자 획득 동질 집단",
  demographics: "사용자 속성",
  tech: "기술",
  library: "라이브러리",
};

/** 학습자가 트리에서 고른 보고서의 이름. 제목과 트리 선택이 어긋나지 않게 한다 */
export function reportTitleOf(id: string): string {
  return REPORT_TITLE[id] ?? "보고서";
}

/**
 * 그 편이 다루지 않는 보고서를 눌렀을 때 보여 주는 안내.
 * 30편이 모든 보고서를 재현하지는 않기 때문에, 빈 화면 대신 돌아갈 길을 알려 준다.
 */
export function Ga4OtherReport({ label }: { label: string }) {
  return (
    <div className="ga4-other-report">
      <p className="ga4-other-report-title">{label}</p>
      <p className="ga4-other-report-desc">
        이 편에서는 이 보고서를 다루지 않습니다. 왼쪽 메뉴에서 원래 보던 보고서를 다시 누르면
        하던 자리에서 이어집니다.
      </p>
    </div>
  );
}

/* ===================== 껍데기 ===================== */

interface Ga4ShellProps {
  account: string;
  property: string;
  searchHint: string;
  state: Ga4State;
  onOpenReport: (id: string) => void;
  onToggleMenu: (menu: "date" | "dimension" | null) => void;
  onPickDate: (key: DateRangeKey) => void;
  reportTitle: string;
  /** 화면 고정(전체 화면) 상태와 토글 */
  pinned: boolean;
  onTogglePin: () => void;
  /** 오른쪽 위 연필로 맞춤설정을 여는 편에서만 넘긴다 */
  onOpenCustomize?: () => void;
  /** 맞춤설정 패널. 열려 있을 때만 넘긴다 */
  customizePanel?: ReactNode;
  /** 위쪽 비교 추가를 누를 수 있는 편에서만 넘긴다 */
  onOpenComparison?: () => void;
  /** 비교를 적용한 뒤 세그먼트 줄에 붙는 이름 */
  comparisonChip?: string | null;
  /** 비교 만들기 패널. 열려 있을 때만 넘긴다 */
  comparisonPanel?: ReactNode;
  /** 필터를 다루는 편에서만 넘긴다. 필터 줄 자리에 그대로 놓인다 */
  filterEditor?: ReactNode;
  /**
   * 기간 선택기를 갈아 끼울 때 넘긴다.
   * 기본 선택기는 기간만 고르지만, 기간 비교를 다루는 편은 적용 단추가 있는 선택기를 쓴다.
   */
  datePanel?: ReactNode;
  children: ReactNode;
}

export function Ga4Shell({
  account,
  property,
  searchHint,
  state,
  onOpenReport,
  onToggleMenu,
  onPickDate,
  reportTitle,
  pinned,
  onTogglePin,
  onOpenCustomize,
  customizePanel,
  onOpenComparison,
  comparisonChip,
  comparisonPanel,
  filterEditor,
  datePanel,
  children,
}: Ga4ShellProps) {
  return (
    <div className="ga4-app">
      <Ga4TopBar
        account={account}
        property={property}
        searchHint={searchHint}
        pinned={pinned}
        onTogglePin={onTogglePin}
      />

      <div className="ga4-app-body">
        <Ga4IconRail section="reports" />

        <nav className="ga4-tree" aria-label="보고서 목록">
          {REPORT_TREE.map((node) => (
            <TreeNode key={node.id} node={node} current={state.report} onOpen={onOpenReport} />
          ))}
          <button type="button" className="ga4-tree-collapse" aria-label="메뉴 접기">
            <ChevronLeft className="w-4 h-4" strokeWidth={1.8} aria-hidden />
          </button>
        </nav>

        <div className="ga4-content">
          <div className="ga4-segbar">
            <span className="ga4-seg-chip">
              <UserRound className="w-3.5 h-3.5" strokeWidth={2} aria-hidden /> 모든 사용자
            </span>
            {comparisonChip && <span className="ga4-seg-chip ga4-seg-chip-cmp">{comparisonChip}</span>}
            <ComparisonChip onOpen={onOpenComparison} />
            {datePanel ?? (
              <DateRange
                value={state.dateRange}
                open={state.openMenu === "date"}
                onToggle={() => onToggleMenu(state.openMenu === "date" ? null : "date")}
                onPick={onPickDate}
              />
            )}
          </div>

          <div className="ga4-report-head">
            <h2 className="ga4-report-title">
              {reportTitle}
              <span className="ga4-title-check" aria-hidden>
                <CircleCheck className="w-4 h-4" strokeWidth={2} />
              </span>
              <ChevronDown className="w-4 h-4 ga4-title-caret" strokeWidth={2} aria-hidden />
            </h2>
            <span className="ga4-head-icons">
              <StickyNote className="w-4 h-4" strokeWidth={1.7} aria-hidden />
              <Columns2 className="w-4 h-4" strokeWidth={1.7} aria-hidden />
              <TrendingUp className="w-4 h-4" strokeWidth={1.7} aria-hidden />
              <Share2 className="w-4 h-4" strokeWidth={1.7} aria-hidden />
              <ChartLine className="w-4 h-4" strokeWidth={1.7} aria-hidden />
              <CustomizeButton onOpen={onOpenCustomize} />
            </span>
          </div>

          <div className="ga4-filterbar">
            {filterEditor ?? (
              <span className="ga4-tool-chip">
                필터 추가 <Plus className="w-3.5 h-3.5" strokeWidth={2} aria-hidden />
              </span>
            )}
          </div>

          <div className="ga4-report-canvas">{children}</div>
        </div>

        {customizePanel}
        {comparisonPanel}
      </div>
    </div>
  );
}

/**
 * 위쪽 비교 추가. 비교를 다루는 편에서만 눌린다.
 * 다른 편에서는 실제 화면처럼 글자만 놓인다.
 */
function ComparisonChip({ onOpen }: { onOpen?: () => void }) {
  const ring = useRing("comparison-add");
  const inner = (
    <>
      비교 추가 <Plus className="w-3.5 h-3.5" strokeWidth={2} aria-hidden />
    </>
  );

  if (!onOpen) return <span className="ga4-tool-chip">{inner}</span>;

  return (
    <button
      type="button"
      data-tour="comparison-add"
      onClick={onOpen}
      className={`ga4-tool-chip ga4-tool-chip-btn${ring}`}
    >
      {inner}
    </button>
  );
}

/**
 * 오른쪽 위 연필. 맞춤설정을 다루는 편에서만 눌린다.
 * 다른 편에서는 실제 화면처럼 아이콘만 놓인다.
 */
function CustomizeButton({ onOpen }: { onOpen?: () => void }) {
  const ring = useRing("customize-btn");

  if (!onOpen) return <Pencil className="w-4 h-4" strokeWidth={1.7} aria-hidden />;

  return (
    <button
      type="button"
      data-tour="customize-btn"
      onClick={onOpen}
      className={`ga4-head-pencil${ring}`}
      aria-label="보고서 맞춤설정"
    >
      <Pencil className="w-4 h-4" strokeWidth={1.7} aria-hidden />
    </button>
  );
}

function TreeNode({
  node,
  current,
  onOpen,
}: {
  node: ReportNode;
  current: string;
  onOpen: (id: string) => void;
}) {
  const ring = useRing(`report:${node.id}`);

  if (node.children) {
    return (
      <div className="ga4-tree-group">
        <p className="ga4-tree-group-label">
          {node.label}
          <ChevronDown className="w-3.5 h-3.5" strokeWidth={1.8} aria-hidden />
        </p>
        {node.children.map((child) => (
          <TreeNode key={child.id} node={child} current={current} onOpen={onOpen} />
        ))}
      </div>
    );
  }

  return (
    <button
      type="button"
      data-tour={`report:${node.id}`}
      onClick={() => onOpen(node.id)}
      className={`ga4-tree-item${current === node.id ? " ga4-tree-item-on" : ""}${ring}`}
    >
      {node.label}
    </button>
  );
}

const DATE_OPTIONS: DateRangeKey[] = ["7d", "28d", "90d"];

function DateRange({
  value,
  open,
  onToggle,
  onPick,
}: {
  value: DateRangeKey;
  open: boolean;
  onToggle: () => void;
  onPick: (key: DateRangeKey) => void;
}) {
  const ring = useRing("date-chip");

  return (
    <div className="ga4-date-wrap">
      <button
        type="button"
        data-tour="date-chip"
        onClick={onToggle}
        className={`ga4-daterange${ring}`}
        aria-expanded={open}
      >
        <strong>{DATE_RANGE_LABEL[value]}</strong>
        <span className="ga4-daterange-sub">{DATE_RANGE_SUB[value]}</span>
        <ChevronDown className="w-3.5 h-3.5" strokeWidth={2} aria-hidden />
      </button>

      {open && (
        <div className="ga4-menu" role="listbox" aria-label="기간 선택">
          {DATE_OPTIONS.map((key) => (
            <DateOption
              key={key}
              value={key}
              current={value}
              ringName={`date-${key}`}
              onPick={onPick}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function DateOption({
  value,
  current,
  ringName,
  onPick,
}: {
  value: DateRangeKey;
  current: DateRangeKey;
  ringName: string;
  onPick: (key: DateRangeKey) => void;
}) {
  const ring = useRing(ringName);
  return (
    <button
      type="button"
      role="option"
      aria-selected={current === value}
      data-tour={ringName || undefined}
      onClick={() => onPick(value)}
      className={`ga4-menu-item${current === value ? " ga4-menu-item-on" : ""}${ring}`}
    >
      {DATE_RANGE_LABEL[value]}
    </button>
  );
}
