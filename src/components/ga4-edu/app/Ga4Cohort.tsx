"use client";

/**
 * 탐색 동질 집단 탐색 화면.
 *
 * 탭 설정에 포함 기준, 재방문 기준, 세분화 기준, 계산 방식이 놓이고 캔버스에 코호트 표가 그려진다.
 * 표는 가로가 경과 기간, 세로가 코호트다. 오른쪽으로 갈수록 남는 사람이 줄어 삼각형 모양이 된다.
 *
 * 셀 색은 첫 칸을 100으로 둔 잔존율에 따라 진해진다. GA4도 같은 방식으로 칠한다.
 */

import { ChevronDown } from "lucide-react";
import { useRing } from "./tour";

export type CohortGranularity = "daily" | "weekly" | "monthly";
export type CohortCalculation = "standard" | "rolling";

export const GRANULARITY_LABEL: Record<CohortGranularity, string> = {
  daily: "일별 동질 집단",
  weekly: "주별 동질 집단",
  monthly: "월별 동질 집단",
};

export const CALCULATION_LABEL: Record<CohortCalculation, string> = {
  standard: "표준",
  rolling: "연속",
};

export interface CohortRow {
  /** 코호트 이름. 표 첫 열에 적힌다 */
  label: string;
  /** 경과 기간별 사용자 수. 0번째가 코호트 크기다 */
  values: number[];
}

interface Ga4CohortProps {
  name: string;
  dateLabel: string;
  granularity: CohortGranularity;
  calculation: CohortCalculation;
  /** 세분화 기준 목록이 펼쳐져 있는지 */
  listOpen: boolean;
  rows: CohortRow[];
  /** 경과 기간 머리글. 주별이면 0주차, 1주차처럼 적힌다 */
  columnLabels: string[];
  selectedColumn: number | null;
  onToggleList: () => void;
  onPickGranularity: (value: CohortGranularity) => void;
  onToggleCalculation: () => void;
  onSelectColumn: (index: number) => void;
  /** 마무리에서 표시를 남길 열 */
  markColumn?: number | null;
}

const numberFormat = new Intl.NumberFormat("ko-KR");

