"use client";

/**
 * 보고서 개요 아래에 놓이는 "유용한 정보 및 추천" 카드.
 * GA4가 이상치를 찾아 알려 주는 통계 카드를 같은 모양으로 재현한다.
 * 카드마다 작은 차트가 붙고, 꺾은선에는 예상 범위 띠와 이상치 표시가 함께 그려진다.
 * 값은 서버 렌더와 어긋나지 않게 고정 배열로 둔다.
 */

import { Sparkles, Maximize2, ArrowRight } from "lucide-react";

const BLUE = "#1a73e8";

/* ===================== 미니 꺾은선 ===================== */

interface MiniLineProps {
  points: number[];
  /** 예상 범위의 아래쪽과 위쪽. points와 길이가 같다 */
  bandLow: number[];
  bandHigh: number[];
  /** 이 인덱스부터 끝까지 이상치 원을 그린다 */
  anomalyFrom: number;
  xLabels: { at: number; text: string }[];
  yTop: string;
  yMid: string;
}

const W = 320;
const H = 150;
const PAD_R = 46;
const PAD_B = 26;
const PAD_T = 8;
const PAD_L = 2;

function MiniLine({ points, bandLow, bandHigh, anomalyFrom, xLabels, yTop, yMid }: MiniLineProps) {
  const max = Math.max(...bandHigh, ...points) * 1.05;
  const innerW = W - PAD_L - PAD_R;
  const innerH = H - PAD_T - PAD_B;
  const step = points.length > 1 ? innerW / (points.length - 1) : 0;
  const x = (i: number) => PAD_L + i * step;
  const y = (v: number) => PAD_T + innerH - (v / max) * innerH;

  const bandPath =
    bandHigh.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ") +
    " " +
    bandLow
      .map((_, i) => {
        const j = bandLow.length - 1 - i;
        return `L${x(j).toFixed(1)},${y(bandLow[j]).toFixed(1)}`;
      })
      .join(" ") +
    " Z";

  const linePath = points
    .map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`)
    .join(" ");

  const midPath = bandLow
    .map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y((v + bandHigh[i]) / 2).toFixed(1)}`)
    .join(" ");

  return (
    <svg className="ga4-insight-svg" viewBox={`0 0 ${W} ${H}`} aria-hidden>
      <line x1={PAD_L} y1={y(max * 0.98)} x2={PAD_L + innerW} y2={y(max * 0.98)} className="ga4-insight-grid" />
      <line x1={PAD_L} y1={y(max * 0.5)} x2={PAD_L + innerW} y2={y(max * 0.5)} className="ga4-insight-grid" />
      <line x1={PAD_L} y1={y(0)} x2={PAD_L + innerW} y2={y(0)} className="ga4-insight-grid" />

      <path d={bandPath} className="ga4-insight-band" />
      <path d={midPath} className="ga4-insight-mid" />
      <path d={linePath} fill="none" stroke={BLUE} strokeWidth={2} />

      {points.map((v, i) =>
        i >= anomalyFrom ? (
          <circle key={i} cx={x(i)} cy={y(v)} r={4.2} className="ga4-insight-dot" />
        ) : null
      )}

      <text x={W - PAD_R + 6} y={y(max * 0.98) + 3} className="ga4-insight-axis">
        {yTop}
      </text>
      <text x={W - PAD_R + 6} y={y(max * 0.5) + 3} className="ga4-insight-axis">
        {yMid}
      </text>
      <text x={W - PAD_R + 6} y={y(0) + 3} className="ga4-insight-axis">
        0
      </text>

      {xLabels.map((l) => (
        <text
          key={l.text}
          x={x(l.at)}
          y={H - 8}
          className="ga4-insight-axis"
          textAnchor={l.at === 0 ? "start" : l.at === points.length - 1 ? "end" : "middle"}
        >
          {l.text}
        </text>
      ))}
    </svg>
  );
}

/* ===================== 미니 가로 막대 ===================== */

function MiniBars({ items }: { items: { name: string; value: number }[] }) {
  const ticks = [0, 0.2, 0.4, 0.6, 0.8];
  const max = 0.8;
  return (
    <div className="ga4-insight-bars">
      {items.map((item) => (
        <div key={item.name} className="ga4-insight-bar-row">
          <span className="ga4-insight-bar-name">{item.name}</span>
          <span className="ga4-insight-bar-track">
            <span className="ga4-insight-bar-fill" style={{ width: `${(item.value / max) * 100}%` }} />
          </span>
        </div>
      ))}
      <div className="ga4-insight-bar-axis">
        <span className="ga4-insight-bar-name" />
        <span className="ga4-insight-bar-scale">
          {ticks.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </span>
      </div>
    </div>
  );
}

/* ===================== 카드 ===================== */

function Legend({ metric }: { metric: string }) {
  return (
    <ul className="ga4-insight-legend">
      <li>
        <span className="ga4-insight-legend-dot" aria-hidden /> 이상치
      </li>
      <li>
        <span className="ga4-insight-legend-band" aria-hidden /> 예상 값
      </li>
      <li>
        <span className="ga4-insight-legend-line" aria-hidden /> {metric}
      </li>
    </ul>
  );
}

interface CardProps {
  title: string;
  period: string;
  body: string;
  badge?: string;
  link?: string;
  children: React.ReactNode;
}

function InsightCard({ title, period, body, badge, link, children }: CardProps) {
  return (
    <article className="ga4-insight-card">
      <div className="ga4-insight-head">
        <span className="ga4-insight-kicker">
          <Sparkles className="w-3.5 h-3.5" strokeWidth={1.8} aria-hidden /> 통계
        </span>
        {badge && <span className="ga4-insight-badge">{badge}</span>}
      </div>
      <h4 className="ga4-insight-title">{title}</h4>
      <p className="ga4-insight-period">{period}</p>
      <p className="ga4-insight-body">{body}</p>
      <div className="ga4-insight-chart">{children}</div>
      <div className="ga4-insight-foot">
        <Maximize2 className="w-3.5 h-3.5" strokeWidth={1.8} aria-hidden />
        {link && (
          <span className="ga4-insight-link">
            {link} <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} aria-hidden />
          </span>
        )}
      </div>
    </article>
  );
}

