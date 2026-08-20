"use client";

/**
 * 탐색 세그먼트 중복분석 화면.
 *
 * 세그먼트 세 개가 겹치는 모양을 원 셋으로 그리고, 아래 표에 조합별 사용자 수를 늘어놓는다.
 * 원의 크기는 세그먼트 크기와 비례하지 않는다. GA4도 겹침의 모양만 보여 주고 정확한 수는
 * 표에서 읽게 한다.
 */

export interface OverlapArea {
  /** 조합 이름. 표의 첫 열에 적힌다 */
  label: string;
  /** 이 조합에만 해당하는 사용자 수 */
  users: number;
}

interface Ga4OverlapProps {
  name: string;
  dateLabel: string;
  /** 원 셋에 붙는 세그먼트 이름 */
  segments: [string, string, string];
  /** 세그먼트별 전체 크기 */
  totals: [number, number, number];
  /** 조합별 사용자 수. 표에 순서대로 놓인다 */
  areas: OverlapArea[];
  selected: string | null;
  onSelect: (label: string) => void;
  markArea?: string | null;
}

const numberFormat = new Intl.NumberFormat("ko-KR");

export function Ga4Overlap({
  name,
  dateLabel,
  segments,
  totals,
  areas,
  selected,
  onSelect,
  markArea = null,
}: Ga4OverlapProps) {
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
          {segments.map((s, i) => (
            <span key={s} className="ga4-ff-segment">
              {s} {numberFormat.format(totals[i])}명
            </span>
          ))}
        </div>
      </section>

      {/* ----- 탭 설정 ----- */}
      <section className="ga4-ff-panel ga4-ff-settings" aria-label="탭 설정">
        <header className="ga4-ff-panel-head">
          <span className="ga4-ff-panel-title">탭 설정</span>
        </header>
        <div className="ga4-ff-field">
          <p className="ga4-ff-field-label">기법</p>
          <p className="ga4-ff-field-value">세그먼트 중복분석</p>
        </div>
        <div className="ga4-ff-field">
          <p className="ga4-ff-field-label">세그먼트 비교</p>
          {segments.map((s) => (
            <p key={s} className="ga4-ff-field-value">
              {s}
            </p>
          ))}
        </div>
        <div className="ga4-ff-field">
          <p className="ga4-ff-field-label">값</p>
          <p className="ga4-ff-field-value">총 사용자</p>
        </div>
      </section>

      {/* ----- 캔버스 ----- */}
      <section className="ga4-overlap-canvas" aria-label="세그먼트 중복">
        <svg viewBox="0 0 360 300" className="ga4-overlap-svg" role="img" aria-label="세 세그먼트가 겹치는 모양">
          <circle cx="140" cy="115" r="90" fill="#4285f4" fillOpacity="0.34" />
          <circle cx="220" cy="115" r="90" fill="#34a853" fillOpacity="0.34" />
          <circle cx="180" cy="185" r="90" fill="#fbbc04" fillOpacity="0.34" />
          <text x="86" y="58" className="ga4-overlap-label">
            {segments[0]}
          </text>
          <text x="240" y="58" className="ga4-overlap-label">
            {segments[1]}
          </text>
          <text x="150" y="288" className="ga4-overlap-label">
            {segments[2]}
          </text>
        </svg>

        <table className="ga4-overlap-table">
          <thead>
            <tr>
              <th scope="col">세그먼트 조합</th>
              <th scope="col">총 사용자</th>
            </tr>
          </thead>
          <tbody>
            {areas.map((a) => (
              <tr
                key={a.label}
                onClick={() => onSelect(a.label)}
                className={`${selected === a.label ? "ga4-overlap-row-on" : ""}${markArea === a.label ? " ga4-overlap-row-mark" : ""}`}
              >
                <th scope="row">{a.label}</th>
                <td>{numberFormat.format(a.users)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
