import { Info } from "lucide-react";

interface UnavailableCardProps {
  /** GA4 화면에 있는 카드 이름 그대로 적는다 */
  dimensionLabel: string;
  metricLabel: string;
  /** GA4 UI에는 있으나 실시간 API에는 없는 항목 이름 */
  missingField: string;
  /** 왜 못 만드는지, 대신 무엇을 보면 되는지 */
  note: string;
}

/**
 * GA4 화면에는 있지만 실시간 API로는 만들 수 없는 카드.
 * 교육 페이지라 빈칸으로 두지 않고 이유를 적어 둔다.
 */
export function UnavailableCard({
  dimensionLabel,
  metricLabel,
  missingField,
  note,
}: UnavailableCardProps) {
  return (
    <div className="ga4-card ga4-card-unavailable">
      <div className="ga4-card-title">
        <span>{dimensionLabel}별</span>
        <span className="ga4-dotted">{metricLabel}</span>
      </div>

      <div className="ga4-rank">#1 -</div>
      <div className="ga4-big mt-1">-</div>

      <div className="ga4-table-head">
        <span>{dimensionLabel}</span>
        <span>{metricLabel}</span>
      </div>

      <div className="flex items-start gap-2 mt-4">
        <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-[color:var(--ga4-amber-deep)]" />
        <p className="ga4-empty !mt-0">{note}</p>
      </div>

      <div className="ga4-api-badge">
        <span>
          실시간 미지원 <code>{missingField}</code>
        </span>
      </div>

      <div className="ga4-card-foot">
        <span>0개 중 0~0번째</span>
      </div>
    </div>
  );
}
