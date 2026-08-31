/**
 * GA4 카드 우상단의 분당 추이 막대.
 * 값이 모두 0이면 GA4처럼 바닥선만 남긴다.
 */
export function Sparkline({ values }: { values: number[] }) {
  const max = Math.max(...values, 1);

  return (
    <div className="ga4-spark" aria-hidden="true">
      {values.map((value, index) => (
        <div
          key={index}
          className="ga4-spark-bar"
          style={{ height: `${(value / max) * 100}%` }}
        />
      ))}
    </div>
  );
}
