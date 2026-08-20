"use client";

/**
 * 관리 화면의 선택형 설정.
 *
 * 보고 ID처럼 여러 방식 가운데 하나를 고르는 화면이 GA4에 있다. 카드를 세로로 늘어놓고
 * 고른 것에 표시를 남기며, 그 선택이 숫자에 어떻게 나타나는지 아래 요약에 함께 보여 준다.
 */

import { Check } from "lucide-react";
import { useRing } from "./tour";

export interface ChoiceOption {
  key: string;
  title: string;
  desc: string;
  /** 이 방식으로 볼 때의 값. 선택에 따라 숫자가 달라지는 것을 보여 준다 */
  summary: string;
}

interface Ga4ChoiceAdminProps {
  title: string;
  description: string;
  options: ChoiceOption[];
  picked: string;
  onPick: (key: string) => void;
  /** 요약 줄에 붙는 이름. 예: "지난 28일 총 사용자" */
  summaryLabel: string;
}

export function Ga4ChoiceAdmin({
  title,
  description,
  options,
  picked,
  onPick,
  summaryLabel,
}: Ga4ChoiceAdminProps) {
  const current = options.find((o) => o.key === picked);

  return (
    <section className="ga4-admin-page">
      <header className="ga4-admin-head">
        <div>
          <h2 className="ga4-admin-title">{title}</h2>
          <p className="ga4-rule-desc">{description}</p>
        </div>
      </header>

      <div className="ga4-choice-list">
        {options.map((o) => (
          <ChoiceCard
            key={o.key}
            option={o}
            picked={picked === o.key}
            onPick={() => onPick(o.key)}
          />
        ))}
      </div>

      {current && (
        <div className="ga4-choice-summary">
          <p className="ga4-ff-field-label">{summaryLabel}</p>
          <p className="ga4-choice-summary-value">{current.summary}</p>
        </div>
      )}
    </section>
  );
}

function ChoiceCard({
  option,
  picked,
  onPick,
}: {
  option: ChoiceOption;
  picked: boolean;
  onPick: () => void;
}) {
  const ring = useRing(`choice:${option.key}`);
  return (
    <button
      type="button"
      data-tour={`choice:${option.key}`}
      onClick={onPick}
      className={`ga4-choice-card${picked ? " ga4-choice-card-on" : ""}${ring}`}
      aria-pressed={picked}
    >
      <span className="ga4-choice-mark" aria-hidden>
        {picked && <Check className="w-3.5 h-3.5" strokeWidth={2.4} />}
      </span>
      <span className="ga4-choice-body">
        <span className="ga4-choice-title">{option.title}</span>
        <span className="ga4-choice-desc">{option.desc}</span>
      </span>
    </button>
  );
}
