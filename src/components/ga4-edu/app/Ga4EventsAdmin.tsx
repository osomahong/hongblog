"use client";

/**
 * 관리 > 이벤트 화면.
 *
 * 위쪽에 이벤트 수정과 이벤트 만들기 단추가 있고, 아래 기존 이벤트 표가 놓인다.
 * 표 오른쪽 끝의 스위치를 켜면 그 이벤트가 주요 이벤트로 표시된다.
 * 실제 화면과 같이, 방금 만든 맞춤 이벤트는 데이터가 쌓이기 전까지 이 표에 나오지 않는다.
 */

import { Plus, Pencil, X, ChevronDown } from "lucide-react";
import { useRing } from "./tour";

export interface AdminEventRow {
  name: string;
  count: number;
  countDelta: string;
  users: number;
  usersDelta: string;
}

interface Ga4EventsAdminProps {
  rows: AdminEventRow[];
  /** 주요 이벤트로 표시된 이벤트 이름 */
  keyEvents: string[];
  onToggleKeyEvent: (name: string) => void;
  onOpenCreate: () => void;
  /** 만들어 둔 맞춤 이벤트 이름. 위쪽 목록에 쌓인다 */
  customEvents: string[];
}

const comma = (v: number) => v.toLocaleString("ko-KR");

