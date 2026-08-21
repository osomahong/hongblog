"use client";

/**
 * GA4 보고서 개요 화면.
 *
 * 위쪽에 요약 카드가 나열되고 그 아래에 작은 표 카드가 놓인다.
 * 실제 화면처럼 카드를 누르면 그 항목의 상세 보고서로 넘어가지만,
 * 튜토리얼에서는 학습자가 고른 것을 표시하는 데 쓴다.
 */

import { ArrowRight } from "lucide-react";
import { useRing } from "./tour";

export interface SummaryCard {
  key: string;
  label: string;
  value: string;
  /** 지난 기간 대비 변화 */
  delta: string;
}

export interface MiniRow {
  name: string;
  value: string;
}

interface Ga4OverviewProps {
  cards: SummaryCard[];
  /** 이벤트 이름별 이벤트 수 카드 */
  eventRows: MiniRow[];
  /** 세션 기본 채널 그룹별 세션수 카드 */
  channelRows: MiniRow[];
  selected: string | null;
  onSelect: (key: string) => void;
  /** 마무리에서 정답에 표시를 남길 때 쓴다 */
  markKey?: string | null;
}

export function Ga4Overview({
  cards,
  eventRows,
  channelRows,
  selected,
  onSelect,
  markKey,
}: Ga4OverviewProps) {
  return (
    <>
      <div className="ga4-ov-cards">
        {cards.map((c) => (
          <SummaryTile
            key={c.key}
            card={c}
            on={selected === c.key}
            marked={markKey === c.key}
            onSelect={onSelect}
          />
        ))}
      </div>

      <div className="ga4-ov-row">
        <MiniTable
          title="이벤트 이름별 이벤트 수"
          head="이벤트 이름"
          metric="이벤트 수"
          link="이벤트 보고서 보기"
          rows={eventRows}
          selected={selected}
          onSelect={onSelect}
          markKey={markKey}
          tourPrefix="event"
        />
        <MiniTable
          title="세션 기본 채널 그룹별 세션수"
          head="세션 기본 채널 그룹"
          metric="세션수"
          link="트래픽 획득 보고서 보기"
          rows={channelRows}
        />
      </div>
    </>
  );
}

function SummaryTile({
  card,
  on,
  marked,
  onSelect,
}: {
  card: SummaryCard;
  on: boolean;
  marked: boolean;
  onSelect: (key: string) => void;
}) {
  const ring = useRing(`card:${card.key}`);
  const down = card.delta.startsWith("-");

  return (
    <button
      type="button"
      data-tour={`card:${card.key}`}
      onClick={() => onSelect(card.key)}
      className={`ga4-ov-card${on ? " ga4-ov-card-on" : ""}${marked ? " ga4-ov-card-mark" : ""}${ring}`}
      aria-pressed={on}
    >
      <span className="ga4-ov-card-label">{card.label}</span>
      <span className="ga4-ov-card-value">{card.value}</span>
      <span className={`ga4-ov-card-delta${down ? " ga4-ov-card-down" : ""}`}>{card.delta}</span>
    </button>
  );
}

interface MiniTableProps {
  title: string;
  head: string;
  metric: string;
  link: string;
  rows: MiniRow[];
  selected?: string | null;
  onSelect?: (key: string) => void;
  markKey?: string | null;
  /** 줄을 고를 수 있는 카드에서만 넘긴다 */
  tourPrefix?: string;
}

function MiniTable({
  title,
  head,
  metric,
  link,
  rows,
  selected,
  onSelect,
  markKey,
  tourPrefix,
}: MiniTableProps) {
  return (
    <section className="ga4-ov-panel">
      <h4 className="ga4-ov-panel-title">{title}</h4>
      <table className="ga4-ov-table">
        <thead>
          <tr>
            <th scope="col">{head}</th>
            <th scope="col">{metric}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <MiniTableRow
              key={r.name}
              row={r}
              on={selected === r.name}
              marked={markKey === r.name}
              onSelect={onSelect}
              tourPrefix={tourPrefix}
            />
          ))}
        </tbody>
      </table>
      <p className="ga4-ov-panel-link">
        {link} <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} aria-hidden />
      </p>
    </section>
  );
}

function MiniTableRow({
  row,
  on,
  marked,
  onSelect,
  tourPrefix,
}: {
  row: MiniRow;
  on: boolean;
  marked: boolean;
  onSelect?: (key: string) => void;
  tourPrefix?: string;
}) {
  const ring = useRing(tourPrefix ? `${tourPrefix}:${row.name}` : "");

  return (
    <tr className={`${on ? "ga4-ov-tr-on" : ""}${marked ? " ga4-ov-tr-mark" : ""}${ring}`}>
      <td>
        {onSelect ? (
          <button
            type="button"
            data-tour={tourPrefix ? `${tourPrefix}:${row.name}` : undefined}
            onClick={() => onSelect(row.name)}
          >
            {row.name}
          </button>
        ) : (
          <span className="ga4-ov-td-plain">{row.name}</span>
        )}
      </td>
      <td className="ga4-ov-td-num">{row.value}</td>
    </tr>
  );
}
