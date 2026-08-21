/**
 * 추천 카드에 쓰는 SVG 썸네일.
 * 사진을 쓰지 않고 제목 글자가 크게 읽히도록 만든다.
 * 색은 GA4 로고의 주황 계열만 쓰고, 단계에 따라 진하기를 달리해 초급과 심화를 구분한다.
 * (GA4 화면 안쪽은 구글 UI를 따라 파랑을 쓰지만, 브랜드 자리는 로고색인 주황을 쓴다)
 */

import { LEVEL_LABEL, AREA_LABEL, type Ga4EduLevel, type Ga4EduArea } from "@/app/ga4-edu/data";

const W = 480;
const H = 356;

/** 로고색을 옅게 풀어 쓴 단계별 배경. 채도를 낮춰 은은하게 두고 글자로 대비를 만든다 */
const LEVEL_COLORS: Record<Ga4EduLevel, { from: string; to: string; ink: string }> = {
  basic: { from: "#fffaf1", to: "#fdeacb", ink: "#8a5200" },
  intermediate: { from: "#fdf0dc", to: "#f8dcaf", ink: "#7d4a00" },
  advanced: { from: "#fae6c6", to: "#f0cd94", ink: "#6f4000" },
};

/**
 * 한글 제목을 어절 단위로 잘라 여러 줄로 만든다.
 * SVG는 글자를 자동으로 줄바꿈하지 않아서 직접 나눠 줘야 한다.
 */
function wrapTitle(title: string, perLine: number, maxLines: number): string[] {
  const words = title.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (candidate.length > perLine && line) {
      lines.push(line);
      line = word;
      if (lines.length === maxLines) break;
    } else {
      line = candidate;
    }
  }
  if (lines.length < maxLines && line) lines.push(line);
  if (lines.length === maxLines && words.join(" ").length > lines.join(" ").length) {
    lines[maxLines - 1] = `${lines[maxLines - 1]}…`;
  }
  return lines;
}

interface Ga4ThumbProps {
  title: string;
  level: Ga4EduLevel;
  area: Ga4EduArea;
  /** 단계 안에서의 순번 */
  order: number;
}

export function Ga4Thumb({ title, level, area, order }: Ga4ThumbProps) {
  const { from, to, ink } = LEVEL_COLORS[level];
  const lines = wrapTitle(title, 11, 3);
  const gid = `ga4thumb-${level}-${order}`;

  return (
    <svg
      className="ga4-thumb"
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={`${LEVEL_LABEL[level]} ${order}번 ${title}`}
    >
      <defs>
        <linearGradient id={`${gid}-bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={from} />
          <stop offset="100%" stopColor={to} />
        </linearGradient>
        <pattern id={`${gid}-dots`} width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.6" fill={ink} opacity="0.16" />
        </pattern>
        <clipPath id={`${gid}-avatar`}>
          <circle cx={W - 70} cy={H - 64} r={33} />
        </clipPath>
      </defs>

      <rect width={W} height={H} fill={`url(#${gid}-bg)`} />
      <rect x={26} y={H - 118} width={104} height={54} fill={`url(#${gid}-dots)`} />

      {/* 오른쪽 위 여백에 GA4 로고를 둔다. 아래 제목 판과 겹치지 않는 높이로 맞춘다 */}
      <g transform={`translate(${W - 96} 14) scale(2.6)`}>
        <rect x="16" y="2" width="6" height="20" rx="3" fill="#f9ab00" />
        <rect x="9" y="8" width="6" height="14" rx="3" fill="#e37400" opacity="0.9" />
        <circle cx="5" cy="19" r="3" fill="#e37400" opacity="0.75" />
      </g>

      {/* 단계 배지 */}
      <rect x={32} y={30} width={94} height={30} rx={15} fill={ink} />
      <text x={79} y={50} className="ga4-thumb-badge" textAnchor="middle" fill="#ffffff">
        {LEVEL_LABEL[level]} {String(order).padStart(2, "0")}
      </text>

      {/* 제목: 어두운 판 하나를 깔고 그 위에 올려 글자가 배경에 묻히지 않게 한다.
          줄마다 판을 나누면 글자 폭을 잴 수 없어 여백이 어긋난다 */}
      <rect
        x={26}
        y={88}
        width={W - 52}
        height={lines.length * 48 + 22}
        rx={10}
        fill="#ffffff"
        opacity="0.76"
      />
      {lines.map((line, i) => (
        <text key={line} x={44} y={126 + i * 48} className="ga4-thumb-title" fill={ink}>
          {line}
        </text>
      ))}

      {/* 아래쪽 왼쪽에 영역 이름과 코스 이름을 나란히 둔다 */}
      <text x={32} y={H - 58} className="ga4-thumb-area" fill={ink}>
        {AREA_LABEL[area]}
      </text>
      <g transform={`translate(24 ${H - 46}) scale(0.8)`}>
        <rect x="16" y="2" width="6" height="20" rx="3" fill="#f9ab00" />
        <rect x="9" y="8" width="6" height="14" rx="3" fill="#e37400" opacity="0.9" />
        <circle cx="5" cy="19" r="3" fill="#e37400" opacity="0.75" />
      </g>
      <text x={52} y={H - 28} className="ga4-thumb-brand" fill={ink}>
        GA4 EDU
      </text>

      {/* 오른쪽 아래 남는 자리에 도우미 얼굴을 동그랗게 넣는다 */}
      <circle cx={W - 70} cy={H - 64} r={35} fill="#ffffff" opacity="0.92" />
      <image
        href="/images/ga4-edu/guide.png"
        x={W - 103}
        y={H - 97}
        width={66}
        height={66}
        clipPath={`url(#${gid}-avatar)`}
        preserveAspectRatio="xMidYMid slice"
      />
      <circle cx={W - 70} cy={H - 64} r={34} fill="none" stroke={ink} strokeWidth={1.5} opacity="0.32" />
    </svg>
  );
}
