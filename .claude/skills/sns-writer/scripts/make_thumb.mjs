#!/usr/bin/env node
/**
 * 링크드인과 쓰레드용 단일 썸네일 생성기. 카드뉴스(1080x1350)와 규격이 달라
 * 따로 둔다. 실사 배경 + 어두운 오버레이 + 흰 글자로, 카드뉴스와 같은 톤을 쓴다.
 *
 * 사용법:
 *   node make_thumb.mjs linkedin  <photo.jpg> <출력.png> "킥커" "제목" "부제"
 *   node make_thumb.mjs threads   <photo.jpg> <출력.png> "킥커" "제목" "부제"
 *
 * 규격
 *   linkedin 1200x627  (링크 미리보기와 단일 이미지 공용)
 *   threads  1080x1350 (피드에서 세로가 더 크게 잡힌다)
 *
 * 디자인 지침 (2026-08-24 사용자 레퍼런스)
 *   - 글자를 크게 쓴다. 작은 글자 고집이 가장 흔한 실수다
 *   - 한 문단으로 읽히는 글은 한 정렬로 맞춘다
 *   - 글 덩어리는 아래쪽에 놓고 위는 사진에 내준다
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { Resvg } from "@resvg/resvg-js";
import sharp from "sharp";

const SPEC = { linkedin: { W: 1200, H: 627 }, threads: { W: 1080, H: 1350 } };
const FONT_DIR = join(process.cwd(), "node_modules/pretendard/dist/public/static");
const FONTS = ["Pretendard-ExtraBold.otf", "Pretendard-Bold.otf", "Pretendard-Medium.otf"]
  .map((f) => join(FONT_DIR, f));

const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function wrap(text, per) {
  const out = [];
  for (const para of String(text || "").split("\n")) {
    let line = "";
    for (const w of para.split(" ")) {
      if ((line + " " + w).trim().length > per) { out.push(line.trim()); line = w; }
      else line = (line + " " + w).trim();
    }
    out.push(line.trim());
  }
  return out.filter(Boolean);
}

async function bg(photo, W, H, darkness) {
  const jpg = await sharp(photo).resize(W, H, { fit: "cover", position: "attention" })
    .jpeg({ quality: 88 }).toBuffer();
  return `<image href="data:image/jpeg;base64,${jpg.toString("base64")}" x="0" y="0" width="${W}" height="${H}" preserveAspectRatio="xMidYMid slice"/>
  <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#000" stop-opacity="${Math.max(0, darkness - 0.3)}"/>
    <stop offset="0.5" stop-color="#000" stop-opacity="${darkness}"/>
    <stop offset="1" stop-color="#000" stop-opacity="${Math.min(0.94, darkness + 0.2)}"/>
  </linearGradient>
  <rect x="0" y="0" width="${W}" height="${H}" fill="url(#g)"/>`;
}

const [kind, photo, out, kicker, title, sub] = process.argv.slice(2);
if (!SPEC[kind] || !photo || !out) {
  console.error('사용법: make_thumb.mjs <linkedin|threads> <photo.jpg> <출력.png> "킥커" "제목" "부제"');
  process.exit(2);
}
const { W, H } = SPEC[kind];
const wide = kind === "linkedin";
const pad = wide ? 72 : 80;
const tSize = wide ? 76 : 92;
const tLH = Math.round(tSize * 1.24);
const sSize = wide ? 34 : 48;
const titleLines = wrap(title, wide ? 18 : 13);
const subLines = wrap(sub || "", wide ? 40 : 26);
const blockH = titleLines.length * tLH + (subLines.length ? 44 + subLines.length * Math.round(sSize * 1.5) : 0);
const titleTop = H - (wide ? 78 : 150) - blockH + tSize;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
${await bg(photo, W, H, wide ? 0.66 : 0.74)}
<rect x="${pad - 8}" y="${wide ? 56 : 100}" width="${Math.max(150, esc(kicker).length * 26 + 56)}" height="${wide ? 62 : 82}" fill="#FF0000"/>
<text x="${pad + 16}" y="${wide ? 100 : 158}" font-family="Pretendard" font-weight="800" font-size="${wide ? 32 : 40}" fill="#fff">${esc(kicker || "")}</text>
<text font-family="Pretendard" font-weight="800" font-size="${tSize}" fill="#fff">
  ${titleLines.map((l, i) => `<tspan x="${pad}" y="${titleTop + i * tLH}">${esc(l)}</tspan>`).join("")}
</text>
<rect x="${pad}" y="${titleTop + titleLines.length * tLH - tSize + 26}" width="180" height="12" fill="#FFD700"/>
<text font-family="Pretendard" font-weight="500" font-size="${sSize}" fill="#eee">
  ${subLines.map((l, i) => `<tspan x="${pad}" y="${titleTop + titleLines.length * tLH + 76 + i * Math.round(sSize * 1.5)}">${esc(l)}</tspan>`).join("")}
</text>
<text x="${W - pad}" y="${H - (wide ? 34 : 56)}" text-anchor="end" font-family="Pretendard" font-weight="500" font-size="${wide ? 26 : 30}" fill="#ccc">digitalmarketer.co.kr</text>
</svg>`;

const png = new Resvg(svg, { font: { fontFiles: FONTS, loadSystemFonts: false }, fitTo: { mode: "width", value: W } })
  .render().asPng();
writeFileSync(out, png);
console.log(`${out}  ${W}x${H}  ${(png.length / 1024).toFixed(0)}KB`);
