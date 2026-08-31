"use client";

/**
 * 탐색 자유 형식 캔버스에 그려지는 교차표.
 *
 * 행에 놓은 측정기준이 왼쪽 세로줄이 되고, 열에 놓은 측정기준이 위쪽 가로줄이 된다.
 * 값에 놓은 측정항목은 열 하나마다 그만큼 칸을 나눠 갖는다.
 * 셀 뒤에는 값의 크기만큼 옅은 파란 막대가 깔린다. GA4 표와 같은 표시다.
 */

import { useRing } from "./tour";

export interface PivotMetric {
  key: string;
  label: string;
  /** 표에 찍을 때 쓰는 형식기. 없으면 천 단위 쉼표 */
  format?: (value: number) => string;
}

export type PivotValues = Record<string, number>;

interface Ga4PivotTableProps {
  /** 행에 놓인 측정기준 이름. 비어 있으면 표를 그리지 않는다 */
  rowLabel: string | null;
  rowKeys: string[];
  /** 열에 놓인 측정기준 이름. null이면 총계 한 묶음만 그린다 */
  columnLabel: string | null;
  columnKeys: string[];
  metrics: PivotMetric[];
  /** col이 null이면 그 줄의 총계 */
  cell: (row: string, col: string | null) => PivotValues;
  /** 맨 아래 총계 줄. col이 null이면 표 전체 총계 */
  total: (col: string | null) => PivotValues;
  selectedRow: string | null;
  onSelectRow: (row: string) => void;
  /** 마무리에서 정답 행에 표시를 남길 때 쓴다 */
  markRow?: string | null;
}

const comma = (v: number) => v.toLocaleString("ko-KR");

export function Ga4PivotTable({
  rowLabel,
  rowKeys,
  columnLabel,
  columnKeys,
  metrics,
  cell,
  total,
  selectedRow,
  onSelectRow,
  markRow,
}: Ga4PivotTableProps) {
  const tableRing = useRing("pivot-table");

  if (!rowLabel || metrics.length === 0) {
    return (
      <p className="ga4-pivot-blank">
        왼쪽 변수의 측정기준을 탭 설정의 행으로 옮기면 표가 그려집니다.
      </p>
    );
  }

  // 열 묶음: 열 측정기준이 있으면 값마다 한 묶음, 없으면 총계 하나만 둔다
  const groups: { key: string | null; label: string }[] = [
    ...columnKeys.map((k) => ({ key: k as string | null, label: k })),
    { key: null, label: "총계" },
  ];

  // 막대 기준값. 측정항목마다 표 안에서 가장 큰 값을 100으로 잡는다
  const barMax = new Map<string, number>();
  for (const m of metrics) {
    let max = 0;
    for (const r of rowKeys) {
      for (const g of groups) {
        max = Math.max(max, cell(r, g.key)[m.key] ?? 0);
      }
    }
    barMax.set(m.key, max || 1);
  }

  return (
    <div className={`ga4-pivot-wrap${tableRing}`} data-tour="pivot-table">
      <table className="ga4-pivot">
        <thead>
          <tr>
            <th scope="col" rowSpan={2} className="ga4-pivot-dim-head">
              {rowLabel}
            </th>
            {groups.map((g) => (
              <th key={g.label} scope="colgroup" colSpan={metrics.length} className="ga4-pivot-group">
                {g.label}
              </th>
            ))}
          </tr>
          <tr>
            {groups.map((g) =>
              metrics.map((m) => (
                <th key={`${g.label}-${m.key}`} scope="col" className="ga4-pivot-metric-head">
                  {m.label}
                </th>
              ))
            )}
          </tr>
        </thead>

        <tbody>
          {rowKeys.map((r) => {
            const on = selectedRow === r;
            const marked = markRow === r;
            return (
              <tr
                key={r}
                className={`${on ? "ga4-pivot-row-on" : ""}${marked ? " ga4-pivot-row-mark" : ""}`}
              >
                <th scope="row" className="ga4-pivot-dim">
                  <button type="button" onClick={() => onSelectRow(r)}>
                    {r}
                  </button>
                </th>
                {groups.map((g) =>
                  metrics.map((m) => {
                    const v = cell(r, g.key)[m.key] ?? 0;
                    const pct = Math.round((v / (barMax.get(m.key) ?? 1)) * 100);
                    return (
                      <td key={`${r}-${g.label}-${m.key}`} className="ga4-pivot-cell">
                        <span className="ga4-pivot-bar" style={{ width: `${pct}%` }} aria-hidden />
                        <span className="ga4-pivot-val">
                          {(m.format ?? comma)(v)}
                        </span>
                      </td>
                    );
                  })
                )}
              </tr>
            );
          })}
        </tbody>

        <tfoot>
          <tr>
            <th scope="row" className="ga4-pivot-dim">
              총계
            </th>
            {groups.map((g) =>
              metrics.map((m) => (
                <td key={`total-${g.label}-${m.key}`} className="ga4-pivot-cell ga4-pivot-total">
                  {(m.format ?? comma)(total(g.key)[m.key] ?? 0)}
                </td>
              ))
            )}
          </tr>
        </tfoot>
      </table>

      <p className="ga4-pivot-note">
        {columnLabel
          ? `행 ${rowLabel}, 열 ${columnLabel} 기준입니다. 열마다 값이 따로 계산됩니다.`
          : `행 ${rowLabel} 기준입니다. 열을 더하면 같은 값을 더 나눠 볼 수 있습니다.`}
      </p>
    </div>
  );
}
