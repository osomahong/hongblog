/**
 * Google Analytics 로고 형태의 막대 세 개.
 * 색을 그대로 쓰는 컬러판과, 버튼 위에 얹을 단색판을 함께 둔다.
 */
interface Ga4LogoProps {
  className?: string;
  /** true면 로고 색 대신 현재 글자색을 따른다 (컬러 배경 위에 올릴 때) */
  monochrome?: boolean;
}

export function Ga4Logo({ className, monochrome = false }: Ga4LogoProps) {
  const bright = monochrome ? "currentColor" : "#F9AB00";
  const deep = monochrome ? "currentColor" : "#E37400";

  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="16" y="2" width="6" height="20" rx="3" fill={bright} />
      <rect x="9" y="8" width="6" height="14" rx="3" fill={deep} opacity={monochrome ? 0.85 : 1} />
      <circle cx="5" cy="19" r="3" fill={deep} opacity={monochrome ? 0.7 : 1} />
    </svg>
  );
}
