#!/usr/bin/env node
/**
 * 카드뉴스와 썸네일 공용 레이아웃. 모든 글자는 여기를 거쳐야 한다.
 *
 * 규칙 하나: 글자 폭을 재지 않고 그리지 않는다.
 * 글자 수로 줄바꿈하면 한글과 영문이 섞일 때 실제 폭이 두 배까지 벌어져
 * 상자를 넘는다 (2026-08-24 마지막 카드 URL 넘침).
 *
 * fit()은 주어진 가로세로 안에 들어갈 때까지 글자를 줄인다.
 * pill()은 글자를 재서 상자를 그린다. 상자가 먼저 있고 글자를 넣는 게 아니다.
 * assertInside()는 그린 것이 안전 영역을 넘었는지 마지막에 확인한다.
 */
import { loadFont } from "./fontmetrics.mjs";
import { join } from "node:path";

const DIR = join(process.cwd(), "node_modules/pretendard/dist/public/static");
const FACE = {
  800: "Pretendard-ExtraBold.otf",
  700: "Pretendard-Bold.otf",
  600: "Pretendard-SemiBold.otf",
  500: "Pretendard-Medium.otf",
  400: "Pretendard-Regular.otf",
};

export const FONT_FILES = [...new Set(Object.values(FACE))].map((f) => join(DIR, f));

export const esc = (s) =>
  String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const face = (weight) => loadFont(join(DIR, FACE[weight] || FACE[700]));

/** 문자열이 size px일 때 실제 가로 폭 */
export const width = (text, size, weight = 700) => face(weight).measure(text, size);

/** 폭 기준 줄바꿈. \n은 강제 줄바꿈. 한 낱말이 폭을 넘으면 낱말 안에서 자른다. */
export function wrap(text, size, maxW, weight = 700) {
  const out = [];
  for (const para of String(text ?? "").split("\n")) {
    let line = "";
    for (const word of para.split(/\s+/).filter(Boolean)) {
      const cand = line ? `${line} ${word}` : word;
      if (width(cand, size, weight) <= maxW) { line = cand; continue; }
      if (line) out.push(line);
      // 낱말 하나가 통째로 넘치면 글자 단위로 쪼갠다 (긴 URL 같은 경우)
      if (width(word, size, weight) > maxW) {
        let cur = "";
        for (const ch of word) {
          if (width(cur + ch, size, weight) > maxW && cur) { out.push(cur); cur = ch; }
          else cur += ch;
        }
        line = cur;
      } else line = word;
    }
    out.push(line);
  }
  return out.filter((l) => l !== "" || out.length === 1);
}

/**
 * maxW x maxH 안에 들어가는 가장 큰 글자 크기를 찾는다.
 * sizes는 큰 것부터. 다 안 맞으면 마지막(가장 작은) 값으로 그린다.
 */
export function fit(text, { maxW, maxH = Infinity, sizes, weight = 700, lineRatio = 1.3, maxLines = Infinity }) {
  let last = null;
  for (const size of sizes) {
    const lines = wrap(text, size, maxW, weight);
    const lineH = Math.round(size * lineRatio);
    const height = lines.length * lineH;
    last = { size, lines, lineH, height, weight };
    if (height <= maxH && lines.length <= maxLines) return last;
  }
  return last;
}

/** 줄 배열을 tspan으로. y는 첫 줄 baseline. */
export function tspans(fitted, x, baseline) {
  return fitted.lines
    .map((l, i) => `<tspan x="${x}" y="${baseline + i * fitted.lineH}">${esc(l)}</tspan>`)
    .join("");
}

export function textBlock(fitted, x, baseline, fill) {
  return `<text font-family="Pretendard" font-weight="${fitted.weight}" font-size="${fitted.size}" fill="${fill}">${tspans(fitted, x, baseline)}</text>`;
}

/**
 * 글자를 재서 그 폭에 맞춘 색 상자 + 글자. Neo-Brutalism 하드 섀도 포함.
 * 반환값의 w/h로 다음 요소 위치를 잡는다.
 */
export function pill(text, { x, y, size, weight = 800, fill = "#FF0000", color = "#fff", padX = 28, padY = 20, shadow = 10, stroke = "#000", maxW = Infinity }) {
  let s = size;
  while (s > 12 && width(text, s, weight) + padX * 2 > maxW) s -= 2;
  const w = Math.ceil(width(text, s, weight) + padX * 2);
  const h = Math.ceil(s * 1.05 + padY * 2);
  const baseline = y + padY + Math.round(s * 0.82);
  const svg = `${shadow ? `<rect x="${x + shadow}" y="${y + shadow}" width="${w}" height="${h}" fill="#000"/>` : ""}
  <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"${stroke ? ` stroke="${stroke}" stroke-width="5"` : ""}/>
  <text x="${x + padX}" y="${baseline}" font-family="Pretendard" font-weight="${weight}" font-size="${s}" fill="${color}">${esc(text)}</text>`;
  return { svg, w, h, size: s };
}

/**
 * 그린 것이 안전 영역을 넘지 않았는지 확인한다. 넘으면 렌더를 멈춘다.
 * 조용히 넘친 그림이 SNS에 올라가는 것보다 빌드가 죽는 게 낫다.
 */
export function assertInside(boxes, { W, H, pad, label }) {
  const bad = boxes.filter((b) => b.x < pad - 1 || b.y < pad - 1 || b.x + b.w > W - pad + 1 || b.y + b.h > H - pad + 1);
  if (bad.length) {
    const lines = bad.map((b) => `  - ${b.name}: x=${Math.round(b.x)} y=${Math.round(b.y)} w=${Math.round(b.w)} h=${Math.round(b.h)} (안전영역 ${pad}~${W - pad} x ${pad}~${H - pad})`);
    throw new Error(`[${label}] 요소가 안전 영역을 넘었습니다:\n${lines.join("\n")}`);
  }
}
