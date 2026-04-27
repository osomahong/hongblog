/**
 * SVG 템플릿 빌더 — 전체 og:image SVG 조합
 */

import { getTitleStyle, wrapTitle, escapeXml } from "./og-text.js";
import {
  CATEGORY_STYLES,
  getDecoration,
  cornerDecorations,
  gridPattern,
  defaultPageFrame,
} from "./og-decorations.js";

type Category = "MARKETING" | "AI_TECH" | "DATA" | "CLAUDE_EDUCATION";

export interface OgTemplateOptions {
  title: string;
  category: Category;
  tags?: readonly string[];
}

/** 비콘텐츠 페이지용 기본 og:image (홈, 목록, 태그, 소개 등) */
export function buildDefaultSvg(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#F3F3F3"/>
  ${defaultPageFrame()}

  <!-- 외곽 테두리 -->
  <rect x="4" y="4" width="1192" height="622" fill="none" stroke="#000" stroke-width="8"/>

  <!-- 블로그 이름 (중앙, 큰 사이즈) -->
  <text x="600" y="240" font-family="Pretendard" font-weight="900" font-size="80"
    fill="#000" text-anchor="middle">준이아빠블로그</text>

  <!-- 서브타이틀 배지 -->
  <rect x="390" y="270" width="420" height="50" fill="#FFD700" stroke="#000" stroke-width="3"/>
  <text x="600" y="304" font-family="Pretendard" font-weight="700" font-size="26"
    fill="#000" text-anchor="middle">AI-ENHANCED TECH WIKI</text>

  <!-- 구분선 -->
  <rect x="480" y="345" width="240" height="4" fill="#000"/>

  <!-- 카테고리 배지 3개 (중앙 정렬: 220+15+80+15+200=530, 시작=(1200-530)/2=335) -->
  <!-- MARKETING -->
  <rect x="335" y="380" width="220" height="46" fill="#FF0000" stroke="#000" stroke-width="3"/>
  <text x="445" y="411" font-family="Pretendard" font-weight="700" font-size="20"
    fill="#FFF" text-anchor="middle">DIGITAL MARKETING</text>
  <!-- AI_TECH -->
  <rect x="570" y="380" width="80" height="46" fill="#FFD700" stroke="#000" stroke-width="3"/>
  <text x="610" y="411" font-family="Pretendard" font-weight="700" font-size="20"
    fill="#000" text-anchor="middle">AI</text>
  <!-- DATA -->
  <rect x="665" y="380" width="200" height="46" fill="#0000FF" stroke="#000" stroke-width="3"/>
  <text x="765" y="411" font-family="Pretendard" font-weight="700" font-size="20"
    fill="#FFF" text-anchor="middle">DATA ANALYTICS</text>

  <!-- 블로그명 하단 -->
  <text x="600" y="480" font-family="Pretendard" font-weight="500" font-size="22"
    fill="#666" text-anchor="middle">디지털 마케팅 · AI · 데이터 분석 인사이트</text>
</svg>`;
}

function badgeWidth(label: string): number {
  // Approximate: each Korean char ~20px at 22px font + 32px padding
  return label.length * 20 + 32;
}

export function buildSvg(opts: OgTemplateOptions): string {
  const { title, category, tags = [] } = opts;
  const style = CATEGORY_STYLES[category];
  const { fontSize, lineHeight, maxLines } = getTitleStyle(title);
  const lines = wrapTitle(title, fontSize, 760, maxLines);

  // 고정 위치: 배지 y=100, 제목 시작 y=200 (줄 수와 무관)
  const badgeY = 100;
  const titleY = 200;

  const titleTspans = lines
    .map(
      (line, i) =>
        `<tspan x="80" dy="${i === 0 ? 0 : lineHeight}">${escapeXml(line)}</tspan>`,
    )
    .join("\n      ");

  // 제목 하단 → 구분선 → 블로그명 (간격 동일: 40px씩)
  const titleBottomY = titleY + (lines.length - 1) * lineHeight + 20;
  const gap = 40;
  const dividerY = Math.min(titleBottomY + gap, 520);
  const blogNameY = dividerY + gap + 20; // +20 baseline 보정

  const bw = badgeWidth(style.label);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <!-- Background -->
  <rect width="1200" height="630" fill="#F3F3F3"/>
  ${gridPattern()}
  ${cornerDecorations(style.accent)}

  <!-- Border (8px inset) -->
  <rect x="4" y="4" width="1192" height="622" fill="none" stroke="#000" stroke-width="8"/>

  <!-- Category badge -->
  <rect x="80" y="${badgeY}" width="${bw}" height="44" fill="${style.accent}"/>
  <rect x="80" y="${badgeY}" width="${bw}" height="44" fill="none" stroke="#000" stroke-width="3"/>
  <text x="${80 + 16}" y="${badgeY + 30}" font-family="Pretendard" font-weight="700" font-size="22" fill="${style.badgeText}">
    ${escapeXml(style.label)}
  </text>

  <!-- Title -->
  <text x="80" y="${titleY}" font-family="Pretendard" font-weight="800" font-size="${fontSize}" fill="#000">
    ${titleTspans}
  </text>

  <!-- Divider -->
  <rect x="80" y="${dividerY}" width="120" height="4" fill="#000"/>

  <!-- Blog name -->
  <text x="80" y="${blogNameY}" font-family="Pretendard" font-weight="700" font-size="29" fill="#666666">
    준이아빠블로그
  </text>

  <!-- Decorative elements (right) -->
  <g>
    ${getDecoration(title, tags, category)}
  </g>
</svg>`;
}
