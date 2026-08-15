"use client";

/**
 * 보고서 맞춤설정 패널.
 *
 * 표준 보고서 오른쪽 위 연필을 누르면 오른쪽에서 밀려 나온다.
 * 측정항목을 더하거나 빼고 적용을 누르면 표에 열이 붙는다.
 * 실제 GA4처럼 더한 측정항목은 목록 맨 아래에 놓이고, 표에서도 오른쪽 끝에 붙는다.
 */

import { X, GripVertical, Plus, ChevronDown } from "lucide-react";
import { useRing } from "./tour";

export interface MetricChoice {
  key: string;
  label: string;
}

interface Ga4CustomizePanelProps {
  /** 지금 표에 놓인 측정항목. 기본 열과 더한 열을 순서대로 넘긴다 */
  metrics: MetricChoice[];
  /** 더 고를 수 있는 측정항목 */
  available: MetricChoice[];
  /** 목록이 펼쳐져 있는지 */
  addMenuOpen: boolean;
  onToggleAddMenu: () => void;
  onAddMetric: (key: string) => void;
  onRemoveMetric: (key: string) => void;
  onApply: () => void;
  onClose: () => void;
}

export function Ga4CustomizePanel({
  metrics,
  available,
  addMenuOpen,
  onToggleAddMenu,
  onAddMetric,
  onRemoveMetric,
  onApply,
  onClose,
}: Ga4CustomizePanelProps) {
  const addRing = useRing("metric-add");
  const applyRing = useRing("customize-apply");

  return (
    <aside className="ga4-cz" aria-label="보고서 맞춤설정">
      <header className="ga4-cz-head">
        <h3 className="ga4-cz-title">보고서 맞춤설정</h3>
        <button type="button" className="ga4-cz-close" onClick={onClose} aria-label="닫기">
          <X className="w-4 h-4" strokeWidth={2} aria-hidden />
        </button>
      </header>

      <div className="ga4-cz-body">
        <p className="ga4-cz-section">측정기준</p>
        <p className="ga4-cz-note">방문 페이지</p>

        <p className="ga4-cz-section">측정항목</p>
        <ul className="ga4-cz-list">
          {metrics.map((m) => (
            <li key={m.key}>
              <GripVertical className="w-4 h-4 ga4-cz-grip" strokeWidth={1.8} aria-hidden />
              <span>{m.label}</span>
              <button
                type="button"
                onClick={() => onRemoveMetric(m.key)}
                aria-label={`${m.label} 빼기`}
              >
                <X className="w-3.5 h-3.5" strokeWidth={2.2} aria-hidden />
              </button>
            </li>
          ))}
        </ul>

        <div className="ga4-cz-add-wrap">
          <button
            type="button"
            data-tour="metric-add"
            onClick={onToggleAddMenu}
            className={`ga4-cz-add${addRing}`}
            aria-expanded={addMenuOpen}
          >
            <Plus className="w-4 h-4" strokeWidth={2} aria-hidden />
            측정항목 추가
            <ChevronDown className="w-3.5 h-3.5 ga4-cz-add-caret" strokeWidth={2} aria-hidden />
          </button>

          {addMenuOpen && (
            <div className="ga4-menu ga4-cz-menu" role="listbox" aria-label="측정항목 선택">
              {available.length === 0 ? (
                <p className="ga4-cz-empty">더 고를 측정항목이 없습니다</p>
              ) : (
                available.map((m) => (
                  <MetricOption key={m.key} metric={m} onPick={onAddMetric} />
                ))
              )}
            </div>
          )}
        </div>
      </div>

      <footer className="ga4-cz-foot">
        <button type="button" className="ga4-cz-cancel" onClick={onClose}>
          취소
        </button>
        <button
          type="button"
          data-tour="customize-apply"
          onClick={onApply}
          className={`ga4-cz-apply${applyRing}`}
        >
          적용
        </button>
      </footer>
    </aside>
  );
}

function MetricOption({
  metric,
  onPick,
}: {
  metric: MetricChoice;
  onPick: (key: string) => void;
}) {
  const ring = useRing(`metric-option:${metric.key}`);
  return (
    <button
      type="button"
      role="option"
      aria-selected={false}
      data-tour={`metric-option:${metric.key}`}
      onClick={() => onPick(metric.key)}
      className={`ga4-menu-item${ring}`}
    >
      {metric.label}
    </button>
  );
}
