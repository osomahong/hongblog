"use client";

/**
 * 탐색 자유 형식 작업 화면.
 *
 * 왼쪽부터 변수, 탭 설정, 캔버스 세 칸이다. 변수의 측정기준과 측정항목을 탭 설정의
 * 행, 열, 값으로 옮기면 캔버스의 표가 그 자리에서 다시 그려진다.
 *
 * GA4는 끌어다 놓기로만 옮긴다. 여기서는 끌어다 놓기를 그대로 두고, 변수를 누른 뒤
 * 놓을 칸을 누르는 길도 함께 받는다. 화면에 없던 버튼을 더하지 않으면서 조작 실패를 줄인다.
 */

import type { ReactNode } from "react";
import { ChevronDown, Plus, X, Table2, ChartPie, ChartLine, ChartScatter, ChartNoAxesColumn, Map } from "lucide-react";
import { useRing } from "./tour";
import type { Ga4ExploreState, HeldVariable } from "./types";

export interface VariableItem {
  key: string;
  label: string;
}

export type SlotName = "rows" | "columns" | "values";

const SLOT_LABEL: Record<SlotName, string> = {
  rows: "행",
  columns: "열",
  values: "값",
};

const SLOT_PLACEHOLDER: Record<SlotName, string> = {
  rows: "측정기준 놓기",
  columns: "측정기준 놓기",
  values: "측정항목 놓기",
};

interface Ga4FreeFormProps {
  /** 데이터 탐색 이름. 왼쪽 맨 위에 놓인다 */
  name: string;
  dateLabel: string;
  dimensions: VariableItem[];
  metrics: VariableItem[];
  state: Ga4ExploreState;
  /** 변수를 집어 들거나 놓을 때 */
  onHold: (held: HeldVariable | null) => void;
  /** 집어 든 변수를 그 칸에 놓을 때 */
  onDropTo: (slot: SlotName) => void;
  /** 칸에 놓인 변수를 뺄 때 */
  onRemove: (slot: SlotName, key: string) => void;
  /** 캔버스에 그릴 표 */
  children: ReactNode;
}

export function Ga4FreeForm({
  name,
  dateLabel,
  dimensions,
  metrics,
  state,
  onHold,
  onDropTo,
  onRemove,
  children,
}: Ga4FreeFormProps) {
  const labelOf = (key: string) =>
    [...dimensions, ...metrics].find((v) => v.key === key)?.label ?? key;

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

        <VariableGroup title="세그먼트">
          <p className="ga4-ff-empty">모든 사용자</p>
        </VariableGroup>

        <VariableGroup title="측정기준">
          {dimensions.map((d) => (
            <VariableChip
              key={d.key}
              item={d}
              kind="dimension"
              held={state.held}
              onHold={onHold}
            />
          ))}
        </VariableGroup>

        <VariableGroup title="측정항목">
          {metrics.map((m) => (
            <VariableChip
              key={m.key}
              item={m}
              kind="metric"
              held={state.held}
              onHold={onHold}
            />
          ))}
        </VariableGroup>
      </section>

      {/* ----- 탭 설정 ----- */}
      <section className="ga4-ff-panel" aria-label="탭 설정">
        <header className="ga4-ff-panel-head">
          <span className="ga4-ff-panel-title">탭 설정</span>
        </header>

        <div className="ga4-ff-field">
          <p className="ga4-ff-field-label">기법</p>
          <p className="ga4-ff-field-select">
            자유 형식 <ChevronDown className="w-3.5 h-3.5" strokeWidth={2} aria-hidden />
          </p>
        </div>

        <div className="ga4-ff-field">
          <p className="ga4-ff-field-label">시각화</p>
          <span className="ga4-ff-viz" aria-hidden>
            <span className="ga4-ff-viz-on">
              <Table2 className="w-4 h-4" strokeWidth={1.8} />
            </span>
            <span>
              <ChartPie className="w-4 h-4" strokeWidth={1.8} />
            </span>
            <span>
              <ChartLine className="w-4 h-4" strokeWidth={1.8} />
            </span>
            <span>
              <ChartScatter className="w-4 h-4" strokeWidth={1.8} />
            </span>
            <span>
              <ChartNoAxesColumn className="w-4 h-4" strokeWidth={1.8} />
            </span>
            <span>
              <Map className="w-4 h-4" strokeWidth={1.8} />
            </span>
          </span>
        </div>

        <Slot
          slot="rows"
          keys={state.rows}
          held={state.held}
          labelOf={labelOf}
          onDropTo={onDropTo}
          onRemove={onRemove}
        />
        <div className="ga4-ff-field ga4-ff-field-pair">
          <span>
            <p className="ga4-ff-field-label">시작 행</p>
            <p className="ga4-ff-field-value">1</p>
          </span>
          <span>
            <p className="ga4-ff-field-label">표시 행 수</p>
            <p className="ga4-ff-field-select">
              10 <ChevronDown className="w-3.5 h-3.5" strokeWidth={2} aria-hidden />
            </p>
          </span>
        </div>

        <Slot
          slot="columns"
          keys={state.columns}
          held={state.held}
          labelOf={labelOf}
          onDropTo={onDropTo}
          onRemove={onRemove}
        />
        <Slot
          slot="values"
          keys={state.values}
          held={state.held}
          labelOf={labelOf}
          onDropTo={onDropTo}
          onRemove={onRemove}
        />

        <VariableGroup title="필터">
          <p className="ga4-ff-empty">조건 놓기</p>
        </VariableGroup>
      </section>

      {/* ----- 캔버스 ----- */}
      <section className="ga4-ff-canvas" aria-label="자유 형식 표">
        {children}
      </section>
    </div>
  );
}

