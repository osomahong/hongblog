import { REALTIME_WINDOW_MINUTES } from "@/lib/ga4-types";

interface ActiveUsersPanelProps {
  activeUsers: number;
  perMinute: number[];
  showApi: boolean;
}

/**
 * GA4 실시간 개요 맨 위의 활성 사용자 패널.
 * 큰 숫자 하나와 분당 막대 30개로 이루어진다.
 */
export function ActiveUsersPanel({ activeUsers, perMinute, showApi }: ActiveUsersPanelProps) {
  const max = Math.max(...perMinute, 1);

  return (
    <div className="ga4-card">
      <div className="ga4-card-title">
        <span className="ga4-dotted">지난 {REALTIME_WINDOW_MINUTES}분 동안의 활성 사용자</span>
      </div>

      <div className="ga4-big mt-3">{activeUsers.toLocaleString("ko-KR")}</div>

      <div className="text-xs text-[color:var(--ga4-muted)] mt-5 mb-2">분당 활성 사용자</div>
      <div className="ga4-minutes">
        {perMinute.map((value, index) => (
          <div
            key={index}
            className="ga4-minute-bar"
            style={{ height: `${Math.max((value / max) * 100, 2)}%` }}
            title={`${REALTIME_WINDOW_MINUTES - index}분 전: ${value}명`}
          />
        ))}
      </div>
      <div className="ga4-axis">
        <span>{REALTIME_WINDOW_MINUTES}분 전</span>
        <span>15분 전</span>
        <span>방금</span>
      </div>

      {showApi && (
        <div className="ga4-api-badge">
          <span>
            dimension <code>minutesAgo</code>
          </span>
          <span>
            metric <code>activeUsers</code>
          </span>
        </div>
      )}
    </div>
  );
}