/* ===================== 데이터 ===================== */

const DIRECT_USERS = [118, 96, 88, 84, 92, 128, 172, 208, 262, 344, 484];
const DIRECT_HIGH = [186, 172, 166, 164, 176, 204, 232, 262, 304, 386, 424];
const DIRECT_LOW = [58, 52, 48, 46, 52, 68, 88, 112, 142, 186, 229];

const ENGAGED = [402, 546, 318, 286, 402, 872, 918, 1006, 742, 486, 448, 1287];
const ENGAGED_HIGH = [640, 690, 620, 596, 680, 880, 930, 1010, 880, 720, 700, 1242];
const ENGAGED_LOW = [210, 240, 190, 176, 214, 300, 340, 380, 320, 250, 240, 128];

const USERS = [612, 486, 452, 604, 806, 742, 668, 690, 1298, 1372, 1419];
const USERS_HIGH = [880, 800, 780, 900, 1020, 980, 940, 960, 1240, 1330, 1382];
const USERS_LOW = [320, 260, 240, 320, 430, 400, 360, 372, 640, 720, 172];

const EVENT_PATHS = [
  { name: "Organic Search", value: 0.625 },
  { name: "AI Assistant", value: 0.18 },
  { name: "Referral", value: 0.17 },
  { name: "Direct", value: 0.05 },
];

/** GA4 보고서 개요 아래에 놓이는 통계 카드 묶음 */
export function Ga4Insights() {
  return (
    <section className="ga4-insights">
      <div className="ga4-insights-head">
        <h3 className="ga4-insights-title">유용한 정보 및 추천</h3>
        <span className="ga4-insights-more">
          모든 통계 보기 <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} aria-hidden />
        </span>
      </div>

      <div className="ga4-insights-row">
        <InsightCard
          title={'신규 사용자 기본 채널 그룹 "Direct"의 사용자 급상승'}
          period="2026.08.03~2026.08.03"
          body={'신규 사용자 기본 채널 그룹 "Direct"의 사용자가 29부터 424 사이로 예측되었으나, 실제 사용자는 이 범위보다 상승한 484입니다.'}
        >
          <p className="ga4-insight-metric">사용자</p>
          <MiniLine
            points={DIRECT_USERS}
            bandHigh={DIRECT_HIGH}
            bandLow={DIRECT_LOW}
            anomalyFrom={9}
            xLabels={[
              { at: 0, text: "23" },
              { at: 5, text: "29" },
              { at: 10, text: "03" },
            ]}
            yTop="600"
            yMid="300"
          />
          <Legend metric="사용자" />
        </InsightCard>

        <InsightCard
          title="주요 이벤트 경로 중 Organic Search의 비율은 62.5%입니다"
          period="2026.07.01~2026.07.31"
          body="채널별 주요 이벤트 경로 비율"
          badge="접수대기"
          link="주요 이벤트 경로 보고서로 이동"
        >
          <MiniBars items={EVENT_PATHS} />
        </InsightCard>

        <InsightCard
          title="참여 세션 수 급상승"
          period="2026.07.27~2026.07.27"
          body="참여 세션 수가 128부터 1,242 사이로 예측되었으나, 실제 참여 세션 수는 이 범위보다 상승한 1,287입니다."
        >
          <p className="ga4-insight-metric">참여 세션 수</p>
          <MiniLine
            points={ENGAGED}
            bandHigh={ENGAGED_HIGH}
            bandLow={ENGAGED_LOW}
            anomalyFrom={11}
            xLabels={[
              { at: 0, text: "15" },
              { at: 5, text: "21" },
              { at: 11, text: "27" },
            ]}
            yTop="1.5천"
            yMid="750"
          />
          <Legend metric="참여 세션 수" />
        </InsightCard>

        <InsightCard
          title="사용자 급상승"
          period="2026.07.22~2026.07.22"
          body="사용자가 172부터 1,382 사이로 예측되었으나, 실제 사용자는 이 범위보다 상승한 1,419입니다."
        >
          <p className="ga4-insight-metric">사용자</p>
          <MiniLine
            points={USERS}
            bandHigh={USERS_HIGH}
            bandLow={USERS_LOW}
            anomalyFrom={8}
            xLabels={[
              { at: 0, text: "11" },
              { at: 5, text: "16" },
              { at: 10, text: "21" },
            ]}
            yTop="2천"
            yMid="1천"
          />
          <Legend metric="사용자" />
        </InsightCard>
      </div>
    </section>
  );
}
