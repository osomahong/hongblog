/**
 * 히어로용 그라데이션 리본. Spline "Clarity Stream" 레퍼런스의
 * 얇은 광선 웨이브를 경량 인라인 SVG + CSS 애니메이션으로 구현한다.
 * 외부 스크립트나 WebGL 의존이 없어 로딩 실패 상태가 존재하지 않는다.
 */

interface GradientStreamProps {
  className?: string;
}

const VIEW_W = 1560;
const VIEW_H = 520;

/** 좌우로 흐르는 S자 웨이브 경로. offset은 세로 이동, amp는 진폭 배율 */
function wavePath(offset: number, amp: number): string {
  const y = 260 + offset;
  const a = 130 * amp;
  return [
    `M -60 ${(y + 24).toFixed(1)}`,
    `C 240 ${(y - a).toFixed(1)}, 450 ${(y + a * 0.9).toFixed(1)}, 760 ${y.toFixed(1)}`,
    `S 1220 ${(y - a * 1.05).toFixed(1)}, 1620 ${(y + 18).toFixed(1)}`,
  ].join(" ");
}

const FRONT_LINES = Array.from({ length: 12 }, (_, i) => ({
  offset: (i - 5.5) * 6,
  amp: 1 + (i % 4) * 0.05,
  opacity: 0.14 + (1 - Math.abs(i - 5.5) / 5.5) * 0.5,
}));

const BACK_LINES = Array.from({ length: 8 }, (_, i) => ({
  offset: (i - 3.5) * 11 + 8,
  amp: 0.82 + (i % 3) * 0.07,
  opacity: 0.08 + (1 - Math.abs(i - 3.5) / 3.5) * 0.22,
}));

export function GradientStream({ className }: GradientStreamProps) {
  return (
    <svg
      className={className}
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      fill="none"
      aria-hidden
      style={{ display: "block" }}
    >
      <defs>
        <linearGradient id="ap-stream-grad" x1="0" y1="0" x2={VIEW_W} y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#7DD3FC" />
          <stop offset="0.35" stopColor="#A78BFA" />
          <stop offset="0.68" stopColor="#FF5C7D" />
          <stop offset="1" stopColor="#FFD700" />
        </linearGradient>
        <filter id="ap-stream-blur" x="-20%" y="-60%" width="140%" height="220%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
      </defs>

      {/* 뒤쪽 잔광 */}
      <path
        d={wavePath(6, 1.02)}
        stroke="url(#ap-stream-grad)"
        strokeWidth="26"
        strokeLinecap="round"
        opacity="0.22"
        filter="url(#ap-stream-blur)"
      />

      {/* 뒤 레이어: 느린 역방향 드리프트 */}
      <g className="ap-stream-drift-alt">
        {BACK_LINES.map(({ offset, amp, opacity }) => (
          <path
            key={`b-${offset}`}
            d={wavePath(offset, amp)}
            stroke="url(#ap-stream-grad)"
            strokeWidth="1"
            strokeLinecap="round"
            opacity={opacity.toFixed(3)}
          />
        ))}
      </g>

      {/* 앞 레이어: 촘촘한 메인 리본 */}
      <g className="ap-stream-drift">
        {FRONT_LINES.map(({ offset, amp, opacity }) => (
          <path
            key={`f-${offset}`}
            d={wavePath(offset, amp)}
            stroke="url(#ap-stream-grad)"
            strokeWidth="1.4"
            strokeLinecap="round"
            opacity={opacity.toFixed(3)}
          />
        ))}
      </g>
    </svg>
  );
}
