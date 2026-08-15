"use client";

/**
 * 보고서 위쪽 차트 두 개.
 * 왼쪽은 기간별 꺾은선, 오른쪽은 항목별 가로 막대다.
 * GA4 화면과 같이 y축을 오른쪽에 두고, 강조색은 파랑 하나만 쓴다. 계열은 파랑의 밝기로 나눈다.
 */

import { ChevronDown } from "lucide-react";

export interface Series {
  name: string;
  /** 파랑 계열 안에서의 밝기 단계 (0이 가장 진하다) */
  shade: number;
  points: number[];
  /** 기간 비교의 비교 기간처럼 점선으로 그릴 계열 */
  dashed?: boolean;
}

/** 파랑 한 색의 밝기 단계. GA4는 강조색을 파랑으로만 쓴다 */
export const BLUE_SHADES = ["#1a73e8", "#4285f4", "#669df6", "#8ab4f8", "#aecbfa"];

export const blueOf = (shade: number) => BLUE_SHADES[shade % BLUE_SHADES.length];

const CHART_W = 620;
const CHART_H = 172;
const PAD_R = 44;
const PAD_B = 26;
const PAD_T = 10;
const PAD_L = 6;

function coords(points: number[], max: number) {
  const innerW = CHART_W - PAD_L - PAD_R;
  const innerH = CHART_H - PAD_T - PAD_B;
  const step = points.length > 1 ? innerW / (points.length - 1) : 0;
  return points.map((v, i) => ({
    x: PAD_L + i * step,
    y: PAD_T + innerH - (v / max) * innerH,
  }));
}

function niceMax(value: number): number {
  const pow = Math.pow(10, Math.floor(Math.log10(value)));
  return Math.ceil(value / pow) * pow;
}

/** 만 단위로 줄여 쓰는 GA4식 축 라벨 */
function axisLabel(value: number): string {
  if (value >= 10000) return `${Math.round(value / 10000)}만`;
  if (value >= 1000) return `${(value / 1000).toFixed(0)}천`;
  return String(value);
}

export function Ga4LineCard({
  title,
  series,
  xLabels,
}: {
  title: string;
  series: Series[];
  xLabels: string[];
}) {
  const peak = Math.max(...series.flatMap((s) => s.points), 1);
  const max = niceMax(peak);
  const innerH = CHART_H - PAD_T - PAD_B;
  const ticks = [0, 0.25, 0.5, 0.75, 1];
  const innerW = CHART_W - PAD_L - PAD_R;

  // 맨 앞 계열은 GA4처럼 면을 옅게 채워 합계 흐름을 드러낸다
  const lead = series[0];
  const leadPts = coords(lead.points, max);
  const areaPath =
    `M${leadPts[0].x},${CHART_H - PAD_B} ` +
    leadPts.map((p) => `L${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ") +
    ` L${leadPts[leadPts.length - 1].x},${CHART_H - PAD_B} Z`;

  return (
    <section className="ga4-chartcard">
      <div className="ga4-chartcard-head">
        <h3 className="ga4-chartcard-title">{title}</h3>
        <span className="ga4-chart-select">
          일 <ChevronDown className="w-3.5 h-3.5" strokeWidth={2} aria-hidden />
        </span>
      </div>

      <svg
        className="ga4-chart-svg"
        viewBox={`0 0 ${CHART_W} ${CHART_H}`}
        role="img"
        aria-label={title}
      >
        {ticks.map((t) => {
          const y = PAD_T + innerH - t * innerH;
          return (
            <g key={t}>
              <line x1={PAD_L} y1={y} x2={PAD_L + innerW} y2={y} className="ga4-chart-grid" />
              <text x={CHART_W - PAD_R + 8} y={y + 3} className="ga4-chart-axis">
                {axisLabel(Math.round(max * t))}
              </text>
            </g>
          );
        })}

        <path d={areaPath} className="ga4-chart-area" />

        {series.map((s) => (
          <path
            key={s.name}
            d={coords(s.points, max)
              .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
              .join(" ")}
            fill="none"
            stroke={blueOf(s.shade)}
            strokeWidth={1.8}
            strokeDasharray={s.dashed ? "5 4" : undefined}
          />
        ))}

        {xLabels.map((label, i) => {
          const step = xLabels.length > 1 ? innerW / (xLabels.length - 1) : 0;
          return (
            <text
              key={label}
              x={PAD_L + i * step}
              y={CHART_H - 8}
              className="ga4-chart-axis"
              textAnchor={i === 0 ? "start" : i === xLabels.length - 1 ? "end" : "middle"}
            >
              {label}
            </text>
          );
        })}
      </svg>

      <ul className="ga4-chart-legend">
        {series.map((s) => (
          <li key={s.name}>
            <span
              className={`ga4-legend-swatch${s.dashed ? " ga4-legend-swatch-dash" : ""}`}
              style={s.dashed ? { borderColor: blueOf(s.shade) } : { background: blueOf(s.shade) }}
              aria-hidden
            />
            {s.name}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Ga4BarCard({
  title,
  items,
}: {
  title: string;
  items: { name: string; value: number }[];
}) {
  const max = niceMax(Math.max(...items.map((i) => i.value), 1));
  const ticks = [0, 0.25, 0.5, 0.75, 1];

  return (
    <section className="ga4-chartcard">
      <div className="ga4-chartcard-head">
        <h3 className="ga4-chartcard-title">{title}</h3>
      </div>

      <ul className="ga4-hbars">
        {items.map((item) => (
          <li key={item.name}>
            <span className="ga4-hbar-name">{item.name}</span>
            <span className="ga4-hbar-track">
              <span className="ga4-hbar-fill" style={{ width: `${(item.value / max) * 100}%` }} />
            </span>
          </li>
        ))}
      </ul>

      <div className="ga4-hbar-axis" aria-hidden>
        <span className="ga4-hbar-axis-pad" />
        <span className="ga4-hbar-axis-scale">
          {ticks.map((t) => (
            <span key={t}>{axisLabel(Math.round(max * t))}</span>
          ))}
        </span>
      </div>
    </section>
  );
}
