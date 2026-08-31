"use client";

/**
 * 보고서 필터.
 *
 * 표 위쪽 필터 추가를 누르면 그 자리에서 아래로 펼쳐진다.
 * 측정기준과 값을 고르고 적용하면 조건에 맞지 않는 줄이 표에서 사라진다.
 * 비교와 달리 나머지를 지우기 때문에 합계 줄도 함께 줄어든다.
 */

import { X, Plus, ChevronDown } from "lucide-react";
import { useRing } from "./tour";

export interface FilterChoice {
  key: string;
  label: string;
}

interface Ga4FilterEditorProps {
  /** 조건을 만드는 중인지 */
  open: boolean;
  onOpen: () => void;
  onClose: () => void;

  dimensions: FilterChoice[];
  values: string[];
  dimension: string | null;
  value: string | null;
  openList: "dimension" | "value" | null;
  onToggleList: (list: "dimension" | "value" | null) => void;
  onPickDimension: (key: string) => void;
  onPickValue: (value: string) => void;
  onApply: () => void;

  /** 적용된 뒤 칩에 적히는 문구. 없으면 아직 걸린 필터가 없다 */
  appliedLabel?: string | null;
  onRemove: () => void;
}

export function Ga4FilterEditor({
  open,
  onOpen,
  onClose,
  dimensions,
  values,
  dimension,
  value,
  openList,
  onToggleList,
  onPickDimension,
  onPickValue,
  onApply,
  appliedLabel,
  onRemove,
}: Ga4FilterEditorProps) {
  const addRing = useRing("filter-add");
  const dimRing = useRing("filter-dimension");
  const valRing = useRing("filter-value");
  const applyRing = useRing("filter-apply");
  const dimensionLabel = dimensions.find((d) => d.key === dimension)?.label ?? null;

  return (
    <div className="ga4-flt">
      <div className="ga4-flt-chips">
        {appliedLabel && (
          <span className="ga4-flt-chip">
            {appliedLabel}
            <button type="button" onClick={onRemove} aria-label="필터 빼기">
              <X className="w-3 h-3" strokeWidth={2.4} aria-hidden />
            </button>
          </span>
        )}
        <button
          type="button"
          data-tour="filter-add"
          onClick={open ? onClose : onOpen}
          className={`ga4-tool-chip ga4-tool-chip-btn${addRing}`}
          aria-expanded={open}
        >
          필터 추가 <Plus className="w-3.5 h-3.5" strokeWidth={2} aria-hidden />
        </button>
      </div>

      {open && (
        <div className="ga4-flt-panel">
          <p className="ga4-flt-title">필터 만들기</p>

          <div className="ga4-flt-row">
            <div className="ga4-flt-field">
              <p className="ga4-flt-label">측정기준</p>
              <button
                type="button"
                data-tour="filter-dimension"
                onClick={() => onToggleList(openList === "dimension" ? null : "dimension")}
                className={`ga4-flt-select${dimensionLabel ? "" : " ga4-flt-empty"}${dimRing}`}
                aria-expanded={openList === "dimension"}
              >
                {dimensionLabel ?? "측정기준 선택"}
                <ChevronDown className="w-3.5 h-3.5" strokeWidth={2} aria-hidden />
              </button>
              {openList === "dimension" && (
                <div className="ga4-menu ga4-flt-menu" role="listbox" aria-label="측정기준 선택">
                  {dimensions.map((d) => (
                    <PickerItem
                      key={d.key}
                      tour={`flt-dim:${d.key}`}
                      label={d.label}
                      on={d.key === dimension}
                      onPick={() => onPickDimension(d.key)}
                    />
                  ))}
                </div>
              )}
            </div>

            <span className="ga4-flt-match">정확히 일치</span>

            <div className="ga4-flt-field">
              <p className="ga4-flt-label">값</p>
              <button
                type="button"
                data-tour="filter-value"
                onClick={() => onToggleList(openList === "value" ? null : "value")}
                disabled={!dimension}
                className={`ga4-flt-select${value ? "" : " ga4-flt-empty"}${valRing}`}
                aria-expanded={openList === "value"}
              >
                {value ?? "값 선택"}
                <ChevronDown className="w-3.5 h-3.5" strokeWidth={2} aria-hidden />
              </button>
              {openList === "value" && (
                <div className="ga4-menu ga4-flt-menu" role="listbox" aria-label="값 선택">
                  {values.map((v) => (
                    <PickerItem
                      key={v}
                      tour={`flt-val:${v}`}
                      label={v}
                      on={v === value}
                      onPick={() => onPickValue(v)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="ga4-flt-foot">
            <button type="button" className="ga4-flt-cancel" onClick={onClose}>
              취소
            </button>
            <button
              type="button"
              data-tour="filter-apply"
              onClick={onApply}
              disabled={!dimension || !value}
              className={`ga4-flt-apply${applyRing}`}
            >
              적용
            </button>
          </div>
        </div>
      )}
    </div>
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
