"use client";

/**
 * 이벤트 수정 패널.
 *
 * GA4의 이벤트 수정은 들어오는 이벤트의 이름이나 매개변수를 조건에 맞춰 바꿔 쓰는 설정이다.
 * 화면은 위에 수정 이름, 가운데 일치 조건, 아래 수정 매개변수 순으로 놓인다.
 *
 * 조건과 수정값은 이 편에서 고를 수 있는 것만 목록으로 준다. 실제 GA4는 값을 직접 입력한다.
 */

import { X, ChevronDown, Check } from "lucide-react";
import { useRing } from "./tour";

interface Ga4ModifyEventPanelProps {
  /** 수정 규칙 이름 */
  ruleName: string;
  /** 고르는 중인 조건 값. 어느 이벤트를 수정할지 정한다 */
  matchValue: string | null;
  /** 고르는 중인 새 이름 */
  newValue: string | null;
  /** 열려 있는 목록 */
  openList: "match" | "value" | null;
  matchOptions: string[];
  valueOptions: string[];
  onToggleList: (list: "match" | "value") => void;
  onPickMatch: (value: string) => void;
  onPickValue: (value: string) => void;
  onSave: () => void;
  onClose: () => void;
}

export function Ga4ModifyEventPanel({
  ruleName,
  matchValue,
  newValue,
  openList,
  matchOptions,
  valueOptions,
  onToggleList,
  onPickMatch,
  onPickValue,
  onSave,
  onClose,
}: Ga4ModifyEventPanelProps) {
  const matchRing = useRing("modify:match");
  const valueRing = useRing("modify:value");
  const saveRing = useRing("modify:save");

  return (
    <aside className="ga4-cz ga4-createpanel" aria-label="이벤트 수정">
      <header className="ga4-cz-head">
        <h3 className="ga4-cz-title">이벤트 수정</h3>
        <button type="button" aria-label="닫기" onClick={onClose} className="ga4-cz-close">
          <X className="w-4 h-4" strokeWidth={2} aria-hidden />
        </button>
      </header>

      <div className="ga4-cz-body">
        <p className="ga4-panel-label">수정 이름</p>
        <div className="ga4-panel-cond">
          <span className="ga4-panel-fixed">{ruleName}</span>
        </div>

        <p className="ga4-panel-label">일치 조건</p>
        <div className="ga4-panel-cond">
          <span className="ga4-panel-fixed">event_name</span>
          <span className="ga4-panel-fixed">같음</span>
        </div>
        <div className="ga4-panel-field">
            <button
              type="button"
              data-tour="modify:match"
              onClick={() => onToggleList("match")}
              className={`ga4-panel-select${matchRing}`}
            >
              {matchValue ?? "이벤트를 고르세요"}
              <ChevronDown className="w-4 h-4" strokeWidth={2} aria-hidden />
            </button>
            {openList === "match" && (
              <ul className="ga4-menu">
                {matchOptions.map((o) => (
                  <li key={o}>
                    <button type="button" onClick={() => onPickMatch(o)}>
                      {o}
                      {matchValue === o && <Check className="w-4 h-4" strokeWidth={2} aria-hidden />}
                    </button>
                  </li>
                ))}
              </ul>
            )}
        </div>

        <p className="ga4-panel-label">매개변수 수정</p>
        <div className="ga4-panel-cond">
          <span className="ga4-panel-fixed">event_name</span>
          <span className="ga4-panel-fixed">다음 값으로</span>
        </div>
        <div className="ga4-panel-field">
            <button
              type="button"
              data-tour="modify:value"
              onClick={() => onToggleList("value")}
              className={`ga4-panel-select${valueRing}`}
            >
              {newValue ?? "새 이름을 고르세요"}
              <ChevronDown className="w-4 h-4" strokeWidth={2} aria-hidden />
            </button>
            {openList === "value" && (
              <ul className="ga4-menu">
                {valueOptions.map((o) => (
                  <li key={o}>
                    <button type="button" onClick={() => onPickValue(o)}>
                      {o}
                      {newValue === o && <Check className="w-4 h-4" strokeWidth={2} aria-hidden />}
                    </button>
                  </li>
                ))}
              </ul>
            )}
        </div>

        <p className="ga4-panel-note">
          수정은 저장한 뒤 들어오는 데이터부터 적용됩니다. 이미 쌓인 이벤트의 이름은 그대로
          남습니다.
        </p>
      </div>

      <footer className="ga4-cz-foot">
        <button
          type="button"
          data-tour="modify:save"
          onClick={onSave}
          disabled={!matchValue || !newValue}
          className={`ga4-btn-primary${saveRing}`}
        >
          만들기
        </button>
      </footer>
    </aside>
  );
}
