"use client";

/**
 * 비교 만들기 패널.
 *
 * 표준 보고서 위쪽 비교 추가를 누르면 오른쪽에서 밀려 나온다.
 * 측정기준과 값을 고르고 적용하면 같은 표가 모든 사용자와 그 조건 두 벌로 나뉜다.
 */

import { X, ChevronDown } from "lucide-react";
import { useRing } from "./tour";

export interface ComparisonChoice {
  key: string;
  label: string;
}

interface Ga4ComparisonPanelProps {
  dimensions: ComparisonChoice[];
  /** 고른 측정기준에서 쓸 수 있는 값 */
  values: string[];
  dimension: string | null;
  value: string | null;
  /** 어느 목록이 펼쳐져 있는지 */
  openList: "dimension" | "value" | null;
  onToggleList: (list: "dimension" | "value" | null) => void;
  onPickDimension: (key: string) => void;
  onPickValue: (value: string) => void;
  onApply: () => void;
  onClose: () => void;
}

export function Ga4ComparisonPanel({
  dimensions,
  values,
  dimension,
  value,
  openList,
  onToggleList,
  onPickDimension,
  onPickValue,
  onApply,
  onClose,
}: Ga4ComparisonPanelProps) {
  const dimRing = useRing("cmp-dimension");
  const valRing = useRing("cmp-value");
  const applyRing = useRing("cmp-apply");
  const dimensionLabel = dimensions.find((d) => d.key === dimension)?.label ?? null;

  return (
    <aside className="ga4-cmp" aria-label="비교 만들기">
      <header className="ga4-cmp-head">
        <h3 className="ga4-cmp-title">비교 만들기</h3>
        <button type="button" className="ga4-cmp-close" onClick={onClose} aria-label="닫기">
          <X className="w-4 h-4" strokeWidth={2} aria-hidden />
        </button>
      </header>

      <div className="ga4-cmp-body">
        <p className="ga4-cmp-section">조건</p>
        <div className="ga4-cmp-cond">
          <span className="ga4-cmp-include">포함</span>

          <div className="ga4-cmp-field">
            <p className="ga4-cmp-label">측정기준</p>
            <button
              type="button"
              data-tour="cmp-dimension"
              onClick={() => onToggleList(openList === "dimension" ? null : "dimension")}
              className={`ga4-cmp-select${dimensionLabel ? "" : " ga4-cmp-empty"}${dimRing}`}
              aria-expanded={openList === "dimension"}
            >
              {dimensionLabel ?? "측정기준 선택"}
              <ChevronDown className="w-3.5 h-3.5" strokeWidth={2} aria-hidden />
            </button>
            {openList === "dimension" && (
              <div className="ga4-menu ga4-cmp-menu" role="listbox" aria-label="측정기준 선택">
                {dimensions.map((d) => (
                  <PickerItem
                    key={d.key}
                    tour={`cmp-dim:${d.key}`}
                    label={d.label}
                    on={d.key === dimension}
                    onPick={() => onPickDimension(d.key)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="ga4-cmp-field">
            <p className="ga4-cmp-label">값</p>
            <button
              type="button"
              data-tour="cmp-value"
              onClick={() => onToggleList(openList === "value" ? null : "value")}
              disabled={!dimension}
              className={`ga4-cmp-select${value ? "" : " ga4-cmp-empty"}${valRing}`}
              aria-expanded={openList === "value"}
            >
              {value ?? "값 선택"}
              <ChevronDown className="w-3.5 h-3.5" strokeWidth={2} aria-hidden />
            </button>
            {openList === "value" && (
              <div className="ga4-menu ga4-cmp-menu" role="listbox" aria-label="값 선택">
                {values.map((v) => (
                  <PickerItem
                    key={v}
                    tour={`cmp-val:${v}`}
                    label={v}
                    on={v === value}
                    onPick={() => onPickValue(v)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <p className="ga4-cmp-note">
          비교를 적용하면 같은 표가 모든 사용자와 이 조건 두 벌로 나뉩니다. 최대 네 개까지
          만들 수 있습니다.
        </p>
      </div>

      <footer className="ga4-cmp-foot">
        <button type="button" className="ga4-cmp-cancel" onClick={onClose}>
          취소
        </button>
        <button
          type="button"
          data-tour="cmp-apply"
          onClick={onApply}
          disabled={!dimension || !value}
          className={`ga4-cmp-apply${applyRing}`}
        >
          적용
        </button>
      </footer>
    </aside>
  );
}

function PickerItem({
  tour,
  label,
  on,
  onPick,
}: {
  tour: string;
  label: string;
  on: boolean;
  onPick: () => void;
}) {
  const ring = useRing(tour);
  return (
    <button
      type="button"
      role="option"
      aria-selected={on}
      data-tour={tour}
      onClick={onPick}
      className={`ga4-menu-item${on ? " ga4-menu-item-on" : ""}${ring}`}
    >
      {label}
    </button>
  );
}
