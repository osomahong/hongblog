"use client";

/**
 * 광고 > 기여 분석 모델 비교 화면.
 *
 * 같은 전환을 두 모델로 나눠 보고 채널마다 평가가 어떻게 달라지는지 비교한다.
 * 총 전환 수는 어느 모델로 보든 같고, 채널 사이에서 몫만 옮겨 다닌다.
 */

import { ChevronDown } from "lucide-react";
import { Ga4TopBar, Ga4IconRail, type Ga4Section } from "./Ga4Chrome";
import { useRing } from "./tour";

export interface AttributionRow {
  channel: string;
  /** 기준 모델의 전환 수 */
  base: number;
  /** 비교 모델의 전환 수 */
  compare: number;
}

interface Ga4AttributionProps {
  account: string;
  property: string;
  searchHint: string;
  pinned: boolean;
  onTogglePin: () => void;
  onOpenSection?: (section: Ga4Section) => void;
  /** 기준 모델 이름. 바꾸지 않는다 */
  baseLabel: string;
  /** 지금 고른 비교 모델 이름 */
  compareLabel: string;
  compareOptions: string[];
  listOpen: boolean;
  onToggleList: () => void;
  onPickCompare: (label: string) => void;
  rows: AttributionRow[];
  /** 비교 모델을 고르기 전인지. 고르기 전에는 비교 열을 비워 둔다 */
  compared: boolean;
  selectedRow: string | null;
  onSelectRow: (channel: string) => void;
  markRow?: string | null;
}

const numberFormat = new Intl.NumberFormat("ko-KR");

export function Ga4Attribution({
  account,
  property,
  searchHint,
  pinned,
  onTogglePin,
  onOpenSection,
  baseLabel,
  compareLabel,
  compareOptions,
  listOpen,
  onToggleList,
  onPickCompare,
  rows,
  compared,
  selectedRow,
  onSelectRow,
  markRow = null,
}: Ga4AttributionProps) {
  const listRing = useRing("attribution:model");

  return (
    <div className="ga4-app">
      <Ga4TopBar
        account={account}
        property={property}
        searchHint={searchHint}
        pinned={pinned}
        onTogglePin={onTogglePin}
      />
      <div className="ga4-app-body">
        <Ga4IconRail section="ads" onOpenSection={onOpenSection} />

        <nav className="ga4-adminnav" aria-label="광고 메뉴">
          <p className="ga4-adminnav-title">광고</p>
          <button type="button" className="ga4-adminnav-item" aria-current={false}>
            광고 스냅샷
          </button>
          <button type="button" className="ga4-adminnav-item" aria-current>
            기여 분석: 모델 비교
          </button>
          <button type="button" className="ga4-adminnav-item" aria-current={false}>
            전환 경로
          </button>
        </nav>

        <div className="ga4-attr">
          <header className="ga4-attr-head">
            <h2 className="ga4-attr-title">모델 비교</h2>
            <p className="ga4-rule-desc">
              같은 전환을 두 모델로 나눠 봅니다. 총 전환 수는 같고 채널 사이에서 몫만 옮겨 다닙니다.
            </p>
          </header>

          <div className="ga4-attr-models">
            <div className="ga4-attr-model">
              <p className="ga4-ff-field-label">기준 모델</p>
              <p className="ga4-attr-model-value">{baseLabel}</p>
            </div>
            <div className="ga4-attr-model ga4-attr-model-pick">
              <p className="ga4-ff-field-label">비교 모델</p>
              <button
                type="button"
                data-tour="attribution:model"
                onClick={onToggleList}
                className={`ga4-fn-select${listRing}`}
              >
                {compared ? compareLabel : "모델을 고르세요"}
                <ChevronDown className="w-4 h-4" strokeWidth={2} aria-hidden />
              </button>
              {listOpen && (
                <ul className="ga4-fn-options">
                  {compareOptions.map((o) => (
                    <li key={o}>
                      <button type="button" onClick={() => onPickCompare(o)}>
                        {o}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <table className="ga4-attr-table">
            <thead>
              <tr>
                <th scope="col">기본 채널 그룹</th>
                <th scope="col">{baseLabel}</th>
                <th scope="col">{compared ? compareLabel : "비교 모델"}</th>
                <th scope="col">변화율</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const delta = r.base === 0 ? 0 : ((r.compare - r.base) / r.base) * 100;
                const marked = markRow === r.channel;
                return (
                  <tr
                    key={r.channel}
                    onClick={() => onSelectRow(r.channel)}
                    className={`${selectedRow === r.channel ? "ga4-attr-row-on" : ""}${marked ? " ga4-attr-row-mark" : ""}`}
                  >
                    <th scope="row">{r.channel}</th>
                    <td>{numberFormat.format(r.base)}</td>
                    <td>{compared ? numberFormat.format(r.compare) : "-"}</td>
                    <td className={compared && delta < 0 ? "ga4-attr-down" : "ga4-attr-up"}>
                      {compared ? `${delta > 0 ? "+" : ""}${delta.toFixed(1)}%` : "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
