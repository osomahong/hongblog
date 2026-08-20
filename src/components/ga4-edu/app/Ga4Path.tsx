"use client";

/**
 * 탐색 경로 탐색 화면.
 *
 * 왼쪽부터 단계가 하나씩 오른쪽으로 뻗는다. 한 단계의 노드를 누르면 그 노드를 거친 사람들이
 * 다음에 무엇을 했는지가 다음 열에 채워진다.
 *
 * 막대 길이는 그 단계에서 가장 큰 노드를 100으로 둔 비율이다. 열마다 기준이 달라지므로
 * 열을 건너뛰어 길이를 견주지 않도록 사용자 수를 함께 적는다.
 */

import { ChevronRight } from "lucide-react";
import { useRing } from "./tour";

export interface PathNode {
  /** 노드 이름. 페이지 경로나 이벤트 이름이 들어간다 */
  name: string;
  users: number;
  /** 더 펼칠 다음 단계가 있는지 */
  expandable?: boolean;
}

export interface PathColumn {
  /** 열 머리글. 시작점, +1단계처럼 적는다 */
  label: string;
  /** 이 열을 만든 부모 노드 이름. 시작점 열은 없다 */
  parent?: string;
  nodes: PathNode[];
}

interface Ga4PathProps {
  name: string;
  dateLabel: string;
  /** 노드에 쓰는 측정기준 이름 */
  nodeLabel: string;
  columns: PathColumn[];
  /** 학습자가 고른 노드 이름 */
  selected: string | null;
  onSelectNode: (column: number, node: string) => void;
  /** 마무리에서 표시를 남길 노드 */
  markNode?: string | null;
}

const numberFormat = new Intl.NumberFormat("ko-KR");

export function Ga4Path({
  name,
  dateLabel,
  nodeLabel,
  columns,
  selected,
  onSelectNode,
  markNode = null,
}: Ga4PathProps) {
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
          <p className="ga4-ff-field-value">경로 탐색 분석</p>
        </div>
        <div className="ga4-ff-field">
          <p className="ga4-ff-field-label">시작점</p>
          <p className="ga4-ff-field-value">세션 시작</p>
        </div>
        <div className="ga4-ff-field">
          <p className="ga4-ff-field-label">노드</p>
          <p className="ga4-ff-field-value">{nodeLabel}</p>
        </div>
        <div className="ga4-ff-field">
          <p className="ga4-ff-field-label">값</p>
          <p className="ga4-ff-field-value">활성 사용자</p>
        </div>
      </section>

      {/* ----- 캔버스 ----- */}
      <section className="ga4-path-canvas" aria-label="경로 수형도">
        {columns.map((col, ci) => {
          const top = Math.max(...col.nodes.map((n) => n.users), 1);
          return (
            <div key={col.label} className="ga4-path-col">
              <p className="ga4-path-col-head">{col.label}</p>
              {col.parent && (
                <p className="ga4-path-col-parent" title={col.parent}>
                  {col.parent}에서 이어짐
                </p>
              )}
              <ul className="ga4-path-nodes">
                {col.nodes.map((node) => (
                  <PathNodeItem
                    key={node.name}
                    node={node}
                    top={top}
                    column={ci}
                    selected={selected === node.name}
                    marked={markNode === node.name}
                    onSelect={onSelectNode}
                  />
                ))}
              </ul>
            </div>
          );
        })}
      </section>
    </div>
  );
}

function PathNodeItem({
  node,
  top,
  column,
  selected,
  marked,
  onSelect,
}: {
  node: PathNode;
  top: number;
  column: number;
  selected: boolean;
  marked: boolean;
  onSelect: (column: number, node: string) => void;
}) {
  const ring = useRing(`path:${node.name}`);
  const width = Math.max((node.users / top) * 100, 4);

  return (
    <li>
      <button
        type="button"
        data-tour={`path:${node.name}`}
        onClick={() => onSelect(column, node.name)}
        className={`ga4-path-node${selected ? " ga4-path-node-on" : ""}${marked ? " ga4-path-node-mark" : ""}${ring}`}
      >
        <span className="ga4-path-bar" style={{ width: `${width}%` }} aria-hidden />
        <span className="ga4-path-node-name">{node.name}</span>
        <span className="ga4-path-node-users">{numberFormat.format(node.users)}</span>
        {node.expandable && (
          <ChevronRight className="w-3.5 h-3.5 ga4-path-node-more" strokeWidth={2} aria-hidden />
        )}
      </button>
    </li>
  );
}
