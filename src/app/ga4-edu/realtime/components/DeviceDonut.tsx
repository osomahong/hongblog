import type { RealtimeCard } from "@/lib/ga4-types";

/** GA4 도넛에 쓰이는 색 순서 */
const SLICE_COLORS = ["#1a73e8", "#12b5cb", "#7cb342", "#f9ab00", "#e8710a"];

interface DeviceDonutProps {
  data: RealtimeCard;
  showApi: boolean;
}

/**
 * 기기 카테고리별 활성 사용자 도넛.
 * conic-gradient로 조각을 만들고 가운데를 흰 원으로 덮어 도넛 모양을 낸다.
 */
export function DeviceDonut({ data, showApi }: DeviceDonutProps) {
  const total = data.total || 1;

  // 각 조각의 시작 각도와 끝 각도를 누적해서 conic-gradient 문자열을 만든다.
  // 렌더 중 바깥 변수를 고쳐 쓰지 않으려고 앞선 조각들의 합을 그때그때 구한다.
  const stops = data.rows.map((row, index) => {
    const before = data.rows.slice(0, index).reduce((sum, r) => sum + r.value, 0);
    const start = (before / total) * 360;
    const end = ((before + row.value) / total) * 360;
    const color = SLICE_COLORS[index % SLICE_COLORS.length];
    return `${color} ${start}deg ${end}deg`;
  });

  const isEmpty = data.rows.length === 0;

  return (
    <div className="ga4-card">
      <div className="ga4-card-title">
        <span>기기 카테고리별</span>
        <span className="ga4-dotted">활성 사용자</span>
      </div>

      {isEmpty ? (
        <p className="ga4-empty">사용 가능한 데이터가 없습니다.</p>
      ) : (
        <div className="flex flex-1 items-center gap-8 mt-5 flex-wrap">
          <div
            className="ga4-donut"
            style={{ background: `conic-gradient(${stops.join(", ")})` }}
            role="img"
            aria-label={data.rows.map((row) => `${row.label} ${row.value}명`).join(", ")}
          />
          <div className="ga4-legend flex-1 min-w-0">
            {data.rows.map((row, index) => (
              <div key={row.label} className="flex items-center gap-2">
                <span
                  className="ga4-legend-dot"
                  style={{ background: SLICE_COLORS[index % SLICE_COLORS.length] }}
                />
                <span className="text-[color:var(--ga4-ink)] flex-1">{row.label}</span>
                <span className="tabular-nums">{row.value.toLocaleString("ko-KR")}명</span>
                <span className="tabular-nums w-12 text-right">
                  {((row.value / total) * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {showApi && (
        <div className="ga4-api-badge">
          <span>
            dimension <code>deviceCategory</code>
          </span>
          <span>
            metric <code>activeUsers</code>
          </span>
        </div>
      )}
    </div>
  );
}
