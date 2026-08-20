"use client";

/**
 * 관리 화면의 규칙 목록.
 *
 * 데이터 필터, 채널 그룹, 잠재고객처럼 목록과 만들기 단추로 이뤄진 설정 화면이 GA4에 여럿 있다.
 * 화면 구성이 같아서 한 컴포넌트로 그리고, 열 이름과 줄 내용만 편마다 다르게 넘긴다.
 *
 * 줄의 상태를 바꿀 수 있는 화면은 onPickState를 넘긴다. 데이터 필터가 여기 해당하는데,
 * 테스트에서 사용으로 바꾸는 순간부터 데이터가 실제로 빠지기 시작한다.
 */

import { Plus, MoreVertical, Check } from "lucide-react";
import { useRing } from "./tour";

export interface RuleRow {
  name: string;
  /** 표에 함께 적는 값. 열 순서와 같아야 한다 */
  cells: string[];
  /** 상태를 바꿀 수 있는 줄에만 채운다 */
  state?: string;
}

interface Ga4RuleAdminProps {
  title: string;
  description: string;
  /** 만들기 단추에 적는 말 */
  createLabel: string;
  /** 표 머리글. 첫 칸은 이름 열이라 따로 받지 않는다 */
  columns: string[];
  rows: RuleRow[];
  onOpenCreate: () => void;
  /** 상태를 바꾸는 화면에서만 넘긴다 */
  stateOptions?: string[];
  /** 더보기 메뉴가 열려 있는 줄 이름 */
  menuFor?: string | null;
  onToggleMenu?: (name: string) => void;
  onPickState?: (name: string, state: string) => void;
  /** 마무리에서 표시를 남길 줄 */
  markRow?: string | null;
}

export function Ga4RuleAdmin({
  title,
  description,
  createLabel,
  columns,
  rows,
  onOpenCreate,
  stateOptions,
  menuFor = null,
  onToggleMenu,
  onPickState,
  markRow = null,
}: Ga4RuleAdminProps) {
  const createRing = useRing("rule:create");

  return (
    <section className="ga4-admin-page">
      <header className="ga4-admin-head">
        <div>
          <h2 className="ga4-admin-title">{title}</h2>
          <p className="ga4-rule-desc">{description}</p>
        </div>
        <div className="ga4-admin-actions">
          <button
            type="button"
            data-tour="rule:create"
            onClick={onOpenCreate}
            className={`ga4-admin-btn ga4-admin-btn-main${createRing}`}
          >
            <Plus className="w-3.5 h-3.5" strokeWidth={2.4} aria-hidden /> {createLabel}
          </button>
        </div>
      </header>

      <div className="ga4-rule-table-wrap">
        <table className="ga4-gtable ga4-admin-table">
          <thead>
            <tr>
              <th scope="col">이름</th>
              {columns.map((c) => (
                <th key={c} scope="col">
                  {c}
                </th>
              ))}
              {stateOptions && <th scope="col" className="ga4-rule-more-head">{""}</th>}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.name} className={markRow === row.name ? "ga4-rule-row-mark" : ""}>
                <th scope="row">{row.name}</th>
                {row.cells.map((cell, i) => (
                  <td key={`${row.name}-${i}`}>{cell}</td>
                ))}
                {stateOptions && (
                  <td className="ga4-rule-more-cell">
                    <RuleMenu
                      name={row.name}
                      open={menuFor === row.name}
                      current={row.state ?? ""}
                      options={stateOptions}
                      onToggle={() => onToggleMenu?.(row.name)}
                      onPick={(state) => onPickState?.(row.name, state)}
                    />
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function RuleMenu({
  name,
  open,
  current,
  options,
  onToggle,
  onPick,
}: {
  name: string;
  open: boolean;
  current: string;
  options: string[];
  onToggle: () => void;
  onPick: (state: string) => void;
}) {
  const ring = useRing(`rule:menu:${name}`);
  return (
    <span className="ga4-rule-menu-wrap">
      <button
        type="button"
        aria-label={`${name} 더보기`}
        data-tour={`rule:menu:${name}`}
        onClick={onToggle}
        className={`ga4-rule-more${ring}`}
      >
        <MoreVertical className="w-4 h-4" strokeWidth={2} aria-hidden />
      </button>
      {open && (
        <ul className="ga4-menu ga4-rule-menu">
          {options.map((o) => (
            <li key={o}>
              <button type="button" data-tour={`rule:state:${o}`} onClick={() => onPick(o)}>
                {o}
                {current === o && <Check className="w-4 h-4" strokeWidth={2} aria-hidden />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </span>
  );
}