/* ===================== 조각 ===================== */

function VariableGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="ga4-ff-group">
      <p className="ga4-ff-group-head">
        {title}
        <Plus className="w-3.5 h-3.5" strokeWidth={2} aria-hidden />
      </p>
      <div className="ga4-ff-group-body">{children}</div>
    </div>
  );
}

function VariableChip({
  item,
  kind,
  held,
  onHold,
}: {
  item: VariableItem;
  kind: "dimension" | "metric";
  held: HeldVariable | null;
  onHold: (held: HeldVariable | null) => void;
}) {
  const ring = useRing(`var:${item.key}`);
  const isHeld = held?.key === item.key;

  return (
    <button
      type="button"
      draggable
      data-tour={`var:${item.key}`}
      onDragStart={() => onHold({ kind, key: item.key })}
      onDragEnd={() => onHold(null)}
      onClick={() => onHold(isHeld ? null : { kind, key: item.key })}
      className={`ga4-ff-var ga4-ff-var-${kind}${isHeld ? " ga4-ff-var-held" : ""}${ring}`}
      aria-pressed={isHeld}
    >
      {item.label}
    </button>
  );
}

function Slot({
  slot,
  keys,
  held,
  labelOf,
  onDropTo,
  onRemove,
}: {
  slot: SlotName;
  keys: string[];
  held: HeldVariable | null;
  labelOf: (key: string) => string;
  onDropTo: (slot: SlotName) => void;
  onRemove: (slot: SlotName, key: string) => void;
}) {
  const ring = useRing(`slot:${slot}`);
  // 값 칸은 측정항목만, 행과 열은 측정기준만 받는다. GA4와 같은 규칙이다
  const wants = slot === "values" ? "metric" : "dimension";
  const open = held?.kind === wants;

  return (
    <div className="ga4-ff-field">
      <p className="ga4-ff-field-label">{SLOT_LABEL[slot]}</p>
      <div
        data-tour={`slot:${slot}`}
        onDragOver={(e) => {
          if (open) e.preventDefault();
        }}
        onDrop={() => onDropTo(slot)}
        onClick={() => onDropTo(slot)}
        className={`ga4-ff-slot${open ? " ga4-ff-slot-open" : ""}${ring}`}
      >
        {keys.map((key) => (
          <span key={key} className="ga4-ff-slot-chip">
            {labelOf(key)}
            <button
              type="button"
              aria-label={`${labelOf(key)} 빼기`}
              onClick={(e) => {
                e.stopPropagation();
                onRemove(slot, key);
              }}
            >
              <X className="w-3 h-3" strokeWidth={2.4} aria-hidden />
            </button>
          </span>
        ))}
        <span className="ga4-ff-slot-hint">{SLOT_PLACEHOLDER[slot]}</span>
      </div>
    </div>
  );
}
