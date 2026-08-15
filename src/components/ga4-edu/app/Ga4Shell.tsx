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
            <span className="ga4-tool-chip">
              비교 추가 <Plus className="w-3.5 h-3.5" strokeWidth={2} aria-hidden />
            </span>
            <DateRange
              value={state.dateRange}
              open={state.openMenu === "date"}
              onToggle={() => onToggleMenu(state.openMenu === "date" ? null : "date")}
              onPick={onPickDate}
            />
          </div>

          <div className="ga4-report-head">
            <h2 className="ga4-report-title">
              {reportTitle}
              <span className="ga4-title-check" aria-hidden>
                <CircleCheck className="w-4 h-4" strokeWidth={2} />
              </span>
              <ChevronDown className="w-4 h-4 ga4-title-caret" strokeWidth={2} aria-hidden />
            </h2>
            <span className="ga4-head-icons" aria-hidden>
              <StickyNote className="w-4 h-4" strokeWidth={1.7} />
              <Columns2 className="w-4 h-4" strokeWidth={1.7} />
              <TrendingUp className="w-4 h-4" strokeWidth={1.7} />
              <Share2 className="w-4 h-4" strokeWidth={1.7} />
              <ChartLine className="w-4 h-4" strokeWidth={1.7} />
              <Pencil className="w-4 h-4" strokeWidth={1.7} />
            </span>
          </div>

          <div className="ga4-filterbar">
            <span className="ga4-tool-chip">
              필터 추가 <Plus className="w-3.5 h-3.5" strokeWidth={2} aria-hidden />
            </span>
          </div>

          <div className="ga4-report-canvas">{children}</div>
        </div>
      </div>
    </div>
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
              ringName={key === "28d" ? "date-28d" : ""}
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
