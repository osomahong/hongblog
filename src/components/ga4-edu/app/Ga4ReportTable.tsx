"use client";

/**
 * GA4 표준 보고서 표.
 * 체크박스 열, 측정기준 드롭다운, 합계 행, 값에 병기되는 비율, 점선 밑줄이 그어진 측정항목
 * 머리글, 아래쪽 쪽 이동까지 실제 Google Analytics 화면을 따른다.
 */

import { ChevronDown, ChevronLeft, ChevronRight, Plus, Search, ArrowDown } from "lucide-react";
import { useRing } from "./tour";

export interface MetricColumn {
  key: string;
  label: string;
  /** 표에 찍을 때 쓰는 형식기. 없으면 천 단위 쉼표 */
  format?: (value: number) => string;
  /** 합계 행에 넣을 값. 없으면 열 합계를 쓴다 */
  total?: number;
  /** 합계 행 아래에 붙는 설명. 비율 지표는 "평균과 동일"이 붙는다 */
  totalNote?: string;
  /** 값 옆에 전체 대비 비율을 함께 적을지 */
  share?: boolean;
}

export interface TableRow {
  name: string;
  values: Record<string, number>;
}

export interface DimensionOption {
  key: string;
  label: string;
}

interface Ga4ReportTableProps {
  dimension: string;
  dimensionOptions: DimensionOption[];
  dimensionMenuOpen: boolean;
  onToggleDimensionMenu: () => void;
  onPickDimension: (key: string) => void;

  columns: MetricColumn[];
  rows: TableRow[];
  sortKey: string;
  onSort: (key: string) => void;

  selectedRow: string | null;
  onSelectRow?: (name: string) => void;
  /** 정답 행에 표시를 남길 때 쓴다 */
  markRow?: string | null;
}

const comma = (v: number) => v.toLocaleString("ko-KR");

