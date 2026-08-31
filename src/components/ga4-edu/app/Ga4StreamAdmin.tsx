"use client";

/**
 * 관리 > 데이터 스트림 화면.
 *
 * 스트림 목록에서 웹 스트림을 누르면 상세가 열리고, 그 안에 향상된 측정 카드가 있다.
 * 톱니를 누르면 이벤트별 토글이 늘어선 설정 패널이 열린다.
 *
 * 페이지 조회는 GA4에서도 해제할 수 없는 항목이라 토글을 두지 않는다.
 * 끈 항목은 스트림 상세의 수집 목록에서 중단됨으로 표시해, 설정이 데이터에 남기는 자국을 보여 준다.
 */

import { ChevronRight, Settings, X, Globe } from "lucide-react";
import { useRing } from "./tour";

export interface MeasuredEvent {
  /** 향상된 측정에서 부르는 이름 */
  label: string;
  /** 실제로 수집되는 이벤트 이름 */
  event: string;
  /** GA4에서 해제할 수 없는 항목인지 */
  locked?: boolean;
  /** 지난 28일 수집량. 해제하면 이만큼이 앞으로 들어오지 않는다 */
  count: number;
}

interface Ga4StreamAdminProps {
  streamName: string;
  streamUrl: string;
  measurementId: string;
  events: MeasuredEvent[];
  /** 스트림 상세가 열려 있는지 */
  detailOpen: boolean;
  /** 향상된 측정 설정 패널이 열려 있는지 */
  settingsOpen: boolean;
  /** 끈 항목의 이벤트 이름 */
  disabled: string[];
  onOpenDetail: () => void;
  onOpenSettings: () => void;
  onCloseSettings: () => void;
  onToggleEvent: (event: string) => void;
}

const numberFormat = new Intl.NumberFormat("ko-KR");

export function Ga4StreamAdmin({
  streamName,
  streamUrl,
  measurementId,
  events,
  detailOpen,
  settingsOpen,
  disabled,
  onOpenDetail,
  onOpenSettings,
  onCloseSettings,
  onToggleEvent,
}: Ga4StreamAdminProps) {
  const rowRing = useRing("stream:web");
  const gearRing = useRing("stream:settings");
  const closeRing = useRing("stream:close");

  if (!detailOpen) {
    return (
      <div className="ga4-stream">
        <div className="ga4-stream-head">
          <h2 className="ga4-stream-title">데이터 스트림</h2>
          <span className="ga4-stream-tab">웹</span>
        </div>
        <button
          type="button"
          data-tour="stream:web"
          onClick={onOpenDetail}
          className={`ga4-stream-row${rowRing}`}
        >
          <span className="ga4-stream-icon" aria-hidden>
            <Globe className="w-4 h-4" strokeWidth={1.8} />
          </span>
          <span className="ga4-stream-row-main">
            <span className="ga4-stream-row-name">{streamName}</span>
            <span className="ga4-stream-row-sub">
              {streamUrl}, 스트림 ID {measurementId}
            </span>
          </span>
          <ChevronRight className="w-4 h-4" strokeWidth={2} aria-hidden />
        </button>
      </div>
    );
  }

  return (
    <div className="ga4-stream">
      <div className="ga4-stream-head">
        <h2 className="ga4-stream-title">웹 스트림 세부정보</h2>
      </div>

      <div className="ga4-stream-meta">
        <div>
          <p className="ga4-ff-field-label">스트림 이름</p>
          <p className="ga4-stream-meta-value">{streamName}</p>
        </div>
        <div>
          <p className="ga4-ff-field-label">스트림 URL</p>
          <p className="ga4-stream-meta-value">{streamUrl}</p>
        </div>
        <div>
          <p className="ga4-ff-field-label">측정 ID</p>
          <p className="ga4-stream-meta-value">{measurementId}</p>
        </div>
      </div>

      <div className="ga4-stream-card">
        <div className="ga4-stream-card-head">
          <div>
            <p className="ga4-stream-card-title">향상된 측정</p>
            <p className="ga4-stream-card-desc">
              페이지 조회 외에 스크롤, 이탈 클릭 같은 상호작용을 코드 없이 자동으로 수집합니다.
            </p>
          </div>
          <button
            type="button"
            aria-label="향상된 측정 설정"
            data-tour="stream:settings"
            onClick={onOpenSettings}
            className={`ga4-stream-gear${gearRing}`}
          >
            <Settings className="w-4 h-4" strokeWidth={1.8} aria-hidden />
          </button>
        </div>

        <table className="ga4-stream-table">
          <thead>
            <tr>
              <th scope="col">수집 중인 이벤트</th>
              <th scope="col">이벤트 이름</th>
              <th scope="col">지난 28일</th>
              <th scope="col">상태</th>
            </tr>
          </thead>
          <tbody>
            {events.map((e) => {
              const off = disabled.includes(e.event);
              return (
                <tr key={e.event} className={off ? "ga4-stream-off" : ""}>
                  <th scope="row">{e.label}</th>
                  <td className="ga4-stream-event">{e.event}</td>
                  <td>{numberFormat.format(e.count)}</td>
                  <td>
                    {off ? (
                      <span className="ga4-stream-badge-off">중단됨</span>
                    ) : (
                      <span className="ga4-stream-badge-on">수집 중</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {settingsOpen && (
        <div className="ga4-stream-panel" role="dialog" aria-label="향상된 측정 설정">
          <header className="ga4-seg-head">
            <span>향상된 측정</span>
            <button
              type="button"
              aria-label="닫기"
              data-tour="stream:close"
              onClick={onCloseSettings}
              className={closeRing.trim()}
            >
              <X className="w-4 h-4" strokeWidth={2} aria-hidden />
            </button>
          </header>
          <p className="ga4-seg-lead">
            해제하면 그때부터 수집이 멈춥니다. 이미 쌓인 데이터는 그대로 남습니다.
          </p>

          <ul className="ga4-stream-toggles">
            {events.map((e) => (
              <EventToggle
                key={e.event}
                item={e}
                on={!disabled.includes(e.event)}
                onToggle={() => onToggleEvent(e.event)}
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function EventToggle({
  item,
  on,
  onToggle,
}: {
  item: MeasuredEvent;
  on: boolean;
  onToggle: () => void;
}) {
  const ring = useRing(`stream:toggle:${item.event}`);
  return (
    <li className="ga4-stream-toggle">
      <span className="ga4-stream-toggle-main">
        <span className="ga4-stream-toggle-label">{item.label}</span>
        <span className="ga4-stream-event">{item.event}</span>
      </span>
      {item.locked ? (
        <span className="ga4-stream-locked">항상 수집</span>
      ) : (
        <button
          type="button"
          role="switch"
          aria-checked={on}
          aria-label={`${item.label} 측정`}
          data-tour={`stream:toggle:${item.event}`}
          onClick={onToggle}
          className={`ga4-fn-switch${on ? " ga4-fn-switch-on" : ""}${ring}`}
        >
          <span className="ga4-fn-switch-knob" />
        </button>
      )}
    </li>
  );
}
