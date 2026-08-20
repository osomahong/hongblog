"use client";

/**
 * 세그먼트 만들기 패널.
 *
 * GA4는 세그먼트 더하기를 누르면 먼저 범위를 고르게 한다. 사용자, 세션, 이벤트 세 가지이고,
 * 무엇을 고르느냐에 따라 같은 조건이라도 표에 남는 숫자가 달라진다.
 * 이 화면은 그 첫 단계와 조건 요약까지만 그린다. 조건 편집기는 이 편의 범위 밖이다.
 */

import { X, User, Layers, MousePointerClick, Check } from "lucide-react";
import { useRing } from "./tour";

export type SegmentScope = "user" | "session" | "event";

interface ScopeOption {
  key: SegmentScope;
  title: string;
  desc: string;
  icon: typeof User;
}

const SCOPES: ScopeOption[] = [
  {
    key: "user",
    title: "사용자 세그먼트",
    desc: "조건을 한 번이라도 만족한 사용자와 그 사용자의 모든 세션을 남깁니다.",
    icon: User,
  },
  {
    key: "session",
    title: "세션 세그먼트",
    desc: "조건을 만족한 세션만 남깁니다. 같은 사람의 다른 세션은 빠집니다.",
    icon: Layers,
  },
  {
    key: "event",
    title: "이벤트 세그먼트",
    desc: "조건을 만족한 이벤트만 남깁니다. 범위가 가장 좁습니다.",
    icon: MousePointerClick,
  },
];

interface Ga4SegmentBuilderProps {
  /** 지금 고른 범위. 만들기를 눌러야 목록에 올라간다 */
  scope: SegmentScope | null;
  /** 이 편에서 쓰는 조건. 화면에는 요약만 적는다 */
  conditionLabel: string;
  /** 이미 만들어 둔 세그먼트 이름. 같은 범위를 두 번 만들지 않게 표시한다 */
  made: string[];
  nameOf: (scope: SegmentScope) => string;
  onPickScope: (scope: SegmentScope) => void;
  onCreate: () => void;
  onClose: () => void;
}

export function Ga4SegmentBuilder({
  scope,
  conditionLabel,
  made,
  nameOf,
  onPickScope,
  onCreate,
  onClose,
}: Ga4SegmentBuilderProps) {
  const createRing = useRing("segment-create");

  return (
    <div className="ga4-seg-panel" role="dialog" aria-label="세그먼트 만들기">
      <header className="ga4-seg-head">
        <span>세그먼트 만들기</span>
        <span className="ga4-seg-head-actions">
          <button
            type="button"
            data-tour="segment-create"
            onClick={onCreate}
            disabled={!scope}
            className={`ga4-btn-primary ga4-seg-create${createRing}`}
          >
            만들기
          </button>
          <button type="button" aria-label="닫기" onClick={onClose}>
            <X className="w-4 h-4" strokeWidth={2} aria-hidden />
          </button>
        </span>
      </header>

      <p className="ga4-seg-lead">
        범위를 고르면 같은 조건이라도 표에 남는 숫자가 달라집니다.
      </p>

      <div className="ga4-seg-scopes">
        {SCOPES.map((s) => (
          <ScopeCard
            key={s.key}
            option={s}
            picked={scope === s.key}
            already={made.includes(nameOf(s.key))}
            onPick={() => onPickScope(s.key)}
          />
        ))}
      </div>

      <div className="ga4-seg-condition">
        <p className="ga4-ff-field-label">조건</p>
        <p className="ga4-seg-condition-value">{conditionLabel}</p>
      </div>

    </div>
  );
}

function ScopeCard({
  option,
  picked,
  already,
  onPick,
}: {
  option: ScopeOption;
  picked: boolean;
  already: boolean;
  onPick: () => void;
}) {
  const ring = useRing(`segment-scope:${option.key}`);
  const Icon = option.icon;
  return (
    <button
      type="button"
      data-tour={`segment-scope:${option.key}`}
      onClick={onPick}
      disabled={already}
      className={`ga4-seg-card${picked ? " ga4-seg-card-on" : ""}${ring}`}
    >
      <span className="ga4-seg-card-icon" aria-hidden>
        <Icon className="w-4 h-4" strokeWidth={1.8} />
      </span>
      <span className="ga4-seg-card-title">
        {option.title}
        {already && <Check className="w-3.5 h-3.5" strokeWidth={2} aria-hidden />}
      </span>
      <span className="ga4-seg-card-desc">{option.desc}</span>
    </button>
  );
}