export function Ga4ReportTable({
  dimension,
  dimensionOptions,
  dimensionMenuOpen,
  onToggleDimensionMenu,
  onPickDimension,
  columns,
  rows,
  sortKey,
  onSort,
  selectedRow,
  onSelectRow,
  markRow,
}: Ga4ReportTableProps) {
  const dimensionLabel =
    dimensionOptions.find((d) => d.key === dimension)?.label ?? dimensionOptions[0].label;
  const dimRing = useRing("dimension-chip");

  const sums = new Map<string, number>();
  for (const col of columns) {
    sums.set(col.key, rows.reduce((sum, r) => sum + (r.values[col.key] ?? 0), 0));
  }

  return (
    <section className="ga4-tablecard">
      <div className="ga4-tablecard-head">
        <button type="button" className="ga4-rowchart-btn" disabled>
          선택 행 도표 만들기
        </button>
        <span className="ga4-table-search">
          <Search className="w-4 h-4" strokeWidth={1.8} aria-hidden />
          <span>검색...</span>
        </span>
        <div className="ga4-table-pager">
          <span>페이지당 행 수:</span>
          <button type="button" className="ga4-foot-chip">
            10 <ChevronDown className="w-3 h-3" strokeWidth={2} aria-hidden />
          </button>
          <span>이동:</span>
          <span className="ga4-foot-goto">1</span>
          <span className="ga4-foot-range">
            1~{rows.length} / {rows.length}
          </span>
          <span className="ga4-foot-arrows" aria-hidden>
            <ChevronLeft className="w-4 h-4" strokeWidth={1.8} />
            <ChevronRight className="w-4 h-4" strokeWidth={1.8} />
          </span>
        </div>
      </div>

      <div className="ga4-table-scroll">
        <table className="ga4-gtable">
          <thead>
            <tr>
              <th className="ga4-gth-check">
                <span className="ga4-check ga4-check-all" aria-hidden />
              </th>
              <th className="ga4-gth-dim">
                <span className="ga4-dim-wrap">
                  <button
                    type="button"
                    data-tour="dimension-chip"
                    onClick={onToggleDimensionMenu}
                    className={`ga4-dim-chip${dimRing}`}
                    aria-expanded={dimensionMenuOpen}
                  >
                    {dimensionLabel}
                    <ChevronDown className="w-3.5 h-3.5" strokeWidth={2} aria-hidden />
                  </button>
                  {dimensionMenuOpen && (
                    <span className="ga4-menu" role="listbox" aria-label="측정기준 선택">
                      {dimensionOptions.map((option) => (
                        <DimensionOptionItem
                          key={option.key}
                          option={option}
                          current={dimension}
                          onPick={onPickDimension}
                        />
                      ))}
                    </span>
                  )}
                  <span className="ga4-dim-plus" aria-hidden>
                    <Plus className="w-3.5 h-3.5" strokeWidth={2} />
                  </span>
                </span>
              </th>
              {columns.map((col) => (
                <MetricHead
                  key={col.key}
                  col={col}
                  sorted={sortKey === col.key}
                  onSort={() => onSort(col.key)}
                />
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="ga4-gtotal">
              <td className="ga4-gtd-check">
                <span className="ga4-check ga4-check-on" aria-hidden />
              </td>
              <td className="ga4-gtd-dim">합계</td>
              {columns.map((col) => (
                <td key={col.key} className="ga4-gtd">
                  {(col.format ?? comma)(col.total ?? sums.get(col.key) ?? 0)}
                  <span className="ga4-gtotal-sub">{col.totalNote ?? "총계 대비 100%"}</span>
                </td>
              ))}
            </tr>

            {rows.map((row, i) => {
              const clickable = Boolean(onSelectRow);
              const cls = [
                clickable ? "ga4-gtr-clickable" : "",
                selectedRow === row.name ? "ga4-gtr-selected" : "",
                markRow === row.name ? "ga4-gtr-marked" : "",
              ]
                .filter(Boolean)
                .join(" ");
              return (
                <tr
                  key={row.name}
                  className={cls}
                  onClick={clickable ? () => onSelectRow?.(row.name) : undefined}
                >
                  <td className="ga4-gtd-check">
                    <span className="ga4-check ga4-check-on" aria-hidden />
                  </td>
                  <td className="ga4-gtd-dim">
                    <span className="ga4-grow-index">{i + 1}</span>
                    {row.name}
                  </td>
                  {columns.map((col) => {
                    const value = row.values[col.key] ?? 0;
                    const sum = sums.get(col.key) ?? 0;
                    return (
                      <td key={col.key} className="ga4-gtd">
                        {(col.format ?? comma)(value)}
                        {col.share && sum > 0 && (
                          <span className="ga4-gshare">
                            {" "}
                            ({((value / sum) * 100).toFixed(2)}%)
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/** 측정기준 목록의 한 줄. 튜토리얼이 고를 항목을 가리킬 수 있게 이름을 붙여 둔다 */
function DimensionOptionItem({
  option,
  current,
  onPick,
}: {
  option: DimensionOption;
  current: string;
  onPick: (key: string) => void;
}) {
  const ring = useRing(`dimension:${option.key}`);
  return (
    <button
      type="button"
      role="option"
      aria-selected={option.key === current}
      data-tour={`dimension:${option.key}`}
      onClick={() => onPick(option.key)}
      className={`ga4-menu-item${option.key === current ? " ga4-menu-item-on" : ""}${ring}`}
    >
      {option.label}
    </button>
  );
}

function MetricHead({
  col,
  sorted,
  onSort,
}: {
  col: MetricColumn;
  sorted: boolean;
  onSort: () => void;
}) {
  const ring = useRing(`metric:${col.key}`);
  return (
    <th className={`ga4-gth${ring}`} data-tour={`metric:${col.key}`}>
      <button type="button" onClick={onSort} className="ga4-gth-btn">
        {sorted && <ArrowDown className="w-3.5 h-3.5 ga4-gth-arrow" strokeWidth={2.2} aria-hidden />}
        <span className="ga4-gth-label">{col.label}</span>
      </button>
    </th>
  );
}
