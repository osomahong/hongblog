"use client";

/**
 * 관리 > 맞춤 정의 화면.
 *
 * 위쪽에 맞춤 측정기준, 맞춤 측정항목 탭이 있고 오른쪽에 만들기 단추가 놓인다.
 * 표에는 등록된 측정기준이 범위, 매개변수와 함께 늘어서고, 줄 오른쪽 더보기에서 보관할 수 있다.
 * 실제 화면과 같이 등록 한도를 표 위에 적어 준다.
 */

import { ChevronDown, EllipsisVertical, X } from "lucide-react";
import { useRing } from "./tour";

export interface CustomDimRow {
  name: string;
  /** 이벤트 또는 사용자 */
  scope: string;
  /** 값을 받아 오는 매개변수 이름 */
  parameter: string;
  description: string;
}

export interface PickOption {
  key: string;
  label: string;
}

interface Ga4DefinitionsAdminProps {
  rows: CustomDimRow[];
  /** 등록 한도. "12/50"처럼 표 위에 적힌다 */
  quota: string;
  selected: string | null;
  onSelect: (name: string) => void;
  /** 더보기 메뉴가 열려 있는 줄 이름 */
  menuFor: string | null;
  onToggleMenu: (name: string | null) => void;
  onArchive: (name: string) => void;
  onOpenCreate: () => void;
}