export function Ga4Cohort({
  name,
  dateLabel,
  granularity,
  calculation,
  listOpen,
  rows,
  columnLabels,
  selectedColumn,
  onToggleList,
  onPickGranularity,
  onToggleCalculation,
  onSelectColumn,
  markColumn = null,
}: Ga4CohortProps) {
  const listRing = useRing("cohort:granularity");
  const calcRing = useRing("cohort:calculation");

  return (
    <div className="ga4-ff">
      {/* ----- 변수 ----- */}
      <section className="ga4-ff-panel" aria-label="변수">
        <header className="ga4-ff-panel-head">
          <span className="ga4-ff-panel-title">변수</span>
        </header>
        <div className="ga4-ff-name">
          <p className="ga4-ff-name-label">데이터 탐색 이름</p>
          <p className="ga4-ff-name-value">{name}</p>
        </div>
        <div className="ga4-ff-field">
          <p className="ga4-ff-field-label">커스텀</p>
          <p className="ga4-ff-field-value">{dateLabel}</p>
        </div>
        <div className="ga4-ff-group">
          <p className="ga4-ff-group-title">세그먼트</p>
          <p className="ga4-ff-empty">모든 사용자</p>
        </div>
        <div className="ga4-ff-group">
          <p className="ga4-ff-group-title">측정항목</p>
          <p className="ga4-ff-empty">활성 사용자</p>
        </div>
      </section>

      {/* ----- 탭 설정 ----- */}
      <section className="ga4-ff-panel ga4-ff-settings" aria-label="탭 설정">
        <header className="ga4-ff-panel-head">
          <span className="ga4-ff-panel-title">탭 설정</span>
        </header>

        <div className="ga4-ff-field">
          <p className="ga4-ff-field-label">기법</p>
          <p className="ga4-ff-field-value">동질 집단 탐색 분석</p>
        </div>

        <div className="ga4-ff-field">
          <p className="ga4-ff-field-label">동질 집단 포함</p>
          <p className="ga4-ff-field-value">첫 접속</p>
        </div>

        <div className="ga4-ff-field">
          <p className="ga4-ff-field-label">재방문 기준</p>
          <p className="ga4-ff-field-value">모든 접속</p>
        </div>

        <div className="ga4-ff-field ga4-cohort-select-field">
          <p className="ga4-ff-field-label">동질 집단 세부기준</p>
          <button
            type="button"
            data-tour="cohort:granularity"
            onClick={onToggleList}
            className={`ga4-fn-select${listRing}`}
          >
            {GRANULARITY_LABEL[granularity]}
            <ChevronDown className="w-4 h-4" strokeWidth={2} aria-hidden />
          </button>
          {listOpen && (
            <ul className="ga4-fn-options">
              {(Object.keys(GRANULARITY_LABEL) as CohortGranularity[]).map((key) => (
                <li key={key}>
                  <button type="button" onClick={() => onPickGranularity(key)}>
                    {GRANULARITY_LABEL[key]}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="ga4-fn-toggle-row">
          <span className="ga4-fn-toggle-label">연속 계산</span>
          <button
            type="button"
            role="switch"
            aria-checked={calculation === "rolling"}
            aria-label="연속 계산"
            data-tour="cohort:calculation"
            onClick={onToggleCalculation}
            className={`ga4-fn-switch${calculation === "rolling" ? " ga4-fn-switch-on" : ""}${calcRing}`}
          >
            <span className="ga4-fn-switch-knob" />
          </button>
        </div>
      </section>

      {/* ----- 캔버스 ----- */}
      <section className="ga4-cohort-canvas" aria-label="동질 집단 표">
        <table className="ga4-cohort-table">
          <thead>
            <tr>
              <th scope="col">{GRANULARITY_LABEL[granularity]}</th>
              {columnLabels.map((label, i) => (
                <th
                  key={label}
                  scope="col"
                  className={`${selectedColumn === i ? "ga4-cohort-col-on" : ""}${markColumn === i ? " ga4-cohort-col-mark" : ""}`}
                >
                  <button type="button" onClick={() => onSelectColumn(i)}>
                    {label}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const base = row.values[0] ?? 0;
              return (
                <tr key={row.label}>
                  <th scope="row">
                    <span className="ga4-cohort-row-label">{row.label}</span>
                    <span className="ga4-cohort-row-size">
                      {numberFormat.format(base)}명
                    </span>
                  </th>
                  {columnLabels.map((label, i) => {
                    const value = row.values[i];
                    if (value === undefined) {
                      return <td key={label} className="ga4-cohort-empty" />;
                    }
                    const rate = base === 0 ? 0 : (value / base) * 100;
                    return (
                      <td
                        key={label}
                        className={`ga4-cohort-cell${rate >= 30 ? " ga4-cohort-cell-dark" : ""}${selectedColumn === i ? " ga4-cohort-cell-on" : ""}${markColumn === i ? " ga4-cohort-cell-mark" : ""}`}
                        style={{ background: shadeFor(rate) }}
                      >
                        <span className="ga4-cohort-rate">{rate.toFixed(1)}%</span>
                        <span className="ga4-cohort-count">{numberFormat.format(value)}</span>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        <p className="ga4-cohort-note">
          첫 칸을 100으로 둔 잔존율입니다. 아래 숫자는 그 기간에 다시 온 사용자 수입니다.
        </p>
      </section>
    </div>
  );
}

/** 잔존율이 높을수록 진한 파랑. GA4 코호트 표와 같은 방식이다 */
function shadeFor(rate: number): string {
  if (rate >= 99) return "#1a73e8";
  if (rate >= 30) return "#4285f4";
  if (rate >= 18) return "#8ab4f8";
  if (rate >= 10) return "#c6dafc";
  if (rate >= 5) return "#e8f0fe";
  return "#f8fbff";
}