export function Ga4EventsAdmin({
  rows,
  keyEvents,
  onToggleKeyEvent,
  onOpenCreate,
  customEvents,
}: Ga4EventsAdminProps) {
  const createRing = useRing("create-event");

  return (
    <section className="ga4-admin-page">
      <header className="ga4-admin-head">
        <h2 className="ga4-admin-title">이벤트</h2>
        <div className="ga4-admin-actions">
          <span className="ga4-admin-btn">
            <Pencil className="w-3.5 h-3.5" strokeWidth={2} aria-hidden /> 이벤트 수정
          </span>
          <button
            type="button"
            data-tour="create-event"
            onClick={onOpenCreate}
            className={`ga4-admin-btn ga4-admin-btn-main${createRing}`}
          >
            <Plus className="w-3.5 h-3.5" strokeWidth={2.4} aria-hidden /> 이벤트 만들기
          </button>
        </div>
      </header>

      {customEvents.length > 0 && (
        <div className="ga4-admin-custom">
          <p className="ga4-admin-custom-head">맞춤 이벤트</p>
          {customEvents.map((name) => (
            <p key={name} className="ga4-admin-custom-row">
              <span className="ga4-admin-custom-name">{name}</span>
              <span className="ga4-admin-custom-note">
                만든 뒤에 들어온 데이터부터 쌓입니다. 아래 표에는 값이 모이면 나타납니다.
              </span>
            </p>
          ))}
        </div>
      )}

      <p className="ga4-admin-subhead">기존 이벤트</p>

      <div className="ga4-table-scroll">
        <table className="ga4-gtable ga4-admin-table">
          <thead>
            <tr>
              <th className="ga4-gth-dim">이벤트 이름</th>
              <th className="ga4-gth-admin">개수</th>
              <th className="ga4-gth-admin">변화율</th>
              <th className="ga4-gth-admin">사용자</th>
              <th className="ga4-gth-admin">변화율</th>
              <th className="ga4-gth-admin ga4-gth-switch">주요 이벤트로 표시</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const on = keyEvents.includes(row.name);
              return (
                <tr key={row.name}>
                  <td className="ga4-gtd-dim">{row.name}</td>
                  <td className="ga4-gtd">{comma(row.count)}</td>
                  <td className={`ga4-gtd${row.countDelta.startsWith("-") ? " ga4-gtd-down" : ""}`}>
                    {row.countDelta}
                  </td>
                  <td className="ga4-gtd">{comma(row.users)}</td>
                  <td className={`ga4-gtd${row.usersDelta.startsWith("-") ? " ga4-gtd-down" : ""}`}>
                    {row.usersDelta}
                  </td>
                  <td className="ga4-gtd ga4-gtd-switch">
                    <KeyEventSwitch name={row.name} on={on} onToggle={onToggleKeyEvent} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function KeyEventSwitch({
  name,
  on,
  onToggle,
}: {
  name: string;
  on: boolean;
  onToggle: (name: string) => void;
}) {
  const ring = useRing(`keyevent:${name}`);
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={`${name}을 주요 이벤트로 표시`}
      data-tour={`keyevent:${name}`}
      onClick={() => onToggle(name)}
      className={`ga4-switch${on ? " ga4-switch-on" : ""}${ring}`}
    >
      <span className="ga4-switch-knob" aria-hidden />
    </button>
  );
}

/* ===================== 주요 이벤트 화면 ===================== */

/**
 * 관리 > 주요 이벤트.
 * 표시해 둔 이벤트를 모아 보여 주고, 여기에서도 스위치로 표시를 풀 수 있다.
 *
 * 목록에 남길 줄은 바깥에서 정한다. 표시를 푼 줄이 곧바로 사라지면 되돌릴 길이 없어지므로,
 * 한 번이라도 표시했던 줄은 화면을 옮기기 전까지 자리에 남긴다.
 */
export function Ga4KeyEventsAdmin({
  rows,
  keyEvents,
  visible,
  onToggleKeyEvent,
}: {
  rows: AdminEventRow[];
  keyEvents: string[];
  visible: string[];
  onToggleKeyEvent: (name: string) => void;
}) {
  const marked = rows.filter((r) => visible.includes(r.name));

  return (
    <section className="ga4-admin-page">
      <header className="ga4-admin-head">
        <h2 className="ga4-admin-title">주요 이벤트</h2>
      </header>

      <p className="ga4-admin-hint">
        주요 이벤트로 표시한 이벤트만 모입니다. 속성 하나에 서른 개까지 둘 수 있고, 표시한
        날부터 전환으로 셉니다.
      </p>

      {marked.length === 0 ? (
        <p className="ga4-admin-empty">아직 표시한 주요 이벤트가 없습니다.</p>
      ) : (
        <div className="ga4-table-scroll">
          <table className="ga4-gtable ga4-admin-table">
            <thead>
              <tr>
                <th className="ga4-gth-dim">주요 이벤트 이름</th>
                <th className="ga4-gth-admin">개수</th>
                <th className="ga4-gth-admin">사용자</th>
                <th className="ga4-gth-admin ga4-gth-switch">주요 이벤트로 표시</th>
              </tr>
            </thead>
            <tbody>
              {marked.map((row) => (
                <tr key={row.name}>
                  <td className="ga4-gtd-dim">{row.name}</td>
                  <td className="ga4-gtd">{comma(row.count)}</td>
                  <td className="ga4-gtd">{comma(row.users)}</td>
                  <td className="ga4-gtd ga4-gtd-switch">
                    <KeyEventSwitch
                      name={row.name}
                      on={keyEvents.includes(row.name)}
                      onToggle={onToggleKeyEvent}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

/* ===================== 이벤트 만들기 ===================== */

export interface PickOption {
  key: string;
  label: string;
}

interface Ga4CreateEventPanelProps {
  open: boolean;
  /** 고르는 중인 값 */
  name: string | null;
  value: string | null;
  /** 펼쳐진 목록 */
  openList: "name" | "value" | null;
  nameOptions: PickOption[];
  valueOptions: PickOption[];
  onToggleList: (list: "name" | "value" | null) => void;
  onPickName: (key: string) => void;
  onPickValue: (key: string) => void;
  onCreate: () => void;
  onClose: () => void;
}

export function Ga4CreateEventPanel({
  open,
  name,
  value,
  openList,
  nameOptions,
  valueOptions,
  onToggleList,
  onPickName,
  onPickValue,
  onCreate,
  onClose,
}: Ga4CreateEventPanelProps) {
  const nameRing = useRing("create-name");
  const valueRing = useRing("create-value");
  const saveRing = useRing("create-save");

  if (!open) return null;

  return (
    <aside className="ga4-cz ga4-createpanel" aria-label="이벤트 만들기">
      <header className="ga4-cz-head">
        <h3 className="ga4-cz-title">이벤트 만들기</h3>
        <button type="button" onClick={onClose} className="ga4-cz-close" aria-label="닫기">
          <X className="w-4 h-4" strokeWidth={2} aria-hidden />
        </button>
      </header>

      <div className="ga4-cz-body">
        <p className="ga4-panel-label">맞춤 이벤트 이름</p>
        <div className="ga4-panel-field">
          <button
            type="button"
            data-tour="create-name"
            onClick={() => onToggleList(openList === "name" ? null : "name")}
            className={`ga4-panel-select${nameRing}`}
            aria-expanded={openList === "name"}
          >
            {nameOptions.find((o) => o.key === name)?.label ?? "이름 고르기"}
            <ChevronDown className="w-3.5 h-3.5" strokeWidth={2} aria-hidden />
          </button>
          {openList === "name" && (
            <div className="ga4-menu" role="listbox" aria-label="맞춤 이벤트 이름 선택">
              {nameOptions.map((o) => (
                <PickItem key={o.key} prefix="cname" option={o} current={name} onPick={onPickName} />
              ))}
            </div>
          )}
        </div>

        <p className="ga4-panel-label">일치 조건</p>
        <div className="ga4-panel-cond">
          <span className="ga4-panel-fixed">event_name</span>
          <span className="ga4-panel-fixed">같음</span>
        </div>
        <div className="ga4-panel-field">
          <button
            type="button"
            data-tour="create-value"
            onClick={() => onToggleList(openList === "value" ? null : "value")}
            className={`ga4-panel-select${valueRing}`}
            aria-expanded={openList === "value"}
          >
            {valueOptions.find((o) => o.key === value)?.label ?? "값 고르기"}
            <ChevronDown className="w-3.5 h-3.5" strokeWidth={2} aria-hidden />
          </button>
          {openList === "value" && (
            <div className="ga4-menu" role="listbox" aria-label="일치 조건 값 선택">
              {valueOptions.map((o) => (
                <PickItem key={o.key} prefix="cval" option={o} current={value} onPick={onPickValue} />
              ))}
            </div>
          )}
        </div>

        <p className="ga4-panel-note">
          소스 이벤트에서 매개변수 복사가 켜져 있습니다. 원래 이벤트의 매개변수가 그대로 따라옵니다.
        </p>
      </div>

      <footer className="ga4-cz-foot">
        <button type="button" onClick={onClose} className="ga4-cz-cancel">
          취소
        </button>
        <button
          type="button"
          data-tour="create-save"
          onClick={onCreate}
          className={`ga4-cz-apply${saveRing}`}
        >
          만들기
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