export function Ga4DefinitionsAdmin({
  rows,
  quota,
  selected,
  onSelect,
  menuFor,
  onToggleMenu,
  onArchive,
  onOpenCreate,
}: Ga4DefinitionsAdminProps) {
  const createRing = useRing("create-dimension");

  return (
    <section className="ga4-admin-page">
      <header className="ga4-admin-head">
        <h2 className="ga4-admin-title">맞춤 정의</h2>
        <button
          type="button"
          data-tour="create-dimension"
          onClick={onOpenCreate}
          className={`ga4-admin-btn ga4-admin-btn-main${createRing}`}
        >
          맞춤 측정기준 만들기
        </button>
      </header>

      <div className="ga4-admin-tabs">
        <span className="ga4-admin-tab ga4-admin-tab-on">맞춤 측정기준</span>
        <span className="ga4-admin-tab">맞춤 측정항목</span>
        <span className="ga4-admin-tab">계산된 측정항목</span>
      </div>

      <p className="ga4-admin-hint">이벤트 범위 측정기준 {quota}개를 쓰고 있습니다.</p>

      <div className="ga4-table-scroll">
        <table className="ga4-gtable ga4-admin-table">
          <thead>
            <tr>
              <th className="ga4-gth-dim">측정기준 이름</th>
              <th className="ga4-gth-left">범위</th>
              <th className="ga4-gth-left">이벤트 매개변수</th>
              <th className="ga4-gth-left">설명</th>
              <th className="ga4-gth-admin" aria-label="더보기" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <DimRow
                key={row.name}
                row={row}
                on={selected === row.name}
                menuOpen={menuFor === row.name}
                onSelect={onSelect}
                onToggleMenu={onToggleMenu}
                onArchive={onArchive}
              />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function DimRow({
  row,
  on,
  menuOpen,
  onSelect,
  onToggleMenu,
  onArchive,
}: {
  row: CustomDimRow;
  on: boolean;
  menuOpen: boolean;
  onSelect: (name: string) => void;
  onToggleMenu: (name: string | null) => void;
  onArchive: (name: string) => void;
}) {
  const moreRing = useRing(`dim-more:${row.name}`);
  const archiveRing = useRing(`dim-archive:${row.name}`);

  return (
    <tr className={`ga4-gtr-clickable${on ? " ga4-gtr-selected" : ""}`} onClick={() => onSelect(row.name)}>
      <td className="ga4-gtd-dim">
        <button
          type="button"
          className="ga4-grow-pick"
          aria-pressed={on}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(row.name);
          }}
        >
          {row.name}
        </button>
      </td>
      <td className="ga4-gtd-left">{row.scope}</td>
      <td className="ga4-gtd-left">{row.parameter}</td>
      <td className="ga4-gtd-left ga4-gtd-desc">{row.description}</td>
      <td className="ga4-gtd ga4-gtd-more">
        <button
          type="button"
          data-tour={`dim-more:${row.name}`}
          aria-label={`${row.name} 더보기`}
          aria-expanded={menuOpen}
          onClick={(e) => {
            e.stopPropagation();
            onToggleMenu(menuOpen ? null : row.name);
          }}
          className={`ga4-dim-more${moreRing}`}
        >
          <EllipsisVertical className="w-4 h-4" strokeWidth={2} aria-hidden />
        </button>
        {menuOpen && (
          <div className="ga4-menu ga4-dim-menu" role="menu" aria-label={`${row.name} 메뉴`}>
            <button type="button" role="menuitem" className="ga4-menu-item" onClick={(e) => e.stopPropagation()}>
              수정
            </button>
            <button
              type="button"
              role="menuitem"
              data-tour={`dim-archive:${row.name}`}
              className={`ga4-menu-item${archiveRing}`}
              onClick={(e) => {
                e.stopPropagation();
                onArchive(row.name);
              }}
            >
              보관 처리
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}

/* ===================== 맞춤 측정기준 만들기 ===================== */

interface Ga4CreateDimensionPanelProps {
  open: boolean;
  name: string | null;
  parameter: string | null;
  openList: "name" | "value" | null;
  nameOptions: PickOption[];
  parameterOptions: PickOption[];
  onToggleList: (list: "name" | "value" | null) => void;
  onPickName: (key: string) => void;
  onPickParameter: (key: string) => void;
  onSave: () => void;
  onClose: () => void;
}

export function Ga4CreateDimensionPanel({
  open,
  name,
  parameter,
  openList,
  nameOptions,
  parameterOptions,
  onToggleList,
  onPickName,
  onPickParameter,
  onSave,
  onClose,
}: Ga4CreateDimensionPanelProps) {
  const nameRing = useRing("dim-name");
  const paramRing = useRing("dim-param");
  const saveRing = useRing("dim-save");

  if (!open) return null;

  return (
    <aside className="ga4-cz ga4-createpanel" aria-label="맞춤 측정기준 만들기">
      <header className="ga4-cz-head">
        <h3 className="ga4-cz-title">새 맞춤 측정기준</h3>
        <button type="button" onClick={onClose} className="ga4-cz-close" aria-label="닫기">
          <X className="w-4 h-4" strokeWidth={2} aria-hidden />
        </button>
      </header>

      <div className="ga4-cz-body">
        <p className="ga4-panel-label">측정기준 이름</p>
        <div className="ga4-panel-field">
          <button
            type="button"
            data-tour="dim-name"
            onClick={() => onToggleList(openList === "name" ? null : "name")}
            className={`ga4-panel-select${nameRing}`}
            aria-expanded={openList === "name"}
          >
            {nameOptions.find((o) => o.key === name)?.label ?? "이름 고르기"}
            <ChevronDown className="w-3.5 h-3.5" strokeWidth={2} aria-hidden />
          </button>
          {openList === "name" && (
            <div className="ga4-menu" role="listbox" aria-label="측정기준 이름 선택">
              {nameOptions.map((o) => (
                <PickItem key={o.key} prefix="dname" option={o} current={name} onPick={onPickName} />
              ))}
            </div>
          )}
        </div>

        <p className="ga4-panel-label">범위</p>
        <div className="ga4-panel-cond">
          <span className="ga4-panel-fixed">이벤트</span>
        </div>

        <p className="ga4-panel-label">이벤트 매개변수</p>
        <div className="ga4-panel-field">
          <button
            type="button"
            data-tour="dim-param"
            onClick={() => onToggleList(openList === "value" ? null : "value")}
            className={`ga4-panel-select${paramRing}`}
            aria-expanded={openList === "value"}
          >
            {parameterOptions.find((o) => o.key === parameter)?.label ?? "매개변수 고르기"}
            <ChevronDown className="w-3.5 h-3.5" strokeWidth={2} aria-hidden />
          </button>
          {openList === "value" && (
            <div className="ga4-menu" role="listbox" aria-label="이벤트 매개변수 선택">
              {parameterOptions.map((o) => (
                <PickItem key={o.key} prefix="dparam" option={o} current={parameter} onPick={onPickParameter} />
              ))}
            </div>
          )}
        </div>

        <p className="ga4-panel-note">
          측정기준 이름은 보고서에 그대로 표시됩니다. 매개변수 이름과 같게 두면 나중에 찾기 쉽습니다.
        </p>
      </div>

      <footer className="ga4-cz-foot">
        <button type="button" onClick={onClose} className="ga4-cz-cancel">
          취소
        </button>
        <button type="button" data-tour="dim-save" onClick={onSave} className={`ga4-cz-apply${saveRing}`}>
          저장
        </button>
      </footer>
    </aside>
  );
}

function PickItem({
  prefix,
  option,
  current,
  onPick,
}: {
  prefix: string;
  option: PickOption;
  current: string | null;
  onPick: (key: string) => void;
}) {
  const ring = useRing(`${prefix}:${option.key}`);
  return (
    <button
      type="button"
      role="option"
      aria-selected={current === option.key}
      data-tour={`${prefix}:${option.key}`}
      onClick={() => onPick(option.key)}
      className={`ga4-menu-item${current === option.key ? " ga4-menu-item-on" : ""}${ring}`}
    >
      {option.label}
    </button>
  );
}
