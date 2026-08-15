"use client";

/**
 * 보고서 오른쪽 위 기간 선택기.
 *
 * 기본 껍데기에 들어 있는 기간 목록은 누르면 곧바로 반영되지만, 실제 GA4는 선택기 안에서
 * 고른 값을 적용을 눌러야 표에 옮긴다. 기간 비교를 다루는 편에서는 그 차이가 학습 내용이라
 * 이 컴포넌트가 초안 값을 따로 들고 있다가 적용에서 한 번에 넘긴다.
 */

import { Check, ChevronDown } from "lucide-react";
import { useRing } from "./tour";
import {
  COMPARE_BASE_LABEL,
  COMPARE_BASE_SUB,
  DATE_RANGE_LABEL,
  DATE_RANGE_SUB,
  type CompareBase,
  type DateRangeKey,
} from "./types";

const RANGE_OPTIONS: DateRangeKey[] = ["7d", "28d", "90d"];
const BASE_OPTIONS: CompareBase[] = ["previous", "yearAgo"];

interface Ga4DatePanelProps {
  /** 표에 반영된 값 */
  range: DateRangeKey;
  base: CompareBase | null;
  /** 선택기가 열려 있는지 */
  open: boolean;
  /** 선택기 안에서 고르는 중인 값 */
  draftRange: DateRangeKey;
  draftCompare: boolean;
  draftBase: CompareBase;
  baseListOpen: boolean;

  onToggle: () => void;
  onPickRange: (key: DateRangeKey) => void;
  onToggleCompare: () => void;
  onToggleBaseList: () => void;
  onPickBase: (base: CompareBase) => void;
  onApply: () => void;
  onCancel: () => void;
}

export function Ga4DatePanel({
  range,
  base,
  open,
  draftRange,
  draftCompare,
  draftBase,
  baseListOpen,
  onToggle,
  onPickRange,
  onToggleCompare,
  onToggleBaseList,
  onPickBase,
  onApply,
  onCancel,
}: Ga4DatePanelProps) {
  const chipRing = useRing("date-chip");
  const compareRing = useRing("date-compare");
  const baseRing = useRing("date-base");
  const applyRing = useRing("date-apply");

  return (
    <div className="ga4-date-wrap">
      <button
        type="button"
        data-tour="date-chip"
        onClick={onToggle}
        className={`ga4-daterange${chipRing}`}
        aria-expanded={open}
      >
        <span className="ga4-daterange-main">
          <strong>{DATE_RANGE_LABEL[range]}</strong>
          <span className="ga4-daterange-sub">{DATE_RANGE_SUB[range]}</span>
        </span>
        {base && (
          <span className="ga4-daterange-cmp">
            {COMPARE_BASE_LABEL[base]} {COMPARE_BASE_SUB[base][range]}
          </span>
        )}
        <ChevronDown className="w-3.5 h-3.5" strokeWidth={2} aria-hidden />
      </button>

      {open && (
        <div className="ga4-datepanel">
          <p className="ga4-datepanel-label">기간</p>
          <div className="ga4-datepanel-presets" role="listbox" aria-label="기간 선택">
            {RANGE_OPTIONS.map((key) => (
              <RangeOption key={key} value={key} current={draftRange} onPick={onPickRange} />
            ))}
          </div>
          <p className="ga4-datepanel-range">{DATE_RANGE_SUB[draftRange]}</p>

          <div className="ga4-datepanel-divider" />

          <button
            type="button"
            role="checkbox"
            aria-checked={draftCompare}
            data-tour="date-compare"
            onClick={onToggleCompare}
            className={`ga4-datepanel-compare${compareRing}`}
          >
            <span className={`ga4-datepanel-box${draftCompare ? " ga4-datepanel-box-on" : ""}`}>
              {draftCompare && <Check className="w-3 h-3" strokeWidth={3} aria-hidden />}
            </span>
            비교
          </button>

          {draftCompare && (
            <div className="ga4-datepanel-base">
              <button
                type="button"
                data-tour="date-base"
                onClick={onToggleBaseList}
                className={`ga4-datepanel-select${baseRing}`}
                aria-expanded={baseListOpen}
                aria-label={`비교 대상: ${COMPARE_BASE_LABEL[draftBase]}`}
              >
                {COMPARE_BASE_LABEL[draftBase]}
                <ChevronDown className="w-3.5 h-3.5" strokeWidth={2} aria-hidden />
              </button>
              {baseListOpen && (
                <div className="ga4-menu" role="listbox" aria-label="비교 대상 선택">
                  {BASE_OPTIONS.map((key) => (
                    <BaseOption key={key} value={key} current={draftBase} onPick={onPickBase} />
                  ))}
                </div>
              )}
              <p className="ga4-datepanel-range">{COMPARE_BASE_SUB[draftBase][draftRange]}</p>
            </div>
          )}

          <div className="ga4-datepanel-foot">
            <button type="button" onClick={onCancel} className="ga4-datepanel-cancel">
              취소
            </button>
            <button
              type="button"
              data-tour="date-apply"
              onClick={onApply}
              className={`ga4-datepanel-apply${applyRing}`}
            >
              적용
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function RangeOption({
  value,
  current,
  onPick,
}: {
  value: DateRangeKey;
  current: DateRangeKey;
  onPick: (key: DateRangeKey) => void;
}) {
  const ring = useRing(`date-opt:${value}`);
  return (
    <button
      type="button"
      role="option"
      aria-selected={current === value}
      data-tour={`date-opt:${value}`}
      onClick={() => onPick(value)}
      className={`ga4-datepanel-preset${current === value ? " ga4-datepanel-preset-on" : ""}${ring}`}
    >
      {DATE_RANGE_LABEL[value]}
    </button>
  );
}

function BaseOption({
  value,
  current,
  onPick,
}: {
  value: CompareBase;
  current: CompareBase;
  onPick: (base: CompareBase) => void;
}) {
  const ring = useRing(`date-base:${value}`);
  return (
    <button
      type="button"
      role="option"
      aria-selected={current === value}
      data-tour={`date-base:${value}`}
      onClick={() => onPick(value)}
      className={`ga4-menu-item${current === value ? " ga4-menu-item-on" : ""}${ring}`}
    >
      {COMPARE_BASE_LABEL[value]}
    </button>
  );
}
